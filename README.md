# Warpi - AI-Powered Slack Bot

Warpi is an intelligent Slack bot powered by Google Gemini AI that provides helpful responses in your Slack workspace. It supports multi-workspace installations and maintains conversation context for natural interactions.

## Features

- 🤖 **AI-Powered Responses**: Uses Google Gemini 1.5 Flash for intelligent conversations
- 💬 **Context Awareness**: Remembers conversation history within threads
- 🏢 **Multi-Workspace Support**: Can be installed in multiple Slack workspaces
- 📱 **Direct Messages**: Responds to both channel mentions and direct messages
- 🗄️ **Persistent Storage**: Stores conversation history in PostgreSQL database
- 🔒 **Secure**: Verifies Slack request signatures for security

## Quick Installation

**Install Warpi in your Slack workspace:**

[**🚀 Add to Slack**](https://slack.com/oauth/v2/authorize?client_id=9328834433890.9494096978736&scope=app_mentions:read,channels:history,chat:write,chat:write.public,groups:history,im:history,im:write&redirect_uri=https://slackbot-production-7e2d.up.railway.app/slack/oauth_redirect)

After installation, simply mention `@Warpi` in any channel or send a direct message to start chatting!

## Usage

### In Channels
```
@Warpi What's the weather like today?
@Warpi Can you help me with JavaScript promises?
```

### Direct Messages
Just send a message directly to Warpi - no need to mention the bot name.

## Development Setup

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- Google AI API key
- Slack app credentials
- ngrok (for local development)

### Environment Variables

Create a `.env` file with the following variables:

```env
# Slack Configuration
SLACK_SIGNING_SECRET=your-slack-signing-secret
SLACK_BOT_TOKEN=xoxb-your-bot-token
SLACK_CLIENT_ID=your-slack-client-id
SLACK_CLIENT_SECRET=your-slack-client-secret
SLACK_REDIRECT_URI=https://your-domain.com/slack/oauth_redirect

# Google AI
GOOGLE_API_KEY=your-google-ai-api-key

# Database
DATABASE_URL=postgresql://username:password@host:port/database

# Server
PORT=3000
```

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd slackbot
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up the database**
   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Expose local server with ngrok**
   ```bash
   ngrok http 3000
   ```

## Slack App Configuration

### 1. Create a Slack App

1. Go to [Slack API](https://api.slack.com/apps)
2. Click "Create New App" → "From scratch"
3. Name your app "Warpi" and select your workspace

### 2. Configure OAuth & Permissions

Add these **Bot Token Scopes**:
- `app_mentions:read` - View messages that directly mention @your_bot
- `channels:history` - View messages in public channels
- `chat:write` - Send messages as the bot
- `chat:write.public` - Send messages to channels the bot isn't a member of
- `groups:history` - View messages in private channels
- `im:history` - View messages in direct messages
- `im:write` - Start direct messages with people

### 3. Event Subscriptions

1. Enable Events: **On**
2. Request URL: `https://your-domain.com/slack/events`
3. Subscribe to bot events:
   - `app_mention`
   - `message.im`

### 4. OAuth & Permissions

Set **Redirect URLs**:
```
https://your-domain.com/slack/oauth_redirect
```

## Database Schema

The bot uses PostgreSQL with Prisma ORM. Here's the schema:

```prisma
model Message {
  id        Int      @id @default(autoincrement())
  channel   String
  rootTs    String
  ts        String
  role      String   // "user" | "assistant"
  user      String?
  text      String
  teamId    String   // Workspace identifier
  createdAt DateTime @default(now())
}

model WorkspaceToken {
  id       Int    @id @default(autoincrement())
  teamId   String @unique
  botToken String
}
```

## Deployment

### Railway Deployment

1. **Connect to Railway**
   ```bash
   npm install -g @railway/cli
   railway login
   railway init
   ```

2. **Set environment variables**
   ```bash
   railway variables set GOOGLE_API_KEY=your-key
   railway variables set SLACK_SIGNING_SECRET=your-secret
   # ... add all other variables
   ```

3. **Deploy**
   ```bash
   railway up
   ```

4. **Run database migrations**
   ```bash
   railway run npx prisma migrate deploy
   ```

### Other Deployment Options

- **Heroku**: Use the Heroku CLI and set environment variables
- **Vercel**: Deploy as serverless functions
- **DigitalOcean**: Use App Platform or Droplets
- **AWS**: Deploy on EC2, ECS, or Lambda

## Local Development with ngrok

1. **Install ngrok**
   ```bash
   npm install -g ngrok
   ```

2. **Start your local server**
   ```bash
   npm start
   ```

3. **Expose with ngrok**
   ```bash
   ngrok http 3000
   ```

4. **Update Slack app URLs**
   - Event Request URL: `https://your-ngrok-url.ngrok.io/slack/events`
   - OAuth Redirect URL: `https://your-ngrok-url.ngrok.io/slack/oauth_redirect`

## API Endpoints

- `POST /slack/events` - Handles Slack events (messages, mentions)
- `GET /slack/oauth_redirect` - OAuth callback for workspace installations

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Slack API     │───▶│   Warpi Bot     │───▶│  Google Gemini  │
│                 │    │                 │    │      AI         │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌─────────────────┐
                       │   PostgreSQL    │
                       │    Database     │
                       └─────────────────┘
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Troubleshooting

### Common Issues

**"No bot token found for this workspace"**
- Ensure the workspace has completed OAuth installation
- Check database connectivity
- Verify `SLACK_BOT_TOKEN` fallback is set for development

**"Invalid signature"**
- Verify `SLACK_SIGNING_SECRET` is correct
- Ensure request URL in Slack app matches your endpoint

**Database connection errors**
- Check `DATABASE_URL` format
- Ensure database is running and accessible
- Run `npx prisma migrate deploy` if needed

### Logs

The bot logs important events:
- Incoming Slack events
- OAuth installations
- API errors
- Database operations

## Security

- All Slack requests are verified using signature validation
- Bot tokens are stored securely in the database
- Environment variables should never be committed to version control

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
1. Check the troubleshooting section
2. Review Slack API documentation
3. Open an issue in the repository

---

**Made with ❤️ for Warpfy**