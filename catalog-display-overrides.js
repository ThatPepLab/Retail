(()=>{
  const DISPLAY_RENAMES=new Map([
    ["Semaglutide (GLP-1)","GLP-1SG"],
    ["Semaglutide","GLP-1SG"],
    ["Tirzepatide (GLP-2)","GLP-2TR"]
  ]);
  const DESCRIPTION_BY_PRODUCT=new Map([
    ["Semaglutide","Semaglutide is commonly discussed for appetite control, portion control, and weight management."],
    ["Tirzepatide","Tirz is commonly discussed for appetite control, weight management, and blood-sugar support."],
    ["GLP-3RT","Re+a is commonly discussed for appetite control, weight management, and metabolic support."]
  ]);
  let scheduled=false;
  function renameExactText(root=document.body){
    const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
    const nodes=[];
    while(walker.nextNode())nodes.push(walker.currentNode);
    for(const node of nodes){
      const trimmed=node.nodeValue.trim();
      const replacement=DISPLAY_RENAMES.get(trimmed);
      if(replacement)node.nodeValue=node.nodeValue.replace(trimmed,replacement);
    }
  }
  function sortChildren(container,labelFor){
    if(!container)return;
    const children=[...container.children];
    const sorted=[...children].sort((a,b)=>labelFor(a).localeCompare(labelFor(b),undefined,{sensitivity:"base"}));
    if(children.some((child,index)=>child!==sorted[index]))container.append(...sorted);
  }
  function apply(){
    scheduled=false;
    renameExactText();
    document.querySelectorAll(".catalog-product-card").forEach(card=>{
      const product=card.querySelector("[data-product]")?.dataset.product||"";
      const description=DESCRIPTION_BY_PRODUCT.get(product);
      if(description){
        const paragraph=card.querySelector(".catalog-card-copy p");
        if(paragraph&&paragraph.textContent!==description)paragraph.textContent=description;
      }
    });
    document.querySelectorAll(".product-buttons").forEach(group=>{
      sortChildren(group,card=>card.querySelector(".catalog-card-copy h4")?.textContent.trim()||"");
    });
    sortChildren(document.querySelector("#catalog-groups"),group=>group.querySelector(".category-copy strong")?.textContent.trim()||"");
    const details=document.querySelector("#order-details-field");
    if(details&&/Semaglutide \(GLP-1\)|Tirzepatide \(GLP-2\)/.test(details.value)){
      details.value=details.value.replaceAll("Semaglutide (GLP-1)","GLP-1SG").replaceAll("Tirzepatide (GLP-2)","GLP-2TR");
    }
  }
  function schedule(){
    if(scheduled)return;
    scheduled=true;
    requestAnimationFrame(apply);
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",schedule,{once:true});
  else schedule();
  new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true});
})();