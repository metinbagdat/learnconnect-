# Quick Deployment Guide

## Environment Variables Needed

To deploy with Database, Session Secret, and AI Features, you need to provide:

### 1. DATABASE_URL (Required)
Your Neon PostgreSQL connection string. Format:
```
postgresql://user:password@host/database?sslmode=require
```

### 2. SESSION_SECRET (Generated)
Already generated: `n8ptitsx2a41w6e5qzKt4v4yqT4PmuVam2WGC8dyr2U=`

### 3. AI API Keys (Optional but recommended)
- **OPENAI_API_KEY**: Your OpenAI API key
- **ANTHROPIC_API_KEY**: Your Anthropic/Claude API key

## Quick Deploy Commands

Run these commands in the project directory:

```bash
# Set SESSION_SECRET (already generated)
vercel env add SESSION_SECRET production
# When prompted, paste: n8ptitsx2a41w6e5qzKt4v4yqT4PmuVam2WGC8dyr2U=
# Mark as sensitive: y

# Set DATABASE_URL (you need to provide this)
vercel env add DATABASE_URL production
# Paste your Neon database connection string
# Mark as sensitive: y

# Set OpenAI API Key (optional)
vercel env add OPENAI_API_KEY production
# Paste your OpenAI API key
# Mark as sensitive: y

# Set Anthropic API Key (optional)
vercel env add ANTHROPIC_API_KEY production
# Paste your Anthropic API key
# Mark as sensitive: y

# Deploy to production
vercel --prod
```

## Alternative: Set via Vercel Dashboard

1. Go to: https://vercel.com/metinbahdats-projects/learn-connect/settings/environment-variables
2. Add each variable:
   - **SESSION_SECRET**: `n8ptitsx2a41w6e5qzKt4v4yqT4PmuVam2WGC8dyr2U=`
   - **DATABASE_URL**: Your Neon connection string
   - **OPENAI_API_KEY**: Your OpenAI key (optional)
   - **ANTHROPIC_API_KEY**: Your Anthropic key (optional)
3. Select **Production** environment for each
4. Click **Save**
5. Go to Deployments and click **Redeploy** on latest deployment

## After Setting Variables

Once all environment variables are set, deploy:

```bash
vercel --prod
```

Or trigger a new deployment from the Vercel dashboard.

