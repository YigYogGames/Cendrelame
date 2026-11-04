/* Cendrelame · ui/scene-de-combat.js */
/* ================= combat : scène avec sprites (PvE, duel, raid) ================= */
const ENSP={'Gobelin':{f:'gobelin',h:.74},'Loup affamé':{f:'loup',h:.6,flip:1},'Chaman gobelin':{f:'chaman_gobelin',h:.9}};
UIC.coffre='<path d="M3.5 11V9.5A4.5 4.5 0 0 1 8 5h8a4.5 4.5 0 0 1 4.5 4.5V11"/><rect x="3" y="11" width="18" height="9" rx="1.6"/><path d="M3 14h18"/><rect x="10.3" y="12.2" width="3.4" height="4.6" rx=".9"/><path d="M7 5.6V11M17 5.6V11"/>';
UIC.pause='<rect x="6.5" y="5" width="3.6" height="14" rx="1"/><rect x="13.9" y="5" width="3.6" height="14" rx="1"/>';
UIC.chain='<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>';
Object.assign(UIC,{flask:'<path d="M9 3h6M10 3v6L5 18a2 2 0 0 0 1.8 3h10.4A2 2 0 0 0 19 18l-5-9V3"/><path d="M7.5 14h9"/>',
 auto:'<path d="M20 12a8 8 0 0 1-14 5.3M4 12a8 8 0 0 1 14-5.3"/><path d="M18 3v4h-4M6 21v-4h4"/>',
 xx:'<path d="M6 6l12 12M18 6 6 18"/>'});
const ttip=(t,d)=>`data-tip="${esc('tx:'+t+(d?'|'+d:''))}" aria-label="${esc(t)}"`;
/* image d'un combattant : sprite en pied, sinon portrait / icône dans un médaillon */
function fighterArt(o){
  if(o.cls){ const s=skinOf(o.cls,o.skin),au=o.aura&&COS8K[o.aura]&&COS8K[o.aura].t==='aura'?auraHTML(o.aura):'';
    if(s) return au+`<img class="fta ${o.foe?'flip':''}" style="--sh:1" src="${s.src}" alt="" onerror="this.outerHTML='<span class=&quot;ftmed&quot;><img src=&quot;${PORTRAIT[o.cls]||''}&quot; alt=&quot;&quot;></span>'">`;
    return au+`<span class="ftmed"><img src="${PORTRAIT[o.cls]||''}" alt=""></span>` }
  { const r=foeImgRel(o); if(r) return `<img class="fta" style="--sh:${foeScale(o)}" src="${imgSrc(r)}" alt="">` } const e=!o.boss&&ENSP[o.name];
  if(e) return `<img class="fta ${e.flip?'flip':''}" style="--sh:${e.h}" src="assets/img/sprites/${e.f}.webp" alt="" onerror="this.outerHTML='<span class=&quot;ftmed&quot;></span>'">`;
  return `<span class="ftmed ${o.boss?'boss':''}"><span class="tile" style="--h:${o.hue||40}">${icon(o.ic||'boss')}</span></span>`;
}
const ftHp=()=>`<div class="hp"><i></i><b class="shl"></b><span></span></div>`;

