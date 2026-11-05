/* Cendrelame · systems/gains-hors-ligne.js (0.8.15)
   Gains hors ligne : pendant l’absence du joueur, le héros continue de combattre à sa progression actuelle (difficulté Normale).
   1 combat toutes les 2 minutes, à partir de 5 minutes d’absence, jusqu’à 12 heures cumulées.
   Les gains attendent dans S.idle et ne sont ajoutés qu’au moment où le joueur les récupère (écran d’accueil). */
const IDLE={step:120,min:300,cap:12*3600,keepMax:40};
const idleNew=()=>({sec:0,fights:0,gold:0,xp:0,mats:{},items:[],rc:0,z:0,st:1});
const idleAdd=(m,k,v)=>{ if(v>0) m[k]=(m[k]||0)+v };
function idleAccrue(sec){
  if(!S||!S.heroes||!S.heroes.length||!(sec>=IDLE.min)) return;
  const I=S.idle||(S.idle=idleNew()); const add=Math.min(sec,IDLE.cap-I.sec); if(add<IDLE.step) return;
  const n=Math.floor(add/IDLE.step); I.sec+=n*IDLE.step;
  const P=prog('normal'),z=Math.max(0,Math.min(P.zone,ZONES.length-1)),st=Math.max(1,Math.min(P.stage,10)),L=z*10+st,h=S.heroes[0];
  const gf=(heroStats(h).goldFind||0),zm=ZONES[z].mats||[]; I.z=z; I.st=st;
  for(let i=0;i<n;i++){
    I.fights++; I.gold+=Math.round((5+2.5*L)*.7*(1+gf/100)); I.xp+=10+6*L;
    const amt=()=>Math.max(1,Math.round((ri(1,3)+Math.floor(L/8))*.25));
    if(zm[0]&&!HARV.includes(zm[0])) idleAdd(I.mats,zm[0],amt());
    if(zm[1]&&!HARV.includes(zm[1])) idleAdd(I.mats,zm[1],Math.max(1,Math.round(amt()*(zm[1]==='rune'?.3:1))));
    const Z=rollZoneLoot(z,false,L,1);
    for(const [k,v] of Object.entries(Z.mats)) if(!HARV.includes(k)) idleAdd(I.mats,k,v);
    for(const it of Z.items){
      if(lootKeep(it)&&I.items.length<IDLE.keepMax) I.items.push(it);
      else { I.rc++; for(const [k,v] of Object.entries(salvageValue(it))) idleAdd(I.mats,k,v) }
    }
  }
  save();
}
/* au chargement du personnage : temps écoulé depuis la dernière sauvegarde */
{ const _boot=bootChar; bootChar=function(){ const t0=S&&S.last; const r=_boot.apply(this,arguments);
  try{ if(t0) idleAccrue((Date.now()-t0)/1000) }catch(e){ console.error(e) } return r } }

const fmtDur=s=>{ const h=Math.floor(s/3600),m=Math.floor(s%3600/60); return h?`${h} h${m?' '+String(m).padStart(2,'0')+' min':''}`:`${m} min` };
const idleName=k=>(NEWI[k]&&NEWI[k].n)||(POTS[k]&&POTS[k].n)||MAT_N[k]||(typeof MAT_OBJ!=='undefined'&&MAT_OBJ[k])||k;
const idleRar=k=>POTS[k]?1:nwR(k);
const idleTip=k=>NEWI[k]||k==='prisme'?`data-tip="nw:${k}"`:MATS.includes(k)?`data-tip="res:${k}"`:ttip(idleName(k),POTS[k]?POTS[k].d:'');

/* récupération : tout est ajouté, puis la fenêtre récapitulative s’ouvre */
function idleClaim(){
  const I=S&&S.idle; if(!I||!I.fights) return; delete S.idle;
  const res={...I,ups:[],kept:[],lost:[]};
  gain({gold:I.gold}); gain(I.mats);
  for(const h of partyHeroes()){ const n=gainXp(h,I.xp); if(n){ res.ups.push(`${h.name} atteint le niveau ${h.lvl}`); S.lvlDot=true } }
  for(const it of I.items){ (addInv(it)?res.kept:res.lost).push(it) }
  save(); renderHeader(); render(); idlePop(res);
}
function idlePop(r){
  document.getElementById('idlepop')?.remove();
  const Z=ZONES[r.z]||ZONES[0],mats=Object.entries(r.mats).sort((a,b)=>idleRar(b[0])-idleRar(a[0])||b[1]-a[1]);
  const tile=(ic,n,rc,tip)=>`<span class="ofit" style="--rc:var(--r${rc})" ${tip}>${ic}<b class="num">${n}</b></span>`;
  const matT=mats.map(([k,v])=>tile(matIcon(k),'×'+fmt(v),idleRar(k),idleTip(k))).join('');
  const eqT=r.kept.map(it=>tile(eqIco(it,it.slot),it.ilvl,it.rarity,`data-tip="f:${it.id}"`)).join('');
  const html=`<div class="modal ofpop" id="idlepop" role="dialog" aria-modal="true" aria-labelledby="ofT"><div class="box">
   <span class="ofx" data-act="idleX" role="button" tabindex="0" aria-label="Fermer">${uic('xx')}</span>
   <h2 id="ofT">Pendant votre absence</h2>
   <p class="ofsub">${fmtDur(r.sec)} · <b>${r.fights}</b> combat${r.fights>1?'s':''} remporté${r.fights>1?'s':''} en ${esc(Z.n)}, étape ${r.st}</p>
   <div class="ofbig"><span ${ttip('Or','Ajouté à l’or partagé du compte.')}>${matIcon('gold')}<b class="num">+${fmt(r.gold)}</b><small>Or</small></span>
    <span ${ttip('Expérience','Gagnée par chaque héros de l’équipe.')}><i class="ofxp">XP</i><b class="num">+${fmt(r.xp)}</b><small>Expérience</small></span></div>
   ${r.ups.length?`<p class="oflvl">★ ${r.ups.map(esc).join(' · ')}</p>`:''}
   ${matT?`<h3>Ressources et objets</h3><div class="ofgrid">${matT}</div>`:''}
   ${eqT?`<h3>Équipement <small>${r.kept.length} objet${r.kept.length>1?'s':''} ajouté${r.kept.length>1?'s':''} au sac</small></h3><div class="ofgrid">${eqT}</div>`:''}
   ${r.rc+r.lost.length?`<p class="ofrc">${r.rc+r.lost.length} objet${r.rc+r.lost.length>1?'s':''} recyclé${r.rc+r.lost.length>1?'s':''} automatiquement (filtre de butin${r.lost.length?' ou sac plein':''}) : leurs ressources sont comprises ci-dessus.</p>`:''}
   <button class="btn pri ofok" data-act="idleX">Continuer</button></div></div>`;
  document.body.insertAdjacentHTML('beforeend',html);
}
Object.assign(A,{ idleClaim:()=>idleClaim(), idleX:()=>{ document.getElementById('idlepop')?.remove(); hideTip() } });
