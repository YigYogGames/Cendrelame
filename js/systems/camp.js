/* Cendrelame · systems/camp.js (0.8.24)
   Camp de base : remplace le Compagnon. Des bâtiments produisent en continu (même hors ligne), on récolte et on les améliore.
   Mine (or, Pierres de renforcement, gemmes brutes) · Autel runique (Poudre runique, essences, runes mineures) · Jardin (parcelles de l’Alchimie) · Entrepôt (heures de production gardées). */
const CAMP_MAX=10;
const CAMP_B={
 mine:{n:'Mine',d:'Extrait de l’or, des Pierres de renforcement et parfois une gemme brute.',
  prod:l=>({gold:250*l,st_up:.12*l,gem:.04*l}),cost:l=>({gold:Math.round(3000*Math.pow(l,1.7))}),
  svg:`<path d="M4 44 L22 18 L32 30 L40 22 L60 44Z" fill="#4a4a52" stroke="#1a1a20" stroke-width="2"/><path d="M24 44 a8 8 0 0 1 16 0" fill="#140b05"/><path d="M14 12 L30 28" stroke="#8a6a44" stroke-width="4" stroke-linecap="round"/><path d="M8 14 C14 6 24 6 28 12" stroke="#c8c8d0" stroke-width="4" fill="none" stroke-linecap="round"/><circle cx="46" cy="34" r="3" fill="#ffd060"/><circle cx="12" cy="38" r="2.5" fill="#9ad0ff"/>`},
 autel:{n:'Autel runique',d:'Produit de la Poudre runique, des essences magiques et parfois une Rune mineure.',
  prod:l=>({pd_rune:1.5*l,ess:.4*l,ru_min:.03*l}),cost:l=>({gold:Math.round(3500*Math.pow(l,1.7))}),
  svg:`<path d="M14 44h36l-4-10H18z" fill="#5a4a6a" stroke="#1a1028" stroke-width="2"/><path d="M24 34V16l8-8 8 8v18z" fill="#3a2a5a" stroke="#1a1028" stroke-width="2"/><path d="M32 14v14M28 18l4-4 4 4" stroke="#c8a0ff" stroke-width="2" fill="none"/><circle cx="32" cy="22" r="10" fill="#9a70ff" opacity=".25"/>`},
 jardin:{n:'Jardin',d:'Les parcelles de l’Alchimie : plantez une plante, récoltez-en plusieurs.',garden:1,
  svg:`<path d="M4 44h56v-6H4z" fill="#6a4a2a"/><path d="M16 38V24M32 38V18M48 38V26" stroke="#3a7a2a" stroke-width="3"/><path d="M16 28c-6 0-8-5-7-9 5 0 8 4 7 9zM32 22c6 0 9-5 8-10-5 0-9 4-8 10zM48 30c-6 0-8-4-7-8 5 0 8 3 7 8z" fill="#5ac050" stroke="#1e5a24" stroke-width="1.5"/><circle cx="32" cy="12" r="3" fill="#ff7aa0"/>`},
 entrepot:{n:'Entrepôt',d:'Plus il est grand, plus le camp garde longtemps sa production quand vous ne récoltez pas.',
  cost:l=>({gold:Math.round(4000*Math.pow(l,1.8))}),
  svg:`<path d="M8 24 L32 10 L56 24 V44 H8Z" fill="#6a4a2a" stroke="#2a1a0c" stroke-width="2"/><rect x="22" y="28" width="20" height="16" fill="#3a2614" stroke="#2a1a0c" stroke-width="2"/><path d="M22 28l20 16M42 28L22 44" stroke="#8a6a44" stroke-width="2"/>`}};
