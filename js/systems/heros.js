/* Cendrelame · systems/heros.js */
/* ============ héros ============ */
/* ascension : niveau maximum requis ; palier n = 5000 × n or et 5 × n Prismes divins */
const ascCost=h=>({gold:5000*(h.stars+1),prisme:5*(h.stars+1)});
/* portraits de classe (image intégrée) */
const PORTRAIT={mage:'assets/img/classes/portrait_mage.webp',guerrier:'assets/img/classes/portrait_guerrier.webp'};
const xpNeed=l=>Math.round(30*Math.pow(l,1.6));
function newHero(name,cls,hue,lvl=1){
  const h={id:++S.uid,name,cls,hue,lvl,xp:0,sp:lvl,stars:0,learned:{},loadout:[],equip:{}};
  const first=CLASSES[cls].skills.find(s=>s.t==='a'&&s.lvl===1);
  h.learned[first.id]=1; h.loadout.push(first.id);
  h.equip.weapon=genItem('weapon',lvl,0,null,cls);
  h.equip.armor=genItem('armor',lvl,0,null,cls);
  return h;
}
const partyHeroes=()=>S.party.map(id=>S.heroes.find(h=>h.id===id)).filter(Boolean);
function gearStats(h){
  const t={};
  for(const s of SLOTS){const it=h.equip[s]; if(it&&lvlOk(it,h)) for(const [k,v] of Object.entries(itemStats(it))) t[k]=(t[k]||0)+v}
  return t;
}
function passMods(h){
  const t={};
  for(const sk of heroSkills(h)){
    if(sk.t!=='p'||!sk.mods) continue; const r=h.learned[sk.id]||0; if(!r) continue;
    for(const [k,v] of Object.entries(sk.mods)) t[k]=(t[k]||0)+v*r;
  }
  return t;
}
function heroStats(h){
  const c=CLASSES[h.cls],lv=h.lvl-1,star=1+.1*h.stars,g=gearStats(h),p=passMods(h);
  const b=k=>(c.base[k]+c.grow[k]*lv)*star;
  const pc=k=>(g[k+'Pct']||0)+(p[k+'Pct']||0);
  return {
    hp:(b('hp')+(g.hp||0))*(1+pc('hp')/100),
    atk:(b('atk')+(g.atk||0))*(1+pc('atk')/100),
    mag:(b('mag')+(g.mag||0))*(1+pc('mag')/100),
    def:(b('def')+(g.def||0))*(1+pc('def')/100),
    res:(b('res')+(g.res||0))*(1+pc('res')/100),
    spd:(b('spd')+(g.spd||0))*(1+pc('spd')/100),
    crit:Math.min(CRIT_CAP,5+(g.crit||0)+(p.crit||0)),
    critDmg:Math.min(CDMG_CAP,150+(g.critDmg||0)+(p.critDmg||0)),
    dodge:Math.min(30,(g.dodge||0)+(p.dodge||0)),
    lifesteal:Math.min(20,(g.lifesteal||0)+(p.lifesteal||0)),
    dmgPct:g.dmgPct||0,goldFind:g.goldFind||0,dropRate:g.dropRate||0,
    regen:(p.regen||0)+Math.min(3,g.regen||0),healPow:p.healPow||0,
    ap:5+(g.ap||0)+(p.ap||0),
    ...Object.fromEntries(RES_K.map(k=>[k,Math.min(RES_CAP,(g[k]||0)+(p[k]||0))])),
  };
}
function heroPower(h){
  const s=heroStats(h);
  return s.hp/24+Math.max(s.atk,s.mag)*2.2+s.def+s.res+s.spd*2+s.crit*1.5+s.critDmg*.2+s.dodge*2+s.lifesteal*3+s.dmgPct*3;
}
function gainXp(h,xp){
  h.xp+=xp; let ups=0;
  while(h.lvl<MAXL&&h.xp>=xpNeed(h.lvl)){h.xp-=xpNeed(h.lvl);h.lvl++;if(h.lvl<=SP_MAX)h.sp++;ups++}
  if(h.lvl>=MAXL)h.xp=0;
  return ups;
}
const sc=r=>1+.12*(r-1);
function skDesc(sk,rank,role,gx,asLines){
  gx=gx||{}; const k=sc(rank),p=x=>Math.round(x*100*k),stN=(sk.st||role)==='mag'?'INT':'FOR';
  const tgN={one:'un ennemi',all:'tous les ennemis',self:'vous',allies:'tous les alliés',lowAlly:'l’allié le plus blessé'}[sk.tg];
  const out=[];
  if(sk.ap&&!asLines) out.push(`Coût : ${sk.ap} PA.`);
  if(sk.el&&ELEM[sk.el]&&!asLines) out.push(`Élément : ${ELEM[sk.el].n}.`);
  if(sk.self) out.push(`Sacrifie ${Math.round(sk.self*100)} % de vos PV max.`);
  if(sk.mult) out.push(`Inflige ${p(sk.mult)}% ${stN}${sk.hits>1?' ×'+sk.hits:''} à ${tgN}${sk.exec?` (dégâts doublés sous ${sk.exec.thr}% PV)`:''}.`);
  if(sk.lowHp) out.push(`+${r1(sk.lowHp*10)} % de dégâts par tranche de 10 % de PV manquants.`);
  if(sk.ifSt) out.push(`+${Math.round(sk.ifSt.v*100)} % de dégâts contre une cible ${stTxt(sk.ifSt)}.`);
  if(sk.ls) out.push(`Vous rend ${sk.ls} % des dégâts infligés en PV.`);
  const sn={atk:'Force',def:'Défense',res:'Résistance',spd:'Vitesse',mag:'Intelligence'};
  for(const f of sk.fx||[]){
    if(f.k==='dot'){ const ch=fxCh(f,sk,gx); out.push(`${ch<100?ch+' % de chances d’infliger ':''}${f.n} : ${Math.round(p(f.v)*fxPow(f,gx))}% ${stN} par tour, ${fxDur(f,gx)} tours.`) }
    if(f.k==='para') out.push(`${fxCh(f,sk,gx)} % de chances de paralyser ${f.dur} tours : à chaque tour, la cible a ${paraPow(gx)} % de chances de perdre son tour (chances d’application réduites de moitié sur les boss).`);
    if(f.k==='det') out.push(`Fait exploser la ${f.n} de la cible : inflige immédiatement ${p(f.m)} % des dégâts qu’elle devait encore infliger.`);
    if(f.k==='stun') out.push(`${f.ch||100}% de chances d’étourdir ${f.dur} tour.`);
    if(f.k==='shield') out.push(f.of==='hp'?`Bouclier de ${p(f.v)}% des PV max.`:`Bouclier de ${p(f.v)}% INT.`);
    if(f.k==='heal') out.push(`Soigne ${p(f.v)}% INT${f.on==='allies'?' à tous les alliés':''}.`);
    if(f.k==='buff') out.push(`+${Math.round(f.v*k)}% ${sn[f.stat]} pendant ${f.dur} tours.`);
    if(f.k==='debuff') out.push(`${Math.round(f.v*k)}% ${sn[f.stat]} pendant ${f.dur} tours.`);
    if(f.k==='taunt') out.push(`Provoque les ennemis ${f.dur} tours.`);
  }
  if(!sk.mult&&!(sk.fx||[]).length) out.push('');
  if(asLines) return out.filter(Boolean);
  return out.join(' ')+(sk.cd?` Recharge : ${sk.cd} tours.`:'');
}
const MOD_N={hpPct:'PV',atkPct:'Force',magPct:'Intelligence',defPct:'Défense',resPct:'Résistance',spdPct:'Vitesse',crit:'Critique',critDmg:'Dégâts critiques',dodge:'Esquive',lifesteal:'Vol de vie',regen:'PV max par tour',healPow:'Puissance des soins'};
const modDesc=(m,r)=>Object.entries(m).map(([k,v])=>`+${v*r}% ${MOD_N[k]}`).join(', ');
/* bonus de talents (passifs de spécialisation) */
const GX_N={bleedP:['+',' % de dégâts des Saignements'],burnP:['+',' % de dégâts des Brûlures'],vsBleed:['+',' % de dégâts contre les cibles qui saignent'],vsBurn:['+',' % de dégâts contre les cibles en feu'],vsPara:['+',' % de dégâts contre les cibles paralysées'],
  lowHpDmg:['+',' % de dégâts par tranche de 10 % de PV manquants'],lowHpDef:['−',' % de dégâts subis sous 35 % de PV'],paraCh:['+',' % de chances de paralyser (toutes vos compétences)'],paraPow:['+',' % de chances qu’une cible paralysée perde son tour'],
  bleedDur:['+',' tour de durée des Saignements'],burnDur:['+',' tour de durée des Brûlures']};
