/* Cendrelame · ui/inventaire.js */
/* --- inventaire --- */
function targetSlot(h,it){
  if(it.slot!=='ring') return it.slot;
  if(UI.invSel==='ring'||UI.invSel==='ring2') return UI.invSel;
  if(!h.equip.ring) return 'ring';
  if(!h.equip.ring2) return 'ring2';
  return 'ring';
}
function swapDelta(h,it){
  if(!canWear(it)) return null;
  const ts=targetSlot(h,it),old=h.equip[ts],p0=heroPower(h);
  h.equip[ts]=it; const p1=heroPower(h); h.equip[ts]=old;
  return p1-p0;
}
const itemIcon=it=>it.slot==='weapon'?(it.base==='Bâton'?'staff':'sword'):({helm:'helm',armor:'chest',legs:'legs',boots:'boots',ring:'ring',amulet:'amulet'})[it.slot];
const slotIcon=k=>({weapon:'sword',helm:'helm',armor:'chest',legs:'legs',boots:'boots',ring:'ring',ring2:'ring',amulet:'amulet'})[k];
/* emplacements sur un canevas de 300 x 440 : clé, x, y, côté */
/* emplacements sur un canevas de 300 x 440 : clé, x, y, côté, point d'attache sur le corps */
const DOLL=[['helm',6,20,52,128,46],['armor',6,124,52,116,160],['weapon',6,226,52,90,236],['boots',6,366,52,128,384],
  ['amulet',242,72,52,166,104],['ring',242,196,52,210,232],['ring2',242,262,52,210,240],['legs',242,340,52,162,310]];
/* mannequin illustré par classe : image 300 x 450, emplacements posés sur le corps (clé, x, y, côté) */
const DOLL_IMG={mage:{src:'assets/img/classes/mannequin_mage.webp',slots:[['helm',126,74,48],['amulet',135,130,30],['armor',118,176,64],['legs',124,268,52],['weapon',239,66,46],['ring',30,166,34],['ring2',245,166,34],['boots',126,398,48]]}};
function dollImgHTML(h,D){
  const slots=D.slots.map(([k,x,y,sz])=>{const it=h.equip[k];
    return `<button class="dslot ${it?'full'+itFx(it):''} ${UI.invSel===k?'sel':''}" data-act="dollSlot" data-slot="${k}" data-tip="${k}" aria-label="${SLOT_N[k]}${it?' : '+esc(it.name):' (vide)'}" style="left:${x/3}%;top:${y/4.5}%;width:${sz/3}%;${it?`--rc:var(--r${it.rarity})`:''}">${eqIco(it,k)}${it&&it.up?`<em>+${it.up}</em>`:''}${ilTag(it)}</button>`}).join('');
  return `<div class="doll img" id="doll"><img class="dollbg" src="${D.src}" alt="" aria-hidden="true">${slots}</div>`;
}
/* mannequin « cercle runique » : portrait de la classe au centre, emplacements en cercle (sens horaire depuis le haut) */
const RUNE_ORDER=['helm','amulet','armor','legs','boots','ring2','weapon','ring'];
function runeDollHTML(h,forge){
  const W=300,H=340,cx=150,cy=170,R=122,sz=48,c=CLASSES[h.cls];
  const slots=RUNE_ORDER.map((k,i)=>{const a=-Math.PI/2+i*2*Math.PI/RUNE_ORDER.length,x=cx+R*Math.cos(a)-sz/2,y=cy+R*Math.sin(a)-sz/2,it=h.equip[k];
    return `<button class="dslot ${it?'full'+itFx(it):''} ${(forge?it&&it.id===UI.fItem:UI.invSel===k)?'sel':''}" data-act="${forge?'fPutSlot':'dollSlot'}" data-slot="${k}" data-tip="${k}" aria-label="${SLOT_N[k]}${it?' : '+esc(it.name):' (vide)'}" style="left:${x/W*100}%;top:${y/H*100}%;width:${sz/W*100}%;${it?`--rc:var(--r${it.rarity})`:''}">${eqIco(it,k)}${it&&it.up?`<em>+${it.up}</em>`:''}${ilTag(it)}</button>`}).join('');
  const center=PORTRAIT[h.cls]?`<image href="${PORTRAIT[h.cls]}" x="${cx-72}" y="${cy-72}" width="144" height="144"/>`:`<circle cx="${cx}" cy="${cy}" r="60" fill="hsl(${h.hue} 30% 26%)"/>`;
  const runes='ᚠᚢᚦᚨᚱᚲᚷᚹᚺᚾᛁᛃᛇᛈᛉᛊ'.split('').map((r,i)=>{const a=i*2*Math.PI/16+Math.PI/16;return `<text x="${cx+96*Math.cos(a)}" y="${cy+96*Math.sin(a)+4}" text-anchor="middle">${r}</text>`}).join('');
  return `<div class="doll rune" id="doll"><svg class="body" viewBox="0 0 ${W} ${H}" aria-hidden="true">
    <defs><radialGradient id="rg" cx="50%" cy="50%" r="62%"><stop offset="0" stop-color="#8a6842"/><stop offset=".65" stop-color="#6a4c2f"/><stop offset="1" stop-color="#4e3622"/></radialGradient></defs>
    <rect width="${W}" height="${H}" rx="4" fill="url(#rg)"/>
    <circle cx="${cx}" cy="${cy}" r="${R+6}" fill="none" stroke="#d6aa55" stroke-width="1.5" opacity=".75"/>
    <circle cx="${cx}" cy="${cy}" r="${R-6}" fill="none" stroke="#d6aa55" stroke-width="1" stroke-dasharray="2 6" opacity=".6"/>
    <g fill="#d6aa55" opacity=".55" font-size="11" font-family="serif">${runes}</g>
    <circle cx="${cx}" cy="${cy}" r="80" fill="none" stroke="#d6aa55" stroke-width="1" opacity=".5"/>
    ${center}</svg>${slots}</div>`;
}
/* roue d’équipement : grande roue + liste de l’équipement porté */
/* variantes de la roue d'équipement (mise en page plein cadre) */
function dvSlot(h,k,x,y,sz,W,H,forge,cap){
  const it=h.equip[k];
  return `<button class="dslot ${it?'full'+itFx(it):''} ${(forge?it&&it.id===UI.fItem:UI.invSel===k)?'sel':''}" data-act="${forge?'fPutSlot':'dollSlot'}" data-slot="${k}" data-tip="${k}" aria-label="${SLOT_N[k]}${it?' : '+esc(it.name):' (vide)'}" style="left:${(x-sz/2)/W*100}%;top:${(y-sz/2)/H*100}%;width:${sz/W*100}%;${it?`--rc:var(--r${it.rarity})`:''}">${eqIco(it,k)}${it&&it.up?`<em>+${it.up}</em>`:''}${ilTag(it)}</button>`+
    (cap?`<span class="dcap ${it?'full':''}" style="left:${x/W*100}%;top:${(y+sz/2+4)/H*100}%;${it?`--rc:var(--r${it.rarity})`:''}">${it?esc(it.name):SLOT_N[k]}</span>`:'');
}
const dvBg=(W,H)=>`<defs><radialGradient id="rgv" cx="50%" cy="45%" r="70%"><stop offset="0" stop-color="#8a6842"/><stop offset=".6" stop-color="#6a4c2f"/><stop offset="1" stop-color="#3e2a19"/></radialGradient></defs><rect width="${W}" height="${H}" rx="6" fill="url(#rgv)"/><rect x="6" y="6" width="${W-12}" height="${H-12}" rx="4" fill="none" stroke="#d6aa55" stroke-width="1" opacity=".45"/>`;
const dvPortrait=(h,cx,cy,r)=>PORTRAIT[h.cls]?`<image href="${PORTRAIT[h.cls]}" x="${cx-r}" y="${cy-r}" width="${2*r}" height="${2*r}"/>`:`<circle cx="${cx}" cy="${cy}" r="${r*.8}" fill="hsl(${h.hue} 30% 26%)"/>`;
const dvRunes=(cx,cy,rx,ry,n=24)=>'ᚠᚢᚦᚨᚱᚲᚷᚹᚺᚾᛁᛃᛇᛈᛉᛊᚠᚢᚦᚨᚱᚲᚷᚹ'.slice(0,n).split('').map((r,i)=>{const a=i*2*Math.PI/n+Math.PI/n;return `<text x="${cx+rx*Math.cos(a)}" y="${cy+ry*Math.sin(a)+4}" text-anchor="middle">${r}</text>`}).join('');
/* A : grande roue + liste de l'équipement porté */
function dollA(h,forge){
  const W=300,H=300,cx=150,cy=150,R=118,sz=58;
  const slots=RUNE_ORDER.map((k,i)=>{const a=-Math.PI/2+i*2*Math.PI/RUNE_ORDER.length;return dvSlot(h,k,cx+R*Math.cos(a),cy+R*Math.sin(a),sz,W,H,forge)}).join('');
  const list=SLOTS.map(k=>{const it=h.equip[k];return `<li style="${it?`--rc:var(--r${it.rarity})`:''}"><span class="dl">${SLOT_N[k]}</span><b class="${it?'':'mute'}">${it?esc(it.name)+(it.up?' +'+it.up:''):'—'}</b><small>${it?'Niv '+it.ilvl:''}</small></li>`}).join('');
  return `<div class="dollv dA"><div class="doll rune" id="doll" style="aspect-ratio:1/1;width:100%"><svg class="body" viewBox="0 0 ${W} ${H}" aria-hidden="true">${dvBg(W,H)}
    <circle cx="${cx}" cy="${cy}" r="${R+8}" fill="none" stroke="#d6aa55" stroke-width="1.5" opacity=".75"/><circle cx="${cx}" cy="${cy}" r="${R-8}" fill="none" stroke="#d6aa55" stroke-dasharray="2 6" opacity=".6"/>
    <g fill="#d6aa55" opacity=".55" font-size="11" font-family="serif">${dvRunes(cx,cy,92,92,16)}</g><circle cx="${cx}" cy="${cy}" r="84" fill="none" stroke="#d6aa55" opacity=".5"/>${dvPortrait(h,cx,cy,80)}</svg>${slots}</div>
    <ul class="dlist">${list}</ul></div>`;
}

