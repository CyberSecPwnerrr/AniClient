@echo off
setlocal
cd /d "%~dp0"
where python >nul 2>nul
if errorlevel 1 (
    echo Python 3.9 to 3.13 was not found in PATH.
    if not defined CI pause
    exit /b 1
)
python -m pip install --upgrade pip
python -m pip install -r requirements.txt -r requirements-build.txt
if errorlevel 1 goto fail
python make_icon.py
if errorlevel 1 goto fail
python -m PyInstaller --noconfirm --clean --windowed --name AniClient --icon icon.ico --add-data "frame.js;." --add-data "overlay.js;." --collect-all webview --collect-all pythonnet --collect-all clr_loader --hidden-import webview.platforms.winforms --hidden-import webview.platforms.edgechromium main.py
if errorlevel 1 goto fail
python pack.py
if errorlevel 1 goto fail
python -m PyInstaller --noconfirm --clean --onefile --windowed --name AniClient-Setup --icon icon.ico --add-data "payload.zip;." --exclude-module PyQt6.QtWebEngineWidgets --exclude-module PyQt6.QtWebEngineCore --exclude-module PyQt6.QtWebChannel installer.py
if errorlevel 1 goto fail
echo.
echo Done. Your installer: dist\AniClient-Setup.exe
if not defined CI pause
exit /b 0
:fail
echo.
echo Build failed. See the messages above.
if not defined CI pause
exit /b 1
