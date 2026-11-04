/* Cendrelame · systems/forge.js */
/* ================= Amélioration : parchemins, pierres, enchantement ================= */
const NWI={
 scroll:s=>`<path d="M5 5h11a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3z" fill="#efe0b8" stroke="#6a4a22" stroke-width="1.1"/><path d="M5 5a2 2 0 0 0-2 2v1h4V7a2 2 0 0 0-2-2z" fill="#d8c290" stroke="#6a4a22" stroke-width="1"/><path d="M8.5 9h7M8.5 11.5h7M8.5 14h4" stroke="#b49a6a" stroke-width="1"/>${s?`<circle cx="15.5" cy="16.5" r="3" fill="${s}" stroke="#2a1408" stroke-width=".9"/><path d="M14.3 16.5h2.4M15.5 15.3v2.4" stroke="#fff6" stroke-width=".8"/>`:''}`,
 rune:(c,g)=>`<path d="M6 4h12l2 8-2 8H6l-2-8z" fill="#7a7480" stroke="#2a2630" stroke-width="1.1"/><path d="M6 4h12l1 4H5z" fill="#9a94a0"/><path d="${g}" stroke="${c}" stroke-width="1.8" fill="none" stroke-linecap="round"/>`,
 vial:(c,h)=>`<path d="M10 3h4v4l3.5 6.5A4.5 4.5 0 0 1 13.5 20h-3A4.5 4.5 0 0 1 6.5 13.5L10 7z" fill="#e8f0f4" fill-opacity=".35" stroke="#2a3038" stroke-width="1.1"/><path d="M7.4 13h9.2a4 4 0 0 1-3.6 6h-2a4 4 0 0 1-3.6-6z" fill="${c}"/><circle cx="10.5" cy="15" r="1" fill="${h}"/><rect x="9.5" y="2" width="5" height="2" rx=".6" fill="#8a5a2a"/>`,
 gem:(c,h,d)=>`<path d="M7 4h10l4 5-9 11L3 9z" fill="${c}" stroke="${d}" stroke-width="1.1" stroke-linejoin="round"/><path d="M3 9h18M7 4l2 5 3 11 3-11 2-5" fill="none" stroke="${d}" stroke-width=".8"/><path d="M9 9l3-5 3 5z" fill="${h}"/>`,
 pouch:(c,d,dots)=>`<path d="M6 9c0-3 2.5-5 6-5s6 2 6 5l1 8a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3z" fill="${c}" stroke="${d}" stroke-width="1.1"/><path d="M8 6h8" stroke="${d}" stroke-width="1.4"/>${dots}`};
const SC_R={1:[.6,.8],2:[.7,.9],3:[.8,1],4:[.9,1.1]};
const SC_T={
 rob:{n:'Robustesse',seal:'#3a78c8',es:'es_pie',pool:[['rPhys',1],['rMag',1],['rFeu',1],['rGlace',1],['rFoudre',1],['rTerre',1]],d:'Ajoute une affixe de résistance au hasard parmi les 6 résistances.'},
 fur:{n:'Fureur',seal:'#c83a2a',es:'es_bra',pool:[['critDmg',45],['main',40],['crit',15]],d:'Ajoute une affixe : Dégâts critiques (45 %), statistique principale de la classe (40 %) ou Chance de critique (15 %).'},
 adr:{n:'Adresse',seal:'#3aa860',es:'es_ven',pool:[['spd',35],['dodge',35],['lifesteal',25],['ap',5]],d:'Ajoute une affixe : Vitesse (35 %), Esquive (35 %), Vol de vie (25 %) ou Points d’action (5 %).'}};
