/* Cendrelame · ui/marchand-et-personnage.js */
/* --- marchand --- */
/* --- personnage --- */
function viewHeroes0(){
  const h=S.heroes[0],c=CLASSES[h.cls],s=heroStats(h),BP=bagParts();
  const stats=[['PV',s.hp],c.role==='mag'?['Intelligence',s.mag]:['Force',s.atk],['Défense',s.def],['Résistance',s.res],['Vitesse',s.spd]].map(([n,v])=>`<dt>${n}</dt><dd>${Math.round(v)}</dd>`).join('')+
    `<dt>Critique</dt><dd>${r1(s.crit)}%</dd><dt>Dégâts critiques</dt><dd>${Math.round(s.critDmg)}%</dd><dt>Esquive</dt><dd>${r1(s.dodge)}%</dd>`+
    (s.lifesteal?`<dt>Vol de vie</dt><dd>${r1(s.lifesteal)}%</dd>`:'')+(s.dmgPct?`<dt>Dégâts bonus</dt><dd>${r1(s.dmgPct)}%</dd>`:'')+
    (s.goldFind?`<dt>Or trouvé</dt><dd>${r1(s.goldFind)}%</dd>`:'')+(s.dropRate?`<dt>Butin trouvé</dt><dd>${r1(s.dropRate)}%</dd>`:'')+
    `<dt>Puissance</dt><dd><b>${Math.round(heroPower(h))}</b></dd>`;
  const need=h.lvl>=MAXL?1:xpNeed(h.lvl);
  const aCost=ascCost(h),aReq=MAXL;
  const slots=SLOTS.map(sl=>{const it=h.equip[sl];return `<div class="slotrow"><span class="lbl">${SLOT_N[sl]}</span><div class="nm">${it?`<b style="color:var(--r${it.rarity})">${esc(it.name)}${it.up?` +${it.up}`:''}</b><br><small>Niv ${it.ilvl} · ${RAR[it.rarity].n}</small>`:'<small>Vide</small>'}</div>
    <button class="btn sm" data-act="changeItem" data-slot="${sl}">Changer</button>${it?`<button class="btn sm" data-act="unequip" data-slot="${sl}">Retirer</button>`:''}</div>`}).join('');
  return `<div class="prowA">
      <section class="panel ppres"><div class="sheethead"><h2>${esc(h.name)}</h2>${PORTRAIT[h.cls]?`<img class="portrait" src="${PORTRAIT[h.cls]}" alt="Portrait : ${c.n}" width="114" height="114">`:`<span class="tile xl" style="--h:${h.hue}">${icon(c.ic)}</span>`}<small>${c.n} · Niveau ${h.lvl}</small><span class="stars" title="Ascension">${'★'.repeat(h.stars)}${'☆'.repeat(5-h.stars)}</span></div>
        <div class="bar xp" style="margin-bottom:4px"><i style="width:${h.lvl>=MAXL?100:h.xp/need*100}%"></i></div><small class="num">${h.lvl>=MAXL?'Niveau max':`XP ${fmt(h.xp)} / ${fmt(need)}`}</small>
        <div class="sep"></div><dl class="stats cats">${BP.mini}</dl><div class="row" style="justify-content:center;margin-top:8px"><button class="btn sm" data-act="statSplit" aria-pressed="${!!S.statSplit}">${S.statSplit?'Masquer le détail':'Voir le détail (base + équipement)'}</button></div><div class="sep"></div>
        <h3 style="margin-bottom:6px">Ascension</h3>
        ${h.stars>=5?'<p class="hint">Ascension maximale. +10% de stats de base par étoile.</p>':`<p class="hint" style="margin-bottom:8px">+10 % de stats de base. Niveau maximum (${aReq}) requis${h.lvl<aReq?` — vous êtes niveau ${h.lvl}`:''}.</p><div class="row"><button class="btn" data-act="ascend" ${h.lvl<aReq||!canPay(aCost)?'disabled':''}>Ascension ${h.stars+1}</button>${costHTML(aCost)}</div>`}
      </section>
      <section class="panel peq"><h3 class="ptitle">Équipement</h3>${dollHTML(h)}<p class="hint eqhint">Cliquez sur un emplacement ou appuyez sur <kbd>I</kbd> pour ouvrir l’inventaire.</p></section>
    </div>
    ${viewSkills(h)}`;
}

