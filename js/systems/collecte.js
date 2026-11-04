/* Cendrelame · systems/collecte.js */
/* ============ idle ============ */
const f=n=>n*(1+.12*(n-1));
/* arbre d’améliorations des zones de collecte */
const SITE_M={mine:1,bois:1.5,ruines:2.5,marais:4};
const TREE=[
  {k:'spd',n:'Cadence',ic:'⚙',d:'Vitesse : réduit le temps entre deux récoltes',per:r=>`+${5*r} % de vitesse`,max:10,cap:{k:'spdX',n:'Ouvriers infatigables',d:'+25 % de vitesse (récoltes plus rapprochées)'}},
  {k:'cap',n:'Entrepôt',ic:'▣',d:'Stock maximum des ressources de la zone',per:r=>`+${100*r} au stock maximum`,max:10,cap:{k:'capX',n:'Grand entrepôt',d:'Bonus de stock de l’Entrepôt ×2'}},
];
const MATX={fer:['Filon de fer','du fer'],gold:['Veine d’or','de l’or'],plante:['Clairière fertile','des herbes'],cuir:['Grand gibier','du cuir'],cristal:['Géode','des cristaux'],essence:['Source vive','de l’essence'],rune:['Glyphe ancien','des runes']};
const matBranch=m=>({k:'r_'+m,n:MAT_N[m],ic:matIcon(m),mat:m,d:`Quantité ${MATX[m][1]} par récolte`,per:r=>`+${15*r} % ${MATX[m][1]}`,max:10,cap:{k:'r_'+m+'X',n:MATX[m][0],d:`10 % de chances de doubler ${MATX[m][1]} d’une récolte`}});
const branchesFor=id=>{const si=SITES_ALL.find(x=>x.id===id); return [TREE[0],...Object.keys(si.out).map(matBranch),TREE[1]]};
const tal=st=>st.tal||(st.tal={});
const talCost=(id,k,r)=>/X$/.test(k)?Math.round((SITE_M[id]||1)*3000):Math.round((SITE_M[id]||1)*60*Math.pow(1.35,r));
const spdMul=st=>1+.05*(tal(st).spd||0)+(tal(st).spdX?.25:0);
const QTY_R=.15;
const qtyM=(st,m)=>1+QTY_R*(tal(st)['r_'+m]||0);
const CYCLE=300; /* une récolte toutes les 5 minutes */
const cycleDur=st=>CYCLE/spdMul(st)/(ACC.dbg&&ACC.dbg.fast?60:1);
const siteBatch=(si,st,m)=>(si.out[m]||0)*qtyM(st,m);
const siteRate=(si,st,m)=>siteBatch(si,st,m)/cycleDur(st); /* par seconde */
const mmss=t=>{t=Math.max(0,Math.ceil(t));return Math.floor(t/60)+':'+String(t%60).padStart(2,'0')};
const siteRes=st=>1; /* une récolte à la fois */
const siteCap=(si,st,m)=>siteRes(st)*siteBatch(si,st,m);
const siteUpCost=lvl=>Math.round(60*Math.pow(1.7,lvl-1));
const zoneLvl=st=>Object.entries(tal(st)).reduce((a,[k,v])=>a+(k==='auto'?0:(+v||0)),0);
const AUTO_L=25;
const autoOn=st=>!!(tal(st).auto&&st.auto!==false);
function produce(dt){
  for(const si of SITES){
    const st=S.sites[si.id]; if(!st||st.lvl<1) continue;
    const R=siteRes(st); st.ready=Math.min(st.ready||0,R);
    if(st.ready>=R){st.t=0;continue}
    const D=cycleDur(st); st.t=(st.t||0)+dt; const n=Math.min(Math.floor(st.t/D),R-st.ready); if(n<1) continue;
    st.ready+=n; st.t=st.ready>=R?0:st.t-n*D;
  }
}
const readyAny=()=>SITES.some(si=>{const st=S.sites[si.id];return st&&st.lvl>0&&(st.ready||0)>0&&!autoOn(st)});
function collectSite(id,quiet){
  const si=SITES.find(s=>s.id===id),st=S.sites[id],got={},items=[]; let lost=false;
  const n=st.ready||0,amt={}; if(n>0&&id==='mine') qEv('mine',n); ACC.cnt=ACC.cnt||{}; ACC.cnt.col=(ACC.cnt.col||0)+n;
  for(const m of Object.keys(si.out)){ let k=n; if(tal(st)['r_'+m+'X']) for(let i=0;i<n;i++) if(Math.random()<.1) k++; amt[m]=k*siteBatch(si,st,m) }
  for(const [m,v] of Object.entries(st.stock||{})) amt[m]=(amt[m]||0)+v; /* reste des anciennes versions */
  st.stock={};
  const frac=st.frac||(st.frac={});
  for(const [m,v0] of Object.entries(amt)){
    const v=v0+(frac[m]||0),g=Math.floor(v); frac[m]=v-g; if(g<=0) continue;
    const left=m==='gold'?0:storeMat(m,g); if(m==='gold') S.gold+=g;
    if(left) lost=true; if(g-left>0) got[m]=g-left;
  }
  st.ready=0;
  if(lost&&!quiet) setTimeout(()=>toast('Stock plein (1 000) : une partie de la récolte est perdue.'),50);
  return {got,items};
}
/* place restante pour un matériau dans l’inventaire */
const matRoom=k=>isMatK(k)?matCap(k)-matCount(k):freeCells()*STACK+S.bag.reduce((a,e)=>a+(e.o.mat===k?STACK-e.o.n:0),0)+(typeof pouchRoom==='function'?pouchRoom(k):0);
/* une récolte automatique attend mais tous ses matériaux sont pleins */
function collectBlocked(){
  for(const si of SITES){const st=S.sites[si.id]; if(!st||st.lvl<1||!(st.ready>0)||!autoOn(st)) continue;
    const ms=Object.keys(si.out).filter(m=>m!=='gold'); if(ms.length&&ms.every(m=>matRoom(m)===0)) return true}
  return false;
}
let lastBlocked=false,lastReady='';
function autoCollect(){
  const got={};
  for(const si of SITES){const st=S.sites[si.id]; if(!st||st.lvl<1||!(st.ready>0)||!autoOn(st)) continue;
    const ms=Object.keys(si.out).filter(m=>m!=='gold'); if(ms.length&&ms.every(m=>matRoom(m)===0)) continue;
    const r=collectSite(si.id,true); for(const [k,v] of Object.entries(r.got)) got[k]=(got[k]||0)+v;
  }
  if(Object.keys(got).length){ save(); renderHeader(); if(UI.tab==='heroes'||UI.tab==='forge') render(); else renderTabs();
    toast('Récolte automatique : '+Object.entries(got).map(([k,n])=>n+' '+MAT_N[k].toLowerCase()).join(', ')) }
}
function tick(){
  if(!S||!S.heroes.length||UI.scr) return;
  const now=Date.now(),dt=Math.max(0,(now-S.last)/1000); S.last=now;
  try{ compTick() }catch(e){}
  const b=collectBlocked(),rs=SITES.map(si=>(S.sites[si.id]||{}).ready||0).join();
  if(b!==lastBlocked||rs!==lastReady){lastBlocked=b; lastReady=rs; if(UI.tab==='sites'&&!UI.siteTree&&!UI.siteOpt) render(); else renderTabs()}
  if(UI.tab==='sites') liveSites();
}