const NEWI={
 sc_blank:{n:'Parchemin vierge',r:0,cat:'Catalyseur',d:'Support d’enchantement, vendu par le Marchand. Placez-le en haut de l’autel d’Enchantement.',svg:NWI.scroll(null)},
 pd_rune:{n:'Poudre runique',r:0,cat:'Composant',d:'Poussière de runes broyées. Il en faut 3 par enchantement.',svg:NWI.pouch('#8a6a44','#3a2412','<circle cx="10" cy="13" r="1" fill="#c8a0ff"/><circle cx="13.5" cy="15" r="1.2" fill="#a070f0"/><circle cx="12" cy="11" r=".8" fill="#e0c8ff"/>')},
 es_pie:{n:'Essence magique de pierre',r:0,cat:'Essence',ess:'rob',d:'Oriente l’enchantement vers un Parchemin de Robustesse (résistances).',svg:NWI.vial('#6a8aa8','#d0e4f4')},
 es_bra:{n:'Essence magique de braise',r:0,cat:'Essence',ess:'fur',d:'Oriente l’enchantement vers un Parchemin de Fureur (critiques, stat principale).',svg:NWI.vial('#d0442a','#ffd0a0')},
 es_ven:{n:'Essence magique de vent',r:0,cat:'Essence',ess:'adr',d:'Oriente l’enchantement vers un Parchemin d’Adresse (vitesse, esquive, vol de vie, PA).',svg:NWI.vial('#4ab07a','#d0ffe0')},
 ru_min:{n:'Rune mineure',r:1,cat:'Rune',rune:1,d:'Donne la rareté Magique au parchemin créé.',svg:NWI.rune('#5aa0ff','M12 7v10M9 10l3-3 3 3')},
 ru_maj:{n:'Rune majeure',r:2,cat:'Rune',rune:2,d:'Donne la rareté Rare au parchemin créé.',svg:NWI.rune('#f0c040','M9 7l6 10M15 7l-6 10')},
 ru_anc:{n:'Rune ancienne',r:3,cat:'Rune',rune:3,d:'Donne la rareté Épique au parchemin créé.',svg:NWI.rune('#c080ff','M12 6v12M8 9h8M8 15h8')},
 ru_pri:{n:'Rune primordiale',r:4,cat:'Rune',rune:4,d:'Donne la rareté Légendaire au parchemin créé.',svg:NWI.rune('#ff9040','M12 6l5 6-5 6-5-6z')},
 gm_mag:{n:'Cristal magique',r:1,cat:'Pierre de rareté',gem:0,d:'Commun → Magique. Toutes les affixes de l’objet, actuelles et futures : +5 %.',svg:NWI.gem('#5aa0ff','#d0e8ff','#123a70')},
 gm_rar:{n:'Saphir d’éclat',r:2,cat:'Pierre de rareté',gem:1,d:'Magique → Rare. Toutes les affixes : +5 % de plus.',svg:NWI.gem('#f0c040','#fff0b0','#6a4a00')},
 gm_epi:{n:'Améthyste ancienne',r:3,cat:'Pierre de rareté',gem:2,d:'Rare → Épique. Toutes les affixes : +5 % de plus.',svg:NWI.gem('#b070f0','#ead0ff','#3a1a6a')},
 gm_leg:{n:'Cœur de braise',r:4,cat:'Pierre de rareté',gem:3,d:'Épique → Légendaire. Toutes les affixes : +5 % de plus et pouvoir légendaire.',svg:NWI.gem('#ff7a2a','#ffd8a0','#6a2400')},
 st_up:{n:'Pierre de renforcement',r:0,cat:'Amélioration',d:'Niveau de l’objet +1 (+3 % à toutes ses stats, jusqu’à +10). Plus le niveau est haut, plus la réussite est difficile ; en cas d’échec, la pierre est perdue mais l’objet reste intact.',svg:'<path d="M4 15l7-10h6l3 4-7 10H7z" fill="#8a8f98" stroke="#2a2e34" stroke-width="1.1" stroke-linejoin="round"/><path d="M11 5h6l3 4h-6z" fill="#c4c9d0"/><path d="M8 14l4-5" stroke="#f0f4f8" stroke-width="1"/>'},
 ch_pou:{n:'Poudre de chance',r:1,cat:'Bonus de réussite',bon:10,d:'+10 % de chance de réussite pour un renforcement avec une Pierre de renforcement.',svg:NWI.pouch('#3a8a4a','#123a18','<path d="M12 11.5c-1.4-1.6-3 .4-1.4 1.7L12 14.5l1.4-1.3c1.6-1.3 0-3.3-1.4-1.7z" fill="#d0ffb0"/>')},
 ch_tre:{n:'Trèfle de fortune',r:3,cat:'Bonus de réussite',bon:25,d:'+25 % de chance de réussite pour un renforcement avec une Pierre de renforcement.',svg:'<path d="M12 12c-4-6-9-1-4 2-5 3 0 8 4 2 4 6 9 1 4-2 5-3 0-8-4-2z" fill="#4ac060" stroke="#14501e" stroke-width="1.1"/><path d="M12 12l2 9" stroke="#14501e" stroke-width="1.4"/><circle cx="12" cy="12" r="1.3" fill="#e8ffd0"/>'},
 cr_asc:{n:'Cristal d’ascension',r:4,cat:'Amélioration légendaire',d:'Augmente de 5 le niveau d’objet d’un équipement et recalcule toutes ses affixes. Une seule fois par objet ; le niveau requis ne change pas. Obtenu uniquement en réussissant des défis de raid.',svg:'<path d="M12 2l5 6-5 14-5-14z" fill="#ffb04a" stroke="#6a2400" stroke-width="1.1" stroke-linejoin="round"/><path d="M12 2l-1.6 6L12 22l1.6-14z" fill="#ffe3a8"/><path d="M7 8h10" stroke="#6a2400" stroke-width=".8"/><path d="M4 6l2 1M20 6l-2 1M4 14l2-1M20 14l-2-1" stroke="#ffd36a" stroke-width="1.4" stroke-linecap="round"/>'},
 fu_ap:{n:'Parchemin d’action',r:4,cat:'Parchemin de fusion',d:'Ajoute +1 Point d’action à un anneau, sans prendre d’emplacement d’affixe. Une seule fois par anneau. Créé par Fusion légendaire à l’Autel d’enchantement.',svg:'<path d="M5 5h11a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3z" fill="#ffe3a8" stroke="#8a3a0a" stroke-width="1.1"/><path d="M5 5a2 2 0 0 0-2 2v1h4V7a2 2 0 0 0-2-2z" fill="#ffb04a" stroke="#8a3a0a" stroke-width="1"/><circle cx="12" cy="12.5" r="4.2" fill="#d9b81f" stroke="#6a4a00" stroke-width="1"/><path d="M12 10v5M9.5 12.5h5" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/>'},
};
for(const [t,T] of Object.entries(SC_T)) for(let r=1;r<=4;r++) NEWI['sc_'+t+r]={n:'Parchemin de '+T.n,r,cat:'Parchemin',sc:t,d:T.d+` Valeur de l’affixe : ${Math.round(SC_R[r][0]*100)}–${Math.round(SC_R[r][1]*100)} % du maximum au niveau de l’objet.`,svg:NWI.scroll(T.seal)};
for(const [k,o] of Object.entries(NEWI)){ MI[k]=o.svg; MAT_OBJ[k]=o.n; MAT_N[k]=o.n; MAT_D[k]=o.d }
const GEMK={gm_mag:0,gm_rar:1,gm_epi:2,gm_leg:3,prisme:4};
const nwR=k=>k==='prisme'?5:NEWI[k]?NEWI[k].r:0;
const UP_CH=[100,90,80,70,60,50,40,30,20,10];
const isUpK=k=>!!(NEWI[k]&&(NEWI[k].sc||NEWI[k].gem!=null||k==='st_up'))||k==='prisme'||k==='cr_asc'||k==='fu_ap'||k==='rm_aff';
AFXM.ap=AFXM.ap||{s:'ap',w:0,b:1,p:0};
const mainStat=it=>{const c=it.cls||(S.heroes[0]&&S.heroes[0].cls);return CLASSES[c]&&CLASSES[c].role==='mag'?'mag':'atk'};
function affVal(s,ilvl,mult){ if(s==='ap') return 1; const A=AFXM[s]; const v=(A.b+A.p*ilvl)*mult; return PCT.has(s)?Math.max(.5,r1(v)):Math.max(1,Math.round(v)) }
function newiCard(c,foot=''){const N=NEWI[c.mat];const tot=matAll(c.mat);
 return `<article class="it" style="--rc:var(--r${N.r})"><header><b style="color:var(--r${N.r})">${esc(N.n)}</b><small>${N.cat} · <span style="color:var(--r${N.r})">${RAR[N.r].n}</span>${c.n!=null?` · Pile ${c.n} / ${STACK}`:''}</small></header><ul><li class="imp">${esc(N.d)}</li><li>Possédés : <b class="num">${fmt(tot)}</b></li></ul>${foot?`<div class="foot">${foot}</div>`:''}</article>`}
