/* Cendrelame · systems/saison-et-cosmetiques.js */
/* ================= Saison : quêtes, cosmétiques, trophées (0.7.6) ================= */
const u8=k=>uic(UIC[k]?k:'star');
UIC.flame=UIC.flame||'<path d="M12 2.5c1 3.6 5 5.4 5 10.2a5 5 0 0 1-10 0c0-2.5 1.3-3.9 2.4-5.4.3 1.6 1 2.6 2.1 3.1-.6-3.4-.6-5.4.5-7.9z"/>';
UIC.eye=UIC.eye||'<path d="M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.6 6.5-10 6.5S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>';
UIC.frame=UIC.frame||'<rect x="4" y="3.5" width="16" height="17" rx="2.5"/><path d="M4 8h16M8 3.5v17" opacity=".5"/>';
const SRAR=[['Commun','#b0906a'],['Rare','#d6b032'],['Épique','#a050d8'],['Légendaire','#ff7a1a']];
const SEA_NAMES={1:'Les Cendres Éveillées'};
const seaN=()=>{ const R=FB.season||(()=>{try{return JSON.parse(lsGet(KP+'seasonc')||'null')}catch(e){return null}})(); return Math.max(1,(R&&+R.n)||ACC.season||0) };
const seaName=()=>{ const n=seaN(),t=seasonTitle(); return t&&!/^Saison \d+$/.test(t)?t:(SEA_NAMES[n]||SEA_NAMES[1]) };
const seaEnd=()=>FB.season&&+FB.season.end||0;
const seaLeft=()=>{ const e=seaEnd(); return e&&e>Date.now()?qLeft(e-Date.now()):null };
/* ---------- catalogue des cosmétiques de saison ---------- */
const COS_T={orn:'Ornement de carte',pf:'Cadre de portrait',aura:'Aura de combat',trail:'Traînée de carte',cfx:'Effet de carte',bg:'Arrière-plan'};
const COS8=[
 {id:'o_spk1',t:'orn',n:'Petites piques de braise',d:'Petites piques forgées aux quatre coins de la carte.',r:0},
 {id:'o_spk2',t:'orn',n:'Piques de braise',d:'Piques forgées de taille moyenne aux quatre coins.',r:1},
 {id:'o_spk3',t:'orn',n:'Grandes piques de braise',d:'Grandes piques incandescentes aux quatre coins.',r:2},
 {id:'o_fil',t:'orn',n:'Filigrane royal',d:'Volutes d’or et grenat aux coins.',r:1},
 {id:'o_crown',t:'orn',n:'Couronne d’or',d:'Une couronne posée sur le haut de la carte.',r:2},
 {id:'o_chain',t:'orn',n:'Chaînes du geôlier',d:'Rivets et chaînes sur les bords.',r:1},
 {id:'o_rune',t:'orn',n:'Cercle runique',d:'Runes violettes qui luisent aux coins.',r:2},
 {id:'o_frost',t:'orn',n:'Givre éternel',d:'Cristaux de glace aux quatre coins.',r:2},
 {id:'o_wing',t:'orn',n:'Ailes de braise',d:'Ailes enflammées derrière la carte.',r:3},
 {id:'p_bone',t:'pf',n:'Ossements',d:'Crânes et os autour du portrait.',r:0},
 {id:'p_laurel',t:'pf',n:'Couronne de laurier',d:'Feuilles d’or autour du portrait.',r:1},
 {id:'p_thorn',t:'pf',n:'Ronces',d:'Épines noires et sombres.',r:1},
 {id:'p_rune',t:'pf',n:'Anneau runique',d:'Anneau de runes violettes.',r:2},
 {id:'p_frost',t:'pf',n:'Givre éternel',d:'Cristaux de glace autour du portrait.',r:2},
 {id:'p_bolt',t:'pf',n:'Foudre captive',d:'Arcs électriques autour du portrait.',r:2},
 {id:'p_flame',t:'pf',n:'Couronne de flammes',d:'Flammes vives autour du portrait.',r:3},
 {id:'p_star',t:'pf',n:'Constellation',d:'Étoiles qui scintillent autour du portrait.',r:3},
 {id:'a_blood',t:'aura',n:'Soif de sang',d:'Gouttes rouges et halo sombre.',r:1},
 {id:'a_frost',t:'aura',n:'Givre glacial',d:'Cristaux et souffle froid.',r:2},
 {id:'a_shadow',t:'aura',n:'Ombre rampante',d:'Fumée violette et ténèbres.',r:2},
 {id:'a_storm',t:'aura',n:'Tempête',d:'Petits éclairs qui crépitent.',r:2},
 {id:'a_ember',t:'aura',n:'Aura de cendre',d:'Braises qui montent autour du héros.',r:3},
 {id:'a_holy',t:'aura',n:'Lumière sacrée',d:'Rayons dorés venus d’en haut.',r:3},
 {id:'t_ash',t:'trail',n:'Cendres',d:'Flocons gris qui retombent.',r:0},
 {id:'t_spark',t:'trail',n:'Étincelles',d:'Gerbe d’étincelles derrière la carte.',r:1},
 {id:'t_shadow',t:'trail',n:'Ruban d’ombre',d:'Longue traînée violette.',r:2},
 {id:'t_petal',t:'trail',n:'Pétales de braise',d:'Pétales rougeoyants.',r:2},
 {id:'f_smoke',t:'cfx',n:'Fumée',d:'Brume sombre au pied de la carte.',r:1},
 {id:'f_ember',t:'cfx',n:'Braises',d:'Des braises montent du bas de la carte.',r:2},
 {id:'f_frost',t:'cfx',n:'Givre',d:'Bords gelés et reflets bleus.',r:2},
 {id:'f_holo',t:'cfx',n:'Holographique',d:'Reflet arc-en-ciel qui balaie la carte.',r:3},
 {id:'bg_ash',t:'bg',n:'Ville en cendres',d:'Ruines fumantes sous un ciel rouge.',r:2,bg:101},
 {id:'bg_forge',t:'bg',n:'Forge éternelle',d:'Coulées de lave et enclume géante.',r:3,bg:102},
 {id:'bg_ecl',t:'bg',n:'Ciel d’éclipse',d:'Soleil noir et couronne de feu.',r:3,bg:103}].map(c=>Object.assign({s:1},c));
const COS8K=Object.fromEntries(COS8.map(c=>[c.id,c]));
const SBG_ID={101:'bg_ash',102:'bg_forge',103:'bg_ecl'};
const cosOwn=id=>!!(id&&ACC.scos&&ACC.scos[id]);
const cosOk=id=>id&&COS8K[id]&&cosOwn(id)?id:null;
const cosN=id=>COS8K[id]?COS8K[id].n:'';
const myAura=()=>cosOk((ACC.card||{}).aura);
/* ---------- dessins ---------- */
const OC8={
 spike:(c,d)=>`<path d="M14 14 L-14 -14 L26 8 Z" fill="${c}" stroke="${d}" stroke-width="2" stroke-linejoin="round"/><path d="M14 14 L-6 -26 L8 22 Z" fill="${c}" stroke="${d}" stroke-width="2" stroke-linejoin="round"/><path d="M14 14 L-26 -6 L22 8 Z" fill="${c}" stroke="${d}" stroke-width="2" stroke-linejoin="round" opacity=".9"/><path d="M8 40 L-10 52 L14 46 Z M40 8 L52 -10 L46 14 Z" fill="${c}" stroke="${d}" stroke-width="2" stroke-linejoin="round"/><circle cx="16" cy="16" r="8" fill="#2a1a10" stroke="${c}" stroke-width="3"/><circle cx="16" cy="16" r="3" fill="${c}"/>`,
 fil:c=>`<path d="M4 60 C4 24 24 4 60 4" fill="none" stroke="${c}" stroke-width="3"/><path d="M10 50 C2 34 14 24 22 30 C30 36 20 46 14 40" fill="none" stroke="${c}" stroke-width="2.5"/><path d="M50 10 C34 2 24 14 30 22 C36 30 46 20 40 14" fill="none" stroke="${c}" stroke-width="2.5"/><circle cx="18" cy="18" r="6" fill="#7a2030" stroke="${c}" stroke-width="2.5"/><path d="M60 4 h18 M4 60 v18" stroke="${c}" stroke-width="2"/><circle cx="80" cy="4" r="3" fill="${c}"/><circle cx="4" cy="80" r="3" fill="${c}"/>`,
 rune:c=>`<circle cx="18" cy="18" r="16" fill="#140a2acc" stroke="${c}" stroke-width="2.5"/><circle cx="18" cy="18" r="11" fill="none" stroke="${c}" stroke-width="1" stroke-dasharray="2 3"/><text x="18" y="24" text-anchor="middle" font-size="16" fill="#e0d0ff">ᛟ</text><path d="M36 10 h40 M10 36 v40" stroke="${c}" stroke-width="2" stroke-dasharray="6 4"/>`,
 bolt:c=>`<rect x="2" y="2" width="30" height="30" rx="4" fill="#3a3e46" stroke="#1a1c20" stroke-width="2"/><circle cx="17" cy="17" r="6" fill="${c}" stroke="#1a1c20" stroke-width="2"/><path d="M14 17h6M17 14v6" stroke="#1a1c20" stroke-width="1.5"/>`,
 frost:c=>`<path d="M16 16 L-10 -18 L4 4 L-20 -4 L6 10 L-4 -20 L12 6 Z" fill="${c}" stroke="#4a8ab0" stroke-width="1.5" stroke-linejoin="round" opacity=".95"/><path d="M16 16 L34 -6 L24 18 Z M16 16 L-6 34 L18 24 Z" fill="#e8f6ff" stroke="#4a8ab0" stroke-width="1.5"/><circle cx="16" cy="16" r="5" fill="#fff"/>`};