function dollHTML(h){
  return dollA(h);
  const cn=DOLL.map(([k,x,y,sz,ax,ay])=>{const sx=x<150?x+sz:x,sy=y+sz/2;return `<path class="cn" d="M${sx} ${sy}L${ax} ${ay}"/><circle class="dot" cx="${ax}" cy="${ay}" r="2.6"/>`}).join('');
  const svg=`<svg class="body adv" viewBox="0 0 300 440" aria-hidden="true">
    <rect class="roll" x="104" y="82" width="92" height="17" rx="8.5"/><path class="tunl" d="M122 83v15M178 83v15"/>
    <path class="cape" d="M112 100Q150 92 188 100L216 338Q184 348 150 343Q116 348 84 338Z"/>
    <path class="tunl" d="M128 130L116 334M172 130L184 334"/>
    <path class="capein" d="M112 98Q150 80 188 98Q150 108 112 98Z"/>
    <path class="pant" d="M128 270L124 356H146L150 280Z"/><path class="pant" d="M172 270L176 356H154L150 280Z"/>
    <path class="lth" d="M122 354H146V392H110V388Q112 380 122 378Z"/><path class="lth" d="M154 354H178V378Q188 380 190 388V392H154Z"/>
    <rect class="dk" x="120" y="350" width="28" height="8" rx="2"/><rect class="dk" x="152" y="350" width="28" height="8" rx="2"/>
    <path class="tun" d="M112 102L96 110L84 178L102 180L116 124Z"/><path class="lth" d="M84 178L102 180L98 226L82 226Z"/>
    <path class="tun" d="M188 102L204 110L216 178L198 180L184 124Z"/><path class="lth" d="M216 178L198 180L202 226L218 226Z"/>
    <path class="tun" d="M110 100Q150 90 190 100L196 158L190 248L202 288Q150 300 98 288L110 248L104 158Z"/>
    <path class="tunl" d="M150 254V294M118 170Q150 178 182 170"/>
    <path class="lth" d="M112 106L121 99L192 234L183 240Z"/>
    <rect class="dk" x="106" y="236" width="88" height="12" rx="2"/><rect class="gold" x="143" y="233" width="14" height="17" rx="2"/>
    <rect class="lth" x="164" y="246" width="20" height="19" rx="3"/><path class="dk" d="M164 250H184L182 256H166Z"/>
    <rect class="skin" x="142" y="68" width="16" height="24" rx="3"/>
    <path class="scf" d="M122 92Q150 108 178 92L180 103Q150 122 120 103Z"/><path class="scf" d="M162 106L174 136L161 134L154 110Z"/>
    <circle class="skin" cx="150" cy="50" r="22"/>
    <path class="hair" d="M127 54Q122 24 150 24Q178 24 174 55Q170 40 158 37Q147 45 133 42Q129 46 127 54Z"/>
    <circle class="eye" cx="143" cy="54" r="2.1"/><circle class="eye" cx="157" cy="54" r="2.1"/>
    <path d="M145 63Q150 66.5 155 63" fill="none" stroke-width="1.6"/>
    <circle class="skin" cx="90" cy="235" r="9"/><circle class="skin" cx="210" cy="235" r="9"/>
    ${cn}</svg>`;
  const slots=DOLL.map(([k,x,y,sz])=>{
    const it=h.equip[k];
    return `<button class="dslot ${it?'full'+itFx(it):''} ${UI.invSel===k?'sel':''}" data-act="dollSlot" data-slot="${k}" data-tip="${k}" aria-label="${SLOT_N[k]}${it?' : '+esc(it.name):' (vide)'}" style="left:${x/3}%;top:${y/4.4}%;width:${sz/3}%;${it?`--rc:var(--r${it.rarity})`:''}">${eqIco(it,k)}${it&&it.up?`<em>+${it.up}</em>`:''}${ilTag(it)}</button>`;
  }).join('');
  return `<div class="doll" id="doll" style="--h:${h.hue}">${svg}${slots}</div>`;
}
const itemBtns=i=>`<button class="btn sm pri" data-act="equip" data-id="${i.id}">Équiper</button><button class="btn sm" data-act="toForge" data-id="${i.id}">Renforcer</button>`;

