/* Cendrelame · systems/sons.js (0.8.28)
   Sons fabriqués par le navigateur (Web Audio), sans fichier.
   Un fichier assets/sons/effets/<clé>.mp3 listé dans SONS_PRESENTS remplace le son fabriqué ;
   assets/sons/musiques/<clé>.mp3 ajoute une musique (menu, ville, zone0…zone4, boss, faille, camp). */
const SND={ctx:null,bus:null,last:{},buf:{},mus:null,musK:null,lastSk:0,act:0,toast:0};
const sndCfg=()=>{ const a=(typeof ACC!=='undefined'&&ACC)||{}; if(!a.snd||typeof a.snd!=='object') a.snd={on:1,fx:70,mu:50,clic:1}; return a.snd };
const sndHas=p=>typeof SONS_PRESENTS!=='undefined'&&SONS_PRESENTS.includes(p);
function sndCtx(){
  if(SND.ctx) return SND.ctx; const AC=window.AudioContext||window.webkitAudioContext; if(!AC) return null;
  try{ const c=new AC(),comp=c.createDynamicsCompressor(),g=c.createGain(); comp.threshold.value=-14; comp.connect(c.destination); g.connect(comp); SND.ctx=c; SND.bus=g; sndVol() }catch(e){ return null }
  return SND.ctx;
}
function sndVol(){ const k=sndCfg(); if(SND.bus) SND.bus.gain.value=k.on?(k.fx/100)*.9:0; if(SND.mus) SND.mus.volume=k.on?(k.mu/100)*.6:0 }
/* ---------- briques de base ---------- */
function sTone(f,d,o={}){ const c=SND.ctx,{type='sine',v=.3,to=null,t=0,a=.005}=o,os=c.createOscillator(),g=c.createGain(),T=c.currentTime+t;
  os.type=type; os.frequency.setValueAtTime(f,T); if(to) os.frequency.exponentialRampToValueAtTime(to,T+d);
  g.gain.setValueAtTime(.0001,T); g.gain.exponentialRampToValueAtTime(v,T+a); g.gain.exponentialRampToValueAtTime(.0001,T+d);
  os.connect(g); g.connect(SND.bus); os.start(T); os.stop(T+d+.05) }
let SND_NB=null;
function sNoise(d,o={}){ const c=SND.ctx,{f=1000,to=null,q=1,ft='bandpass',v=.3,t=0,a=.005}=o,T=c.currentTime+t;
  if(!SND_NB){ const n=c.sampleRate*2|0; SND_NB=c.createBuffer(1,n,c.sampleRate); const dd=SND_NB.getChannelData(0); for(let i=0;i<n;i++) dd[i]=Math.random()*2-1 }
  const s=c.createBufferSource(),fl=c.createBiquadFilter(),g=c.createGain(); s.buffer=SND_NB; fl.type=ft; fl.Q.value=q;
  fl.frequency.setValueAtTime(f,T); if(to) fl.frequency.exponentialRampToValueAtTime(to,T+d);
  g.gain.setValueAtTime(.0001,T); g.gain.exponentialRampToValueAtTime(v,T+a); g.gain.exponentialRampToValueAtTime(.0001,T+d);
  s.connect(fl); fl.connect(g); g.connect(SND.bus); s.start(T,Math.random()*.5); s.stop(T+d+.05) }
