/* Cendrelame · systems/quetes.js */
/* ===================== 0.5.0 : QUÊTES ===================== */
const Q_DAY_H=6;
const qShift=()=>new Date(Date.now()-Q_DAY_H*3600e3);
const qDay=()=>{const d=qShift();return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()};
const qWeek=()=>{const d=qShift(),back=(d.getDay()-3+7)%7,w=new Date(d.getFullYear(),d.getMonth(),d.getDate()-back);return w.getFullYear()+'-'+(w.getMonth()+1)+'-'+w.getDate()};
const qNext=week=>{const n=new Date(),t=new Date(n.getFullYear(),n.getMonth(),n.getDate(),Q_DAY_H,0,0); if(t<=n) t.setDate(t.getDate()+1); if(week) while(t.getDay()!==3) t.setDate(t.getDate()+1); return t.getTime()};
const qLeft=ms=>{const m=Math.max(0,Math.round(ms/60000)),d=Math.floor(m/1440),h=Math.floor(m%1440/60),mm=m%60;return d?`${d} j ${h} h`:h?`${h} h ${String(mm).padStart(2,'0')}`:`${mm} min`};
function qRng(seed){ let h=2166136261; for(const ch of String(seed)){ h^=ch.charCodeAt(0); h=Math.imul(h,16777619) } return ()=>{ h+=0x6D2B79F5; let t=h; t=Math.imul(t^t>>>15,t|1); t^=t+Math.imul(t^t>>>7,t|61); return ((t^t>>>14)>>>0)/4294967296 } }
const qHas=()=>S&&S.heroes&&S.heroes[0];
const raidOk=R=>qHas()&&S.heroes[0].lvl>=R.req;
const Q_D=[
 {k:'adv_kill',ic:'swords',ev:'kill',n:[15,25,40],t:n=>`Vaincre ${n} ennemis en Aventure`},
 {k:'adv_win',ic:'play',ev:'advwin',n:[5,8,12],t:n=>`Remporter ${n} combats en Aventure`},
 {k:'adv_boss',ic:'skull',ev:'boss',n:[1],t:()=>'Vaincre un boss de zone',ok:()=>S.prog&&(S.prog.zone>0||S.prog.stage>=10)},
 {k:'hard',ic:'flag',ev:'hardwin',n:[1,3],t:n=>n>1?`Gagner ${n} combats en Héroïque ou Mythique`:'Gagner un combat en Héroïque ou Mythique',ok:()=>heroOpen()},
 ...RAIDS.map(R=>({k:'rf_'+R.id,ic:'skull',ev:'raidf:'+R.id,n:[3,5],t:n=>`Combattre ${n} fois ${R.n}`,ok:()=>raidOk(R)})),
 {k:'raid_win',ic:'trophy',ev:'raidwin',n:[1],t:()=>'Gagner un défi',ok:()=>RAIDS.some(raidOk)},
 {k:'duel',ic:'people',ev:'duel',n:[1,2],t:n=>n>1?`Défier ${n} joueurs en duel`:'Défier un joueur en duel',ok:()=>!!FB.user},
 {k:'mine',ic:'paw',ev:'cexp',n:[1,2],t:n=>n>1?`Réussir ${n} expéditions de compagnon`:'Réussir une expédition de compagnon',ok:()=>!!(ACC.comp&&ACC.comp.list.length)},
 {k:'up',ic:'anvil',ev:'up',n:[1,2,3],t:n=>n>1?`Améliorer un objet ${n} fois (pierre de renforcement)`:'Améliorer un objet une fois (pierre de renforcement)'},
 {k:'ench',ic:'spark',ev:'ench',n:[1,2],t:n=>n>1?`Créer ${n} parchemins à l’Enchantement`:'Créer un parchemin à l’Enchantement'},
 {k:'drink',ic:'flask',ev:'drink',n:[1],t:()=>'Boire une potion de bonus (savoir ou fortune)'},
 {k:'recycle',ic:'recycle',ev:'recycle',n:[3,5],t:n=>`Recycler ${n} objets`}];
