/* Cendrelame · ui/ecrans-connexion-creation.js */
/* --- connexion --- */
function viewLogin(){
  const m=UI.lmode||'login',busy=UI.lbusy,dis=busy||!FB.ready?'disabled':'';
  const st=FB.fail?`<p class="lerr">Connexion indisponible ici (aperçu ou hors ligne). Vous pouvez jouer sans compte : la sauvegarde reste sur cet appareil.</p>`:!FB.ready?'<p class="lhint">Connexion au serveur…</p>':'';
  const title=m==='signup'?'Créer un compte':m==='reset'?'Mot de passe oublié':'Connexion';
  return `<div class="menuscr"><div class="brand">Cendrelame</div>
    <form class="lbox" data-form="${m}">
      <h2>${title}</h2>${st}
      <label>E-mail<input type="email" id="lemail" autocomplete="email" value="${esc(UI.lemail||'')}" required></label>
      ${m!=='reset'?`<label>Mot de passe<input type="password" id="lpass" autocomplete="${m==='signup'?'new-password':'current-password'}" minlength="6" required></label>`:''}
      ${m==='signup'?'<label>Confirmer le mot de passe<input type="password" id="lpass2" autocomplete="new-password" minlength="6" required></label>':''}
      ${UI.lerr?`<p class="lerr" role="alert">${esc(UI.lerr)}</p>`:''}${UI.lok?`<p class="lok" role="status">${esc(UI.lok)}</p>`:''}
      <button class="btn pri big" data-act="fbSubmit" ${dis}>${busy?'Patientez…':m==='signup'?'Créer mon compte':m==='reset'?'Envoyer le lien':'Se connecter'}</button>
      ${m==='login'?`<div class="lrow"><button class="lnk" type="button" data-act="lmode" data-m="reset">Mot de passe oublié ?</button><button class="lnk" type="button" data-act="lmode" data-m="signup">Créer un compte</button></div>`:`<div class="lrow"><button class="lnk" type="button" data-act="lmode" data-m="login">‹ Retour à la connexion</button></div>`}
      ${m!=='reset'?`<div class="lsep"><span>ou</span></div><button class="btn gbtn" type="button" data-act="fbGoogle" ${dis}><svg viewBox="0 0 48 48" aria-hidden="true"><path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.6 5.4 2.7 13.3l7.9 6.1C12.5 13.6 17.8 9.5 24 9.5z"/><path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.7 6c4.5-4.2 6.9-10.3 6.9-17.7z"/><path fill="#FBBC05" d="M10.6 28.6c-.5-1.4-.8-3-.8-4.6s.3-3.2.8-4.6l-7.9-6.1C1 16.6 0 20.2 0 24s1 7.4 2.7 10.7l7.9-6.1z"/><path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.7-6c-2.2 1.5-5 2.3-8.2 2.3-6.2 0-11.5-4.1-13.4-9.9l-7.9 6.1C6.6 42.6 14.6 48 24 48z"/></svg>Continuer avec Google</button>`:''}
      <button class="lnk loff" type="button" data-act="fbOffline">Jouer sans compte</button>
    </form></div>`;
}
const FB_ERR={'auth/invalid-email':'Adresse e-mail invalide.','auth/user-not-found':'Aucun compte avec cet e-mail.','auth/wrong-password':'Mot de passe incorrect.','auth/invalid-credential':'E-mail ou mot de passe incorrect.','auth/invalid-login-credentials':'E-mail ou mot de passe incorrect.','auth/email-already-in-use':'Un compte existe déjà avec cet e-mail.','auth/weak-password':'Mot de passe trop faible (6 caractères minimum).','auth/popup-closed-by-user':'Fenêtre Google fermée avant la fin.','auth/cancelled-popup-request':'Connexion Google annulée.','auth/popup-blocked':'Fenêtre bloquée par le navigateur : autorisez les pop-ups.','auth/unauthorized-domain':'Ce site n’est pas autorisé dans Firebase (Domaines autorisés).','auth/network-request-failed':'Problème de réseau. Réessayez.','auth/too-many-requests':'Trop de tentatives : réessayez dans quelques minutes.','auth/operation-not-allowed':'Cette méthode de connexion n’est pas activée dans Firebase.','auth/missing-password':'Entrez votre mot de passe.'};
const fbErr=e=>FB_ERR[e&&e.code]||('Erreur : '+((e&&(e.code||e.message))||'inconnue'));
const backBtn=(to='menu')=>to==='menu'&&UI.fromGame&&S&&S.heroes&&S.heroes.length?`<button class="btn" data-act="backGame">‹ Retour au jeu</button>`:`<button class="btn" data-act="scr" data-s="${to}">‹ Retour</button>`;
function closeMenuDD(){const d=$('#menudd'); if(d) d.remove(); const b=$('#menubtn'); if(b) b.setAttribute('aria-expanded','false')}
function startChar(i){
  C.abort=true;C.id++;C.phase='idle';C.result=null;
  ACC.cur=i; saveAcc(); MIG_MSG='';
  S=loadSave();
  if(!S){S=newGame(); S.gold=ACC.gold; return false}
  S.gold=ACC.gold; bootChar(); try{ cbClamp(); sChMig() }catch(e){} return true;
}
function bootChar(){
  const away=(Date.now()-S.last)/1000;
  S.last=Date.now();
  {const P=prog();UI.zone=P.zone; UI.stage=P.stage;}
  if(MIG_MSG){const m=MIG_MSG;MIG_MSG='';setTimeout(()=>toast(m),900)}
  S.speed=Math.min(3,S.speed||1);
  const fixL=it=>{ if(it&&!it.mat&&/^Jambières de (plates|soie)/.test(it.base||'')){it.name=it.name.replace(/^Jambières de (plates|soie)/,'Jambières');it.base='Jambières'} };
  S.bag.forEach(e=>fixL(e.o)); for(const h of S.heroes) Object.values(h.equip||{}).forEach(fixL);
  for(const h of S.heroes){ const ok=new Set(heroSkills(h).filter(x=>x.t==='a').map(x=>x.id)); h.loadout=(h.loadout||[]).filter(id=>ok.has(id)&&h.learned[id]).slice(0,LOADOUT_MAX); if(!h.loadout.length){ const f=heroSkills(h).find(x=>x.t==='a'&&h.learned[x.id]); if(f) h.loadout=[f.id] } }
  for(const h of S.heroes) if(h.lvl>MAXL){h.lvl=MAXL;h.xp=0}
  {const lg=it=>{if(it&&!it.mat&&it.rarity>=4&&it.rarity<6&&!it.leg) it.leg=it.slot}; S.bag.forEach(e=>lg(e.o)); for(const h of S.heroes) Object.values(h.equip||{}).forEach(lg)}
  {let cut=0; for(const k of Object.keys(S.mats||{})) if(S.mats[k]>matCap(k)){cut++; S.mats[k]=matCap(k)}
   if(cut) setTimeout(()=>toast(`Stock maximum réduit à ${MATCAP.toLocaleString('fr-FR')} par matériau : les surplus ont été retirés.`),1600)}
  { S.bag=S.bag.filter(e=>!(e.o.mat&&HARV.includes(e.o.mat))); if(S.mats) for(const k of HARV) delete S.mats[k]; if(ACC.stash&&ACC.stash.tabs) for(const T of ACC.stash.tabs) T.bag=(T.bag||[]).filter(e=>!(e.o&&e.o.mat&&HARV.includes(e.o.mat))); }
  craftMigrate(); { const so=it=>{ if(it&&!it.mat&&it.aff) it.aff=affOrd(it.aff) }; S.bag.forEach(e=>so(e.o)); for(const h of S.heroes) Object.values(h.equip||{}).forEach(so); }
  { const fx=it=>{ if(it&&!it.mat&&it.req==null) it.req=it.ilvl }; S.bag.forEach(e=>fx(e.o)); for(const h of S.heroes) Object.values(h.equip||{}).forEach(fx);
    for(const h of S.heroes){ const r=(h.learned||{}).m_bar||0; if(r>1){ h.sp=(h.sp||0)+r-1; h.learned.m_bar=1 } } }
  if((S.siteV||1)===2){ let ref=0; for(const si of SITES){const st=S.sites[si.id]; if(!st||!st.tal) continue; const t=st.tal;
      for(let r=0;r<(t.qty||0);r++) ref+=talCost(si.id,'qty',r); if(t.qtyX) ref+=talCost(si.id,'qtyX',0); delete t.qty; delete t.qtyX}
    S.siteV=3; if(ref){S.gold+=ref; setTimeout(()=>toast(`La branche Rendement est remplacée par une branche par ressource : ${fmt(ref)} or remboursés.`),1400)} }
  if((S.siteV||1)<2){ let ref=0; for(const si of SITES){const st=S.sites[si.id]; if(!st) continue; for(let l=1;l<(st.lvl||0);l++) ref+=siteUpCost(l); if(st.lvl>1) st.lvl=1; st.tal=st.tal||{};
      for(const m of Object.keys(st.stock||{})) st.stock[m]=Math.min(st.stock[m],siteCap(si,st,m))}
    S.siteV=3; if(ref){S.gold+=ref; setTimeout(()=>toast(`Collecte refaite : les niveaux de zone sont remplacés par un arbre d’améliorations. ${fmt(ref)} or remboursés.`),1200)} }
  Object.assign(UI,{tab:'combat',siteTree:null,siteOpt:null,bagSel:null,invSel:null,fItem:null,fLast:null,confirm:null,multi:false,pick:new Set(),hero:null,invHero:null});
  save();
}

/* --- création --- */

/* --- combat --- */
const unlocked=(z,s)=>{const P=prog();return z<P.zone||(z===P.zone&&s<=P.stage)};
const cvPort=(u,sz)=>u.team==='h'&&u.hero&&PORTRAIT[u.hero.cls]?`<img class="cvp" src="${PORTRAIT[u.hero.cls]}" alt="" width="${sz}" height="${sz}">`:u.team!=='h'&&foeImgRel(u)?`<img class="cvp cvfoe" src="${imgSrc(foeImgRel(u))}" alt="" width="${sz}" height="${sz}">`:`<span class="tile cvt" style="--h:${u.hue}">${icon(u.ic)}</span>`;
function initBar(){
  const ids=(C.order&&C.order.length?C.order:alive(C.units).sort((a,b)=>effStat(b,'spd')-effStat(a,'spd')).map(u=>u.id)),list=ids.map(id=>C.units.find(u=>u.id===id)).filter(Boolean);
  return `<span class="mute">Ordre du tour</span>${list.map(u=>`<span class="cvo ${u.team==='h'?'ally':'foe'} ${C.turn===u.id?'now':''} ${u.hp<=0?'dead':''}" ${ttip(u.name)}>${cvPort(u,34)}</span>`).join('<i aria-hidden="true">›</i>')}`;
}
function renderInit(){ const el=$('#cvinit'); if(el) el.innerHTML=initBar() }
function viewCombat0(){
  if(C.phase==='idle') return viewCombatIdle();
  const al=C.units.filter(u=>u.team==='h'),en=C.units.filter(u=>u.team==='e');
  const card=u=>`<div class="unit cvu ${u.team==='h'?'ally':'foe'} ${u.boss?'boss':''}" data-u="${u.id}" data-act="pick" style="--h:${u.hue}">${cvPort(u,76)}<div class="cvinfo"><b>${esc(u.name)}</b><small>Niveau ${u.lvl}${u.boss?' · Boss':''}</small><div class="hp"><i></i><b class="shl"></b><span></span></div><div class="apbar" aria-label="Points d’action">${Array.from({length:u.maxAp||0},()=>"<i></i>").join("")}</div><div class="stt"></div></div><div class="fl"></div></div>`;
  return `<div class="cv cv1"><div class="cvhead"><h2>${ZONES[C.zone].n} · étape ${C.stage}${C.stage===10?' · Boss':''}${C.hero?` <span class="herotag ${C.diff}">${DIFF[C.diff].n}</span>`:''}</h2><span class="cvround num">Tour <b>${C.round}</b></span></div>
    <div class="cvinit" id="cvinit">${initBar()}</div>
    <div class="cv1scene"><div class="cv1side">${al.map(card).join('')}</div><div class="cv1vs">VS</div><div class="cv1side">${en.map(card).join('')}</div></div>
    <div id="actbar" class="cvbar"></div>
    <div class="log" id="log">${C.logs.map(l=>`<p class="${l.cls}">${esc(l.t)}</p>`).join('')}</div></div>`;
}
