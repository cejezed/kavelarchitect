@echo off
echo ========================================
echo Brikx Funda Sync - Automatische Taak
echo ========================================
echo.
echo Dit script maakt een geplande taak aan die:
echo  - Dagelijks om 08:00 uur draait
echo  - Bij opstarten van de computer draait
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

REM Maak de geplande taak aan met schtasks
schtasks /create ^
  /tn "BrikxFundaSync" ^
  /tr "\"%~dp0run_funda_sync.bat\"" ^
  /sc daily ^
  /st 08:00 ^
  /ru "%USERNAME%" ^
  /rl HIGHEST ^
  /f

if %errorLevel% EQU 0 (
    echo.
    echo ========================================
    echo SUCCES! Taak is aangemaakt
    echo ========================================
    echo.
    echo Schema:
    echo   - Dagelijks om 08:00 uur
    echo   - Gebruiker: %USERNAME%
    echo.
    echo Je kunt de taak bekijken in Task Scheduler:
    echo   Start -^> taakplanner.msc
    echo.
    echo Of handmatig testen met:
    echo   schtasks /run /tn "BrikxFundaSync"
    echo.
) else (
    echo.
    echo FOUT: Kon taak niet aanmaken (errorlevel: %errorLevel%)
    echo.
)

pause
