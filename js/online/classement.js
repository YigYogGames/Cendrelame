/* Cendrelame · online/classement.js */
/* ===================== 0.5.0 : CLASSEMENT ===================== */
const RK={tab:'duel',sel:null,list:null,busy:false,err:'',ts:0,boss:null,insp:null,final:null};
const rkCol=()=>FB.db.collection(COL('ranks'));
const rkSeason=()=>{ const n=(FB.season&&+FB.season.n)||ACC.season||0,r=(FB.season&&+FB.season.rkr)||0; return r?Math.round((n+r/1000)*1000)/1000:n };
function rkAcc(){ const n=rkSeason(); if(!ACC.rk||ACC.rk.s!==n) ACC.rk={s:n,w:0,l:0,raid:{},deq:null}; return ACC.rk }
function eqSnap(){ const h=S&&S.heroes&&S.heroes[0]; if(!h) return null; const s=heroStats(h),pick={};
  for(const k of ['hp','atk','mag','spd','crit','critDmg','dodge','lifesteal','ap','def','res',...RES_K]) pick[k]=Math.round((s[k]||0)*10)/10;
  return {name:h.name,cls:h.cls,skin:h.skin||null,lvl:h.lvl,eq:JSON.parse(JSON.stringify(h.equip||{})),st:pick,pw:Math.round(heroPower(h)),ts:Date.now()} }
