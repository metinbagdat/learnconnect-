# PowerShell script to add AI API keys to Vercel
# Run this script and enter your API keys when prompted

Write-Host "Adding AI API Keys to Vercel..." -ForegroundColor Green
Write-Host ""

# OPENAI_API_KEY
Write-Host "1. Adding OPENAI_API_KEY..." -ForegroundColor Yellow
Write-Host "Enter your OpenAI API key (or press Enter to skip):" -ForegroundColor Cyan
$OPENAI_KEY = Read-Host
if ($OPENAI_KEY -and $OPENAI_KEY.Trim() -ne "") {
    echo $OPENAI_KEY | vercel env add OPENAI_API_KEY production
    Write-Host "✅ OPENAI_API_KEY added!" -ForegroundColor Green
} else {
    Write-Host "⏭️  OPENAI_API_KEY skipped" -ForegroundColor Yellow
}

Write-Host ""

# ANTHROPIC_API_KEY
Write-Host "2. Adding ANTHROPIC_API_KEY..." -ForegroundColor Yellow
Write-Host "Enter your Anthropic API key (or press Enter to skip):" -ForegroundColor Cyan
$ANTHROPIC_KEY = Read-Host
if ($ANTHROPIC_KEY -and $ANTHROPIC_KEY.Trim() -ne "") {
    echo $ANTHROPIC_KEY | vercel env add ANTHROPIC_API_KEY production
    Write-Host "✅ ANTHROPIC_API_KEY added!" -ForegroundColor Green
} else {
    Write-Host "⏭️  ANTHROPIC_API_KEY skipped" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "✅ Done! Environment variables added." -ForegroundColor Green
Write-Host ""
Write-Host "Next step: Redeploy your application:" -ForegroundColor Cyan
Write-Host "  vercel --prod" -ForegroundColor White
Write-Host ""
Write-Host "Or redeploy from Vercel dashboard:" -ForegroundColor Cyan
Write-Host "  https://vercel.com/metinbahdats-projects/learn-connect/deployments" -ForegroundColor White

