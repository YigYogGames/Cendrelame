/* Cendrelame · systems/defis-solo.js */
/* ================= raid en solo ================= */
const SOLO={hp:.35,atk:.65,rw:.6};
function soloBoss(R){
  const r=RAIDS.find(x=>x.id===R.r),o=mkRaidBoss(r,R.t);
  return Object.assign(o,{id:'e1',team:'e',name:r.n,ic:'boss',hue:40,boss:true,hp:Math.round(o.hp*SOLO.hp),maxHp:Math.round(o.hp*SOLO.hp),atk:o.atk*SOLO.atk,mag:o.mag*SOLO.atk,regen:0,healPow:0,shield:0});
}
const soloRw=(r,t)=>Object.fromEntries(Object.entries(rdRw(r,t)).map(([k,v])=>[k,Math.max(1,Math.round(v*SOLO.rw))]));
function raidSolo(){
  if(inFight()) return; const r=RAIDS[UI.raidB||0],t=rdTier(),h=S.heroes[0];
  if(h.lvl<r.req){ toast(`Niveau ${r.req} requis.`); return }
  UI.tab='combat'; startBattle(false,{r:r.id,t});
}
function raidSoloFinish(res){
  C.pending=null;C.waiting=null;C.turn=null; const r=RAIDS.find(x=>x.id===C.raid.r),t=C.raid.t;
  S.raidS=S.raidS||{w:0,l:0}; qEv('raidf:'+r.id);
  if(res==='win'){ qEv('raidwin'); sEv('raid:'+r.id); rkRaid(r.id,t,C.round||1);
    const rw=soloRw(r,t); gain(rw); ascDrop(t); rmDrop(t); const rIt=rdGear(t),rIt2=rdGear2(t); let up=false; S.raid=S.raid||{};
    if(t>=raidMax(r.id)){ S.raid[r.id]=t+1; up=true; UI.raidT=S.raid[r.id] }
    const chest=Math.random()*100<chestRate(t); if(chest) chestGive(1); S.raidS.w++;
    C.result={win:true,xp:0,gold:rw.gold,mats:Object.fromEntries(Object.entries(rw).filter(([k])=>k!=='gold')),items:[rIt,rIt2].filter(Boolean),ups:[]};
    logLine('Raid réussi !','hl'); if(S.farm&&S.auto){ const L=RD.lastIt; RD.lastIt=null; setTimeout(()=>toast(`Défi réussi : +${fmt(rw.gold)} or${L?` · ${esc(L.it.name)} (${RAR[L.it.rarity].n.toLowerCase()}, niveau ${L.it.ilvl})${L.ok?'':' recyclé, inventaire plein'}`:''}${chest?' · '+CHEST_N:''}${up?` · palier +${t+1} débloqué`:''}.`),300); const id=C.id,go=()=>{ if(C.phase!=='result'||C.id!==id||!S.farm||!S.auto) return; if(C.paused) return wTO(go,200); if(inFight()) return; UI.tab='combat'; startBattle(false,{r:r.id,t}) }; wTO(go,1400/(S.speed||1)) } else setTimeout(()=>rdLoot({tier:t},r,rw,up,chest),500);
  }else{ S.raidS.l++; C.result={win:false}; logLine('Le raid a échoué.','cr'); S.farm=false }
  C.phase='result'; save(); renderHeader(); if(UI.tab==='combat') render();
}

