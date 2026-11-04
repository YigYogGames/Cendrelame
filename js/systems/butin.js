/* Cendrelame · systems/butin.js */
/* ================= 0.8.10 : butin selon la difficulté et le palier ================= */
DIFF.normal.drop=1; DIFF.hero.drop=1.5; DIFF.myth.drop=1.5;
const RW_D={normal:[1,1,1,1,1,1],hero:[.5,1,1.3,1.6,2,1],myth:[.2,.7,1.5,2.2,3,1]};
const dKey=()=>C&&C.diff&&C.phase!=='idle'?C.diff:curDiff();
const dropM=dk=>(DIFF[dk]||DIFF.normal).drop||1;
const rwD=(rw,dk)=>rw.map((w,i)=>w*(RW_D[dk]||RW_D.normal)[i]);
const ascCh=t=>Math.min(15,3+(t||0)*.6);
const rdG2=t=>Math.min(30,2*(t||0));
function rdGear2(t){ if(Math.random()*100>=rdG2(t)) return null; const h=S.heroes[0],r=wpick(RD_EQW(t)),it=genItem(slotType(pick(SLOTS)),RD_IL(t),r,null,h.cls); const ok=addInv(it); setTimeout(()=>toast(`✦ Équipement bonus : ${it.name} (${RAR[it.rarity].n.toLowerCase()})${ok?'':' — inventaire plein, recyclé'}.`),1300); return it }