const oCorners=(g,os,oo)=>['tl','tr','bl','br'].map(k=>`<svg class="oc ${k}" viewBox="0 0 64 64" style="--os:${os}px;--oo:${oo}px" aria-hidden="true">${g}</svg>`).join('');
const O_CROWN=`<svg class="ot" viewBox="0 0 120 60" aria-hidden="true"><path d="M10 54 L16 16 L38 36 L60 4 L82 36 L104 16 L110 54 Z" fill="#e8c060" stroke="#5a3a10" stroke-width="3" stroke-linejoin="round"/><rect x="8" y="48" width="104" height="10" rx="3" fill="#c89a3a" stroke="#5a3a10" stroke-width="2.5"/><circle cx="60" cy="30" r="6" fill="#c0392b" stroke="#5a3a10" stroke-width="2"/><circle cx="16" cy="14" r="5" fill="#7fb4ff" stroke="#5a3a10" stroke-width="2"/><circle cx="104" cy="14" r="5" fill="#7fb4ff" stroke="#5a3a10" stroke-width="2"/><circle cx="60" cy="4" r="4" fill="#fff3c0" stroke="#5a3a10" stroke-width="2"/></svg>`;
const O_WING=s=>`<svg class="ow ${s}" viewBox="0 0 110 200" aria-hidden="true">${[0,1,2,3,4].map(i=>`<path d="M104 ${30+i*22} C ${70-i*6} ${10+i*24} ${20-i*2} ${20+i*30} ${4+i*4} ${40+i*34} C 40 ${50+i*26} 80 ${52+i*22} 104 ${56+i*22} Z" fill="${['#ffb04a','#ff8a3a','#e0601a','#c0461a','#8a2a0a'][i]}" stroke="#ffd08a" stroke-width="1.2" opacity="${(1-i*.12).toFixed(2)}"/>`).join('')}</svg>`;
const O_CHAIN=s=>`<svg class="oside ${s}" viewBox="0 0 22 300" preserveAspectRatio="none" aria-hidden="true">${Array.from({length:12},(_,i)=>`<rect x="${i%2?7:3}" y="${i*25}" width="${i%2?8:16}" height="26" rx="${i%2?4:8}" fill="none" stroke="#9aa4b4" stroke-width="3.5"/>`).join('')}</svg>`;
const ORN8={
 o_spk1:[oCorners(OC8.spike('#ff8a3a','#4a1408'),46,10),'#ff7a1a55'],
 o_spk2:[oCorners(OC8.spike('#ff8a3a','#4a1408'),66,18),'#ff7a1a77'],
 o_spk3:[oCorners(OC8.spike('#ff8a3a','#4a1408'),88,26),'#ff7a1a99'],
 o_fil:[oCorners(OC8.fil('#e8c060'),84,10),''],
 o_crown:[oCorners(OC8.bolt('#e8c060'),34,12)+O_CROWN,''],
 o_chain:[oCorners(OC8.bolt('#9aa4b4'),36,12)+O_CHAIN('l')+O_CHAIN('r'),''],
 o_rune:[oCorners(OC8.rune('#a07aff'),70,16),'#a07aff88'],
 o_frost:[oCorners(OC8.frost('#bfe6ff'),80,20),'#bfe6ff66'],
 o_wing:[oCorners(OC8.spike('#ffb04a','#4a1408'),50,14)+O_WING('l')+O_WING('r'),'#ff7a1aaa']};
function pcOrnWrap(d,html){ const o=cosOk8(d.orn,'orn'),tr=COS8K[d.trail]&&COS8K[d.trail].t==='trail'?d.trail:'';
  if(!o) return tr?html.replace('<article ',`<article data-trail="${tr}" `):html;
  const O=ORN8[o]; return `<div class="orn8 ${o} ${O[1]?'glow':''}" style="${O[1]?'--og:'+O[1]:''}" ${tr?`data-trail="${tr}"`:''}>${O[0]}${html}</div>` }
/* sur les cartes des autres joueurs, on fait confiance à la carte publiée (id connu) */
const cosOk8=(id,t)=>id&&COS8K[id]&&COS8K[id].t===t?id:null;
const ring8=(n,fn)=>Array.from({length:n},(_,i)=>fn(i,i/n*Math.PI*2)).join('');
const P8=(a,r)=>[75+Math.cos(a)*r,75+Math.sin(a)*r].map(v=>v.toFixed(1));
const PF8={
 p_laurel:()=>`<circle cx="75" cy="75" r="54" fill="none" stroke="#c89a3a" stroke-width="5"/>${ring8(18,(i,a)=>{if(i>7&&i<10)return'';const [x,y]=P8(a,60);return `<ellipse cx="${x}" cy="${y}" rx="11" ry="5" fill="#e8c060" stroke="#5a3a10" stroke-width="1.5" transform="rotate(${(a*180/Math.PI+60).toFixed(0)} ${x} ${y})"/>`})}<path d="M60 128 L75 118 L90 128 L84 140 L75 134 L66 140 Z" fill="#c0392b" stroke="#5a3a10" stroke-width="2"/>`,
 p_rune:()=>`<circle cx="75" cy="75" r="56" fill="none" stroke="#7a50e0" stroke-width="10" opacity=".85"/><circle cx="75" cy="75" r="62" fill="none" stroke="#b090ff" stroke-width="1.5"/><circle cx="75" cy="75" r="50" fill="none" stroke="#b090ff" stroke-width="1.5"/>${ring8(12,(i,a)=>{const [x,y]=P8(a,56);return `<text x="${x}" y="${(+y+4).toFixed(1)}" text-anchor="middle" font-size="10" fill="#f0e8ff">${'ᚠᚢᚦᚨᚱᚲᚷᚹᚺᚾᛁᛃ'[i]}</text>`})}`,
 p_flame:()=>`${ring8(16,(i,a)=>{const [x,y]=P8(a,56);return `<path d="M0 6 C-6 -2 -3 -10 0 -18 C3 -10 6 -2 0 6Z" fill="${i%2?'#ffb04a':'#ff5a1a'}" stroke="#7a1a04" stroke-width="1" transform="translate(${x} ${y}) rotate(${(a*180/Math.PI+90).toFixed(0)}) scale(1.4)"/>`})}<circle cx="75" cy="75" r="52" fill="none" stroke="#ff8a3a" stroke-width="5"/>`,
 p_thorn:()=>`<circle cx="75" cy="75" r="55" fill="none" stroke="#3a2a1a" stroke-width="6"/>${ring8(14,(i,a)=>{const [x,y]=P8(a,58),[x2,y2]=P8(a+.12,72),[x3,y3]=P8(a+.2,58);return `<path d="M${x} ${y} L${x2} ${y2} L${x3} ${y3}Z" fill="#2a1a10" stroke="#8a6a44" stroke-width="1"/>`})}`,
 p_frost:()=>`<circle cx="75" cy="75" r="55" fill="none" stroke="#bfe6ff" stroke-width="5"/>${ring8(10,(i,a)=>{const [x,y]=P8(a,58);return `<path d="M0 0 L-5 -12 L0 -26 L5 -12Z" fill="#e8f6ff" stroke="#4a8ab0" stroke-width="1.2" transform="translate(${x} ${y}) rotate(${(a*180/Math.PI+90).toFixed(0)}) scale(${i%2?.8:1.15})"/>`})}`,
 p_bolt:()=>`<circle cx="75" cy="75" r="55" fill="none" stroke="#5a5a8a" stroke-width="6"/><path d="${ring8(20,(i,a)=>{const [x,y]=P8(a,55+(i%2?8:-6));return (i?'L':'M')+x+' '+y})}Z" fill="none" stroke="#fff3a0" stroke-width="2.2"/>`,
 p_bone:()=>`<circle cx="75" cy="75" r="55" fill="none" stroke="#d8ccb0" stroke-width="7"/>${ring8(6,(i,a)=>{const [x,y]=P8(a-Math.PI/2,57);return `<g transform="translate(${x} ${y})"><circle r="9" fill="#efe6d0" stroke="#3a2a1a" stroke-width="1.5"/><circle cx="-3" cy="-1" r="2" fill="#3a2a1a"/><circle cx="3" cy="-1" r="2" fill="#3a2a1a"/></g>`})}`,
 p_star:()=>`<circle cx="75" cy="75" r="56" fill="none" stroke="#2a3a7a" stroke-width="9"/><circle cx="75" cy="75" r="56" fill="none" stroke="#7fb4ff" stroke-width="1"/>${ring8(9,(i,a)=>{const [x,y]=P8(a,56),s=i%3?5:9;return `<path d="M0 -${s} L1.5 -1.5 L${s} 0 L1.5 1.5 L0 ${s} L-1.5 1.5 L-${s} 0 L-1.5 -1.5Z" fill="#fff" transform="translate(${x} ${y})"/>`})}`};
