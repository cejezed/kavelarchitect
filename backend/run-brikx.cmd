@echo off
pushd "%~dp0"
REM gebruik de venv-python direct (betrouwbaarder dan activeren)
".\.venv\Scripts\python.exe" -m brikx --config ".\config.yaml" --log-level INFO
echo.
pause
