import express from "express";
import bodyParser from "body-parser";
import crypto from "crypto";
import { WebClient } from "@slack/web-api";
import { Configuration, OpenAI } from "openai";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

dotenv.config();
const prisma = new PrismaClient();

const app = express();
const port = process.env.PORT || 3000;
const slackClient = new WebClient(process.env.SLACK_BOT_TOKEN);
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Slack needs raw body for signature verification
app.use(bodyParser.json({
  verify: (req, res, buf) => { req.rawBody = buf.toString(); }
}));

// Verify Slack requests
function verifySlack(req) {
  const timestamp = req.headers["x-slack-request-timestamp"];
  const sigBase = `v0:${timestamp}:${req.rawBody}`;
  const mySig = "v0=" + crypto.createHmac("sha256", process.env.SLACK_SIGNING_SECRET).update(sigBase).digest("hex");
  const slackSig = req.headers["x-slack-signature"];
  return crypto.timingSafeEqual(Buffer.from(mySig), Buffer.from(slackSig));
}

// Slack Events endpoint
app.post("/slack/events", async (req, res) => {
  if (!verifySlack(req)) return res.status(400).send("Invalid signature");

  const { type, event } = req.body;

  // Slack "challenge" check
  if (type === "url_verification") return res.send(req.body.challenge);

  if (event && event.type === "app_mention") {
    const channel = event.channel;
    const rootTs = event.thread_ts || event.ts;
    const text = event.text.replace(/<@\w+>\s*/, "").trim();

    // Save user message
    await prisma.message.create({
      data: { channel, rootTs, ts: event.ts, role: "user", user: event.user, text }
    });

    // Get last 5 messages for context
    const history = await prisma.message.findMany({
      where: { channel, rootTs },
      orderBy: { createdAt: "desc" },
      take: 5
    });
    const context = history.reverse().map(m => ({
      role: m.role === "assistant" ? "assistant" : "user",
      content: m.text
    }));

    // Call OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are Warpi, a helpful Slack bot for Warpfy. Keep responses short." },
        ...context,
        { role: "user", content: text }
      ]
    });
    const reply = completion.choices[0].message.content;

    // Send reply in thread
    const post = await slackClient.chat.postMessage({
      channel,
      thread_ts: rootTs,
      text: reply
    });

    // Save assistant reply
    await prisma.message.create({
      data: { channel, rootTs, ts: post.ts, role: "assistant", user: "bot", text: reply }
    });
  }

  res.sendStatus(200);
});

app.listen(port, () => console.log(`⚡ Warpi running on http://localhost:${port}`));
