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

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **PostgreSQL database** - [Supabase](https://supabase.com/) (recommended) or local PostgreSQL
- **Google AI API key** - [Google AI Studio](https://aistudio.google.com/)
- **Slack app credentials** - [Slack API](https://api.slack.com/apps)
- **ngrok** (for local development) - [Download](https://ngrok.com/)

## Google AI Setup

1. **Get Google AI API Key**
   - Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
   - Click "Create API Key"
   - Select your Google Cloud project (or create one)
   - Copy the API key → `GOOGLE_API_KEY`

2. **Enable Required APIs** (if using Google Cloud Console)
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Enable "Generative Language API"

## Database Setup Options

### Option 1: Supabase (Recommended for beginners)

1. Go to [Supabase](https://supabase.com/)
2. Create a new project
3. Go to **Settings** → **Database**
4. Copy the connection string → `DATABASE_URL`
5. Format: `postgresql://postgres:[password]@[host]:5432/postgres`

### Option 2: Railway PostgreSQL

1. Go to [Railway](https://railway.app/)
2. Create new project → Add PostgreSQL
3. Copy the connection string from variables

### Option 3: Local PostgreSQL

1. Install PostgreSQL locally
2. Create a database: `createdb warpi_bot`
3. Connection string: `postgresql://username:password@localhost:5432/warpi_bot`

### Environment Variables

Create a `.env` file with the following variables:

```env
# Slack Configuration
SLACK_SIGNING_SECRET=your-slack-signing-secret-from-slack-app
SLACK_BOT_TOKEN=xoxb-your-bot-token-from-slack-app
SLACK_CLIENT_ID=your-slack-client-id-from-slack-app
SLACK_CLIENT_SECRET=your-slack-client-secret-from-slack-app
SLACK_REDIRECT_URI=https://slackbot-production-7e2d.up.railway.app/slack/oauth_redirect

# Google Gemini AI
GOOGLE_API_KEY=your-google-ai-api-key-from-google-ai-studio

# Database (PostgreSQL)
DATABASE_URL=postgresql://username:password@host:port/database

# Server Configuration
PORT=3000
```

**Where to get these values:**

- **SLACK_SIGNING_SECRET**: Slack App → Basic Information → App Credentials → Signing Secret
- **SLACK_BOT_TOKEN**: Slack App → OAuth & Permissions → Bot User OAuth Token (starts with `xoxb-`)
- **SLACK_CLIENT_ID**: Slack App → Basic Information → App Credentials → Client ID
- **SLACK_CLIENT_SECRET**: Slack App → Basic Information → App Credentials → Client Secret
- **GOOGLE_API_KEY**: [Google AI Studio](https://aistudio.google.com/app/apikey) → Create API Key
- **DATABASE_URL**: Your PostgreSQL connection string (Supabase, Railway, etc.)

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/sKush-1/slackbot.git
   cd slackbot
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env file with your actual values
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Run database migrations
   npx prisma migrate dev --name init
   
   # Optional: View your database
   npx prisma studio
   ```

5. **Start the development server**
   ```bash
   npm start
   # or for development with auto-reload
   npm run dev
   ```

6. **Expose local server with ngrok (for Slack webhook testing)**
   ```bash
   # Install ngrok globally
   npm install -g ngrok
   
   # Expose your local server
   ngrok http 3000
   
   # Copy the https URL (e.g., https://bc74a9097d63.ngrok-free.app)
   # Use this URL in your Slack app configuration
   ```

## Slack App Configuration

### 1. Create a Slack App

1. Go to [Slack API](https://api.slack.com/apps)
2. Click "Create New App" → "From scratch"
3. Name your app "Warpi" and select your development workspace
4. Note down your **App ID** for reference

### 2. Basic Information

1. Go to **Basic Information**
2. Under **App Credentials**, copy:
   - **Client ID** → `SLACK_CLIENT_ID`
   - **Client Secret** → `SLACK_CLIENT_SECRET`
   - **Signing Secret** → `SLACK_SIGNING_SECRET`

### 3. OAuth & Permissions

1. Go to **OAuth & Permissions**
2. Under **Redirect URLs**, add:
   ```
   https://slackbot-production-7e2d.up.railway.app/slack/oauth_redirect
   ```
   For local development with ngrok:
   ```
    https://bc74a9097d63.ngrok-free.app/slack/oauth_redirect
   ```

3. Under **Scopes** → **Bot Token Scopes**, add:
   - `app_mentions:read` - View messages that directly mention @your_bot
   - `channels:history` - View messages in public channels
   - `chat:write` - Send messages as the bot
   - `chat:write.public` - Send messages to channels the bot isn't a member of
   - `groups:history` - View messages in private channels
   - `im:history` - View messages in direct messages
   - `im:write` - Start direct messages with people

4. **Install App to Workspace** and copy the **Bot User OAuth Token** → `SLACK_BOT_TOKEN`

### 4. Event Subscriptions

1. Go to **Event Subscriptions**
2. Enable Events: **On**
3. Request URL: `https://slackbot-production-7e2d.up.railway.app/slack/events`
   - For local development: ` https://bc74a9097d63.ngrok-free.app/slack/events`
   - Slack will verify this URL, make sure your server is running!

4. Under **Subscribe to bot events**, add:
   - `app_mention` - Mentions of your bot
   - `message.im` - Direct messages to your bot

5. **Save Changes**

### 5. App Home

1. Go to **App Home**
2. Under **Show Tabs**:
   - Enable **Messages Tab**
   - Enable **Allow users to send Slash commands and messages from the messages tab**

### 6. Install & Distribute

For public distribution:
1. Go to **Manage Distribution**
2. Complete all required sections
3. **Activate Public Distribution**
4. Use the generated installation URL

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

### Railway Deployment (Recommended)

1. **Create Railway Account**
   - Go to [Railway](https://railway.app/)
   - Sign up with GitHub

2. **Install Railway CLI**
   ```bash
   npm install -g @railway/cli
   railway login
   ```

3. **Initialize Project**
   ```bash
   railway init
   # Select "Empty Project"
   ```

4. **Add PostgreSQL Database**
   ```bash
   railway add postgresql
   ```

5. **Set Environment Variables**
   ```bash
   # Set all your environment variables
   railway variables set GOOGLE_API_KEY=your-google-ai-key
   railway variables set SLACK_SIGNING_SECRET=your-slack-signing-secret
   railway variables set SLACK_BOT_TOKEN=your-slack-bot-token
   railway variables set SLACK_CLIENT_ID=your-slack-client-id
   railway variables set SLACK_CLIENT_SECRET=your-slack-client-secret
   railway variables set SLACK_REDIRECT_URI=https://slackbot-production-7e2d.up.railway.app/slack/oauth_redirect
   ```

6. **Deploy**
   ```bash
   railway up
   ```

7. **Run Database Migrations**
   ```bash
   railway run npm run db:deploy
   ```

8. **Get Your Domain**
   ```bash
   railway domain
   # Copy the generated domain (e.g., slackbot-production-7e2d.up.railway.app)
   ```

9. **Update Slack App URLs**
   - Event Request URL: `https://slackbot-production-7e2d.up.railway.app/slack/events`
   - OAuth Redirect URL: `https://slackbot-production-7e2d.up.railway.app/slack/oauth_redirect`

### Heroku Deployment

1. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   heroku login
   ```

2. **Create Heroku App**
   ```bash
   heroku create slackbot
   heroku addons:create heroku-postgresql:mini
   ```

3. **Set Environment Variables**
   ```bash
   heroku config:set GOOGLE_API_KEY=your-key
   heroku config:set SLACK_SIGNING_SECRET=your-secret
   # ... set all variables
   ```

4. **Deploy**
   ```bash
   git push heroku main
   heroku run npm run db:deploy
   ```

### Vercel Deployment

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Configure vercel.json**
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "src/index.js",
         "use": "@vercel/node"
       }
     ],
     "routes": [
       {
         "src": "/(.*)",
         "dest": "src/index.js"
       }
     ]
   }
   ```

3. **Deploy**
   ```bash
   vercel --prod
   ```

### DigitalOcean App Platform

1. **Create App**
   - Go to DigitalOcean → Apps
   - Connect your GitHub repository

2. **Configure Environment Variables**
   - Add all environment variables in the app settings

3. **Add Database**
   - Add a managed PostgreSQL database
   - Update `DATABASE_URL` with the connection string

### Environment Variables Checklist

Make sure all these are set in your deployment platform:

```bash
✅ SLACK_SIGNING_SECRET
✅ SLACK_BOT_TOKEN  
✅ SLACK_CLIENT_ID
✅ SLACK_CLIENT_SECRET
✅ SLACK_REDIRECT_URI
✅ GOOGLE_API_KEY
✅ DATABASE_URL
✅ PORT (usually set automatically)
```

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
   - Event Request URL: ` https://bc74a9097d63.ngrok-free.app/slack/events`
   - OAuth Redirect URL: ` https://bc74a9097d63.ngrok-free.app/slack/oauth_redirect`

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

## Project Structure

```
slackbot/
├── src/
│   └── index.js              # Main application file
├── prisma/
│   ├── schema.prisma         # Database schema
│   └── migrations/           # Database migrations
├── .env                      # Environment variables (not in git)
├── .env.example             # Environment variables template
├── .gitignore               # Git ignore rules
├── package.json             # Node.js dependencies and scripts
├── README.md                # This file
└── railway.json             # Railway deployment config (optional)
```

## Available Scripts

```bash
# Development
npm start                    # Start the bot
npm run dev                  # Start with auto-reload (Node.js 18+)

# Database
npm run db:generate          # Generate Prisma client
npm run db:migrate          # Run database migrations (dev)
npm run db:deploy           # Deploy migrations (production)
npm run db:studio           # Open Prisma Studio (database GUI)
npm run db:reset            # Reset database (⚠️ deletes all data)
```

## API Documentation

### Webhook Endpoints

#### POST /slack/events
Handles all Slack events (messages, mentions, etc.)

**Request Headers**:
- `X-Slack-Request-Timestamp`: Request timestamp
- `X-Slack-Signature`: Request signature for verification

**Request Body**:
```json
{
  "type": "event_callback",
  "team_id": "T1234567890",
  "event": {
    "type": "app_mention",
    "channel": "C1234567890",
    "user": "U1234567890",
    "text": "@warpi Hello!",
    "ts": "1234567890.123456"
  }
}
```

#### GET /slack/oauth_redirect
Handles OAuth installation callback from Slack.

**Query Parameters**:
- `code`: OAuth authorization code from Slack
- `state`: Optional state parameter

## Security Considerations

### Request Verification
- All Slack requests are verified using HMAC-SHA256 signatures
- Requests older than 5 minutes are rejected
- Invalid signatures return 400 status

### Environment Variables
- Never commit `.env` file to version control
- Use strong, unique secrets for production
- Rotate API keys regularly

### Database Security
- Use connection pooling to prevent connection exhaustion
- Implement proper indexing for performance
- Regular backups for production data

### Rate Limiting
Consider implementing rate limiting for:
- Google AI API calls (to stay within quotas)
- Slack API calls (to respect rate limits)
- Database queries (to prevent abuse)

## Monitoring and Observability

### Health Check Endpoint
Add a health check endpoint for monitoring:

```javascript
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});
```

### Metrics to Monitor
- Response time to Slack events
- Google AI API response time
- Database query performance
- Error rates
- Active workspace count

## Contributing

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Add tests if applicable**
5. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
6. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Submit a pull request**

### Development Guidelines
- Follow existing code style
- Add comments for complex logic
- Update README for new features
- Test thoroughly before submitting

## Troubleshooting

### Common Issues

#### "No bot token found for this workspace"
**Cause**: The bot hasn't been properly installed in the workspace or database connection failed.

**Solutions**:
1. Complete OAuth installation for the workspace
2. Check database connectivity: `npm run db:studio`
3. Verify `SLACK_BOT_TOKEN` is set for development fallback
4. Check if `WorkspaceToken` table exists in database

#### "Invalid signature"
**Cause**: Slack request signature verification failed.

**Solutions**:
1. Verify `SLACK_SIGNING_SECRET` matches your Slack app
2. Ensure your server URL matches the one configured in Slack
3. Check if your server is receiving the raw request body
4. Verify timestamp isn't too old (Slack rejects old requests)

#### "Database connection errors"
**Cause**: Cannot connect to PostgreSQL database.

**Solutions**:
1. Check `DATABASE_URL` format: `postgresql://user:pass@host:port/db`
2. Ensure database server is running and accessible
3. Run migrations: `npm run db:deploy`
4. Test connection: `npm run db:studio`
5. Check firewall/network settings

#### "Google AI API errors"
**Cause**: Issues with Google Gemini API calls.

**Solutions**:
1. Verify `GOOGLE_API_KEY` is correct
2. Check API quota limits in Google Cloud Console
3. Ensure Generative Language API is enabled
4. Try a different model (e.g., `gemini-1.5-pro`)

#### "Slack events not received"
**Cause**: Slack can't reach your webhook endpoint.

**Solutions**:
1. Verify your server is publicly accessible
2. Check Event Subscriptions URL in Slack app settings
3. Ensure HTTPS (use ngrok for local development)
4. Check server logs for incoming requests
5. Test endpoint manually: `curl -X POST  https://bc74a9097d63.ngrok-free.app/slack/events`

#### "OAuth installation fails"
**Cause**: OAuth redirect or token exchange failed.

**Solutions**:
1. Check `SLACK_CLIENT_ID` and `SLACK_CLIENT_SECRET`
2. Verify `SLACK_REDIRECT_URI` matches Slack app settings
3. Ensure redirect URL is publicly accessible
4. Check server logs for OAuth errors

### Development Tips

#### Local Development Checklist
```bash
✅ ngrok tunnel running: ngrok http 3000
✅ Environment variables set in .env
✅ Database running and migrated
✅ Slack app URLs updated with ngrok URL
✅ Server running: npm start
```

#### Testing the Bot
1. **Test webhook endpoint**:
   ```bash
   curl -X POST https://slackbot-production-7e2d.up.railway.app/slack/events \
     -H "Content-Type: application/json" \
     -d '{"type":"url_verification","challenge":"test"}'
   ```

2. **Test OAuth flow**:
   Visit: `https://slackbot-production-7e2d.up.railway.app/slack/oauth_redirect?code=test`

3. **Check database**:
   ```bash
   npm run db:studio
   # Verify tables exist and data is being stored
   ```

#### Debugging Commands
```bash
# Check Prisma schema
npx prisma validate

# Reset database (⚠️ deletes all data)
npm run db:reset

# View database
npm run db:studio

# Check environment variables
node -e "console.log(process.env)"

# Test Google AI API
node -e "
import { GoogleGenerativeAI } from '@google/generative-ai';
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
const result = await model.generateContent('Hello');
console.log(result.response.text());
"
```

### Logs and Monitoring

The bot logs important events to console:
- ✅ Incoming Slack events
- ✅ OAuth installations  
- ✅ API errors
- ✅ Database operations
- ✅ Google AI API calls

For production, consider adding structured logging:
```bash
npm install winston
```

### Performance Optimization

1. **Database Indexing**:
   ```sql
   CREATE INDEX idx_messages_channel_rootts ON "Message"(channel, "rootTs");
   CREATE INDEX idx_workspace_tokens_teamid ON "WorkspaceToken"("teamId");
   ```

2. **Rate Limiting**: Implement rate limiting for API calls
3. **Caching**: Cache frequent database queries
4. **Connection Pooling**: Use connection pooling for database

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