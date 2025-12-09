@echo off
REM Quick Start - Start beide services zonder checks
REM Alleen gebruiken als dependencies al geïnstalleerd zijn

echo ====================================
echo   Brikx Quick Start
echo ====================================
echo.

cd /d "%~dp0"

echo [1/2] Starting Backend Server (Port 8765)...
start "Brikx Backend" cmd /c "node server.js"

timeout /t 2 /nobreak >nul

echo [2/2] Starting Dashboard (Port 3001)...
start "Brikx Dashboard" cmd /c "npx vite --port 3001"

echo.
echo ====================================
echo   Services gestart!
echo ====================================
echo.
echo Backend:   http://localhost:8765
echo Dashboard: http://localhost:3001
echo.
echo Sluit de vensters om te stoppen.
echo.
pause