function heroGxOld(h){
  const g={sxCh:{}}; if(!h) return g;
  for(const sk of heroSkills(h)){ if(sk.t!=='p'||!(sk.gx||sk.ult)) continue; const r=h.learned[sk.id]||0; if(!r) continue;
    if(sk.ult){ g.ult=sk.ult; continue }
    for(const [k,v] of Object.entries(sk.gx)){ if(k==='sxCh'){ for(const [id,x] of Object.entries(v)) g.sxCh[id]=(g.sxCh[id]||0)+x*r } else g[k]=(g[k]||0)+v*r } }
  return g;
}
function pasLines(sk,r){
  const out=[];
  if(sk.ud) out.push(sk.ud.replace(/\.$/,''));
  for(const [k,v] of Object.entries(sk.mods||{})) out.push(`+${r1(v*r)} % ${MOD_N[k]}`);
  for(const [k,v] of Object.entries(sk.gx||{})){
    if(k==='sxCh'){ for(const [id,x] of Object.entries(v)){ const f=(SK[id].fx||[]).find(q=>q.ch!=null); out.push(`+${x*r} % de chances d’infliger ${f&&f.k==='para'?'la Paralysie':f?f.n:'l’effet'} avec ${SK[id].n}`) } }
    else { const [sg,t]=GX_N[k]; out.push(`${sg}${r1(v*r)}${t}`) } }
  return out;
}
const pasDesc=(sk,r)=>pasLines(sk,r).join(', ')+'.';
const hasSt=(t,k,n)=>!!(t&&t.st&&t.st.some(s=>s.k===k&&(!n||s.n===n)));
const stTxt=t=>t.k==='para'?'paralysée':t.n==='Brûlure'?'en feu':'qui saigne';
const fxDur=(f,g)=>f.dur+((g||{})[f.n==='Brûlure'?'burnDur':f.n==='Saignement'?'bleedDur':'x']||0);
const fxPow=(f,g)=>1+(((g||{})[f.n==='Brûlure'?'burnP':f.n==='Saignement'?'bleedP':'x']||0)/100);
const fxCh=(f,sk,g)=>f.ch==null?100:Math.min(100,f.ch+(((g||{}).sxCh||{})[sk.id]||0)+(f.k==='para'?((g||{}).paraCh||0):0));
const paraPow=g=>Math.min(90,50+((g||{}).paraPow||0));
/* multiplicateur de dégâts lié aux talents et aux effets (PvE, duels, raids) */
function skMulOld(u,t,sk){
  const g=u.gx||{}; let m=1; const miss=Math.max(0,1-Math.max(0,u.hp)/(u.maxHp||1));
  if(g.lowHpDmg) m*=1+g.lowHpDmg/100*miss*10;
  if(sk&&sk.lowHp) m*=1+sk.lowHp*miss;
  if(g.vsBurn&&hasSt(t,'dot','Brûlure')) m*=1+g.vsBurn/100;
  if(g.vsBleed&&hasSt(t,'dot','Saignement')) m*=1+g.vsBleed/100;
  if(g.vsPara&&hasSt(t,'para')) m*=1+g.vsPara/100;
  if(sk&&sk.ifSt&&(sk.ifSt.k==='para'?hasSt(t,'para'):hasSt(t,'dot',sk.ifSt.n))) m*=1+sk.ifSt.v;
  const tg=t.gx||{}; if(tg.lowHpDef&&t.hp/t.maxHp<.35) m*=Math.max(.3,1-tg.lowHpDef/100);
  for(const q of u.st||[]) if(q.k==='ult'&&q.dmg&&(!q.el||(sk&&sk.el===q.el))) m*=1+q.dmg/100;
  for(const q of t.st||[]) if(q.k==='ult'&&q.def) m*=1-q.def/100;
  return m;
}
/* fiche (infobulle) d’une compétence */
function skReq(sk,h){
  if(!h) return '';
  if(h.lvl<sk.lvl) return `Niveau ${sk.lvl} requis.`;
  if(sk.spec==='*'){ if(!h.spec) return 'Choisissez d’abord une spécialisation.' }
  else if(sk.spec&&h.spec!==sk.spec) return `Spécialisation ${CLASSES[h.cls].specs[sk.spec].n} requise.`;
  if(sk.ult){ const n=treePts(h); if(n<ULT_PTS) return `${ULT_PTS} points requis dans l’arbre de talents (${n} / ${ULT_PTS}).` }
  if(sk.req&&!(h.learned[sk.req]>0)) return `Requiert : ${SK[sk.req].n}.`;
  return '';
}
const TG_N={one:'Un ennemi',all:'Tous les ennemis',self:'Vous-même',allies:'Vos alliés',lowAlly:'L’allié le plus blessé'};
function skCard(sk,h){
  if(sk.d||sk.pd) return skCard7(sk,h);
  const chip=(ic,t,c='')=>`<span class="skm ${c}">${ic?`<i>${ic}</i>`:''}${t}</span>`;
  if(sk.id==='atk') return `<article class="it skt" style="--rc:${sk.co}"><header><b>Attaque</b><small>Compétence de base</small></header><div class="skmeta">${chip('','Gratuite','free')}${chip('','1 fois par tour')}${chip('','Un ennemi')}</div><div class="skbody"><p>Inflige 100 % de votre stat principale à la cible.</p></div></article>`;
  const r=h?(h.learned[sk.id]||0):0,mx=skMax(sk),role=h?CLASSES[h.cls].role:'atk',gx=heroGx(h),rk=Math.max(1,r);
  const L=x=>sk.t==='a'?skDesc(sk,x,role,gx,true):pasLines(sk,x).map(t=>t+'.');
  const cur=L(rk),nxt=r>0&&r<mx?L(r+1):null,req=skReq(sk,h);
  const kind=sk.ult?'Talent ultime':sk.spec==='*'?'Talent commun':sk.spec?`${sk.t==='a'?'Active':'Passive'} · ${CLASSES[h.cls].specs[sk.spec].n}`:(sk.t==='a'?'Active · Base':'Passive');
  const meta=sk.ult?chip('','Ultime','ap')+chip('',`${ULT_PTS} points dans l’arbre`):sk.t==='a'?chip('',sk.ap?`${sk.ap} PA`:'Gratuite',sk.ap?'ap':'free')+chip('',sk.cd?`Recharge ${sk.cd} tours`:'Sans recharge')+(sk.el&&ELEM[sk.el]?`<span class="skm el" style="--ec:${ELEM[sk.el].c}">${ELEM[sk.el].n}</span>`:'')+chip('',TG_N[sk.tg]||''):chip('','Effet permanent');
  const same=nxt?nxt.filter(t=>!cur.includes(t)):[];
  return `<article class="it skt" style="--rc:${sk.co}"><header><b>${esc(sk.n)}</b><small>${kind}</small><small class="skrk">Rang <b>${r}</b> / ${mx}${h&&h.loadout.includes(sk.id)?' · Dans la barre de sorts':''}</small></header>
    <div class="skmeta">${meta}</div>
    <div class="skbody">${r?'':'<h5>Au rang 1</h5>'}${cur.map(t=>`<p>${t}</p>`).join('')}</div>
    ${same.length?`<div class="sknext"><h5>Rang ${r+1}</h5>${same.map(t=>`<p>${t}</p>`).join('')}</div>`:''}
    ${req?`<p class="lockr">🔒 ${req}</p>`:''}</article>`;
}
/* tuiles */
function skTile(sk,h,extra=''){
  const r=h.learned[sk.id]||0,mx=skMax(sk),req=skReq(sk,h),can=!req&&h.sp>0&&r<mx,eq=h.loadout.includes(sk.id);
  const drag=sk.t==='a'&&r>0&&h.learned===S.heroes[0].learned;
  return `<button class="sktile ${sk.t==='p'?'pas':''} ${r?'got':''} ${req?'lock':''} ${can?'avail':''} ${UI.skSel===sk.id?'sel':''} ${drag?'drg':''}" style="--co:${sk.co};${extra}" data-act="skSel" data-id="${sk.id}" ${drag?`data-skdrag="${sk.id}"`:''} data-tip="sk:${sk.id}" aria-label="${esc(sk.n)}, rang ${r} sur ${mx}${req?', verrouillée':''}">${spIcon(sk)}<span class="rk">${r}/${mx}</span>${eq?'<span class="eqm" aria-hidden="true">✓</span>':''}</button>`;
}
function specTree(cls,sid,h,preview){
  const sp=CLASSES[cls].specs[sid],nodes=[...sp.nodes,...CLASSES[cls].common];
  const X=n=>n.r===5?30+n.c*60:60+n.c*90,Y=n=>n.r===5?428:n.r===6?524:34+n.r*74;
  const links=sp.nodes.filter(n=>n.req).map(n=>{const p=SK[n.req],on=!preview&&h.learned[n.id]>0;return `<line x1="${X(p)}" y1="${Y(p)}" x2="${X(n)}" y2="${Y(n)}" class="${on?'on':''}"/>`}).join('');
  const hh=preview?Object.assign({},h,{spec:sid,sp:0}):h;
  const tiles=nodes.map(n=>skTile(n,hh,`left:${X(n)-26}px;top:${Y(n)-26}px`)+(n.ult?'':'')).join('');
  return `<div class="tree" style="--co:${sp.co}"><svg class="links" viewBox="0 0 300 570" aria-hidden="true">${links}<line x1="20" y1="378" x2="280" y2="378" class="sep"/><line x1="20" y1="474" x2="280" y2="474" class="sep"/></svg><span class="tlab" style="top:382px">Talents communs</span><span class="tlab" style="top:478px">Talent ultime</span>${tiles}</div>`;
}
/* talent ultime : charges puis bonus temporaire */
function ultGain(u,log){
  const U=u.gx&&u.gx.ult; if(!U||u.hp<=0) return; u.st=u.st||[];
  if(u.st.some(x=>x.k==='ult')) return;
  let q=u.st.find(x=>x.k==='stk'&&x.n===U.n); if(!q){ q={k:'stk',n:U.n,v:0,max:U.max,dur:999}; u.st.push(q) }
  q.v++; q.dur=999;
  if(q.v>=U.max){ u.st=u.st.filter(x=>x!==q); u.st.push(Object.assign({k:'ult',dur:U.dur},U.buff)); log(`${u.name} : ${U.buff.n} !`) }
}
function ultAfterCast(u,sk,targets,log){
  const U=u.gx&&u.gx.ult; if(!U||!sk||sk.id==='atk'&&U.trig==='cast') return;
  if(U.trig==='cast'&&sk.el===U.el) ultGain(u,log);
  else if(U.trig==='bleedHit'&&(targets||[]).some(t=>hasSt(t,'dot','Saignement'))) ultGain(u,log);
}
const ulPara=u=>(((u.st||[]).find(s=>s.k==='ult'&&s.paraCh))||{}).paraCh||0;
function viewSkills(h){
  const c=CLASSES[h.cls],base=c.skills.map(sk=>skTile(sk,h)).join(''),sel=UI.skSel&&SK[UI.skSel];
  let spec='';
  if(!h.spec){
    spec=`<div class="specs">${Object.entries(c.specs).map(([sid,sp])=>`<div class="speccol ${h.lvl<SPEC_L?'lockd':''}"><h4 style="--co:${sp.co}">${spIcon(sp)}${sp.n}</h4><p class="hint">${sp.d}</p>${specTree(h.cls,sid,h,true)}
      <button class="btn ${UI.specConf===sid?'danger':'pri'}" data-act="chooseSpec" data-s="${sid}" ${h.lvl<SPEC_L?'disabled':''}>${h.lvl<SPEC_L?`🔒 Niveau ${SPEC_L} requis`:UI.specConf===sid?'Confirmer : choix définitif':'Choisir '+sp.n}</button></div>`).join('')}</div>
      <p class="hint" style="text-align:center">${h.lvl<SPEC_L?`La spécialisation se débloque au niveau ${SPEC_L}. Vous pouvez déjà découvrir les deux arbres de talents.`:'Choisissez votre spécialisation. Le choix est définitif : seule une Potion d’oubli permet de réinitialiser vos compétences.'}</p>`;
  } else {
    const sp=c.specs[h.spec];
    spec=`<div class="specs one"><div class="speccol"><h4 style="--co:${sp.co}">${spIcon(sp)}Spécialisation : ${sp.n}</h4><p class="hint">${sp.d}</p>${specTree(h.cls,h.spec,h,false)}</div></div>`;
  }
  let det='';
  if(sel&&sel.id!=='atk'){ const r=h.learned[sel.id]||0,req=skReq(sel,h),eq=h.loadout.includes(sel.id);
    det=`<div class="skdet">${skCard(sel,h)}<div class="row" style="justify-content:center">${`<button class="btn pri" data-act="learn" data-id="${sel.id}" ${req||h.sp<1||r>=skMax(sel)?'disabled':''}>${r>=skMax(sel)?'Rang maximum':r?'Améliorer (+1 rang)':'Apprendre'}</button>`}${sel.t==='a'&&r?`<button class="btn" data-act="equipSk" data-id="${sel.id}">${eq?'Retirer de la barre':'Équiper'}</button>`:''}</div></div>`;
  } else det=`<p class="hint" style="text-align:center">${NOHOVER?'Touchez':'Survolez'} une compétence pour voir ses détails, cliquez dessus pour l’apprendre ou l’équiper.</p>`;
  const fp=matAll('p_oubli');
  const bar=Array.from({length:LOADOUT_MAX},(_,i)=>{const id=h.loadout[i],q=id&&SK[id];
    return `<div class="sbslot ${q?'full':''}" data-sbi="${i}">${q?`<button class="skc" style="--co:${q.co}" data-act="skSel" data-id="${id}" data-skdrag="${id}" data-from="${i}" data-tip="sk:${id}" aria-label="Emplacement ${i+1} : ${esc(q.n)}">${spIcon(q)}${q.ap?`<em class="apk">${q.ap}</em>`:''}</button>`:`<span aria-label="Emplacement ${i+1} vide">${i+1}</span>`}</div>`}).join('');
  return `<section class="panel skpanel"><div class="row between" style="margin-bottom:10px"><h2>Compétences</h2><span class="num">Points : <b style="color:var(--brass)">${h.sp}</b></span></div>
    <h3 class="skh">Barre de sorts <small class="mute num">${h.loadout.length} / ${LOADOUT_MAX}</small></h3><div class="spsticky"><div class="spbar" id="spbar">${bar}</div></div>
    <p class="hint" style="text-align:center;margin:4px 0 0">Glissez-déposez une compétence active apprise dans un emplacement. Glissez un sort hors de la barre pour le retirer, ou d’un emplacement à l’autre pour changer l’ordre.</p>
    <h3 class="skh">Compétences de base</h3><div class="skrow">${base}</div>
    <h3 class="skh">Spécialisation</h3>${spec}
    ${det}
    <div class="row forget"><span class="hint">Potion d’oubli : réinitialise toutes les compétences et la spécialisation (en vente chez le Marchand). Possédées : <b class="num">${fp}</b></span><button class="btn sm ${UI.forgetConf?'danger':''}" data-act="forget" ${fp?'':'disabled'}>${UI.forgetConf?'Confirmer la réinitialisation':'Boire une potion d’oubli'}</button></div></section>`;
}
function resetSkills(h){
  h.learned={}; h.loadout=[]; h.spec=null; h.sp=spCap(h.lvl);
  const first=CLASSES[h.cls].skills[0]; h.learned[first.id]=1; h.loadout=[first.id];
}
/* tuile de combat */
const KEY_DEF=['Digit1','Digit2','Digit3','Digit4','Digit5','Digit6','Digit7','Digit8'];
const KEYS=()=>{const k=ACC.keys; if(Array.isArray(k)&&k.length===8) return k; if(Array.isArray(k)&&k.length===6){ const z=k.concat(['Digit7','Digit8'].filter(c=>!k.includes(c))); while(z.length<8) z.push(''); return z } return KEY_DEF};
const keyLab=c=>!c?'—':/^Digit\d$/.test(c)?c.slice(5):/^Numpad\d$/.test(c)?'Pavé '+c.slice(6):/^Key[A-Z]$/.test(c)?c.slice(3):({Space:'Espace',Backquote:'²',Minus:')',Equal:'=',Semicolon:'M',Comma:',',Period:';',Slash:':',BracketLeft:'^',BracketRight:'$',Quote:'ù',Backslash:'*',IntlBackslash:'<'})[c]||c.replace(/^Arrow/,'Flèche ');
function cTile(id,U,act,sel){
  const hi=id==='atk'?0:((U.skills||[]).indexOf(id)+1),hk=hi>=0&&hi<8?hi+1:0,hkL=hk?keyLab(KEYS()[hi]):'';
  const s=SK[id],cd=(U.cds&&U.cds[id])||0,c=id==='atk'?0:apOf(U,id),no=c>(U.ap||0),used=id==='atk'&&U.atkUsed,off=cd||no||used;
  return `<button class="skc ${off?'off':''} ${sel?'sel':''}" style="--co:${s.co||'#5a5048'}" data-act="${act}" data-id="${id}" ${hk?`data-hk="${hk}" aria-keyshortcuts="${esc(hkL)}"`:''} ${off?'aria-disabled="true"':''} data-tip="sk:${id}" aria-label="${esc(s.n)}${c?', '+c+' PA':''}${cd?', recharge '+cd+' tours':no?', PA insuffisants':used?', déjà utilisée':''}">${spIcon(s)}${c?`<em class="apk">${c}</em>`:''}${cd?`<span class="cdo">${cd}</span>`:used?'<span class="cdo">✓</span>':''}${hk?`<kbd class="skk" aria-hidden="true">${esc(hkL)}</kbd>`:''}</button>`;
}

