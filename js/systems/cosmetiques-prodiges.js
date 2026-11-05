/* Cendrelame · systems/cosmetiques-prodiges.js (0.8.18)
   Collection « Prodiges » : nouveaux cosmétiques (auras détaillées, effets de carte, cadres, traînées, ornement, fonds)
   + Coffre des Prodiges (boutique et butin de défi). Rangement par catégorie dans la Personnalisation (Base, Saison 1, Prodiges…). */

/* ---------- rangement par catégorie ---------- */
const COL_N=x=>x.src==='duel'?'Duel':x.s==='p'?'Prodiges':x.s?'Saison '+x.s:'Base';
const COL_ORD=n=>n==='Base'?0:/^Saison (\d+)/.test(n)?+n.match(/\d+/)[0]:n==='Duel'?800:n==='Prodiges'?900:999;
const cu8Grp=(n,html)=>html?`<h5 class="cu8gh">${esc(n)}</h5>${html}`:'';
function cu8Groups(L,fn){ const G={}; for(const x of L){ const n=COL_N(x); (G[n]=G[n]||[]).push(x) }
  return Object.keys(G).sort((a,b)=>COL_ORD(a)-COL_ORD(b)).map(n=>cu8Grp(n,G[n].map(fn).join(''))).join('') }
const cosTag=x=>x.src==='duel'?'duel':x.s==='p'?'pro':true;
const cosSrc=x=>x.src==='duel'?x.w+' victoires en duel':x.s==='p'?'Coffre des Prodiges':'Coffre de saison';

/* ---------- catalogue ---------- */
const PROD=[
 {id:'a_phoenix',t:'aura',n:'Ailes du phénix',d:'Deux grandes ailes de feu battent lentement derrière le héros, des braises s’envolent.',r:3},
 {id:'a_void',t:'aura',n:'Vortex du néant',d:'Une spirale violette tourne derrière le héros, parsemée d’étoiles.',r:3},
 {id:'a_arcane',t:'aura',n:'Cercle arcanique',d:'Un cercle de runes tourne au sol, des glyphes flottent autour du héros.',r:2},
 {id:'a_crystal',t:'aura',n:'Prismes en orbite',d:'Cinq cristaux tournent autour du héros en reflétant la lumière.',r:2},
 {id:'a_nature',t:'aura',n:'Souffle sylvestre',d:'Des feuilles tourbillonnent dans une lueur verte.',r:1},
 {id:'a_gold',t:'aura',n:'Auréole dorée',d:'Un halo d’or tourne au-dessus de la tête, des paillettes tombent.',r:1},
 {id:'f_stars',t:'cfx',n:'Étoiles filantes',d:'Des étoiles filantes traversent la carte.',r:3},
 {id:'f_storm',t:'cfx',n:'Orage',d:'La carte s’illumine d’éclairs par instants.',r:3},
 {id:'f_aurora',t:'cfx',n:'Aurore boréale',d:'Des voiles verts et violets ondulent en haut de la carte.',r:2},
 {id:'f_gold',t:'cfx',n:'Pluie d’or',d:'Des pièces d’or tombent doucement.',r:2},
 {id:'f_runes',t:'cfx',n:'Runes flottantes',d:'Des runes lumineuses montent du bas de la carte.',r:1},
 {id:'p_dragon',t:'pf',n:'Dragon lové',d:'Un dragon d’or enroulé autour du portrait.',r:3},
 {id:'p_sun',t:'pf',n:'Soleil radieux',d:'Rayons dorés tout autour du portrait.',r:2},
 {id:'p_vine',t:'pf',n:'Lierre en fleur',d:'Lierre vert et petites fleurs roses.',r:1},
 {id:'o_crystal',t:'orn',n:'Cristaux de prisme',d:'Grappes de cristaux turquoise aux quatre coins.',r:2},
 {id:'t_star',t:'trail',n:'Poussière d’étoiles',d:'Une poussière bleutée et dorée suit la carte.',r:2},
 {id:'t_leaf',t:'trail',n:'Feuilles d’automne',d:'Des feuilles orangées s’envolent derrière la carte.',r:1},
 {id:'bg_void',t:'bg',n:'Faille du néant',d:'Une déchirure violette au milieu des étoiles.',r:3,bg:105},
 {id:'bg_aurora',t:'bg',n:'Nuit boréale',d:'Aurore verte au-dessus de montagnes enneigées.',r:2,bg:104}].map(c=>Object.assign({s:'p'},c));