const Q_W=[
 {k:'w_tier',ic:'skull',ev:'raidwin',n:[3,5],t:n=>`Terminer ${n} paliers de défis`,ok:()=>RAIDS.some(raidOk)},
 {k:'w_duel',ic:'trophy',ev:'duelwin',n:[3,5,8],t:n=>`Gagner ${n} duels`,ok:()=>!!FB.user},
 {k:'w_aff',ic:'spark',ev:'aff',n:[3,5],t:n=>`Ajouter ${n} affixes avec des parchemins`},
 {k:'w_rar',ic:'star',ev:'rar',n:[1,2],t:n=>n>1?`Faire monter ${n} fois la rareté d’un objet`:'Faire monter la rareté d’un objet'},
 {k:'w_adv',ic:'play',ev:'advwin',n:[40,60],t:n=>`Remporter ${n} combats en Aventure`},
 {k:'w_kill',ic:'swords',ev:'kill',n:[150,250],t:n=>`Vaincre ${n} ennemis en Aventure`},
 {k:'w_mine',ic:'paw',ev:'cexp',n:[5,8],t:n=>`Réussir ${n} expéditions de compagnon`,ok:()=>!!(ACC.comp&&ACC.comp.list.length)},
 {k:'w_up',ic:'anvil',ev:'up',n:[6,10],t:n=>`Réussir ${n} renforcements`},
 {k:'w_boss',ic:'skull',ev:'boss',n:[3,5],t:n=>`Vaincre ${n} boss de zone`,ok:()=>S.prog&&(S.prog.zone>0||S.prog.stage>=10)}];
const QR_D=[['sc_blank',1,3],['pd_rune',2,5],['es_pie',1,3],['es_bra',1,3],['es_ven',1,3],['st_up',1,2],['ru_min',1,1],['gm_mag',1,1],['ch_pou',1,1]];
const QR_W=[['ru_min',2,3],['gm_mag',1,2],['ch_pou',1,2],['ru_maj',1,2],['gm_rar',1,1],['sc_rob2',1,1],['sc_fur2',1,1],['sc_adr2',1,1],['ru_anc',1,1],['gm_epi',1,1],['ch_tre',1,1],['sc_rob3',1,1],['sc_fur3',1,1],['sc_adr3',1,1]];
const QCH={base:3,p4:35,p5:12,rar:[[0,70],[1,25],[2,5]],q:{0:[1,3],1:[1,2],2:[1,1]}};
function qGen(list,pool,cnt,seed,rwPool,rwN){
  const rnd=qRng(seed),av=list.filter(q=>!q.ok||q.ok()),out=[],used=new Set();
  while(out.length<cnt&&used.size<av.length){ const q=av[Math.floor(rnd()*av.length)]; if(used.has(q.k)||(q.ev.startsWith('raidf')&&out.some(o=>o.ev.startsWith('raidf')))){ used.add(q.k); continue } used.add(q.k);
    const n=q.n[Math.floor(rnd()*q.n.length)],rw=[],rp=rwPool.slice();
    for(let i=0;i<rwN&&rp.length;i++){ const j=Math.floor(rnd()*rp.length),[k,a,b]=rp.splice(j,1)[0]; rw.push([k,a+Math.floor(rnd()*(b-a+1))]) }
    out.push({k:q.k,ev:q.ev,n,p:0,rw,got:false}) }
  return out }
function qState(){
  if(!qHas()) return null; const h=S.heroes[0],Q=S.quests=S.quests||{},dk=qDay(),wk=qWeek();
  if(!Q.d||Q.d.key!==dk){ Q.d={key:dk,list:qGen(Q_D,null,5,'d'+dk+h.id,QR_D,2),chest:false}; save() }
  if(!Q.w||Q.w.key!==wk){ Q.w={key:wk,list:qGen(Q_W,null,3,'w'+wk+h.id,QR_W,2)}; save() }
  return Q }
const qDef=k=>Q_D.find(q=>q.k===k)||Q_W.find(q=>q.k===k);
function qEv(ev,n=1){ const Q=qState(); if(!Q) return; let done=0;
  for(const q of [...Q.d.list,...Q.w.list]) if(q.ev===ev&&q.p<q.n){ q.p=Math.min(q.n,q.p+n); if(q.p>=q.n){ done++; setTimeout(()=>toast('✦ Quête terminée : '+qDef(q.k).t(q.n)),400) } }
  if(done){ save(); renderTabs&&renderTabs() } else save() }
