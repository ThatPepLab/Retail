const accessGate=document.querySelector("#access-gate"),accessForm=document.querySelector("#access-form"),accessPassword=document.querySelector("#access-password"),accessError=document.querySelector("#access-error"),accessButton=document.querySelector("#access-button");
const accessHash="8fa4abdde72800faaa6a93ca9d958427bc9584fcfdfaa77a911eea752258a16f";
async function accessDigest(value){const bytes=new TextEncoder().encode(value),hash=await crypto.subtle.digest("SHA-256",bytes);return[...new Uint8Array(hash)].map(byte=>byte.toString(16).padStart(2,"0")).join("")}
function unlockSite(){document.body.classList.remove("site-locked");accessGate.hidden=true;accessPassword.value=""}
if(sessionStorage.getItem("tplRetailAccess")==="granted")unlockSite();
accessForm.addEventListener("submit",async event=>{event.preventDefault();accessError.textContent="";accessButton.disabled=true;if(await accessDigest(accessPassword.value)===accessHash){sessionStorage.setItem("tplRetailAccess","granted");unlockSite()}else{accessError.textContent="Incorrect password.";accessPassword.select()}accessButton.disabled=false});

const state={products:[],selectedProduct:null,selectedStrength:"",cart:[],inventory:new Map()};
const $=selector=>document.querySelector(selector);
const search=$("#search"),suggestions=$("#suggestions"),categorySelect=$("#category"),catalogGroups=$("#catalog-groups"),inStockSection=$("#in-stock-section"),inStockGroups=$("#in-stock-groups"),inStockCount=$("#in-stock-count"),selection=$("#selection"),selectedName=$("#selected-name"),productInfo=$("#product-info"),productEducation=$("#product-education"),downloadProductPdf=$("#download-product-pdf"),strengthSelect=$("#strength"),prices=$("#prices"),cartCount=$("#cart-count"),orderForm=$("#order-form"),grandTotal=$("#grand-total"),submitOrder=$("#submit-order"),formStatus=$("#form-status"),cartContainer=$("#order-cart"),cartTotals=$("#order-totals");
const money=new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",maximumFractionDigits:0});
const escapeHtml=value=>String(value).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const displayProductName=name=>{const value=String(name||"").trim();if(/^retatrutide$/i.test(value))return"Triple Agonist (GLP-3)";if(/^tirzepatide$/i.test(value))return"Tirzepatide (GLP-2)";if(/^semaglutide$/i.test(value))return"Semaglutide (GLP-1)";return value};
const strengthNumber=value=>Number.parseFloat(value)||0;
const tierInfo={one:{vials:1,label:"1 vial",discount:"Regular MSRP"},three:{vials:3,label:"3 vials",discount:"10% off"},five:{vials:5,label:"5 vials",discount:"15% off"},ten:{vials:10,label:"10 vials",discount:"20% off"}};
const categories=[
  {name:"Weight Loss",test:/semaglutide|tirzepatide|trizepatide|retatrutide|cagrilintide|cagilintide|mazdutide|survodutide|eloralintide|adipotide|aod-?9604|hgh fragment|lemon bottle|lipo lab|lipo-[bc]|lipo-c|fat blaster|5-amino/i},
  {name:"Energy & Metabolic",test:/mots|ss-?31|nad\+|aicar|slu-?pp|l-carnitine|lc120|lc216|mic\b|superhuman|humanin|vitamin b12/i},
  {name:"Recovery & Repair",test:/bpc|tb500|tb-?500|glow|klow|kpv|ll-?37|ara-?290|cartalax|bronchogen|cardiogen|vesugen|lysine-proline-valine/i},
  {name:"Growth & Performance",test:/hgh|cjc|ghrp|ipamorelin|tesamorelin|sermorelin|igf|mgf|follistatin|ace-?031|gdf-?8|mk677|epo\b/i},
  {name:"Cognitive & Mood",test:/semax|selank|dihexa|dsip|pe-?22|pinealon|cerebrolysin|cortagen|adamax|melatonin|relaxation/i},
  {name:"Sexual & Hormone",test:/pt-?141|oxytocin|hcg\b|hmg\b|kisspeptin|gonadorelin|alprostadil|testagen/i},
  {name:"Skin, Hair & Beauty",test:/melanotan|snap-?8|matrixyl|ahk-?cu|ghk-?cu|healthy hair|botulinum|hyaluronic/i},
  {name:"Immune & Wellness",test:/thym|epithalon|glutathione|foxo|pnc|vilon|crystagen|vip\b|vasoactive|dermorphin/i},
  {name:"Supplies",test:/water|saline|phosphate buffered|acetic acid/i}
];
function categoryFor(name){return categories.find(category=>category.test.test(name))?.name||"Other"}
const normalizeName=value=>String(value||"").toLowerCase().replace(/thymosin beta-?4/g,"tb500").replace(/wolverine/g,"").replace(/[^a-z0-9]+/g,"");
const protocolEntries=Array.isArray(window.PROTOCOL_DATA)?window.PROTOCOL_DATA:[];
const protocolDisplay=window.PROTOCOL_DISPLAY_DATA||{};
function protocolFor(name){const key=normalizeName(name);return protocolEntries.find(entry=>normalizeName(entry.name)===key||normalizeName(entry.protocolName)===key)||null}
const overviewOverrides=new Map([
  ["bpc157tb500","BPC-157 is a synthetic gastric peptide fragment studied mainly in preclinical models for repair-related signaling. TB-500 is related to thymosin beta-4 and is studied for cell migration, actin regulation, angiogenesis, and tissue repair. This blend combines both research compounds in one vial; published human evidence remains limited."],
]);
function displayFor(entry){return entry?protocolDisplay[normalizeName(entry.name)]||null:null}
function conciseDescription(entry){if(!entry?.overview)return"";const shared=displayFor(entry)?.overview;if(shared)return shared;const override=overviewOverrides.get(normalizeName(entry.name));if(override)return override;const clean=entry.overview.replace(/\s+/g," ").trim(),sentences=clean.match(/[^.!?]+[.!?]+/g)||[clean];let result="";for(const sentence of sentences){if(/\b(you|your|yours|i|me|my|we|our|ours)\b/i.test(sentence))continue;if((result+sentence).length>520&&result)break;result+=sentence.trim()+" ";if((result.match(/[.!?]/g)||[]).length>=3)break}return result.trim()||sentences[0].trim()}
const wikiAliases=new Map([["nacemaxamidate","n-acetyl-semax-amidate"],["nasemaxamidate","n-acetyl-semax-amidate"],["thymosinalpha1","thymosin-alpha-1"],["hghfragment176191","hgh-fragment-176-191"],["cjc1295nodac","cjc-1295"],["cjc1295withdac","cjc-1295"],["ghkcu","ghk-cu"],["ahkcu","ahk-cu"],["igf1lr3","igf-1-lr3"],["igfdes","igf-1-des"],["ll37","ll-37"],["pt141","pt-141"],["ss31","ss-31"],["tb500","tb-500"],["aod9604","aod-9604"],["ara290","ara-290"],["5amino1mq","5-amino-1mq"],["pe2228","pe-22-28"],["slu-pp-332","slu-pp-332"]]);
function wikiUrl(entry){
  if(!entry)return"";
  const name=String(entry.protocolName||entry.name||"").trim(),key=normalizeName(name);
  if(/[+\/]|\bblend\b|\bstack\b/i.test(name)||/water|saline|syringe|phosphate buffered|custom tag/i.test(name))return"";
  const slug=wikiAliases.get(key)||name.toLowerCase().replace(/\bacetate\b/g,"").replace(/\b(?:with|no)\s+dac\b/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
  return slug?`https://peptides.wiki/peptides/${slug}/`:"";
}
const stockKey=(product,strength)=>`${String(product).trim().toLowerCase()}|${String(strength).trim().toLowerCase()}`;
function stockQuantity(product,strength){return state.inventory.get(stockKey(product,strength))||0}
function productInStock(product){return productStrengths(product).some(strength=>stockQuantity(product.name,strength)>0)}
function productStrengths(product){return[...new Set([...product.china,...product.usa].map(item=>item.strength))].sort((a,b)=>strengthNumber(a)-strengthNumber(b))}
function highestPriceItem(product,strength){const candidates=[...product.china,...product.usa].filter(item=>item.strength===strength);if(!candidates.length)return null;return{strength,retail:Object.fromEntries(Object.keys(tierInfo).map(key=>[key,Math.max(...candidates.map(item=>Number(item.retail?.[key])||0))]))}}
function matchingProducts(){const query=search.value.trim().toLowerCase();return query?state.products.filter(product=>product.name.toLowerCase().includes(query)||displayProductName(product.name).toLowerCase().includes(query)).slice(0,12):[]}
function stockChip(product){return productInStock(product)?'<span class="stock-chip">IN STOCK</span>':""}
function renderSuggestions(){const matches=matchingProducts();suggestions.hidden=!matches.length;suggestions.innerHTML=matches.map(product=>`<button type="button" class="${productInStock(product)?"in-stock":""}" data-product="${escapeHtml(product.name)}">${escapeHtml(displayProductName(product.name))}${stockChip(product)}</button>`).join("")}
function renderInStockSection(){const groups=new Map(),items=[];for(const product of state.products){for(const strength of productStrengths(product)){const quantity=stockQuantity(product.name,strength);if(quantity>0)items.push({product,category:categoryFor(product.name),strength,quantity})}}inStockSection.hidden=!items.length;if(!items.length){inStockGroups.innerHTML="";inStockCount.textContent="";return}for(const item of items){if(!groups.has(item.category))groups.set(item.category,[]);groups.get(item.category).push(item)}const ordered=[...categories.map(item=>item.name),"Other"];inStockCount.textContent=`${items.length} available strength${items.length===1?"":"s"}`;inStockGroups.innerHTML=ordered.filter(name=>groups.has(name)).map(name=>`<section class="in-stock-category"><h3>${escapeHtml(name)}</h3><div class="in-stock-items">${groups.get(name).sort((a,b)=>a.product.name.localeCompare(b.product.name)||strengthNumber(a.strength)-strengthNumber(b.strength)).map(item=>`<button type="button" data-stock-product="${escapeHtml(item.product.name)}" data-stock-strength="${escapeHtml(item.strength)}"><span><strong>${escapeHtml(displayProductName(item.product.name))}</strong><small>${escapeHtml(item.strength)} per vial</small></span><b>${item.quantity} vial${item.quantity===1?"":"s"} available</b></button>`).join("")}</div></section>`).join("")}
function renderCatalog(){const selected=categorySelect.value,groups=new Map();state.products.forEach(product=>{const category=categoryFor(product.name);if(selected!=="all"&&category!==selected)return;if(!groups.has(category))groups.set(category,[]);groups.get(category).push(product)});const ordered=[...categories.map(item=>item.name),"Other"];catalogGroups.innerHTML=ordered.filter(name=>groups.has(name)).map(name=>`<section class="catalog-group"><h2>${escapeHtml(name)}</h2><div class="product-buttons">${groups.get(name).sort((a,b)=>a.name.localeCompare(b.name)).map(product=>`<button type="button" class="${productInStock(product)?"in-stock":""}" data-product="${escapeHtml(product.name)}">${escapeHtml(displayProductName(product.name))}${stockChip(product)}</button>`).join("")}</div></section>`).join("")}
function renderStrengths(){if(!state.selectedProduct)return;const strengths=productStrengths(state.selectedProduct);strengthSelect.innerHTML=strengths.map(strength=>{const quantity=stockQuantity(state.selectedProduct.name,strength);return`<option value="${escapeHtml(strength)}">${escapeHtml(strength)}${quantity>0?` — ${quantity} available`:""}</option>`}).join("");if(!strengths.includes(state.selectedStrength))state.selectedStrength=strengths[0]||"";strengthSelect.value=state.selectedStrength}
function chooseProduct(name){const product=state.products.find(item=>item.name===name);if(!product)return;state.selectedProduct=product;search.value=displayProductName(product.name);suggestions.hidden=true;selectedName.textContent=displayProductName(product.name);const entry=protocolFor(product.name),educationUrl=wikiUrl(entry);downloadProductPdf.hidden=!entry;productEducation.hidden=!educationUrl;productEducation.href=educationUrl||"#";productInfo.hidden=!entry&&!educationUrl;state.selectedStrength=productStrengths(product)[0]||"";renderStrengths();selection.hidden=false;renderPrices();selection.scrollIntoView({behavior:"smooth",block:"start"})}
function pdfText(value){return String(value||"").replace(/[–—]/g,"-").replace(/[‘’]/g,"'").replace(/[“”]/g,'"').replace(/[^\x09\x0A\x0D\x20-\x7E]/g,"")}
function protocolDoseRecords(entry){return displayFor(entry)?.doses?.length?displayFor(entry).doses:entry.doses||[]}
function doseText(dose){return dose.note||`${dose.value} ${dose.unit}`}
function downloadSelectedProductPdf(){
  const entry=protocolFor(state.selectedProduct?.name);
  if(!entry||!window.jspdf?.jsPDF)return;
  const doc=new window.jspdf.jsPDF({unit:"pt",format:"letter"}),margin=36,pageWidth=doc.internal.pageSize.getWidth(),pageHeight=doc.internal.pageSize.getHeight(),contentWidth=pageWidth-margin*2,contentBottom=pageHeight-66;
  const navy=[1,30,65],orange=[230,83,0],ink=[22,32,51],muted=[93,107,122],light=[246,248,251],cream=[255,247,237],border=[216,222,232];
  let y=34;
  const ensureSpace=height=>{if(y+height>contentBottom){doc.addPage();y=34}};
  const overview=(()=>{const text=conciseDescription(entry).replace(/\s+/g," ").trim(),sentences=text.match(/[^.!?]+[.!?]+/g)||[text];return sentences.slice(0,2).join(" ").trim().slice(0,360)})();
  const drawCard=(title,text,options={})=>{
    if(!text)return;
    doc.setFont("helvetica","normal");doc.setFontSize(options.size||9.5);
    const lines=doc.splitTextToSize(pdfText(text),contentWidth-28),lineHeight=options.lineHeight||13,height=31+lines.length*lineHeight+10;
    ensureSpace(height+10);
    doc.setFillColor(...(options.fill||light));doc.setDrawColor(...(options.stroke||border));doc.setLineWidth(options.strong?1.6:.8);doc.roundedRect(margin,y,contentWidth,height,9,9,"FD");
    doc.setFillColor(...(options.accent||navy));doc.roundedRect(margin,y,contentWidth,25,9,9,"F");doc.rect(margin,y+16,contentWidth,9,"F");
    doc.setTextColor(255,255,255);doc.setFont("helvetica","bold");doc.setFontSize(10);doc.text(pdfText(title),margin+13,y+17);
    doc.setTextColor(...ink);doc.setFont("helvetica","normal");doc.setFontSize(options.size||9.5);doc.text(lines,margin+14,y+43,{lineHeightFactor:lineHeight/(options.size||9.5)});
    y+=height+10;
  };
  const drawTable=(title,headers,rows,widths,options={})=>{
    if(!rows.length)return;
    const headerH=23,pad=6,fontSize=options.fontSize||8.5,lineH=options.lineHeight||11;
    const measured=rows.map(row=>Math.max(...row.map((cell,index)=>doc.splitTextToSize(pdfText(cell),widths[index]-pad*2).length))*lineH+10);
    const cardHeader=26,tableHeader=24,totalHeight=cardHeader+tableHeader+measured.reduce((a,b)=>a+b,0)+1;
    if(totalHeight<=contentBottom-34)ensureSpace(totalHeight+10);else ensureSpace(cardHeader+tableHeader+measured[0]+10);
    const drawTitle=()=>{doc.setFillColor(...(options.accent||navy));doc.roundedRect(margin,y,contentWidth,cardHeader,9,9,"F");doc.rect(margin,y+16,contentWidth,10,"F");doc.setTextColor(255,255,255);doc.setFont("helvetica","bold");doc.setFontSize(10);doc.text(pdfText(title),margin+13,y+18);y+=cardHeader};
    const drawHeaders=()=>{let x=margin;doc.setFillColor(...cream);doc.rect(margin,y,contentWidth,tableHeader,"F");headers.forEach((head,index)=>{doc.setTextColor(...navy);doc.setFont("helvetica","bold");doc.setFontSize(7.5);doc.text(pdfText(head),x+pad,y+16);x+=widths[index]});y+=tableHeader};
    drawTitle();drawHeaders();
    rows.forEach((row,rowIndex)=>{
      const rowH=measured[rowIndex];
      if(y+rowH>contentBottom){doc.addPage();y=34;drawTitle();drawHeaders()}
      doc.setFillColor(...(rowIndex%2?light:[255,255,255]));doc.setDrawColor(...border);doc.rect(margin,y,contentWidth,rowH,"FD");
      let x=margin;
      row.forEach((cell,index)=>{doc.setTextColor(...ink);doc.setFont("helvetica",index===0?"bold":"normal");doc.setFontSize(fontSize);const lines=doc.splitTextToSize(pdfText(cell),widths[index]-pad*2);doc.text(lines,x+pad,y+13,{lineHeightFactor:lineH/fontSize});if(index<row.length-1){doc.setDrawColor(...border);doc.line(x+widths[index],y,x+widths[index],y+rowH)}x+=widths[index]});
      y+=rowH;
    });
    y+=10;
  };

  doc.setFillColor(...navy);doc.roundedRect(margin,y,contentWidth,76,11,11,"F");doc.setFillColor(...orange);doc.rect(margin,y,7,76,"F");
  doc.setTextColor(255,255,255);doc.setFont("helvetica","bold");doc.setFontSize(9);doc.text("PROTOCOL QUICK GUIDE",margin+20,y+19);
  doc.setFontSize(23);doc.text(pdfText(displayProductName(entry.protocolName||entry.name)),margin+20,y+46);
  doc.setTextColor(220,227,235);doc.setFont("helvetica","normal");doc.setFontSize(9.5);doc.text(pdfText(entry.category||categoryFor(entry.name)),margin+20,y+64);
  const strengthText=pdfText(state.selectedStrength||"Not selected");doc.setFillColor(...orange);doc.roundedRect(pageWidth-margin-108,y+18,92,40,8,8,"F");doc.setTextColor(255,255,255);doc.setFont("helvetica","bold");doc.setFontSize(8);doc.text("SELECTED VIAL",pageWidth-margin-62,y+32,{align:"center"});doc.setFontSize(15);doc.text(strengthText,pageWidth-margin-62,y+49,{align:"center"});y+=88;

  drawCard("QUICK OVERVIEW",overview,{fill:[255,255,255]});
  const display=displayFor(entry),doses=protocolDoseRecords(entry),scheduled=doses.filter(dose=>dose.weekLabel),sourceSchedule=display?.schedule||entry.schedule||"";
  const frequencyMatch=String(sourceSchedule||entry.schedule||"").match(/\b(once weekly|twice weekly|three times weekly|once daily|twice daily|three times daily|every other day)\b/i),scheduleFrequency=frequencyMatch?.[1]||entry.frequency||"";
  let scheduleRows=[];
  if(scheduled.length){scheduleRows=scheduled.map((dose,index)=>[dose.weekLabel,doseText(dose)+(scheduleFrequency?` - ${scheduleFrequency}`:""),index===0?"STARTER DOSE":dose.guidance?"STAY HERE IF EFFECTIVE":""])}
  else{
    const useful=String(sourceSchedule||"No usual dosage schedule is currently recorded.").split(/\n+/).map(line=>line.trim()).filter(line=>line&&!/^evidence:/i.test(line));
    scheduleRows=useful.slice(0,10).map((line,index)=>{const parts=line.split(/:\s*/,2);return parts.length===2?[parts[0],parts[1],index===0?"":""]:[index===0?"REFERENCE":"",line,""]});
  }
  drawTable("USUAL DOSAGE SCHEDULE",["PERIOD / ITEM","DOSE / INSTRUCTION","GUIDANCE"],scheduleRows,[108,198,234],{accent:orange,fontSize:8.2});

  const vialMg=Number.parseFloat(state.selectedStrength),calculable=doses.length&&doses.every(dose=>dose.mg>0)&&vialMg>0,isNasal=/^(semax|selank)$/i.test(String(entry.name||entry.protocolName||""));
  if(calculable&&isNasal){
    const sprayRows=doses.map(dose=>{const sprays=dose.mg*50/vialMg,coverage=vialMg/dose.mg;return[doseText(dose),"5 mL saline",`${Number(sprays.toFixed(2))} spray${Math.abs(sprays-1)<.001?"":"s"}`,`${Number(coverage.toFixed(1))} doses` ]});
    drawTable("NASAL RECONSTITUTION - APPROX. 50 SPRAYS",["DOSE","SALINE","SPRAYS","VIAL COVERAGE"],sprayRows,[145,105,125,165],{accent:orange,fontSize:8.8});
  }else if(calculable){
    const water=[1,1.5,2,2.5,3],reconRows=doses.map(dose=>{const draws=water.map(ml=>({ml,units:dose.mg/vialMg*ml*100})),recommended=draws.filter(row=>row.units>0&&row.units<50.000001).sort((a,b)=>a.units-b.units)[0],coverage=vialMg>=dose.mg?`${Number((vialMg/dose.mg).toFixed(1))} doses/vial`:"Vial below dose";return[dose.weekLabel||doseText(dose),...draws.map(row=>`${Number(row.units.toFixed(2))}u`),recommended?`${recommended.ml}mL / ${Number(recommended.units.toFixed(2))}u; ${coverage}`:`No option under 50u; ${coverage}`]});
    drawTable("RECONSTITUTION & UNIT DRAW",["DOSE / PERIOD","1 mL","1.5 mL","2 mL","2.5 mL","3 mL","RECOMMENDED"],reconRows,[90,48,48,48,48,48,210],{accent:orange,fontSize:7.5,lineHeight:10});
  }
  drawCard("PREPARATION",entry.reconstitution,{fill:[255,255,255]});
  drawCard("STORAGE",entry.stability,{fill:[255,255,255]});
  const pageCount=doc.getNumberOfPages();
  for(let page=1;page<=pageCount;page++){
    doc.setPage(page);doc.setDrawColor(...orange);doc.setLineWidth(1);doc.line(margin,pageHeight-51,pageWidth-margin,pageHeight-51);
    doc.setTextColor(...navy);doc.setFont("helvetica","bold");doc.setFontSize(8);doc.text("Research ONLY. Not medical advice.",margin,pageHeight-36);
    doc.setTextColor(...muted);doc.setFont("helvetica","normal");doc.setFontSize(7);doc.text(`Selected vial: ${pdfText(state.selectedStrength||"Not selected")}  |  Page ${page} of ${pageCount}`,pageWidth-margin,pageHeight-36,{align:"right"});
  }
  const filename=String(entry.name||"protocol").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");doc.save(`${filename}-${String(state.selectedStrength||"").replace(/\s+/g,"-")}-protocol.pdf`)
}
function priceCard(item,quantity){if(!item)return"";return`<article class="price-card">${quantity>0?`<div class="stock-banner">In Stock · ${quantity} vial${quantity===1?"":"s"} available</div>`:""}<p class="strength-copy">${escapeHtml(item.strength)} per vial</p><fieldset><legend>Choose package</legend>${Object.entries(tierInfo).map(([key,tier],index)=>`<label class="tier-choice ${quantity>=tier.vials?"stock-available":""}"><input type="radio" name="package" value="${key}" ${index===0?"checked":""}><span><strong>${tier.label}</strong><small>${tier.discount}${quantity>=tier.vials?" · Available now":""}</small></span><b>${money.format(item.retail[key])}</b></label>`).join("")}</fieldset><button type="button" class="add-button" data-add>Add Selected Package to Cart</button></article>`}
function renderPrices(){if(!state.selectedProduct||!state.selectedStrength)return;const quantity=stockQuantity(state.selectedProduct.name,state.selectedStrength);strengthSelect.classList.toggle("in-stock",quantity>0);prices.innerHTML=priceCard(highestPriceItem(state.selectedProduct,state.selectedStrength),quantity)}
function addToCart(){const source=highestPriceItem(state.selectedProduct,state.selectedStrength),choice=$("input[name=package]:checked");if(!source||!choice)return;const tier=tierInfo[choice.value],key=`${state.selectedProduct.name}|${source.strength}|${choice.value}`,existing=state.cart.find(item=>item.key===key),name=displayProductName(state.selectedProduct.name);if(existing)existing.quantity++;else state.cart.push({key,name,strength:source.strength,packageLabel:tier.label,discount:tier.discount,price:source.retail[choice.value],quantity:1});renderCart();formStatus.textContent=`${name} ${source.strength}, ${tier.label}, added to your cart.`}
function subtotal(){return state.cart.reduce((sum,item)=>sum+item.price*item.quantity,0)}
function fulfillmentMethod(){return $("#fulfillment-pickup")?.checked?"Pickup":"Shipping"}
function fulfillmentFee(){return state.cart.length&&fulfillmentMethod()==="Shipping"?20:0}
function orderTotal(){return state.cart.length?subtotal()+fulfillmentFee():0}
function orderSummary(){if(!state.cart.length)return"No items";const method=fulfillmentMethod(),lines=state.cart.map(item=>`${item.quantity} x ${item.name} — ${item.strength} — ${item.packageLabel} (${item.discount}) @ ${money.format(item.price)} = ${money.format(item.quantity*item.price)}`);return`${lines.join("\n")}\nSubtotal: ${money.format(subtotal())}\nFulfillment: ${method}\n${method==="Shipping"?"Shipping: $20":"Pickup: $0"}\nOrder total: ${money.format(orderTotal())}`}
function renderCart(){cartContainer.innerHTML=state.cart.length?state.cart.map(item=>`<div class="cart-line"><div><strong>${escapeHtml(item.name)}</strong><span>${escapeHtml(item.strength)} · ${item.packageLabel} · ${item.discount}</span></div><strong>${money.format(item.price*item.quantity)}</strong><div class="quantity"><button type="button" data-action="decrease" data-key="${escapeHtml(item.key)}" aria-label="Decrease quantity">−</button><span>${item.quantity}</span><button type="button" data-action="increase" data-key="${escapeHtml(item.key)}" aria-label="Increase quantity">+</button><button type="button" class="remove" data-action="remove" data-key="${escapeHtml(item.key)}">Remove</button></div></div>`).join(""):`<p class="empty">No items added.</p>`;cartTotals.hidden=!state.cart.length;const method=fulfillmentMethod();cartTotals.innerHTML=state.cart.length?`<div><span>Subtotal</span><strong>${money.format(subtotal())}</strong></div><div><span>${method}</span><strong>${money.format(fulfillmentFee())}</strong></div><div class="total"><span>Order total</span><strong>${money.format(orderTotal())}</strong></div>`:"";const itemCount=state.cart.reduce((sum,item)=>sum+item.quantity,0);cartCount.textContent=`${itemCount} ${itemCount===1?"item":"items"}`;grandTotal.textContent=money.format(orderTotal());submitOrder.disabled=!itemCount;$("#order-details-field").value=orderSummary();$("#order-total-field").value=money.format(orderTotal())}

inStockGroups.addEventListener("click",event=>{const button=event.target.closest("[data-stock-product]");if(!button)return;chooseProduct(button.dataset.stockProduct);if(state.selectedProduct&&productStrengths(state.selectedProduct).includes(button.dataset.stockStrength)){state.selectedStrength=button.dataset.stockStrength;renderStrengths();renderPrices();selection.scrollIntoView({behavior:"smooth",block:"start"})}});
downloadProductPdf.addEventListener("click",downloadSelectedProductPdf);
search.addEventListener("input",renderSuggestions);search.addEventListener("keydown",event=>{if(event.key==="Enter"){event.preventDefault();const first=matchingProducts()[0];if(first)chooseProduct(first.name)}});document.addEventListener("click",event=>{const button=event.target.closest?.("[data-product]");if(!button)return;event.preventDefault();chooseProduct(button.dataset.product)});categorySelect.addEventListener("change",renderCatalog);strengthSelect.addEventListener("change",()=>{state.selectedStrength=strengthSelect.value;renderPrices()});prices.addEventListener("click",event=>{if(event.target.closest("[data-add]"))addToCart()});$(".cart-section").addEventListener("click",event=>{const button=event.target.closest("[data-action]");if(!button)return;const item=state.cart.find(entry=>entry.key===button.dataset.key);if(!item)return;if(button.dataset.action==="increase")item.quantity++;if(button.dataset.action==="decrease")item.quantity--;if(button.dataset.action==="remove"||item.quantity<=0)state.cart=state.cart.filter(entry=>entry.key!==item.key);renderCart()});
orderForm.addEventListener("change",event=>{if(event.target.name==="fulfillment")renderCart()});
orderForm.addEventListener("submit",async event=>{event.preventDefault();if(!state.cart.length)return;submitOrder.disabled=true;submitOrder.textContent="Sending…";formStatus.textContent="Submitting your order request…";try{const response=await fetch(orderForm.action,{method:"POST",body:new FormData(orderForm),headers:{Accept:"application/json"}});if(!response.ok)throw new Error("Submission failed");state.cart=[];orderForm.reset();renderCart();formStatus.textContent="Order request sent. We will contact you to confirm availability and payment."}catch{formStatus.textContent="The order request could not be sent. Please check your information and try again."}finally{submitOrder.textContent="Submit Order Request";submitOrder.disabled=!state.cart.length}});
async function refreshInventory(){try{const response=await fetch(`https://raw.githubusercontent.com/ThatPepLab/InStock/main/inventory.json?updated=${Date.now()}`,{cache:"no-store"});if(!response.ok)throw new Error("Inventory unavailable");const entries=await response.json(),next=new Map();for(const entry of Array.isArray(entries)?entries:[]){const quantity=Math.max(0,Math.floor(Number(entry.quantity)||0));if(entry.product&&entry.strength&&quantity>0)next.set(stockKey(entry.product,entry.strength),quantity)}state.inventory=next;renderInStockSection();renderCatalog();renderSuggestions();if(state.selectedProduct){renderStrengths();renderPrices()}}catch(error){console.warn("Inventory check failed",error)}}
fetch(`/Wholesale/catalog-data.json?updated=${Date.now()}`,{cache:"no-store"}).then(response=>{if(!response.ok)throw new Error("Catalog unavailable");return response.json()}).then(products=>{state.products=products;const names=[...new Set(products.map(product=>categoryFor(product.name)))].sort();categorySelect.insertAdjacentHTML("beforeend",names.map(name=>`<option value="${escapeHtml(name)}">${escapeHtml(name)}</option>`).join(""));renderInStockSection();renderCatalog()}).catch(()=>{catalogGroups.innerHTML='<div class="prompt"><strong>Catalog unavailable.</strong><span>Please refresh the page.</span></div>'});refreshInventory();setInterval(refreshInventory,300000);renderCart();
