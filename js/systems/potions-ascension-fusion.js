/* Cendrelame · systems/potions-ascension-fusion.js */
/* ================= 0.7.9 : potions, cristal d'ascension, fusion, recettes ================= */
const POT_CK=cls=>['p_vie1','p_vie','p_vie3','p_reg1','p_reg2','p_res',CLASSES[cls]&&CLASSES[cls].role==='mag'?'p_int':'p_for','p_pa'];
const POT_HEAL={p_vie1:.2,p_vie:.4,p_vie3:.65};
const POT_REG={p_reg1:[.06,4],p_reg2:[.10,5]};
const SHOP_CH={};
/* ---------- cristal d'ascension ---------- */
const ASC_ILV=5;
const ascR=(b,p,il)=>(b+p*(il+ASC_ILV))/Math.max(.0001,b+p*il);
function ascApply(it){
  const il=it.ilvl; if(!it.req) it.req=Math.min(il,MAXL);
  for(const a of it.aff){ if(a.s==='ap') continue; const A=AFXM[a.s]; if(!A) continue; a.v=affRound(a.s,a.v*ascR(A.b,A.p,il)) }
  const B=BASES.find(b=>b.n===it.base);
  if(B&&it.imp) for(const [s,b,p] of B.imp) if(it.imp[s]!=null) it.imp[s]=affRound(s,it.imp[s]*ascR(b,p,il));
  it.ilvl=il+ASC_ILV; it.asc=1;
}
function ascDrop(t){ const ch=ascCh(t); if(Math.random()*100<ch){ qGive([['cr_asc',1]]); setTimeout(()=>toast('✦ Butin légendaire : Cristal d’ascension !'),700); return true } return false }
function fUpInfo9(it,k){
  if(k==='cr_asc'){ const ok=!it.asc;
    const prev=affOrd(it.aff).filter(a=>a.s!=='ap'&&AFXM[a.s]).map(a=>`<li>${fmtStat(a.s,a.v*upMul(it))} → <b class="ok">${fmtStat(a.s,affRound(a.s,a.v*ascR(AFXM[a.s].b,AFXM[a.s].p,it.ilvl))*upMul(it))}</b></li>`).join('');
    return {ok,why:ok?'':'Cet objet a déjà été élevé par un Cristal d’ascension (une seule fois par objet).',cost:{gold:Math.round(2000+it.ilvl*150)},chance:100,title:NEWI.cr_asc.n,rar:4,
      html:`<p>Niveau d’objet <b class="num">${it.ilvl} → ${it.ilvl+ASC_ILV}</b> : toutes les affixes et la statistique fixe de l’arme sont recalculées pour le nouveau niveau. Le niveau requis pour porter l’objet ne change pas.</p>${ok?`<h4>Aperçu</h4><ul class="mfprev">${prev}</ul>`:''}<p class="mute">Une seule fois par objet. Le Cristal d’ascension s’obtient uniquement en réussissant des défis de raid.</p>`} }
  if(k==='fu_ap'){ const ring=it.slot==='ring',has=(it.aff||[]).some(a=>a.fuse);
    return {ok:ring&&!has,why:!ring?'Ce parchemin ne s’utilise que sur un anneau.':has?'Cet anneau possède déjà une affixe de fusion.':'',cost:{gold:5000},chance:100,title:NEWI.fu_ap.n,rar:4,
      html:`<p>Ajoute l’affixe <b>+1 Point d’action</b> à l’anneau. Cette affixe de fusion ne prend pas d’emplacement d’affixe secondaire (les 3 emplacements restent libres pour les parchemins).</p><p class="mute">Une seule affixe de fusion par anneau. Se crée à l’Autel d’enchantement, onglet Fusion.</p>`} }
  return null;
}
/* ---------- fusion légendaire ---------- */
const FUSE9=[{out:'fu_ap',n:'Parchemin d’action',cost:{prisme:10,ru_pri:3,sc_blank:1,gold:20000}}];
function forgeFuse(){
  const F=FUSE9[0],O=NEWI[F.out],ok=canPay(F.cost),need=Object.entries(F.cost).filter(([k])=>k!=='gold');
  const slot=(k,n)=>{const h=matAll(k),g=h>=n;return `<div class="fu9s ${g?'ok':''}" style="--rc:var(--r${nwR(k)})" data-tip="nw:${k}"><svg class="mfi" viewBox="0 0 24 24">${MI[k]}</svg><em class="num">${fmt(Math.min(h,n))} / ${n}</em><small>${esc(MAT_OBJ[k]||k)}</small></div>`};
  const chk=(g,t)=>`<li class="${g?'ok':'no'}">${uic(g?'check':'xx')} ${t}</li>`;
  return `<div class="mfwork nohelp"><section class="mfc ench fu9" id="mfc"><div class="mfhead">${helpBtn()}<span class="mfht"><b>Fusion légendaire</b><small>Réunir des reliques pour créer un parchemin unique</small></span></div>
    <div class="fu9alt">${RCIRCLE}<div class="fu9out ${ok?'ok':''}" style="--rc:var(--r4)" data-tip="nw:${F.out}"><svg class="mfi" viewBox="0 0 24 24">${O.svg}</svg></div><div class="fu9ring">${need.map(([k,n])=>slot(k,n)).join('')}</div></div>
    <small class="mfhint">Les ressources sont prises dans l’inventaire et dans le coffre du compte.</small></section>
   <aside class="mfr"><h3>${esc(O.n)}</h3><small class="mfrar" style="color:var(--r4)">Légendaire</small><p>${esc(O.d)}</p>
    <h4>Recette</h4><ul class="mfcomb">${need.map(([k,n])=>chk(matAll(k)>=n,`${esc(MAT_OBJ[k]||k)} ×${n} <small class="num">(${fmt(matAll(k))})</small>`)).join('')}${chk(S.gold>=F.cost.gold,`${fmt(F.cost.gold)} or`)}</ul>
    <h4>Utilisation</h4><p class="mfsm">À la Forge : posez un anneau, puis le Parchemin d’action dans la case Amélioration. L’anneau gagne +1 Point d’action, sans utiliser d’emplacement d’affixe.</p>
    <div class="mfgo"><span class="mfok">Réussite <b class="num">100 %</b></span><div class="mfcost">Coût : ${costHTML(F.cost)}</div><button class="btn pri amgo" data-act="fuseDo" ${ok?'':'disabled'}>${uic('spark')} Fusionner</button></div></aside></div>`;
}
function fuseDo(){ const F=FUSE9[0]; if(!canPay(F.cost)) return; if(matRoom(F.out)<1){ toast('Inventaire plein.'); return }
  pay(F.cost); bagAddMat(S.bag,F.out,1); markNew(); save(); render(); requestAnimationFrame(()=>fFx('ench',true)); toast(`${NEWI[F.out].n} créé : il est dans l’inventaire.`) }
