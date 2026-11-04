/* Cendrelame · online/nouvelle-saison.js */
/* ================= nouvelle saison : remise à zéro de tous les comptes ================= */
async function seasonLoad(){
  try{ const d=await FB.db.collection(COL('config')).doc('reset').get(); FB.season=d.exists?d.data():{n:0}; lsSet(KP+'seasonc',JSON.stringify({n:FB.season.n||0,title:FB.season.title||''})) }catch(e){ FB.season=null }
  seasonPaint();
  seasonCheck();
}
function seasonWipe(R){
  for(let i=0;i<MAXCH;i++) lsDel(CHAR_KEY(i));
  S=null; ACC.cur=null; ACC.gold=80;
  if(R.troph!==false){ delete ACC.troph; delete ACC.cnt; delete ACC.trNew }
  if(R.cos!==false){ delete ACC.cos; delete ACC.cardUnl; delete ACC.card; delete ACC.chestQ }
  if(R.stash!==false){ delete ACC.stash }
}
function seasonCheck(){
  const R=FB.season; if(!R) return; const n=+R.n||0; if((ACC.season||0)>=n) return;
  const had=Array.from({length:MAXCH},(_,i)=>charRaw(i)).some(Boolean);
  if(had) seasonWipe(R);
  ACC.season=n; saveAcc(); if(FB.user){ cloudPush().catch(()=>{}); if(FB.prof) presence() }
  if(had){ UI.scr='menu'; UI.invOpen=false; render(); seasonModal(R) }
}
function seasonModal(R){
  const d=document.createElement('div'); d.className='modal'; d.id='season';
  d.innerHTML=`<div class="box"><h2>Nouvelle saison</h2><p>${R.msg?esc(R.msg):'Tous les comptes ont été remis à zéro : tout le monde repart du même point. Bonne aventure !'}</p><p class="hint">Personnages, or${R.troph!==false?', trophées':''}${R.cos!==false?', cadres et cosmétiques':''}${R.stash!==false?', coffre du compte':''} : remis à zéro. Votre nom de compte et vos amis sont conservés.</p><div class="row" style="justify-content:flex-end"><button class="btn pri" data-act="seasonOk">Commencer</button></div></div>`;
  document.body.append(d); d.querySelector('button').focus();
}
function seasonAdminHTML(){
  if(!FB.admin) return '';
  const n=FB.season?(+FB.season.n||0):0,W=UI.wipe=UI.wipe||{troph:true,cos:true,stash:true,msg:''},cf=UI.confirm==='wipe';
  const ck=(k,l)=>`<label class="row" style="gap:6px"><input type="checkbox" data-wipe="${k}" ${W[k]?'checked':''}> ${l}</label>`;
  return `<section class="panel" style="margin-top:12px"><h2 style="margin-top:0">Remise à zéro de tous les comptes</h2>
   <p class="hint">Saison actuelle : <b class="num">${n}</b>. Au prochain chargement du jeu, chaque joueur perd ses personnages et son or, et repart du début. Le nom de compte, les amis, la messagerie et les options sont conservés.</p>
   <p class="hint" style="margin:6px 0 4px">Remettre aussi à zéro :</p><div class="row" style="gap:16px;flex-wrap:wrap">${ck('troph','Trophées et points')}${ck('cos','Cadres et cosmétiques')}${ck('stash','Coffre du compte')}</div>
   <label style="display:flex;flex-direction:column;gap:4px;margin-top:8px">Message affiché aux joueurs (facultatif)<input class="pcsel" id="wipemsg" maxlength="300" value="${esc(W.msg||'')}" placeholder="Nouvelle saison : tout le monde repart de zéro !"></label>
   <div class="row" style="margin-top:10px;gap:8px">${cf?`<button class="btn danger" data-act="wipeGo">Confirmer : remettre TOUS les comptes à zéro</button><button class="btn" data-act="noConfirm">Annuler</button>`:`<button class="btn danger" data-act="wipeAsk">Réinitialiser tous les comptes…</button>`}</div>
   ${cf?'<p class="lockr" style="margin-top:6px">Action définitive pour tous les joueurs, vous compris.</p>':''}</section>`;
}
async function seasonGo(){
  if(!FB.admin||UI.wiping) return; UI.wiping=true;
  const W=UI.wipe||{},m=$('#wipemsg'); if(m) W.msg=m.value.trim().slice(0,300);
  const n=(FB.season?(+FB.season.n||0):0)+1,doc={n,troph:!!W.troph,cos:!!W.cos,stash:!!W.stash,msg:W.msg||'',by:FB.user.uid,ts:firebase.firestore.FieldValue.serverTimestamp()};
  await rkFreeze(rkSeason(),true);
  try{ await FB.db.collection(COL('config')).doc('reset').set(doc); FB.season=doc; UI.confirm=null; toast('Saison '+n+' lancée : tous les comptes repartent de zéro.'); seasonCheck() }
  catch(e){ toast('Échec ('+((e&&e.code)||'erreur')+') : vérifiez la règle Firestore de config/reset.') }
  UI.wiping=false; if(UI.scr==='opts') render();
}

