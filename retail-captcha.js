/*
 * Password-free entry challenge. The original Turnstile sitekey is a
 * Cloudflare TEST key that always passes; this is a visual UX gate,
 * NOT production bot protection or server-validated CAPTCHA.
 */
(() => {
  'use strict';
  const TEST_SITE_KEY = '1x00000000000000000000AA';
  const ageGate = document.getElementById('age-gate');
  const gate = document.getElementById('access-gate');
  if (!ageGate || !gate) return;
  let captchaPassed = false;
  let widgetRendered = false;
  let scriptRequested = false;
  let renderAttempts = 0;
  gate.setAttribute('role', 'dialog');
  gate.setAttribute('aria-modal', 'true');
  gate.setAttribute('aria-labelledby', 'retail-captcha-title');
  gate.innerHTML = `<div class="access-card">
    <div class="access-mark" aria-hidden="true">P</div>
    <p class="section-label">RETAIL ACCESS</p>
    <h1 id="retail-captcha-title">Quick verification</h1>
    <p>Complete the check below to continue. No password required.</p>
    <div id="retail-captcha-widget" style="display:flex;justify-content:center;min-height:70px;margin:16px 0"></div>
    <button id="retail-captcha-enter" type="button" disabled>Enter Retail</button>
    <p id="retail-captcha-error" class="access-error" role="alert" aria-live="polite"></p>
  </div>`;
  const enter = gate.querySelector('#retail-captcha-enter');
  const error = gate.querySelector('#retail-captcha-error');
  const target = gate.querySelector('#retail-captcha-widget');
  function loadTurnstile() {
    if (window.turnstile || scriptRequested) return;
    scriptRequested = true;
    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    script.async = true;
    script.onerror = () => { error.textContent = 'Verification could not load. Check your connection and refresh.'; };
    document.head.appendChild(script);
  }
  function renderWidget() {
    if (gate.hidden || widgetRendered) return;
    if (!window.turnstile) {
      if (++renderAttempts < 100) setTimeout(renderWidget, 100);
      else error.textContent = 'Verification did not load. Please refresh and try again.';
      return;
    }
    widgetRendered = true;
    try {
      window.turnstile.render(target, {
        sitekey: TEST_SITE_KEY,
        theme: 'light',
        callback: () => { captchaPassed = true; enter.disabled = false; error.textContent = ''; },
        'expired-callback': () => { captchaPassed = false; enter.disabled = true; error.textContent = 'Verification expired. Please verify again.'; },
        'error-callback': () => { captchaPassed = false; enter.disabled = true; error.textContent = 'Verification failed. Please refresh and try again.'; }
      });
    } catch (_) { widgetRendered = false; error.textContent = 'Verification could not start. Please refresh and try again.'; }
  }
  function show() {
    if (!ageGate.hidden) return;
    if (sessionStorage.getItem('tplRetailCaptchaV1') === 'completed') {
      unlockSite();
      return;
    }
    gate.hidden = false;
    gate.removeAttribute('aria-hidden');
    loadTurnstile();
    renderWidget();
  }
  enter.addEventListener('click', () => {
    if (!captchaPassed || !ageGate.hidden) return;
    sessionStorage.setItem('tplRetailCaptchaV1', 'completed');
    gate.hidden = true;
    gate.setAttribute('aria-hidden', 'true');
    unlockSite();
  });
  window.RetailCaptcha = Object.freeze({show});
  if (ageGate.hidden) show();
})();
