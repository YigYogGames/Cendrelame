/* Cendrelame · online/raids-a-deux.js */
/* ============ Raids (coop 2 joueurs contre un boss) ============ */
const RAIDS=[
  {id:'colosse',n:'Colosse de Braise',L:25,req:20,role:'atk',hp:42,atk:2.24,def:1.5,res:{rPhys:20,rFeu:40,rGlace:-15},sk:['e_heavy','e_aoe','e_cry','e_stun'],d:'Un géant de roche en fusion qui écrase tout sur son passage.'},
  {id:'wyrm',n:'Wyrm des Glaces',L:40,req:35,role:'mag',hp:42,atk:2.2,def:1.5,res:{rGlace:50,rMag:20,rFeu:-15},sk:['e_aoe','e_curse','e_stun','e_smash'],d:'Un dragon ancien dont le souffle gèle le sang.'},
  {id:'avatar',n:'Avatar de l’Abîme',L:50,req:50,role:'atk',hp:48,atk:2.52,def:1.6,res:{rPhys:25,rMag:25,rFeu:20,rGlace:20,rFoudre:20,rTerre:20},sk:['e_smash','e_aoe','e_curse','e_poison','e_cry'],d:'L’incarnation du néant. Seuls les meilleurs duos en reviennent.'},
];
const RD_STEP=1.05,RD_RAGE=25,RD_TURN=90,RD_ACTS=2;
const RD={unsub:null,match:null,searching:null,qT:null,tT:null,busy:false,ending:null,gone:{}};
const rdCol=()=>FB.db.collection(COL('raid'));
const rdQ=()=>FB.db.collection(COL('raidQueue'));
const raidMax=id=>(S&&S.raid&&S.raid[id])||0;
const rdTier=()=>{const r=RAIDS[UI.raidB||0],mx=raidMax(r.id); return Math.min(mx,UI.raidT==null?mx:UI.raidT)};
const rdMul=t=>Math.pow(RD_STEP,t);
const rdRw=(r,t)=>({gold:Math.round((400+30*r.L)*rdMul(t)),rune:Math.round((2+Math.floor(t/3))*(1+.05*t)),essence:Math.round((6+t)*(1+.05*t)),cristal:Math.round((6+t)*(1+.05*t))});
function mkRaidBoss(r,t){
  const L=r.L,m=rdMul(t),a=Math.round(enStat('atk',L)*r.atk*m*.8*10)/10;
  const o={acct:r.n,name:r.n,boss:true,rid:r.id,lvl:L,role:r.role,hp:Math.round(enStat('hp',L)*r.hp*m*.5),atk:a,mag:a,
    def:Math.round(enStat('def',L)*r.def*m),res:Math.round(enStat('def',L)*.9*r.def*m),spd:Math.round((8+.15*L)*1.05*10)/10,
    crit:8,critDmg:160,dodge:0,lifesteal:0,dmgPct:0,ap:6,maxAp:6,skills:r.sk.slice(),ranks:{},cds:Object.fromEntries(r.sk.map(id=>[id,1])),st:[],shield:0,atkUsed:false,stun:false};
  for(const k of RES_K) o[k]=Math.min(RES_CAP,(r.res&&r.res[k])||0);
  o.maxHp=o.hp; return o;
}
function startRaid(){
  if(RD.unsub||!FB.user) return; const me=pvpMe();
  RD.unsub=rdCol().where('players','array-contains',me).onSnapshot(qs=>{
    const now=Date.now();
    for(const d of qs.docs){ const m=Object.assign({id:d.id},d.data({serverTimestamps:'estimate'})),age=now-(m.cms||now);
      if(RD.gone[m.id]) continue;
      if(RD.match&&RD.match.id===m.id){ RD.match=m; continue }
      if(m.state==='confirm'&&age<45000&&!RD.match){ RD.match=m; rdStopSearch(); if(m.from!==me){ const r=RAIDS.find(x=>x.id===m.boss); toast('☠ '+(m.names&&m.names[m.from]||'Un joueur')+' vous invite au raid '+(r?r.n:'')+' (palier +'+m.tier+') !') } continue }
      if((m.state!=='fight'&&m.state!=='prep'&&age>60000)||(m.state==='prep'&&age>180000)||(m.state==='fight'&&now-tsMs(m.turnAt)>15*60000)) d.ref.delete().catch(()=>{});
    }
    if(RD.match&&!qs.docs.some(d=>d.id===RD.match.id)){ if(RD.match.state==='confirm') toast('Le raid a été annulé.'); RD.match=null }
    rdTick();
  },()=>{});
  clearInterval(RD.tT); RD.tT=setInterval(rdTimer,1000);
}
function stopRaid(){ if(RD.unsub){RD.unsub();RD.unsub=null} rdStopSearch(); RD.match=null; clearInterval(RD.tT); const w=$('#raid'); if(w) w.remove() }
async function rdSearch(){
  if(!pvpReady()){toast('Chargez un personnage pour lancer un raid.');return}
  if(inFight()){toast('Terminez d’abord votre combat en cours.');return}
  if(RD.match||PV.match) return; if(PV.searching) pvpStopSearch();
  const r=RAIDS[UI.raidB||0],t=rdTier(),h=S.heroes[0],me=pvpMe();
  if(h.lvl<r.req){toast('Niveau '+r.req+' requis pour ce raid.');return}
  RD.searching={b:r.id,t}; render();
  const put=()=>rdQ().doc(me).set({uid:me,name:FB.prof.name,char:{name:h.name,cls:h.cls,lvl:h.lvl},boss:r.id,tier:t,ts:pvpTS(),tms:Date.now()}).catch(()=>{});
  await put(); let n=0;
  const poll=async()=>{
    if(!RD.searching||RD.match) return;
    if(++n%7===0) put();
    try{ const qs=await rdQ().orderBy('ts').limit(40).get();
      const c=qs.docs.map(d=>d.data()).filter(x=>x.uid!==me&&x.boss===r.id&&x.tier===t&&Date.now()-(x.tms||0)<60000);
      const o=c[0]; if(o&&me>o.uid&&!RD.match) await rdPropose(o.uid,o.name,o.char,'search',r.id,t);
    }catch(e){}
    if(RD.searching&&!RD.match) RD.qT=setTimeout(poll,3000);
  };
  RD.qT=setTimeout(poll,1200);
}
function rdStopSearch(){ clearTimeout(RD.qT); if(RD.searching&&FB.user) rdQ().doc(pvpMe()).delete().catch(()=>{}); const was=RD.searching; RD.searching=null; if(was&&UI.tab==='combat'&&!UI.scr&&C.phase==='idle') render() }
async function rdPropose(o,oname,ochar,kind,boss,tier){
  const me=pvpMe(),h=S.heroes[0],auto=kind==='friend';
  return rdCol().add({players:[me,o].sort(),from:me,kind,boss,tier,state:'confirm',names:{[me]:FB.prof.name,[o]:oname},chars:{[me]:{name:h.name,cls:h.cls,lvl:h.lvl},[o]:ochar||null},acc:auto?{[me]:true}:{},u:auto?{[me]:pvpSnap()}:{},log:[],chat:[],created:pvpTS(),cms:Date.now()});
}
async function rdUpd(data){ if(!RD.match) return; try{ await rdCol().doc(RD.match.id).update(data) }catch(e){ toast('Raid : erreur ('+(e.code||'réseau')+').') } }
async function rdAccept(){
  const m=RD.match; if(!m) return; if(!pvpReady()){toast('Chargez un personnage (Jouer) pour rejoindre le raid.');return}
  if(inFight()){toast('Terminez d’abord votre combat en cours.');return}
  if(PV.match&&PV.match.state==='fight'){toast('Terminez d’abord votre duel.');return}
  const r=RAIDS.find(x=>x.id===m.boss); if(!r) return;
  if(S.heroes[0].lvl<r.req){toast('Niveau '+r.req+' requis pour ce raid.');return}
  if(raidMax(r.id)<m.tier){toast('Vous n’avez pas encore débloqué le palier +'+m.tier+' de ce boss (maximum : +'+raidMax(r.id)+').');return}
  const me=pvpMe(); await rdUpd({['acc.'+me]:true,['u.'+me]:pvpSnap()});
}
async function rdRefuse(){ if(!RD.match) return; await rdUpd({state:'cancel',by:pvpMe()}); RD.match=null; renderRaid() }
/* moteur (calculé par le joueur actif) */
const rdHeroes=x=>x.m.players.map(p=>x.u[p]);
const rdAliveH=x=>rdHeroes(x).filter(h=>h&&h.hp>0&&!h.left);
const rdOver=x=>x.u.boss.hp<=0?'win':!rdAliveH(x).length?'lose':null;
function rdState(){ const m=RD.match,me=pvpMe(),u=JSON.parse(JSON.stringify(m.u)); return {m,me,u,U:u[me],L:[],round:m.round||1} }
function rdEndOf(V){ CB.end(V); for(const q in (V.pcd||{})) V.pcd[q]=Math.max(0,V.pcd[q]-1); V.atkUsed=false; V.stun=false }
function rdExec(u,sk,tgt,x){
  const H=()=>rdAliveH(x),B=x.u.boss,allH=()=>Object.entries(x.u).filter(([k,v])=>k!=='boss'&&v&&!v.left).map(([,v])=>v);
  CB.exec(u,sk,tgt,W_L(x.L,v=>v.boss?allH():[B],v=>v.boss?[B]:allH()));
}
function rdBossAct(x){
  const B=x.u.boss; B.dmgPct=x.round>RD_RAGE?(x.round-RD_RAGE)*8:0;
  if(x.round===RD_RAGE+1) x.L.push(`${B.name} entre en rage : ses dégâts augmentent à chaque tour !`);
  for(let n=0;n<RD_ACTS;n++){
    const H=rdAliveH(x); if(!H.length||B.hp<=0) break;
    const us=B.skills.filter(id=>!(B.cds[id]||0)&&B.ap>=(SK[id].ap||0)&&!(SK[id].tg==='allies'&&B.st.some(s=>s.k==='buff'&&s.v>0)));
    let sk=null; if(us.length&&(Math.random()<.7||B.atkUsed)) sk=SK[pick(us)]; else if(!B.atkUsed) sk=SK.atk;
    if(!sk) break;
    const taunt=H.find(h=>h.st.some(s=>s.k==='taunt'));
    const tgt=taunt||(Math.random()<.35?H.slice().sort((a,b)=>a.hp/a.maxHp-b.hp/b.maxHp)[0]:pick(H));
    rdExec(B,sk,tgt,x);
  }
}
/* fin du tour courant -> prochain joueur (les tours du boss sont joués automatiquement) */
function rdNext(x){
  const ord=x.m.order; let i=x.m.idx;
  for(let g=0;g<12&&!rdOver(x);g++){
    i=(i+1)%ord.length; if(i===0) x.round++;
    const id=ord[i],V=x.u[id]; if(!V||V.hp<=0||V.left) continue;
    V.ap=V.maxAp;
    { const B=x.u.boss,allH=()=>Object.entries(x.u).filter(([k,v])=>k!=='boss'&&v&&!v.left).map(([,v])=>v);
      const r0=CB.start(V,W_L(x.L,v=>v.boss?allH():[B],v=>v.boss?[B]:allH()));
      if(V.hp<=0) continue; if(r0.skip){ rdEndOf(V); continue } }
    if(id==='boss'){ rdBossAct(x); rdEndOf(V); continue }
    return {turn:id,idx:i,round:x.round,turnAt:pvpTS()};
  }
  return {idx:i,round:x.round,turnAt:pvpTS()};
}
function rdCommit(x,extra){
  const data=Object.assign({u:x.u},extra||{}); let log=(x.m.log||[]).concat(x.L); const r=rdOver(x);
  if(r){ data.state='done'; data.win=r==='win'; log=log.concat([r==='win'?'🏆 '+x.u.boss.name+' est vaincu ! Le raid est réussi.':'💀 Le raid a échoué.']) }
  data.log=log.slice(-50); return rdUpd(data);
}
const rdMyTurn=()=>RD.match&&RD.match.state==='fight'&&RD.match.turn===pvpMe();
function rdTick(){
  const m=RD.match; renderRaid(); if(!m) return; const me=pvpMe();
  if(m.state==='confirm'&&m.players[0]===me&&m.players.every(p=>m.acc&&m.acc[p]&&m.u&&m.u[p])&&!RD.busy){
    const r=RAIDS.find(x=>x.id===m.boss); if(!r) return; RD.busy=true;
    const u=JSON.parse(JSON.stringify(m.u)); u.boss=mkRaidBoss(r,m.tier||0);
    rdUpd({state:'prep',u,prepAt:pvpTS(),ready:{},log:['⏳ Préparation : 10 secondes pour boire vos potions.']}).finally(()=>{RD.busy=false});
  }
  if(m.state==='prep') rdPrepCheck();
  renderInvPop();
  if(m.state==='cancel'){ if(m.by!==me) toast('Le raid a été refusé.'); RD.match=null; renderRaid() }
  if(m.state==='done'&&RD.ending!==m.id){ RD.ending=m.id; rdFinish(m) }
}
async function rdAct(id){
  if(!rdMyTurn()||RD.busy) return; const x=rdState(),sk=SK[id],U=x.U;
  if(!sk||!U||U.hp<=0) return; if(id!=='atk'&&!U.skills.includes(id)) return;
  if((id==='atk'?0:apOf(U,id))>U.ap||(U.cds[id]||0)||(id==='atk'&&U.atkUsed)) return;
  RD.busy=true; rdExec(U,sk,x.u.boss,x); await rdCommit(x); RD.busy=false;
}
async function rdPot(k){
  if(RD.match&&RD.match.state==='prep') return rdPrepPot(k);
  if(!rdMyTurn()||RD.busy||cbCount(k)<1) return; const x=rdState(),U=x.U; if((U.pcd||{})[k]>0) return;
  if(!potFx(U,k,x.L,{raid:true})) return;
  RD.busy=true; cbTake(k); save(); await rdCommit(x); RD.busy=false;
}
async function rdEnd(){
  if(!rdMyTurn()||RD.busy) return; const x=rdState(); rdEndOf(x.U);
  RD.busy=true; await rdCommit(x,rdNext(x)); RD.busy=false;
}
async function rdSkip(){
  const m=RD.match; if(!m||m.state!=='fight'||m.turn===pvpMe()||Date.now()-tsMs(m.turnAt)<RD_TURN*1000||RD.busy) return;
  const x=rdState(),V=x.u[m.turn]; if(!V) return; x.L.push(`${V.name} n’a pas joué à temps : son tour est passé.`); rdEndOf(V);
  RD.busy=true; await rdCommit(x,rdNext(x)); RD.busy=false;
}
async function rdForfeit(){
  const m=RD.match; if(!m||m.state!=='fight') return; const x=rdState(),U=x.U;
  U.hp=0; U.left=true; x.L.push(`${m.names[x.me]} abandonne le raid.`);
  const extra=m.turn===x.me?rdNext(x):{};
  RD.gone[m.id]=1; await rdCommit(x,extra);
  rdCount(m,false); RD.match=null; renderRaid(); toast('Raid abandonné : compté comme une défaite.');
  if(UI.tab==='combat'&&!UI.scr) render();
}
function rdCount(m,win){
  const me=pvpMe(),key=KP+'raiddone_'+me,done=JSON.parse(lsGet(key)||'[]'); if(done.includes(m.id)||!S||!S.heroes||!S.heroes[0]) return false;
  done.push(m.id); lsSet(key,JSON.stringify(done.slice(-50))); S.raidS=S.raidS||{w:0,l:0}; S.raidS[win?'w':'l']++; save(); return true;
}
function rdFinish(m){
  const me=pvpMe(),U=m.u&&m.u[me],win=!!m.win&&U&&!U.left,r=RAIDS.find(x=>x.id===m.boss);
  renderRaid();
  setTimeout(()=>{
    const w=$('#raid'); if(w) w.remove(); RD.match=null; RD.gone[m.id]=1;
    if(r) qEv('raidf:'+r.id);
    if(win&&r&&rdCount(m,true)){ qEv('raidwin'); sEv('raid:'+r.id); rkRaid(r.id,m.tier||0,m.round||1);
      const rw=rdRw(r,m.tier||0); gain(rw); ascDrop(m.tier||0); S.raid=S.raid||{}; let up=false; const chest=Math.random()*100<chestRate(m.tier||0); if(chest) chestGive(1);
      if((m.tier||0)>=raidMax(r.id)){ S.raid[r.id]=(m.tier||0)+1; up=true; if(UI.raidB!=null&&RAIDS[UI.raidB]&&RAIDS[UI.raidB].id===r.id) UI.raidT=S.raid[r.id] }
      save(); renderHeader(); rdLoot(m,r,rw,up,chest);
    } else if(!win){ rdCount(m,false); toast('Le raid a échoué.') }
    setTimeout(()=>rdCol().doc(m.id).delete().catch(()=>{}),8000);
    if(UI.tab==='combat'&&!UI.scr) render();
  },3200);
}
function rdLoot(m,r,rw,up,chest){
  const d=document.createElement('div'); d.className='modal'; d.id='rdloot';
  d.innerHTML=`<div class="box loot"><h2>Raid réussi !</h2><p><b>${esc(r.n)}</b> · palier +${m.tier||0}</p><div class="lootg">${matIcon('gold')}<b>+${fmt(rw.gold)}</b> or</div>
    <p class="num">${Object.entries(rw).filter(([k])=>k!=='gold').map(([k,v])=>matChip(k,v)).join(' ')}</p>
    ${rdGearHTML()}${up?`<p class="lvup">✦ Palier +${(m.tier||0)+1} débloqué pour ce boss !</p>`:''}${chest?`<div class="chdrop"><span class="chico sm">${matSvg('c_relic')}</span><b>Butin rare : ${CHEST_N} !</b></div>`:''}<div class="row"><button class="btn pri" data-act="rdLootOk">Récupérer</button></div></div>`;
  document.body.append(d); d.querySelector('button').focus();
}
function rdTimer(){
  const m=RD.match; if(!m) return; const el=document.querySelector('#raid [data-rdt]');
  if(m.state==='confirm'){ const left=45-Math.floor((Date.now()-(m.cms||Date.now()))/1000); if(left<=0) return renderRaid(); if(el) el.textContent='('+left+' s)'; return }
  if(m.state==='prep'){ const e2=document.querySelector('#raid [data-prep]'); if(e2) e2.textContent=Math.max(0,Math.ceil((PREP_MS-(Date.now()-tsMs(m.prepAt)))/1000))+' s'; rdPrepCheck(); return }
  if(m.state==='fight'){ const t=Math.max(0,RD_TURN-Math.floor((Date.now()-tsMs(m.turnAt))/1000)); if(el) el.textContent='('+t+' s)'; if(t===0&&m.turn!==pvpMe()&&!document.querySelector('[data-act=rdSkip]')) renderRaid() }
}
function renderRaid(){
  const m=RD.match; let w=$('#raid');
  if(!m||!FB.user){ if(w) w.remove(); return }
  if(!w){ w=document.createElement('div'); w.id='raid'; w.className='modal pvpm'; w.setAttribute('role','dialog'); w.setAttribute('aria-modal','true'); document.body.append(w) }
  const me=pvpMe(),o=pvpOp(m),nm=m.names||{},ch=(m.chars||{})[o],r=RAIDS.find(x=>x.id===m.boss)||RAIDS[0];
  if(m.state==='confirm'){
    const left=Math.max(0,45-Math.floor((Date.now()-(m.cms||Date.now()))/1000)),mine=m.acc&&m.acc[me];
    if(left<=0){ if(m.from===me) rdUpd({state:'cancel',by:me}); RD.match=null; w.remove(); return }
    w.innerHTML=`<div class="box pvconf"><h2>${m.kind==='friend'?(m.from===me?'Invitation au raid envoyée':'Invitation au raid'):'Partenaire trouvé !'}</h2>
      <p>Raid : <b>${esc(r.n)}</b> · palier +${m.tier||0}</p>
      <p>Avec <b>${esc(nm[o]||'?')}</b>${ch?` · ${esc(ch.name)}, ${(CLASSES[ch.cls]||{n:''}).n} niveau ${ch.lvl}`:''}</p>
      <p class="mute">${mine?(m.acc&&m.acc[o]?'Le raid va commencer…':'En attente de votre partenaire…'):'Rejoindre le raid ?'} <span class="num" data-rdt>(${left} s)</span></p>
      <div class="row">${mine?'':'<button class="btn pri" data-act="rdAcc">Accepter</button>'}<button class="btn" data-act="rdRef">${mine?'Annuler':'Refuser'}</button></div></div>`;
    return;
  }
  if(m.state!=='fight'&&m.state!=='done'&&m.state!=='prep'){ w.remove(); return }
  const U=m.u[me],B=m.u.boss,my=m.state==='fight'&&m.turn===me,tn=m.turn&&m.u[m.turn],late=m.state==='fight'&&!my&&Date.now()-tsMs(m.turnAt)>RD_TURN*1000,tl=Math.max(0,RD_TURN-Math.floor((Date.now()-tsMs(m.turnAt))/1000));
  let acts='';
  if(m.state==='done') acts=`<div class="pvwin">${m.win?'🏆 Raid réussi !':'💀 Le raid a échoué.'}</div>`;
  else if(m.state==='prep') acts=prepActs(U,'rd',m);
  else if(U&&U.hp<=0) acts=`<p class="mute">Votre héros est tombé. Encouragez votre partenaire !</p>`;
  else if(my) acts=fActs(U,'rd');
  else acts=`<p class="mute">Tour de <b>${esc(tn?(tn.acct||tn.name):'')}</b>… <span class="num" data-rdt>(${tl} s)</span></p>${late?'<div class="row"><button class="btn pri" data-act="rdSkip">Passer son tour (joueur inactif)</button></div>':''}`;
  keepFc(w,()=>{ w.innerHTML=`<div class="box pvbox fbox ftbox"><div class="fgrid"><div class="fmain">${fArena(m,'raid')}</div>${fchatHTML(m,'raid')}</div></div>` });
  const lg=w.querySelector('.pvlog'); if(lg) lg.scrollTop=lg.scrollHeight; hpFloats(w,m,RD);
}
function viewRaid(){
  const on=!!(FB.user&&FB.prof),h=S.heroes[0],R0=S.raidS||{w:0,l:0};
  if(UI.raidB==null||!RAIDS[UI.raidB]) UI.raidB=0;
  const r=RAIDS[UI.raidB],mx=raidMax(r.id),t=rdTier(),b=mkRaidBoss(r,t),rw=rdRw(r,t),lock=h.lvl<r.req;
  const tiles=RAIDS.map((x,i)=>`<button class="ztile ${i===UI.raidB?'on':''}" data-act="rdBoss" data-i="${i}"><b>${h.lvl<x.req?'🔒 ':''}${esc(x.n)}</b><small>Niveau ${x.L} · requis : niv. ${x.req}</small><span class="zp">Palier max : +${raidMax(x.id)}</span></button>`).join('');
  const opts=Array.from({length:mx+1},(_,i)=>`<option value="${i}" ${i===t?'selected':''}>Palier +${i}${i?` (+${Math.round((rdMul(i)-1)*100)} %)`:' (base)'}</option>`).join('');
  const resl=RES_K.filter(k=>b[k]).map(k=>`${STAT_N[k]||k} ${b[k]>0?'':''}${b[k]} %`).join(', ')||'aucune';
  const srch=RD.searching;
  return `<section class="panel rdpanel"><h2 style="margin-bottom:6px">Raid</h2>
    <p class="hint">Combat coopératif <b>à 2 joueurs</b> contre un boss redoutable, au tour par tour. Le boss agit deux fois par tour et entre en rage au tour ${RD_RAGE+1}. Chaque victoire débloque le palier suivant pour ce boss : +5 % de difficulté par palier, cumulatif.</p>
    <div class="rdgrid">${tiles}</div>
    <p class="hint" style="margin:0 0 8px"><i>${esc(r.d)}</i></p>
    <dl class="rdinfo"><dt>Niveau</dt><dd class="num">${r.L}</dd><dt>PV</dt><dd class="num">${fmt(b.hp)}</dd><dt>${r.role==='mag'?'Intelligence':'Force'}</dt><dd class="num">${fmt(Math.round(b.atk))}</dd><dt>Défense</dt><dd class="num">${fmt(b.def)} / ${fmt(b.res)}</dd><dt>Résistances</dt><dd>${esc(resl)}</dd><dt>Compétences</dt><dd>${r.sk.map(id=>esc(SK[id].n)).join(', ')}</dd><dt>Récompenses</dt><dd class="num">${matChip('gold',rw.gold)}${Object.entries(rw).filter(([k])=>k!=='gold').map(([k,v])=>matChip(k,v)).join('')}</dd></dl>
    <div class="rdsel"><label for="rdtier"><b>Palier</b></label><select id="rdtier" ${srch?'disabled':''}>${opts}</select>${mx?'':'<small class="mute">Battez ce boss pour débloquer le palier +1.</small>'}</div>
    ${!on?'<p class="lerr">Connectez-vous à un compte (menu) pour jouer les raids.</p>':lock?`<p class="lerr">Niveau ${r.req} requis (vous êtes niveau ${h.lvl}).</p>`:srch?`<div class="pvsearch" style="justify-content:flex-start"><span class="spin" aria-hidden="true"></span><b>Recherche d’un partenaire (palier +${srch.t})…</b><button class="btn" data-act="rdCancel">Annuler</button></div>`:`<button class="btn pri big" data-act="rdFind" style="max-width:320px">☠ Rechercher un partenaire</button>`}
    <p class="mute" style="margin-top:12px">Bilan : <b>${R0.w}</b> raid${R0.w>1?'s':''} réussi${R0.w>1?'s':''} · <b>${R0.l}</b> échec${R0.l>1?'s':''}</p>
    <p class="hint">Vous pouvez aussi inviter un ami : cliquez sur son nom dans la liste d’amis, puis sur « Raid » (boss et palier sélectionnés ici). Les deux joueurs doivent avoir débloqué le palier choisi.</p></section>`;
}

