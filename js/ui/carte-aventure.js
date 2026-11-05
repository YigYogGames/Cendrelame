/* Cendrelame · ui/carte-aventure.js */
/* ================= interface : barre du bas + carte d’aventure ================= */
const UIC={
 bag:'<path d="M5 9h14l1.2 11.5H3.8z"/><path d="M9 9V7a3 3 0 0 1 6 0v2"/><path d="M9 13h6"/>',
 anvil:'<path d="M2.5 7h13.5c.4 2.6 2.3 3.8 5.5 4v1.5h-6.2l-1.3 2.6h1.8v3.4H8.2v-3.4H10l-1.2-2.8C4.6 11.8 2.6 10 2.5 7z"/>',
 swords:'<path d="M4 4l9.5 9.5M20 4l-9.5 9.5"/><path d="M13 16.5l4.5-4.5M11 16.5L6.5 12"/><path d="M15 15l4 4M9 15l-4 4"/>',
 people:'<circle cx="9" cy="8" r="3.2"/><path d="M2.8 20c.3-3.6 3-5.6 6.2-5.6s5.9 2 6.2 5.6"/><circle cx="17" cy="9" r="2.4"/><path d="M15.6 14.6c3 .1 5.3 1.7 5.6 4.6"/>',
 pick:'<path d="M4 20l9-9"/><path d="M8.5 5.5c4-2.8 9.2-2.4 11.5.8-3-1.4-6.3-.9-9 1.2"/><path d="M18.5 15.5c2.8-4 2.4-9.2-.8-11.5 1.4 3 .9 6.3-1.2 9"/>',
 coin:'<ellipse cx="12" cy="7" rx="7" ry="3"/><path d="M5 7v5c0 1.7 3.1 3 7 3s7-1.3 7-3V7"/><path d="M5 12v5c0 1.7 3.1 3 7 3s7-1.3 7-3v-5"/>',
 book:'<path d="M4 4.5A1.5 1.5 0 0 1 5.5 3H19v15H5.5A1.5 1.5 0 0 0 4 19.5z"/><path d="M4 19.5A1.5 1.5 0 0 0 5.5 21H19v-3"/>',
 skull:'<path d="M12 3a7 7 0 0 0-7 7c0 2.5 1.2 4 2.5 5v3h9v-3c1.3-1 2.5-2.5 2.5-5a7 7 0 0 0-7-7z"/><circle cx="9.3" cy="10.5" r="1.6"/><circle cx="14.7" cy="10.5" r="1.6"/>',
 lock:'<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
 check:'<path d="M5 12.5l4.5 4.5L19 7"/>',
 play:'<path d="M8 5l11 7-11 7z"/>',
};
const uic=(k,c='')=>`<svg class="uic ${c}" viewBox="0 0 24 24" aria-hidden="true">${UIC[k]}</svg>`;
const DOCK=[['shop','coin','Marchand'],['forge','anvil','Amélioration'],['combat','swords','Aventure'],['comp','paw','Compagnon'],['comm','people','Communauté']];
function commDot(){
  if(!FB.user||!FB.prof) return false; const me=FB.user.uid;
  return FR.list.some(f=>(f.status==='pending'&&f.from!==me)||(f.status==='accepted'&&isUnread(f)));
}
UIC.flag='<path d="M5 21V4"/><path d="M5 4h12l-2.5 4L17 12H5"/>';
const DOCK_L=[['shop','coin','Marchand'],['forge','anvil','Amélioration'],['comp','paw','Compagnon']],DOCK_R=[['comm','flag','Communauté'],['troph','trophy','Trophées'],['quest','scroll','Quêtes']];
UIC.scroll='<path d="M7 4h11a2 2 0 0 1 2 2v1h-4"/><path d="M16 7v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-1h10v1a2 2 0 0 0 2 2"/><path d="M7 4a2 2 0 0 0-2 2v11M9 9h4M9 12h4"/>';
function dockHTML(){
  const dot=k=>(k==='comp'&&ACC.comp&&cpDone()>0&&UI.tab!=='comp')||(k==='troph'&&ACC.trNew&&UI.tab!=='troph')||(k==='quest'&&UI.tab!=='quest'&&qClaimable())?'<span class="ndot" aria-label="Nouveauté"></span>':'';
  const b=([k,i,n,lk])=>lk?`<button class="dkb dklk" aria-disabled="true" data-act="soon" data-n="${n}" title="${n} : arrive dans une prochaine mise à jour">${uic(i)}<b>${n}</b><span class="dklock">${uic('lock')}</span></button>`:`<button class="dkb" role="tab" aria-selected="${UI.tab===k}" data-act="tab" data-t="${k}"><span class="hexm">${uic(i)}</span><b>${n}</b>${dot(k)}</button>`;
  const fo=friendsOnline();
  return `<div class="dkbar"><div class="dkl">${DOCK_L.map(b).join('')}</div><button class="dkmain" role="tab" aria-selected="${UI.tab==='combat'}" data-act="tab" data-t="combat"><span class="dkring">${uic('swords')}</span><b>Aventure</b></button><div class="dkr">${DOCK_R.map(b).join('')}</div></div>
   <button class="dkfr ${FR.open?'on':''}" data-act="frBtn" aria-label="Amis${fo?` : ${fo.on} en ligne sur ${fo.n}`:''}" title="Amis">${uic('people')}${fo?`<span class="dkfrn"><i></i>${fo.on}</span>`:''}${commDot()?'<span class="ndot" aria-label="Demandes ou messages"></span>':''}</button>
   <button class="dkbag ${UI.invOpen?'on':''}" data-act="invTog" aria-label="Sac (touche I)" title="Sac (I)">${uic('bag')}${S.bagDot?'<span class="ndot" aria-label="Nouveaux objets"></span>':''}</button>`;
}
function updFrBtn(){const b=$('.dkfr');if(!b)return;const fo=friendsOnline();let n=b.querySelector('.dkfrn');if(fo){if(!n){b.insertAdjacentHTML('beforeend','<span class="dkfrn"></span>');n=b.querySelector('.dkfrn')}n.innerHTML='<i></i>'+fo.on;b.setAttribute('aria-label',`Amis : ${fo.on} en ligne sur ${fo.n}`)}else if(n)n.remove();const d=commDot(),nd=b.querySelector('.ndot');if(d&&!nd)b.insertAdjacentHTML('beforeend','<span class="ndot"></span>');else if(!d&&nd)nd.remove();b.classList.toggle('on',!!FR.open)}
function heroChipHTML(){
  const h=S.heroes[0],need=h.lvl>=MAXL?1:xpNeed(h.lvl),pc=h.lvl>=MAXL?100:h.xp/need*100;
  return `${PORTRAIT[h.cls]?`<img src="${PORTRAIT[h.cls]}" alt="" width="50" height="50">`:`<span class="tile" style="--h:${h.hue}">${icon(CLASSES[h.cls].ic)}</span>`}
   <span class="hcx"><b>${esc(h.name)}</b><small>${CLASSES[h.cls].n} · niveau ${h.lvl}</small><i class="hcxp"><i style="width:${pc}%"></i></i></span>${h.sp>0?`<span class="ndot sp" title="${h.sp} point${h.sp>1?'s':''} de compétence à dépenser" aria-label="Points de compétence à dépenser"></span>`:''}`;
}
/* décors procéduraux des zones */
const ZTH=[
 {sky:['#173226','#5d7d4a','#c9c58a'],l:['#36533a','#22382a','#132219'],fx:'trees',sun:'#f3e6a8'},
 {sky:['#121218','#33303d','#6b6370'],l:['#3a3540','#26222b','#151318'],fx:'arches',sun:'#c8c2d8'},
 {sky:['#152016','#3c4c2a','#8c9a55'],l:['#3a4a2a','#26331d','#141c10'],fx:'dead',sun:'#d6e39a'},
 {sky:['#1d0806','#6e1e10','#e0652c'],l:['#4a1c12','#2d100a','#170806'],fx:'volcano',sun:'#ffb35a'},
 {sky:['#07040f','#24123f','#5b2b8c'],l:['#2b1846','#1b0f2e','#0d0717'],fx:'void',sun:'#d6b4ff'},
];
function zrnd(seed){let s=seed;return()=>((s=(s*9301+49297)%233280)/233280)}
function zridge(y,amp,seed,col){const r=zrnd(seed);let d=`M0 420 L0 ${y}`;for(let x=0;x<=1000;x+=40)d+=` L${x} ${(y-r()*amp).toFixed(0)}`;return `<path d="${d} L1000 420Z" fill="${col}"/>`}
const ZSC={};
function zoneScene(i,id){
  const key=i+'|'+id; if(ZSC[key]) return ZSC[key];
  { const q=i%ZTH.length; if(q>=0&&q<7) return ZSC[key]=`<div class="zscene zimg zbg${q}" aria-hidden="true"></div>` }
  const t=ZTH[i%ZTH.length],r=zrnd(i*77+5);let fx='';
  if(t.fx==='trees'){for(let k=0;k<26;k++){const x=k*40+r()*20,hh=50+r()*60,y=330+r()*20;fx+=`<path d="M${x.toFixed(0)} ${y.toFixed(0)} l${(hh*.28).toFixed(0)} ${(-hh).toFixed(0)} l${(hh*.28).toFixed(0)} ${hh.toFixed(0)}z" fill="#0f1c13"/>`}}
  if(t.fx==='arches'){for(let k=0;k<6;k++){const x=40+k*170,y=310;fx+=`<path d="M${x} ${y+80}V${y-40}a55 55 0 0 1 110 0V${y+80}h-22V${y-36}a33 33 0 0 0-66 0V${y+80}z" fill="#0e0d11"/>`}}
  if(t.fx==='dead'){for(let k=0;k<9;k++){const x=(40+k*115+r()*30).toFixed(0),y=345;fx+=`<path d="M${x} ${y}v-90l-22-28M${x} ${y-60}l20-26M${x} ${y-40}l-16-10" stroke="#0e140b" stroke-width="7" fill="none" stroke-linecap="round"/>`}fx+=`<rect x="0" y="300" width="1000" height="40" fill="#c6d6a0" opacity=".12"/>`}
  if(t.fx==='volcano'){fx+=`<path d="M330 360L470 130h60l140 230z" fill="#220c08"/><path d="M470 130c10 30 50 30 60 0" fill="#ff7a2a"/><path d="M500 128c-30-60 40-80 10-130" stroke="#5a2a20" stroke-width="26" fill="none" opacity=".55" stroke-linecap="round"/>`;for(let k=0;k<30;k++)fx+=`<circle cx="${(r()*1000).toFixed(0)}" cy="${(r()*300).toFixed(0)}" r="${(1+r()*2).toFixed(1)}" fill="#ffb060" opacity="${(.3+r()*.6).toFixed(2)}"/>`}
  if(t.fx==='void'){for(let k=0;k<60;k++)fx+=`<circle cx="${(r()*1000).toFixed(0)}" cy="${(r()*260).toFixed(0)}" r="${(r()*1.6+.3).toFixed(1)}" fill="#fff" opacity="${(.3+r()*.7).toFixed(2)}"/>`;for(let k=0;k<4;k++){const x=(120+k*240+r()*40).toFixed(0),y=(120+r()*90).toFixed(0);fx+=`<path d="M${x} ${y}h90l-20 30-25 34-20-30z" fill="#1a0f2c"/>`}}
  const g=`zg${id}${i}`;
  return ZSC[key]=`<svg class="zscene" viewBox="0 0 1000 420" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs><linearGradient id="${g}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${t.sky[0]}"/><stop offset=".6" stop-color="${t.sky[1]}"/><stop offset="1" stop-color="${t.sky[2]}"/></linearGradient></defs><rect width="1000" height="420" fill="url(#${g})"/><circle cx="760" cy="110" r="28" fill="${t.sun}" opacity=".5"/>${zridge(250,70,i+1,t.l[0])}${t.fx==='volcano'?fx:''}${zridge(310,60,i+9,t.l[1])}${t.fx!=='volcano'?fx:''}${zridge(370,40,i+3,t.l[2])}</svg>`;
}
const AMAP_PTS=[[9,70],[22,36],[38,66],[53,32],[66,66]];
const amapPt=i=>AMAP_PTS[i]||[9+i*12,i%2?34:68];
let AMAP_BG='';
function amapBg(){
  if(AMAP_BG) return AMAP_BG;
  const tri=Array.from({length:22},(_,k)=>`<path d="M${60+k*41} ${120+(k*53)%90}l14-22 14 22z"/>`).join('');
  return AMAP_BG=`<defs><radialGradient id="amv" cx=".5" cy=".5" r=".7"><stop offset=".55" stop-color="#2a1a0c" stop-opacity="0"/><stop offset="1" stop-color="#2a1a0c" stop-opacity=".7"/></radialGradient><filter id="amn"><feTurbulence baseFrequency=".9" numOctaves="2"/><feColorMatrix values="0 0 0 0 .3  0 0 0 0 .2  0 0 0 0 .08  0 0 0 .12 0"/></filter></defs>
   <rect width="1000" height="500" fill="#d9c294"/><rect width="1000" height="500" filter="url(#amn)"/>
   <path d="M0 420C140 380 220 470 380 430S640 470 760 420 920 440 1000 400V500H0z" fill="#9fb3a8" opacity=".55"/><g fill="#8a7a4e" opacity=".5">${tri}</g>`;
}
function viewAdvMap(){
  const P=prog(),dk=curDiff(),D=DIFF[dk],z=UI.zone,Z=ZONES[z],L=D.L||z*10+UI.stage,h=S.heroes[0];
  const st=i=>i<P.zone?'clear':i===P.zone?'cur':'lock';
  const segs=ZONES.slice(1).map((_,k)=>{const a=amapPt(k),b=amapPt(k+1),done=k+1<=P.zone;return `<path d="M${a[0]*10} ${a[1]*5}L${b[0]*10} ${b[1]*5}" stroke="#6b4a22" stroke-width="${done?5:4}" ${done?'':'stroke-dasharray="2 14"'} stroke-linecap="round" fill="none" opacity="${done?.85:.75}"/>`}).join('');
  const nodes=ZONES.map((zz,i)=>{const s=st(i),p=amapPt(i),lv=D.L?`Niveau ${D.L}`:`Niveau ${i*10+1}-${i*10+10}`;
    return `<button class="amnode ${s} ${i===z?'on':''}" style="left:${(p[0]/70*100).toFixed(1)}%;top:${p[1]}%" ${s==='lock'?'disabled':''} data-act="zone" data-i="${i}" aria-pressed="${i===z}"><span class="ampic">${zoneScene(i,'n')}${s==='clear'?`<span class="ambadge ok">${uic('check')}</span>`:s==='cur'?`<span class="ambadge">${P.stage}/10</span>`:''}</span><b>${s==='lock'?uic('lock'):''}${zz.n}</b><small>${lv}</small></button>`}).join('');
  const trail=Array.from({length:10},(_,k)=>{const s=k+1,ok=unlocked(z,s),done=z<P.zone||(z===P.zone&&s<P.stage),cur=z===P.zone&&s===P.stage;
    return `<button class="tn ${done?'done':''} ${cur?'cur':''} ${ok?'':'lock'} ${s===10?'boss':''} ${UI.stage===s?'sel':''}" ${ok?'':'disabled'} data-act="stage" data-s="${s}" aria-label="${s===10?'Boss de la zone':'Étape '+s}${ok?'':' (verrouillée)'}" aria-pressed="${UI.stage===s}">${s===10?uic('skull'):done&&UI.stage!==s?uic('check'):s}</button>`}).join('<i></i>');
  const foe=(e,k)=>`<span class="amfoe"><span class="tile" style="--h:${HUES[k*2%6]}">${foeIcon(e)}</span><small>${esc(e.n)}</small></span>`;
  const isBoss=UI.stage===10;
  const diffSeg=`<div class="amseg"><button class="${dk==='normal'?'on':''}" data-act="diff" data-d="normal">Normal</button><button class="${dk==='hero'?'on hero':''}" data-act="diff" data-d="hero" ${heroOpen()?'':`disabled title="Atteignez le niveau ${HERO_L} pour débloquer le mode Héroïque."`}>${heroOpen()?'':uic('lock')}Héroïque</button><button class="${dk==='myth'?'on myth':''}" data-act="diff" data-d="myth" ${mythOpen()?'':'disabled title="Atteignez le dernier boss en mode héroïque pour débloquer le mode Mythique."'}>${mythOpen()?'':uic('lock')}Mythique</button></div>`;
  const note=dk==='hero'?`<p class="amnote hero">Monstres niveau ${D.L}, bien plus agressifs. Les boss entrent en rage dès le tour ${D.rage+1}.</p>`:dk==='myth'?`<p class="amnote myth">Monstres niveau ${D.L}. Boss avec Frappe dévastatrice, rage dès le tour ${D.rage+1}. Récompenses ×2, Prisme divin à 25 % sur Le Dévoreur.</p>`:'';
  return `<div class="amap ${dk}">
   <svg class="ambg" viewBox="0 0 1000 500" preserveAspectRatio="none" aria-hidden="true">${amapBg()}<rect width="1000" height="500" fill="url(#amv)"/></svg>
   <div class="amfield"><svg class="amlines" viewBox="0 0 700 500" preserveAspectRatio="none" aria-hidden="true">${segs}</svg>${nodes}<div class="amdiff">${diffSeg}</div></div>
   <aside class="aminfo" aria-label="Zone sélectionnée"><div class="amhead">${zoneScene(z,'h')}<span><small>Zone ${z+1} · ${D.L?'niveau '+D.L:'niveau '+(z*10+1)+'-'+(z*10+10)}</small><h2>${Z.n}</h2></span></div>
    <div class="ambody">
     <h4>Étapes</h4><div class="amtrail">${trail}</div>
     <h4>${isBoss?'Boss':'Ennemis'} · niveau <span class="num">${L}</span> <span class="amcnt">· ${isBoss?(S.party.length>=2?'boss + 1 ennemi':'boss seul'):(n=>n+' ennemi'+(n>1?'s':'')+' par combat')(clamp(1+Math.floor((UI.stage-1)/3),1,S.party.length+1))}</span></h4>
     ${isBoss?`<div class="amboss"><span class="tile" style="--h:8">${foeIcon({n:Z.boss.n,boss:1},Z.boss.ic)}</span><span><small>Boss de la zone</small><b>${esc(Z.boss.n)}</b></span></div>${S.party.length>=2?`<div class="amfoes am4">${foe(Z.enemies[0],0)}</div>`:''}`
       :`<div class="amfoes am4">${Z.enemies.map(foe).join('')}</div>`}
     ${zoneLootHTML(z,isBoss)}<div class="amfight"><div class="amfrow"><button class="btn pri amgo" data-act="fight">Combattre</button>${gearBtn()}</div>
      <small class="mute">Puissance de ${esc(h.name)} : <b class="num">${Math.round(heroPower(h))}</b> · PV restaurés après chaque combat.</small></div>
    </div></aside></div>`;
}