/* ---------- sac de combat ---------- */
const CB_LIM={p_vie1:3,p_vie:3,p_vie3:3,p_reg1:1,p_reg2:1,p_res:1,p_for:1,p_int:1,p_pa:1,p_xp:1,p_loot:1};
const cbBag=()=>{ if(!S.cbag||typeof S.cbag!=='object') S.cbag={}; return S.cbag };
const cbCount=k=>(S&&S.cbag&&S.cbag[k])||0;
const cbTake=k=>{ const b=cbBag(); b[k]=Math.max(0,(b[k]||0)-1); if(!b[k]) delete b[k] };
const cbKeys=(cls)=>Object.keys(CB_LIM).filter(k=>POTS[k]&&!POTS[k].nocombat&&(!POTS[k].cls||POTS[k].cls===cls));
const cbTotal=()=>Object.values(S&&S.cbag||{}).reduce((a,b)=>a+b,0);
const cbBusy=()=>inFight()||[PV.match,RD.match].some(m=>m&&['prep','fight'].includes(m.state));
function cbIn(k,n){
  if(cbBusy()){ toast('Impossible pendant un combat.'); return }
  const room=CB_LIM[k]-cbCount(k),have=matAll(k),q=Math.min(n,room,have);
  if(q<=0){ toast(room<=0?'Limite atteinte pour cette potion.':'Vous n’avez plus de cette potion.'); return }
  removeMat(k,q); cbBag()[k]=cbCount(k)+q; save(); renderInvPop();
}
function cbOut(k,n){
  if(cbBusy()){ toast('Impossible pendant un combat.'); return }
  const q=Math.min(n,cbCount(k)); if(q<=0) return;
  if(matRoom(k)<q){ toast('Inventaire plein.'); return }
  bagAddMat(S.bag,k,q); const b=cbBag(); b[k]-=q; if(b[k]<=0) delete b[k]; save(); renderInvPop();
}
function cbPanel(){
  const lock=cbBusy(),h=S.heroes[0];
  const rows=cbKeys(h.cls).map(k=>{const P=POTS[k],c=cbCount(k),L=CB_LIM[k],a=matAll(k);
    return `<div class="cbrow"><span class="cbic" data-tip="pot:${k}">${matIcon(k)}</span><span class="cbn"><b>${esc(P.n)}</b><small>Réserve : <span class="num">${fmt(a)}</span></small></span>
     <span class="cbq num ${c>=L?'full':''}"><b>${c}</b>/${L}</span>
     <span class="cbbt"><button class="btn sm" data-act="cbOut" data-k="${k}" ${lock||!c?'disabled':''} ${ttip('Retirer 1','Remet une potion dans l’inventaire.')}>−</button><button class="btn sm" data-act="cbIn" data-k="${k}" data-n="1" ${lock||c>=L||!a?'disabled':''} ${ttip('Ajouter 1','Prend une potion dans l’inventaire ou le coffre.')}>+</button><button class="btn sm pri" data-act="cbIn" data-k="${k}" data-n="99" ${lock||c>=L||!a?'disabled':''} ${ttip('Remplir','Complète jusqu’à la limite.')}>Max</button></span></div>`}).join('');
  return `<section class="ipcbp"><header>${uic('flask')}<b>Sac de combat</b><small class="mute">${lock?'Verrouillé pendant un combat.':'Seules ces potions peuvent être bues en combat.'}</small></header>${rows}</section>`;
}
/* fenêtre des consommables pendant le combat (taille de la zone du bas) */
function cbPopHTML(ctx){
  const L=ctx.keys.map(k=>{const P=POTS[k],q=cbCount(k),st=ctx.state(k),off=!q||st.off;
    return `<button class="cbit ${q?'':'empty'} ${st.off?'cd':''}" data-act="${ctx.act}" data-k="${k}" data-tip="pot:${k}" ${off?'disabled':''}><span class="cbiti">${matIcon(k)}${st.lab?`<span class="cdo">${st.lab}</span>`:''}</span><span class="cbitt"><b>${esc(P.n)}</b><small>${esc(P.d)}</small></span><span class="cbitq num"><b>${q}</b>/${CB_LIM[k]}</span></button>`}).join('');
  return `<div class="cbpop" role="dialog" aria-label="Sac de combat"><header>${uic('flask')}<h3>Sac de combat</h3><small class="mute">Boire une potion n’utilise pas votre tour · remplissez le sac depuis l’inventaire, hors combat</small><button class="cbx" data-act="cbPop" ${ttip('Fermer')}>${uic('xx')}</button></header><div class="cbgrid">${L}</div></div>`;
}
const cbBtn=()=>`<button class="ftbag ${UI.cbOpen?'on':''}" data-act="cbPop" ${ttip('Sac de combat','Ouvre vos consommables. Boire une potion n’utilise pas votre tour.')}>${uic('flask')}<span class="num">${cbTotal()}</span></button>`;

