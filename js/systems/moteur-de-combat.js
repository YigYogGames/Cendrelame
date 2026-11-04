/* Cendrelame · systems/moteur-de-combat.js */
/* ================= 0.7.0 : moteur de combat commun (aventure, duels, défis) ================= */
const HEAT_MAX=10,RAGE_MAX=10,GARDE_MAX=5,BURN_MAX=5;
function hx(h){
  const g={v7:1}; if(!h||!CLASSES[h.cls]) return g;
  for(const sk of heroSkills(h)){ const r=h.learned[sk.id]||0; if(!r||!sk.pv) continue;
    for(const [k,v] of Object.entries(sk.pv)){ if(v&&typeof v==='object'){ g[k]=g[k]||{}; for(const [a,b] of Object.entries(v)) g[k][a]=(g[k][a]||0)+b*r } else g[k]=(g[k]||0)+v*r } }
  const sp=h.spec&&CLASSES[h.cls].specs[h.spec]; if(sp) g.res=sp.res;
  return g;
}
const heroGx=hx;
const gxv=(u,k,id)=>{ const g=(u&&u.gx)||{}; return id==null?(g[k]||0):((g[k]||{})[id]||0) };
const apOf=(u,id)=>{ const s=SK[id]; if(!s) return 0; return Math.max(0,(s.ap||0)-(s.u?gxv(u,'apUlt'):0)) };
const cdOf=(u,id)=>{ const s=SK[id]; if(!s||!s.cd) return 0; return Math.max(0,s.cd-gxv(u,'cdRed',id)) };
const stOf=(u,k)=>(u.st||[]).find(s=>s.k===k);
const buffSum=(u,stat)=>(u.st||[]).reduce((a,s)=>a+(s.k==='buff'&&s.stat===stat?s.v:0),0);
const isCC=t=>(t.st||[]).some(s=>s.k==='stun'||s.k==='para'||(s.k==='buff'&&s.stat==='spd'&&s.v<0));
const defDown=t=>(t.st||[]).some(s=>s.k==='buff'&&s.stat==='def'&&s.v<0);
const chgOf=t=>{ const q=stOf(t,'chg'); return q?q.n:0 };
const uKey=u=>u.id||u.name;
const CB={};
CB.crit=(u,sk)=>{ if(sk&&sk.crit100) return 100; const el=sk&&sk.el; return Math.min(CRIT_CAP+30,(u.crit||0)+buffSum(u,'crit')+(el?gxv(u,'critEl',el):0)+(sk?gxv(u,'skCrit',sk.id):0)+((sk&&sk.critAdd)||0)) };
CB.cdmg=(u,sk)=>(u.critDmg||150)+buffSum(u,'critDmg')+(sk&&sk.el?gxv(u,'cdmgEl',sk.el):0);
/* multiplicateur de dégâts : talents, ressources et états */
function skMul(u,t,sk,opt){
  let m=1; const miss=Math.max(0,1-Math.max(0,u.hp)/(u.maxHp||1)),el=sk&&sk.el;
  if(gxv(u,'lowHpDmg')) m*=1+gxv(u,'lowHpDmg')/100*miss*10;
  if(sk&&sk.lowHp) m*=1+sk.lowHp*miss;
  if(el){ m*=1+gxv(u,'dmgEl',el)/100; if(el==='feu'&&u.gx&&u.gx.res==='heat'){ m*=1+2*(u.heat||0)/100; if(stOf(u,'oh')) m*=.7 } if(sk.tg==='all'||(opt&&opt.aoe)) m*=1+gxv(u,'aoeEl',el)/100 }
  if(sk) m*=1+gxv(u,'skDmg',sk.id)/100;
  if(sk&&sk.exec){ const thr=(t.boss&&sk.exec.bthr?sk.exec.bthr:sk.exec.thr)+gxv(u,'execThr'); if(t.hp/t.maxHp<thr/100) m*=1+sk.exec.bonus }
  if(sk&&sk.ifSt&&(sk.ifSt.k==='para'?hasSt(t,'para'):hasSt(t,'dot',sk.ifSt.n))) m*=1+sk.ifSt.v;
  if(gxv(u,'vsCC')&&isCC(t)) m*=1+gxv(u,'vsCC')/100;
  if(gxv(u,'vsDefDown')&&defDown(t)) m*=1+gxv(u,'vsDefDown')/100;
  for(const q of t.st||[]){ if(q.k==='mark'&&q.by===uKey(u)) m*=1+q.v/100; if(q.k==='cage'&&el==='foudre') m*=1.25; if(q.k==='fort') m*=.6 }
  for(const q of u.st||[]){ if(q.k==='dech') m*=1.15; if(q.k==='last') m*=1.25 }
  const tg=t.gx||{}; if(tg.lowHpDef&&t.hp/t.maxHp<.35) m*=Math.max(.3,1-tg.lowHpDef/100);
  if(t.gx&&t.gx.res==='garde'&&t.garde) m*=1-.02*t.garde;
  return m;
}
CB.calc=(u,t,mult,st,sk,W,opt)=>{
  const ds=st==='mag'?'res':'def',K=100+15*(u.lvl||1);
  const def=effStat(t,ds)*(1-Math.min(80,gxv(u,'defPen'))/100);
  let d=effStat(u,st)*mult*K/(K+def);
  d*=1+(u.dmgPct||0)/100; d*=resMul(t,st,sk&&sk.el); d*=skMul(u,t,sk,opt);
  if(W.rage) d*=W.rage(u);
  if(W.pvp) d*=PVP_DMG;
  d*=rand(.92,1.08);
  const crit=Math.random()*100<CB.crit(u,sk); if(crit) d*=CB.cdmg(u,sk)/100;
  return {d:Math.max(1,Math.round(d)),crit};
};
CB.cap=(t,d)=>{ if(stOf(t,'last')) return Math.max(0,Math.min(d,(t.hp+(t.shield||0))-1)); return d };
CB.gain=(u,k,n,W)=>{ /* ressources de spécialisation */
  if(!u.gx||u.hp<=0) return;
  if(k==='rage'&&u.gx.res==='rage'){ if(stOf(u,'dech')) return; u.rage=Math.min(RAGE_MAX,(u.rage||0)+n); if(u.rage>=RAGE_MAX){ u.rage=0; u.st.push({k:'dech',dur:3}); W.log(`${u.name} est Déchaîné : +15 % de dégâts pendant 2 tours !`,'hl'); W.ft&&W.ft(u,'Déchaîné','heal') } }
  if(k==='garde'&&u.gx.res==='garde'){ u.garde=Math.min(GARDE_MAX,(u.garde||0)+n); u.gHit=1 }
  if(k==='heat'&&u.gx.res==='heat'){ if(n>0&&stOf(u,'oh')) return; u.heat=Math.max(0,(u.heat||0)+n); if(u.heat>=HEAT_MAX){ u.heat=0; u.st.push({k:'oh',dur:3}); W.log(`${u.name} entre en Surchauffe : sorts de feu −30 % pendant 2 tours !`,'cr'); W.ft&&W.ft(u,'Surchauffe','miss') } }
};
CB.hit=(u,t,mult,st,sk,W,opt={})=>{
  if(t.hp<=0) return 0;
  if(!opt.nododge&&Math.random()*100<(t.dodge||0)){ W.ft&&W.ft(t,'Esquive','miss'); W.log(`${t.name} esquive l’attaque.`); return 0 }
  let {d,crit}=CB.calc(u,t,mult,st,sk,W,opt); d=CB.cap(t,d);
  W.dmg(t,d,crit,u,opt.label);
  /* charges de foudre */
  if(sk&&sk.el==='foudre'&&u.gx&&u.gx.res==='chg'&&!opt.noChg&&t.hp>0) CB.chg(u,t,1);
  if(sk&&sk.id!=='dot'){ CB.gain(u,'rage',1,W); CB.gain(t,'rage',1,W); CB.gain(t,'garde',1,W) }
  const ls=(u.lifesteal||0)+(u.hp/u.maxHp<.5?gxv(u,'lsLow'):0); if(ls&&u.hp>0) W.heal(u,d*ls/100,true);
  { const ul=(u.st||[]).find(q=>q.k==='ult'&&q.ls); if(ul&&u.hp>0) W.heal(u,d*ul.ls/100,true) }
  const fo=stOf(t,'fort'); if(fo&&u.hp>0&&!opt.noRef){ const r=Math.max(1,Math.round(d*.2)); W.dmg(u,CB.cap(u,r),false,t,'renvoi') }
  if(t.hp>0&&gxv(t,'counter')&&!opt.noRef&&u.hp>0&&Math.random()*100<gxv(t,'counter')){ W.log(`${t.name} riposte !`,'ev'); CB.hit(t,u,.6,t.role,SK.atk,W,{noRef:1,label:'riposte'}) }
  if(t.hp<=0&&gxv(u,'killAp')&&!u.kap){ u.kap=1; u.ap=(u.ap||0)+gxv(u,'killAp'); W.log(`${u.name} récupère ${gxv(u,'killAp')} PA (Moisson).`,'hl') }
  return d;
};
CB.chg=(u,t,n)=>{ let q=stOf(t,'chg'); const mx=5+gxv(u,'chgMax'); if(!q){ q={k:'chg',n:0,dur:99,max:mx}; t.st.push(q) } q.max=Math.max(q.max||5,mx); q.n=Math.min(q.max,q.n+n) };
CB.takeChg=(t,keep)=>{ const q=stOf(t,'chg'); if(!q) return 0; const n=q.n; if(keep&&n>0){ q.n=1 } else t.st=t.st.filter(s=>s!==q); return n };
CB.burn=(u,t,f,k,sk,W)=>{ /* Brûlures cumulables */
  const st=sk.st||u.role,v=effStat(u,st)*f.v*k*resMul(t,st,sk.el)*(1+gxv(u,'dmgEl','feu')/100),dur=f.dur+gxv(u,'burnDur');
  const add=()=>{ const L=t.st.filter(s=>s.k==='dot'&&s.n==='Brûlure'); if(L.length>=BURN_MAX){ L.sort((a,b)=>a.dur-b.dur)[0].dur=dur } else t.st.push({k:'dot',n:'Brûlure',v,dur}) };
  add(); if(gxv(u,'burnExtra')&&Math.random()*100<gxv(u,'burnExtra')) add();
};
CB.fx=(u,t,f,k,sk,W)=>{
  if(t.hp<=0) return false; const st=sk.st||u.role,boss=t.boss?.5:1;
  if(f.k==='dot'){
    if(Math.random()*100>=fxCh(f,sk,u.gx)) return false;
    if(f.n==='Brûlure'&&u.gx&&u.gx.v7) CB.burn(u,t,f,k,sk,W);
    else { t.st=t.st.filter(s=>!(s.k==='dot'&&s.n===f.n)); t.st.push({k:'dot',n:f.n,v:effStat(u,st)*f.v*k*resMul(t,st,sk.el)*fxPow(f,u.gx),dur:fxDur(f,u.gx)}) }
    W.log(`${t.name} subit ${f.n}.`,'ev'); return true;
  }
  if(f.k==='para'){ if(Math.random()*100<(fxCh(f,sk,u.gx)+ulPara(u))*boss){ t.st=t.st.filter(s=>s.k!=='para'); t.st.push({k:'para',p:paraPow(u.gx),dur:f.dur}); W.ft&&W.ft(t,'Paralysie','miss'); W.log(`${t.name} est paralysé !`,'ev'); return true } return false }
  if(f.k==='det'){ const q=t.st.find(x=>x.k==='dot'&&x.n===f.n); if(q){ t.st=t.st.filter(x=>x!==q); W.dmg(t,CB.cap(t,Math.max(1,Math.round(q.v*q.dur*f.m*k))),false,u,f.n+' : détonation') } return !!q }
  if(f.k==='stun'){ const ch=Math.min(100,(f.ch||100)+gxv(u,'stunCh'))*boss; if(Math.random()*100<ch&&!t.st.some(s=>s.k==='stun')){ t.st.push({k:'stun',dur:f.dur}); W.log(`${t.name} est étourdi !`,'ev'); W.ft&&W.ft(t,'Étourdi','miss'); return true } return false }
  if(f.k==='shield'){ const a=(f.of==='hp'?t.maxHp*f.v*k:effStat(u,'mag')*f.v*k)*(1+gxv(u,'shieldPct')/100); t.shield=Math.round(Math.min(t.maxHp,(t.shield||0)+a)); if(f.dur){ t.st=t.st.filter(s=>s.k!=='shd'); t.st.push({k:'shd',v:Math.round(a),dur:f.dur}) } W.ft&&W.ft(t,'Bouclier','heal'); W.log(`${t.name} gagne un bouclier de ${Math.round(a)} PV.`); return true }
  if(f.k==='heal'){ W.heal(t,effStat(u,f.of||'mag')*f.v*k*(1+(u.healPow||0)/100)*rand(.95,1.05)); return true }
  if(f.k==='hot'){ t.st=t.st.filter(s=>s.k!=='hot'); t.st.push({k:'hot',v:f.v*k,dur:f.dur}); return true }
  if(f.k==='buff'||f.k==='debuff'){
    let v=f.k==='buff'?(f.abs?f.v*k:f.v*k):-Math.abs(f.v); if(f.bid) v+=gxv(u,'buffAdd',f.bid); v=Math.round(v*10)/10;
    if(f.stack){ const L=t.st.filter(s=>s.k==='buff'&&s.tag===f.tag); if(L.length>=f.stack) L.sort((a,b)=>a.dur-b.dur)[0].dur=f.dur; else t.st.push({k:'buff',stat:f.stat,v,dur:f.dur,tag:f.tag}) }
    else { t.st=t.st.filter(s=>!(s.k==='buff'&&s.stat===f.stat&&!s.tag&&Math.sign(s.v)===Math.sign(v))); t.st.push({k:'buff',stat:f.stat,v,dur:f.dur}) }
    return true }
  if(f.k==='taunt'){ t.st=t.st.filter(s=>s.k!=='taunt'); t.st.push({k:'taunt',dur:f.dur}); return true }
  if(f.k==='mark'){ t.st=t.st.filter(s=>!(s.k==='mark'&&s.by===uKey(u))); t.st.push({k:'mark',by:uKey(u),v:Math.round(f.v*k),dur:f.dur}); W.log(`${t.name} est traqué.`,'ev'); return true }
  if(['last','fort','cage'].includes(f.k)){ t.st=t.st.filter(s=>s.k!==f.k); t.st.push({k:f.k,dur:f.dur}); return true }
  return false;
};
/* dégâts « spéciaux » (consommation de Charges, bombes, météores…) */
CB.special=(u,sk,tgt,fT,k,W)=>{
  const st=sk.st||u.role,F=W.foes(u);
  if(sk.dis){ const n=CB.takeChg(tgt,Math.random()*100<gxv(u,'chgKeep')); CB.hit(u,tgt,(sk.dis.base+sk.dis.per*n)*k,st,sk,W,{noChg:1}); if(n) W.log(`${n} Charge${n>1?'s':''} consommée${n>1?'s':''}.`,'ev'); return true }
  if(sk.surg){ let any=0; for(const t of F){ const n=CB.takeChg(t); if(n){ any=1; CB.hit(u,t,sk.surg*n*k,st,sk,W,{noChg:1,aoe:1,label:n+' Charges'}) } } if(!any) W.log('Aucune Charge à faire exploser.'); return true }
  if(sk.imp){ const n=CB.takeChg(tgt); CB.hit(u,tgt,(sk.imp.base+sk.imp.per*n)*k,st,sk,W,{noChg:1}); for(const t of F) if(t!==tgt){ const m=CB.takeChg(t); if(m) CB.hit(u,t,sk.imp.oth*m*k,st,sk,W,{noChg:1,aoe:1,label:m+' Charges'}) } return true }
  if(sk.storm){ for(let i=0;i<sk.storm;i++){ const A=W.foes(u); if(!A.length) break; CB.hit(u,pick(A),sk.dmult*k,st,sk,W,{aoe:1}) } return true }
  if(sk.bounce){ CB.hit(u,tgt,sk.mult*k,st,sk,W); const others=W.foes(u).filter(t=>t!==tgt).sort(()=>Math.random()-.5).slice(0,sk.bounce+gxv(u,'bounce')); for(const t of others) CB.hit(u,t,.55*k,st,sk,W,{aoe:1,label:'rebond'}); return true }
  if(sk.soul){ const n=Math.min(3,u.heat||0),v=Math.min(tgt.maxHp*.06,effStat(u,st)*1.5)*resMul(tgt,st,'feu')*(1+gxv(u,'dmgEl','feu')/100); tgt.st=tgt.st.filter(s=>!(s.k==='dot'&&s.n==='Brûlure d’âme')); tgt.st.push({k:'dot',n:'Brûlure d’âme',v,dur:3}); W.log(`${tgt.name} subit Brûlure d’âme.`,'ev'); for(let i=0;i<n;i++) CB.burn(u,tgt,{v:.25,dur:3},1,sk,W); if(n) W.log(`${n} Brûlure${n>1?'s':''} supplémentaire${n>1?'s':''}.`,'ev'); return true }
  if(sk.chan){ u.st.push({k:'chan',sk:sk.id,tg:tgt&&uKey(tgt),dur:99}); W.log(`${u.name} incante ${sk.n}…`,'hl'); return true }
  if(sk.delay){ u.st.push({k:'dly',sk:sk.id,tg:tgt&&uKey(tgt),n:sk.delay,dur:99}); if(sk.id==='f_bomb'&&tgt){ tgt.st.push({k:'bomb',dur:2}); W.log(`Bombe vivante est posée sur ${tgt.name}.`,'ev') } else W.log(`${sk.n} arrive dans ${sk.delay} tours.`,'hl'); return true }
  return false;
};
/* sorts à retardement ou incantés qui se déclenchent */
CB.resolve=(u,q,W)=>{
  const sk=SK[q.sk]; if(!sk) return; const k=sc((u.ranks&&u.ranks[sk.id])||1),st=sk.st||u.role,F=W.foes(u);
  const tg=F.find(t=>uKey(t)===q.tg)||F[0];
  if(sk.id==='f_pyro'){ if(!tg) return; const h=u.heat||0; W.log(`${u.name} libère ${sk.n} (${h} degré${h>1?'s':''}) !`,'hl'); CB.hit(u,tg,sk.dmult*(1+.1*h)*k,st,sk,W); u.heat=0; return }
  if(sk.id==='f_met'){ const h=u.heat||0; W.log(`Le Météore s’écrase !`,'hl'); for(const t of F) CB.hit(u,t,sk.dmult*(1+.03*h)*k,st,sk,W,{aoe:1}); return }
  if(sk.id==='f_bomb'){ for(const t of W.foesAll(u)) t.st=t.st.filter(s=>s.k!=='bomb'); W.log('Bombe vivante explose !','hl'); let hit=0,kill=0;
    for(const t of F){ const d=CB.hit(u,t,sk.dmult*k,st,sk,W,{aoe:1}); if(d){ hit++; if(t.hp<=0) kill++; else CB.burn(u,t,{v:.25,dur:3},k,sk,W) } }
    let g=hit; for(let i=0;i<kill;i++) if(Math.random()<.3) g++; CB.gain(u,'heat',g,W); return }
};
/* lancer d'une compétence (commun à tous les modes) */
CB.exec=(u,sk,tgt,W)=>{
  const k=sk.id==='atk'?1:sc((u.ranks&&u.ranks[sk.id])||1),st=sk.st||u.role;
  const cd=sk.id==='atk'?0:cdOf(u,sk.id); if(cd) u.cds[sk.id]=cd+1;
  const ap=sk.id==='atk'?0:apOf(u,sk.id); if(ap) u.ap=Math.max(0,(u.ap||0)-ap);
  if(sk.id==='atk') u.atkUsed=true;
  const foesA=W.foes(u),friA=W.friends(u);
  if((sk.tg==='one')&&(!tgt||tgt.hp<=0||!foesA.includes(tgt))) tgt=foesA[0];
  let fT=[],aT=[];
  if(sk.tg==='one') fT=tgt?[tgt]:[];
  else if(sk.tg==='all') fT=foesA;
  else if(sk.tg==='self') aT=[u];
  else if(sk.tg==='allies') aT=friA;
  else if(sk.tg==='lowAlly') aT=[friA.slice().sort((a,b)=>a.hp/a.maxHp-b.hp/b.maxHp)[0]].filter(Boolean);
  W.log(sk.id==='atk'?`${u.name} attaque${tgt?' '+tgt.name:''}.`:`${u.name} utilise ${sk.n}.`);
  if(sk.self){ const c=Math.min(u.hp-1,Math.round(u.maxHp*sk.self)); if(c>0){ u.hp-=c; W.ft&&W.ft(u,'-'+c,''); W.log(`${u.name} sacrifie ${c} PV.`,'cr'); W.refresh&&W.refresh(u) } }
  let burned=false;
  if(!CB.special(u,sk,tgt,fT,k,W)){
    if(sk.mult) for(const t of fT) for(let i=0;i<(sk.hits||1);i++){ if(t.hp<=0)break; const d=CB.hit(u,t,sk.mult*k,st,sk,W); if(sk.ls&&d&&u.hp>0) W.heal(u,d*sk.ls/100) }
    for(const f of sk.fx||[]){
      const on=f.on||(sk.tg==='one'||sk.tg==='all'?'foe':'friend');
      const ts=on==='foe'?fT:on==='allies'?W.friends(u):aT;
      for(const t of ts) if(CB.fx(u,t,f,k,sk,W)&&f.n==='Brûlure') burned=true;
    }
  }
  if(sk.heat){ const h=sk.heat; if(h.n<0) CB.gain(u,'heat',h.n,W); else if(h.ifBurn){ if(burned) CB.gain(u,'heat',h.n,W) } else if(h.ch==null||Math.random()*100<h.ch) CB.gain(u,'heat',h.n,W) }
  ultAfterCast(u,sk,fT,m=>W.log(m,'hl'));
};
/* début de tour : dégâts sur la durée, soins, effets à retardement, contrôle */
CB.start=(u,W)=>{
  u.kap=0;
  if(u.gx&&u.gx.res==='garde'){ if(!u.gHit&&u.garde>0) u.garde--; u.gHit=0 }
  for(const s of (u.st||[]).filter(s=>s.k==='dot')) if(u.hp>0) W.dmg(u,CB.cap(u,Math.max(1,Math.round(s.v))),false,null,s.n);
  for(const s of (u.st||[]).filter(s=>s.k==='hot'||s.k==='phot')) if(u.hp>0) W.heal(u,u.maxHp*s.v);
  if(u.regen&&u.hp>0) W.heal(u,u.maxHp*u.regen/100,true);
  if(u.hp<=0) return {skip:true,dead:true};
  let skip=false;
  for(const q of (u.st||[]).filter(s=>s.k==='dly')){ q.n--; if(q.n<=0){ u.st=u.st.filter(s=>s!==q); CB.resolve(u,q,W) } }
  const ch=stOf(u,'chan'); if(ch){ u.st=u.st.filter(s=>s!==ch); CB.resolve(u,ch,W); W.log(`${u.name} récupère de son incantation et passe son tour.`,'ev'); skip=true }
  if(!skip&&u.st.some(s=>s.k==='stun')){ W.log(`${u.name} est étourdi et passe son tour.`,'ev'); skip=true }
  if(!skip){ const pa=u.st.find(s=>s.k==='para'); if(pa&&Math.random()*100<(pa.p||50)){ W.log(`${u.name} est paralysé et perd son tour.`,'ev'); W.ft&&W.ft(u,'Paralysé','miss'); skip=true } }
  return {skip};
};
CB.end=u=>{ stTick(u); for(const id of Object.keys(u.cds||{})) u.cds[id]=Math.max(0,u.cds[id]-1) };
/* adaptateurs : aventure, duels, défis */
const W_PVE={pve:1,foes:u=>alive(foes(u)),foesAll:u=>foes(u),friends:u=>alive(friends(u)),log:(m,c)=>logLine(m,c),dmg:(t,d,crit,src,label)=>dmg(t,d,crit,src,label),heal:(t,a,s)=>heal(t,a,s),ft:(t,x,c)=>floatTxt(t,x,c),refresh:t=>refresh(t),
  rage:u=>{ if(u.team!=='e') return 1; const rs=u.boss?DIFF[C.diff||'normal'].rage:30; return C.round>rs?1+(C.round-rs)*(u.boss&&rs<30?.08:.1):1 }};
