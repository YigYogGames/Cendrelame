/* Cendrelame · ui/communaute.js */
/* ================= Communauté ================= */
const COMM_T=[['card','card','Carte de joueur'],['custom','brush','Personnalisation'],['rank','podium','Classement'],['ah','coin','Hôtel des ventes'],['guild','shield','Guilde',1]];
function viewComm(){
  if(UI.commT==='ah'){ UI.commT='card' } const tab=UI.commT||'card',d=cardMine(),pts=trPts();
  const side=`<aside class="aminfo maside mtside"><div class="ambody"><h4>Communauté</h4><div class="masub" role="tablist">${COMM_T.map(([k,i,n,lk])=>`<button role="tab" aria-selected="${tab===k}" class="${tab===k?'on':''} ${lk?'lk':''}" ${lk?`aria-disabled="true" title="Arrive dans une prochaine mise à jour"`:`data-act="commT" data-t="${k}"`}>${uic(i)}<span>${n}</span>${lk?uic('lock'):''}</button>`).join('')}</div>
    <p class="amnote mute" style="margin-top:auto">Guilde : arrive dans une prochaine mise à jour.</p><p class="amnote mute">La liste d’amis s’ouvre avec le bouton rond à côté du sac.</p></div></aside>`;
  let main;
  if(tab==='custom'){ main=pcCustom8(d) } else if(0){
    const c=pcDraft(),lk=pcLockedSel(c),dirty=JSON.stringify(c)!==JSON.stringify(pcClean(pcDef()));
    const tB=c.title&&TRK[c.title]?TRK[c.title].n:null;
    const pd=Object.assign({},d,{icon:c.icon,fr:c.fr,bg:c.bg,title:tB,show:(c.show||[]).filter(id=>TRK[id]).slice(0,3)});
    const icons=PC_ICONS.map(([ic,need],i)=>{const l=pts<need;return `<button class="pcic ${c.icon===ic?'on':''} ${l?'lkd':''}" data-tip="pc:icon:${i}" data-act="pcSet" data-k="icon" data-v="${ic}" aria-pressed="${c.icon===ic}">${pcIcon(ic,46)}${l?`<span class="pclk">${uic('lock')}</span>`:''}</button>`}).join('');
    const frs=PC_FR.map(([n,col,need,fx,lt],i)=>{const l=!pcFrOk(i);return `<button class="pcfr ${fx?'fxs':''} ${c.fr===i?'on':''} ${l?'lkd':''}" style="--c:${col};--fr:${col};--fl:${lt||col}" data-fx="${fx||''}" data-tip="pc:fr:${i}" data-act="pcSet" data-k="fr" data-v="${i}" aria-label="Cadre ${n}" aria-pressed="${c.fr===i}">${l?uic('lock'):''}</button>`}).join('');
    const bgs=PC_BG.map(([i,n,ok])=>{const l=!ok();return `<button class="pcbg ${c.bg===i?'on':''} ${l?'lkd':''}" data-tip="pc:bg:${i}" aria-label="Fond ${n}" data-act="pcSet" data-k="bg" data-v="${i}" aria-pressed="${c.bg===i}">${zoneScene(i,'o'+i)}${l?`<span class="pclk">${uic('lock')}</span>`:''}</button>`}).join('');
    const titles=TROPHIES.filter(t=>t.t);
    const got=TROPHIES.filter(t=>trGot(t.id));
    main=`<div class="mtcm2"><div class="mtcmc pcprev pcview"><div class="pcfit"><small class="pcprevl">Aperçu${dirty?' · non enregistré':''}</small>${cardColl(pd,'cus')}<small class="pcprevl">Bannière du classement</small>${cardBanner(pd,'cusb')}</div></div><div class="aminfo maside"><div class="ambody">
      <h4>Icône</h4><div class="pcopt">${icons}</div>
      <h4>Cadre</h4><div class="pcopt">${frs}</div>
      <h4>Fond</h4><div class="pcopt">${bgs}</div>
      <h4>Titre</h4><select class="pcsel" id="pctitle" aria-label="Titre"><option value="">Aucun titre</option>${titles.map(t=>`<option value="${t.id}" ${c.title===t.id?'selected':''}>${trGot(t.id)?'':'🔒 '}${esc(t.n)}</option>`).join('')}</select><small class="mute">${c.title&&TRK[c.title]?(trGot(c.title)?`Titre obtenu avec le trophée « ${esc(TRK[c.title].n)} » le ${new Date(ACC.troph[c.title]).toLocaleDateString('fr-FR')}.`:`Verrouillé : obtenez le trophée « ${esc(TRK[c.title].n)} » (${esc(TRK[c.title].d)})`):'Les titres se débloquent avec les trophées marqués « Titre ».'}</small>
      <h4>Trophées affichés <small class="mute">${(c.show||[]).length} / 3</small></h4><div class="pcopt">${got.length?got.map(t=>`<button class="pcts ${(c.show||[]).includes(t.id)?'on':''}" data-act="pcShow" data-id="${t.id}" data-tip="pc:tr:${t.id}" aria-pressed="${(c.show||[]).includes(t.id)}"><span class="mtti sm ${trTier(t)}">${uic(trIc(t))}</span></button>`).join(''):'<small class="mute">Obtenez des trophées pour les afficher sur votre carte.</small>'}</div>
      <div class="pcsave">${lk.length?`<p class="pcwarn">${uic('lock')} Non débloqué : ${lk.map(esc).join(', ')}. Choisissez un élément débloqué pour enregistrer.</p>`:''}
       <div class="row"><button class="btn" data-act="pcReset" ${dirty?'':'disabled'}>Annuler</button><button class="btn pri" data-act="pcConfirm" ${dirty&&!lk.length?'':'disabled'}>Confirmer</button></div></div></div></div></div>`;
  } else if(tab==='rank'){ main=viewRank() } else if(tab==='ah'){ main=viewAH() } else {
    main=`<div class="pcview"><div class="pcfit">${cardColl(d,'v')}<h4>Aperçu dans le classement</h4>${cardBanner(d)}<p class="amnote mute">Votre carte s’affiche quand un joueur clique sur votre nom dans sa liste d’amis, puis sur « Carte ». La bannière sera utilisée dans le classement.</p></div></div>`;
  }
  return `<div class="mt1 comm">${side}<section class="mtmain ${tab==='rank'?'rkmain':''}"><div class="mctop"><h2>${tab==='custom'?'Personnalisation':tab==='rank'?'Classement de la saison':tab==='ah'?'Hôtel des ventes':'Carte de joueur'}</h2><span class="mute">${tab==='ah'?'Achetez et vendez de l’équipement entre joueurs. Les objets achetés arrivent par la messagerie.':tab==='custom'?'Cadres, ornements, portrait, fond, effets, traînée et aura de combat.':tab==='rank'?'Cliquez sur un joueur pour le sélectionner, puis inspectez son équipement.':'L’aperçu que les autres joueurs voient de vous.'}</span></div>${main}</section></div>`;
}
function pcSave(){ saveAcc(); presence(); render() }
function friendsOnline(){ if(!FB.user||!FB.prof) return null; const me=FB.user.uid; const acc=FR.list.filter(f=>f.status==='accepted'); return {on:acc.filter(f=>isOnline(FR.prof[f.users.find(x=>x!==me)])).length,n:acc.length} }

