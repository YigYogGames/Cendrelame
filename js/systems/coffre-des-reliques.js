/* Cendrelame · systems/coffre-des-reliques.js */
/* ================= Coffre des Reliques (raids) ================= */
const CHEST_K='c_relic',CHEST_N='Coffre des Reliques';
const chestRate=t=>Math.min(15,1+0.6*(t||0)); /* % par victoire de raid */
const CHEST_LOOT=[{fr:6,w:38,r:'Commun',c:'#b9b3a6',dup:2000},{fr:7,w:27,r:'Peu commun',c:'#5fb4ff',dup:3000},{fr:8,w:20,r:'Rare',c:'#c58bff',dup:5000},{fr:9,w:11,r:'Épique',c:'#ff6a3a',dup:8000},{fr:10,w:4,r:'Légendaire',c:'#ffd36a',dup:15000}];
function chestRoll(){ let x=Math.random()*CHEST_LOOT.reduce((a,l)=>a+l.w,0); for(const l of CHEST_LOOT){ if((x-=l.w)<0) return l } return CHEST_LOOT[0] }
function chestGive(n=1){
  let left=bagAddMat(S.bag,CHEST_K,n);
  if(left>0){ const tabs=mlPlace({[CHEST_K]:left}); if(tabs){ for(const t of tabs) t.T.bag=t.bag; left=0; saveAcc(); toast('Sac plein : le '+CHEST_N+' a été placé dans le coffre du compte.') } }
  if(left>0){ ACC.chestQ=(ACC.chestQ||0)+left; saveAcc(); toast('Sac et coffre du compte pleins : le '+CHEST_N+' vous attend, libérez une case.') }
  markNew(); save();
}
function chestFlush(){ if(!(ACC.chestQ>0)||!S||!S.bag) return; const q=ACC.chestQ; ACC.chestQ=0; const left=bagAddMat(S.bag,CHEST_K,q); ACC.chestQ=left; if(left<q){ markNew(); toast(`${q-left} ${CHEST_N}${q-left>1?'s':''} ajouté${q-left>1?'s':''} au sac.`) } }
function chestAsk(){
  closeChest(); const w=document.createElement('div'); w.id='chestw'; w.className='chestm'; w.setAttribute('role','dialog'); w.setAttribute('aria-modal','true');
  w.innerHTML=`<div class="box chask"><span class="chico">${matSvg(CHEST_K)}</span><h2>Ouvrir le ${CHEST_N} ?</h2><p>Le coffre sera consommé et révélera une relique cosmétique.</p><div class="row"><button class="btn" data-act="chestNo">Annuler</button><button class="btn pri" data-act="chestOpen">Ouvrir</button></div></div>`;
  document.body.append(w); w.querySelector('[data-act=chestOpen]').focus();
}
function closeChest(){ const w=$('#chestw'); if(w) w.remove() }
function chestTile(l,win){ const F=PC_FR[l.fr]; return `<div class="chtile ${win?'win':''}" style="--rc:${l.c}"><span class="pcfr fxs chsw" style="--c:${F[1]};--fr:${F[1]};--fl:${F[4]}" data-fx="${F[3]}"></span><b>${esc(F[0].split(' · ')[0])}</b><small>${l.r}</small></div>` }
function chestOpen(){
  if(matCount(CHEST_K)<1){ closeChest(); return }
  removeMat(CHEST_K,1);
  const l=chestRoll(),key='fr'+l.fr; ACC.cos=ACC.cos||{}; const dup=!!ACC.cos[key];
  if(dup) S.gold+=l.dup; else ACC.cos[key]=Date.now();
  saveAcc(); save();
  const N=56,W=50,strip=Array.from({length:N},(_,i)=>i===W?l:chestRoll());
  const w=$('#chestw'); w.innerHTML=`<div class="box chopen"><h2>${CHEST_N}</h2><div class="chwin"><div class="chstrip">${strip.map((x,i)=>chestTile(x,i===W)).join('')}</div><i class="chmark"></i></div><div class="chres" aria-live="polite"></div></div>`;
  const st=w.querySelector('.chstrip'),win=w.querySelector('.chwin'),tw=st.children[0].offsetWidth+10;
  const target=W*tw+tw/2-win.clientWidth/2+(Math.random()-.5)*(tw*.7);
  const quick=matchMedia('(prefers-reduced-motion: reduce)').matches;
  requestAnimationFrame(()=>{ st.style.transition=`transform ${quick?0.3:6.2}s cubic-bezier(.08,.75,.18,1)`; st.style.transform=`translateX(${-target}px)` });
  let fired=false; const done=()=>{ if(fired||!$('#chestw')) return; fired=true; const F=PC_FR[l.fr]; st.children[W].classList.add('hl');
    w.querySelector('.chres').innerHTML=`<p class="chrar" style="color:${l.c}">${l.r}</p><h3>Cadre ${esc(F[0])}</h3>${dup?`<p>Déjà possédé : converti en <b>${fmt(l.dup)} or</b>.</p>`:'<p>Nouveau cadre débloqué ! Équipez-le dans Communauté → Personnalisation.</p>'}<div class="row">${matCount(CHEST_K)?`<button class="btn" data-act="chestAgain">Ouvrir un autre (${matCount(CHEST_K)})</button>`:''}${dup?'':`<button class="btn" data-act="chestGo">Personnaliser</button>`}<button class="btn pri" data-act="chestNo">Fermer</button></div>`;
    render(); };
  st.addEventListener('transitionend',done,{once:true}); setTimeout(done,quick?600:6600);
}

/* ajuste la carte + bannière à la zone de jeu */
function pcFit(){ document.querySelectorAll('.pcview').forEach(v=>{ const f=v.querySelector('.pcfit'); if(!f) return; f.style.zoom=1; const cs=getComputedStyle(v),py=parseFloat(cs.paddingTop)+parseFloat(cs.paddingBottom),px=parseFloat(cs.paddingLeft)+parseFloat(cs.paddingRight),need=f.scrollHeight,av=v.clientHeight-py-6,needW=f.scrollWidth,avW=v.clientWidth-px-6; const z=Math.min(1,av/need,avW/needW); f.style.zoom=z<1?Math.max(.5,z).toFixed(3):1 }) }
addEventListener('resize',()=>{ if(UI.tab==='comm') pcFit() });