/* --- inventaire en grille --- */
const cellName=c=>c.mat?MAT_OBJ[c.mat]:c.name;
const matSvg=k=>`<svg viewBox="0 0 24 24" aria-hidden="true">${MI[k]||''}</svg>`;
const TALL={sword:'<path d="M10 3l3 4v58l-3 4-3-4V7z"/><path d="M2 67h16v4H2z"/><path d="M8.5 71h3v17h-3z"/><circle cx="10" cy="91.5" r="3.2"/>',
  staff:'<circle cx="10" cy="11" r="7"/><path d="M8.6 17h2.8v79h-2.8z"/><path d="M4 22q6 5 12 0v3q-6 5-12 0z"/>'};
const itFx=it=>it&&!it.mat?(lvlOk(it)?'':' bad'):'';
const ilTag=it=>it&&!it.mat?`${it.rarity>=2?`<i class="rfx r${it.rarity}"></i>`:''}${lvlOk(it)?'':`<i class="ilk" aria-hidden="true"><span>${uic('lock','ilks')}</span></i>`}<em class="il">${it.ilvl}</em>`:'';
const EQ_RC=['#c8c4b8','#5a9ae8','#e0b040','#a868e8','#ee8a3a','#3ad0d8'];
const EQP={
 helm:{o:'M9 27C9 15 16 7 24 7s15 8 15 20v8h-8v-6h-4v12h-6V29h-4v6H9z',d:['M24 7v12','M13 22h22','M9 27h6M33 27h6']},
 armor:{o:'M15 7l6-2c1 3 5 3 6 0l6 2 9 6-4 9-3-2v19c-7 4-15 4-22 0V20l-3 2-4-9z',d:['M24 9v32','M16 22c4 3 12 3 16 0','M16 30c4 3 12 3 16 0']},
 legs:{o:'M13 6h22l1 10-3 26h-7l-2-20-2 20h-7L12 16z',d:['M13 11h22','M15 26h6M27 26h6']},
 boots:{o:'M15 6h13v21l11 4c3 1 4 4 3 9H11l2-11z',d:['M15 12h13','M11 40h31','M28 27l-3 6']},
 ring:{o:'M24 16a13 13 0 1 1 0 26a13 13 0 1 1 0-26zm0 5a8 8 0 1 0 0 16a8 8 0 1 0 0-16z',d:[],g:'M24 3l7 7-7 8-7-8z'},
 amulet:{o:'M24 23c6 6 7 13 0 20c-7-7-6-14 0-20z',d:['M9 5c3 10 9 16 15 18c6-2 12-8 15-18'],g:'M24 29l3 4-3 4-3-4z',chain:1},
 sword:{o:'M37 5h6v6L21 33l-6-6z',d:['M34 8L18 24'],x:'M10 25l13 13M15 34l-7 7',g:'M7 42a2.5 2.5 0 1 0 0.1 0z'},
 staff:{o:'M33 13l3 3L12 42l-3-3z',d:['M16 33l3 3','M22 27l3 3'],g:'M37 3a7 7 0 1 1-0.1 0z'},
 tsword:{o:'M10 3l3 5v55H7V8zM2 63h16v5H2zM8 68h4v19H8zM10 88.5a3.5 3.5 0 1 1-.1 0z',d:['M10 10v50'],vb:'0 0 20 100'},
 tstaff:{o:'M8.5 20h3v76h-3z',d:['M4 13q6 7 6 9M16 13q-6 7-6 9'],g:'M10 2a7 7 0 1 1-.1 0z',vb:'0 0 20 100'}};
