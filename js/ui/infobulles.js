/* Cendrelame · ui/infobulles.js */
/* ============ infobulle ============ */
function tipHTML(k){
  if(k.startsWith('tx:')){const [a,b]=k.slice(3).split('|');return `<article class="it skt ttx" style="--rc:var(--line2)"><header><b>${esc(a)}</b></header>${b?`<div class="skbody"><p>${esc(b)}</p></div>`:''}</article>`}
  if(k==='rw:chest'){ const t=rdTier(); return `<article class="it" style="--rc:#c99a3a"><header><b>${CHEST_N}</b><small>Butin rare · ${String(chestRate(t)).replace('.',',')} % à ce palier</small></header><ul><li class="imp">${MAT_D.c_relic}</li></ul></article>` }
  if(k.startsWith('s8:')) return s8Tip(k);
  if(k.startsWith('pc:')) return pcTip(k);
  if(k==='qchest') return chestTip();
  if(k.startsWith('ri:')){ const it=RK.insp&&RK.insp.eq&&RK.insp.eq[k.slice(3)]; return it?itemCard(it):`<article class="it" style="--rc:var(--line)"><header><b>${SLOT_N[k.slice(3)]||''}</b><small>Emplacement vide</small></header></article>` }
  if(k.startsWith('nw:')){const q=k.slice(3); if(NEWI[q]) return newiCard({mat:q}); if(q==='prisme') return matCard({mat:q,n:matAll(q)}); return ''}
  const h=S.heroes[0];
  if(k.startsWith('pot:')){const q=k.slice(4),P=POTS[q]; if(!P) return '';
    const used=BUFF_K.includes(q)&&buffOn(q);
    const mm=[PV.match,RD.match].find(x=>x&&['fight','prep'].includes(x.state)),mu=mm&&mm.u&&mm.u[pvpMe()],left=mu?Math.min((mu.pcd||{})[q]||0,P.cd||99):inFight()?potShow(q,potLeft(q)):0;
    return `<article class="it skt" style="--rc:${P.c}"><header><b>${P.n}</b><small>Potion · ${cbCount(q)} dans le sac de combat · ${fmt(matAll(q))} en réserve</small></header><div class="skmeta"><span class="skm free">Sans PA</span><span class="skm">${P.cd?`Recharge ${P.cd} tours`:'1 fois par combat'}</span></div><div class="skbody"><p>${P.d}</p>${used?'<p class="lockr">Déjà utilisée pour ce combat.</p>':left?`<p class="lockr">Encore ${left} tour${left>1?'s':''} de recharge.</p>`:'<p class="imp">Se boit sans utiliser votre tour.</p>'}</div></article>`}
  if(k.startsWith('res:')){ const m=k.slice(4);
    if(m==='gold') return `<article class="it skt" style="--rc:#d9a62b"><header><b>Or</b><small>Monnaie · partagée par tous vos personnages</small></header><div class="skbody"><p class="num"><b>${fmt(S.gold)}</b> or</p><p>Sert à acheter des potions, des onglets de coffre, à améliorer l’équipement et les zones de collecte. Gagné en combat, en duel et en raid.</p></div></article>`;
    const v=matCount(m),cap=matCap(m); return `<article class="it skt" style="--rc:var(--line2)"><header><b>${MAT_OBJ[m]}</b><small>Composant${v>=cap?' · stock plein':''}</small></header><div class="skbody"><p class="num"><b>${fmt(v)}</b> / ${fmt(cap)}</p><p>${MAT_D[m]||''}</p></div></article>` }
  if(k.startsWith('sk:')){const q=SK[k.slice(3)]; return q?skCard(q,h):''}
  if(k.startsWith('li:')){const it=C.result&&C.result.items&&C.result.items[+k.slice(3)]; if(!it) return ''; if(SHIFT){const x=cmpHTML(it); if(x) return x} return itemCard(it,it.rc?'Recyclé automatiquement par le tri du butin.':'',swapDelta(h,it))}
  if(k.startsWith('ah:')||k.startsWith('ahm:')){const id=k.slice(k.indexOf(':')+1),x=[...(AH.list||[]),...(AH.mine||[])].find(y=>y.id===id); if(!x) return ''; const H=S.heroes[0]; return itemCard(x.it,`Vendeur : ${esc(x.sname)} · ${fmt(x.price)} or`,H&&canWear(x.it)?swapDelta(H,x.it):null)}
  if(k.startsWith('f:')){const r=findItem(+k.slice(2)); if(r&&SHIFT&&r.where!=='eq'){const x=cmpHTML(r.it); if(x) return x} return r?itemCard(r.it):''}
  if(k.startsWith('bag:')){const E=S.bag[+k.slice(4)]; if(!E) return ''; const c=E.o; if(SHIFT&&!c.mat){const x=cmpHTML(c); if(x) return x} return c.mat?matCard(c):itemCard(c,'',swapDelta(h,c))}
  if(k.startsWith('st:')){const E=stashTab().bag[+k.slice(3)]; if(!E) return ''; const c=E.o; if(SHIFT&&!c.mat){const x=cmpHTML(c); if(x) return x} return c.mat?matCard(c):itemCard(c,c.cls&&!canWear(c)?`<small class="lockr">Réservé au ${CLASSES[c.cls].n}</small>`:'')}
  const it=h&&h.equip[k];
  if(it) return itemCard(it);
  return `<article class="it" style="--rc:var(--line)"><header><b>${SLOT_N[k]}</b><small>Emplacement vide</small></header></article>`;
}
let TIPEL=null,TOUCH=false;
document.addEventListener('pointerdown',e=>{TOUCH=e.pointerType==='touch'},true);
function detScroll(){ if(window.innerWidth>860) return; requestAnimationFrame(()=>{const d=[...document.querySelectorAll('.det')].find(x=>x.offsetParent); if(d){const r=d.getBoundingClientRect(); if(r.bottom>innerHeight||r.top<0) d.scrollIntoView({behavior:'smooth',block:'nearest'})}}) }
function showTip(el){
  if(DRAG&&DRAG.on) return;
  if(TOUCH){ const tp=$('#tip'); if(!(tp&&tp.classList.contains('msh'))) hideTip(); return }
  const t=$('#tip'),html=tipHTML(el.dataset.tip); if(!html){hideTip();return} t.innerHTML=html; t.hidden=false; TIPEL=el; t.classList.toggle('wide',ALTK); t.classList.toggle('cmpw',html.includes('class="cmp"'));
  const r=el.getBoundingClientRect(),w=t.offsetWidth,hh=t.offsetHeight,vw=document.documentElement.clientWidth,vh=window.innerHeight;
  let x=r.right+10,y=r.top;
  if(x+w>vw-8) x=r.left-w-10;
  if(x<8){x=clamp(r.left+r.width/2-w/2,8,vw-w-8);y=r.bottom+8;if(y+hh>vh-8)y=r.top-hh-8}
  y=clamp(y,8,Math.max(8,vh-hh-8));
  t.style.left=(x)/ZM+'px'; t.style.top=(y)/ZM+'px';
}
const hideTip=()=>{const t=$('#tip');if(t)t.hidden=true;TIPEL=null};
function retip(){ const t=$('#tip'); if(TIPEL&&t&&!t.hidden&&document.contains(TIPEL)) showTip(TIPEL) }
function setShift(v){ if(SHIFT===v) return; SHIFT=v; retip() }
function setAlt(v){ if(ALTK===v) return; ALTK=v; retip() }
document.addEventListener('keydown',e=>{ if(e.key==='Shift')setShift(true); if(e.code==='AltLeft'){ e.preventDefault(); setAlt(true) } if(e.code==='ControlLeft'&&!e.repeat){ UI.ringCmp=UI.ringCmp==='ring2'?'ring':'ring2'; if(SHIFT) retip() } });
document.addEventListener('keyup',e=>{ if(e.key==='Shift')setShift(false); if(e.code==='AltLeft'){ e.preventDefault(); setAlt(false) } });
window.addEventListener('blur',()=>{setShift(false);setAlt(false)});
function autoTip(t){ const b=t.closest&&t.closest('button,[role=button],.ipx'); if(!b||b.dataset.tip) return null; if(/[A-Za-zÀ-ÿ]{3,}/.test(b.textContent.trim())) return null; const l=b.getAttribute('title')||b.getAttribute('aria-label'); if(!l) return null; b.dataset.tip='tx:'+l; b.removeAttribute('title'); return b }
document.addEventListener('mouseover',e=>{const el=e.target.closest&&(e.target.closest('[data-tip]')||autoTip(e.target));if(el)showTip(el);else hideTip()});
document.addEventListener('focusin',e=>{const el=e.target.closest&&(e.target.closest('[data-tip]')||autoTip(e.target));if(el)showTip(el)});
document.addEventListener('focusout',hideTip);
let MX=-1,MY=-1; document.addEventListener('mousemove',e=>{MX=e.clientX;MY=e.clientY},{passive:true,capture:true});
function reTipAt(){ if(MX<0||TOUCH) return; const t=document.elementFromPoint(MX,MY),el=t&&t.closest&&t.closest('[data-tip]'); if(el) showTip(el) }
function reTipInv(){ const t=$('#tip'); if(!TIPEL||!t||t.hidden||document.contains(TIPEL)) return; reTipAt() }
document.addEventListener('scroll',e=>{ if(Date.now()-SCB<150) return; const tg=e.target; if(TIPEL&&tg&&tg.nodeType===1&&!tg.contains(TIPEL)) return; hideTip() },true);

