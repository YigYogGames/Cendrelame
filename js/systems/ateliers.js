/* Cendrelame · systems/ateliers.js (0.8.23)
   Ouverture de l’Alchimie (potions à base de plantes + Jardin IDLE) et de la Runomancie (gemmes et châsses). */

/* ================= PLANTES ================= */
const PL_SVG={
 sprig:(c,d)=>`<path d="M12 21V9" stroke="${d}" stroke-width="1.6"/><path d="M12 13c-5 0-7-4-6-8 4 0 7 3 6 8zM12 11c4 0 6-3 5-7-3 0-6 2-5 7z" fill="${c}" stroke="${d}" stroke-width="1.1"/><path d="M12 17c-3 0-5-2-5-4 3 0 5 1 5 4z" fill="${c}" stroke="${d}" stroke-width="1"/>`,
 root:(c,d)=>`<path d="M12 3c3 0 4 3 3 6-1 4 2 7 0 10-1 2-4 2-5 0 1-2-1-3-1-6 0-2 1-3 1-5 0-3 0-5 2-5z" fill="${c}" stroke="${d}" stroke-width="1.1"/><path d="M10 14l-4 3M14 12l4 2M11 18l-2 3" stroke="${d}" stroke-width="1.1"/><path d="M12 3c-2-1-4 0-5 1 2 1 4 1 5-1z" fill="#6ac050" stroke="${d}" stroke-width=".8"/>`,
 moss:(c,d)=>`<path d="M3 18c0-4 3-6 6-5 1-3 5-4 7-1 3-1 6 1 5 6z" fill="${c}" stroke="${d}" stroke-width="1.1"/><circle cx="8" cy="15" r="1" fill="#e0f4ff"/><circle cx="14" cy="13.5" r="1.2" fill="#e0f4ff"/><circle cx="17" cy="16" r=".9" fill="#e0f4ff"/>`,
 flower:(c,d)=>`<path d="M12 21v-8" stroke="#3a7a2a" stroke-width="1.6"/><path d="M12 15c-3 0-5-1-5-3 3-1 5 0 5 3z" fill="#5aa040"/>${[0,72,144,216,288].map(a=>`<ellipse cx="12" cy="6.5" rx="2.4" ry="3.6" fill="${c}" stroke="${d}" stroke-width=".9" transform="rotate(${a} 12 9.5)"/>`).join('')}<circle cx="12" cy="9.5" r="2" fill="#ffe08a" stroke="${d}" stroke-width=".8"/>`,
 shroom:(c,d)=>`<path d="M9.5 12h5l1 8h-7z" fill="#e8dcc8" stroke="${d}" stroke-width="1"/><path d="M3 12c0-5 4-8 9-8s9 3 9 8z" fill="${c}" stroke="${d}" stroke-width="1.1"/><circle cx="8" cy="8.5" r="1.3" fill="#e0c0ff"/><circle cx="14" cy="7" r="1.6" fill="#e0c0ff"/><circle cx="17" cy="10" r="1" fill="#e0c0ff"/>`,
 lotus:(c,d)=>`<path d="M12 20c-5 0-9-3-9-6 3 0 6 1 9 4 3-3 6-4 9-4 0 3-4 6-9 6z" fill="#5aa080" stroke="${d}" stroke-width="1"/><path d="M12 18c-3-2-4-6-2-11 1 2 2 3 2 3s1-1 2-3c2 5 1 9-2 11z" fill="${c}" stroke="${d}" stroke-width="1"/><path d="M12 18c-4-1-7-4-7-8 2 1 4 3 5 5M12 18c4-1 7-4 7-8-2 1-4 3-5 5" fill="${c}" stroke="${d}" stroke-width="1"/>`};
const PLANTS={
 pl_herbe:{n:'Herbe de vie',z:0,g:30,y:4,r:0,s:'sprig',c:'#5ac050',d:'#1e5a24',x:'Pousse dans la Forêt des Murmures.'},
 pl_racine:{n:'Racine pâle',z:1,g:45,y:4,r:0,s:'root',c:'#e8d8b0',d:'#5a4a2a',x:'Pousse dans les Catacombes oubliées.'},
 pl_mousse:{n:'Mousse d’azur',z:2,g:60,y:3,r:1,s:'moss',c:'#4aa0d8',d:'#123a5a',x:'Pousse dans le Marais putride.'},
 pl_fleur:{n:'Fleur ardente',z:3,g:90,y:3,r:1,s:'flower',c:'#ff7a3a',d:'#7a2a0a',x:'Pousse sur le Pic de Cendre.'},
 pl_champ:{n:'Champignon du néant',z:4,g:120,y:3,r:2,s:'shroom',c:'#8a4ad0',d:'#2a0a4a',x:'Pousse dans les Abysses du Néant.'},
 pl_lotus:{n:'Lotus d’aube',z:-1,g:240,y:2,r:3,s:'lotus',c:'#ffd0f0',d:'#8a3a6a',x:'Plante rare : Défis, Failles temporelles et Jardin.'}};
