/**
 * SEOS Popup CTA — site-wide loader
 *
 * What this script does:
 *   1. Bails out on /kontakt
 *   2. Injects popup CSS into <head>
 *   3. Injects popup DOM (.pct-root) into <body>
 *   4. Wires open/close, view switching, Cal.com inline embed, message form
 *   5. Adds mobile bottom-sheet behavior and hides pill on mobile when open
 *
 * Host this file at a public URL (GitHub raw + jsDelivr recommended) and
 * register it as a Webflow Site-level footer script.
 *
 * Example registration URL via jsDelivr:
 *   https://cdn.jsdelivr.net/gh/<user>/<repo>@main/popup-cta.js
 */
(function () {
  // 1. Route guard — never load on /kontakt
  if (/^\/kontakt(\/|$|\?)/.test(location.pathname)) return;
  if (document.querySelector('.pct-root')) return; // already on page (e.g. /popup-cta-test)

  var CAL_LINK = 'douglas-ekman-seos/15min';
  var EYE_GIF = 'https://cdn.prod.website-files.com/69599653517bcce3c01ac8b6/6a0443a58de05a5a1a58cce9_Animation_White-eyeonly%20half-speed.gif';

  // ─── 2. Inject CSS ────────────────────────────────────────────────
  var CSS = `
.pct-root{position:fixed;bottom:1.5rem;right:1.5rem;z-index:9000;font-family:'Mona Sans',sans-serif}
.pct-pill{display:inline-flex;align-items:center;gap:.75rem;background:#0e0e0e;color:#fff;border:1px solid #0e0e0e;border-radius:100px;padding:.5rem 1.25rem .5rem .5rem;box-shadow:0 24px 48px -16px rgba(0,0,0,.45),0 4px 12px -4px rgba(0,0,0,.35);cursor:pointer;font-family:inherit;transition:transform .25s ease,box-shadow .25s ease}
.pct-pill:hover{transform:translateY(-2px);box-shadow:0 32px 64px -16px rgba(0,0,0,.55)}
.pct-eye-orb{width:36px;height:36px;border-radius:50%;flex-shrink:0;overflow:hidden;display:flex;align-items:center;justify-content:center;background:#0e0e0e}
.pct-eye-orb img{width:100%;height:100%;object-fit:contain;display:block}
.pct-pill-label{display:flex;flex-direction:column;line-height:1.1;text-align:left;gap:1px}
.pct-pill-label .top{font-family:'DM Mono',monospace;font-size:.55rem;letter-spacing:.1em;text-transform:uppercase;opacity:.55}
.pct-pill-label .bot{font-family:'Mona Sans',sans-serif;font-weight:500;font-size:.78rem;letter-spacing:.01em;line-height:1.15}
.pct-pulse{width:8px;height:8px;border-radius:50%;background:#22c55e;box-shadow:0 0 0 0 rgba(34,197,94,.7);animation:pctPul 2.4s infinite;flex-shrink:0}
@keyframes pctPul{0%{box-shadow:0 0 0 0 rgba(34,197,94,.7)}70%{box-shadow:0 0 0 9px rgba(34,197,94,0)}100%{box-shadow:0 0 0 0 rgba(34,197,94,0)}}
.pct-panel{position:absolute;bottom:calc(100% + .75rem);right:0;width:380px;max-width:calc(100vw - 3rem);background:#0e0e0e;color:#fff;border-radius:1.25rem;overflow:hidden;box-shadow:0 40px 80px -20px rgba(0,0,0,.6),0 12px 32px -8px rgba(0,0,0,.5);border:1px solid rgba(255,255,255,.08);transform-origin:bottom right;display:none}
.pct-root[data-pct-state="open"] .pct-panel{display:block;animation:pctIn .35s cubic-bezier(.2,.9,.25,1.15) both}
@keyframes pctIn{from{opacity:0;transform:scale(.85) translateY(8px)}to{opacity:1;transform:scale(1) translateY(0)}}
.pct-panel-head{padding:1.25rem 1.5rem 1rem;border-bottom:1px solid rgba(255,255,255,.08)}
.pct-brand{display:flex;align-items:center;gap:.5rem;font-family:'DM Mono',monospace;font-size:.625rem;letter-spacing:.15em;text-transform:uppercase;opacity:.7;margin-bottom:.75rem}
.pct-brand-dot{width:6px;height:6px;border-radius:50%;background:#22c55e}
.pct-greeting{font-family:'Mona Sans',sans-serif;font-stretch:75%;font-size:1.3rem;line-height:1.1;font-weight:800;letter-spacing:.005em;text-transform:uppercase;margin:0}
.pct-greeting .accent{font-weight:200;opacity:.5}
.pct-sub{margin:.5rem 0 0;font-size:.78rem;line-height:1.45;color:#d1d1d1;max-width:22rem}
.pct-paths{padding:1rem;display:flex;flex-direction:column;gap:.5rem}
.pct-path{display:flex;align-items:center;gap:1rem;width:100%;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.07);border-radius:1rem;padding:1rem 1.1rem;text-align:left;cursor:pointer;font-family:inherit;color:inherit;transition:all .25s ease}
.pct-path:hover{background:rgba(255,255,255,.08);border-color:rgba(255,255,255,.18);transform:translateY(-1px)}
.pct-path-num{font-family:'DM Mono',monospace;font-size:.625rem;letter-spacing:.1em;opacity:.5;min-width:1.5rem}
.pct-path-icon{width:36px;height:36px;border-radius:50%;background:#fff;color:#0e0e0e;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.pct-path-text{flex:1}
.pct-path-title{font-family:'Mona Sans',sans-serif;font-stretch:75%;font-weight:800;font-size:1.1rem;text-transform:uppercase;letter-spacing:.02em;line-height:1;margin-bottom:.25rem}
.pct-path-desc{font-size:.75rem;color:#d1d1d1;line-height:1.3}
.pct-path-arrow{color:inherit;opacity:.5;transition:all .25s ease}
.pct-path:hover .pct-path-arrow{opacity:1;transform:translateX(3px)}
.pct-foot{padding:.85rem 1.5rem;display:flex;align-items:center;justify-content:space-between;border-top:1px solid rgba(255,255,255,.06);font-family:'DM Mono',monospace;font-size:.6rem;letter-spacing:.1em;text-transform:uppercase;color:#d1d1d1}
.pct-mail{color:inherit;text-decoration:none;border-bottom:1px solid rgba(255,255,255,.25)}
.pct-mail:hover{color:#fff;border-bottom-color:#fff}
.pct-back-row{padding:1.1rem 1.25rem 1rem;display:flex;align-items:center;justify-content:space-between}
.pct-back,.pct-submit{display:inline-flex;align-items:center;gap:.45rem;padding:.35rem 1rem;background:transparent;border:1px solid rgba(255,255,255,.2);border-radius:100px;color:#fff;font-family:'Mona Sans',sans-serif;font-size:.65rem;letter-spacing:.08em;text-transform:uppercase;cursor:pointer;line-height:1;height:auto}
.pct-back{padding:.35rem .85rem .35rem .65rem}
.pct-back:hover,.pct-submit:hover{background:#fff;color:#0e0e0e;border-color:#fff}
.pct-back svg{width:11px;height:11px}
.pct-submit{margin-top:.5rem;align-self:flex-end;background:#fff;color:#0e0e0e;border-color:#fff}
.pct-submit:hover{background:transparent;color:#fff;border-color:rgba(255,255,255,.4)}
.pct-resp{font-family:'DM Mono',monospace;font-size:.55rem;letter-spacing:.12em;text-transform:uppercase;color:#fff;opacity:.5;padding:.35rem .75rem;border:1px solid rgba(255,255,255,.08);border-radius:100px}
.pct-book-head{padding:.25rem 1.5rem 1rem}
.pct-book-title{font-family:'Mona Sans',sans-serif;font-stretch:75%;font-size:1.5rem;font-weight:800;text-transform:uppercase;letter-spacing:.02em;line-height:1;margin-bottom:.5rem}
.pct-book-meta{font-family:'DM Mono',monospace;font-size:.625rem;letter-spacing:.1em;text-transform:uppercase;color:#d1d1d1;display:flex;gap:1rem}
.pct-cal-embed{padding:0 1rem 1rem;min-height:420px;max-height:520px;overflow:auto}
.pct-msg-form{padding:0 1.25rem 1.5rem;display:flex;flex-direction:column;gap:.6rem}
.pct-input{width:100%;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08);border-radius:100px;padding:.85rem 1.1rem;color:inherit;font-family:inherit;font-size:.85rem;outline:none;transition:all .25s ease}
.pct-input:focus{border-color:rgba(255,255,255,.3);background:rgba(255,255,255,.08)}
.pct-input::placeholder{color:rgba(255,255,255,.4)}
.pct-textarea{border-radius:1rem;min-height:90px;resize:none}
.pct-success{padding:2rem 1.5rem 2.5rem;text-align:center;display:flex;flex-direction:column;align-items:center;gap:.5rem}
.pct-success-title{font-family:'Mona Sans',sans-serif;font-stretch:75%;font-weight:800;font-size:1.75rem;text-transform:uppercase;letter-spacing:.02em;line-height:1}
.pct-success-title span{font-weight:200;opacity:.6;display:block}
.pct-success-sub{font-size:.8rem;color:#d1d1d1;max-width:18rem;line-height:1.45;margin:0}
@media(max-width:767px){.pct-root{left:0;right:0;bottom:0}
.pct-pill{position:fixed;right:1rem;bottom:1rem}
.pct-panel{position:fixed;left:0;right:0;bottom:0;width:100vw;max-width:100vw;max-height:88vh;border-radius:1.25rem 1.25rem 0 0;overflow-y:auto}
.pct-root[data-pct-state="open"] .pct-pill{display:none}
.pct-cal-embed{min-height:60vh}}
`;
  var styleEl = document.createElement('style');
  styleEl.id = 'pct-style';
  styleEl.textContent = CSS;
  document.head.appendChild(styleEl);

  // ─── 3. Build & inject HTML ────────────────────────────────────────
  var SVG_A = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var SVG_B = '<svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M11 18l-6-6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var SVG_C = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" stroke-width="2"/><path d="M3 10h18M8 3v4M16 3v4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
  var SVG_M = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M21 12c0 4.418-4.03 8-9 8-1.234 0-2.41-.22-3.488-.62L3 21l1.62-4.512C3.598 15.21 3 13.66 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>';

  var HTML = `
<div class="pct-root pct-pos-br" data-pct-state="closed">
  <div class="pct-panel" role="dialog" aria-label="Kontakta SEOS">
    <div class="pct-view pct-view-menu">
      <div class="pct-panel-head">
        <div class="pct-brand"><span class="pct-brand-dot"></span>Seos Design · Online</div>
        <h3 class="pct-greeting">Hej, hur kan vi <span class="accent">hjälpa dig?</span></h3>
        <p class="pct-sub">Vi älskar att automatisera – men det ersätter inte mänsklig kontakt. Berätta om din idé, eller boka ett kort möte direkt.<br><br>Du hör från oss samma dag.</p>
      </div>
      <div class="pct-paths">
        <button class="pct-path" data-pct-pick="book" type="button">
          <div class="pct-path-num">(01)</div>
          <div class="pct-path-icon">${SVG_C}</div>
          <div class="pct-path-text">
            <div class="pct-path-title">Boka 15 min</div>
            <div class="pct-path-desc">Digitalt rådgivningsmöte med Douglas</div>
          </div>
          <div class="pct-path-arrow">${SVG_A}</div>
        </button>
        <button class="pct-path" data-pct-pick="msg" type="button">
          <div class="pct-path-num">(02)</div>
          <div class="pct-path-icon">${SVG_M}</div>
          <div class="pct-path-text">
            <div class="pct-path-title">Skicka meddelande</div>
            <div class="pct-path-desc">Personligt svar inom 4 timmar<br>Vardagar 09–17</div>
          </div>
          <div class="pct-path-arrow">${SVG_A}</div>
        </button>
      </div>
      <div class="pct-foot">
        <span>Teamet är online</span>
        <a href="mailto:kontakt@seosdesign.se" class="pct-mail">kontakt@seosdesign.se</a>
      </div>
    </div>
    <div class="pct-view pct-view-book" hidden>
      <div class="pct-back-row">
        <button class="pct-back" data-pct-back type="button">${SVG_B} Tillbaka</button>
      </div>
      <div class="pct-book-head">
        <div class="pct-book-title">Boka 15 min</div>
        <div class="pct-book-meta"><span>15 min</span><span>Google Meet</span></div>
      </div>
      <div class="pct-cal-embed" data-pct-cal></div>
    </div>
    <div class="pct-view pct-view-msg" hidden>
      <div class="pct-back-row">
        <button class="pct-back" data-pct-back type="button">${SVG_B} Tillbaka</button>
        <span class="pct-resp">Svar &lt; 4h</span>
      </div>
      <div class="pct-book-head">
        <div class="pct-book-title">Skriv till oss</div>
      </div>
      <form class="pct-msg-form" data-pct-msg-form>
        <input class="pct-input" name="name" placeholder="Namn" required>
        <input class="pct-input" name="email" type="email" placeholder="E-post" required>
        <textarea class="pct-input pct-textarea" name="message" placeholder="Berätta kort om projektet…" required></textarea>
        <button type="submit" class="pct-submit">Skicka</button>
      </form>
    </div>
    <div class="pct-view pct-view-success" hidden>
      <div class="pct-success">
        <div class="pct-success-title">Tack!<span>vi hörs snart</span></div>
        <p class="pct-success-sub" data-pct-success-sub>Vi återkommer inom kort.</p>
        <button class="pct-submit" data-pct-close type="button">Stäng</button>
      </div>
    </div>
  </div>
  <button class="pct-pill" data-pct-toggle type="button" aria-label="Öppna kontakt">
    <span class="pct-eye-orb"><img src="${EYE_GIF}" alt=""></span>
    <span class="pct-pill-label">
      <span class="top">Online · Svar &lt; 4h</span>
      <span class="bot">Hör av dig</span>
    </span>
    <span class="pct-pulse"></span>
  </button>
</div>`;

  var wrap = document.createElement('div');
  wrap.innerHTML = HTML.trim();
  document.body.appendChild(wrap.firstChild);

  // ─── 4. Behavior ──────────────────────────────────────────────────
  var root = document.querySelector('.pct-root');
  var pill = root.querySelector('[data-pct-toggle]');
  var panel = root.querySelector('.pct-panel');
  var views = root.querySelectorAll('.pct-view');
  var calMount = root.querySelector('[data-pct-cal]');
  var msgForm = root.querySelector('[data-pct-msg-form]');
  var calLoaded = false;

  function showView(name) {
    views.forEach(function (v) {
      v.hidden = !v.classList.contains('pct-view-' + name);
    });
    if (name === 'book') loadCal();
  }
  function open() { root.setAttribute('data-pct-state', 'open'); showView('menu'); }
  function close() {
    root.setAttribute('data-pct-state', 'closed');
    setTimeout(function () { showView('menu'); }, 320);
  }
  function isOpen() { return root.getAttribute('data-pct-state') === 'open'; }

  function loadCal() {
    if (calLoaded || !calMount) return;
    calLoaded = true;
    calMount.innerHTML = '';
    (function (C, A, K) {
      var P = function (a, b) { a.q.push(b); };
      var d = C.document;
      C.Cal = C.Cal || function () {
        var c = C.Cal, a = arguments;
        if (!c.loaded) { c.ns = {}; c.q = c.q || []; d.head.appendChild(d.createElement('script')).src = A; c.loaded = true; }
        if (a[0] === K) {
          var x = function () { P(x, arguments); };
          var n = a[1];
          x.q = x.q || [];
          if (typeof n === 'string') { c.ns[n] = c.ns[n] || x; P(c.ns[n], a); P(c, ['initNamespace', n]); }
          else P(c, a);
          return;
        }
        P(c, a);
      };
    })(window, 'https://app.cal.com/embed/embed.js', 'init');
    Cal('init', 'pct', { origin: 'https://cal.com' });
    Cal.ns.pct('inline', { elementOrSelector: calMount, calLink: CAL_LINK, config: { theme: 'dark', layout: 'month_view' } });
    Cal.ns.pct('ui', { theme: 'dark' });
  }

  pill.addEventListener('click', function () { isOpen() ? close() : open(); });
  root.querySelectorAll('[data-pct-pick]').forEach(function (b) {
    b.addEventListener('click', function () { showView(b.getAttribute('data-pct-pick') === 'book' ? 'book' : 'msg'); });
  });
  root.querySelectorAll('[data-pct-back]').forEach(function (b) {
    b.addEventListener('click', function () { showView('menu'); });
  });
  root.querySelectorAll('[data-pct-close]').forEach(function (b) {
    b.addEventListener('click', close);
  });
  if (msgForm) {
    msgForm.addEventListener('submit', function (e) {
      e.preventDefault();
      showView('success');
      setTimeout(function () { msgForm.reset(); }, 400);
    });
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && isOpen()) close();
  });
  document.addEventListener('mousedown', function (e) {
    if (isOpen() && !root.contains(e.target)) close();
  });
})();
