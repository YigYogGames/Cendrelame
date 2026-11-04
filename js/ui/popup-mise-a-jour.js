/* Cendrelame · ui/popup-mise-a-jour.js */
/* ---------- popup de mise à jour (parchemin, une fois par version) ---------- */
const UPOP={v:'0.8.0',k:'Chroniques de Cendrelame',t:'Le mode Compagnon',base:[
  {ic:'star',img:0,t:'Le mode Compagnon',d:'La Collecte laisse place au Compagnon : invoquez des créatures avec des Tickets de découverte (clic droit dans l’inventaire, par 1 ou par 10), nourrissez-les et faites-les évoluer en 3 formes. Cadeau de bienvenue : 3 tickets à votre première visite.'},
  {ic:'gear',img:5,t:'Des créatures uniques',d:'Chaque créature a des statistiques et 3 passifs tirés au hasard : sa qualité va de D à S. Invoquez beaucoup, gardez les meilleures et relâchez les autres contre des Jetons de ménagerie. Une créature sur 200 est Shiny : toutes ses statistiques au maximum, avec 15 % de plus.'},
  {ic:'hammer',img:2,t:'Expéditions',d:'Envoyez 1 à 3 créatures en expédition, de 1 h à 24 h. La réussite dépend de leurs statistiques, de leur type (Eau bat Feu, Feu bat Terre, Terre bat Eau, Lumière et Ténèbres l’une contre l’autre), de leur niveau et de leur faim. Butin : or, ressources, jetons et pierres d’évolution.'},
  {ic:'star',img:3,t:'Faim et Boutique du dresseur',d:'La faim baisse avec le temps : sous 75 %, les statistiques baissent en expédition. Nourriture, objets portés, pierres d’évolution, habitats et places de stockage s’achètent avec vos jetons. Les duels de créatures arriveront plus tard.'}],pages:[]};
UPOP.pages=UPOP.base.slice();
let UPG=0;
function upPopHTML(){ const P=UPOP.pages[UPG],n=UPOP.pages.length,last=UPG===n-1;
  return `<div class="v7upbg" id="uppop"><div class="v7up" role="dialog" aria-modal="true" aria-label="Nouveautés ${UPOP.v}"><div class="scroll"><button class="v7upx" data-act="upClose" ${ttip('Fermer')}>×</button><span class="seal num">${UPOP.v}</span>
   <small class="k">${UPOP.k}</small><h1>${UPOP.t}</h1><div class="img">${zoneScene(P.img,'up'+UPG)}</div>
   <div class="pg"><b>${v7i(P.ic)}<span>${P.t}</span></b><p>${P.d}</p></div>
   <label class="v7uph"><input type="checkbox" data-act="upHide" ${ACC.upHide===UPOP.v?'checked':''}><span>Ne plus afficher jusqu’à la prochaine grande mise à jour</span></label>
   <div class="nav"><div class="dots">${UPOP.pages.map((_,i)=>`<button class="${i===UPG?'on':''}" data-act="upGo" data-i="${i}" aria-label="Page ${i+1}"></button>`).join('')}</div><span class="num">${UPG+1} / ${n}</span><span class="sp"></span><button class="btn" data-act="upGo" data-i="${UPG-1}" ${UPG?'':'disabled'}>Précédent</button><button class="btn pri" data-act="${last?'upClose':'upGo'}" data-i="${UPG+1}">${last?'Jouer':'Suivant'}</button></div></div></div></div>`}
function upPopShow(force){ upRecapPrep(); if(!force&&ACC.upHide===UPOP.v) return; UPG=0; const o=$('#uppop'); if(o) o.remove(); document.body.insertAdjacentHTML('beforeend',upPopHTML()) }
function upPopRender(){ const o=$('#uppop'); if(!o) return; o.outerHTML=upPopHTML().replace('class="v7upbg"','class="v7upbg na"') }
function upPopClose(){ const o=$('#uppop'); if(o) o.remove() }
function upPopHide(){ ACC.upHide=ACC.upHide===UPOP.v?null:UPOP.v; saveAcc(); upPopRender() }
document.addEventListener('keydown',e=>{ if(!$('#uppop')) return; if(e.key==='Escape'){ e.preventDefault(); upPopClose() } else if(e.key==='ArrowRight'&&UPG<UPOP.pages.length-1){ UPG++; upPopRender() } else if(e.key==='ArrowLeft'&&UPG>0){ UPG--; upPopRender() } },true);

