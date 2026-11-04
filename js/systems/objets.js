/* Cendrelame · systems/objets.js */
/* ============ objets ============ */
function rollAff(a,ilvl,m){
  const v=(a.b+a.p*ilvl)*m*(m>=RAR[5].m?1:rand(.7,1)); /* Divin : toujours au maximum de la plage */
  return PCT.has(a.s)?Math.max(.5,r1(v)):Math.max(1,Math.round(v));
}
function genItem(slot,ilvl,rarity,baseName,cls){
  cls=cls||(S&&S.heroes[0]&&S.heroes[0].cls);
  const base=baseName?BASES.find(b=>b.n===baseName):(baseFor(slot,cls)||pick(BASES.filter(b=>b.slot===slot)));
  const m=RAR[rarity].m, imp={};
  for(const [s,b,p] of base.imp){const v=(b+p*ilvl)*m; imp[s]=PCT.has(s)?Math.max(.5,r1(v)):Math.max(1,Math.round(v))}
  const ms=CLASSES[base.cls||cls]&&CLASSES[base.cls||cls].role==='mag'?'mag':'atk',s2=Math.random()<.6?'hp':'hpPct';
  const aff=[{s:s2,v:rollAff(AFXM[s2],ilvl,m),main:1},{s:ms,v:rollAff(AFXM[ms],ilvl,m),main:1}];
  let ep='';
  if(rarity>=3) ep=' '+pick(EPITHETS);
  else {const a=aff.find(x=>AFXM[x.s].ep); if(a) ep=' '+AFXM[a.s].ep}
  if((rarity===2||rarity===3)&&Math.random()<.12){ const n=pick(affPool(base.cls||cls).filter(x=>!aff.some(y=>y.s===x.s))); if(n) aff.push({s:n.s,v:rollAff(n,ilvl,m),bonus:1}) }
  const it={id:++S.uid,slot,base:base.n,cls:base.cls||null,ilvl,rarity,imp,aff,up:0,name:base.n+ep,v2:1,hp3:1,req:Math.min(ilvl,MAXL)};
  if(RAR[rarity].leg) it.leg=slot;
  return it;
}
const clsOk=it=>!it||!it.cls||!S.heroes[0]||it.cls===S.heroes[0].cls;
const itReq=it=>Math.min(MAXL,(it&&(it.req||it.ilvl))||0);
const lvlOk=(it,h)=>!it||!(h=h||S.heroes[0])||itReq(it)<=h.lvl;
const canWear=it=>clsOk(it)&&lvlOk(it);
const upMul=it=>1+.03*it.up;
const impOf=it=>it&&it.slot==='weapon'&&it.imp||{};
function itemStats(it){
  const k=upMul(it), r={};
  for(const [s,v] of Object.entries(impOf(it))) r[s]=(r[s]||0)+v*k;
  for(const a of it.aff) r[a.s]=(r[a.s]||0)+(a.s==='ap'?a.v:a.v*k);
  if(it.leg) for(const [k,v] of Object.entries(legStat82(it))) r[k]=(r[k]||0)+v;
  return r;
}
const invItems=()=>S.bag.filter(e=>!e.o.mat).map(e=>e.o);
const freeCells=()=>BAG-S.bag.reduce((a,e)=>{const [w,h]=SIZE(e.o);return a+w*h},0);
const cellOf=id=>S.bag.findIndex(e=>!e.o.mat&&e.o.id===id);
const entryOf=o=>S.bag.findIndex(e=>e.o===o);
const canFit=(w,h)=>!!findSpot(S.bag,w,h);
const MATCAP=1000;
/* stock max d’un matériau : 1 000 + Entrepôt des zones qui le produisent (+100 par rang, ×2 avec Grand entrepôt) */
function matCap(k){ let c=MATCAP; if(!S||!S.sites||typeof SITES==='undefined') return c;
  for(const si of SITES){ if(!(k in si.out)) continue; const st=S.sites[si.id]; if(!st||!st.tal) continue; c+=100*(st.tal.cap||0)*(st.tal.capX?2:1) }
  return c }