/* ---------- migration (composants dans le sac, nouvelles affixes) ---------- */
function migItem(it,cls){
  if(!it||it.mat||it.v2) return; const old=(it.aff||[]).slice(),ms=CLASSES[it.cls||cls]&&CLASSES[it.cls||cls].role==='mag'?'mag':'atk',m=RAR[it.rarity]?RAR[it.rarity].m:1;
  let i=old.findIndex(a=>a.s===ms); const a1=i>=0?old.splice(i,1)[0]:{s:ms,v:affVal(ms,it.ilvl,m*rand(.7,1))};
  i=old.findIndex(a=>a.s==='hp'||a.s==='hpPct'); const a2=i>=0?old.splice(i,1)[0]:{s:Math.random()<.6?'hp':'hpPct',v:0}; if(!a2.v) a2.v=affVal(a2.s,it.ilvl,m*rand(.7,1));
  it.aff=[{s:a1.s,v:a1.v,main:1},{s:a2.s,v:a2.v,main:1},...old.slice(0,3).map(a=>({s:a.s,v:a.v}))]; it.v2=1;
}
function craftMigrate(){
  const cls=S.heroes[0]&&S.heroes[0].cls; let n=0;
  if(Object.values(S.mats||{}).some(v=>v>0)){
    for(const [k,v] of Object.entries(S.mats||{})){ const q=Math.floor((v||0)*.25); if(q>0){ bagAddMat(S.bag,k,q); n++ } }
    S.mats={}; S.matV=2;
    if(n) setTimeout(()=>toast('Les composants sont maintenant rangés dans l’inventaire (quantités réduites de 75 %).'),1800);
  }
  S.bag.forEach(e=>migItem(e.o,cls)); for(const h of S.heroes) Object.values(h.equip||{}).forEach(it=>migItem(it,h.cls));
  if(ACC&&ACC.stash&&Array.isArray(ACC.stash.tabs)){ let ch=false;
    for(const T of ACC.stash.tabs) for(const e of T.bag||[]){ if(!e.o.mat&&!e.o.v2){migItem(e.o,cls);ch=true} }
    if(ACC.matV!==2){ for(const T of ACC.stash.tabs) for(const e of T.bag||[]) if(e.o.mat&&MATS.includes(e.o.mat)) e.o.n=Math.max(1,Math.floor(e.o.n*.25)); ACC.matV=2; ch=true }
    if(ch) saveAcc() }
}
/* ---------- butin des zones ---------- */
const ZLOOT=[
 {eq:18,rw:[80,16,3.5,.5,0],it:[['pd_rune',30],['es_pie',9],['es_bra',9],['es_ven',9],['ru_min',6],['st_up',5],['sc_blank',2],['ch_pou',1.5],['gm_mag',1]]},
 {eq:20,rw:[72,20,6,1.8,.2],it:[['pd_rune',32],['es_pie',10],['es_bra',10],['es_ven',10],['ru_min',8],['ru_maj',2.5],['st_up',6],['sc_blank',2.5],['ch_pou',2],['gm_mag',1.5],['gm_rar',.5]]},
 {eq:22,rw:[64,24,9,2.6,.4],it:[['pd_rune',34],['es_pie',11],['es_bra',11],['es_ven',11],['ru_min',7],['ru_maj',4],['st_up',7],['sc_blank',3],['ch_pou',2.5],['ch_tre',.5],['gm_mag',2],['gm_rar',1],['gm_epi',.3]]},
 {eq:24,rw:[55,27,13,4.2,.8],it:[['pd_rune',36],['es_pie',12],['es_bra',12],['es_ven',12],['ru_maj',6],['ru_anc',2],['st_up',8],['sc_blank',3.5],['ch_pou',3],['ch_tre',1],['gm_rar',1.5],['gm_epi',.7],['gm_leg',.15]]},
 {eq:26,rw:[45,30,17,6.5,1.5],it:[['pd_rune',38],['es_pie',13],['es_bra',13],['es_ven',13],['ru_maj',6],['ru_anc',3.5],['ru_pri',.8],['st_up',9],['sc_blank',4],['ch_pou',3.5],['ch_tre',1.5],['gm_epi',1.2],['gm_leg',.4]]}];
