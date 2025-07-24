# Install dependencies for both backend and frontend
Write-Host "Installing Bank Lending System..." -ForegroundColor Green

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "Node.js version: $nodeVersion" -ForegroundColor Yellow
} catch {
    Write-Host "Error: Node.js is not installed. Please install Node.js first." -ForegroundColor Red
    exit 1
}

# Install backend dependencies
Write-Host "`nInstalling backend dependencies..." -ForegroundColor Blue
Set-Location backend
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error installing backend dependencies" -ForegroundColor Red
    exit 1
}

# Install frontend dependencies
Write-Host "`nInstalling frontend dependencies..." -ForegroundColor Blue
Set-Location ..\frontend
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error installing frontend dependencies" -ForegroundColor Red
    exit 1
}

Set-Location ..

Write-Host "`n✅ Installation complete!" -ForegroundColor Green
Write-Host "`nTo start the application:" -ForegroundColor Yellow
Write-Host "1. Run backend:  .\start-backend.ps1" -ForegroundColor Cyan
Write-Host "2. Run frontend: .\start-frontend.ps1" -ForegroundColor Cyan
Write-Host "`nOr use: .\start-all.ps1 to start both services" -ForegroundColor Cyan