const PF8C={};
const pfSvg=id=>PF8[id]?(PF8C[id]=PF8C[id]||`<svg class="pf8s" viewBox="0 0 150 150" aria-hidden="true">${PF8[id]()}</svg>`):'';
const pcPf=(d,s)=>{ const p=cosOk8(d.pf,'pf'); if(!p) return pcIcon(d.icon,s); return `<span class="pf8 ${p}" style="--ps:${s}px">${pcIcon(d.icon,s)}${pfSvg(p)}</span>` };
const SBG_SVG={
 101:()=>`<svg class="zscene" viewBox="0 0 300 150" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs><linearGradient id="sb1" x2="0" y2="1"><stop offset="0" stop-color="#2a0806"/><stop offset=".7" stop-color="#a8340e"/><stop offset="1" stop-color="#ffb04a"/></linearGradient></defs><rect width="300" height="150" fill="url(#sb1)"/><circle cx="220" cy="70" r="26" fill="#ffd08a" opacity=".5"/><path d="M0 150 V100 h20 v-30 h14 v20 h18 v-40 l10 -10 10 10 v50 h22 v-26 h16 v36 h26 v-60 h8 v-10 h8 v10 h8 v70 h20 v-34 h30 v20 h22 v-50 l12 -14 12 14 v64 h20 V150Z" fill="#1a0804"/><g fill="#ffb04a">${Array.from({length:16},(_,i)=>`<circle cx="${(i*41)%300}" cy="${30+(i*37)%90}" r="${(1+(i%3)*.6).toFixed(1)}" opacity=".8"/>`).join('')}</g></svg>`,
 102:()=>`<svg class="zscene" viewBox="0 0 300 150" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs><radialGradient id="sb2" cx=".5" cy="1" r=".8"><stop offset="0" stop-color="#ff6a1a"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient></defs><rect width="300" height="150" fill="#140806"/><rect width="300" height="150" fill="url(#sb2)" opacity=".5"/><path d="M0 120 C60 100 120 140 180 118 S280 110 300 124 V150 H0Z" fill="#ff6a1a"/><path d="M0 130 C70 116 130 146 190 128 S270 122 300 134 V150 H0Z" fill="#ffd08a" opacity=".6"/><path d="M60 0 L60 60 M240 0 L240 50" stroke="#3a2a1a" stroke-width="10"/><path d="M110 92 h60 c3 10 12 14 28 15 v6 h-26 l-6 8 h6 v8 h-40 v-8 h6 l-4 -9 c-14 -1 -22 -8 -24 -20z" fill="#2a1a10" stroke="#ff8a3a" stroke-width="1.5"/></svg>`,
 103:()=>`<svg class="zscene" viewBox="0 0 300 150" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><rect width="300" height="150" fill="#0a0612"/><g fill="#fff">${Array.from({length:30},(_,i)=>`<circle cx="${(i*53)%300}" cy="${(i*31)%150}" r="${(.5+(i%3)*.4).toFixed(1)}" opacity=".7"/>`).join('')}</g><circle cx="150" cy="70" r="46" fill="#ff8a3a" opacity=".35"/><circle cx="150" cy="70" r="40" fill="#ffb04a"/><circle cx="150" cy="70" r="37" fill="#05030a"/><path d="M0 150 L40 116 L80 132 L130 104 L180 128 L230 110 L300 134 V150Z" fill="#140a1a"/></svg>`};
const pcBgH=(i,id)=>SBG_SVG[i]?SBG_SVG[i]():zoneScene(i>=100?3:i,id);
const CFX8={
 f_ember:()=>Array.from({length:14},(_,i)=>`<i style="--x:${(i*29)%100}%;--d:${(2+(i%4)*.6).toFixed(1)}s;--dl:-${((i*.37)%2.5).toFixed(2)}s"></i>`).join(''),
 f_frost:()=>`<svg viewBox="0 0 300 420" preserveAspectRatio="none"><path d="M0 0 L40 0 L28 18 L48 30 L20 34 L30 60 L0 70Z M300 420 L250 420 L268 396 L240 388 L272 370 L262 340 L300 330Z" fill="#e8f6ffaa"/></svg>`,
 f_holo:()=>'',f_smoke:()=>''};
const pcCfx=d=>{ const f=cosOk8(d.cfx,'cfx'); return f?`<div class="cfx8 ${f}" aria-hidden="true">${CFX8[f]()}</div>`:'' };
const AURA8={
 a_ember:['--a1:#ff7a1a77;--a2:#ffb04a',16],a_frost:['--a1:#7fd0ff66;--a2:#e8f6ff',14],a_shadow:['--a1:#5a2a9a88;--a2:#b080ff',10],
 a_holy:['--a1:#ffe8a066;--a2:#fff3c0',10],a_storm:['--a1:#9ab0ff55;--a2:#fff3a0',0],a_blood:['--a1:#c0202077;--a2:#ff4a4a',12]};
function auraHTML(id){ const A=AURA8[id]; if(!A) return '';
  const pt=(i)=>`<i class="pt" style="--x:${30+((i*37)%40)}%;--y:${8+(i*23)%55}%;--d:${(2+(i%4)*.5).toFixed(1)}s;--dl:-${((i*.41)%2.4).toFixed(2)}s;--z:${4+(i%3)*2}px"></i>`,ptB=Array.from({length:A[1]},(_,i)=>i%2?pt(i):'').join(''),ptF=Array.from({length:A[1]},(_,i)=>i%2?'':pt(i)).join('');
  const bolts=id==='a_storm'?[[18,45],[74,25],[78,60],[22,15]].map(([x,y],i)=>`<svg class="bolt" style="--x:${x}%;--y:${y}%;animation-delay:-${i*.4}s" viewBox="0 0 30 70"><path d="M18 0 L6 32 H16 L8 70 L26 26 H16 Z" fill="#fff3a0"/></svg>`).join(''):'';
  return `<span class="au8 b ${id}" style="${A[0]}" aria-hidden="true">${id==='a_holy'?'<i class="ray"></i>':''}<i class="ag"></i><i class="ar"></i><i class="ar ar2"></i>${ptB}</span><span class="au8 f ${id}" style="${A[0]}" aria-hidden="true"><i class="ar"></i><i class="ar ar2"></i>${ptF}${bolts}</span>` }
