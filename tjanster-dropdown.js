/**
 * SEOS — Tjänster nav dropdown upgrade
 *
 * Targets the existing .nav-dropdown-wrapper + .services-flyout on every page.
 * Re-skins the panel + cards to match the "design_handoff_animated_dropdown"
 * spec, adds eyebrow label, (0X) numbers, caret-with-rotation, and the locked
 * 800ms text-reveal animation with 95ms per-row stagger.
 *
 * No markup is added or removed by Webflow — this script:
 *   1. Adds a caret span inside the trigger
 *   2. Adds a .dd-label header inside .services-flyout
 *   3. Wraps each .service-card's content with (0X) eyebrow number
 *   4. Sets --i on each card for staggered transitions
 *   5. Toggles .is-open on .nav-dropdown-wrapper via mouseenter/mouseleave/focus/click/Escape
 *   6. Injects all CSS overrides
 *
 * Uses CMS items as-is (does NOT swap copy).
 *
 * Distribute via jsDelivr from elliot772/Seos repo.
 */
(function () {
  if (window.__seosTjansterDropdown) return;
  window.__seosTjansterDropdown = true;

  var CSS = `
.nav-dropdown-wrapper{position:relative}

/* ── Trigger pill states ── */
.nav-dropdown-wrapper > .nav-link{
  display:inline-flex;align-items:center;gap:.4rem;
  transition:background-color .25s ease, color .25s ease;
}
.nav-dropdown-wrapper > .nav-link .tjd-caret{
  width:8px;height:8px;display:inline-block;flex-shrink:0;
  border-right:1.5px solid currentColor;
  border-bottom:1.5px solid currentColor;
  transform:rotate(45deg) translateY(-1px);
  transition:transform .35s ease;
}
.nav-dropdown-wrapper.is-open > .nav-link{
  background:rgba(255,255,255,.92) !important;
  color:#0e0e0e !important;
}
.nav-dropdown-wrapper.is-open > .nav-link .tjd-caret{
  transform:rotate(-135deg) translateY(1px);
}
.nav-dropdown-wrapper.is-open > .nav-link .gsap_split_letter{ color:#0e0e0e !important; }

/* ── Panel ── */
.services-flyout{
  --dd-dur: 800ms;
  --dd-stagger: 95ms;
  --dd-ease: cubic-bezier(.2, .7, .2, 1);

  position:absolute !important;
  top:100% !important;
  left:50% !important;
  width:min(680px, 92vw) !important;
  min-width:0 !important;
  margin-top:14px !important;
  padding:.5rem !important;
  background:rgba(14,14,14,.92) !important;
  border:1px solid rgba(255,255,255,.10) !important;
  border-radius:1.5rem !important;
  -webkit-backdrop-filter:blur(14px);
  backdrop-filter:blur(14px);
  box-shadow:0 30px 60px -20px rgba(0,0,0,.6), inset 0 0 0 1px rgba(255,255,255,.02) !important;

  opacity:0 !important;
  visibility:hidden !important;
  pointer-events:none !important;
  transform:translateX(-50%) !important;
  transform-origin:top center;
  transition:opacity 240ms var(--dd-ease), visibility 0s linear var(--dd-dur) !important;
}
/* 14px hover-bridge */
.anti-mousleave-spacer{
  position:absolute !important;
  top:-14px !important; left:0 !important; right:0 !important;
  height:14px !important; background:transparent !important;
  pointer-events:auto !important;
}
.nav-dropdown-wrapper.is-open .services-flyout{
  opacity:1 !important;
  visibility:visible !important;
  pointer-events:auto !important;
  transition:opacity 240ms var(--dd-ease), visibility 0s linear 0s !important;
}

/* ── Eyebrow label injected at runtime ── */
.tjd-label{
  display:flex;align-items:center;justify-content:space-between;
  padding:.5rem .75rem .4rem;
  font-family:'DM Mono', ui-monospace, monospace;
  font-size:.65rem;letter-spacing:.2em;
  color:#d1d1d1;text-transform:uppercase;opacity:.75;
}
.tjd-label .tjd-dot{
  width:6px;height:6px;border-radius:50%;background:#fff;
  display:inline-block;margin-right:.5rem;vertical-align:middle;
}

/* ── Grid ── */
.services-flyout .w-dyn-list{ width:100% !important; }
.services-flyout .w-dyn-items{
  display:grid !important;
  grid-template-columns:1fr 1fr !important;
  gap:.4rem !important;
  margin:0 !important; padding:0 !important; list-style:none !important;
}
.services-flyout .w-dyn-item{
  margin:0 !important; padding:0 !important; list-style:none !important;
  width:100% !important; min-width:0 !important;
}

/* ── Card ── */
.services-flyout .service-card{
  --i: 0;
  position:relative;display:block;
  padding:.95rem 1.1rem 1.05rem !important;
  border-radius:1rem !important;
  background:rgba(255,255,255,.025) !important;
  border:1px solid rgba(255,255,255,.06) !important;
  color:#fff !important;text-decoration:none !important;
  overflow:hidden !important;
  min-height:0 !important; max-height:none !important;
  transition:background-color .3s ease, border-color .3s ease, transform .3s ease !important;
}
.services-flyout .service-card::before{
  content:"→";
  position:absolute;top:.85rem;right:.95rem;
  font-family:'DM Mono', ui-monospace, monospace;
  font-size:.9rem;color:#fff;
  opacity:0;transform:translate(-6px, 2px);
  transition:opacity .3s ease, transform .3s ease;
}
.services-flyout .service-card:hover{
  background:rgba(255,255,255,.06) !important;
  border-color:rgba(255,255,255,.14) !important;
  transform:none !important;
}
.services-flyout .service-card:hover::before{ opacity:.9;transform:translate(0,0) }

/* Injected (0X) eyebrow */
.services-flyout .service-card .tjd-num{
  display:block;
  font-family:'DM Mono', ui-monospace, monospace;
  font-size:.62rem;letter-spacing:.18em;
  color:#d1d1d1;opacity:.55;text-transform:uppercase;
  margin-bottom:.35rem;
}
.services-flyout .service-card .service-card-title{
  font-family:'Mona Sans', sans-serif !important;
  font-weight:600 !important;font-size:.95rem !important;
  color:#fff !important;margin:0 0 .25rem !important;line-height:1.2 !important;
  letter-spacing:0 !important;text-transform:none !important;
}
.services-flyout .service-card .service-card-desc{
  font-family:'Mona Sans', sans-serif !important;
  font-weight:400 !important;font-size:.78rem !important;
  line-height:1.45 !important;color:#d1d1d1 !important;opacity:.7 !important;
  margin:0 !important;max-width:28ch;
}

/* ── Per-row text reveal ── */
.services-flyout .service-card > *{
  display:block;
  transform:translateY(120%);
  transition:transform calc(var(--dd-dur) * .9) var(--dd-ease);
  transition-delay:calc(var(--i) * var(--dd-stagger));
}
.nav-dropdown-wrapper.is-open .services-flyout .service-card > *{
  transform:translateY(0);
}

@media (prefers-reduced-motion: reduce){
  .services-flyout,
  .services-flyout .service-card,
  .services-flyout .service-card > *{
    transition-duration:.001s !important;
    transition-delay:0s !important;
  }
}

@media (max-width: 720px){
  .services-flyout .w-dyn-items{ grid-template-columns:1fr !important; }
}
`;

  function inject(){
    if (document.getElementById('tjd-css')) return;
    var s = document.createElement('style');
    s.id = 'tjd-css';
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  function patchDom(wrap){
    if (wrap.dataset.tjdReady === '1') return;

    var trigger = wrap.querySelector('.nav-link');
    var flyout  = wrap.querySelector('.services-flyout');
    if (!trigger || !flyout) return;

    // 1. Add caret to trigger (skip if already present)
    if (!trigger.querySelector('.tjd-caret')){
      var caret = document.createElement('span');
      caret.className = 'tjd-caret';
      caret.setAttribute('aria-hidden', 'true');
      trigger.appendChild(caret);
    }

    // 2. Insert eyebrow label at top of flyout
    if (!flyout.querySelector('.tjd-label')){
      var label = document.createElement('div');
      label.className = 'tjd-label';
      var cards = flyout.querySelectorAll('.service-card');
      var count = cards.length || 7;
      var countStr = '(' + String(count).padStart(2, '0') + ')';
      label.innerHTML =
        '<span><span class="tjd-dot"></span>Våra tjänster</span>' +
        '<span>' + countStr + '</span>';
      var firstChild = flyout.firstChild;
      // Insert AFTER .anti-mousleave-spacer so the spacer stays at top
      var spacer = flyout.querySelector('.anti-mousleave-spacer');
      if (spacer && spacer.nextSibling){
        flyout.insertBefore(label, spacer.nextSibling);
      } else {
        flyout.appendChild(label);
      }
    }

    // 3. Decorate each .service-card: add (0X) num + --i index
    var cards = flyout.querySelectorAll('.service-card');
    cards.forEach(function(card, i){
      card.style.setProperty('--i', i);
      if (!card.querySelector('.tjd-num')){
        var num = document.createElement('span');
        num.className = 'tjd-num';
        num.textContent = '(' + String(i + 1).padStart(2, '0') + ')';
        card.insertBefore(num, card.firstChild);
      }
      // mark as menuitem for a11y
      if (!card.getAttribute('role')) card.setAttribute('role', 'menuitem');
    });
    flyout.setAttribute('role', 'menu');

    // 4. Trigger ARIA + behavior
    trigger.setAttribute('aria-haspopup', 'true');
    trigger.setAttribute('aria-expanded', 'false');

    var closeT;
    function open(){
      clearTimeout(closeT);
      wrap.classList.add('is-open');
      trigger.setAttribute('aria-expanded', 'true');
    }
    function close(delay){
      clearTimeout(closeT);
      closeT = setTimeout(function(){
        wrap.classList.remove('is-open');
        trigger.setAttribute('aria-expanded', 'false');
      }, delay == null ? 160 : delay);
    }

    wrap.addEventListener('mouseenter', open);
    wrap.addEventListener('mouseleave', function(){ close(160); });
    trigger.addEventListener('focus', open);
    trigger.addEventListener('click', function(e){
      // Only intercept when not already navigating via keyboard middle/right click
      if (e.button !== 0) return;
      e.preventDefault();
      if (wrap.classList.contains('is-open')) close(0);
      else open();
    });
    document.addEventListener('keydown', function(e){
      if (e.key === 'Escape') close(0);
    });

    wrap.dataset.tjdReady = '1';
  }

  function init(){
    inject();
    var wraps = document.querySelectorAll('.nav-dropdown-wrapper');
    wraps.forEach(patchDom);

    // Re-run on dynamic CMS list (in case Webflow swaps it)
    var obs = new MutationObserver(function(){
      document.querySelectorAll('.nav-dropdown-wrapper').forEach(patchDom);
    });
    obs.observe(document.body, { childList:true, subtree:true });
  }

  if (document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
