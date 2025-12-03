@echo off
REM Brikx Backend Server Starter
REM Dit script start de Node.js backend server

echo ====================================
echo   Brikx Backend Server
echo ====================================
echo.

REM Ga naar de juiste directory
cd /d "%~dp0"

echo Huidige directory: %cd%
echo.

REM Check of Node.js is geïnstalleerd
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo FOUT: Node.js is niet geïnstalleerd of niet in PATH
    echo Download Node.js van https://nodejs.org/
    pause
    exit /b 1
)

echo Node.js versie:
node --version
echo.

REM Check of server.js bestaat
if not exist "server.js" (
    echo FOUT: server.js niet gevonden in %cd%
    pause
    exit /b 1
)

echo Starting backend server op poort 8765...
echo.
echo Druk op Ctrl+C om de server te stoppen
echo ====================================
echo.

REM Start de server
node server.js

REM Als de server stopt, wacht dan op input
pause