for(const c of PROD){ if(!COS8K[c.id]){ COS8.push(c); COS8K[c.id]=c } }
SBG_ID[104]='bg_aurora'; SBG_ID[105]='bg_void';

/* ---------- dessins : fonds ---------- */
SBG_SVG[104]=()=>`<svg class="zscene" viewBox="0 0 300 150" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs><linearGradient id="sb4" x2="0" y2="1"><stop offset="0" stop-color="#06121e"/><stop offset="1" stop-color="#14304a"/></linearGradient><linearGradient id="sb4a" x2="1"><stop offset="0" stop-color="#3affa0" stop-opacity="0"/><stop offset=".5" stop-color="#3affa0" stop-opacity=".55"/><stop offset="1" stop-color="#a070ff" stop-opacity="0"/></linearGradient></defs><rect width="300" height="150" fill="url(#sb4)"/><g fill="#fff">${Array.from({length:26},(_,i)=>`<circle cx="${(i*47)%300}" cy="${(i*19)%70}" r="${(.4+(i%3)*.35).toFixed(2)}" opacity=".8"/>`).join('')}</g><path d="M-10 40 C60 10 110 70 170 30 S270 20 320 45 L320 62 C260 40 220 80 160 52 S50 40 -10 70Z" fill="url(#sb4a)"/><path d="M0 150 L50 82 L80 108 L120 64 L160 110 L200 76 L250 112 L300 86 L300 150Z" fill="#dfefff"/><path d="M0 150 L50 82 L60 96 L45 150Z M120 64 L132 82 L112 150Z M200 76 L212 92 L196 150Z" fill="#9fc2dc"/><path d="M0 150 L40 120 L90 135 L150 116 L210 134 L260 120 L300 132 L300 150Z" fill="#0c1a28"/></svg>`;
SBG_SVG[105]=()=>`<svg class="zscene" viewBox="0 0 300 150" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs><radialGradient id="sb5" cx=".5" cy=".5" r=".55"><stop offset="0" stop-color="#f0d0ff"/><stop offset=".18" stop-color="#b060ff"/><stop offset=".55" stop-color="#3a0a6a"/><stop offset="1" stop-color="#05020c"/></radialGradient></defs><rect width="300" height="150" fill="#05020c"/><g fill="#fff">${Array.from({length:40},(_,i)=>`<circle cx="${(i*61)%300}" cy="${(i*37)%150}" r="${(.4+(i%4)*.3).toFixed(2)}" opacity=".75"/>`).join('')}</g><ellipse cx="150" cy="75" rx="120" ry="58" fill="url(#sb5)" opacity=".85"/><path d="M150 18 L160 52 L140 66 L162 88 L146 132 L170 92 L150 70 L172 54Z" fill="#fff" opacity=".9"/><path d="M60 140 L90 112 L110 130 L140 110 L170 128 L200 106 L240 132 L270 116 L300 140 L300 150 L0 150 L0 132Z" fill="#14082a"/></svg>`;

