/* Cendrelame · core/sauvegarde.js */
/* --- sauvegarde --- */
function accExport(){
  if(S&&S.heroes&&S.heroes.length&&ACC.cur!=null&&!UI.scr) save();
  const chars=Array.from({length:MAXCH},(_,i)=>charRaw(i));
  return btoa(unescape(encodeURIComponent(JSON.stringify({acc:1,gold:ACC.gold,seenVer:ACC.seenVer,chars}))));
}
function viewOpts0(){
  return `<div class="scrhead"><h2>Options</h2>${backBtn()}</div>
    <h3 style="margin-bottom:10px">Sauvegarde</h3><div class="grid g2"><section class="panel"><h2>Exporter</h2><p class="hint" style="margin-bottom:8px">La partie (tous vos personnages et l’or partagé) est enregistrée dans ce navigateur. Copiez ce code pour la garder ailleurs ou la transférer sur un autre appareil.</p>
      <textarea id="expTxt" readonly>${accExport()}</textarea><div class="row" style="margin-top:8px"><button class="btn" data-act="copyExp">Copier</button></div></section>
    <section class="panel"><h2>Importer</h2><p class="hint" style="margin-bottom:8px">Collez un code exporté. Un code complet remplace tous vos personnages ; un ancien code à un seul héros est ajouté dans un emplacement libre.</p>
      <textarea id="impTxt" placeholder="Code de sauvegarde"></textarea><div class="row" style="margin-top:8px"><button class="btn" data-act="import">Importer</button></div></section>
    <section class="panel"><h2>Tout effacer</h2><p class="hint" style="margin-bottom:8px">Efface définitivement tous les personnages, leurs objets, leur progression et l’or.</p>
      ${UI.confirm==='reset'?`<div class="row"><button class="btn danger" data-act="reset">Oui, tout effacer</button><button class="btn" data-act="cancelReset">Annuler</button></div>`:`<button class="btn danger" data-act="reset">Recommencer à zéro</button>`}</section></div>
`;
}
const KEY_RES=new Set(['KeyI','Escape','Tab','Enter','ShiftLeft','ShiftRight','ControlLeft','ControlRight','AltLeft','AltRight','MetaLeft','MetaRight','CapsLock']);
function viewOpts(){
  const t=UI.optTab||'keys',H=S&&S.heroes&&S.heroes[0];
  const tab=(k,ic,n)=>`<button class="${t===k?'on':''}" data-act="optTab" data-t="${k}" aria-pressed="${t===k}">${ic}${n}</button>`;
  let body='';
  if(t==='keys'){
    const sl=[{n:'Attaque de base',id:'atk'},...Array.from({length:7},(_,i)=>({n:'Sort '+(i+1),id:H?H.loadout[i]:null}))];
    const rows=sl.map((x,i)=>{const q=x.id&&SK[x.id],w=UI.keyWait===i;return `<div class="kr">${q?`<span class="skc ski" style="--co:${q.co||'#5a5048'}">${spIcon(q)}</span>`:'<span class="ski emp"></span>'}<span><b>${x.n}</b><small>${q?esc(q.n):H?'Emplacement vide':'Selon la barre de sorts du personnage'}</small></span><button class="kc ${w?'wait':''}" data-act="keySet" data-i="${i}" ${ttip(w?'Appuyez sur une touche':'Changer la touche','Échap pour annuler.')}>${w?'…':esc(keyLab(KEYS()[i]))}</button></div>`}).join('');
    body=`<h3>Raccourcis de combat</h3><p class="hint">Cliquez sur une touche puis appuyez sur la nouvelle touche. Échap pour annuler. Si la touche est déjà utilisée, les deux raccourcis sont échangés.</p>${rows}
      <div class="foot"><small class="mute">${UI.keyWait!=null?'En attente d’une touche…':'La touche I reste réservée à l’inventaire.'}</small><button class="btn sm" data-act="keyDef" ${ttip('Touches par défaut','Remet les touches 1 à 6.')}>Touches par défaut (1 à 6)</button></div>`;
  } else if(t==='ui'){
    body=`<h3>Interface</h3><div class="orow"><span class="lab">Explications des ateliers<small>Affiche l’aide détaillée dans la Forge et l’Enchantement.</small></span><button class="sw ${fHelpOn()?'':'off'}" data-act="fHelp" role="switch" aria-checked="${fHelpOn()}" ${ttip(fHelpOn()?'Masquer les explications':'Afficher les explications')}></button></div>
      <div class="orow"><span class="lab">Nouveautés de la grande mise à jour<small>Réaffiche le parchemin de la version ${UPOP.v} (« ${esc(UPOP.t)} »)${ACC.upHide===UPOP.v?' ; il est actuellement masqué à l’arrivée en jeu':''}.</small></span><button class="btn sm" data-act="upShow" ${ttip('Revoir les nouveautés','Ouvre le parchemin de la dernière grande mise à jour.')}>${uic('scroll')} Revoir les nouveautés</button></div>`;
  } else if(t==='save'){
    body=`<h3>Sauvegarde</h3><p class="hint">La partie (tous vos personnages et l’or partagé) est enregistrée dans ce navigateur${FB.user?' et en ligne sur votre compte':''}.</p>
      <div class="osec"><b>Exporter</b><p class="hint" style="margin:2px 0 6px">Copiez ce code pour garder la partie ailleurs ou la transférer sur un autre appareil.</p><textarea id="expTxt" readonly>${accExport()}</textarea><div class="row" style="margin-top:8px"><button class="btn" data-act="copyExp">Copier le code</button></div></div>
      <div class="osec"><b>Importer</b><p class="hint" style="margin:2px 0 6px">Collez un code exporté. Un code complet remplace tous vos personnages ; un ancien code à un seul héros est ajouté dans un emplacement libre.</p><textarea id="impTxt" placeholder="Code de sauvegarde"></textarea><div class="row" style="margin-top:8px"><button class="btn" data-act="import">Importer</button></div></div>`;
  } else {
    body=`<h3>Compte</h3><div class="orow"><span class="lab">${FB.user?`Connecté : <b>${esc(FB.prof?FB.prof.name:(FB.user.email||'Compte'))}</b><small>${FB.sync==='err'?'⚠ Synchronisation impossible':FB.sync==='busy'?'Synchronisation…':'Sauvegarde en ligne active'}</small>`:'Mode hors ligne<small>Sauvegarde sur cet appareil uniquement.</small>'}</span>${FB.user?'<button class="btn sm" data-act="fbLogout">Se déconnecter</button>':'<button class="btn sm pri" data-act="scr" data-s="login">Se connecter</button>'}</div>
      <div class="orow"><span class="lab">Recommencer à zéro<small>Efface définitivement tous les personnages, leurs objets, leur progression et l’or.</small></span>${UI.confirm==='reset'?`<button class="btn sm danger" data-act="reset">Oui, tout effacer</button><button class="btn sm" data-act="cancelReset">Annuler</button>`:`<button class="btn sm danger" data-act="reset">Effacer</button>`}</div>`;
  }
  return `<div class="scrhead"><h2>Options</h2>${backBtn()}</div><div class="opA"><nav aria-label="Rubriques">${tab('keys',uic('gear'),'Raccourcis')}${tab('ui',uic('grid'),'Interface')}${tab('save',uic('book'),'Sauvegarde')}${tab('acct',uic('people'),'Compte')}</nav><article>${body}</article></div>`;
}
document.addEventListener('keydown',e=>{ if(UI.keyWait==null) return; e.preventDefault(); e.stopPropagation(); const i=UI.keyWait;
  if(e.code==='Escape'){ UI.keyWait=null; render(); return }
  if(KEY_RES.has(e.code)){ if(e.code==='KeyI') toast('La touche I est réservée à l’inventaire.'); return }
  const K=KEYS().slice(),j=K.indexOf(e.code); if(j>=0&&j!==i) K[j]=K[i]; K[i]=e.code; ACC.keys=K; saveAcc(); UI.keyWait=null; render() },true);