const PL_Z=['pl_herbe','pl_racine','pl_mousse','pl_fleur','pl_champ'];
const tFmt=m=>m>=60?Math.floor(m/60)+' h'+(m%60?' '+String(Math.round(m%60)).padStart(2,'0'):''):Math.max(1,Math.round(m))+' min';
for(const [k,p] of Object.entries(PLANTS)) NEWI[k]={n:p.n,r:p.r,cat:'Plante',d:`Sert à l’Alchimie. ${p.x} Au Jardin : ${tFmt(p.g)} de pousse, ${p.y} plantes récoltées.`,svg:PL_SVG[p.s](p.c,p.d)};

/* ================= GEMMES ================= */
const GEM_T={
 r:{n:'Rubis',f:0,c:['#ff8a8a','#ffd0d0','#7a1010'],v:[6,14,26,44,70],u:'main'},
 s:{n:'Saphir',f:0,c:['#5a9aff','#d0e4ff','#102a6a'],v:[50,120,220,380,600],u:'hp'},
 e:{n:'Émeraude',f:1,c:['#4ad07a','#d0ffe0','#0a4a24'],v:[5,12,22,36,56],u:'dr'},
 t:{n:'Topaze',f:1,c:['#ffd040','#fff4c0','#6a4a00'],v:[1,2,3,4.5,6],u:'crit'},
 a:{n:'Améthyste',f:1,c:['#c070ff','#f0d8ff','#3a0a6a'],v:[2,4,6,9,12],u:'el'}};
const SZ_M=['brut','poli','taillé','parfait','royal'],SZ_F=['brute','polie','taillée','parfaite','royale'];
const gemK=(t,s)=>'jw_'+t+s,gemP=k=>{ const m=/^jw_([rseta])([1-5])$/.exec(k||''); return m?{t:m[1],s:+m[2]}:null };
const gemName=k=>{ const g=gemP(k); if(!g) return k; const T=GEM_T[g.t]; return T.n+' '+(T.f?SZ_F:SZ_M)[g.s-1] };
function gemFx(k,h){ const g=gemP(k); if(!g) return {}; const T=GEM_T[g.t],v=T.v[g.s-1];
  if(T.u==='main') return {[h&&CLASSES[h.cls]&&CLASSES[h.cls].role==='mag'?'mag':'atk']:v};
  if(T.u==='hp') return {hp:v}; if(T.u==='dr') return {def:v,res:v}; if(T.u==='crit') return {crit:v};
  return {rFeu:v,rGlace:v,rFoudre:v,rTerre:v} }
const gemTxt=(k,h)=>{ const g=gemP(k); if(!g) return ''; const T=GEM_T[g.t],v=T.v[g.s-1];
  const ms=h&&CLASSES[h.cls]?(CLASSES[h.cls].role==='mag'?'Intelligence':'Force'):'Force ou Intelligence';
  return T.u==='main'?`+${v} ${ms}`:T.u==='hp'?`+${v} PV`:T.u==='dr'?`+${v} Défense physique et magique`:T.u==='crit'?`+${String(v).replace('.',',')} % de critique`:`+${v} % de résistance au feu, à la glace, à la foudre et à la terre` };
const gemSvg=(t,s)=>{ const [c,h,d]=GEM_T[t].c,sc=.62+.095*s;
  return `<g transform="translate(12 12.5) scale(${sc}) translate(-12 -12.5)">${NWI.gem(c,h,d)}</g>${s>1?`<g fill="#fff6c0" stroke="#5a3a08" stroke-width=".5">${Array.from({length:s-1},(_,i)=>`<circle cx="${12-(s-2)*2.2+i*4.4}" cy="22.2" r="1.25"/>`).join('')}</g>`:''}` };
for(const t of Object.keys(GEM_T)) for(let s=1;s<=5;s++){ const k=gemK(t,s); NEWI[k]={n:gemName(k),r:s-1,cat:'Gemme',d:`À incruster dans une châsse (Runomancie) : ${gemTxt(k)}. 3 gemmes identiques donnent la taille au-dessus.`,svg:gemSvg(t,s)} }
for(const k of [...Object.keys(PLANTS),...Object.keys(NEWI).filter(x=>/^jw_/.test(x))]){ const o=NEWI[k]; MI[k]=o.svg; MAT_OBJ[k]=o.n; MAT_N[k]=o.n; MAT_D[k]=o.d }

/* ================= ALCHIMIE ================= */
const RECIPES={
 p_vie1:{pl:{pl_herbe:1},g:20},
 p_vie:{pl:{pl_herbe:2,pl_racine:1},g:60},
 p_vie3:{pl:{pl_herbe:3,pl_racine:2,pl_lotus:1},g:200},
 p_reg1:{pl:{pl_mousse:2,pl_herbe:1},g:80},
 p_reg2:{pl:{pl_mousse:3,pl_champ:1,pl_lotus:1},g:250},
 p_res:{pl:{pl_racine:2,pl_champ:1},g:120},
 p_for:{pl:{pl_fleur:2,pl_racine:1},g:120},
 p_int:{pl:{pl_mousse:2,pl_fleur:1},g:120},
 p_pa:{pl:{pl_champ:2,pl_fleur:1,pl_lotus:1},g:300}};
