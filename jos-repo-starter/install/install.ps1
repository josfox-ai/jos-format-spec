# JOS CLI Installer for Windows (PowerShell)
# Run: irm https://raw.githubusercontent.com/josfox-ai/jos-repo-starter/main/install/install.ps1 | iex

$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "🦊 JOS CLI Installer" -ForegroundColor Magenta
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkGray
Write-Host ""

# Check Node.js
Write-Host "Checking for Node.js..." -ForegroundColor Cyan
try {
    $nodeVersion = node --version 2>$null
    if ($nodeVersion) {
        Write-Host "✓ Node.js found: $nodeVersion" -ForegroundColor Green
    }
} catch {
    Write-Host "✖ Node.js not found!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install Node.js first:" -ForegroundColor Yellow
    Write-Host "  https://nodejs.org/" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Or use winget:" -ForegroundColor Yellow
    Write-Host "  winget install OpenJS.NodeJS.LTS" -ForegroundColor Cyan
    Write-Host ""
    exit 1
}

# Check npm
Write-Host "Checking for npm..." -ForegroundColor Cyan
try {
    $npmVersion = npm --version 2>$null
    Write-Host "✓ npm found: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "✖ npm not found!" -ForegroundColor Red
    exit 1
}

# Install JOS CLI
Write-Host ""
Write-Host "Installing @josfox/jos..." -ForegroundColor Cyan
npm install -g @josfox/jos

# Verify
Write-Host ""
Write-Host "Verifying installation..." -ForegroundColor Cyan
try {
    $josVersion = jos --version 2>$null
    Write-Host ""
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkGray
    Write-Host "✓ JOS CLI installed successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "  Get started:" -ForegroundColor White
    Write-Host "    jos --help" -ForegroundColor Cyan
    Write-Host "    jos get ollama" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "  Documentation:" -ForegroundColor White
    Write-Host "    https://josfox-ai.github.io/jos-format-spec" -ForegroundColor Cyan
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkGray
} catch {
    Write-Host "✖ Installation failed. Please try again." -ForegroundColor Red
    exit 1
}