/* zones du décor (centre x, centre y, largeur, hauteur en % de l’image) */
const CAMP_POS={mine:[22,19,30,32],autel:[83,19,28,30],jardin:[24,73,36,34],entrepot:[79,69,36,36]};
const campCapH=()=>4+2*camp().b.entrepot.lv;
function camp(){ if(!S.camp){ const t=Date.now(); S.camp={b:{mine:{lv:1,t},autel:{lv:1,t},entrepot:{lv:1}},sel:'mine'} } return S.camp }
const campHours=k=>{ const B=camp().b[k]; return B&&B.t?Math.min(campCapH(),(Date.now()-B.t)/3.6e6):0 };
const campStock=k=>{ const P=CAMP_B[k].prod; if(!P) return {}; const h=campHours(k),r=P(camp().b[k].lv),o={}; for(const [m,v] of Object.entries(r)) o[m]=v*h; return o };
const campFull=k=>CAMP_B[k].prod&&campHours(k)>=campCapH()-1e-6;
const campReady=()=>['mine','autel'].filter(k=>campHours(k)>=.25).length+(typeof garReady==='function'?garReady():0);
const rollN=x=>Math.floor(x)+(Math.random()<x-Math.floor(x)?1:0);
function campHarvest(k,quiet){ const B=camp().b[k],st=campStock(k),out={};
  for(const [m,v] of Object.entries(st)){ const n=rollN(v); if(n<=0) continue;
    if(m==='gem'){ for(let i=0;i<n;i++){ const g='jw_'+'rseta'[Math.floor(Math.random()*5)]+'1'; out[g]=(out[g]||0)+1 } }
    else if(m==='ess'){ for(let i=0;i<n;i++){ const e=pick(['es_pie','es_bra','es_ven']); out[e]=(out[e]||0)+1 } }
    else out[m]=(out[m]||0)+n }
  B.t=Date.now(); if(Object.keys(out).length) gain(out);
  if(!quiet) toast(Object.keys(out).length?`${CAMP_B[k].n} : `+Object.entries(out).map(([m,n])=>m==='gold'?fmt(n)+' or':n+' × '+(MAT_OBJ[m]||m)).join(', ')+'.':`${CAMP_B[k].n} : rien à récolter pour l’instant.`);
  return out }