const recMax=k=>{ const R=RECIPES[k]; let m=Math.floor(S.gold/R.g); for(const [p,n] of Object.entries(R.pl)) m=Math.min(m,Math.floor(matAll(p)/n)); return Math.max(0,m) };
const plChip=(k,n)=>`<span class="plc" data-tip="nw:${k}"><svg class="mfi" viewBox="0 0 24 24">${MI[k]}</svg><b class="num">${n}</b></span>`;
const ALCH_HELP=`<h3>Préparer des potions</h3><ol class="mfsteps"><li><b>Choisissez une recette</b> à droite : les plantes se placent toutes seules dans le chaudron.</li><li><b>Réglez la quantité</b> (jusqu’au maximum que vos plantes et votre or permettent).</li><li>Cliquez sur <b>Préparer</b> : les potions arrivent dans l’inventaire.</li></ol>
 <h3>Trouver des plantes</h3><ul><li><b>En combat</b> : chaque zone a sa plante (Forêt → Herbe de vie, Catacombes → Racine pâle, Marais → Mousse d’azur, Pic → Fleur ardente, Abysses → Champignon du néant). Les boss en donnent plus.</li><li><b>Lotus d’aube</b> (rare) : Défis, Failles temporelles et Jardin.</li><li><b>Au Jardin</b> : plantez 1 plante, récoltez-en plusieurs après la pousse, même hors ligne.</li></ul>
 <p class="mute">La Potion d’oubli, l’Élixir de savoir et le Philtre de fortune restent vendus par le Marchand.</p>`;
