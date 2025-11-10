# Environment Variables Setup

Create a `.env` file in the root directory with the following variables:

\`\`\`env
# Database
# Neon PostgreSQL connection string
# Get this from your Neon dashboard: https://neon.tech
DATABASE_URL="postgresql://user:password@host.neon.tech/dbname?sslmode=require"

# NextAuth.js
# For production, use your actual domain
NEXTAUTH_URL="http://localhost:3000"

# Generate a secret with: openssl rand -base64 32
NEXTAUTH_SECRET="your-nextauth-secret-here"

# LinkedIn OAuth
# Create an app at: https://www.linkedin.com/developers/apps
# Add redirect URL: http://localhost:3000/api/auth/callback/linkedin
LINKEDIN_CLIENT_ID="your-linkedin-client-id"
LINKEDIN_CLIENT_SECRET="your-linkedin-client-secret"
\`\`\`

## How to Get These Values

### 1. Database URL (Neon PostgreSQL)

1. Go to [neon.tech](https://neon.tech)
2. Create a new project or use an existing one
3. Copy the connection string from your project dashboard
4. Make sure to use the connection string with SSL mode

### 2. NextAuth Secret

Generate a random secret:

\`\`\`bash
openssl rand -base64 32
\`\`\`

### 3. LinkedIn OAuth

1. Visit [LinkedIn Developer Portal](https://www.linkedin.com/developers/apps)
2. Create a new app or select an existing one
3. Go to "Auth" tab
4. Add OAuth 2.0 redirect URLs:
   - Development: `http://localhost:3000/api/auth/callback/linkedin`
   - Production: `https://yourdomain.com/api/auth/callback/linkedin`
5. Request access to these scopes:
   - `openid`
   - `profile`
   - `email`
6. Copy your Client ID and Client Secret

## Vercel Deployment

When deploying to Vercel, add these environment variables in your project settings:

1. Go to your project in Vercel Dashboard
2. Settings → Environment Variables
3. Add all the variables above
4. Make sure `NEXTAUTH_URL` points to your production domain
5. Use Vercel's Neon integration for easy database setup