/* ---------- dessins : cadres de portrait ---------- */
PF8.p_sun=()=>`${ring8(16,(i,a)=>{const [x,y]=P8(a,63);return `<path d="M0 -${i%2?9:15} L4 0 L0 ${i%2?3:4} L-4 0Z" fill="${i%2?'#ffe08a':'#ffb030'}" stroke="#8a5a10" stroke-width="1" transform="translate(${x} ${y}) rotate(${(a*180/Math.PI+90).toFixed(0)})"/>`})}<circle cx="75" cy="75" r="54" fill="none" stroke="#f0b030" stroke-width="6"/><circle cx="75" cy="75" r="54" fill="none" stroke="#fff3c0" stroke-width="1.5"/>`;
PF8.p_vine=()=>`<circle cx="75" cy="75" r="55" fill="none" stroke="#3a6a2a" stroke-width="5"/>${ring8(12,(i,a)=>{const [x,y]=P8(a,57);return `<ellipse cx="${x}" cy="${y}" rx="9" ry="5" fill="${i%2?'#5aa040':'#3e8a30'}" stroke="#1e4a14" stroke-width="1.2" transform="rotate(${(a*180/Math.PI+40).toFixed(0)} ${x} ${y})"/>`})}${ring8(5,(i,a)=>{const [x,y]=P8(a+.3,58);return `<g transform="translate(${x} ${y})"><circle r="4.5" fill="#ff8ab4" stroke="#8a2a50" stroke-width="1"/><circle r="1.6" fill="#ffe08a"/></g>`})}`;
PF8.p_dragon=()=>`<circle cx="75" cy="75" r="54" fill="none" stroke="#7a4a10" stroke-width="10"/><path d="${ring8(28,(i,a)=>{const [x,y]=P8(a-Math.PI/2+.5,56+Math.sin(i*1.3)*3);return (i?'L':'M')+x+' '+y})}" fill="none" stroke="#f0c050" stroke-width="7" stroke-linecap="round"/>${ring8(14,(i,a)=>{const [x,y]=P8(a-Math.PI/2+.5,62);return `<path d="M0 0 L-4 -8 L4 -8Z" fill="#c08a20" transform="translate(${x} ${y}) rotate(${(a*180/Math.PI).toFixed(0)})"/>`})}<g transform="translate(75 14)"><path d="M-16 6 C-12 -10 12 -10 16 6 L8 14 L-8 14Z" fill="#f0c050" stroke="#5a3a08" stroke-width="2"/><path d="M-12 -2 L-20 -14 L-6 -6Z M12 -2 L20 -14 L6 -6Z" fill="#c08a20" stroke="#5a3a08" stroke-width="1.5"/><circle cx="-6" cy="2" r="2.4" fill="#ff3a1a"/><circle cx="6" cy="2" r="2.4" fill="#ff3a1a"/></g>`;
/* ---------- ornement ---------- */
OC8.crystal=()=>`<path d="M14 14 L-2 -22 L10 -26 L20 6Z" fill="#7ff0e0" stroke="#1a6a6a" stroke-width="2" stroke-linejoin="round"/><path d="M14 14 L-24 0 L-22 -12 L8 4Z" fill="#4ad0d0" stroke="#1a6a6a" stroke-width="2" stroke-linejoin="round"/><path d="M14 14 L-10 -10 L-2 -14 L16 6Z" fill="#c8fff6" stroke="#1a6a6a" stroke-width="1.5" stroke-linejoin="round"/><circle cx="14" cy="14" r="5" fill="#fff"/>`;
ORN8.o_crystal=[oCorners(OC8.crystal(),74,16),'#6ff0e066'];
/* ---------- effets de carte ---------- */
const CFX_RUNES='ᚠᚢᚦᚨᚱᚲᚷᚹᚺᚾᛁᛃᛇᛈᛉᛊᛏᛒᛖᛗᛚᛜᛞᛟ';
Object.assign(CFX8,{
 f_stars:()=>Array.from({length:5},(_,i)=>`<i style="--x:${10+i*19}%;--y:${(i*17)%45}%;--dl:-${(i*1.1).toFixed(1)}s"></i>`).join(''),
 f_storm:()=>`<b class="fl"></b><svg viewBox="0 0 300 420" preserveAspectRatio="none"><path d="M200 0 L176 120 L200 124 L160 250 L188 254 L150 420" fill="none" stroke="#fff6c0" stroke-width="3"/><path d="M90 0 L104 90 L82 96 L110 190" fill="none" stroke="#c8d8ff" stroke-width="2"/></svg>`,
 f_aurora:()=>'<b class="v1"></b><b class="v2"></b>',
 f_gold:()=>Array.from({length:12},(_,i)=>`<i style="--x:${(i*31)%96}%;--d:${(3+(i%4)*.7).toFixed(1)}s;--dl:-${((i*.53)%3).toFixed(2)}s"></i>`).join(''),
 f_runes:()=>Array.from({length:9},(_,i)=>`<i style="--x:${8+(i*37)%84}%;--d:${(4+(i%3)).toFixed(1)}s;--dl:-${((i*.71)%4).toFixed(2)}s">${CFX_RUNES[(i*7)%CFX_RUNES.length]}</i>`).join('')});