/* glisser-déposer des sorts vers la barre */
let SKD=null,SKSUP=false;
function skDrop(id,from,to){
  const h=S.heroes[0],sk=SK[id]; if(!h||!sk||sk.t!=='a'||!h.learned[id]) return; const L=h.loadout.slice();
  if(to==null){ if(from==null) return; if(L.length<=1){toast('Gardez au moins une compétence dans la barre.');return} L.splice(from,1) }
  else if(from!=null){ if(to>=L.length){ L.splice(from,1); L.push(id) } else { const t=L[to]; L[to]=id; L[from]=t } }
  else { const at=L.indexOf(id); if(at>=0){ if(to>=L.length){L.splice(at,1);L.push(id)} else {const t=L[to];L[to]=id;L[at]=t} }
    else if(to<L.length) L[to]=id; else if(L.length<LOADOUT_MAX) L.push(id); else L[LOADOUT_MAX-1]=id }
  h.loadout=L.filter(Boolean).slice(0,LOADOUT_MAX); save(); const y=scrollY; render(); scrollTo(0,y);
}
document.addEventListener('pointerdown',e=>{ const el=e.target.closest&&e.target.closest('[data-skdrag]'); if(!el||e.button>0) return; SKD={id:el.dataset.skdrag,from:el.dataset.from!=null?+el.dataset.from:null,x:e.clientX,y:e.clientY,el,on:false} });
document.addEventListener('pointermove',e=>{ if(!SKD) return;
  if(!SKD.on){ if(Math.hypot(e.clientX-SKD.x,e.clientY-SKD.y)<6) return; SKD.on=true; hideTip(); const g=SKD.el.cloneNode(true); g.id='skghost'; ['data-act','data-tip','data-skdrag'].forEach(a=>g.removeAttribute(a)); g.style.setProperty('--co',SKD.el.style.getPropertyValue('--co')); document.body.append(g); document.body.classList.add('skdrag') }
  const g=$('#skghost'); if(g){ g.style.left=((e.clientX-26))/ZM+'px'; g.style.top=((e.clientY-26))/ZM+'px' }
  const t=document.elementFromPoint(e.clientX,e.clientY),sl=t&&t.closest('.sbslot'); document.querySelectorAll('.sbslot.over').forEach(x=>x!==sl&&x.classList.remove('over')); if(sl) sl.classList.add('over');
});
document.addEventListener('pointerup',e=>{ if(!SKD) return; const d=SKD; SKD=null; if(!d.on) return;
  const g=$('#skghost'); if(g) g.remove(); document.body.classList.remove('skdrag');
  const t=document.elementFromPoint(e.clientX,e.clientY),sl=t&&t.closest('.sbslot'); SKSUP=true; setTimeout(()=>{SKSUP=false},60);
  skDrop(d.id,d.from,sl?+sl.dataset.sbi:null) });
document.addEventListener('pointercancel',()=>{ if(!SKD) return; SKD=null; const g=$('#skghost'); if(g) g.remove(); document.body.classList.remove('skdrag') });
document.addEventListener('click',e=>{ if(SKSUP){ e.stopPropagation(); e.preventDefault(); SKSUP=false } },true);