const qClaimable=()=>(typeof sqClaimN==='function'&&(sqClaimN()>0||(ACC.schest||[]).some(x=>x>0)))||qClaimable0();
const qClaimable0=()=>{ const Q=qHas()&&S.quests; if(!Q||!Q.d||Q.d.key!==qDay()) return false; return [...Q.d.list,...(Q.w&&Q.w.key===qWeek()?Q.w.list:[])].some(q=>q.p>=q.n&&!q.got)||(Q.d.list.every(q=>q.got)&&!Q.d.chest) };
function qGive(rw){ const rest={}; for(const [k,n] of rw){ const l=bagAddMat(S.bag,k,n); if(l>0) rest[k]=(rest[k]||0)+l } if(Object.keys(rest).length){ const t=mlPlace(rest); if(t){ for(const x of t) x.T.bag=x.bag; saveAcc(); toast('Inventaire plein : le reste est dans le coffre du compte.') } else toast('Inventaire et coffre pleins : une partie des objets est perdue.') } markNew() }
const qRwHTML=rw=>`<div class="qrw">${rw.map(([k,n])=>`<span class="qri" style="--rc:var(--r${NEWI[k].r})" data-tip="nw:${k}"><svg class="mfi" viewBox="0 0 24 24">${MI[k]}</svg><em>×${n}</em></span>`).join('')}</div>`;
function qCard(q,wk,i){ const D=qDef(q.k),ok=q.p>=q.n;
  return `<div class="qc ${ok?'done':''} ${q.got?'got':''}"><span class="qci">${uic(D.ic)}</span><b>${esc(D.t(q.n))}</b>${q.got?`<span class="qbtn got">${uic('check')}Récupéré</span>`:ok?`<button class="qbtn" data-act="qClaim" data-w="${wk?1:0}" data-i="${i}">Récupérer</button>`:`<span class="qbtn off">En cours</span>`}
   <div class="qbar ${ok?'ok':''}"><i style="width:${Math.min(100,q.p/q.n*100)}%"></i></div><div class="qmeta"><small class="num">${q.p} / ${q.n}</small>${qRwHTML(q.rw)}</div></div>` }
function chestTip(){ return `<article class="it" style="--rc:#d6aa55"><header><b>Coffre du jour</b><small>Terminez et récupérez les 5 quêtes du jour</small></header><div class="skbody"><p><b>3 objets d’artisanat</b> garantis.</p><p>4ᵉ objet : <b>${QCH.p4} %</b> · 5ᵉ objet : <b>${QCH.p5} %</b></p><p>Rareté de chaque objet : <span style="color:var(--r0)">Commun ${QCH.rar[0][1]} %</span> · <span style="color:var(--r1)">Magique ${QCH.rar[1][1]} %</span> · <span style="color:var(--r2)">Rare ${QCH.rar[2][1]} %</span></p><p>Quantité : 1 à 3 (Commun), 1 à 2 (Magique), 1 (Rare).</p></div></article>` }
function viewQuest(){
  const Q=qState(); if(!Q) return '';
  const dAll=Q.d.list.every(q=>q.got),ch=Q.d.chest,dn=Q.d.list.filter(q=>q.got).length;
  const chest=`<div class="qchestrow ${dAll&&!ch?'ready':''} ${ch?'opened':''}"><button class="qchest" data-act="qChest" data-tip="qchest" ${dAll&&!ch?'':'aria-disabled="true"'}>${QCHEST_SVG}</button><span><b>Coffre du jour</b><small>${ch?'Déjà ouvert aujourd’hui.':dAll?'Prêt à être ouvert !':`${dn} / 5 quêtes récupérées`}</small></span>${dAll&&!ch?'<button class="qbtn" data-act="qChest">Ouvrir</button>':''}</div>`;
  const dots=L=>`<div class="qdots">${L.map(q=>`<i class="${q.got?'on':q.p>=q.n?'ok':''}"></i>`).join('')}</div>`;
  return `<div class="qwrap"><div class="qhd"><h2>Quêtes</h2><span class="mute">Récompenses : objets d’artisanat.</span></div><div class="qcols">
   <section class="qcol"><header>${uic('scroll')}<h3>Journalières</h3><span class="qtm" ${ttip('Renouvellement','Chaque jour à 6 h 00.')}>${uic('auto')}6 h 00 · dans ${qLeft(qNext(false)-Date.now())}</span></header>${dots(Q.d.list)}<div class="qls">${Q.d.list.map((q,i)=>qCard(q,false,i)).join('')}</div>${chest}</section>
   <section class="qcol wk"><header>${uic('star')}<h3>Hebdomadaires</h3><span class="qtm" ${ttip('Renouvellement','Chaque mercredi à 6 h 00.')}>${uic('auto')}Mercredi 6 h 00 · dans ${qLeft(qNext(true)-Date.now())}</span></header>${dots(Q.w.list)}<div class="qls">${Q.w.list.map((q,i)=>qCard(q,true,i)).join('')}</div><p class="qnote">Récompenses jusqu’à la rareté Épique.</p></section></div></div>`;
}
const QCHEST_SVG='<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M8 28V22a14 14 0 0 1 14-14h20a14 14 0 0 1 14 14v6z" fill="#8a4a1e" stroke="#2a1408" stroke-width="2.5"/><path d="M16 9v19M48 9v19" stroke="#d6aa55" stroke-width="4"/><rect x="6" y="28" width="52" height="28" rx="3" fill="#a05a24" stroke="#2a1408" stroke-width="2.5"/><path d="M6 36h52" stroke="#2a1408" stroke-width="2"/><path d="M16 28v28M48 28v28" stroke="#d6aa55" stroke-width="4"/><rect x="27" y="30" width="10" height="13" rx="2" fill="#f0d48a" stroke="#5a3a10" stroke-width="2"/><circle cx="32" cy="36" r="1.8" fill="#5a3a10"/></svg>';
function qChestRoll(){ const rnd=Math.random,n=QCH.base+(rnd()*100<QCH.p4?1:0)+(rnd()*100<QCH.p5?1:0),pool={0:['sc_blank','pd_rune','es_pie','es_bra','es_ven','st_up'],1:['ru_min','gm_mag','ch_pou','sc_rob1','sc_fur1','sc_adr1'],2:['ru_maj','gm_rar','sc_rob2','sc_fur2','sc_adr2']},out=[];
  for(let i=0;i<n;i++){ let x=rnd()*100,r=0; for(const [rr,w] of QCH.rar){ if(x<w){ r=rr; break } x-=w } const P=pool[r],k=P[Math.floor(rnd()*P.length)],[a,b]=QCH.q[r]; const q=a+Math.floor(rnd()*(b-a+1)),ex=out.find(o=>o[0]===k); if(ex) ex[1]+=q; else out.push([k,q]) }
  return out }