let RK_LAST='',RK_T=0;
function rkPush(force){
  if(!FB.user||!FB.prof||!S||!S.heroes||!S.heroes[0]) return; const R=rkAcc(),cur=eqSnap();
  const sig=JSON.stringify([R,cur&&cur.eq,cur&&cur.lvl,cardMine()]); if(!force&&sig===RK_LAST&&Date.now()-RK_T<15*60e3) return; RK_LAST=sig; RK_T=Date.now();
  rkCol().doc(FB.user.uid).set({name:FB.prof.name,card:cardMine(),season:R.s,duel:{w:R.w,l:R.l},deq:R.deq||null,raid:R.raid||{},cur,ts:Date.now()},{merge:true}).catch(()=>{});
}
function rkDuel(win){ const R=rkAcc(); if(win){ R.w++; R.deq=eqSnap() } else R.l++; saveAcc(); rkPush(true) }
function rkRaid(id,tier,turns){ const R=rkAcc(),b=R.raid[id]; if(!b||tier>b.t||(tier===b.t&&turns<b.turns)){ R.raid[id]={t:tier,turns:Math.max(1,turns|0),eq:eqSnap()}; saveAcc(); rkPush(true) } }
async function rkLoad(){
  if(!FB.user){ RK.err='off'; RK.list=[]; return } if(RK.busy) return; RK.busy=true; RK.err='';
  try{ rkPush(true); const qs=await rkCol().where('season','==',rkSeason()).get(); RK.list=qs.docs.map(d=>Object.assign({uid:d.id},d.data())); RK.ts=Date.now();
    try{ const f=await FB.db.collection(COL('config')).doc('rankfinal_'+rkSeason()).get(); RK.final=f.exists?f.data():null }catch(e){}
  }catch(e){ RK.err=(e&&e.code)||'erreur'; RK.list=RK.list||[] }
  RK.busy=false; if(UI.tab==='comm'&&UI.commT==='rank'&&!UI.scr){ const y=scrollY; render(); scrollTo(0,y) }
}
const rkDuelL=()=>(RK.list||[]).filter(p=>p.duel&&(p.duel.w+p.duel.l)>0).sort((a,b)=>b.duel.w-a.duel.w||(b.duel.w/(b.duel.w+b.duel.l))-(a.duel.w/(a.duel.w+a.duel.l))||a.duel.l-b.duel.l);
const rkRaidL=id=>(RK.list||[]).filter(p=>p.raid&&p.raid[id]).sort((a,b)=>b.raid[id].t-a.raid[id].t||a.raid[id].turns-b.raid[id].turns);
const MEDC={1:['#f0c040','#fff3b0','#a0761a'],2:['#d8dde6','#ffffff','#7a808c'],3:['#d08a4a','#ffd2a0','#7a4a1a']};
function rkMedal(r){ if(r>3) return `<span class="rkpos">${r}</span>`; const [c,l,d]=MEDC[r]; return `<span class="rkmedal" aria-label="${r}e"><svg viewBox="0 0 44 44" aria-hidden="true"><path d="M12 2h8l4 12-6 2zM32 2h-8l-4 12 6 2z" fill="#7b2a1a"/><circle cx="22" cy="27" r="14" fill="${c}" stroke="${d}" stroke-width="2.5"/><circle cx="22" cy="27" r="10" fill="none" stroke="${l}" stroke-width="1.5" opacity=".8"/></svg><b>${r}</b></span>` }
function rkBan(p,r,kind,boss){
  const me=FB.user&&p.uid===FB.user.uid,d=Object.assign({name:p.name,icon:'c:guerrier',fr:0,bg:3},p.card||{},{name:p.name||(p.card&&p.card.name)||'?'}),key=p.uid+'|'+(boss||'duel'),sel=RK.sel===key;
  const sub=kind==='duel'?(d.title?'« '+esc(d.title)+' »':''):`Palier +${p.raid[boss].t} en ${p.raid[boss].turns} tour${p.raid[boss].turns>1?'s':''}`;
  const st=kind==='duel'?`<div class="rkst"><span class="w"><small>Victoires</small><b class="num">${p.duel.w}</b></span><span class="l"><small>Défaites</small><b class="num">${p.duel.l}</b></span><span class="p"><small>Réussite</small><b class="num">${Math.round(p.duel.w/(p.duel.w+p.duel.l)*100)} %</b></span></div>`:'';
  return `<div class="rkb ${r<=3?'r'+r:r<=10?'top10':''} ${me?'me':''} ${sel?'sel':''} ${kind==='raid'?'sm':''}" data-act="rkSel" data-k="${esc(key)}" role="button" tabindex="0" aria-pressed="${sel}" ${pcFxAttr(d)}><div class="rkbg">${zoneScene(d.bg??3,'rk'+(boss||'d')+r)}</div>${rkMedal(r)}<span class="rkav">${pcIcon(d.icon,kind==='raid'?40:52)}</span><div class="rknm"><b>${esc(d.name)}${me?' (vous)':''}</b><small>${sub}</small></div>${st}
   <div class="rkacts"><button data-act="rkInsp" data-k="${esc(key)}" ${ttip('Inspecter l’équipement',kind==='duel'?'Équipement lors de sa dernière victoire en duel.':'Équipement au moment de ce record.')}>${uic('helm')}</button><button data-act="rkCard" data-k="${esc(key)}" ${ttip('Carte du joueur')}>${uic('card')}</button></div></div>`;
}
function rkEndTxt(){ const e=FB.season&&+FB.season.end; if(RK.final) return 'Classement final arrêté : les récompenses de saison sont attribuées selon ces positions.'; if(e&&e>Date.now()){ const j=Math.ceil((e-Date.now())/864e5); return `Fin de saison dans <b>${j} jour${j>1?'s':''}</b>. Le classement final est arrêté juste avant la fin de saison pour attribuer les récompenses.` } return 'Le classement final est arrêté juste avant la fin de saison pour attribuer les récompenses.' }
function viewRank(){
  if(!FB.user) return `<div class="rkempty">${uic('podium')}<p>Connectez-vous à un compte en ligne pour voir le classement de la saison.</p><button class="btn pri" data-act="scr" data-s="login">Se connecter</button></div>`;
  if(RK.list==null||Date.now()-RK.ts>60e3&&!RK.busy&&!RK.auto){ RK.auto=true; setTimeout(()=>{ RK.auto=false; rkLoad() },0) }
  const t=RK.tab;
  const head=`<div class="rkhead"><div class="rktabs" role="tablist"><button class="${t==='duel'?'on':''}" data-act="rkTab" data-t="duel" role="tab" aria-selected="${t==='duel'}">${uic('swords')}Duels</button><button class="${t==='raid'?'on':''}" data-act="rkTab" data-t="raid" role="tab" aria-selected="${t==='raid'}">${uic('skull')}Défis</button></div><span class="rkupd">${uic('auto')}${RK.busy?'Mise à jour…':RK.ts?'Mis à jour à '+new Date(RK.ts).toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'}):''}</span></div>
   <div class="rkend">${uic('trophy')}<span>${esc(seasonTitle())} · ${rkEndTxt()}</span></div>${RK.err&&RK.err!=='off'?`<p class="lerr">Classement indisponible (${esc(RK.err)}). Vérifiez la règle Firestore de la collection ranks.</p>`:''}`;
  const meRow=(L,boss,kind)=>{ const i=L.findIndex(p=>p.uid===FB.user.uid); return i>=10?`<div class="rkgap">· · ·</div>${rkBan(L[i],i+1,kind,boss)}`:'' };
  if(t==='duel'){ const L=rkDuelL(); return head+`<div class="rklist">${L.slice(0,10).map((p,i)=>rkBan(p,i+1,'duel')).join('')||'<p class="rknone">Aucun duel cette saison pour l’instant.</p>'}${meRow(L,null,'duel')}</div>` }
  return head+`<div class="rkcols">${RAIDS.map(R=>{const L=rkRaidL(R.id);return `<div class="rkcol"><header>${zoneScene(raidSc(R),'rkc'+R.id)}<b>${esc(R.n)}</b><small>Niv. ${R.L}</small></header><div class="rkls">${L.slice(0,10).map((p,i)=>rkBan(p,i+1,'raid',R.id)).join('')||'<p class="rknone">Aucun palier réussi.</p>'}${meRow(L,R.id,'raid')}</div></div>`}).join('')}</div>`;
}
function rkFind(key){ const [uid,b]=String(key).split('|'); return {p:(RK.list||[]).find(x=>x.uid===uid),b} }
function inspHTML(snap,label){
  const s=snap.st||{},c=CLASSES[snap.cls]||CLASSES.guerrier,ms=c.role==='mag'?['Intelligence',s.mag]:['Force',s.atk];
  const g=(t,a)=>`<h4>${t}</h4>`+a.map(([n,x])=>`<div><span>${n}</span><b class="num">${x}</b></div>`).join('');
  const sl=k=>{const it=snap.eq&&snap.eq[k];return `<span class="dslot ${it?'full':''}" data-tip="ri:${k}" style="${it?`--rc:var(--r${it.rarity})`:''}">${eqIco(it,k)}${it&&it.up?`<em>+${it.up}</em>`:''}${it?`${it.rarity>=2?`<i class="rfx r${it.rarity}"></i>`:''}<em class="il">${it.ilvl}</em>`:''}</span>`};
  return `<div class="inspw" role="dialog" aria-label="Équipement de ${esc(snap.name)}"><header>${uic('helm')}<span><b>Équipement de ${esc(snap.name)}</b><br><small>${label?`<span class="insptag">${label}</span>`:'Équipement actuel'}</small></span><button class="inspx" data-act="inspClose" ${ttip('Fermer')}>×</button></header>
   <div class="inspg"><div class="nst">${g('Principale',[['PV',Math.round(s.hp||0)],[ms[0],Math.round(ms[1]||0)]])}${g('Secondaire',[['Vitesse',Math.round(s.spd||0)],['Critique',r1(s.crit||0)+' %'],['Dégâts critiques',Math.round(s.critDmg||0)+' %'],['Esquive',r1(s.dodge||0)+' %'],['Vol de vie',r1(s.lifesteal||0)+' %'],['Points d’action',s.ap||0]])}${g('Défense',[['Défense physique',Math.round(s.def||0)],['Défense magique',Math.round(s.res||0)]])}${g('Résistances',RES_K.map(k=>[STAT_N[k].replace('Résistance ','Rés. '),r1(s[k]||0)+' %']))}<div class="pw"><span>Puissance</span><b class="num">${fmt(snap.pw||0)}</b></div></div>
   <div class="ndl"><div class="c">${['helm','armor','legs','boots'].map(sl).join('')}</div><div class="av">${zoneScene(3,'insp')}<span class="ring"></span>${heroArt(snap.cls,snap.skin)}<div class="nm"><b>${esc(snap.name)}</b><small>${c.n} · niveau ${snap.lvl}</small></div></div><div class="c">${['amulet','ring','ring2','weapon'].map(sl).join('')}</div></div></div>
   <p class="insph">Survolez un objet pour voir ses statistiques · lecture seule${snap.ts?' · '+new Date(snap.ts).toLocaleDateString('fr-FR'):''}.</p></div>`;
}
function openInsp(snap,label){ if(!snap){ toast('Équipement pas encore disponible pour ce joueur.'); return } RK.insp=snap; let w=$('#inspm'); if(!w){ w=document.createElement('div'); w.id='inspm'; w.className='inspback'; w.addEventListener('click',e=>{ if(e.target===w) A.inspClose() }); document.body.append(w) } w.innerHTML=inspHTML(snap,label) }
document.addEventListener('keydown',e=>{ if(e.key==='Escape'&&$('#inspm')) A.inspClose() });
/* équipement d'un ami (carte flottante) */
async function friendInsp(fid){ const f=FR.list.find(x=>x.id===fid); if(!f) return; const o=f.users.find(x=>x!==FB.user.uid);
  try{ const d=await rkCol().doc(o).get(); openInsp(d.exists?d.data().cur:null,'') }catch(e){ toast('Équipement indisponible ('+((e&&e.code)||'erreur')+').') } }
