/* Cendrelame · online/messagerie.js */
/* ================= Messagerie du compte ================= */
Object.assign(UIC,{mail:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3.5 6.5 12 13l8.5-6.5"/>',gift:'<rect x="3" y="9" width="18" height="12" rx="1"/><path d="M3 13h18M12 9v12"/><path d="M12 9C10 5 6 5 6.5 7.5S12 9 12 9s4.5-1 5.5-1.5S14 5 12 9z"/>',warn:'<path d="M12 3 2 20h20z"/><path d="M12 10v4M12 17v.5"/>',info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/>',send:'<path d="M3 11 21 3l-6 18-3-8z"/><path d="m12 13 9-10"/>',trash:'<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>'});
const ML_K={info:['#3f7fe0','Information','info'],warn:['#c0432a','Alerte','warn'],gift:['#c99a3a','Cadeau','gift']};
const ML_ATT=['gold','c_relic','rune','prisme','p_vie1','p_vie','p_vie3','p_reg1','p_reg2','p_res','p_for','p_int','p_pa','p_xp','p_loot'];
const ML={all:[],me:[],un:[],open:false,sel:null,adm:false,err:''};
const mlCol=()=>FB.db.collection(COL('mail'));
const mlSt=()=>{ACC.mail=ACC.mail||{read:{},got:{},del:{}}; for(const k of ['read','got','del']) ACC.mail[k]=ACC.mail[k]||{}; return ACC.mail};
const mlTs=m=>tsMs(m.ts)||m.tsMs||0;
const mlList=()=>{const st=mlSt(),now=Date.now(),seen=new Set();return [...ML.all,...ML.me].filter(m=>{if(seen.has(m.id))return false;seen.add(m.id);return !st.del[m.id]&&!(m.exp&&m.exp<now&&!st.got[m.id]&&mlHasAtt(m))}).sort((a,b)=>mlTs(b)-mlTs(a))};
const mlHasAtt=m=>!!m.att&&(Object.values(m.att).some(v=>v>0)||(Array.isArray(m.att.it)&&m.att.it.length>0));
const mlUnread=()=>mlList().filter(m=>!mlSt().read[m.id]).length;
const mlToGet=()=>mlList().filter(m=>mlHasAtt(m)&&!mlSt().got[m.id]&&!(m.exp&&m.exp<Date.now()));
function startMail(){
  stopMail(); if(!FB.user) return; const me=FB.user.uid;
  const map=qs=>qs.docs.map(d=>Object.assign({id:d.id},d.data({serverTimestamps:'estimate'})));
  const err=e=>{ML.err='Messagerie indisponible ('+((e&&e.code)||'erreur')+'). Vérifiez les règles Firestore.'; mlRefresh()};
  ML.un.push(mlCol().where('to','==','all').onSnapshot(qs=>{const was=new Set(ML.all.map(m=>m.id));ML.all=map(qs);ML.err='';mlNotify(was,ML.all);mlRefresh()},err));
  setTimeout(()=>{ if(FB.user) ahLoadMine().catch(()=>{}) },4000);
  ML.un.push(mlCol().where('to','==',me).onSnapshot(qs=>{const was=new Set(ML.me.map(m=>m.id));ML.me=map(qs);ML.err='';mlNotify(was,ML.me);mlRefresh()},err));
}
function stopMail(){ ML.un.forEach(f=>{try{f()}catch(e){}}); ML.un=[]; ML.all=[]; ML.me=[]; mlRefresh() }
let mlFirst=true;
function mlNotify(was,L){ if(!was.size&&mlFirst){mlFirst=false;return} const st=mlSt(); const n=L.filter(m=>!was.has(m.id)&&!st.read[m.id]&&!st.del[m.id]); if(n.length) toast(`✉ Nouveau message : ${n[0].title||'Message système'}`) }
function mlRefresh(){ const b=$('#mailbtn'); if(b){ const n=mlUnread(); b.hidden=!!UI.scr||!S||!S.heroes||!S.heroes.length; b.querySelector('.mlcnt').textContent=n; b.querySelector('.mlcnt').hidden=!n; b.setAttribute('aria-label',`Messagerie${n?` : ${n} non lu${n>1?'s':''}`:''}`) } if(ML.open) renderMail() }
/* coffre : placement simulé puis réel (tout ou rien) */
function mlPlace(att){ hp3Walk(att); r82Walk(att);
  const d=stashD(),tabs=d.tabs.map(T=>({T,bag:T.bag.map(e=>({x:e.x,y:e.y,o:Object.assign({},e.o)}))}));
  for(const [k,v0] of Object.entries(att)){ if(k==='gold'||!(v0>0)) continue; let n=Math.floor(v0);
    for(const t of tabs){ for(const e of t.bag){ if(n<=0) break; if(e.o.mat===k&&e.o.n<STACK){const m=Math.min(STACK-e.o.n,n);e.o.n+=m;n-=m} } }
    for(const t of tabs){ while(n>0){ const sp=findSpot(t.bag,1,1,SW,SH); if(!sp) break; const m=Math.min(STACK,n); t.bag.push({x:sp[0],y:sp[1],o:{mat:k,n:m}}); n-=m } if(n<=0) break }
    if(n>0) return null }
  for(const it0 of (Array.isArray(att.it)?att.it:[])){ const it=Object.assign({},it0),[w,h]=SIZE(it); let ok=false; for(const t of tabs){ const sp=findSpot(t.bag,w,h,SW,SH); if(sp){ t.bag.push({x:sp[0],y:sp[1],o:it}); ok=true; break } } if(!ok) return null }
  return tabs;
}
function mlClaim(ids){
  const st=mlSt(),L=mlList().filter(m=>ids.includes(m.id)&&mlHasAtt(m)&&!st.got[m.id]); if(!L.length) return;
  const tot={}; for(const m of L) for(const [k,v] of Object.entries(m.att)){ if(k==='it'&&Array.isArray(v)) tot.it=(tot.it||[]).concat(v); else if(v>0) tot[k]=(tot[k]||0)+Math.floor(v) }
  const tabs=mlPlace(tot);
  if(!tabs){ toast('Pas assez de place dans le coffre du compte : libérez des cases ou achetez un onglet, puis réessayez. Rien n’a été récupéré.'); return }
  for(const t of tabs) t.T.bag=t.bag;
  if(tot.gold) S.gold+=tot.gold;
  for(const m of L){ st.got[m.id]=Date.now(); st.read[m.id]=1 }
  save(); render();
  const parts=Object.entries(tot).filter(([k])=>k!=='gold'&&k!=='it').map(([k,v])=>`${fmt(v)} × ${MAT_OBJ[k]||(POTS[k]&&POTS[k].n)||MAT_N[k]||k}`); if(tot.it) parts.push(...tot.it.map(x=>x.name));
  toast(`Récupéré${tot.gold?` : ${fmt(tot.gold)} or (ajouté à votre or)`:''}${parts.length?`${tot.gold?' ;':' :'} ${parts.join(', ')} envoyés dans le coffre du compte`:''}.`);
}
const mlAttHTML=a=>(Array.isArray(a&&a.it)?a.it.map(it=>`<span class="mlit">${ahIco(it,'')}<span style="color:var(--r${it.rarity})">${esc(it.name)}${it.up?' +'+it.up:''}</span></span>`).join(''):'')+Object.entries(a||{}).filter(([k,v])=>k!=='it'&&v>0).map(([k,v])=>`<span class="mc" title="${esc(MAT_OBJ[k]||(POTS[k]&&POTS[k].n)||MAT_N[k]||k)}">+${fmt(v)} ${matIcon(k)}</span>`).join('');
const mlDate=t=>t?new Date(t).toLocaleDateString('fr-FR'):'';
function mailHTML(){
  if(ML.adm&&FB.admin) return mailAdmHTML();
  const L=mlList(),st=mlSt(),n=mlUnread(),tg=mlToGet();
  if(ML.sel&&!L.find(m=>m.id===ML.sel)) ML.sel=null;
  if(!ML.sel&&L.length) ML.sel=L[0].id;
  const m=L.find(x=>x.id===ML.sel);
  if(m&&!st.read[m.id]){ st.read[m.id]=1; saveAcc(); setTimeout(mlRefresh,0) }
  const K=k=>ML_K[k]||ML_K.info;
  const rows=L.map(x=>`<button class="mlrow ${x.id===ML.sel?'on':''} ${st.read[x.id]?'':'u'}" style="--kc:${K(x.kind)[0]}" data-act="mlSel" data-id="${x.id}" aria-pressed="${x.id===ML.sel}"><span class="mlic">${uic(K(x.kind)[2])}</span><span class="mlrt"><b>${esc(mlPers(x.title||'Message'))}</b><small>${esc(x.from||'L’équipe Cendrelame')} · ${mlDate(mlTs(x))}</small></span>${mlHasAtt(x)&&!st.got[x.id]?`<span class="mlgift" title="Pièces jointes à récupérer">${uic('gift')}</span>`:''}</button>`).join('');
  let read='<div class="mlempty">'+(FB.user?'Aucun message.':'Connectez-vous à un compte en ligne pour recevoir les messages.')+'</div>';
  if(m){ const got=st.got[m.id],ex=m.exp&&m.exp<Date.now();
    read=`<article class="mlread" style="--kc:${K(m.kind)[0]}"><header><span class="mlic big">${uic(K(m.kind)[2])}</span><div><small>${K(m.kind)[1]} · ${mlDate(mlTs(m))}${m.to!=='all'?' · message personnel':''}</small><h2>${esc(mlPers(m.title||'Message'))}</h2><small>De : ${esc(m.from||'L’équipe Cendrelame')}</small></div></header><p>${esc(mlPers(m.body||'')).replace(/\n/g,'<br>')}</p>
     ${mlHasAtt(m)?`<div class="mlrw"><h4>Pièces jointes</h4><div class="mprew">${mlAttHTML(m.att)}</div>${got?`<span class="mtdone">${uic('check')} Récupéré le ${mlDate(got)}</span>`:ex?'<span class="mclk">Pièces jointes expirées.</span>':`<button class="btn pri amgo" data-act="mlGet" data-id="${m.id}">${uic('gift')} Récupérer</button><small class="mute">L’or s’ajoute à votre or ; les objets et matériaux vont dans le coffre du compte.${m.exp?` Expire le ${mlDate(m.exp)}.`:''}</small>`}</div>`:''}
     <footer>${FB.admin?`<button class="btn sm danger" data-act="mlAdmDel" data-id="${m.id}">${UI.confirm==='mldel'+m.id?'Confirmer : supprimer pour tous':'Supprimer pour tous (admin)'}</button>`:''}<button class="btn sm" data-act="mlDel" data-id="${m.id}" ${mlHasAtt(m)&&!got&&!ex?'disabled title="Récupérez d’abord les pièces jointes."':''}>${uic('trash')} Supprimer</button></footer></article>`; }
  return `<div class="mlwin" role="dialog" aria-modal="true" aria-label="Messagerie"><div class="mlhead"><span class="mlic">${uic('mail')}</span><h2>Messagerie</h2><span class="mute">${n?`${n} non lu${n>1?'s':''}`:'Tout est lu'}</span>
    <span style="margin-left:auto"></span>${FB.admin?`<button class="btn sm" data-act="mlAdm">${uic('send')} Envoyer un message</button>`:''}${tg.length?`<button class="btn sm pri" data-act="mlGetAll">Tout récupérer (${tg.length})</button>`:''}<button class="frx" data-act="mlClose" aria-label="Fermer">×</button></div>
    ${ML.err?`<p class="lerr" style="margin:8px 12px">${esc(ML.err)}</p>`:''}<div class="mlbody"><nav class="mllist">${rows||'<p class="mlempty">Votre boîte est vide.</p>'}</nav>${read}</div></div>`;
}
function mailAdmHTML(){
  const F=ML.form=ML.form||{kind:'info',to:'all',name:'',title:'',body:'',att:{},exp:30};
  const prev={id:'_',kind:F.kind,title:F.title||'Titre du message',body:F.body||'Texte du message.',att:F.att,to:F.to,tsMs:Date.now(),exp:F.exp?Date.now()+F.exp*864e5:0};
  const K=ML_K[F.kind];
  return `<div class="mlwin" role="dialog" aria-modal="true" aria-label="Envoyer un message système"><div class="mlhead"><span class="mlic">${uic('send')}</span><h2>Envoyer un message système</h2><span class="mlad">Administrateur</span><span style="margin-left:auto"></span><button class="btn sm" data-act="mlAdmBack">‹ Retour à la messagerie</button><button class="frx" data-act="mlClose" aria-label="Fermer">×</button></div>
   <div class="mlbody adm"><form class="mlform" onsubmit="return false">
    <label>Type<div class="mcseg light">${Object.entries(ML_K).map(([k,v])=>`<button type="button" class="${F.kind===k?'on':''}" data-act="mlF" data-k="kind" data-v="${k}">${v[1]}</button>`).join('')}</div></label>
    <label>Destinataires<select class="pcsel" data-mlf="to"><option value="all" ${F.to==='all'?'selected':''}>Tous les joueurs</option><option value="one" ${F.to==='one'?'selected':''}>Un joueur (nom de compte)</option></select></label>
    ${F.to==='one'?`<label>Nom de compte<input class="pcsel" data-mlf="name" value="${esc(F.name)}" maxlength="16"></label>`:''}
    <label>Titre<input class="pcsel" data-mlf="title" value="${esc(F.title)}" maxlength="80"></label>
    <label>Message<textarea class="pcsel" rows="5" data-mlf="body" maxlength="2000">${esc(F.body)}</textarea></label>
    <label>Pièces jointes <small class="mute">(or ajouté directement, le reste va dans le coffre du compte)</small><div class="mlatt">${ML_ATT.map(k=>`<span title="${esc(MAT_OBJ[k]||(POTS[k]&&POTS[k].n)||MAT_N[k]||k)}">${matIcon(k)}<input class="pcsel num" type="number" min="0" step="1" data-mlatt="${k}" value="${F.att[k]||''}" placeholder="0"></span>`).join('')}</div></label>
    <label>Expiration des pièces jointes<select class="pcsel" data-mlf="exp">${[[7,'7 jours'],[30,'30 jours'],[90,'90 jours'],[0,'Jamais']].map(([v,n])=>`<option value="${v}" ${+F.exp===v?'selected':''}>${n}</option>`).join('')}</select></label>
    ${ML.admMsg?`<p class="${ML.admErr?'lerr':'hint'}">${esc(ML.admMsg)}</p>`:''}
    <button type="button" class="btn pri amgo" data-act="mlSend" ${ML.sending?'disabled':''}>${uic('send')} ${F.to==='all'?'Envoyer à tous les joueurs':'Envoyer au joueur'}</button></form>
    <div class="mlprev"><small class="mute" style="padding:10px 22px 0">Aperçu</small><article class="mlread" style="--kc:${K[0]}"><header><span class="mlic big">${uic(K[2])}</span><div><small>${K[1]} · ${mlDate(Date.now())}</small><h2>${esc(prev.title)}</h2><small>De : L’équipe Cendrelame</small></div></header><p>${esc(prev.body).replace(/\n/g,'<br>')}</p>${mlHasAtt(prev)?`<div class="mlrw"><h4>Pièces jointes</h4><div class="mprew">${mlAttHTML(prev.att)}</div><button class="btn pri amgo" disabled>${uic('gift')} Récupérer</button>${prev.exp?`<small class="mute">Expire le ${mlDate(prev.exp)}.</small>`:''}</div>`:''}</article></div></div></div>`;
}
function renderMail(){
  let w=$('#mailw');
  if(!ML.open){ if(w) w.remove(); return }
  if(!w){ w=document.createElement('div'); w.id='mailw'; w.className='mlback'; w.addEventListener('click',e=>{if(e.target===w) A.mlClose()}); document.body.append(w) }
  const ae=document.activeElement,af=ae&&w.contains(ae)?(ae.dataset.mlf||ae.dataset.mlatt):null;
  w.innerHTML=mailHTML();
  if(af){ const el=w.querySelector(`[data-mlf="${af}"],[data-mlatt="${af}"]`); if(el){el.focus(); try{const v=el.value;el.setSelectionRange(v.length,v.length)}catch(e){}} }
}
async function mlSend(){
  const F=ML.form; if(!FB.admin||ML.sending) return;
  if(!F.title.trim()){ML.admMsg='Indiquez un titre.';ML.admErr=true;renderMail();return}
  ML.sending=true; ML.admMsg='Envoi…'; ML.admErr=false; renderMail();
  try{
    let to='all';
    if(F.to==='one'){ const low=(F.name||'').trim().toLowerCase(); if(!low) throw {msg:'Indiquez le nom de compte du joueur.'}; const n=await FB.db.collection(COL('names')).doc(low).get(); if(!n.exists) throw {msg:'Aucun joueur ne porte ce nom de compte.'}; to=n.data().uid }
    const att={}; for(const [k,v] of Object.entries(F.att)) if(+v>0) att[k]=Math.floor(+v);
    await mlCol().add({to,kind:F.kind,title:F.title.trim(),body:F.body.trim(),att,from:'L’équipe Cendrelame',ts:firebase.firestore.FieldValue.serverTimestamp(),tsMs:Date.now(),exp:F.exp&&Object.keys(att).length?Date.now()+F.exp*864e5:0,by:FB.user.uid});
    ML.admMsg=to==='all'?'Message envoyé à tous les joueurs.':`Message envoyé à ${F.name.trim()}.`; ML.form=null;
  }catch(e){ ML.admErr=true; ML.admMsg=e.msg||('Erreur : '+(e.code||'inconnue')+' (vérifiez les règles Firestore de la collection mail).') }
  ML.sending=false; renderMail();
}