/* ---------- PvE ---------- */
function viewCombat(){
  if(C.phase==='idle') return viewCombatIdle();
  const al=C.units.filter(u=>u.team==='h').slice(0,3),en=C.units.filter(u=>u.team==='e').slice(0,3);
  const U=u=>`<div class="unit ftu ${u.team==='h'?'ally':'foe'} ${u.boss?'boss':''}" data-u="${u.id}" data-act="pick"><div class="ftpl"><b>${esc(u.name)} <small>niv. ${u.lvl}${u.boss?' · Boss':''}</small></b>${ftHp()}<div class="apbar" ${ttip('Points d’action')}>${Array.from({length:u.maxAp||0},()=>'<i></i>').join('')}</div><div class="stt"></div></div><div class="ftfig">${fighterArt(u.hero?{cls:u.hero.cls,skin:u.hero.skin,aura:myAura()}:{name:u.name,boss:u.boss,ic:u.ic,hue:u.hue,foe:1})}<i class="ftgr"></i></div><div class="fl"></div></div>`;
  return `<div class="cv ftc ${UI.cbOpen?'bagopen':''}"><div class="ftwrap"><div class="ftsc">${(C.raid?zoneScene(raidSc(RAIDS.find(x=>x.id===C.raid.r)),'rd'):zoneScene(C.zone,'ft'))}
    <div class="fttop"><h2>${C.raid?`Raid · ${esc(RAIDS.find(x=>x.id===C.raid.r).n)} <small>palier +${C.raid.t} · seul</small>`:`${ZONES[C.zone].n} · étape ${C.stage}${C.stage===10?' · Boss':''}`}${C.hero?` <span class="herotag ${C.diff}">${DIFF[C.diff].n}</span>`:''}</h2><span class="cvround num">Tour <b>${C.round}</b></span></div>
    <div class="cvinit ftinit" id="cvinit">${initBar()}</div><div class="fttools2" id="fttools"></div>
    <div class="ftfield"><div class="ftside l">${al.map(U).join('')}</div><div class="ftside r">${en.map(U).join('')}</div></div></div>
    <button class="ftend" id="ftend" data-act="endTurn"></button></div>
   <div class="ftbot"><div id="actbar" class="ftbar"></div><div class="log" id="log">${C.logs.map(l=>`<p class="${l.cls}">${esc(l.t)}</p>`).join('')}</div><div id="cbslot"></div></div></div>`;
}
function pzMark(){ const f=$('.ftc'); if(!f) return; const on=!!C.paused&&C.phase!=='result'; f.classList.toggle('paused',on); const sc=f.querySelector('.ftsc'); let b=sc&&sc.querySelector('.cpzb'); if(on&&sc&&!b) sc.insertAdjacentHTML('beforeend','<span class="cpzb">En pause</span>'); if(!on&&b) b.remove() }
function ftTools(){ setTimeout(pzMark,0);
  return `<div class="fttools"><button class="ftsq ${S.auto?'on':''}" data-act="auto" aria-pressed="${!!S.auto}" ${ttip('Combat automatique : '+(S.auto?'activé':'désactivé'),'Votre héros joue seul. Cliquez pour '+(S.auto?'reprendre la main.':'l’activer.'))}>${uic('auto')}</button>${S.auto||C.paused?`<button class="ftsq pz ${C.paused?'on':''}" data-act="cPause" aria-pressed="${!!C.paused}" ${ttip(C.paused?'Reprendre le combat':'Mettre en pause',C.paused?'Le combat continue là où il s’était arrêté.':'Le combat s’arrête après l’action en cours. Vous pouvez regarder votre inventaire tranquillement.')}>${uic(C.paused?'play':'pause')}</button>`:''}<button class="ftsq num" data-act="speed" ${ttip('Vitesse ×'+S.speed,'Accélère les animations du combat (×1, ×2, ×3).')}>×${S.speed}</button>${quitBtn('giveUp',UI.confirm==='pveGiveUp')}</div>`;
}
const quitBtn=(act,arm)=>`<button class="ftsq quit ${arm?'arm':''}" data-act="${act}" ${ttip(arm?'Confirmer l’abandon':'Abandonne le combat',arm?'Cliquez à nouveau : le combat sera compté comme une défaite.':'Compté comme une défaite.')}>${uic(arm?'check':'flag')}</button>`;
function ftEnd(b,{act,label,dis,tip}){ if(!b) return; b.hidden=!act; if(!act) return; b.dataset.act=act; b.disabled=!!dis; b.innerHTML=`<span>${label}</span>`; b.dataset.tip='tx:'+tip; b.setAttribute('aria-label',label.replace(/<br>/g,' ')) }
function renderActbar(){
  const el=$('#actbar'); if(!el) return; const end=$('#ftend'),slot=$('#cbslot');
  el.classList.remove('res'); { const tt=$('#fttools'); if(tt) tt.innerHTML=C.phase==='result'?'':ftTools() }
  if(C.phase==='result'){ UI.cbOpen=false; if(slot) slot.innerHTML=''; $('.ftc')&&$('.ftc').classList.remove('bagopen'); renderActbar0(); el.classList.add('res'); ftEnd(end,{}); return }
  const h=C.units.find(x=>x.team==='h'),w=C.waiting,u=w?w.u:h;
  if(C.phase==='prep'){
    el.innerHTML=`${cbBtn()}<div class="ftprep"><b>Préparation <span class="num" data-prep>${Math.max(0,Math.ceil((C.prepEnd-Date.now())/1000))} s</span></b><small>Buvez vos potions avant le début du combat : leurs effets et leur recharge commencent maintenant.</small></div>`;
    ftEnd(end,{act:'prepGo',label:'Combattre',tip:'Commencer le combat|Lance le combat sans attendre la fin de la préparation.'});
  }else{
    const ids=u?['atk',...u.skills]:[];
    el.innerHTML=`${cbBtn()}<div class="skcbar ${w?'':'wait'}">${u?ids.map(id=>cTile(id,u,'skill',C.pending&&C.pending.id===id)).join(''):''}</div>${C.pending?`<button class="btn sm" data-act="cancelPick" ${ttip('Annuler','Annule la compétence en cours de ciblage.')}>Annuler</button>`:''}${w?'':`<small class="ftwait">${S.auto?'Combat automatique en cours…':'Les ennemis agissent…'}</small>`}`;
    ftEnd(end,{act:'endTurn',label:'Fin de<br>tour',dis:!w,tip:'Fin de tour|Termine votre tour. Les PA non utilisés sont perdus.'});
  }
  if(slot){ const keys=ownPotKeys(); slot.innerHTML=UI.cbOpen?cbPopHTML({keys,act:'usePot',state:k=>{const used=(BUFF_K.includes(k)&&buffOn(k)),cd=potLeft(k);return {off:!!(used||cd),lab:cd?potShow(k,cd):used?'✓':''}}}):''; $('.ftc')&&$('.ftc').classList.toggle('bagopen',!!UI.cbOpen) }
}
const ownPotKeys=()=>cbKeys(S.heroes[0].cls);

