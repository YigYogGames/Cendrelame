/* Cendrelame · ui/telephone.js */
/* ================= 0.8.1 : version téléphone ================= */
UIC.grid=UIC.grid||'<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>';
const MOB=()=>matchMedia('(max-width:760px)').matches;
const MNAV=[['bag','bag','Sac'],['comp','paw','Compagnon'],['combat','swords','Aventure',1],['quest','scroll','Quêtes'],['plus','grid','Plus']];
const MPLUS=[['shop','coin','Marchand'],['forge','anvil','Amélioration'],['heroes','helm','Personnage'],['comm','flag','Communauté'],['troph','trophy','Trophées'],['fr','people','Amis'],['mail','mail','Messagerie'],['opts','gear','Options']];
const MPLUS_T=['shop','forge','heroes','comm','troph'];
function mnavHTML(){ const inv=!!UI.invOpen,plusOn=!!UI.mPlus||(!inv&&MPLUS_T.includes(UI.tab));
  const dot=k=>{ let d=false; try{ d=k==='bag'?!!S.bagDot:k==='comp'?!!(ACC.comp&&cpDone()>0):k==='quest'?qClaimable():k==='plus'?!!(ACC.trNew||commDot()):false }catch(e){} return d?'<span class="ndot" aria-label="Nouveauté"></span>':'' };
  const on=k=>k==='bag'?inv:k==='plus'?plusOn:(!inv&&!UI.mPlus&&UI.tab===k);
  const nav=`<nav class="mnav" aria-label="Navigation">${MNAV.map(([k,i,t,m])=>m?`<button class="mmain ${on(k)?'on':''}" data-act="mNav" data-k="${k}" aria-current="${on(k)?'page':'false'}"><span class="ring">${uic(i)}</span>${t}${dot(k)}</button>`:`<button class="${on(k)?'on':''}" data-act="mNav" data-k="${k}" aria-current="${on(k)?'page':'false'}">${uic(UIC[i]?i:'star')}${t}${dot(k)}</button>`).join('')}</nav>`;
  if(!UI.mPlus) return nav;
  const d2=k=>{ let d=false; try{ d=k==='troph'?!!ACC.trNew:k==='fr'?!!commDot():false }catch(e){} return d?'<span class="ndot" style="position:absolute;top:6px;right:14px"></span>':'' };
  return nav+`<div class="mshade" data-act="mPlusX"></div><div class="msheet" role="dialog" aria-label="Menu"><h4>Menu <i></i></h4><div class="mg">${MPLUS.map(([k,i,t])=>`<button data-act="mGo" data-k="${k}" class="${UI.tab===k&&!inv?'on':''}">${uic(UIC[i]?i:'star')}${t}${d2(k)}</button>`).join('')}</div></div>` }
const _dockHTML0=dockHTML; dockHTML=function(){ return _dockHTML0()+mnavHTML() };
function mNav(k){ if(k==='plus'){ UI.mPlus=!UI.mPlus; renderTabs(); return } UI.mPlus=false;
  if(k==='bag'){ openInv(!UI.invOpen); return }
  if(UI.invOpen) openInv(false); A.tab({t:k}); scrollTo(0,0) }
function mGo(k){ UI.mPlus=false; if(k==='fr'){ renderTabs(); A.frBtn(); return } if(k==='mail'){ renderTabs(); A.mlOpen(); return } if(k==='opts'){ if(UI.invOpen) openInv(false); A.scr({s:'opts'}); return } if(UI.invOpen) openInv(false); A.tab({t:k}); scrollTo(0,0) }
/* appui long = clic droit ; sur un élément sans action, affiche son infobulle */
let LP=null,LPT=0;
const LP_CTX='#bag,#doll,#stash,#fslot,.fslot2,.mfs,.dslot,.gi,.si';
document.addEventListener('pointerdown',e=>{ if(e.pointerType!=='touch'){ return } LPT=Date.now(); if(LP) clearTimeout(LP.tm);
  const t=e.target; LP={x:e.clientX,y:e.clientY,t,fired:false,tm:setTimeout(()=>{ if(!LP||LP.t!==t) return; LP.fired=true;
    const ctx=t.closest&&t.closest(LP_CTX),tipEl=t.closest&&t.closest('[data-tip]');
    if(ctx||!tipEl){ t.dispatchEvent(new MouseEvent('contextmenu',{bubbles:true,cancelable:true,clientX:LP.x,clientY:LP.y})) }
    else mobTip(tipEl);
    if(navigator.vibrate) try{ navigator.vibrate(15) }catch(x){} },500)};
  const tp=$('#tip'); if(tp&&tp.classList.contains('msh')&&!tp.contains(t)){ tp.hidden=true; tp.classList.remove('msh') } },true);
document.addEventListener('pointermove',e=>{ if(LP&&Math.hypot(e.clientX-LP.x,e.clientY-LP.y)>10){ clearTimeout(LP.tm); LP=null } },true);
const lpEnd=()=>{ if(!LP) return; clearTimeout(LP.tm); if(LP.fired){ const f=ev=>{ ev.preventDefault(); ev.stopImmediatePropagation(); document.removeEventListener('click',f,true) }; document.addEventListener('click',f,true); setTimeout(()=>document.removeEventListener('click',f,true),400) } LP=null };
document.addEventListener('pointerup',lpEnd,true); document.addEventListener('pointercancel',()=>{ if(LP){ clearTimeout(LP.tm); LP=null } },true);
/* le menu natif d'appui long (Android) est remplacé par le nôtre */
document.addEventListener('contextmenu',e=>{ if(e.isTrusted&&Date.now()-LPT<1500){ e.preventDefault(); e.stopImmediatePropagation() } },true);
function mobTip(el){ const t=$('#tip'),html=tipHTML(el.dataset.tip); if(!t||!html) return; t.innerHTML=html; t.hidden=false; t.classList.add('msh'); t.style.left=''; t.style.top=''; TIPEL=el }
