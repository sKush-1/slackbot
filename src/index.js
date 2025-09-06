import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import crypto from "crypto";
import { WebClient } from "@slack/web-api";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

dotenv.config();
const prisma = new PrismaClient();

const app = express();
const port = process.env.PORT || 3000;
const slackClient = new WebClient(process.env.SLACK_BOT_TOKEN);
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

app.use(bodyParser.json({
    verify: (req, res, buf) => { req.rawBody = buf.toString(); }
}));

function verifySlack(req) {
    const timestamp = req.headers["x-slack-request-timestamp"];
    const sigBase = `v0:${timestamp}:${req.rawBody}`;
    const mySig = "v0=" + crypto.createHmac("sha256", process.env.SLACK_SIGNING_SECRET).update(sigBase).digest("hex");
    const slackSig = req.headers["x-slack-signature"];
    return crypto.timingSafeEqual(Buffer.from(mySig), Buffer.from(slackSig));
}

app.post("/slack/events", async (req, res) => {
    console.log("incoming events")
    if (!verifySlack(req)) return res.status(400).send("Invalid signature");

    const { type, event } = req.body;

    if (type === "url_verification") return res.send(req.body.challenge);

    if (event && event.type === "app_mention") {
        const channel = event.channel;
        const rootTs = event.thread_ts || event.ts;
        const text = event.text.replace(/<@\w+>\s*/, "").trim();

        await prisma.message.create({
            data: { channel, rootTs, ts: event.ts, role: "user", user: event.user, text }
        });

        const history = await prisma.message.findMany({
            where: { channel, rootTs },
            orderBy: { createdAt: "desc" },
            take: 5
        });
        const context = history.reverse().map(m => ({
            role: m.role === "assistant" ? "assistant" : "user",
            content: m.text
        }));

        const contextText = context.map(msg => `${msg.role}: ${msg.content}`).join('\n');
        const prompt = `You are Warpi, a helpful Slack bot for Warpfy. Keep responses short.

Previous conversation:
${contextText}

User: ${text}`;

        const result = await model.generateContent(prompt);
        const reply = result.response.text();

        const post = await slackClient.chat.postMessage({
            channel,
            thread_ts: rootTs,
            text: reply
        });

        await prisma.message.create({
            data: { channel, rootTs, ts: post.ts, role: "assistant", user: "bot", text: reply }
        });
    }

    res.sendStatus(200);
});

app.get("/slack/oauth_redirect", async (req, res) => {
    const { code } = req.query;
  
    if (!code) {
      return res.status(400).send("Missing code from Slack");
    }
  
    try {
      const response = await axios.post("https://slack.com/api/oauth.v2.access", null, {
        params: {
          code,
          client_id: process.env.SLACK_CLIENT_ID,
          client_secret: process.env.SLACK_CLIENT_SECRET,
          redirect_uri: "https://slackbot-production-7e2d.up.railway.app/slack/oauth_redirect",
        },
      });
  
      if (!response.data.ok) {
        return res.status(400).json(response.data);
      }
  
      // Save the bot token in your DB for later use
      console.log("Access token:", response.data.access_token);
  
      res.send("✅ App installed successfully! You can now use the bot in your workspace.");
    } catch (err) {
      console.error("OAuth error:", err);
      res.status(500).send("OAuth failed");
    }
  });

app.listen(port, () => console.log(`⚡ Warpi running on http://localhost:${port}`));
