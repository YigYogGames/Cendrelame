/* Cendrelame · systems/marche-et-stockage.js */
/* ================= 0.8.5 : Place du marché, Hôtel des ventes, Maroquinier ================= */
UIC.scale=UIC.scale||'<path d="M12 3v18M6 21h12M4 7h16M7 7l-3 7h6zM17 7l-3 7h6z"/>';
UIC.back=UIC.back||'<path d="M15 5l-7 7 7 7"/>';
/* ---------- améliorations de stockage (compte) ---------- */
const STG85={
 bag:{n:'Sac agrandi',ic:'bag',d:'+1 rangée de 14 cases dans l’inventaire de tous vos personnages.',cost:[[25000],[80000,'ru_anc'],[200000,'ru_pri']]},
 craft:{n:'Sacoche d’artisanat',ic:'anvil',cap:[0,8,16,24],d:'Range à part les objets d’artisanat : poudre, essences, runes, pierres, parchemins, bonus de réussite, prismes.',cost:[[15000],[50000,'ru_maj'],[120000,'ru_anc']]},
 pot:{n:'Ceinture de potions',ic:'flask',cap:[0,6,12],d:'Range à part toutes les potions (vie, régénération, force, action…).',cost:[[20000],[60000,'ru_maj']]},
 comp:{n:'Besace du dresseur',ic:'paw',cap:[0,8,16],d:'Range à part les objets de Compagnon : tickets, nourriture, pierres d’évolution, objets portés.',cost:[[15000],[45000,'ru_maj']]}};
const POUCH_K=['craft','pot','comp'];
const stgLv=k=>Math.max(0,Math.min(STG85[k].cost.length,((ACC&&ACC.stg)||{})[k]||0));
/* 0.8.16 : le Sac agrandi est retiré, le sac reste à 14 × 5 cases (achats remboursés : voir stgRefund) */
function stgSync(){ GH=5; BAG=GW*GH }
stgSync();
const stgCost=k=>{ const c=STG85[k].cost[stgLv(k)]; if(!c) return null; const o={gold:c[0]}; if(c[1]) o[c[1]]=1; return o };
/* ---------- sacoches : contenu par personnage ---------- */
const pouchCat=k=>{ if(!k) return null; if(/^c[tfsw]_/.test(k)) return 'comp'; if(POTS[k]&&/^p_/.test(k)) return 'pot'; if(k==='prisme'||(NEWI[k]&&!/^c[tfsw]_/.test(k))) return 'craft'; return null };
const pouchCap=c=>STG85[c].cap[stgLv(c)]||0;
const pouchOf=c=>{ if(!S) return {}; S.pouch=S.pouch||{}; return S.pouch[c]=S.pouch[c]||{} };
const pouchUsed=c=>Object.values(pouchOf(c)).reduce((a,n)=>a+Math.ceil(n/STACK),0);
const pouchN=k=>{ const c=pouchCat(k); return c&&S&&S.pouch&&S.pouch[c]&&S.pouch[c][k]||0 };
function pouchRoom(k){ const c=pouchCat(k); if(!c||!S) return 0; const cap=pouchCap(c); if(!cap) return 0; const P=pouchOf(c),have=P[k]||0,part=have%STACK?STACK-have%STACK:0; return part+Math.max(0,cap-pouchUsed(c))*STACK }
let POUCH_SKIP=false;
function pouchPut(k,n){ if(POUCH_SKIP||n<=0) return n; const c=pouchCat(k); if(!c) return n; const r=Math.min(n,pouchRoom(k)); if(r>0){ const P=pouchOf(c); P[k]=(P[k]||0)+r } return n-r }
function pouchTake(k,n){ const c=pouchCat(k); if(!c||!S||!S.pouch||!S.pouch[c]) return n; const P=S.pouch[c],m=Math.min(P[k]||0,n); if(m>0){ P[k]-=m; if(P[k]<=0) delete P[k] } return n-m }
function pouchSweep(silent){ if(!S) return 0; let moved=0;
  for(const e of S.bag.slice()){ const k=e.o.mat; if(!k||!pouchCat(k)||!pouchCap(pouchCat(k))) continue; const left=pouchPut(k,e.o.n); moved+=e.o.n-left; e.o.n=left }
  S.bag=S.bag.filter(e=>!(e.o.mat&&e.o.n<=0)); if(moved&&!silent) toast(`${fmt(moved)} objet${moved>1?'s':''} rangé${moved>1?'s':''} dans les sacoches.`); return moved }