function W_L(L,foesF,friF,allF){ return {foes:u=>foesF(u).filter(x=>x.hp>0),foesAll:u=>(allF||foesF)(u),friends:u=>friF(u).filter(x=>x.hp>0),log:m=>L.push(m),
  dmg:(t,d,crit,src,label)=>{ let a=d; if(t.shield>0){const z=Math.min(t.shield,a); t.shield-=z; a-=z} t.hp=Math.max(0,t.hp-a); L.push(`${t.name} subit ${d} dégâts${label?' ('+label+')':''}${crit?' (critique !)':''}.`); if(t.hp<=0) L.push(`${t.name} est vaincu.`) },
  heal:(t,a,s)=>{ const h=Math.round(Math.min(t.maxHp-t.hp,a)); if(h>0){ t.hp+=h; if(!s) L.push(`${t.name} récupère ${h} PV.`) } }} }
/* IA des héros (combat automatique) */
CB.ai=(u,noAtk,W)=>{
  W=W||W_PVE; const F=W.foes(u),A=W.friends(u),hp=u.hp/u.maxHp,heat=u.heat||0;
  const ok=id=>(u.cds[id]||0)===0&&(u.ap||0)>=apOf(u,id);
  const has=(t,k)=>(t.st||[]).some(s=>s.k===k);
  let best=null,bs=.5;
  const tgtFor=sk=>{ if(sk.dis||sk.imp) return F.slice().sort((a,b)=>chgOf(b)-chgOf(a))[0]; if(sk.exec) return F.slice().sort((a,b)=>a.hp/a.maxHp-b.hp/b.maxHp)[0]; if((sk.fx||[]).some(f=>f.k==='stun')) return F.find(t=>!has(t,'stun'))||F[0]; const tt=F.find(t=>t.st.some(s=>s.k==='taunt')); return tt||F.slice().sort((a,b)=>a.hp-b.hp)[0] };
  for(const id of u.skills){ if(!ok(id)) continue; const sk=SK[id]; if(!sk) continue; const k=sc((u.ranks&&u.ranks[id])||1),t=tgtFor(sk); if(!t&&sk.tg!=='self'&&sk.tg!=='allies') continue;
    let s=0; const n=F.length;
    if(sk.chan) s=heat>=5?2.6+heat*.25:0;
    else if(sk.soul) s=t&&t.maxHp>effStat(u,'mag')*12?3:1.4;
    else if(sk.delay) s=(sk.dmult||1)*k*(sk.tg==='all'||sk.id==='f_bomb'?n*.8:1)*(stOf(u,'dly')?0:1);
    else if(sk.dis) s=(sk.dis.base+sk.dis.per*chgOf(t))*k*(chgOf(t)>=3?1.2:.5);
    else if(sk.surg){ s=F.reduce((a,x)=>a+chgOf(x),0)*sk.surg*k; if(s<1.2) s*=.4 }
    else if(sk.imp) s=(sk.imp.base+sk.imp.per*chgOf(t))*k+F.reduce((a,x)=>a+(x!==t?chgOf(x)*sk.imp.oth:0),0);
    else if(sk.storm) s=sk.storm*sk.dmult*k;
    else if(sk.bounce) s=(sk.mult+.5*Math.min(n-1,sk.bounce+gxv(u,'bounce')))*k;
    else if(sk.mult) s=sk.mult*k*(sk.tg==='all'?n*.8:1);
    if(sk.heat&&sk.heat.n<0) s=heat>=8?3.2:heat>=6?1:0;
    if(sk.heat&&sk.heat.n>0&&heat>=9&&!stOf(u,'oh')) s*=.35;
    if(sk.exec&&t&&t.hp/t.maxHp<((t.boss&&sk.exec.bthr?sk.exec.bthr:sk.exec.thr)+gxv(u,'execThr'))/100) s*=2;
    if(sk.lowHp) s*=1+sk.lowHp*(1-hp);
    if(sk.self&&hp<.4) s=0;
    for(const f of sk.fx||[]){
      if(f.k==='shield') s=Math.max(s,(u.shield||0)<u.maxHp*.08&&hp<.8?2.2:0);
      if(f.k==='buff'&&(sk.tg==='self'||sk.tg==='allies')) s=Math.max(s,u.st.some(q=>q.k==='buff'&&q.stat===f.stat&&q.v>0)?0:(f.stat==='mag'||f.stat==='atk'?2.4:1.6));
      if(f.k==='mark') s=Math.max(s,t&&!t.st.some(q=>q.k==='mark')?1.3:0);
      if(f.k==='last') s=hp<.35?4:0;
      if(f.k==='fort') s=hp<.5?3:0;
      if(f.k==='stun') s=Math.max(s,(sk.mult||0)*k+((sk.tg==='all'?n:1)*(t&&has(t,'stun')?0:.9)));
      if(f.k==='debuff'&&f.stat==='def') s+=t&&defDown(t)?0:.3;
      if(f.k==='debuff'&&f.stat==='spd'&&!sk.mult) s=Math.max(s,n*.5);
      if(f.k==='cage') s=Math.max(s,n*1.1);
    }
    if(sk.crit100) s*=1.6;
    s*=rand(.92,1.08);
    if(s>bs){ bs=s; best={skill:sk,target:sk.tg==='one'?t:null} }
  }
  if(!best){ if(noAtk) return null; return {skill:SK.atk,target:tgtFor(SK.atk)} }
  return best;
};

