/* Cendrelame · ui/amis-deplacable.js (0.8.18)
   Fenêtre des amis déplaçable sur PC : glisser le titre « Amis » ; double-clic sur le titre = position d’origine.
   La position est gardée (distance au coin bas-droit de la fenêtre) dans ACC.frPos. */
const frPC=()=>innerWidth>760;
function frApply(){ const w=document.getElementById('friends'); if(!w) return;
  const p=frPC()&&typeof ACC!=='undefined'&&ACC&&ACC.frPos;
  w.classList.toggle('frmv',frPC());
  const h=w.querySelector('.frhead'); if(h&&frPC()&&!h.dataset.tip){ h.dataset.tip=1; h.title='Glissez pour déplacer la fenêtre · double-clic : position d’origine' }
  if(!p){ w.style.right=w.style.bottom=''; return }
  w.style.right=p.r/ZM+'px'; w.style.bottom=p.b/ZM+'px' }
function frClampSave(r,b){ const w=document.getElementById('friends'); if(!w) return;
  w.style.right=r/ZM+'px'; w.style.bottom=b/ZM+'px';
  const R=w.getBoundingClientRect(); /* garde la fenêtre entière à l’écran */
  if(R.left<4) r-=4-R.left; if(R.top<4) b-=4-R.top; r=Math.max(4,r); b=Math.max(4,b);
  w.style.right=r/ZM+'px'; w.style.bottom=b/ZM+'px'; return {r,b} }
document.addEventListener('pointerdown',e=>{
  const h=e.target.closest&&e.target.closest('#friends .frhead'); if(!h||!frPC()||e.button!==0||e.target.closest('button,input,a')) return;
  const w=document.getElementById('friends'),R=w.getBoundingClientRect();
  const r0=innerWidth-R.right,b0=innerHeight-R.bottom,x0=e.clientX,y0=e.clientY; let pos={r:r0,b:b0};
  w.classList.add('frdrag'); e.preventDefault();
  const mv=ev=>{ pos=frClampSave(r0-(ev.clientX-x0),b0-(ev.clientY-y0))||pos };
  const up=()=>{ removeEventListener('pointermove',mv); removeEventListener('pointerup',up); w.classList.remove('frdrag');
    if(typeof ACC!=='undefined'&&ACC){ ACC.frPos={r:Math.round(pos.r),b:Math.round(pos.b)}; try{ saveAcc() }catch(_){} } };
  addEventListener('pointermove',mv); addEventListener('pointerup',up);
});
document.addEventListener('dblclick',e=>{ if(!frPC()||!e.target.closest||!e.target.closest('#friends .frhead')||e.target.closest('button,input')) return;
  if(typeof ACC!=='undefined'&&ACC){ delete ACC.frPos; try{ saveAcc() }catch(_){} } frApply() });
addEventListener('resize',()=>{ const w=document.getElementById('friends'); if(w&&frPC()&&ACC&&ACC.frPos){ frApply(); const p=frClampSave(ACC.frPos.r,ACC.frPos.b); if(p) ACC.frPos=p } else frApply() });
{ const _render=render; render=function(){ const r=_render.apply(this,arguments); try{ frApply() }catch(e){} return r } }