const GAR_COST=[0,0,0,10000,40000,120000];
const gar=()=>{ S.gar=S.gar||{u:3,p:[]}; while(S.gar.p.length<6) S.gar.p.push(null); return S.gar };
const plotLeft=P=>P?Math.max(0,P.t+P.d*60000-Date.now()):0;
function viewAlch(){
  const am=UI.aMode==='jar'?'jar':'brew';
  const sub=`<div class="masub" role="tablist" aria-label="Alchimie">${[['brew','flask','Préparer'],['jar','leaf','Jardin']].map(([k,i,n])=>`<button role="tab" aria-selected="${am===k}" class="${am===k?'on':''}" data-act="aMode" data-m="${k}">${uic(i)}<span>${n}${k==='jar'&&garReady()?` <i class="ndot" aria-label="${garReady()} récolte(s) prête(s)"></i>`:''}</span></button>`).join('')}</div>`;
  return sub+(am==='jar'?viewGarden():viewBrew());
}
function viewBrew(){
  if(!RECIPES[UI.aSel]) UI.aSel='p_vie'; const k=UI.aSel,R=RECIPES[k],P=POTS[k],mx=recMax(k);
  UI.aQ=Math.max(1,Math.min(UI.aQ||1,Math.max(1,mx),99)); const q=UI.aQ,cost={gold:R.g*q};
  const slots=Object.entries(R.pl).map(([p,n])=>{ const have=matAll(p),ok=have>=n*q;
    return `<div class="mfs alsl ${ok?'full':''}" style="--rc:var(--r${nwR(p)})" data-tip="nw:${p}"><svg class="mfi" viewBox="0 0 24 24">${MI[p]}</svg><small>${esc(MAT_OBJ[p])}</small><em class="num ${ok?'':'no'}">${fmt(have)} / ${n*q}</em></div>` }).join('');
  const list=Object.keys(RECIPES).map(r=>{ const m=recMax(r);
    return `<button class="alrec ${r===k?'on':''} ${m?'':'dim'}" data-act="aSel" data-k="${r}" data-tip="pot:${r}"><span class="alri">${matIcon(r)}</span><span class="alrn"><b>${esc(POTS[r].n)}</b><small>${m?'Possible : ×'+m:'Plantes manquantes'}</small></span><span class="alrp">${Object.entries(RECIPES[r].pl).map(([p,n])=>plChip(p,n)).join('')}</span></button>` }).join('');
  const right=`<h4 class="mfh1">Recettes</h4><div class="alrecs">${list}</div>
   <div class="mfgo"><div class="alq"><span>Quantité</span><button class="btn sm" data-act="aQ" data-d="-1" ${q<=1?'disabled':''}>−</button><b class="num">${q}</b><button class="btn sm" data-act="aQ" data-d="1" ${q>=mx?'disabled':''}>+</button><button class="btn sm" data-act="aQ" data-d="max" ${mx>1?'':'disabled'}>Max</button></div>
   <div class="mfcost">Coût : ${costHTML(cost)}</div><button class="btn pri amgo" data-act="aBrew" ${mx>=q&&mx>0?'':'disabled'}>${uic('flask')} Préparer ×${q}</button></div>`;
  return `<div class="mfwork ${fHelpOn()?'':'nohelp'}">${fHelpOn()?`<aside class="mfl">${ALCH_HELP}</aside>`:''}
   <section class="mfc alch" id="mfc"><div class="mfhead">${helpBtn()}<span class="mfht"><b>Chaudron</b><small>${esc(P.n)}</small></span></div>
    <div class="alpot"><svg viewBox="0 0 300 250" aria-hidden="true"><ellipse cx="150" cy="78" rx="112" ry="26" fill="#2a1a0c" stroke="#c9a25a" stroke-width="5"/><ellipse class="alliq" cx="150" cy="78" rx="98" ry="18" fill="${P.c||'#3ad070'}"/><g class="albub" fill="#fff"><circle cx="118" cy="72" r="6" opacity=".55"/><circle cx="168" cy="66" r="4" opacity=".6"/><circle cx="190" cy="78" r="3" opacity=".5"/></g><path d="M38 78 Q38 232 150 238 Q262 232 262 78" fill="#1a1410" stroke="#c9a25a" stroke-width="5"/><path d="M72 238 L52 250 M228 238 L248 250" stroke="#c9a25a" stroke-width="7"/><g class="alfire"><path d="M110 250c0-14 14-14 10-28 14 8 18 18 14 28zM150 250c0-16 16-18 10-34 16 10 20 22 16 34zM190 250c0-12 12-12 8-24 12 8 15 16 12 24z" fill="#ff8a2a"/></g></svg><span class="alout" data-tip="pot:${k}">${matIcon(k)}</span></div>
    <div class="mfrow3 alrow">${slots}</div><small class="mfhint">Les plantes se trouvent en combat (une par zone) et au Jardin.</small></section>
   <aside class="mfr">${right}</aside></div>`;
}
function garReady(){ const G=S&&S.gar; if(!G) return 0; return G.p.filter(P=>P&&plotLeft(P)<=0).length }
function viewGarden(){
  const G=gar(),rdy=garReady();
  const plots=G.p.map((P,i)=>{
    if(i>=G.u){ const c=GAR_COST[i]; return `<button class="gplot lk" data-act="gUnlock" data-i="${i}" ${i===G.u?'':'disabled'} ${ttip('Parcelle '+(i+1),i===G.u?`Débloquer pour ${fmt(c)} or.`:'Débloquez d’abord la parcelle précédente.')}>${uic('lock')}<b>Parcelle ${i+1}</b><small>${i===G.u?fmt(c)+' or':'—'}</small></button>` }
    if(!P) return `<button class="gplot em ${UI.gPlot===i?'sel':''}" data-act="gPick" data-i="${i}" ${ttip('Parcelle libre','Choisissez une plante à droite pour la planter ici.')}><span class="gsoil"></span><b>＋ Planter</b><small>Parcelle ${i+1}</small></button>`;
    const left=plotLeft(P),pc=Math.min(100,Math.round((1-left/(P.d*60000))*100)),N=PLANTS[P.k];
    return left<=0?`<button class="gplot rdy" data-act="gHarv" data-i="${i}" ${ttip(N.n,'Prête : cliquez pour récolter.')}><span class="gico">${matIcon(P.k)}</span><b>${esc(N.n)}</b><small>Prête · ×${N.y}+</small></button>`
      :`<div class="gplot gr" ${ttip(N.n,`Récolte dans ${tFmt(left/60000)} : ${N.y} plantes (25 % de chance d’une de plus).`)}><span class="gico">${matIcon(P.k)}</span><b>${esc(N.n)}</b><small data-gt="${i}">${tFmt(left/60000)}</small><span class="gbar"><i style="width:${pc}%"></i></span></div>` }).join('');
  const own=Object.keys(PLANTS).filter(k=>matAll(k)>0);
  const right=`<h4 class="mfh1">Planter</h4><p class="mfsm">${UI.gPlot!=null&&!G.p[UI.gPlot]&&UI.gPlot<G.u?`Parcelle ${UI.gPlot+1} choisie. `:''}Cliquez une plante : elle va dans ${UI.gPlot!=null?'la parcelle choisie':'la première parcelle libre'}. Planter consomme 1 plante.</p>
   <div class="gown">${own.length?own.map(k=>`<button class="zlt" style="--rc:var(--r${nwR(k)})" data-act="gPlant" data-k="${k}" data-tip="nw:${k}"><svg class="mfi" viewBox="0 0 24 24">${MI[k]}</svg><em class="num">${fmt(matAll(k))}</em></button>`).join(''):'<small class="mute">Aucune plante : gagnez des combats pour en trouver.</small>'}</div>
   <h4>Temps de pousse</h4><table class="gtab">${Object.entries(PLANTS).map(([k,p])=>`<tr><td><span class="mfdot" style="background:var(--r${p.r})"></span>${esc(p.n)}</td><td>${tFmt(p.g)}</td><td>×${p.y}</td></tr>`).join('')}</table>
   <div class="mfgo"><button class="btn pri amgo" data-act="gAll" ${rdy?'':'disabled'}>${uic('leaf')} Tout récolter${rdy?' ('+rdy+')':''}</button></div>`;
  return `<div class="mfwork ${fHelpOn()?'':'nohelp'}">${fHelpOn()?`<aside class="mfl">${ALCH_HELP}</aside>`:''}
   <section class="mfc garden" id="mfc"><div class="mfhead">${helpBtn()}<span class="mfht"><b>Jardin</b><small>${G.u} parcelle${G.u>1?'s':''} · pousse même hors ligne</small></span></div><div class="gplots">${plots}</div><small class="mfhint">Une plante plantée en donne plusieurs à la récolte.</small></section>
   <aside class="mfr">${right}</aside></div>`;
}
function gHarvest(i,quiet){ const G=gar(),P=G.p[i]; if(!P||plotLeft(P)>0) return 0; const N=PLANTS[P.k],n=N.y+(Math.random()<.25?1:0); gain({[P.k]:n}); G.p[i]=null; if(!quiet) toast(`Récolte : ${n} × ${N.n}.`); return n }
Object.assign(A,{
  aMode:d=>{ UI.aMode=d.m; render() }, aSel:d=>{ UI.aSel=d.k; UI.aQ=1; render() },
  aQ:d=>{ const mx=recMax(UI.aSel); UI.aQ=d.d==='max'?Math.max(1,Math.min(99,mx)):Math.max(1,Math.min(99,mx||1,(UI.aQ||1)+(+d.d))); render() },
  aBrew:()=>{ const k=UI.aSel,R=RECIPES[k],q=UI.aQ||1; if(!R||recMax(k)<q) return; pay({gold:R.g*q}); for(const [p,n] of Object.entries(R.pl)) removeMat(p,n*q); gain({[k]:q}); S.brewN=(S.brewN||0)+q; save(); toast(`${q} × ${POTS[k].n} préparée${q>1?'s':''}.`); render(); const c=$('#mfc'); if(c){ c.classList.remove('fxbrew'); void c.offsetWidth; c.classList.add('fxbrew') } },
  gPick:d=>{ UI.gPlot=+d.i; render() },
  gPlant:d=>{ const G=gar(),k=d.k; if(!PLANTS[k]||matAll(k)<1) return; let i=UI.gPlot!=null&&UI.gPlot<G.u&&!G.p[UI.gPlot]?UI.gPlot:G.p.findIndex((P,j)=>!P&&j<G.u);
    if(i<0||i>=G.u){ toast('Aucune parcelle libre.'); return } removeMat(k,1); G.p[i]={k,t:Date.now(),d:PLANTS[k].g}; UI.gPlot=null; save(); render() },
  gHarv:d=>{ gHarvest(+d.i); save(); render() },
  gAll:()=>{ const G=gar(); let n=0,c=0; G.p.forEach((P,i)=>{ const x=gHarvest(i,true); if(x){ n+=x; c++ } }); if(c) toast(`${c} récolte${c>1?'s':''} : ${n} plantes.`); save(); render() },
  gUnlock:d=>{ const G=gar(),i=+d.i,c=GAR_COST[i]; if(i!==G.u||!c) return; if(S.gold<c){ toast('Pas assez d’or.'); return } S.gold-=c; G.u++; save(); renderHeader&&renderHeader(); render(); toast(`Parcelle ${i+1} débloquée.`) } });