const sSpark=(t=0,n=6)=>{ for(let i=0;i<n;i++) sTone(2500+Math.random()*2500,.15,{v:.035,t:t+i*.05}) };
/* ---------- sons fabriqués ---------- */
const SFX={
 clic:()=>sTone(1900,.035,{type:'triangle',v:.05}),
 sac:()=>{ sNoise(.16,{f:700,to:350,q:.8,v:.22}); sTone(140,.12,{v:.15,to:90}) },
 equipe:()=>{ sTone(1250,.18,{type:'triangle',v:.12}); sTone(1870,.22,{type:'triangle',v:.08,t:.03}); sNoise(.06,{f:5000,ft:'highpass',v:.08}) },
 achat:()=>[0,.07,.14].forEach((t,i)=>{ sTone(1500+i*250,.16,{type:'square',v:.035,t}); sTone(3000+i*500,.12,{v:.04,t}) }),
 erreur:()=>{ sTone(220,.12,{type:'square',v:.06,to:170}); sTone(165,.16,{type:'square',v:.06,to:120,t:.1}) },
 coup:()=>{ sNoise(.09,{f:900,ft:'lowpass',v:.35}); sTone(130,.12,{v:.3,to:55}) },
 epee:()=>sNoise(.2,{f:3000,to:700,q:2,v:.25}),
 marteau:()=>{ sNoise(.12,{f:1600,to:400,q:1.5,v:.2}); sTone(95,.25,{v:.35,to:40,t:.08}) },
 arcane:()=>{ sTone(500,.35,{v:.12,to:1300}); sTone(750,.35,{type:'triangle',v:.06,to:1950,t:.04}) },
 monstre:()=>{ sNoise(.22,{f:250,to:600,ft:'lowpass',v:.3,a:.03}); sTone(85,.22,{type:'sawtooth',v:.06,to:60}) },
 feu:()=>{ sNoise(.5,{f:300,to:2200,ft:'lowpass',v:.35,a:.04}); for(let i=0;i<5;i++) sNoise(.03,{f:3000,ft:'highpass',v:.12,t:.05+Math.random()*.35}) },
 foudre:()=>{ for(let i=0;i<4;i++) sTone(80+Math.random()*900,.06,{type:'sawtooth',v:.09,t:i*.04}); sNoise(.35,{f:4000,ft:'highpass',v:.25}) },
 glace:()=>{ [2400,3200,2800,3600].forEach((f,i)=>sTone(f,.25,{v:.06,t:i*.05})); sNoise(.25,{f:6000,ft:'highpass',v:.1}) },
 sacre:()=>[523,659,784,1047].forEach((f,i)=>sTone(f,.9,{v:.07,t:i*.03,a:.02})),
 soin:()=>[660,880,1175].forEach((f,i)=>sTone(f,.3,{v:.07,t:i*.07,a:.02})),
 bouclier:()=>{ sTone(220,.4,{v:.15,to:330,a:.03}); sTone(440,.4,{type:'triangle',v:.06,to:660,a:.03}); sNoise(.3,{f:1200,v:.08,a:.05}) },
 critique:()=>{ sNoise(.07,{f:2500,ft:'highpass',v:.3}); sTone(2600,.18,{type:'triangle',v:.1,to:1800}); sTone(120,.15,{v:.35,to:45}) },
 vaincu:()=>{ sTone(320,.45,{type:'triangle',v:.12,to:70}); sNoise(.35,{f:500,to:150,ft:'lowpass',v:.2,t:.05}) },
 victoire:()=>[523,659,784,1047].forEach((f,i)=>{ sTone(f,i<3?.18:.6,{type:'triangle',v:.12,t:i*.11}); sTone(f*2,i<3?.12:.4,{v:.03,t:i*.11}) }),
 defaite:()=>[392,311,262].forEach((f,i)=>sTone(f,i<2?.3:.8,{type:'triangle',v:.12,t:i*.25})),
 niveau:()=>{ [523,659,784,1047,1319].forEach((f,i)=>sTone(f,.25,{type:'triangle',v:.1,t:i*.07})); sSpark(.35) },
 legendaire:()=>{ [392,494,587,784].forEach(f=>sTone(f,1.3,{v:.05,a:.08})); [784,988,1175,1568].forEach((f,i)=>sTone(f,.4,{type:'triangle',v:.06,t:.1+i*.09})); sSpark(.5,8) },
 coffre:()=>{ sTone(110,.45,{type:'sawtooth',v:.05,to:80,a:.05}); sNoise(.4,{f:400,to:200,q:4,v:.1}); sSpark(.4) },
 forge_ok:()=>{ sTone(880,.6,{type:'triangle',v:.15}); sTone(1320,.5,{v:.07}); sNoise(.05,{f:6000,ft:'highpass',v:.2}); sSpark(.2) },
 forge_ko:()=>{ sTone(520,.25,{type:'triangle',v:.14,to:420}); sNoise(.08,{f:1500,v:.2}); sTone(200,.35,{type:'square',v:.05,to:120,t:.15}) },
 enchant:()=>{ sTone(400,.6,{v:.08,to:1600,a:.05}); sSpark(.15); [1047,1319,1568].forEach((f,i)=>sTone(f,.35,{v:.05,t:.3+i*.06})) },
 potion:()=>{ for(let i=0;i<7;i++) sTone(300+Math.random()*400,.08,{v:.08,to:900+Math.random()*500,t:i*.07}); sTone(784,.3,{type:'triangle',v:.06,t:.55}) },
 gemme:()=>{ sTone(2093,.4,{v:.09}); sTone(3136,.35,{v:.06,t:.05}); sNoise(.04,{f:7000,ft:'highpass',v:.12}) },
 percer:()=>{ for(let i=0;i<3;i++){ sNoise(.06,{f:3500,q:3,v:.2,t:i*.11}); sTone(1600,.05,{type:'square',v:.03,t:i*.11}) } },
 recolte:()=>{ sNoise(.2,{f:2500,to:1200,q:.7,v:.1}); SFX.achat() },
 planter:()=>{ sNoise(.18,{f:350,ft:'lowpass',v:.25}); sTone(90,.1,{v:.15,to:60,t:.05}) },
 ameliorer:()=>{ [0,.16,.32].forEach(t=>{ sTone(700,.15,{type:'triangle',v:.1,t}); sNoise(.04,{f:3000,v:.12,t}) }); sSpark(.45) },
 recycler:()=>{ sNoise(.25,{f:1200,to:300,q:.6,v:.25}); for(let i=0;i<4;i++) sNoise(.03,{f:2500,v:.12,t:.03+i*.05}) },
};
/* nom affiché, utilisé dans Options → Son */
const SFX_N={clic:'Clic',sac:'Ouvrir le sac',equipe:'Équiper',achat:'Achat',erreur:'Erreur',coup:'Coup reçu',epee:'Épée (Guerrier)',marteau:'Marteau (Paladin)',arcane:'Sort arcanique',monstre:'Attaque de monstre',feu:'Sort de feu',foudre:'Sort de foudre',glace:'Sort de glace',sacre:'Sort sacré',soin:'Soin',bouclier:'Bouclier',critique:'Coup critique',vaincu:'Ennemi vaincu',victoire:'Victoire',defaite:'Défaite',niveau:'Niveau gagné',legendaire:'Objet légendaire',coffre:'Coffre',forge_ok:'Forge réussie',forge_ko:'Forge ratée',enchant:'Enchantement',potion:'Potion préparée',gemme:'Gemme',percer:'Percer une châsse',recolte:'Récolte',planter:'Planter',ameliorer:'Amélioration',recycler:'Recycler'};
const SND_GAP={coup:60,critique:80,soin:250,legendaire:1500,niveau:900,victoire:600,defaite:600,clic:40};
function snd(k){
  const c=sndCfg(); if(!c.on||!c.fx||document.hidden||(k==='clic'&&!c.clic)) return;
  const x=sndCtx(); if(!x||x.state!=='running') return;
  const now=performance.now(); if(now-(SND.last[k]||0)<(SND_GAP[k]||50)) return; SND.last[k]=now;
  try{
    const b=SND.buf[k]; if(b&&b!=='err'&&b!=='load'){ const s=x.createBufferSource(); s.buffer=b; s.connect(SND.bus); s.start(); return }
    if(SFX[k]) SFX[k]();
  }catch(e){}
}
function sndLoadFiles(){ const x=SND.ctx; if(!x) return;
  for(const k of Object.keys(SFX)){ const p='effets/'+k+'.mp3'; if(!sndHas(p)||SND.buf[k]) continue; SND.buf[k]='load';
    fetch('assets/sons/'+p+'?v='+VERSION).then(r=>{ if(!r.ok) throw 0; return r.arrayBuffer() }).then(a=>new Promise((ok,ko)=>x.decodeAudioData(a,ok,ko))).then(b=>{SND.buf[k]=b}).catch(()=>{SND.buf[k]='err'}) } }
