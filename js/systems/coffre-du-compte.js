/* Cendrelame · systems/coffre-du-compte.js */
/* ============ coffre (lié au compte, partagé entre les personnages) ============ */
const SW=15,SH=5,STASH_MAX=6,STASH_COST=[0,5000,15000,40000,100000,250000];
function stashD(){ accHp3(); accR82(); accLp87(); accSf88(); if(!ACC.stash||!Array.isArray(ACC.stash.tabs)||!ACC.stash.tabs.length) ACC.stash={tabs:[{n:'Coffre 1',bag:[]}],cur:0}; const d=ACC.stash; if(!d.tabs[d.cur]) d.cur=0; return d }
const stashTab=()=>{const d=stashD(); return d.tabs[d.cur]};
const stashUsed=T=>T.bag.reduce((a,e)=>{const [w,h]=SIZE(e.o);return a+w*h},0);
function stashOverlaps(T,x,y,w,h,skip){return T.bag.filter(e=>{ if(e===skip) return false; const [ew,eh]=SIZE(e.o); return x<e.x+ew&&e.x<x+w&&y<e.y+eh&&e.y<y+h })}
/* déplacer tous les objets d'artisanat entre l'inventaire et le coffre */
const isCraftK=k=>!!k&&(!!NEWI[k]||MATS.includes(k));
const MV_IC={dep:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 13h18v7H3zM3 13l2-4h14l2 4M12 2v8M9 7l3 3 3-3"/></svg>',take:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 13h18v7H3zM3 13l2-4h14l2 4M12 11V2M9 5l3-3 3 3"/></svg>'};
const bagCraftN=()=>S.bag.reduce((a,e)=>a+(e.o.mat&&isCraftK(e.o.mat)?1:0),0);
const stCraftN=()=>stashTab().bag.reduce((a,e)=>a+(e.o.mat&&isCraftK(e.o.mat)?1:0),0);
function craftToStash(){
  const T=stashTab(); let moved=0,left=0;
  for(const E of S.bag.filter(e=>e.o.mat&&isCraftK(e.o.mat))){
    let n=E.o.n;
    for(const B of T.bag){ if(n<=0) break; if(B.o.mat===E.o.mat&&B.o.n<STACK){ const m=Math.min(STACK-B.o.n,n); B.o.n+=m; n-=m } }
    while(n>0){ const sp=findSpot(T.bag,1,1,SW,SH); if(!sp) break; const m=Math.min(STACK,n); T.bag.push({x:sp[0],y:sp[1],o:{mat:E.o.mat,n:m}}); n-=m }
    moved+=E.o.n-n; E.o.n=n; if(n>0) left++;
  }
  S.bag=S.bag.filter(e=>!(e.o.mat&&isCraftK(e.o.mat)&&e.o.n<=0)); if(UI.bagSel&&!S.bag.some(e=>e.o===UI.bagSel)) UI.bagSel=null;
  if(!moved){ toast(left?'Cet onglet du coffre est plein.':'Aucun objet d’artisanat dans l’inventaire.'); return }
  save(); saveAcc(); render(); toast(`${fmt(moved)} objet${moved>1?'s':''} d’artisanat déposé${moved>1?'s':''} dans le coffre.${left?' Coffre plein : le reste est resté dans l’inventaire.':''}`);
}
function craftFromStash(){
  const T=stashTab(); let moved=0,left=0;
  for(const E of T.bag.filter(e=>e.o.mat&&isCraftK(e.o.mat))){ const r=bagAddMat(S.bag,E.o.mat,E.o.n); moved+=E.o.n-r; E.o.n=r; if(r>0) left++ }
  T.bag=T.bag.filter(e=>!(e.o.mat&&isCraftK(e.o.mat)&&e.o.n<=0)); if(UI.stSel&&!T.bag.some(e=>e.o===UI.stSel)) UI.stSel=null;
  if(!moved){ toast(left?'Inventaire plein.':'Aucun objet d’artisanat dans cet onglet du coffre.'); return }
  markNew(); save(); saveAcc(); render(); toast(`${fmt(moved)} objet${moved>1?'s':''} d’artisanat récupéré${moved>1?'s':''} dans l’inventaire.${left?' Inventaire plein : le reste est resté dans le coffre.':''}`);
}
function toStash(i,x,y){
  const E=S.bag[i]; if(!E) return; const T=stashTab(),[w,h]=SIZE(E.o);
  if(x!=null){ const ov=stashOverlaps(T,x,y,w,h);
    if(ov.length===1&&E.o.mat&&ov[0].o.mat===E.o.mat){ const B=ov[0].o,m=Math.min(STACK-B.n,E.o.n); if(m<=0){toast('Cette pile est pleine.');return} B.n+=m; E.o.n-=m; if(!E.o.n) S.bag.splice(i,1); save(); render(); return }
    if(!fitsAt(T.bag,x,y,w,h,null,SW,SH)){toast('Pas assez de place ici.');return} }
  const pos=x!=null?[x,y]:findSpot(T.bag,w,h,SW,SH); if(!pos){toast('Cet onglet du coffre est plein.');return}
  S.bag.splice(i,1); T.bag.push({x:pos[0],y:pos[1],o:E.o}); if(UI.bagSel===E.o) UI.bagSel=null; save(); render();
}
function fromStash(j,x,y){
  const T=stashTab(),E=T.bag[j]; if(!E) return; const [w,h]=SIZE(E.o);
  if(E.o.mat&&isMatK(E.o.mat)){ const left=storeMat(E.o.mat,E.o.n),got=E.o.n-left; if(!got){toast(`Stock de ${MAT_N[E.o.mat].toLowerCase()} plein (${fmt(matCap(E.o.mat))}).`);return} E.o.n=left; if(!left) T.bag.splice(j,1); save(); render(); toast(`${fmt(got)} ${MAT_N[E.o.mat].toLowerCase()} ajouté${got>1?'s':''} à vos matériaux.${left?' Stock plein : le reste reste dans le coffre.':''}`); return }
  if(x!=null){ const ov=overlaps(x,y,w,h,null);
    if(ov.length===1&&E.o.mat&&ov[0].o.mat===E.o.mat){ const B=ov[0].o,m=Math.min(STACK-B.n,E.o.n); if(m<=0){toast('Cette pile est pleine.');return} B.n+=m; E.o.n-=m; if(!E.o.n) T.bag.splice(j,1); save(); render(); return }
    if(!fitsAt(S.bag,x,y,w,h)){toast('Pas assez de place ici.');return} }
  const pos=x!=null?[x,y]:findSpot(S.bag,w,h); if(!pos){toast('Inventaire plein.');return}
  T.bag.splice(j,1); if(!E.o.mat) E.o.id=++S.uid; S.bag.push({x:pos[0],y:pos[1],o:E.o}); if(UI.stSel===E.o) UI.stSel=null; markNew(); save(); render();
}
function moveStash(j,x,y){
  const T=stashTab(),E=T.bag[j]; if(!E) return; const [w,h]=SIZE(E.o); if(x===E.x&&y===E.y) return;
  const ov=stashOverlaps(T,x,y,w,h,E);
  if(ov.length===1&&E.o.mat&&ov[0].o.mat===E.o.mat){ const B=ov[0].o,m=Math.min(STACK-B.n,E.o.n); B.n+=m; E.o.n-=m; if(!E.o.n) T.bag.splice(j,1); saveAcc(); render(); return }
  if(!fitsAt(T.bag,x,y,w,h,[E],SW,SH)){toast('Pas assez de place ici.');return}
  E.x=x; E.y=y; saveAcc(); render();
}
function stashCellAt(px,py){
  const b=$('#stash'); if(!b) return null; const r=b.getBoundingClientRect();
  if(px<r.left||px>r.right||py<r.top||py>r.bottom) return null;
  const pad=8,gap=3,cw=(r.width-2*pad-(SW-1)*gap)/SW;
  return [clamp(Math.floor((px-r.left-pad+gap/2)/(cw+gap)),0,SW-1),clamp(Math.floor((py-r.top-pad+gap/2)/(cw+gap)),0,SH-1)];
}
function showSFoot(tx,ty,w,h,ok){
  let f=$('#sfoot'); const b=$('#stash'); if(!b) return;
  if(!f){f=document.createElement('div');f.id='sfoot';b.append(f)}
  const cx=clamp(tx,0,SW-1),cy=clamp(ty,0,SH-1),cw=Math.max(1,Math.min(w,SW-cx)),ch=Math.max(1,Math.min(h,SH-cy));
  f.style.gridColumn=`${cx+1}/span ${cw}`; f.style.gridRow=`${cy+1}/span ${ch}`; f.className=ok?'ok':'bad';
}
const hideSFoot=()=>{const f=$('#sfoot'); if(f) f.remove()};
function stashGridHTML(){
  const T=stashTab(); let bg=''; for(let y=0;y<SH;y++) for(let x=0;x<SW;x++) bg+=`<div class="cell" style="grid-column:${x+1};grid-row:${y+1}"></div>`;
  const items=T.bag.map((e,i)=>{ const c=e.o,[w,h]=SIZE(c),pos=`grid-column:${e.x+1}/span ${w};grid-row:${e.y+1}/span ${h}`,sel=UI.stSel===c?' sel':'';
    if(c.mat) return `<button class="cell full gi si mat${sel}" style="${pos}" data-act="stCell" data-i="${i}" data-tip="st:${i}" aria-label="${MAT_OBJ[c.mat]}, ${c.n}">${matSvg(c.mat)}<span class="q">${c.n}</span></button>`;
    return `<button class="cell full gi si it${sel}${itFx(c)}" style="${pos};--rc:var(--r${c.rarity})" data-act="stCell" data-i="${i}" data-tip="st:${i}" aria-label="${esc(c.name)}, ${RAR[c.rarity].n}, niveau ${c.ilvl}">${bigIcon(c)}${c.up?`<span class="u">+${c.up}</span>`:''}${ilTag(c)}</button>` }).join('');
  return `<div class="bagwrap"><div class="bag stashg" id="stash">${bg}${items}</div></div>`;
}
function renderStashPop(){
  let w=$('#stashpop');
  if(!UI.stashOpen||!UI.invOpen||!invAllowed()){ if(w) w.remove(); if(!UI.invOpen) UI.stashOpen=false; return }
  const fresh=!w; if(!w){ w=document.createElement('div'); w.id='stashpop'; w.className='invpop stashpop'; w.setAttribute('role','dialog'); w.setAttribute('aria-label','Coffre du compte'); document.body.append(w) }
  const d=stashD(),T=stashTab(),n=d.tabs.length,cost=STASH_COST[n],sel=UI.stSel&&T.bag.find(e=>e.o===UI.stSel);
  const tabs=d.tabs.map((t,i)=>i===d.cur&&UI.stRen?`<input id="stren" maxlength="16" value="${esc(t.n)}" aria-label="Nom de l’onglet">`:`<button class="sttab ${i===d.cur?'on':''}" data-act="stTab" data-i="${i}" title="${i===d.cur?'Double-cliquez pour renommer':''}">${esc(t.n)}</button>`).join('');
  w.innerHTML=`<div class="iphead" data-stdrag><span class="ipt">${icon('chest')}<b>Coffre</b></span><small class="num ipcnt">${stashUsed(T)} / ${SW*SH}</small><small class="mute">Partagé par tous vos personnages</small>${sortBtn('st')}<button class="tibmv" data-act="craftTake" ${stCraftN()?'':'disabled'} ${ttip('Tout récupérer dans l’inventaire','Prend tous les objets d’artisanat de cet onglet du coffre.')}>${MV_IC.take}</button><button class="ipx" data-act="stClose" aria-label="Fermer le coffre">×</button></div>
    <div class="sttabs">${tabs}<button class="sttab ren" data-act="stRen" title="Renommer l’onglet" aria-label="Renommer l’onglet">✎</button>${n<STASH_MAX?`<button class="sttab buy ${UI.stBuy?'conf':''}" data-act="stBuy" ${hasGold(cost)?'':'disabled'} title="Acheter un nouvel onglet">${UI.stBuy?`Confirmer : ${fmt(cost)} or`:`+ Onglet (${fmt(cost)} or)`}</button>`:''}</div>
    <div class="ipgrid">${stashGridHTML()}</div>
    ${sel?`<div class="ipdet"><button class="x" data-act="stDet" aria-label="Fermer les détails">×</button>${sel.o.mat?matCard(sel.o):itemCard(sel.o)}<div class="row" style="margin-top:6px"><button class="btn sm pri" data-act="stTake" data-i="${T.bag.indexOf(sel)}">Récupérer dans l’inventaire</button></div></div>`:''}`;
  if(fresh&&UI.stPos){ w.style.left=(UI.stPos.x)/ZM+'px'; w.style.top=(UI.stPos.y)/ZM+'px'; w.style.right='auto'; w.style.bottom='auto' }
  else if(false){ const ip=$('#invpop'); if(ip){ const r=ip.getBoundingClientRect(),wr=w.getBoundingClientRect(); let x=r.left,y=r.bottom+8; if(y+wr.height>innerHeight-4){ x=r.right+8; y=r.top; if(x+wr.width>innerWidth-4){ x=Math.max(4,innerWidth-wr.width-4); y=Math.max(4,innerHeight-wr.height-4) } } w.style.left=(x)/ZM+'px'; w.style.top=(y)/ZM+'px'; w.style.right='auto' } }
  const ri=$('#stren'); if(ri&&document.activeElement!==ri){ ri.focus(); ri.select() }
}
function stRenDone(save2){ const ri=$('#stren'); if(ri&&save2){ const v=ri.value.trim().slice(0,16); if(v) stashTab().n=v; saveAcc() } UI.stRen=false; renderStashPop() }
let STD=null;
document.addEventListener('pointerdown',e=>{ const hd=e.target.closest&&e.target.closest('[data-stdrag]'); if(!hd||e.target.closest('button')||innerWidth<=700) return; const w=$('#stashpop'),r=w.getBoundingClientRect(); STD={dx:e.clientX-r.left,dy:e.clientY-r.top}; w.classList.add('mov'); e.preventDefault() });
document.addEventListener('pointermove',e=>{ if(!STD) return; const w=$('#stashpop'); if(!w){STD=null;return} w.style.left=((e.clientX-STD.dx))/ZM+'px'; w.style.top=((e.clientY-STD.dy))/ZM+'px'; w.style.bottom='auto'; w.style.right='auto' });
document.addEventListener('pointerup',()=>{ if(!STD) return; STD=null; const w=$('#stashpop'); if(w){ w.classList.remove('mov'); const r=w.getBoundingClientRect(),x=clamp(r.left,4,Math.max(4,innerWidth-r.width-4)),y=clamp(r.top,4,Math.max(4,innerHeight-60)); w.style.left=(x)/ZM+'px'; w.style.top=(y)/ZM+'px'; UI.stPos={x,y} } });
document.addEventListener('keydown',e=>{ if(e.target.id==='stren'){ if(e.key==='Enter'){e.preventDefault();stRenDone(true)} else if(e.key==='Escape'){e.preventDefault();stRenDone(false)} } });
document.addEventListener('focusout',e=>{ if(e.target.id==='stren') setTimeout(()=>{ if(UI.stRen) stRenDone(true) },0) });
document.addEventListener('dblclick',e=>{ const t=e.target.closest&&e.target.closest('.sttab.on'); if(t){ UI.stRen=true; renderStashPop() } });
/* comparaison d’équipement (Maj) */
function cmpHTML(it){
  const h=S.heroes[0]; if(!h||!it||it.mat) return '';
  const sl=it.slot==='ring'?(UI.ringCmp||'ring'):it.slot,eq=h.equip[sl]; if(eq===it) return '';
  const a=itemStats(it),b=eq?itemStats(eq):{},keys=[...new Set([...Object.keys(a),...Object.keys(b)])];
  const rows=keys.map(k=>{const d=(a[k]||0)-(b[k]||0); if(Math.abs(d)<.05) return ''; const pc=PCT.has(k),v=pc?r1(Math.abs(d))+' %':Math.round(Math.abs(d)); return `<li class="${d>0?'up':'dn'}">${d>0?'▲ +':'▼ −'}${v} ${STAT_N[k]||k}</li>`}).join('')||'<li>Aucune différence.</li>';
  const pw=swapDelta(h,it);
  return `<div class="cmp"><div class="cmpc"><div class="cmph">Objet survolé</div>${itemCard(it,'',pw)}</div><div class="cmpc"><div class="cmph">Équipé${it.slot==='ring'?` · ${SLOT_N[sl]} <kbd>Ctrl</kbd>`:''}</div>${eq?itemCard(eq):'<article class="it" style="--rc:var(--line)"><header><b>Emplacement vide</b></header></article>'}</div>
    <div class="cmpd"><h5>Différence</h5><ul>${rows}</ul>${it.cls&&!canWear(it)?'<p class="lockr">Ne peut pas être porté par votre classe.</p>':''}</div></div>`;
}
function bagBlock(){
  if(UI.invOpen) return `<div class="row between" style="margin:18px 0 10px"><h2>Inventaire</h2></div><p class="hint">L’inventaire est ouvert dans sa fenêtre : glissez vos objets depuis celle-ci.</p>${forgeDetail()}`;
  const mats=MATS.map(m=>`<span class="rs2" title="${MAT_OBJ[m]}">${matIcon(m)}<b class="num">${fmt(matCount(m))}</b></span>`).join('');
  return `<div class="row between" style="margin:18px 0 10px"><h2>Inventaire</h2><small class="num">${BAG-freeCells()} / ${BAG} cases · ${freeCells()} libre${freeCells()>1?'s':''}</small></div>
    ${gridHTML()}${forgeDetail()}`;
}
Object.assign(UIC,{
 spark:'<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path d="M18.5 15.5l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8z"/><path d="M5 16l.6 1.4L7 18l-1.4.6L5 20l-.6-1.4L3 18l1.4-.6z"/>',
 flask:'<path d="M9 3h6M10 3v6l-5.5 9.5A1.7 1.7 0 0 0 6 21h12a1.7 1.7 0 0 0 1.5-2.5L14 9V3"/><path d="M7.5 15h9"/>',
 rune:'<path d="M12 2l8 5v10l-8 5-8-5V7z"/><path d="M12 7v10M9 9.5l3 2.5 3-2.5"/>',
 hammer:'<path d="M14 4l6 6-2.5 2.5-6-6z"/><path d="M12.5 8.5L4 17l3 3 8.5-8.5"/>',
 recycle:'<path d="M7 7l2.5-4h5L17 7"/><path d="M19.5 12l2 4-2.5 4h-5"/><path d="M9.5 20h-5L2 16l2.5-4"/><path d="M15 4l2 3-3.5.5M21 17l-2.5 3-1.5-3.2M5 19.5 4.5 16l3.4.7"/>',
 plus:'<path d="M12 5v14M5 12h14"/>',
});
const WORKSHOPS=[['forge','anvil','Forge','Créer, renforcer et recycler l’équipement.'],['ench','spark','Enchantement'],['alch','flask','Alchimie'],['rune','rune','Runomancie']];
const SOON='Arrive dans une prochaine mise à jour';
const FSUB=[['up','plus','Renforcer'],['salv','recycle','Recycler']];
function forgeCreate(){
  const h=S.heroes[0],t=TIERS[UI.fTier],pr=prismOn(),odds=pr?PRISM.odds:t.odds,lv=pr?PRISM.lv:t.lv,tot=odds.reduce((a,b)=>a+b,0),tc=forgeCost(),fb=baseFor(UI.fSlot,h.cls),np=matAll('prisme');
  const fit=canFit(...SIZE({slot:UI.fSlot}));
  const slots=ITEM_SLOTS.map(sl=>{const b=baseFor(sl,h.cls);return `<button class="maslot ${UI.fSlot===sl?'on':''}" data-act="forgeSlot" data-s="${sl}" aria-pressed="${UI.fSlot===sl}">${icon(itemIcon({slot:sl,base:b.n}))}<small>${b.n}</small></button>`}).join('');
  const oddsH=odds.map((v,j)=>v?`<div class="maodd"><span style="color:var(--r${j})">${RAR[j].n}</span><i><b style="width:${v/tot*100}%;background:var(--r${j})"></b></i><em class="num">${r1(v/tot*100)} %</em></div>`:'').join('');
  return `<div class="mawork">
   <div class="maslots" role="group" aria-label="Type d’objet">${slots}<small class="mute maslh">Équipement de ${CLASSES[h.cls].n}</small></div>
   <div class="maanvil"><div class="matier"><button class="arw" data-act="forgeTierStep" data-d="-1" aria-label="Forge précédente">‹</button><span><b>${t.n}</b><small>Niveau d’objet ${lv[0]===lv[1]?lv[0]:`${lv[0]} à ${lv[1]}`}</small></span><button class="arw" data-act="forgeTierStep" data-d="1" aria-label="Forge suivante">›</button></div>
    <div class="madots" aria-hidden="true">${TIERS.map((_,i)=>`<i class="${i===UI.fTier?'on':''}"></i>`).join('')}</div>
    <div class="aring maring ${pr?'full':''}" ${pr?'style="--rc:var(--r5)"':''}>${icon(itemIcon({slot:UI.fSlot,base:fb.n}))}</div>
    <b class="manm">${fb.n}</b><small>${fb.imp.length?fb.imp.map(([s])=>STAT_N[s]).join(' + ')+' fixe + affixes aléatoires':'Uniquement des affixes aléatoires'}</small>
    ${UI.fTier===3?`<label class="prism ${pr?'on':''}"><input type="checkbox" data-act="fPrism" ${pr?'checked':''} ${np?'':'disabled'}> ${matIcon('prisme')} Ajouter un Prisme divin <small>(${np} en stock)</small></label>`:''}
    <button class="btn pri amgo" data-act="forgeDo" ${canPay(tc)&&fit?'':'disabled'}>${uic('hammer')} Forger</button>
    ${fit?`<small>${pr?'Le Prisme divin fixe le niveau d’objet à 60 et la rareté Divin.':'Niveau tiré au hasard dans la plage, quel que soit le niveau du héros.'}</small>`:`<span class="warnx">Pas assez de place dans l’inventaire (${SIZE({slot:UI.fSlot}).join('×')} cases).</span>`}</div>
   <aside class="aminfo maside"><div class="ambody"><h4>Chances de rareté</h4>${oddsH}<h4>Coût</h4>${costHTML(tc)}<h4>Dernière création</h4>${UI.fLast?itemCard(UI.fLast):'<p class="amnote mute">Votre création apparaîtra ici.</p>'}</div></aside></div>`;
}
function forgeUp0(){
  const h=S.heroes[0],found=UI.fItem?findItem(UI.fItem):null,it=found&&found.it;
  const box=`<div id="fslot" class="aring maring ${it?'full':'empty'}" ${it?`style="--rc:var(--r${it.rarity})" data-tip="f:${it.id}"`:''}>${it?eqIco(it)+(it.up?`<em>+${it.up}</em>`:''):'<span>Déposez un objet ici</span>'}</div>`;
  let acts=`<p class="amnote">Glissez un objet du sac sur l’enclume, faites un clic droit dessus, ou cliquez sur un emplacement de la roue d’équipement.</p><button class="btn" data-act="invOpen">${uic('bag')} Ouvrir le sac <kbd>I</kbd></button>`;
  if(it){
    const uc=upCost(it),rc=rerollCost(it),pc=replCost(it),mx=it.up>=10;
    acts=`<div class="maact"><span class="maai">${uic('plus')}</span><div><b>Améliorer ${mx?'<span class="num">+10 (max)</span>':`<span class="num">+${it.up} → +${it.up+1}</span>`}</b><small>+3 % à toutes les stats, jusqu’à +10.</small>${mx?'':costHTML(uc)}</div><button class="btn pri sm" data-act="upItem" ${mx||!canPay(uc)?'disabled':''}>${mx?'Max':'Améliorer'}</button></div>
     <div class="maact"><span class="maai">${uic('spark')}</span><div><b>Relancer les valeurs</b><small>Nouvelles valeurs, mêmes types de stats.</small>${costHTML(rc)}</div><button class="btn sm" data-act="rerollVals" ${canPay(rc)?'':'disabled'}>Relancer</button></div>
     <div class="maact col"><div class="mah"><span class="maai">${uic('recycle')}</span><div><b>Remplacer une affixe</b><small>Échange l’affixe choisie contre une autre au hasard.</small>${costHTML(pc)}</div></div><div class="maaff">${it.aff.map((a,i)=>`<button class="btn sm" data-act="replAff" data-i="${i}" ${canPay(pc)?'':'disabled'}>${fmtStat(a.s,a.v*upMul(it))}</button>`).join('')}</div></div>`;
  }
  return `<div class="mawork up">
   <div class="mawheel">${runeDollHTML(h,true)}<small class="mute">Cliquez ou glissez un emplacement vers l’enclume.</small></div>
   <div class="maanvil ${it?'':'maempty'}">${box}${it?`${itemCard(it)}<small>${found.where==='eq'?'Objet porté · ':''}Glissez l’objet hors de l’enclume pour le retirer.</small><button class="btn sm" data-act="fClear">Retirer de l’enclume</button>`:'<small>Aucun objet sur l’enclume.</small>'}</div>
   <aside class="aminfo maside"><div class="ambody">${acts}</div></aside></div>`;
}
function forgeSalv(){
  const items=invItems();
  const cards=[0,1,2].map(r=>{const L=items.filter(i=>i.rarity<=r),tot={};L.forEach(i=>{for(const [k,x] of Object.entries(salvageValue(i)))tot[k]=(tot[k]||0)+x});const cf=UI.confirm==='salv'+r;
    return `<div class="masalv"><b>Jusqu’à <span style="color:var(--r${r})">${RAR[r].n.toLowerCase()}</span></b><small>${L.length} objet${L.length>1?'s':''} du sac</small><div class="mprew">${L.length?resChips(tot):'<span class="mute">rien à récupérer</span>'}</div><button class="btn sm ${cf?'danger':''}" data-act="salvBelow" data-r="${r}" ${L.length?'':'disabled'}>${cf?`Confirmer (${L.length})`:'Recycler'}</button></div>`}).join('')+`<div class="masalv man ${UI.anvil?'on':''}"><b>Recyclage manuel</b><small>Un objet à la fois</small><div class="mprew"><span class="mute">${UI.anvil?'Cliquez sur un objet du sac pour le recycler. Clic droit ou Échap pour arrêter.':'La souris devient une enclume : chaque objet du sac cliqué est recyclé.'}</span></div><button class="btn sm ${UI.anvil?'danger':''}" data-act="anvil" aria-pressed="${!!UI.anvil}" ${ttip(UI.anvil?'Arrêter le recyclage manuel':'Recycler manuellement','Chaque objet d’équipement cliqué dans le sac est détruit et rend 25 % de ses ressources.')}>${uic('anvil')} ${UI.anvil?'Arrêter':'Recycler manuellement'}</button></div>`;
  return `<div class="mawork salv"><div class="maanvil masalvs"><div class="matier"><span><b>Recyclage</b><small>Détruisez les objets du sac pour récupérer des ressources</small></span></div><div class="masalvg">${cards}</div></div>
   <aside class="aminfo maside"><div class="ambody"><h4>Fonctionnement</h4><p class="amnote">Chaque objet recyclé rend 25 % des ressources ayant servi à sa création.</p><p class="amnote">Les objets portés et ceux du coffre ne sont jamais touchés.</p><h4>Sac</h4><p class="amnote"><b class="num">${items.length}</b> objet${items.length>1?'s':''} d’équipement.</p><button class="btn" data-act="invOpen">${uic('bag')} Ouvrir le sac <kbd>I</kbd></button></div></aside></div>`;
}
function viewForge0(){
  if(!FSUB.some(([k])=>k===UI.fMode)) UI.fMode='forge';
  const ws=WORKSHOPS.map(([k,i,n,d],j)=>j?`<div class="mawt lock" aria-disabled="true" title="${SOON}"><span class="mawi">${uic(i)}</span><span><b>${n}</b><small>${SOON}</small></span>${uic('lock','malk')}</div>`
    :`<button class="mawt on" aria-current="true"><span class="mawi">${uic(i)}</span><span><b>${n}</b><small>${d}</small></span></button>`).join('');
  const sub=`<div class="masub" role="tablist" aria-label="Forge">${FSUB.map(([k,i,n])=>`<button role="tab" aria-selected="${UI.fMode===k}" class="${UI.fMode===k?'on':''}" data-act="fMode" data-m="${k}">${uic(i)}<span>${n}</span></button>`).join('')}${typeof recB!=='undefined'?recB:''}</div>`;
  return `<div class="ma1"><div class="mawts">${ws}</div><div class="mabody">${sub}${UI.fMode==='up'?forgeUp():UI.fMode==='salv'?forgeSalv():forgeCreate()}</div></div>`;
}

