/* Cendrelame · systems/combat-aventure.js */
/* ============ combat ============ */
const alive=l=>l.filter(u=>u.hp>0);
const friends=u=>C.units.filter(x=>x.team===u.team);
const foes=u=>C.units.filter(x=>x.team!==u.team);
function effStat(u,st){
  let m=0; for(const s of u.st) if(s.k==='buff'&&s.stat===st) m+=s.v;
  return u[st]*Math.max(.25,1+m/100);
}
function mkHeroUnit(h){
  const s=heroStats(h),cl=CLASSES[h.cls];
  const okS=new Set(heroSkills(h).filter(x=>x.t==='a').map(x=>x.id)),sk=h.loadout.filter(id=>h.learned[id]&&okS.has(id)).slice(0,LOADOUT_MAX);
  const cds={}; for(const id of sk) cds[id]=0;
  return {id:'h'+h.id,team:'h',hero:h,name:h.name,lvl:h.lvl,ic:cl.ic,hue:h.hue,role:cl.role,...s,
    hp:Math.round(s.hp),maxHp:Math.round(s.hp),skills:sk,ranks:h.learned,cds,st:[],shield:0,ap:s.ap,maxAp:s.ap,gx:hx(h),heat:0,rage:0,garde:0};
}
/* difficultés : niveau des monstres, multiplicateurs (monstres / boss), début de la rage des boss, récompenses */
const DIFF={
  normal:{n:'Normal',L:null,hp:1,atk:1,bHp:2,bAtk:1,bDef:1,rage:30,rw:1,prism:.1},
  hero:{n:'Héroïque',L:50,hp:1.4,atk:1.5,bHp:2.8,bAtk:1.6,bDef:1.3,rage:15,rw:1,prism:.1},
  myth:{n:'Mythique',L:60,hp:1.8,atk:1.8,bHp:3,bAtk:1.45,bDef:1.5,rage:12,rw:2,prism:.25,extra:'e_smash'},
};
const HERO_L=50;
const heroOpen=()=>!!(S.heroes[0]&&S.heroes[0].lvl>=HERO_L);
const curDiff=()=>DIFF[S.diff]&&(S.diff==='normal'||heroOpen())?S.diff:'normal';
const isHero=()=>curDiff()!=='normal';
const progKey=d=>d==='myth'?'progM':d==='hero'?'progH':'prog';
const prog=(d=curDiff())=>{const k=progKey(d); if(!S[k]) S[k]={zone:0,stage:1}; return S[k]};
const mythOpen=()=>heroOpen()&&(S.mythOpen||(S.progH&&S.progH.zone===ZONES.length-1&&S.progH.stage===10));
const ENF={hp:[100,180,0],atk:[18,9.9,0],def:[4,1.8,0],pair:[.65,.6]};
const enStat=(k,L)=>ENF[k][0]+ENF[k][1]*L+ENF[k][2]*L*L;
function mkEnemies(z,st,n,diff){
  const D=DIFF[diff]||DIFF.normal,Z=ZONES[z],L=D.L||z*10+st,boss=st===10,list=[];
  const mk=(t,cm,am,isBoss)=>({
    id:'e'+(list.length+1),team:'e',name:t.n,lvl:L,ic:t.ic,hue:isBoss?40:8,role:t.role,boss:isBoss,
    hp:Math.round(enStat('hp',L)*t.hp*cm*(isBoss?.8*D.bHp:D.hp)),atk:enStat('atk',L)*t.atk*am*(isBoss?.88*D.bAtk:D.atk),mag:enStat('atk',L)*t.atk*am*(isBoss?.88*D.bAtk:D.atk),
    def:enStat('def',L)*t.def*(isBoss?D.bDef:1),res:enStat('def',L)*.9*t.def*(isBoss?D.bDef:1),spd:(8+.15*L)*(t.spd||1)*rand(.95,1.05),
    crit:5,critDmg:150,dodge:0,lifesteal:0,dmgPct:0,regen:0,healPow:0,ap:5,maxAp:5,
    ...Object.fromEntries(RES_K.map(k=>[k,Math.min(RES_CAP,(t.res&&t.res[k])||0)])),
    skills:[...(t.sk||[]),...(isBoss&&D.extra?[D.extra]:[])],ranks:{},cds:Object.fromEntries([...(t.sk||[]),...(isBoss&&D.extra?[D.extra]:[])].map(id=>[id,SK[id].cd>=4?2:1])),st:[],shield:0});
  if(C.force){ const F=C.force; C.force=null; list.push(F.j<0?mk(ZONES[F.z].boss,1,1,true):mk(ZONES[F.z].enemies[F.j],1,1,false)) }
  else if(boss){
    list.push(mk(Z.boss,1,1,true));
    if(n>=2) list.push(mk(Z.enemies[0],.6,.8,false));
  }else{
    const cnt=clamp(1+Math.floor((st-1)/3),1,n+1);
    const cm=[1,ENF.pair[0],.5][cnt-1],am=[1,ENF.pair[1],.45][cnt-1];
    for(let i=0;i<cnt;i++) list.push(mk(pick(Z.enemies),cm,am,false));
  }
  const seen={};
  for(const e of list) seen[e.name]=(seen[e.name]||0)+1;
  const idx={};
  for(const e of list) if(seen[e.name]>1){idx[e.name]=(idx[e.name]||0)+1;e.name+=' '+'ABC'[idx[e.name]-1]}
  list.forEach((e,i)=>e.id='e'+(i+1));
  for(const e of list){e.maxHp=e.hp}
  return list;
}
function logLine(t,cls=''){
  C.logs.push({t,cls}); if(C.logs.length>120)C.logs.shift();
  const el=$('#log'); if(el){const p=document.createElement('p');if(cls)p.className=cls;p.textContent=t;el.append(p);el.scrollTop=el.scrollHeight}
}
function unitEl(u){return $(`[data-u="${u.id}"]`)}
const ST_N={atk:'Force',def:'Défense',res:'Résistance',spd:'Vitesse',mag:'Intelligence',crit:'Critique',critDmg:'Dégâts critiques',rFeu:'Résistance au feu',rGlace:'Résistance à la glace',rFoudre:'Résistance à la foudre',rTerre:'Résistance à la terre',rPhys:'Résistance physique',rMag:'Résistance magique'};
const ST_IC={up:'<path d="M12 19V5M6 11l6-6 6 6"/>',down:'<path d="M12 5v14M6 13l6 6 6-6"/>',dot:'<path d="M12 3c3 4 6 7 6 11a6 6 0 0 1-12 0c0-4 3-7 6-11z"/>',burn:'<path d="M12 3c1 3 5 5 5 10a5 5 0 0 1-10 0c0-3 2-4 2-6 2 1 2 3 3 4 1-3 0-5 0-8z"/>',stun:'<path d="M12 4l1.8 3.7 4 .6-2.9 2.8.7 4L12 13.2 8.4 15.1l.7-4L6.2 8.3l4-.6z"/><path d="M5 19h14"/>',para:'<path d="M13 3L6 13h5l-1 8 7-10h-5z"/>',taunt:'<path d="M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6z"/>',apb:'<circle cx="12" cy="12" r="8"/><path d="M12 8v8M8 12h8"/>',stk:'<path d="M4 8l8-4 8 4-8 4zM4 12l8 4 8-4M4 16l8 4 8-4"/>',ult:'<path d="M12 2v6M12 16v6M2 12h6M16 12h6M5 5l4 4M15 15l4 4M19 5l-4 4M9 15l-4 4"/>'};
function stInfo(s){
  const d=s.dur!=null?s.dur:'',tours=d!==''?` pendant ${d} tour${d>1?'s':''}`:'';
  if(s.k==='heat') return {ic:'burn',c:s.v>=8?'#ff4a1a':'#ff8a3a',t:'Degrés de chaleur',d:`${s.v} / 10 : +${2*s.v} % de dégâts de feu. À 10 : Surchauffe.`,b:String(s.v)};
  if(s.k==='rage') return {ic:'stk',c:'#e0412a',t:'Rage',d:`${s.v} / 10. À 10 : Déchaîné (+15 % de dégâts pendant 2 tours).`,b:String(s.v)};
  if(s.k==='garde') return {ic:'taunt',c:'#7aa0d0',t:'Garde',d:`${s.v} / 5 : −${2*s.v} % de dégâts subis.`,b:String(s.v)};
  if(s.k==='chg') return {ic:'para',c:'#f0e060',t:'Charges statiques',d:`${s.n} / ${s.max||5} Charges : consommées par les sorts d’Instabilité.`,b:String(s.n)};
  if(s.k==='oh') return {ic:'burn',c:'#c0432a',t:'Surchauffe',d:`Sorts de feu −30 % et aucun degré gagné${tours}.`,b:''};
  if(s.k==='dech') return {ic:'up',c:'#ff5a3a',t:'Déchaîné',d:`+15 % de dégâts${tours}.`,b:''};
  if(s.k==='last') return {ic:'up',c:'#ffd27a',t:'Dernier souffle',d:`Vos PV ne descendent pas sous 1, +25 % de dégâts${tours}.`,b:''};
  if(s.k==='fort') return {ic:'taunt',c:'#9ab0d0',t:'Forteresse',d:`−40 % de dégâts subis, renvoie 20 % des dégâts${tours}.`,b:''};
  if(s.k==='cage') return {ic:'para',c:'#f0e060',t:'Cage d’éclairs',d:`+25 % de dégâts de foudre subis${tours}.`,b:''};
  if(s.k==='mark') return {ic:'stun',c:'#e0614a',t:'Traqué',d:`+${s.v} % de dégâts subis de la part du Berserk${tours}.`,b:''};
  if(s.k==='bomb') return {ic:'burn',c:'#ff6a1a',t:'Bombe vivante',d:'Explose au prochain tour du Sorcier.',b:''};
  if(s.k==='phot') return {ic:'up',c:'#5ac87a',t:'Régénération',d:`Soigne ${r1(s.v*100)} % des PV max par tour${tours}.`,b:''};
  if(s.k==='hot') return {ic:'up',c:'#7fd07a',t:'Chaleur apaisante',d:`Soigne ${r1(s.v*100)} % des PV max par tour${tours}.`,b:''};
  if(s.k==='chan') return {ic:'ult',c:'#ffd27a',t:'Incantation',d:'Le sort se déclenche au début du prochain tour ; ce tour-là, vous ne jouez pas.',b:''};
  if(s.k==='dly'){ const q=SK[s.sk]; return {ic:'ult',c:'#ffd27a',t:q?q.n:'Sort à retardement',d:`Se déclenche dans ${s.dur} tour${s.dur>1?'s':''}.`,b:''} }
  if(s.k==='buff'){const up=s.v>=0,n=ST_N[s.stat]||s.stat; return {ic:up?'up':'down',c:up?'#7fd07a':'#e0614a',t:(up?'Bonus : ':'Malus : ')+n,d:`${up?'+':''}${Math.round(s.v)} % de ${n}${tours}.`,b:''}}
  if(s.k==='dot'){const n=s.n||'Dégâts sur la durée',c=/Poison/.test(n)?'#8ad04a':/Saign/.test(n)?'#e0412a':'#ff8a3a'; return {ic:/Brûl/.test(n)?'burn':'dot',c,t:n,d:`${Math.round(s.v||0)} dégâts au début de chaque tour${tours}.`,b:''}}
  if(s.k==='stun') return {ic:'stun',c:'#f0d040',t:'Étourdi',d:`Passe son prochain tour${tours}.`,b:''};
  if(s.k==='para') return {ic:'para',c:'#5ad0f0',t:'Paralysie',d:`Risque de perdre son tour${s.p?' ('+Math.round(s.p*100)+' %)':''}${tours}.`,b:''};
  if(s.k==='taunt') return {ic:'taunt',c:'#d6aa55',t:'Provocation',d:`Les ennemis doivent attaquer cette cible${tours}.`,b:''};
  if(s.k==='apb') return {ic:'apb',c:'#f0c060',t:'Points d’action',d:`+${s.v} PA par tour${tours}.`,b:''};
  if(s.k==='stk') return {ic:'stk',c:'#c08aff',t:s.n||'Cumul',d:`${s.v} / ${s.max||5} cumuls${tours}.`,b:String(s.v)};
  if(s.k==='ult') return {ic:'ult',c:'#ffd27a',t:s.n||'Pouvoir',d:`Effet actif${tours}.`,b:''};
  return {ic:'ult',c:'#cdb68a',t:s.n||'Effet',d:`Effet actif${tours}.`,b:''};
}
const stHTML=sts=>(sts||[]).map(s=>{const I=stInfo(s);return `<em class="sti b-${s.k}" style="--sc:${I.c}" data-tip="${esc('tx:'+I.t+'|'+I.d)}" aria-label="${esc(I.t+' : '+I.d)}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">${ST_IC[I.ic]}</svg>${I.b?`<b>${esc(I.b)}</b>`:''}${s.dur!=null?`<small>${s.dur}</small>`:''}</em>`}).join('');
function refresh(u){
  const el=unitEl(u); if(!el) return;
  el.classList.toggle('dead',u.hp<=0);
  el.classList.toggle('turn',C.turn===u.id);
  el.classList.toggle('selectable',!!C.pending&&u.team==='e'&&u.hp>0);
  $('.hp i',el).style.width=Math.max(0,u.hp/u.maxHp*100)+'%';
  {const sb=$('.hp .shl',el); if(sb){const m=u.maxHp||1,sh=Math.min(Math.max(0,u.shield||0),m),st=Math.min(Math.max(0,u.hp),m-sh); sb.style.left=st/m*100+'%'; sb.style.width=sh/m*100+'%'}}
  {const ab=$('.apbar',el); if(ab){ if(ab.children.length!==(u.maxAp||0)) ab.innerHTML=Array.from({length:u.maxAp||0},()=>'<i></i>').join(''); ab.querySelectorAll('i').forEach((x,i)=>x.classList.toggle('on',i<(u.ap||0))); ab.title=(u.ap||0)+' / '+(u.maxAp||0)+' PA' }}
  $('.hp span',el).textContent=Math.max(0,Math.ceil(u.hp))+' / '+Math.ceil(u.maxHp)+(u.shield>0?' (+'+Math.ceil(u.shield)+')':'');
  { const t=$('.stt',el); t.classList.add('sti'); t.innerHTML=stHTML(unitSts(u)) }
}
const refreshAll=()=>{C.units.forEach(refresh); renderInit(); const r=$('.cvround b'); if(r) r.textContent=C.round};
function floatTxt(u,txt,cls){
  const el=unitEl(u); if(!el) return;
  const f=$('.fl',el); if(!f) return;
  const s=document.createElement('span'); s.className='fnum '+cls; s.textContent=txt; f.append(s);
  setTimeout(()=>s.remove(),2100);
}
function dmg(t,d,crit,src,label){
  let left=d;
  if(t.shield>0){const a=Math.min(t.shield,left);t.shield-=a;left-=a}
  t.hp-=left; if(t.hp<0)t.hp=0;
  floatTxt(t,(crit?'✦ ':'')+d,crit?'crit':'');
  const el=unitEl(t); if(el){el.classList.add('hit');setTimeout(()=>el.classList.remove('hit'),300)}
  logLine(`${t.name} subit ${d} dégâts${label?' ('+label+')':''}${crit?' — coup critique !':''}`,crit?'cr':'');
  if(t.hp<=0){logLine(`${t.name} est vaincu.`,'ev');t.st=[]}
  else if(src&&t.gx&&t.gx.ult&&t.gx.ult.trig==='hurt') ultGain(t,m=>{logLine(m,'hl')});
  refresh(t);
}
function heal(t,a,silent){
  a=Math.round(a); if(a<=0||t.hp<=0) return;
  const real=Math.min(a,t.maxHp-t.hp); t.hp+=real;
  floatTxt(t,'+'+real,'heal'); if(!silent||real>0) logLine(`${t.name} récupère ${real} PV.`,'hl'); refresh(t);
}
const resMul=(t,st,el)=>(1-Math.min(RES_CAP,t[st==='mag'?'rMag':'rPhys']||0)/100)*(el&&ELEM[el]?1-Math.min(RES_CAP,(t[ELEM[el].k]||0)+buffSum(t,ELEM[el].k))/100:1);
function hit(u,t,mult,st,sk){ return CB.hit(u,t,mult,st,sk,W_PVE) }
function applyFx(u,t,f,k,sk){ CB.fx(u,t,f,k,sk,W_PVE); refresh(t) }
async function exec(u,sk,tgt){
  const el=unitEl(u); if(el){el.style.transform='scale(1.03)';setTimeout(()=>{el.style.transform=''},220)}
  await sleep(260);
  CB.exec(u,sk,tgt,W_PVE);
  refreshAll();
  await sleep(420);
}
const AP_REGEN=1;
const PA_POT=2,PA_CD=6;
function stTick(u){ u.st.forEach(s=>s.dur--); for(const s of u.st) if(s.k==='shd'&&s.dur<=0) u.shield=Math.max(0,(u.shield||0)-s.v); for(const s of u.st) if(s.k==='apb'&&s.dur<=0){ u.maxAp=Math.max(0,(u.maxAp||0)-s.v); u.ap=Math.min(u.ap||0,u.maxAp) } u.st=u.st.filter(s=>s.dur>0) }
function addApb(u){ u.st=u.st.filter(s=>{ if(s.k==='apb'){u.maxAp-=s.v; return false} return true }); u.st.push({k:'apb',v:PA_POT,dur:3}); u.maxAp=(u.maxAp||0)+PA_POT; u.ap=(u.ap||0)+PA_POT }
const canAct=u=>u.hp>0&&(!u.atkUsed||u.skills.some(id=>(u.cds[id]||0)===0&&(u.ap||0)>=apOf(u,id)));
function tauntOf(list){return list.find(x=>x.hp>0&&x.st.some(s=>s.k==='taunt'))}
function ai(u,noAtk){
  if(u.team==='h'&&u.gx&&u.gx.v7) return CB.ai(u,noAtk,W_PVE);
  const foesA=alive(foes(u)),friA=alive(friends(u));
  const usable=u.skills.filter(id=>(u.cds[id]||0)===0&&(u.ap||0)>=apOf(u,id)).map(id=>({sk:SK[id],rank:u.ranks[id]||1}));
  const isHeal=x=>x.sk.tg==='lowAlly'&&x.sk.fx&&x.sk.fx.some(f=>f.k==='heal');
  const low=friA.slice().sort((a,b)=>a.hp/a.maxHp-b.hp/b.maxHp)[0];
  const healer=usable.find(isHeal);
  if(healer&&low&&low.hp/low.maxHp<.55) return {skill:healer.sk,target:low};
  let best=null,bs=1;
  for(const x of usable){
    const sk=x.sk; if(isHeal(x)) continue; if(sk.self&&u.hp/u.maxHp<.4) continue;
    let s=(sk.mult||0)*(sk.tg==='all'?foesA.length*.8:1)*sc(x.rank);
    { const dt=(sk.fx||[]).find(f=>f.k==='det'); if(dt) s*=foesA.some(f=>hasSt(f,'dot',dt.n))?2.4:.35; }
    if(sk.ifSt) s*=foesA.some(f=>sk.ifSt.k==='para'?hasSt(f,'para'):hasSt(f,'dot',sk.ifSt.n))?1+sk.ifSt.v*.8:.9;
    if(sk.lowHp) s*=1+sk.lowHp*(1-u.hp/u.maxHp);
    if(sk.exec) s*=foesA.some(f=>f.hp/f.maxHp<sk.exec.thr/100)?1.8:.8;
    if(!sk.mult){
      const need=(sk.fx||[]).some(f=>(f.k==='buff'&&friA.every(a=>!a.st.some(q=>q.k==='buff'&&q.stat===f.stat)))||(f.k==='shield'&&u.shield<u.maxHp*.1&&(sk.tg!=='self'||true)));
      s=need?1.7:0;
    }
    s*=rand(.85,1.15);
    if(u.team==='e'&&Math.random()<.25) s*=.5;
    if(s>bs){bs=s;best=x}
  }
  if(!best&&noAtk) return null;
  const skill=best?best.sk:SK.atk;
  let target=null;
  if(skill.tg==='one'){
    if(u.team==='h'){ const dt=(skill.fx||[]).find(f=>f.k==='det'),need=dt?(f=>hasSt(f,'dot',dt.n)):skill.ifSt?(f=>skill.ifSt.k==='para'?hasSt(f,'para'):hasSt(f,'dot',skill.ifSt.n)):null;
      target=(need&&foesA.find(need))||foesA.slice().sort((a,b)=>a.hp-b.hp)[0] }
    else target=tauntOf(foesA)||(Math.random()<.3?foesA.slice().sort((a,b)=>a.hp/a.maxHp-b.hp/b.maxHp)[0]:pick(foesA));
  }
  return {skill,target};
}
function playerChoice(u){
  return new Promise(res=>{C.waiting={u,res};C.pending=null;renderActbar();refreshAll()});
}
async function turn(u){
  C.turn=u.id; if(u.maxAp) u.ap=u.maxAp; refreshAll();
  const r0=CB.start(u,W_PVE); refreshAll();
  if(u.hp<=0){ CB.end(u); C.turn=null;refreshAll();return}
  let skip=!!r0.skip; if(skip) await sleep(500);
  if(!skip){
    u.atkUsed=false;
    if(u.team==='h'){
      for(let n=0;n<12;n++){
        if(!canAct(u)) break;
        let ch;
        if(!S.auto){ ch=await playerChoice(u); if(C.abort) return; if(!ch||ch.end) break }
        else { await sleep(300); ch=ai(u,u.atkUsed); if(!ch) break }
        if(ch.skill.id==='atk') u.atkUsed=true;
        await exec(u,ch.skill,ch.target);
        if(C.abort||checkEnd()) break;
      }
      C.waiting=null; C.pending=null; renderActbar();
    }else{
      await sleep(380);
      const ch=ai(u); await exec(u,ch.skill,ch.target);
    }
  }
  CB.end(u);
  C.turn=null; refreshAll();
}
function checkEnd(){
  if(!alive(C.units.filter(u=>u.team==='e')).length) return 'win';
  if(!alive(C.units.filter(u=>u.team==='h')).length) return 'lose';
  return null;
}
async function loop(id){
  while(true){
    if(C.abort||C.id!==id) return;
    C.round++; logLine(`Tour ${C.round}`,'rd');
    if(C.round===31) logLine('Les ennemis entrent en rage : leurs dégâts augmentent à chaque tour.','cr');
    { const rb=DIFF[C.diff||'normal'].rage; if(rb<30&&C.round===rb+1&&C.units.some(x=>x.boss&&x.hp>0)) logLine('Le boss entre en rage : ses dégâts augmentent à chaque tour !','cr') }
    const order=alive(C.units).sort((a,b)=>effStat(b,'spd')-effStat(a,'spd')||Math.random()-.5); C.order=order.map(u=>u.id); renderInit();
    for(const u of order){
      if(C.abort||C.id!==id) return;
      if(u.hp<=0) continue;
      await turn(u);
      if(C.abort||C.id!==id) return;
      const r=checkEnd(); if(r){await finish(r);return}
    }
  }
}
function inFight(){ return C.phase==='fight'||C.phase==='prep' }
const PREP_MS=10000;
async function startBattle(chain,raid){
  if(inFight()) return;
  const party=partyHeroes(); if(!party.length){toast('Aucun personnage.');return}
  C.abort=false; C.id++; const id=C.id;
  C.paused=false; C.diff=curDiff(); C.hero=C.diff!=='normal'; C.bonus={xp:0,loot:0}; C.pcd={}; C.raid=raid||null; C.units=[...party.map(mkHeroUnit),...(C.raid?[soloBoss(C.raid)]:mkEnemies(UI.zone,UI.stage,party.length,C.diff))];
  C.round=0; C.order=null; C.logs=[]; C.result=null; C.phase='fight'; C.zone=UI.zone; C.stage=UI.stage; C.pending=null; C.waiting=null; C.turn=null;
  render();
  logLine(C.raid?`Raid en solo : ${RAIDS.find(x=>x.id===C.raid.r).n} (palier +${C.raid.t})`:`${ZONES[C.zone].n} — étape ${C.stage}${C.hero?' ('+DIFF[C.diff].n.toLowerCase()+')':''}`,'rd');
  if(!C.test&&!(chain&&S.auto)){
    C.phase='prep'; C.prepEnd=Date.now()+PREP_MS; C.prepGo=false; renderActbar(); logLine('Préparation : 10 secondes pour boire vos potions avant le combat.','rd');
    while(!C.abort&&C.id===id&&!C.prepGo&&Date.now()<C.prepEnd){ await new Promise(r=>wTO(r,200)); const el=document.querySelector('#actbar [data-prep]'); if(el) el.textContent=Math.max(0,Math.ceil((C.prepEnd-Date.now())/1000))+' s' }
    if(C.abort||C.id!==id) return; C.phase='fight'; renderActbar();
  }
  await sleep(500);
  await loop(id);
}
async function finish(r){
  if(C.raid&&!C.test) return raidSoloFinish(r);
  C.pending=null;C.waiting=null;C.turn=null;
  if(C.test){ C.test=false; C.result={win:r==='win',test:true}; logLine(r==='win'?'Victoire (combat de test, sans récompense).':'Défaite (combat de test).',r==='win'?'hl':'cr'); C.phase='result'; if(UI.tab==='combat') render(); return }
  const D=DIFF[C.diff||'normal'],party=partyHeroes(),L=D.L||C.zone*10+C.stage,boss=C.stage===10,lb=(1+(buffOn('p_loot')?50:0)/100)*D.rw;
  const enemies=C.units.filter(u=>u.team==='e');
  if(r==='win'){
    const goldF=party.reduce((a,h)=>a+heroStats(h).goldFind,0);
    let xp=0,gold=0; for(const e of enemies){xp+=(10+6*L)*(e.boss?4:1);gold+=(5+2.5*L)*(e.boss?5:1)}
    if(C.hero&&boss){xp*=1.5;gold*=1.5} xp*=D.rw;
    gold=Math.round(gold*(1+goldF/100)*lb*.7); xp=Math.round(xp*(1+(buffOn('p_xp')?50:0)/100));
    S.gold+=gold; S.kills+=enemies.length; qEv('kill',enemies.length); qEv('advwin'); if(boss){ qEv('boss'); sEv('boss:'+(C.diff||'normal')+':'+C.zone); if(C.diff==='myth') sEv('bossm') } if(C.diff&&C.diff!=='normal') qEv('hardwin');
    const ups=[];
    for(const h of S.heroes){const inP=S.party.includes(h.id);const n=gainXp(h,inP?xp:Math.round(xp*.4));if(n){ups.push(`Niveau ${h.lvl} atteint !`);S.lvlDot=true;lvlToast(h,n);if(h.lvl>=HERO_L&&h.lvl-n<HERO_L)setTimeout(()=>toast('✦ Mode Héroïque débloqué !'),900)}}
    const mats={},zm=ZONES[C.zone].mats;
    const amt=()=>Math.max(1,Math.round((ri(1,3)+Math.floor(L/8))*.25));
    mats[zm[0]]=amt()*(boss?3:1); mats[zm[1]]=Math.max(1,Math.round(amt()*(zm[1]==='rune'?.3:1)))*(boss?3:1);
    if(boss&&Math.random()<.5) mats.rune=(mats.rune||0)+1;
    if(boss&&C.zone===ZONES.length-1&&Math.random()<D.prism){mats.prisme=1;setTimeout(()=>toast('✦ Le Dévoreur a laissé un Prisme divin !'),300)}
    if(lb>1) for(const k of Object.keys(mats)) if(k!=='prisme') mats[k]=Math.round(mats[k]*lb);
    for(const k of HARV) delete mats[k];
    gain(mats);
    const items=[]; { const Z=rollZoneLoot(C.zone,boss,D.iL||L,lb); gain(Z.mats); for(const [k,v] of Object.entries(Z.mats)) mats[k]=(mats[k]||0)+v; S.lastLoot=[]; let rcN=0; const rcV={}; for(const it of Z.items){ if(lootKeep(it)){ addInv(it); items.push(it); S.lastLoot.push({s:it.slot,r:it.rarity,n:it.name}) } else { const v=salvageValue(it); gain(v); for(const [k,x] of Object.entries(v)) rcV[k]=(rcV[k]||0)+x; it.rc=1; items.push(it); rcN++; S.lastLoot.push({s:it.slot,r:it.rarity,n:it.name,rc:1}) } } if(rcN){ qEv('recycle',rcN); C._rc={n:rcN,v:rcV} } else C._rc=null }
    const P=prog(C.diff||'normal'); if(boss){S.bossK=S.bossK||{}; S.bossK[(C.diff||'normal')+C.zone]=1}
    if(C.diff==='hero'&&boss&&C.zone===ZONES.length-1&&!S.mythOpen){S.mythOpen=true;setTimeout(()=>toast('✦ Mode Mythique débloqué !'),600)}
    if(C.zone===P.zone&&C.stage===P.stage){
      if(C.stage<10) P.stage++; else if(C.zone<ZONES.length-1){P.zone++;P.stage=1}
      if((C.diff||'normal')===curDiff()){UI.zone=P.zone;UI.stage=P.stage}
    }
    C.result={win:true,xp,gold,mats,items,ups,rc:C._rc};
    logLine('Victoire !','hl');
  }else{
    C.result={win:false}; logLine('Vous êtes tombé au combat…','cr'); S.farm=false;
  }
  C.phase='result'; save(); renderHeader(); renderTabs(); if(UI.tab==='combat') render();
  if(r==='win'&&S.farm&&S.auto){
    const id=C.id; const go=()=>{ if(C.phase!=='result'||C.id!==id||!S.farm) return; if(C.paused) return wTO(go,200); startBattle(true) }; wTO(go,1400/(S.speed||1));
  }
}

