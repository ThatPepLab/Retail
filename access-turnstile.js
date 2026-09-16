(() => {
  const TEST_SITE_KEY = '1x00000000000000000000AA';
  const ACCESS_HASH = '8fa4abdde72800faaa6a93ca9d958427bc9584fcfdfaa77a911eea752258a16f';
  let captchaPassed = false;
  let passwordAccepted = false;

  function loadTurnstile() {
    if (window.turnstile || document.querySelector('script[data-retail-turnstile]')) return;
    const s = document.createElement('script');
    s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    s.async = true;
    s.defer = true;
    s.dataset.retailTurnstile = '1';
    document.head.appendChild(s);
  }

  async function digest(value) {
    const bytes = new TextEncoder().encode(value);
    const hash = await crypto.subtle.digest('SHA-256', bytes);
    return [...new Uint8Array(hash)].map(b => b.toString(16).padStart(2, '0')).join('');
  }

  function finishAccess() {
    sessionStorage.setItem('tplRetailAccessV2', 'granted');
    document.body.classList.remove('site-locked');
    const gate = document.getElementById('access-gate');
    const input = document.getElementById('access-password');
    if (gate) gate.hidden = true;
    if (input) input.value = '';
  }

  function renderCaptcha() {
    const form = document.getElementById('access-form');
    if (!form) return;
    form.querySelectorAll('label,input,#access-button,.password-copy,#access-error').forEach(el => el.hidden = true);
    let stage = document.getElementById('retailCaptchaStage');
    if (!stage) {
      stage = document.createElement('div');
      stage.id = 'retailCaptchaStage';
      stage.innerHTML = `
        <p style="margin:0 0 10px;color:#647087;line-height:1.5">Password accepted. Complete the human verification to continue.</p>
        <div id="retailCaptchaWidget" style="display:flex;justify-content:center;margin:14px 0"></div>
        <button id="retailCaptchaEnter" type="button" disabled style="width:100%;margin-top:12px;padding:13px;border:0;border-radius:9px;background:#ef6c2f;color:#fff;font-weight:800;cursor:pointer">Enter Retail</button>
        <p id="retailCaptchaError" role="alert" style="min-height:20px;color:#a33;font-weight:700;margin:10px 0 0"></p>`;
      form.appendChild(stage);
      stage.querySelector('#retailCaptchaEnter').addEventListener('click', () => { if (captchaPassed) finishAccess(); });
    }
    const tryRender = () => {
      if (!window.turnstile) return setTimeout(tryRender, 100);
      const target = document.getElementById('retailCaptchaWidget');
      if (!target || target.dataset.rendered) return;
      target.dataset.rendered = '1';
      window.turnstile.render(target, {
        sitekey: TEST_SITE_KEY,
        theme: 'light',
        callback: () => {
          captchaPassed = true;
          document.getElementById('retailCaptchaEnter').disabled = false;
          document.getElementById('retailCaptchaError').textContent = '';
        },
        'expired-callback': () => {
          captchaPassed = false;
          document.getElementById('retailCaptchaEnter').disabled = true;
          document.getElementById('retailCaptchaError').textContent = 'Verification expired. Please verify again.';
        },
        'error-callback': () => {
          captchaPassed = false;
          document.getElementById('retailCaptchaEnter').disabled = true;
          document.getElementById('retailCaptchaError').textContent = 'Verification could not load. Please try again.';
        }
      });
    };
    tryRender();
  }

  document.addEventListener('submit', async (event) => {
    if (event.target?.id !== 'access-form') return;
    event.preventDefault();
    event.stopImmediatePropagation();
    if (passwordAccepted) return renderCaptcha();
    const input = document.getElementById('access-password');
    const error = document.getElementById('access-error');
    const button = document.getElementById('access-button');
    if (!input || !button) return;
    if (error) error.textContent = '';
    button.disabled = true;
    const ok = (await digest(input.value)) === ACCESS_HASH;
    button.disabled = false;
    if (!ok) {
      if (error) error.textContent = 'Incorrect password.';
      input.select();
      return;
    }
    passwordAccepted = true;
    // Count an accepted password once, before CAPTCHA; never send the password.
    window.RetailAnalytics?.passwordAccepted?.();
    renderCaptcha();
  }, true);

  loadTurnstile();
})();
