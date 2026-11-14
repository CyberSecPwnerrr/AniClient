(function () {
  if (window !== window.top || window.__ac_ui) return;
  window.__ac_ui = 1;
  var br = window.chrome && window.chrome.webview;
  function send(o) { try { br.postMessage(o); } catch (e) {} }

  var THEMES = {
    Midnight: ['#0f1020', '#181a2e', '#e8e9f5', '#8a8ca8'], AMOLED: ['#000000', '#0b0b0b', '#f2f2f2', '#7a7a7a'],
    Light: ['#f4f5fb', '#ffffff', '#1b1c2b', '#6b6e85'], Nord: ['#2e3440', '#3b4252', '#eceff4', '#9aa5b8'],
    Sakura: ['#2a1626', '#3a1f35', '#ffe8f3', '#c79ab5'], Ocean: ['#071a2b', '#0c2740', '#e3f4ff', '#7fa6c4'],
    Forest: ['#0e1c15', '#16291f', '#e6f5ea', '#86a893'], Dracula: ['#282a36', '#343746', '#f8f8f2', '#8e92b0'],
    Sunset: ['#2b1320', '#3d1a2b', '#fff0e6', '#d09a8a'], Cyberpunk: ['#0b0614', '#170c2b', '#f4e9ff', '#a78bc9'],
    Mocha: ['#1e1e2e', '#313244', '#cdd6f4', '#9399b2'], 'Rose Pine': ['#191724', '#26233a', '#e0def4', '#908caa'],
    Solarized: ['#002b36', '#073642', '#eee8d5', '#93a1a1'], Matcha: ['#f1f6ec', '#fbfdf8', '#2b3a2a', '#6f8a6b'],
    Ice: ['#eef6fb', '#ffffff', '#17303f', '#5f7f93'], Crimson: ['#16090b', '#2a1013', '#ffe9ea', '#c98d92']
  };
  var ACCENTS = { Violet: '#7c5cff', Pink: '#ff5fa2', Cyan: '#35d0ff', Mint: '#2ee6a6', Amber: '#ffb347', Red: '#ff5a5f', Lime: '#9be15d', Blue: '#4c8dff' };
  var I = {
    left: '<path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>',
    right: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
    reload: '<path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/>',
    home: '<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
    search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
    star: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
    play: '<polygon points="6 3 20 12 6 21 6 3"/>',
    next: '<polygon points="5 4 15 12 5 20 5 4"/><line x1="19" x2="19" y1="5" y2="19"/>',
    shuffle: '<polyline points="16 3 21 3 21 8"/><line x1="4" x2="21" y1="20" y2="3"/><polyline points="21 16 21 21 16 21"/><line x1="15" x2="21" y1="15" y2="21"/><line x1="4" x2="9" y1="4" y2="9"/>',
    clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
    command: '<path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3"/>',
    sliders: '<line x1="21" x2="14" y1="4" y2="4"/><line x1="10" x2="3" y1="4" y2="4"/><line x1="21" x2="12" y1="12" y2="12"/><line x1="8" x2="3" y1="12" y2="12"/><line x1="21" x2="16" y1="20" y2="20"/><line x1="12" x2="3" y1="20" y2="20"/><line x1="14" x2="14" y1="2" y2="6"/><line x1="8" x2="8" y1="10" y2="14"/><line x1="16" x2="16" y1="18" y2="22"/>',
    pin: '<line x1="12" x2="12" y1="17" y2="22"/><path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z"/>',
    up: '<path d="m18 15-6-6-6 6"/>',
    x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
    trash: '<path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/>',
    download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/>',
    chart: '<path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/>',
    drop: '<path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/>',
    shield: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
    palette: '<circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/>',
    folder: '<path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/>',
    heart: '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>',
    zap: '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
    film: '<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M7 3v18"/><path d="M3 7.5h4"/><path d="M3 12h18"/><path d="M3 16.5h4"/><path d="M17 3v18"/><path d="M17 7.5h4"/><path d="M17 16.5h4"/>',
    check: '<path d="M20 6 9 17l-5-5"/>'
  };
  function ic(n, s) {
    s = s || 18;
    return '<svg width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + I[n] + '</svg>';
  }

  var S = { cfg: null, data: null };
  var EP = /\/anime\/stream\/([^\/?#]+)(?:\/staffel-(\d+))?(?:\/episode-(\d+))?/;
  var FILM = /\/anime\/stream\/([^\/?#]+)\/filme\/film-(\d+)/;
  var IS_START = location.hostname === 'aniclient.local';
  var START_URL = 'https://aniclient.local/start.html';
  var host, root, Q = {}, hideT, saveT, dataT, zoom = 1, mini = false;

  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function rgb(h) { h = h.replace('#', ''); return parseInt(h.slice(0, 2), 16) + ',' + parseInt(h.slice(2, 4), 16) + ',' + parseInt(h.slice(4, 6), 16); }
  function tcol() { var c = S.cfg; return THEMES[c.theme] || [c.c_bg, c.c_panel, c.c_text, c.c_muted]; }
  function hue(s) { var n = 0; for (var i = 0; i < s.length; i++) n += s.charCodeAt(i); return (n * 37) % 360; }
  function title(slug) { return slug.replace(/-/g, ' ').replace(/\b\w/g, function (c) { return c.toUpperCase(); }); }
  function label(e) { return e.season === 0 ? 'Movie ' + e.episode : 'S' + e.season + ' \u00b7 E' + e.episode; }
  function when(ts) { return new Date(ts * 1000).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }); }
  function baseUrl(u) { var m = /^(https?:\/\/[^\/]+\/anime\/stream\/[^\/?#]+)/.exec(u); return m ? m[1] : u; }
  function art(slug, big) {
    var h = hue(slug);
    return '<div class="art' + (big ? ' big' : '') + '" style="background:linear-gradient(135deg,hsl(' + h + ',70%,52%),hsl(' + ((h + 50) % 360) + ',70%,36%))">' + esc(title(slug).charAt(0)) + '</div>';
  }

  function saveCfg() { clearTimeout(saveT); saveT = setTimeout(function () { send({ t: 'cfg', cfg: S.cfg }); }, 250); }
  function saveData() { clearTimeout(dataT); dataT = setTimeout(function () { send({ t: 'data', data: S.data }); }, 500); }

  function nav(u) { send({ t: 'allow', u: u }); setTimeout(function () { location.href = u; }, 70); }
  function go(text) {
    text = (text || '').trim();
    if (!text) return;
    var u;
    if (/^[a-z]+:\/\//i.test(text)) u = text;
    else if (text.indexOf('.') > 0 && text.indexOf(' ') < 0) u = 'https://' + text;
    else u = S.cfg.search_url.replace('%s', encodeURIComponent(text));
    nav(u);
  }
  function goHome() { nav(S.cfg.use_start_page ? START_URL : S.cfg.home); }
  function lastEntry() { var h = S.data.history; return h.length ? h[h.length - 1] : null; }
  function cont() { var e = lastEntry(); if (e) location.href = e.url; else toast('No watch history yet'); }
  function nextEp() {
    var u = location.href;
    if (u.indexOf('episode-') < 0) { var e = lastEntry(); if (e) u = e.url; }
    if (u.indexOf('episode-') < 0) { toast('Open an episode first'); return; }
    location.href = u.replace(/(episode-)(\d+)/, function (m, a, n) { return a + (parseInt(n, 10) + 1); });
  }
  function randomAnime() { try { sessionStorage.setItem('__ac_rand', '1'); } catch (e) {} location.href = 'https://aniworld.to/animes'; }
  function favIndex(u) { for (var i = 0; i < S.data.favs.length; i++) if (S.data.favs[i].url === u) return i; return -1; }
  function toggleFav() {
    var u = baseUrl(location.href);
    var i = favIndex(u);
    if (i >= 0) { S.data.favs.splice(i, 1); toast('Removed from favorites'); }
    else {
      var m = EP.exec(u);
      S.data.favs.push({ title: m ? title(m[1]) : (document.title || u), url: u });
      toast('Added to favorites');
    }
    saveData(); updateStar(); if (Q.panel.classList.contains('open')) renderPanel();
  }
  function updateStar() { if (Q.star) Q.star.classList.toggle('on', favIndex(baseUrl(location.href)) >= 0); }

  function track() {
    if (!S.cfg.track_history || !/aniworld\.to$/.test(location.hostname)) return;
    var p = location.pathname, m = FILM.exec(p), slug, se, ep;
    if (m) { slug = m[1]; se = 0; ep = +m[2]; }
    else { m = EP.exec(p); if (!m || !m[3]) return; slug = m[1]; se = +(m[2] || 1); ep = +m[3]; }
    var now = Math.floor(Date.now() / 1000), h = S.data.history, l = h[h.length - 1];
    if (l && l.url === location.href && now - l.ts < 600) l.ts = now;
    else h.push({ slug: slug, title: title(slug), season: se, episode: ep, url: location.href, ts: now });
    if (h.length > 5000) h.splice(0, h.length - 5000);
    saveData();
  }

  function toast(m) {
    var t = Q.toast;
    t.textContent = m;
    t.classList.add('show');
    clearTimeout(t._t);
    t._t = setTimeout(function () { t.classList.remove('show'); }, 2300);
  }

  function pageCss() {
    var c = S.cfg, t = tcol(), p = [];
    var pa = 'rgba(' + rgb(t[1]) + ',' + (c.glass_alpha / 100).toFixed(2) + ')';
    if (c.site_glass && !IS_START) {
      p.push('body{background:linear-gradient(135deg,' + t[0] + ',' + t[1] + ')!important;background-attachment:fixed!important}' +
        '.navbar,nav,header,footer,.modal-content,.card,input,select,textarea,#stream{backdrop-filter:blur(' + c.blur + 'px) saturate(170%)!important;background-color:' + pa + '!important;border-radius:' + c.radius + 'px!important;border:1px solid rgba(' + rgb(t[2]) + ',.14)!important}' +
        'a:hover{color:' + c.accent + '!important}');
    }
    p.push('::selection{background:' + c.accent + ';color:#fff}::-webkit-scrollbar{width:9px}::-webkit-scrollbar-thumb{background:' + c.accent + ';border-radius:9px}');
    if (c.hide_scroll) p.push('::-webkit-scrollbar{display:none!important}');
    if (c.invert) p.push('html{filter:invert(1) hue-rotate(180deg)}img,video,iframe,picture{filter:invert(1) hue-rotate(180deg)}');
    if (c.blur_thumbs) p.push("img[src*='cover'],img[data-src*='cover'],.seriesListContainer img{filter:blur(14px);transition:filter .25s}img[src*='cover']:hover,.seriesListContainer img:hover{filter:none}");
    p.push(c.custom_css || '');
    var s = document.getElementById('__ac_page');
    if (!s) { s = document.createElement('style'); s.id = '__ac_page'; (document.head || document.documentElement).appendChild(s); }
    s.textContent = p.join('\n');
  }

  function applyTheme() {
    var c = S.cfg, t = tcol(), st = host.style;
    st.setProperty('--bg', t[0]); st.setProperty('--pn', rgb(t[1])); st.setProperty('--tx', t[2]); st.setProperty('--txc', rgb(t[2])); st.setProperty('--mu', t[3]);
    st.setProperty('--ac', c.accent); st.setProperty('--acc', rgb(c.accent)); st.setProperty('--r', c.radius + 'px');
    st.setProperty('--ga', (c.glass_alpha / 100).toFixed(2)); st.setProperty('--bl', c.blur + 'px'); st.setProperty('--font', '"' + c.font + '"');
    root.classList.toggle('noanim', !c.animations);
    pageCss();
  }

  var CSS = '' +
    '*{box-sizing:border-box;font-family:var(--font),"Segoe UI",system-ui,sans-serif}' +
    '.noanim *{transition:none!important;animation:none!important}' +
    '.layer{position:fixed;inset:0;pointer-events:none;color:var(--tx);font-size:13px}' +
    '.glass{background:rgba(var(--pn),var(--ga));backdrop-filter:blur(var(--bl)) saturate(170%);-webkit-backdrop-filter:blur(var(--bl)) saturate(170%);border:1px solid rgba(var(--txc),.14);box-shadow:0 14px 44px rgba(0,0,0,.38),inset 0 1px 0 rgba(255,255,255,.08)}' +
    '.dock{position:fixed;left:50%;bottom:18px;transform:translate(-50%,0);display:flex;align-items:center;gap:3px;padding:8px 10px;border-radius:calc(var(--r)*2);pointer-events:auto;transition:transform .45s cubic-bezier(.2,.9,.3,1.15),opacity .3s;max-width:calc(100vw - 20px)}' +
    '.dock.hide{transform:translate(-50%,150%);opacity:0;pointer-events:none}' +
    '.b{all:unset;cursor:pointer;width:34px;height:34px;border-radius:var(--r);display:grid;place-items:center;color:var(--tx);transition:.18s;position:relative;flex:none}' +
    '.b:hover{background:rgba(var(--acc),.26);transform:translateY(-2px)}.b:active{transform:scale(.92)}' +
    '.b.on{color:var(--ac)}.b.on svg{fill:currentColor}' +
    '.b[data-tip]:hover::after{content:attr(data-tip);position:absolute;bottom:125%;left:50%;transform:translateX(-50%);background:rgba(0,0,0,.85);color:#fff;padding:4px 9px;border-radius:7px;white-space:nowrap;font-size:11px;pointer-events:none}' +
    '.addr{display:flex;align-items:center;gap:8px;width:min(360px,30vw);min-width:120px;height:34px;padding:0 12px;margin:0 6px;border-radius:var(--r);background:rgba(var(--txc),.09);border:1px solid transparent;transition:.2s;color:var(--mu)}' +
    '.addr:focus-within{border-color:var(--ac);box-shadow:0 0 0 3px rgba(var(--acc),.25);color:var(--tx)}' +
    '.addr input{all:unset;flex:1;min-width:0;color:var(--tx)}.addr input::placeholder{color:var(--mu)}' +
    '.sep{width:1px;height:20px;background:rgba(var(--txc),.16);margin:0 4px;flex:none}' +
    '.handle{position:fixed;left:50%;bottom:5px;transform:translateX(-50%);width:120px;height:20px;border-radius:12px;display:grid;place-items:center;cursor:pointer;color:var(--mu);pointer-events:auto;transition:.3s;background:rgba(var(--pn),.55);backdrop-filter:blur(8px)}' +
    '.handle:hover{color:var(--ac);width:160px}.handle.gone{opacity:0;pointer-events:none}' +
    '.panel{position:fixed;top:12px;right:12px;bottom:12px;width:390px;max-width:calc(100vw - 24px);border-radius:calc(var(--r)*2);display:flex;flex-direction:column;pointer-events:auto;transform:translateX(125%);transition:transform .45s cubic-bezier(.2,.9,.2,1)}' +
    '.panel.open{transform:none}' +
    '.ph{display:flex;align-items:center;gap:6px;padding:14px 14px 8px}.ph .sp{flex:1}' +
    '.tab{all:unset;cursor:pointer;display:flex;align-items:center;gap:7px;padding:8px 13px;border-radius:var(--r);color:var(--mu);transition:.2s;font-weight:600}' +
    '.tab:hover{color:var(--tx);background:rgba(var(--txc),.08)}.tab.on{background:var(--ac);color:#fff}' +
    '.search{margin:6px 14px;display:flex;align-items:center;gap:8px;padding:0 12px;height:36px;border-radius:var(--r);background:rgba(var(--txc),.09);color:var(--mu)}' +
    '.search input{all:unset;flex:1;color:var(--tx)}' +
    '.list{flex:1;overflow:auto;padding:6px 10px 12px}.list::-webkit-scrollbar{width:6px}.list::-webkit-scrollbar-thumb{background:rgba(var(--acc),.6);border-radius:6px}' +
    '.it{display:flex;gap:12px;align-items:center;padding:9px 10px;border-radius:var(--r);cursor:pointer;transition:.2s;animation:in .4s both}' +
    '.it:hover{background:rgba(var(--acc),.18);transform:translateX(-3px)}' +
    '.it .tx{flex:1;min-width:0}.it b{display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.it span{color:var(--mu);font-size:12px}' +
    '.art{width:44px;height:44px;border-radius:calc(var(--r) + 2px);display:grid;place-items:center;font-weight:800;color:#fff;flex:none;font-size:18px}' +
    '.art.big{width:100%;height:110px;border-radius:0;font-size:54px}' +
    '.empty{padding:40px 20px;text-align:center;color:var(--mu)}' +
    '.stat{padding:16px;border-radius:var(--r);background:rgba(var(--txc),.07);margin:6px 4px;animation:in .4s both}.stat b{display:block;font-size:26px;color:var(--ac)}' +
    '.scrim{position:fixed;inset:0;background:rgba(0,0,0,.5);backdrop-filter:blur(6px);display:grid;place-items:center;opacity:0;pointer-events:none;transition:.3s}' +
    '.scrim.open{opacity:1;pointer-events:auto}' +
    '.modal{width:min(780px,94vw);height:min(560px,88vh);border-radius:calc(var(--r)*2);display:flex;overflow:hidden;transform:scale(.94) translateY(14px);transition:.4s cubic-bezier(.2,.9,.2,1)}' +
    '.scrim.open .modal{transform:none}' +
    '.nav{width:190px;padding:14px 10px;border-right:1px solid rgba(var(--txc),.12);display:flex;flex-direction:column;gap:4px}.nav .tab{width:100%}' +
    '.body{flex:1;overflow:auto;padding:18px 22px}.body::-webkit-scrollbar{width:6px}.body::-webkit-scrollbar-thumb{background:rgba(var(--acc),.6);border-radius:6px}' +
    '.body h3{margin:0 0 14px;font-size:18px}' +
    '.row{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:11px 0;border-bottom:1px solid rgba(var(--txc),.08)}.row>label{flex:1}' +
    '.row small{display:block;color:var(--mu)}' +
    '.sw{position:relative;width:42px;height:24px;flex:none}.sw input{display:none}.sw i{position:absolute;inset:0;border-radius:12px;background:rgba(var(--txc),.2);transition:.25s;cursor:pointer}' +
    '.sw i::after{content:"";position:absolute;left:3px;top:3px;width:18px;height:18px;border-radius:50%;background:#fff;transition:.25s}' +
    '.sw input:checked+i{background:var(--ac)}.sw input:checked+i::after{transform:translateX(18px)}' +
    '.row input[type=range]{width:180px;accent-color:var(--ac)}.row input[type=text],.row textarea,.row select{background:rgba(var(--txc),.09);color:var(--tx);border:1px solid rgba(var(--txc),.16);border-radius:var(--r);padding:8px 10px;outline:none;width:240px;font-size:13px}' +
    '.row textarea{height:90px;resize:vertical}.row input[type=color]{width:42px;height:30px;border:none;background:none;padding:0;cursor:pointer}' +
    '.btn{all:unset;cursor:pointer;padding:9px 16px;border-radius:var(--r);background:rgba(var(--txc),.1);font-weight:600;transition:.2s;display:inline-flex;gap:8px;align-items:center}.btn:hover{background:var(--ac);color:#fff}' +
    '.themes{display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:10px;margin:8px 0 14px}' +
    '.th{cursor:pointer;border-radius:var(--r);padding:10px;border:2px solid transparent;transition:.2s;font-size:12px;font-weight:600}.th:hover{transform:translateY(-3px)}.th.on{border-color:var(--ac)}' +
    '.th div{height:26px;border-radius:8px;margin-bottom:6px;display:flex;gap:4px;padding:4px}.th div i{flex:1;border-radius:5px}' +
    '.accents{display:flex;gap:10px;flex-wrap:wrap}.ac{width:30px;height:30px;border-radius:50%;cursor:pointer;border:3px solid transparent;transition:.2s}.ac:hover{transform:scale(1.15)}.ac.on{border-color:var(--tx)}' +
    '.pal{width:min(560px,94vw);border-radius:calc(var(--r)*2);padding:12px;transform:translateY(-20px) scale(.96);transition:.35s cubic-bezier(.2,.9,.2,1)}.scrim.open .pal{transform:none}' +
    '.pal input{all:unset;width:100%;padding:12px 14px;border-radius:var(--r);background:rgba(var(--txc),.09);color:var(--tx);font-size:15px}' +
    '.pl{max-height:340px;overflow:auto;margin-top:8px}.pi{padding:10px 14px;border-radius:var(--r);cursor:pointer;display:flex;align-items:center;gap:10px}.pi.on{background:var(--ac);color:#fff}' +
    '.toast{position:fixed;left:50%;bottom:88px;transform:translate(-50%,20px);padding:10px 20px;border-radius:calc(var(--r)*2);background:var(--ac);color:#fff;font-weight:600;opacity:0;transition:.35s;pointer-events:none;box-shadow:0 10px 30px rgba(0,0,0,.4)}' +
    '.toast.show{opacity:1;transform:translate(-50%,0)}' +
    '.start{position:fixed;inset:0;overflow:auto;pointer-events:auto;background:linear-gradient(135deg,var(--bg),rgb(var(--pn)))}' +
    '.blob{position:fixed;border-radius:50%;filter:blur(90px);opacity:.4;animation:float 16s ease-in-out infinite;pointer-events:none}' +
    '.wrap{position:relative;max-width:1040px;margin:0 auto;padding:70px 28px 130px}' +
    '.wrap h1{font-size:46px;margin:0 0 6px;letter-spacing:-1px;animation:in .7s both;background:linear-gradient(90deg,var(--ac),#ff7ac6,#35d0ff);-webkit-background-clip:text;background-clip:text;color:transparent}' +
    '.wrap .sub{opacity:.7;margin:0 0 28px;animation:in .7s .1s both}' +
    '.sf{display:flex;gap:12px;animation:in .7s .2s both}.sf input{all:unset;flex:1;padding:17px 22px;border-radius:calc(var(--r) + 8px);border:1px solid rgba(var(--txc),.2);background:rgba(var(--pn),var(--ga));backdrop-filter:blur(var(--bl));color:var(--tx);font-size:16px;transition:.25s}' +
    '.sf input:focus{border-color:var(--ac);box-shadow:0 0 0 4px rgba(var(--acc),.28)}' +
    '.sf button{all:unset;cursor:pointer;padding:0 28px;border-radius:calc(var(--r) + 8px);background:var(--ac);color:#fff;font-weight:700;display:flex;align-items:center;gap:8px;transition:.25s}.sf button:hover{transform:translateY(-2px);box-shadow:0 10px 30px rgba(var(--acc),.5)}' +
    '.wrap h2{font-size:13px;text-transform:uppercase;letter-spacing:2px;color:var(--mu);margin:38px 0 14px;display:flex;align-items:center;gap:8px;animation:in .7s .3s both}' +
    '.chips{display:flex;flex-wrap:wrap;gap:10px;animation:in .7s .35s both}.chip{cursor:pointer;padding:9px 16px;border-radius:999px;background:rgba(var(--pn),var(--ga));border:1px solid rgba(var(--txc),.14);transition:.25s;backdrop-filter:blur(14px)}.chip:hover{background:var(--ac);color:#fff;transform:translateY(-2px)}' +
    '.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:18px}' +
    '.tile{cursor:pointer;border-radius:calc(var(--r) + 6px);overflow:hidden;background:rgba(var(--pn),var(--ga));border:1px solid rgba(var(--txc),.14);backdrop-filter:blur(16px);animation:in .6s both;transition:transform .3s,box-shadow .3s}' +
    '.tile:hover{transform:translateY(-6px) scale(1.02);box-shadow:0 18px 40px rgba(0,0,0,.4)}.tile .t{padding:12px 14px 2px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.tile .m{padding:0 14px 14px;color:var(--mu);font-size:12px}' +
    '.stats{display:flex;gap:14px;flex-wrap:wrap;animation:in .7s .4s both}.stats .stat{flex:1;min-width:140px;margin:0}' +
    '@keyframes in{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:none}}' +
    '@keyframes float{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(70px,50px) scale(1.18)}}';

  function build() {
    host = document.createElement('div');
    host.id = 'aniclient-root';
    host.style.cssText = 'all:initial;position:fixed;inset:0;z-index:2147483647;pointer-events:none;display:block';
    var sh = host.attachShadow({ mode: 'open' });
    sh.innerHTML = '<style>' + CSS + '</style><div class="layer" id="L">' +
      '<div class="dock glass hide" id="dock">' +
      btn('left', 'Back') + btn('right', 'Forward') + btn('reload', 'Reload') + btn('home', 'Home') +
      '<form class="addr" id="addr">' + ic('search', 16) + '<input id="in" placeholder="Search anime or paste a link" autocomplete="off" spellcheck="false"></form>' +
      '<div class="sep"></div>' + btn('star', 'Favorite (Ctrl+D)', 'star') + btn('play', 'Continue watching (Alt+C)', 'cont') + btn('next', 'Next episode (Alt+N)', 'next') + btn('shuffle', 'Random anime', 'rand') +
      '<div class="sep"></div>' + btn('clock', 'Library (Ctrl+H)', 'panel') + btn('command', 'Command palette (Ctrl+K)', 'pal') + btn('sliders', 'Settings (Ctrl+,)', 'set') + btn('pin', 'Pin toolbar', 'pin') +
      '</div><div class="handle" id="handle">' + ic('up', 16) + '</div>' +
      '<div class="panel glass" id="panel"></div>' +
      '<div class="scrim" id="sset"><div class="modal glass" id="mset"></div></div>' +
      '<div class="scrim" id="spal"><div class="pal glass"><input id="pin" placeholder="Type a command, theme or accent"><div class="pl" id="pl"></div></div></div>' +
      '<div class="toast" id="toast"></div></div>';
    document.documentElement.appendChild(host);
    root = sh.getElementById('L');
    ['dock', 'handle', 'panel', 'sset', 'mset', 'spal', 'pin', 'pl', 'toast', 'in', 'addr'].forEach(function (k) { Q[k] = sh.getElementById(k); });
    Q.star = sh.querySelector('[data-a=star]');
    Q.pinb = sh.querySelector('[data-a=pin]');
    Q.sh = sh;
  }
  function btn(i, tip, a) { return '<button class="b" data-a="' + (a || i) + '" data-tip="' + tip + '">' + ic(i) + '</button>'; }

  function showDock() { clearTimeout(hideT); Q.dock.classList.remove('hide'); Q.handle.classList.add('gone'); }
  function hideDock(ms) {
    clearTimeout(hideT);
    if (S.cfg.dock_pin) return;
    hideT = setTimeout(function () {
      if (Q.dock.matches(':hover') || Q.sh.activeElement === Q.in) return hideDock(1200);
      Q.dock.classList.add('hide');
      Q.handle.classList.remove('gone');
    }, ms || 1400);
  }
  function setPin() { Q.pinb.classList.toggle('on', !!S.cfg.dock_pin); if (S.cfg.dock_pin) showDock(); else hideDock(1500); }

  function closeAll() { Q.panel.classList.remove('open'); Q.sset.classList.remove('open'); Q.spal.classList.remove('open'); }

  var tab = 'hist', hq = '';
  function renderPanel() {
    var d = S.data, h = '<div class="ph">' +
      '<button class="tab ' + (tab === 'hist' ? 'on' : '') + '" data-tab="hist">' + ic('clock', 15) + 'History</button>' +
      '<button class="tab ' + (tab === 'fav' ? 'on' : '') + '" data-tab="fav">' + ic('heart', 15) + 'Favorites</button>' +
      '<button class="tab ' + (tab === 'stats' ? 'on' : '') + '" data-tab="stats">' + ic('chart', 15) + 'Stats</button>' +
      '<div class="sp"></div><button class="b" data-a="closep">' + ic('x') + '</button></div>';
    if (tab === 'hist') {
      h += '<div class="search">' + ic('search', 15) + '<input id="hq" placeholder="Search history" value="' + esc(hq) + '"></div><div class="list">';
      var n = 0, q = hq.toLowerCase();
      for (var i = d.history.length - 1; i >= 0 && n < 300; i--) {
        var e = d.history[i];
        if (q && (e.title + ' ' + label(e)).toLowerCase().indexOf(q) < 0) continue;
        h += '<div class="it" style="animation-delay:' + Math.min(n * 25, 400) + 'ms" data-u="' + esc(e.url) + '">' + art(e.slug) + '<div class="tx"><b>' + esc(e.title) + '</b><span>' + label(e) + ' \u00b7 ' + when(e.ts) + '</span></div><button class="b" data-del="' + e.ts + '" data-tip="Remove">' + ic('trash', 16) + '</button></div>';
        n++;
      }
      if (!n) h += '<div class="empty">Nothing here yet.<br>Episodes you watch show up automatically.</div>';
      h += '<div style="padding:10px 4px;display:flex;gap:8px"><button class="btn" data-a="clearh">' + ic('trash', 15) + 'Clear all</button></div></div>';
    } else if (tab === 'fav') {
      h += '<div class="list">';
      d.favs.forEach(function (f, i) {
        var m = EP.exec(f.url);
        h += '<div class="it" style="animation-delay:' + Math.min(i * 25, 400) + 'ms" data-u="' + esc(f.url) + '">' + art(m ? m[1] : f.title) + '<div class="tx"><b>' + esc(f.title) + '</b><span>Favorite</span></div><button class="b" data-delf="' + i + '" data-tip="Remove">' + ic('trash', 16) + '</button></div>';
      });
      if (!d.favs.length) h += '<div class="empty">No favorites yet.<br>Press Ctrl+D on an anime page.</div>';
      h += '</div>';
    } else {
      var c = {}, days = {}, today = new Date().toDateString(), tt = 0;
      d.history.forEach(function (e) { c[e.slug] = (c[e.slug] || 0) + 1; var dd = new Date(e.ts * 1000).toDateString(); days[dd] = 1; if (dd === today) tt++; });
      var top = Object.keys(c).sort(function (a, b) { return c[b] - c[a]; }).slice(0, 5), ws = d.watch_seconds || 0;
      h += '<div class="list"><div class="stat"><b>' + d.history.length + '</b>Episodes watched</div><div class="stat"><b>' + Object.keys(c).length + '</b>Different anime</div>' +
        '<div class="stat"><b>' + Math.floor(ws / 3600) + 'h ' + ('0' + Math.floor(ws % 3600 / 60)).slice(-2) + 'm</b>Time watching</div><div class="stat"><b>' + tt + '</b>Watched today \u00b7 ' + Object.keys(days).length + ' active days</div>';
      h += '<div class="stat">Top anime' + (top.length ? top.map(function (s) { return '<div style="margin-top:6px"><b style="font-size:14px;color:var(--tx);display:inline">' + esc(title(s)) + '</b> <span style="color:var(--mu)">\u00d7' + c[s] + '</span></div>'; }).join('') : '<div style="color:var(--mu);margin-top:6px">-</div>') + '</div></div>';
    }
    Q.panel.innerHTML = h;
    var hqi = Q.panel.querySelector('#hq');
    if (hqi) hqi.addEventListener('input', function () { hq = hqi.value; var p = hqi.selectionStart; renderPanel(); var n = Q.panel.querySelector('#hq'); n.focus(); n.setSelectionRange(p, p); });
  }
  function togglePanel() { var o = !Q.panel.classList.contains('open'); closeAll(); if (o) { renderPanel(); Q.panel.classList.add('open'); } }

  var SCHEMA = [
    { n: 'Appearance', i: 'palette', f: [{ k: 'theme', t: 'themes' }, { k: 'accent', t: 'accents', l: 'Accent color' }, { k: 'c_bg', t: 'color', l: 'Custom: background' }, { k: 'c_panel', t: 'color', l: 'Custom: panel' }, { k: 'c_text', t: 'color', l: 'Custom: text' }, { k: 'c_muted', t: 'color', l: 'Custom: muted text' }, { k: 'radius', t: 'range', min: 0, max: 28, l: 'Corner radius' }, { k: 'glass_alpha', t: 'range', min: 10, max: 100, l: 'Glass opacity' }, { k: 'blur', t: 'range', min: 0, max: 40, l: 'Glass blur' }, { k: 'animations', t: 'switch', l: 'Animations' }, { k: 'font', t: 'text', l: 'Font' }] },
    { n: 'Website', i: 'drop', f: [{ k: 'site_glass', t: 'switch', l: 'Liquid glass on the website' }, { k: 'blur_thumbs', t: 'switch', l: 'Spoiler-blur thumbnails' }, { k: 'hide_scroll', t: 'switch', l: 'Hide scrollbars' }, { k: 'invert', t: 'switch', l: 'Invert page colors' }, { k: 'custom_css', t: 'area', l: 'Custom CSS' }] },
    { n: 'Privacy', i: 'shield', f: [{ k: 'adblock', t: 'switch', l: 'Block ad and tracker requests', s: 'Restart-free' }, { k: 'cosmetic', t: 'switch', l: 'Hide ads and click-trap overlays', s: 'Applies after reload' }, { k: 'popup_block', t: 'switch', l: 'Block popups', s: 'Applies after reload' }, { k: 'hide_cookie', t: 'switch', l: 'Hide cookie banners', s: 'Applies after reload' }, { k: 'lock_domain', t: 'switch', l: 'Lock navigation to aniworld.to' }, { k: 'compat', t: 'switch', l: 'Compatibility mode (no ad blocking or injected page scripts)', s: 'Use if a site shows Access denied' }, { k: 'track_history', t: 'switch', l: 'Track watch history' }, { t: 'button', l: 'Clear cookies', a: 'cleardata' }] },
    { n: 'Playback', i: 'play', f: [{ k: 'autoplay', t: 'switch', l: 'Autoplay' }, { k: 'autonext', t: 'switch', l: 'Auto next episode' }, { k: 'resume', t: 'switch', l: 'Resume where you left off' }, { k: 'skipbtn', t: 'switch', l: 'Show Skip Intro button' }, { k: 'skip', t: 'range', min: 5, max: 300, l: 'Skip length (seconds)' }, { k: 'speed', t: 'range', min: 0.25, max: 3, step: 0.25, l: 'Default speed' }, { k: 'volume', t: 'range', min: 0, max: 100, l: 'Default volume' }] },
    { n: 'App', i: 'sliders', f: [{ k: 'use_start_page', t: 'switch', l: 'Use start page as home' }, { k: 'home', t: 'text', l: 'Home page' }, { k: 'search_url', t: 'text', l: 'Search URL (%s = query)' }, { k: 'download_dir', t: 'text', l: 'Download folder' }, { k: 'ask_download', t: 'switch', l: 'Ask where to save files' }, { k: 'on_top', t: 'switch', l: 'Always on top' }, { k: 'safe_mode', t: 'switch', l: 'Safe mode (disable GPU, restart)' }, { k: 'sleep', t: 'range', min: 0, max: 240, l: 'Sleep timer (minutes, 0 = off)' }, { t: 'button', l: 'Open downloads folder', a: 'openfolder' }] }
  ];
  var sec = 0;
  function renderSettings() {
    var s = SCHEMA[sec], c = S.cfg, h = '<div class="nav">';
    SCHEMA.forEach(function (x, i) { h += '<button class="tab ' + (i === sec ? 'on' : '') + '" data-sec="' + i + '">' + ic(x.i, 15) + x.n + '</button>'; });
    h += '<div style="flex:1"></div><button class="btn" data-a="reset">Reset all</button><button class="btn" data-a="closes" style="margin-top:6px">' + ic('check', 15) + 'Done</button></div><div class="body"><h3>' + s.n + '</h3>';
    s.f.forEach(function (f) {
      if (f.t === 'themes') {
        h += '<div class="themes">';
        Object.keys(THEMES).concat(['Custom']).forEach(function (n) {
          var t = THEMES[n] || [c.c_bg, c.c_panel, c.c_text, c.c_muted];
          h += '<div class="th ' + (c.theme === n ? 'on' : '') + '" data-theme="' + esc(n) + '" style="background:' + t[0] + ';color:' + t[2] + '"><div style="background:' + t[1] + '"><i style="background:' + c.accent + '"></i><i style="background:' + t[2] + ';opacity:.7"></i><i style="background:' + t[3] + '"></i></div>' + esc(n) + '</div>';
        });
        h += '</div>';
      } else if (f.t === 'accents') {
        h += '<div class="row"><label>' + f.l + '</label><div class="accents">' + Object.keys(ACCENTS).map(function (n) { return '<div class="ac ' + (c.accent === ACCENTS[n] ? 'on' : '') + '" data-ac="' + ACCENTS[n] + '" title="' + n + '" style="background:' + ACCENTS[n] + '"></div>'; }).join('') + '<input type="color" data-k="accent" value="' + c.accent + '"></div></div>';
      } else if (f.t === 'button') {
        h += '<div class="row"><label>' + f.l + '</label><button class="btn" data-a="' + f.a + '">Run</button></div>';
      } else {
        var v = c[f.k], ctl;
        if (f.t === 'switch') ctl = '<span class="sw"><input type="checkbox" data-k="' + f.k + '"' + (v ? ' checked' : '') + '><i></i></span>';
        else if (f.t === 'range') ctl = '<input type="range" data-k="' + f.k + '" min="' + f.min + '" max="' + f.max + '" step="' + (f.step || 1) + '" value="' + v + '"><span style="width:38px;text-align:right">' + v + '</span>';
        else if (f.t === 'color') ctl = '<input type="color" data-k="' + f.k + '" value="' + v + '">';
        else if (f.t === 'area') ctl = '<textarea data-k="' + f.k + '">' + esc(v) + '</textarea>';
        else ctl = '<input type="text" data-k="' + f.k + '" value="' + esc(v) + '">';
        h += '<div class="row"><label>' + f.l + (f.s ? '<small>' + f.s + '</small>' : '') + '</label>' + ctl + '</div>';
      }
    });
    Q.mset.innerHTML = h + '</div>';
  }
  function openSettings() { closeAll(); renderSettings(); Q.sset.classList.add('open'); }
  function setCfg(k, v) {
    S.cfg[k] = v;
    saveCfg();
    applyTheme();
    if (k === 'accent' || k === 'theme') renderSettings();
  }

  var palItems = [], palSel = 0;
  function items() {
    var a = [
      ['Home', goHome], ['All anime', function () { location.href = 'https://aniworld.to/animes'; }], ['Popular anime', function () { location.href = 'https://aniworld.to/beliebte-animes'; }],
      ['New anime', function () { location.href = 'https://aniworld.to/neu'; }], ['Random anime', randomAnime], ['Continue watching', cont], ['Next episode', nextEp],
      ['Toggle favorite', toggleFav], ['Open library', togglePanel], ['Open settings', openSettings], ['Pin or unpin toolbar', function () { S.cfg.dock_pin = !S.cfg.dock_pin; saveCfg(); setPin(); }],
      ['Back', function () { history.back(); }], ['Forward', function () { history.forward(); }], ['Reload', function () { location.reload(); }],
      ['Zoom in', function () { zm(0.1); }], ['Zoom out', function () { zm(-0.1); }], ['Reset zoom', function () { zm(0); }],
      ['Mini player', toggleMini], ['Boss key (mute and minimize)', function () { send({ t: 'boss' }); }], ['Mute tab', function () { send({ t: 'mute', on: true }); toast('Muted'); }], ['Unmute tab', function () { send({ t: 'mute', on: false }); toast('Unmuted'); }],
      ['Open downloads folder', function () { send({ t: 'openfolder' }); }], ['Clear cookies', function () { send({ t: 'cleardata' }); }], ['Sleep timer', function () { var m = parseInt(prompt('Close the app after how many minutes? (0 = off)', S.cfg.sleep), 10); if (!isNaN(m)) { S.cfg.sleep = m; saveCfg(); toast(m ? 'Closing in ' + m + ' min' : 'Sleep timer off'); } }],
      ['Toggle ad blocker', function () { setCfg('adblock', !S.cfg.adblock); toast('Ad blocker ' + (S.cfg.adblock ? 'on' : 'off')); }],
      ['Toggle animations', function () { setCfg('animations', !S.cfg.animations); }], ['Toggle website glass', function () { setCfg('site_glass', !S.cfg.site_glass); }],
      ['Quit', function () { send({ t: 'quit' }); }]
    ];
    Object.keys(THEMES).forEach(function (n) { a.push(['Theme: ' + n, function () { setCfg('theme', n); toast('Theme: ' + n); }]); });
    Object.keys(ACCENTS).forEach(function (n) { a.push(['Accent: ' + n, function () { setCfg('accent', ACCENTS[n]); }]); });
    return a;
  }
  function renderPal() {
    var q = Q.pin.value.toLowerCase().split(' ').filter(Boolean);
    palItems = items().filter(function (x) { return q.every(function (w) { return x[0].toLowerCase().indexOf(w) >= 0; }); });
    palSel = Math.min(palSel, Math.max(palItems.length - 1, 0));
    Q.pl.innerHTML = palItems.map(function (x, i) { return '<div class="pi ' + (i === palSel ? 'on' : '') + '" data-i="' + i + '">' + ic('zap', 15) + esc(x[0]) + '</div>'; }).join('');
    var on = Q.pl.querySelector('.on');
    if (on) on.scrollIntoView({ block: 'nearest' });
  }
  function openPal() { closeAll(); Q.pin.value = ''; palSel = 0; renderPal(); Q.spal.classList.add('open'); setTimeout(function () { Q.pin.focus(); }, 30); }
  function runPal(i) { var x = palItems[i]; if (x) { Q.spal.classList.remove('open'); setTimeout(x[1], 0); } }
  function zm(d) { zoom = d === 0 ? 1 : Math.max(0.25, Math.min(3, zoom + d)); send({ t: 'zoom', v: zoom }); toast('Zoom ' + Math.round(zoom * 100) + '%'); }
  function toggleMini() { mini = !mini; send({ t: 'mini', on: mini }); toast(mini ? 'Mini player on' : 'Mini player off'); }

  function renderStart() {
    var d = S.data, h = new Date().getHours(), g = h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
    var seen = {}, cards = [];
    for (var i = d.history.length - 1; i >= 0 && cards.length < 8; i--) { var e = d.history[i]; if (seen[e.slug]) continue; seen[e.slug] = 1; cards.push(e); }
    var ws = d.watch_seconds || 0, slugs = {};
    d.history.forEach(function (e) { slugs[e.slug] = 1; });
    var el = document.createElement('div');
    el.className = 'start';
    el.innerHTML = '<div class="blob" style="width:440px;height:440px;background:var(--ac);top:-140px;left:-100px"></div><div class="blob" style="width:380px;height:380px;background:#ff5fa2;bottom:-120px;right:-80px;animation-delay:-6s"></div><div class="blob" style="width:320px;height:320px;background:#35d0ff;top:38%;left:58%;animation-delay:-10s"></div>' +
      '<div class="wrap"><h1>' + g + '</h1><p class="sub">What are we watching today?</p>' +
      '<form class="sf" id="sf"><input id="sq" placeholder="Search anime" autocomplete="off"><button>' + ic('search', 18) + 'Search</button></form>' +
      '<h2>' + ic('zap', 15) + 'Quick links</h2><div class="chips">' + [['Home', 'https://aniworld.to'], ['All anime', 'https://aniworld.to/animes'], ['Popular', 'https://aniworld.to/beliebte-animes'], ['New', 'https://aniworld.to/neu']].map(function (x) { return '<div class="chip" data-u="' + x[1] + '">' + x[0] + '</div>'; }).join('') + '</div>' +
      '<h2>' + ic('play', 15) + 'Continue watching</h2><div class="grid">' + (cards.map(function (e, i) { return '<div class="tile" style="animation-delay:' + (300 + i * 110) + 'ms" data-u="' + esc(e.url) + '">' + art(e.slug, true) + '<div class="t">' + esc(e.title) + '</div><div class="m">' + label(e) + '</div></div>'; }).join('') || '<div style="color:var(--mu)">Nothing watched yet. Search above to get started.</div>') + '</div>' +
      '<h2>' + ic('heart', 15) + 'Favorites</h2><div class="chips">' + (d.favs.slice(0, 20).map(function (f) { return '<div class="chip" data-u="' + esc(f.url) + '">' + esc(f.title) + '</div>'; }).join('') || '<div style="color:var(--mu)">Press Ctrl+D on any anime page to add it here.</div>') + '</div>' +
      '<h2>' + ic('chart', 15) + 'Your stats</h2><div class="stats"><div class="stat"><b>' + d.history.length + '</b>Episodes watched</div><div class="stat"><b>' + Object.keys(slugs).length + '</b>Different anime</div><div class="stat"><b>' + Math.floor(ws / 3600) + 'h ' + ('0' + Math.floor(ws % 3600 / 60)).slice(-2) + 'm</b>Watch time</div><div class="stat"><b>' + d.favs.length + '</b>Favorites</div></div></div>';
    Q.sh.getElementById('L').insertBefore(el, Q.sh.getElementById('L').firstChild);
    el.addEventListener('click', function (e) { var t = e.target.closest('[data-u]'); if (t) location.href = t.dataset.u; });
    el.querySelector('#sf').addEventListener('submit', function (e) { e.preventDefault(); go(el.querySelector('#sq').value); });
    setTimeout(function () { var q = el.querySelector('#sq'); if (q) q.focus(); }, 200);
  }

  function wire() {
    Q.sh.addEventListener('click', function (e) {
      var t = e.target, el;
      if ((el = t.closest('[data-del]'))) { var ts = +el.dataset.del; S.data.history = S.data.history.filter(function (x) { return x.ts !== ts; }); saveData(); renderPanel(); e.stopPropagation(); return; }
      if ((el = t.closest('[data-delf]'))) { S.data.favs.splice(+el.dataset.delf, 1); saveData(); renderPanel(); updateStar(); return; }
      if ((el = t.closest('[data-tab]'))) { tab = el.dataset.tab; renderPanel(); return; }
      if ((el = t.closest('[data-sec]'))) { sec = +el.dataset.sec; renderSettings(); return; }
      if ((el = t.closest('[data-theme]'))) { setCfg('theme', el.dataset.theme); return; }
      if ((el = t.closest('[data-ac]'))) { setCfg('accent', el.dataset.ac); return; }
      if ((el = t.closest('.pi'))) { runPal(+el.dataset.i); return; }
      if ((el = t.closest('.it[data-u]'))) { location.href = el.dataset.u; return; }
      if (t === Q.sset || t === Q.spal) { closeAll(); return; }
      if ((el = t.closest('[data-a]'))) {
        var a = el.dataset.a;
        if (a === 'left') history.back(); else if (a === 'right') history.forward(); else if (a === 'reload') location.reload();
        else if (a === 'home') goHome(); else if (a === 'star') toggleFav(); else if (a === 'cont') cont(); else if (a === 'next') nextEp();
        else if (a === 'rand') randomAnime(); else if (a === 'panel') togglePanel(); else if (a === 'pal') openPal(); else if (a === 'set') openSettings();
        else if (a === 'pin') { S.cfg.dock_pin = !S.cfg.dock_pin; saveCfg(); setPin(); }
        else if (a === 'closep') Q.panel.classList.remove('open'); else if (a === 'closes') Q.sset.classList.remove('open');
        else if (a === 'clearh') { if (confirm('Delete all watch history?')) { S.data.history = []; saveData(); renderPanel(); } }
        else if (a === 'cleardata') send({ t: 'cleardata' }); else if (a === 'openfolder') send({ t: 'openfolder' });
        else if (a === 'reset') { if (confirm('Reset all settings?')) send({ t: 'reset' }); }
      }
    });
    Q.sh.addEventListener('input', function (e) {
      var t = e.target, k = t.dataset && t.dataset.k;
      if (k) {
        var v = t.type === 'checkbox' ? t.checked : t.type === 'range' ? parseFloat(t.value) : t.value;
        if (t.type === 'range' && t.nextElementSibling) t.nextElementSibling.textContent = v;
        setCfg(k, v);
      } else if (t === Q.pin) { palSel = 0; renderPal(); }
    });
    Q.pin.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') { palSel = Math.min(palSel + 1, palItems.length - 1); renderPal(); e.preventDefault(); }
      else if (e.key === 'ArrowUp') { palSel = Math.max(palSel - 1, 0); renderPal(); e.preventDefault(); }
      else if (e.key === 'Enter') runPal(palSel);
    });
    Q.addr.addEventListener('submit', function (e) { e.preventDefault(); go(Q.in.value); Q.in.blur(); });
    Q.dock.addEventListener('mouseenter', showDock);
    Q.dock.addEventListener('mouseleave', function () { hideDock(900); });
    Q.handle.addEventListener('mouseenter', function () { showDock(); hideDock(2600); });
    Q.handle.addEventListener('click', showDock);
    addEventListener('keydown', function (e) {
      var k = e.key.toLowerCase(), c = e.ctrlKey || e.metaKey;
      if (c && k === 'k') { e.preventDefault(); openPal(); }
      else if (c && k === 'h') { e.preventDefault(); togglePanel(); }
      else if (c && k === 'd') { e.preventDefault(); toggleFav(); }
      else if (c && k === ',') { e.preventDefault(); openSettings(); }
      else if (c && k === 'l') { e.preventDefault(); showDock(); Q.in.focus(); Q.in.select(); }
      else if (c && e.shiftKey && k === 'l') { e.preventDefault(); var n = Object.keys(THEMES), i = n.indexOf(S.cfg.theme); setCfg('theme', n[(i + 1) % n.length]); toast('Theme: ' + S.cfg.theme); }
      else if (c && e.shiftKey && k === 'h') { e.preventDefault(); send({ t: 'boss' }); }
      else if (e.altKey && k === 'n') { e.preventDefault(); nextEp(); }
      else if (e.altKey && k === 'c') { e.preventDefault(); cont(); }
      else if (k === 'escape') closeAll();
    }, true);
    addEventListener('message', function (e) { if (e.data && e.data.__ac === 'next' && S.cfg.autonext !== undefined) nextEp(); });
    setInterval(function () {
      if (document.visibilityState === 'visible' && /episode-\d+|film-\d+/.test(location.pathname) && /aniworld\.to$/.test(location.hostname)) {
        S.data.watch_seconds = (S.data.watch_seconds || 0) + 30;
        saveData();
      }
    }, 30000);
  }

  function init() {
    build();
    applyTheme();
    wire();
    updateStar();
    setPin();
    showDock();
    hideDock(3200);
    track();
    if (IS_START) renderStart();
    try { if (sessionStorage.getItem('__ac_rand') && /\/animes/.test(location.pathname)) { sessionStorage.removeItem('__ac_rand'); var a = [].slice.call(document.querySelectorAll('a[href^="/anime/stream/"]')); if (a.length) location.href = a[Math.floor(Math.random() * a.length)].href; } } catch (e) {}
    if (S.cfg.custom_js) { try { (new Function(S.cfg.custom_js))(); } catch (e) {} }
  }

  function boot() { send({ t: 'hello' }); }
  if (br) {
    br.addEventListener('message', function (e) {
      var m = e.data;
      if (!m) return;
      if (m.t === 'state' && /just a moment|checking your browser|attention required|verify you are human/i.test(document.title)) return;
      if (m.t === 'state') { S.cfg = m.cfg; S.data = m.data; if (!window.__ac_inited) { window.__ac_inited = 1; init(); } else { applyTheme(); } }
      else if (m.t === 'toast' && Q.toast) toast(m.m);
      else if (m.t === 'cfg') { S.cfg = m.cfg; applyTheme(); renderSettings(); }
    });
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
  }
})();
