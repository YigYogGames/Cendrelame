/* Cendrelame · systems/forge-creation.js */
/* --- forge --- */
function allItems(){
  const l=invItems().map(i=>({it:i,tag:'Inventaire'}));
  for(const h of S.heroes)for(const s of SLOTS) if(h.equip[s]) l.push({it:h.equip[s],tag:h.name});
  return l;
}
const upCost=it=>{const n=it.up+1;return {gold:Math.round(25*it.ilvl*Math.pow(n,1.25)),fer:4*n+Math.round(it.ilvl/2),cuir:2*n,cristal:n>=4?(n-3)*2:0,essence:n>=7?n-6:0,rune:n>=10?2:0}};
const rerollCost=it=>({cristal:3+Math.round(it.ilvl/8)});
const replCost=it=>({essence:2+Math.round(it.ilvl/10),cristal:2+Math.round(it.ilvl/10)});
/* niveau d’objet forgé : tiré au hasard dans la plage du type de forge ; le coût se base sur le milieu de la plage */
const forgeLvl=()=>Math.round((TIERS[UI.fTier].lv[0]+TIERS[UI.fTier].lv[1])/2);
const rollForgeLvl=()=>ri(...TIERS[UI.fTier].lv);
/* Prisme divin : forge légendaire uniquement, objet niveau 60 de rareté Divin */
const PRISM={lv:[60,60],odds:[0,0,0,0,0,1]};
const prismOn=()=>UI.fTier===3&&UI.fPrism&&matAll('prisme')>0;
const forgeCost=()=>{const c=tierCost(UI.fTier,forgeLvl()); if(prismOn()) c.prisme=1; return c};
const tierCost=(i,l)=>Object.fromEntries(Object.entries(TIERS[i].cost).map(([k,v])=>[k,Math.max(1,Math.round(v*(1+l/30)*.25))]));
function detPanel(title,html,cls=''){
  return `<section class="panel det ${cls}" aria-live="polite"><button class="x" data-act="detClose" aria-label="Fermer les détails">×</button><h3>${title}</h3>${html}</section>`;
}
function forgeDetail(){
  const si=UI.bagSel?entryOf(UI.bagSel):-1,c=si>=0?UI.bagSel:null; if(!c||UI.multi) return '';
  if(c.mat) return detPanel('Détails',matCard(c,`<button class="btn sm" data-act="bagSplit" data-i="${si}" ${c.n<2||!freeCells()?'disabled':''}>Diviser la pile</button>`));
  const h=S.heroes[0],btns=`<button class="btn sm pri" data-act="fPut" data-id="${c.id}">Améliorer</button>${canWear(c)?`<button class="btn sm" data-act="equip" data-id="${c.id}">Équiper</button>`:''}`;
  return detPanel('Détails',itemCard(c,btns,swapDelta(h,c)));
}
const invAllowed=()=>!!(S&&S.heroes&&S.heroes.length&&!UI.scr);
const eqLock=()=>{ const l=inFight()||!!(PV.match&&['fight','prep'].includes(PV.match.state))||!!(RD.match&&['fight','prep'].includes(RD.match.state)); if(l) toast('Impossible de changer d’équipement pendant un combat.'); return l };
function openInv(v){
  if(v&&!invAllowed()){ if(S&&!UI.scr) toast('L’inventaire n’est pas disponible pendant un combat.'); return }
  UI.invOpen=!!v; if(v) S.bagDot=false; if(!v){ UI.invHL=null; UI.bagSel=null; UI.invSel=null; UI.multi=false; UI.confirm=null }
  const y=scrollY; render(); scrollTo(0,y);
}
function renderInvPop(){ const keep=scrollKeep(); renderInvPop1(); if(keep.length) scrollBack(keep); reTipInv() }
function renderInvPop1(){
  let w=$('#invpop');
  if(!UI.invOpen||!invAllowed()){ if(w) w.remove(); if(UI.invOpen&&S&&S.heroes&&S.heroes.length&&!UI.scr) UI.invOpen=false; renderStashPop(); return }
  const fresh=!w;
  if(!w){ w=document.createElement('div'); w.id='invpop'; w.className='invpop'; w.setAttribute('role','dialog'); w.setAttribute('aria-label','Inventaire'); document.body.append(w) }
  const P=bagParts(),so=UI.bagSort;
  w.innerHTML=`<div class="iphead" data-ipdrag><span class="ipt">${icon('chest')}<b>Inventaire</b></span><small class="num ipcnt">${P.used} / ${BAG}</small><span class="ipg"></span><button class="ipx" data-act="invClose" aria-label="Fermer l’inventaire" title="Fermer (I)">×</button></div>
    ${invTopHTML()}<div class="iptools">${sortBtn('bag')}<span class="mute">Trier${so.k?' : '+({type:'type',name:'nom',qty:'quantité'})[so.k]:''}</span><button class="tib cb first ${UI.cbInv?'on':''}" data-act="cbToggle" aria-pressed="${!!UI.cbInv}" ${ttip('Sac de combat','Choisissez les potions emportées en combat (quantités limitées).')}>${uic('flask')}</button><button class="tib ${UI.stashOpen?'on':''}" data-act="stToggle" aria-pressed="${!!UI.stashOpen}" ${ttip(UI.stashOpen?'Fermer le coffre':'Ouvrir le coffre','Coffre du compte, partagé par tous vos personnages.')}>${uic('coffre')}</button><button class="tib ${UI.pchInv?'on':''}" data-act="pchToggle" aria-pressed="${!!UI.pchInv}" ${ttip('Sacoches','Objets rangés hors du sac : artisanat, potions et Compagnon (Maroquinier).')}>${uic('bag')}</button><button class="tibmv" data-act="craftDep" ${bagCraftN()?'':'disabled'} ${ttip('Tout déposer au coffre','Range tous les objets d’artisanat de l’inventaire dans l’onglet ouvert du coffre.')}>${MV_IC.dep}</button></div>
    ${UI.multi?multiBar():''}<div class="ipgrid ${GH>5?'rx':''}">${gridHTML()}</div>${UI.cbInv?cbPanel():''}${UI.pchInv?pouchPanel():''}<div class="ipres" id="ipres">${goldRow()}</div>
    ${P.detail&&!UI.multi?`<div class="ipdet"><button class="x" data-act="detClose" aria-label="Fermer les détails">×</button>${P.detail}</div>`:''}`;
  if(fresh&&UI.invPos){ w.style.left=(UI.invPos.x)/ZM+'px'; w.style.top=(UI.invPos.y)/ZM+'px'; w.style.right='auto'; w.style.bottom='auto' }
  if(UI.invPos) ipClamp(w);
  renderStashPop();
}
function ipClamp(w){ if(innerWidth<=700) return; const r=w.getBoundingClientRect(),x=clamp(r.left,4,Math.max(4,innerWidth-r.width-4)),y=clamp(r.top,4,Math.max(4,innerHeight-60)); w.style.left=(x)/ZM+'px'; w.style.top=(y)/ZM+'px'; w.style.right='auto'; UI.invPos={x,y} }
let IPD=null,ZTOP=61;
document.addEventListener('pointerdown',e=>{ const w=e.target.closest&&e.target.closest('#invpop,#stashpop'); if(w&&+(w.style.zIndex||0)<ZTOP){ w.style.zIndex=++ZTOP } },true);
document.addEventListener('pointerdown',e=>{ const hd=e.target.closest&&e.target.closest('[data-ipdrag]'); if(!hd||e.target.closest('button')||innerWidth<=700) return; const w=$('#invpop'),r=w.getBoundingClientRect(); IPD={dx:e.clientX-r.left,dy:e.clientY-r.top}; w.classList.add('mov'); e.preventDefault() });
document.addEventListener('pointermove',e=>{ if(!IPD) return; const w=$('#invpop'); if(!w){IPD=null;return} w.style.left=((e.clientX-IPD.dx))/ZM+'px'; w.style.top=((e.clientY-IPD.dy))/ZM+'px'; w.style.bottom='auto'; w.style.right='auto' });
document.addEventListener('pointerup',()=>{ if(!IPD) return; IPD=null; const w=$('#invpop'); if(w){ w.classList.remove('mov'); ipClamp(w) } });
document.addEventListener('keydown',e=>{
  if(e.target.closest&&e.target.closest('input,textarea,select,[contenteditable]')) return;
  if((e.key==='i'||e.key==='I')&&!e.ctrlKey&&!e.metaKey&&!e.altKey){ if(!S||!S.heroes||!S.heroes.length||UI.scr) return; e.preventDefault(); openInv(!UI.invOpen) }
  else if(e.key==='Escape'&&UI.invOpen&&!$('.modal')) openInv(false);
});

