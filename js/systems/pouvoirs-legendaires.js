/* Cendrelame · systems/pouvoirs-legendaires.js */
/* ================= 0.8.6 : pouvoirs légendaires variés ================= */
const LPW={
 prec:{n:'Œil du prédateur',st:{crit:6,critDmg:10},d:'+6 % de chances de coup critique et +10 % de dégâts critiques.'},
 pen:{n:'Brise-armure',gx:{defPen:6},d:'Vos coups ignorent 6 % de la Défense ennemie.'},
 rip:{n:'Représailles',gx:{counter:8},d:'8 % de chance de contre-attaquer (60 % de votre attaque) quand vous êtes touché.'},
 opp:{n:'Opportuniste',gx:{vsCC:8},d:'+8 % de dégâts contre les cibles étourdies, paralysées ou ralenties.'},
 soif:{n:'Soif de survie',gx:{lsLow:4},d:'+4 % de vol de vie quand vos PV sont sous 50 %.'},
 rem:{n:'Dernier rempart',gx:{lowHpDef:8},d:'−8 % de dégâts subis quand vos PV sont sous 35 %.'},
 fur:{n:'Fureur du désespoir',gx:{lowHpDmg:1},d:'+1 % de dégâts par tranche de 10 % de PV manquants (jusqu’à +9 %).'},
 egi:{n:'Égide',gx:{shieldPct:15},d:'Vos boucliers et barrières sont 15 % plus solides.'},
 seve:{n:'Sève ancienne',st:{regen:1},d:'Rend 1 % de vos PV max au début de chacun de vos tours.'},
 mois:{n:'Moisson',gx:{killAp:1},max:1,d:'Vaincre un ennemi rend 1 PA (une fois par tour). Ne se cumule pas.'}};
const LP_MAXN=3;
const lpOf=it=>it&&it.leg?(LPW[it.lp]?it.lp:'prec'):null;
const rollLp82=()=>pick(Object.keys(LPW));
let legN82=it=>LPW[lpOf(it)].n, legD82=it=>LPW[lpOf(it)].d;
let legStat82=it=>LPW[lpOf(it)].st||{};
const _genItem86=genItem; genItem=function(...a){ const it=_genItem86(...a); if(it&&it.leg&&!it.lp) it.lp=rollLp82(); return it };
const _hx86=hx; hx=function(h){ const g=_hx86(h); if(!h||!h.equip) return g; const cnt={};
  for(const it of Object.values(h.equip)){ const k=lpOf(it); if(k&&LPW[k].gx) cnt[k]=(cnt[k]||0)+1 }
  for(const [k,n] of Object.entries(cnt)){ const P=LPW[k],m=Math.min(n,P.max||LP_MAXN); for(const [s,v] of Object.entries(P.gx)) g[s]=(g[s]||0)+v*m }
  return g };
/* ================= 0.8.7 : pouvoirs légendaires (suite), Pierre de remodelage ================= */
const ELR=['rFeu','rGlace','rFoudre','rTerre'];
const fv=v=>String(r1(v)).replace('.',',');
const LPV={
 prec:{st:{crit:3,critDmg:7},D:m=>`+${fv(3*m)} % de chances de coup critique et +${fv(7*m)} % de dégâts critiques.`},
 pen:{gx:{defPen:6},D:m=>`Vos coups ignorent ${fv(6*m)} % de la Défense ennemie.`},
 rip:{gx:{counter:8},D:m=>`${fv(8*m)} % de chance de contre-attaquer (60 % de votre attaque) quand vous êtes touché.`},
 opp:{gx:{vsCC:8},D:m=>`+${fv(8*m)} % de dégâts contre les cibles étourdies, paralysées ou ralenties.`},
 soif:{gx:{lsLow:4},D:m=>`+${fv(4*m)} % de vol de vie quand vos PV sont sous 50 %.`},
 rem:{gx:{lowHpDef:8},D:m=>`−${fv(8*m)} % de dégâts subis quand vos PV sont sous 35 %.`},
 fur:{gx:{lowHpDmg:1},D:m=>`+${fv(m)} % de dégâts par tranche de 10 % de PV manquants (jusqu’à +${fv(9*m)} %).`},
 egi:{gx:{shieldPct:15},D:m=>`Vos boucliers et barrières sont ${fv(15*m)} % plus solides.`},
 seve:{st:{regen:1},D:m=>`Rend ${fv(m)} % de vos PV max au début de chacun de vos tours.`},
 mois:{gx:{killAp:1},max:1,fix:1,D:()=>'Vaincre un ennemi rend 1 PA (une fois par tour). Ne se cumule pas.'},
 elem:{n:'Garde des éléments',st:{rFeu:5,rGlace:5,rFoudre:5,rTerre:5},D:m=>`+${fv(5*m)} % à toutes les résistances élémentaires (Feu, Glace, Foudre, Terre).`},
 vita:{n:'Vitalité',st:{hpPct:10},D:m=>`+${fv(10*m)} % de PV max.`}};