const zLoot=z=>ZLOOT[Math.min(z,ZLOOT.length-1)];
function rollZoneLoot(z,boss,L,lb){
  const Z=zLoot(z),dk=dKey(),mul=(boss?3:1)*Math.max(1,lb||1)*dropM(dk),mats={},items=[];
  for(const [k,p] of Z.it) if(Math.random()*100<Math.min(95,p*mul)) mats[k]=(mats[k]||0)+(k==='pd_rune'?ri(1,2):1);
  if(Math.random()*100<Math.min(95,Z.eq*mul)){
    const RW=rwD(Z.rw,dk),tot=RW.reduce((a,b)=>a+b,0); let t=Math.random()*tot,r=0; for(;r<RW.length-1;r++){ t-=RW[r]; if(t<=0) break }
    const h=S.heroes[0],sl=slotType(pick(SLOTS)); items.push(genItem(sl,Math.max(1,L),r,null,h.cls));
  }
  return {mats,items};
}
function zoneLootHTML(z,boss){
  const Z=zLoot(z),m=boss?3:1,pc=p=>String(Math.min(95,Math.round(p*m*10)/10)).replace('.',',')+' %',tot=Z.rw.reduce((a,b)=>a+b,0);
  const eq=Z.rw.map((w,r)=>w?`<span class="zlt" style="--rc:var(--r${r})" ${ttip('Équipement '+RAR[r].n.toLowerCase(),pc(Z.eq*w/tot)+' par combat'+(boss?' (boss ×3)':'')+'. Niveau de l’objet = niveau des ennemis.')}>${eqSvg('armor',EQ_RC[r])}<em>${pc(Z.eq*w/tot)}</em></span>`:'').join('');
  const it=Z.it.map(([k,p])=>`<span class="zlt" style="--rc:var(--r${nwR(k)})" ${ttip(NEWI[k].n,pc(p)+' par combat'+(boss?' (boss ×3)':'')+'. '+NEWI[k].d)}><svg class="mfi" viewBox="0 0 24 24">${MI[k]}</svg><em>${pc(p)}</em></span>`).join('');
  return `<h4>Butin ${boss?'du boss':'de la zone'}</h4><div class="zloot">${eq}${it}</div>`;
}
/* ---------- atelier ---------- */
const fHelpOn=()=>ACC.fHelp!==false;
const fsHave=k=>k?matAll(k):0;
function fsSlot(name,k,label,size='sm',need=1){
  if(k&&fsHave(k)<1){ k=null }
  const ic=k?`<svg class="mfi" viewBox="0 0 24 24">${MI[k]}</svg>`:'';
  return `<div class="mfs ${size} fslot2 ${k?'full':''} ${k&&fsHave(k)<need?'lack':''} ${UI.invHL===name&&UI.invOpen?'pick':''}" data-fs="${name}" data-act="fsPick" data-s="${name}" ${k?`style="--rc:var(--r${nwR(k)})" data-tip="nw:${k}"`:`${ttip(label,'Cliquez pour afficher l’inventaire : les objets compatibles sont mis en évidence.')}`}>${k?`${ic}<span class="q num">${need>1?need+'/':''}${fmt(fsHave(k))}</span><button class="mfclr" data-act="fsClear" data-s="${name}" ${ttip('Vider la case')}>${uic('xx')}</button>`:`<small>${label}</small>`}</div>`;
}
const pips=(n,max=5)=>`<span class="mfpips" aria-hidden="true">${Array.from({length:max},(_,i)=>`<i class="${i<n?'on':''} ${i<2?'main':''}"></i>`).join('')}</span>`;
const EXPL={
 up:`<h3>Renforcer un objet</h3><ol class="mfsteps"><li><b>Posez l’objet</b> dans le grand cercle (glisser-déposer ou clic droit depuis l’inventaire). Sa rareté et ses affixes sont détectées automatiquement.</li><li><b>Choisissez l’amélioration</b> dans la case du dessous :<ul><li><b>Parchemin</b> : ajoute une affixe. Un objet a 2 affixes principales et peut en recevoir 3 de plus.</li><li><b>Pierre de rareté</b> : fait monter la rareté d’un cran, +15 % des valeurs de base.</li><li><b>Prisme divin</b> : Légendaire → Divin, 10 % de réussite par prisme placé (jusqu’à 10).</li><li><b>Pierre de remodelage</b> : remplace une affixe choisie par une autre de la même catégorie.</li><li><b>Pierre de renforcement</b> : +1 niveau (+3 % à toutes les stats) ; 1 pierre jusqu’à +5, puis 2.</li></ul></li><li>Avec une pierre de renforcement, ajoutez si besoin un <b>bonus de réussite</b> dans la petite case.</li><li>Vérifiez les chances à droite, puis cliquez sur <b>Renforcer</b>.</li></ol><p class="mftip">Les parchemins se créent dans l’atelier <b>Enchantement</b>. Cliquez sur une case pour ouvrir l’inventaire : les objets compatibles s’illuminent. La croix vide la case.</p>`,
 ench:`<h3>Enchanter un parchemin</h3><ol class="mfsteps"><li>Placez un <b>Parchemin vierge</b> (vendu par le Marchand) en haut : c’est le catalyseur.</li><li>Remplissez les trois cases du bas :<ul><li><b>Poudre runique</b> à gauche (3 nécessaires) ;</li><li><b>Essence magique</b> au centre : elle choisit le type de parchemin (pierre → Robustesse, braise → Fureur, vent → Adresse) ;</li><li><b>Rune</b> à droite : elle choisit la rareté (mineure → Magique, majeure → Rare, ancienne → Épique, primordiale → Légendaire).</li></ul></li><li>Cliquez sur <b>Enchanter</b> : le parchemin rejoint l’inventaire.</li></ol><p class="mftip">Plus la rareté du parchemin est haute, plus l’affixe ajoutée est forte.</p>`};
const helpBtn=()=>`<button class="mfhelp ${fHelpOn()?'on':''}" data-act="fHelp" aria-pressed="${fHelpOn()}" ${ttip(fHelpOn()?'Masquer les explications':'Afficher les explications','Affiche ou masque le guide à gauche.')}>?</button>`;
const ANVIL=`<svg class="mfanvil" viewBox="0 0 200 90" aria-hidden="true"><path d="M20 20h120c6 18 22 26 50 28v10h-48l-10 14h12v14H56V72h12l-8-16C34 54 22 42 20 20z"/><path d="M24 22h114" stroke="#e8a13a" stroke-width="2" opacity=".7"/></svg>`;
const EMBERS=`<div class="mfembers" aria-hidden="true">${Array.from({length:14},(_,i)=>`<i style="--x:${(i*37)%100}%;--d:${3+(i%5)*.7}s;--w:${(i*53)%40-20}px;animation-delay:${(i*.43)%4}s"></i>`).join('')}</div>`;
const RUNES='ᚠᚢᚦᚨᚱᚲᚷᚹᚺᚾᛁᛃᛇᛈᛉᛊᛏᛒᛖᛗᛚᛜᛞᛟ';
const RCIRCLE=`<svg class="mfrc" viewBox="0 0 300 300" aria-hidden="true"><g class="mfrc1"><circle cx="150" cy="150" r="138" fill="none" stroke="#9a70ff" stroke-width="2" opacity=".55"/><circle cx="150" cy="150" r="122" fill="none" stroke="#9a70ff" stroke-width="1" stroke-dasharray="3 6" opacity=".6"/>${[...RUNES].map((c,i)=>{const a=i/RUNES.length*Math.PI*2;return `<text x="${(150+Math.cos(a)*130).toFixed(1)}" y="${(150+Math.sin(a)*130+5).toFixed(1)}" text-anchor="middle" font-size="14" fill="#c8b0ff" transform="rotate(${(a*180/Math.PI+90).toFixed(0)} ${(150+Math.cos(a)*130).toFixed(1)} ${(150+Math.sin(a)*130).toFixed(1)})" style="animation-delay:${(i*.37)%3}s">${c}</text>`}).join('')}</g><g class="mfrc2"><path d="M150 40 245 205H55z" fill="none" stroke="#7a50e0" stroke-width="1.5" opacity=".5"/><path d="M150 260 55 95h190z" fill="none" stroke="#7a50e0" stroke-width="1.5" opacity=".5"/><circle cx="150" cy="150" r="70" fill="none" stroke="#b090ff" stroke-width="1" opacity=".5"/></g></svg>`;
const SECMAX=3,secN=it=>(it.aff||[]).filter(a=>!a.main&&!a.bonus&&!a.fuse).length;
const pips3=n=>`<span class="mfpips" aria-hidden="true">${[0,1,2].map(i=>`<i class="${i<n?'on':''}"></i>`).join('')}</span>`;
function fAffList(it){
  const k=upMul(it);
  return `<ul class="mfaff">${affOrd(it.aff).map(a=>`<li class="${a.main?'mn':''}">${fmtStat(a.s,a.v*k)}${a.main?' <em>principale</em>':a.bonus?' <em>bonus</em>':a.fuse?' <em>fusion</em>':''}</li>`).join('')}${Array.from({length:Math.max(0,SECMAX-secN(it))},()=>'<li class="free">Emplacement libre</li>').join('')}</ul>`}
