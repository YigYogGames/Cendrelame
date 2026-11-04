/* Cendrelame · ui/trophees.js */
/* ================= Trophées ================= */
Object.assign(UIC,{
 trophy:'<path d="M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M7 6H4v1a3 3 0 0 0 3 3M17 6h3v1a3 3 0 0 1-3 3"/><path d="M12 14v3M8 21h8M9 21l1-4h4l1 4"/>',
 medal:'<circle cx="12" cy="15" r="5"/><path d="M8.5 11 6 3h4l2 5 2-5h4l-2.5 8"/><path d="M12 13l.9 1.8 2 .3-1.4 1.4.3 2-1.8-.9-1.8.9.3-2-1.4-1.4 2-.3z"/>',
 shield:'<path d="M12 3l8 3v6c0 4.5-3.4 8-8 9-4.6-1-8-4.5-8-9V6z"/><path d="M9 12l2 2 4-4"/>',
 podium:'<path d="M3 21v-6h6v6M9 21V9h6v12M15 21v-8h6v8"/><path d="M12 3l.9 1.8 2 .3-1.4 1.4.3 2L12 7.6l-1.8.9.3-2-1.4-1.4 2-.3z"/>',
 card:'<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="11" r="2.4"/><path d="M5.5 16.5c.6-1.8 2-2.6 3.5-2.6s2.9.8 3.5 2.6M14 10h4M14 13h4"/>',
 brush:'<path d="M14.5 4.5l5 5-8 8-5-5z"/><path d="M6.5 12.5C4 13 3.5 15.5 3 20c4.5-.5 7-1 7.5-3.5"/>',
 star:'<path d="M12 3l2.6 5.6 6 .7-4.5 4.1 1.2 6L12 16.4 6.7 19.4l1.2-6L3.4 9.3l6-.7z"/>',
 helm:'<path d="M4.5 14.5a7.5 7.5 0 0 1 15 0V20h-5v-4.5h-5V20h-5z"/><path d="M12 7v8"/>',
});
const TR_CATS=[['adv','swords','Aventure','Vaincre les boss et conquérir toutes les difficultés.'],['hero','helm','Personnage','Faire grandir vos héros.'],['forge','anvil','Amélioration','Forger et perfectionner l’équipement.'],['col','paw','Compagnon','Invoquer, faire évoluer et envoyer vos créatures en expédition.'],['pvp','people','Duel et raid','Affronter les autres joueurs et les boss de raid.']];
const trCnt=k=>(ACC.cnt&&ACC.cnt[k])||0;
const bossK=(d,z)=>{ if(S.bossK&&S.bossK[d+z]) return 1; const k=progKey(d),P=S[k]; if(P&&P.zone>z) return 1; if(d==='hero'&&z===ZONES.length-1&&S.mythOpen) return 1; return 0 };
const anyItem=f=>[...invItems(),...Object.values(S.heroes[0].equip||{}).filter(Boolean)].some(f);
const nChars=()=>{let n=0;for(let i=0;i<MAXCH;i++) if(charSum(i)) n++; return n};
const TROPHIES=[
 {id:'a_first',c:'adv',n:'Premiers pas',d:'Remporter un premier combat.',p:5,f:()=>[S.kills>0?1:0,1]},
 ...ZONES.map((z,i)=>({id:'a_b'+i,c:'adv',n:['Roi déchu','Repos éternel','Assécheur de marais','Cendres froides','Pourfendeur du Néant'][i]||('Vainqueur : '+z.boss.n),d:`Vaincre le boss de la zone ${z.n} : ${z.boss.n}.`,p:[5,10,15,20,30][i]||20,t:i===ZONES.length-1,f:()=>[bossK('normal',i),1]})),
 {id:'a_hero',c:'adv',n:'Héros de légende',d:`Vaincre ${ZONES[ZONES.length-1].boss.n} en difficulté Héroïque.`,p:50,t:1,f:()=>[bossK('hero',ZONES.length-1),1]},
 {id:'a_myth',c:'adv',n:'Fléau du Néant',d:`Vaincre ${ZONES[ZONES.length-1].boss.n} en difficulté Mythique.`,p:100,t:1,f:()=>[bossK('myth',ZONES.length-1),1]},
 {id:'h_10',c:'hero',n:'Aguerri',d:'Atteindre le niveau 10.',p:5,f:()=>[Math.min(10,S.heroes[0].lvl),10]},
 {id:'h_25',c:'hero',n:'Vétéran',d:'Atteindre le niveau 25.',p:10,f:()=>[Math.min(25,S.heroes[0].lvl),25]},
 {id:'h_max',c:'hero',n:'Champion',d:`Atteindre le niveau maximum (${MAXL}).`,p:25,t:1,f:()=>[S.heroes[0].lvl,MAXL]},
 {id:'h_spec',c:'hero',n:'Voie tracée',d:'Choisir une spécialisation.',p:5,f:()=>[S.heroes[0].spec?1:0,1]},
 {id:'h_ult',c:'hero',n:'Pouvoir ultime',d:'Apprendre un talent ultime.',p:15,f:()=>[heroSkills(S.heroes[0]).some(sk=>sk.ult&&S.heroes[0].learned[sk.id]>0)?1:0,1]},
 {id:'h_2ch',c:'hero',n:'Deux destins',d:'Créer un deuxième personnage.',p:10,f:()=>[Math.min(2,nChars()),2]},
 {id:'f_10',c:'forge',n:'Apprenti forgeron',d:'Forger 10 objets.',p:5,f:()=>[trCnt('forge'),10]},
 {id:'f_100',c:'forge',n:'Forgeron confirmé',d:'Forger 100 objets.',p:15,f:()=>[trCnt('forge'),100]},
 {id:'f_500',c:'forge',n:'Maître forgeron',d:'Forger 500 objets.',p:30,t:1,f:()=>[trCnt('forge'),500]},
 {id:'f_leg',c:'forge',n:'Œuvre légendaire',d:'Posséder un objet Légendaire.',p:20,f:()=>[anyItem(i=>i.rarity>=4)?1:0,1]},
 {id:'f_div',c:'forge',n:'Œuvre divine',d:'Posséder un objet Divin.',p:50,t:1,f:()=>[anyItem(i=>i.rarity>=5)?1:0,1]},
 {id:'f_up',c:'forge',n:'Perfection',d:'Améliorer un objet jusqu’à +10.',p:25,f:()=>[anyItem(i=>i.up>=10)?1:0,1]},
 {id:'c_50',c:'col',n:'Dresseur débutant',d:'Invoquer 10 créatures.',p:5,f:()=>[(ACC.comp&&ACC.comp.disc)||0,10]},
 {id:'c_500',c:'col',n:'Maître dresseur',d:'Terminer 100 expéditions de compagnon.',p:20,t:1,f:()=>[(ACC.comp&&ACC.comp.nexp)||0,100]},
 {id:'c_all',c:'col',n:'Encyclopédiste',d:'Découvrir les 10 espèces de créatures.',p:15,f:()=>[Object.keys((ACC.comp&&ACC.comp.seen)||{}).length,10]},
 {id:'c_auto',c:'col',n:'Éveil',d:'Faire évoluer une créature jusqu’à sa 3ᵉ forme.',p:20,f:()=>[(ACC.comp&&ACC.comp.list.some(c=>c.st>=2))?1:0,1]},
 {id:'p_d1',c:'pvp',n:'Premier sang',d:'Remporter un duel.',p:10,f:()=>[Math.max(trCnt('duel'),(S.pvp||{}).w||0),1]},
 {id:'p_d10',c:'pvp',n:'Duelliste',d:'Remporter 10 duels.',p:20,t:1,f:()=>[Math.max(trCnt('duel'),(S.pvp||{}).w||0),10]},
 {id:'p_d50',c:'pvp',n:'Gladiateur',d:'Remporter 50 duels.',p:40,t:1,f:()=>[Math.max(trCnt('duel'),(S.pvp||{}).w||0),50]},
 {id:'p_r1',c:'pvp',n:'Frères d’armes',d:'Réussir un raid.',p:15,f:()=>[Object.values(S.raid||{}).some(v=>v>0)?1:0,1]},
 {id:'p_r5',c:'pvp',n:'Briseur de paliers',d:'Réussir un raid au palier +5.',p:30,f:()=>[Math.min(6,Math.max(0,...Object.values(S.raid||{}))),6]},
 {id:'p_ava',c:'pvp',n:'Vainqueur de l’Abîme',d:`Vaincre ${RAIDS[RAIDS.length-1].n} en raid.`,p:50,t:1,f:()=>[raidMax(RAIDS[RAIDS.length-1].id)>0?1:0,1]},
];
const TRK=Object.fromEntries(TROPHIES.map(t=>[t.id,t]));
const trTier=t=>t.p>=50?'or':t.p>=15?'argent':'bronze';
const trIc=t=>t.p>=50?'trophy':t.p>=15?'medal':'star';
const trGot=id=>!!(ACC.troph&&ACC.troph[id]);
const trPts=()=>TROPHIES.reduce((a,t)=>a+(trGot(t.id)?t.p:0),0)+(typeof seaTrPts==='function'?seaTrPts():0);
const trProg=t=>{ if(trGot(t.id)) return 1; try{const [a,b]=t.f(); return Math.max(0,Math.min(1,a/b))}catch(e){return 0} };
let trBusy=false;
function trophyCheck(quiet){
  if(trBusy||!S||!S.heroes||!S.heroes.length) return; trBusy=true; if(!ACC.troph) quiet=true;
  try{ ACC.troph=ACC.troph||{}; const got=[];
    for(const t of TROPHIES){ if(ACC.troph[t.id]) continue; let ok=false; try{const [a,b]=t.f(); ok=a>=b}catch(e){} if(ok){ ACC.troph[t.id]=Date.now(); got.push(t) } }
    if(got.length){ ACC.trNew=(ACC.trNew||0)+got.length; saveAcc(); if(!quiet) got.slice(0,3).forEach((t,i)=>setTimeout(()=>trToast(t),400+i*700)); else if(got.length) setTimeout(()=>toast(`${got.length} trophée${got.length>1?'s':''} obtenu${got.length>1?'s':''} : +${got.reduce((a,t)=>a+t.p,0)} points.`),600); if(typeof renderTabs==='function'&&!UI.scr) renderTabs(); presence() }
  }finally{ trBusy=false }
}
function trToast(t){ const e=document.createElement('div'); e.className='toast trt'; e.innerHTML=`<span class="mtti sm ${trTier(t)}">${uic(trIc(t))}</span><span><b>Trophée obtenu : ${esc(t.n)}</b><small>+${t.p} points de trophées</small></span>`; $('#toasts').append(e); setTimeout(()=>e.remove(),5200) }
const trCard=t=>{const g=trGot(t.id),pr=trProg(t);let cur='';try{const [a,b]=t.f(); if(!g&&b>1) cur=`<small class="num mtcur">${fmt(Math.min(a,b))} / ${fmt(b)}</small>`}catch(e){}
  return `<article class="mttr ${g?'ok':''} ${trTier(t)}"><span class="mtti">${uic(trIc(t))}</span><div><b>${esc(t.n)}</b><small>${esc(t.d)}</small>${g?`<em class="mtdone">${uic('check')} Obtenu le ${new Date(ACC.troph[t.id]).toLocaleDateString('fr-FR')}</em>`:`<span class="mtpb"><i style="width:${pr*100}%"></i></span>${cur}`}${t.t?`<small class="mttit">Titre : « ${esc(t.n)} »</small>`:''}</div><span class="mtpt"><b class="num">${t.p}</b><small>pts</small></span></article>`};
