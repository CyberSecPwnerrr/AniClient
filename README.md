<div align="center">

# 🌌 AniClient

**A fast, themeable Windows desktop client built on Microsoft Edge WebView2**
*Liquid-glass toolbar · Lucide icons · ad & tracker blocking · watch history · command palette*

![Platform](https://img.shields.io/badge/platform-Windows-0078D6?style=for-the-badge&logo=windows&logoColor=white)
![Python](https://img.shields.io/badge/python-3.9%20–%203.13-3776AB?style=for-the-badge&logo=python&logoColor=white)
![WebView2](https://img.shields.io/badge/engine-WebView2-7c5cff?style=for-the-badge&logo=microsoftedge&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)
![Version](https://img.shields.io/badge/version-3.0.0-ff7ac6?style=for-the-badge)

</div>

---

> **Disclaimer:** AniClient is an independent browser shell. It is not affiliated with any web site, does not host or download media, and the home page and search URL are fully configurable. You are responsible for using it in line with the laws and terms that apply to you.

## 📖 Table of Contents

- [Why WebView2?](#-why-webview2)
- [Features](#-features)
- [Themes](#-themes)
- [Keyboard Shortcuts](#-keyboard-shortcuts)
- [Installation](#-installation)
- [Build from Source](#-build-from-source)
- [Troubleshooting](#-troubleshooting)
- [Project Structure](#-project-structure)
- [Credits](#-credits)
- [License](#-license)

## ⚡ Why WebView2?

Streaming players need **H.264 and AAC**. The Chromium build bundled in PyQt/PySide wheels doesn't include those codecs, which leads to *"This video file cannot be played (Error Code: 102630)"*.

AniClient uses the **Edge engine already on Windows**, so video playback, hardware acceleration and smooth scrolling behave exactly like Edge.

## ✨ Features

### 🎨 Interface & Customization
- **Liquid-glass toolbar** that auto-hides (pin it with the 📌 button)
- Animated start page, sliding library panel and toast notifications
- **16 built-in themes** plus fully custom colors
- Accent color presets, adjustable **corner radius**, **glass opacity**, **blur** and **font**
- Optional animations, hidden scrollbars, blurred thumbnails and inverted colors

### 🛡️ Privacy & Blocking
- **Ad / tracker request blocker** with 100+ blocked domains
- Ad and click-trap hiding (cosmetic filtering)
- **Popup blocker**
- **Cookie-banner hider**
- **Domain lock** to keep navigation on your chosen site
- One-click **Clear cookies**
- **Compatibility mode** that disables blocking and injected scripts for stubborn sites

### 📺 Library & Watching
- **Watch history** and **favorites**
- Personal **stats** (episodes watched, different anime, total watch time, favorites)
- **Continue watching**, **next episode** and **random anime**

### 🎬 Player Helpers
- **Resume position** where you left off
- **Autoplay** and **auto next episode**
- **Skip Intro** button with configurable skip length
- Speed, seek, mute and **Picture-in-Picture** hotkeys
- Default playback speed and volume

### 🧰 Power Tools
- **Command palette** (`Ctrl+K`)
- **Mini player**
- **Boss key** (instantly mutes and minimizes)
- **Sleep timer** that closes the app after N minutes
- **Zoom** in / out / reset
- **Custom CSS** and **custom JS** injection
- Configurable **download folder** with optional "ask where to save"
- **Always-on-top** mode
- **Safe mode** (`--safe`) to disable GPU acceleration on problem PCs
- Debug mode (`--debug`) and a log file for troubleshooting

### 📦 Installer
- Custom-styled installer (`AniClient-Setup.exe`)
- Choose install folder, download folder, theme and shortcuts
- Installs the **WebView2 Runtime** automatically if missing
- **No admin rights needed**

## 🎨 Themes

`Midnight` · `AMOLED` · `Light` · `Nord` · `Sakura` · `Ocean` · `Forest` · `Dracula` · `Sunset` · `Cyberpunk` · `Mocha` · `Rose Pine` · `Solarized` · `Matcha` · `Ice` · `Crimson`

Cycle through them anytime with `Ctrl+Shift+L`.

## ⌨️ Keyboard Shortcuts

### App

| Shortcut | Action |
|---|---|
| `Ctrl+K` | Command palette |
| `Ctrl+L` | Focus address bar |
| `Ctrl+H` | Open library |
| `Ctrl+D` | Toggle favorite |
| `Ctrl+,` | Settings |
| `Alt+N` | Next episode |
| `Alt+C` | Continue watching |
| `Ctrl+Shift+L` | Cycle theme |
| `Ctrl+Shift+H` | Boss key |

### In the video player

| Key | Action |
|---|---|
| `S` | Skip intro |
| `N` | Next episode |
| `.` / `,` | Speed up / down |
| `J` / `L` | Seek back / forward |
| `M` | Mute |
| `P` | Picture-in-Picture |

## 📥 Installation

1. Download **`AniClient-Setup.exe`** from the [Releases](../../releases) page.
2. Run it and pick your install folder, download folder, theme and shortcuts.
3. Launch AniClient. The WebView2 Runtime is installed for you if it's missing.

## 🔨 Build from Source

**Requirements:** Windows, Python 3.9 – 3.13

```bash
git clone https://github.com/CyberSecPwnerrr/AniClient.git
cd AniClient
```

| Goal | Command |
|---|---|
| Build the installer | double-click `build.bat` → `dist\AniClient-Setup.exe` |
| Run without building | `run.bat` |
| Run with debug logging | `debug.bat` |
| Run in safe mode (no GPU) | `python main.py --safe` |

Errors and logs are written to `%APPDATA%\AniClient\log.txt`.

A GitHub Actions workflow (`.github/workflows/build.yml`) builds the installer automatically on `v*` tags and attaches it to the release.

## 🩺 Troubleshooting

**A site shows "Access denied"**
Turn on **Settings → Privacy → Compatibility mode** (disables ad blocking and injected page scripts). If the same page is also denied in normal Edge, the block is on your network or IP (VPN, DNS, region) and no client can fix it.

**Black screen or crashes on startup**
Start with `--safe` or enable **Safe mode** in settings to disable GPU acceleration.

**Something else is broken**
Run `debug.bat` and check `%APPDATA%\AniClient\log.txt`.

## 🗂️ Project Structure

```
AniClient/
├── main.py                  # WebView2 host, request blocking, settings & data
├── overlay.js               # UI: toolbar, library, settings, command palette
├── frame.js                 # Player/frame helpers (autoplay, skip, resume)
├── installer.py             # PyQt6 installer
├── pack.py                  # Packages the app into payload.zip
├── make_icon.py             # Icon generator
├── build.bat / run.bat / debug.bat
├── requirements.txt
├── requirements-build.txt
└── .github/workflows/build.yml
```

## 🏆 Credits

- **Created by [cybersec pwner](https://github.com/CyberSecPwnerrr)** — design, development and maintenance
- [pywebview](https://github.com/r0x0r/pywebview) — WebView2 hosting
- [pythonnet](https://github.com/pythonnet/pythonnet) — .NET interop
- [PyInstaller](https://pyinstaller.org/) — packaging
- [PyQt6](https://www.riverbankcomputing.com/software/pyqt/) — installer UI
- [Pillow](https://python-pillow.org/) — icon generation
- [Lucide](https://lucide.dev/) — icon set
- [Microsoft Edge WebView2](https://developer.microsoft.com/microsoft-edge/webview2/) — rendering engine

## 📄 License

Released under the [MIT License](LICENSE).

<div align="center">

Made with 💜 by **cybersec pwner**

</div>
