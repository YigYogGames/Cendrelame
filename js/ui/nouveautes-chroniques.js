/* Cendrelame · ui/nouveautes-chroniques.js */
/* 0.4.9 Nouveautés : chroniques (grandes mises à jour / mineures) */
const NW_IC=['star','swords','chest','mail','trophy','people','spark','gear','flag','shieldk','anvil','pick','coin','book'];
const nwMaj=p=>p.maj!=null?!!p.maj:/\.0$/.test(p.v);
const nwKind=x=>/→|[−+]\d+[  ]?%|×\d|\d[  ]?% d|en moins|réduit|multipli|fois moins|fois plus/.test(x)?'e':/^(Nouveau|Nouvelle|Nouvel|Nouveaux|Nouvelles|Ajout)/.test(x)?'n':/(corrig|\bbug|\bne [^ ]+ plus\b|n’[^ ]+ plus\b|ne [^ ]+ pas)/i.test(x)?'c':'a';
const NW_KN={n:'Nouveau',a:'Amélioré',e:'Équilibrage',c:'Correction'};
const nwChips=x=>esc(x).replace(/(\d(?:[\d  ,.]*\d)?(?:[  ]?%)?)\s*→\s*(\d(?:[\d  ,.]*\d)?(?:[  ]?%)?)/g,'<span class="nchip"><s>$1</s>→<b>$2</b></span>');
const nwLi=x=>`<li><span class="ntag ${nwKind(x)}">${NW_KN[nwKind(x)]}</span>${nwChips(x)}</li>`;
const nwCnt=p=>p.sec.reduce((n,s)=>n+s[1].length,0);
function viewNews(){
  const O=UI.nwO=UI.nwO||{};
  const ev=PATCH.map((p,i)=>{
    if(nwMaj(p)) return `<div class="ev"><div class="dot">${p.v.split('.').slice(0,2).join('.')}</div><div class="big"><header><span class="vv">${p.v}</span><div><h3>${esc(p.t)}</h3><small>${p.sec.length} section${p.sec.length>1?'s':''} · ${nwCnt(p)} changements</small></div><span class="lbl ${i===0?'cur':''}">${i===0?'ACTUELLE · ':''}GRANDE MISE À JOUR</span></header>
      <div class="secs">${p.sec.map(([h,l],j)=>{const k=p.v+'|'+j,op=O[k],sh=op?l:l.slice(0,3);return `<div class="sec"><h4>${uic(NW_IC[j%NW_IC.length])}${esc(h)}</h4><ul>${sh.map(nwLi).join('')}</ul>${l.length>3?`<button class="more" data-act="nwTog" data-k="${esc(k)}" aria-expanded="${!!op}">${op?'Réduire ▴':`+ ${l.length-3} autre${l.length-3>1?'s':''} ▾`}</button>`:''}</div>`}).join('')}</div></div></div>`;
    const op=O[p.v]!=null?O[p.v]:i===0;
    return `<div class="ev min"><div class="dot"></div><div class="small"><button data-act="nwTog" data-k="${p.v}" data-d="${i===0?1:0}" aria-expanded="${op}"><span class="vv">${p.v}</span><b>${esc(p.t)}${i===0?' <span class="lbl cur" style="margin-left:6px">ACTUELLE</span>':''}</b><span class="cnt">Mise à jour mineure · ${nwCnt(p)} changement${nwCnt(p)>1?'s':''}</span><span class="chev">${op?'▴':'▾'}</span></button>
      ${op?`<div class="mbody">${p.sec.map(([h,l])=>`${p.sec.length>1?`<h5>${esc(h)}</h5>`:''}<ul>${l.map(nwLi).join('')}</ul>`).join('')}</div>`:''}</div></div>`;
  }).join('');
  return `<div class="scrhead" style="margin-bottom:4px"><h2>Nouveautés</h2>${backBtn()}</div><p class="hint" style="margin-bottom:18px">Journal des modifications de Cendrelame : grandes mises à jour et mises à jour mineures.</p><div class="nA">${ev}</div>`;
}

document.addEventListener('keydown',e=>{ if(UI.keyWait!=null) return; const ix=KEYS().indexOf(e.code),m=ix>=0?[0,String(ix+1)]:null; if(!m||e.ctrlKey||e.altKey||e.metaKey||e.repeat) return; const t=e.target; if(t&&(t.isContentEditable||/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
  const b=[...document.querySelectorAll('.skcbar .skc[data-hk="'+m[1]+'"]')].find(x=>x.offsetParent); if(!b) return; e.preventDefault(); if(b.getAttribute('aria-disabled')==='true'||b.disabled) return; b.click() });
function invTopHTML(){
  const h=S.heroes[0],s=heroStats(h),c=CLASSES[h.cls],ms=c.role==='mag'?['Intelligence',s.mag]:['Force',s.atk];
  const g=(t,a)=>`<h4>${t}</h4>`+a.map(([n,x])=>`<div><span>${n}</span><b class="num">${x}</b></div>`).join('');
  const st=`<div class="nst" aria-label="Statistiques">${g('Principale',[['PV',Math.round(s.hp)],[ms[0],Math.round(ms[1])]])}${g('Secondaire',[['Vitesse',Math.round(s.spd)],['Critique',r1(s.crit)+' %'],['Dégâts critiques',Math.round(s.critDmg)+' %'],['Esquive',r1(s.dodge)+' %'],['Vol de vie',r1(s.lifesteal||0)+' %'],['Points d’action',s.ap]])}${g('Défense',[['Défense physique',Math.round(s.def)],['Défense magique',Math.round(s.res)]])}${g('Résistances',RES_K.map(k=>[STAT_N[k].replace('Résistance ','Rés. '),r1(s[k]||0)+' %']))}<div class="pw"><span>Puissance</span><b class="num">${fmt(Math.round(heroPower(h)))}</b></div></div>`;
  const sl=k=>{const it=h.equip[k];return `<button class="dslot ${it?'full'+itFx(it):''} ${UI.invSel===k?'sel':''}" data-act="dollSlot" data-slot="${k}" data-tip="${k}" aria-label="${SLOT_N[k]}${it?' : '+esc(it.name):' (vide)'}" style="${it?`--rc:var(--r${it.rarity})`:''}">${eqIco(it,k)}${it&&it.up?`<em>+${it.up}</em>`:''}${ilTag(it)}</button>`};
  return `<div class="iptop">${st}<div class="ndl" id="doll"><div class="c">${['helm','armor','legs','boots'].map(sl).join('')}</div><div class="av">${zoneScene(UI.zone||0,'av')}<span class="ring"></span>${heroArt(h.cls,h.skin)}<div class="nm"><b>${esc(h.name)}</b><small>${c.n} · niveau ${h.lvl}</small></div></div><div class="c">${['amulet','ring','ring2','weapon'].map(sl).join('')}</div></div></div>`;
}
document.addEventListener('dblclick',e=>{ const a=e.target.closest&&e.target.closest('article.sel5[data-sel]'); if(!a||e.target.closest('button')||UI.scr!=='select') return; e.preventDefault(); A.playChar({i:a.dataset.sel}) });
