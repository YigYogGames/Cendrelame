/* Cendrelame · ui/accueil.js (0.8.15)
   Écran d’accueil « Salle du héros » : affiché après le choix du personnage.
   Au centre le héros ; à droite le prochain boss, les activités et la liste « À faire ». */
Object.assign(UIC,{
  home:UIC.home||'<path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10v10h5v-6h3v6h5V10"/>',
  clock:UIC.clock||'<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
  spark:UIC.spark||'<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6"/>',
  trophy2:UIC.trophy2||'<path d="M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M7 6H4a3 3 0 0 0 3 4M17 6h3a3 3 0 0 1-3 4M12 14v4M8 20h8"/>',
  duel:UIC.duel||'<circle cx="8" cy="8" r="3"/><circle cx="16" cy="8" r="3"/><path d="M3 20c0-3 2.5-5 5-5s5 2 5 5M11 20c0-3 2.5-5 5-5s5 2 5 5"/>',
});
const HM_L=['helm','armor','legs','boots'],HM_R=['amulet','ring','ring2','weapon'];
function hmSlot(h,k){ const it=h.equip&&h.equip[k];
  return it?`<button class="hmslot full${itFx(it)}" data-act="tab" data-t="heroes" data-tip="f:${it.id}" aria-label="${SLOT_N[k]} : ${esc(it.name)}" style="--rc:var(--r${it.rarity})">${eqIco(it,k)}${it.up?`<em class="up">+${it.up}</em>`:''}${ilTag(it)}</button>`
    :`<span class="hmslot" ${ttip(SLOT_N[k],'Emplacement vide : équipez un objet depuis le sac.')}>${eqIco(null,k)}</span>` }
function hmTodo(h){
  const L=[],row=(ic,txt,act,lbl,extra='')=>L.push(`<li><span class="hmti">${uic(ic)}</span><span class="hmtt">${txt}</span><button class="btn sm" data-act="${act}" ${extra}>${lbl}</button></li>`);
  const I=S.idle;
  if(I&&I.fights) row('clock',`Gains hors ligne : <b>${fmtDur(I.sec)}</b> · ${I.fights} combat${I.fights>1?'s':''}`,'idleClaim','Récupérer');
  try{ if(qClaimable()) row('scroll','Une récompense de quête est prête','tab','Voir','data-t="quest"') }catch(e){}
  try{ const n=ACC.comp?cpDone():0; if(n) row('paw',`${n} expédition${n>1?'s':''} de compagnon terminée${n>1?'s':''}`,'tab','Voir','data-t="comp"') }catch(e){}
  if(h.sp>0) row('spark',`<b>${h.sp}</b> point${h.sp>1?'s':''} de compétence à dépenser`,'tab','Ouvrir','data-t="heroes"');
  if(S.bagDot) row('bag','Nouveaux objets dans le sac','invTog','Ouvrir');
  if(ACC.trNew) row('trophy2','Nouveau trophée obtenu','tab','Voir','data-t="troph"');
  if(!L.length) L.push(`<li class="hmnone">Rien en attente. ${I&&I.sec?'':'Les gains hors ligne arrivent après 5 minutes d’absence (1 combat toutes les 3 minutes, jusqu’à 12 h).'}</li>`);
  return L.join('');
}
function viewHome(){
  const h=S.heroes[0],c=CLASSES[h.cls],st=heroStats(h),mag=c.role==='mag';
  const P=prog('normal'),z=Math.min(P.zone,ZONES.length-1),Z=ZONES[z],stg=Math.min(P.stage,10),bossR=foeImgRel({name:Z.boss.n,boss:1});
  const spec=h.spec&&c.specs&&c.specs[h.spec]?' · '+c.specs[h.spec].n:'';
  const okR=RAIDS.filter(x=>h.lvl>=x.req),bestR=okR[okR.length-1];
  const fo=typeof friendsOnline==='function'?friendsOnline():null;
  const tile=(m,ic,t,s,tip)=>`<button class="hmact" data-act="hmGo" data-m="${m}" ${ttip(t,tip)}><span class="hmhex">${uic(ic)}</span><b>${t}</b><small>${s}</small></button>`;
  const left=stg>=10?'Combat de boss à la prochaine étape':`Encore ${10-stg} étape${10-stg>1?'s':''} avant le boss`;
  return `<div class="hmwrap">
   <section class="hmstage" aria-label="Votre héros">
    <div class="hmplate"><h2>${esc(h.name)}</h2><small>${c.n}${esc(spec)} · niveau ${h.lvl}</small></div>
    <div class="hmhero"><span class="hmring"></span>${heroArt(h.cls,h.skin,'hmart')}</div>
    <div class="hmstats"><span ${ttip('Points de vie')}>PV <b class="num">${fmt(Math.round(st.hp))}</b></span><span ${ttip(mag?'Intelligence':'Force','Statistique principale de votre classe.')}>${mag?'Intelligence':'Force'} <b class="num">${fmt(Math.round(mag?st.mag:st.atk))}</b></span><span ${ttip('Puissance','Estimation globale de la force du héros.')}>Puissance <b class="num gold">${fmt(Math.round(heroPower(h)))}</b></span></div>
   </section>
   <aside class="hmside">
    <div class="hmban"><div class="zscene zimg zbg${z}" aria-hidden="true"></div>
     <div class="hmbin"><small>Prochain boss · ${esc(Z.n)}</small><h3>${esc(Z.boss.n)}</h3><p>Étape ${stg} / 10 · ${left}.</p><div class="hmbar" ${ttip('Progression de la zone',`Étape ${stg} sur 10`)}><i style="width:${stg*10}%"></i></div></div>
     ${bossR?`<img class="hmboss" src="${imgSrc(bossR)}" alt="">`:''}</div>
    <div class="hmacts">
     ${tile('pve','swords','Aventure',`${esc(Z.n)} · ${stg}/10`,'Ouvre la carte des zones.')}
     ${tile('raid','skull','Défis',bestR?`${esc(bestR.n)} · palier +${raidMax(bestR.id)}`:`Niveau ${RAIDS[0].req} requis`,'Boss de défi à paliers, butin rare.')}
     ${tile('pvp','duel','Duel',!FB.user?'Compte en ligne requis':fo&&fo.n?`${fo.on} ami${fo.on>1?'s':''} en ligne`:'Affrontez un joueur','Combat contre un autre joueur.')}
    </div>
    <div class="hmtodo"><h3>À faire</h3><ul>${hmTodo(h)}</ul>
     <button class="btn pri hmgo" data-act="hmGo" data-m="pve">${uic('swords')}Reprendre l’aventure</button></div>
   </aside></div>`;
}
Object.assign(A,{ hmGo:d=>{ UI.tab='combat'; UI.advMode=d.m||'pve'; render(); scrollTo(0,0) } });
/* arrivée sur l’accueil après le choix du personnage */
{ const _sc=startChar; startChar=function(){ const r=_sc.apply(this,arguments); if(r){ UI.tab='home'; UI.mPlus=false } return r } }
