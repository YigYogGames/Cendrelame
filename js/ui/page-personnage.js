/* Cendrelame · ui/page-personnage.js */
/* ===== 0.4.8 : page personnage (bandeau + onglets) ===== */
function hSpecHTML(h){
  const c=CLASSES[h.cls];
  if(!h.spec) return `<div class="specs">${Object.entries(c.specs).map(([sid,sp])=>`<div class="speccol ${h.lvl<SPEC_L?'lockd':''}"><h4 style="--co:${sp.co}">${spIcon(sp)}${sp.n}</h4><p class="hint">${sp.d}</p>${specTree(h.cls,sid,h,true)}
      <button class="btn ${UI.specConf===sid?'danger':'pri'}" data-act="chooseSpec" data-s="${sid}" ${h.lvl<SPEC_L?'disabled':''}>${h.lvl<SPEC_L?`🔒 Niveau ${SPEC_L} requis`:UI.specConf===sid?'Confirmer : choix définitif':'Choisir '+sp.n}</button></div>`).join('')}</div>
      <p class="hint" style="text-align:center">${h.lvl<SPEC_L?`La spécialisation se débloque au niveau ${SPEC_L}. Vous pouvez déjà découvrir les deux arbres de talents.`:'Choisissez votre spécialisation. Le choix est définitif : seule une Potion d’oubli permet de réinitialiser vos compétences.'}</p>`;
  const sp=c.specs[h.spec];
  return `<div class="specs one"><div class="speccol"><h4 style="--co:${sp.co}">${spIcon(sp)}Spécialisation : ${sp.n}</h4><p class="hint">${sp.d}</p>${specTree(h.cls,h.spec,h,false)}</div></div>`;
}
function hSkillsTabOld(h){
  const c=CLASSES[h.cls],base=c.skills.map(sk=>skTile(sk,h)).join(''),sel=UI.skSel&&SK[UI.skSel];
  let det='';
  if(sel&&sel.id!=='atk'){ const r=h.learned[sel.id]||0,req=skReq(sel,h),eq=h.loadout.includes(sel.id);
    det=`<div class="skdet">${skCard(sel,h)}<div class="row" style="justify-content:center"><button class="btn pri" data-act="learn" data-id="${sel.id}" ${req||h.sp<1||r>=skMax(sel)?'disabled':''}>${r>=skMax(sel)?'Rang maximum':r?'Améliorer (+1 rang)':'Apprendre'}</button>${sel.t==='a'&&r?`<button class="btn" data-act="equipSk" data-id="${sel.id}">${eq?'Retirer de la barre':'Équiper'}</button>`:''}</div></div>`;
  } else det=`<p class="hint hdhint">${NOHOVER?'Touchez':'Survolez'} une compétence pour voir ses détails, cliquez dessus pour l’apprendre ou l’équiper.</p>`;
  const fp=matAll('p_oubli');
  const bar=Array.from({length:LOADOUT_MAX},(_,i)=>{const id=h.loadout[i],q=id&&SK[id];
    return `<div class="sbslot ${q?'full':''}" data-sbi="${i}">${q?`<button class="skc" style="--co:${q.co}" data-act="skSel" data-id="${id}" data-skdrag="${id}" data-from="${i}" data-tip="sk:${id}" aria-label="Emplacement ${i+1} : ${esc(q.n)}">${spIcon(q)}${q.ap?`<em class="apk">${q.ap}</em>`:''}</button>`:`<span aria-label="Emplacement ${i+1} vide">${i+1}</span>`}</div>`}).join('');
  return `<div class="h2grid"><div class="h2left">
      <h3 class="skh">Compétences de base</h3><div class="skrow">${base}</div>
      <h3 class="skh">Spécialisation</h3>${hSpecHTML(h)}
      <div class="row forget"><span class="hint">Potion d’oubli : réinitialise toutes les compétences et la spécialisation (en vente chez le Marchand). Possédées : <b class="num">${fp}</b></span><button class="btn sm ${UI.forgetConf?'danger':''}" data-act="forget" ${fp?'':'disabled'}>${UI.forgetConf?'Confirmer la réinitialisation':'Boire une potion d’oubli'}</button></div></div>
    <div class="h2right"><div class="h2det">${det}</div>
      <h3 class="skh">Barre de sorts <small class="mute num">${h.loadout.length} / ${LOADOUT_MAX}</small></h3><div class="spsticky"><div class="spbar h2bar" id="spbar">${bar}</div></div>
      <p class="hint" style="text-align:center;margin:4px 0 0">Glissez-déposez une compétence active apprise dans un emplacement. Glissez un sort hors de la barre pour le retirer, ou d’un emplacement à l’autre pour changer l’ordre.</p></div></div>`;
}
function hStatsTab(h){
  const s=heroStats(h),c=CLASSES[h.cls],ms=c.role==='mag'?['Intelligence',s.mag]:['Force',s.atk],BP=bagParts();
  const row=(ic,n,v)=>`<span>${uic(ic)}</span><span>${n}</span><b class="num">${v}</b>`;
  const aCost=ascCost(h);
  return `<div class="h2stg"><div class="h2card"><h3>${uic('swords')}Attaque</h3><div class="h2st">${row('swords',ms[0],Math.round(ms[1]))}${row('star','Critique',r1(s.crit)+' %')}${row('star','Dégâts critiques',Math.round(s.critDmg)+' %')}${row('auto','Vitesse',Math.round(s.spd))}${row('flask','Vol de vie',r1(s.lifesteal||0)+' %')}${s.dmgPct?row('swords','Dégâts bonus',r1(s.dmgPct)+' %'):''}</div></div>
    <div class="h2card"><h3>${uic('shieldk')}Défense</h3><div class="h2st">${row('shieldk','PV',Math.round(s.hp))}${row('shieldk','Défense physique',Math.round(s.def))}${row('shieldk','Défense magique',Math.round(s.res))}${row('auto','Esquive',r1(s.dodge)+' %')}${row('star','Points d’action',s.ap)}</div></div>
    <div class="h2card"><h3>${uic('flag')}Résistances</h3><div class="h2res">${RES_K.map(k=>`<div><span>${STAT_N[k].replace('Résistance ','').replace(/^(à la |au |aux |à l’)/,'')}</span><b class="num">${r1(s[k]||0)} %</b><i><b style="width:${Math.min(100,(s[k]||0)/RES_CAP*100)}%"></b></i></div>`).join('')}</div></div></div>
    <div class="h2stg h2two"><div class="h2card"><h3>${uic('book')}Base + équipement</h3><dl class="stats cats">${BP.mini}</dl><div class="row" style="justify-content:center;margin-top:8px"><button class="btn sm" data-act="statSplit" aria-pressed="${!!S.statSplit}">${S.statSplit?'Masquer le détail':'Voir le détail (base + équipement)'}</button></div></div>
    <div class="h2card"><h3>${uic('star')}Ascension <span class="stars" style="margin-left:auto">${'★'.repeat(h.stars)}${'☆'.repeat(5-h.stars)}</span></h3>
      ${h.stars>=5?'<p class="hint">Ascension maximale. +10% de stats de base par étoile.</p>':`<p class="hint" style="margin-bottom:8px">+10 % de stats de base. Niveau maximum (${MAXL}) requis${h.lvl<MAXL?` — vous êtes niveau ${h.lvl}`:''}.</p><div class="row"><button class="btn" data-act="ascend" ${h.lvl<MAXL||!canPay(aCost)?'disabled':''}>Ascension ${h.stars+1}</button>${costHTML(aCost)}</div>`}</div></div>`;
}
function viewHeroes(){
  const h=S.heroes[0],c=CLASSES[h.cls],s=heroStats(h),need=h.lvl>=MAXL?1:xpNeed(h.lvl),ms=c.role==='mag'?['Intelligence',s.mag]:['Force',s.atk];
  const tab=UI.heroTab==='stats'?'stats':'skills',aCost=ascCost(h),canAsc=h.stars<5&&h.lvl>=MAXL&&canPay(aCost);
  const rib=[['PV',Math.round(s.hp)],[ms[0],Math.round(ms[1])],['Défense',Math.round(s.def)],['Déf. magique',Math.round(s.res)],['Vitesse',Math.round(s.spd)],['Critique',r1(s.crit)+' %'],['Puissance',Math.round(heroPower(h))]]
    .map(([a,b],i)=>`<span class="${i===6?'pw':''}"><small>${a}</small><b class="num">${b}</b></span>`).join('');
  return `<div class="h2page"><section class="panel h2ban">${heroArt(h.cls,h.skin)}
    <div class="h2id"><h2>${esc(h.name)} <span class="stars" title="Ascension">${'★'.repeat(h.stars)}${'☆'.repeat(5-h.stars)}</span></h2><small>${c.n} · niveau ${h.lvl} · ${h.lvl>=MAXL?'Niveau max':`XP ${fmt(h.xp)} / ${fmt(need)}`}</small>
      <div class="h2xp"><i style="width:${h.lvl>=MAXL?100:h.xp/need*100}%"></i></div><div class="h2rib">${rib}</div></div>
    <div class="h2act"><span class="h2pts ${h.sp?'':'z'}" ${ttip('Points de compétence','Dépensez-les dans l’onglet Compétences.')}>${h.sp} point${h.sp>1?'s':''} à dépenser</span>
      <button class="btn sm ${tab==='stats'?'on':''}" data-act="heroTab" data-t="${tab==='stats'?'skills':'stats'}" aria-pressed="${tab==='stats'}">${tab==='stats'?'Masquer le détail':'Détail des statistiques'}</button>
      <button class="btn sm" data-act="${h.stars>=5?'heroTab':'ascend'}" data-t="stats" ${h.stars<5&&!canAsc?'disabled':''} ${ttip(h.stars>=5?'Ascension maximale':'Ascension '+(h.stars+1),h.stars>=5?'+10 % de stats de base par étoile.':`+10 % de stats de base. Niveau ${MAXL} requis.`)}>Ascension ★</button></div></section>
    <div class="h2tabs" role="tablist"><button role="tab" class="${tab==='skills'?'on':''}" aria-selected="${tab==='skills'}" data-act="heroTab" data-t="skills">Compétences${h.sp?` <span class="h2dot"></span>`:""}</button><button role="tab" class="${tab==='stats'?'on':''}" aria-selected="${tab==='stats'}" data-act="heroTab" data-t="stats">Statistiques détaillées</button></div>
    <section class="panel h2body skpanel">${tab==='stats'?hStatsTab(h):hSkillsTab(h)}</section></div>`;
}

/* ===== 0.4.8 : inventaire = sac + roue + stats ; coffre à gauche ===== */
function invTopHTML0(){
  const h=S.heroes[0];
  return `<div class="iptop">${UI.invStats?`<div class="ipstats"><h4>Statistiques</h4><dl class="stats cats">${bagParts().mini}</dl><button class="btn sm" data-act="statSplit" aria-pressed="${!!S.statSplit}">${S.statSplit?'Masquer le détail':'Base + équipement'}</button></div>`:''}<div class="ipwheel">${runeDollHTML(h,false)}</div></div>`;
}

