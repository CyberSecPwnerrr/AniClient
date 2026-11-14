(function () {
  if (window.__ac_frame) return;
  window.__ac_frame = 1;
  var C = __CFG__;
  var TOP = window === window.top;
  if (/(^|\.)cloudflare\.com$/.test(location.hostname)) return;
  var CH = /just a moment|checking your browser|attention required|verify you are human/i;

  function addStyle(css) {
    var go = function () {
      var p = document.head || document.documentElement;
      if (!p) return false;
      var s = document.createElement('style');
      s.textContent = css;
      p.appendChild(s);
      return true;
    };
    if (!go()) {
      var mo = new MutationObserver(function () { if (go()) mo.disconnect(); });
      mo.observe(document, { childList: true, subtree: true });
    }
  }

  if (C.cosmetic) {
    addStyle("ins.adsbygoogle,[id^='aswift'],[id*='google_ads'],[class*='adsbygoogle'],iframe[src*='doubleclick'],iframe[src*='googlesyndication'],iframe[src*='adsterra'],iframe[src*='popads'],iframe[src*='exoclick'],[class*='ad-banner'],[class*='advert'],[id*='advert'],[class*='sponsor'],[id*='sponsor'],a[href*='popads'],a[href*='adsterra'],.ads,.ad-container,[id*='banner-ad'],[class*='banner-ad']{display:none!important;visibility:hidden!important;height:0!important;}");
  }
  if (C.hide_cookie) {
    addStyle("#cookie-banner,[id*='cookie-'],[class*='cookie-banner'],[class*='cookie-consent'],[class*='cookiebar'],#cmpbox,.cmp-container,#onetrust-banner-sdk,.cc-window{display:none!important;}");
  }

  if (C.cosmetic) {
    setInterval(function () {
      var b = document.body;
      if (!b || CH.test(document.title)) return;
      var W = innerWidth, H = innerHeight;
      for (var i = 0; i < b.children.length; i++) {
        var n = b.children[i];
        if (n.id === 'aniclient-root' || /^(VIDEO|SCRIPT|STYLE|IFRAME)$/.test(n.tagName)) continue;
        var cs = getComputedStyle(n);
        if ((cs.position === 'fixed' || cs.position === 'absolute') && n.offsetWidth >= W * 0.9 && n.offsetHeight >= H * 0.9 &&
          !n.querySelector('video,iframe,input,button,canvas,form') && n.children.length < 3 &&
          (parseFloat(cs.opacity) < 0.08 || cs.backgroundColor === 'rgba(0, 0, 0, 0)') && parseInt(cs.zIndex, 10) > 100) {
          n.remove();
        }
      }
    }, 1200);
  }

  function host() {
    return document.fullscreenElement && document.fullscreenElement.tagName !== 'VIDEO' ? document.fullscreenElement : document.body;
  }
  function toast(t) {
    var d = document.getElementById('__ac_t');
    if (!d) {
      d = document.createElement('div');
      d.id = '__ac_t';
      d.style.cssText = 'position:fixed;top:14px;left:50%;transform:translateX(-50%);padding:8px 16px;background:rgba(0,0,0,.72);color:#fff;border-radius:12px;font:600 13px sans-serif;z-index:2147483647;pointer-events:none;transition:opacity .3s;backdrop-filter:blur(8px)';
    }
    var h = host();
    if (!h) return;
    if (d.parentNode !== h) h.appendChild(d);
    d.textContent = t;
    d.style.opacity = 1;
    clearTimeout(d.__t);
    d.__t = setTimeout(function () { d.style.opacity = 0; }, 1400);
  }
  function mainVideo() { return document.querySelector('video'); }

  function skipBtn(v) {
    if (!C.skipbtn) return;
    var b = document.createElement('button');
    b.textContent = 'Skip Intro \u203a\u203a\u203a';
    b.style.cssText = 'position:fixed;right:24px;bottom:78px;padding:10px 18px;border:none;border-radius:12px;background:' + C.accent + ';color:#fff;font:700 13px sans-serif;cursor:pointer;z-index:2147483647;display:none;box-shadow:0 8px 24px rgba(0,0,0,.35)';
    b.onclick = function (e) { e.stopPropagation(); v.currentTime += C.skip; b.style.display = 'none'; };
    (document.body || document.documentElement).appendChild(b);
    setInterval(function () {
      var h = host();
      if (h && b.parentNode !== h) h.appendChild(b);
      b.style.display = (v.currentTime > 3 && v.currentTime < 300 && !v.paused) ? 'block' : 'none';
    }, 700);
  }

  function setup(v) {
    if (v.__ac) return;
    v.__ac = 1;
    try { v.playbackRate = C.speed; v.volume = C.volume / 100; } catch (e) {}
    v.addEventListener('loadedmetadata', function () { try { v.playbackRate = C.speed; } catch (e) {} });
    var key = '__ac_pos:' + location.pathname;
    var restore = function () {
      if (!C.resume) return;
      try {
        var p = parseFloat(localStorage.getItem(key));
        if (p > 5 && v.duration && p < v.duration - 20) v.currentTime = p;
      } catch (e) {}
    };
    if (v.readyState > 0) restore(); else v.addEventListener('loadedmetadata', restore, { once: true });
    var last = 0;
    v.addEventListener('timeupdate', function () {
      var n = Date.now();
      if (n - last > 4000) { last = n; try { localStorage.setItem(key, v.currentTime); } catch (e) {} }
    });
    v.addEventListener('ended', function () {
      try { localStorage.removeItem(key); } catch (e) {}
      if (C.autonext) window.top.postMessage({ __ac: 'next' }, '*');
    });
    if (C.autoplay) { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
    skipBtn(v);
  }
  function scan() {
    var vs = document.querySelectorAll('video');
    for (var i = 0; i < vs.length; i++) setup(vs[i]);
  }
  var started = false;
  function start() {
    if (started || !document.documentElement) return;
    started = true;
    scan();
    new MutationObserver(scan).observe(document.documentElement, { childList: true, subtree: true });
  }
  start();
  document.addEventListener('DOMContentLoaded', start);

  addEventListener('keydown', function (e) {
    var t = e.target;
    if ((t && /INPUT|TEXTAREA|SELECT/.test(t.tagName)) || e.ctrlKey || e.altKey || e.metaKey) return;
    var k = e.key;
    if (k === 'n') { window.top.postMessage({ __ac: 'next' }, '*'); return; }
    var v = mainVideo();
    if (!v) return;
    if (k === 's') { v.currentTime += C.skip; toast('Skipped ' + C.skip + 's'); }
    else if (k === '.') { v.playbackRate = Math.min(4, +(v.playbackRate + 0.25).toFixed(2)); toast('Speed ' + v.playbackRate + 'x'); }
    else if (k === ',') { v.playbackRate = Math.max(0.25, +(v.playbackRate - 0.25).toFixed(2)); toast('Speed ' + v.playbackRate + 'x'); }
    else if (k === 'l') { v.currentTime += 10; toast('+10s'); }
    else if (k === 'j') { v.currentTime -= 10; toast('-10s'); }
    else if (k === 'm') { v.muted = !v.muted; toast(v.muted ? 'Muted' : 'Unmuted'); }
    else if (k === 'p' && v.requestPictureInPicture) {
      if (document.pictureInPictureElement) document.exitPictureInPicture();
      else v.requestPictureInPicture().catch(function () {});
    }
  }, true);
})();
