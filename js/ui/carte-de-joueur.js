/* Cendrelame · ui/carte-de-joueur.js */
/* ================= Carte de joueur ================= */
const PC_FR=[['Or','#d8b066',0],['Argent','#c0c6cf',0],['Azur','#7fb4ff',50],['Améthyste','#b07ad8',150],['Émeraude','#8fdc6a',300],['Braise','#ff7a5a',500],
 ['Or royal · Reflet balayant','#e8c25a',null,'sweep','#fff6c8'],['Saphir · Halo tournant','#5fb4ff',null,'halo','#e6f6ff'],['Améthyste · Étincelles','#c58bff',null,'spark','#ffffff'],['Braise vivante','#ff6a3a',null,'pulse','#ffd2a0'],['Prisme holographique','#7fe0d0',null,'holo','#ffffff']];
const pcFrOk=i=>{const F=PC_FR[i]; if(!F) return false; return F[2]==null?!!(ACC.cos&&ACC.cos['fr'+i]):trPts()>=F[2]};
const pcFr=i=>PC_FR[i]||PC_FR[0];
const pcFxAttr=d=>{const F=pcFr(d.fr);return `style="--fr:${F[1]};--fl:${F[4]||F[1]}" data-fx="${F[3]||''}"`};
const PC_SPK='<i class="pcsp s1"></i><i class="pcsp s2"></i><i class="pcsp s3"></i><i class="pcsp s4"></i><i class="pcsp s5"></i>';
const PC_ICONS=[['c:guerrier',0],['c:mage',0],['i:swords',0],['i:shield',0],['i:star',50],['i:trophy',150]];
const PC_BG=[[0,'Forêt des Murmures',()=>1],[1,'Catacombes oubliées',()=>bossK('normal',0)],[2,'Marais putride',()=>bossK('normal',1)],[3,'Pic de Cendre',()=>bossK('normal',2)],[4,'Abysses du Néant',()=>bossK('normal',3)],[5,'Glaces éternelles',()=>Object.values(S.raid||{}).some(v=>v>0)],[6,'Arène',()=>trGot('p_d1')]];
/* 0.8.16 : la carte n’affiche que les 3 personnages de plus haut niveau */
const pcTop3=L=>(L||[]).slice().sort((a,b)=>(b.lvl||0)-(a.lvl||0)).slice(0,3);
const pcDef=()=>Object.assign({icon:'c:'+(S&&S.heroes[0]?S.heroes[0].cls:'guerrier'),fr:0,bg:3,title:null,show:[]},ACC.card||{});
function cardMine(){
  const c=pcDef();let chars=[];for(let i=0;i<MAXCH;i++){const s=charSum(i); if(s) chars.push({n:s.name,cls:s.cls,lvl:s.lvl})} chars=pcTop3(chars);
  return {name:(FB.prof&&FB.prof.name)||(S&&S.heroes[0]&&S.heroes[0].name)||'Joueur',pts:trPts(),icon:c.icon,fr:c.fr,bg:(c.bg>=100&&!cosOwn(SBG_ID[c.bg]))?3:c.bg,orn:cosOk(c.orn),pf:cosOk(c.pf),aura:cosOk(c.aura),trail:cosOk(c.trail),cfx:cosOk(c.cfx),title:c.title&&trGot(c.title)&&TRK[c.title]?TRK[c.title].n:null,show:(c.show||[]).filter(id=>trGot(id)&&TRK[id]).slice(0,3),chars};
}
const pcIcon=(ic,s)=>{ic=ic||'c:guerrier';return ic.startsWith('c:')&&PORTRAIT[ic.slice(2)]?`<img src="${PORTRAIT[ic.slice(2)]}" width="${s}" height="${s}" alt="" class="mpport">`:`<span class="mpunk pcemb" style="width:${s}px;height:${s}px">${uic(UIC[ic.slice(2)]?ic.slice(2):'star')}</span>`};
const pcPort=(cls,s)=>PORTRAIT[cls]?`<img src="${PORTRAIT[cls]}" width="${s}" height="${s}" alt="" class="mpport">`:`<span class="mpunk" style="width:${s}px;height:${s}px"></span>`;
function cardColl(d,id='me'){ /* carte de collection : amis */
  return pcOrnWrap(d,`<article class="pc1 ${pcFr(d.fr)[3]?'pcfx':''}" ${pcFxAttr(d)}><div class="pc1bg">${pcBgH(d.bg??3,'pc'+id)}</div><div class="pc1top">${pcFr(d.fr)[3]==='spark'?PC_SPK:''}${pcPf(d,96)}<b>${esc(d.name)}</b>${d.title?`<small class="pc1t">« ${esc(d.title)} »</small>`:''}</div>
   <div class="pc1pts">${uic('trophy')}<b class="num">${fmt(d.pts||0)}</b><small>points de trophées</small></div>
   ${(d.show||[]).length?`<div class="pc1show">${d.show.map(i=>TRK[i]?`<span class="mtti sm ${trTier(TRK[i])}" title="${esc(TRK[i].n)}">${uic(trIc(TRK[i]))}</span>`:'').join('')}</div>`:''}
   <ul class="pc1ch">${(()=>{ const T=pcTop3(d.chars),L=T.map(c=>`<li>${pcPort(c.cls,34)}<span><b>${esc(c.n)}</b><small>${(CLASSES[c.cls]||{n:''}).n}</small></span><em class="num">Niv ${c.lvl}</em></li>`); while(L.length<3) L.push('<li class="pcemp" aria-hidden="true"></li>'); return L.join('') })()}</ul>${pcCfx(d)}</article>`);
}
function cardBanner(d,id='meb',rank){ /* bannière : classement */
  return `<article class="pc2 ${pcFr(d.fr)[3]?'pcfx':''}" ${pcFxAttr(d)}>${pcFr(d.fr)[3]==='spark'?PC_SPK:''}<div class="pc2bg">${pcBgH(d.bg??3,'pb'+id)}</div>${rank?`<span class="pc2rk num">${rank}</span>`:''}<div class="pc2l">${pcPf(d,96)}</div><div class="pc2m"><small>Joueur</small><b>${esc(d.name)}</b>${d.title?`<span class="pc1t">« ${esc(d.title)} »</span>`:''}<div class="pc2pts">${uic('trophy')}<b class="num">${fmt(d.pts||0)}</b> points de trophées</div></div>
   <div class="pc2r">${pcTop3(d.chars).map(c=>`<div class="pc2c">${pcPort(c.cls,48)}<b>${esc(c.n)}</b><small>${(CLASSES[c.cls]||{n:''}).n} · niv ${c.lvl}</small></div>`).join('')}</div></article>`;
}
function openCard(d,extra=''){
  closeCard(); const w=document.createElement('div'); w.id='pcard'; w.className='pcmodal'; w.setAttribute('role','dialog'); w.setAttribute('aria-modal','true'); w.setAttribute('aria-label','Carte de joueur : '+d.name);
  w.tabIndex=-1; w.innerHTML=`<div class="pcmbox">${cardColl(d,'pop')}${extra}</div>`;
  w.addEventListener('click',e=>{ if(!e.target.closest('.pc1')) closeCard() }); w.addEventListener('keydown',e=>{ if(e.key==='Escape') closeCard() }); document.body.append(w); w.focus();
}
function closeCard(){ const w=$('#pcard'); if(w) w.remove() }
const PCF_IC={du:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 4l9 9M20 4l-9 9M6 14l4 4M18 14l-4 4M3 21l3-3M21 21l-3-3"/></svg>',ch:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M4 5h16v10H9l-5 4z"/></svg>'};
let PCF={pos:null,drag:null};
function friendCardFl(f){
  const o=f.users.find(x=>x!==FB.user.uid),p=FR.prof[o]||{},c=p.card,ol=isOnline(p),nm=otherName(f);
  const d=c?Object.assign({},c,{name:c.name||nm}):{name:nm,pts:0,icon:'c:'+((p.char&&p.char.cls)||'guerrier'),fr:0,bg:3,chars:p.char?[{n:p.char.name,cls:p.char.cls,lvl:p.char.lvl}]:[]};
  let w=$('#pcfl'); const fresh=!w; if(!w){ w=document.createElement('div'); w.id='pcfl'; w.className='pcfl'; w.setAttribute('role','dialog'); document.body.append(w) }
  delete w.dataset.rk; w.dataset.fid=f.id; w.setAttribute('aria-label','Carte de joueur : '+nm);
  w.innerHTML=`<div class="pcside"><button class="du" data-act="frDuel" data-id="${f.id}" ${ol?'':'disabled'} ${ttip('Défier '+nm+' en duel',ol?'':'Ce joueur n’est pas en ligne.')}>${PCF_IC.du}</button><button class="ch" data-act="frChat" data-id="${f.id}" ${ttip('Discuter avec '+nm)}>${PCF_IC.ch}</button><button class="ins" data-act="frInsp" data-id="${f.id}" ${ttip('Inspecter l’équipement de '+nm)}>${uic('helm')}</button></div>
   <div class="pcbox" data-pcdrag><span class="grip"></span>${cardColl(d,'fl')}<button class="pcx2" data-act="pcClose" ${ttip('Fermer la carte')}>×</button>${c?'':'<p class="pcnote">Ce joueur n’a pas encore mis à jour sa carte.</p>'}</div>`;
  if(fresh){ const r=w.getBoundingClientRect(); const P=PCF.pos||{x:Math.round(innerWidth/2-r.width/2),y:Math.max(70,Math.round(innerHeight/2-r.height/2))}; pcfPlace(w,P.x,P.y) }
}
function pcfPlace(w,x,y){ const r=w.getBoundingClientRect(); x=clamp(x,4,Math.max(4,innerWidth-r.width-4)); y=clamp(y,4,Math.max(4,innerHeight-60)); w.style.left=(x)/ZM+'px'; w.style.top=(y)/ZM+'px'; PCF.pos={x,y} }
function rkFrState(uid){ if(!FB.user) return 'off'; if(uid===FB.user.uid) return 'me'; const f=FR.list.find(x=>x.id===[FB.user.uid,uid].sort().join('_')); return f?(f.status==='accepted'?'fr':'pend'):'no' }
const PCF_ADD='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="8" r="4"/><path d="M2 21c0-4 3-6.5 7-6.5s7 2.5 7 6.5M19 8v6M16 11h6"/></svg>';
function rkCardFl(key){
  const {p}=rkFind(key); if(!p) return; const c=p.card,nm=p.name||(c&&c.name)||'?',st=rkFrState(p.uid);
  const d=Object.assign({pts:0,icon:'c:guerrier',fr:0,bg:3,chars:[]},c||{},{name:nm});
  let w=$('#pcfl'); const fresh=!w; if(!w){ w=document.createElement('div'); w.id='pcfl'; w.className='pcfl'; w.setAttribute('role','dialog'); document.body.append(w) }
  delete w.dataset.fid; w.dataset.rk=key; w.setAttribute('aria-label','Carte de joueur : '+nm);
  const addT=st==='me'?['Ajouter en ami','C’est votre propre carte.']:st==='fr'?['Déjà ami',nm+' fait déjà partie de vos amis.']:st==='pend'?['Demande en cours','Une demande d’ami est déjà en attente avec '+nm+'.']:st==='off'?['Ajouter en ami','Connectez-vous pour ajouter des amis.']:['Envoyer une demande d’ami à '+nm,''];
  w.innerHTML=`<div class="pcside"><button class="ins" data-act="rkInsp" data-k="${esc(key)}" ${ttip('Inspecter l’équipement de '+nm,key.endsWith('|duel')?'Équipement lors de sa dernière victoire en duel.':'Équipement au moment de ce record.')}>${uic('helm')}</button><button class="add" data-act="rkFrAdd" data-k="${esc(key)}" ${st==='no'?'':'disabled'} ${ttip(addT[0],addT[1])}>${PCF_ADD}</button></div>
   <div class="pcbox" data-pcdrag><span class="grip"></span>${cardColl(d,'fl')}<button class="pcx2" data-act="pcClose" ${ttip('Fermer la carte')}>×</button>${c?'':'<p class="pcnote">Ce joueur n’a pas encore mis à jour sa carte.</p>'}</div>`;
  if(fresh){ const r=w.getBoundingClientRect(); const P=PCF.pos||{x:Math.round(innerWidth/2-r.width/2),y:Math.max(70,Math.round(innerHeight/2-r.height/2))}; pcfPlace(w,P.x,P.y) }
}
const pcfClose=()=>{ const w=$('#pcfl'); if(w) w.remove() };
document.addEventListener('pointerdown',e=>{ const h=e.target.closest&&e.target.closest('[data-pcdrag]'); if(!h||e.target.closest('button')||e.button>0) return; const w=$('#pcfl'),r=w.getBoundingClientRect(); PCF.drag={dx:e.clientX-r.left,dy:e.clientY-r.top}; w.classList.add('mov'); e.preventDefault() });
document.addEventListener('pointermove',e=>{ if(!PCF.drag) return; const w=$('#pcfl'); if(!w){PCF.drag=null;return} pcfPlace(w,e.clientX-PCF.drag.dx,e.clientY-PCF.drag.dy) });
document.addEventListener('pointerup',()=>{ if(!PCF.drag) return; PCF.drag=null; const w=$('#pcfl'); if(w) w.classList.remove('mov') });
document.addEventListener('keydown',e=>{ if(e.key==='Escape'&&$('#pcfl')&&!$('#pcard')) pcfClose() });
function friendCard(fid){
  const f=FR.list.find(x=>x.id===fid); if(!f) return; return friendCardFl(f); const o=f.users.find(x=>x!==FB.user.uid),p=FR.prof[o]||{},c=p.card;
  const d=c?Object.assign({},c,{name:c.name||otherName(f)}):{name:otherName(f),pts:0,icon:'c:'+((p.char&&p.char.cls)||'guerrier'),fr:0,bg:3,chars:p.char?[{n:p.char.name,cls:p.char.cls,lvl:p.char.lvl}]:[]};
  openCard(d,c?'':'<p class="pcnote">Ce joueur n’a pas encore mis à jour sa carte.</p>');
}
