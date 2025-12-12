# Vercel Environment Variables

This document lists all required and optional environment variables for deploying LearnConnect to Vercel.

## Required Environment Variables

### Database
- **`DATABASE_URL`** (Required)
  - Neon PostgreSQL database connection string
  - Format: `postgresql://user:password@host/database?sslmode=require`
  - Example: `postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require`

### Authentication & Security
- **`SESSION_SECRET`** (Required in production)
  - Secret key for encrypting session cookies
  - Generate a strong random string (minimum 32 characters)
  - Example: Use `openssl rand -base64 32` to generate

### AI Services (Optional but recommended)
- **`OPENAI_API_KEY`** (Optional)
  - OpenAI API key for AI features
  - Get from: https://platform.openai.com/api-keys
  - Required for: AI course generation, AI daily plans, AI recommendations

- **`ANTHROPIC_API_KEY`** (Optional)
  - Anthropic/Claude API key for AI features
  - Get from: https://console.anthropic.com/
  - Required for: AI curriculum generation, AI-powered learning paths

## Payment Processing (Optional)

### Stripe
- **`STRIPE_SECRET_KEY`** (Optional)
  - Stripe secret key for payment processing
  - Get from: https://dashboard.stripe.com/apikeys
  - Required for: Stripe payment integration

- **`STRIPE_PUBLISHABLE_KEY`** (Optional)
  - Stripe publishable key (frontend)
  - Get from: https://dashboard.stripe.com/apikeys
  - Required for: Stripe payment UI

- **`STRIPE_WEBHOOK_SECRET`** (Optional)
  - Stripe webhook secret for verifying webhook events
  - Get from: Stripe Dashboard > Developers > Webhooks
  - Required for: Processing payment webhooks

### PayPal
- **`PAYPAL_CLIENT_ID`** (Optional)
  - PayPal client ID for payment processing
  - Get from: https://developer.paypal.com/dashboard/
  - Required for: PayPal payment integration

- **`PAYPAL_CLIENT_SECRET`** (Optional)
  - PayPal client secret
  - Get from: https://developer.paypal.com/dashboard/
  - Required for: PayPal payment processing

- **`PAYPAL_ENVIRONMENT`** (Optional)
  - PayPal environment: `sandbox` or `live`
  - Default: `sandbox` for development

## Application Settings

- **`NODE_ENV`** (Optional)
  - Environment mode: `development` or `production`
  - Vercel automatically sets this to `production` in deployments

## How to Set Environment Variables in Vercel

1. Go to your Vercel project dashboard
2. Navigate to **Settings** > **Environment Variables**
3. Add each variable with its value
4. Select the environments where it should be available:
   - **Production**: Live deployments
   - **Preview**: Preview deployments (pull requests)
   - **Development**: Local development (if using Vercel CLI)

## Important Notes

- **Never commit** `.env` files or environment variables to Git
- Use Vercel's environment variable interface for all secrets
- Rotate secrets regularly, especially `SESSION_SECRET`
- For database connections, use connection pooling (Neon provides this automatically)
- AI API keys are optional - the app will work without them but AI features will be disabled

## Testing Environment Variables

After setting environment variables in Vercel:
1. Redeploy your application
2. Check the function logs in Vercel dashboard
3. Verify database connectivity
4. Test API endpoints that require environment variables

## Troubleshooting

- **Database connection errors**: Verify `DATABASE_URL` is correct and database allows connections from Vercel IPs
- **Session issues**: Ensure `SESSION_SECRET` is set and consistent across deployments
- **AI features not working**: Check that API keys are valid and have sufficient credits/quota
- **Payment processing errors**: Verify Stripe/PayPal keys match the environment (sandbox vs live)

