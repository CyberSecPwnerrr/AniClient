import sys, os, json, threading, ctypes, traceback, time
from pathlib import Path
from urllib.parse import urlparse

APP = "AniClient"
BASE = Path(os.environ.get("APPDATA") or (Path.home() / ".config")) / APP
BASE.mkdir(parents=True, exist_ok=True)
WWW = BASE / "www"
WWW.mkdir(exist_ok=True)
CFG_FILE = BASE / "settings.json"
DATA_FILE = BASE / "data.json"
LOG_FILE = BASE / "log.txt"
START_URL = "https://aniclient.local/start.html"

DEFAULTS = {
    "home": "https://aniworld.to",
    "theme": "Midnight",
    "accent": "#7c5cff",
    "c_bg": "#101020", "c_panel": "#1a1a30", "c_text": "#eeeeff", "c_muted": "#8888aa",
    "font": "Segoe UI",
    "radius": 12,
    "glass_alpha": 62,
    "blur": 18,
    "animations": True,
    "dock_pin": False,
    "site_glass": True,
    "blur_thumbs": False,
    "hide_scroll": False,
    "invert": False,
    "adblock": True,
    "cosmetic": True,
    "popup_block": True,
    "hide_cookie": True,
    "lock_domain": False,
    "track_history": True,
    "autoplay": True,
    "autonext": False,
    "resume": True,
    "skipbtn": True,
    "skip": 85,
    "speed": 1.0,
    "volume": 100,
    "use_start_page": True,
    "search_url": "https://aniworld.to/search?q=%s",
    "download_dir": str(Path.home() / "Downloads"),
    "ask_download": False,
    "start_max": True,
    "on_top": False,
    "safe_mode": False,
    "compat": False,
    "sleep": 0,
    "custom_css": "",
    "custom_js": "",
}
DATA_DEFAULTS = {"history": [], "favs": [], "watch_seconds": 0}
FRAME_KEYS = ("compat", "cosmetic", "popup_block", "hide_cookie", "autoplay", "autonext", "resume", "skipbtn", "skip", "speed", "volume", "accent")

BLOCK = [
    "doubleclick.net", "googlesyndication.com", "googleadservices.com", "googletagservices.com", "adservice.google.com",
    "google-analytics.com", "googletagmanager.com", "popads.net", "popcash.net", "propellerads.com", "propellerclick.com",
    "exoclick.com", "exosrv.com", "exdynsrv.com", "juicyads.com", "adsterra.com", "onclickads.net", "clickadu.com",
    "trafficjunky.com", "adnxs.com", "taboola.com", "outbrain.com", "mgid.com", "histats.com", "yllix.com", "hilltopads.net",
    "adcash.com", "revcontent.com", "a-ads.com", "ad-maven.com", "admaven.com", "adsco.re", "realsrv.com", "tsyndicate.com",
    "monetag.com", "adskeeper.com", "bidvertiser.com", "zeropark.com", "pushwoosh.com", "notix.io", "trafficstars.com",
    "adform.net", "criteo.com", "criteo.net", "scorecardresearch.com", "hotjar.com", "amazon-adsystem.com", "adsrvr.org",
    "rubiconproject.com", "pubmatic.com", "openx.net", "casalemedia.com", "33across.com", "smartadserver.com", "moatads.com",
    "serving-sys.com", "yieldmo.com", "teads.tv", "sharethrough.com", "lijit.com", "gumgum.com", "bidswitch.net",
    "contextweb.com", "advertising.com", "adtng.com", "adspyglass.com", "clickaine.com", "plugrush.com", "oclasrv.com",
    "betteradsystem.com", "cdn4ads.com", "profitableratecpm.com", "highperformanceformat.com", "effectivegatecpm.com",
    "profitablecpmrate.com", "displayvertising.com", "highcpmrevenuegate.com", "acscdn.com", "pemsrv.com", "pubfuture.com",
    "adtrafficquality.google", "onclkds.com", "popunder.net", "tubecorporate.com", "trafficfactory.biz", "ads.yahoo.com",
    "adnium.com", "adxpansion.com", "ad.gt", "clksite.com", "mc.yandex.ru", "an.yandex.ru", "inpagepush.com", "pushails.com",
    "richads.com", "richpush.co", "vidazoo.com", "rtbhouse.com", "yandexadexchange.net", "ero-advertising.com", "evadav.com",
    "kadam.net", "galaksion.com", "jads.co", "mobiads.com", "ad-score.com", "bannersnack.com", "imasdk-ads.com",
]


def _redirect_streams():
    try:
        f = open(LOG_FILE, "a", encoding="utf-8", buffering=1)
        if sys.stdout is None:
            sys.stdout = f
        if sys.stderr is None:
            sys.stderr = f
        import faulthandler
        faulthandler.enable(file=f)
    except Exception:
        pass