const dec=v=>(v>=10?String(Math.round(v)):v>=1?String(Math.round(v*10)/10):String(Math.round(v*100)/100)).replace('.',',');
const prodTxt=(m,v)=>m==='gold'?fmt(Math.round(v))+' or':m==='gem'?dec(v)+' gemme brute':m==='ess'?dec(v)+' essence':dec(v)+' '+(MAT_N[m]||m).toLowerCase();
const prodIc=m=>m==='gem'?MI.jw_r1:m==='ess'?MI.es_bra:MI[m]||'';
function viewCamp(){
  const C0=camp(); if(!CAMP_B[C0.sel]) C0.sel='mine'; const sel=C0.sel,rdy=campReady();
  const lvTot=C0.b.mine.lv+C0.b.autel.lv+C0.b.entrepot.lv+(typeof gar==='function'?gar().u:3)-3;
  const cards=Object.entries(CAMP_B).map(([k,B])=>{ const lv=B.garden?gar().u:C0.b[k].lv,[x,y]=CAMP_POS[k];
    let info='',bar='',badge='';
    if(B.prod){ const h=campHours(k),pc=Math.round(h/campCapH()*100),r=B.prod(lv); info=Object.entries(r).slice(0,2).map(([m,v])=>prodTxt(m,v)+'/h').join(' · '); bar=`<span class="cbar"><i style="width:${pc}%"></i></span>`; if(h>=.25) badge=`<span class="crdy ${campFull(k)?'full':''}">${campFull(k)?'Plein':'Prêt'}</span>` }
    else if(B.garden){ const g=garReady(); info=`${gar().u} parcelle${gar().u>1?'s':''} · ${gar().p.filter(Boolean).length} en pousse`; if(g) badge=`<span class="crdy">${g} prête${g>1?'s':''}</span>` }
    else info=`Garde ${campCapH()} h de production`;
    const [w,hh]=[CAMP_POS[k][2],CAMP_POS[k][3]];
    return `<button class="chot ${k===sel?'on':''}" style="left:${x-w/2}%;top:${y-hh/2}%;width:${w}%;height:${hh}%" data-act="campSel" data-k="${k}" ${ttip(B.n+' · niveau '+lv,B.d+' '+info+'.')}><span class="ctag">${badge}<b>${B.n} <em>niv. ${lv}</em></b>${bar}</span></button>` }).join('');
  return `<div class="camp24"><section class="cmap"><div class="cstage"><img class="cimg" src="assets/img/ateliers/camp.jpg?v=${typeof VERSION!=='undefined'?VERSION:''}" alt="" draggable="false">${cards}
    <div class="chead"><h2>Camp de base</h2><span class="cchip">${uic('hour')} Production gardée : ${campCapH()} h</span>${rdy?`<button class="btn pri sm" data-act="campAll">Tout récolter (${rdy})</button>`:''}</div></div></section>
   <aside class="cside">${campSide(sel)}</aside></div>`;
}
function campSide(k){
  const C0=camp(),B=CAMP_B[k];
  if(B.garden){ const G=gar();
    const plots=G.p.map((P,i)=>{ if(i>=G.u) return `<button class="cplot lk" data-act="gUnlock" data-i="${i}" ${i===G.u?'':'disabled'} ${ttip('Parcelle '+(i+1),i===G.u?`Débloquer : ${fmt(GAR_COST[i])} or.`:'Débloquez d’abord la précédente.')}>${uic('lock')}<small>${i===G.u?fmt(GAR_COST[i])+' or':'—'}</small></button>`;
      if(!P) return `<button class="cplot em ${UI.gPlot===i?'sel':''}" data-act="gPick" data-i="${i}" ${ttip('Parcelle libre','Choisissez une plante ci-dessous.')}><b>＋</b><small>Planter</small></button>`;
      const l=plotLeft(P),N=PLANTS[P.k]; return l<=0?`<button class="cplot rdy" data-act="gHarv" data-i="${i}" ${ttip(N.n,'Prête : cliquez pour récolter.')}>${matIcon(P.k)}<small>Prête</small></button>`:`<div class="cplot gr" ${ttip(N.n,'Récolte dans '+tFmt(l/60000))}>${matIcon(P.k)}<small data-gt="${i}">${tFmt(l/60000)}</small></div>` }).join('');
    const own=Object.keys(PLANTS).filter(x=>matAll(x)>0);
    return `<h3>Jardin · ${G.u} parcelle${G.u>1?'s':''}</h3><p class="mute">${esc(B.d)} Les plantes servent à l’Alchimie.</p><div class="cplots">${plots}</div>
     <h4>Planter</h4><div class="gown">${own.length?own.map(x=>`<button class="zlt" style="--rc:var(--r${nwR(x)})" data-act="gPlant" data-k="${x}" data-tip="nw:${x}"><svg class="mfi" viewBox="0 0 24 24">${MI[x]}</svg><em class="num">${fmt(matAll(x))}</em></button>`).join(''):'<small class="mute">Aucune plante : gagnez des combats pour en trouver.</small>'}</div>
     <div class="cgo"><button class="btn pri" data-act="gAll" ${garReady()?'':'disabled'}>Tout récolter</button><button class="btn" data-act="campAlch">Ouvrir l’Alchimie</button></div>` }
  const lv=C0.b[k].lv,max=lv>=CAMP_MAX,cost=!max&&B.cost(lv);
  if(!B.prod) return `<h3>${B.n} · niveau ${lv}</h3><p class="mute">${esc(B.d)}</p><h4>Production gardée</h4><p><b>${campCapH()} h</b> au-delà, les bâtiments s’arrêtent jusqu’à la prochaine récolte.</p>
    ${max?'<p class="mute">Niveau maximum.</p>':`<h4>Niveau ${lv+1}</h4><p>${4+2*(lv+1)} h de production gardée.</p><div class="cgo"><div class="mfcost">Coût : ${costHTML(cost)}</div><button class="btn pri" data-act="campUp" data-k="${k}" ${canPay(cost)?'':'disabled'}>Améliorer</button></div>`}`;
  const r=B.prod(lv),st=campStock(k),h=campHours(k),nx=!max&&B.prod(lv+1);
  const row=(o,f)=>Object.entries(o).map(([m,v])=>`<span class="cchip2"><svg class="mfi" viewBox="0 0 24 24">${prodIc(m)}</svg>${f(m,v)}</span>`).join('');
  return `<h3>${B.n} · niveau ${lv}</h3><p class="mute">${esc(B.d)}</p>
   <h4>Production par heure</h4><div class="crow">${row(r,(m,v)=>prodTxt(m,v))}</div>
   <h4>En stock <small class="mute">· ${tFmt(h*60)} sur ${campCapH()} h</small></h4><div class="crow">${row(st,(m,v)=>m==='gold'?fmt(Math.floor(v)):(v<1?'~'+dec(v):'×'+Math.floor(v)))}</div><span class="cbar big"><i style="width:${Math.round(h/campCapH()*100)}%"></i></span>
   ${campFull(k)?'<small class="lockr">Stock plein : récoltez pour relancer la production.</small>':''}
   <div class="cgo"><button class="btn pri" data-act="campHarv" data-k="${k}" ${h>=1/60?'':'disabled'}>Récolter</button></div>
   ${max?'<p class="mute">Niveau maximum.</p>':`<h4>Niveau ${lv+1}</h4><div class="crow">${row(nx,(m,v)=>prodTxt(m,v)+'/h')}</div><div class="cgo"><div class="mfcost">Coût : ${costHTML(cost)}</div><button class="btn" data-act="campUp" data-k="${k}" ${canPay(cost)?'':'disabled'} ${ttip('Améliorer','La production en cours est récoltée avant l’amélioration.')}>Améliorer</button></div>`}`;
}
Object.assign(A,{
  campSel:d=>{ camp().sel=d.k; save(); render() },
  campHarv:d=>{ campHarvest(d.k); save(); renderHeader&&renderHeader(); render() },
  campAll:()=>{ const all={}; for(const k of ['mine','autel']) for(const [m,n] of Object.entries(campHarvest(k,true))) all[m]=(all[m]||0)+n;
    let g=0; if(typeof garReady==='function'&&garReady()) gar().p.forEach((P,i)=>{ g+=gHarvest(i,true)||0 });
    toast('Récolte du camp : '+(Object.entries(all).map(([m,n])=>m==='gold'?fmt(n)+' or':n+' × '+(MAT_OBJ[m]||m)).join(', ')||'rien')+(g?` · ${g} plantes`:'')+'.'); save(); renderHeader&&renderHeader(); render() },
  campUp:d=>{ const k=d.k,B=CAMP_B[k],b=camp().b[k]; if(!B.cost||b.lv>=CAMP_MAX) return; const c=B.cost(b.lv); if(!canPay(c)) return;
    if(B.prod) campHarvest(k,true); pay(c); b.lv++; if(B.prod) b.t=Date.now(); save(); renderHeader&&renderHeader(); render(); toast(`${B.n} : niveau ${b.lv} !`) },
  campAlch:()=>{ UI.tab='forge'; UI.ws='alch'; UI.aMode='jar'; render() } });
/* le Camp de base remplace le Compagnon */
viewComp=function(){ return viewCamp() };
for(const L of [DOCK,DOCK_L,MNAV]) for(const e of L) if(e[0]==='comp'){ e[1]='tent'; e[2]='Camp' }
TABS.forEach(e=>{ if(e[0]==='comp') e[1]='Camp de base' });
if(!UIC.tent) UIC.tent='<path d="M3 20 L12 4 L21 20Z M12 4 V20 M9 20 L12 14 L15 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>';
/* rafraîchissement : compte à rebours des parcelles et stocks */
setInterval(()=>{ if(!S||UI.scr||UI.tab!=='comp') return; const G=S.gar; let redraw=false;
  document.querySelectorAll('.cside [data-gt]').forEach(el=>{ const P=G&&G.p[+el.dataset.gt]; if(!P) return; const l=plotLeft(P); if(l<=0) redraw=true; else el.textContent=tFmt(l/60000) });
  if(redraw||(Date.now()%60000)<1000) render() },1000);