/* compte à rebours du jardin */
setInterval(()=>{ if(!S||UI.scr||UI.tab!=='forge'||UI.ws!=='alch'||UI.aMode!=='jar') return; const G=S.gar; if(!G) return; let redraw=false;
  document.querySelectorAll('[data-gt]').forEach(el=>{ const P=G.p[+el.dataset.gt]; if(!P) return; const l=plotLeft(P); if(l<=0) redraw=true; else el.textContent=tFmt(l/60000) });
  if(redraw) render() },1000);

/* plantes en combat : une par zone */
{ const _rz=rollZoneLoot; rollZoneLoot=function(z,boss,L,lb){ const R=_rz.apply(this,arguments); const k=PL_Z[z];
  if(k&&Math.random()<(boss?1:.35)){ const n=boss?3:(Math.random()<.3?2:1); R.mats[k]=(R.mats[k]||0)+n }
  if(boss&&z===PL_Z.length-1&&Math.random()<.15) R.mats.pl_lotus=(R.mats.pl_lotus||0)+1;
  return R } }

/* ================= RUNOMANCIE ================= */
const SOCK_COST=[{gold:5000,pd_rune:2},{gold:25000,ru_anc:1}],UNSOCK=500,GEM_MAKE={gold:250,pd_rune:3};
const sockOf=it=>Array.isArray(it&&it.sock)?it.sock:[];
const sockable=it=>!!(it&&!it.mat&&it.slot);
{ const _gs=gearStats; gearStats=function(h){ const g=_gs(h); for(const it of Object.values((h&&h.equip)||{})) for(const k of sockOf(it)) if(k) for(const [s,v] of Object.entries(gemFx(k,h))) g[s]=(g[s]||0)+v; return g } }
{ const _ic=itemCard; itemCard=function(it,foot,delta){ const s=_ic(it,foot,delta); const L=sockOf(it); if(!it||!L.length) return s;
  const h=S.heroes&&S.heroes[0],b=`<div class="sockb">${L.map(k=>k?`<span class="skt on"><svg class="mfi" viewBox="0 0 24 24">${MI[k]}</svg>${esc(gemName(k))} : ${esc(gemTxt(k,h))}</span>`:'<span class="skt">◇ Châsse vide</span>').join('')}</div>`;
  const i=s.lastIndexOf('</article>'); return i<0?s+b:s.slice(0,i)+b+s.slice(i) } }
{ const _sv=salvageValue; salvageValue=function(it){ const v=_sv(it); for(const k of sockOf(it)) if(k) v[k]=(v[k]||0)+1; return v } }
const RUNE_HELP=`<h3>Runomancie</h3><ul><li><b>Incruster</b> : posez un équipement (clic droit depuis l’inventaire ou liste à droite). Percez jusqu’à 2 châsses, puis cliquez une gemme pour l’incruster. Retirer une gemme coûte ${UNSOCK} or : elle est rendue.</li><li><b>Créer</b> : fabrique une gemme brute du type choisi avec de la poudre runique et de l’or.</li><li><b>Tailler</b> : 3 gemmes identiques donnent 1 gemme de la taille au-dessus (brute → polie → taillée → parfaite → royale).</li></ul>
 <h3>Effets</h3><ul><li><b>Rubis</b> : Force ou Intelligence (selon la classe)</li><li><b>Saphir</b> : PV</li><li><b>Émeraude</b> : Défense physique et magique</li><li><b>Topaze</b> : chance de critique</li><li><b>Améthyste</b> : résistances élémentaires</li></ul><p class="mute">Recycler un objet rend ses gemmes. On trouve aussi des gemmes en Défis et en Failles temporelles.</p>`;
