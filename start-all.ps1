# Start both backend and frontend in separate windows
Write-Host "Starting Bank Lending System..." -ForegroundColor Green

# Start backend in new PowerShell window
Write-Host "Starting backend server..." -ForegroundColor Blue
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; .\start-backend.ps1"

# Wait a moment for backend to start
Start-Sleep -Seconds 3

# Start frontend in new PowerShell window
Write-Host "Starting frontend application..." -ForegroundColor Blue
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; .\start-frontend.ps1"

Write-Host "`n✅ Both services are starting!" -ForegroundColor Green
Write-Host "Backend: http://localhost:3001" -ForegroundColor Yellow
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Yellow
Write-Host "`nWait a moment for both services to fully start..." -ForegroundColor Cyan
