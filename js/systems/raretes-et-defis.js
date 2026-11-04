/* Cendrelame · systems/raretes-et-defis.js */
/* ================= 0.8.2 : prismes, rareté, défis, butin, aide ================= */
const pc82=p=>String(Math.round(p*10)/10).replace('.',',')+' %';
/* ---------- puissance des raretés : +15 points par rareté, Divin +50 ---------- */
const RAR_OLD82=[1,1.05,1.10,1.15,1.20,1.25],RAR_NEW82=[1,1.15,1.30,1.45,1.60,2.10];
RAR_NEW82.forEach((m,i)=>{ if(RAR[i]) RAR[i].m=m });
function r82Item(o){ if(!o||o.r82||!RAR[o.rarity]) return; const f=RAR_NEW82[o.rarity]/RAR_OLD82[o.rarity];
  if(f!==1){ for(const s of Object.keys(o.imp||{})) o.imp[s]=affRound(s,o.imp[s]*f); for(const a of o.aff) if(a.s!=='ap') a.v=affRound(a.s,a.v*f) }
  o.r82=1 }
function r82Walk(o,d){ if(!o||typeof o!=='object'||(d|0)>9) return; if(Array.isArray(o)){ for(const x of o) r82Walk(x,(d|0)+1); return }
  if(o.slot&&Array.isArray(o.aff)){ r82Item(o); return } for(const k in o) if(o[k]&&typeof o[k]==='object') r82Walk(o[k],(d|0)+1) }
function accR82(){ if(!ACC||ACC.r82) return; r82Walk(ACC); ACC.r82=1; try{ saveAcc() }catch(e){} }
const _genItem82=genItem; genItem=function(...a){ const it=_genItem82(...a); if(it) it.r82=1; return it };
/* ---------- niveau d'objet du butin ---------- */
DIFF.hero.iL=60; DIFF.myth.iL=60;
const RD_IL=t=>(t||0)>=10?70:65;
const RD_EQW=t=>{ t=Math.min(15,t||0); return [0,0,60-2*t,32+t,8+t,0] };
/* ---------- défis : boss +30 % de dégâts, plus de mode à deux ---------- */
SOLO.atk=+(SOLO.atk*1.3).toFixed(3);
startRaid=function(){};
function rdGear(t){ const h=S.heroes[0],r=wpick(RD_EQW(t)),sl=slotType(pick(SLOTS)),it=genItem(sl,RD_IL(t),r,null,h.cls);
  const ok=addInv(it); RD.lastIt={it,ok}; return it }
function rdGearHTML(){ const L=RD.lastIt; if(!L) return ''; RD.lastIt=null; const it=L.it;
  return `<div class="rdgear82" style="--rc:var(--r${it.rarity})" data-tip="${L.ok?'f:'+it.id:''}"><span class="rdgi">${bigIcon(it)}</span><span><b style="color:var(--r${it.rarity})">${esc(it.name)}</b><small>${RAR[it.rarity].n} · niveau d’objet ${it.ilvl}${L.ok?'':' · inventaire plein : recyclé'}</small></span></div>` }
/* ---------- regroupement du butin ---------- */
const FAM82={pd:'Poudre runique',es:'Essences magiques',ru:'Runes',gm:'Pierres de rareté',ch:'Bonus de réussite',st:'Pierre de renforcement',sc:'Parchemin vierge',cr:'Cristal d’ascension'};
const famOf82=k=>k==='pd_rune'?'pd':k==='st_up'?'st':k==='sc_blank'?'sc':k.slice(0,2);
function lootFams(list){ const o={},ord=[]; for(const [k,p] of list){ const f=famOf82(k); if(!o[f]){ o[f]=[]; ord.push(f) } o[f].push([k,p]) }
  return ord.map(f=>({f,ks:o[f],any:100*(1-o[f].reduce((a,[,p])=>a*(1-Math.min(95,p)/100),1)),r:Math.max(...o[f].map(([k])=>nwR(k)))})) }
