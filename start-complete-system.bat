@echo off
REM Complete Brikx + KavelArchitect System Starter
REM Start alle 3 de services: Backend API, Admin Dashboard, en Publieke Website

echo ====================================
echo   Complete System Starter
echo ====================================
echo.
echo Starting 3 services:
echo   1. Backend API (Port 8765)
echo   2. Admin Dashboard (Port 3001)
echo   3. Next.js Website (Port 3000)
echo.

REM Start Backend API in brikx_platform
echo [1/3] Starting Backend API...
start "Brikx Backend API" cmd /k "cd /d "%~dp0brikx_platform" && node server.js"

timeout /t 2 /nobreak >nul

REM Start Admin Dashboard in brikx_platform
echo [2/3] Starting Admin Dashboard...
start "Brikx Admin Dashboard" cmd /k "cd /d "%~dp0brikx_platform" && npm run dev"

timeout /t 2 /nobreak >nul

REM Start Next.js Website in root
echo [3/3] Starting Next.js Website...
start "KavelArchitect Website" cmd /k "cd /d "%~dp0" && npm run dev"

echo.
echo ====================================
echo   All Services Started!
echo ====================================
echo.
echo Backend API:      http://localhost:8765
echo Admin Dashboard:  http://localhost:3001
echo Public Website:   http://localhost:3000
echo.
echo Close the command prompt windows to stop services.
echo.
pause
