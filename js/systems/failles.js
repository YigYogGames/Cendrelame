/* Cendrelame · systems/failles.js (0.8.20)
   Failles temporelles : mode de haut niveau (niveau 50). On choisit un rang, puis 3 combats et un boss à la suite,
   sans récupérer ses PV entre les combats et avec 5 potions pour toute la faille.
   Butin : beaucoup d’or et de ressources, équipement niveau 85 et objets d’Ensemble (rareté verte). */
UIC.hour=UIC.hour||'<path d="M6 3h12M6 21h12M7 3c0 5 5 6 5 9s-5 4-5 9M17 3c0 5-5 6-5 9s5 4 5 9" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>';
const RIFT={lvl:50,max:10,pots:5,il:85,stages:[4,7,9,10]};
/* ---------- objets d’Ensemble : nouvelle rareté ---------- */
if(!RAR[6]) RAR.push({n:'Ensemble',aff:3,m:1.75,set:1});
if(EQ_RC.length<7) EQ_RC.push('#3fd07a');
const SET_SLOTS=['weapon','helm','armor','legs','boots','amulet'],SET_N=[2,4,6];
const SETS={
 g_bers:{n:'Fureur de l’Ancien Roi',suf:'de l’Ancien Roi',cls:'guerrier',spec:'bers',b:[{mods:{atkPct:12}},{mods:{crit:10,critDmg:25}},{pv:{killAp:1,skDmg:{k_sauv:40,k_pact:40}}}],
   d:['+12 % de Force.','+10 % de chance de critique et +25 % de dégâts critiques.','Tuer une cible rend 1 PA ; Frappe sauvage et Pacte de sang infligent +40 % de dégâts.']},
 g_def:{n:'Bastion d’Airain',suf:'d’Airain',cls:'guerrier',spec:'def',b:[{mods:{defPct:15,resPct:15}},{pv:{counter:12,shieldPct:15}},{pv:{cdRed:{d_for:2,g_mur:2},stunCh:25}}],
   d:['+15 % de Défense et de Résistance.','+12 % de chance de riposte ; boucliers +15 %.','Forteresse et Mur de boucliers : recharge −2 tours ; +25 % de chance d’étourdir.']},
 m_feu:{n:'Cendres de l’Éternel',suf:'de l’Éternel',cls:'mage',spec:'feu',b:[{mods:{magPct:12}},{pv:{dmgEl:{feu:8},burnExtra:10}},{pv:{skDmg:{f_bf:40},burnDur:1,cdRed:{f_met:1}}}],
   d:['+12 % d’Intelligence.','+8 % de dégâts de feu ; +10 % de chance de Brûlure supplémentaire.','Boule de feu +40 % de dégâts ; Brûlures +1 tour ; Météore : recharge −1 tour.']},
 m_foudre:{n:'Orage captif',suf:'de l’Orage captif',cls:'mage',spec:'foudre',b:[{mods:{magPct:12}},{pv:{dmgEl:{foudre:8},chgMax:1}},{pv:{skDmg:{z_ec:40},bounce:1,paraCh:10}}],
   d:['+12 % d’Intelligence.','+8 % de dégâts de foudre ; Charges maximum +1.','Éclair +40 % de dégâts ; Arc électrique rebondit 1 fois de plus ; +10 % de chance de paralyser.']},
 p_rem:{n:'Égide de l’Aube',suf:'de l’Aube',cls:'paladin',spec:'rem',b:[{mods:{defPct:15,resPct:15}},{pv:{sanctMax:2,healAdd:20}},{pv:{cdRed:{p_bou:2,r_div:2},shieldPct:25}}],
   d:['+15 % de Défense et de Résistance.','Bénédictions maximum +2 ; soins +20 %.','Bouclier béni et Bouclier divin : recharge −2 tours ; boucliers +25 %.']},
 p_tem:{n:'Verdict solaire',suf:'du Verdict solaire',cls:'paladin',spec:'tem',b:[{mods:{atkPct:12}},{pv:{dmgEl:{sacre:8},critEl:{sacre:6}}},{pv:{zeleMax:2,skDmg:{t_ver:40,t_jd:25}}}],
   d:['+12 % de Force.','+8 % de dégâts sacrés ; +6 % de chance de critique des sorts sacrés.','Zèle maximum +2 ; Verdict +40 % et Jugement dernier +25 % de dégâts.']}};