const isMatK=k=>false;
const matCount=k=>isMatK(k)?((S.mats&&S.mats[k])||0):S.bag.reduce((a,e)=>a+(e.o.mat===k?e.o.n:0),0)+(typeof pouchN==='function'?pouchN(k):0);
function storeMat(k,n){ return bagAddMat(S.bag,k,Math.max(0,Math.floor(n||0))) }
function storeMat0(k,n){ n=Math.max(0,Math.floor(n||0)); if(!S.mats) S.mats={}; const add=Math.min(n,matCap(k)-matCount(k)); S.mats[k]=matCount(k)+Math.max(0,add); return n-Math.max(0,add) }
const stashCount=k=>(ACC&&ACC.stash&&Array.isArray(ACC.stash.tabs))?ACC.stash.tabs.reduce((a,T)=>a+(T.bag||[]).reduce((b,e)=>b+(e.o.mat===k?e.o.n:0),0),0):0;
const matAll=k=>matCount(k)+stashCount(k);
function removeMat(k,n){
  { const own=matCount(k); if(n>own&&stashCount(k)>0){ let r=n-own; for(const T of ACC.stash.tabs){ for(const e of T.bag){ if(r<=0) break; if(e.o.mat===k){const m=Math.min(e.o.n,r); e.o.n-=m; r-=m} } T.bag=T.bag.filter(e=>!(e.o.mat&&e.o.n<=0)) } n=own; saveAcc() } }
  if(isMatK(k)){ S.mats[k]=Math.max(0,matCount(k)-n); return }
  const es=S.bag.filter(e=>e.o.mat===k).sort((a,b)=>a.o.n-b.o.n);
  for(const e of es){ if(n<=0) break; const m=Math.min(e.o.n,n); e.o.n-=m; n-=m }
  if(n>0&&typeof pouchTake==='function') n=pouchTake(k,n);
  S.bag=S.bag.filter(e=>!(e.o.mat&&e.o.n<=0));
}
const LOST={}; let lostT=0;
function noteLost(k,n){
  LOST[k]=(LOST[k]||0)+n;
  if(!lostT) lostT=setTimeout(()=>{toast('Stock plein (1 000) : '+Object.entries(LOST).map(([m,x])=>x+' '+MAT_N[m].toLowerCase()).join(', ')+' perdu(s).');for(const m in LOST)delete LOST[m];lostT=0},60);
}
function findItem(id){
  let it=invItems().find(i=>i.id===id); if(it) return {it,where:'inv'};
  for(const h of S.heroes)for(const s of SLOTS) if(h.equip[s]&&h.equip[s].id===id) return {it:h.equip[s],where:'eq',h};
  return null;
}
function rarityWeights(p){
  return [Math.max(5,60-45*p),30-5*Math.min(p,1.5),8+25*p,1.8+15*p,.2+5*p].map(x=>Math.max(.1,x));
}
let SHIFT=false,ALTK=false;
const NOHOVER=!!(window.matchMedia&&matchMedia('(hover:none)').matches);
/* plage possible d'un affixe (tirage 70 % à 100 %), amélioration comprise */
function affRange(it,a,k){
  const A=AFXM[a.s]; if(!A) return '';
  const base=(A.b+A.p*it.ilvl)*RAR[it.rarity].m*slotF(it,a.s),pc=PCT.has(a.s);
  const lo=pc?Math.max(.5,r1(base*.7)):Math.max(1,Math.round(base*.7)),hi=pc?Math.max(.5,r1(base)):Math.max(1,Math.round(base));
  const f=v=>pc?r1(v*k)+'%':Math.round(v*k);
  return `<span class="rng">(${f(lo)} – ${f(hi)})</span>`;
}
const affOrd=L=>L.slice().sort((a,b)=>((a.main?(a.s==='hp'||a.s==='hpPct'?0:1):2)-(b.main?(b.s==='hp'||b.s==='hpPct'?0:1):2)));
function itemCard(it,foot='',delta=null){
  const k=upMul(it);
  const lines=[...affOrd(it.aff).filter(a=>a.main).map(a=>`<li class="am">${fmtStat(a.s,a.v*k)}${ALTK||NOHOVER?affRange(it,a,k):''}</li>`),...Object.entries(impOf(it)).map(([s,v])=>`<li class="imp">${fmtStat(s,v*k)}</li>`),...affOrd(it.aff).filter(a=>!a.main).map(a=>`<li class="${a.main?'am':''}">${fmtStat(a.s,a.v*k)}${ALTK||NOHOVER?affRange(it,a,k):''}</li>`),...(it.leg?[`<li class="legp"><b>${esc(legN82(it))}</b> : ${legD82(it)}</li>`]:[])].join('')+(it.aff.length&&!NOHOVER?`<li class="shk">${ALTK?'Plages possibles des affixes (Alt)':'Alt : plages des affixes · Maj : comparer'}</li>`:'');
  const dl=delta===null?'':`<span class="dl ${delta>=0?'up':'dn'}">${delta>=0?'▲':'▼'} ${Math.abs(Math.round(delta))}</span>`;
  return `<article class="it" style="--rc:var(--r${it.rarity})"><header><b>${esc(it.name)}${it.up?` <em>+${it.up}</em>`:''}</b> ${dl}<small>${SLOT_N[it.slot]}${it.cls?` · <span style="${clsOk(it)?'':'color:var(--blood);font-weight:700'}">${CLASSES[it.cls].n}</span>`:''} · ${RAR[it.rarity].n}</small><small class="${lvlOk(it)?'':'reqno'}">Niveau requis <b class="num">${itReq(it)}</b></small><small>Niveau d’objet <b class="num">${it.ilvl}</b> · Affixes secondaires <b class="num">${secN(it)} / 3</b></small></header><ul>${lines}</ul>${foot?`<div class="foot">${foot}</div>`:''}</article>`;
}
/* coût de création : réel pour les objets forgés/travaillés, estimé sinon (forge équivalente à la rareté + améliorations) */
function estCost(it){
  const t=TIERS[[0,0,1,2,3,3][it.rarity]],c={};
  for(const [k,v] of Object.entries(t.cost)) c[k]=Math.max(1,Math.round(v*(1+it.ilvl/30)*.25));
  for(let u=0;u<(it.up||0);u++) for(const [k,v] of Object.entries(upCost({ilvl:it.ilvl,up:u}))) if(v) c[k]=(c[k]||0)+v;
  return c;
}
const itemCost=it=>it.cost||estCost(it);
function addCost(it,c){ if(!it.cost) it.cost=estCost(it); for(const [k,v] of Object.entries(c)) if(v) it.cost[k]=(it.cost[k]||0)+v }
function salvageValue(it){
  const v={}; for(const [k,x] of Object.entries(itemCost(it))){ if(HARV.includes(k)) continue; const n=Math.floor(x*.25); if(n>0) v[k]=n}
  v.pd_rune=(it.rarity||0)+1;
  return v;
}
const resTxt=v=>Object.entries(v).map(([k,n])=>fmt(n)+' '+MAT_N[k].toLowerCase()).join(', ')||'rien';
const resChips=v=>Object.entries(v).map(([k,n])=>matChip(k,n)).join('')||'<span class="mute">rien</span>';
function addInv(it){
  if(bagAddItem(S.bag,it)){markNew();return true}
  gain(salvageValue(it)); return false;
}
function markNew(){ if(UI.tab!=='heroes') S.bagDot=true }
function gain(c){for(const [k,v] of Object.entries(c)){ if(k==='gold')S.gold+=v; else if(isMatK(k)){const left=storeMat(k,v); if(left>0) noteLost(k,left)} else {const left=bagAddMat(S.bag,k,v); if(left>0) noteLost(k,left); if(Math.floor(v)-left>0) markNew()} }}
const DBG=()=>FB.admin?(ACC.dbg||(ACC.dbg={})):{};
const FREE=()=>!!DBG().free;
const hasGold=c=>FREE()||S.gold>=c;
const canPay=c=>FREE()||Object.entries(noHarv(c)).every(([k,v])=>(k==='gold'?S.gold:matAll(k))>=v);
function pay(c){if(FREE())return;for(const [k,v] of Object.entries(noHarv(c))){ if(k==='gold')S.gold-=v; else removeMat(k,v) }}
const costHTML=c=>`<span class="cost">${Object.entries(noHarv(c)).filter(([,v])=>v>0).map(([k,v])=>{const have=k==='gold'?S.gold:matAll(k);return `<span class="${have>=v?'ok':'no'}" title="${MAT_N[k]}">${matIcon(k)}${fmt(v)}<span class="sr">${MAT_N[k]}</span></span>`}).join('')}</span>`;

