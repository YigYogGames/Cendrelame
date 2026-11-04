/* Cendrelame · online/chat.js */
/* ---- chat ---- */
const CH={id:null,unsub:null,msgs:[],err:''};
const fdoc=id=>FB.db.collection(COL('friendships')).doc(id);
function openChat(id){
  if(CH.unsub){CH.unsub();CH.unsub=null}
  CH.id=id; CH.msgs=[]; CH.err=''; UI.frMenu=null;
  CH.readFor=null; CH.unsub=fdoc(id).collection('messages').orderBy('ts').limitToLast(60).onSnapshot(qs=>{CH.msgs=qs.docs.map(d=>d.data({serverTimestamps:'estimate'})); renderChat(); markRead()},e=>{CH.err='Chat indisponible ('+(e.code||'erreur')+'). Vérifiez les règles Firestore.'; renderChat()});
  renderChat(true); markRead();
}
function closeChat(){ if(CH.unsub){CH.unsub();CH.unsub=null} CH.id=null; const w=$('#frchat'); if(w) w.remove(); renderFriends() }
let readT=null;
function markRead(){
  const f=FR.list.find(x=>x.id===CH.id),me=FB.user&&FB.user.uid; if(!f||!me||!f.lastMsg||f.lastMsg.from===me) return;
  const lt=tsMs(f.lastMsg.ts),r=(f.lastRead||{})[me]; if(r!==null&&tsMs(r)>=lt) return; if(CH.readFor===lt) return; CH.readFor=lt;
  clearTimeout(readT); readT=setTimeout(()=>{fdoc(CH.id).update({['lastRead.'+FB.user.uid]:firebase.firestore.FieldValue.serverTimestamp()}).catch(()=>{})},300);
}
function renderChat(focus){
  if(!CH.id) return; const f=FR.list.find(x=>x.id===CH.id); if(!f||f.status!=='accepted'){closeChat();return}
  const me=FB.user.uid; let w=$('#frchat');
  if(!w){ w=document.createElement('div'); w.id='frchat'; w.className='frchat'; w.setAttribute('role','dialog'); document.body.append(w);
    w.innerHTML=`<div class="frhead"><b id="chname"></b><small id="chst"></small><button class="frx" data-act="chClose" aria-label="Fermer le chat">×</button></div><div class="chlog" id="chlog" aria-live="polite"></div>
      <div class="fradd"><input type="text" id="chin" maxlength="300" placeholder="Votre message…" aria-label="Message"><button class="btn sm pri" data-act="chSend">Envoyer</button></div>`; focus=true }
  const o=f.users.find(x=>x!==me),p=FR.prof[o];
  $('#chname').textContent=otherName(f); $('#chst').textContent=isOnline(p)?'En ligne':'Hors ligne';
  const log=$('#chlog'),stick=log.scrollTop+log.clientHeight>=log.scrollHeight-20;
  const hm=t=>{const d=new Date(tsMs(t)||Date.now());return d.toLocaleDateString('fr-FR',{day:'2-digit',month:'2-digit'})+' '+d.toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'})};
  log.innerHTML=(CH.err?`<p class="frmsg bad">${esc(CH.err)}</p>`:'')+(CH.msgs.length?CH.msgs.map(m=>`<div class="chm ${m.from===me?'me':''}"><span>${esc(m.text)}</span><small>${hm(m.ts)}</small></div>`).join(''):'<p class="mute frempty">Aucun message. Dites bonjour !</p>');
  if(stick||focus) log.scrollTop=log.scrollHeight;
  if(focus){const i=$('#chin'); if(i) i.focus()}
}
async function sendChat(){
  const i=$('#chin'),t=(i.value||'').trim().slice(0,300); if(!t||!CH.id) return; i.value='';
  const me=FB.user.uid,TS=firebase.firestore.FieldValue.serverTimestamp();
  try{ await fdoc(CH.id).collection('messages').add({from:me,text:t,ts:TS});
    await fdoc(CH.id).update({lastMsg:{from:me,ts:TS,text:t.slice(0,80)},['lastRead.'+me]:TS}) }
  catch(e){ CH.err='Envoi impossible ('+(e.code||'erreur')+').'; renderChat() }
}
async function frSendReq(name){
  const me=FB.user.uid,low=name.toLowerCase();
  if(low===FB.prof.nameLower) throw {msg:'C’est votre propre nom de compte.'};
  const n=await FB.db.collection(COL('names')).doc(low).get(); if(!n.exists) throw {msg:'Aucun joueur ne porte ce nom de compte.'};
  const o=n.data().uid,id=[me,o].sort().join('_'),ex=FR.list.find(f=>f.id===id);
  if(ex) throw {msg:ex.status==='accepted'?'Ce joueur est déjà votre ami.':'Une demande est déjà en cours avec ce joueur.'};
  const op=await FB.db.collection(COL('profiles')).doc(o).get(),oname=op.exists?op.data().name:name;
  await FB.db.collection(COL('friendships')).doc(id).set({users:[me,o].sort(),from:me,status:'pending',names:{[me]:FB.prof.name,[o]:oname},ts:firebase.firestore.FieldValue.serverTimestamp()});
  return oname;
}
const userDoc=uid=>FB.db.collection(COL('users')).doc(uid);
async function cloudPull(uid){
  const snap=await userDoc(uid).get(), d=snap.exists?snap.data():null;
  const localHas=Array.from({length:MAXCH},(_,i)=>charRaw(i)).some(Boolean);
  if(!d){ /* première connexion : la partie de cet appareil devient celle du compte */
    if(ACC.owner&&ACC.owner!==uid) clearLocalChars();
    ACC.owner=uid; ACC.offline=false; saveAcc(); await cloudPush(true); return }
  if(ACC.owner===uid&&(ACC.ts||0)>(d.ts||0)){ ACC.offline=false; await cloudPush(true); return }
  if(localHas&&!ACC.owner){ /* partie hors ligne : on la garde de côté */
    const bak={acc:ACC,chars:Array.from({length:MAXCH},(_,i)=>lsGet(CHAR_KEY(i)))}; lsSet(KP+'bak_'+Date.now(),JSON.stringify(bak));
    setTimeout(()=>toast('Votre partie hors ligne a été mise de côté : la sauvegarde du compte est chargée.'),800) }
  for(let i=0;i<MAXCH;i++){const c=d['c'+i]; if(c) lsSet(CHAR_KEY(i),c); else lsDel(CHAR_KEY(i))}
  const keep=ACC.owner===uid?Object.fromEntries(Object.entries(ACC).filter(([k])=>!['owner','offline','ts','cur','gold'].includes(k))):{};
  ACC=Object.assign({gold:80,cur:null,seenVer:null},keep,d.acc||{},{owner:uid,ts:d.ts||Date.now(),offline:false,cur:null});
  lsSet(ACC_KEY,JSON.stringify(ACC)); S=null;
}
function clearLocalChars(){for(let i=0;i<MAXCH;i++) lsDel(CHAR_KEY(i)); ACC={gold:80,cur:null,seenVer:ACC.seenVer}; S=null}
function cloudSoon(){ if(!FB.user) return; clearTimeout(FB.t); FB.t=setTimeout(()=>cloudPush(),4000) }
async function cloudPush(force){
  if(!FB.user||!FB.db) return; clearTimeout(FB.t);
  if(S&&S.heroes&&S.heroes.length&&ACC.cur!=null&&!UI.scr){ACC.gold=S.gold; lsSet(CHAR_KEY(ACC.cur),JSON.stringify(S))}
  const acc=JSON.parse(JSON.stringify(ACC)); delete acc.owner; delete acc.offline; delete acc.ts; acc.cur=ACC.cur==null?null:ACC.cur; acc.season=ACC.season||0; acc.dbg=ACC.dbg||{};
  const doc={ts:ACC.ts||Date.now(),acc};
  for(let i=0;i<MAXCH;i++) doc['c'+i]=lsGet(CHAR_KEY(i))||null;
  try{ await userDoc(FB.user.uid).set(doc); if(FB.sync==='err'){FB.sync=''; if(UI.scr==='menu') render()} }
  catch(e){ FB.sync='err'; if(force) throw e }
}
function viewMenu(){
  return `<div class="menuscr"><div class="brand">Cendrelame</div><div class="seasont">${esc(seasonTitle())}</div>
    <div class="mbtns">
      <button class="mbtn pri" data-act="scr" data-s="select">Jouer</button>
      <button class="mbtn" data-act="scr" data-s="opts">Options</button>
      ${FB.admin?'<button class="mbtn" data-act="scr" data-s="admin">Admin</button>':''}
      <button class="mbtn" data-act="scr" data-s="news">Nouveautés${unseenVer()?'<span class="ndot" aria-label="Nouvelle version"></span>':''}</button>
    </div>
    <span class="mgold" aria-hidden="true" style="visibility:hidden">&nbsp;</span></div>${accCorner()}`;
}
function accCorner(){
  if(FB.user) return `<div class="acccorner"><span title="${esc(FB.user.email||'')}">👤 ${esc(FB.prof?FB.prof.name:(FB.user.email||FB.user.displayName||'Compte'))}</span><small>${FB.sync==='err'?'⚠ Synchronisation impossible':FB.sync==='busy'?'Synchronisation…':'Sauvegarde en ligne ✓'}</small><button class="btn sm" data-act="fbLogout">Se déconnecter</button></div>`;
  return `<div class="acccorner"><span>Mode hors ligne</span><small>Sauvegarde sur cet appareil uniquement</small><button class="btn sm" data-act="scr" data-s="login">Se connecter</button></div>`;
}