/* ---------- musique (seulement si des fichiers sont ajoutés) ---------- */
function sndMusKey(){
  if(typeof UI==='undefined') return null; if(UI.scr||!S||!S.heroes||!S.heroes.length) return 'menu';
  if(UI.tab==='combat'){ if(UI.advMode==='rift') return 'faille'; const fight=typeof C!=='undefined'&&C.phase&&C.phase!=='idle';
    if(fight&&C.units&&C.units.some(u=>u.boss)) return 'boss'; return 'zone'+(typeof sceneZone==='function'?sceneZone():(UI.zone||0)) }
  if(UI.tab==='comp') return 'camp'; return 'ville';
}
function sndMusic(){
  const c=sndCfg(); let k=sndMusKey(); if(k&&!sndHas('musiques/'+k+'.mp3')) k=k.startsWith('zone')&&sndHas('musiques/aventure.mp3')?'aventure':null;
  if(!c.on||!c.mu||!SND.ctx||SND.ctx.state!=='running') k=null;
  if(k===SND.musK) return; SND.musK=k; const old=SND.mus; SND.mus=null;
  if(old){ let v=old.volume; const t=setInterval(()=>{ v-=.05; if(v<=0){ clearInterval(t); old.pause() } else old.volume=v },60) }
  if(!k) return; const a=new Audio('assets/sons/musiques/'+k+'.mp3?v='+VERSION); a.loop=true; a.volume=0; SND.mus=a;
  a.play().then(()=>{ const goal=(c.mu/100)*.6; let v=0; const t=setInterval(()=>{ v=Math.min(goal,v+.03); if(SND.mus!==a){ clearInterval(t); return } a.volume=v; if(v>=goal) clearInterval(t) },80) }).catch(()=>{});
}
setInterval(()=>{ try{ sndMusic() }catch(e){} },1500);
/* déblocage au premier geste (obligatoire sur téléphone) */
function sndUnlock(){ const x=sndCtx(); if(!x) return; if(x.state!=='running') x.resume().then(()=>{ sndLoadFiles(); sndMusic() }).catch(()=>{}); else sndLoadFiles() }
['pointerdown','keydown','touchend'].forEach(ev=>window.addEventListener(ev,sndUnlock,{capture:true,passive:true}));
document.addEventListener('visibilitychange',()=>{ if(SND.mus){ if(document.hidden) SND.mus.pause(); else SND.mus.play().catch(()=>{}) } });
/* petit bruit sur les boutons */
window.addEventListener('pointerdown',e=>{ const b=e.target.closest&&e.target.closest('button,[data-act]'); if(b&&!b.disabled&&b.getAttribute('aria-disabled')!=='true') snd('clic') },true);

