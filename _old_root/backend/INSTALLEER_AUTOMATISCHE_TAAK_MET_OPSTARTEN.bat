@echo off
echo ========================================
echo Brikx Funda Sync - Automatische Taak
echo ========================================
echo.
echo Dit script maakt TWEE geplande taken aan:
echo  1. Dagelijks om 08:00 uur
echo  2. Bij opstarten van de computer (1x per dag)
echo.
echo BELANGRIJK: Klik met rechtermuisknop op dit bestand
echo en kies "Als administrator uitvoeren"
echo.
pause

REM Controleer of we admin rechten hebben
net session >nul 2>&1
if %errorLevel% NEQ 0 (
    echo.
    echo FOUT: Geen administrator rechten!
    echo Klik met rechtermuisknop op dit bestand en kies "Als administrator uitvoeren"
    echo.
    pause
    exit /b 1
)

echo.
echo Administrator rechten gedetecteerd - doorgaan...
echo.

REM Taak 1: Dagelijks om 8:00
echo Aanmaken taak 1: Dagelijks om 08:00...
schtasks /create ^
  /tn "BrikxFundaSync_Daily" ^
  /tr "\"%~dp0run_funda_sync.bat\"" ^
  /sc daily ^
  /st 08:00 ^
  /ru "%USERNAME%" ^
  /f

if %errorLevel% EQU 0 (
    echo [OK] Dagelijkse taak aangemaakt
) else (
    echo [FOUT] Dagelijkse taak mislukt
)

echo.

REM Taak 2: Bij opstarten (met delay zodat het maar 1x per dag draait)
echo Aanmaken taak 2: Bij opstarten computer...
schtasks /create ^
  /tn "BrikxFundaSync_OnStartup" ^
  /tr "\"%~dp0run_funda_sync.bat\"" ^
  /sc onstart ^
  /delay 0002:00 ^
  /ru "%USERNAME%" ^
  /f

if %errorLevel% EQU 0 (
    echo [OK] Opstarten taak aangemaakt (met 2 min vertraging)
) else (
    echo [FOUT] Opstarten taak mislukt
)

echo.
echo ========================================
echo INSTALLATIE VOLTOOID
echo ========================================
echo.
echo Taken aangemaakt:
echo   1. BrikxFundaSync_Daily - Dagelijks om 08:00
echo   2. BrikxFundaSync_OnStartup - Bij opstarten (2 min vertraging)
echo.
echo Je kunt de taken bekijken in Task Scheduler:
echo   Start -^> taakplanner.msc
echo.
echo Handmatig testen:
echo   schtasks /run /tn "BrikxFundaSync_Daily"
echo.

pause
