/* Cendrelame · ui/page-competences.js */
/* ================= 0.7.0 : page Compétences (style A « Grimoire double ») ================= */
const TREE_LV=[10,12,16,20,25,30,33];
const RES_N={heat:'Degrés de chaleur',chg:'Charges statiques',rage:'Rage',garde:'Garde'};
function skReq7(sk,h){
  if(!h) return '';
  if(h.lvl<(sk.lvl||1)) return `Niveau ${sk.lvl} requis.`;
  if(sk.spec==='*'){ if(!h.spec) return 'Choisissez d’abord une spécialisation.' }
  else if(sk.spec&&h.spec!==sk.spec) return `Spécialisation ${CLASSES[h.cls].specs[sk.spec].n} requise.`;
  if(sk.u){ const o=heroSkills(h).find(x=>x.u&&x.id!==sk.id&&(h.learned[x.id]||0)>0); if(o) return `Un seul ultime : vous avez déjà ${o.n}.` }
  return '';
}
function skLinksTo(sk,h){ /* passifs qui modifient ce sort */
  const all=[...CLASSES[h.cls].common,...Object.values(CLASSES[h.cls].specs).flatMap(s=>s.nodes)];
  return all.filter(p=>(p.links||[]).some(l=>l===sk.id||(l==='@u'&&sk.u))&&(!p.spec||p.spec==='*'||p.spec===sk.spec||!sk.spec));
}
function skCard7(sk,h){
  const chip=(t,c='')=>`<span class="skm ${c}">${t}</span>`;
  const r=h?(h.learned[sk.id]||0):0,mx=skMax(sk),rk=Math.max(1,r),g=h?hx(h):{},req=skReq7(sk,h),U={gx:g};
  const kind=sk.u?'Ultime':sk.t==='p'?'Passif':'Sort actif';
  const sp=sk.spec&&sk.spec!=='*'&&CLASSES[h.cls].specs[sk.spec],br=sp&&sp.br[sk.col];
  const where=sk.base?'Compétence de base':sk.spec==='*'?'Talent de classe':`${sp.n} · ${br}`;
  const txt=x=>sk.t==='p'?sk.pd(x):sk.d(sc(x),g);
  const ap=sk.t!=='p'?apOf(U,sk.id):0,cd=sk.t!=='p'?cdOf(U,sk.id):0;
  const meta=sk.t==='p'?chip('Effet permanent'):chip(ap?`${ap} PA`:'Gratuit',ap?'ap':'free')+chip(cd?`Recharge ${cd} tour${cd>1?'s':''}`:'Sans recharge')+(sk.el&&ELEM[sk.el]?`<span class="skm el" style="--ec:${ELEM[sk.el].c}">${ELEM[sk.el].n}</span>`:'')+chip(TG_N[sk.tg]||'');
  const lk=h?skLinksTo(sk,h):[],tg=(sk.links||[]).map(l=>l==='@u'?'vos ultimes':(SK[l]||{}).n).filter(Boolean);
  return `<article class="it skt" style="--rc:${sk.co}"><header><b>${esc(sk.n)}</b><small>${kind} · ${where} · niveau ${sk.lvl||1}</small><small class="skrk">Rang <b>${r}</b> / ${mx}${h&&h.loadout.includes(sk.id)?' · Dans la barre de sorts':''}</small></header>
   <div class="skmeta">${meta}</div><div class="skbody">${r?'':'<h5>Au rang 1</h5>'}<p>${txt(rk)}</p></div>
   ${r>0&&r<mx?`<div class="sknext"><h5>Rang ${r+1}</h5><p>${txt(r+1)}</p></div>`:''}
   ${tg.length?`<p class="sklk">⟶ Modifie : ${esc(tg.join(', '))}</p>`:''}${lk.length?`<p class="sklk">⟵ Modifié par : ${lk.map(p=>esc(p.n)+(h.learned[p.id]?` (${h.learned[p.id]}/${skMax(p)})`:'')).join(', ')}</p>`:''}
   ${req?`<p class="lockr">🔒 ${req}</p>`:''}</article>`;
}
function skTile7(sk,h,dim){
  const r=h.learned[sk.id]||0,mx=skMax(sk),req=skReq7(sk,h),can=!dim&&!req&&h.sp>0&&r<mx,eq=h.loadout.includes(sk.id);
  const drag=!dim&&sk.t!=='p'&&r>0;
  return `<div class="t7c" data-sk="${sk.id}"><button class="t7 ${sk.u?"u":sk.t} ${r?'got':''} ${req||dim?'lock':''} ${can?'avail':''} ${UI.skSel===sk.id?'sel':''}" style="--co:${sk.co}" data-act="skSel" data-id="${sk.id}" ${drag?`data-skdrag="${sk.id}"`:''} data-tip="sk:${sk.id}" aria-label="${esc(sk.n)}, rang ${r} sur ${mx}${req?', verrouillé':''}">${spIcon(sk)}${sk.t!=='u'||mx>1?`<em class="${r>=mx?'mx':''}">${r}/${mx}</em>`:''}${eq?'<i class="t7eq" aria-hidden="true">✓</i>':''}</button><span class="t7n">${esc(sk.n)}</span></div>`;
}
function treeHTML(h,sid){
  const c=CLASSES[h.cls],sp=c.specs[sid],chosen=h.spec===sid,other=h.spec&&!chosen,nodes=[...sp.nodes,...c.common];
  const hh=chosen?h:Object.assign({},h,{spec:sid,learned:other?Object.fromEntries(c.common.map(n=>[n.id,h.learned[n.id]||0])):h.learned,sp:0});
  const rows=TREE_LV.map(lv=>`<div class="t7lv ${h.lvl<lv?'lk':''}">${lv===30?'30 ★':lv}</div>`+[0,1,2,3].map(col=>{const n=nodes.find(x=>x.lvl===lv&&x.col===col);return `<div class="t7cell ${col===3?'t7cl':''}">${n?skTile7(n,hh,!chosen):''}</div>`}).join('')).join('');
  const resV=chosen&&sp.res==='heat'?'':'';
  return `<section class="t7tree bg-${sp.bg} ${chosen?'on':''} ${other?'dim':''}" style="--sc:${sp.co}" data-tree="${sid}">
   <header>${spIcon(sp)}<b>${sp.n}</b><small>${sp.br.slice(0,3).join(' · ')}</small>${chosen?'<span class="t7tag on">Votre spécialisation</span>':other?'<span class="t7tag">Non choisie</span>':`<button class="btn sm ${UI.specConf===sid?'danger':'pri'}" data-act="chooseSpec" data-s="${sid}" ${h.lvl<SPEC_L?'disabled':''}>${h.lvl<SPEC_L?`Niveau ${SPEC_L} requis`:UI.specConf===sid?'Confirmer : choix définitif':'Choisir'}</button>`}</header>
   <p class="t7res" data-tip="${esc('tx:'+RES_N[sp.res]+'|'+sp.rd)}"><b>${RES_N[sp.res]}</b><span>${esc(sp.rd.split(':').slice(1).join(':').trim().split('. ')[0])}.</span></p>
   <div class="t7grid"><div></div>${sp.br.map((b,i)=>`<div class="t7bh ${i===3?'t7cl':''}">${b}</div>`).join('')}${rows}</div><svg class="t7links" aria-hidden="true"></svg></section>`;
}
function hSkillsTab(h){
  const c=CLASSES[h.cls],sel=UI.skSel&&SK[UI.skSel];
  const base=c.skills.map(sk=>skTile7(sk,h,false)).join('');
  let det='';
  if(sel&&sel.id!=='atk'&&heroSkillsAll(h).includes(sel)){ const r=h.learned[sel.id]||0,req=skReq7(sel,h),eq=h.loadout.includes(sel.id),mine=!sel.spec||sel.spec==='*'||sel.spec===h.spec;
    det=`<div class="t7det">${skCard7(sel,h)}<div class="row" style="justify-content:center">${mine?`<button class="btn pri" data-act="learn" data-id="${sel.id}" ${req||h.sp<1||r>=skMax(sel)?'disabled':''}>${r>=skMax(sel)?'Rang maximum':r?'Améliorer (1 point)':'Apprendre (1 point)'}</button>`:''}${sel.t!=='p'&&r?`<button class="btn" data-act="equipSk" data-id="${sel.id}">${eq?'Retirer de la barre':'Équiper'}</button>`:''}<button class="btn" data-act="skSel" data-id="${sel.id}">Fermer</button></div></div>` }
  const fp=matAll('p_oubli');
  const bar=Array.from({length:LOADOUT_MAX},(_,i)=>{const id=h.loadout[i],q=id&&SK[id];
    return `<div class="sbslot ${q?'full':''}" data-sbi="${i}"><kbd class="t7k">${keyLab(KEYS()[i+1])}</kbd>${q?`<button class="skc" style="--co:${q.co}" data-act="skSel" data-id="${id}" data-skdrag="${id}" data-from="${i}" data-tip="sk:${id}" aria-label="Emplacement ${i+1} : ${esc(q.n)}">${spIcon(q)}${apOf({gx:hx(h)},id)?`<em class="apk">${apOf({gx:hx(h)},id)}</em>`:''}</button>`:''}</div>`}).join('');
  return `<div class="t7wrap">
   <div class="t7top"><span class="t7pts ${h.sp?'':'z'}" ${ttip('Points de compétence','1 point par niveau jusqu’au niveau '+SP_MAX+'.')}>${h.sp} point${h.sp>1?'s':''} à dépenser</span><span class="mute">Niveau ${h.lvl} · ${h.spec?'Les deux arbres restent visibles.':h.lvl<SPEC_L?`Spécialisation au niveau ${SPEC_L} : découvrez déjà les deux arbres.`:'Choisissez votre spécialisation (définitif, sauf Potion d’oubli).'}</span>
    <span class="t7forget">${h.freeR?`Potion d’oubli : <b class="num">${fp}</b>`:'<b class="t7free">1 réinitialisation gratuite</b>'} <button class="btn sm ${UI.forgetConf?'danger':''}" data-act="forget" ${fp||!h.freeR?'':'disabled'} ${ttip('Réinitialiser',h.freeR?'Rembourse tous les points et la spécialisation. Coûte 1 Potion d’oubli (en vente chez le Marchand).':'Rembourse tous les points et la spécialisation. La première réinitialisation est gratuite (une par personnage) ; les suivantes coûtent une Potion d’oubli.')}>${UI.forgetConf?'Confirmer':h.freeR?'Réinitialiser':'Réinitialiser (gratuit)'}</button></span></div>
   <div class="t7base"><b>Compétences de base</b>${base}<small class="mute">Niveaux 1 à 8</small></div>
   <div class="t7trees">${Object.keys(c.specs).map(sid=>treeHTML(h,sid)).join('')}</div>
   <div class="t7bar"><b>Barre de sorts</b><div class="spbar t7sb" id="spbar">${bar}</div><small class="mute">${h.loadout.length} / ${LOADOUT_MAX} · glissez un sort appris pour l’ajouter, hors de la barre pour le retirer</small></div>
   ${det?`<div class="t7detw">${det}</div>`:''}</div>`;
}
const heroSkillsAll=h=>[...CLASSES[h.cls].skills,...CLASSES[h.cls].common,...Object.values(CLASSES[h.cls].specs).flatMap(s=>s.nodes)];
function drawSkLinks(){
  document.querySelectorAll('.t7tree').forEach(tr=>{ const svg=tr.querySelector('.t7links'); if(!svg) return; const R=tr.getBoundingClientRect(); if(!R.width) return; const h=S.heroes[0]; let d='';
    tr.querySelectorAll('.t7c[data-sk]').forEach(el=>{ const sk=SK[el.dataset.sk]; if(!sk||!sk.links) return; const a=el.querySelector('.t7');
      for(const l of sk.links){ const ids=l==='@u'?[...tr.querySelectorAll('.t7.u')].map(x=>x.dataset.id):[l];
        for(const id of ids){ const bEl=tr.querySelector(`.t7c[data-sk="${id}"] .t7`); const on=h&&(h.learned[sk.id]||0)>0;
          if(!bEl){ /* sort de base : flèche vers le haut de l'arbre */ const A=a.getBoundingClientRect(),x=(A.left+A.width/2-R.left)/ZM,y=(A.top-R.top)/ZM; d+=`<path class="${on?'on':''}" d="M${x} ${y} L${x} ${y-14}"/><path class="${on?'on':''} hd" d="M${x-4} ${y-9} L${x} ${y-15} L${x+4} ${y-9}"/>`; continue }
          const A=a.getBoundingClientRect(),B=bEl.getBoundingClientRect(); const x1=(A.left+A.width/2-R.left)/ZM,y1=(A.top+A.height/2-R.top)/ZM,x2=(B.left+B.width/2-R.left)/ZM,y2=(B.top+B.height/2-R.top)/ZM;
          const dx=x2-x1,dy=y2-y1,L=Math.hypot(dx,dy)||1,o=Math.min(50,L*.2),cx=(x1+x2)/2-dy/L*o,cy=(y1+y2)/2+dx/L*o; d+=`<path class="${on?'on':''}" d="M${x1} ${y1} Q${cx} ${cy} ${x2} ${y2}"/>` } } });
    svg.setAttribute('viewBox',`0 0 ${R.width/ZM} ${R.height/ZM}`); svg.innerHTML=d });
}
/* états et ressources affichés sur les unités */
function unitSts(u){
  const L=[]; const g=u.gx||{};
  if(g.res==='heat') L.push({k:'heat',v:u.heat||0}); if(g.res==='rage') L.push({k:'rage',v:u.rage||0}); if(g.res==='garde'&&u.garde) L.push({k:'garde',v:u.garde});
  for(const s of u.st||[]){ if(s.k==='shd') continue; if(s.k==='dly'){ L.push({k:'dly',sk:s.sk,dur:s.n}); continue } L.push(s) }
  return L;
}
