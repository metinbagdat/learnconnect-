# Script to create .env file with API keys
# Run this script to create the .env file in the LearnConnect directory

$envContent = @"
# API Keys - Replace with your actual keys
ANTHROPIC_API_KEY=your_anthropic_api_key_here

DEEPSEEK_API_KEY=your_deepseek_api_key_here

OPENAI_API_KEY=your_openai_api_key_here

STRIPE_SECRET_KEY=your_stripe_secret_key_here

VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key_here
"@

$envPath = Join-Path $PSScriptRoot ".env"
$envContent | Out-File -FilePath $envPath -Encoding utf8 -NoNewline

Write-Host ".env file created successfully at: $envPath"
Write-Host "You can now run 'npm run dev' and the server will automatically load these variables."