function pouchOut(c,k){ const P=pouchOf(c),n=P[k]||0; if(!n) return; const m=Math.min(STACK,n); POUCH_SKIP=true; const left=bagAddMat(S.bag,k,m); POUCH_SKIP=false; const mv=m-left; if(!mv){ toast('Pas de place dans le sac.'); return } P[k]-=mv; if(P[k]<=0) delete P[k]; save(); renderInvPop(); toast(`${fmt(mv)} ${MAT_OBJ[k]||k} remis dans le sac.`) }
function stgBuy(k){ const S2=STG85[k],c=stgCost(k); if(!c){ toast('Niveau maximum atteint.'); return } if(!canPay(c)){ toast('Pas assez de ressources.'); return }
  pay(c); ACC.stg=ACC.stg||{}; ACC.stg[k]=stgLv(k)+1; if(k==='bag') stgSync(); saveAcc(); const mv=k==='bag'?0:pouchSweep(true); save(); renderHeader&&renderHeader(); render();
  toast(`${S2.n} : niveau ${ACC.stg[k]} !${k==='bag'?` Votre sac passe à ${BAG} cases.`:` ${pouchCap(k)} piles disponibles${mv?`, ${fmt(mv)} objets déjà rangés`:''}.`}`) }
const pIc=k=>`<svg class="mfi" viewBox="0 0 24 24">${MI[k]||''}</svg>`;
const pTip=k=>POTS[k]&&/^p_/.test(k)?'pot:'+k:'nw:'+k;
function pouchPanel(){ const own=POUCH_K.filter(c=>pouchCap(c));
  if(!own.length) return `<section class="pch85"><header>${uic('bag')}<b>Sacoches</b><small class="mute">Aucune sacoche. Achetez-en chez le Maroquinier (Marchand → Place du marché).</small></header></section>`;
  if(!own.includes(UI.pchT)) UI.pchT=own[0]; const c=UI.pchT,P=pouchOf(c),cap=pouchCap(c),cells=[];
  for(const [k,n] of Object.entries(P).sort((a,b)=>nwR(a[0])-nwR(b[0])||a[0].localeCompare(b[0]))){ let r=n; while(r>0){ const m=Math.min(STACK,r); cells.push(`<button class="pchc" style="--rc:var(--r${nwR(k)})" data-act="pchOut" data-c="${c}" data-k="${k}" data-tip="${pTip(k)}" aria-label="${esc(MAT_OBJ[k]||k)} : ${m}">${POTS[k]&&/^p_/.test(k)?matIcon(k):pIc(k)}<em class="num">${m}</em></button>`); r-=m } }
  while(cells.length<cap) cells.push('<span class="pchc e"></span>');
  return `<section class="pch85"><header>${uic('bag')}<b>Sacoches</b><span class="pchtabs">${own.map(x=>`<button class="${x===c?'on':''}" data-act="pchTab" data-c="${x}">${uic(STG85[x].ic)}${STG85[x].n} <small class="num">${pouchUsed(x)}/${pouchCap(x)}</small></button>`).join('')}</span></header>
   <div class="pchg">${cells.join('')}</div><div class="pchf"><small class="mute">Les objets compatibles y vont automatiquement. Cliquez sur une pile pour la remettre dans le sac.</small><button class="btn sm" data-act="pchSweep" ${ttip('Ranger le sac','Déplace dans les sacoches tous les objets compatibles de l’inventaire.')}>Ranger le sac</button></div></section>` }