/* dates et conditions de déblocage des décorations */
const PC_BGTR={1:'a_b0',2:'a_b1',3:'a_b2',4:'a_b3',5:'p_r1',6:'p_d1'};
const PC_BGHOW={1:`Battre ${ZONES[0].boss.n} (${ZONES[0].n}).`,2:`Battre ${ZONES[1].boss.n} (${ZONES[1].n}).`,3:`Battre ${ZONES[2].boss.n} (${ZONES[2].n}).`,4:`Battre ${ZONES[3].boss.n} (${ZONES[3].n}).`,5:'Réussir un raid.',6:'Remporter un duel.'};
function pcUnlockSync(){
  if(!S||!S.heroes||!S.heroes.length) return; const U=ACC.cardUnl=ACC.cardUnl||{},pts=trPts(); let ch=false;
  const mark=(k,ok,ts)=>{ if(ok&&!U[k]){U[k]=ts||Date.now();ch=true} };
  PC_ICONS.forEach(([,need],i)=>need&&mark('icon'+i,pts>=need));
  PC_FR.forEach(([,,need],i)=>need&&mark('fr'+i,pts>=need));
  PC_BG.forEach(([i,,ok])=>{ if(!i) return; const tr=PC_BGTR[i]; mark('bg'+i,ok(),tr&&ACC.troph&&ACC.troph[tr]) });
  if(ch) saveAcc();
}
const pcD=t=>new Date(t).toLocaleDateString('fr-FR');
function pcTip(k){
  const [,kind,id]=k.split(':'),U=ACC.cardUnl||{},pts=trPts();
  const box=(t,st,body,lk)=>`<article class="it pctip" style="--rc:${lk?'var(--line2)':'#c99a3a'}"><header><b>${t}</b><small>${st}</small></header><p>${body}</p></article>`;
  const ok=(t,ts,how)=>box(t,`Débloqué le ${pcD(ts||Date.now())}`,how);
  const no=(t,how)=>box(t,'Verrouillé',how,1);
  const start=t=>box(t,'Disponible dès le départ','Décoration de base.');
  if(kind==='icon'){ const [ic,need]=PC_ICONS[+id],n=ic.startsWith('c:')?`Portrait : ${CLASSES[ic.slice(2)].n}`:`Emblème : ${({swords:'Lames croisées',shield:'Bouclier',star:'Étoile',trophy:'Trophée'})[ic.slice(2)]||ic.slice(2)}`;
    if(!need) return start(n); return pts>=need?ok(n,U['icon'+id],`Obtenu en atteignant ${need} points de trophées.`):no(n,`Atteignez ${need} points de trophées (vous en avez ${pts}).`) }
  if(kind==='fr'){ const [n,,need]=PC_FR[+id];
    if(need==null){ const ts=ACC.cos&&ACC.cos['fr'+id]; return ts?ok('Cadre '+n,ts,`Trouvé dans un ${CHEST_N}.`):no('Cadre '+n,`Relique rare : se trouve dans les Coffres des Reliques, récompense rare des raids.`) }
    if(!need) return start('Cadre '+n); return pts>=need?ok('Cadre '+n,U['fr'+id],`Obtenu en atteignant ${need} points de trophées.`):no('Cadre '+n,`Atteignez ${need} points de trophées (vous en avez ${pts}).`) }
  if(kind==='bg'){ const B=PC_BG.find(x=>x[0]===+id); if(!B) return ''; const [i,n,cond]=B;
    if(!i) return start('Fond : '+n); return cond()?ok('Fond : '+n,U['bg'+i],'Obtenu : '+PC_BGHOW[i].replace(/^./,c=>c.toLowerCase())):no('Fond : '+n,'Pour le débloquer : '+PC_BGHOW[i].replace(/^./,c=>c.toLowerCase())) }
  if(kind==='tr'){ const t=TRK[id]; if(!t) return ''; return ok(esc(t.n),ACC.troph[id],`${esc(t.d)} · ${t.p} points.`) }
  return '';
}