function viewTroph(){
  if(ACC.trNew){ ACC.trNew=0; saveAcc(); setTimeout(renderTabs,0) }
  const cat=UI.trCat||'all',flt=UI.trF||'all',pts=trPts(),max=TROPHIES.reduce((a,t)=>a+t.p,0),nGot=TROPHIES.filter(t=>trGot(t.id)).length;
  const cats=[['all','trophy','Tous les trophées','L’ensemble de vos trophées et succès.'],...TR_CATS];
  const C=cats.find(c=>c[0]===cat)||cats[0];
  let L=TROPHIES.filter(t=>cat==='all'||t.c===cat); if(flt==='got') L=L.filter(t=>trGot(t.id)); if(flt==='todo') L=L.filter(t=>!trGot(t.id));
  L.sort((a,b)=>(trGot(b.id)-trGot(a.id))||(trProg(b)-trProg(a))||(a.p-b.p));
  const last=TROPHIES.filter(t=>trGot(t.id)).sort((a,b)=>ACC.troph[b.id]-ACC.troph[a.id]).slice(0,3);
  return `<div class="mt1"><aside class="aminfo maside mtside"><div class="mtsum"><span class="mtbig">${uic('trophy')}</span><b class="num">${fmt(pts)}</b><small>points de trophées</small><span class="mtpb big"><i style="width:${pts/max*100}%"></i></span><small class="mute">${nGot} / ${TROPHIES.length} trophées obtenus</small></div>
   <div class="masub" role="tablist">${cats.map(([k,i,n])=>{const T=k==='all'?TROPHIES:TROPHIES.filter(t=>t.c===k);return `<button role="tab" aria-selected="${k===cat}" class="${k===cat?'on':''}" data-act="trCat" data-c="${k}">${uic(i)}<span>${k==='all'?'Tous':n}</span><em class="num">${T.filter(t=>trGot(t.id)).length}/${T.length}</em></button>`}).join('')}</div></aside>
   <section class="mtmain"><div class="mtlast"><h4>Derniers trophées obtenus</h4><div class="mtlastg">${last.length?last.map((t,i)=>`<div class="mtped ${trTier(t)} ${i===0?'first':''}"><span class="mtti">${uic(trIc(t))}</span><b>${esc(t.n)}</b><small>${t.p} pts · ${new Date(ACC.troph[t.id]).toLocaleDateString('fr-FR')}</small></div>`).join(''):'<p class="mtempty">Aucun trophée pour l’instant : remportez votre premier combat !</p>'}</div></div>
    <div class="mctop"><h2>${C[2]}</h2><span class="mute">${C[3]}</span><div class="mcseg light" style="margin-left:auto">${[['all','Tous'],['got','Obtenus'],['todo','À obtenir']].map(([k,n])=>`<button class="${flt===k?'on':''}" data-act="trF" data-f="${k}">${n}</button>`).join('')}</div></div>
    <div class="mtgrid">${L.map(trCard).join('')||'<p class="mtempty dark">Aucun trophée dans cette liste.</p>'}</div></section></div>`;
}