/* ---------- décors de la Place du marché ---------- */
const SHB={};
function shopBg(k,id){ const key=k+id; if(SHB[key]) return SHB[key]; const g=s=>`${s}${id}`;
  const lamp=(x,y,s=1)=>`<g transform="translate(${x} ${y}) scale(${s})"><circle r="46" fill="url(#${g('lg')})"/><path d="M0 -26v10" stroke="#2a1a0c" stroke-width="2"/><path d="M-8 -16h16l-3 22h-10z" fill="#ffcf6a" stroke="#3a2210" stroke-width="2"/><path d="M-9 -16h18M-6 6h12" stroke="#3a2210" stroke-width="3"/></g>`;
  const defs=`<defs><radialGradient id="${g('lg')}"><stop offset="0" stop-color="#ffcf6a" stop-opacity=".55"/><stop offset="1" stop-color="#ffcf6a" stop-opacity="0"/></radialGradient>`;
  let body='';
  if(k==='m'){ /* marché à la tombée du jour */
    const aw=(x,w,c1,c2)=>{ let st=''; for(let i=0;i<w/30;i++) st+=`<path d="M${x+i*30} 190h30l-4 34q-11 10-22 0z" fill="${i%2?c2:c1}"/>`; return st };
    const stall=(x,c1,c2,goods)=>`<rect x="${x+6}" y="190" width="10" height="180" fill="#3a2414"/><rect x="${x+224}" y="190" width="10" height="180" fill="#3a2414"/><path d="M${x-6} 190L${x+20} 150h200l26 40z" fill="${c1}" stroke="#1a0c06" stroke-width="3"/>${aw(x,240,c1,c2)}<rect x="${x}" y="300" width="240" height="70" rx="4" fill="#5a3a1e" stroke="#1a0c06" stroke-width="3"/><path d="M${x} 314h240" stroke="#7a5230" stroke-width="4"/>${goods}`;
    const bottles=x=>[0,1,2,3,4,5].map(i=>`<g transform="translate(${x+22+i*34} 270)"><rect x="-7" y="-4" width="14" height="30" rx="6" fill="${['#e0503a','#3aa860','#4a90e0','#d9b81f','#a070f0','#e0503a'][i]}" stroke="#1a0c06" stroke-width="2"/><rect x="-3" y="-12" width="6" height="9" fill="#c9a36a"/></g>`).join('');
    const crates=x=>`<rect x="${x+20}" y="262" width="56" height="38" fill="#8a5a2e" stroke="#1a0c06" stroke-width="2.5"/><path d="M${x+20} 281h56M${x+48} 262v38" stroke="#5a3a1e" stroke-width="2"/><circle cx="${x+120}" cy="282" r="18" fill="#e8a13a" stroke="#1a0c06" stroke-width="2"/><circle cx="${x+150}" cy="286" r="14" fill="#c0461a" stroke="#1a0c06" stroke-width="2"/><circle cx="${x+176}" cy="284" r="16" fill="#8ab03a" stroke="#1a0c06" stroke-width="2"/><path d="M${x+196} 300q4-34 20-34q16 0 20 34z" fill="#c8a870" stroke="#1a0c06" stroke-width="2"/>`;
    const rolls=x=>[0,1,2,3].map(i=>`<rect x="${x+18+i*54}" y="${250+(i%2)*8}" width="44" height="${50-(i%2)*8}" rx="6" fill="${['#7b2a1a','#2a5a8a','#d9b81f','#3a7a4a'][i]}" stroke="#1a0c06" stroke-width="2"/>`).join('');
    body=`${defs}<linearGradient id="${g('sk')}" x2="0" y2="1"><stop offset="0" stop-color="#2a1a3a"/><stop offset=".55" stop-color="#a0483a"/><stop offset="1" stop-color="#f0a85a"/></linearGradient></defs>
     <rect width="1000" height="420" fill="url(#${g('sk')})"/><circle cx="760" cy="150" r="40" fill="#ffd99a" opacity=".55"/>
     <path d="M0 210V140h40v-30l20-20 20 20v30h50v-40h60v60h40v-70l30-30 30 30v70h60v-50h40l20-30 20 30v50h70v-30h40v-40l26-26 26 26v40h60v40h50v-60h40v60h60v80z" fill="#3a2030"/>
     ${[60,220,410,590,780,930].map(x=>`<rect x="${x}" y="150" width="10" height="14" fill="#ffcf6a" opacity=".7"/>`).join('')}
     <path d="M0 330q250-20 500 0t500 0V420H0z" fill="#6a4a32"/><g fill="#5a3c26" opacity=".7">${Array.from({length:40},(_,i)=>`<ellipse cx="${(i*53)%1000}" cy="${345+(i*17)%70}" rx="18" ry="6"/>`).join('')}</g>
     ${stall(30,'#b8322a','#f0e2c0',bottles(30))}${stall(380,'#2a5a8a','#f0e2c0',crates(380))}${stall(730,'#3a7a4a','#f0e2c0',rolls(730))}
     <path d="M0 120Q250 175 500 125T1000 120" stroke="#2a1a0c" stroke-width="2" fill="none"/>${[90,260,500,740,910].map((x,i)=>`<path d="M${x} ${126+[12,22,0,22,4][i]}l-14 26h28z" fill="${['#e8c060','#b8322a','#2a5a8a','#e8c060','#3a7a4a'][i]}"/>`).join('')}
     ${lamp(350,215,.9)}${lamp(700,215,.9)}`;
  } else if(k==='h'){ /* salle des enchères */
    const col=x=>`<rect x="${x}" y="40" width="46" height="330" fill="#4a2c1a"/><rect x="${x-8}" y="30" width="62" height="18" fill="#6a4226"/><rect x="${x-8}" y="356" width="62" height="18" fill="#6a4226"/><path d="M${x+12} 50v300M${x+34} 50v300" stroke="#3a2010" stroke-width="3"/>`;
    const win=x=>`<path d="M${x} 300V140a60 60 0 0 1 120 0v160z" fill="#ffcf8a" opacity=".85"/><path d="M${x+60} 80v220M${x} 200h120" stroke="#3a2010" stroke-width="6"/><path d="M${x} 300V140a60 60 0 0 1 120 0v160z" fill="none" stroke="#3a2010" stroke-width="8"/>`;
    const ban=x=>`<path d="M${x} 60h70v150l-35-24-35 24z" fill="#8a1a1a" stroke="#e8c060" stroke-width="3"/><circle cx="${x+35}" cy="120" r="18" fill="#e8c060" stroke="#5a3a10" stroke-width="2"/><path d="M${x+28} 120h14M${x+35} 112v16" stroke="#5a3a10" stroke-width="3"/>`;
    const ped=(x,it)=>`<rect x="${x-26}" y="300" width="52" height="70" fill="#5a3a20" stroke="#1a0c06" stroke-width="2.5"/><rect x="${x-34}" y="292" width="68" height="12" fill="#7a5230" stroke="#1a0c06" stroke-width="2"/><circle cx="${x}" cy="262" r="34" fill="url(#${g('lg')})"/>${it}`;
    body=`${defs}<linearGradient id="${g('wl')}" x2="0" y2="1"><stop offset="0" stop-color="#1e120c"/><stop offset="1" stop-color="#3a2416"/></linearGradient></defs>
     <rect width="1000" height="420" fill="url(#${g('wl')})"/>${win(150)}${win(730)}${col(90)}${col(330)}${col(624)}${col(864)}${ban(410)}${ban(520)}
     <path d="M0 370h1000v50H0z" fill="#2a160c"/><path d="M260 420L330 370h340l70 50z" fill="#7a1a1a"/><path d="M300 400h400" stroke="#e8c060" stroke-width="2" opacity=".6"/>
     <path d="M440 370V250h120v120z" fill="#6a4226" stroke="#1a0c06" stroke-width="3"/><path d="M425 250h150l-10-20H435z" fill="#8a5a32" stroke="#1a0c06" stroke-width="3"/><circle cx="500" cy="300" r="20" fill="#e8c060" stroke="#5a3a10" stroke-width="3"/>
     <g transform="translate(540 214) rotate(-25)"><rect x="-4" y="0" width="8" height="34" fill="#5a3a1e"/><rect x="-16" y="-10" width="32" height="14" rx="4" fill="#8a5a32" stroke="#1a0c06" stroke-width="2"/></g>
     ${ped(230,'<path d="M230 290V226M222 238h16" stroke="#dfe5ee" stroke-width="5" stroke-linecap="round"/>')}${ped(780,'<path d="M780 232l22 8v18c0 14-10 24-22 30-12-6-22-16-22-30v-18z" fill="#2a5a8a" stroke="#e8c060" stroke-width="3"/>')}${ped(940,'<path d="M940 236l14 16-14 30-14-30z" fill="#a070f0" stroke="#fff" stroke-width="2"/>')}
     <g transform="translate(500 20)"><path d="M0 0v30" stroke="#2a1a0c" stroke-width="3"/><path d="M-80 42q80 30 160 0" stroke="#c89a3a" stroke-width="5" fill="none"/><circle cx="0" cy="40" r="90" fill="url(#${g('lg')})"/>${[-80,-40,0,40,80].map(x=>`<path d="M${x} 42v-12" stroke="#ffcf6a" stroke-width="5"/>`).join('')}</g>
     <g fill="#e8c060">${[[60,392],[90,400],[960,396],[930,404],[600,396]].map(([x,y])=>`<ellipse cx="${x}" cy="${y}" rx="12" ry="5"/>`).join('')}</g>`;
  } else { /* atelier du maroquinier */
    const bag=(x,y,c,s=1)=>`<g transform="translate(${x} ${y}) scale(${s})"><path d="M-30 0q0-30 30-30t30 30" stroke="#3a2010" stroke-width="5" fill="none"/><rect x="-36" y="0" width="72" height="56" rx="12" fill="${c}" stroke="#1a0c06" stroke-width="3"/><path d="M-36 18h72" stroke="#1a0c06" stroke-width="2"/><rect x="-8" y="12" width="16" height="14" rx="3" fill="#e8c060" stroke="#1a0c06" stroke-width="2"/></g>`;
    const hide=(x,c)=>`<path d="M${x} 70q30 10 60 0q-6 30 4 60q-10 40-4 80q-30-12-60 0q6-40-4-80q10-30 4-60z" fill="${c}" stroke="#1a0c06" stroke-width="3"/><path d="M${x+30} 50v22" stroke="#2a1a0c" stroke-width="3"/>`;
    body=`${defs}<pattern id="${g('br')}" width="60" height="30" patternUnits="userSpaceOnUse"><rect width="60" height="30" fill="#5a2e1e"/><path d="M0 0h60M0 15h60M30 0v15M0 15v15M60 15v15" stroke="#3a1a10" stroke-width="3"/></pattern></defs>
     <rect width="1000" height="420" fill="url(#${g('br')})"/><rect width="1000" height="420" fill="#140804" opacity=".35"/>
     <rect x="660" y="60" width="180" height="150" fill="#ffd08a" opacity=".8"/><path d="M750 60v150M660 135h180" stroke="#3a2010" stroke-width="8"/><rect x="660" y="60" width="180" height="150" fill="none" stroke="#3a2010" stroke-width="10"/>
     ${[60,230].map(y=>`<rect x="20" y="${y+100}" width="420" height="12" fill="#7a5230" stroke="#1a0c06" stroke-width="2"/>`).join('')}
     ${bag(80,110,'#8a4a22')}${bag(180,116,'#5a3a1e',.85)}${bag(280,110,'#a0602e')}${bag(380,118,'#6a2a1a',.8)}${bag(110,272,'#3a5a3a',.9)}${bag(230,270,'#8a4a22')}${bag(350,276,'#2a3a5a',.8)}
     ${hide(480,'#a8703a')}${hide(560,'#8a5028')}${hide(880,'#c08a50')}
     <path d="M0 370h1000v50H0z" fill="#2a160c"/><rect x="470" y="300" width="500" height="22" fill="#8a5a32" stroke="#1a0c06" stroke-width="3"/><rect x="500" y="322" width="16" height="50" fill="#5a3a1e"/><rect x="920" y="322" width="16" height="50" fill="#5a3a1e"/>
     <circle cx="560" cy="290" r="12" fill="#c0461a" stroke="#1a0c06" stroke-width="2"/><circle cx="590" cy="292" r="10" fill="#e8c060" stroke="#1a0c06" stroke-width="2"/><path d="M640 298l60-14" stroke="#dfe5ee" stroke-width="4" stroke-linecap="round"/><path d="M740 298q30-30 60 0z" fill="#a0602e" stroke="#1a0c06" stroke-width="2"/><path d="M830 298l40-20" stroke="#cfd6e0" stroke-width="3"/>
     ${lamp(620,230,1)}`;
  }
  return SHB[key]=`<svg class="zscene shbg" viewBox="0 0 1000 420" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${body}</svg>` }
