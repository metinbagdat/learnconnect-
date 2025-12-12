# Vercel Deployment Guide for LearnConnect

This guide walks you through deploying LearnConnect to Vercel.

## Prerequisites

1. **Vercel Account**: Sign up at https://vercel.com
2. **GitHub Repository**: Your code should be pushed to GitHub (already done at `metinbagdat/learnconnect-`)
3. **Database**: Neon PostgreSQL database with connection string
4. **Environment Variables**: See `VERCEL_ENV.md` for required variables

## Deployment Steps

### 1. Connect Repository to Vercel

1. Go to https://vercel.com/dashboard
2. Click **"Add New..."** > **"Project"**
3. Import your GitHub repository: `metinbagdat/learnconnect-`
4. Vercel will auto-detect the project settings from `vercel.json`

### 2. Configure Project Settings

Vercel should auto-detect:
- **Framework Preset**: Other (custom)
- **Root Directory**: `./` (root)
- **Build Command**: `npm run build` (from vercel.json)
- **Output Directory**: `dist/public` (from vercel.json)
- **Install Command**: `npm install` (from vercel.json)

Verify these settings match your `vercel.json` configuration.

### 3. Set Environment Variables

Before deploying, add all required environment variables:

1. In Vercel project settings, go to **Settings** > **Environment Variables**
2. Add each variable from `VERCEL_ENV.md`:
   - `DATABASE_URL` (Required)
   - `SESSION_SECRET` (Required)
   - `OPENAI_API_KEY` (Optional)
   - `ANTHROPIC_API_KEY` (Optional)
   - `STRIPE_SECRET_KEY` (Optional)
   - `STRIPE_PUBLISHABLE_KEY` (Optional)
   - `PAYPAL_CLIENT_ID` (Optional)
   - `PAYPAL_CLIENT_SECRET` (Optional)

3. Select environments for each variable:
   - **Production**: For live site
   - **Preview**: For preview deployments
   - **Development**: For local development

### 4. Deploy

1. Click **"Deploy"** button
2. Wait for build to complete (typically 2-5 minutes)
3. Check build logs for any errors

### 5. Verify Deployment

After deployment, verify:

#### API Routes
- Test health endpoint: `https://your-project.vercel.app/api/health`
- Should return: `{"status":"ok","timestamp":"..."}`

#### Frontend
- Visit: `https://your-project.vercel.app`
- Should load the React app
- Navigation should work
- Responsive mobile menu should function

#### Database Connection
- Try logging in or accessing protected routes
- Check Vercel function logs for database connection errors

## Project Structure for Vercel

```
LearnConnect/
├── api/
│   └── index.ts          # Serverless function handler
├── client/              # React frontend
├── server/              # Express backend code
├── dist/
│   └── public/          # Built frontend (output)
├── vercel.json          # Vercel configuration
└── package.json         # Dependencies and scripts
```

## How It Works

1. **Frontend**: Vite builds React app to `dist/public/`
2. **API Routes**: All `/api/*` requests route to `api/index.ts` serverless function
3. **Static Files**: Served from `dist/public/` with SPA fallback
4. **Serverless Functions**: Express app runs in serverless context

## Troubleshooting

### Build Fails

**Error: Module not found**
- Ensure all dependencies are in `package.json`
- Check that `npm install` completes successfully

**Error: TypeScript errors**
- Run `npm run check` locally to find TypeScript issues
- Fix type errors before deploying

### Runtime Errors

**Error: DATABASE_URL not found**
- Verify environment variable is set in Vercel dashboard
- Check that variable is available in Production environment
- Redeploy after adding variables

**Error: Function timeout**
- API functions have 30s timeout (configurable in vercel.json)
- Optimize slow database queries
- Consider increasing `maxDuration` in vercel.json

**Error: CORS issues**
- Vercel handles CORS automatically for API routes
- Check that frontend URLs match Vercel deployment URL

### Database Connection Issues

**Error: Too many connections**
- Neon database has connection limits
- Current pool size is set to 2 connections (in `server/db.ts`)
- Consider upgrading Neon plan if needed

**Error: Connection timeout**
- Verify `DATABASE_URL` is correct
- Check Neon dashboard for connection logs
- Ensure database allows connections from Vercel IPs

## Post-Deployment

### Custom Domain (Optional)

1. Go to **Settings** > **Domains**
2. Add your custom domain
3. Follow DNS configuration instructions

### Monitoring

- **Function Logs**: View in Vercel dashboard > **Deployments** > **Functions**
- **Analytics**: Enable in **Settings** > **Analytics**
- **Error Tracking**: Consider integrating Sentry or similar

### Updates

- Push to `main` branch to trigger automatic deployment
- Preview deployments created for pull requests
- Rollback available in **Deployments** tab

## Important Notes

- **Session Storage**: Currently uses MemoryStore (in-memory). For production, consider Redis or database-backed sessions
- **WebSockets**: Not supported in serverless functions. Consider alternatives if needed
- **File Uploads**: Use Vercel Blob or external storage (S3, etc.)
- **Cron Jobs**: Use Vercel Cron for scheduled tasks

## Support

- Vercel Docs: https://vercel.com/docs
- Vercel Discord: https://vercel.com/discord
- Project Issues: Check GitHub repository issues