const zIl82=z=>{ const D=DIFF[curDiff()]; return D.iL||D.L||z*10+(UI.stage||1) };
function zoneLootHTML(z,boss){
  const Z=zLoot(z),dk=curDiff(),m=(boss?3:1)*dropM(dk)*(DIFF[dk].rw||1),eqP=Math.min(95,Z.eq*m),top=Z.rw.reduce((a,w,i)=>w?i:a,0);
  const eq=`<span class="zlt zlg" style="--rc:var(--r${top})" data-tip="zl:eq:${z}:${boss?1:0}">${eqSvg('armor',EQ_RC[top])}<em>${pc82(eqP)}</em><i class="zln">${Z.rw.filter(Boolean).length}</i></span>`;
  const fams=lootFams(Z.it.map(([k,p])=>[k,Math.min(95,p*m)])).map(F=>`<span class="zlt zlg" style="--rc:var(--r${F.r})" data-tip="zl:f:${z}:${boss?1:0}:${F.f}"><svg class="mfi" viewBox="0 0 24 24">${MI[F.ks[F.ks.length-1][0]]}</svg><em>${pc82(F.any)}</em>${F.ks.length>1?`<i class="zln">${F.ks.length}</i>`:''}</span>`).join('');
  return `<h4>Butin ${boss?'du boss':'de la zone'} <small class="mute">· survolez une icône pour le détail</small></h4><div class="zloot">${eq}${fams}</div>`;
}
const tipBox82=(rc,t,s,body,foot)=>`<article class="it s8tip" style="--rc:${rc}"><header><b>${t}</b><small>${s}</small></header><div class="skbody">${body}${foot?`<p class="mute">${foot}</p>`:''}</div></article>`;
const tIc82=k=>`<span class="s8ti" style="--rc:var(--r${nwR(k)})"><svg class="mfi" viewBox="0 0 24 24">${MI[k]||''}</svg></span>`;
function zlTip(k){ const p=k.split(':'),z=+p[2],boss=p[3]==='1',Z0=zLoot(z),dk=curDiff(),Z={...Z0,rw:rwD(Z0.rw,dk)},m=(boss?3:1)*dropM(dk)*(DIFF[dk].rw||1);
  if(p[1]==='eq'){ const tot=Z.rw.reduce((a,b)=>a+b,0),eqP=Math.min(95,Z.eq*m);
    return tipBox82('var(--line2)','Équipement',`${pc82(eqP)} par combat${boss?' (boss ×3)':''} · niveau d’objet ${zIl82(z)}`,
      `<table class="s8tt"><tr><th>Rareté</th><th>Chance par combat</th><th>Part</th></tr>${Z.rw.map((w,r)=>w?`<tr><td style="color:var(--r${r});font-weight:700">${RAR[r].n}</td><td class="num">${pc82(eqP*w/tot)}</td><td class="num">${pc82(w/tot*100)}</td></tr>`:'').join('')}</table>`,
      `Un seul objet au maximum par combat, pour un emplacement au hasard, adapté à votre classe. Rares et Épiques : 12 % de chance d’une affixe bonus.${curDiff()!=='normal'?` En ${DIFF[curDiff()].n} : butin de niveau 60, chances ×${String(dropM(curDiff())*(DIFF[curDiff()].rw||1)).replace('.',',')} et raretés plus hautes.`:''}`) }
  const F=lootFams(Z.it.map(([q,x])=>[q,Math.min(95,x*m)])).find(x=>x.f===p[4]); if(!F) return '';
  return tipBox82(`var(--r${F.r})`,FAM82[F.f]||MAT_OBJ[F.ks[0][0]],`${pc82(F.any)} d’en obtenir au moins un par combat${boss?' (boss ×3)':''}`,
    `<table class="s8tt"><tr><th>Objet</th><th>Rareté</th><th>Chance</th></tr>${F.ks.map(([q,x])=>`<tr><td>${tIc82(q)}${esc(MAT_OBJ[q]||q)}</td><td style="color:var(--r${nwR(q)})">${RAR[nwR(q)].n}</td><td class="num">${pc82(x)}</td></tr>`).join('')}</table>`,
    F.ks.length===1?esc(MAT_D[F.ks[0][0]]||''):'Chaque objet est tiré séparément : vous pouvez en obtenir plusieurs dans le même combat.') }