/* ---------- Place du marché ---------- */
const _viewShop85=viewShop;
const shGold=()=>`<span class="shgold">${matIcon('gold')}<b class="num">${fmt(S.gold)}</b></span>`;
const ahOn=()=>(UI.tab==='comm'&&UI.commT==='ah')||(UI.tab==='shop'&&UI.shopSub==='h');
{ const i=COMM_T.findIndex(x=>x[0]==='ah'); if(i>=0) COMM_T.splice(i,1) }
function shopHub(){ const pv=['p_vie1','p_vie','p_vie3'].reduce((a,k)=>a+matAll(k),0),own=POUCH_K.filter(c=>pouchCap(c)).length;
  const ahN=AH.list?AH.list.filter(x=>x.state==='open'&&x.end>Date.now()).length:null,mine=AH.mine?AH.mine.filter(x=>x.state==='open').length:null;
  if(FB.user&&AH.list==null&&!AH.busy) setTimeout(()=>ahLoad(),0);
  const card=(k,i,n,d,li,b)=>`<button class="shcard" data-act="shopSub" data-s="${k}">${shopBg(k,'c')}<span class="shci">${uic(i)}</span><h3>${n}</h3><p>${d}</p><ul>${li.map(([a,v])=>`<li><span>${a}</span><b>${v}</b></li>`).join('')}</ul><span class="btn pri amgo">${b}</span></button>`;
  return `<div class="shop85"><div class="shbar"><h2>Place du marché</h2><span class="mute">Choisissez une échoppe.</span>${shGold()}</div><div class="shhub">
   ${card('m','coin','Marchand','Potions, coffres de cosmétiques, fournitures d’enchantement et de Compagnon.',[['Objets en vente',Object.keys(POTS).length],['Potions de vie possédées',fmt(pv)]],'Entrer chez le Marchand')}
   ${card('h','scale','Hôtel des ventes','Achetez et vendez de l’équipement entre joueurs. Les objets achetés arrivent par la messagerie.',[['Objets en vente',FB.user?(ahN==null?'…':fmt(ahN)):'hors ligne'],['Vos ventes en cours',FB.user?(mine==null?'…':fmt(mine)):'—']],'Entrer à l’Hôtel des ventes')}
   ${card('s','bag','Maroquinier','Achetez des sacoches pour ranger à part l’artisanat, les potions et le Compagnon.',[['Sac',`${BAG} cases`],['Sacoches',`${own} / 3`]],'Entrer chez le Maroquinier')}</div></div>` }