def log(msg):
    try:
        with open(LOG_FILE, "a", encoding="utf-8") as f:
            f.write("%s %s\n" % (time.strftime("%H:%M:%S"), msg))
    except Exception:
        pass


def load_json(p, d):
    try:
        x = json.loads(p.read_text("utf-8"))
        r = dict(d)
        r.update(x)
        return r
    except Exception:
        return dict(d)


def save_json(p, x):
    try:
        p.write_text(json.dumps(x, ensure_ascii=False), "utf-8")
    except Exception:
        log("save failed " + traceback.format_exc())


_redirect_streams()


def _hook(t, v, tb):
    log("UNCAUGHT " + "".join(traceback.format_exception(t, v, tb)))


sys.excepthook = _hook
threading.excepthook = lambda a: _hook(a.exc_type, a.exc_value, a.exc_traceback)

cfg = load_json(CFG_FILE, DEFAULTS)
data = load_json(DATA_FILE, DATA_DEFAULTS)


def resource(name):
    base = Path(getattr(sys, "_MEIPASS", Path(__file__).parent))
    return (base / name).read_text("utf-8")


def frame_js():
    if cfg["compat"]:
        return None
    c = {k: cfg[k] for k in FRAME_KEYS}
    c["popup"] = bool(cfg["popup_block"])
    return resource("frame.js").replace("__CFG__", json.dumps(c))


def message_box(text, icon=0x10):
    try:
        ctypes.windll.user32.MessageBoxW(0, text, APP, icon)
    except Exception:
        print(text)


