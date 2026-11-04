/* Cendrelame · online/compte-et-amis.js */
/* ============ compte en ligne (Firebase) ============ */
const FB_CFG={apiKey:"AIzaSyBiwK5ZoeiKysyKl_J2m4WSLJ6ZrrT-ImE",authDomain:"cendrelame-6bbc3.firebaseapp.com",projectId:"cendrelame-6bbc3",storageBucket:"cendrelame-6bbc3.firebasestorage.app",messagingSenderId:"223887525127",appId:"1:223887525127:web:034d1afe49bddc2650f1a2"};
const FB_V='10.12.2';
const FB={ready:false,fail:false,user:null,sync:'',t:null};
function loadJS(src){return new Promise((ok,ko)=>{const s=document.createElement('script');s.src=src;s.async=false;s.onload=ok;s.onerror=ko;document.head.append(s)})}
async function loadFirst(list){for(const u of list){try{await loadJS(u);return}catch(e){}} throw new Error('load')}
async function fbInit(){
  try{
    const timer=new Promise((_,ko)=>setTimeout(()=>ko(new Error('timeout')),9000));
    const load=(async()=>{for(const m of ['app','auth','firestore']) await loadFirst([`https://www.gstatic.com/firebasejs/${FB_V}/firebase-${m}-compat.js`,`https://cdn.jsdelivr.net/npm/firebase@${FB_V}/firebase-${m}-compat.js`])})();
    await Promise.race([load,timer]);
    firebase.initializeApp(FB_CFG); FB.auth=firebase.auth(); FB.auth.languageCode='fr'; FB.db=firebase.firestore(); FB.ready=true;
    FB.auth.getRedirectResult().catch(e=>{UI.lerr=fbErr(e); if(UI.scr==='login') render()});
    bestLoad(); seasonLoad(); FB.auth.onAuthStateChanged(onFbUser);
  }catch(e){FB.fail=true}
  if(UI.scr==='login'||UI.scr==='menu') render();
}
async function onFbUser(u){
  FB.user=u||null;
  if(!u){ if(UI.scr==='menu'&&!ACC.offline){UI.scr='login'} if(UI.scr==='login'||UI.scr==='menu') render(); return }
  FB.sync='busy'; UI.lbusy=true; if(UI.scr==='login'||UI.scr==='menu') render();
  try{ await cloudPull(u.uid); FB.sync=''; seasonCheck() }catch(e){ FB.sync='err'; toast('Sauvegarde en ligne indisponible : '+((e&&e.code)||'erreur')) }
  UI.lbusy=false; UI.lerr=''; UI.lok='';
  try{ const ps=await FB.db.collection(COL('profiles')).doc(u.uid).get(); FB.prof=ps.exists?ps.data():null }catch(e){ FB.prof=null; FB.profErr=true }
  if(!FB.prof&&!FB.profErr){ UI.scr='pseudo'; UI.perr=''; render(); return }
  afterProfile(UI.scr==='login');
}
function afterProfile(fromLogin){
  if(fromLogin||UI.scr==='login'||UI.scr==='pseudo'){UI.scr='menu'; toast('Connecté : '+(FB.prof?FB.prof.name:(FB.user.email||'compte'))+'.')}
  if(FB.prof){ presence(); startFriends(); startPvp(); startRaid(); startMail() }
  adminCheck().then(()=>{ if(['opts','best','menu','admin'].includes(UI.scr)) render(); if(FB.admin){ setTimeout(updAuto,2500); setTimeout(rkAutoFreeze,4500) } });
  render();
}
/* ============ pseudo (nom de compte) ============ */
const NAME_RE=/^[A-Za-zÀ-ÖØ-öø-ÿ0-9_-]{3,16}$/;
function viewPseudo(){
  return `<div class="menuscr"><div class="brand">Cendrelame</div>
    <form class="lbox"><h2>Choisissez votre nom de compte</h2>
      <p class="lhint" style="text-align:left">C’est le nom que vos amis utiliseront pour vous ajouter. Il est le même pour tous vos personnages et ne peut pas être changé ensuite.</p>
      <label>Nom de compte<input type="text" id="pname" maxlength="16" autocomplete="nickname" value="${esc(UI.pname||'')}" placeholder="3 à 16 caractères"></label>
      <small class="mute">Lettres, chiffres, tiret et tiret bas. Pas d’espace.</small>
      ${UI.perr?`<p class="lerr" role="alert">${esc(UI.perr)}</p>`:''}
      <button class="btn pri big" data-act="pseudoOk" ${UI.lbusy?'disabled':''}>${UI.lbusy?'Patientez…':'Valider'}</button>
      <button class="lnk loff" type="button" data-act="fbLogout">Se déconnecter</button>
    </form></div>`;
}
async function claimName(name){
  const low=name.toLowerCase(),uid=FB.user.uid,db=FB.db,nref=db.collection(COL('names')).doc(low),pref=db.collection(COL('profiles')).doc(uid);
  await db.runTransaction(async tx=>{
    const n=await tx.get(nref); if(n.exists&&n.data().uid!==uid) throw {code:'name-taken'};
    tx.set(nref,{uid}); tx.set(pref,{name,nameLower:low,lastSeen:firebase.firestore.FieldValue.serverTimestamp(),online:true,char:null});
  });
  FB.prof={name,nameLower:low};
}
/* ============ présence et amis ============ */
const FR={list:[],prof:{},unsub:null,pun:{},open:false,err:''};
function presence(state){
  if(!FB.user||!FB.prof) return;
  const ch=(!UI.scr&&S&&S.heroes&&S.heroes[0])?{name:S.heroes[0].name,cls:S.heroes[0].cls,lvl:S.heroes[0].lvl}:null;
  FB.db.collection(COL('profiles')).doc(FB.user.uid).set({name:FB.prof.name,nameLower:FB.prof.nameLower,lastSeen:firebase.firestore.FieldValue.serverTimestamp(),online:state!=='off',char:ch,card:cardMine()},{merge:true}).catch(()=>{});
  if(state!=='off') rkPush();
}
setInterval(()=>presence(),60000);
function stopFriends(){ closeChat(); if(FR.unsub){FR.unsub();FR.unsub=null} for(const k in FR.pun){FR.pun[k]();delete FR.pun[k]} FR.list=[]; FR.prof={}; FR.open=false; renderFriends() }
function startFriends(){
  if(!FB.user||FR.unsub) return; const me=FB.user.uid;
  FR.unsub=FB.db.collection(COL('friendships')).where('users','array-contains',me).onSnapshot(qs=>{
    FR.list=qs.docs.map(d=>Object.assign({id:d.id},d.data({serverTimestamps:'estimate'}))); FR.err='';
    const want=new Set(FR.list.filter(f=>f.status==='accepted').map(f=>f.users.find(x=>x!==me)));
    for(const k in FR.pun) if(!want.has(k)){FR.pun[k]();delete FR.pun[k];delete FR.prof[k]}
    for(const k of want) if(!FR.pun[k]) FR.pun[k]=FB.db.collection(COL('profiles')).doc(k).onSnapshot(d=>{FR.prof[k]=d.exists?d.data():null; renderFriends()},()=>{});
    for(const f of FR.list){ const t=f.lastMsg&&tsMs(f.lastMsg.ts); if(FR.seen&&t&&t>(FR.seen[f.id]||0)&&isUnread(f)&&CH.id!==f.id) toast('💬 '+otherName(f)+' : '+(f.lastMsg.text||'')); }
    FR.seen=Object.fromEntries(FR.list.map(f=>[f.id,(f.lastMsg&&tsMs(f.lastMsg.ts))||0]));
    renderFriends(); if(CH.id){renderChat(); markRead()}
  },e=>{FR.err='Liste d’amis indisponible ('+(e.code||'erreur')+'). Vérifiez les règles Firestore.'; renderFriends()});
  renderFriends();
}
setInterval(()=>{ if(FR.open) renderFriends(true) },30000);
const tsMs=t=>!t?0:t.toMillis?t.toMillis():t.seconds?t.seconds*1000:+t||0;
const isOnline=p=>!!p&&p.online!==false&&Date.now()-tsMs(p.lastSeen)<3*60*1000;
const isUnread=f=>{const me=FB.user&&FB.user.uid,lm=f.lastMsg; if(!me||!lm||lm.from===me||(CH.id===f.id&&$('#frchat'))) return false; const r=(f.lastRead||{})[me]; return r===null?false:tsMs(lm.ts)>tsMs(r)};
const otherName=f=>{const me=FB.user.uid,o=f.users.find(x=>x!==me);return (f.names&&f.names[o])||'?'};
function renderFriends(){
  setTimeout(updFrBtn,0);
  let w=$('#friends');
  if(!FB.user||!FB.prof||UI.scr==='login'||UI.scr==='pseudo'){ if(w) w.remove(); return }
  const me=FB.user.uid,acc=FR.list.filter(f=>f.status==='accepted'),inc=FR.list.filter(f=>f.status==='pending'&&f.from!==me),out=FR.list.filter(f=>f.status==='pending'&&f.from===me);
  const on=acc.filter(f=>isOnline(FR.prof[f.users.find(x=>x!==me)])).length;
  if(!w){ w=document.createElement('div'); w.id='friends'; w.className='frw'; document.body.append(w);
    w.innerHTML=`<div class="frpanel" id="frpanel" hidden role="dialog" aria-label="Liste d’amis"><div class="frhead"><b>Amis</b><small>Vous : <span id="frme"></span></small><button class="frx" data-act="frToggle" aria-label="Fermer">×</button></div>
      <div class="fradd"><input type="text" id="frname" maxlength="16" placeholder="Nom de compte d’un joueur" aria-label="Nom de compte à ajouter"><button class="btn sm pri" data-act="frAdd">Ajouter</button></div>
      <p class="frmsg" id="frmsg" role="status"></p><div id="frlist"></div></div>
      <button class="frbtn" data-act="frToggle" aria-expanded="false"><span class="frdot"></span><span id="frcnt"></span></button>`; }
  $('#frme').textContent=FB.prof.name;
  const b=w.querySelector('.frbtn'); b.setAttribute('aria-expanded',FR.open); $('#frpanel').hidden=!FR.open;
  const unr=acc.filter(isUnread).length;
  $('#frcnt').innerHTML=`Amis <b>${on}</b> / ${acc.length} en ligne${inc.length||unr?`<span class="ndot" aria-label="${inc.length} demande(s), ${unr} message(s) non lu(s)"></span>`:''}`;
  b.classList.toggle('has',on>0);
  const msg=$('#frmsg'); msg.textContent=FR.err||UI.frmsg||''; msg.className='frmsg '+(FR.err||UI.frerr?'bad':'ok');
  const row=(f,body,btns)=>`<li class="frrow">${body}<span class="fracts">${btns}</span></li>`;
  const accL=acc.map(f=>{const o=f.users.find(x=>x!==me),p=FR.prof[o],ol=isOnline(p),ch=p&&p.char,ur=isUnread(f);
      return {ol,h:row(f,`<span class="st ${ol?'on':''}" aria-label="${ol?'En ligne':'Hors ligne'}"></span><span class="frn"><button class="frname" data-act="frCard" data-id="${f.id}" ${ttip('Voir la carte de '+otherName(f))}><b>${esc(otherName(f))}</b>${ur?'<span class="frud" aria-label="Nouveau message"></span>':''}</button>${UI.frMenu===f.id?`<span class="frpop" role="menu"><button class="btn sm pri chatb" data-act="frChat" data-id="${f.id}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h16a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H9l-5 4v-4H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zm3 5v2h2V9zm4 0v2h2V9zm4 0v2h2V9z"/></svg><span>Chat${ur?' (nouveau)':''}</span></button><button class="btn sm chatb duelb" data-act="frDuel" data-id="${f.id}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 3l7.5 7.5-1.4 1.4L4 6.8V3zm18 0v3.8l-9.6 9.6 1.4 1.4L21 9.6V3h0zM5.3 14.6l4.1 4.1-1.4 1.4-1.4-1.4L4 21.3 2.7 20l2.6-2.6-1.4-1.4zm13.4 0l1.4 1.4-1.4 1.4L21.3 20 20 21.3l-2.6-2.6-1.4 1.4-1.4-1.4z"/></svg><span>Duel</span></button><button class="btn sm chatb duelb" data-act="frCard" data-id="${f.id}">${uic('card')}<span>Carte</span></button></span>`:''}<small>${ol?(ch?`Joue ${esc(ch.name)} · ${(CLASSES[ch.cls]||{n:''}).n} niv. ${ch.lvl}`:'Dans le menu'):'Hors ligne'+(p&&p.char?` · ${esc(p.char.name)} niv. ${p.char.lvl}`:'')}</small></span>`,
        UI.frdel===f.id?`<button class="btn sm danger" data-act="frDel" data-id="${f.id}">Retirer</button><button class="btn sm" data-act="frDelNo">Non</button>`:`<button class="frx sm" data-act="frDel" data-id="${f.id}" title="Retirer de mes amis" aria-label="Retirer ${esc(otherName(f))}">×</button>`)}});
  const onL=accL.filter(x=>x.ol),offL=accL.filter(x=>!x.ol);
  $('#frlist').innerHTML=
    (inc.length?`<h4>Demandes reçues</h4><ul>${inc.map(f=>row(f,`<span class="frn"><b>${esc(otherName(f))}</b><small>veut devenir votre ami</small></span>`,`<button class="btn sm pri" data-act="frAcc" data-id="${f.id}">Accepter</button><button class="btn sm" data-act="frDel" data-id="${f.id}" data-now="1">Refuser</button>`)).join('')}</ul>`:'')+
    (acc.length?`<h4>En ligne (${onL.length})</h4>${onL.length?`<ul>${onL.map(x=>x.h).join('')}</ul>`:'<p class="mute frempty">Aucun ami connecté.</p>'}<h4>Hors ligne (${offL.length})</h4>${offL.length?`<ul>${offL.map(x=>x.h).join('')}</ul>`:'<p class="mute frempty">Tous vos amis sont connectés.</p>'}`:'<h4>Mes amis</h4><p class="mute frempty">Aucun ami pour l’instant. Ajoutez un joueur avec son nom de compte.</p>')+
    (out.length?`<h4>Demandes envoyées</h4><ul>${out.map(f=>row(f,`<span class="frn"><b>${esc(otherName(f))}</b><small>en attente</small></span>`,`<button class="btn sm" data-act="frDel" data-id="${f.id}" data-now="1">Annuler</button>`)).join('')}</ul>`:'');
  const pop=$('#frlist .frpop'); if(pop){ const nb=pop.parentElement.querySelector('.frname'),r=nb.getBoundingClientRect(),row=pop.closest('.frrow').getBoundingClientRect(),pw=pop.offsetWidth,ph=pop.offsetHeight;
    pop.style.left=(Math.max(8,row.left-pw-12))/ZM+'px'; pop.style.top=(Math.max(8,r.top+r.height/2-ph/2))/ZM+'px'; pop.style.visibility='visible' }
}
