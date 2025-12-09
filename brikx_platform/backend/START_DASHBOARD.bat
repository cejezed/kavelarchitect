@echo off
echo ========================================
echo Brikx Dashboard Server
echo ========================================
echo.
echo Starting server...
echo.

cd /d "%~dp0"

REM Start de Python server
python dashboard_server.py

pause