class Host:
    def __init__(self, window):
        self.w = window
        self.ctl = None
        self.core = None
        self.ids = []
        self.fs = False
        self.mini_size = None
        self.timer = None
        self.lock = threading.Lock()
        self.loaded = threading.Event()
        self.allow = {}

    def find_ctl(self):
        form = None
        try:
            import webview.platforms.winforms as wf
            form = wf.BrowserView.instances.get(self.w.uid)
        except Exception:
            log("instances lookup failed " + traceback.format_exc())
        if form is None:
            form = getattr(self.w, "native", None)
        if form is None:
            return None
        try:
            for c in form.Controls:
                if c.GetType().Name == "WebView2":
                    return c
        except Exception:
            log("controls scan failed " + traceback.format_exc())
        b = getattr(form, "browser", None)
        return getattr(b, "web_view", None)

    def ui(self, fn, timeout=10):
        from System import Action
        box = []
        done = threading.Event()

        def run():
            try:
                box.append(fn())
            except Exception:
                log("ui error " + traceback.format_exc())
            finally:
                done.set()

        self.ctl.BeginInvoke(Action(run))
        if not done.wait(timeout):
            log("ui call timed out")
        return box[0] if box else None

    def boot(self):
        try:
            log("boot start")
            for _ in range(300):
                try:
                    if self.ctl is None:
                        self.ctl = self.find_ctl()
                    if self.ctl is not None and self.ctl.IsHandleCreated:
                        self.core = self.ui(lambda: self.ctl.CoreWebView2, 3)
                        if self.core is not None:
                            break
                except Exception:
                    log("poll error " + traceback.format_exc())
                time.sleep(0.1)
            if self.core is None:
                raise RuntimeError("WebView2 did not initialise (control found: %s)" % (self.ctl is not None))
            log("core ready")
            if not self.loaded.wait(20):
                log("initial page load event not seen, continuing")
            (WWW / "start.html").write_text(
                "<!doctype html><html><head><meta charset='utf-8'><title>AniClient</title></head><body style='margin:0;background:#101020'></body></html>",
                "utf-8")
            self.ui(self.configure)
            log("configured")
            self.add_scripts()
            log("scripts added " + str(len(self.ids)))
            target = START_URL if cfg["use_start_page"] else cfg["home"]
            self.ui(lambda: self.core.Navigate(target))
            log("navigating to " + target)
            if cfg["sleep"] > 0:
                self.set_sleep(cfg["sleep"])
        except Exception:
            log("boot failed " + traceback.format_exc())
            message_box("AniClient could not start the web engine.\n\n" + traceback.format_exc()[-600:] + "\nFull log:\n" + str(LOG_FILE))

    def configure(self):
        from Microsoft.Web.WebView2.Core import CoreWebView2WebResourceContext, CoreWebView2HostResourceAccessKind
        core = self.core

        def sub(name, handler):
            try:
                ev = getattr(core, name)
                ev += handler
            except Exception:
                log("subscribe failed %s %s" % (name, traceback.format_exc()))

        sub("NewWindowRequested", self.on_new)
        sub("NavigationStarting", self.on_nav)
        sub("PermissionRequested", self.on_perm)
        sub("ContainsFullScreenElementChanged", self.on_fs)
        sub("DocumentTitleChanged", self.on_title)
        sub("WebMessageReceived", self.on_msg)
        sub("DownloadStarting", self.on_dl)
        try:
            core.SetVirtualHostNameToFolderMapping("aniclient.local", str(WWW), CoreWebView2HostResourceAccessKind.Allow)
        except Exception:
            log("virtual host failed " + traceback.format_exc())
        try:
            st = core.Settings
            for name, val in (("AreDevToolsEnabled", False), ("IsStatusBarEnabled", False), ("IsPasswordAutosaveEnabled", False), ("IsGeneralAutofillEnabled", False)):
                try:
                    setattr(st, name, val)
                except Exception:
                    pass
        except Exception:
            log("settings failed " + traceback.format_exc())
        ok = 0
        for d in BLOCK:
            try:
                core.AddWebResourceRequestedFilter("*%s/*" % d, CoreWebView2WebResourceContext.All)
                ok += 1
            except Exception:
                pass
        log("filters added %d" % ok)
        sub("WebResourceRequested", self.on_req)

    def add_scripts(self):
        with self.lock:
            for i in self.ids:
                self.ui(lambda i=i: self.core.RemoveScriptToExecuteOnDocumentCreated(i))
            self.ids = []
            for src in (frame_js(), resource("overlay.js")):
                if not src:
                    continue
                holder = []
                self.ui(lambda src=src: holder.append(self.core.AddScriptToExecuteOnDocumentCreatedAsync(src)))
                if holder and holder[0].Wait(10000):
                    self.ids.append(str(holder[0].Result))

    def on_req(self, sender, args):
        if not cfg["adblock"] or cfg["compat"]:
            return
        try:
            if "Document" in str(args.ResourceContext):
                return
            uri = str(args.Request.Uri).lower()
            if "cloudflare" in uri or "/cdn-cgi/" in uri or "aniworld.to" in uri:
                return
            args.Response = self.core.Environment.CreateWebResourceResponse(None, 403, "Blocked", "")
        except Exception:
            log("block failed " + traceback.format_exc())

    def host_ok(self, host):
        if not host:
            return True
        if host.endswith("aniworld.to") or host == "aniclient.local" or "cloudflare" in host:
            return True
        return self.allow.get(host, 0) > time.time()

    def on_nav(self, sender, args):
        if cfg["compat"]:
            return
        try:
            host = (urlparse(str(args.Uri)).hostname or "").lower()
            user = bool(args.IsUserInitiated)
            redirected = bool(args.IsRedirected)
            if cfg["lock_domain"] and user and not self.host_ok(host):
                args.Cancel = True
            elif cfg["popup_block"] and not user and not redirected and not self.host_ok(host):
                log("blocked script navigation to " + host)
                args.Cancel = True
        except Exception:
            log("nav handler failed " + traceback.format_exc())

    def on_perm(self, sender, args):
        try:
            from Microsoft.Web.WebView2.Core import CoreWebView2PermissionState
            args.State = CoreWebView2PermissionState.Deny
        except Exception:
            pass

    def on_new(self, sender, args):
        try:
            args.Handled = True
            u = str(args.Uri)
            host = (urlparse(u).hostname or "").lower()
            if cfg["popup_block"] and not cfg["compat"] and not host.endswith("aniworld.to"):
                log("blocked popup " + host)
                return
            self.core.Navigate(u)
        except Exception:
            log("new window handler failed " + traceback.format_exc())

    def on_dl(self, sender, args):
        if cfg["ask_download"]:
            return
        try:
            name = os.path.basename(str(args.ResultFilePath))
            Path(cfg["download_dir"]).mkdir(parents=True, exist_ok=True)
            args.ResultFilePath = str(Path(cfg["download_dir"]) / name)
            args.Handled = True
        except Exception:
            log("download failed " + traceback.format_exc())

    def on_fs(self, sender, args):
        try:
            on = bool(self.core.ContainsFullScreenElement)
            if on != self.fs:
                self.fs = on
                self.w.toggle_fullscreen()
        except Exception:
            log("fullscreen failed " + traceback.format_exc())

    def on_title(self, sender, args):
        try:
            t = str(self.core.DocumentTitle)
            self.w.set_title((t + " \u2014 " + APP) if t else APP)
        except Exception:
            pass

    def post(self, obj):
        self.core.PostWebMessageAsJson(json.dumps(obj))

    def set_sleep(self, minutes):
        if self.timer:
            self.timer.cancel()
        self.timer = None
        if minutes > 0:
            self.timer = threading.Timer(minutes * 60, lambda: self.w.destroy())
            self.timer.daemon = True
            self.timer.start()

    def on_msg(self, sender, args):
        try:
            m = json.loads(args.WebMessageAsJson)
        except Exception:
            return
        try:
            t = m.get("t")
            if t == "hello":
                self.post({"t": "state", "cfg": cfg, "data": data})
            elif t == "cfg":
                new = m.get("cfg") or {}
                changed = [k for k in FRAME_KEYS if new.get(k, cfg.get(k)) != cfg.get(k)]
                old_top, old_sleep = cfg["on_top"], cfg["sleep"]
                for k, v in new.items():
                    if k in DEFAULTS and type(v) == type(DEFAULTS[k]) or (k in DEFAULTS and isinstance(DEFAULTS[k], float) and isinstance(v, (int, float))):
                        cfg[k] = v
                save_json(CFG_FILE, cfg)
                if cfg["on_top"] != old_top:
                    self.w.on_top = bool(cfg["on_top"])
                if cfg["sleep"] != old_sleep:
                    self.set_sleep(int(cfg["sleep"]))
                if changed:
                    threading.Thread(target=self.add_scripts, daemon=True).start()
            elif t == "data":
                d = m.get("data") or {}
                if isinstance(d.get("history"), list):
                    data["history"] = d["history"][-5000:]
                if isinstance(d.get("favs"), list):
                    data["favs"] = d["favs"][:500]
                if isinstance(d.get("watch_seconds"), (int, float)):
                    data["watch_seconds"] = d["watch_seconds"]
                save_json(DATA_FILE, data)
            elif t == "reset":
                cfg.clear()
                cfg.update(DEFAULTS)
                save_json(CFG_FILE, cfg)
                self.post({"t": "cfg", "cfg": cfg})
                threading.Thread(target=self.add_scripts, daemon=True).start()
            elif t == "allow":
                h = (urlparse(str(m.get("u", ""))).hostname or "").lower()
                if h:
                    self.allow[h] = time.time() + 8
            elif t == "zoom":
                self.ctl.ZoomFactor = float(m.get("v", 1.0))
            elif t == "mute":
                self.core.IsMuted = bool(m.get("on"))
            elif t == "boss":
                self.core.IsMuted = True
                self.w.minimize()
            elif t == "mini":
                if m.get("on"):
                    self.mini_size = (self.w.width, self.w.height)
                    self.w.on_top = True
                    self.w.resize(520, 330)
                else:
                    self.w.on_top = bool(cfg["on_top"])
                    if self.mini_size:
                        self.w.resize(*self.mini_size)
            elif t == "openfolder":
                Path(cfg["download_dir"]).mkdir(parents=True, exist_ok=True)
                os.startfile(cfg["download_dir"])
            elif t == "cleardata":
                self.core.CookieManager.DeleteAllCookies()
                self.post({"t": "toast", "m": "Cookies cleared"})
            elif t == "quit":
                self.w.destroy()
        except Exception:
            log("message failed " + traceback.format_exc())


