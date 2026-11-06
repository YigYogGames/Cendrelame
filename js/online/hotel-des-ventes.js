/* Cendrelame · online/hotel-des-ventes.js */
/* ---------- hôtel des ventes ---------- */
const ahNum=n=>Math.floor(+n||0).toLocaleString('fr-FR');
const AH_TAX=5,AH_DEP=1,AH_MAXL=10,AH_DUR=[2,12,24,72,168];
const ahCol=()=>FB.db.collection(COL('ah'));
const AH={tab:'buy',cat:'all',rar:[1,1,1,1,1,1,1],lv:[1,75],cls:{mage:1,guerrier:1,paladin:1},q:'',sort:'pa',list:null,mine:null,busy:false,err:'',ts:0,conf:null,sell:null,price:'',dur:24};
const AH_CAT=[['all','Tout'],['weapon','Armes'],['armor','Armures'],['jewel','Bijoux'],['pot','Potions',1],['gem','Gemmes',1]];
const ahCatOf=s=>s==='weapon'?'weapon':(s==='ring'||s==='amulet')?'jewel':'armor';
const ahDurN=h=>h<24?h+' h':h===24?'24 h':(h/24)+' jours';
function ahLeft(ms){ if(ms<=0) return 'terminé'; const m=Math.floor(ms/60000),h=Math.floor(m/60),d=Math.floor(h/24); return d?`${d} j ${h%24} h`:h?`${h} h ${String(m%60).padStart(2,'0')}`:`${Math.max(1,m)} min` }
const ahCoin='<span class="v7coin" aria-hidden="true"></span>';
const ahPrice=n=>`<span class="ahpr num">${ahCoin}${ahNum(n)}</span>`;
const ahTax=p=>Math.floor(p*AH_TAX/100),ahDep=p=>Math.max(10,Math.floor(p*AH_DEP/100));
const ahMailRef=id=>mlCol().doc(id);
function ahMail(id,to,title,body,att){ return [ahMailRef(id),{to,kind:'gift',title,body,att,from:'Hôtel des ventes',ts:firebase.firestore.FieldValue.serverTimestamp(),tsMs:Date.now(),exp:0,by:FB.user.uid,ah:1}] }
const ahItN=it=>`${it.name}${it.up?' +'+it.up:''} (${RAR[it.rarity].n.toLowerCase()}, niveau ${it.ilvl})`;
const ahDate=t=>{const d=new Date(t);return d.toLocaleDateString('fr-FR',{day:'2-digit',month:'2-digit'})+' à '+String(d.getHours()).padStart(2,'0')+' h '+String(d.getMinutes()).padStart(2,'0')};
async function ahLoad(force){
  if(!FB.user){ AH.err='Connectez-vous à un compte en ligne pour utiliser l’hôtel des ventes.'; AH.list=[]; return }
  if(AH.busy||(!force&&AH.list&&Date.now()-AH.ts<30000)) return;
  AH.busy=true; AH.err='';
  try{
    const qs=await ahCol().where('state','==','open').get();
    AH.list=qs.docs.map(d=>Object.assign({id:d.id},d.data())); AH.ts=Date.now();
    await ahSweep(AH.list.filter(x=>x.end<Date.now()));
    AH.list=AH.list.filter(x=>x.state==='open'&&x.end>=Date.now());
    await ahLoadMine();
  }catch(e){ AH.err='Hôtel des ventes indisponible ('+((e&&e.code)||'erreur')+'). Vérifiez les règles Firestore.'; AH.list=AH.list||[] }
  AH.busy=false; if(ahOn()) render();
}
async function ahLoadMine(){
  if(!FB.user) return; const me=FB.user.uid;
  const [a,b]=await Promise.all([ahCol().where('seller','==',me).get(),ahCol().where('buyer','==',me).get()]);
  AH.mine=[...a.docs,...b.docs].map(d=>Object.assign({id:d.id},d.data()));
  await ahSweep(AH.mine.filter(x=>x.state==='open'&&x.end<Date.now()));
}
/* ventes expirées : l'objet est renvoyé au vendeur (n'importe quel joueur peut déclencher le renvoi) */
async function ahSweep(L){
  for(const x of L){
    try{ await FB.db.runTransaction(async tx=>{ const ref=ahCol().doc(x.id),d=await tx.get(ref); if(!d.exists) return; const v=d.data(); if(v.state!=='open'||v.end>=Date.now()) return;
      tx.update(ref,{state:'expired',doneAt:Date.now()});
      const [mr,md]=ahMail('ah_'+x.id+'_x',v.seller,'Vente expirée : '+v.it.name,`Votre objet ${ahItN(v.it)} n’a pas trouvé d’acheteur.\n\nPrix demandé : ${ahNum(v.price)} or\nDurée de la vente : ${ahDurN(v.dur)}\nMis en vente le : ${ahDate(v.tsMs)}\nFrais de dépôt : ${ahNum(v.dep)} or (non rendus)\n\nL’objet vous est renvoyé avec ce message.`,{it:[v.it]});
      tx.set(mr,md) }); x.state='expired' }catch(e){}
  }
}
async function ahBuy(id){
  const x=(AH.list||[]).find(y=>y.id===id); if(!x||!FB.user) return;
  if(x.seller===FB.user.uid){ toast('C’est votre propre vente.'); return }
  if(!hasGold(x.price)){ toast('Pas assez d’or.'); return }
  if(AH.conf!=='b'+id){ AH.conf='b'+id; render(); return }
  AH.conf=null; AH.busy=true; render();
  try{
    await FB.db.runTransaction(async tx=>{ const ref=ahCol().doc(id),d=await tx.get(ref); if(!d.exists) throw {msg:'Cette vente n’existe plus.'}; const v=d.data();
      if(v.state!=='open') throw {msg:'Trop tard : cet objet vient d’être vendu ou retiré.'}; if(v.end<Date.now()) throw {msg:'Cette vente est terminée.'};
      const now=Date.now(),tax=ahTax(v.price),get=v.price-tax+v.dep;
      tx.update(ref,{state:'sold',buyer:FB.user.uid,bname:FB.prof&&FB.prof.name||'?',doneAt:now});
      const [m1,d1]=ahMail('ah_'+id+'_b',FB.user.uid,'Achat confirmé : '+v.it.name,`Récapitulatif de votre commande\n\nObjet : ${ahItN(v.it)}\nVendeur : ${v.sname}\nPrix payé : ${ahNum(v.price)} or\nDate : ${ahDate(now)}\n\nL’objet est joint à ce message.`,{it:[v.it]});
      const [m2,d2]=ahMail('ah_'+id+'_s',v.seller,'Objet vendu : '+v.it.name,`Votre objet ${ahItN(v.it)} a été acheté par ${FB.prof&&FB.prof.name||'un joueur'}.\n\nPrix de vente : ${ahNum(v.price)} or\nTaxe de l’hôtel (${AH_TAX} %) : −${ahNum(tax)} or\nFrais de dépôt rendus : +${ahNum(v.dep)} or\nTotal reçu : ${ahNum(get)} or\nDate : ${ahDate(now)}\n\nL’or est joint à ce message.`,{gold:get});
      tx.set(m1,d1); tx.set(m2,d2) });
    S.gold=Math.max(0,S.gold-x.price); save(); cloudSoon&&cloudSoon(); AH.list=AH.list.filter(y=>y.id!==id);
    toast(`${x.it.name} acheté pour ${ahNum(x.price)} or : il arrive dans votre messagerie.`);
    ahLoadMine().then(()=>render()).catch(()=>{});
  }catch(e){ toast(e&&e.msg||'Achat impossible ('+((e&&e.code)||'erreur')+').'); AH.list=null }
  AH.busy=false; render(); if(!AH.list) ahLoad(true);
}
async function ahSellGo(){
  const i=cellOf(+AH.sell); if(i<0){ AH.sell=null; render(); return } const it=S.bag[i].o,price=Math.floor(+String(AH.price).replace(/\D/g,''));
  if(!(price>=1&&price<=99999999)){ toast('Choisissez un prix entre 1 et 99 999 999 or.'); return }
  const dep=ahDep(price); if(!hasGold(dep)){ toast(`Il faut ${ahNum(dep)} or de frais de dépôt.`); return }
  const open=(AH.mine||[]).filter(x=>x.seller===FB.user.uid&&x.state==='open').length; if(open>=AH_MAXL){ toast(`Maximum ${AH_MAXL} objets en vente en même temps.`); return }
  const o=JSON.parse(JSON.stringify(it)),now=Date.now(),doc={seller:FB.user.uid,sname:FB.prof&&FB.prof.name||'?',it:o,name:o.name,slot:o.slot,cat:ahCatOf(o.slot),rarity:o.rarity,ilvl:o.ilvl,cls:o.cls||null,price,dur:AH.dur,dep,end:now+AH.dur*3600e3,state:'open',ts:firebase.firestore.FieldValue.serverTimestamp(),tsMs:now};
  AH.busy=true; S.bag.splice(i,1); S.gold-=dep; if(UI.bagSel===it) UI.bagSel=null; save(); render();
  try{ const r=await ahCol().add(doc); (AH.mine=AH.mine||[]).push(Object.assign({id:r.id},doc)); if(AH.list) AH.list.push(Object.assign({id:r.id},doc)); AH.sell=null; AH.price=''; toast(`${o.name} est en vente pour ${ahNum(price)} or (${ahDurN(AH.dur)}).`) }
  catch(e){ S.bag.push({x:0,y:0,o:it}); const sp=findSpot(S.bag.slice(0,-1),...SIZE(it)); if(sp){S.bag[S.bag.length-1].x=sp[0];S.bag[S.bag.length-1].y=sp[1]} else { S.bag.pop(); addInv(it) } S.gold+=dep; toast('Mise en vente impossible ('+((e&&e.code)||'erreur')+').') }
  AH.busy=false; save(); render();
}
async function ahCancel(id){
  const x=(AH.mine||[]).find(y=>y.id===id); if(!x) return;
  if(AH.conf!=='c'+id){ AH.conf='c'+id; render(); return } AH.conf=null;
  try{ await FB.db.runTransaction(async tx=>{ const ref=ahCol().doc(id),d=await tx.get(ref); const v=d.exists&&d.data(); if(!v||v.state!=='open') throw {msg:'Cette vente est déjà terminée.'};
      tx.update(ref,{state:'cancel',doneAt:Date.now()});
      const [mr,md]=ahMail('ah_'+id+'_c',v.seller,'Vente retirée : '+v.it.name,`Vous avez retiré ${ahItN(v.it)} de l’hôtel des ventes.\n\nPrix demandé : ${ahNum(v.price)} or\nFrais de dépôt : ${ahNum(v.dep)} or (non rendus)\n\nL’objet vous est renvoyé avec ce message.`,{it:[v.it]}); tx.set(mr,md) });
    x.state='cancel'; if(AH.list) AH.list=AH.list.filter(y=>y.id!==id); toast('Vente retirée : l’objet vous est renvoyé par la messagerie.') }
  catch(e){ toast(e&&e.msg||'Impossible ('+((e&&e.code)||'erreur')+').') }
  render();
}
function ahFiltered(){
  const q=AH.q.trim().toLowerCase();
  let L=(AH.list||[]).filter(x=>x.state==='open'&&x.end>Date.now()&&(AH.cat==='all'||x.cat===AH.cat)&&AH.rar[x.rarity]&&x.ilvl>=AH.lv[0]&&x.ilvl<=AH.lv[1]&&(!x.cls||AH.cls[x.cls])&&(!q||String(x.name).toLowerCase().includes(q)||String(x.sname).toLowerCase().includes(q)));
  const so={pa:(a,b)=>a.price-b.price,pd:(a,b)=>b.price-a.price,t:(a,b)=>a.end-b.end,l:(a,b)=>b.ilvl-a.ilvl||a.price-b.price,r:(a,b)=>b.rarity-a.rarity||a.price-b.price}[AH.sort]||((a,b)=>a.price-b.price);
  return L.sort(so);
}
const ahIco=(it,n)=>`<span class="ahico" style="--rc:var(--r${it.rarity})" data-tip="${n}">${bigIcon(it)}${it.up?`<em>+${it.up}</em>`:''}</span>`;
function ahHead(){ const n=(AH.mine||[]).filter(x=>FB.user&&x.seller===FB.user.uid&&x.state==='open').length;
  return `<div class="ahhd"><span class="ahgold num" ${ttip('Votre or')}>${uic('coin')}${ahNum(S.gold)}</span><button class="ahref" data-act="ahRefresh" ${AH.busy?'disabled':''} ${ttip('Actualiser','Recharge les ventes en cours.')}>${uic('auto')}</button><div class="ahtabs" role="tablist">${[['buy','Acheter'],['sell','Vendre'],['mine',`Mes ventes${n?` (${n})`:''}`],['hist','Historique']].map(([k,t])=>`<button role="tab" aria-selected="${AH.tab===k}" class="${AH.tab===k?'on':''}" data-act="ahTab" data-t="${k}">${t}</button>`).join('')}</div></div>`}
