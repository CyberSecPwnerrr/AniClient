import sys, os, json, zipfile, subprocess, shutil, tempfile, urllib.request
from pathlib import Path

try:
    import winreg
except ImportError:
    winreg = None

from PyQt6.QtCore import Qt, QThread, pyqtSignal, QPropertyAnimation, QEasingCurve, QRectF, QTimer
from PyQt6.QtGui import QColor, QIcon, QPixmap, QPainter, QLinearGradient, QBrush, QPainterPath
from PyQt6.QtWidgets import (
    QApplication, QWidget, QVBoxLayout, QHBoxLayout, QLabel, QPushButton, QLineEdit, QCheckBox,
    QComboBox, QStackedWidget, QProgressBar, QFileDialog, QColorDialog, QMessageBox, QGraphicsOpacityEffect,
)

APP = "AniClient"
VER = "3.0.0"
NOWIN = 0x08000000
THEMES = {
    "Midnight": "#7c5cff", "AMOLED": "#7c5cff", "Light": "#5b6cff", "Nord": "#88c0d0", "Sakura": "#ff7ac6",
    "Ocean": "#35d0ff", "Forest": "#2ee6a6", "Dracula": "#bd93f9", "Sunset": "#ffb347", "Cyberpunk": "#ff2bd6",
    "Mocha": "#cba6f7", "Rose Pine": "#eb6f92", "Solarized": "#b58900", "Matcha": "#6aa84f", "Ice": "#3d8bfd", "Crimson": "#ff5a5f",
}
QSS = """
QWidget{background:#12121f;color:#ecebff;font-family:"Segoe UI";font-size:13px;}
QLabel{background:transparent;}
QLineEdit,QComboBox{background:#1d1d33;border:1px solid #34345a;border-radius:10px;padding:9px 12px;}
QLineEdit:focus,QComboBox:focus{border:1px solid #7c5cff;}
QComboBox QAbstractItemView{background:#1d1d33;selection-background-color:#7c5cff;}
QPushButton{background:#26264a;border:none;border-radius:10px;padding:10px 22px;}
QPushButton:hover{background:#3a3a70;}
QPushButton#primary{background:#7c5cff;color:white;font-weight:700;}
QPushButton#primary:hover{background:#9276ff;}
QPushButton:disabled{background:#1c1c30;color:#666688;}
QCheckBox{spacing:10px;}
QCheckBox::indicator{width:18px;height:18px;border-radius:5px;border:1px solid #7c5cff;}
QCheckBox::indicator:checked{background:#7c5cff;}
QProgressBar{background:#1d1d33;border:none;border-radius:6px;height:12px;text-align:center;color:transparent;}
QProgressBar::chunk{background:qlineargradient(x1:0,y1:0,x2:1,y2:0,stop:0 #7c5cff,stop:1 #ff5fa2);border-radius:6px;}
"""


def icon_pixmap(size=256):
    pm = QPixmap(size, size)
    pm.fill(Qt.GlobalColor.transparent)
    p = QPainter(pm)
    p.setRenderHint(QPainter.RenderHint.Antialiasing)
    g = QLinearGradient(0, 0, size, size)
    g.setColorAt(0, QColor("#7c5cff"))
    g.setColorAt(1, QColor("#ff5fa2"))
    path = QPainterPath()
    path.addRoundedRect(QRectF(size * 0.04, size * 0.04, size * 0.92, size * 0.92), size * 0.24, size * 0.24)
    p.fillPath(path, QBrush(g))
    tri = QPainterPath()
    tri.moveTo(size * 0.40, size * 0.30)
    tri.lineTo(size * 0.72, size * 0.50)
    tri.lineTo(size * 0.40, size * 0.70)
    tri.closeSubpath()
    p.fillPath(tri, QColor("white"))
    p.end()
    return pm


def ps(cmd):
    return subprocess.run(["powershell", "-NoProfile", "-ExecutionPolicy", "Bypass", "-Command", cmd],
                          capture_output=True, text=True, creationflags=NOWIN)


def special_dir(name, fallback):
    try:
        r = ps("[Environment]::GetFolderPath('%s')" % name).stdout.strip()
        return Path(r) if r else fallback
    except Exception:
        return fallback


WV2_ID = "{F3017226-FE2A-4295-8BDF-00C3A9A7E4C5}"
WV2_URL = "https://go.microsoft.com/fwlink/p/?LinkId=2124703"


