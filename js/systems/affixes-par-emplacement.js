/* Cendrelame · systems/affixes-par-emplacement.js */
/* ================= 0.8.8 : affixes selon l'emplacement, remodelage en butin ================= */
const SF_OFF=new Set(['atk','mag','crit','critDmg','dmgPct']),SF_DEF=new Set(['hp','hpPct','def']),SF_RES=new Set(['rPhys','rMag','rFeu','rGlace','rFoudre','rTerre']);
const SLOTF={jew:{off:1.5,def:.75,res:.75},arm:{off:.7,def:1.15,res:1.25},wpn:{off:1,def:1,res:1}};
const slotGrp=it=>{ const s=it&&it.slot; return s==='ring'||s==='ring2'||s==='amulet'?'jew':s==='weapon'?'wpn':'arm' };
const sfKind=s=>SF_OFF.has(s)?'off':SF_DEF.has(s)?'def':SF_RES.has(s)?'res':null;
function slotF(it,s){ const k=sfKind(s); return k?SLOTF[slotGrp(it)][k]:1 }
function sfItem(o){ if(!o||o.sf88||!o.slot||!Array.isArray(o.aff)) return; for(const a of o.aff){ if(a.s==='ap') continue; const f=slotF(o,a.s); if(f!==1) a.v=affRound(a.s,a.v*f) } o.sf88=1 }
function sfWalk(o,d){ if(!o||typeof o!=='object'||(d|0)>9) return; if(Array.isArray(o)){ for(const x of o) sfWalk(x,(d|0)+1); return } if(o.slot&&Array.isArray(o.aff)){ sfItem(o); return } for(const k in o) if(o[k]&&typeof o[k]==='object') sfWalk(o[k],(d|0)+1) }
function accSf88(){ if(!ACC||ACC.sf88) return; sfWalk(ACC.stash); ACC.sf88=1; try{ saveAcc() }catch(e){} }
const _genItem88=genItem; genItem=function(...a){ const it=_genItem88(...a); sfItem(it); return it };
/* ---------- Pierre de remodelage : boss et défis ---------- */
[.2,.3,.4,.6,.8].forEach((p,z)=>{ const L=ZLOOT[z].it,e=L.find(x=>x[0]==='rm_aff'); if(e) e[1]=p; else L.push(['rm_aff',p]) });
const rmCh=t=>Math.min(25,5+(t||0)*.75);
function rmDrop(t){ if(Math.random()*100<rmCh(t)){ qGive([['rm_aff',1]]); setTimeout(()=>toast('✦ Butin : Pierre de remodelage !'),1000); return true } return false }