function rlTip(k){ const p=k.split(':'),t=rdTier(),r=RAIDS[UI.raidB||0];
  if(p[1]==='eq'){ const W=RD_EQW(t),tot=W.reduce((a,b)=>a+b,0);
    return tipBox82('var(--r4)','Équipement de défi',`1 objet garanti par victoire · niveau d’objet ${RD_IL(t)}`,
      `<table class="s8tt"><tr><th>Rareté</th><th>Chance</th></tr>${W.map((w,i)=>w?`<tr><td style="color:var(--r${i});font-weight:700">${RAR[i].n}</td><td class="num">${pc82(w/tot*100)}</td></tr>`:'').join('')}</table><table class="s8tt"><tr><th>Palier</th><th>Niveau d’objet</th></tr><tr><td>+0 à +9</td><td class="num">65</td></tr><tr><td>+10 et plus</td><td class="num">70 (maximum du butin)</td></tr></table>`,
      `Chaque palier augmente un peu les chances d’Épique et de Légendaire (jusqu’au palier +15). Équipement bonus : ${pc82(rdG2(t))} à ce palier (+2 % par palier, 30 % au maximum). Le niveau requis reste 50. Un Cristal d’ascension peut encore ajouter +5 niveaux d’objet, une fois par objet.`) }
  if(p[1]==='asc'){ const ch=ascCh(t); return tipBox82('var(--r4)',NEWI.cr_asc.n,`${pc82(ch)} par victoire à ce palier`,`<p>${esc(NEWI.cr_asc.d)}</p>`,'3 % au palier +0, puis +0,6 % par palier (15 % au maximum).') }
  if(p[1]==='m'){ const q=p[2],rw=soloRw(r,t); return tipBox82('var(--line2)',MAT_N[q]||q,`${fmt(rw[q]||0)} par victoire à ce palier`,`<p>${esc(MAT_D[q]||'')}</p>`,'Les récompenses augmentent avec le palier.') }
  return '' }
const _tipHTML82=tipHTML; tipHTML=function(k){ if(k.startsWith('zl:')) return zlTip(k); if(k.startsWith('rl:')) return rlTip(k); return _tipHTML82(k) };
/* ---------- défis : interface identique à la campagne ---------- */
const ESK_TG={one:'une cible',all:'tous les ennemis',allies:'le boss et ses alliés',self:'lui-même'};
function eskD(q){ const fx=(q.fx||[]).map(f=>f.k==='stun'?`${f.ch||100} % de chance d’étourdir (${f.dur} tour${f.dur>1?'s':''})`:f.k==='buff'?`+${f.v} % de ${f.stat==='atk'?'Force':f.stat} pendant ${f.dur} tours`:f.k==='debuff'?`${f.v} % de ${f.stat==='def'?'Défense':f.stat} pendant ${f.dur} tours`:f.k==='dot'?`${f.n||'Dégâts'} : ${Math.round(f.v*100)} % de sa Force par tour pendant ${f.dur} tours`:'').filter(Boolean);
  return [q.mult?`${Math.round(q.mult*100)} % de dégâts`:'',q.el?`élément ${q.el}`:'',`cible : ${ESK_TG[q.tg]||q.tg}`,...fx,q.cd?`recharge ${q.cd} tours`:''].filter(Boolean).join(' · ') }
function rdInfoHTML(){ const r=RAIDS[UI.raidB||0],t=rdTier(),b=soloBoss({r:r.id,t}),mag=r.role==='mag';
  const res=RES_K.filter(k=>b[k]).map(k=>`<span class="${b[k]<0?'neg':''}">${esc(STAT_N[k].replace(/^Résistance (au |à la |aux |à l’)?/,''))} ${b[k]>0?'+':''}${b[k]} %</span>`).join('')||'<span>aucune</span>';
  const row=(a,v)=>`<dt>${a}</dt><dd class="num">${v}</dd>`;
  return `<div class="box rdi82"><button class="rdi82x" data-act="rdInfoX" ${ttip('Fermer')}>${uic('xx')}</button><div class="amhead">${zoneScene(raidSc(r),'ri')}<span><small>Défi · palier +${t} · niveau ${r.L}</small><h2>${esc(r.n)}</h2></span></div>
   <div class="rdi82b"><p class="amnote">${esc(r.d)}</p>
    <h4>Statistiques au palier +${t}</h4><dl class="mpst">${row('PV',fmt(b.hp))}${row(mag?'Intelligence':'Force',fmt(Math.round(b.atk)))}${row('Défense',fmt(b.def))}${row('Défense magique',fmt(b.res))}${row('Vitesse',r1(b.spd))}${row('Critique',b.crit+' %')}${row('Dégâts critiques',b.critDmg+' %')}${row('Points d’action',b.ap)}</dl>
    <h4>Résistances</h4><div class="mpchips">${res}</div>
    <h4>Compétences</h4><ul class="rdisk">${r.sk.map(id=>{const q=SK[id];return `<li><b>${esc(q.n)}</b><small>${esc(eskD(q))}</small></li>`}).join('')}</ul>
    <h4>Règles</h4><ul class="rdisk"><li><small>Rage à partir du tour ${RD_RAGE+1} : ses dégâts augmentent à chaque tour.</small></li><li><small>Chaque palier ajoute +5 % de PV, d’attaque et de défense (cumulatif).</small></li><li><small>Les PV sont restaurés après le combat. Pas de limite d’essais.</small></li></ul></div></div>` }