/* traînée quand la carte flottante est déplacée */
const TRAIL8={t_ash:['#8a8a8a','#c0461a','ash'],t_spark:['#ffb04a','#fff3c0','spark'],t_shadow:['#a07aff','#5a2a9a','rib'],t_petal:['#ff5a3a','#ffb04a','petal']};
let TR8={x:0,y:0,i:0};
document.addEventListener('pointermove',e=>{ if(!PCF.drag) return; const w=$('#pcfl'); if(!w) return; const el=w.querySelector('[data-trail]'); if(!el) return; const T=TRAIL8[el.dataset.trail]; if(!T) return;
  const dx=e.clientX-TR8.x,dy=e.clientY-TR8.y; if(dx*dx+dy*dy<120) return; TR8.x=e.clientX; TR8.y=e.clientY; TR8.i++;
  const r=(el.querySelector('.pc1')||el).getBoundingClientRect(),cx=r.left+r.width/2-dx*2,cy=r.top+r.height/2-dy*2;
  for(let k=0;k<(T[2]==='rib'?1:3);k++){ const p=document.createElement('i'); p.className='trp8 '+T[2]; const s=T[2]==='rib'?26:5+Math.random()*7;
    p.style.cssText=`left:${(cx+(Math.random()-.5)*r.width*.6)/ZM}px;top:${(cy+(Math.random()-.5)*r.height*.6)/ZM}px;width:${s}px;height:${s}px;--c:${(TR8.i+k)%2?T[0]:T[1]};--r:${Math.round(Math.random()*360)}deg`;
    document.body.append(p); setTimeout(()=>p.remove(),900) } });
/* ---------- coffres et lots ---------- */
const SCH_W=[[80,20,0,0],[30,60,10,0],[10,30,55,5],[0,15,45,40]];
const LOT8={
 forge:{n:'Lot du forgeron',it:[['pd_rune',20,30,100],['st_up',3,5,100],['es_bra',4,6,100],['ru_maj',1,1,25]]},
 ench:{n:'Lot de l’enchanteur',it:[['sc_blank',4,6,100],['pd_rune',15,20,100],['ru_min',2,3,100],['ru_anc',1,1,15]]},
 rune:{n:'Lot des runes',it:[['ru_maj',1,2,100],['es_pie',6,8,100],['es_ven',6,8,100],['ru_pri',1,1,5]]}};
const lotRoll=k=>LOT8[k].it.filter(x=>Math.random()*100<x[3]).map(([m,a,b])=>[m,a+Math.floor(Math.random()*(b-a+1))]);
const CH8SVG=c=>`<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M8 28V22a14 14 0 0 1 14-14h20a14 14 0 0 1 14 14v6z" fill="${c}" stroke="#1a0a04" stroke-width="2.5"/><rect x="6" y="28" width="52" height="28" rx="3" fill="${c}" stroke="#1a0a04" stroke-width="2.5" opacity=".85"/><path d="M6 36h52" stroke="#1a0a04" stroke-width="2"/><path d="M16 9v47M48 9v47" stroke="#ffe3a8" stroke-width="3.5"/><path d="M32 30l4 6-4 6-4-6z" fill="#fff6d0" stroke="#5a3a10" stroke-width="1.5"/></svg>`;
const chIc8=(r,n)=>`<span class="ch8" style="--cc:${SRAR[r][1]}" data-tip="s8:ch:${r}">${CH8SVG(SRAR[r][1])}${n>1?`<em>×${n}</em>`:''}</span>`;
const lotIc8=k=>`<span class="lot8" data-tip="s8:lot:${k}">${LOT8[k].it.slice(0,3).map(([m])=>`<svg class="mfi" viewBox="0 0 24 24">${MI[m]}</svg>`).join('')}<em>Lot</em></span>`;
function s8Tip(k){ const [,kind,id]=k.split(':');
  if(kind==='lot'){ const L=LOT8[id]; if(!L) return '';
    return `<article class="it s8tip" style="--rc:#8a6a44"><header><b>${L.n}</b><small>Lot de ressources d’artisanat</small></header><div class="skbody"><table class="s8tt"><tr><th>Objet</th><th>Quantité</th><th>Chance</th></tr>${L.it.map(([m,a,b,p])=>`<tr><td><span class="s8ti" style="--rc:var(--r${nwR(m)})"><svg class="mfi" viewBox="0 0 24 24">${MI[m]}</svg></span>${esc(MAT_OBJ[m]||m)}</td><td class="num">${a===b?a:a+' à '+b}</td><td class="num ${p<100?'s8bon':''}">${p} %</td></tr>`).join('')}</table><p class="mute">Les objets à 100 % sont garantis. Tout arrive dans l’inventaire (dans le coffre du compte s’il est plein).</p></div></article>` }
  if(kind==='ch'){ const r=+id,W=SCH_W[r];
    return `<article class="it s8tip" style="--rc:${SRAR[r][1]}"><header><b>Coffre de saison ${SRAR[r][0].toLowerCase()}</b><small>Contient 1 cosmétique de la saison</small></header><div class="skbody"><table class="s8tt"><tr><th>Rareté du cosmétique</th><th>Chance</th></tr>${W.map((w,i)=>w?`<tr><td style="color:${SRAR[i][1]}">${SRAR[i][0]}</td><td class="num">${w} %</td></tr>`:'').join('')}</table><p class="mute">Un cosmétique que vous n’avez pas encore est toujours choisi en priorité. Si vous les avez tous dans cette rareté, vous recevez un Lot du forgeron à la place.</p></div></article>` }
  if(kind==='cos'){ const c=COS8K[id]; if(!c) return ''; const o=ACC.scos&&ACC.scos[id];
    return `<article class="it s8tip" style="--rc:${SRAR[c.r][1]}"><header><b>${esc(c.n)}</b><small>${COS_T[c.t]} · <span style="color:${SRAR[c.r][1]}">${SRAR[c.r][0]}</span> · Saison ${c.s}</small></header><div class="skbody"><p>${esc(c.d)}</p><p>${o?`Obtenu le ${new Date(o).toLocaleDateString('fr-FR')}.`:`Se trouve dans les coffres de saison ${SCH_W.map((W,i)=>W[c.r]?SRAR[i][0].toLowerCase():'').filter(Boolean).join(', ')} (récompenses des quêtes de la Saison ${c.s}).`}</p></div></article>` }
  return '' }
/* ---------- état de la saison ---------- */
function seaA(){ const n=seaN(); if(!ACC.sea||ACC.sea.n!==n) ACC.sea={n,c:{},q:{},st:0}; return ACC.sea }
const SQ8=()=>{ const Z=ZONES,AV=RAIDS.find(r=>r.id==='avatar')||RAIDS[RAIDS.length-1]; return [
 ['Campagne','swords',[
  {id:'c1',ic:'skull',t:`Vaincre ${Z[1].boss.n}`,s:`Boss de campagne, ${Z[1].n}, en Héroïque`,ev:'boss:hero:1',n:1,rw:['ch',1]},
  {id:'c2',ic:'skull',t:`Vaincre ${Z[2].boss.n}`,s:`Boss de campagne, ${Z[2].n}, en Héroïque`,ev:'boss:hero:2',n:1,rw:['ch',2]},
  {id:'c3',ic:'skull',t:'Vaincre un boss en Mythique',s:'N’importe quel boss de campagne',ev:'bossm',n:1,rw:['ch',3]},
  {id:'c4',ic:'swords',t:'Vaincre 500 ennemis',s:'En Aventure, pendant la saison',ev:'kill',n:500,rw:['lot','forge']}]],
 ['Artisanat','anvil',[
  {id:'a1',ic:'recycle',t:'Recycler 50 objets',s:'À la Forge ou avec le tri du butin',ev:'recycle',n:50,rw:['lot','ench']},
  {id:'a2',ic:'anvil',t:'Renforcer un objet jusqu’à +7',s:'Avec des pierres de renforcement',ev:'upmax',n:7,rw:['ch',1]},
  {id:'a3',ic:'spark',t:'Enchanter 15 parchemins',s:'À l’Autel d’enchantement',ev:'ench',n:15,rw:['lot','rune']}]],
 ['Duels et défis','people',[
  {id:'d1',ic:'people',t:'Remporter 10 duels',s:'Contre d’autres joueurs',ev:'duelwin',n:10,rw:['ch',2]},
  {id:'d2',ic:'people',t:'Remporter 3 duels d’affilée',s:'Une défaite remet la série à zéro',ev:'streak',n:3,rw:['ch',0,2]},
  {id:'d3',ic:'skull',t:`Vaincre ${AV.n}`,s:'Défis',ev:'raid:'+AV.id,n:1,rw:['ch',3]}]]] };
