/* Cendrelame · ui/collecte-et-marchand.js */
/* --- collecte --- */
const UPICON='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l8 8h-5v4H9v-4H4zM6 18h12v3H6z"/></svg>';
const GEARI='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19.14 12.94c.04-.3.06-.61.06-.94s-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.49.49 0 0 0-.59-.22l-2.39.96a7 7 0 0 0-1.62-.94l-.36-2.54a.48.48 0 0 0-.48-.41h-3.84a.48.48 0 0 0-.48.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96a.49.49 0 0 0-.59.22L2.74 8.87a.48.48 0 0 0 .12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32a.48.48 0 0 0-.12-.61zM12 15.6A3.6 3.6 0 1 1 12 8.4a3.6 3.6 0 0 1 0 7.2z"/></svg>';
Object.assign(UIC,{gear:'<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1 7 17M17 7l2.1-2.1"/>',up:'<path d="M12 19V6M6 11l6-6 6 6"/>',minus:'<path d="M5 12h14"/>',hand:'<path d="M7 11V5.5a1.5 1.5 0 0 1 3 0V10M10 9V4.5a1.5 1.5 0 0 1 3 0V10M13 9.5V5.5a1.5 1.5 0 0 1 3 0V12M16 10a1.5 1.5 0 0 1 3 0v4a7 7 0 0 1-7 7h-1a6 6 0 0 1-5-3l-2.5-4.5a1.5 1.5 0 0 1 2.5-1.5L7 14"/>'});
/* ===== Collecte : tableau de production ===== */
const SITE_SC={mine:1,bois:0,ruines:5,marais:2};
const siteProg=st=>(st.ready||0)>=siteRes(st)?1:Math.min(1,(st.t||0)/cycleDur(st));
function siteCanUp(si,st){return branchesFor(si.id).some(b=>{const t=tal(st),r=t[b.k]||0; return r<b.max?S.gold>=talCost(si.id,b.k,r):!t[b.cap.k]&&S.gold>=talCost(si.id,b.cap.k,0)})||(!tal(st).auto&&zoneLvl(st)>=AUTO_L&&S.gold>=autoCost(si.id))}
function viewSites(){
  const rows=SITES.map(si=>{
    const st=S.sites[si.id],lk=st.lvl<1,rd=st.ready||0,au=!lk&&autoOn(st),sc=zoneScene(SITE_SC[si.id]!=null?SITE_SC[si.id]:0,'st');
    if(lk) return `<article class="mcrow lock"><span class="mcth">${sc}</span><div class="mcrn"><b>${si.n}</b><small>${si.desc}</small></div>
      <div class="mcrmid"><div class="mcrates">${Object.keys(si.out).map(m=>`<span class="mcr">${matIcon(m)} ${MAT_N[m]}</span>`).join('')}</div></div>
      <button class="btn pri" data-act="siteBuy" data-id="${si.id}" ${hasGold(si.unlock)?'':'disabled'}>Ouvrir · <span class="num">${fmt(si.unlock)}</span> ${matIcon('gold')}</button></article>`;
    const rates=Object.keys(si.out).map(m=>`<span class="mcr" title="${MAT_N[m]}">${matIcon(m)}<b class="num">+${r1(siteBatch(si,st,m))}</b></span>`).join('');
    return `<article class="mcrow ${rd&&!au?'rd':''}"><span class="mcth">${sc}${au?'<span class="mcauto">Auto</span>':''}</span>
      <div class="mcrn"><b>${si.n}</b><small>Niveau de zone <b class="num">${zoneLvl(st)}</b></small></div>
      <div class="mcrmid"><div class="mcrates">${rates}<small class="mute">par récolte</small></div><div class="mpratio mcbar"><i data-cyc="${si.id}" style="width:${siteProg(st)*100}%"></i></div><small class="mute num" data-cyct="${si.id}">${cycTxt(st)}</small></div>
      <div class="mcracts"><button class="btn sm mcib" data-act="siteTree" data-id="${si.id}" title="Améliorations" aria-label="Améliorations de ${si.n}">${uic('up')}${siteCanUp(si,st)?'<span class="ndot" aria-hidden="true"></span>':''}</button>
       <button class="btn sm mcib sgear ${au?'on':''}" data-act="siteOpt" data-id="${si.id}" title="Récolte automatique" aria-label="Options de ${si.n}" aria-expanded="${UI.siteOpt===si.id}">${uic('gear')}</button>
       <button class="btn pri" data-act="siteCollect" data-id="${si.id}" ${rd?'':'disabled'}>Collecter${rd>1?` (${rd})`:''}</button>${UI.siteOpt===si.id?optDD(si.id):''}</div></article>`}).join('');
  const soon=SITES_ALL.filter(x=>x.off).map(si=>`<article class="mcrow lock soon"><span class="mcth">${zoneScene(SITE_SC[si.id]!=null?SITE_SC[si.id]:0,'st')}</span><div class="mcrn"><b>${si.n}</b><small>${si.desc}</small></div><div class="mcrmid"><span class="mcsoon">${uic('lock')} Arrive dans une prochaine mise à jour</span></div><span></span></article>`).join('');
  const ph={};
  for(const si of SITES){const st=S.sites[si.id]; if(st.lvl<1) continue; for(const m of Object.keys(si.out)) ph[m]=(ph[m]||0)+siteBatch(si,st,m)*3600/cycleDur(st)}
  const nReady=SITES.filter(si=>S.sites[si.id].lvl>0&&(S.sites[si.id].ready||0)>0).length;
  const stocks=[].map(m=>{const v=matCount(m),c=matCap(m);return `<div class="mcstk ${v>=c?'full':''}"><span>${matIcon(m)} ${MAT_N[m]}</span><i><b style="width:${Math.min(100,v/c*100)}%"></b></i><em class="num">${fmt(v)} / ${fmt(c)}</em></div>`}).join('');
  setTimeout(liveSites,0);
  lastBlocked=collectBlocked();
  return `${lastBlocked?'<div class="fullbar" role="alert">Stock de matériaux plein : utilisez-en à la Forge pour continuer la récolte automatique.</div>':''}
   <div class="mc3"><section><div class="mctop"><h2>Collecte</h2><span class="mute">Une récolte toutes les 5 minutes, même hors ligne. La zone attend que vous collectiez avant de recommencer.</span></div>${rows}${soon}</section>
   <aside class="aminfo maside"><div class="ambody"><button class="btn pri amgo" data-act="siteAll" ${nReady?'':'disabled'}>${uic('hand')} Tout collecter${nReady?` (${nReady})`:''}</button>
    <h4>Production par heure</h4><div class="mcrates">${Object.entries(ph).map(([m,v])=>`<span class="mcr" title="${MAT_N[m]}">${matIcon(m)}<b class="num">+${fmt(Math.round(v))}</b></span>`).join('')||'<span class="mute">Aucune zone ouverte.</span>'}</div>

    <p class="amnote mute" style="margin-top:auto">La flèche ouvre l’arbre d’améliorations de la Mine (cadence, filon d’or et entrepôt). L’engrenage donne accès à la récolte automatique, débloquée au niveau de zone ${AUTO_L}.</p></div></aside></div>${UI.siteTree?treeModal(UI.siteTree):''}`;
}
/* ===== Marchand : étal ===== */
const SHOP_CAT=k=>/^c[tf]_/.test(k)?'comp':['c_relic','s_ch2','s_ch3'].includes(k)?'cos':k==='sc_blank'||k==='rm_aff'?'ench':k==='p_oubli'?'spe':['p_xp','p_loot'].includes(k)?'prog':'comb';
const SHOP_CATS=[['all','Tout'],['comb','Combat'],['prog','Progression'],['ench','Enchantement'],['cos','Cosmétiques'],['comp','Compagnon'],['spe','Spéciaux']];
const SHOP_CN={comp:'Objet de compagnon',cos:'Coffre cosmétique',ench:'Fourniture d’enchantement',comb:'Potion de combat',prog:'Potion de progression',spe:'Objet spécial'};
const potLock=k=>POTS[k].cls&&POTS[k].cls!==S.heroes[0].cls;
const bigPot=(k,c='')=>`<span class="mcpot ${c}" style="--pc:${POTS[k].c}">${matIcon(k)}</span>`;
const shopMax=k=>POTS[k].fix?1:Math.max(1,Math.min(99,matRoom(k),Math.floor(S.gold/Math.max(1,potPrice(k)))));
function viewShop(){
  const ks=Object.keys(POTS);
  if(!POTS[UI.shopSel]) UI.shopSel=ks[0];
  const cat=UI.shopCat||'all',sel=UI.shopSel,p=POTS[sel],lk=potLock(sel),q=p.fix?1:Math.max(1,Math.min(UI.shopQ||1,99)),pr=p.fix?0:potPrice(sel),tot=pr*q;
  const price=k=>POTS[k].fix?`<span class="mcprice">${costHTML(POTS[k].fix)}</span>`:`<span class="mcprice num">${fmt(potPrice(k))} ${matIcon('gold')}</span>`;
  const slots=ks.filter(k=>cat==='all'||SHOP_CAT(k)===cat).map(k=>`<button class="mcslot ${k===sel?'on':''} ${potLock(k)?'lock':''}" data-act="shopSel" data-k="${k}" aria-pressed="${k===sel}">${bigPot(k)}<b>${POTS[k].n}</b>${price(k)}${matAll(k)?`<span class="mcown" title="Possédées (sac et coffre)">${matAll(k)}</span>`:''}${potLock(k)?`<small class="mclk">${CLASSES[POTS[k].cls].n}</small>`:''}</button>`).join('');
  const canBuy=!lk&&(p.fix?canPay(p.fix):hasGold(tot))&&matRoom(sel)>=q;
  const why=lk?`Réservée au ${CLASSES[p.cls].n}.`:matRoom(sel)<q?'Pas assez de place dans le sac.':!canBuy?'Pas assez de ressources.':'';
  return `<div class="amap mcshop">${shopBg('m','sh')}
   <div class="mcshelf"><div class="mcmer"><span class="mcmerp">${uic('coin')}</span><p class="mcquote">« Des potions pour l’aventure, voyageur ? »</p><span class="mcgold"><span>${matIcon('gold')}</span><b class="num">${fmt(S.gold)}</b></span></div>
    <div class="mcseg" role="tablist">${SHOP_CATS.map(([k,n])=>`<button role="tab" aria-selected="${cat===k}" class="${cat===k?'on':''}" data-act="shopCat" data-c="${k}">${n}</button>`).join('')}</div>
    <div class="mcgrid">${slots}</div></div>
   <aside class="aminfo" aria-label="${esc(p.n)}"><div class="amhead mcph" style="--pc:${p.c}">${bigPot(sel,'xl')}<span><small>${SHOP_CN[SHOP_CAT(sel)]}</small><h2>${p.n}</h2></span></div><div class="ambody">
    <p class="amnote">${p.d}</p><dl class="mpst"><dt>Possédées</dt><dd>${matAll(sel)}${stashCount(sel)?` <small class="mute">(${stashCount(sel)} au coffre)</small>`:''}</dd><dt>Recharge</dt><dd>${p.cd?p.cd+' tours':'—'}</dd><dt>Prix</dt><dd>${p.fix?'voir ci-dessous':fmt(pr)+' or'}</dd><dt>Votre or</dt><dd>${fmt(S.gold)}</dd></dl>
    ${p.fix?'':`<h4>Quantité</h4><div class="mcqty"><button class="btn" data-act="shopQd" data-d="-1" aria-label="Retirer 1" ${q<=1?'disabled':''}>${uic('minus')}</button><b class="num" aria-live="polite">${q}</b><button class="btn" data-act="shopQd" data-d="1" aria-label="Ajouter 1" ${q>=99?'disabled':''}>${uic('plus')}</button><span class="mcq">${[1,5,10,25].map(n=>`<button class="btn sm ${q===n?'on':''}" data-act="shopQ" data-q="${n}" aria-label="Acheter par ${n}">×${n}</button>`).join('')}<button class="btn sm" data-act="shopQ" data-q="max" title="Le maximum possible">Max</button></span></div>`}
    <div class="amfight"><div class="mctot"><span>Total</span><b class="num">${p.fix?costHTML(p.fix):`${fmt(tot)} ${matIcon('gold')}`}</b></div>
     <button class="btn pri amgo" data-act="buyPot" data-k="${sel}" data-q="${q}" ${canBuy?'':'disabled'}>${uic('coin')} Acheter${p.fix?'':' ×'+q}</button>${why?`<small class="mclk">${why}</small>`:''}
     <small class="mute">Les potions vont dans le sac et se boivent en combat sans utiliser votre tour. Les prix augmentent avec votre niveau.</small></div></div></aside></div>`;
}