for(const [k,v] of Object.entries(LPV)){ LPW[k]=Object.assign(LPW[k]||{},v); LPW[k].d=v.D(1); delete LPW[k].gx; delete LPW[k].st; if(v.gx) LPW[k].gx=v.gx; if(v.st) LPW[k].st=v.st }
const lpM=it=>it&&it.rarity>=5?1.5:1;
let LP_ALLOW=null;
legD82=it=>{ const P=LPW[lpOf(it)]; if(!P) return ""; return P.D(P.fix?1:lpM(it)) };
legStat82=it=>{ const k=lpOf(it),P=LPW[k]; if(!P||!P.st) return {}; if(LP_ALLOW&&!LP_ALLOW.has(it)) return {}; const m=P.fix?1:lpM(it); return Object.fromEntries(Object.entries(P.st).map(([s,v])=>[s,v*m])) };
function lpAllow(h){ const by={}; for(const it of Object.values(h.equip||{})){ const k=lpOf(it); if(k) (by[k]=by[k]||[]).push(it) }
  const A=new Set(); for(const [k,L] of Object.entries(by)){ L.sort((a,b)=>b.rarity-a.rarity); L.slice(0,LPW[k].max||LP_MAXN).forEach(x=>A.add(x)) } return A }
const _gearStats87=gearStats; gearStats=function(h){ const prev=LP_ALLOW; LP_ALLOW=lpAllow(h); try{ return _gearStats87(h) } finally{ LP_ALLOW=prev } };
hx=function(h){ const g=_hx86(h); if(!h||!h.equip) return g; const A=lpAllow(h);
  for(const it of A){ const P=LPW[lpOf(it)]; if(!P.gx) continue; const m=P.fix?1:lpM(it); for(const [s,v] of Object.entries(P.gx)) g[s]=(g[s]||0)+v*m }
  if(g.killAp) g.killAp=Math.min(1,g.killAp); return g };
const lpFix=o=>{ if(o&&o.slot&&Array.isArray(o.aff)&&o.rarity>=4&&o.rarity<6&&!o.lp){ o.leg=o.leg||o.slot; o.lp=rollLp82() } };
function lpWalk(o,d){ if(!o||typeof o!=='object'||(d|0)>9) return; if(Array.isArray(o)){ for(const x of o) lpWalk(x,(d|0)+1); return } if(o.slot&&Array.isArray(o.aff)){ lpFix(o); return } for(const k in o) if(o[k]&&typeof o[k]==='object') lpWalk(o[k],(d|0)+1) }
function accLp87(){ if(!ACC||ACC.lp87) return; lpWalk(ACC.stash); ACC.lp87=1; try{ saveAcc() }catch(e){} }
/* ---------- Parchemin d'Adresse : plus de Points d'action ---------- */
SC_T.adr.pool=SC_T.adr.pool.filter(([s])=>s!=='ap'); SC_T.adr.d='Ajoute une affixe : Vitesse (37 %), Esquive (37 %) ou Vol de vie (26 %).';
for(let r=1;r<=4;r++){ const N=NEWI['sc_adr'+r]; if(N){ N.d=SC_T.adr.d+` Valeur de l’affixe : ${Math.round(SC_R[r][0]*100)}–${Math.round(SC_R[r][1]*100)} % du maximum au niveau de l’objet.`; MAT_D['sc_adr'+r]=N.d } }
/* ---------- Pierre de remodelage ---------- */
NEWI.rm_aff={n:'Pierre de remodelage',r:3,cat:'Amélioration',d:'Remplace une affixe choisie par une nouvelle affixe tirée au hasard dans la même catégorie (résistances, critiques, adresse, vie…), avec une nouvelle valeur. Réussite 100 %.',
 svg:'<path d="M12 2.5l7.5 4.5v9.5L12 21.5 4.5 16.5V7z" fill="#a070f0" stroke="#2a1050" stroke-width="1.2" stroke-linejoin="round"/><path d="M12 2.5v19M4.5 7L19.5 16.5M19.5 7L4.5 16.5" stroke="#e0d0ff" stroke-width=".8" opacity=".7"/><path d="M8.5 11.5a3.5 3.5 0 0 1 6.2-1.6M15.5 12.5a3.5 3.5 0 0 1-6.2 1.6" stroke="#fff" stroke-width="1.4" fill="none" stroke-linecap="round"/><path d="M14.9 8.6l.1 1.6-1.6.1M9.1 15.4l-.1-1.6 1.6-.1" stroke="#fff" stroke-width="1.3" fill="none" stroke-linecap="round"/>'};