/* ---------- branchements dans le jeu ---------- */
const sndSeen=u=>!!(u&&document.querySelector(`[data-u="${u.id}"],[data-pu="${u.id}"]`));
function sndSkill(u,sk){
  const fx=JSON.stringify(sk.fx||[]),el=sk.el;
  let k=el==='feu'?'feu':el==='foudre'?'foudre':el==='glace'?'glace':el==='sacre'?'sacre':el==='terre'?'marteau':null;
  if(!k&&/"k":"(healPct|hot|heal)"/.test(fx)) k='soin';
  if(!k&&(sk.selfShield||/"k":"shield"/.test(fx))) k='bouclier';
  if(!k) k=u.team==='e'?'monstre':u.cls==='guerrier'?'epee':u.cls==='paladin'?'marteau':u.cls==='mage'?'arcane':'coup';
  SND.lastSk=performance.now(); snd(k);
}
if(typeof CB!=='undefined'&&CB.exec) CB.exec=(f=>function(u,sk,tgt,W){ try{ if(sk&&sndSeen(u)) sndSkill(u,sk) }catch(e){} return f.apply(this,arguments) })(CB.exec);
/* chiffres qui s'affichent sur les combattants (aventure, duels, raids) */
new MutationObserver(ms=>{ for(const m of ms) for(const n of m.addedNodes){ if(n.nodeType!==1||!n.classList.contains('fnum')) continue;
  if(n.classList.contains('crit')) snd('critique');
  else if(n.classList.contains('heal')){ if(performance.now()-SND.lastSk>250) snd('soin') }
  else snd('coup') } }).observe(document.documentElement,{childList:true,subtree:true});
