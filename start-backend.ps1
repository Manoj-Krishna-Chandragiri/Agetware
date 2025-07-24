# Start the backend server
Write-Host "Starting Bank Lending System Backend..." -ForegroundColor Green
Write-Host "Backend will be available at: http://localhost:3001" -ForegroundColor Yellow

Set-Location backend
npm start