/* ---------- traînées ---------- */
Object.assign(TRAIL8,{t_star:['#9ad0ff','#ffe08a','star'],t_leaf:['#e07a2a','#c0461a','petal']});
/* ---------- auras détaillées ---------- */
const AURA9={
 a_phoenix:{b:()=>`<svg class="a9w" viewBox="0 0 200 160" aria-hidden="true"><defs><linearGradient id="a9pf" x2="0" y2="1"><stop offset="0" stop-color="#fff0a0"/><stop offset=".45" stop-color="#ff9a2a"/><stop offset="1" stop-color="#c02a0a" stop-opacity="0"/></linearGradient></defs><g class="wl">${[0,1,2,3,4].map(i=>`<path d="M98 90 C${70-i*12} ${60-i*14} ${30-i*6} ${50-i*8} ${4+i*2} ${70-i*12} C${30-i*2} ${84-i*6} ${60-i*4} ${92-i*2} 98 ${100-i*2}Z" fill="url(#a9pf)" opacity="${(.95-i*.12).toFixed(2)}"/>`).join('')}</g><g class="wr">${[0,1,2,3,4].map(i=>`<path d="M102 90 C${130+i*12} ${60-i*14} ${170+i*6} ${50-i*8} ${196-i*2} ${70-i*12} C${170+i*2} ${84-i*6} ${140+i*4} ${92-i*2} 102 ${100-i*2}Z" fill="url(#a9pf)" opacity="${(.95-i*.12).toFixed(2)}"/>`).join('')}</g></svg><i class="a9glow" style="--g:#ff8a2a66"></i>`,
   f:()=>Array.from({length:14},(_,i)=>`<i class="a9e" style="--x:${18+(i*29)%64}%;--d:${(1.8+(i%4)*.5).toFixed(1)}s;--dl:-${((i*.37)%2).toFixed(2)}s;--c:${i%3?'#ffb04a':'#fff0a0'}"></i>`).join('')+'<i class="a9ring" style="--c:#ff8a2a"></i>'},
 a_void:{b:()=>`<svg class="a9v" viewBox="0 0 200 200" aria-hidden="true"><defs><radialGradient id="a9vg"><stop offset="0" stop-color="#e0b0ff"/><stop offset=".3" stop-color="#8a3ae0"/><stop offset="1" stop-color="#1a0630" stop-opacity="0"/></radialGradient></defs><circle cx="100" cy="100" r="96" fill="url(#a9vg)" opacity=".8"/><g class="sp">${[0,1,2,3].map(i=>`<path d="M100 100 C${120+i*6} ${70-i*8} ${170} ${90+i*6} ${150+i*8} ${150+i*4}" fill="none" stroke="${i%2?'#c080ff':'#ffffff'}" stroke-width="${4-i*.6}" opacity=".7" transform="rotate(${i*90} 100 100)"/>`).join('')}</g>${Array.from({length:18},(_,i)=>`<circle cx="${100+Math.cos(i)*70*((i%3+1)/3)}" cy="${100+Math.sin(i*1.7)*70*((i%3+1)/3)}" r="${(.8+(i%3)*.6).toFixed(1)}" fill="#fff"/>`).join('')}</svg>`,
   f:()=>Array.from({length:8},(_,i)=>`<i class="a9e" style="--x:${20+(i*41)%60}%;--d:${(2.4+(i%3)*.6).toFixed(1)}s;--dl:-${((i*.5)%2.4).toFixed(2)}s;--c:#d0a0ff"></i>`).join('')+'<i class="a9ring" style="--c:#a050ff"></i>'},
 a_arcane:{b:()=>`<i class="a9glow" style="--g:#8a5aff55"></i>`,
   f:()=>`<svg class="a9c" viewBox="0 0 200 200" aria-hidden="true"><g class="sp"><circle cx="100" cy="100" r="92" fill="none" stroke="#b090ff" stroke-width="3"/><circle cx="100" cy="100" r="74" fill="none" stroke="#b090ff" stroke-width="1.5" stroke-dasharray="6 5"/><path d="M100 8 L180 146 L20 146Z M100 192 L20 54 L180 54Z" fill="none" stroke="#d0b8ff" stroke-width="2"/>${ring8(16,(i,a)=>`<text x="${(100+Math.cos(a)*83).toFixed(1)}" y="${(104+Math.sin(a)*83).toFixed(1)}" text-anchor="middle" font-size="11" fill="#f0e8ff">${CFX_RUNES[i]}</text>`)}</g></svg>`+Array.from({length:5},(_,i)=>`<i class="a9g" style="--x:${15+i*17}%;--y:${30+(i*23)%45}%;--dl:-${i*.7}s">${CFX_RUNES[(i*5)%CFX_RUNES.length]}</i>`).join('')},
 a_crystal:{b:()=>`<i class="a9glow" style="--g:#5ae0e055"></i>`,
   f:()=>`<span class="a9orb">${Array.from({length:5},(_,i)=>`<i style="--i:${i}"><svg viewBox="0 0 20 34"><path d="M10 0 L20 12 L10 34 L0 12Z" fill="${['#7ff0e0','#a0c8ff','#d0a0ff','#ffe08a','#9affb0'][i]}" stroke="#1a3a4a" stroke-width="1.5"/><path d="M10 0 L13 12 L10 34 L7 12Z" fill="#ffffff88"/></svg></i>`).join('')}</span><i class="a9ring" style="--c:#7ff0e0"></i>`},
 a_nature:{b:()=>`<i class="a9glow" style="--g:#5ad04a55"></i>`,
   f:()=>`<span class="a9lf">${Array.from({length:10},(_,i)=>`<i style="--i:${i};--d:${(3+(i%3)*.8).toFixed(1)}s;--c:${i%2?'#6ad04a':'#a8e060'}"></i>`).join('')}</span><i class="a9ring" style="--c:#7ad050"></i>`},
 a_gold:{b:()=>`<i class="a9glow" style="--g:#ffd06044"></i>`,
   f:()=>`<i class="a9halo"></i>`+Array.from({length:10},(_,i)=>`<i class="a9sp" style="--x:${22+(i*31)%56}%;--d:${(2+(i%3)*.6).toFixed(1)}s;--dl:-${((i*.43)%2).toFixed(2)}s"></i>`).join('')}};
{ const _aura=auraHTML; auraHTML=function(id){ const A=AURA9[id]; if(!A) return _aura(id);
  return `<span class="au8 au9 b ${id}" aria-hidden="true">${A.b()}</span><span class="au8 au9 f ${id}" aria-hidden="true">${A.f()}</span>` } }