if(typeof dmg==='function') dmg=(f=>function(t){ const was=t&&t.hp; const r=f.apply(this,arguments); try{ if(was>0&&t.hp<=0&&t.team==='e'&&sndSeen(t)) setTimeout(()=>snd('vaincu'),90) }catch(e){} return r })(dmg);
if(typeof finish==='function') finish=(f=>function(r){ try{ if(document.querySelector('.ftc')&&(r==='win'||r==='lose')) setTimeout(()=>snd(r==='win'?'victoire':'defaite'),250) }catch(e){} return f.apply(this,arguments) })(finish);
if(typeof gainXp==='function') gainXp=(f=>function(h){ const l=h&&h.lvl; const r=f.apply(this,arguments); if(h&&h.lvl>l) snd('niveau'); return r })(gainXp);
if(typeof addInv==='function') addInv=(f=>function(it){ const r=f.apply(this,arguments); if(it&&!it.mat&&(it.rarity|0)>=4) setTimeout(()=>snd('legendaire'),500); return r })(addInv);
if(typeof fFx==='function') fFx=(f=>function(kind,ok){ snd(kind==='forge'?(ok?'forge_ok':'forge_ko'):'enchant'); return f.apply(this,arguments) })(fFx);
if(typeof openInv==='function') openInv=(f=>function(v){ if(v&&!UI.invOpen) snd('sac'); return f.apply(this,arguments) })(openInv);
if(typeof chestOpen==='function') chestOpen=(f=>function(){ snd('coffre'); return f.apply(this,arguments) })(chestOpen);
if(typeof idleClaim==='function') idleClaim=(f=>function(){ snd('recolte'); return f.apply(this,arguments) })(idleClaim);
if(typeof gemInto==='function') gemInto=(f=>function(){ const r=f.apply(this,arguments); if(r!==false) snd('gemme'); return r })(gemInto);
if(typeof toast==='function') toast=(f=>function(){ if(SND.act) SND.toast=1; return f.apply(this,arguments) })(toast);
/* actions : le son ne sonne que si quelque chose a changé ; sinon, un message d'erreur → son d'erreur */
{ const sig=()=>{ try{ return JSON.stringify([S,typeof ACC!=='undefined'?ACC.gold:0]) }catch(e){ return Math.random() } };
  const ACT_S={aBrew:'potion',rPierce:'percer',rMake:'gemme',rDoCut:'gemme',rUnsock:'percer',gPlant:'planter',gHarv:'recolte',gAll:'recolte',gUnlock:'ameliorer',campHarv:'recolte',campAll:'recolte',campUp:'ameliorer',buyPot:'achat',salv:'recycler',salvBelow:'recycler',equip:'equipe',unequip:'equipe'};
  for(const [k,s] of Object.entries(ACT_S)){ const f=A[k]; if(typeof f!=='function') continue;
    A[k]=function(){ const h0=sig(); SND.act=1; SND.toast=0; let r; try{ r=f.apply(this,arguments) } finally{ SND.act=0 }
      const done=()=>{ if(sig()!==h0) snd(s); else if(SND.toast) snd('erreur') };
      if(r&&typeof r.then==='function') r.then(done,()=>{}); else done(); return r } } }