const ownGems=()=>[...new Set([...S.bag.filter(e=>e.o.mat&&gemP(e.o.mat)).map(e=>e.o.mat),...[...stKeys()].filter(k=>gemP(k))])].filter(k=>matAll(k)>0).sort((a,b)=>{const A=gemP(a),B=gemP(b);return 'rseta'.indexOf(A.t)-'rseta'.indexOf(B.t)||B.s-A.s});
const gemBtn=(k,act,extra='')=>`<button class="zlt" style="--rc:var(--r${nwR(k)})" data-act="${act}" data-k="${k}" data-tip="nw:${k}" ${extra}><svg class="mfi" viewBox="0 0 24 24">${MI[k]}</svg><em class="num">${fmt(matAll(k))}</em></button>`;
function viewRune(){
  const rm=['inc','make','cut'].includes(UI.rMode)?UI.rMode:'inc';
  const sub=`<div class="masub" role="tablist" aria-label="Runomancie">${[['inc','gem','Incruster'],['make','spark','Créer'],['cut','star','Tailler']].map(([k,i,n])=>`<button role="tab" aria-selected="${rm===k}" class="${rm===k?'on':''}" data-act="rMode" data-m="${k}">${uic(i)}<span>${n}</span></button>`).join('')}</div>`;
  return sub+(rm==='make'?runeMake():rm==='cut'?runeCut():runeInc());
}
function runeWrap(center,right,title,sm){ return `<div class="mfwork ${fHelpOn()?'':'nohelp'}">${fHelpOn()?`<aside class="mfl">${RUNE_HELP}</aside>`:''}
  <section class="mfc rune" id="mfc"><div class="mfhead">${helpBtn()}<span class="mfht"><b>${title}</b><small>${sm}</small></span></div>${center}</section><aside class="mfr">${right}</aside></div>` }