const setsOf=cls=>Object.entries(SETS).filter(([,s])=>s.cls===cls);
/* pièces portées par ensemble */
function setCount(h){ const n={}; for(const it of Object.values((h&&h.equip)||{})) if(it&&it.set&&SETS[it.set]) n[it.set]=(n[it.set]||0)+1; return n }
/* bonus actifs : l’ensemble doit correspondre à la classe et à la spécialisation du héros */
function setBonus(h){ const out=[]; if(!h) return out; const n=setCount(h);
  for(const [id,c] of Object.entries(n)){ const S0=SETS[id]; if(S0.cls!==h.cls||S0.spec!==h.spec) continue; SET_N.forEach((need,i)=>{ if(c>=need) out.push(S0.b[i]) }) }
  return out }
{ const _gs=gearStats; gearStats=function(h){ const g=_gs(h); for(const b of setBonus(h)) for(const [k,v] of Object.entries(b.mods||{})) g[k]=(g[k]||0)+v; return g } }
{ const _hx=hx; hx=function(h){ const g=_hx(h);
  for(const b of setBonus(h)) for(const [k,v] of Object.entries(b.pv||{})){ if(v&&typeof v==='object'){ g[k]=g[k]||{}; for(const [a,x] of Object.entries(v)) g[k][a]=(g[k][a]||0)+x } else g[k]=(g[k]||0)+v }
  return g } }
function setItem(id,slot){ const S0=SETS[id],h=S.heroes[0];
  const it=genItem(slot,RIFT.il,6,null,S0.cls); it.set=id; it.name=it.base+' '+S0.suf; delete it.leg; delete it.lp;
  it.cost={gold:20000,fer:12,cuir:12,cristal:8,essence:8,rune:4}; it.r82=1; return it }
/* infobulle : bloc de l’ensemble */
function setBlock(it){ const S0=SETS[it.set]; if(!S0) return ''; const h=S.heroes&&S.heroes[0],c=h?(setCount(h)[it.set]||0):0,ok=h&&h.cls===S0.cls&&h.spec===S0.spec;
  const sp=CLASSES[S0.cls].specs[S0.spec];
  return `<div class="setb"><h5>${esc(S0.n)} <span>(${c} / 6)</span></h5><div class="setp">${SET_SLOTS.map((_,i)=>`<i class="${i<c?'on':''}"></i>`).join('')}</div>
   ${SET_N.map((need,i)=>`<p class="${ok&&c>=need?'on':''}">(${need}) ${esc(S0.d[i])}</p>`).join('')}
   <small>${ok?'':`Bonus actifs seulement en ${esc(CLASSES[S0.cls].n)} · ${esc(sp.n)}. `}Se trouve dans les Failles temporelles.</small></div>` }
{ const _ic=itemCard; itemCard=function(it,foot,delta){ const s=_ic(it,foot,delta); if(!it||!it.set) return s; const i=s.lastIndexOf('</article>'); return i<0?s+setBlock(it):s.slice(0,i)+setBlock(it)+s.slice(i) } }

/* ---------- état ---------- */
const riftMax=()=>Math.min(RIFT.max,(S&&S.riftMax)||1);
const riftOpen=()=>!!(S.heroes[0]&&S.heroes[0].lvl>=RIFT.lvl);
const riftZone=r=>(r-1)%ZONES.length;
const riftHp=r=>.8*(1+.15*(r-1)),riftAtk=r=>.68*(1+.12*(r-1)),riftLvl=r=>58+2*r;
const riftGold=(r,boss)=>boss?10000+2500*(r-1):2500+500*(r-1);
const riftSetCh=(r,boss)=>boss?Math.min(40,15+2.5*(r-1)):Math.min(10,3+.5*(r-1));
const riftEqCh=boss=>boss?100:45;
const RIFT_EQW=[[0,0,45,38,15,2],[0,0,25,45,27,3]];
const pcd=x=>{ const v=Math.round((x-1)*100); return (v>=0?'+':'−')+Math.abs(v)+' %' };
const riftOn=()=>!!(S&&S.rift&&S.rift.going);
const riftStore=it=>{ if(bagAddItem(S.bag,it)){ markNew(); return 'sac' }
  try{ const [w,h]=SIZE(it); for(const T of stashD().tabs){ const sp=findSpot(T.bag,w,h,SW,SH); if(sp){ T.bag.push({x:sp[0],y:sp[1],o:it}); saveAcc(); return 'coffre' } } }catch(e){}
  gain(salvageValue(it)); return '' };