function rdInfoOpen(){ rdInfoX(); const d=document.createElement('div'); d.className='modal'; d.id='rdinf'; d.innerHTML=rdInfoHTML(); d.addEventListener('click',e=>{ if(e.target===d) rdInfoX() }); document.body.append(d) }
function rdInfoX(){ const d=$('#rdinf'); if(d) d.remove() }
document.addEventListener('keydown',e=>{ if(e.key==='Escape'&&$('#rdinf')) rdInfoX() });
function viewRaidMap82(){
  const H=S.heroes[0],R0=S.raidS||{w:0,l:0};
  if(UI.raidB==null||!RAIDS[UI.raidB]) UI.raidB=0;
  const r=RAIDS[UI.raidB],mx=raidMax(r.id),t=rdTier(),b=soloBoss({r:r.id,t}),rw=soloRw(r,t),lock=H.lvl<r.req;
  const pt=i=>RAID_PTS[i]||[14+i*22,i%2?34:62];
  const segs=RAIDS.slice(1).map((_,k)=>{const a=pt(k),c=pt(k+1),done=raidMax(RAIDS[k].id)>0;return `<path d="M${a[0]*10} ${a[1]*5}L${c[0]*10} ${c[1]*5}" stroke="#6b4a22" stroke-width="${done?5:4}" ${done?'':'stroke-dasharray="2 14"'} stroke-linecap="round" fill="none" opacity="${done?.85:.75}"/>`}).join('');
  const nodes=RAIDS.map((x,k)=>{const lk=H.lvl<x.req,p=pt(k),m2=raidMax(x.id);return `<button class="amnode ${lk?'lock':m2?'clear':'cur'} ${k===UI.raidB?'on':''}" style="left:${(p[0]/70*100).toFixed(1)}%;top:${p[1]}%" data-act="rdBoss" data-i="${k}" aria-pressed="${k===UI.raidB}" ${lk?ttip(x.n,'Niveau '+x.req+' requis.'):''}><span class="ampic">${zoneScene(raidSc(x),'r')}<span class="ambadge ${m2?'ok':''}" ${ttip('Palier maximum atteint','+'+m2)}>+${m2}</span></span><b>${lk?uic('lock'):''}${esc(x.n)}</b><small>Niveau ${x.L} · requis ${x.req}</small></button>`}).join('');
  const f0=Math.max(0,mx-8);
  const trail=Array.from({length:10},(_,k)=>{const i=f0+k,ok=i<=mx,done=i<mx,cur=i===mx;
    return `<button class="tn ${done?'done':''} ${cur?'cur':''} ${ok?'':'lock'} ${i>=10?'boss':''} ${t===i?'sel':''}" ${ok?'':'disabled'} data-act="rdTier" data-t="${i}" aria-pressed="${t===i}" ${ttip('Palier +'+i,ok?(i?`+${Math.round((rdMul(i)-1)*100)} % de difficulté`:'Difficulté de base')+` · butin niveau ${RD_IL(i)}`+(done?' · réussi':''):`Battez le palier +${i-1} pour le débloquer.`)}>${done&&t!==i?uic('check'):i}</button>`}).join('<i></i>');
  const zl=(cls,rc,ic,em,tip)=>`<span class="zlt zlg" style="--rc:${rc}" data-tip="${tip}">${ic}<em>${em}</em></span>`;
  const loot=zl('','#c99a3a',matIcon('gold'),fmt(rw.gold),'tx:Or|'+fmt(rw.gold)+' or par victoire à ce palier.')
   +zl('','var(--r'+RD_EQW(t).reduce((a,w,i)=>w?i:a,0)+')',eqSvg('armor',EQ_RC[4]),'100 %','rl:eq')
   +Object.entries(rw).filter(([k])=>k!=='gold').map(([k,v])=>zl('','var(--line2)',matIcon(k),'×'+fmt(v),'rl:m:'+k)).join('')
   +zl('','var(--r4)',`<svg class="mfi" viewBox="0 0 24 24">${MI.cr_asc}</svg>`,pc82(ascCh(t)),'rl:asc')
   +zl('','var(--r3)',`<svg class="mfi" viewBox="0 0 24 24">${MI.rm_aff}</svg>`,pc82(rmCh(t)),'nw:rm_aff')
   +zl('','#c99a3a',matIcon('c_relic'),pc82(chestRate(t)),'rw:chest');
  const mag=r.role==='mag';
  return `<div class="amap rd82">
   <svg class="ambg" viewBox="0 0 1000 500" preserveAspectRatio="none" aria-hidden="true">${amapBg()}<rect width="1000" height="500" fill="url(#amv)"/></svg>
   <div class="amfield"><svg class="amlines" viewBox="0 0 700 500" preserveAspectRatio="none" aria-hidden="true">${segs}</svg>${nodes}</div>
   <aside class="aminfo" aria-label="Défi sélectionné"><div class="amhead">${zoneScene(raidSc(r),'rh')}<span><small>Défi · niveau ${r.L} · palier max +${mx}</small><h2>${esc(r.n)}</h2></span></div>
    <div class="ambody">
     <h4>Paliers <span class="amcnt">· +5 % de difficulté par palier</span></h4><div class="amtrail">${trail}</div>
     <h4>Boss · niveau <span class="num">${r.L}</span> <span class="amcnt">· palier +${t} · rage au tour ${RD_RAGE+1}</span></h4>
     <div class="amboss rdb82"><span class="tile" style="--h:8">${foeIcon({rid:r.id},'boss')}</span><span><small>${fmt(b.hp)} PV · ${mag?'Intelligence':'Force'} ${fmt(Math.round(b.atk))}</small><b>${esc(r.n)}</b></span><button class="rdinf82" data-act="rdInfo" ${ttip('Infos du boss','Statistiques, résistances et compétences.')}>${uic('info')}</button></div>
     <h4>Butin du défi <small class="mute">· survolez une icône pour le détail</small></h4><div class="zloot">${loot}</div>
     ${lock?`<p class="amnote">${uic('lock')} Niveau ${r.req} requis (vous êtes niveau ${H.lvl}).</p>`:''}
     <div class="amfight"><div class="amfrow"><button class="btn pri amgo" data-act="rdSolo" ${lock||inFight()?'disabled':''}>Combattre</button>${gearBtn()}</div>
      <small class="mute">Puissance de ${esc(H.name)} : <b class="num">${Math.round(heroPower(H))}</b> · Bilan : <b>${R0.w}</b> réussi${R0.w>1?'s':''} · <b>${R0.l}</b> échec${R0.l>1?'s':''}</small></div>
    </div></aside></div>`;
}
/* ---------- Forge : prismes divins, pierres, équipement du sac ---------- */
const PR_MAX=10,PR_CH=10;
const prN=()=>clamp(UI.fPrN==null?Math.min(PR_MAX,Math.max(1,matAll('prisme'))):UI.fPrN,1,PR_MAX);
const stNeed=it=>((it&&it.up)||0)>=5?2:1;
const upNeed82=(it,k)=>!it||!k?1:k==='prisme'?prN():k==='st_up'?stNeed(it):1;
function prismInfo(it){ const ok0=it.rarity===4,n=prN(),have=matAll('prisme'),ch=Math.min(100,n*PR_CH),f=RAR[5].m/RAR[4].m,kk=upMul(it);
  const why=!ok0?`Le Prisme divin s’utilise sur un objet légendaire (objet actuel : ${RAR[it.rarity].n.toLowerCase()}).`:have<n?`Il vous faut ${n} Prisme${n>1?'s':''} divin${n>1?'s':''} (vous en avez ${have}).`:'';
  const pips=Array.from({length:PR_MAX},(_,i)=>`<i class="${i<n?'on':''}"></i>`).join('');
  return {ok:ok0&&have>=n,why,need:n,cost:{gold:upCostG.gem(it)},chance:ch,title:'Prisme divin',rar:5,
    html:`<p>Rareté <b style="color:var(--r4)">Légendaire</b> → <b style="color:var(--r5)">Divin</b> : la puissance de l’objet passe de ×${String(RAR[4].m).replace('.',',')} à ×${String(RAR[5].m).replace('.',',')} (+${Math.round((RAR[5].m-RAR[4].m)*100)} % de ses valeurs de base).</p>
     <h4>Prismes placés</h4><div class="prsel82"><button class="btn sm" data-act="fPrN" data-d="-1" ${n<=1?'disabled':''} ${ttip('Retirer un prisme')}>−</button><b class="num">${n}</b><button class="btn sm" data-act="fPrN" data-d="1" ${n>=PR_MAX?'disabled':''} ${ttip('Ajouter un prisme')}>+</button><button class="btn sm" data-act="fPrN" data-d="max" ${ttip('Maximum','Place autant de prismes que possible (10 au maximum).')}>Max</button><small class="mute">${fmt(have)} en stock</small></div>
     <div class="prpips82" role="img" aria-label="${n} prismes sur 10">${pips}</div>
     <h4>Chance de réussite</h4><div class="mfchance"><div class="mfring" style="--p:${ch}"><b class="num">${ch} %</b></div><ul><li>10 % par prisme <b class="num">× ${n}</b></li><li class="mute">10 prismes = réussite garantie</li></ul></div>
     <p class="mute">Tous les prismes placés sont consommés. En cas d’échec, l’objet reste légendaire et intact.</p>
     ${ok0?`<h4>Aperçu si réussite</h4><ul class="mfprev">${it.aff.map(a=>`<li>${fmtStat(a.s,a.s==='ap'?a.v:a.v*kk)} → <b class="ok">${fmtStat(a.s,a.s==='ap'?a.v:affRound(a.s,a.v*f)*kk)}</b></li>`).join('')}</ul>`:''}`} }