/* animation d'ouverture */
let QA=null;
function qChestAnim(items){
  const w=document.createElement('div'); w.id='qanim'; w.className='qanim'; w.innerHTML=`<div class="qachest">${QCHEST_SVG}<span class="qalid"></span><span class="qaglow"></span></div><div class="qaitems"></div><button class="qaskip" data-act="qSkip">Passer <kbd>Espace</kbd></button>`; document.body.append(w);
  QA={w,items,t:[],done:false};
  const it=w.querySelector('.qaitems'),n=items.length;
  QA.t.push(setTimeout(()=>w.classList.add('open'),1300));
  items.forEach(([k,c],i)=>{ QA.t.push(setTimeout(()=>{ const a=(n===1?0:(-55+110*i/(n-1)))*Math.PI/180,R=230; const e=document.createElement('div'); e.className='qait'; e.style.setProperty('--tx',Math.sin(a)*R+'px'); e.style.setProperty('--ty',(Math.cos(a)*R*.55+50)+'px'); e.style.setProperty('--rc',`var(--r${NEWI[k].r})`);
    e.innerHTML=`<span class="qaburst"></span><span class="qri big" style="--rc:var(--r${NEWI[k].r})"><svg class="mfi" viewBox="0 0 24 24">${MI[k]}</svg><em>×${c}</em></span>`; it.append(e);
    for(let s=0;s<14;s++){ const p=document.createElement('i'); p.className='qasp'; const g=Math.random()*Math.PI*2,d=30+Math.random()*60; p.style.setProperty('--dx',Math.cos(g)*d+'px'); p.style.setProperty('--dy',Math.sin(g)*d+'px'); e.append(p) } },1900+i*550)) });
  QA.t.push(setTimeout(qChestRecap,1900+n*550+700));
}
function qChestRecap(){ if(!QA||QA.done) return; QA.done=true; QA.t.forEach(clearTimeout); const w=QA.w; w.classList.add('recap');
  w.innerHTML=`<div class="qrecap" role="dialog" aria-label="Contenu du coffre"><h3>${QCHEST_SVG}Coffre du jour</h3><p class="qrsub">Les objets ont été ajoutés à votre inventaire.</p><div class="qrlist">${QA.items.map(([k,c])=>`<div class="qrli"><span class="qri" style="--rc:var(--r${NEWI[k].r})" data-tip="nw:${k}"><svg class="mfi" viewBox="0 0 24 24">${MI[k]}</svg></span><span><b style="color:${EQ_RC[NEWI[k].r]}">${esc(NEWI[k].n)}</b><small>${RAR[NEWI[k].r].n} · ${esc(NEWI[k].cat)}</small></span><b class="num">×${c}</b></div>`).join('')}</div><button class="btn pri" data-act="qRecapOk">Super !</button></div>` }