def webview2_installed():
    if not winreg:
        return True
    keys = (
        (winreg.HKEY_LOCAL_MACHINE, "SOFTWARE\\WOW6432Node\\Microsoft\\EdgeUpdate\\Clients\\" + WV2_ID),
        (winreg.HKEY_LOCAL_MACHINE, "SOFTWARE\\Microsoft\\EdgeUpdate\\Clients\\" + WV2_ID),
        (winreg.HKEY_CURRENT_USER, "SOFTWARE\\Microsoft\\EdgeUpdate\\Clients\\" + WV2_ID),
    )
    for hive, key in keys:
        try:
            k = winreg.OpenKey(hive, key)
            v, _ = winreg.QueryValueEx(k, "pv")
            winreg.CloseKey(k)
            if v and v != "0.0.0.0":
                return True
        except OSError:
            pass
    return False


def install_webview2():
    f = Path(tempfile.gettempdir()) / "MicrosoftEdgeWebview2Setup.exe"
    urllib.request.urlretrieve(WV2_URL, str(f))
    subprocess.run([str(f), "/silent", "/install"], creationflags=NOWIN, check=False)


def make_lnk(lnk, target, workdir, icon):
    q = lambda x: str(x).replace("'", "''")
    ps("$s=(New-Object -ComObject WScript.Shell).CreateShortcut('%s');$s.TargetPath='%s';$s.WorkingDirectory='%s';"
       "$s.IconLocation='%s,0';$s.Description='%s';$s.Save()" % (q(lnk), q(target), q(workdir), q(icon), APP))


class Worker(QThread):
    prog = pyqtSignal(int, str)
    done = pyqtSignal(bool, str)

    def __init__(self, o):
        super().__init__()
        self.o = o

    def run(self):
        try:
            o = self.o
            payload = Path(getattr(sys, "_MEIPASS", Path(__file__).parent)) / "payload.zip"
            if not payload.exists():
                raise RuntimeError("payload.zip is missing from this installer")
            dest = Path(o["install"])
            dest.mkdir(parents=True, exist_ok=True)
            with zipfile.ZipFile(payload) as z:
                names = [n for n in z.namelist() if not n.endswith("/")]
                for i, n in enumerate(names):
                    parts = Path(n).parts[1:]
                    if not parts:
                        continue
                    t = dest.joinpath(*parts)
                    t.parent.mkdir(parents=True, exist_ok=True)
                    with z.open(n) as a, open(t, "wb") as b:
                        shutil.copyfileobj(a, b)
                    self.prog.emit(int(i * 80 / max(len(names), 1)), t.name)
            exe = dest / "AniClient.exe"
            if o["wv2"] and not webview2_installed():
                self.prog.emit(81, "Installing Microsoft WebView2 Runtime")
                try:
                    install_webview2()
                except Exception:
                    pass
            self.prog.emit(82, "Saving settings")
            appdata = Path(os.environ.get("APPDATA", str(Path.home())))
            sd = appdata / APP
            sd.mkdir(parents=True, exist_ok=True)
            sf = sd / "settings.json"
            cfg = {}
            if sf.exists():
                try:
                    cfg = json.loads(sf.read_text("utf-8"))
                except Exception:
                    cfg = {}
            cfg.update({"theme": o["theme"], "accent": o["accent"], "download_dir": o["download"]})
            sf.write_text(json.dumps(cfg, indent=2), "utf-8")
            Path(o["download"]).mkdir(parents=True, exist_ok=True)
            self.prog.emit(88, "Creating shortcuts")
            desk = special_dir("Desktop", Path.home() / "Desktop") / (APP + ".lnk")
            start = appdata / "Microsoft" / "Windows" / "Start Menu" / "Programs" / (APP + ".lnk")
            if o["desktop"]:
                make_lnk(desk, exe, dest, exe)
            if o["start"]:
                start.parent.mkdir(parents=True, exist_ok=True)
                make_lnk(start, exe, dest, exe)
            self.prog.emit(94, "Registering uninstaller")
            bat = dest / "Uninstall.bat"
            bat.write_text(
                '@echo off\r\ntitle Uninstall %s\r\ntaskkill /f /im AniClient.exe >nul 2>nul\r\n'
                'del "%s" >nul 2>nul\r\ndel "%s" >nul 2>nul\r\n'
                'reg delete "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\%s" /f >nul 2>nul\r\n'
                'choice /m "Also delete your settings and watch history"\r\nif errorlevel 2 goto skip\r\n'
                'rmdir /s /q "%s"\r\n:skip\r\ncd /d "%%TEMP%%"\r\n(goto) 2>nul & rmdir /s /q "%s"\r\n'
                % (APP, desk, start, APP, sd, dest), "utf-8")
            if winreg:
                k = winreg.CreateKey(winreg.HKEY_CURRENT_USER, r"Software\Microsoft\Windows\CurrentVersion\Uninstall\%s" % APP)
                for n, v in (("DisplayName", APP), ("DisplayVersion", VER), ("Publisher", APP), ("InstallLocation", str(dest)),
                             ("DisplayIcon", str(exe)), ("UninstallString", '"%s"' % bat)):
                    winreg.SetValueEx(k, n, 0, winreg.REG_SZ, v)
                winreg.SetValueEx(k, "NoModify", 0, winreg.REG_DWORD, 1)
                winreg.SetValueEx(k, "NoRepair", 0, winreg.REG_DWORD, 1)
                winreg.CloseKey(k)
            self.prog.emit(100, "Done")
            self.done.emit(True, "")
        except PermissionError:
            self.done.emit(False, "A file is in use. Close AniClient and try again.")
        except Exception as e:
            self.done.emit(False, str(e))


