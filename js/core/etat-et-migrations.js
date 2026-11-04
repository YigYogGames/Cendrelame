/* Cendrelame · core/etat-et-migrations.js */
/* ============ état ============ */
let S=null;
const UI={tab:'combat',zone:0,stage:1,invHero:null,invSlot:'all',hero:null,recruit:false,cc:'guerrier',chue:8,cname:'',
  invSel:null,multi:false,pick:new Set(),fItem:null,fMode:'up',fBase:null,fSlot:'weapon',fLvl:1,fTier:0,fLast:null,confirm:null,bagSel:null,bagSort:{k:null,dir:1},stSort:{k:null,dir:1},srt:null};
const C={phase:'idle',units:[],round:0,turn:null,pending:null,waiting:null,logs:[],result:null,abort:false,id:0,zone:0,stage:1};

/* ---- inventaire (48 cases) : null | {mat,n} | objet ---- */
const bagNew=()=>[];
/* S.bag = liste d'entrées {x,y,o} ; o = {mat,n} ou objet d'équipement */
function occGrid(bag,skip,W=GW,H=GH){
  const g=Array.from({length:H},()=>Array(W).fill(-1));
  bag.forEach((e,i)=>{ if(skip&&skip.includes(e)) return; const [w,h]=SIZE(e.o);
    for(let y=e.y;y<e.y+h&&y<H;y++) for(let x=e.x;x<e.x+w&&x<W;x++) g[y][x]=i });
  return g;
}
function fitsAt(bag,x,y,w,h,skip,W=GW,H=GH){
  if(x<0||y<0||x+w>W||y+h>H) return false;
  const g=occGrid(bag,skip,W,H);
  for(let yy=y;yy<y+h;yy++) for(let xx=x;xx<x+w;xx++) if(g[yy][xx]>=0) return false;
  return true;
}
function findSpot(bag,w,h,W=GW,H=GH){
  const g=occGrid(bag,null,W,H);
  for(let x=0;x<=W-w;x++) for(let y=0;y<=H-h;y++){
    let ok=true; for(let yy=y;yy<y+h&&ok;yy++) for(let xx=x;xx<x+w;xx++) if(g[yy][xx]>=0){ok=false;break}
    if(ok) return [x,y];
  }
  return null;
}
function bagAddMat(bag,k,n){
  if(HARV.includes(k)) return 0;
  n=Math.max(0,Math.floor(n||0)); if(S&&bag===S.bag&&typeof pouchPut==='function') n=pouchPut(k,n);
  for(const e of bag){ if(n<=0) break; const c=e.o; if(c.mat===k&&c.n<STACK){const m=Math.min(STACK-c.n,n);c.n+=m;n-=m} }
  while(n>0){ const sp=findSpot(bag,1,1); if(!sp) break; const m=Math.min(STACK,n); bag.push({x:sp[0],y:sp[1],o:{mat:k,n:m}}); n-=m }
  return n;
}
function bagAddItem(bag,it){if(it&&it.slot&&!it.hp3) hp3Walk(it); if(it&&it.slot&&!it.r82) r82Item(it); if(it&&it.slot&&typeof lpFix==='function') lpFix(it); if(it&&it.slot&&typeof sfItem==='function') sfItem(it);const sp=findSpot(bag,...SIZE(it)); if(!sp) return false; bag.push({x:sp[0],y:sp[1],o:it}); return true}
const sellValue=it=>Math.round((5+it.ilvl*2)*(it.rarity+1)*(1+(it.up||0)*.25));
let MIG_MSG='';
function migrate(d){
  if(Array.isArray(d.bag)){
    const isNew=d.bag.length&&d.bag.every(e=>e&&e.o&&typeof e.x==='number');
    if(!isNew){
      const objs=d.bag.map(e=>e&&e.o?e.o:e).filter(Boolean),nb=[]; let gold=0,sold=0;
      const items=objs.filter(o=>!o.mat).sort((a,b)=>{const A=SIZE(a),B=SIZE(b);return B[0]*B[1]-A[0]*A[1]||b.rarity-a.rarity});
      for(const it of items) if(!bagAddItem(nb,it)){gold+=sellValue(it);sold++}
      const tot={}; for(const o of objs) if(o.mat) tot[o.mat]=(tot[o.mat]||0)+o.n;
      for(const [k,n] of Object.entries(tot)) bagAddMat(nb,k,n);
      d.bag=nb; d.gold=(d.gold||0)+gold;
      if(objs.length) MIG_MSG='Nouvel inventaire : les objets occupent maintenant plusieurs cases.'+(sold?` ${sold} objet${sold>1?'s':''} sans place vendu${sold>1?'s':''} pour ${fmt(gold)} or.`:'');
    }else d.bag=d.bag.filter(e=>e.x>=0&&e.y>=0);
  }else{
    const bag=bagNew(),mats=d.mats||{}; let lost=0,gold=0;
    for(const k of MATS) lost+=bagAddMat(bag,k,mats[k]||0);
    const items=(d.inv||[]).slice().sort((a,b)=>b.rarity-a.rarity||b.ilvl-a.ilvl);
    let sold=0; for(const it of items) if(!bagAddItem(bag,it)){gold+=sellValue(it);sold++}
    d.gold=(d.gold||0)+gold; d.bag=bag;
    if(d.mats||d.inv) MIG_MSG='Vos matériaux et objets sont maintenant dans l’onglet Inventaire.'+(sold?` ${sold} objet${sold>1?'s':''} en trop vendu${sold>1?'s':''} pour ${fmt(gold)} or.`:'');
  }
  const keepM=(d.v||1)>=7?d.mats:null; delete d.mats; delete d.inv; if(keepM) d.mats=keepM;
  if((d.v||1)<3) v3(d);
  if((d.v||1)<4) v4(d);
  if((d.v||1)<6) v6(d);
  if((d.v||1)<7) v7(d);
  d.v=7; return d;
}
/* v7 : les matériaux sortent de l’inventaire et sont stockés à part (max 10 000 chacun) */
function v7(d){
  d.mats={}; const keep=[];
  for(const e of d.bag||[]){ const o=e&&e.o; if(o&&o.mat&&MATS.includes(o.mat)) d.mats[o.mat]=Math.min(MATCAP,(d.mats[o.mat]||0)+o.n); else keep.push(e) }
  d.bag=keep;
}
/* v6 : plus d’Intelligence pour le Guerrier ni de Force pour le Sorcier (bijoux compris) */
function v6(d){
  const h=(d.heroes||[])[0]; if(!h) return; const cls=h.cls;
  const conv=it=>{ if(!it||it.mat||!it.aff) return; const pool=affPool(it.cls||cls),m=RAR[it.rarity].m;
    it.aff=it.aff.map(a=>pool.some(x=>x.s===a.s)?a:(n=>n?{s:n.s,v:rollAff(n,it.ilvl,m)}:null)(pick(pool.filter(x=>!it.aff.some(y=>y.s===x.s))))).filter(Boolean) };
  (d.bag||[]).forEach(e=>conv(e&&e.o?e.o:e)); Object.values(h.equip||{}).forEach(conv);
}
/* v4 : plus de butin d’équipement, l’affixe « Butin trouvé » est remplacé */
function v4(d){
  const conv=it=>{ if(!it||it.mat||!it.aff) return; const m=RAR[it.rarity].m;
    it.aff=it.aff.map(a=>{ if(a.s!=='dropRate') return a; const n=pick(affPool(it.cls).filter(x=>!it.aff.some(y=>y.s===x.s))); return n?{s:n.s,v:rollAff(n,it.ilvl,m)}:null }).filter(Boolean);
    if(/ de Fortune$/.test(it.name)) it.name=it.name.replace(/ de Fortune$/,'');
  };
  (d.bag||[]).forEach(e=>conv(e&&e.o?e.o:e)); for(const h of d.heroes||[]) Object.values(h.equip||{}).forEach(conv);
  for(const k of Object.keys(d.sites||{})) if(d.sites[k]) delete d.sites[k].cache;
}
/* passage au système de classes : Guerrier / Sorcier, objets réservés, Force / Intelligence */
function v3(d){
  const MAPB={'Épée':'Épée','Dague':'Épée','Bâton':'Bâton','Sceptre':'Bâton','Heaume':'Heaume','Couronne':'Heaume','Capuche':'Capuche','Cuirasse':'Cuirasse','Cuir clouté':'Cuirasse','Robe':'Robe','Bottes':'Bottes','Sandales':'Sandales'};
  const conv=it=>{
    if(!it||it.mat) return it;
    const old=it.base||'',nb=it.slot==='ring'?'Anneau':it.slot==='amulet'?'Amulette':(MAPB[old]||BASES.find(b=>b.slot===it.slot).n);
    const base=BASES.find(b=>b.n===nb),m=RAR[it.rarity].m,imp={};
    for(const [s,b,p] of base.imp){const v=(b+p*it.ilvl)*m; imp[s]=PCT.has(s)?Math.max(.5,r1(v)):Math.max(1,Math.round(v))}
    const suffix=old&&it.name.startsWith(old)?it.name.slice(old.length):'';
    Object.assign(it,{base:nb,name:nb+suffix,cls:base.cls||null,imp});
    const pool=affPool(it.cls),ok=s=>pool.some(a=>a.s===s),aff=[];
    for(const a of it.aff||[]){
      if(ok(a.s)&&!aff.some(x=>x.s===a.s)){aff.push(a);continue}
      const n=pick(pool.filter(x=>!aff.some(y=>y.s===x.s)&&!(it.aff||[]).some(y=>y.s===x.s&&ok(y.s)))); if(n) aff.push({s:n.s,v:rollAff(n,it.ilvl,m)});
    }
    it.aff=aff; return it;
  };
  (d.bag||[]).forEach(e=>conv(e&&e.o?e.o:e));
  let changed=false;
  for(const h of d.heroes||[]){
    const nc=h.cls==='voleur'?'guerrier':h.cls==='clerc'?'mage':h.cls;
    if(nc!==h.cls){
      changed=true; h.cls=nc; h.learned={}; h.loadout=[]; h.sp=spCap(h.lvl);
      const first=CLASSES[nc].skills.find(x=>x.t==='a'&&x.lvl===1); h.learned[first.id]=1; h.loadout=[first.id];
    }
    for(const sl of Object.keys(h.equip||{})){
      const it=conv(h.equip[sl]); if(!it) continue;
      if(it.cls&&it.cls!==h.cls){ delete h.equip[sl]; if(!bagAddItem(d.bag,it)) d.gold=(d.gold||0)+sellValue(it) }
    }
  }
  MIG_MSG=(MIG_MSG?MIG_MSG+' ':'')+'Équipement converti au nouveau système de classes.'+(changed?' Votre héros a changé de classe : ses points de compétence sont remboursés.':'');
}
function newGame(){
  const bag=bagNew(),mats={};bagAddMat(bag,'fer',15);bagAddMat(bag,'cuir',8);
  return {v:7,siteV:3,balV:2,skV:1,uid:0,heroes:[],party:[],bag,mats,gold:80,
    sites:Object.fromEntries(SITES.map(s=>[s.id,{lvl:s.unlock===0?1:0,stock:{},cache:0}])),
    prog:{zone:0,stage:1},auto:false,farm:false,speed:1,last:Date.now(),kills:0};
}
function soloize(d){
  if(!d.heroes||d.heroes.length<=1){ if(d.heroes&&d.heroes[0]) d.party=[d.heroes[0].id]; return d }
  const first=d.heroes[0];
  for(const h of d.heroes.slice(1)) for(const sl of Object.keys(h.equip||{})) if(h.equip[sl]) bagAddItem(d.bag,h.equip[sl]);
  d.heroes=[first]; d.party=[first.id]; return d;
}
function fitBag(d){ try{ stgSync() }catch(e){}
  if(!Array.isArray(d.bag)) return d;
  const out=d.bag.filter(e=>{const [w,h]=SIZE(e.o);return e.x+w>GW||e.y+h>GH});
  if(!out.length) return d;
  d.bag=d.bag.filter(e=>!out.includes(e)); let gold=0,sold=0;
  out.sort((a,b)=>{const A=SIZE(a.o),B=SIZE(b.o);return (b.o.mat?1:0)-(a.o.mat?1:0)||B[0]*B[1]-A[0]*A[1]});
  for(const e of out){
    if(e.o.mat){ const left=bagAddMat(d.bag,e.o.mat,e.o.n); continue }
    const [w,h]=SIZE(e.o),sp=findSpot(d.bag,w,h);
    if(sp) d.bag.push({x:sp[0],y:sp[1],o:e.o}); else {gold+=sellValue(e.o);sold++}
  }
  d.gold=(d.gold||0)+gold;
  MIG_MSG=(MIG_MSG?MIG_MSG+' ':'')+'Inventaire réduit à 14 × 5 cases : les objets ont été réorganisés.'+(sold?` ${sold} objet${sold>1?'s':''} sans place vendu${sold>1?'s':''} pour ${fmt(gold)} or.`:'');
  return d;
}
function hp3Walk(o,d){ if(!o||typeof o!=='object'||(d|0)>8) return; if(Array.isArray(o)){ for(const x of o) hp3Walk(x,(d|0)+1); return } if(o.slot&&Array.isArray(o.aff)){ if(!o.hp3){ for(const a of o.aff) if(a.s==='hp') a.v=Math.round(a.v*3); o.hp3=1 } return } for(const k in o) if(o[k]&&typeof o[k]==='object') hp3Walk(o[k],(d|0)+1) }
function accHp3(){ if(!ACC||ACC.hp3) return; hp3Walk(ACC); ACC.hp3=1 }
const loadData=d=>{if(!d.siteV)d.siteV=1; const r=soloize(fitBag(Object.assign(newGame(),{balV:0,skV:0},migrate(d)))); if((r.balV||0)<1){balMig(r); r.balV=1} if((r.balV||0)<2){impMig(r); r.balV=2} if((r.skV||0)<1){ for(const h of r.heroes||[]) resetSkills(h); r.skV=1; if((r.heroes||[]).length) MIG_MSG=(MIG_MSG?MIG_MSG+' ':'')+'Nouveau système de compétences et de spécialisations : vos points de compétence ont été remboursés.' } if(!r.hp3){ hp3Walk(r); r.hp3=1 } if(!r.r82){ r82Walk(r); r.r82=1 } if(!r.lp87){ lpWalk(r); r.lp87=1 } if(!r.sf88){ sfWalk(r); r.sf88=1 } if((r.skV||0)<3){ for(const h of r.heroes||[]) resetSkills(h); r.skV=3; if((r.heroes||[]).length) MIG_MSG=(MIG_MSG?MIG_MSG+' ':'')+'Refonte des classes : vos points de compétence et votre spécialisation sont remboursés. Choisissez vos nouveaux talents !' } if(false){ let ch=false; for(const h of r.heroes||[]){ const sp=Object.values(h.learned||{}).reduce((a,b)=>a+(b||0),0)-1; if(sp+(h.sp||0)>spCap(h.lvl)){ if(sp>spCap(h.lvl)){ resetSkills(h); ch=true } else h.sp=spCap(h.lvl)-sp } } r.skV=2; if(ch) MIG_MSG=(MIG_MSG?MIG_MSG+' ':'')+'Les points de compétence sont maintenant limités à '+SP_MAX+' : vos compétences ont été réinitialisées (points remboursés).' } return r};
/* rééquilibrage 0.3.0 : les affixes existants gardent leur qualité de tirage dans la nouvelle plage ; objets divins : 3 affixes au maximum, sans pouvoir */
const AFX_OLD={hp:[8,3.2],atk:[2,.9],mag:[2,.9],def:[2,.75],spd:[1,.12],hpPct:[2,.12],dmgPct:[2,.14],crit:[1.5,.08],critDmg:[6,.5],dodge:[1.2,.04],lifesteal:[.8,.025]};
function impMig(d){
  const conv=it=>{ if(!it||it.mat||!it.imp||!RAR[it.rarity]) return; const m=RAR[it.rarity].m,base=BASES.find(b=>b.n===it.base&&(b.cls||null)===(it.cls||null))||BASES.find(b=>b.n===it.base); if(!base) return;
    for(const [s2,b,p] of base.imp){const v=(b+p*it.ilvl)*m; it.imp[s2]=PCT.has(s2)?Math.max(.5,r1(v)):Math.max(1,Math.round(v))} };
  (d.bag||[]).forEach(e=>conv(e&&e.o)); for(const h of d.heroes||[]) Object.values(h.equip||{}).forEach(conv);
}
function balMig(d){
  const conv=it=>{ if(!it||it.mat||!it.aff||!RAR[it.rarity]) return; const m=RAR[it.rarity].m,div=it.rarity===5;
    const base=BASES.find(b=>b.n===it.base&&(b.cls||null)===(it.cls||null))||BASES.find(b=>b.n===it.base);
    if(base&&it.imp) for(const [s2,b,p] of base.imp){const v=(b+p*it.ilvl)*m; it.imp[s2]=PCT.has(s2)?Math.max(.5,r1(v)):Math.max(1,Math.round(v))}
    if(div){ delete it.leg; it.aff=it.aff.slice(0,3) }
    for(const a of it.aff){ const A=AFXM[a.s],O=AFX_OLD[a.s]; if(!A) continue;
      const nmax=(A.b+A.p*it.ilvl)*m; let q=div?1:O?a.v/((O[0]+O[1]*it.ilvl)*m):a.v/nmax; q=clamp(q,.7,1);
      a.v=PCT.has(a.s)?Math.max(.5,r1(nmax*q)):Math.max(1,Math.round(nmax*q)) } };
  (d.bag||[]).forEach(e=>conv(e&&e.o)); for(const h of d.heroes||[]) Object.values(h.equip||{}).forEach(conv);
}
/* compte : l’or est partagé, chaque personnage a sa propre sauvegarde */
const ACC_KEY=KP+'acc',CHAR_KEY=i=>KP+'c'+i,MAXCH=5;
let ACC={gold:80,cur:null,seenVer:null};
const lsGet=k=>{try{return localStorage.getItem(k)}catch(e){return null}};
const lsSet=(k,v)=>{try{localStorage.setItem(k,v)}catch(e){}};
const lsDel=k=>{try{localStorage.removeItem(k)}catch(e){}};
function saveAcc(){ACC.ts=Date.now(); lsSet(ACC_KEY,JSON.stringify(ACC)); cloudSoon()}
function save(){
  if(!S||!S.heroes||!S.heroes.length||ACC.cur==null) return;
  ACC.gold=S.gold; lsSet(CHAR_KEY(ACC.cur),JSON.stringify(S)); saveAcc(); trophyCheck(); pcUnlockSync(); chestFlush();
}
function loadAcc(){
  const raw=lsGet(ACC_KEY);
  if(raw){try{const a=JSON.parse(raw); if(a&&typeof a==='object'){ACC=Object.assign({gold:80,cur:null,seenVer:null},a);return}}catch(e){}}
  /* ancienne sauvegarde à un seul héros : elle devient le personnage 1 */
  const old=lsGet(SAVE_KEY);
  if(old){try{const d=JSON.parse(old); if(d&&Array.isArray(d.heroes)&&d.heroes.length){lsSet(CHAR_KEY(0),old); ACC={gold:d.gold||0,cur:0,seenVer:d.seenVer||null}}}catch(e){}}
  saveAcc();
}
function charRaw(i){const r=lsGet(CHAR_KEY(i)); if(!r) return null; try{const d=JSON.parse(r); return d&&Array.isArray(d.heroes)&&d.heroes.length?d:null}catch(e){return null}}
const charSum=i=>{const d=charRaw(i); if(!d) return null; const h=d.heroes[0]; return {name:h.name,cls:h.cls==='voleur'?'guerrier':h.cls==='clerc'?'mage':h.cls,lvl:Math.min(h.lvl||1,MAXL),stars:h.stars||0,hue:h.hue,skin:h.skin}};
function loadSave(){
  try{
    const raw=ACC.cur==null?null:lsGet(CHAR_KEY(ACC.cur)); if(!raw) return null;
    const d=JSON.parse(raw); if(!d||!Array.isArray(d.heroes)) return null;
    return loadData(d);
  }catch(e){return null}
}