function scrollPool(it,t){
  const T=SC_T[t],have=new Set(it.aff.filter(a=>!a.main).map(a=>a.s));
  let p=T.pool.map(([s,w])=>({s:s==='main'?mainStat(it):s,w})); const p2=p.filter(x=>!have.has(x.s)); return p2.length?p2:p }
const upCostG={sc:it=>Math.round(100+it.ilvl*10),gem:it=>Math.round(250*(it.rarity+1)+it.ilvl*8),st:it=>Math.round(80*((it.up||0)+1)+it.ilvl*6)};
function fUpInfo(it,k){
  /* {ok, why, cost, chance, html} */
  if(!k) return null;
  if(k==='cr_asc'||k==='fu_ap') return fUpInfo9(it,k);
  if(k==='rm_aff') return rmInfo(it);
  const N=NEWI[k];
  if(N&&N.sc){ const pool=scrollPool(it,N.sc),tw=pool.reduce((a,b)=>a+b.w,0),[lo,hi]=SC_R[N.r],m=RAR[it.rarity].m*upMul(it),full=secN(it)>=SECMAX;
    const rows=pool.map(x=>{const p=x.w/tw*100,a=affVal(x.s,it.ilvl,RAR[it.rarity].m*slotF(it,x.s)*lo),b=affVal(x.s,it.ilvl,RAR[it.rarity].m*slotF(it,x.s)*hi);return `<div><span>${STAT_N[x.s]}</span><i><b style="width:${p}%"></b></i><em class="num">${String(Math.round(p*10)/10).replace('.',',')} %</em><small class="num">${x.s==='ap'?'+1':fmtStat(x.s,a*upMul(it)).replace(' '+STAT_N[x.s],'')+' à '+fmtStat(x.s,b*upMul(it)).replace(' '+STAT_N[x.s],'').replace('+','')}</small></div>`}).join('');
    return {ok:!full,why:full?'Plus d’emplacement libre (3 / 3).':'',cost:{gold:upCostG.sc(it)},chance:100,title:N.n,rar:N.r,
      html:`<p>${esc(SC_T[N.sc].d)}</p><p>Affixes secondaires : <b class="num">${secN(it)} → ${Math.min(SECMAX,secN(it)+1)}</b> / 3.</p><h4>Affixe obtenue</h4><div class="mfprob">${rows}</div><h4>Valeur selon la rareté du parchemin</h4><table class="mftab">${[1,2,3,4].map(r=>`<tr class="${r===N.r?'cur':''}"><td style="color:var(--r${r})">${RAR[r].n}</td><td class="num">${Math.round(SC_R[r][0]*100)}–${Math.round(SC_R[r][1]*100)} %</td></tr>`).join('')}</table><small class="mute">Pourcentage de la valeur maximale au niveau de l’objet (${it.ilvl}), multiplié par la rareté et le niveau de l’objet.</small>`} }
  const g=GEMK[k];
  if(k==='prisme') return prismInfo(it);
  if(g!=null){ const ok=it.rarity===g,f=RAR[g+1].m/RAR[g].m,kk=upMul(it);
    return {ok,why:ok?'':`Cette pierre s’utilise sur un objet ${RAR[g].n.toLowerCase()} (objet actuel : ${RAR[it.rarity].n.toLowerCase()}).`,cost:{gold:upCostG.gem(it)},chance:100,title:MAT_OBJ[k],rar:g+1,
      html:`<p>Rareté <b style="color:var(--r${g})">${RAR[g].n}</b> → <b style="color:var(--r${g+1})">${RAR[g+1].n}</b>. Toutes les affixes de l’objet, actuelles et futures, gagnent <b>+${Math.round((RAR[g+1].m-RAR[g].m)*100)} %</b> de leur valeur de base${g+1===4?', et l’objet obtient son pouvoir légendaire':''}.</p>${ok?`<h4>Aperçu</h4><ul class="mfprev">${it.aff.map(a=>`<li>${fmtStat(a.s,a.v*kk)} → <b class="ok">${fmtStat(a.s,affRound(a.s,a.v*f)*kk)}</b></li>`).join('')}</ul>`:''}<h4>Paliers de rareté</h4><table class="mftab">${RAR.map((R,r)=>`<tr class="${r===g+1?'cur':''}"><td style="color:var(--r${r})">${R.n}</td><td>${r?MAT_OBJ[Object.keys(GEMK).find(x=>GEMK[x]===r-1)]:'—'}</td><td class="num">×${String(R.m).replace('.',',')}</td></tr>`).join('')}</table>`} }
  if(k==='st_up'){ const mx=(it.up||0)>=10,b=UI.fBon&&NEWI[UI.fBon]&&fsHave(UI.fBon)?NEWI[UI.fBon].bon:0,base=mx?0:UP_CH[it.up||0],ch=Math.min(100,base+b);
    const nd=stNeed(it),hv=fsHave('st_up'); return {ok:!mx&&hv>=nd,why:mx?'Niveau maximum atteint (+10).':hv<nd?`Il faut ${nd} Pierres de renforcement à ce niveau (vous en avez ${hv}).`:'',need:nd,cost:{gold:upCostG.st(it)},chance:ch,title:'Pierre de renforcement',rar:0,
      html:`<p>Niveau <b class="num">+${it.up||0} → +${Math.min(10,(it.up||0)+1)}</b> : +3 % à toutes les statistiques. Pierres nécessaires : <b class="num">${nd}</b> (1 jusqu’à +5, puis 2). En cas d’échec, ${nd>1?'les pierres':'la pierre'}${b?' et le bonus sont perdus':nd>1?' sont perdues':' est perdue'} mais l’objet reste intact.</p><h4>Chance de réussite</h4><div class="mfchance"><div class="mfring" style="--p:${ch}"><b class="num">${ch} %</b></div><ul><li>Base au niveau +${(it.up||0)+1} <b class="num">${base} %</b></li>${b?`<li>${MAT_OBJ[UI.fBon]} <b class="num ok">+${b} %</b></li>`:'<li class="mute">Aucun bonus de réussite</li>'}</ul></div><h4>Réussite selon le niveau</h4><table class="mftab grid"><tr>${UP_CH.map((_,i)=>`<td>+${i+1}</td>`).join('')}</tr><tr>${UP_CH.map((p,i)=>`<td class="num ${i===(it.up||0)?'cur':''}">${p}</td>`).join('')}</tr><tr>${UP_CH.map((p,i)=>`<td class="num">${i>=5?2:1}</td>`).join('')}</tr></table><small class="mute">Ligne 2 : chance de réussite (%). Ligne 3 : pierres nécessaires.</small>`} }
  return null;
}
const affRound=(s,v)=>s==='ap'?v:PCT.has(s)?Math.max(.5,r1(v)):Math.max(1,Math.round(v));
const stKeys=()=>{const o=new Set();if(ACC&&ACC.stash&&Array.isArray(ACC.stash.tabs))for(const T of ACC.stash.tabs)for(const e of (T.bag||[]))if(e.o.mat&&e.o.n>0)o.add(e.o.mat);return o};
const FST_IC='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10h18v10H3zM3 10l2-5h14l2 5M10 13h4"/></svg>';
function fOwn(fn,act,empty){
  const sk=stKeys(),ks=[...new Set([...S.bag.filter(e=>e.o.mat).map(e=>e.o.mat),...sk])].filter(k=>fn(k)&&matAll(k)>0).sort((a,b)=>nwR(a)-nwR(b)||String(a).localeCompare(b));
  if(!ks.length) return `<small class="mute">${empty}</small>`;
  return `<div class="mfown">${ks.map(k=>{const b=matCount(k),c=stashCount(k);return `<button class="zlt" style="--rc:var(--r${nwR(k)})" data-act="${act}" data-k="${k}" data-tip="nw:${k}" aria-label="${esc(MAT_OBJ[k]||k)} : ${fmt(b)} dans l’inventaire, ${fmt(c)} dans le coffre"><svg class="mfi" viewBox="0 0 24 24">${MI[k]}</svg><em class="num">${fmt(b+c)}</em>${c?`<i class="mfst${b?'':' only'}">${FST_IC}</i>`:''}</button>`}).join('')}</div><small class="mfstl"><i class="mfst">${FST_IC}</i> dans le coffre · utilisable directement</small>`}