function viewCombatIdle(){
  const P=prog(),dk=curDiff(),D=DIFF[dk],hero=dk!=='normal',z=ZONES[UI.zone],L=D.L||UI.zone*10+UI.stage;
  const h=S.heroes[0],c=CLASSES[h.cls],st=heroStats(h),need=h.lvl>=MAXL?1:xpNeed(h.lvl);
  const stg=Array.from({length:10},(_,i)=>{const s=i+1,ok=unlocked(UI.zone,s),done=UI.zone<P.zone||(UI.zone===P.zone&&s<P.stage);
    return `<button class="stg ${UI.stage===s?'on':''} ${done?'done':''} ${s===10?'boss':''}" ${ok?'':'disabled'} data-act="stage" data-s="${s}">${s===10?'Boss':s}</button>`}).join('');
  const zones=ZONES.map((zz,i)=>{
    const lock=i>P.zone,cleared=i<P.zone,cur=i===P.zone,lv=D.L?`Niv ${D.L}`:`Niv ${i*10+1}-${i*10+10}`;
    const pr=cleared?'Terminée':cur?`Étape ${P.stage}/10`:'Verrouillée';
    return `<button class="ztile ${i===UI.zone?'on':''} ${cleared?'clear':''}" ${lock?'disabled':''} data-act="zone" data-i="${i}">
      <b>${lock?'🔒 ':''}${zz.n}</b><small>${lv} · Boss : ${zz.boss.n}</small><span class="zp">${pr}</span></button>`}).join('');
  const diffNote=dk==='hero'?`<p class="hint" style="color:var(--blood)"><b>Mode héroïque :</b> monstres niveau ${D.L}, bien plus agressifs. Les boss frappent fort et entrent en rage dès le tour ${D.rage+1}. Progression séparée.</p>`
    :dk==='myth'?`<p class="hint" style="color:var(--r3)"><b>Mode mythique :</b> monstres niveau ${D.L}. Les boss gagnent la Frappe dévastatrice et entrent en rage dès le tour ${D.rage+1}. Récompenses : or, XP et matériaux ×2, Prisme divin à 25 % sur Le Dévoreur.</p>`:heroOpen()?'':`<p class="hint">🔒 Le mode Héroïque se débloque au niveau ${HERO_L} (vous êtes niveau ${S.heroes[0].lvl}).</p>`;
  const mstat=c.role==='mag'?['Intelligence',st.mag]:['Force',st.atk];
  const mode=UI.advMode||'pve';
  const modeSeg=`<div class="advmode2" role="tablist"><button class="${mode==='pve'?'on':''}" data-act="advMode" data-m="pve">${uic('swords')} Aventure</button><button class="${mode==='pvp'?'on':''}" data-act="advMode" data-m="pvp">${uic('people')} Duel</button><button class="${mode==='raid'?'on':''}" data-act="advMode" data-m="raid">${uic('skull')} Défis</button></div>`;
  if(mode==='pve') return `<div class="advwrap">${modeSeg}${viewAdvMap()}</div>`;
  if(mode==='pvp') return `<div class="advwrap">${modeSeg}${viewDuel()}</div>`;
  if(mode==='raid') return `<div class="advwrap">${modeSeg}${viewRaidMap82()}</div>`;
  return `${modeSeg}<div class="adv-layout">
    <section class="panel herocol">
      <h2 style="margin:0 0 10px;font-size:1.6rem">${esc(h.name)}</h2>
      ${PORTRAIT[h.cls]?`<img class="portrait" src="${PORTRAIT[h.cls]}" alt="Portrait : ${c.n}" width="114" height="114">`:`<span class="tile xl" style="--h:${h.hue}">${icon(c.ic)}</span>`}
      <small style="margin-top:8px">${c.n} · Niveau ${h.lvl}${h.stars?' · '+'★'.repeat(h.stars):''}</small>
      <div class="bar xp" style="width:100%;margin-top:10px"><i style="width:${h.lvl>=MAXL?100:h.xp/need*100}%"></i></div>
      <small class="num">${h.lvl>=MAXL?'Niveau max':`XP ${fmt(h.xp)} / ${fmt(need)}`}</small>
      <dl class="stats" style="width:100%;margin-top:12px"><dt>PV</dt><dd>${Math.round(st.hp)}</dd><dt>${mstat[0]}</dt><dd>${Math.round(mstat[1])}</dd><dt>Défense</dt><dd>${Math.round(st.def)}</dd><dt>Puissance</dt><dd><b>${Math.round(heroPower(h))}</b></dd></dl>
      <button class="btn pri" style="width:100%;margin-top:14px;padding:10px" data-act="fight">Combattre</button>
      <label class="row" style="gap:6px;margin-top:10px"><input type="checkbox" id="chkAuto" data-act="auto" ${S.auto?'checked':''}> Combat automatique</label>
      <label class="row" style="gap:6px"><input type="checkbox" id="chkFarm" data-act="farm" ${S.farm?'checked':''} ${S.auto?'':'disabled'}> Enchaîner les combats</label>
      <p class="hint" style="margin-top:10px">Vos PV sont restaurés après chaque combat.</p>
    </section>
    ${mode==='pvp'?viewPvp():mode==='raid'?viewRaid():`<section class="panel ${hero?dk+'panel':''}"><h2 style="margin-bottom:12px">Choix de zone</h2>
      <div class="seg wide"><button class="${dk==='normal'?'on':''}" data-act="diff" data-d="normal">Normal</button><button class="${dk==='hero'?'on hero':''}" data-act="diff" data-d="hero" ${heroOpen()?'':`disabled title="Atteignez le niveau ${HERO_L} pour débloquer le mode Héroïque."`}>${heroOpen()?'':'🔒 '}Héroïque</button><button class="${dk==='myth'?'on myth':''}" data-act="diff" data-d="myth" ${mythOpen()?'':'disabled title="Atteignez le dernier boss en mode héroïque pour débloquer le mode Mythique."'}>${mythOpen()?'':'🔒 '}Mythique</button></div>
      ${diffNote?`<div style="margin-top:8px">${diffNote}</div>`:''}
      <div class="zgrid">${zones}</div>
      <h3 style="margin:16px 0 8px">Niveau de la zone : ${z.n}</h3>
      <div class="stages">${stg}</div>
      <p class="hint" style="margin-top:12px">Niveau des ennemis : <b class="num">${L}</b> · ${UI.stage===10?`Boss : ${z.boss.n}`:z.enemies.map(e=>e.n).join(', ')}</p>
    </section>`}</div>`;
}
function renderActbar0(){
  const el=$('#actbar'); if(!el) return;
  if(C.phase==='result'){
    const r=C.result,nextOk=r.win&&(UI.zone!==C.zone||UI.stage!==C.stage);
    if(r.test){ el.innerHTML=`<div class="result ${r.win?'':'lose'}"><h2 class="${r.win?'':'lose'}" style="margin-bottom:6px">${r.win?'Victoire':'Défaite'} — combat de test</h2><p style="margin:0 0 10px">Aucune récompense ni progression.</p><div class="row"><button class="btn pri" data-act="bestBack">Retour au Bestiaire</button><button class="btn" data-act="back">Fermer</button></div></div>`; return }
    if(r.win){
      const m=Object.entries(r.mats).map(([k,v])=>matChip(k,v)).join('');
      el.innerHTML=`<div class="result"><h2 style="margin-bottom:6px">Victoire</h2>
        <p style="margin:0 0 8px" class="num">+${fmt(r.xp)} XP${matChip('gold',r.gold)}${m}</p>
        ${r.ups.map(u=>`<p class="lvup" style="margin:0">${esc(u)}</p>`).join('')}
        ${r.items.length?`<div class="ltiles">${r.items.map((i,n)=>`<span class="ltile${itFx(i)}${i.rc?' rc':''}" style="--rc:var(--r${i.rarity})" data-tip="li:${n}" tabindex="0" aria-label="${esc(i.name)}, ${RAR[i.rarity].n}, niveau ${i.ilvl}">${eqIco(i)}${i.up?`<span class="u">+${i.up}</span>`:''}${ilTag(i)}</span>`).join('')}</div>`:''}
        ${r.rc?`<p class="lrcy mute">${r.rc.n} objet${r.rc.n>1?'s':''} recyclé${r.rc.n>1?'s':''} automatiquement (tri du butin) : ${resTxt(r.rc.v)}.</p>`:''}<div class="row" style="margin-top:10px">${nextOk?`<button class="btn pri" data-act="next">Étape suivante</button>`:''}<button class="btn ${nextOk?'':'pri'}" data-act="again">Rejouer</button><button class="btn" data-act="back">Retour</button></div></div>`;
    }else{
      el.innerHTML=`<div class="result lose"><h2 class="lose" style="margin-bottom:6px">Défaite</h2><p style="margin:0 0 10px">${r.ab?'Vous avez abandonné le combat. ':''}Améliorez votre équipement ou vos compétences, ou gagnez quelques niveaux en rejouant une étape plus facile, puis retentez votre chance.</p>
        <div class="row"><button class="btn pri" data-act="again">Réessayer</button><button class="btn" data-act="back">Retour</button></div></div>`;
    }
    return;
  }
  if(C.phase==='prep'){ el.innerHTML=`<div class="prepbar"><div class="prept"><b>Préparation</b><span class="num" data-prep>${Math.max(0,Math.ceil((C.prepEnd-Date.now())/1000))} s</span></div><p class="hint">Buvez vos potions avant le début du combat : leurs effets et leur recharge commencent maintenant.</p><div class="acts">${potBar()}<button class="btn pri" data-act="prepGo" style="margin-left:auto">Commencer le combat</button><button class="btn sm danger" data-act="giveUp">${UI.confirm==='pveGiveUp'?'Confirmer l’abandon':'Abandonner'}</button></div></div>`; return }
  const w=C.waiting,tools=`<label class="row" style="gap:6px;margin-left:auto"><input type="checkbox" data-act="auto" ${S.auto?'checked':''}> Auto</label>
    <button class="btn sm" data-act="speed">Vitesse ×${S.speed}</button><button class="btn sm danger" data-act="giveUp">${UI.confirm==='pveGiveUp'?'Confirmer l’abandon':'Abandonner'}</button>`;
  if(!w){el.innerHTML=`<div class="acts"><small class="mute" style="align-self:center">${S.auto?'Combat automatique en cours…':'Les ennemis agissent…'}</small>${tools}</div><div class="acts" style="margin-top:8px">${potBar()}</div>`;return}
  const u=w.u,ids=['atk',...u.skills];
  el.innerHTML=`<div class="acts"><div style="align-self:center"><b>${esc(u.name)}</b><br><small>${C.pending?'Choisissez une cible':'À vous de jouer'} · <b class="apc">${u.ap||0} / ${u.maxAp||0} PA</b></small></div>`+
    `<div class="skcbar">${ids.map(id=>cTile(id,u,'skill',C.pending&&C.pending.id===id)).join('')}</div>`+
    (C.pending?`<button class="btn sm" data-act="cancelPick">Annuler</button>`:'')+`<button class="btn endturn" data-act="endTurn">Fin de tour</button>`+tools+`</div><div class="acts" style="margin-top:8px">${potBar()}</div>`;
}