const sqAll=()=>SQ8().flatMap(g=>g[2]);
const sqP=q=>Math.min(q.n,(seaA().c[q.ev]||0));
const sqClaimN=()=>{ if(!qHas()) return 0; const A=seaA(); return sqAll().filter(q=>sqP(q)>=q.n&&!A.q[q.id]).length };
const SEA_MAX=new Set(['upmax','streak']);
function sEv(ev,n=1){ if(!qHas()) return; const A=seaA(),Q=sqAll(),before=Object.fromEntries(Q.map(q=>[q.id,sqP(q)>=q.n]));
  if(SEA_MAX.has(ev)) A.c[ev]=Math.max(A.c[ev]||0,n); else A.c[ev]=(A.c[ev]||0)+n;
  if(ev==='duelwin'){ A.st=(A.st||0)+1; A.c.streak=Math.max(A.c.streak||0,A.st) }
  const done=Q.filter(q=>!before[q.id]&&sqP(q)>=q.n);
  done.forEach((q,i)=>setTimeout(()=>toast('✦ Quête de saison terminée : '+q.t),500+i*500));
  seaTrCheck(); saveAcc(); if(done.length&&typeof renderTabs==='function'&&!UI.scr) renderTabs() }
function seaLoss(){ const A=seaA(); A.st=0; saveAcc() }
function sqClaim(id){ const q=sqAll().find(x=>x.id===id),A=seaA(); if(!q||A.q[id]||sqP(q)<q.n) return;
  A.q[id]=Date.now();
  if(q.rw[0]==='ch'){ qGive([['s_ch'+q.rw[1],q.rw[2]||1]]); save(); toast(`${q.rw[2]>1?q.rw[2]+' coffres':'Coffre'} de saison ${SRAR[q.rw[1]][0].toLowerCase()} ajouté${q.rw[2]>1?'s':''} à l’inventaire : clic droit pour l’ouvrir.`) }
  else { const rw=lotRoll(q.rw[1]); qGive(rw); save(); toast(`${LOT8[q.rw[1]].n} : ${rw.map(([k,n])=>n+' × '+(MAT_OBJ[k]||k)).join(', ')}.`) }
  seaTrCheck(); saveAcc(); render() }
const schK=r=>'s_ch'+r;
const schN=r=>matAll(schK(r));
function sChMig(){ if(!S||!S.bag||!ACC.schest) return; const c=ACC.schest; let ch=false; for(let r=0;r<4;r++) if(c[r]>0){ const left=bagAddMat(S.bag,schK(r),c[r]); if(left<c[r]) ch=true; c[r]=left } if(!c.some(x=>x>0)) delete ACC.schest; if(ch){ markNew(); save(); saveAcc() } }
function sChRoll(r){ let x=Math.random()*100,rr=0; for(let i=0;i<4;i++){ if(x<SCH_W[r][i]){rr=i;break} x-=SCH_W[r][i] } return rr }
const COS_IC={orn:'spark',pf:'eye',aura:'flame',trail:'auto',cfx:'star',bg:'book'};
function sChTile(c,win){ const col=c?SRAR[c.r][1]:'#c9ad7a'; return `<div class="chtile ${win?'win':''}" style="--rc:${col}"><span class="chs8">${c?u8(COS_IC[c.t]):`<svg class="mfi" viewBox="0 0 24 24">${MI.st_up}</svg>`}</span><b>${c?esc(c.n):'Lot du forgeron'}</b><small>${c?SRAR[c.r][0]:'Ressources'}</small></div>` }
function sChAsk(r){ r=+r; if(schN(r)<1) return; closeChest(); const w=document.createElement('div'); w.id='chestw'; w.className='chestm'; w.setAttribute('role','dialog'); w.setAttribute('aria-modal','true');
  w.innerHTML=`<div class="box chask"><span class="chico">${matSvg(schK(r))}</span><h2>Ouvrir le Coffre de saison ${SRAR[r][0].toLowerCase()} ?</h2><p>Le coffre sera consommé et révélera 1 cosmétique de la Saison ${seaN()}.</p><div class="row"><button class="btn" data-act="chestNo">Annuler</button><button class="btn pri" data-act="sChOpen" data-r="${r}">Ouvrir</button></div></div>`;
  document.body.append(w); w.querySelector('[data-act=sChOpen]').focus() }
function sChOpen(r){ r=+r; if(schN(r)<1){ closeChest(); return } removeMat(schK(r),1);
  const rr=sChRoll(r),pool=t=>COS8.filter(k=>k.r===t&&k.s===1&&!cosOwn(k.id));
  let P=pool(rr),t=rr; while(!P.length&&t>0){ t--; P=pool(t) }
  let got=null,lot=null;
  if(P.length){ got=P[Math.floor(Math.random()*P.length)]; ACC.scos=ACC.scos||{}; ACC.scos[got.id]=Date.now() }
  else { lot=lotRoll('forge'); qGive(lot) }
  seaTrCheck(); saveAcc(); save();
  let w=$('#chestw'); if(!w){ w=document.createElement('div'); w.id='chestw'; w.className='chestm'; w.setAttribute('role','dialog'); w.setAttribute('aria-modal','true'); document.body.append(w) }
  const rnd=()=>{ const t2=sChRoll(r),L=COS8.filter(k=>k.r===t2&&k.s===1); return L[Math.floor(Math.random()*L.length)] };
  const N=56,W=50,strip=Array.from({length:N},(_,i)=>i===W?got:rnd());
  w.innerHTML=`<div class="box chopen"><h2>Coffre de saison ${SRAR[r][0].toLowerCase()}</h2><div class="chwin"><div class="chstrip">${strip.map((x,i)=>sChTile(x,i===W)).join('')}</div><i class="chmark"></i></div><div class="chres" aria-live="polite"></div></div>`;
  const st=w.querySelector('.chstrip'),win=w.querySelector('.chwin'),tw=st.children[0].offsetWidth+10;
  const target=W*tw+tw/2-win.clientWidth/2+(Math.random()-.5)*(tw*.7);
  const quick=matchMedia('(prefers-reduced-motion: reduce)').matches;
  requestAnimationFrame(()=>{ st.style.transition=`transform ${quick?0.3:6.2}s cubic-bezier(.08,.75,.18,1)`; st.style.transform=`translateX(${-target}px)` });
  let fired=false; const done=()=>{ if(fired||!$('#chestw')) return; fired=true; st.children[W].classList.add('hl');
    w.querySelector('.chres').innerHTML=got?`<p class="chrar" style="color:${SRAR[got.r][1]}">${SRAR[got.r][0]} · ${COS_T[got.t]}</p><div class="s8mt">${cosThumb(got)}</div><h3>${esc(got.n)}</h3><p>${esc(got.d)}</p><div class="row">${schN(r)?`<button class="btn" data-act="sChOpen" data-r="${r}">Ouvrir un autre (${schN(r)})</button>`:''}<button class="btn" data-act="s8Equip" data-id="${got.id}">Équiper</button><button class="btn pri" data-act="chestNo">Fermer</button></div>`
      :`<p class="chrar">Lot du forgeron</p><h3>Tous les cosmétiques de cette rareté sont déjà à vous</h3><p>Vous recevez : ${lot.map(([k,n])=>n+' × '+esc(MAT_OBJ[k]||k)).join(', ')}.</p><div class="row">${schN(r)?`<button class="btn" data-act="sChOpen" data-r="${r}">Ouvrir un autre (${schN(r)})</button>`:''}<button class="btn pri" data-act="chestNo">Fermer</button></div>`;
    render(); };
  st.addEventListener('transitionend',done,{once:true}); setTimeout(done,quick?600:6600) }