const shBar=(t,d)=>`<div class="shbar"><button class="btn" data-act="shopSub" data-s="hub" ${ttip('Place du marché','Revenir aux trois échoppes.')}>${uic('back')} Place du marché</button><h2>${t}</h2><span class="mute">${d}</span>${shGold()}</div>`;
function stgRow(k){ const S2=STG85[k],lv=stgLv(k),mx=S2.cost.length,c=stgCost(k),pouch=!!S2.cap;
  const now=pouch?(lv?`${S2.cap[lv]} piles`:'Aucune'):`${GW*(5+lv)} cases`,nx=lv<mx?(pouch?`${S2.cap[lv+1]} piles`:`${GW*(6+lv)} cases`):null;
  return `<div class="shup"><span class="shupi">${uic(S2.ic)}</span><span><b>${S2.n}</b><p>${S2.d}</p><span class="shpips">${Array.from({length:mx},(_,i)=>`<i class="${i<lv?'on':''}"></i>`).join('')}</span> <span class="shar">${nx?`${now} → ${nx}`:`${now} · niveau maximum`}</span></span>
   <span class="shbuy">${c?`<span class="shpr">${costHTML(c)}</span><button class="btn pri" data-act="stgBuy" data-k="${k}" ${canPay(c)?'':'disabled'}>${lv?'Améliorer':'Acheter'}</button>`:'<span class="shmax">Maximum</span>'}</span></div>` }