/* ---------- livre des recettes ---------- */
function recHTML(){
  const ic=k=>`<span class="rc9i" style="--rc:var(--r${nwR(k)})" data-tip="${k==='prisme'||NEWI[k]?'nw:'+k:'pot:'+k}"><svg class="mfi" viewBox="0 0 24 24">${MI[k]||''}</svg></span>`;
  const it=(k,n)=>`<span class="rc9c">${ic(k)}${n>1?`<em>×${n}</em>`:''}<small>${esc(MAT_OBJ[k]||k)}</small></span>`;
  const row=(ins,out,note)=>`<div class="rc9r"><div class="rc9in">${ins.join('<b class="rc9p">+</b>')}</div><b class="rc9a">→</b><div class="rc9out">${out}</div>${note?`<small class="rc9n">${note}</small>`:''}</div>`;
  const outT=(t,s)=>`<span class="rc9o"><b>${t}</b>${s?`<small>${s}</small>`:''}</span>`;
  const sc=Object.entries(SC_T).map(([t,T])=>row([it('sc_blank',1),it('pd_rune',3),it(T.es,1),`<span class="rc9c"><span class="rc9i any">${uic('star')}</span><small>Une rune</small></span>`],outT('Parchemin de '+T.n,'Rareté selon la rune : mineure Magique, majeure Rare, ancienne Épique, primordiale Légendaire'),`${T.d} Coût : 40 or + 60 or par rang de rune.`)).join('');
  const gems=Object.entries(GEMK).map(([k,g])=>k==='prisme'?row([it(k,10)],outT('Légendaire → Divin','1 à 10 prismes : 10 % de réussite par prisme'),'Tous les prismes placés sont consommés ; en cas d’échec, l’objet reste intact.'):row([it(k,1)],outT(`${RAR[g].n} → ${RAR[g+1].n}`,'+15 % des valeurs de base'),'')).join('');
  return `<div class="rc9"><header><h2>${uic('book')} Livre des recettes</h2><button class="mfx" data-act="recClose" ${ttip('Fermer')}>${uic('xx')}</button></header><div class="rc9b">
   <section><h3>${uic('spark')} Enchantement</h3><p class="mute">Un Parchemin vierge en haut de l’autel, puis 3 Poudres runiques, une Essence magique (le type) et une Rune (la rareté).</p>${sc}</section>
   <section><h3>${uic('star')} Fusion légendaire</h3>${row([it('prisme',10),it('ru_pri',3),it('sc_blank',1),`<span class="rc9c"><span class="rc9i">${matIcon('gold')}</span><em>20 000</em><small>Or</small></span>`],outT('Parchemin d’action','Légendaire'),'Ajoute +1 Point d’action à un anneau, sans prendre d’emplacement d’affixe. Une fois par anneau.')}</section>
   <section><h3>${uic('anvil')} Forge : renforcer</h3>
    ${row([it('st_up',1)],outT('Niveau +1','+3 % à toutes les statistiques, jusqu’à +10'),`Réussite : ${UP_CH.map((p,i)=>'+'+(i+1)+' '+p+' %').join(', ')}. 1 pierre jusqu’à +5, puis 2. En cas d’échec, les pierres sont perdues.`)}
    ${row([it('st_up',1),it('ch_pou',1)],outT('Réussite +10 %',''),'')}${row([it('st_up',1),it('ch_tre',1)],outT('Réussite +25 %',''),'')}
    ${gems}
    ${row([it('rm_aff',1)],outT('Affixe remodelée','Épique · réussite 100 %'),'Remplace une affixe choisie par une affixe de la même catégorie (Robustesse, Fureur, Adresse, Vie, Autres) avec une nouvelle valeur. Coût : 1 500 or + 30 or par niveau d’objet. Marchand, boss et défis.')}
    ${row([it('cr_asc',1)],outT('Niveau d’objet +5','Légendaire · une fois par objet'),'Recalcule toutes les affixes pour le nouveau niveau. Obtenu uniquement en réussissant des défis de raid.')}
    ${row([it('fu_ap',1)],outT('+1 Point d’action','Anneaux uniquement'),'')}</section>
   <section><h3>${uic('recycle')} Forge : recycler</h3><p class="mute">Recycler un objet rend des Poudres runiques, davantage pour les objets rares et de haut niveau. Le recyclage manuel transforme le curseur en enclume.</p></section>
  </div></div>`;
}
function recOpen(){ recClose(); const w=document.createElement('div'); w.id='rec9'; w.className='s8m'; w.setAttribute('role','dialog'); w.setAttribute('aria-modal','true'); w.setAttribute('aria-label','Livre des recettes'); w.innerHTML=recHTML(); w.addEventListener('click',e=>{ if(e.target===w) recClose() }); document.body.append(w) }
function recClose(){ const w=$('#rec9'); if(w) w.remove() }
document.addEventListener('keydown',e=>{ if(e.key==='Escape'&&$('#rec9')) recClose() });