/* brouillon de personnalisation */
const pcClean=c=>({icon:c.icon,fr:+c.fr||0,bg:+c.bg||0,orn:c.orn||null,pf:c.pf||null,aura:c.aura||null,trail:c.trail||null,cfx:c.cfx||null,title:c.title||null,show:[...(c.show||[])]});
function pcDraft(){ if(!UI.pcDraft) UI.pcDraft=pcClean(pcDef()); return UI.pcDraft }
function pcLockedSel(c){
  const pts=trPts(),L=[]; const ic=PC_ICONS.find(x=>x[0]===c.icon); if(ic&&pts<ic[1]) L.push('icône');
  const F=pcFr(c.fr); if(!pcFrOk(+c.fr||0)) L.push('cadre '+F[0]);
  const B=PC_BG.find(x=>x[0]===c.bg); if(B&&!B[2]()) L.push('fond '+B[1]);
  if(c.title&&!trGot(c.title)) L.push('titre « '+(TRK[c.title]?TRK[c.title].n:'')+' »');
  for(const k of ['orn','pf','aura','trail','cfx']) if(c[k]&&!cosOwn(c[k])) L.push(cosN(c[k])); if(c.bg>=100&&!cosOwn(SBG_ID[c.bg])) L.push('fond '+cosN(SBG_ID[c.bg]));
  return L;
}

