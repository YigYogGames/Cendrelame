/* Cendrelame · systems/paladin.js (0.8.19)
   Classe Paladin : données dans data/classes-et-competences.js ; ici l’élément Sacré, les ressources
   Bénédiction (Rempart Sacré) et Zèle (Tempête divine), les soins en % des PV, l’IA et l’affichage. */
ELEM.sacre={n:'Sacré',k:'rSacre',c:'#e8c050'};
PORTRAIT.paladin=PORTRAIT.paladin||'assets/img/classes/portraits/paladin.png';
SPRITES.paladin=SPRITES.paladin||[{id:'paladin_m',src:'assets/img/classes/apparences/paladin_m.png',n:'Apparence 1'},{id:'paladin_f',src:'assets/img/classes/apparences/paladin_f.png',n:'Apparence 2'}];
SKIN_DIR.paladin='paladin';
SPI.cross=SPI.cross||'<path d="M10 3h4v6h6v4h-6v8h-4v-8H4V9h6z" fill="currentColor" stroke="none" opacity=".9"/>';
SPI.wing=SPI.wing||'<path d="M12 20c-1-5-4-8-9-9 4-1 7 0 9 3M12 20c1-5 4-8 9-9-4-1-7 0-9 3M12 14V4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>';
/* équipement du Paladin */
for(const b of [{n:'Marteau',slot:'weapon',cls:'paladin',imp:[['atk',6,1.8]]},{n:'Grand heaume',slot:'helm',cls:'paladin',imp:[]},{n:'Harnois',slot:'armor',cls:'paladin',imp:[]},{n:'Solerets',slot:'boots',cls:'paladin',imp:[]},{n:'Cuissards',slot:'legs',cls:'paladin',imp:[]}])
  if(!BASES.some(x=>x.n===b.n&&x.cls===b.cls)) BASES.splice(BASES.findIndex(x=>x.slot==='ring'),0,b);
RES_N.sanct='Bénédiction'; RES_N.zele='Zèle';
const SANCT_MAX=5,ZELE_MAX=5;
const sanctMx=u=>SANCT_MAX+gxv(u,'sanctMax'),zeleMx=u=>ZELE_MAX+gxv(u,'zeleMax');
const healMul=u=>1+gxv(u,'healAdd')/100;

/* ressources */
{ const _gain=CB.gain; CB.gain=(u,k,n,W)=>{ _gain(u,k,n,W); if(!u||!u.gx||u.hp<=0) return;
  if(k==='sanct'&&u.gx.res==='sanct'){ u.sanct=Math.min(sanctMx(u),(u.sanct||0)+n); u.sHit=1 }
  if(k==='zele'&&u.gx.res==='zele'){ u.zele=Math.max(0,Math.min(zeleMx(u),(u.zele||0)+n)) } } }
/* un coup reçu donne 1 Bénédiction */
{ const _hit=CB.hit; CB.hit=(u,t,mult,st,sk,W,opt={})=>{ const d=_hit(u,t,mult,st,sk,W,opt); if(sk&&sk.id!=='dot'&&t&&t.hp>0) CB.gain(t,'sanct',1,W); return d } }
/* dégâts : Zèle (+3 % sacré / point), Bénédiction (−2 % subis / point), Marteau du jugement (+10 % / Bénédiction) */
{ const _mul=skMul; skMul=function(u,t,sk,opt){ let m=_mul(u,t,sk,opt);
  if(sk&&sk.el==='sacre'&&u.gx&&u.gx.res==='zele'&&u.zele) m*=1+.03*u.zele;
  if(sk&&sk.sanctPer&&u.sanct) m*=1+sk.sanctPer*u.sanct;
  if(t&&t.gx&&t.gx.res==='sanct'&&t.sanct) m*=1-.02*t.sanct;
  return m } }
/* soins en % des PV max, soins sur la durée renforcés par Grâce */
{ const _fx=CB.fx; CB.fx=(u,t,f,k,sk,W)=>{
  if(f.k==='healPct'){ if(t.hp<=0) return false; W.heal(t,t.maxHp*f.v*k*healMul(u)*rand(.97,1.03)); W.ft&&W.ft(t,'Soin','heal'); return true }
  if(f.k==='hot'&&gxv(u,'healAdd')) return _fx(u,t,Object.assign({},f,{v:f.v*healMul(u)}),k,sk,W);
  return _fx(u,t,f,k,sk,W) } }