/* ---------- combats ---------- */
{ const _mk=mkEnemies; mkEnemies=function(z,st,n,diff){
  if(!riftOn()||C.test||C.raid){ C.riftT=null; return _mk(z,st,n,diff) }
  const R=S.rift,L=_mk(z,st,n,'myth'); C.diff='myth'; C.hero=false;
  C.riftT=`Faille temporelle · rang ${R.r} <small>${R.i<3?'combat '+(R.i+1)+' / 3':'boss'} · ${esc(ZONES[R.z].n)}</small>`;
  for(const e of L){ e.hp=e.maxHp=Math.round(e.maxHp*riftHp(R.r)*(e.boss?1.2:1)); e.atk*=riftAtk(R.r); e.mag*=riftAtk(R.r); e.lvl=riftLvl(R.r) }
  return L } }
{ const _mh=mkHeroUnit; mkHeroUnit=function(h){ const u=_mh(h); if(riftOn()&&!C.test&&!C.raid&&S.rift.hpR<1) u.hp=Math.max(1,Math.round(u.maxHp*S.rift.hpR)); return u } }
/* 5 potions pour toute la faille */
{ const _up=usePot; usePot=function(k){ if(riftOn()&&inFight()){ if(S.rift.pots<=0){ toast('Plus de potion pour cette faille (5 au maximum).'); return } const n0=cbCount(k); _up(k); if(cbCount(k)<n0){ S.rift.pots--; save(); renderActbar() } return } return _up(k) } }
function riftFight(){
  if(inFight()||!riftOn()) return; const R=S.rift,z0=UI.zone,s0=UI.stage;
  UI.tab='combat'; UI.advMode='rift'; UI.zone=R.z; UI.stage=RIFT.stages[R.i];
  startBattle(false); UI.zone=z0; UI.stage=s0;
  logLine(`Faille temporelle · rang ${R.r} · ${R.i<3?'combat '+(R.i+1)+' / 3':'boss'} · potions restantes : ${R.pots}`,'rd');
}
{ const _fin=finish; finish=async function(r){ if(!riftOn()||C.test||C.raid) return _fin.apply(this,arguments); return riftFinish(r) } }
function riftLoot(R,boss){
  const h=S.heroes[0],gf=heroStats(h).goldFind||0,gold=Math.round(riftGold(R.r,boss)*(1+gf/100)),Z=ZONES[R.z],mats={};
  const add=(k,v)=>{ if(v>0) mats[k]=(mats[k]||0)+v };
  add(Z.mats[0],boss?8+2*R.r:3+R.r); add(Z.mats[1],Z.mats[1]==='rune'?Math.ceil((boss?4+R.r:2+R.r)/3):boss?4+R.r:2+Math.ceil(R.r/2));
  add('st_up',boss?3:1); if(boss){ add('pd_rune',2+Math.floor(R.r/2)); add('rune',1+Math.floor(R.r/3)); if(Math.random()<.25+.03*R.r) add('gm_epi',1); if(Math.random()*100<5+R.r) add('prisme',1) }
  const items=[]; const nEq=boss?2:(Math.random()*100<riftEqCh(false)?1:0);
  for(let i=0;i<nEq;i++) items.push(genItem(slotType(pick(SLOTS)),RIFT.il,wpick(RIFT_EQW[boss?1:0]),null,h.cls));
  if(Math.random()*100<riftSetCh(R.r,boss)){ const L=setsOf(h.cls),mine=L.find(([,s])=>s.spec===h.spec),id=(mine&&Math.random()<.7?mine:pick(L))[0]; items.push(setItem(id,pick(SET_SLOTS))) }
  S.gold+=gold; gain(mats); const where=items.map(riftStore);
  R.loot.gold+=gold; for(const [k,v] of Object.entries(mats)) R.loot.mats[k]=(R.loot.mats[k]||0)+v; R.loot.items.push(...items.filter((_,i)=>where[i]).map(it=>({id:it.id,n:it.name,r:it.rarity,s:it.slot})));
  for(const it of items) if(it.set) setTimeout(()=>toast(`✦ Objet d’Ensemble : ${it.name} !`),500);
  return {gold,mats,items,where};
}
function riftFinish(res){
  C.pending=null;C.waiting=null;C.turn=null; const R=S.rift,hu=C.units.find(u=>u.team==='h'),boss=R.i===3;
  if(res==='win'){
    R.hpR=hu?Math.max(.05,hu.hp/hu.maxHp):1; const L=riftLoot(R,boss); qEv('kill',C.units.filter(u=>u.team==='e').length);
    if(boss){ S.riftMax=Math.max(riftMax(),Math.min(RIFT.max,R.r+1)); S.riftBest=Math.max(S.riftBest||0,R.r); R.going=0; UI.riftR=Math.min(RIFT.max,R.r+1);
      C.result={rift:1,win:true,boss:true,r:R.r,gold:L.gold,mats:L.mats,items:L.items,tot:R.loot,up:R.r<RIFT.max}; S.rift=null; logLine(`Faille du rang ${R.r} refermée !`,'hl') }
    else { R.i++; C.result={rift:1,win:true,r:R.r,i:R.i,gold:L.gold,mats:L.mats,items:L.items}; logLine('Victoire ! La faille continue…','hl') }
  }else{ C.result={rift:1,win:false,r:R.r,tot:R.loot}; S.rift=null; S.farm=false; logLine('La faille vous a rejeté…','cr') }
  C.phase='result'; save(); renderHeader(); renderTabs(); if(UI.tab==='combat') render();
}
/* barre de résultat */
{ const _ra=renderActbar0; renderActbar0=function(){ const el=$('#actbar'); if(!el||C.phase!=='result'||!C.result||!C.result.rift) return _ra();
  const r=C.result,chips=x=>matChip('gold',x.gold)+Object.entries(x.mats||{}).map(([k,v])=>matChip(k,v)).join('');
  const tiles=L=>L&&L.length?`<div class="ltiles">${L.map((i,n)=>`<span class="ltile${i.set?' rset':''}" style="--rc:var(--r${i.rarity})" data-tip="li:${n}" tabindex="0" aria-label="${esc(i.name)}, ${RAR[i.rarity].n}">${eqIco(i)}${ilTag(i)}</span>`).join('')}</div>`:'';
  if(!r.win){ el.innerHTML=`<div class="result lose"><h2 class="lose" style="margin-bottom:6px">Faille échouée · rang ${r.r}</h2><p style="margin:0 0 8px">Vous gardez le butin des combats gagnés${r.tot&&r.tot.gold?' : '+fmt(r.tot.gold)+' or et '+r.tot.items.length+' objet'+(r.tot.items.length>1?'s':''):''}.</p><div class="row"><button class="btn pri" data-act="riftHome">Retour aux failles</button></div></div>`; return }
  if(r.boss){ el.innerHTML=`<div class="result"><h2 style="margin-bottom:6px">Faille refermée · rang ${r.r}</h2><p style="margin:0 0 8px" class="num">Boss :${chips(r)}</p>${tiles(r.items)}<p class="mute" style="margin:6px 0">Total de la faille : ${fmt(r.tot.gold)} or · ${r.tot.items.length} objet${r.tot.items.length>1?'s':''}.${r.up?` Rang ${r.r+1} débloqué !`:''}</p><div class="row"><button class="btn pri" data-act="riftHome">Retour aux failles</button></div></div>`; return }
  el.innerHTML=`<div class="result"><h2 style="margin-bottom:6px">Combat ${r.i} / 3 remporté</h2><p style="margin:0 0 8px" class="num">${chips(r)}</p>${tiles(r.items)}<p class="mute" style="margin:6px 0">PV gardés : ${Math.round(S.rift.hpR*100)} % · potions restantes : ${S.rift.pots} / ${RIFT.pots}</p><div class="row"><button class="btn pri" data-act="riftNext">${r.i<3?'Combat suivant':'Affronter le boss'}</button><button class="btn" data-act="riftHome">Pause</button></div></div>` } }