/* classement final de saison */
async function rkFreeze(n,quiet){
  if(!FB.admin) return; n=n==null?rkSeason():n;
  try{ const qs=await rkCol().where('season','==',n).get(),L=qs.docs.map(d=>Object.assign({uid:d.id},d.data())),prev=RK.list; RK.list=L;
    const out={season:n,ts:Date.now(),duel:rkDuelL().slice(0,100).map((p,i)=>({uid:p.uid,name:p.name,pos:i+1,w:p.duel.w,l:p.duel.l})),raid:{}};
    for(const R of RAIDS) out.raid[R.id]=rkRaidL(R.id).slice(0,100).map((p,i)=>({uid:p.uid,name:p.name,pos:i+1,t:p.raid[R.id].t,turns:p.raid[R.id].turns}));
    RK.list=prev; await FB.db.collection(COL('config')).doc('rankfinal_'+n).set(out); if(!quiet) toast('Classement final de la saison '+n+' enregistré.'); return true
  }catch(e){ if(!quiet) toast('Erreur : '+((e&&e.code)||'inconnue')); return false } }
async function rkAutoFreeze(){ if(!FB.admin) return; const e=FB.season&&+FB.season.end; if(!e) return; if(Date.now()<e-3600e3) return;
  try{ const f=await FB.db.collection(COL('config')).doc('rankfinal_'+rkSeason()).get(); if(!f.exists) await rkFreeze(rkSeason(),false) }catch(x){} }
function rankAdminHTML(){ const e=FB.season&&+FB.season.end,v=e?new Date(e-new Date().getTimezoneOffset()*6e4).toISOString().slice(0,16):'';
  return admCard('podium','Classement de saison','Fin de saison et classement final pour les récompenses',`<label style="display:flex;flex-direction:column;gap:4px">Fin de saison prévue<input class="pcsel" type="datetime-local" id="admsend" value="${v}"></label><small class="mute">Le classement final est figé automatiquement 1 h avant cette date (à l’ouverture du jeu par un administrateur), et toujours juste avant le lancement d’une nouvelle saison.</small><div class="row" style="gap:8px;margin-top:8px"><button class="btn pri" data-act="admSEnd">Enregistrer la date</button><button class="btn" data-act="admRkFreeze">Figer le classement maintenant</button></div>`) }

