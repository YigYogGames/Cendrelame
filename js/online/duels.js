/* Cendrelame · online/duels.js */
/* ============ Duels PvP ============ */
const PVP_GOLD=500,PVP_TURN=90;
const PV={unsub:null,match:null,searching:false,qT:null,pT:null,busy:false,ending:null,seen:{}};
const pvpCol=()=>FB.db.collection(COL('pvp'));
const pvpQ=()=>FB.db.collection(COL('pvpQueue'));
const pvpMe=()=>FB.user&&FB.user.uid;
const pvpOp=m=>m.players.find(x=>x!==pvpMe());
const pvpTS=()=>firebase.firestore.FieldValue.serverTimestamp();
const pvpReady=()=>!!(FB.user&&FB.prof&&S&&S.heroes&&S.heroes[0]);
const PVP_HP=2.5,PVP_DMG=.35;
const W_P=(L,f,g)=>{ const W=W_L(L,f,g),d0=W.dmg; W.pvp=1; W.dmg=(t,d,c,src,l)=>d0(t,src?d:Math.max(1,Math.round(d*PVP_DMG)),c,src,l); return W };
function pvpSnap(hm=1){
  const h=S.heroes[0],u=mkHeroUnit(h),keys=['hp','maxHp','atk','mag','def','res','spd','crit','critDmg','dodge','lifesteal','dmgPct','ap','maxAp',...RES_K];
  const o={acct:FB.prof.name,name:h.name,cls:h.cls,skin:h.skin||null,aura:myAura(),lvl:h.lvl,role:u.role,gx:u.gx,skills:u.skills.slice(),ranks:Object.fromEntries(u.skills.map(id=>[id,h.learned[id]||1])),cds:{},st:[],shield:0,atkUsed:false,stun:false};
  for(const k of keys) o[k]=Math.round((u[k]||0)*10)/10;
  o.heat=0; o.rage=0; o.garde=0;
  if(hm!==1){ o.hp=o.maxHp=Math.round(o.maxHp*hm) }
  return o;
}
function startPvp(){
  if(PV.unsub||!FB.user) return; const me=pvpMe();
  PV.unsub=pvpCol().where('players','array-contains',me).onSnapshot(qs=>{
    const now=Date.now();
    for(const d of qs.docs){ const m=Object.assign({id:d.id},d.data({serverTimestamps:'estimate'}));
      const age=now-(m.cms||now);
      if(PV.match&&PV.match.id===m.id){ PV.match=m; continue }
      if(m.state==='confirm'&&age<45000&&!PV.match){ PV.match=m; pvpStopSearch(true); if(m.from!==me) toast('⚔ '+(m.names&&m.names[m.from]||'Un joueur')+' vous propose un duel !'); continue }
      if((m.state!=='fight'&&m.state!=='prep'&&age>60000)||(m.state==='prep'&&age>180000)||(m.state==='fight'&&now-tsMs(m.turnAt)>15*60000)) d.ref.delete().catch(()=>{});
    }
    if(PV.match&&!qs.docs.some(d=>d.id===PV.match.id)){ if(PV.match.state==='confirm') toast('Le duel a été annulé.'); PV.match=null }
    pvpTick();
  },()=>{});
  clearInterval(PV.pT); PV.pT=setInterval(pvpTimer,1000);
}
function stopPvp(){ if(PV.unsub){PV.unsub();PV.unsub=null} pvpStopSearch(); PV.match=null; clearInterval(PV.pT); const w=$('#pvp'); if(w) w.remove() }
/* recherche d’adversaire */
async function pvpSearch(){
  if(!pvpReady()){toast('Chargez un personnage pour faire un duel.');return}
  if(inFight()){toast('Terminez d’abord votre combat en cours.');return}
  if(PV.match||RD.match) return; if(RD.searching) rdStopSearch(); PV.searching=true; render();
  const h=S.heroes[0],me=pvpMe();
  const put=()=>pvpQ().doc(me).set({uid:me,name:FB.prof.name,char:{name:h.name,cls:h.cls,lvl:h.lvl},ts:pvpTS(),tms:Date.now()}).catch(()=>{});
  await put(); let n=0;
  const poll=async()=>{
    if(!PV.searching||PV.match) return;
    if(++n%7===0) put();
    try{ const qs=await pvpQ().orderBy('ts').limit(25).get();
      const c=qs.docs.map(d=>d.data()).filter(x=>x.uid!==me&&Date.now()-(x.tms||0)<60000);
      const o=c[0]; if(o&&me>o.uid&&!PV.match) await pvpPropose(o.uid,o.name,o.char,'search');
    }catch(e){}
    if(PV.searching&&!PV.match) PV.qT=setTimeout(poll,3000);
  };
  PV.qT=setTimeout(poll,1200);
}
function pvpStopSearch(){ clearTimeout(PV.qT); if(PV.searching&&FB.user) pvpQ().doc(pvpMe()).delete().catch(()=>{}); const was=PV.searching; PV.searching=false; if(was&&UI.tab==='combat'&&!UI.scr&&C.phase==='idle') render() }
async function pvpPropose(o,oname,ochar,kind){
  const me=pvpMe(),h=S.heroes[0],auto=kind==='friend';
  const doc={players:[me,o].sort(),from:me,kind,state:'confirm',names:{[me]:FB.prof.name,[o]:oname},chars:{[me]:{name:h.name,cls:h.cls,lvl:h.lvl},[o]:ochar||null},acc:auto?{[me]:true}:{},u:auto?{[me]:pvpSnap(PVP_HP)}:{},log:[],created:pvpTS(),cms:Date.now()};
  const ref=await pvpCol().add(doc); return ref;
}
async function pvpUpd(data){ if(!PV.match) return; try{ await pvpCol().doc(PV.match.id).update(data) }catch(e){ toast('Duel : erreur ('+(e.code||'réseau')+').') } }
/* confirmation, démarrage */
async function pvpAccept(){
  if(!PV.match) return; if(!pvpReady()){toast('Chargez un personnage (Jouer) pour accepter le duel.');return}
  if(inFight()){toast('Terminez d’abord votre combat en cours.');return}
  if(RD.match&&RD.match.state==='fight'){toast('Terminez d’abord votre raid.');return}
  const me=pvpMe(); await pvpUpd({['acc.'+me]:true,['u.'+me]:pvpSnap(PVP_HP)});
}
async function pvpRefuse(){ if(!PV.match) return; await pvpUpd({state:'cancel',by:pvpMe()}); PV.match=null; renderPvp() }
function pvpTick(){
  const m=PV.match; renderPvp(); if(!m) return; const me=pvpMe();
  if(m.state==='confirm'&&m.players[0]===me&&m.players.every(p=>m.acc&&m.acc[p]&&m.u&&m.u[p])&&!PV.busy){
    PV.busy=true; pvpUpd({state:'prep',prepAt:pvpTS(),ready:{},log:['⏳ Préparation : 10 secondes pour boire vos potions.']}).finally(()=>{PV.busy=false});
  }
  if(m.state==='prep') pvPrepCheck();
  renderInvPop();
  if(m.state==='cancel'){ if(m.by!==me) toast('Le duel a été refusé.'); PV.match=null; renderPvp() }
  if(m.state==='done'&&PV.ending!==m.id){ PV.ending=m.id; pvpEnd(m) }
}
/* moteur de combat (calculé par le joueur actif) */
const pvEff=(u,k)=>{let x=0; for(const s of u.st||[]) if(s.k==='buff'&&s.stat===k) x+=s.v; return (u[k]||0)*Math.max(.25,1+x/100)};
function pvHit(u,t,mult,st,sk,L){
  if(Math.random()*100<(t.dodge||0)){L.push(`${t.name} esquive.`);return}
  const K=100+15*(u.lvl||1),ds=st==='mag'?'res':'def';
  let d=pvEff(u,st)*mult*K/(K+pvEff(t,ds)); d*=1+(u.dmgPct||0)/100; d*=resMul(t,st,sk&&sk.el); d*=skMul(u,t,sk); d*=rand(.92,1.08);
  const cr=Math.random()*100<(u.crit||0); if(cr) d*=(u.critDmg||150)/100; d=Math.max(1,Math.round(d));
  let a=d; if(t.shield>0){const s=Math.min(t.shield,a); t.shield-=s; a-=s}
  t.hp=Math.max(0,t.hp-a); L.push(`${t.name} subit ${d} dégâts${cr?' (critique !)':''}.`);
  if(t.hp>0&&t.gx&&t.gx.ult&&t.gx.ult.trig==='hurt') ultGain(t,m=>L.push(m));
  { const ul=(u.st||[]).find(q=>q.k==='ult'&&q.ls); if(ul&&u.hp>0){ const hh=Math.min(u.maxHp-u.hp,Math.round(d*ul.ls/100)); if(hh>0) u.hp+=hh } }
  if(u.lifesteal&&u.hp>0){const hh=Math.min(u.maxHp-u.hp,Math.round(d*u.lifesteal/100)); if(hh>0){u.hp+=hh}}
  if(sk&&sk.ls&&u.hp>0){const hh=Math.min(u.maxHp-u.hp,Math.round(d*sk.ls/100)); if(hh>0){u.hp+=hh; L.push(`${u.name} récupère ${hh} PV.`)}}
  return d;
}
function pvSelf(u,sk,L){ if(!sk.self) return; const c=Math.min(u.hp-1,Math.round(u.maxHp*sk.self)); if(c>0){ u.hp-=c; L.push(`${u.name} sacrifie ${c} PV.`) } }
function pvExec(u,t,sk,L){ CB.exec(u,sk,t,W_P(L,x=>x===u?[t]:[u],x=>x===u?[u]:[t])) }
function pvFx(u,tg,f,k,sk,L){
  const st=sk.st||u.role; if(tg.hp<=0) return;
  {
    if(f.k==='dot'){ if(Math.random()*100>=fxCh(f,sk,u.gx)) return; tg.st=tg.st.filter(s=>!(s.k==='dot'&&s.n===f.n)); tg.st.push({k:'dot',n:f.n,v:Math.round(pvEff(u,st)*f.v*k*resMul(tg,st,sk.el)*fxPow(f,u.gx)),dur:fxDur(f,u.gx)}); L.push(`${tg.name} subit ${f.n}.`)}
    else if(f.k==='para'){ if(Math.random()*100<(fxCh(f,sk,u.gx)+ulPara(u))*(tg.boss?.5:1)){ tg.st=tg.st.filter(s=>s.k!=='para'); tg.st.push({k:'para',p:paraPow(u.gx),dur:f.dur}); L.push(`${tg.name} est paralysé !`) } }
    else if(f.k==='det'){ const q=tg.st.find(x=>x.k==='dot'&&x.n===f.n); if(q){ tg.st=tg.st.filter(x=>x!==q); let a=Math.max(1,Math.round(q.v*q.dur*f.m*k)); const d0=a; if(tg.shield>0){const z=Math.min(tg.shield,a); tg.shield-=z; a-=z} tg.hp=Math.max(0,tg.hp-a); L.push(`${f.n} : détonation, ${tg.name} subit ${d0} dégâts.`) } }
    else if(f.k==='taunt'){tg.st=tg.st.filter(s=>s.k!=='taunt'); tg.st.push({k:'taunt',dur:f.dur}); L.push(`${tg.name} provoque l’adversaire.`)}
    else if(f.k==='stun'){ if(Math.random()*100<(f.ch||100)*(tg.boss?.5:1)){tg.st=tg.st.filter(s=>s.k!=='stun'); tg.st.push({k:'stun',dur:f.dur}); L.push(`${tg.name} est étourdi !`)} }
    else if(f.k==='shield'){const a=f.of==='hp'?tg.maxHp*f.v*k:pvEff(u,'mag')*f.v*k; tg.shield=Math.round(Math.min(tg.maxHp,(tg.shield||0)+a)); L.push(`${tg.name} gagne un bouclier.`)}
    else if(f.k==='heal'){const a=Math.round(Math.min(tg.maxHp-tg.hp,pvEff(u,f.of||'mag')*f.v*k)); tg.hp+=a; L.push(`${tg.name} récupère ${a} PV.`)}
    else if(f.k==='buff'||f.k==='debuff'){const v=f.k==='debuff'?-Math.abs(f.v):f.v*k; tg.st=tg.st.filter(s=>!(s.k==='buff'&&s.stat===f.stat&&Math.sign(s.v)===Math.sign(v))); tg.st.push({k:'buff',stat:f.stat,v:Math.round(v),dur:f.dur})}
  }
}
function pvState(){ const m=PV.match,me=pvpMe(),o=pvpOp(m),u=JSON.parse(JSON.stringify(m.u)); return {m,me,o,u,U:u[me],T:u[o],L:[]} }
function pvCommit(x,extra){
  const log=(x.m.log||[]).concat(x.L).slice(-40),data=Object.assign({u:x.u,log},extra||{});
  if(x.T.hp<=0||x.U.hp<=0){ const w=x.T.hp<=0?x.me:x.o; data.state='done'; data.winner=w; data.log=log.concat(['🏆 '+x.m.names[w]+' remporte le duel !']).slice(-40) }
  return pvpUpd(data);
}
const pvMyTurn=()=>PV.match&&PV.match.state==='fight'&&PV.match.turn===pvpMe();
async function pvAct(id){
  if(!pvMyTurn()||PV.busy) return; const x=pvState(),sk=SK[id];
  if(!sk||x.U.stun) return; if(id!=='atk'&&!x.U.skills.includes(id)) return;
  if((id==='atk'?0:apOf(x.U,id))>x.U.ap||(x.U.cds[id]||0)||(id==='atk'&&x.U.atkUsed)) return;
  PV.busy=true; pvExec(x.U,x.T,sk,x.L); await pvCommit(x); PV.busy=false;
}
function potFx(U,k,L,ctx){
  if(k==='p_pa'){ if(ctx&&ctx.pvp&&!ctx.prep&&ctx.round>1) return false; addApb(U); L.push(`${U.name} boit une Potion d’action (+${PA_POT} PA pendant 3 tours).`); U.pcd=U.pcd||{}; U.pcd[k]=POTS[k].cd+(ctx&&ctx.prep?0:1); return true }
  if(POT_HEAL[k]){const a=Math.round(Math.min(U.maxHp-U.hp,U.maxHp*POT_HEAL[k])); U.hp+=a; L.push(`${U.name} boit : ${POTS[k].n} (+${a} PV).`)}
  else if(POT_REG[k]){U.st=U.st.filter(s=>s.k!=='phot'); U.st.push({k:'phot',v:POT_REG[k][0],dur:POT_REG[k][1]}); L.push(`${U.name} boit : ${POTS[k].n}.`)}
  else if(k==='p_res'){U.st=U.st.filter(s=>!(s.k==='buff'&&(s.stat==='def'||s.stat==='res')&&s.v>0)); U.st.push({k:'buff',stat:'def',v:40,dur:3},{k:'buff',stat:'res',v:40,dur:3}); L.push(`${U.name} boit une Potion de résistance.`)}
  else if(k==='p_for'||k==='p_int'){const stt=k==='p_for'?'atk':'mag'; U.st=U.st.filter(s=>!(s.k==='buff'&&s.stat===stt&&s.v>0)); U.st.push({k:'buff',stat:stt,v:30,dur:3}); L.push(`${U.name} boit une ${POTS[k].n}.`)}
  else return false;
  U.pcd=U.pcd||{}; U.pcd[k]=(POTS[k].cd||0)+(ctx&&ctx.prep?0:1); return true;
}
async function pvPot(k){
  if(PV.match&&PV.match.state==='prep') return pvPrepPot(k);
  if(!pvMyTurn()||PV.busy) return; if(cbCount(k)<1) return; const x=pvState(),U=x.U; if((U.pcd||{})[k]>0) return;
  if(!potFx(U,k,x.L,{pvp:true,round:x.m.round||1})) return;
  PV.busy=true; cbTake(k); save(); await pvCommit(x); PV.busy=false;
}
async function pvEnd(){
  if(!pvMyTurn()||PV.busy) return; const x=pvState(),U=x.U,T=x.T;
  CB.end(U); for(const q in (U.pcd||{})) U.pcd[q]=Math.max(0,U.pcd[q]-1); U.stun=false; U.atkUsed=false;
  /* début du tour adverse */
  T.ap=T.maxAp; T.atkUsed=false;
  { const r0=CB.start(T,W_P(x.L,v=>v===T?[U]:[T],v=>v===T?[T]:[U])); T.stun=!!r0.skip }
  const round=(x.m.round||1)+(x.o===x.m.first?1:0);
  PV.busy=true; await pvCommit(x,{turn:x.o,round,turnAt:pvpTS()}); PV.busy=false;
}
async function pvForfeit(){ if(!PV.match||PV.match.state!=='fight') return; const o=pvpOp(PV.match); await pvpUpd({state:'done',winner:o,log:(PV.match.log||[]).concat([PV.match.names[pvpMe()]+' abandonne.','🏆 '+PV.match.names[o]+' remporte le duel !']).slice(-40)}) }
async function pvClaim(){ const m=PV.match; if(!m||m.state!=='fight'||m.turn===pvpMe()||Date.now()-tsMs(m.turnAt)<PVP_TURN*1000) return; const me=pvpMe(); await pvpUpd({state:'done',winner:me,log:(m.log||[]).concat([m.names[m.turn]+' n’a pas joué à temps.','🏆 '+m.names[me]+' remporte le duel !']).slice(-40)}) }
function pvpEnd(m){
  const me=pvpMe(),win=m.winner===me;
  renderPvp();
  setTimeout(()=>{
    const w=$('#pvp'); if(w) w.remove(); PV.match=null;
    const done=JSON.parse(lsGet(KP+'pvpdone_'+me)||'[]');
    if(win&&!done.includes(m.id)&&S&&S.heroes&&S.heroes[0]){ done.push(m.id); lsSet(KP+'pvpdone_'+me,JSON.stringify(done.slice(-50))); S.gold+=PVP_GOLD; S.pvp=S.pvp||{w:0,l:0}; S.pvp.w++; rkDuel(true); qEv('duel'); qEv('duelwin'); ACC.cnt=ACC.cnt||{}; ACC.cnt.duel=(ACC.cnt.duel||0)+1; save(); renderHeader(); pvpLoot(m) }
    else if(!win&&S&&S.heroes&&S.heroes[0]){ if(!done.includes(m.id)){done.push(m.id); lsSet(KP+'pvpdone_'+me,JSON.stringify(done.slice(-50))); S.pvp=S.pvp||{w:0,l:0}; S.pvp.l++; seaLoss(); rkDuel(false); qEv('duel'); save()} toast('Défaite contre '+(m.names[pvpOp(m)]||'votre adversaire')+'.') }
    if(m.players[0]===me) setTimeout(()=>pvpCol().doc(m.id).delete().catch(()=>{}),8000);
    if(UI.tab==='combat'&&!UI.scr) render();
  },3200);
}
function pvpLoot(m){
  const d=document.createElement('div'); d.className='modal'; d.id='pvploot';
  d.innerHTML=`<div class="box loot"><h2>Butin du duel</h2><p>Victoire contre <b>${esc(m.names[pvpOp(m)]||'')}</b> !</p><div class="lootg">${matIcon('gold')}<b>+${fmt(PVP_GOLD)}</b> or</div><div class="row"><button class="btn pri" data-act="pvpLootOk">Récupérer</button></div></div>`;
  document.body.append(d); d.querySelector('button').focus();
}
/* affichage */
function fPots(U,p,round,prep){
  const pots=POT_CK(U.cls).filter(k=>cbCount(k)>0),paLock=p==='pvp'&&!prep&&(round||1)>1;
  return `<div class="potbar">${pots.map(k=>{const cd=Math.min((U.pcd||{})[k]||0,POTS[k].cd||99),lk=k==='p_pa'&&paLock,off=cd||lk;return `<button class="potb ${off?'off':''}" data-act="${p}Pot" data-k="${k}" data-tip="pot:${k}" aria-label="${esc(POTS[k].n)}${cd?', recharge '+cd+' tours':lk?', uniquement au premier tour':''}">${matIcon(k)}<span class="num">${cbCount(k)}</span>${cd?`<span class="cdo">${cd}</span>`:lk?'<span class="cdo">✕</span>':''}</button>`}).join('')||'<small class="mute">Aucune potion utilisable.</small>'}</div>`;
}
function fActs(U,p,round){
  const ids=['atk',...U.skills];
  return `<div class="acts"><div class="skcbar">${ids.map(id=>cTile(id,U,p+'Sk')).join('')}</div><span class="apc" style="align-self:center">${U.ap} / ${U.maxAp} PA</span><button class="btn endturn" data-act="${p}EndT">Fin de tour</button></div>${fPots(U,p,round,false)}`;
}
function prepActs(U,p,m){
  const left=Math.max(0,Math.ceil((PREP_MS-(Date.now()-tsMs(m.prepAt)))/1000)),me=pvpMe(),rd=m.ready&&m.ready[me],ot=m.players.filter(x=>x!==me).every(x=>m.ready&&m.ready[x]);
  return `<div class="prepbar"><div class="prept"><b>Préparation</b><span class="num" data-prep>${left} s</span></div><p class="hint">Les deux joueurs se préparent en même temps : buvez vos potions avant le début du combat.${ot?' Votre '+(p==='pvp'?'adversaire':'partenaire')+' est prêt.':''}</p>${U&&U.hp>0?fPots(U,p,1,true):''}<div class="row" style="justify-content:center;margin-top:8px"><button class="btn pri" data-act="${p}Ready" ${rd?'disabled':''}>${rd?'Prêt — en attente…':'Je suis prêt'}</button></div></div>`;
}
/* chiffres de dégâts / soins sur les cartes (duels et raids) */
function hpFloats(w,m,store){
  const hp={}; for(const [id,v] of Object.entries(m.u||{})) if(v&&typeof v.hp==='number') hp[id]=v.hp;
  const pr=store.fl&&store.fl.id===m.id?store.fl.hp:null; store.fl={id:m.id,hp};
  if(!pr) return;
  for(const [id,v] of Object.entries(hp)){ if(pr[id]==null) continue; const d=Math.round(pr[id]-v); if(!d) continue; const el=w.querySelector(`[data-pu="${id}"]`); if(el) spawnFloat(el,d>0?'-'+fmt(d):'+'+fmt(-d),d>0?'':'heal') }
}
function spawnFloat(el,txt,cls){
  const r=el.getBoundingClientRect(),f=document.createElement('span'); f.className='fnum fx '+(cls||''); f.textContent=txt;
  f.style.left=((r.left+r.width/2+(Math.random()*30-15)))/ZM+'px'; f.style.top=((r.top+r.height*.32))/ZM+'px'; document.body.append(f); setTimeout(()=>f.remove(),2200);
}
async function pvPrepPot(k){
  const m=PV.match; if(!m||m.state!=='prep'||cbCount(k)<1) return; const me=pvpMe(),U=JSON.parse(JSON.stringify(m.u[me])),L=[]; if((U.pcd||{})[k]>0) return;
  if(!potFx(U,k,L,{pvp:true,prep:true,round:1})) return; cbTake(k); save();
  await pvpUpd({['u.'+me]:U,log:firebase.firestore.FieldValue.arrayUnion(...L)});
}
async function rdPrepPot(k){
  const m=RD.match; if(!m||m.state!=='prep'||cbCount(k)<1) return; const me=pvpMe(),U=JSON.parse(JSON.stringify(m.u[me])),L=[]; if((U.pcd||{})[k]>0) return;
  if(!potFx(U,k,L,{raid:true,prep:true})) return; cbTake(k); save();
  await rdUpd({['u.'+me]:U,log:firebase.firestore.FieldValue.arrayUnion(...L)});
}
function pvPrepCheck(){
  const m=PV.match; if(!m||m.state!=='prep'||PV.busy) return; const me=pvpMe(),el=Date.now()-tsMs(m.prepAt),both=m.players.every(p=>m.ready&&m.ready[p]);
  if(!((m.players[0]===me&&(el>=PREP_MS||both))||el>=PREP_MS+6000)) return;
  PV.busy=true; const [a,b]=m.players,ua=m.u[a],ub=m.u[b],first=pvEff(ua,'spd')>=pvEff(ub,'spd')?a:b;
  pvpUpd({state:'fight',turn:first,first,round:1,turnAt:pvpTS(),log:(m.log||[]).concat(['⚔ Le duel commence ! '+m.names[first]+' agit en premier.']).slice(-40)}).finally(()=>{PV.busy=false});
}
function rdPrepCheck(){
  const m=RD.match; if(!m||m.state!=='prep'||RD.busy) return; const me=pvpMe(),el=Date.now()-tsMs(m.prepAt),both=m.players.every(p=>m.ready&&m.ready[p]);
  if(!((m.players[0]===me&&(el>=PREP_MS||both))||el>=PREP_MS+6000)) return;
  const r=RAIDS.find(x=>x.id===m.boss); if(!r) return; RD.busy=true;
  const u=JSON.parse(JSON.stringify(m.u)),order=[...m.players,'boss'].sort((a,b)=>pvEff(u[b],'spd')-pvEff(u[a],'spd'));
  const x={m:Object.assign({},m,{order,idx:order.length-1}),me,u,L:['☠ Le raid commence : '+r.n+' (palier +'+(m.tier||0)+') !'],round:0};
  const nx=rdNext(x); rdCommit(x,Object.assign({state:'fight',order,first:order[0]},nx)).finally(()=>{RD.busy=false});
}
function fchatHTML(m,k){
  const me=pvpMe(),hm=t=>new Date(t||Date.now()).toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'});
  return `<aside class="fchat" aria-label="Chat du combat"><h3>Chat</h3><div class="fclog chlog" aria-live="polite">${(m.chat||[]).slice(-40).map(c=>`<div class="chm ${c.f===me?'me':''}"><small>${esc(c.n||'')} · ${hm(c.ts)}</small><span>${esc(c.t)}</span></div>`).join('')||`<p class="mute frempty">Discutez avec votre ${k==='pvp'?'adversaire':'partenaire'}.</p>`}</div>
    <div class="fradd"><input type="text" id="fcin" data-k="${k}" maxlength="200" placeholder="Votre message…" aria-label="Message du chat de combat"><button class="btn sm pri" data-act="fcSend" data-k="${k}">Envoyer</button></div></aside>`;
}
function keepFc(w,fn){
  const ci=w.querySelector('#fcin'),v=ci?ci.value:'',foc=!!ci&&document.activeElement===ci,ss=ci?ci.selectionStart:0;
  fn();
  const ni=w.querySelector('#fcin'); if(ni){ ni.value=v; if(foc){ ni.focus(); try{ni.setSelectionRange(ss,ss)}catch(e){} } }
  const cl=w.querySelector('.fclog'); if(cl) cl.scrollTop=cl.scrollHeight;
}
async function fcSend(k){
  const i=$('#fcin'); if(!i) return; const t=(i.value||'').trim().slice(0,200); if(!t) return;
  const m=k==='raid'?RD.match:PV.match; if(!m||!FB.user) return; i.value='';
  const col=k==='raid'?rdCol():pvpCol();
  try{ await col.doc(m.id).update({chat:firebase.firestore.FieldValue.arrayUnion({f:pvpMe(),n:FB.prof.name,t,ts:Date.now()})}) }catch(e){ toast('Message non envoyé ('+(e.code||'erreur')+').') }
}
function pvCard(u,name,me,turn,pid){
  if(!u) return `<div class="pvcard wait"><b>${esc(name||'?')}</b><small>En attente…</small></div>`;
  const aps=Array.from({length:u.maxAp||0},(_,i)=>`<i class="${i<u.ap?'on':''}"></i>`).join(''),sts=stHTML(unitSts(u));
  return `<div class="pvcard ${me?'me':''} ${turn?'turn':''} ${u.hp<=0?'dead':''} ${u.boss?'boss':''} ${u.left?'left':''}" ${pid?`data-pu="${pid}"`:''}>${PORTRAIT[u.cls]?`<img src="${PORTRAIT[u.cls]}" alt="" width="84" height="84">`:u.boss?`<span class="tile xl" style="--h:40">${icon('boss')}</span>`:''}<b>${esc(u.acct)}</b><small>${u.boss?`Boss de raid · niv. ${u.lvl}`:`${esc(u.name)} · ${(CLASSES[u.cls]||{n:''}).n} niv. ${u.lvl}`}${u.left?' · a abandonné':''}</small>
    <div class="hp"><i style="width:${Math.max(0,u.hp/u.maxHp*100)}%"></i>${(()=>{const m=u.maxHp||1,sh=Math.min(Math.max(0,u.shield||0),m),st=Math.min(Math.max(0,u.hp),m-sh);return sh>0?`<b class="shl" style="left:${st/m*100}%;width:${sh/m*100}%"></b>`:''})()}<span>${Math.ceil(u.hp)} / ${Math.ceil(u.maxHp)}${u.shield>0?' (+'+Math.ceil(u.shield)+')':''}</span></div><div class="apbar" title="${u.ap} / ${u.maxAp} PA">${aps}</div><div class="stt sti">${sts}</div></div>`;
}
function pvpTimer(){
  const m=PV.match; if(!m) return; const el=document.querySelector('#pvp [data-pvt]');
  if(m.state==='confirm'){ const left=45-Math.floor((Date.now()-(m.cms||Date.now()))/1000); if(left<=0) return renderPvp(); if(el) el.textContent='('+left+' s)'; return }
  if(m.state==='prep'){ const e2=document.querySelector('#pvp [data-prep]'); if(e2) e2.textContent=Math.max(0,Math.ceil((PREP_MS-(Date.now()-tsMs(m.prepAt)))/1000))+' s'; pvPrepCheck(); return }
  if(m.state==='fight'){ const t=Math.max(0,PVP_TURN-Math.floor((Date.now()-tsMs(m.turnAt))/1000)); if(el) el.textContent='('+t+' s)'; if(t===0&&m.turn!==pvpMe()&&!document.querySelector('[data-act=pvpClaim]')) renderPvp() }
}
function renderPvp(){
  const m=PV.match; let w=$('#pvp');
  if(!m||!FB.user){ if(w) w.remove(); return }
  if(!w){ w=document.createElement('div'); w.id='pvp'; w.className='modal pvpm'; w.setAttribute('role','dialog'); w.setAttribute('aria-modal','true'); document.body.append(w) }
  const me=pvpMe(),o=pvpOp(m),nm=m.names||{},ch=(m.chars||{})[o];
  if(m.state==='confirm'){
    const left=Math.max(0,45-Math.floor((Date.now()-(m.cms||Date.now()))/1000)),mine=m.acc&&m.acc[me];
    if(left<=0&&m.state==='confirm'){ if(m.from===me) pvpUpd({state:'cancel',by:me}); PV.match=null; w.remove(); return }
    w.innerHTML=`<div class="box pvconf"><h2>${m.kind==='friend'?(m.from===me?'Demande de duel envoyée':'Demande de duel'):'Adversaire trouvé !'}</h2>
      <p><b>${esc(nm[o]||'?')}</b>${ch?` · ${esc(ch.name)}, ${(CLASSES[ch.cls]||{n:''}).n} niveau ${ch.lvl}`:''}</p>
      <p class="mute">${mine?(m.acc&&m.acc[o]?'Le duel va commencer…':'En attente de la réponse de votre adversaire…'):'Acceptez-vous le duel ?'} <span class="num" data-pvt>(${left} s)</span></p>
      <div class="row">${mine?'':'<button class="btn pri" data-act="pvpAcc">Accepter</button>'}<button class="btn" data-act="pvpRef">${mine?'Annuler':'Refuser'}</button></div></div>`;
    return;
  }
  if(m.state!=='fight'&&m.state!=='done'&&m.state!=='prep'){ w.remove(); return }
  const U=m.u[me],T=m.u[o],my=m.state==='fight'&&m.turn===me,late=m.state==='fight'&&!my&&Date.now()-tsMs(m.turnAt)>PVP_TURN*1000,tl=Math.max(0,PVP_TURN-Math.floor((Date.now()-tsMs(m.turnAt))/1000));
  let acts='';
  if(m.state==='done') acts=`<div class="pvwin">🏆 ${esc(nm[m.winner]||'')} remporte le duel !</div>`;
  else if(m.state==='prep') acts=prepActs(U,'pvp',m);
  else if(my&&U.stun) acts=`<p class="mute">Vous ne pouvez pas agir ce tour (étourdi, paralysé ou en incantation).</p><div class="row"><button class="btn endturn" data-act="pvpEndT">Fin de tour</button></div>`;
  else if(my) acts=fActs(U,'pvp',m.round); else acts=`<p class="mute">Tour de <b>${esc(nm[o]||'')}</b>… <span class="num" data-pvt>(${tl} s)</span></p>${late?'<div class="row"><button class="btn pri" data-act="pvpClaim">Réclamer la victoire (adversaire inactif)</button></div>':''}`;
  keepFc(w,()=>{ w.innerHTML=`<div class="box pvbox fbox ftbox"><div class="fgrid"><div class="fmain">${fArena(m,'pvp')}</div>${fchatHTML(m,'pvp')}</div></div>` });
  const lg=w.querySelector('.pvlog'); if(lg) lg.scrollTop=lg.scrollHeight; hpFloats(w,m,PV);
}
function viewPvp(){
  const on=!!(FB.user&&FB.prof),S0=S.pvp||{w:0,l:0};
  return `<section class="panel pvpanel"><h2 style="margin-bottom:6px">Duel PvP</h2>
    <p class="hint" style="margin-bottom:12px">Affrontez un autre joueur au tour par tour avec votre personnage actuel. Chaque joueur agit à son tour : compétences, PA et potions. Victoire : <b>+${PVP_GOLD} or</b>.</p>
    ${!on?'<p class="lerr">Connectez-vous à un compte (menu) pour faire des duels.</p>':PV.searching?`<div class="pvsearch"><span class="spin" aria-hidden="true"></span><b>Recherche d’un adversaire…</b><button class="btn" data-act="pvpCancel">Annuler</button></div>`:`<button class="btn pri big" data-act="pvpFind" style="max-width:320px">⚔ Rechercher un adversaire</button>`}
    <p class="mute" style="margin-top:12px">Bilan : <b>${S0.w}</b> victoire${S0.w>1?'s':''} · <b>${S0.l}</b> défaite${S0.l>1?'s':''}</p>
    <p class="hint">Vous pouvez aussi défier un ami : cliquez sur son nom dans la liste d’amis, puis sur « Duel ». Un joueur qui ne joue pas pendant ${PVP_TURN} secondes peut être déclaré perdant.</p></section>`;
}