/* ===== Duel et Raid (style carte / arène) ===== */
ZTH[5]={sky:['#0b1a2a','#3a6a8c','#cfe6f2'],l:['#6f93ad','#46667f','#1d3346'],fx:'ice',sun:'#ffffff'};
ZTH[6]={sky:['#120a06','#3a2214','#8a5a30'],l:['#5a3a20','#3a2414','#1c120a'],fx:'arches',sun:'#ffd9a0'};
const RAID_SC={colosse:3,wyrm:5,avatar:4};
const raidSc=r=>RAID_SC[r.id]!=null?RAID_SC[r.id]:4;
const RAID_PTS=[[14,62],[36,34],[58,62]];
const prBilan=(w,l,lw='victoires',ll='défaites')=>`<div class="mpbil"><span><b class="num">${w}</b><small>${lw}</small></span><span><b class="num">${l}</b><small>${ll}</small></span><span><b class="num">${w+l?Math.round(w/(w+l)*100):0} %</b><small>réussite</small></span></div><div class="mpratio" role="img" aria-label="${w} sur ${w+l}"><i style="width:${w+l?w/(w+l)*100:0}%"></i></div>`;
function prFriends(act,label){
  if(!FB.user||!FB.prof) return '<p class="amnote">Connectez-vous à un compte en ligne pour défier vos amis.</p>';
  const me=FB.user.uid,acc=FR.list.filter(f=>f.status==='accepted');
  if(!acc.length) return '<p class="amnote">Aucun ami pour l’instant. Ajoutez-en depuis Communauté, dans la barre du bas.</p>';
  const L=acc.map(f=>{const o=f.users.find(x=>x!==me),p=FR.prof[o],ol=isOnline(p),ch=p&&p.char;return {f,ol,ch}}).sort((a,b)=>b.ol-a.ol);
  return `<ul class="mpfr">${L.map(({f,ol,ch})=>`<li><span class="st ${ol?'on':''}" aria-label="${ol?'En ligne':'Hors ligne'}"></span><span><b>${esc(otherName(f))}</b><small>${ch?`${(CLASSES[ch.cls]||{n:''}).n} · niveau ${ch.lvl}`:''}${ol?'':(ch?' · ':'')+'hors ligne'}</small></span><button class="btn sm ${ol?'pri':''}" data-act="${act}" data-id="${f.id}" ${ol?'':'disabled'}>${label}</button></li>`).join('')}</ul>`;
}
const prPort=(h,s)=>PORTRAIT[h.cls]?`<img class="mpport" src="${PORTRAIT[h.cls]}" width="${s}" height="${s}" alt="">`:`<span class="mpunk" style="width:${s}px;height:${s}px"><span class="tile" style="--h:${h.hue}">${icon(CLASSES[h.cls].ic)}</span></span>`;
function viewDuel(){
  const on=!!(FB.user&&FB.prof),H=S.heroes[0],W=S.pvp||{w:0,l:0};
  const act=!on?`<p class="mplog">Connectez-vous à un compte en ligne (Menu) pour faire des duels.</p>`
    :PV.searching?`<div class="mpsearch"><span class="spin" aria-hidden="true"></span><b>Recherche d’un adversaire…</b><button class="btn" data-act="pvpCancel">Annuler</button></div>`
    :`<button class="btn pri amgo mpgo" data-act="pvpFind">${uic('swords')} Rechercher un adversaire</button>`;
  return `<div class="amap mpar"><div class="mparbg">${zoneScene(6,'ar')}</div>
   <div class="mpstage"><div class="mpvs"><div class="mpfig">${prPort(H,170)}<b>${esc(H.name)}</b><small>${CLASSES[H.cls].n} · niveau ${H.lvl} · puissance ${Math.round(heroPower(H))}</small></div><span class="mpvst" aria-hidden="true">VS</span><div class="mpfig ${PV.searching?'srch':''}"><span class="mpunk" style="width:170px;height:170px"><span class="q">?</span></span><b>Adversaire</b><small>${PV.searching?'Recherche en cours…':'Un joueur de votre niveau'}</small></div></div>
    ${act}<small class="mpnote">Victoire : ${matChip('gold',PVP_GOLD)} · combat au tour par tour · ${PVP_TURN} s maximum par tour</small></div>
   <aside class="aminfo" aria-label="Duel"><div class="amhead">${zoneScene(6,'ah')}<span><small>Joueur contre joueur</small><h2>Duel</h2></span></div>
    <div class="ambody"><h4>Votre bilan</h4>${prBilan(W.w,W.l)}${duelCosHTML()}<h4>Défier un ami</h4>${prFriends('frDuel','Duel')}
     <p class="amnote mute" style="margin-top:auto">Chaque joueur agit à son tour : compétences, PA et potions. Un joueur inactif pendant ${PVP_TURN} secondes peut être déclaré perdant.</p></div></aside></div>`;
}
function viewRaidMap(){
  const on=!!(FB.user&&FB.prof),H=S.heroes[0],R0=S.raidS||{w:0,l:0};
  if(UI.raidB==null||!RAIDS[UI.raidB]) UI.raidB=0;
  const r=RAIDS[UI.raidB],mx=raidMax(r.id),t=rdTier(),b=mkRaidBoss(r,t),rw=rdRw(r,t),lock=H.lvl<r.req,srch=RD.searching;
  const pt=i=>RAID_PTS[i]||[14+i*22,i%2?34:62];
  const segs=RAIDS.slice(1).map((_,k)=>{const a=pt(k),c=pt(k+1);return `<path d="M${a[0]*10} ${a[1]*5}L${c[0]*10} ${c[1]*5}" stroke="#6b4a22" stroke-width="4" stroke-dasharray="2 14" stroke-linecap="round" fill="none" opacity=".75"/>`}).join('');
  const nodes=RAIDS.map((x,k)=>{const lk=H.lvl<x.req,p=pt(k);return `<button class="amnode ${lk?'lock':''} ${k===UI.raidB?'on':''}" style="left:${(p[0]/70*100).toFixed(1)}%;top:${p[1]}%" data-act="rdBoss" data-i="${k}" aria-pressed="${k===UI.raidB}"><span class="ampic big">${zoneScene(raidSc(x),'r')}<span class="ambadge" title="Palier maximum atteint">+${raidMax(x.id)}</span></span><b>${lk?uic('lock'):''}${esc(x.n)}</b><small>Niveau ${x.L} · requis ${x.req}</small></button>`}).join('');
  const resl=RES_K.filter(k=>b[k]).map(k=>`<span class="${b[k]<0?'neg':''}">${esc(STAT_N[k].replace(/^Résistance (au |à la |aux )?/,''))} ${b[k]>0?'+':''}${b[k]} %</span>`).join('')||'<span>aucune</span>';
  const tiers=Array.from({length:mx+1},(_,i)=>`<button class="${i===t?'on':''}" data-act="rdTier" data-t="${i}" ${srch?'disabled':''} aria-pressed="${i===t}" title="${i?`+${Math.round((rdMul(i)-1)*100)} % de difficulté`:'Difficulté de base'}">+${i}</button>`).join('')+`<button disabled title="Battez ce boss au palier +${mx} pour débloquer le palier +${mx+1}.">${uic('lock')}+${mx+1}</button>`;
  const act=lock?`<p class="mplog dark">Niveau ${r.req} requis (vous êtes niveau ${H.lvl}).</p>`:(!on?`<p class="mplog dark">Connectez-vous à un compte en ligne (Menu) pour jouer à deux.</p>`
    :lock?`<p class="mplog dark">Niveau ${r.req} requis (vous êtes niveau ${H.lvl}).</p>`
    :srch?`<div class="mpsearch dark"><span class="spin" aria-hidden="true"></span><b>Recherche d’un partenaire (palier +${srch.t})…</b><button class="btn" data-act="rdCancel">Annuler</button></div>`
    :`<div class="mpacts"><button class="btn pri amgo" data-act="rdFind">${uic('skull')} Rechercher un partenaire</button><button class="btn mpinv" data-act="rdInv" title="Inviter un ami">${uic('people')}<span>Inviter</span></button></div>`)+(srch?'':`<div class="mpacts"><button class="btn amgo rdsolo" data-act="rdSolo" ${ttip('Combattre seul','Boss affaibli pour un joueur : PV −65 %, attaque −35 %. Récompenses −40 %, même chance de coffre et même progression des paliers.')}>${uic('swords')} Combattre seul</button></div>`);
  return `<div class="amap"><svg class="ambg" viewBox="0 0 1000 500" preserveAspectRatio="none" aria-hidden="true">${amapBg()}<rect width="1000" height="500" fill="url(#amv)"/></svg>
   <div class="amfield"><svg class="amlines" viewBox="0 0 700 500" preserveAspectRatio="none" aria-hidden="true">${segs}</svg>${nodes}</div>
   <aside class="aminfo rd" aria-label="Boss sélectionné"><div class="amhead">${zoneScene(raidSc(r),'rh')}<span><small>Raid à 2 joueurs · palier max +${mx}</small><h2>${esc(r.n)}</h2></span></div>
    <div class="ambody"><p class="amnote">${esc(r.d)}</p>
     <dl class="mpst"><dt>Niveau</dt><dd>${r.L}</dd><dt>PV</dt><dd>${fmt(b.hp)}</dd><dt>${r.role==='mag'?'Intelligence':'Force'}</dt><dd>${fmt(Math.round(b.atk))}</dd><dt>Défense</dt><dd>${fmt(b.def)} / ${fmt(b.res)}</dd></dl>
     <h4>Résistances</h4><div class="mpchips">${resl}</div>
     <h4>Compétences</h4><div class="mpchips skl">${r.sk.map(id=>`<span>${esc(SK[id].n)}</span>`).join('')}</div>
     <h4>Palier <small class="mute">+5 % par palier · rage au tour ${RD_RAGE+1}</small></h4><div class="mptier">${tiers}</div>
     <div class="amfight"><div class="mprew"><b>Récompenses</b>${matChip('gold',rw.gold)}${Object.entries(rw).filter(([k])=>k!=='gold').map(([k,v])=>matChip(k,v)).join('')}<span class="mc chrw" data-tip="rw:chest">${matIcon('c_relic')} <span class="num">${String(chestRate(t)).replace('.',',')} %</span></span></div>${act}<small class="mute">Bilan : <b>${R0.w}</b> raid${R0.w>1?'s':''} réussi${R0.w>1?'s':''} · <b>${R0.l}</b> échec${R0.l>1?'s':''}</small></div></div></aside></div>`;
}

