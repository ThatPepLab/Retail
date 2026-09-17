/* Customer shopping experience: ask after access and before Best Sellers. */
(() => {
  const style = document.createElement('style');
  style.textContent = `
    #shopping-mode-gate[hidden],#shopping-mode-bar[hidden]{display:none!important}
    #shopping-mode-gate{position:fixed;inset:0;z-index:15000;display:flex;align-items:center;justify-content:center;overflow-y:auto;padding:22px;background:linear-gradient(145deg,#06162ff5,#0b2b55f5 58%,#ad4809f5)}
    .shopping-mode-card{width:min(640px,100%);max-height:calc(100dvh - 44px);overflow-y:auto;background:#fff;color:#142443;border-radius:18px;border-top:7px solid #ef6c2f;padding:clamp(20px,4vw,34px);box-shadow:0 25px 85px #0009}
    .shopping-mode-kicker{font-size:12px;letter-spacing:.12em;font-weight:900;color:#b54a00;margin:0 0 8px}
    .shopping-mode-card h2{font-size:clamp(23px,5vw,30px);margin:0 0 8px;color:#102e67}
    .shopping-mode-intro{line-height:1.5;color:#40536c;margin:0 0 18px}
    .shopping-mode-choices{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}
    .shopping-mode-option{display:flex;flex-direction:column;text-align:left;gap:8px;border:2px solid #a9b9d1;border-radius:12px;background:#f7faff;color:#162a47;padding:18px;cursor:pointer;min-height:158px}
    .shopping-mode-option strong{font-size:23px;color:#102e67}
    .shopping-mode-option span{font-size:14px;line-height:1.45}
    .shopping-mode-option small{font-size:12px;font-weight:750;color:#874000}
    .shopping-mode-option:hover,.shopping-mode-option:focus-visible{border-color:#e85d04;background:#fff2e8;outline:3px solid #ffbd91;outline-offset:2px}
    .shopping-mode-footnote{font-size:12px;color:#51627a;line-height:1.45;margin:16px 0 0}
    #shopping-mode-cancel{margin-top:16px;border:1px solid #a9b9d1;border-radius:8px;background:#fff;color:#102e67;padding:10px 15px;font-weight:800;cursor:pointer}
    body.shopping-mode-choosing{overflow:hidden}
    #shopping-mode-bar{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;padding:11px max(16px,calc((100vw - 1280px)/2 + 28px));background:#fff4e9;color:#12213f;border-bottom:2px solid #e85d04}
    #shopping-mode-bar strong{font-size:14px}
    #shopping-mode-bar span{font-size:12px;color:#42526a}
    #shopping-mode-change,.mode-inline-change{border:2px solid #e85d04;border-radius:8px;background:#102e67;color:#fff;padding:8px 12px;font-weight:800;cursor:pointer}
    .mode-inline-note{display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;background:#edf4ff;border:1px solid #9cb2d1;border-radius:10px;padding:10px 12px;color:#102e67;font-size:13px}
    .mode-inline-note span{display:block;font-size:12px;color:#344763;margin-top:3px}
    @media(max-width:540px){.shopping-mode-choices{grid-template-columns:1fr}.shopping-mode-option{min-height:0;padding:14px}.shopping-mode-card{max-height:calc(100dvh - 22px)}#shopping-mode-gate{padding:11px}}
  `;
  document.head.appendChild(style);

  const gate = document.createElement('section');
  gate.id = 'shopping-mode-gate';
  gate.hidden = true;
  gate.setAttribute('role', 'dialog');
  gate.setAttribute('aria-modal', 'true');
  gate.setAttribute('aria-labelledby', 'shopping-mode-title');
  gate.innerHTML = `
    <div class="shopping-mode-card">
      <p class="shopping-mode-kicker">BEFORE YOU SHOP</p>
      <h2 id="shopping-mode-title">Choose your shopping experience</h2>
      <p class="shopping-mode-intro">Choose once to see products and prices suited to your preferred preparation style. You can change your choice later.</p>
      <div class="shopping-mode-choices">
        <button type="button" class="shopping-mode-option" data-shopping-mode="beginner"><strong>Beginner</strong><span>Prepared, loaded and labeled research products. Includes preparation and its separate fee in displayed prices.</span><small>Oil-based products are Expert only.</small></button>
        <button type="button" class="shopping-mode-option" data-shopping-mode="expert"><strong>Expert</strong><span>Unprepared research vials. You handle preparation and storage; oil-based products are available here.</span><small>No premixing or preparation service.</small></button>
      </div>
      <p class="shopping-mode-footnote">Your choice stays in effect while you browse. Switching later does not change items already in your cart.</p>
      <button id="shopping-mode-cancel" type="button" hidden>Keep shopping with my current choice</button>
    </div>`;
  document.body.appendChild(gate);
  const bar = document.createElement('div');
  bar.id = 'shopping-mode-bar';
  bar.hidden = true;
  bar.innerHTML = '<div><strong id="shopping-mode-current"></strong><br><span id="shopping-mode-summary"></span></div><button id="shopping-mode-change" type="button">Change Beginner / Expert</button>';
  document.querySelector('.hero')?.after(bar);
  const cancel = gate.querySelector('#shopping-mode-cancel');
  const current = bar.querySelector('#shopping-mode-current');
  const summary = bar.querySelector('#shopping-mode-summary');
  const main = document.querySelector('main');
  const hero = document.querySelector('.hero');
  const access = document.getElementById('access-gate');
  const age = document.getElementById('age-gate');

  const accessFinished = () => !document.body.classList.contains('site-locked') && !!access?.hidden && !!age?.hidden;
  function syncBar() {
    bar.hidden = !state.shoppingModeChosen;
    if (!state.shoppingModeChosen) return;
    const beginner = state.shoppingMode === 'beginner';
    current.textContent = `Shopping as: ${beginner ? 'Beginner' : 'Expert'}`;
    summary.textContent = beginner ? 'Prepared, loaded and labeled · preparation charges included' : 'Unprepared research vials · preparation is your responsibility';
  }
  function showGate() {
    if (!accessFinished()) return;
    cancel.hidden = !state.shoppingModeChosen;
    gate.hidden = false;
    document.body.classList.add('shopping-mode-choosing');
    if (main) main.inert = true;
    if (hero) hero.inert = true;
    gate.querySelector('[data-shopping-mode]')?.focus();
  }
  function closeGate() {
    gate.hidden = true;
    document.body.classList.remove('shopping-mode-choosing');
    if (main) main.inert = false;
    if (hero) hero.inert = false;
  }
  gate.addEventListener('click', event => {
    const button = event.target.closest('[data-shopping-mode]');
    if (!button) return;
    const mode = button.dataset.shoppingMode;
    if (state.shoppingModeChosen && state.shoppingMode === 'beginner' && mode === 'expert' && !window.confirm('Expert products arrive unprepared. You are responsible for reconstitution and storage. Switch to Expert?')) return;
    closeGate();
    setShoppingMode(mode);
    syncBar();
  });
  cancel.addEventListener('click', closeGate);
  bar.querySelector('#shopping-mode-change').addEventListener('click', showGate);
  document.addEventListener('click', event => {
    if (event.target.closest?.('[data-change-shopping-mode]')) showGate();
  });
  gate.addEventListener('keydown', event => {
    if (event.key === 'Escape' && state.shoppingModeChosen) { event.preventDefault(); closeGate(); }
  });
  document.addEventListener('retail-shopping-mode-changed', syncBar);
  const observer = new MutationObserver(() => {
    if (!state.shoppingModeChosen && accessFinished() && gate.hidden) showGate();
    syncBar();
  });
  observer.observe(document.body, {attributes:true, attributeFilter:['class']});
  if (access) observer.observe(access, {attributes:true, attributeFilter:['hidden']});
  if (age) observer.observe(age, {attributes:true, attributeFilter:['hidden']});
  syncBar();
  if (!state.shoppingModeChosen && accessFinished()) showGate();
})();
