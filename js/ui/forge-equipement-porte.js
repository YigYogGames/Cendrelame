/* Cendrelame · ui/forge-equipement-porte.js */
/* 0.8.4 : équipement porté façon inventaire dans la Forge */
function fDoll84(){ const h=S.heroes[0],c=CLASSES[h.cls];
  const sl=k=>{const it=h.equip[k];return it?`<button class="dslot full${itFx(it)}" data-act="fPick" data-id="${it.id}" data-tip="f:${it.id}" aria-label="${SLOT_N[k]} : ${esc(it.name)}" style="--rc:var(--r${it.rarity})">${eqIco(it,k)}${it.up?`<em>+${it.up}</em>`:''}${ilTag(it)}</button>`:`<span class="dslot" ${ttip(SLOT_N[k],'Emplacement vide')}>${eqIco(null,k)}</span>`};
  return `<div class="ndl fdl84"><div class="c">${['helm','armor','legs','boots'].map(sl).join('')}</div><div class="av">${zoneScene(UI.zone||0,'fav')}<span class="ring"></span>${heroArt(h.cls,h.skin)}<div class="nm"><b>${esc(h.name)}</b><small>${c.n} · niveau ${h.lvl}</small></div></div><div class="c">${['amulet','ring','ring2','weapon'].map(sl).join('')}</div></div>` }