function ahBuyView(){
  const L=ahFiltered(),all=(AH.list||[]).filter(x=>x.state==='open'&&x.end>Date.now()),cnt=k=>k==='all'?all.length:all.filter(x=>x.cat===k).length,me=FB.user&&FB.user.uid;
  const side=`<aside class="ahside"><h4>Catégories</h4>${AH_CAT.map(([k,n,lk])=>lk?`<span class="ahcat lk" aria-disabled="true" ${ttip(n,'Bientôt disponible : pour l’instant, seul l’équipement peut être vendu.')}><span>${n}</span>${uic('lock')}</span>`:`<button class="ahcat ${AH.cat===k?'on':''}" data-act="ahCat" data-c="${k}" aria-pressed="${AH.cat===k}"><span>${n}</span><small class="num">${cnt(k)}</small></button>`).join('')}
   <h4>Rareté</h4><div class="ahrar2">${RAR.map((r,i)=>`<button class="ahchk ${AH.rar[i]?'':'off'}" style="--rc:var(--r${i})" data-act="ahRar" data-r="${i}" aria-pressed="${!!AH.rar[i]}"><i></i><span>${r.n}</span></button>`).join('')}</div>
   <h4>Niveau d’objet</h4><div class="ahlv"><input type="number" min="1" max="75" value="${AH.lv[0]}" data-ahlv="0" aria-label="Niveau minimum"><span>à</span><input type="number" min="1" max="75" value="${AH.lv[1]}" data-ahlv="1" aria-label="Niveau maximum"></div>
   <h4>Classe</h4><div class="ahrar2">${[['mage','Sorcier'],['guerrier','Guerrier'],['paladin','Paladin']].map(([k,n])=>`<button class="ahchk ${AH.cls[k]?'':'off'}" style="--rc:#7b2a1a" data-act="ahCls" data-c="${k}" aria-pressed="${!!AH.cls[k]}"><i></i><span>${n}</span></button>`).join('')}</div></aside>`;
  const rows=L.map(x=>{ const own=x.seller===me,cf=AH.conf==='b'+x.id,ok=hasGold(x.price),left=x.end-Date.now();
    return `<div class="ahtr ${cf?'sel':''}">${ahIco(x.it,'ah:'+x.id)}<span class="ahn"><b style="color:var(--r${x.it.rarity})">${esc(x.it.name)}${x.it.up?` <em>+${x.it.up}</em>`:''}</b><small>${SLOT_N[x.it.slot]}${x.it.cls?' · '+CLASSES[x.it.cls].n:''} · ${RAR[x.it.rarity].n}</small></span><span class="num c">${x.it.ilvl}</span><span class="ahs">${esc(x.sname)}</span><span class="ahtm ${left<3600e3?'low':''}">${v7i('clock')}<span>${ahLeft(left)}</span></span>${ahPrice(x.price)}<span class="c"><button class="ahbuy ${cf?'cf':''}" data-act="ahBuy" data-id="${x.id}" ${own||!ok||AH.busy?'disabled':''} ${own?ttip('Votre vente','Retirez-la depuis Mes ventes.'):!ok?ttip('Pas assez d’or'):cf?ttip('Confirmer l’achat',`${ahNum(x.price)} or · l’objet arrive par la messagerie.`):''}>${own?'Vous':cf?'Confirmer':'Acheter'}</button></span></div>` }).join('');
  return `<div class="ahA">${side}<div class="ahmain"><div class="ahbar"><label class="ahsrch">${v7i('search')}<input id="ahq" type="search" value="${esc(AH.q)}" placeholder="Rechercher un objet ou un vendeur…" aria-label="Rechercher"></label>
   <label class="ahsort"><span>Trier :</span><select id="ahsort" aria-label="Trier">${[['pa','Prix croissant'],['pd','Prix décroissant'],['t','Fin la plus proche'],['l','Niveau'],['r','Rareté']].map(([k,n])=>`<option value="${k}" ${AH.sort===k?'selected':''}>${n}</option>`).join('')}</select></label></div>
   <div class="ahtab"><div class="ahtr hd"><span></span><span>Objet</span><span class="c">Niveau</span><span>Vendeur</span><span>Temps restant</span><span>Prix</span><span></span></div>
   ${AH.list==null||AH.busy&&!AH.list.length?'<p class="ahempty">Chargement des ventes…</p>':AH.err?`<p class="ahempty">${esc(AH.err)}</p>`:rows||'<p class="ahempty">Aucun objet ne correspond à ces filtres.</p>'}</div></div></div>`;
}
function ahSellView(){
  const eq=S.bag.map((e,i)=>({e,i})).filter(x=>!x.e.o.mat);
  return `<div class="ahsellv"><p class="ahhint">Choisissez un équipement de votre sac à mettre en vente. Les potions et les gemmes arriveront dans une prochaine mise à jour.</p>
   <div class="ahpick">${eq.length?eq.map(({e,i})=>`<button class="ahpk" style="--rc:var(--r${e.o.rarity})" data-act="ahPick" data-id="${e.o.id}" data-tip="bag:${i}" aria-label="Vendre ${esc(e.o.name)}">${bigIcon(e.o)}${e.o.up?`<em>+${e.o.up}</em>`:''}</button>`).join(''):'<p class="ahempty">Aucun équipement dans votre sac.</p>'}</div>
   <div class="ahrules"><span>${v7i('tag')}<b>Taxe de ${AH_TAX} %</b> prise sur le prix à la vente.</span><span>${uic('coin')}<b>Frais de dépôt de ${AH_DEP} %</b> (minimum 10 or), rendus si l’objet est vendu.</span><span>${v7i('clock')}<b>Invendu ?</b> L’objet vous est renvoyé par la messagerie.</span></div></div>`;
}
function ahSellDlg(){
  const i=cellOf(+AH.sell); if(i<0) return ''; const it=S.bag[i].o,p=Math.floor(+String(AH.price).replace(/\D/g,''))||0,tax=ahTax(p),dep=ahDep(p);
  const sim=(AH.list||[]).filter(x=>x.it.slot===it.slot&&x.it.rarity===it.rarity&&Math.abs(x.it.ilvl-it.ilvl)<=5).map(x=>x.price).sort((a,b)=>a-b),med=sim.length?sim[Math.floor(sim.length/2)]:0;
  return `<div class="ahsellbg"><div class="ahsell" role="dialog" aria-modal="true" aria-label="Mettre en vente"><h3>${v7i('tag')}<span>Mettre en vente</span></h3>
   <div class="row1">${ahIco(it,'bag:'+i)}<div><b style="color:var(--r${it.rarity})">${esc(it.name)}${it.up?` +${it.up}`:''}</b><small>${SLOT_N[it.slot]}${it.cls?' · '+CLASSES[it.cls].n:''} · niveau ${it.ilvl} · ${RAR[it.rarity].n}</small><small>${med?`Prix habituel d’objets semblables : <b>≈ ${ahNum(med)} or</b>`:'Aucun objet semblable en vente actuellement.'}</small></div></div>
   <label for="ahprice">Prix de vente</label><div class="ahinp">${ahCoin}<input id="ahprice" inputmode="numeric" maxlength="10" value="${p?ahNum(p):''}" placeholder="0" autocomplete="off"><small>or</small></div>
   <label>Durée de la vente</label><div class="ahdur">${AH_DUR.map(h=>`<button class="${AH.dur===h?'on':''}" data-act="ahDur" data-h="${h}" aria-pressed="${AH.dur===h}">${ahDurN(h)}</button>`).join('')}</div>
   <div class="ahsum"><span>Prix de vente</span><b class="num">${ahNum(p)} or</b><span>Taxe de l’hôtel (${AH_TAX} %)</span><b class="num">− ${ahNum(tax)} or</b><span>Vous recevrez si vendu</span><b class="num ok">${ahNum(Math.max(0,p-tax))} or</b><span>Frais de dépôt (rendus si vendu)</span><b class="num">${ahNum(dep)} or</b></div>
   <p class="ahnote">Si l’objet n’est pas vendu au bout de ${ahDurN(AH.dur)}, il vous est renvoyé par la messagerie avec un récapitulatif.</p>
   <div class="acts"><button class="btn" data-act="ahSellX">Annuler</button><button class="btn pri" data-act="ahSellGo" ${p>=1&&hasGold(dep)&&!AH.busy?'':'disabled'}>${v7i('tag')}<span>Mettre en vente</span></button></div></div></div>`;
}
function ahMineView(hist){
  const me=FB.user&&FB.user.uid,L=(AH.mine||[]).filter(x=>hist?(x.state!=='open'||x.buyer===me):(x.seller===me&&x.state==='open')).sort((a,b)=>(b.doneAt||b.tsMs)-(a.doneAt||a.tsMs));
  const st=x=>x.buyer===me?['buy','Acheté à '+esc(x.sname)]:x.state==='sold'?['sold','Vendu à '+esc(x.bname||'?')]:x.state==='expired'?['exp','Expiré · renvoyé']:x.state==='cancel'?['exp','Retiré · renvoyé']:['open','En vente'];
  const rows=L.map(x=>{ const [k,t]=st(x),left=x.end-Date.now(),cf=AH.conf==='c'+x.id;
    return `<div class="ahtr m">${ahIco(x.it,'ahm:'+x.id)}<span class="ahn"><b style="color:var(--r${x.it.rarity})">${esc(x.it.name)}${x.it.up?` <em>+${x.it.up}</em>`:''}</b><small>${SLOT_N[x.it.slot]} · niveau ${x.it.ilvl} · ${RAR[x.it.rarity].n}</small></span><span class="ahst ${k}">${t}</span>${hist?`<span class="ahs">${ahDate(x.doneAt||x.tsMs)}</span>`:`<span class="ahtm ${left<3600e3?'low':''}">${v7i('clock')}<span>${ahLeft(left)}</span></span>`}${ahPrice(x.price)}<span class="c">${hist?'':`<button class="ahbuy alt ${cf?'cf':''}" data-act="ahCancel" data-id="${x.id}" ${ttip(cf?'Confirmer le retrait':'Retirer de la vente','L’objet vous est renvoyé par la messagerie. Les frais de dépôt ne sont pas rendus.')}>${cf?'Confirmer':'Retirer'}</button>`}</span></div>` }).join('');
  return `<div class="ahtab"><div class="ahtr m hd"><span></span><span>Objet</span><span>État</span><span>${hist?'Date':'Temps restant'}</span><span>Prix</span><span></span></div>${AH.mine==null?'<p class="ahempty">Chargement…</p>':rows||`<p class="ahempty">${hist?'Aucune vente ni aucun achat terminé.':'Vous n’avez aucun objet en vente.'}</p>`}</div>`;
}
function viewAH(){
  if(AH.list==null&&!AH.busy) setTimeout(()=>ahLoad(),0);
  const body=AH.tab==='sell'?ahSellView():AH.tab==='mine'?ahMineView(false):AH.tab==='hist'?ahMineView(true):ahBuyView();
  return `<div class="ahwrap">${ahHead()}${!FB.user?`<p class="ahempty">Connectez-vous à un compte en ligne pour utiliser l’hôtel des ventes.</p>`:body}</div>${AH.sell!=null?ahSellDlg():''}`;
}
function ahFocusKeep(id,fn){ const el=document.getElementById(id),pos=el&&el.selectionStart; fn(); const n=document.getElementById(id); if(n){ n.focus(); try{ n.setSelectionRange(pos,pos) }catch(e){} } }
document.addEventListener('input',e=>{ const t=e.target; if(!t) return;
  if(t.id==='ahq'){ AH.q=t.value; clearTimeout(AH.qt); AH.qt=setTimeout(()=>ahFocusKeep('ahq',render),180) }
  else if(t.dataset&&t.dataset.ahlv!=null){ const v=clamp(+t.value||1,1,75); AH.lv[+t.dataset.ahlv]=v; clearTimeout(AH.qt); AH.qt=setTimeout(()=>{ if(AH.lv[0]>AH.lv[1]) AH.lv.reverse(); render() },500) }
  else if(t.id==='ahprice'){ AH.price=t.value.replace(/\D/g,'').slice(0,8); render(); const n=$('#ahprice'); if(n){ n.focus(); const L=n.value.length; n.setSelectionRange(L,L) } }
});
document.addEventListener('mousedown',e=>{ if(e.target&&e.target.classList&&e.target.classList.contains('ahsellbg')){ AH.sell=null; render() } });
document.addEventListener('change',e=>{ if(e.target&&e.target.id==='ahsort'){ AH.sort=e.target.value; render() } });
document.addEventListener('keydown',e=>{ if(AH.sell!=null&&(UI.tab==='comm'||UI.tab==='shop')){ if(e.key==='Escape'){ AH.sell=null; render() } else if(e.key==='Enter'&&e.target.id==='ahprice'){ e.preventDefault(); ahSellGo() } } });
setInterval(()=>{ if(ahOn()&&!UI.scr&&AH.sell==null&&!document.activeElement.matches('input,select')) document.querySelectorAll('.ahtm span').length&&render() },30000);

