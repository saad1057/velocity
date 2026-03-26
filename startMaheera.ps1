Write-Host "Starting VELOCITY..." -ForegroundColor Cyan

$basePath = Split-Path -Parent $MyInvocation.MyCommand.Path

# AI Service - using miniconda ml1
Start-Process cmd -ArgumentList "/k", "cd `"$basePath\ai-service`" && C:\ProgramData\miniconda3\Scripts\activate.bat && conda activate ml1 && python app.py"

# Backend - Node.js
Start-Process cmd -ArgumentList "/k", "cd `"$basePath\backend`" && npm start"

# Frontend - React
Start-Process cmd -ArgumentList "/k", "cd `"$basePath\frontend`" && npm run dev"

Write-Host "All 3 services launched!" -ForegroundColor Green
