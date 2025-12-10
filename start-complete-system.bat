@echo off
REM Brikx Backend System Starter
REM Start alleen de backend services (Backend API op poort 8765)
REM De Next.js frontend (poort 3000) moet apart gestart worden met: npm run dev

echo ====================================
echo   Brikx Backend System Starter
echo ====================================
echo.
echo Starting Backend API on Port 8765
echo (This serves the Admin Dashboard)
echo.

REM Start Backend API in brikx_platform
echo Starting Backend API...
start "Brikx Backend API" cmd /k "cd /d "%~dp0brikx_platform" && node server.js"

timeout /t 2 /nobreak >nul

echo.
echo ====================================
echo   Backend Started!
echo ====================================
echo.
echo Admin Dashboard:  http://localhost:8765
echo.
echo NOTE: To start the Next.js frontend (port 3000):
echo   Run 'npm run dev' in the root folder
echo.
echo Close the command prompt window to stop the backend.
echo.
pause