/* Verdicts : consomment le Zèle */
{ const _sp=CB.special; CB.special=(u,sk,tgt,fT,k,W)=>{
  if(sk.zeleUse){ const t=tgt&&tgt.hp>0?tgt:W.foes(u)[0]; if(!t) return true; const n=u.zele||0; u.zele=0;
    if(n) W.log(`${u.name} libère ${n} Zèle !`,'hl'); CB.hit(u,t,(sk.zeleUse.base+sk.zeleUse.per*n)*k,sk.st||u.role,sk,W); return true }
  return _sp(u,sk,tgt,fT,k,W) } }
/* après un sort : Zèle gagné, bouclier personnel */
{ const _ex=CB.exec; CB.exec=(u,sk,tgt,W)=>{ _ex(u,sk,tgt,W);
  if(sk&&sk.el==='sacre'&&!sk.zeleUse&&u.hp>0) CB.gain(u,'zele',1,W);
  if(sk&&sk.selfShield&&u.hp>0){ const k=sc((u.ranks&&u.ranks[sk.id])||1),a=Math.round(u.maxHp*sk.selfShield*k*(1+gxv(u,'shieldPct')/100)); u.shield=Math.round(Math.min(u.maxHp,(u.shield||0)+a)); W.ft&&W.ft(u,'Bouclier','heal') } } }
/* début de tour : la Bénédiction soigne puis s’use si vous n’avez pas été touché */
{ const _st=CB.start; CB.start=(u,W)=>{
  if(u.gx&&u.gx.res==='sanct'&&u.hp>0){ if(u.sanct) W.heal(u,u.maxHp*.01*u.sanct*healMul(u),true); if(!u.sHit&&u.sanct>0) u.sanct--; u.sHit=0 }
  return _st(u,W) } }
/* IA : soigne quand c’est utile, lance les verdicts quand le Zèle est haut */
{ const _ai=CB.ai; CB.ai=(u,noAtk,W)=>{
  W=W||W_PVE; const ok=id=>(u.cds[id]||0)===0&&(u.ap||0)>=apOf(u,id);
  const A=W.friends(u),low=A.slice().sort((a,b)=>a.hp/a.maxHp-b.hp/b.maxHp)[0],F=W.foes(u);
  let best=null,bs=0;
  for(const id of u.skills||[]){ const sk=SK[id]; if(!sk||!ok(id)) continue; let s=0;
    const fx=sk.fx||[];
    if(fx.some(f=>f.k==='healPct')&&low) s=low.hp/low.maxHp<.45?4:low.hp/low.maxHp<.65?1.8:0;
    else if(fx.some(f=>f.k==='hot')&&sk.tg==='lowAlly'&&low) s=low.hp/low.maxHp<.75&&!(low.st||[]).some(q=>q.k==='hot')?2:0;
    else if(sk.zeleUse&&F.length){ const z=u.zele||0; s=z>=zeleMx(u)?5:z>=3?2.5:0 }
    if(s>bs){ bs=s; best={skill:sk,target:sk.zeleUse?F.slice().sort((a,b)=>a.hp-b.hp)[0]:null} } }
  if(best&&bs>=2) return best;
  const r=_ai(u,noAtk,W); return r } }
/* affichage des ressources sur l’unité */
{ const _us=unitSts; unitSts=function(u){ const L=_us(u),g=u.gx||{};
  if(g.res==='sanct'&&u.sanct) L.unshift({k:'sanct',v:u.sanct,max:sanctMx(u)});
  if(g.res==='zele') L.unshift({k:'zele',v:u.zele||0,max:zeleMx(u)});
  return L } }
{ const _si=stInfo; stInfo=function(s){
  if(s.k==='sanct') return {ic:'up',c:'#9ac0ff',t:'Bénédiction',d:`${s.v} / ${s.max||5} : −${2*s.v} % de dégâts subis et ${s.v} % de PV soignés au début de votre tour.`,b:String(s.v)};
  if(s.k==='zele') return {ic:'up',c:'#ffd060',t:'Zèle',d:`${s.v} / ${s.max||5} : +${3*s.v} % de dégâts sacrés. Consommé par Verdict et Jugement dernier.`,b:String(s.v)};
  return _si(s) } }