/* ---------- Options → Son ---------- */
A.sndOn=()=>{ const c=sndCfg(); c.on=c.on?0:1; saveAcc(); sndVol(); sndMusic(); render() };
A.sndClic=()=>{ const c=sndCfg(); c.clic=c.clic?0:1; saveAcc(); render() };
A.sndPlay=d=>{ const c=sndCfg(),was=c.on; c.on=1; if(!c.fx) c.fx=50; sndVol(); snd(d.k); c.on=was; setTimeout(sndVol,1500) };
document.addEventListener('input',e=>{ const t=e.target; if(!t.matches||!t.matches('input[data-snd]')) return; const c=sndCfg(); c[t.dataset.snd]=+t.value; sndVol();
  const b=t.parentElement.querySelector('.sndv'); if(b) b.textContent=t.value+' %'; clearTimeout(SND.sv); SND.sv=setTimeout(()=>{ saveAcc(); sndMusic(); if(t.dataset.snd==='fx') snd('achat') },350) });
const SND_IC='<svg class="uic" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor"/><path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
function sndView(){
  const c=sndCfg(),nMus=(typeof SONS_PRESENTS!=='undefined'?SONS_PRESENTS:[]).filter(p=>p.startsWith('musiques/')).length,nFx=Object.keys(SFX).filter(k=>sndHas('effets/'+k+'.mp3')).length;
  const sl=(k,t,d)=>`<input type="range" min="0" max="100" step="5" value="${c[k]}" data-snd="${k}" aria-label="${t}" ${ttip(t,d)}><b class="sndv">${c[k]} %</b>`;
  return `<h3>Son</h3><p class="hint">${nFx?`${nFx} bruitage${nFx>1?'s':''} ajouté${nFx>1?'s':''} ; les autres sont fabriqués par le jeu.`:'Les bruitages sont fabriqués par le jeu en attendant les vrais sons.'}</p>
   <div class="orow"><span class="lab">Son activé<small>Coupe ou remet tous les sons et la musique.</small></span><button class="sw ${c.on?'':'off'}" data-act="sndOn" role="switch" aria-checked="${!!c.on}" ${ttip(c.on?'Couper le son':'Remettre le son')}></button></div>
   <div class="orow snr"><span class="lab">Effets sonores<small>Combat, ateliers, butin et interface.</small></span>${sl('fx','Volume des effets','Glissez pour régler le volume des bruitages.')}</div>
   <div class="orow snr"><span class="lab">Musique<small>${nMus?nMus+' musique'+(nMus>1?'s':'')+' ajoutée'+(nMus>1?'s':'')+'.':'Aucune musique ajoutée pour l’instant.'}</small></span>${sl('mu','Volume de la musique','Glissez pour régler le volume de la musique.')}</div>
   <div class="orow"><span class="lab">Bruit des boutons<small>Petit clic à chaque bouton.</small></span><button class="sw ${c.clic?'':'off'}" data-act="sndClic" role="switch" aria-checked="${!!c.clic}" ${ttip(c.clic?'Couper le bruit des boutons':'Remettre le bruit des boutons')}></button></div>
   <h3 style="margin-top:14px">Écouter les sons</h3><div class="sngrid">${Object.keys(SFX).map(k=>`<button class="btn sm" data-act="sndPlay" data-k="${k}" ${ttip(SFX_N[k],'Joue ce son.')}>${SFX_N[k]}</button>`).join('')}</div>`;
}
if(typeof viewOpts==='function') viewOpts=(f=>function(){
  let h=f.apply(this,arguments); const on=UI.optTab==='snd';
  h=h.replace(/(data-t="ui"[^>]*>[\s\S]*?<\/button>)/,`$1<button class="${on?'on':''}" data-act="optTab" data-t="snd" aria-pressed="${on}">${SND_IC}Son</button>`);
  if(on) h=h.replace(/<article>[\s\S]*<\/article>/,'<article>'+sndView()+'</article>');
  return h })(viewOpts);