MI.rm_aff=NEWI.rm_aff.svg; MAT_OBJ.rm_aff=MAT_N.rm_aff=NEWI.rm_aff.n; MAT_D.rm_aff=NEWI.rm_aff.d;
POTS.rm_aff={n:'Pierre de remodelage',c:'#a070f0',fix:{gold:15000,ru_maj:1},nocombat:1,d:NEWI.rm_aff.d+' S’utilise à la Forge.'};
ZLOOT[2].it.push(['rm_aff',.2]); ZLOOT[3].it.push(['rm_aff',.4]); ZLOOT[4].it.push(['rm_aff',.6]);
const RM_CAT=[['Robustesse',[['rPhys',1],['rMag',1],['rFeu',1],['rGlace',1],['rFoudre',1],['rTerre',1]]],['Fureur',[['critDmg',45],['MAIN',40],['crit',15]]],['Adresse',[['spd',35],['dodge',35],['lifesteal',25]]],['Vie',[['hp',60],['hpPct',40]]]];
function rmPool(it,a){ const ms=mainStat(it),S2=s=>s==='MAIN'?ms:s;
  if(a.main&&(a.s==='atk'||a.s==='mag')) return {n:'Statistique principale',pool:[{s:a.s,w:1}]};
  let C=RM_CAT.find(([,L])=>L.some(([s])=>S2(s)===a.s)); let pool;
  if(C) pool=C[1].map(([s,w])=>({s:S2(s),w}));
  else { const used=new Set(RM_CAT.flatMap(([,L])=>L.map(([s])=>S2(s)))); C=['Autres']; pool=affPool(it.cls||(S.heroes[0]&&S.heroes[0].cls)).filter(x=>!used.has(x.s)&&x.s!=='ap').map(x=>({s:x.s,w:x.w})) }
  const have=new Set(it.aff.filter(x=>x!==a&&!(x.main&&!a.main&&(x.s==='atk'||x.s==='mag'))).map(x=>x.s)); if(!(a.main&&(a.s==='atk'||a.s==='mag'))) have.add(a.s); pool=pool.filter(x=>!have.has(x.s)&&AFXM[x.s]); if(!pool.length) pool=[{s:a.s,w:1}];
  return {n:C[0],pool} }
const rmCost=it=>({gold:Math.round(1500+it.ilvl*30)});
function rmInfo(it){ const L=it.aff.map((a,i)=>({a,i})).filter(({a})=>a.s!=='ap'&&!a.fuse&&AFXM[a.s]);
  if(UI.fAff==null||!L.some(x=>x.i===UI.fAff)) UI.fAff=L.length?L[0].i:null; const a=it.aff[UI.fAff],kk=upMul(it);
  const P=a?rmPool(it,a):null,tw=P?P.pool.reduce((x,y)=>x+y.w,0):1,m=RAR[it.rarity].m;
  const rows=P?P.pool.map(x=>{const A=AFXM[x.s],sf=typeof slotF==='function'?slotF(it,x.s):1,lo=(A.b+A.p*it.ilvl)*m*sf*(it.rarity>=5?1:.7),hi=(A.b+A.p*it.ilvl)*m*sf;return `<div><span>${STAT_N[x.s]}</span><i><b style="width:${x.w/tw*100}%"></b></i><em class="num">${pc82(x.w/tw*100)}</em><small class="num">${fmtStat(x.s,affRound(x.s,lo)*kk).replace(' '+STAT_N[x.s],'')} à ${fmtStat(x.s,affRound(x.s,hi)*kk).replace(' '+STAT_N[x.s],'').replace('+','')}</small></div>`}).join(''):'';
  return {ok:!!a,why:a?'':'Aucune affixe modifiable sur cet objet.',cost:rmCost(it),chance:100,title:NEWI.rm_aff.n,rar:3,
   html:`<p>Choisissez l’affixe à remodeler. Elle sera remplacée par une affixe de la même catégorie, avec une nouvelle valeur.</p><h4>Affixe à remodeler</h4><div class="rmsel87">${L.map(({a:x,i})=>`<button class="${i===UI.fAff?'on':''}" data-act="fAffSel" data-i="${i}">${fmtStat(x.s,x.s==='ap'?x.v:x.v*kk)}${x.main?' <em>principale</em>':x.bonus?' <em>bonus</em>':''}</button>`).join('')}</div>
    ${P?`<h4>Résultat possible · ${esc(P.n)}</h4><div class="mfprob">${rows}</div><small class="mute">L’affixe change toujours de type dans son groupe (la statistique principale garde son type) ; une affixe déjà présente ne peut pas sortir. Valeur : 70 à 100 % du maximum au niveau de l’objet${it.rarity>=5?' (Divin : toujours au maximum)':''}.</small>`:''}`} }
function rmDo(it){ const a=it.aff[UI.fAff]; if(!a) return 'Aucune affixe choisie.'; const P=rmPool(it,a),n=wPick(P.pool,1)[0],old=fmtStat(a.s,a.v*upMul(it));
  a.s=n.s; a.v=rollAff(AFXM[n.s],it.ilvl,RAR[it.rarity].m); if(typeof slotF==='function') a.v=affRound(a.s,a.v*slotF(it,a.s)); removeMat('rm_aff',1); qEv('aff');
  return `Remodelage : ${old} → ${fmtStat(a.s,a.v*upMul(it))}.` }
const _genItem87=genItem; genItem=function(...a){ const it=_genItem87(...a); lpFix(it); return it };