def main():
    try:
        import webbrowser

        def _noop(*a, **k):
            return False

        webbrowser.open = _noop
        webbrowser.open_new = _noop
        webbrowser.open_new_tab = _noop
        import webview
    except Exception:
        message_box("The pywebview package is missing. Run: pip install -r requirements.txt")
        return
    args = ["--autoplay-policy=no-user-gesture-required", "--disable-features=Translate"]
    if cfg["safe_mode"] or "--safe" in sys.argv:
        args.append("--disable-gpu")
    os.environ["WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS"] = " ".join(args)
    w = webview.create_window(
        APP, html="<html><body style='margin:0;background:#101020'></body></html>", width=1280, height=800,
        min_size=(640, 420), maximized=bool(cfg["start_max"]), on_top=bool(cfg["on_top"]),
        background_color="#101020", text_select=True,
    )
    h = Host(w)
    w.events.loaded += lambda: h.loaded.set()
    log("starting gui")
    try:
        webview.start(h.boot, gui="edgechromium", storage_path=str(BASE / "profile"), private_mode=False, debug="--debug" in sys.argv)
    except Exception:
        log("start failed " + traceback.format_exc())
        message_box(
            "AniClient needs the Microsoft Edge WebView2 Runtime.\nInstall it from:\nhttps://go.microsoft.com/fwlink/p/?LinkId=2124703\n\nDetails: " + str(LOG_FILE))


if __name__ == "__main__":
    try:
        main()
    except Exception:
        log("fatal " + traceback.format_exc())
        message_box("AniClient crashed on startup:\n\n" + traceback.format_exc()[-700:] + "\nLog: " + str(LOG_FILE))
