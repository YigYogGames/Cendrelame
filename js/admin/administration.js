/* Cendrelame · admin/administration.js */
/* ================= Administration ================= */
const seasonTitle=()=>{ const R=FB.season||(()=>{try{return JSON.parse(lsGet(KP+'seasonc')||'null')}catch(e){return null}})(); const n=R?(+R.n||0):0; return (R&&R.title)||('Saison '+Math.max(1,n)) };
function seasonPaint(){ const t=seasonTitle(); document.querySelectorAll('.seasont').forEach(e=>e.textContent=t) }
const ADM_TABS=[['home','grid','Vue d’ensemble'],['season','flag','Saison'],['mail','mail','Messages'],['players','people','Joueurs'],['best','skull','Bestiaire'],['give','gift','Donner un objet'],['dbg','anvil','Débogage'],['admins','lock','Administrateurs']];
Object.assign(UIC,{grid:'<rect x="3" y="3" width="8" height="8" rx="1"/><rect x="13" y="3" width="8" height="8" rx="1"/><rect x="3" y="13" width="8" height="8" rx="1"/><rect x="13" y="13" width="8" height="8" rx="1"/>',
 shieldk:'<path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z"/><path d="M9 12l2 2 4-4"/>'});
UIC.gift=UIC.gift||'<rect x="3" y="9" width="18" height="12" rx="1"/><path d="M3 13h18M12 9v12"/>';
const ADM={players:null,pErr:'',admins:null,aErr:'',busy:false};
async function admLoadPlayers(){
  if(ADM.pLoad) return; ADM.pLoad=true; ADM.pErr=''; ADM.players=null;
  try{ const qs=await FB.db.collection(COL('profiles')).limit(300).get(); ADM.players=qs.docs.map(d=>({uid:d.id,...d.data()})).sort((a,b)=>(isOnline(b)-isOnline(a))||String(a.name||'').localeCompare(String(b.name||''))) }
  catch(e){ ADM.pErr=(e&&e.code)||'erreur' }
  ADM.pLoad=false; if(UI.scr==='admin') render();
}
async function admLoadAdmins(){
  if(ADM.aLoad) return; ADM.aLoad=true;
  try{ const d=await FB.db.collection(COL('config')).doc('admin').get(); ADM.admins=d.exists?(d.data().uids||[]):[] }catch(e){ ADM.aErr=(e&&e.code)||'erreur' }
  ADM.aLoad=false; if(UI.scr==='admin') render();
}
async function admSetAdmins(list){
  try{ await FB.db.collection(COL('config')).doc('admin').set({uids:list},{merge:true}); ADM.admins=list; toast('Liste des administrateurs mise à jour.') }
  catch(e){ toast('Échec ('+((e&&e.code)||'erreur')+').') }
  render();
}
async function admSeasonTitle(){
  const v=($('#admstitle')||{}).value; const title=String(v||'').trim().slice(0,60);
  try{ await FB.db.collection(COL('config')).doc('reset').set({title},{merge:true}); FB.season=Object.assign({},FB.season||{n:0},{title}); lsSet(KP+'seasonc',JSON.stringify(FB.season)); seasonPaint(); toast('Titre de la saison mis à jour.') }
  catch(e){ toast('Échec ('+((e&&e.code)||'erreur')+') : vérifiez la règle Firestore de config/reset.') }
  render();
}
const admCard=(ic,t,d,body,cl='')=>`<section class="admc ${cl}"><header><span class="admci">${uic(ic)}</span><div><h3>${t}</h3>${d?`<small>${d}</small>`:''}</div></header>${body}</section>`;
function admHome(){
  const n=FB.season?(+FB.season.n||0):0,on=FR&&FR.prof?Object.values(FR.prof).filter(p=>isOnline(p)).length:0;
  const st=(v,l,ic)=>`<div class="adms"><span>${uic(ic)}</span><b class="num">${v}</b><small>${l}</small></div>`;
  return `<div class="admstats">${st(esc(seasonTitle()),'Saison en cours','flag')}${st(n,'Remises à zéro','swords')}${st(ADM.players?ADM.players.filter(isOnline).length:'—','Joueurs en ligne','people')}${st(ADM.players?ADM.players.length:'—','Comptes','people')}</div>
   <div class="admgrid">${admCard('lock','Votre compte',`Nom : <b>${esc(FB.prof?FB.prof.name:'?')}</b>`,`<p class="hint">Identifiant (UID) : <code class="uid">${esc(FB.user.uid)}</code></p><button class="btn sm" data-act="copyUid">Copier l’UID</button>`)}
    ${admCard('flag','Saison',esc(seasonTitle()),`<p class="hint">Titre affiché sous « Cendrelame » et remise à zéro de tous les comptes.</p><button class="btn sm pri" data-act="admTab" data-t="season">Gérer la saison</button>`)}
    ${admCard('mail','Messages système','Informations, alertes et cadeaux',`<button class="btn sm pri" data-act="admMail">${uic('send')} Écrire un message</button>`)}
    ${admCard('skull','Bestiaire','Statistiques des ennemis',`<button class="btn sm pri" data-act="scr" data-s="best">Ouvrir le Bestiaire</button>`)}</div>`;
}
function admSeason(){
  return `<div class="admgrid one">${admRkCard()}${admCard('flag','Titre de la saison','Affiché pour tous les joueurs sous le titre du jeu',`<div class="row" style="gap:8px"><input class="pcsel" id="admstitle" maxlength="60" value="${esc((FB.season&&FB.season.title)||'')}" placeholder="${esc('Saison '+Math.max(1,FB.season?(+FB.season.n||0):1))}" style="flex:1"><button class="btn pri" data-act="admSTitle">Enregistrer</button></div><small class="mute">Laissez vide pour afficher « Saison N ».</small>`)}
   ${rankAdminHTML()}${seasonAdminHTML().replace('<section class="panel" style="margin-top:12px"><h2 style="margin-top:0">Remise à zéro de tous les comptes</h2>','<section class="admc danger"><header><span class="admci">'+uic('warn')+'</span><div><h3>Remise à zéro de tous les comptes</h3><small>Nouvelle saison</small></div></header>')}</div>`;
}
function admPlayers(){
  if(!ADM.players&&!ADM.pErr){ setTimeout(admLoadPlayers,0); return '<p class="hint">Chargement des joueurs…</p>' }
  if(ADM.pErr) return admCard('warn','Liste des joueurs indisponible',ADM.pErr,`<p class="hint">Ajoutez cette règle Firestore pour que les administrateurs puissent lister les profils :</p><pre class="admpre">match /profiles/{uid} {\n  allow list: if request.auth != null\n    && request.auth.uid in get(/databases/$(database)/documents/config/admin).data.uids;\n}</pre><button class="btn sm" data-act="admPl">Réessayer</button>`,'danger');
  const q=(UI.admQ||'').toLowerCase(),L=ADM.players.filter(p=>!q||String(p.name||'').toLowerCase().includes(q));
  const rows=L.map(p=>{const c=p.char,ol=isOnline(p);return `<tr><td><span class="st ${ol?'on':''}"></span></td><td><b>${esc(p.name||'?')}</b></td><td>${c?`${esc(c.name)} · ${(CLASSES[c.cls]||{n:''}).n} niv. ${c.lvl}`:'<span class="mute">—</span>'}</td><td class="mute">${ol?'En ligne':p.lastSeen?new Date(tsMs(p.lastSeen)).toLocaleString('fr-FR',{dateStyle:'short',timeStyle:'short'}):'—'}</td><td><code class="uid">${esc(p.uid)}</code></td><td><button class="btn sm" data-act="admMailTo" data-n="${esc(p.name||'')}">${uic('mail')}</button></td></tr>`}).join('');
  return `<div class="row" style="gap:8px;margin-bottom:10px"><input class="pcsel" id="admq" placeholder="Rechercher un joueur" value="${esc(UI.admQ||'')}" style="flex:1"><button class="btn sm" data-act="admPl">Actualiser</button></div>
   <div class="admtbl"><table><thead><tr><th></th><th>Compte</th><th>Personnage</th><th>Vu</th><th>UID</th><th></th></tr></thead><tbody>${rows||'<tr><td colspan="6" class="mute">Aucun joueur.</td></tr>'}</tbody></table></div>`;
}
function admAdmins(){
  if(ADM.admins==null&&!ADM.aErr){ setTimeout(admLoadAdmins,0); return '<p class="hint">Chargement…</p>' }
  const L=ADM.admins||[];
  return admCard('lock','Administrateurs',`${L.length} compte${L.length>1?'s':''}`,`<ul class="admlist">${L.map(u=>`<li><code class="uid">${esc(u)}</code>${u===FB.user.uid?'<span class="admme">vous</span>':`<button class="btn sm danger" data-act="admDel" data-u="${esc(u)}">Retirer</button>`}</li>`).join('')}</ul>
   <div class="row" style="gap:8px;margin-top:10px"><input class="pcsel" id="admnew" placeholder="UID du nouvel administrateur" style="flex:1"><button class="btn pri" data-act="admAdd">Ajouter</button></div><small class="mute">L’UID se trouve dans Administration → Vue d’ensemble du compte concerné, ou dans l’onglet Joueurs.</small>`);
}
function viewAdmin(){
  if(!FB.admin){ return `<div class="scrhead"><h2>Administration</h2>${backBtn()}</div><p class="hint">Réservé aux administrateurs.</p>` }
  const t=ADM_TABS.some(x=>x[0]===UI.admT)?UI.admT:'home';
  const nav=ADM_TABS.map(([k,i,n])=>`<button class="${t===k?'on':''}" data-act="admTab" data-t="${k}">${uic(i)}<span>${n}</span></button>`).join('');
  const ok=S&&S.heroes&&S.heroes.length;
  const body=t==='home'?admHome():t==='season'?admSeason():t==='players'?admPlayers():t==='admins'?admAdmins()
   :t==='mail'?admCard('mail','Messages système','Envoyés dans la messagerie de tous les joueurs ou d’un seul',`<p class="hint">Rédigez un message (information, alerte ou cadeau avec pièces jointes) depuis la fenêtre de messagerie.</p><button class="btn pri" data-act="admMail">${uic('send')} Ouvrir l’éditeur de message</button>`)+updCardHTML()
   :t==='best'?admCard('skull','Bestiaire','Réglez les statistiques et les compétences des ennemis pour tous les joueurs',`<button class="btn pri" data-act="scr" data-s="best">Ouvrir le Bestiaire</button>`)
   :t==='give'?`<div class="admwide">${dbgGive(ok)}</div>`:`<div class="admwide">${dbgPanel()}</div>`;
  return `<div class="adm"><header class="admhead"><span class="admlogo">${uic('shieldk')}</span><div><h2>Administration</h2><small>${esc(FB.prof?FB.prof.name:'')} · ${esc(seasonTitle())}</small></div><span style="margin-left:auto"></span>${backBtn()}</header>
   <div class="admbody"><nav class="admnav">${nav}</nav><div class="admmain">${body}</div></div></div>`;
}

