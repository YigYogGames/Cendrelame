/* Cendrelame · ui/plein-ecran.js (0.8.14)
   Interface plein écran « A » : le décor de la zone remplit la fenêtre, l’interface flotte par-dessus.
   Ce fichier pose le décor (#scene) et indique l’onglet courant au CSS (body[data-tab]). */
function sceneZone(){
  if(UI.tab==='combat'){
    if(UI.advMode==='raid'||UI.advMode==='pvp') return 6;
    return (typeof C!=='undefined'&&C.phase&&C.phase!=='idle'&&C.zone!=null)?C.zone:(UI.zone||0);
  }
  return UI.zone||0;
}
function scenePaint(){
  let s=document.getElementById('scene');
  if(!s){ s=document.createElement('div'); s.id='scene'; s.setAttribute('aria-hidden','true'); document.body.prepend(s) }
  const z=sceneZone(); if(s.dataset.z!==String(z)){ s.className='zbg'+z; s.dataset.z=z }
  document.body.dataset.tab=UI.scr?'':(UI.tab||'');
  document.body.dataset.adv=UI.tab==='combat'?(UI.advMode||'pve'):'';
}
{ const _render=render; render=function(){ const r=_render.apply(this,arguments); try{ scenePaint() }catch(e){} return r } }