/* ---------- duel et raid ---------- */
function fArena(m,kind){
  const p=kind==='pvp'?'pvp':'rd',me=pvpMe(),nm=m.names||{},U=m.u[me],r=kind==='raid'?(RAIDS.find(x=>x.id===m.boss)||RAIDS[0]):null;
  const left=kind==='pvp'?[me]:m.players.slice(0,3),right=kind==='pvp'?[pvpOp(m)]:['boss'];
  const my=m.state==='fight'&&m.turn===me,tn=m.turn&&m.u[m.turn];
  const lim=kind==='pvp'?PVP_TURN:RD_TURN,tl=Math.max(0,lim-Math.floor((Date.now()-tsMs(m.turnAt))/1000)),late=m.state==='fight'&&!my&&Date.now()-tsMs(m.turnAt)>lim*1000;
  const unit=(id,foe)=>{const u=m.u[id]; if(!u) return `<div class="ftu wait"><div class="ftpl"><b>${esc(nm[id]||'?')}</b><small>En attente…</small></div></div>`;
    const aps=Array.from({length:u.maxAp||0},(_,i)=>`<i class="${i<u.ap?'on':''}"></i>`).join(''),sh=Math.min(Math.max(0,u.shield||0),u.maxHp||1),st=Math.min(Math.max(0,u.hp),(u.maxHp||1)-sh);
    const sts=stHTML(unitSts(u));
    return `<div class="ftu ${foe?'foe':'ally'} ${id===me?'me':''} ${m.turn===id&&m.state==='fight'?'turn':''} ${u.hp<=0?'dead':''} ${u.boss?'boss':''}" data-pu="${id}"><div class="ftpl"><b>${esc(u.boss?u.name:u.name)} <small>niv. ${u.lvl}</small></b>${u.boss?'':`<small class="ftacct">${esc(u.acct||'')}${u.left?' · parti':''}</small>`}
      <div class="hp"><i style="width:${Math.max(0,u.hp/u.maxHp*100)}%"></i>${sh>0?`<b class="shl" style="left:${st/u.maxHp*100}%;width:${sh/u.maxHp*100}%"></b>`:''}<span>${Math.ceil(Math.max(0,u.hp))} / ${Math.ceil(u.maxHp)}${u.shield>0?' (+'+Math.ceil(u.shield)+')':''}</span></div><div class="apbar" ${ttip('Points d’action',u.ap+' / '+u.maxAp)}>${aps}</div><div class="stt sti">${sts}</div></div>
      <div class="ftfig">${fighterArt(u.boss?{boss:1,ic:'boss',hue:8}:{cls:u.cls,skin:u.skin,foe,aura:u.aura})}<i class="ftgr"></i></div></div>`};
  const ord=kind==='pvp'?(m.state==='fight'||m.state==='done'?[m.turn,m.turn===me?pvpOp(m):me]:[me,pvpOp(m)]):(m.order||[]);
  const init=`<div class="cvinit ftinit"><span class="mute">Ordre du tour</span>${ord.map(id=>{const q=m.u[id];return q?`<span class="cvo ${id==='boss'||(kind==='pvp'&&id!==me)?'foe':'ally'} ${m.turn===id&&m.state==='fight'?'now':''} ${q.hp<=0?'dead':''}" ${ttip(q.boss?q.name:(q.name+' ('+(q.acct||'')+')'))}>${PORTRAIT[q.cls]?`<img class="cvp" src="${PORTRAIT[q.cls]}" alt="" width="34" height="34">`:`<span class="tile cvt" style="--h:40">${icon('boss')}</span>`}</span>`:''}).join('<i aria-hidden="true">›</i>')}</div>`;
  /* barre du bas */
  let bar='',end={};
  const quit=m.state==='fight'&&U&&!U.left?`<div class="fttools">${quitBtn(p+'GiveUp',UI.confirm===(kind==='pvp'?'giveup':'rdgiveup'))}</div>`:'';
  if(m.state==='done'){ bar=`<div class="pvwin">${kind==='pvp'?`🏆 ${esc(nm[m.winner]||'')} remporte le duel !`:m.win?'🏆 Raid réussi !':'💀 Le raid a échoué.'}</div>`; UI.cbOpen=false }
  else if(m.state==='prep'){ const left=Math.max(0,Math.ceil((PREP_MS-(Date.now()-tsMs(m.prepAt)))/1000)),rd=m.ready&&m.ready[me],ot=m.players.filter(x=>x!==me).every(x=>m.ready&&m.ready[x]);
    bar=`${U&&U.hp>0?cbBtn():''}<div class="ftprep"><b>Préparation <span class="num" data-prep>${left} s</span></b><small>${rd?'Prêt — en attente…':'Buvez vos potions avant le début du combat.'}${ot?' Votre '+(kind==='pvp'?'adversaire':'partenaire')+' est prêt.':''}</small></div>`;
    end={act:p+'Ready',label:rd?'Prêt':'Je suis<br>prêt',dis:rd,tip:'Je suis prêt|Le combat commence quand tous les joueurs sont prêts ou à la fin du compte à rebours.'} }
  else if(U&&U.hp<=0) bar=`<small class="ftwait">Votre héros est tombé. Encouragez ${kind==='pvp'?'…':'votre partenaire'} !</small>`;
  else if(my&&U.stun){ bar=`${cbBtn()}<small class="ftwait">Vous ne pouvez pas agir ce tour (étourdi, paralysé ou en incantation).</small>`; end={act:p+'EndT',label:'Fin de<br>tour',tip:'Fin de tour|Termine votre tour.'} }
  else if(my){ bar=`${cbBtn()}<div class="skcbar">${['atk',...U.skills].map(id=>cTile(id,U,p+'Sk')).join('')}</div>`; end={act:p+'EndT',label:'Fin de<br>tour',tip:'Fin de tour|Termine votre tour. Les PA non utilisés sont perdus.'} }
  else { bar=`${cbBtn()}<small class="ftwait">Tour de <b>${esc(tn?(tn.boss?tn.name:(tn.acct||tn.name)):'')}</b>… <span class="num" ${kind==='pvp'?'data-pvt':'data-rdt'}>(${tl} s)</span></small>${late?`<button class="btn sm pri" data-act="${kind==='pvp'?'pvpClaim':'rdSkip'}">${kind==='pvp'?'Réclamer la victoire':'Passer son tour'}</button>`:''}`; end={act:p+'EndT',label:'Fin de<br>tour',dis:1,tip:'Fin de tour|Ce n’est pas votre tour.'} }
  const eb=end.act?`<button class="ftend" data-act="${end.act}" ${end.dis?'disabled':''} data-tip="${esc('tx:'+end.tip)}" aria-label="${esc(end.label.replace(/<br>/g,' '))}"><span>${end.label}</span></button>`:'';
  const pk=U?POT_CK(U.cls):[],paLock=kind==='pvp'&&m.state==='fight'&&(m.round||1)>1;
  const pop=UI.cbOpen&&U&&m.state!=='done'?cbPopHTML({keys:pk,act:p+'Pot',state:k=>{const cd=Math.min((U.pcd||{})[k]||0,POTS[k].cd||99),lk=k==='p_pa'&&paLock;return {off:!!(cd||lk),lab:cd?cd:lk?'✕':''}}}):'';
  const title=kind==='pvp'?`Duel · ${esc(nm[pvpOp(m)]||'')}`:`Raid · ${esc(r.n)} <small>palier +${m.tier||0}</small>`;
  return `<div class="ftc fta2 ${pop?'bagopen':''}"><div class="ftwrap"><div class="ftsc">${kind==='pvp'?zoneScene(6,'pv'):zoneScene(raidSc(r),'rd')}
     <div class="fttop"><h2>${title}</h2><span class="cvround num">Tour <b>${m.round||1}</b></span></div>${init}<div class="fttools2">${quit}</div>
     <div class="ftfield"><div class="ftside l">${left.map(id=>unit(id,false)).join('')}</div><div class="ftside r">${right.map(id=>unit(id,true)).join('')}</div></div></div>${eb}</div>
    <div class="ftbot"><div class="ftbar">${bar}</div><div class="pvlog log">${(m.log||[]).slice(-14).map(l=>`<p>${esc(l)}</p>`).join('')}</div>${pop}</div></div>`;
}

