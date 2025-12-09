@echo off
REM Brikx Complete System Starter
REM Dit script start zowel de backend als het dashboard

echo ====================================
echo   Brikx - Complete System
echo ====================================
echo.
echo Starting Backend Server en Dashboard...
echo.

REM Ga naar de juiste directory
cd /d "%~dp0"

REM Start backend in nieuw venster
echo [1/2] Starting Backend Server...
start "Brikx Backend (Port 8765)" cmd /k "%~dp0start-backend.bat"

REM Wacht 3 seconden om backend te laten starten
timeout /t 3 /nobreak >nul

REM Start dashboard in nieuw venster
echo [2/2] Starting Dashboard...
start "Brikx Dashboard (Port 3001)" cmd /k "%~dp0start-dashboard.bat"

echo.
echo ====================================
echo   Beide services zijn gestart!
echo ====================================
echo.
echo Backend:   http://localhost:8765
echo Dashboard: http://localhost:3001
echo.
echo Sluit de vensters om de services te stoppen.
echo.
pause