function prismDo(it,I){ const n=I.need||1; removeMat('prisme',n); const ok=Math.random()*100<I.chance;
  if(!ok) return {ok,msg:`Échec : les ${n} prisme${n>1?'s':''} se brisent, ${esc(it.name)} reste légendaire.`};
  const f2=RAR[5].m/RAR[4].m; for(const s of Object.keys(it.imp||{})) it.imp[s]=affRound(s,it.imp[s]*f2); it.aff.forEach(a=>{ if(a.s!=='ap') a.v=affRound(a.s,a.v*f2) }); it.rarity=5; qEv('rar'); if(!it.leg){ it.leg=it.slot; if(!it.lp) it.lp=rollLp82() }
  return {ok,msg:`Réussite : ${esc(it.name)} devient divin !`} }
function fBagList(){ const L=invItems().slice().sort((a,b)=>b.rarity-a.rarity||b.ilvl-a.ilvl||(b.up||0)-(a.up||0));
  return `<h4>Équipement du sac <small class="mute num">${L.length}</small></h4>${L.length?`<div class="mfbag82">${L.map(x=>`<button class="mfbi82" style="--rc:var(--r${x.rarity})" data-act="fPick" data-id="${x.id}" data-tip="f:${x.id}"><span class="mfbic">${bigIcon(x)}${x.up?`<em>+${x.up}</em>`:''}</span><span class="mfbt"><b style="color:var(--r${x.rarity})">${esc(x.name)}</b><small>${RAR[x.rarity].n} · niv. ${x.ilvl}${x.asc?' ✦':''}${clsOk(x)?'':' · autre classe'}</small></span></button>`).join('')}</div>`:'<small class="mute">Aucun équipement dans le sac.</small>'}` }