class Wizard(QWidget):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("AniClient Setup")
        self.setWindowIcon(QIcon(icon_pixmap()))
        self.setFixedSize(680, 480)
        self.accent = "#7c5cff"
        self.installed = False
        self.worker = None
        root = QVBoxLayout(self)
        root.setContentsMargins(0, 0, 0, 0)
        root.setSpacing(0)
        head = QWidget()
        head.setFixedHeight(96)
        head.setStyleSheet("background:qlineargradient(x1:0,y1:0,x2:1,y2:1,stop:0 #2a1f6b,stop:1 #7a2a5e);")
        hl = QHBoxLayout(head)
        hl.setContentsMargins(28, 0, 28, 0)
        ic = QLabel()
        ic.setPixmap(icon_pixmap(64).scaled(64, 64, Qt.AspectRatioMode.KeepAspectRatio, Qt.TransformationMode.SmoothTransformation))
        t = QLabel("<span style='font-size:24px;font-weight:700;color:white'>AniClient</span><br><span style='color:#d8d4ff'>Setup %s</span>" % VER)
        hl.addWidget(ic)
        hl.addSpacing(14)
        hl.addWidget(t, 1)
        root.addWidget(head)
        self.stack = QStackedWidget()
        root.addWidget(self.stack, 1)
        self.eff = QGraphicsOpacityEffect(self.stack)
        self.stack.setGraphicsEffect(self.eff)
        self.build_pages()
        foot = QHBoxLayout()
        foot.setContentsMargins(24, 10, 24, 18)
        self.back = QPushButton("Back")
        self.back.clicked.connect(lambda: self.go(self.stack.currentIndex() - 1))
        self.nxt = QPushButton("Next")
        self.nxt.setObjectName("primary")
        self.nxt.clicked.connect(self.next)
        foot.addWidget(self.back)
        foot.addStretch()
        foot.addWidget(self.nxt)
        root.addLayout(foot)
        self.setStyleSheet(QSS)
        self.go(0, False)

    def row(self, label, edit, browse=True):
        w = QWidget()
        l = QVBoxLayout(w)
        l.setContentsMargins(0, 0, 0, 0)
        l.addWidget(QLabel(label))
        r = QHBoxLayout()
        r.addWidget(edit, 1)
        if browse:
            b = QPushButton("Browse")

            def br():
                d = QFileDialog.getExistingDirectory(self, "Select folder", edit.text())
                if d:
                    edit.setText(str(Path(d)))

            b.clicked.connect(br)
            r.addWidget(b)
        l.addLayout(r)
        return w

    def build_pages(self):
        p0 = QWidget()
        l = QVBoxLayout(p0)
        l.setContentsMargins(36, 30, 36, 10)
        l.addWidget(QLabel("<h2>Welcome</h2><p>This will install AniClient, a fast themed desktop client with liquid glass, "
                           "ad blocking, watch history and a command palette.</p><p>No administrator rights needed.</p>"))
        l.addStretch()
        self.stack.addWidget(p0)

        p1 = QWidget()
        l = QVBoxLayout(p1)
        l.setContentsMargins(36, 24, 36, 10)
        l.addWidget(QLabel("<h2>Locations</h2>"))
        self.e_install = QLineEdit(str(Path(os.environ.get("LOCALAPPDATA", str(Path.home()))) / "Programs" / APP))
        self.e_dl = QLineEdit(str(Path.home() / "Downloads" / APP))
        l.addWidget(self.row("Install folder", self.e_install))
        l.addSpacing(10)
        l.addWidget(self.row("Download folder (where saved files go)", self.e_dl))
        l.addStretch()
        self.stack.addWidget(p1)

        p2 = QWidget()
        l = QVBoxLayout(p2)
        l.setContentsMargins(36, 24, 36, 10)
        l.addWidget(QLabel("<h2>Customize</h2>"))
        l.addWidget(QLabel("Theme"))
        self.c_theme = QComboBox()
        self.c_theme.addItems(list(THEMES))
        self.c_theme.currentTextChanged.connect(self.theme_changed)
        l.addWidget(self.c_theme)
        l.addSpacing(8)
        self.b_accent = QPushButton("Accent color  " + self.accent)
        self.b_accent.clicked.connect(self.pick_accent)
        self.paint_accent()
        l.addWidget(self.b_accent)
        l.addSpacing(8)
        self.k_desk = QCheckBox("Create a desktop shortcut")
        self.k_desk.setChecked(True)
        self.k_start = QCheckBox("Create a Start Menu shortcut")
        self.k_start.setChecked(True)
        self.k_wv2 = QCheckBox("Install Microsoft WebView2 Runtime if missing (needed for video)")
        self.k_wv2.setChecked(True)
        l.addWidget(self.k_wv2)
        self.k_run = QCheckBox("Launch AniClient when finished")
        self.k_run.setChecked(True)
        for c in (self.k_desk, self.k_start, self.k_run):
            l.addWidget(c)
        l.addStretch()
        self.stack.addWidget(p2)

        p3 = QWidget()
        l = QVBoxLayout(p3)
        l.setContentsMargins(36, 40, 36, 10)
        self.l_status = QLabel("<h2>Installing</h2>")
        self.bar = QProgressBar()
        self.bar.setRange(0, 100)
        self.l_file = QLabel("")
        l.addWidget(self.l_status)
        l.addSpacing(10)
        l.addWidget(self.bar)
        l.addWidget(self.l_file)
        l.addStretch()
        self.stack.addWidget(p3)

        p4 = QWidget()
        l = QVBoxLayout(p4)
        l.setContentsMargins(36, 30, 36, 10)
        self.l_end = QLabel("")
        self.l_end.setWordWrap(True)
        l.addWidget(self.l_end)
        l.addStretch()
        self.stack.addWidget(p4)

    def paint_accent(self):
        self.b_accent.setText("Accent color  " + self.accent)
        self.b_accent.setStyleSheet("QPushButton{background:%s;color:white;font-weight:700;}" % self.accent)

    def theme_changed(self, n):
        self.accent = THEMES.get(n, self.accent)
        self.paint_accent()

    def pick_accent(self):
        c = QColorDialog.getColor(QColor(self.accent), self)
        if c.isValid():
            self.accent = c.name()
            self.paint_accent()

    def go(self, i, animate=True):
        i = max(0, min(self.stack.count() - 1, i))
        self.stack.setCurrentIndex(i)
        if animate:
            a = QPropertyAnimation(self.eff, b"opacity", self)
            a.setDuration(280)
            a.setStartValue(0.0)
            a.setEndValue(1.0)
            a.setEasingCurve(QEasingCurve.Type.OutCubic)
            a.start()
            self._a = a
        self.back.setVisible(i in (1, 2))
        self.nxt.setEnabled(True)
        self.nxt.setText({0: "Next", 1: "Next", 2: "Install", 3: "Installing", 4: "Finish"}[i])
        if i == 3:
            self.back.hide()
            self.nxt.setEnabled(False)

    def next(self):
        i = self.stack.currentIndex()
        if i == 2:
            self.start()
        elif i == 4:
            if self.installed and self.k_run.isChecked():
                subprocess.Popen([str(Path(self.e_install.text()) / "AniClient.exe")], cwd=self.e_install.text(), creationflags=NOWIN)
            self.close()
        else:
            self.go(i + 1)

    def start(self):
        self.go(3)
        o = {
            "install": self.e_install.text().strip(), "download": self.e_dl.text().strip(), "theme": self.c_theme.currentText(),
            "accent": self.accent, "desktop": self.k_desk.isChecked(), "start": self.k_start.isChecked(), "wv2": self.k_wv2.isChecked(),
        }
        self.worker = Worker(o)
        self.worker.prog.connect(lambda n, s: (self.bar.setValue(n), self.l_file.setText(s)))
        self.worker.done.connect(self.finished)
        self.worker.start()

    def finished(self, ok, msg):
        self.installed = ok
        if ok:
            self.l_end.setText("<h2>All set</h2><p>AniClient was installed to:<br>%s</p><p>Uninstall any time from Windows Settings, Apps.</p>" % self.e_install.text())
        else:
            self.l_end.setText("<h2>Install failed</h2><p>%s</p>" % msg)
        self.go(4)


def main():
    app = QApplication(sys.argv)
    app.setApplicationName("AniClient Setup")
    w = Wizard()
    w.show()
    sys.exit(app.exec())


if __name__ == "__main__":
    main()
