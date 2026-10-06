(() => {
  const hero=document.querySelector('.hero');
  const finder=document.querySelector('.finder-card');
  const category=document.querySelector('#category');
  const catalog=document.querySelector('#catalog-groups');
  const search=document.querySelector('#search');
  if(!hero||!finder||!category||!catalog||!search)return;

  const trust=document.createElement('div');
  trust.className='retail-trust-strip';
  trust.setAttribute('aria-label','Shop features');
  trust.innerHTML='<span>LIVE INVENTORY</span><span>BATCH COA LINKS</span><span>PACKAGE PRICING</span><span>$10 SHIPPING · FREE PICKUP</span>';
  hero.after(trust);

  const shell=document.createElement('section');
  shell.className='shop-tabs-shell';
  shell.setAttribute('aria-label','Browse catalog');
  shell.innerHTML='<div class="shop-tabs-head"><div><p>SHOP THE CATALOG</p><strong>Search or browse by category</strong></div><span>Tap a tab to filter products</span></div><div class="shop-tab-list" role="tablist" aria-label="Product categories"></div>';
  finder.prepend(shell);
  const list=shell.querySelector('.shop-tab-list');

  const searchField=search.closest('.field');
  if(searchField){
    const wrap=document.createElement('div');
    wrap.className='search-row-modern';
    searchField.before(wrap);
    wrap.appendChild(searchField);
    const clear=document.createElement('button');
    clear.type='button';clear.className='search-clear-modern';clear.textContent='Clear';clear.hidden=true;
    wrap.appendChild(clear);
    const syncClear=()=>{clear.hidden=!search.value};
    search.addEventListener('input',syncClear);
    clear.addEventListener('click',()=>{search.value='';search.dispatchEvent(new Event('input',{bubbles:true}));search.focus();syncClear()});
    syncClear();
  }

  function options(){return Array.from(category.options).map(option=>({value:option.value,label:option.textContent.trim()}))}
  function syncTabs(){
    const values=options();
    if(!values.length)return;
    const current=category.value||'all';
    list.innerHTML=values.map(item=>'<button type="button" class="shop-tab" role="tab" data-category="'+item.value.replace(/"/g,'&quot;')+'" aria-selected="'+(item.value===current?'true':'false')+'">'+item.label+'</button>').join('');
  }
  function openFilteredGroup(){
    const filtered=category.value!=='all';
    catalog.querySelectorAll('details.catalog-group').forEach(group=>{
      group.classList.toggle('modern-auto-open',filtered);
      if(filtered)group.open=true;
    });
  }
  list.addEventListener('click',event=>{
    const button=event.target.closest('[data-category]');
    if(!button)return;
    category.value=button.dataset.category;
    category.dispatchEvent(new Event('change',{bubbles:true}));
    syncTabs();
    requestAnimationFrame(openFilteredGroup);
  });
  category.addEventListener('change',()=>{syncTabs();requestAnimationFrame(openFilteredGroup)});
  new MutationObserver(()=>{syncTabs()}).observe(category,{childList:true});
  new MutationObserver(openFilteredGroup).observe(catalog,{childList:true,subtree:false});
  syncTabs();
  openFilteredGroup();
})();