function forgeUp(){
  const h=S.heroes[0],found=UI.fItem?findItem(UI.fItem):null,it=found&&found.it;
  if(UI.fUp&&fsHave(UI.fUp)<1) UI.fUp=null; if(UI.fBon&&fsHave(UI.fBon)<1) UI.fBon=null;
  const top=`<div id="fslot" data-act="fsPick" data-s="top" class="mfs big ${it?'full item':''} ${UI.invHL==='top'&&UI.invOpen?'pick':''}" ${it?`style="--rc:var(--r${it.rarity})" data-tip="f:${it.id}"`:''}>${it?`${bigIcon(it)}${it.up?`<em class="mfup num">+${it.up}</em>`:''}`:'<small>Déposez l’objet à améliorer</small>'}</div>`;
  const bottom=`<div class="mfrow1">${fsSlot('up',UI.fUp,'Amélioration','sm',upNeed82(it,UI.fUp))}${UI.fUp==='st_up'?fsSlot('bon',UI.fBon,'Bonus','xs'):''}</div>`;
  const head=it?`<div class="mfhead">${helpBtn()}<span class="mfht"><b>${esc(it.name)}</b><small style="color:var(--r${it.rarity})">${RAR[it.rarity].n}</small><span class="mfaffc" ${ttip('Affixes secondaires','Ajoutez jusqu’à 3 affixes avec des parchemins. Les affixes principales, les statistiques fixes et l’affixe bonus d’un objet rare ne comptent pas.')}>Affixes <b class="num">${secN(it)} / 3</b>${pips3(secN(it))}</span></span>${it?`<button class="mfx" data-act="fClear" ${ttip('Retirer l’objet')}>${uic('xx')}</button>`:''}</div>`:`<div class="mfhead">${helpBtn()}<span class="mfht"><b>Enclume</b><small>Aucun objet posé</small></span></div>`;
  let right;
  if(!it){ const eq=SLOTS.map(s=>h.equip[s]).filter(Boolean);
    right=`<h3>Aucun objet</h3><p>Glissez un équipement de l’inventaire dans le grand cercle, ou faites un clic droit dessus.</p><button class="btn" data-act="invOpen">${uic('bag')} Ouvrir l’inventaire <kbd>I</kbd></button><h4>Objets portés</h4>${fDoll84()}${fBagList()}`}
  else{ const I=fUpInfo(it,UI.fUp);
    const ownH=`<h4>Améliorations disponibles</h4>${fOwn(isUpK,'fSet','Aucune, ni dans l’inventaire ni dans le coffre. Les parchemins se créent dans l’Enchantement ; les pierres se trouvent en aventure.')}`;
    if(!I) right=`${ownH}<h3 class="mfh2">Affixes de l’objet</h3>${fAffList(it)}`;
    else right=`${ownH}<h3 class="mfh2">${esc(I.title)}</h3><small class="mfrar" style="color:var(--r${I.rar})">${RAR[I.rar].n}</small>${I.html}<h4>Affixes actuelles</h4>${fAffList(it)}<div class="mfgo">${I.why?`<p class="lockr">${I.why}</p>`:''}<span class="mfok">Réussite <b class="num">${I.chance} %</b></span><div class="mfcost">Coût : ${costHTML(I.cost)}</div><button class="btn pri amgo" data-act="fDo" ${I.ok&&canPay(I.cost)?'':'disabled'}>${uic('plus')} Renforcer</button></div>`;
  }
  return `<div class="mfwork ${fHelpOn()?'':'nohelp'}">${fHelpOn()?`<aside class="mfl">${EXPL.up}</aside>`:''}
   <section class="mfc forge" id="mfc">${ANVIL}${EMBERS}${head}<div class="mfalt">${top}<div class="mflink"></div>${bottom}</div><small class="mfhint">Glissez les objets depuis l’inventaire ou faites un clic droit dessus.</small></section>
   <aside class="mfr">${right}</aside></div>`;
}
function enchInfo(){
  const c=UI.eCat&&fsHave(UI.eCat)?UI.eCat:null,p=UI.eP&&fsHave(UI.eP)>=3?UI.eP:null,e=UI.eE&&fsHave(UI.eE)?UI.eE:null,r=UI.eR&&fsHave(UI.eR)?UI.eR:null;
  const t=e?NEWI[e].ess:null,rr=r?NEWI[r].rune:null,out=t&&rr?'sc_'+t+rr:null,cost={gold:40+60*(rr||1)};
  return {ok:!!(c&&p&&e&&r),out,cost,t,rr,c,p,e,r};
}
function forgeEnch(){
  ['eCat','eP','eE','eR'].forEach(k=>{if(UI[k]&&fsHave(UI[k])<1)UI[k]=null});
  const I=enchInfo();
  const top=`<div class="mfcore">${RCIRCLE}${fsSlot('cat',UI.eCat,'Parchemin vierge','big')}</div>`;
  const bottom=`<div class="mfrow3">${fsSlot('p',UI.eP,'Poudre runique','sm',3)}${fsSlot('e',UI.eE,'Essence magique')}${fsSlot('r',UI.eR,'Rune')}</div>`;
  const O=I.out&&NEWI[I.out];
  const chk=(ok,txt)=>`<li class="${ok?'ok':'no'}">${uic(ok?'check':'xx')} ${txt}</li>`;
  const right=`<h4 class="mfh1">Composants disponibles</h4>${fOwn(k=>{const N=NEWI[k];return k==='sc_blank'||k==='pd_rune'||!!(N&&(N.ess||N.rune))},'fSet','Aucun composant, ni dans l’inventaire ni dans le coffre.')}<h3 class="mfh2">Résultat</h3>${O?`<div class="mfres" style="--rc:var(--r${O.r})" data-tip="nw:${I.out}"><svg class="mfi" viewBox="0 0 24 24">${O.svg}</svg><span><b>${O.n}</b><small style="color:var(--r${O.r})">${RAR[O.r].n}</small></span></div><p class="mfsm">${esc(O.d)}</p>`:'<p class="mute">Complétez la combinaison pour voir le parchemin obtenu.</p>'}
   <h4>Combinaison</h4><ul class="mfcomb">${chk(I.c,'Parchemin vierge')}${chk(I.p,`Poudre runique ×3 <small class="num">(${fmt(matAll('pd_rune'))})</small>`)}${chk(I.e,I.e?`${MAT_OBJ[I.e]} → ${SC_T[I.t].n}`:'Essence magique (choisit le type)')}${chk(I.r,I.r?`${MAT_OBJ[I.r]} → ${RAR[I.rr].n}`:'Rune (choisit la rareté)')}</ul>
   <h4>Rareté selon la rune</h4><table class="mftab">${['ru_min','ru_maj','ru_anc','ru_pri'].map(k=>`<tr class="${I.r===k?'cur':''}"><td><span class="mfdot" style="background:var(--r${NEWI[k].r})"></span>${NEWI[k].n}</td><td style="color:var(--r${NEWI[k].r})">${RAR[NEWI[k].r].n}</td></tr>`).join('')}</table>
   <h4>Type selon l’essence</h4><table class="mftab">${Object.entries(SC_T).map(([t,T])=>`<tr class="${I.t===t?'cur':''}"><td>${NEWI[T.es].n.replace('Essence magique ','Essence ')}</td><td>${T.n}</td></tr>`).join('')}</table>
   <div class="mfgo"><span class="mfok">Réussite <b class="num">100 %</b></span><div class="mfcost">Coût : ${costHTML(I.cost)}</div><button class="btn pri amgo" data-act="eDo" ${I.ok&&canPay(I.cost)?'':'disabled'}>${uic('spark')} Enchanter</button></div>`;
  return `<div class="mfwork ${fHelpOn()?'':'nohelp'}">${fHelpOn()?`<aside class="mfl">${EXPL.ench}</aside>`:''}
   <section class="mfc ench" id="mfc"><div class="mfhead">${helpBtn()}<span class="mfht"><b>Autel d’enchantement</b><small>Catalyseur et combinaison</small></span></div><div class="mfalt">${top}<div class="mflink"></div>${bottom}</div><small class="mfhint">Glissez les objets depuis l’inventaire ou faites un clic droit dessus.</small></section>
   <aside class="mfr">${right}</aside></div>`;
}
function viewForge(){
  if(!['forge','ench'].includes(UI.ws)) UI.ws='forge';
  if(!FSUB.some(([k])=>k===UI.fMode)) UI.fMode='up';
  const ws=WORKSHOPS.map(([k,i,n,d],j)=>j>1?`<div class="mawt lock" aria-disabled="true" ${ttip(n,SOON)}><span class="mawi">${uic(i)}</span><span><b>${n}</b><small>${SOON}</small></span>${uic('lock','malk')}</div>`
    :`<button class="mawt ${UI.ws===k?'on':''}" data-act="ws" data-w="${k}" aria-pressed="${UI.ws===k}"><span class="mawi">${uic(i)}</span><span><b>${n}</b><small>${j?'Créer des parchemins d’amélioration.':'Renforcer et recycler l’équipement.'}</small></span></button>`).join('');
  const recB=`<button class="marec" data-act="recOpen" ${ttip('Livre des recettes','Toutes les recettes d’enchantement, de fusion et d’amélioration.')}>${uic('book')}<span>Recettes</span></button>`;
  if(UI.ws==='ench'){ const em=UI.eMode==='fuse'?'fuse':'ench',es=`<div class="masub" role="tablist" aria-label="Enchantement">${[['ench','spark','Enchanter'],['fuse','star','Fusion']].map(([k,i,n])=>`<button role="tab" aria-selected="${em===k}" class="${em===k?'on':''}" data-act="eMode" data-m="${k}">${uic(i)}<span>${n}</span></button>`).join('')}${recB}</div>`;
    return `<div class="ma1"><div class="mawts">${ws}</div><div class="mabody">${es}${em==='fuse'?forgeFuse():forgeEnch()}</div></div>` }
  const sub=`<div class="masub" role="tablist" aria-label="Forge">${FSUB.map(([k,i,n])=>`<button role="tab" aria-selected="${UI.fMode===k}" class="${UI.fMode===k?'on':''}" data-act="fMode" data-m="${k}">${uic(i)}<span>${n}</span></button>`).join('')}${typeof recB!=='undefined'?recB:''}</div>`;
  return `<div class="ma1"><div class="mawts">${ws}</div><div class="mabody">${sub}${UI.fMode==='up'?forgeUp():UI.fMode==='salv'?forgeSalv():forgeCreate()}</div></div>`;
}
/* placement des objets dans les cases */
function fPlace(o,slot){
  if(!o) return; UI.invHL=null;
  if(!o.mat){ UI.ws='forge'; UI.fMode='up'; UI.fItem=o.id; render(); return }
  const k=o.mat,N=NEWI[k];
  const want=k==='sc_blank'?'cat':k==='pd_rune'?'p':N&&N.ess?'e':N&&N.rune?'r':N&&N.bon?'bon':isUpK(k)?'up':null;
  if(!want){ toast('Cet objet ne sert pas à l’amélioration.'); return }
  if(slot&&slot!==want&&!(slot==='up'&&want==='bon')){ toast(`${MAT_OBJ[k]||k} ne va pas dans cette case.`) }
  if(['cat','p','e','r'].includes(want)){ UI.ws='ench'; UI[{cat:'eCat',p:'eP',e:'eE',r:'eR'}[want]]=k }
  else{ UI.ws='forge'; UI.fMode='up'; if(want==='bon'){ if(UI.fUp!=='st_up'){ toast('Le bonus de réussite s’utilise avec une Pierre de renforcement.'); if(!UI.fUp) UI.fUp=fsHave('st_up')?'st_up':null; if(UI.fUp!=='st_up'){render();return} } UI.fBon=k } else { UI.fUp=k; if(k!=='st_up') UI.fBon=null } }
  render();
}
function fFx(kind,ok){
  const c=$('#mfc'); if(!c) return; const a=c.querySelector(kind==='ench'?'.mfs.big':'#fslot'); if(!a) return;
  const r=a.getBoundingClientRect(),R=c.getBoundingClientRect(),cx=r.left-R.left+r.width/2,cy=r.top-R.top+r.height/2;
  const n=kind==='ench'?30:54;
  for(let i=0;i<n;i++){ const s=document.createElement('i'); s.className=kind==='ench'?'mfglint':'mfspark'; const ang=Math.random()*Math.PI*2,d=70+Math.random()*(kind==='ench'?130:200);
    s.style.left=(cx)/ZM+'px'; s.style.top=(cy)/ZM+'px'; s.style.setProperty('--dx',Math.cos(ang)*d+'px'); s.style.setProperty('--dy',(Math.sin(ang)*d-(kind==='ench'?0:40))+'px'); s.style.animationDelay=(Math.random()*.12)+'s'; c.append(s); setTimeout(()=>s.remove(),1300) }
  c.classList.remove('fxok','fxko','fxench'); void c.offsetWidth; c.classList.add(kind==='ench'?'fxench':ok?'fxok':'fxko');
}
function fDo(){
  const f=UI.fItem&&findItem(UI.fItem),it=f&&f.it,k=UI.fUp; if(!it||!k||fsHave(k)<1) return;
  const I=fUpInfo(it,k); if(!I||!I.ok||!canPay(I.cost)) return;
  pay(I.cost); let ok=true,msg='';
  const N=NEWI[k];
  if(N&&N.sc){ const pool=scrollPool(it,N.sc),a=wPick(pool,1)[0],[lo,hi]=SC_R[N.r],v=affVal(a.s,it.ilvl,RAR[it.rarity].m*rand(lo,hi)); const v2=affRound(a.s,v*slotF(it,a.s)); it.aff.push({s:a.s,v:v2}); qEv('aff'); removeMat(k,1); msg=`Nouvelle affixe : ${fmtStat(a.s,v2*upMul(it))}.` }
  else if(k==='prisme'){ const o=prismDo(it,I); ok=o.ok; msg=o.msg }
  else if(k==='rm_aff'){ msg=rmDo(it) }
  else if(GEMK[k]!=null){ const f2=RAR[it.rarity+1].m/RAR[it.rarity].m; for(const s of Object.keys(it.imp)) it.imp[s]=affRound(s,it.imp[s]*f2); it.aff.forEach(a=>a.v=affRound(a.s,a.v*f2)); it.rarity++; qEv('rar'); if(it.rarity>=4&&!it.leg){ it.leg=it.slot; if(!it.lp) it.lp=rollLp82() } removeMat(k,1); msg=`${esc(it.name)} devient ${RAR[it.rarity].n.toLowerCase()} !` }
  else if(k==='cr_asc'){ ascApply(it); removeMat(k,1); msg=`${esc(it.name)} passe au niveau d’objet ${it.ilvl} !` }
  else if(k==='fu_ap'){ it.aff.push({s:'ap',v:1,fuse:1}); removeMat(k,1); msg=`${esc(it.name)} gagne +1 Point d’action !` }
  else if(k==='st_up'){ const ch=I.chance; removeMat('st_up',I.need||1); if(UI.fBon&&fsHave(UI.fBon)) removeMat(UI.fBon,1); ok=Math.random()*100<ch; if(ok){it.up=(it.up||0)+1; qEv('up'); sEv('upmax',it.up); if(it.up>=10) sEv('up10'); msg=`Réussite : ${esc(it.name)} passe à +${it.up} !`} else msg=`Échec : l’objet reste à +${it.up||0}.` }
  if(fsHave(k)<1) UI.fUp=null; if(UI.fBon&&fsHave(UI.fBon)<1) UI.fBon=null;
  save(); renderHeader&&renderHeader(); render(); requestAnimationFrame(()=>fFx('forge',ok)); toast(msg);
}
function eDo(){
  const I=enchInfo(); if(!I.ok||!canPay(I.cost)) return;
  if(matRoom(I.out)<1){ toast('Inventaire plein.'); return }
  pay(I.cost); removeMat(I.c,1); removeMat(I.p,3); removeMat(I.e,1); removeMat(I.r,1); bagAddMat(S.bag,I.out,1); markNew(); qEv('ench');
  save(); render(); requestAnimationFrame(()=>fFx('ench',true)); toast(`${NEWI[I.out].n} (${RAR[NEWI[I.out].r].n.toLowerCase()}) créé : il est dans l’inventaire.`);
}

/* ---------- inventaire filtré pendant l'artisanat ---------- */
function wantSlot(o){
  if(!o) return null; if(!o.mat) return 'top';
  const k=o.mat,N=NEWI[k];
  return k==='sc_blank'?'cat':k==='pd_rune'?'p':N&&N.ess?'e':N&&N.rune?'r':N&&N.bon?'bon':isUpK(k)?'up':null;
}
function craftRel(o){ const w=wantSlot(o); if(!w) return false; if(UI.ws==='ench') return ['cat','p','e','r'].includes(w); return ['top','up','bon'].includes(w) }
function craftCls(o){
  if(UI.tab!=='forge'||UI.fMode==='salv'&&UI.ws!=='ench') return '';
  if(UI.invHL) return wantSlot(o)===UI.invHL?' hl':' dim';
  return craftRel(o)?'':' hidecraft';
}