/* ---------- Coffre des Prodiges ---------- */
const PROD_W=[0,50,38,12]; /* Rare 50 %, Épique 38 %, Légendaire 12 % */
const PROD_K='c_prod',PROD_N='Coffre des Prodiges';
POTS[PROD_K]={n:PROD_N,c:'#2ab0a0',fix:{gold:60000,ru_anc:1},nocombat:1,d:`Contient 1 cosmétique de la collection Prodiges (Rare 50 %, Épique 38 %, Légendaire 12 %). Un cosmétique pas encore obtenu est prioritaire. Aussi en butin de défi. Clic droit pour l’ouvrir.`};
MI[PROD_K]=MI.s_ch2.replace(/#7a3aa8/g,'#1a8a80').replace(/#a050d8/g,'#3ad0c0').replace(/#24082e/g,'#06302c');
MAT_OBJ[PROD_K]=PROD_N; MAT_N[PROD_K]=PROD_N; if(typeof MAT_D!=='undefined') MAT_D[PROD_K]=POTS[PROD_K].d;
const prodN=()=>matAll(PROD_K);
function prodRoll(){ let x=Math.random()*100; for(let i=0;i<4;i++){ if(x<PROD_W[i]) return i; x-=PROD_W[i] } return 1 }
function prodAsk(){ if(prodN()<1) return; closeChest(); const w=document.createElement('div'); w.id='chestw'; w.className='chestm'; w.setAttribute('role','dialog'); w.setAttribute('aria-modal','true');
  w.innerHTML=`<div class="box chask"><span class="chico">${matSvg(PROD_K)}</span><h2>Ouvrir le ${PROD_N} ?</h2><p>Le coffre sera consommé et révélera 1 cosmétique de la collection Prodiges.</p><div class="row"><button class="btn" data-act="chestNo">Annuler</button><button class="btn pri" data-act="prodOpen">Ouvrir</button></div></div>`;
  document.body.append(w); w.querySelector('[data-act=prodOpen]').focus() }
function prodOpen(){ if(prodN()<1){ closeChest(); return } removeMat(PROD_K,1);
  const rr=prodRoll(),pool=t=>COS8.filter(k=>k.r===t&&k.s==='p'&&!cosOwn(k.id));
  let P=pool(rr),t=rr; while(!P.length&&t>1){ t--; P=pool(t) } if(!P.length){ t=3; while(!P.length&&t>rr){ P=pool(t); t-- } }
  let got=null,lot=null;
  if(P.length){ got=P[Math.floor(Math.random()*P.length)]; ACC.scos=ACC.scos||{}; ACC.scos[got.id]=Date.now() } else { lot=lotRoll('rune'); qGive(lot) }
  saveAcc(); save();
  let w=$('#chestw'); if(!w){ w=document.createElement('div'); w.id='chestw'; w.className='chestm'; w.setAttribute('role','dialog'); w.setAttribute('aria-modal','true'); document.body.append(w) }
  const rnd=()=>{ const t2=prodRoll(),L=COS8.filter(k=>k.r===t2&&k.s==='p'); return L[Math.floor(Math.random()*L.length)]||PROD[0] };
  const N=56,W=50,strip=Array.from({length:N},(_,i)=>i===W?(got||rnd()):rnd());
  w.innerHTML=`<div class="box chopen prodbox"><h2>${PROD_N}</h2><div class="chwin"><div class="chstrip">${strip.map((x,i)=>sChTile(x,i===W)).join('')}</div><i class="chmark"></i></div><div class="chres" aria-live="polite"></div></div>`;
  const st=w.querySelector('.chstrip'),win=w.querySelector('.chwin'),tw=st.children[0].offsetWidth+10,target=W*tw+tw/2-win.clientWidth/2+(Math.random()-.5)*(tw*.7);
  const quick=matchMedia('(prefers-reduced-motion: reduce)').matches;
  requestAnimationFrame(()=>{ st.style.transition=`transform ${quick?0.3:6.2}s cubic-bezier(.08,.75,.18,1)`; st.style.transform=`translateX(${-target}px)` });
  let fired=false; const done=()=>{ if(fired||!$('#chestw')) return; fired=true; st.children[W].classList.add('hl');
    w.querySelector('.chres').innerHTML=got?`<p class="chrar" style="color:${SRAR[got.r][1]}">${SRAR[got.r][0]} · ${COS_T[got.t]}</p><div class="s8mt">${cosThumb(got)}</div><h3>${esc(got.n)}</h3><p>${esc(got.d)}</p><div class="row">${prodN()?`<button class="btn" data-act="prodOpen">Ouvrir un autre (${prodN()})</button>`:''}<button class="btn" data-act="s8Equip" data-id="${got.id}">Équiper</button><button class="btn pri" data-act="chestNo">Fermer</button></div>`
      :`<p class="chrar">Lot des runes</p><h3>Toute la collection Prodiges est déjà à vous</h3><p>Vous recevez : ${lot.map(([k,n])=>n+' × '+esc(MAT_OBJ[k]||k)).join(', ')}.</p><div class="row"><button class="btn pri" data-act="chestNo">Fermer</button></div>`;
    render() };
  st.addEventListener('transitionend',done,{once:true}); setTimeout(done,quick?600:6600) }
Object.assign(A,{prodOpen:()=>prodOpen(),prodAsk:()=>prodAsk()});
/* butin de défi : 3 % + 0,5 % par palier (max 10 %) */
const prodRate=t=>Math.min(10,3+.5*(t||0));
{ const _fin=raidSoloFinish; raidSoloFinish=function(res){ const t=C.raid&&C.raid.t,ok=res==='win'&&!C.test;
  const r=_fin.apply(this,arguments);
  if(ok&&Math.random()*100<prodRate(t)){ gain({[PROD_K]:1}); save(); setTimeout(()=>toast(`✦ ${PROD_N} obtenu !`),700) }
  return r } }
/* infobulle des cosmétiques Prodiges */
{ const _tip=s8Tip; s8Tip=function(k){ const [,kind,id]=k.split(':'); const c=kind==='cos'&&COS8K[id];
  if(!c||c.s!=='p') return _tip(k); const o=ACC.scos&&ACC.scos[id];
  return `<article class="it s8tip" style="--rc:${SRAR[c.r][1]}"><header><b>${esc(c.n)}</b><small>${COS_T[c.t]} · <span style="color:${SRAR[c.r][1]}">${SRAR[c.r][0]}</span> · Prodiges</small></header><div class="skbody"><p>${esc(c.d)}</p><p>${o?`Obtenu le ${new Date(o).toLocaleDateString('fr-FR')}.`:`Se trouve dans le ${PROD_N} (boutique du Marchand et butin de défi).`}</p></div></article>` } }