function s8Equip(id){ const c=COS8K[id]; if(!c||!cosOwn(id)) return; ACC.card=Object.assign(pcDef(),ACC.card||{}); if(c.t==='bg') ACC.card.bg=c.bg; else ACC.card[c.t]=id; UI.pcDraft=null; const m=$('#s8m'); if(m) m.remove(); closeChest(); pcSave(); toast(`${c.n} équipé.`) }
/* ---------- trophées de saison ---------- */
const SEA_TR=()=>{ const A=seaA(),c=A.c,AV=RAIDS.find(r=>r.id==='avatar')||RAIDS[RAIDS.length-1]; return [
 {id:'boss4',ic:'skull',n:'Fléau des cendres',d:'Vaincre les 4 premiers boss de campagne en Héroïque pendant la saison.',p:30,f:()=>[[0,1,2,3].filter(z=>c['boss:hero:'+z]).length,4]},
 {id:'duel50',ic:'people',n:'Duelliste de la saison',d:'Remporter 50 duels pendant la saison.',p:25,f:()=>[c.duelwin||0,50]},
 {id:'up10',ic:'anvil',n:'Forgeron de braise',d:'Renforcer 3 objets jusqu’à +10 pendant la saison.',p:30,f:()=>[c.up10||0,3]},
 {id:'cos10',ic:'star',n:'Collectionneur de cendres',d:'Posséder 10 cosmétiques de la Saison 1.',p:20,f:()=>[COS8.filter(k=>k.s===1&&cosOwn(k.id)).length,10]},
 {id:'avatar3',ic:'trophy',n:'Fléau de l’Abîme',d:`Vaincre ${AV.n} 3 fois pendant la saison.`,p:50,f:()=>[c['raid:'+AV.id]||0,3]},
 {id:'allq',ic:'scroll',n:'Chroniqueur de la saison',d:'Récupérer les 10 quêtes de la saison.',p:40,f:()=>[Object.keys(A.q).length,10]}] };
const stroK=id=>seaN()+':'+id;
const stroGot=id=>!!(ACC.stro&&ACC.stro[stroK(id)]);
function seaTrPts(){ if(!ACC.stro) return 0; const P=Object.fromEntries(SEA_TR().map(t=>[t.id,t.p])); return Object.keys(ACC.stro).reduce((a,k)=>a+(P[k.split(':')[1]]||0),0) }
function seaTrCheck(){ if(!qHas()) return; ACC.stro=ACC.stro||{}; const got=[];
  for(const t of SEA_TR()){ if(stroGot(t.id)) continue; let ok=false; try{const [a,b]=t.f(); ok=a>=b}catch(e){} if(ok){ ACC.stro[stroK(t.id)]=Date.now(); got.push(t) } }
  if(got.length){ ACC.trNew=(ACC.trNew||0)+got.length; saveAcc(); got.forEach((t,i)=>setTimeout(()=>trToast(t),400+i*700)); presence() } }
/* ---------- Quêtes : barre latérale ---------- */
const _viewQuest0=viewQuest;
viewQuest=function(){
  const Q=qState(); if(!Q) return ''; seaTrCheck(); const cat=UI.qCat||'d',A=seaA(),n=seaN();
  const dl=Q.d.list.filter(q=>q.p>=q.n&&!q.got).length+(Q.d.list.every(q=>q.got)&&!Q.d.chest?1:0),wl=Q.w.list.filter(q=>q.p>=q.n&&!q.got).length,sl=sqClaimN();
  const side=`<nav class="s8side" aria-label="Catégories de quêtes"><small>Quêtes</small>
   <button class="s8tab ${cat==='d'?'on':''}" data-act="qCat" data-c="d" aria-pressed="${cat==='d'}">${u8('scroll')}<span><b>Journalières</b><small>Renouvelées à 6 h 00</small></span>${dl?`<em>${dl}</em>`:''}</button>
   <button class="s8tab ${cat==='w'?'on':''}" data-act="qCat" data-c="w" aria-pressed="${cat==='w'}">${u8('star')}<span><b>Hebdomadaires</b><small>Renouvelées le mercredi</small></span>${wl?`<em>${wl}</em>`:''}</button>
   <div class="s8sep" aria-hidden="true"></div><small>Saison en cours</small>
   <button class="s8tab sea ${cat==='s'?'on':''}" data-act="qCat" data-c="s" aria-pressed="${cat==='s'}"><span class="s8seaic">${u8('flame')}</span><span><b>Saison ${n}</b><small>${esc(seaName())}</small></span>${sl?`<em>${sl}</em>`:''}</button></nav>`;
  let main;
  const dots=L=>`<div class="qdots">${L.map(q=>`<i class="${q.got?'on':q.p>=q.n?'ok':''}"></i>`).join('')}</div>`;
  if(cat==='w') main=`<section class="s8panel wk"><header>${u8('star')}<h3>Quêtes hebdomadaires</h3><span class="qtm" ${ttip('Renouvellement','Chaque mercredi à 6 h 00.')}>${uic('auto')}Mercredi 6 h 00 · dans ${qLeft(qNext(true)-Date.now())}</span></header>${dots(Q.w.list)}<div class="qls">${Q.w.list.map((q,i)=>qCard(q,true,i)).join('')}</div><p class="qnote">Récompenses jusqu’à la rareté Épique.</p></section>`;
  else if(cat==='s') main=viewSeaQ();
  else { const dAll=Q.d.list.every(q=>q.got),ch=Q.d.chest,dn=Q.d.list.filter(q=>q.got).length;
    const chest=`<div class="qchestrow ${dAll&&!ch?'ready':''} ${ch?'opened':''}"><button class="qchest" data-act="qChest" data-tip="qchest" ${dAll&&!ch?'':'aria-disabled="true"'}>${QCHEST_SVG}</button><span><b>Coffre du jour</b><small>${ch?'Déjà ouvert aujourd’hui.':dAll?'Prêt à être ouvert !':`${dn} / 5 quêtes récupérées`}</small></span>${dAll&&!ch?'<button class="qbtn" data-act="qChest">Ouvrir</button>':''}</div>`;
    main=`<section class="s8panel"><header>${u8('scroll')}<h3>Quêtes journalières</h3><span class="qtm" ${ttip('Renouvellement','Chaque jour à 6 h 00.')}>${uic('auto')}6 h 00 · dans ${qLeft(qNext(false)-Date.now())}</span></header>${dots(Q.d.list)}<div class="qls">${Q.d.list.map((q,i)=>qCard(q,false,i)).join('')}</div>${chest}</section>` }
  return `<div class="qwrap s8q"><div class="qhd"><h2>Quêtes</h2><span class="mute">${cat==='s'?'Quêtes valables toute la saison : coffres cosmétiques et lots d’artisanat.':'Récompenses : objets d’artisanat.'}</span></div><div class="s8qg">${side}<div class="s8main">${main}</div></div></div>`;
};
function seaBan(kick,title,txt,done,tot,lbl){ const l=seaLeft();
  return `<div class="s8ban"><div><span class="s8kick">${kick}</span><h3>${esc(title)}</h3><p>${txt}</p><div class="s8prog"><span>${lbl}</span><i><b style="width:${tot?done/tot*100:0}%"></b></i><b class="num">${done} / ${tot}</b></div></div><div class="s8end"><small>Fin de saison</small><b class="num">${l||'—'}</b>${l?`<small>le ${new Date(seaEnd()).toLocaleDateString('fr-FR',{day:'numeric',month:'long'})}</small>`:'<small>Date annoncée bientôt</small>'}</div></div>` }
