# PowerShell script to set environment variables
# Run this before starting the server, or add these to your system environment variables

# Replace these with your actual API keys
$env:ANTHROPIC_API_KEY = "your_anthropic_api_key_here"
$env:DEEPSEEK_API_KEY = "your_deepseek_api_key_here"
$env:OPENAI_API_KEY = "your_openai_api_key_here"
$env:STRIPE_SECRET_KEY = "your_stripe_secret_key_here"
$env:VITE_STRIPE_PUBLIC_KEY = "your_stripe_public_key_here"

Write-Host "Environment variables set successfully!"