document.addEventListener('keydown',e=>{ if(!QA) return; if(e.code==='Space'||e.key===' '){ e.preventDefault(); if(!QA.done) qChestRecap(); else A.qRecapOk() } else if(e.key==='Escape'&&QA.done) A.qRecapOk() },true);

/* carte de joueur : penche vers la souris comme si elle appuyait dessus */
let TILT=null;
let TILTW=null;
function tiltOff(){ if(!TILT) return; TILT.classList.remove('tilt'); TILT.style.transform=''; if(TILTW){ TILTW.classList.remove('tiltw'); TILTW.style.transform=''; TILTW=null } TILT=null }
document.addEventListener('pointermove',e=>{
  if(true){ tiltOff(); return } /* 0.7.8 : effet d'inclinaison au survol supprimé */
  const fl=e.target.closest&&e.target.closest('#pcfl'),c=fl?fl.querySelector('.pc1,.pc2'):(e.target.closest&&e.target.closest('.pc1,.pc2')); if(c!==TILT) tiltOff(); if(!c) return;
  const box=fl?fl.querySelector('.pcbox')||c:c,r=box.getBoundingClientRect(); if(!r.width) return; const nx=clamp((e.clientX-r.left)/r.width*2-1,-1,1),ny=clamp((e.clientY-r.top)/r.height*2-1,-1,1);
  const k=c.classList.contains('pc2')?6:13; TILT=c; c.classList.add('tilt');
  const tf=`perspective(${c.classList.contains('pc2')?1400:900}px) rotateY(${(nx*k).toFixed(2)}deg) rotateX(${(-ny*k).toFixed(2)}deg) scale(1.015)`;
  if(fl){ TILTW=fl; fl.classList.add('tiltw'); fl.style.transform=tf; c.style.transform='' } else c.style.transform=tf;
  c.style.setProperty('--gx',((nx+1)*50).toFixed(1)+'%'); c.style.setProperty('--gy',((ny+1)*50).toFixed(1)+'%');
},{passive:true});
document.addEventListener('pointerleave',tiltOff); addEventListener('blur',tiltOff);
/* recyclage manuel : clic sur un objet du sac = recyclé */
function anvilHit(i){
  const E=S.bag[i]; if(!E) return; const it=E.o;
  if(it.mat){ toast('Seul l’équipement peut être recyclé.'); return }
  if(UI.fItem===it.id) UI.fItem=null; if(UI.bagSel===it) UI.bagSel=null;
  S.bag.splice(i,1); const v=salvageValue(it); gain(v); qEv('recycle'); hideTip(); save(); render();
  toast(`${it.name} recyclé. Récupéré : ${resTxt(v)}.`);
}
document.addEventListener('pointerdown',e=>{ if(!UI.anvil||e.button!==0) return; const c=e.target.closest&&e.target.closest('#bag .gi'); if(!c) return; e.preventDefault(); e.stopImmediatePropagation(); if(c.dataset.i!=null&&S.bag[+c.dataset.i]) anvilHit(+c.dataset.i) },true);
document.addEventListener('click',e=>{ if(UI.anvil&&e.target.closest&&e.target.closest('#bag .gi')){ e.preventDefault(); e.stopImmediatePropagation() } },true);
document.addEventListener('contextmenu',e=>{ if(UI.anvil){ e.preventDefault(); e.stopImmediatePropagation(); UI.anvil=false; render(); toast('Recyclage manuel arrêté.') } },true);
document.addEventListener('keydown',e=>{ if(e.key==='Escape'&&UI.anvil){ UI.anvil=false; render() } },true);
/* pas de menu du navigateur au clic droit (sauf dans les champs de texte) */
document.addEventListener('contextmenu',e=>{ if(e.target.closest&&e.target.closest('input,textarea,[contenteditable="true"]')) return; e.preventDefault() });