/* ---------- cosmétiques de duel (permanents, hors saison) ---------- */
const DCOS=[
 {id:'d_o1',t:'orn',n:'Lames croisées',d:'Deux épées croisées à chaque coin de la carte.',r:1,w:5},
 {id:'d_f1',t:'cfx',n:'Sable de l’arène',d:'Du sable doré monte du bas de la carte.',r:1,w:10},
 {id:'d_p1',t:'pf',n:'Couronne du champion',d:'Anneau d’acier hérissé de lames autour du portrait.',r:2,w:20},
 {id:'d_t1',t:'trail',n:'Étincelles d’acier',d:'Gerbe d’étincelles blanches et bleues derrière la carte.',r:2,w:35},
 {id:'d_a1',t:'aura',n:'Esprit du gladiateur',d:'Halo pourpre et éclats d’acier autour du héros.',r:3,w:50},
 {id:'d_o2',t:'orn',n:'Trophée du champion',d:'Bouclier et lances croisées au sommet de la carte, rivets d’acier aux coins.',r:3,w:75},
 {id:'d_bg',t:'bg',n:'Grande arène',d:'Les gradins d’une arène sous un ciel de cendre.',r:3,w:100,bg:104}].map(c=>Object.assign({s:0,src:'duel'},c));
DCOS.forEach(c=>{ COS8.push(c); COS8K[c.id]=c });
SBG_ID[104]='d_bg';
const SW82=`<g stroke="#1a1c20" stroke-width="1.5" stroke-linejoin="round"><path d="M15 8 L60 10.5 L15 13Z" fill="#e4eaf2"/><rect x="11.5" y="2" width="4" height="17" rx="1.5" fill="#c89a3a"/><rect x="1" y="8.5" width="10" height="4" rx="2" fill="#7a2a1a"/><path d="M8 15 L10.5 60 L13 15Z" fill="#e4eaf2"/><rect x="2" y="11.5" width="17" height="4" rx="1.5" fill="#c89a3a"/><rect x="8.5" y="1" width="4" height="10" rx="2" fill="#7a2a1a"/></g><circle cx="10.5" cy="10.5" r="3.6" fill="#c0392b" stroke="#1a1c20" stroke-width="1.2"/>`;
const SHIELD82=`<svg class="ot" viewBox="0 0 120 60" aria-hidden="true"><path d="M6 54 L114 6 M6 6 L114 54" stroke="#5a3a10" stroke-width="6" stroke-linecap="round"/><path d="M6 54 L114 6 M6 6 L114 54" stroke="#c8a060" stroke-width="3" stroke-linecap="round"/><path d="M110 4l8-2-2 8zM10 4l-8-2 2 8z" fill="#e4eaf2" stroke="#1a1c20" stroke-width="1.2"/><path d="M60 3 L82 10 V27 C82 41 72 50 60 57 C48 50 38 41 38 27 V10Z" fill="#8a1a1a" stroke="#e8c060" stroke-width="3" stroke-linejoin="round"/><path d="M60 12v36M48 24h24" stroke="#e8c060" stroke-width="3" stroke-linecap="round"/></svg>`;
ORN8.d_o1=[oCorners(SW82,72,8),'#c0c8d866'];
ORN8.d_o2=[oCorners(OC8.bolt('#c0c8d8'),36,12)+SHIELD82,'#e8c06077'];
PF8.d_p1=()=>`<circle cx="75" cy="75" r="55" fill="none" stroke="#5a606a" stroke-width="9"/><circle cx="75" cy="75" r="55" fill="none" stroke="#c0c8d8" stroke-width="2"/>${ring8(12,(i,a)=>{const [x,y]=P8(a,62);return `<path d="M0 6 L-4 -4 L0 -16 L4 -4Z" fill="${i%3?'#e4eaf2':'#e8c060'}" stroke="#1a1c20" stroke-width="1.2" transform="translate(${x} ${y}) rotate(${(a*180/Math.PI+90).toFixed(0)})"/>`})}${ring8(4,(i,a)=>{const [x,y]=P8(a+Math.PI/4,55);return `<circle cx="${x}" cy="${y}" r="5" fill="#c0392b" stroke="#1a1c20" stroke-width="1.5"/>`})}`;
CFX8.d_f1=()=>Array.from({length:18},(_,i)=>`<i style="--x:${(i*23)%100}%;--d:${(2.4+(i%5)*.5).toFixed(1)}s;--dl:-${((i*.43)%2.8).toFixed(2)}s"></i>`).join('');
TRAIL8.d_t1=['#e8f0ff','#7fb4ff','spark'];
AURA8.d_a1=['--a1:#a0203077;--a2:#e4eaf2',12];
SBG_SVG[104]=()=>`<svg class="zscene" viewBox="0 0 300 150" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs><linearGradient id="sb4" x2="0" y2="1"><stop offset="0" stop-color="#3a2a2a"/><stop offset=".6" stop-color="#a0603a"/><stop offset="1" stop-color="#e8b070"/></linearGradient></defs><rect width="300" height="150" fill="url(#sb4)"/><circle cx="70" cy="40" r="16" fill="#ffe0a0" opacity=".45"/>${[0,1,2,3].map(i=>`<path d="M-10 ${70+i*14} Q150 ${40+i*14} 310 ${70+i*14} V${84+i*14} Q150 ${54+i*14} -10 ${84+i*14}Z" fill="${['#4a2a1a','#5a3420','#6a3e26','#7a482c'][i]}"/>`).join('')}${Array.from({length:9},(_,i)=>`<rect x="${10+i*34}" y="58" width="7" height="${40+(i%2)*6}" fill="#2a1810" opacity=".7"/>`).join('')}<ellipse cx="150" cy="140" rx="170" ry="30" fill="#d8b070"/><path d="M135 128 l15 -26 l15 26z" fill="#2a1810" opacity=".6"/></svg>`;
const duelW=()=>Math.max(ACC.duelW||0,(ACC.cnt&&ACC.cnt.duel)||0);
function duelCosChk(silent){ ACC.scos=ACC.scos||{}; const w=duelW(); let n=0;
  for(const c of DCOS) if(w>=c.w&&!ACC.scos[c.id]){ ACC.scos[c.id]=Date.now(); n++; if(!silent) setTimeout(()=>toast(`✦ Cosmétique de duel débloqué : ${c.n} !`),900+n*400) }
  if(n){ try{ saveAcc() }catch(e){} } return n }