/* ---------- écran (maquette A : portail) ---------- */
function viewRift(){
  const h=S.heroes[0],R=S.rift&&S.rift.going?S.rift:null,mx=riftMax();
  if(UI.riftR==null||UI.riftR>mx) UI.riftR=mx; const r=R?R.r:UI.riftR,z=riftZone(r),Z=ZONES[z],open=riftOpen();
  const nodes=[0,1,2,3].map(i=>{ const st=R?(i<R.i?'d':i===R.i?'c':'f'):'f',b=i===3;
    return `<div class="rfn ${st} ${b?'b':''}" ${ttip(b?'Boss : '+Z.boss.n:'Combat '+(i+1),b?'Le boss de la zone, déformé par la faille. Le battre referme la faille et ouvre le rang suivant.':`${[1,2,3][i]} ennemi${i?'s':''} de ${Z.n}.`)}><b>${b?uic('skull'):st==='d'?uic('check'):i+1}</b><small>${b?'Boss':'Combat '+(i+1)}</small></div>` }).join('<i class="rfl"></i>');
  const ranks=Array.from({length:RIFT.max},(_,k)=>{ const i=k+1,ok=i<=mx,done=i<mx||(S.riftBest||0)>=i;
    return `<button class="rfr ${i===r?'on':''} ${ok?'':'lk'}" ${ok&&!R?'':'disabled'} data-act="riftRank" data-r="${i}" ${ttip('Rang '+i,ok?`Ennemis niveau ${riftLvl(i)} · PV ${pcd(riftHp(i))} et dégâts ${pcd(riftAtk(i))} par rapport au mode Mythique · ${ZONES[riftZone(i)].n}`+(done?' · déjà refermé':''):`Refermez la faille du rang ${i-1} pour l’ouvrir.`)}>${i}<small>${done?'refermé':ok?'ouvert':''}</small></button>` }).join('');
  const pots=R?R.pots:RIFT.pots,pips=Array.from({length:RIFT.pots},(_,i)=>`<i class="${i<pots?'on':''}"></i>`).join('');
  const zl=(rc,ic,em,tip)=>`<span class="zlt zlg" style="--rc:${rc}" ${tip}>${ic}<em>${em}</em></span>`;
  const loot=zl('#c99a3a',matIcon('gold'),fmt(riftGold(r,true)),ttip('Or',`${fmt(riftGold(r,false))} or par combat, ${fmt(riftGold(r,true))} sur le boss (plus votre trouvaille d’or).`))
    +zl('var(--line2)',matIcon(Z.mats[0]),'×'+(3+r),ttip(MAT_N[Z.mats[0]]||Z.mats[0],'Par combat ; beaucoup plus sur le boss.'))
    +zl('var(--line2)',matIcon('st_up'),'×3',ttip(MAT_N.st_up||'Pierre de renforcement','1 par combat, 3 sur le boss.'))
    +zl('var(--r4)',eqSvg('armor',EQ_RC[4]),'niv. '+RIFT.il,ttip('Équipement niveau '+RIFT.il,`${riftEqCh(false)} % par combat, 2 objets garantis sur le boss (Rare à Divin).`))
    +zl('var(--r6)',eqSvg('armor',EQ_RC[6]),pc82(riftSetCh(r,true)),ttip('Objet d’Ensemble',`Boss : ${pc82(riftSetCh(r,true))} · combats : ${pc82(riftSetCh(r,false))}. 70 % de chances que ce soit l’ensemble de votre spécialisation.`));
  const sets=setsOf(h.cls).map(([id,s])=>{ const c=setCount(h)[id]||0,sp=CLASSES[s.cls].specs[s.spec];
    return `<div class="rfset ${h.spec===s.spec?'me':''}" ${ttip(s.n,SET_N.map((n,i)=>`(${n}) ${s.d[i]}`).join(' '))}><b>${esc(s.n)}</b><small>${esc(sp.n)} · ${c} / 6 portées</small></div>` }).join('');
  const btn=!open?`<p class="hint">${uic('lock')} Les failles s’ouvrent au niveau ${RIFT.lvl} (vous êtes niveau ${h.lvl}).</p>`
    :R?`<div class="row"><button class="btn danger" data-act="riftQuit" ${ttip('Abandonner','La faille se referme. Vous gardez le butin déjà gagné.')}>${UI.confirm==='riftQuit'?'Confirmer':'Abandonner'}</button><button class="btn pri big" style="flex:1" data-act="riftNext">${R.i<3?'Combat '+(R.i+1):'Affronter le boss'}</button></div>`
    :`<button class="btn pri big" style="width:100%" data-act="riftEnter" ${ttip('Entrer dans la faille','3 combats puis le boss, sans récupérer vos PV entre les combats, avec 5 potions au total.')}>Entrer dans la faille</button>`;
  return `<div class="amap rift20">
   <div class="amfield rfield"><div class="rfportal" style="--z:${z}"><span class="rfv"></span><span class="rfin"><small>Faille temporelle</small><b>Rang ${r}</b><em>${esc(Z.n)}</em></span></div>
    <div class="rfpath">${nodes}</div>${R?`<p class="rfhp">PV : ${Math.round(R.hpR*100)} % · butin gagné : ${fmt(R.loot.gold)} or · ${R.loot.items.length} objet${R.loot.items.length>1?'s':''}</p>`:''}</div>
   <aside class="aminfo" aria-label="Faille temporelle"><div class="amhead">${zoneScene(z,'rh')}<span><small>Niveau ${RIFT.lvl} requis · meilleur rang refermé : ${S.riftBest||0}</small><h2>Faille temporelle</h2></span></div>
    <div class="ambody">
     <p class="amnote">3 combats puis le boss. Vos PV ne remontent pas entre les combats.</p>
     <h4>Rang de la faille</h4><div class="rfranks">${ranks}</div>
     <h4>Potions ${R?'restantes':'emportées'} <span class="amcnt">· ${pots} / ${RIFT.pots} pour toute la faille</span></h4><div class="rfpots" ${ttip('Potions','Vous pouvez boire 5 potions de votre ceinture pendant toute la faille.')}>${pips}</div>
     <h4>Butin du rang ${r}</h4><div class="zloot">${loot}</div>
     <h4>Ensembles ${esc(CLASSES[h.cls].n)}</h4><div class="rfsets">${sets}</div>
     <div style="margin-top:auto;padding-top:10px">${btn}</div>
    </div></aside></div>`;
}
Object.assign(A,{
  riftRank:d=>{ if(riftOn()) return; UI.riftR=Math.max(1,Math.min(riftMax(),+d.r)); render() },
  riftEnter:()=>{ if(inFight()||riftOn()) return; if(!riftOpen()){ toast(`Niveau ${RIFT.lvl} requis.`); return } const r=Math.max(1,Math.min(riftMax(),UI.riftR||1));
    S.rift={going:1,r,z:riftZone(r),i:0,hpR:1,pots:RIFT.pots,loot:{gold:0,mats:{},items:[]}}; save(); riftFight() },
  riftNext:()=>{ if(!riftOn()) return; C.phase='idle'; C.result=null; riftFight() },
  riftHome:()=>{ C.phase='idle'; C.result=null; UI.tab='combat'; UI.advMode='rift'; render() },
  riftQuit:()=>{ if(UI.confirm!=='riftQuit'){ UI.confirm='riftQuit'; render(); return } UI.confirm=null; S.rift=null; save(); toast('Vous quittez la faille. Le butin gagné est conservé.'); render() } });
/* décor : la zone de la faille */
{ const _sz=sceneZone; sceneZone=function(){ if(UI.tab==='combat'&&UI.advMode==='rift'&&!(typeof C!=='undefined'&&C.phase&&C.phase!=='idle')) return S.rift?S.rift.z:riftZone(Math.min(riftMax(),UI.riftR||1)); return _sz() } }
