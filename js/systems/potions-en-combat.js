/* Cendrelame · systems/potions-en-combat.js */
/* --- potions en combat --- */
const ownPots=()=>Object.keys(POTS).filter(k=>!POTS[k].nocombat&&cbCount(k)>0&&(!POTS[k].cls||POTS[k].cls===S.heroes[0].cls));
function potBar(){
  const ks=ownPots(); if(!ks.length) return '<small class="mute" style="align-self:center">Aucune potion : achetez-en chez le Marchand.</small>';
  return `<div class="potbar">${ks.map(k=>{const used=(BUFF_K.includes(k)&&buffOn(k)),cd=potLeft(k),cs=potShow(k,cd);
    return `<button class="potb ${used||cd?'off':''}" data-act="usePot" data-k="${k}" data-tip="pot:${k}" aria-label="${esc(POTS[k].n)}${cd?', recharge '+cs+' tours':used?', déjà utilisée':''}">${matIcon(k)}<span class="num">${cbCount(k)}</span>${cd?`<span class="cdo">${cs}</span>`:used?'<span class="cdo">✓</span>':''}</button>`}).join('')}</div>`;
}
const POT_CD=3;
const potLeft=k=>{ const P=POTS[k]; if(!P||!C.pcd||C.pcd[k]==null) return 0; return Math.max(0,(P.cd||0)+1-(C.round-C.pcd[k])) };
const potShow=(k,n)=>Math.min(n,(POTS[k]&&POTS[k].cd)||n);
const BUFF_K=['p_xp','p_loot'],BUFF_MS=30*60*1000;
const buffLeft=k=>{ const t=S&&S.buffs&&S.buffs[k]; return t?Math.max(0,t-Date.now()):0 };
const buffOn=k=>buffLeft(k)>0;
const buffFmt=ms=>{ const m=Math.floor(ms/60000),s2=Math.floor(ms%60000/1000); return m+':'+String(s2).padStart(2,'0') };
function buffStart(k){ if(buffOn(k)){ toast(POTS[k].n+' est déjà actif ('+buffFmt(buffLeft(k))+' restantes).'); return false } S.buffs=S.buffs||{}; S.buffs[k]=Date.now()+BUFF_MS; renderBuffs(); qEv('drink'); return true }
function drinkBuff(k){ if(!BUFF_K.includes(k)||matAll(k)<1) return; if(!buffStart(k)) return; removeMat(k,1); save(); toast(POTS[k].n+' : bonus actif pendant 30 minutes.'); render() }
function renderBuffs(){ const w=$('#buffbar'); if(!w) return; const on=S&&S.heroes&&S.heroes.length&&!UI.scr?BUFF_K.filter(buffOn):[];
  if(S&&S.buffs) for(const k of BUFF_K) if(S.buffs[k]&&!buffOn(k)){ delete S.buffs[k]; save() }
  w.hidden=!on.length; if(!on.length){ w.innerHTML=''; return }
  const key=on.join(); if(w.dataset.k!==key){ w.dataset.k=key; w.innerHTML=on.map(k=>`<div class="bf" style="--bc:${POTS[k].c}" data-bk="${k}" data-tip="${esc('tx:'+POTS[k].n+'|'+(k==='p_xp'?'+50 % d’expérience gagnée en combat.':'+50 % d’or et de matériaux gagnés en combat.')+' Le temps s’écoule même hors ligne.')}" aria-label="${esc(POTS[k].n)}"><span>${matIcon(k)}</span><small></small></div>`).join('') }
  w.querySelectorAll('.bf').forEach(b=>{ b.querySelector('small').textContent=buffFmt(buffLeft(b.dataset.bk)) }) }
setInterval(renderBuffs,1000);
function usePot(k){
  if(!inFight()||!cbCount(k)||potLeft(k)) return;
  const u=C.units.find(x=>x.team==='h'&&x.hp>0); if(!u) return;
  const B=(stat,v)=>{u.st=u.st.filter(s=>!(s.k==='buff'&&s.stat===stat&&s.v>0&&s.pot));u.st.push({k:'buff',stat,v,dur:3,pot:1})};
  if(POT_HEAL[k]) heal(u,u.maxHp*POT_HEAL[k]);
  else if(POT_REG[k]){ u.st=u.st.filter(s=>s.k!=='phot'); u.st.push({k:'phot',v:POT_REG[k][0],dur:POT_REG[k][1]}) }
  else if(k==='p_res'){B('def',40);B('res',40)}
  else if(k==='p_for') B('atk',30);
  else if(k==='p_int') B('mag',30);
  else if(k==='p_pa') addApb(u);
  else if(BUFF_K.includes(k)){ if(!buffStart(k)) return }
  if(POTS[k].cd) C.pcd[k]=C.round; cbTake(k); logLine(`${u.name} boit : ${POTS[k].n}.`,'hl'); floatTxt(u,POTS[k].n,'heal'); refresh(u); save(); renderActbar();
}