const _qEv82=qEv; qEv=function(ev,n=1){ _qEv82(ev,n); if(ev==='duelwin'){ try{ ACC.duelW=duelW()+n; duelCosChk() }catch(e){} } };
const DC_IC={orn:'frame',pf:'star',cfx:'spark',trail:'flame',aura:'flame',bg:'flag'};
function duelCosHTML(){ duelCosChk(true); const w=duelW(),nx=DCOS.find(c=>w<c.w),got=DCOS.filter(c=>cosOwn(c.id)).length;
  return `<h4>Cosmétiques de duel <small class="mute num">${got} / ${DCOS.length}</small></h4><div class="dcos82">${DCOS.map(c=>`<span class="dcosi82 ${cosOwn(c.id)?'on':''}" style="--rc:${SRAR[c.r][1]}" data-tip="s8:cos:${c.id}">${cosOwn(c.id)?u8(DC_IC[c.t]):uic('lock')}<b class="num">${c.w}</b></span>`).join('')}</div>
   <small class="mute">${nx?`Prochain : <b>${esc(nx.n)}</b> à ${nx.w} victoires (vous : ${w}).`:'Tous les cosmétiques de duel sont débloqués !'} Permanents : ils ne sont pas liés à la saison.</small>` }
const _s8Tip82=s8Tip; s8Tip=function(k){ const [,kind,id]=k.split(':'),c=COS8K[id];
  if(kind==='cos'&&c&&c.src==='duel'){ const o=ACC.scos&&ACC.scos[id],w=duelW();
    return tipBox82(SRAR[c.r][1],esc(c.n),`${COS_T[c.t]} · <span style="color:${SRAR[c.r][1]}">${SRAR[c.r][0]}</span> · Duel`,`<p>${esc(c.d)}</p><p>${o?`Obtenu le ${new Date(o).toLocaleDateString('fr-FR')}.`:`Se débloque à <b>${c.w} victoires en duel</b> (vous : ${Math.min(w,c.w)} / ${c.w}).`}</p>`,'Cosmétique de duel : il n’est pas lié à la saison et reste à vous pour toujours.') }
  return _s8Tip82(k) };