function runeInc(){
  const h=S.heroes[0],f=UI.rItem?findItem(UI.rItem):null,it=f&&f.it; if(!it) UI.rItem=null; const L=sockOf(it);
  const big=`<div class="mfs big rnit ${it?'full item':''}" ${it?`style="--rc:var(--r${it.rarity})" data-tip="f:${it.id}"`:''}>${it?bigIcon(it):'<small>Posez un équipement</small>'}</div>`;
  const socks=it?[0,1].map(i=>{ const k=L[i];
    if(i>=L.length) return `<div class="rsock lk" ${ttip('Châsse '+(i+1),i===L.length?'Percez cette châsse à droite.':'Percez d’abord la châsse précédente.')}><span>${uic('lock')}</span><small>Non percée</small></div>`;
    return k?`<button class="rsock on ${UI.rSock===i?'sel':''}" data-act="rSock" data-i="${i}" data-tip="nw:${k}"><svg class="mfi" viewBox="0 0 24 24">${MI[k]}</svg><small>${esc(gemName(k))}</small></button>`
      :`<div class="rsock em" ${ttip('Châsse '+(i+1)+' libre','Cliquez une gemme à droite pour l’incruster.')}><span>◇</span><small>Libre</small></div>` }).join(''):'';
  let right;
  if(!it){ const eq=SLOTS.map(s=>h.equip[s]).filter(Boolean),bag=invItems().filter(sockable).sort((a,b)=>b.rarity-a.rarity||b.ilvl-a.ilvl).slice(0,24);
    const li=x=>`<button class="rlist" data-act="rPut" data-id="${x.id}" data-tip="f:${x.id}" style="--rc:var(--r${x.rarity})"><span class="rli">${eqIco(x)}</span><span><b>${esc(x.name)}</b><small>${RAR[x.rarity].n} · niv. ${x.ilvl} · ${sockOf(x).length} / 2 châsse${sockOf(x).length>1?'s':''}</small></span></button>`;
    right=`<h3>Aucun équipement</h3><p class="mfsm">Choisissez un objet ci-dessous, ou faites un clic droit dessus dans l’inventaire.</p><h4>Objets portés</h4><div class="rlists">${eq.map(li).join('')||'<small class="mute">Aucun.</small>'}</div><h4>Inventaire</h4><div class="rlists">${bag.map(li).join('')||'<small class="mute">Aucun équipement dans le sac.</small>'}</div>` }
  else{ const n=L.length,c=SOCK_COST[n],gems=ownGems(),sel=UI.rSock!=null&&L[UI.rSock];
    right=`<h4 class="mfh1">Vos gemmes</h4>${gems.length?`<div class="mfown">${gems.map(k=>gemBtn(k,'rSet',L.includes(null)?'':'disabled')).join('')}</div>`:'<small class="mute">Aucune gemme : créez-en dans l’onglet Créer.</small>'}
     ${gems.length&&!L.includes(null)?`<p class="mfsm mute">${n<2?'Percez une châsse pour incruster une gemme.':'Toutes les châsses sont occupées.'}</p>`:''}
     ${sel?`<h4>Châsse ${UI.rSock+1}</h4><p class="mfsm">${esc(gemName(sel))} : ${esc(gemTxt(sel,h))}.</p><button class="btn" data-act="rUnsock" ${S.gold>=UNSOCK?'':'disabled'}>Retirer la gemme (${fmt(UNSOCK)} or)</button>`:''}
     <div class="mfgo">${c?`<div class="mfcost">Percer la châsse ${n+1} : ${costHTML(c)}</div><button class="btn pri amgo" data-act="rPierce" ${canPay(c)?'':'disabled'}>${uic('gem')} Percer une châsse</button>`:'<p class="mfsm">Cet objet a déjà ses 2 châsses.</p>'}<button class="btn sm" data-act="rClear">Changer d’objet</button></div>` }
  return runeWrap(`<div class="mfalt rnalt">${big}<div class="rsocks">${socks}</div></div><small class="mfhint">Clic droit sur un équipement de l’inventaire pour le poser ici.</small>`,right,'Table runique',it?esc(it.name):'Aucun objet posé');
}
function runeMake(){
  const t=GEM_T[UI.rT]?UI.rT:'r',k=gemK(t,1);
  const types=Object.entries(GEM_T).map(([x,T])=>`<button class="rtype ${x===t?'on':''}" data-act="rT" data-t="${x}" ${ttip(T.n,gemTxt(gemK(x,1),S.heroes[0])+' (brute)')}><svg class="mfi" viewBox="0 0 24 24">${gemSvg(x,1)}</svg><b>${T.n}</b><small class="num">×${fmt(matAll(gemK(x,1)))}</small></button>`).join('');
  const right=`<h4 class="mfh1">${esc(gemName(k))}</h4><p class="mfsm">${esc(gemTxt(k,S.heroes[0]))}. Taille brute : taillez-la ensuite pour la rendre plus puissante.</p>
   <h4>Puissance par taille</h4><table class="gtab">${[1,2,3,4,5].map(s=>`<tr><td><span class="mfdot" style="background:var(--r${s-1})"></span>${(GEM_T[t].f?SZ_F:SZ_M)[s-1]}</td><td>${esc(gemTxt(gemK(t,s),S.heroes[0]).replace(/ de critique| de résistance.*$/,''))}</td></tr>`).join('')}</table>
   <div class="mfgo"><div class="mfcost">Coût : ${costHTML(GEM_MAKE)}</div><button class="btn pri amgo" data-act="rMake" ${canPay(GEM_MAKE)?'':'disabled'}>${uic('spark')} Créer : ${esc(gemName(k))}</button></div>`;
  return runeWrap(`<div class="rtypes">${types}</div><small class="mfhint">La poudre runique se trouve en combat et dans les recyclages.</small>`,right,'Création de gemme','Choisissez le type');
}
function runeCut(){
  const L=ownGems().filter(k=>gemP(k).s<5); if(!L.includes(UI.rCut)) UI.rCut=L.find(k=>matAll(k)>=3)||L[0]||null; const k=UI.rCut,g=gemP(k);
  const out=g?gemK(g.t,g.s+1):null,cost=g?{gold:300*g.s}:{gold:0},ok=k&&matAll(k)>=3;
  const slot=x=>`<div class="mfs ${k?'full':''}" style="--rc:var(--r${k?nwR(k):0})">${k?`<svg class="mfi" viewBox="0 0 24 24">${MI[k]}</svg>`:'<small>Gemme</small>'}</div>`;
  const right=`<h4 class="mfh1">Gemmes à tailler</h4>${L.length?`<div class="mfown">${L.map(x=>gemBtn(x,'rCut')).join('')}</div>`:'<small class="mute">Aucune gemme à tailler.</small>'}
   ${out?`<h3 class="mfh2">Résultat</h3><div class="mfres" style="--rc:var(--r${nwR(out)})" data-tip="nw:${out}"><svg class="mfi" viewBox="0 0 24 24">${MI[out]}</svg><span><b>${esc(gemName(out))}</b><small>${esc(gemTxt(out,S.heroes[0]))}</small></span></div>`:''}
   <div class="mfgo">${k&&!ok?`<p class="lockr">Il faut 3 × ${esc(gemName(k))} (vous en avez ${matAll(k)}).</p>`:''}<div class="mfcost">Coût : ${costHTML(cost)}</div><button class="btn pri amgo" data-act="rDoCut" ${ok&&canPay(cost)?'':'disabled'}>${uic('star')} Tailler</button></div>`;
  return runeWrap(`<div class="mfalt"><div class="mfcore rcut">${out?`<div class="mfs big full" style="--rc:var(--r${nwR(out)})"><svg class="mfi" viewBox="0 0 24 24">${MI[out]}</svg></div>`:'<div class="mfs big"><small>Résultat</small></div>'}</div><div class="mflink"></div><div class="mfrow3">${slot()}${slot()}${slot()}</div></div><small class="mfhint">3 gemmes identiques → 1 gemme de la taille au-dessus.</small>`,right,'Taille des gemmes',k?esc(gemName(k))+' ×3':'Aucune gemme');
}
Object.assign(A,{
  rMode:d=>{ UI.rMode=d.m; UI.rSock=null; render() },
  rPut:d=>{ UI.rItem=+d.id; UI.rSock=null; render() }, rClear:()=>{ UI.rItem=null; UI.rSock=null; render() },
  rSock:d=>{ UI.rSock=UI.rSock===+d.i?null:+d.i; render() },
  rPierce:()=>{ const f=UI.rItem&&findItem(UI.rItem),it=f&&f.it; if(!it) return; const L=sockOf(it),c=SOCK_COST[L.length]; if(!c||!canPay(c)) return; pay(c); it.sock=[...L,null]; save(); toast(`Châsse ${it.sock.length} percée.`); render() },
  rSet:d=>{ const f=UI.rItem&&findItem(UI.rItem),it=f&&f.it; if(!it||matAll(d.k)<1) return; const L=sockOf(it),i=L.indexOf(null); if(i<0){ toast('Aucune châsse libre.'); return } removeMat(d.k,1); L[i]=d.k; it.sock=L; save(); toast(`${gemName(d.k)} incrusté${GEM_T[gemP(d.k).t].f?'e':''}.`); render(); const c=$('#mfc'); if(c){ c.classList.remove('fxench'); void c.offsetWidth; c.classList.add('fxench') } },
  rUnsock:()=>{ const f=UI.rItem&&findItem(UI.rItem),it=f&&f.it; if(!it||UI.rSock==null) return; const k=sockOf(it)[UI.rSock]; if(!k||S.gold<UNSOCK) return; S.gold-=UNSOCK; it.sock[UI.rSock]=null; gain({[k]:1}); UI.rSock=null; save(); toast(`${gemName(k)} retiré${GEM_T[gemP(k).t].f?'e':''} et rendu${GEM_T[gemP(k).t].f?'e':''}.`); render() },
  rT:d=>{ UI.rT=d.t; render() },
  rMake:()=>{ if(!canPay(GEM_MAKE)) return; const k=gemK(GEM_T[UI.rT]?UI.rT:'r',1); pay(GEM_MAKE); gain({[k]:1}); save(); toast(`${gemName(k)} créé${GEM_T[gemP(k).t].f?'e':''}.`); render() },
  rCut:d=>{ UI.rCut=d.k; render() },
  rDoCut:()=>{ const k=UI.rCut,g=gemP(k); if(!g||g.s>=5||matAll(k)<3) return; const c={gold:300*g.s}; if(!canPay(c)) return; pay(c); removeMat(k,3); const o=gemK(g.t,g.s+1); gain({[o]:1}); save(); toast(`Taille réussie : ${gemName(o)}.`); render() } });
