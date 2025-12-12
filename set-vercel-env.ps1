# PowerShell script to set Vercel environment variables
# Run this script after providing your values

Write-Host "Setting Vercel Environment Variables..." -ForegroundColor Green

# SESSION_SECRET (already generated)
$SESSION_SECRET = "n8ptitsx2a41w6e5qzKt4v4yqT4PmuVam2WGC8dyr2U="
Write-Host "`n1. Setting SESSION_SECRET..." -ForegroundColor Yellow
echo $SESSION_SECRET | vercel env add SESSION_SECRET production

# DATABASE_URL - YOU NEED TO PROVIDE THIS
Write-Host "`n2. Setting DATABASE_URL..." -ForegroundColor Yellow
Write-Host "Please enter your Neon PostgreSQL DATABASE_URL:" -ForegroundColor Cyan
$DATABASE_URL = Read-Host "DATABASE_URL"
echo $DATABASE_URL | vercel env add DATABASE_URL production

# OPENAI_API_KEY - Optional
Write-Host "`n3. Setting OPENAI_API_KEY (optional, press Enter to skip)..." -ForegroundColor Yellow
$OPENAI_KEY = Read-Host "OPENAI_API_KEY (or press Enter to skip)"
if ($OPENAI_KEY) {
    echo $OPENAI_KEY | vercel env add OPENAI_API_KEY production
}

# ANTHROPIC_API_KEY - Optional
Write-Host "`n4. Setting ANTHROPIC_API_KEY (optional, press Enter to skip)..." -ForegroundColor Yellow
$ANTHROPIC_KEY = Read-Host "ANTHROPIC_API_KEY (or press Enter to skip)"
if ($ANTHROPIC_KEY) {
    echo $ANTHROPIC_KEY | vercel env add ANTHROPIC_API_KEY production
}

Write-Host "`n✅ Environment variables set! Now deploying..." -ForegroundColor Green
vercel --prod