function bagViz85(){ const lv=stgLv('bag'),occ=occGrid(S.bag,null,GW,GH); let h='';
  for(let r=0;r<8;r++){ if(r===5) h+=`<span class="shvr">${uic('lock')} Rangées du Sac agrandi (+14 cases chacune)</span>`; for(let c=0;c<GW;c++){ const own=r<5+lv; h+=`<i class="${own?(occ[r]&&occ[r][c]>=0?'f':'u'):r===5+lv?'lk nx':'lk'}"></i>` } }
  return `<div class="shbag">${h}</div>` }
function pouchViz85(c){ const cap=pouchCap(c),P=pouchOf(c),L=[]; for(const [k,n] of Object.entries(P)){ let r=n; while(r>0){ const m=Math.min(STACK,r); L.push(`<span data-tip="${pTip(k)}">${POTS[k]&&/^p_/.test(k)?matIcon(k):pIc(k)}<em>${m}</em></span>`); r-=m } }
  const max=STG85[c].cap[STG85[c].cap.length-1]; while(L.length<max) L.push(`<span class="${L.length<cap?'':'lk'}"></span>`); return `<div class="shpouch">${L.join('')}</div>` }
function shopStorage(){ const lv=stgLv('bag'),c=UI.shPch&&POUCH_K.includes(UI.shPch)?UI.shPch:'craft';
  return `<div class="shop85">${shBar('Maroquinier','Améliorations pour tout le compte : elles servent à tous vos personnages.')}<div class="shsub">
   <section class="shshelf shfull">${shopBg('s','sh1')}<div class="shsin"><h3>${uic('anvil')} Sacoches</h3><p class="mute">Hors du sac : les objets compatibles y sont rangés automatiquement, et restent utilisables partout (Forge, combat, Compagnon…).</p>
    <div class="shpt">${POUCH_K.map(x=>`<button class="${x===c?'on':''}" data-act="shPch" data-c="${x}">${uic(STG85[x].ic)}${STG85[x].n}<small class="num">${pouchCap(x)?pouchUsed(x)+' / '+pouchCap(x):'—'}</small></button>`).join('')}</div>${pouchViz85(c)}
    ${POUCH_K.map(stgRow).join('')}</div></section></div></div>` }
viewShop=function(){ const s=UI.shopSub||'hub';
  if(s==='m') return `<div class="shop85">${shBar('Marchand','Les prix augmentent avec votre niveau.')}${_viewShop85()}</div>`;
  if(s==='h') return `<div class="shop85">${shBar('Hôtel des ventes','Achetez et vendez de l’équipement entre joueurs. Les objets achetés arrivent par la messagerie.')}<div class="shah">${viewAH()}</div></div>`;
  if(s==='s') return shopStorage();
  return shopHub() };