/* clic droit depuis l’inventaire vers l’atelier ouvert */
{ const _fp=fPlace; fPlace=function(o,slot){ if(o&&UI.tab==='forge'){
    if(UI.ws==='rune'){ if(!o.mat&&o.slot){ UI.rMode='inc'; UI.rItem=o.id; UI.rSock=null; render(); return } if(o.mat&&gemP(o.mat)){ if(UI.rMode==='cut'){ UI.rCut=o.mat; render(); return } if(UI.rItem){ A.rSet({k:o.mat}); return } } }
    if(UI.ws==='alch'&&o.mat&&PLANTS[o.mat]){ if(UI.aMode==='jar'){ A.gPlant({k:o.mat}); return } toast('Les plantes se placent toutes seules : choisissez une recette.'); return } }
  return _fp.apply(this,arguments) } }
/* gemmes et lotus en Défis et en Failles */
const gemDrop=s=>gemK('rseta'[Math.floor(Math.random()*5)],s);
{ const _fin=raidSoloFinish; raidSoloFinish=function(res){ const ok=res==='win'&&!C.test; const r=_fin.apply(this,arguments);
  if(ok){ const add={}; if(Math.random()<.25) add.pl_lotus=1; if(Math.random()<.2) add[gemDrop(1)]=1; if(Object.keys(add).length){ gain(add); save(); setTimeout(()=>toast('Butin du défi : '+Object.entries(add).map(([k,n])=>n+' × '+MAT_OBJ[k]).join(', ')+'.'),1200) } }
  return r } }
if(typeof riftLoot==='function'){ const _rl=riftLoot; riftLoot=function(R,boss){ const L=_rl(R,boss),add={};
  if(boss){ add.pl_lotus=1+(Math.random()<.5?1:0); add[gemDrop(Math.min(3,1+Math.floor(R.r/4)))]=1 } else if(Math.random()<.15) add[gemDrop(1)]=1;
  if(Object.keys(add).length){ gain(add); for(const [k,v] of Object.entries(add)){ L.mats[k]=(L.mats[k]||0)+v; R.loot.mats[k]=(R.loot.mats[k]||0)+v } }
  return L } }
/* icônes manquantes */
if(!UIC.flask) UIC.flask='<path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-5-9V3" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M7.5 15h9" stroke="currentColor" stroke-width="2"/>';
if(!UIC.leaf) UIC.leaf='<path d="M5 19c0-9 6-14 15-14 0 9-5 15-14 15M5 19l8-8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>';
if(!UIC.gem) UIC.gem='<path d="M7 4h10l4 5-9 11L3 9z M3 9h18" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>';
if(!UIC.rune) UIC.rune='<path d="M12 3l7 4v10l-7 4-7-4V7z M12 8v8M9 10l3-2 3 2" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>';
