(() => {
  'use strict';
  const PROTOCOL_HASH='8fa4abdde72800faaa6a93ca9d958427bc9584fcfdfaa77a911eea752258a16f';
  const PROTOCOL_URL='https://thatpeplab.github.io/Protocol/';
  const GROUP_URL='https://chat.whatsapp.com/JR69PplAvxtLnCEXtDLHEx?mode=gi_t';
  const CONTACT_URL='https://wa.me/qr/VSFL3VKLDPTQD1?s=r';
  const GROUP_IMAGE=window.RetailMedia?.whatsappGroupImage||'';
  const main=document.querySelector('main.page');
  const hero=document.querySelector('.hero');
  if(!main||!hero)return;

  const navShell=document.createElement('div');
  navShell.className='resource-nav-shell';
  navShell.innerHTML='<nav class="resource-nav" aria-label="Retail resources"><button class="resource-tab" type="button" data-resource-tab="home" aria-selected="true">Home</button><button class="resource-tab" type="button" data-resource-tab="shop" aria-selected="false">Shop</button><button class="resource-tab" type="button" data-resource-tab="coa" aria-selected="false">COA Library</button><button class="resource-tab" type="button" data-resource-tab="protocol" aria-selected="false">Protocol</button><button class="resource-cart-button" type="button" data-resource-cart>Go to Cart · <span data-cart-nav-count>0</span></button></nav>';
  const trust=document.querySelector('.retail-trust-strip');
  (trust||hero).after(navShell);

  const homePanel=document.createElement('section');
  homePanel.className='resource-panel home-panel';
  homePanel.dataset.resourcePanel='home';
  homePanel.innerHTML=`
    <div class="home-brand-card">
      <div class="home-brand-copy">
        <p class="home-kicker">THAT PEP LAB</p>
        <h2>Research-focused products with help when you need it.</h2>
        <p>Browse what we offer, review available testing, and order the amount that makes sense for your research.</p>
        <div class="home-actions"><button type="button" class="home-shop-button" data-go-shop>Shop Products</button><a href="${GROUP_URL}" target="_blank" rel="noopener noreferrer" class="home-whatsapp-button">Join Our WhatsApp Group</a></div>
      </div>
      <div class="home-logo-crop" aria-label="That Pep Lab logo">${GROUP_IMAGE?`<img src="${GROUP_IMAGE}" alt="That Pep Lab">`:''}</div>
    </div>
    <section class="difference-section" aria-labelledby="different-title">
      <div class="difference-heading"><p>HOW WE ARE DIFFERENT</p><h2 id="different-title">Built around the way we actually research.</h2></div>
      <div class="difference-grid">
        <article><strong>Order what you need</strong><span>Choose the product, strength, and package that fits your research instead of being forced into a preset experience level.</span></article>
        <article><strong>Help when you need it</strong><span>Use the site, our order form, or WhatsApp when you need help with an order or product information.</span></article>
        <article><strong>Products sold are personally researched in our lab</strong><span>Products we sell are selected through our own research process, with available COAs and testing information kept alongside the catalog.</span></article>
      </div>
    </section>
    <section class="home-whatsapp-card">
      <div class="home-whatsapp-image">${GROUP_IMAGE?`<a href="${GROUP_URL}" target="_blank" rel="noopener noreferrer"><img src="${GROUP_IMAGE}" alt="That Pep Lab WhatsApp group QR code"></a>`:''}</div>
      <div class="home-whatsapp-copy">
        <p class="home-kicker">STAY CONNECTED</p>
        <h2>Join the That Pep Lab WhatsApp group</h2>
        <p>Use the group for updates and community conversation. Scan the QR code or use the button below.</p>
        <a href="${GROUP_URL}" target="_blank" rel="noopener noreferrer" class="whatsapp-primary">Join WhatsApp Group</a>
      </div>
    </section>
    <div class="home-faq-slot"></div>`;

  const coaPanel=document.createElement('section');
  coaPanel.className='resource-panel';
  coaPanel.dataset.resourcePanel='coa';
  coaPanel.hidden=true;
  coaPanel.innerHTML=`
    <div class="resource-card">
      <div class="resource-heading"><div><p>PRODUCT TESTING</p><h2>COA Library</h2></div><span>Browse available and pending Certificates of Analysis for product strengths offered in this Retail catalog.</span></div>
      <div class="coa-library-tools"><input id="coa-library-search" type="search" placeholder="Search product or strength…" autocomplete="off"><select id="coa-library-status"><option value="all">Completed & pending</option><option value="complete">Completed COAs</option><option value="pending">Pending only</option></select></div>
      <p id="coa-library-count" class="coa-library-count">Loading COA matches…</p>
      <div id="coa-library-grid" class="coa-library-grid" aria-live="polite"></div>
    </div>`;

  const protocolPanel=document.createElement('section');
  protocolPanel.className='resource-panel';
  protocolPanel.dataset.resourcePanel='protocol';
  protocolPanel.hidden=true;
  protocolPanel.innerHTML=`
    <div class="resource-card">
      <div class="resource-heading"><div><p>PRIVATE CONVENIENCE ACCESS</p><h2>Protocol Repository</h2></div><span>This tab uses a browser-side password gate for convenient access. The underlying Protocol GitHub Pages site remains public unless the repository/site itself is made private.</span></div>
      <div id="protocol-gate" class="protocol-gate">
        <div class="lock-mark" aria-hidden="true">P</div>
        <h3>Protocol access</h3>
        <p>Enter the former Retail password to open the Protocol workspace for this browser session.</p>
        <div class="protocol-password-row"><input id="protocol-password" type="password" autocomplete="current-password" placeholder="Password"><button id="protocol-unlock" type="button">Open Protocol</button></div>
        <p id="protocol-error" class="protocol-error" role="alert"></p>
      </div>
      <div id="protocol-workspace" class="protocol-workspace" hidden>
        <div class="protocol-toolbar"><span>Protocol app loaded from the existing ThatPepLab/Protocol repository.</span><a class="protocol-open-full" href="${PROTOCOL_URL}" target="_blank" rel="noopener">Open Full Page</a></div>
        <iframe id="protocol-frame" class="protocol-frame" title="That Pep Lab Protocol" loading="lazy"></iframe>
      </div>
    </div>`;

  const cartPanel=document.createElement('section');
  cartPanel.className='resource-panel cart-resource-panel';
  cartPanel.dataset.resourcePanel='cart';
  cartPanel.hidden=true;
  cartPanel.innerHTML=`
    <div class="cart-resource-heading">
      <div><p class="home-kicker">CHECKOUT</p><h2>Finish your order your way</h2><p>Review the cart, then submit the order form or connect with us through WhatsApp.</p></div>
      <button type="button" class="continue-shopping" data-go-shop>Continue Shopping</button>
    </div>
    <div class="cart-resource-layout">
      <div class="cart-section-host"></div>
      <aside class="cart-whatsapp-card">
        <p class="home-kicker">WHATSAPP</p>
        <h3>Prefer to connect with us directly?</h3>
        <p>Use the direct WhatsApp contact link for order help. You can also scan the group QR below to join the That Pep Lab community.</p>
        <a href="${CONTACT_URL}" target="_blank" rel="noopener noreferrer" class="whatsapp-primary">Message That Pep Lab on WhatsApp</a>
        ${GROUP_IMAGE?`<a href="${GROUP_URL}" target="_blank" rel="noopener noreferrer" class="cart-group-qr"><img src="${GROUP_IMAGE}" alt="That Pep Lab WhatsApp group QR code"></a>`:''}
        <a href="${GROUP_URL}" target="_blank" rel="noopener noreferrer" class="whatsapp-secondary">Join WhatsApp Group</a>
      </aside>
    </div>`;

  main.before(homePanel);
  main.after(coaPanel,protocolPanel,cartPanel);

  const faq=main.querySelector('.research-faq');
  if(faq)homePanel.querySelector('.home-faq-slot')?.append(faq);
  const cartSection=main.querySelector('.cart-section');
  if(cartSection)cartPanel.querySelector('.cart-section-host')?.append(cartSection);

  const buttons=[...navShell.querySelectorAll('[data-resource-tab]')];
  const cartButtons=[...document.querySelectorAll('[data-resource-cart]')];
  const quick=document.querySelector('#quick-list-modal');
  let activeView='home';

  const floatingCart=document.createElement('button');
  floatingCart.type='button';
  floatingCart.className='floating-cart-button';
  floatingCart.dataset.resourceCart='';
  floatingCart.innerHTML='Go to Cart · <span data-floating-cart-count>0</span>';
  document.body.appendChild(floatingCart);
  cartButtons.push(floatingCart);

  function selectView(name,smooth=true){
    activeView=name;
    buttons.forEach(button=>button.setAttribute('aria-selected',String(button.dataset.resourceTab===name)));
    homePanel.hidden=name!=='home';
    main.hidden=name!=='shop';
    coaPanel.hidden=name!=='coa';
    protocolPanel.hidden=name!=='protocol';
    cartPanel.hidden=name!=='cart';
    floatingCart.hidden=name!=='shop';
    if(name!=='shop'&&quick)quick.hidden=true;
    if(name==='shop'&&typeof renderQuickList==='function')renderQuickList();
    if(name==='coa')renderCoas();
    if(name==='protocol')syncProtocol();
    if(smooth)window.scrollTo({top:Math.max(0,navShell.offsetTop-8),behavior:'smooth'});
  }
  navShell.addEventListener('click',event=>{
    const tab=event.target.closest('[data-resource-tab]');
    if(tab){selectView(tab.dataset.resourceTab);return}
    if(event.target.closest('[data-resource-cart]'))selectView('cart');
  });
  document.addEventListener('click',event=>{
    if(event.target.closest('[data-resource-cart]')){event.preventDefault();selectView('cart')}
    if(event.target.closest('[data-go-shop]')){event.preventDefault();selectView('shop')}
  });

  if(quick){
    new MutationObserver(()=>{if(activeView!=='shop'&&!quick.hidden)quick.hidden=true}).observe(quick,{attributes:true,attributeFilter:['hidden']});
  }

  const cartCountSource=document.querySelector('#cart-count');
  function syncCartCount(){
    const raw=cartCountSource?.textContent||'0 items';
    const match=raw.match(/\d+/);
    const count=match?match[0]:'0';
    navShell.querySelector('[data-cart-nav-count]').textContent=count;
    floatingCart.querySelector('[data-floating-cart-count]').textContent=count;
    floatingCart.classList.toggle('has-items',Number(count)>0);
  }
  if(cartCountSource)new MutationObserver(syncCartCount).observe(cartCountSource,{childList:true,subtree:true,characterData:true});
  syncCartCount();

  const search=coaPanel.querySelector('#coa-library-search');
  const status=coaPanel.querySelector('#coa-library-status');
  const grid=coaPanel.querySelector('#coa-library-grid');
  const count=coaPanel.querySelector('#coa-library-count');

  function availableRows(){
    if(typeof state==='undefined'||!state.catalogLoaded||!window.COARegistry)return[];
    const rows=[];
    for(const product of state.products){
      for(const strength of productStrengths(product)){
        if(strength==='Choose quantity in cart')continue;
        const result=window.COARegistry.matches(product.name,strength);
        const complete=result.completed?.[0]||null,pending=result.pending?.[0]||null;
        if(!complete&&!pending)continue;
        rows.push({product,display:displayProductName(product.name),strength,category:categoryFor(product.name),complete,pending});
      }
    }
    return rows.sort((a,b)=>a.display.localeCompare(b.display,undefined,{numeric:true})||strengthNumber(a.strength)-strengthNumber(b.strength));
  }
  function renderCoas(){
    const q=(search.value||'').trim().toLowerCase(),mode=status.value,rows=availableRows().filter(row=>{
      const match=!q||(row.display+' '+row.strength+' '+row.category).toLowerCase().includes(q);
      const statusMatch=mode==='all'||(mode==='complete'&&row.complete)||(mode==='pending'&&!row.complete&&row.pending);
      return match&&statusMatch;
    });
    count.textContent=rows.length?`${rows.length} product-strength COA record${rows.length===1?'':'s'} available`:'No matching COAs found.';
    grid.innerHTML=rows.length?rows.map(row=>{
      const complete=row.complete,pending=row.pending;
      const date=complete?.analysisDate||'';
      const purity=complete?.purity||'';
      const cls=complete?'has-complete':'has-pending';
      const statusText=complete?`Latest completed: ${date||'date not listed'}`:'COA pending';
      const pendingText=complete&&pending?'<span>Newer testing may also be pending.</span>':'';
      return `<article class="coa-library-card ${cls}"><h3>${escapeHtml(row.display)}</h3><div class="coa-strength">${escapeHtml(row.strength)}</div><div class="coa-meta"><span>${escapeHtml(row.category)}</span><strong>${escapeHtml(statusText)}</strong>${purity?`<span>Purity: ${escapeHtml(purity)}</span>`:''}${pendingText}</div><button type="button" data-open-coa data-product="${escapeHtml(row.product.name)}" data-strength="${escapeHtml(row.strength)}">${complete?'View COA':'View Pending Status'}</button></article>`;
    }).join(''):'<div class="coa-empty-library">No COA records match this view.</div>';
  }
  search.addEventListener('input',renderCoas);
  status.addEventListener('change',renderCoas);
  grid.addEventListener('click',event=>{const button=event.target.closest('[data-open-coa]');if(button)window.COARegistry?.open(button.dataset.product,button.dataset.strength)});
  document.addEventListener('coa-data-updated',renderCoas);
  const catalogObserver=setInterval(()=>{if(typeof state!=='undefined'&&state.catalogLoaded){clearInterval(catalogObserver);renderCoas()}},200);

  const gate=protocolPanel.querySelector('#protocol-gate');
  const workspace=protocolPanel.querySelector('#protocol-workspace');
  const input=protocolPanel.querySelector('#protocol-password');
  const unlock=protocolPanel.querySelector('#protocol-unlock');
  const error=protocolPanel.querySelector('#protocol-error');
  const frame=protocolPanel.querySelector('#protocol-frame');
  async function digest(value){const bytes=new TextEncoder().encode(value);const hash=await crypto.subtle.digest('SHA-256',bytes);return[...new Uint8Array(hash)].map(b=>b.toString(16).padStart(2,'0')).join('')}
  function openProtocol(){
    sessionStorage.setItem('tplProtocolAccessV1','granted');
    gate.hidden=true;workspace.hidden=false;
    if(!frame.src)frame.src=PROTOCOL_URL;
  }
  function syncProtocol(){sessionStorage.getItem('tplProtocolAccessV1')==='granted'?openProtocol():(gate.hidden=false,workspace.hidden=true)}
  async function attemptUnlock(){
    error.textContent='';unlock.disabled=true;
    try{if(await digest(input.value)===PROTOCOL_HASH){input.value='';openProtocol()}else{error.textContent='Incorrect password.';input.select()}}finally{unlock.disabled=false}
  }
  unlock.addEventListener('click',attemptUnlock);
  input.addEventListener('keydown',event=>{if(event.key==='Enter'){event.preventDefault();attemptUnlock()}});
  syncProtocol();
  selectView('home',false);
})();