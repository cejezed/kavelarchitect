@echo off
REM Brikx Dashboard Starter
REM Dit script start de Vite development server voor het dashboard

echo ====================================
echo   Brikx Dashboard (Vite)
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

REM Check of npm is geïnstalleerd
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo FOUT: npm is niet geïnstalleerd
    pause
    exit /b 1
)

REM Check of node_modules bestaat, zo niet installeer dependencies
if not exist "node_modules\" (
    echo node_modules niet gevonden, installeren van dependencies...
    echo Dit kan een paar minuten duren...
    echo.
    npm install
    echo.
)

echo Starting dashboard op http://localhost:3001
echo.
echo Druk op Ctrl+C om de server te stoppen
echo ====================================
echo.

REM Start Vite dev server op poort 3001
npx vite --port 3001

REM Als de server stopt, wacht dan op input
pause
