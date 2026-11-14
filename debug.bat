@echo off
cd /d "%~dp0"
python -m pip install -r requirements.txt
python main.py --debug
echo.
echo Log file: %APPDATA%\AniClient\log.txt
type "%APPDATA%\AniClient\log.txt"
pause