const autoCost=id=>Math.round((SITE_M[id]||1)*8000);
function cycTxt(st){
  const R=siteRes(st),rd=st.ready||0;
  if(rd>=R) return R>1?`Réserve pleine : ${rd} récoltes prêtes`:'Récolte prête : appuyez sur Collecter';
  return (rd?`${rd} récolte${rd>1?'s':''} prête${rd>1?'s':''} · `:'')+'Prochaine récolte dans '+mmss(cycleDur(st)-(st.t||0));
}
function optDD(id){
  const si=SITES.find(x=>x.id===id),st=S.sites[id],t=tal(st),lv=zoneLvl(st);
  const body=t.auto?`<label class="optrow"><input type="checkbox" data-act="siteAutoT" data-id="${id}" ${autoOn(st)?'checked':''}> Récupérer automatiquement les récoltes de cette zone</label><p class="hint" style="margin:8px 0 0">Les ressources sont ajoutées dès qu’une récolte est prête.</p>`
    :`<label class="optrow lock"><input type="checkbox" disabled> Récupérer automatiquement les récoltes de cette zone</label><p class="hint" style="margin:8px 0 0">🔒 À débloquer dans l’arbre d’améliorations, à partir du niveau de zone ${AUTO_L} (niveau actuel : <b>${lv}</b>).</p><div class="row" style="justify-content:center;margin-top:12px"><button class="btn" data-act="siteTreeFromOpt" data-id="${id}">Ouvrir l’arbre</button></div>`;
  return `<div class="sdd ddmenu" id="sopt" role="menu"><b class="ddh">Options · ${si.n}</b>${body}</div>`;
}
function treeModal(id){
  const si=SITES.find(x=>x.id===id),st=S.sites[id],t=tal(st);
  const cols=branchesFor(id).map(b=>{
    const r=t[b.k]||0,full=r>=b.max,c=talCost(id,b.k,r),cx=b.cap,have=!!t[cx.k],cc=talCost(id,cx.k,0);
    const pips=Array.from({length:b.max},(_,i)=>`<i class="${i<r?'on':''}"></i>`).join('');
    return `<div class="tcol">
      <div class="tnode ${r?'got':''} ${full?'max':''}"><span class="tic">${b.ic}</span><b class="tn">${b.n}</b><small class="td">${b.d}</small>
        <span class="tpips">${pips}</span><span class="trank num">${r} / ${b.max}</span>
        <small class="teff"><span>${r?b.per(r):'Aucun bonus'}</span>${full?'':`<b>→ ${b.per(r+1)}</b>`}</small>
        <div class="tact">${full?'<span class="tmax">Maximum</span>':`<button class="btn sm pri" data-act="talBuy" data-id="${id}" data-k="${b.k}" ${hasGold(c)?'':'disabled'}>Améliorer</button>${costHTML({gold:c})}`}</div></div>
      <span class="tlink ${full?'on':''}" aria-hidden="true"></span>
      <div class="tnode cap ${have?'got max':''} ${full?'':'lock'}"><span class="tic">★</span><b class="tn">${cx.n}</b><small class="td">${cx.d}</small>
        <div class="tact">${have?'<span class="tmax">Acquis</span>':full?`<button class="btn sm pri" data-act="talBuy" data-id="${id}" data-k="${cx.k}" ${hasGold(cc)?'':'disabled'}>Débloquer</button>${costHTML({gold:cc})}`:`<small class="mute">🔒 ${b.n} ${b.max}/${b.max} requis</small>`}</div></div>
    </div>`}).join('');
  const lv=zoneLvl(st),ac=autoCost(id),R=siteRes(st);
  const sum=`<div class="tsum"><span><small>Niveau de zone</small><b>${lv}</b></span><span><small>Récolte toutes les</small><b>${mmss(cycleDur(st))}</b></span><span><small>Stock maximum</small><b>${Object.keys(si.out).filter(m=>m!=='gold').map(m=>fmt(matCap(m))).filter((v,i,a)=>a.indexOf(v)===i).join(' / ')||'—'}</b></span><span><small>Or disponible</small><b>${fmt(S.gold)}</b></span></div>`;
  const auto=`<div class="tnode tauto ${t.auto?'got max':''} ${lv>=AUTO_L?'':'lock'}"><span class="tic">${GEARI}</span><div class="tautotx"><b class="tn">Récolte automatique</b><small class="td">Débloque l’option de l’engrenage : les récoltes de la zone sont récupérées toutes seules.</small></div>
    <div class="tact">${t.auto?'<span class="tmax">Acquis</span>':lv>=AUTO_L?`<button class="btn sm pri" data-act="talBuy" data-id="${id}" data-k="auto" ${hasGold(ac)?'':'disabled'}>Débloquer</button>${costHTML({gold:ac})}`:`<small class="mute">🔒 Niveau de zone ${AUTO_L} requis (${lv}/${AUTO_L})</small>`}</div></div>`;
  return `<div class="modal" id="tree" role="dialog" aria-modal="true" aria-labelledby="treeT"><div class="box tree">
    <button class="x" data-act="treeClose" aria-label="Fermer">×</button>
    <h2 id="treeT">Améliorations · ${si.n}</h2>${sum}
    <div class="tgrid">${cols}</div>${auto}
    <p class="hint" style="margin:12px 0 0">Chaque rang coûte un peu plus cher. Le talent étoilé se débloque quand sa branche est au maximum. Chaque amélioration achetée augmente le niveau de la zone de 1.</p></div></div>`;
}
function liveSites(){
  for(const si of SITES){
    const st=S.sites[si.id]; if(st.lvl<1) continue;
    const D=cycleDur(st),full=(st.ready||0)>=siteRes(st),cb=$(`[data-cyc="${si.id}"]`),ct=$(`[data-cyct="${si.id}"]`);
    if(cb){const w=full?100:Math.min(100,(st.t||0)/D*100),o=parseFloat(cb.style.width)||0; if(w<o){cb.style.transition='none';cb.style.width=w+'%';void cb.offsetWidth;cb.style.transition=''} else cb.style.width=w+'%'}
    if(ct) ct.textContent=cycTxt(st);
  }
}