let EQN=0;
function eqSvg(k,rc,dim){ const p=EQP[k],id='eqg'+(++EQN),vb=p.vb||'0 0 48 48',sw=p.vb?1:1.4;
  return `<svg class="eqi" viewBox="${vb}" aria-hidden="true" ${dim?'style="opacity:.3"':''}><defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff"/><stop offset=".25" stop-color="${rc}"/><stop offset="1" stop-color="color-mix(in srgb,${rc} 45%,#000)"/></linearGradient></defs>${p.x?`<path d="${p.x}" fill="none" stroke="url(#${id})" stroke-width="4" stroke-linecap="round"/>`:''}<path d="${p.o}" fill="url(#${id})" fill-rule="evenodd" stroke="#000" stroke-opacity=".6" stroke-width="${sw}" stroke-linejoin="round"/>${p.d.map(d=>`<path d="${d}" fill="none" stroke="${p.chain?rc:'#000'}" stroke-width="${p.chain?1.6:sw*.85}" stroke-linecap="round" opacity="${p.chain?1:.35}"/>`).join('')}${p.g?`<path d="${p.g}" fill="#fff" opacity=".92" stroke="#000" stroke-opacity=".5" stroke-width="${sw*.8}"/>`:''}</svg>` }
const eqKey=(slot,it,tall)=>slot==='weapon'?((it&&it.base==='Bâton')||(!it&&S&&S.heroes&&S.heroes[0]&&CLASSES[S.heroes[0].cls].role==='mag')?(tall?'tstaff':'staff'):(tall?'tsword':'sword')):slot==='ring2'?'ring':slot;
const eqIco=(it,k)=>{ { const im=eqImg(it); if(im) return im } const sl=it?it.slot:(k==='ring2'?'ring':k); return eqSvg(eqKey(it?(k==='ring2'?'ring':it.slot):sl,it,false),it?EQ_RC[it.rarity]||EQ_RC[0]:'#b8a37a',!it) };
const bigIcon=c=>eqImg(c)||(c.slot==='weapon'?eqSvg(eqKey('weapon',c,true),EQ_RC[c.rarity]||EQ_RC[0]):eqIco(c));
function gridHTML(){ try{ stgSync() }catch(e){}
  let bg=''; for(let y=0;y<GH;y++) for(let x=0;x<GW;x++) bg+=`<div class="cell" style="grid-column:${x+1};grid-row:${y+1}"></div>`;
  const items=S.bag.map((e,i)=>{
    const c=e.o,[w,h]=SIZE(c),pos=`grid-column:${e.x+1}/span ${w};grid-row:${e.y+1}/span ${h}`;
    const sel=UI.multi?(UI.pick.has(c)?' pick':''):UI.tab==='forge'?((UI.bagSel===c||(c.id&&c.id===UI.fItem))?' sel':''):(UI.bagSel===c?' sel':'');
    if(c.mat) return `<button class="cell full gi mat${sel}${craftCls(c)}${NEWI[c.mat]?' rq':''}" style="${pos}${NEWI[c.mat]?';--rc:var(--r'+NEWI[c.mat].r+')':''}" data-act="bagCell" data-i="${i}" data-tip="bag:${i}" aria-label="${MAT_OBJ[c.mat]}, ${c.n}">${matSvg(c.mat)}<span class="q">${c.n}</span></button>`;
    return `<button class="cell full gi it${sel}${craftCls(c)}${itFx(c)}" style="${pos};--rc:var(--r${c.rarity})" data-act="bagCell" data-i="${i}" data-tip="bag:${i}" aria-label="${esc(c.name)}${c.up?' +'+c.up:''}, ${RAR[c.rarity].n}, niveau ${c.ilvl}">${bigIcon(c)}${c.up?`<span class="u">+${c.up}</span>`:''}${ilTag(c)}</button>`;
  }).join('');
  return `<div class="bagwrap"><div class="bag ${UI.multi?'multi':''}" id="bag">${bg}${items}</div></div>`;
}
function matCard(c,foot=''){
  if(NEWI[c.mat]) return newiCard(c,foot);
  return `<article class="it" style="--rc:var(--line2)"><header><b>${MAT_OBJ[c.mat]}</b><small>${POTS[c.mat]?'Potion':c.mat==='c_relic'?'Coffre':'Matériau'} · Pile ${c.n} / ${STACK}</small></header><ul><li>Total possédé : <b class="num">${fmt(matCount(c.mat))}</b></li><li class="imp">${MAT_D[c.mat]}</li></ul>${foot?`<div class="foot">${foot}</div>`:''}</article>`;
}
function bagParts(){
  const h=S.heroes[0],st=heroStats(h),bs=heroStats(Object.assign({},h,{equip:{}})),used=BAG-freeCells(),so=UI.bagSort;
  const arrow=k=>so.k!==k?'':k==='name'?(so.dir>0?' A→Z':' Z→A'):(so.dir>0?' ↓':' ↑');
  const si=UI.bagSel?entryOf(UI.bagSel):-1,c=si>=0?UI.bagSel:null,k=UI.invSel,eq=k?h.equip[k]:null;
  let detail='';
  if(c&&c.mat) detail=matCard(c,`${BUFF_K.includes(c.mat)?`<button class="btn sm pri" data-act="drinkBuff" data-k="${c.mat}" ${buffOn(c.mat)?'disabled':''}>${buffOn(c.mat)?'Déjà actif · '+buffFmt(buffLeft(c.mat)):'Boire (30 min)'}</button>`:''}<button class="btn sm" data-act="bagSplit" data-i="${si}" ${c.n<2||!freeCells()?'disabled':''}>Diviser la pile</button>`);
  else if(c) detail=itemCard(c,itemBtns(c),swapDelta(h,c));
  else if(k) detail=(eq?itemCard(eq,`<button class="btn sm" data-act="unequip" data-slot="${k}">Retirer</button><button class="btn sm" data-act="toForge" data-id="${eq.id}">Renforcer</button>`):'<p class="hint">Emplacement vide. Glissez-y un objet de l’inventaire.</p>');
  const sep=S.statSplit;
  const gb=(t,b,pct)=>{const f=v=>pct?r1(v)+'%':fmt(Math.round(v)),d=pct?r1(t-b):Math.round(t)-Math.round(b);
    return `<b class="tot">${f(t)}</b>`+(sep?` <span class="spl">(${f(b)} + ${pct?r1(d)+'%':fmt(d)})</span>`:'')};
  const c0=CLASSES[h.cls],mk=c0.role==='mag'?['Intelligence','mag']:['Force','atk'];
  const row=([n,k,pct])=>`<dt>${n}</dt><dd>${gb(st[k],bs[k],pct)}</dd>`;
  const cat=(t,rows)=>`<dt class="scat">${t}</dt><dd class="scat"></dd>`+rows.map(row).join('');
  const mini=cat('Principale',[['PV','hp'],mk])+
    cat('Secondaire',[['Vitesse','spd'],['Critique','crit',1],['Dégâts critiques','critDmg',1],['Esquive','dodge',1],['Vol de vie','lifesteal',1],['Points d’action','ap']])+
    cat('Résistance',[['Défense physique','def'],['Défense magique','res'],...RES_K.map(k=>[STAT_N[k],k,1])])+
    `<dt class="spow">Puissance</dt><dd class="spow"><b>${fmt(Math.round(heroPower(h)))}</b>${sep?` <span class="spl">(${fmt(Math.round(heroPower(Object.assign({},h,{equip:{}}))))} + ${fmt(Math.max(0,Math.round(heroPower(h)-heroPower(Object.assign({},h,{equip:{}})))))})</span>`:''}</dd>`;
  const mats=MATS.map(m=>`<div>${matIcon(m)}<span>${MAT_OBJ[m]}</span><b>${fmt(matCount(m))}</b></div>`).join('');
  const equip=`<section class="panel peq"><h3 class="ptitle">Équipement</h3>${dollHTML(h)}
        <p class="hint" style="margin-top:10px;text-align:center">Glissez un objet de l’inventaire sur le mannequin pour l’équiper, ou faites un clic droit dessus. Clic droit ou glisser vers l’inventaire pour le retirer.</p></section>
      ${k?detPanel(SLOT_N[k],detail,'det-n'):''}${detail?detPanel(c?'Détails':SLOT_N[k],detail,'det-w'):''}`;
  const inv=`<section class="panel pinv">    <div class="row between" style="margin-bottom:10px"><h2>Inventaire</h2><small class="num">${used} / ${BAG} cases</small></div>
    <div class="row" style="margin-bottom:10px"><span class="mute">Trier par</span>
      <button class="chip ${so.k==='name'?'on':''}" data-act="bagSort" data-k="name">Nom${arrow('name')}</button>
      <button class="chip ${so.k==='qty'?'on':''}" data-act="bagSort" data-k="qty">Quantité${arrow('qty')}</button>
      </div>
    ${UI.multi?multiBar():''}
    ${gridHTML()}
    ${c&&!UI.multi?detPanel('Détails',detail,'det-n'):''}
    <p class="hint" style="margin:8px 0 14px">${UI.multi?'Cliquez sur les cases à détruire. Les matériaux détruits sont perdus ; les armes et armures rendent 25 % des ressources ayant servi à leur création.':''}Les objets occupent plusieurs cases (arme 1×5, armure et jambières 2×3, casque et bottes 2×2). Glissez-déposez pour ranger ou échanger. Déposez une pile sur une pile du même matériau pour les fusionner (${STACK} max par pile). Un second clic sur un tri inverse l’ordre.</p></section>`;
  return {equip,inv,mini,detail,arrow,used};
}
function viewBag(){return viewHeroes()}
function multiBar(){
  const sel=[...UI.pick].filter(o=>entryOf(o)>=0),tot={};let it=0,mt=0,mq=0;
  for(const c of sel){ if(c.mat){mt++;mq+=c.n} else {it++;for(const [k,v] of Object.entries(salvageValue(c)))tot[k]=(tot[k]||0)+v} }
  const conf=UI.confirm==='multi';
  return `<div class="panel" style="margin-bottom:10px;border-color:var(--blood)"><div class="row between">
    <div><b>${sel.length} case${sel.length>1?'s':''} sélectionnée${sel.length>1?'s':''}</b><br><small>${it} objet${it>1?'s':''} · ${mt} pile${mt>1?'s':''} de matériaux${mq?` (${fmt(mq)} perdus)`:''}</small></div>
    <div class="row"><button class="btn sm" data-act="multiPick" data-w="items">Tous les objets</button><button class="btn sm" data-act="multiPick" data-w="mats">Toutes les potions</button><button class="btn sm" data-act="multiPick" data-w="none">Aucun</button>
    ${conf?`<button class="btn sm warn" data-act="multiDel">Confirmer la destruction</button><button class="btn sm" data-act="noConfirm">Annuler</button>`:`<button class="btn sm danger" data-act="multiDel" ${sel.length?'':'disabled'}>Détruire la sélection</button>`}</div></div>
    <div style="margin-top:6px"><small class="mute">Ressources récupérées :</small>${resChips(tot)}</div></div>`;
}
const SRT_SL=['weapon','helm','armor','legs','boots','ring','amulet'];
const srtType=o=>o.mat?(o.mat==='c_relic'?40:POTS[o.mat]?10:NEWI[o.mat]?20:30):SRT_SL.indexOf(o.slot);
function sortEntries(bag,W,H,so){
  const {k,dir}=so,tot={},ent=[];
  for(const e of bag){ if(e.o.mat) tot[e.o.mat]=(tot[e.o.mat]||0)+e.o.n; else ent.push(e.o) }
  for(const [m,n] of Object.entries(tot)){let r=n;while(r>0){const q=Math.min(STACK,r);ent.push({mat:m,n:q});r-=q}}
  const q=c=>c.mat?c.n:1;
  const byName=(a,b)=>cellName(a).localeCompare(cellName(b),'fr',{sensitivity:'base'});
  const tie=(a,b)=>(b.rarity||0)-(a.rarity||0)||(b.ilvl||0)-(a.ilvl||0);
  ent.sort(k==='type'?(a,b)=>dir*(srtType(a)-srtType(b))||tie(a,b)||byName(a,b):k==='name'?(a,b)=>dir*(byName(a,b)||q(b)-q(a)||tie(a,b)):(a,b)=>dir*(q(b)-q(a)||byName(a,b)||tie(a,b)));
  const place=list=>{const b=[];for(const o of list){const sp=findSpot(b,...SIZE(o),W,H); if(!sp) return null; b.push({x:sp[0],y:sp[1],o})} return b};
  const area=o=>{const [w,h]=SIZE(o);return w*h};
  return place(ent)||place(ent.slice().sort((a,b)=>area(b)-area(a)));
}
function sortBag(){ const nb=sortEntries(S.bag,GW,GH,UI.bagSort); if(nb) S.bag=nb; else toast('Impossible de tout ranger : faites un peu de place.') }
function sortStash(){ const T=stashTab(),nb=sortEntries(T.bag,SW,SH,UI.stSort); if(nb){ T.bag=nb; saveAcc() } else toast('Impossible de tout ranger dans cet onglet.') }
const SRT_IC='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 19V5M3.5 8.5 7 5l3.5 3.5M17 5v14M13.5 15.5 17 19l3.5-3.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
function sortBtn(w){
  const so=w==='bag'?UI.bagSort:UI.stSort,open=UI.srt===w;
  return `<span class="srtw"><button class="srtb ${open?'on':''}" data-act="srtMenu" data-w="${w}" aria-expanded="${open}" ${ttip('Trier','Par type, par nom ou par quantité. Recliquez sur un tri pour inverser l’ordre.')}>${SRT_IC}</button>${open?`<div class="srtm" role="menu">${[['type','Type'],['name','Nom'],['qty','Quantité']].map(([k,n])=>`<button role="menuitem" class="${so.k===k?'on':''}" data-act="${w==='bag'?'bagSort':'stSort'}" data-k="${k}"><span>${n}</span><span>${so.k===k?(so.dir>0?'↓':'↑'):''}</span></button>`).join('')}</div>`:''}</span>`;
}
/* déplacer une entrée vers (tx,ty) : déplacement, fusion de piles ou échange */
function overlaps(x,y,w,h,skip){return S.bag.filter(e=>{ if(e===skip) return false; const [ew,eh]=SIZE(e.o); return x<e.x+ew&&e.x<x+w&&y<e.y+eh&&e.y<y+h })}
function moveEntry(i,tx,ty){
  const E=S.bag[i]; if(!E) return; const [w,h]=SIZE(E.o);
  if(tx===E.x&&ty===E.y) return;
  if(tx<0||ty<0||tx+w>GW||ty+h>GH){toast('Pas assez de place ici.');return}
  const ov=overlaps(tx,ty,w,h,E);
  if(!ov.length){E.x=tx;E.y=ty}
  else if(ov.length===1&&E.o.mat&&ov[0].o.mat===E.o.mat){
    const B=ov[0].o; if(B.n>=STACK){toast('Cette pile est pleine.');return}
    const m=Math.min(STACK-B.n,E.o.n); B.n+=m; E.o.n-=m; if(!E.o.n){S.bag.splice(i,1); if(UI.bagSel===E.o) UI.bagSel=B}
  }else if(ov.length===1){
    const B=ov[0],ox=E.x,oy=E.y,bx=B.x,by=B.y,[bw,bh]=SIZE(B.o);
    E.x=tx;E.y=ty;
    const rest=S.bag.filter(e=>e!==E&&e!==B);
    if(fitsAt(rest,tx,ty,w,h)&&fitsAt([...rest,E],ox,oy,bw,bh)){B.x=ox;B.y=oy}
    else{ const sp=fitsAt(rest,tx,ty,w,h)?findSpot([...rest,E],bw,bh):null;
      if(sp){B.x=sp[0];B.y=sp[1]} else {E.x=ox;E.y=oy;B.x=bx;B.y=by;toast('Pas assez de place pour échanger.');return} }
  }else{toast('Pas assez de place ici.');return}
  save(); render();
}
/* glisser-déposer (souris et tactile) entre l'inventaire et le mannequin */
let DRAG=null,noClick=false;
const dragItem=d=>d.src==='stash'?(stashTab().bag[d.from]||{}).o:d.src==='bag'?(S.bag[d.from]&&S.bag[d.from].o):d.src==='forge'?(findItem(d.from)||{}).it:S.heroes[0].equip[d.from];
function equipFromCell(i,slot){
  if(eqLock()) return;
  const h=S.heroes[0],E=S.bag[i],it=E&&E.o; if(!it||it.mat) return;
  if(slotType(slot)!==it.slot){toast('Cet objet ne va pas dans cet emplacement.');return}
  if(!canWear(it)){toast(clsOk(it)?`Niveau ${itReq(it)} requis pour porter cet objet.`:`Réservé au ${CLASSES[it.cls].n}.`);return}
  const old=h.equip[slot];
  S.bag.splice(i,1);
  if(old){
    if(fitsAt(S.bag,E.x,E.y,...SIZE(old))) S.bag.push({x:E.x,y:E.y,o:old});
    else if(!bagAddItem(S.bag,old)){S.bag.splice(i,0,E);toast('Pas de place pour ranger l’objet porté.');return}
  }
  h.equip[slot]=it; if(UI.bagSel===it) UI.bagSel=null; save(); render();
}
function unequipTo(slot,tx,ty){
  if(eqLock()) return;
  const h=S.heroes[0],it=h.equip[slot]; if(!it) return; const [w,hh]=SIZE(it);
  if(tx!=null){
    const ov=overlaps(tx,ty,w,hh,null),inb=tx>=0&&ty>=0&&tx+w<=GW&&ty+hh<=GH;
    if(inb&&!ov.length){S.bag.push({x:tx,y:ty,o:it});delete h.equip[slot];save();render();return}
    if(inb&&ov.length===1&&!ov[0].o.mat&&ov[0].o.slot===it.slot&&canWear(ov[0].o)){
      const B=ov[0],rest=S.bag.filter(e=>e!==B);
      if(fitsAt(rest,tx,ty,w,hh)){S.bag=rest;S.bag.push({x:tx,y:ty,o:it});h.equip[slot]=B.o;save();render();return}
    }
  }
  if(!bagAddItem(S.bag,it)){toast('Inventaire plein.');return}
  delete h.equip[slot]; save(); render();
}
function gridCellAt(px,py){
  const b=$('#bag'); if(!b) return null; const r=b.getBoundingClientRect();
  if(px<r.left||px>r.right||py<r.top||py>r.bottom) return null;
  const pad=8,gap=3,cw=(r.width-2*pad-(GW-1)*gap)/GW;
  return [clamp(Math.floor((px-r.left-pad+gap/2)/(cw+gap)),0,GW-1),clamp(Math.floor((py-r.top-pad+gap/2)/(cw+gap)),0,GH-1)];
}
function showFoot(tx,ty,w,h,ok){
  let f=$('#foot'); const b=$('#bag'); if(!b) return;
  if(!f){f=document.createElement('div');f.id='foot';b.append(f)}
  const cx=clamp(tx,0,GW-1),cy=clamp(ty,0,GH-1),cw=Math.max(1,Math.min(w,GW-cx)),ch=Math.max(1,Math.min(h,GH-cy));
  f.style.gridColumn=`${cx+1}/span ${cw}`; f.style.gridRow=`${cy+1}/span ${ch}`; f.className=ok?'ok':'bad';
}
const hideFoot=()=>{const f=$('#foot'); if(f) f.remove()};
document.addEventListener('pointerdown',e=>{
  if(e.button>0||!e.target.closest) return;
  const c=e.target.closest('#bag .gi'),s=e.target.closest('#doll .dslot.full'),fs=e.target.closest('#fslot.full'),sc=e.target.closest('#stash .si');
  if(sc){ const E=stashTab().bag[+sc.dataset.i]; if(!E) return; const gc=stashCellAt(e.clientX,e.clientY)||[E.x,E.y]; DRAG={src:'stash',from:+sc.dataset.i,el:sc,off:[clamp(gc[0]-E.x,0,SIZE(E.o)[0]-1),clamp(gc[1]-E.y,0,SIZE(E.o)[1]-1)]}; const r=sc.getBoundingClientRect(); Object.assign(DRAG,{x:e.clientX,y:e.clientY,gx:e.clientX-r.left,gy:e.clientY-r.top,on:false,ghost:null,over:null,tgt:null,stgt:null}); return }
  if(fs&&UI.fItem!=null&&findItem(UI.fItem)){ DRAG={src:'forge',from:UI.fItem,el:fs,off:[0,0],big:true}; const r=fs.getBoundingClientRect(); Object.assign(DRAG,{x:e.clientX,y:e.clientY,gx:e.clientX-r.left,gy:e.clientY-r.top,on:false,ghost:null,over:null,tgt:null}); return }
  if(c){ if(UI.multi) return; const E=S.bag[+c.dataset.i]; if(!E) return; const gc=gridCellAt(e.clientX,e.clientY)||[E.x,E.y];
    DRAG={src:'bag',from:+c.dataset.i,el:c,off:[clamp(gc[0]-E.x,0,SIZE(E.o)[0]-1),clamp(gc[1]-E.y,0,SIZE(E.o)[1]-1)]} }
  else if(s){ const it=S.heroes[0].equip[s.dataset.slot]; const [w,h]=SIZE(it); DRAG={src:'eq',from:s.dataset.slot,el:s,off:[Math.floor(w/2),Math.floor(h/2)],big:true} }
  else return;
  const r=DRAG.el.getBoundingClientRect();
  Object.assign(DRAG,{x:e.clientX,y:e.clientY,gx:e.clientX-r.left,gy:e.clientY-r.top,on:false,ghost:null,over:null,tgt:null});
});
document.addEventListener('pointermove',e=>{
  if(!DRAG) return;
  if(!DRAG.on){
    if(Math.hypot(e.clientX-DRAG.x,e.clientY-DRAG.y)<6) return;
    DRAG.on=true; hideTip();
    const g=DRAG.el.cloneNode(true); g.id='ghost'; g.removeAttribute('data-act'); g.removeAttribute('data-tip'); g.classList.remove('sel');
    g.style.width=DRAG.el.offsetWidth+'px'; g.style.height=DRAG.el.offsetHeight+'px'; document.body.append(g); DRAG.ghost=g; DRAG.el.classList.add('drag');
    if(DRAG.src==='eq'||DRAG.src==='forge'){g.style.width='46px';g.style.height='46px';DRAG.gx=23;DRAG.gy=23}
    const it=dragItem(DRAG);
    if(DRAG.src==='bag'&&it&&!it.mat&&canWear(it)) document.querySelectorAll('#doll .dslot').forEach(d=>{if(slotType(d.dataset.slot)===it.slot)d.classList.add('fit')});
  }
  e.preventDefault();
  DRAG.ghost.style.left=((e.clientX-DRAG.gx))/ZM+'px'; DRAG.ghost.style.top=((e.clientY-DRAG.gy))/ZM+'px';
  const t=document.elementFromPoint(e.clientX,e.clientY),cell=t&&t.closest&&t.closest(DRAG.src==='forge'?'#fslot':'#doll .dslot, #fslot, .fslot2');
  const ok=cell&&cell!==DRAG.el?cell:null;
  if(DRAG.over&&DRAG.over!==ok) DRAG.over.classList.remove('over');
  if(ok) ok.classList.add('over');
  DRAG.over=ok; DRAG.tgt=null;
  const sg=!ok&&(DRAG.src==='bag'||DRAG.src==='stash')&&stashCellAt(e.clientX,e.clientY); DRAG.stgt=null;
  if(sg){ const it=dragItem(DRAG),[w,h]=SIZE(it),tx=sg[0]-DRAG.off[0],ty=sg[1]-DRAG.off[1],T=stashTab(),self=DRAG.src==='stash'?T.bag[DRAG.from]:null,inb=tx>=0&&ty>=0&&tx+w<=SW&&ty+h<=SH,ov=inb?stashOverlaps(T,tx,ty,w,h,self):[];
    DRAG.stgt=[tx,ty]; hideFoot(); showSFoot(tx,ty,w,h,inb&&(!ov.length||(ov.length===1&&it.mat&&ov[0].o.mat===it.mat))); return }
  hideSFoot();
  const gc=!ok&&DRAG.src!=='forge'&&gridCellAt(e.clientX,e.clientY);
  if(gc){ const it=dragItem(DRAG),[w,h]=SIZE(it),tx=gc[0]-DRAG.off[0],ty=gc[1]-DRAG.off[1];
    const self=DRAG.src==='bag'?S.bag[DRAG.from]:null,inb=tx>=0&&ty>=0&&tx+w<=GW&&ty+h<=GH,ov=inb?overlaps(tx,ty,w,h,self):[];
    if(DRAG.src==='stash'){ DRAG.tgt=[tx,ty]; showFoot(tx,ty,w,h,inb&&(!ov.length||(ov.length===1&&it.mat&&ov[0].o.mat===it.mat))); return }
    DRAG.tgt=[tx,ty]; showFoot(tx,ty,w,h,inb&&ov.length<=1) }
  else hideFoot();
},{passive:false});
function endDrag(e,drop){
  if(!DRAG) return; const d=DRAG; DRAG=null;
  if(!d.on) return;
  noClick=true; setTimeout(()=>{noClick=false},0);
  if(d.ghost) d.ghost.remove(); d.el.classList.remove('drag'); if(d.over) d.over.classList.remove('over'); hideFoot(); hideSFoot();
  document.querySelectorAll('#doll .fit').forEach(x=>x.classList.remove('fit'));
  if(!drop) return;
  if(d.src==='forge'){ if(!(d.over&&d.over.id==='fslot')){ UI.fItem=null; render(); toast('Objet retiré de l’enclume.') } return }
  if(d.stgt){ if(d.src==='bag') toStash(d.from,d.stgt[0],d.stgt[1]); else if(d.src==='stash') moveStash(d.from,d.stgt[0],d.stgt[1]); return }
  if(d.src==='stash'){ if(d.tgt) fromStash(d.from,d.tgt[0],d.tgt[1]); return }
  if(!d.over&&d.tgt){ if(d.src==='bag') moveEntry(d.from,d.tgt[0],d.tgt[1]); else unequipTo(d.from,d.tgt[0],d.tgt[1]); return }
  if(!d.over) return;
  const o=d.over,toBag=false;
  if(o.dataset&&o.dataset.fs){ fPlace(dragItem(d),o.dataset.fs); return }
  if(o.id==='fslot'){const it=dragItem(d); if(it&&!it.mat){UI.fItem=it.id;UI.fMode='up';render()} else if(it) fPlace(it); return}
  if(d.src==='bag'){ equipFromCell(d.from,o.dataset.slot) }
  else{
    { if(eqLock()) return; const h=S.heroes[0],to=o.dataset.slot; if(slotType(to)!==slotType(d.from)) return; [h.equip[d.from],h.equip[to]]=[h.equip[to],h.equip[d.from]]; if(!h.equip[d.from])delete h.equip[d.from]; save(); render() }
  }
}
document.addEventListener('pointerup',e=>endDrag(e,true));
/* clic droit : équiper / retirer */
document.addEventListener('contextmenu',e=>{
  if(!e.target.closest) return;
  { const f2=e.target.closest('.fslot2.full'),f1=e.target.closest('#fslot.full'); if(f2){ e.preventDefault(); hideTip(); A.fsClear({s:f2.dataset.fs}); return } if(f1){ e.preventDefault(); hideTip(); A.fClear(); return } }
  const c=e.target.closest('#bag .gi'),s=e.target.closest('#doll .dslot'),sc=e.target.closest('#stash .si');
  if(sc){ e.preventDefault(); hideTip(); fromStash(+sc.dataset.i); return }
  if(c&&UI.stashOpen&&$('#stash')){ e.preventDefault(); hideTip(); toStash(+c.dataset.i); return }
  if(!c&&!s) return; e.preventDefault(); hideTip();
  const it=c&&S.bag[+c.dataset.i]&&S.bag[+c.dataset.i].o;
  if(it&&it.mat==='c_relic'){ chestAsk(); return }
  if(it&&(it.mat==='ct_1'||it.mat==='ct_2')){ cpTickAsk(it.mat); return }
  if(it&&/^(cf_|cs_|cw_)/.test(it.mat)){ UI.tab='comp'; UI.cpT='c'; UI.invOpen=false; render(); toast('Choisissez une créature : la nourriture, les pierres et les objets portés s’utilisent depuis sa fiche.'); return }
  if(it&&/^s_ch[0-3]$/.test(it.mat)){ sChAsk(+it.mat.slice(4)); return }
  if(it&&BUFF_K.includes(it.mat)&&UI.tab!=='forge'){ drinkBuff(it.mat); return }
  if(c&&UI.tab==='forge'){ if(it) fPlace(it); return}
  if(c){ if(it&&!it.mat) equipFromCell(+c.dataset.i,targetSlot(S.heroes[0],it))}
  else if(UI.tab==='forge'){const it2=S.heroes[0].equip[s.dataset.slot]; if(it2){UI.fItem=it2.id;render()}}
  else if(s.classList.contains('full')) unequipTo(s.dataset.slot,null);
});
document.addEventListener('pointercancel',e=>endDrag(e,false));