function viewSeaQ(){
  sChMig(); const A=seaA(),G=SQ8(),all=G.flatMap(g=>g[2]),done=all.filter(q=>A.q[q.id]).length,CH=[0,1,2,3].map(schN);
  const rw=q=>q.rw[0]==='ch'?chIc8(q.rw[1],q.rw[2]||1):lotIc8(q.rw[1]);
  const row=q=>{const p=sqP(q),ok=p>=q.n,got=!!A.q[q.id];return `<div class="s8qi ${ok?'ok':''} ${got?'got':''}"><span class="qci">${u8(q.ic)}</span><div><b>${esc(q.t)}</b><small>${esc(q.s)}</small><div class="s8bar"><i style="width:${p/q.n*100}%"></i></div></div><div class="s8rw"><small class="num">${q.ev==='upmax'?'+'+p+' / +'+q.n:fmt(p)+' / '+fmt(q.n)}</small>${rw(q)}</div>${got?`<span class="qbtn got">${uic('check')}Récupéré</span>`:ok?`<button class="qbtn" data-act="sqClaim" data-id="${q.id}">Récupérer</button>`:'<span class="qbtn off">En cours</span>'}</div>`};
  return `${seaBan('Saison '+seaN(),seaName(),'Ces quêtes ne se renouvellent pas : elles restent jusqu’à la fin de la saison. Ce qui n’est pas terminé à la fin est perdu.',done,all.length,'Récupérées')}
   <div class="s8sq"><div>${G.map(([n,ic,L])=>`<section class="s8grp"><header>${u8(ic)}<b>${n}</b><small>${L.filter(q=>A.q[q.id]).length} / ${L.length}</small></header>${L.map(row).join('')}</section>`).join('')}</div>
   <aside class="s8aside"><div class="s8box"><h4>Coffres de saison</h4><p>Chaque coffre donne un cosmétique de la Saison ${seaN()}. Ils arrivent dans l’inventaire : clic droit dessus pour l’ouvrir. Survolez un coffre pour voir les chances.</p><div class="s8chl">${SRAR.map(([n,c],r)=>`<div class="${CH[r]?'':'none'}">${chIc8(r,1)}<span><b style="color:${c}">${n}</b><small>${CH[r]?`${CH[r]} à ouvrir`:'Aucun'}</small></span>${CH[r]?`<button class="qbtn" data-act="sChAsk" data-r="${r}">Ouvrir</button>`:''}</div>`).join('')}</div></div>
    <div class="s8box"><h4>Cosmétiques de la saison</h4><p><b class="num">${COS8.filter(k=>k.s===1&&cosOwn(k.id)).length} / ${COS8.filter(k=>k.s===1).length}</b> obtenus. Ils restent à vous après la saison.</p><button class="btn" data-act="s8Cust">${u8('brush')} Personnaliser ma carte</button></div>
    <div class="s8box"><h4>Trophées de saison</h4><p><b class="num">${SEA_TR().filter(t=>stroGot(t.id)).length} / ${SEA_TR().length}</b> obtenus. Ils restent dans votre collection après la saison.</p><button class="btn" data-act="s8Troph">${u8('trophy')} Voir les trophées</button></div></aside></div>`;
}
/* ---------- Trophées : catégorie Saison ---------- */
const _viewTroph0=viewTroph;
viewTroph=function(){ seaTrCheck();
  const sea=UI.trCat==='sea'; let h=_viewTroph0(); const n=seaN(),T=SEA_TR(),g=T.filter(t=>stroGot(t.id)).length;
  const btn=`<button role="tab" aria-selected="${sea}" class="${sea?'on':''} s8trb" data-act="trCat" data-c="sea">${u8('flame')}<span>Saison ${n}</span><em class="num">${g}/${T.length}</em></button>`;
  h=h.replace('<div class="masub" role="tablist">','<div class="masub" role="tablist">'+btn);
  if(!sea) return h;
  const i=h.indexOf('<section class="mtmain">'); if(i<0) return h;
  const card=t=>{const got=stroGot(t.id);let a=0,b=1;try{[a,b]=t.f()}catch(e){}; return `<div class="s8tri ${got?'got':''}"><span class="s8tb">${u8(t.ic)}</span><span class="s8tx"><b>${esc(t.n)}</b><small>${esc(t.d)}</small>${got?`<em class="mtdone">${uic('check')} Obtenu le ${new Date(ACC.stro[stroK(t.id)]).toLocaleDateString('fr-FR')}</em>`:`<div class="s8bar"><i style="width:${Math.min(1,a/b)*100}%"></i></div><small class="num">${fmt(Math.min(a,b))} / ${fmt(b)}</small>`}</span><em class="s8tp">${t.p} pts</em></div>`};
  const past={}; for(const k of Object.keys(ACC.stro||{})){ const [sn,id]=k.split(':'); if(+sn!==n) (past[sn]=past[sn]||[]).push(id) }
  const PT=Object.fromEntries(T.map(t=>[t.id,t]));
  const arch=Object.keys(past).sort((a,b)=>b-a).map(sn=>`<div class="s8arch">${u8('lock')}<span><b>Saison ${sn}</b> · terminée. Trophées obtenus : ${past[sn].map(id=>PT[id]?esc(PT[id].n):id).join(', ')}.</span></div>`).join('');
  return h.slice(0,i)+`<section class="mtmain">${seaBan('Trophées de saison','Saison '+n+' – '+seaName(),'Disponibles jusqu’à la fin de la saison. Une fois obtenus, ils restent dans votre collection et leurs points comptent dans vos points de trophées.',g,T.length,'Obtenus')}<div class="s8tr">${T.map(card).join('')}</div>${arch}</section></div>`;
};
/* ---------- Personnalisation ---------- */
const CU8=[['icon','people','Icône'],['fr','frame','Cadre de carte'],['orn','spark','Ornement'],['pf','eye','Cadre de portrait'],['bg','book','Arrière-plan'],['cfx','spark','Effet de carte'],['title','scroll','Titre'],['show','trophy','Trophées affichés'],null,['skin','helm','Apparence du héros'],['trail','auto','Traînée de carte'],['aura','flame','Aura de combat']];
function cosThumb(c,draft){
  const d=Object.assign({},cardMine(),draft||{});
  if(c.t==='orn') return `<div class="s8z" style="zoom:.24;padding:50px 70px 20px">${cardColl(Object.assign({},d,{orn:c.id,cfx:null}),'th'+c.id)}</div>`;
  if(c.t==='cfx') return `<div class="s8z" style="zoom:.24;padding:20px 40px">${cardColl(Object.assign({},d,{orn:null,cfx:c.id}),'th'+c.id)}</div>`;
  if(c.t==='pf') return `<span class="pf8 ${c.id}" style="--ps:64px">${pcIcon(d.icon,64)}${pfSvg(c.id)}</span>`;
  if(c.t==='bg') return `<div class="s8bgt">${SBG_SVG[c.bg]()}</div>`;
  if(c.t==='aura'){ const h=S&&S.heroes[0],s=h&&skinOf(h.cls,h.skin); return `<div class="s8aut">${auraHTML(c.id)}${s?`<img src="${s.src}" alt="">`:`<span class="ftmed"><img src="${h?PORTRAIT[h.cls]:''}" alt=""></span>`}</div>` }
  if(c.t==='trail'){ const T=TRAIL8[c.id]; return `<div class="s8trt">${Array.from({length:12},(_,i)=>`<i class="${T[2]}" style="--x:${8+i*5}%;--y:${50+Math.sin(i/1.8)*22}%;--z:${3+i*.7}px;--c:${i%2?T[0]:T[1]};opacity:${(.2+i/14).toFixed(2)}"></i>`).join('')}<span class="s8tc">${pcIcon(d.icon,34)}</span></div>` }
  return '' }
