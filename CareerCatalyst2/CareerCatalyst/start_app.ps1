# PowerShell script to start both frontend and backend
Write-Host "Starting CareerCatalyst Application..." -ForegroundColor Green

# Start backend in background
Write-Host "Starting backend server..." -ForegroundColor Yellow
Start-Process PowerShell -ArgumentList "-Command", "cd 'd:\CareerCatalyst3\CareerCatalyst2\CareerCatalyst\backend'; python app_simple.py"

# Wait a moment for backend to start
Start-Sleep -Seconds 3

# Start frontend
Write-Host "Starting frontend..." -ForegroundColor Yellow
cd "d:\CareerCatalyst3\CareerCatalyst2\CareerCatalyst"
npm start

Write-Host "Application started! Backend: http://localhost:8000, Frontend: http://localhost:3000" -ForegroundColor Green
