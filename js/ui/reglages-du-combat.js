/* Cendrelame · ui/reglages-du-combat.js */
/* ================= 0.7.0 : réglages du combat, tri du butin, hôtel des ventes, popup de mise à jour ================= */
const V7I={
 gear:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3.2"/><path d="M12 2.5v2.6M12 18.9v2.6M4.6 4.6l1.9 1.9M17.5 17.5l1.9 1.9M2.5 12h2.6M18.9 12h2.6M4.6 19.4l1.9-1.9M17.5 6.5l1.9-1.9"/><circle cx="12" cy="12" r="6.6"/></svg>',
 tag:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M3 12V4h8l10 10-8 8z"/><circle cx="7.5" cy="8" r="1.6"/></svg>',
 clock:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
 search:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5L21 21"/></svg>',
 hammer:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 4l6 6-3 3-6-6zM11 7L3 15l3 3 8-8"/></svg>',
 recy:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 19H4l3-5M17 19h3l-3-5M9 5l3-2 3 5M8 14l-2-3M16 14l2-3M12 3l-2 4"/></svg>',
 star:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4 6.1 20.5l1.2-6.5L2.5 9.4l6.6-.9z"/></svg>',
};
const v7i=(k,c='')=>V7I[k].replace('<svg','<svg class="v7i '+c+'" aria-hidden="true"');
/* ---------- réglages du combat + tri du butin ---------- */
const lootF=()=>{ if(!S.lootF||!Array.isArray(S.lootF.keep)) S.lootF={keep:[1,1,1,1,1,1],cls:false,better:false}; while(S.lootF.keep.length<RAR.length) S.lootF.keep.push(1); return S.lootF };
const lootOn=()=>{ const f=lootF(); return f.keep.some(x=>!x)||f.cls||f.better };
function lootKeep(it){
  if(!it||it.mat) return true; const f=lootF(),h=S.heroes[0];
  if(!f.keep[it.rarity]) return false;
  if(f.cls&&it.cls&&h&&it.cls!==h.cls) return false;
  if(f.better&&h){ const d=swapDelta(h,it); if(d!=null&&d<=0) return false }
  return true;
}
function gearPop(){
  const f=lootF();
  const sw=(act,on,dis,ic,t,d)=>`<button class="v7tg" data-act="${act}" aria-pressed="${!!on}" ${dis?'disabled':''} ${ttip(t+' : '+(on?'activé':'désactivé'),d)}>${ic}<span class="v7tt"><b>${t}</b><small>${d}</small></span><i class="v7sw ${on?'on':''}"></i></button>`;
  return `<div class="v7gp" id="gearpop" role="dialog" aria-label="Réglages du combat">
   <h4>${v7i('gear')}<span>Réglages du combat</span></h4>
   ${sw('auto',S.auto,false,uic('auto'),'Combat automatique','Votre héros joue seul.')}
   ${sw('farm',S.farm,false,uic('chain'),'Rejouer','Relance le combat après une victoire (active le combat automatique).')}
   <div class="v7sep"></div>
   <h4>${v7i('recy')}<span>Tri du butin</span></h4>
   <p class="v7note">Raretés d’équipement gardées dans l’inventaire. Les autres sont recyclées automatiquement à la fin du combat (25 % des ressources rendues).</p>
   <div class="v7rar">${RAR.map((r,i)=>`<button class="v7r ${f.keep[i]?'on':''}" style="--rc:var(--r${i})" data-act="lootR" data-r="${i}" aria-pressed="${!!f.keep[i]}" ${ttip(r.n+(f.keep[i]?' : gardé':' : recyclé'),f.keep[i]?'Cliquez pour recycler automatiquement cette rareté.':'Cliquez pour garder cette rareté.')}><i></i><span>${r.n}</span></button>`).join('')}</div>
   <button class="v7opt ${f.cls?'on':''}" data-act="lootO" data-k="cls" aria-pressed="${f.cls}" ${ttip('Seulement ma classe','Recycle l’équipement réservé à une autre classe.')}><i></i><span>Garder seulement l’équipement de ma classe</span></button>
   <button class="v7opt ${f.better?'on':''}" data-act="lootO" data-k="better" aria-pressed="${f.better}" ${ttip('Seulement les améliorations','Recycle les objets qui ne feraient pas monter votre puissance.')}><i></i><span>Garder seulement les objets meilleurs que mon équipement</span></button>
   ${S.lastLoot&&S.lastLoot.length?`<div class="v7sep"></div><h4 class="sm"><span>Dernier butin</span></h4><div class="v7lt">${S.lastLoot.slice(0,12).map(x=>`<span class="v7li ${x.rc?'rc':''}" style="--rc:var(--r${x.r})" ${ttip(x.n,x.rc?'Recyclé automatiquement.':'Gardé dans l’inventaire.')}>${eqSvg(eqKey(x.s,null,false),EQ_RC[x.r]||EQ_RC[0],false)}</span>`).join('')}</div>`:''}
  </div>`;
}
function gearBtn(){ const on=UI.gearOpen,dot=lootOn()||S.auto;
  return `<button class="v7gear ${on?'on':''}" data-act="gearT" aria-expanded="${!!on}" ${ttip('Réglages du combat','Combat automatique, Rejouer et tri du butin.')}>${v7i('gear')}${dot?'<span class="v7gd"></span>':''}</button>`}
function gearSync(){ let p=$('#gearpop'); const b=$('.v7gear'); if(!UI.gearOpen||!b||UI.scr||UI.tab!=='combat'){ if(p) p.remove(); if(!b) UI.gearOpen=false; return }
  if(!p){ document.body.insertAdjacentHTML('beforeend',gearPop()); p=$('#gearpop') } else p.outerHTML=gearPop(), p=$('#gearpop');
  const r=b.getBoundingClientRect(),w=p.getBoundingClientRect(); p.style.left=Math.max(6,r.right-w.width)/ZM+'px'; p.style.top=Math.max(6,r.top-w.height-12)/ZM+'px' }
document.addEventListener('pointerdown',e=>{ if(UI.gearOpen&&!(e.target.closest&&e.target.closest('#gearpop,.v7gear'))){ UI.gearOpen=false; const p=$('#gearpop'); if(p) p.remove(); const b=$('.v7gear'); if(b){b.classList.remove('on');b.setAttribute('aria-expanded','false')} } },true);
document.addEventListener('keydown',e=>{ if(e.key==='Escape'&&UI.gearOpen){ UI.gearOpen=false; render() } });

