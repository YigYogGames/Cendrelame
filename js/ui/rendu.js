/* Cendrelame · ui/rendu.js */
/* ============ rendu ============ */
const TABS=[['combat','Aventure'],['heroes','Personnage'],['shop','Marchand'],['forge','Amélioration'],['comp','Compagnon'],['help','Aide']];
const goldRow=()=>`<span class="rs3" data-tip="res:gold" tabindex="0">${matIcon('gold')}<b class="num">${fmt(S.gold)}</b><span class="sr">Or</span></span>`;
function resRow(){ return ['gold',...MATS].map(m=>{const v=m==='gold'?S.gold:matCount(m),full=m!=='gold'&&v>=matCap(m);return `<span class="rs3 ${full?'full':''}" data-tip="res:${m}" tabindex="0" aria-label="${MAT_N[m]} : ${v}">${matIcon(m)}<b class="num">${fmt(v)}</b></span>`}).join('') }
function renderHeader(){
  const el=$('#res'); el.innerHTML=''; const r=$('#ipres'); if(r&&S&&S.heroes&&S.heroes.length) r.innerHTML=goldRow(); return;
  el.innerHTML=['gold',...MATS].map(m=>{const v=m==='gold'?S.gold:matCount(m),full=m!=='gold'&&v>=matCap(m);return `<span class="rs ${full?'full':''}" title="${m==='gold'?'Or':MAT_OBJ[m]+' : '+v.toLocaleString('fr-FR')+' / '+matCap(m).toLocaleString('fr-FR')}">${matIcon(m)}<b>${fmt(v)}</b><span class="sr">${MAT_N[m]}</span></span>`}).join('');
}
function renderTabs(){
  const el=$('#tabs'),g=$('#gear'),nw=$('#news'),mb=$('#menubtn'); $('#ver').textContent='v'+VERSION; seasonPaint(); g.hidden=true; nw.hidden=true;
  mb.hidden=!!UI.scr||!S||!S.heroes.length;
  {const d=mb.querySelector('.ndot'),u=unseenVer(); if(u&&!d) mb.insertAdjacentHTML('beforeend','<span class="ndot" aria-label="Nouvelle version"></span>'); else if(!u&&d) d.remove()}
  if(UI.scr||!S||!S.heroes.length){el.innerHTML='';$('#mehud').hidden=true;document.body.classList.remove('hasdock');return}
  document.body.classList.add('hasdock');
  el.innerHTML=dockHTML();
  {const m=$('#mehud'); m.hidden=false; m.innerHTML=heroChipHTML(); m.setAttribute('aria-current',UI.tab==='heroes'?'page':'false')}
}
const scSel=e=>(e.id?'#'+CSS.escape(e.id):'')+[...e.classList].map(c=>'.'+CSS.escape(c)).join('');
function scrollKeep(){ const out=[]; document.querySelectorAll('body *').forEach(e=>{ if(e.scrollTop>0&&e.scrollHeight>e.clientHeight){ const sel=scSel(e); if(sel) out.push([sel,[...document.querySelectorAll(sel)].indexOf(e),e.scrollTop]) } }); return out }
let SCB=0;
function scrollBack(L){ SCB=Date.now(); for(const [sel,i,t] of L){ const el=document.querySelectorAll(sel)[i]; if(el) el.scrollTop=t } }
let RKEY='';
function anvSync(){ if(UI.anvil&&!(UI.tab==='forge'&&!UI.scr&&UI.ws==='forge'&&UI.fMode==='salv')) UI.anvil=false; document.body.classList.toggle('anvil',!!UI.anvil) }
function render(){ const key=(UI.scr||'')+'|'+UI.tab+'|'+(UI.ws||'')+'|'+(UI.fMode||'')+'|'+(UI.advMode||''),keep=key===RKEY?scrollKeep():[]; RKEY=key; render1(); if(keep.length) scrollBack(keep); anvSync(); gearSync(); if(document.querySelector('.t7tree')) requestAnimationFrame(drawSkLinks) }
function render1(){
  { const tv=TIPEL&&!$('#tip').hidden; hideTip(); if(tv) setTimeout(reTipAt,0) } document.body.classList.toggle('scr',!!UI.scr); document.body.classList.toggle('scr-menu',UI.scr==='menu'||UI.scr==='login'||UI.scr==='pseudo');
  renderTabs(); if(UI.scr) $('#res').innerHTML=''; else renderHeader();
  const v=$('#view');
  renderFriends(); mlRefresh(); if(UI.tab==='comm') requestAnimationFrame(pcFit);
  if(UI.scr){v.innerHTML=({admin:viewAdmin,menu:viewMenu,login:viewLogin,pseudo:viewPseudo,best:viewBest,select:viewSelect,create:viewCreator,opts:viewOpts,news:viewNews})[UI.scr](); renderInvPop(); return}
  if(!S||!S.heroes.length){UI.scr='menu';return render()}
  if(UI.tab==='opts'||UI.tab==='news') UI.tab='combat';
  if(UI.tab==='sites') UI.tab='comp';
  v.innerHTML=({home:viewHome,quest:viewQuest,comm:viewComm,troph:viewTroph,combat:viewCombat,heroes:viewHeroes,bag:viewBag,shop:viewShop,forge:viewForge,sites:viewComp,comp:viewComp,help:viewHelp,opts:viewOpts,news:viewNews})[UI.tab]();
  if(UI.tab==='combat'&&C.phase!=='idle'){C.units.forEach(refresh);renderActbar();const l=$('#log');if(l){l.scrollTop=l.scrollHeight}}
  renderInvPop();
}
function lvlToast(h,n){
  const e=document.createElement('div');e.className='toast lvl';const g=Math.max(0,Math.min(h.lvl,SP_MAX)-Math.max(h.lvl-n,0)); e.innerHTML=`<b>★ Niveau ${h.lvl} ★</b>${esc(h.name)} gagne ${n>1?n+' niveaux':'un niveau'}${g?` : +${g} point${g>1?'s':''} de compétence`:''}.`;
  $('#toasts').append(e);setTimeout(()=>e.remove(),5000);
}
function toast(m){
  const e=document.createElement('div');e.className='toast';e.textContent=m;$('#toasts').append(e);setTimeout(()=>e.remove(),3600);
}

/* --- menu du jeu --- */
const unseenVer=()=>ACC.seenVer!==VERSION;