function adminPanel(){
  if(!FB.user) return '';
  return `<h3 style="margin:22px 0 4px">Administration</h3><section class="panel"><p class="hint" style="margin-bottom:8px">Identifiant de votre compte (UID) : <code class="uid">${esc(FB.user.uid)}</code> <button class="btn sm" data-act="copyUid">Copier</button></p>${FB.admin?'<button class="btn pri" data-act="scr" data-s="best">Ouvrir le Bestiaire</button> <small class="mute">Réglez les statistiques et les compétences des ennemis pour tous les joueurs.</small>':'<p class="hint" style="margin:0">Le Bestiaire est réservé aux administrateurs.</p>'}</section>${seasonAdminHTML()}`;
}
function dbgGive(ok){
  if(!FB.admin) return `<section class="panel dbggive"><h2>Donner un objet</h2><p class="hint">Réservé aux administrateurs : connectez-vous avec un compte administrateur.</p></section>`;
  const g=UI.dg=UI.dg||{k:'c_relic',n:1,slot:'weapon',rar:3,lvl:50,cls:'',up:0,fr:6};
  const keys=[...MATS,'c_relic','s_ch0','s_ch1',...Object.keys(POTS),...Object.keys(NEWI).filter(k=>!POTS[k])];
  const opt=(v,t,sel)=>`<option value="${v}" ${String(sel)===String(v)?'selected':''}>${esc(t)}</option>`;
  const dis=ok?'':'disabled';
  return `<section class="panel dbggive"><h2>Donner un objet <small class="mlad">Admin</small></h2>
   <div class="dgrow"><b>Ressource</b><select class="pcsel" data-dg="k">${keys.map(k=>opt(k,MAT_OBJ[k]||MAT_N[k]||k,g.k)).join('')}</select><input class="pcsel num" type="number" min="1" max="100000" data-dg="n" value="${g.n}" aria-label="Quantité"><button class="btn sm pri" data-act="dgMat" ${dis}>Donner</button></div>
   <div class="dgrow"><b>Équipement</b><select class="pcsel" data-dg="slot">${ITEM_SLOTS.map(sl=>opt(sl,SLOT_N[sl],g.slot)).join('')}</select><select class="pcsel" data-dg="rar">${RAR.map((r,i)=>opt(i,r.n,g.rar)).join('')}</select><label class="dgl">Niv.<input class="pcsel num" type="number" min="1" max="60" data-dg="lvl" value="${g.lvl}"></label><label class="dgl">+<input class="pcsel num" type="number" min="0" max="10" data-dg="up" value="${g.up}"></label><select class="pcsel" data-dg="cls">${opt('','Classe du personnage',g.cls)}${Object.entries(CLASSES).map(([k,c])=>opt(k,c.n,g.cls)).join('')}</select><button class="btn sm pri" data-act="dgItem" ${dis}>Donner</button></div>
   <div class="dgrow"><b>Relique</b><select class="pcsel" data-dg="fr">${PC_FR.map((F,i)=>F[2]==null?opt(i,'Cadre '+F[0],g.fr):'').join('')}</select><button class="btn sm pri" data-act="dgRelic" ${dis}>Débloquer</button><button class="btn sm" data-act="dgRelicAll" ${dis}>Toutes</button><button class="btn sm danger" data-act="dgRelicNone" ${dis}>Retirer les reliques</button></div>
   <div class="dgrow dgall"><b>Tout débloquer</b><button class="btn sm pri" data-act="admUnlock" data-w="all" ${dis}>Tout</button><button class="btn sm" data-act="admUnlock" data-w="cos" ${dis}>Cosmétiques</button><button class="btn sm" data-act="admUnlock" data-w="tr" ${dis}>Trophées et titres</button><button class="btn sm danger" data-act="admUnlock" data-w="none" ${dis}>Retirer les cosmétiques</button></div>
   <p class="hint" style="margin:6px 0 0">Les objets vont dans le sac du personnage chargé ; s’il est plein, dans le coffre du compte.</p></section>`;
}
function dgPut(att){ const left=bagAddMat(S.bag,Object.keys(att)[0],Object.values(att)[0]); if(left>0){ const t=mlPlace({[Object.keys(att)[0]]:left}); if(!t) return Object.values(att)[0]-left; for(const x of t) x.T.bag=x.bag; saveAcc() } return Object.values(att)[0] }
function dbgPanel(){
  const ok=S&&S.heroes&&S.heroes.length,d=DBG(),h=ok&&S.heroes[0];
  const B=(k,t,cls='')=>`<button class="btn sm ${cls}" data-act="dbg" data-k="${k}" ${ok?'':'disabled'}>${t}</button>`;
  const T=(k,t,on)=>`<label class="optrow dbgt"><input type="checkbox" data-act="dbgT" data-k="${k}" ${on?'checked':''}> ${t}</label>`;
  const rp=UI.confirm==='dbgReset'?`${B('resetChar','Oui, tout remettre à zéro','danger')}<button class="btn sm" data-act="cancelReset">Annuler</button>`:B('resetChar','Remettre à zéro la progression du personnage','danger');
  return `<h3 style="margin:22px 0 4px">Débogage</h3><p class="hint" style="margin-bottom:10px">${ok?`Les actions s’appliquent au personnage chargé : <b>${esc(h.name)}</b> (${CLASSES[h.cls].n}, niveau ${h.lvl}).`:'Chargez un personnage (Jouer) pour utiliser les actions de débogage.'} Les réglages cochés s’appliquent à tous les personnages.</p>
    <div class="grid g2 dbg">
      <section class="panel"><h2>Réglages</h2>${T('free','Aucun coût : forge, améliorations, arbres de talents, ouverture des zones et achats',d.free)}${T('fast','Récoltes accélérées (×60 : une récolte toutes les 5 secondes)',d.fast)}</section>
      <section class="panel"><h2>Ressources</h2><div class="row">${B('mats0','Composants à 0')}${B('matsMax','Composants au maximum')}${B('mats100','+100 de chaque composant')}${B('prism','+5 Prismes divins')}</div>
        <div class="row" style="margin-top:8px">${B('gold0','Or à 0')}${B('gold10k','+10 000 or')}${B('gold1m','+1 000 000 or')}</div></section>
      <section class="panel"><h2>Héros</h2><div class="row">${B('lvlUp','+1 niveau')}${B('lvl10','+10 niveaux')}${B('lvlMax','Niveau maximum')}${B('lvl1','Retour au niveau 1')}${B('sp5','+5 points de compétence')}</div>
        <div class="row" style="margin-top:8px">${B('unequip','Retirer tout l’équipement')}${B('advAll','Débloquer toute l’Aventure')}${B('advReset','Remettre l’Aventure à zéro')}</div></section>
      <section class="panel"><h2>Inventaire et forge</h2><div class="row">${B('itemRand','Objet divin aléatoire')}${B('itemSet','Équipement légendaire complet')}${B('bagClear','Vider l’inventaire')}</div></section>
      <section class="panel"><h2>Compagnon</h2><div class="row">${[['tok','+1 000 jetons'],['tick','+10 tickets'],['tick2','+10 tickets supérieurs'],['items','Nourriture, pierres et objets'],['fin','Finir les expéditions'],['lv','+10 niveaux'],['hu0','Faim à 0'],['hu100','Faim à 100'],['board','Nouvelles expéditions']].map(([k,t])=>`<button class="btn sm" data-act="cpDbg" data-k="${k}" ${ok?'':'disabled'}>${t}</button>`).join('')}</div></section>
      <section class="panel"><h2>Divers</h2><div class="row">${B('news','Revoir le point « Nouveautés »')}</div><div class="row" style="margin-top:10px">${rp}</div>
        ${UI.confirm==='dbgReset'?'<p class="hint" style="color:var(--blood);margin-top:6px">Niveau, compétences, équipement, inventaire, matériaux, collecte et Aventure seront remis à zéro. Le nom, la classe et l’or partagé sont conservés.</p>':''}</section>
    </div>`;
}