function pcCustom8(d){
  const c=pcDraft(),lk=pcLockedSel(c),dirty=JSON.stringify(c)!==JSON.stringify(pcClean(pcDef())),pts=trPts(),cat=UI.cu8||'orn',flt=UI.cu8f||'all';
  const tB=c.title&&TRK[c.title]?TRK[c.title].n:null;
  const pd=Object.assign({},d,{icon:c.icon,fr:c.fr,bg:c.bg,orn:c.orn,pf:c.pf,cfx:c.cfx,trail:c.trail,title:tB,show:(c.show||[]).filter(id=>TRK[id]).slice(0,3)});
  const cnt=k=>k==='skin'?skinsOf(S.heroes[0].cls).length:k==='icon'?PC_ICONS.length:k==='fr'?PC_FR.length:k==='bg'?PC_BG.length+3:k==='title'?TROPHIES.filter(t=>t.t).length:k==='show'?TROPHIES.filter(t=>trGot(t.id)).length:COS8.filter(x=>x.t===k).length;
  const hasS=k=>['orn','pf','bg','cfx','trail','aura'].includes(k);
  const nav=`<nav class="s8side cu8nav" aria-label="Catégories de personnalisation"><small>Carte</small>${CU8.map(e=>e?`<button class="s8tab ${cat===e[0]?'on':''}" data-act="cu8" data-c="${e[0]}" aria-pressed="${cat===e[0]}">${u8(e[1])}<span><b>${e[2]}</b><small>${cnt(e[0])} ${e[0]==='show'?'obtenus':'au total'}</small></span>${hasS(e[0])?`<em class="s1" ${ttip('Contient des cosmétiques de la Saison 1')}>S1</em>`:''}</button>`:'<div class="s8sep" aria-hidden="true"></div><small>Personnage</small>').join('')}</nav>`;
  let prev;
  if(cat==='skin'){ prev=skinPrev() }
  else if(cat==='aura'){ const h=S.heroes[0],s=skinOf(h.cls,h.skin),a=cosOk(c.aura); prev=`<div class="s8aup">${a?auraHTML(a):''}${s?`<img src="${s.src}" alt="">`:`<span class="ftmed"><img src="${PORTRAIT[h.cls]||''}" alt=""></span>`}</div><small class="s8pl">Aura en combat : ${a?esc(cosN(a)):'aucune'}</small>` }
  else prev=`<div class="pcview cu8pv"><div class="pcfit">${cardColl(pd,'cus')}</div></div><small class="s8pl">${[cosN(c.orn)&&'Ornement : '+cosN(c.orn),cosN(c.pf)&&'Portrait : '+cosN(c.pf),cosN(c.cfx)&&'Effet : '+cosN(c.cfx),cosN(c.trail)&&'Traînée : '+cosN(c.trail)].filter(Boolean).join(' · ')||'Carte sans cosmétique de saison'}</small>`;
  const tile=(on,lkd,thumb,n,s,act,sea,tip)=>`<button class="cu8it ${on?'on':''} ${lkd?'lk':''}" ${act} ${tip||''} aria-pressed="${on}">${sea?(sea==='duel'?'<span class="s8tag duel">Duel</span>':sea==='pro'?'<span class="s8tag pro">Prodige</span>':'<span class="s8tag">Saison 1</span>'):''}${lkd?uic('lock','lki'):''}<span class="cu8th">${thumb}</span><b>${n}</b><small>${s}</small></button>`;
  let items='',fil='';
  if(hasS(cat)&&cat!=='bg'){
    let L=COS8.filter(x=>x.t===cat); if(flt==='got') L=L.filter(x=>cosOwn(x.id)); if(flt==='lk') L=L.filter(x=>!cosOwn(x.id));
    fil=`<div class="cu8fil">${[['all','Tous'],['got','Obtenus'],['lk','Verrouillés']].map(([k,n])=>`<button class="${flt===k?'on':''}" data-act="cu8f" data-f="${k}">${n}</button>`).join('')}</div>`;
    items=(flt==='lk'?'':cu8Grp('Base',tile(!c[cat],false,`<span class="cu8none">${uic('xx')}</span>`,'Aucun',COS_T[cat],`data-act="pcSet" data-k="${cat}" data-v=""`,false)))+cu8Groups(L,x=>{const o=cosOwn(x.id);return tile(c[cat]===x.id,!o,cosThumb(x,{icon:c.icon,fr:c.fr,bg:c.bg,pf:cat==='orn'?c.pf:null}),esc(x.n),`<span style="color:${SRAR[x.r][1]}">${SRAR[x.r][0]}</span> · ${c[cat]===x.id?'Équipé':o?'Obtenu':cosSrc(x)}`,`data-act="pcSet" data-k="${cat}" data-v="${x.id}"`,cosTag(x),`data-tip="s8:cos:${x.id}"`)});
  } else if(cat==='bg'){
    items=cu8Grp('Base',PC_BG.map(([i,n,ok])=>tile(c.bg===i,!ok(),`<span class="s8bgt">${zoneScene(i,'o'+i)}</span>`,esc(n),ok()?'Débloqué':'Verrouillé',`data-act="pcSet" data-k="bg" data-v="${i}"`,false,`data-tip="pc:bg:${i}"`)).join(''))
     +cu8Groups(COS8.filter(x=>x.t==='bg'),x=>{const o=cosOwn(x.id);return tile(c.bg===x.bg,!o,cosThumb(x),esc(x.n),`<span style="color:${SRAR[x.r][1]}">${SRAR[x.r][0]}</span> · ${o?'Obtenu':cosSrc(x)}`,`data-act="pcSet" data-k="bg" data-v="${x.bg}"`,cosTag(x),`data-tip="s8:cos:${x.id}"`)});
  } else if(cat==='skin') items=skinTiles(tile);
  else if(cat==='icon') items=cu8Grp('Base',PC_ICONS.map(([ic,need],i)=>tile(c.icon===ic,pts<need,pcIcon(ic,56),ic.startsWith('c:')?'Portrait : '+(CLASSES[ic.slice(2)]||{n:''}).n:'Emblème',need?need+' points':'De base',`data-act="pcSet" data-k="icon" data-v="${ic}"`,false,`data-tip="pc:icon:${i}"`)).join(''));
  else if(cat==='fr'){ const FR2=PC_FR.map((F,i)=>[F,i]); const fT=([[n,col,need,fx,lt],i])=>tile(c.fr===i,!pcFrOk(i),`<span class="pcfr ${fx?'fxs':''}" style="--c:${col};--fr:${col};--fl:${lt||col}" data-fx="${fx||''}"></span>`,esc(n),need==null?'Relique':need?need+' points':'De base',`data-act="pcSet" data-k="fr" data-v="${i}"`,false,`data-tip="pc:fr:${i}"`); items=cu8Grp('Base',FR2.filter(([F])=>F[2]!=null).map(fT).join(''))+cu8Grp('Reliques',FR2.filter(([F])=>F[2]==null).map(fT).join('')) }
  else if(cat==='title'){ const titles=TROPHIES.filter(t=>t.t); items=`<div class="cu8wide"><select class="pcsel" id="pctitle" aria-label="Titre"><option value="">Aucun titre</option>${titles.map(t=>`<option value="${t.id}" ${c.title===t.id?'selected':''}>${trGot(t.id)?'':'🔒 '}${esc(t.n)}</option>`).join('')}</select><small class="mute">Les titres se débloquent avec les trophées marqués « Titre ».</small></div>` }
  else if(cat==='show'){ const got=TROPHIES.filter(t=>trGot(t.id)); items=`<div class="cu8wide"><p class="mute">${(c.show||[]).length} / 3 affichés sur la carte.</p><div class="pcopt">${got.length?got.map(t=>`<button class="pcts ${(c.show||[]).includes(t.id)?'on':''}" data-act="pcShow" data-id="${t.id}" data-tip="pc:tr:${t.id}" aria-pressed="${(c.show||[]).includes(t.id)}"><span class="mtti sm ${trTier(t)}">${uic(trIc(t))}</span></button>`).join(''):'<small class="mute">Obtenez des trophées pour les afficher sur votre carte.</small>'}</div></div>` }
  const save=`<div class="pcsave cu8save">${lk.length?`<p class="pcwarn">${uic('lock')} Non débloqué : ${lk.map(esc).join(', ')}.</p>`:''}<div class="row"><button class="btn" data-act="pcReset" ${dirty?'':'disabled'}>Annuler</button><button class="btn pri" data-act="pcConfirm" ${dirty&&!lk.length?'':'disabled'}>Confirmer</button></div></div>`;
  return `<div class="cu8">${nav}<div class="cu8prev"><small class="s8pl">Aperçu${dirty?' · non enregistré':''}</small>${prev}</div><div class="cu8r">${fil}<div class="cu8grid">${items}</div>${save}</div></div>`;
}
const _qEv0=qEv; qEv=function(ev,n=1){ _qEv0(ev,n); try{ sEv(ev,n) }catch(e){} };
