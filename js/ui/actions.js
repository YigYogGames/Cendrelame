/* Cendrelame · ui/actions.js */
/* ============ actions ============ */
const A={
  tab:d=>{UI.tab=d.t;UI.siteTree=null;UI.siteOpt=null;if(d.t==='heroes'||d.t==='bag'){S.bagDot=false;S.lvlDot=false;d.t='heroes';UI.tab='heroes'}if(d.t==='forge')UI.fMode='forge';UI.bagSel=null;UI.invSel=null;UI.recruit=false;UI.multi=false;UI.pick=new Set();if(UI.confirm!=='reset')UI.confirm=null;render()},
  pickClass:d=>{UI.cc=d.c;UI.cskin=null;const n=$('#cname');if(n)UI.cname=n.value;render()},
  pickSkin:d=>{UI.cskin=d.s;const n=$('#cname');if(n)UI.cname=n.value;render()},
  pickHue:d=>{UI.chue=+d.h;render()},
  createHero:()=>{
    const name=(UI.cname||'').trim()||'Héros';
    S=newGame(); S.gold=ACC.gold; S.seenVer=VERSION;
    S.heroes=[newHero(name,UI.cc,UI.chue,1)]; {const sk=skinOf(UI.cc,UI.cskin); if(sk) S.heroes[0].skin=sk.id} S.party=[S.heroes[0].id]; S.last=Date.now();
    {const P=prog();UI.zone=P.zone;UI.stage=P.stage}
    Object.assign(UI,{tab:'combat',scr:null,bagSel:null,invSel:null,fItem:null,fLast:null,confirm:null});
    UI.cname=''; save(); render(); toast('Bienvenue, '+name+'. Lancez votre premier combat.');
  },
  zone:d=>{const P=prog();UI.zone=+d.i;UI.stage=UI.zone===P.zone?P.stage:1;render()},
  diff:d=>{if(inFight())return;if(d.d==='myth'&&!mythOpen())return;if(d.d==='hero'&&!heroOpen()){toast(`Mode Héroïque : niveau ${HERO_L} requis.`);return}S.diff=d.d;const P=prog();UI.zone=P.zone;UI.stage=P.stage;C.phase='idle';save();render()},
  stage:d=>{UI.stage=+d.s;render()},
  fight:()=>startBattle(),
  togStats:()=>{S.showStats=S.showStats===false;save();render()},
  statSplit:()=>{S.statSplit=!S.statSplit;save();const y=scrollY;render();scrollTo(0,y)},
  nwTog:d=>{const O=UI.nwO=UI.nwO||{},k=d.k; O[k]=O[k]!=null?!O[k]:!(+d.d||0); const y=scrollY; render(); scrollTo(0,y)},
  drinkBuff:d=>drinkBuff(d.k),
  rkTab:d=>{ RK.tab=d.t; RK.sel=null; render() },
  rkSel:d=>{ RK.sel=RK.sel===d.k?null:d.k; const y=scrollY,ls=[...document.querySelectorAll('.rklist,.rkls')].map(e=>e.scrollTop); render(); scrollTo(0,y); document.querySelectorAll('.rklist,.rkls').forEach((e,i)=>e.scrollTop=ls[i]||0) },
  rkInsp:d=>{ const {p,b}=rkFind(d.k); if(!p) return; if(b==='duel') openInsp(p.deq||p.cur,p.deq?`${uic('swords')} Dernière victoire en duel · ${p.duel.w} V / ${p.duel.l} D`:''); else { const R2=RAIDS.find(x=>x.id===b),x=p.raid&&p.raid[b]; openInsp(x&&x.eq,`${uic('skull')} ${esc(R2?R2.n:'')} · palier +${x?x.t:0} · ${x?x.turns:0} tours`) } },
  rkCard:d=>rkCardFl(d.k),
  rkFrAdd:async d=>{ const {p}=rkFind(d.k); if(!p||rkFrState(p.uid)!=='no') return; try{ const on=await frSendReq(p.name); toast(`Demande d’ami envoyée à ${on}.`) }catch(e){ toast(e&&e.msg||'Impossible d’envoyer la demande.') } const w=$('#pcfl'); if(w&&w.dataset.rk===d.k) setTimeout(()=>rkCardFl(d.k),400) },
  inspClose:()=>{ const w=$('#inspm'); if(w) w.remove(); RK.insp=null; hideTip() },
  frInsp:d=>friendInsp(d.id),
  qClaim:d=>{ const Q=qState(); if(!Q) return; const q=(+d.w?Q.w.list:Q.d.list)[+d.i]; if(!q||q.got||q.p<q.n) return; qGive(q.rw); q.got=true; save(); render(); toast('Récompense récupérée : '+q.rw.map(([k,n])=>NEWI[k].n+' ×'+n).join(', ')+'.') },
  qChest:()=>{ const Q=qState(); if(!Q||Q.d.chest||!Q.d.list.every(q=>q.got)) { if(Q&&!Q.d.chest) toast('Récupérez d’abord les 5 quêtes du jour.'); return } const it=qChestRoll(); qGive(it); Q.d.chest=true; save(); qChestAnim(it) },
  qSkip:()=>qChestRecap(),
  qRecapOk:()=>{ const w=$('#qanim'); if(w) w.remove(); QA=null; hideTip(); render() },
  admSEnd:async()=>{ const v=($('#admsend')||{}).value; const ms=v?new Date(v).getTime():0; try{ await FB.db.collection(COL('config')).doc('reset').set({end:ms||null},{merge:true}); FB.season=Object.assign({},FB.season||{n:0},{end:ms||null}); toast(ms?'Fin de saison enregistrée.':'Date de fin retirée.'); render() }catch(e){ toast('Erreur : '+((e&&e.code)||'inconnue')) } },
  admRkFreeze:()=>rkFreeze(),
  cPause:()=>{ C.paused=!C.paused; const tt=$('#fttools'); if(tt) tt.innerHTML=ftTools(); pzMark() },
  heroTab:d=>{UI.heroTab=d.t;const y=scrollY;render();scrollTo(0,y)},
  invStats:()=>{UI.invStats=!UI.invStats;renderInvPop()},
  usePot:d=>usePot(d.k),
  cbPop:()=>{UI.cbOpen=!UI.cbOpen; if(PV.match&&['prep','fight'].includes(PV.match.state)) renderPvp(); else if(RD.match&&['prep','fight'].includes(RD.match.state)) renderRaid(); else renderActbar()},
  cbIn:d=>cbIn(d.k,+d.n||1),
  cbOut:d=>cbOut(d.k,1),
  cbToggle:()=>{UI.cbInv=!UI.cbInv;renderInvPop()},
  buyPot:d=>{const q=+d.q,P=POTS[d.k]; if(SHOP_CH[d.k]!=null){ if(!canPay(P.fix)) return; pay(P.fix); const c=ACC.schest=ACC.schest||[0,0,0,0]; c[SHOP_CH[d.k]]++; saveAcc(); save(); render(); toast('Achat : '+P.n+'. Ouvrez-le dans Quêtes → Saison.'); return } if(P.fix){ if(!canPay(P.fix)) return; if(matRoom(d.k)<1){toast('Inventaire plein.');return} pay(P.fix); bagAddMat(S.bag,d.k,1); markNew(); save(); render(); toast('Achat : '+P.n+'.'); return } const c=potPrice(d.k)*q; if(!hasGold(c)) return; if(POTS[d.k].cls&&POTS[d.k].cls!==S.heroes[0].cls){toast(`Réservée au ${CLASSES[POTS[d.k].cls].n}.`);return} if(matRoom(d.k)<q){toast('Inventaire plein.');return}
    if(!FREE()) S.gold-=c; bagAddMat(S.bag,d.k,q); markNew(); save(); render(); toast(`Achat : ${q} × ${POTS[d.k].n}.`)},
  auto:()=>{S.auto=!S.auto;if(!S.auto)S.farm=false;if(S.auto&&C.waiting){const w=C.waiting;C.waiting=null;C.pending=null;w.res(ai(w.u))}render()},
  farm:()=>{S.farm=!S.farm;if(S.farm&&!S.auto){S.auto=true;if(C.waiting){const w=C.waiting;C.waiting=null;C.pending=null;w.res(ai(w.u))}}render()},
  gearT:()=>{UI.gearOpen=!UI.gearOpen;render()},
  lootR:d=>{const f=lootF();f.keep[+d.r]=f.keep[+d.r]?0:1;save();render()},
  lootO:d=>{const f=lootF();f[d.k]=!f[d.k];save();render()},
  speed:()=>{S.speed=S.speed===1?2:S.speed===2?3:1;renderActbar()},
  giveUp:()=>{ if(!inFight()) return;
    if(UI.confirm!=='pveGiveUp'){UI.confirm='pveGiveUp'; renderActbar(); toast('Cliquez à nouveau pour abandonner : le combat sera compté comme une défaite.'); setTimeout(()=>{if(UI.confirm==='pveGiveUp'){UI.confirm=null; renderActbar()}},4000); return}
    UI.confirm=null; C.abort=true; C.id++; if(C.waiting){const w=C.waiting;C.waiting=null;w.res({})} C.pending=null; C.turn=null; S.farm=false;
    if(C.test){C.test=false; C.result={win:false,test:true}} else C.result={win:false,ab:true};
    C.phase='idle'; C.raid=null; save(); render(); toast('Combat abandonné.') },
  flee:()=>{C.abort=true;C.id++;if(C.waiting){const w=C.waiting;C.waiting=null;w.res({})}C.phase='idle';C.pending=null;S.farm=false;render()},
  back:()=>{C.phase='idle';render()},
  again:()=>{const r=C.raid;C.phase='idle';startBattle(false,r)},
  next:()=>{C.phase='idle';startBattle()},
  skill:d=>{
    const w=C.waiting; if(!w) return; const sk=SK[d.id]; if((d.id==='atk'?0:apOf(w.u,d.id))>(w.u.ap||0)||(w.u.cds[d.id]||0)||(d.id==='atk'&&w.u.atkUsed)) return;
    if(sk.tg==='one'){
      const en=alive(C.units.filter(u=>u.team==='e'));
      if(en.length>1){C.pending=sk;renderActbar();refreshAll();return}
      C.waiting=null;C.pending=null;w.res({skill:sk,target:en[0]});return;
    }
    C.waiting=null;C.pending=null;w.res({skill:sk,target:null});
  },
  pick:d=>{
    if(!C.pending||!C.waiting) return; const t=C.units.find(u=>u.id===d.u); if(!t||t.team!=='e'||t.hp<=0) return;
    const w=C.waiting,sk=C.pending;C.waiting=null;C.pending=null;w.res({skill:sk,target:t});
  },
  cancelPick:()=>{C.pending=null;renderActbar();refreshAll()},
  endTurn:()=>{const w=C.waiting; if(!w) return; C.waiting=null; C.pending=null; w.res({end:true})},
  learn:d=>{
    const h=S.heroes[0],sk=SK[d.id]; if(!sk||!heroSkills(h).includes(sk)||h.sp<1||(h.learned[d.id]||0)>=skMax(sk)||skReq7(sk,h)) return;
    h.sp--; h.learned[d.id]=(h.learned[d.id]||0)+1;
    if(sk.t==='a'&&!h.loadout.includes(d.id)){ if(h.loadout.length<LOADOUT_MAX) h.loadout.push(d.id); else toast(`Barre de sorts pleine (${LOADOUT_MAX}) : retirez une compétence pour équiper ${sk.n}.`) }
    const y=scrollY; save();render();scrollTo(0,y);
  },
  equipSk:d=>{
    const h=S.heroes[0],sk=SK[d.id]; if(!sk||!h.learned[d.id]||sk.t!=='a') return;
    if(h.loadout.includes(d.id)){ if(h.loadout.length>1)h.loadout=h.loadout.filter(x=>x!==d.id); else toast('Gardez au moins une compétence active.') }
    else if(h.loadout.length<LOADOUT_MAX) h.loadout.push(d.id); else toast(`Barre de sorts pleine (${LOADOUT_MAX} compétences).`);
    const y=scrollY; save();render();scrollTo(0,y);
  },
  skSel:d=>{ UI.skSel=UI.skSel===d.id?null:d.id; const y=scrollY; render(); scrollTo(0,y) },
  chooseSpec:d=>{ const h=S.heroes[0],sp=CLASSES[h.cls].specs[d.s]; if(!sp||h.spec||h.lvl<SPEC_L) return;
    if(UI.specConf!==d.s){ UI.specConf=d.s; const y=scrollY; render(); scrollTo(0,y); setTimeout(()=>{ if(UI.specConf===d.s){UI.specConf=null; if(UI.tab==='heroes'&&!UI.scr){const y2=scrollY;render();scrollTo(0,y2)}} },5000); return }
    UI.specConf=null; h.spec=d.s; UI.skSel=sp.nodes[0].id; if(!h.learned[sp.nodes[0].id]&&h.sp>0){ h.sp--; h.learned[sp.nodes[0].id]=1; if(h.loadout.length<LOADOUT_MAX) h.loadout.push(sp.nodes[0].id) } save(); const y=scrollY; render(); scrollTo(0,y); toast('✦ Spécialisation choisie : '+sp.n+' !') },
  forget:()=>{ const h=S.heroes[0]; if(matAll('p_oubli')<1&&h.freeR) return;
    if(!UI.forgetConf){ UI.forgetConf=true; const y=scrollY; render(); scrollTo(0,y); setTimeout(()=>{ if(UI.forgetConf){UI.forgetConf=false; if(UI.tab==='heroes'&&!UI.scr){const y2=scrollY;render();scrollTo(0,y2)}} },5000); return }
    UI.forgetConf=false; const fr=!h.freeR; if(!fr) removeMat('p_oubli',1); resetSkills(h); h.freeR=1; UI.skSel=null; save(); const y=scrollY; render(); scrollTo(0,y); toast('Compétences et spécialisation réinitialisées : '+h.sp+' points à redistribuer.'+(fr?' Réinitialisation gratuite utilisée.':'')) },
  ascend:()=>{
    const h=S.heroes[0],c=ascCost(h);
    if(h.stars>=5||h.lvl<MAXL||!canPay(c)) return; pay(c); h.stars++; save(); render(); toast(h.name+' atteint l’ascension '+h.stars+'.');
  },
  unequip:d=>{ if(eqLock()) return;
    const h=S.heroes[0],it=h.equip[d.slot]; if(!it) return;
    if(!bagAddItem(S.bag,it)){toast('Inventaire plein.');return} delete h.equip[d.slot]; save(); render();
  },
  bagCell:d=>{const i=+d.i;UI.confirm=null;
    const E=S.bag[i]; if(!E) return; const o=E.o;
    if(UI.multi){UI.pick.has(o)?UI.pick.delete(o):UI.pick.add(o);render();return}
    if(UI.tab==='forge'&&UI.invHL&&wantSlot(o)===UI.invHL){ UI.invHL=null; fPlace(o); return }
    UI.bagSel=UI.bagSel===o?null:o;UI.invSel=null;render();detScroll()},
  noConfirm:()=>{UI.confirm=null;render()},
  detClose:()=>{UI.bagSel=null;UI.invSel=null;UI.confirm=null;render()},
  matDel:d=>{
    const i=+d.i,c=S.bag[i]&&S.bag[i].o; if(!c||!c.mat) return;
    if(UI.confirm!=='mat'+i){UI.confirm='mat'+i;render();return}
    UI.confirm=null; S.bag.splice(i,1); UI.bagSel=null; save(); render(); toast(`${c.n} × ${MAT_OBJ[c.mat]} détruit${c.n>1?'s':''}.`);
  },
  multiToggle:()=>{UI.multi=!UI.multi;UI.pick=new Set();UI.confirm=null;UI.bagSel=null;render()},
  multiPick:d=>{UI.confirm=null;UI.pick=new Set();S.bag.forEach(e=>{const c=e.o;if(d.w==='items'&&!c.mat||d.w==='mats'&&c.mat)UI.pick.add(c)});render()},
  multiDel:()=>{
    if(!UI.pick.size) return;
    if(UI.confirm!=='multi'){UI.confirm='multi';render();return}
    const tot={};let n=0;
    for(const c of UI.pick){const i=entryOf(c); if(i<0) continue; if(!c.mat) for(const [k,v] of Object.entries(salvageValue(c)))tot[k]=(tot[k]||0)+v; if(UI.fItem===c.id)UI.fItem=null; S.bag.splice(i,1); n++}
    gain(tot); UI.pick=new Set(); UI.confirm=null; save(); render();
    toast(`${n} case${n>1?'s':''} détruite${n>1?'s':''}. Récupéré : ${resTxt(tot)}.`);
  },
  bagSort:d=>{
    if(UI.bagSort.k===d.k) UI.bagSort.dir*=-1; else UI.bagSort={k:d.k,dir:1};
    sortBag(); UI.bagSel=null; UI.srt=null; save(); render();
  },
  stSort:d=>{ if(UI.stSort.k===d.k) UI.stSort.dir*=-1; else UI.stSort={k:d.k,dir:1}; sortStash(); UI.stSel=null; UI.srt=null; renderInvPop() },
  srtMenu:d=>{ UI.srt=UI.srt===d.w?null:d.w; renderInvPop() },
  bagSplit:d=>{
    const i=+d.i,c=S.bag[i]&&S.bag[i].o,sp=findSpot(S.bag,1,1); if(!c||!c.mat||c.n<2||!sp) return;
    const half=Math.floor(c.n/2); c.n-=half; S.bag.push({x:sp[0],y:sp[1],o:{mat:c.mat,n:half}}); save(); render();
  },
  changeItem:d=>{UI.invSel=d.slot;UI.bagSel=null;UI.tab='heroes';render()},
  dollSlot:d=>{UI.invSel=d.slot;UI.bagSel=null;UI.confirm=null; if(!invAllowed()){ const y=scrollY; render(); scrollTo(0,y); return } UI.invOpen=true; const y=scrollY; render(); scrollTo(0,y)},
  invClose:()=>openInv(false),
  stToggle:()=>{ UI.stashOpen=!UI.stashOpen; UI.stBuy=false; UI.stRen=false; renderInvPop() },
  stClose:()=>{ UI.stashOpen=false; UI.stSel=null; renderInvPop() },
  stTab:d=>{ const D=stashD(); D.cur=+d.i; UI.stSel=null; UI.stRen=false; saveAcc(); renderStashPop() },
  stRen:()=>{ UI.stRen=true; renderStashPop() },
  stBuy:()=>{ const D=stashD(),n=D.tabs.length,c=STASH_COST[n]; if(n>=STASH_MAX||!hasGold(c)) return;
    if(!UI.stBuy){ UI.stBuy=true; renderStashPop(); setTimeout(()=>{ if(UI.stBuy){UI.stBuy=false; renderStashPop()} },4000); return }
    UI.stBuy=false; if(!FREE()) S.gold-=c; D.tabs.push({n:'Coffre '+(n+1),bag:[]}); D.cur=n; save(); renderHeader(); renderInvPop(); toast('Nouvel onglet de coffre acheté.') },
  stCell:d=>{ if(noClick) return; const T=stashTab(),E=T.bag[+d.i]; if(!E) return; UI.stSel=UI.stSel===E.o?null:E.o; renderStashPop() },
  stDet:()=>{ UI.stSel=null; renderStashPop() },
  stTake:d=>fromStash(+d.i),
  craftDep:()=>craftToStash(),
  craftTake:()=>craftFromStash(),
  invOpen:()=>openInv(true),
  equip:d=>{ if(eqLock()) return;
    const h=S.heroes[0],i=cellOf(+d.id); if(i<0) return;
    equipFromCell(i,targetSlot(h,S.bag[i].o));
  },
  salv:d=>{
    const i=cellOf(+d.id); if(i<0) return; const it=S.bag[i].o;
    if(UI.confirm!=='del'+it.id){UI.confirm='del'+it.id;render();return}
    UI.confirm=null; if(UI.fItem===it.id)UI.fItem=null; if(UI.bagSel===it)UI.bagSel=null;
    S.bag.splice(i,1); const v=salvageValue(it); gain(v); qEv('recycle'); save(); render();
    toast(`${it.name} détruit. Récupéré : ${resTxt(v)}.`);
  },
  toForge:d=>{UI.fItem=+d.id;UI.fMode='up';UI.tab='forge';render()},
  fMode:d=>{UI.fMode=d.m;UI.confirm=null;render()},
  eMode:d=>{UI.eMode=d.m;render()},
  fuseDo:()=>fuseDo(),
  recOpen:()=>recOpen(),
  recClose:()=>recClose(),
  fPut:d=>{UI.fItem=+d.id;UI.fMode='up';UI.bagSel=null;render()},
  fPutSlot:d=>{const it=S.heroes[0].equip[d.slot]; if(!it){toast('Emplacement vide.');return} UI.fItem=it.id;UI.fMode='up';render()},
  fClear:()=>{UI.fItem=null;render()},
  wipeAsk:()=>{const m=$('#wipemsg');if(m&&UI.wipe)UI.wipe.msg=m.value;UI.confirm='wipe';render()},
  wipeGo:()=>seasonGo(),
  seasonOk:()=>{const w=$('#season');if(w)w.remove()},
  ws:d=>{UI.ws=d.w;if(d.w==='forge'&&UI.fMode==='forge'&&UI.fItem)UI.fMode='up';render()},
  fHelp:()=>{ACC.fHelp=!fHelpOn();saveAcc();render()},
  optTab:d=>{UI.optTab=d.t;UI.keyWait=null;UI.confirm=null;render()},
  keySet:d=>{UI.keyWait=UI.keyWait===+d.i?null:+d.i;render()},
  keyDef:()=>{ACC.keys=KEY_DEF.slice();UI.keyWait=null;saveAcc();render();toast('Touches par défaut rétablies (1 à 8).')},
  fsPick:d=>{UI.invHL=d.s; if(!UI.invOpen) openInv(true); else render()},
  fsClear:d=>{const m={up:'fUp',bon:'fBon',cat:'eCat',p:'eP',e:'eE',r:'eR'}[d.s];if(m){UI[m]=null;if(d.s==='up')UI.fBon=null}render()},
  fSet:d=>fPlace({mat:d.k}),
  fPick:d=>{UI.fItem=+d.id;render()},
  fDo:()=>fDo(),
  eDo:()=>eDo(),
  forgeTierStep:d=>{UI.fTier=(UI.fTier+(+d.d)+TIERS.length)%TIERS.length;render()},
  forgeSlot:d=>{UI.fSlot=d.s;render()},
  forgeTier:d=>{UI.fTier=+d.i;render()},
  fPrism:()=>{UI.fPrism=!UI.fPrism;render()},
  forgeDo:()=>{
    const t=TIERS[UI.fTier],pr=prismOn(),cost=forgeCost();
    if(!canPay(cost)) return; pay(cost); ACC.cnt=ACC.cnt||{}; ACC.cnt.forge=(ACC.cnt.forge||0)+1; sEv('forge');
    const it=genItem(UI.fSlot,pr?PRISM.lv[0]:rollForgeLvl(),pr?5:wpick(t.odds)); if(!matAll('prisme')) UI.fPrism=false; it.cost={...cost}; const ok=addInv(it); UI.fLast=it; UI.fLast.where=ok?'inv':'lost';
    save(); render();
    toast(ok?`${it.name} ajouté à l’inventaire.`:'Inventaire plein : objet détruit automatiquement (25 % des ressources rendues).');
  },
  upItem:()=>{
    const r=findItem(UI.fItem); if(!r||r.it.up>=10) return; const c=upCost(r.it); if(!canPay(c)) return; pay(c); addCost(r.it,c); r.it.up++; save(); render();
  },
  rerollVals:()=>{
    const r=findItem(UI.fItem); if(!r) return; const c=rerollCost(r.it); if(!canPay(c)) return; pay(c); addCost(r.it,c);
    const m=RAR[r.it.rarity].m; for(const a of r.it.aff) a.v=rollAff(AFXM[a.s],r.it.ilvl,m); save(); render();
  },
  replAff:d=>{
    const r=findItem(UI.fItem); if(!r) return; const c=replCost(r.it); if(!canPay(c)) return; pay(c); addCost(r.it,c);
    const have=new Set(r.it.aff.map(a=>a.s)),pool=affPool(r.it.cls||S.heroes[0].cls).filter(a=>!have.has(a.s)),n=wPick(pool,1)[0]; if(!n) return;
    r.it.aff[+d.i]={s:n.s,v:rollAff(n,r.it.ilvl,RAR[r.it.rarity].m)}; save(); render();
  },
  anvil:()=>{ UI.anvil=!UI.anvil; UI.confirm=null; if(UI.anvil&&!UI.invOpen) openInv(true); render(); toast(UI.anvil?'Recyclage manuel : cliquez sur les objets du sac à recycler.':'Recyclage manuel arrêté.') },
  salvBelow:d=>{
    if(UI.confirm!=='salv'+d.r){UI.confirm='salv'+d.r;render();return}
    UI.confirm=null; const rr=+d.r,tot={}; let n=0;
    S.bag=S.bag.filter(e=>{const it=e.o; if(!it.mat&&it.rarity<=rr){const v=salvageValue(it);for(const [k,x] of Object.entries(v))tot[k]=(tot[k]||0)+x;n++;return false} return true });
    gain(tot); if(n) qEv('recycle',n); if(UI.bagSel&&entryOf(UI.bagSel)<0)UI.bagSel=null; if(UI.fItem&&!findItem(UI.fItem))UI.fItem=null; save(); render();
    toast(n?`${n} objets détruits. Récupéré : ${resTxt(tot)}.`:'Rien à détruire.');
  },
  siteBuy:d=>{const si=SITES.find(s=>s.id===d.id);if(!hasGold(si.unlock))return;if(!FREE())S.gold-=si.unlock;S.sites[d.id].lvl=1;S.sites[d.id].last=Date.now();save();render()},
  siteTree:d=>{UI.siteTree=d.id;render();const b=$('#tree .x');if(b)b.focus()},
  treeClose:()=>{UI.siteTree=null;render()},
  talBuy:d=>{const st=S.sites[d.id],t=tal(st),k=d.k,isX=/X$/.test(k);
    if(k==='auto'){ if(t.auto||zoneLvl(st)<AUTO_L) return; const c=autoCost(d.id); if(!hasGold(c)) return; if(!FREE()) S.gold-=c; t.auto=1; st.auto=true; save(); render(); toast('Récolte automatique débloquée : activez-la avec l’engrenage de la zone.'); return }
    const BR=branchesFor(d.id);
    if(isX){const b=BR.find(x=>x.cap.k===k); if(!b||t[k]||(t[b.k]||0)<b.max) return}
    else{const b=BR.find(x=>x.k===k); if(!b||(t[k]||0)>=b.max) return}
    const c=talCost(d.id,k,t[k]||0); if(!hasGold(c)) return; if(!FREE()) S.gold-=c; t[k]=isX?1:(t[k]||0)+1; save(); render()},
  siteAll:()=>{ const tot={}; let ni=0,n=0;
    for(const si of SITES){const st=S.sites[si.id]; if(st.lvl<1||!(st.ready||0)) continue; const r=collectSite(si.id,true); n++; ni+=r.items.length; for(const [k,v] of Object.entries(r.got)) tot[k]=(tot[k]||0)+v}
    const t=Object.entries(tot).map(([k,v])=>`${fmt(v)} ${MAT_N[k].toLowerCase()}`); if(ni) t.push(`${ni} objet${ni>1?'s':''}`);
    save(); render(); toast(n?'Récolté : '+(t.join(', ')||'rien (stock plein)'):'Rien à collecter pour l’instant.') },
  shopSel:d=>{UI.shopSel=d.k;render()},
  shopCat:d=>{UI.shopCat=d.c;const ks=Object.keys(POTS).filter(k=>d.c==='all'||SHOP_CAT(k)===d.c);if(ks.length&&!ks.includes(UI.shopSel))UI.shopSel=ks[0];render()},
  shopQ:d=>{UI.shopQ=d.q==='max'?shopMax(UI.shopSel):+d.q;render()},
  shopQd:d=>{UI.shopQ=Math.max(1,Math.min(99,(UI.shopQ||1)+(+d.d)));render()},
  siteCollect:d=>{
    const r=collectSite(d.id); const t=Object.entries(r.got).map(([k,v])=>`${v} ${MAT_N[k].toLowerCase()}`);
    if(r.items.length)t.push(`${r.items.length} objet${r.items.length>1?'s':''}`);
    save();render();toast(t.length?'Récolté : '+t.join(', '):'Rien à collecter pour l’instant.');
  },
  siteOpt:d=>{UI.siteOpt=UI.siteOpt===d.id?null:d.id;UI.siteTree=null;render()},
  optClose:()=>{UI.siteOpt=null;render()},
  siteTreeFromOpt:d=>{UI.siteOpt=null;UI.siteTree=d.id;render()},
  siteAutoT:d=>{const st=S.sites[d.id]; if(!tal(st).auto) return; st.auto=!autoOn(st); save(); if(st.auto) autoCollect(); render()},
  copyExp:()=>{
    const t=$('#expTxt'); t.select();
    try{navigator.clipboard.writeText(t.value).then(()=>toast('Code copié.'),()=>toast('Sélectionnez le code et copiez-le.'))}catch(e){toast('Sélectionnez le code et copiez-le.')}
  },
  import:()=>{
    const raw=($('#impTxt').value||'').trim(); if(!raw) return;
    try{
      let d; try{d=JSON.parse(decodeURIComponent(escape(atob(raw))))}catch(e){d=JSON.parse(raw)}
      if(d&&d.acc&&Array.isArray(d.chars)){
        for(let i=0;i<MAXCH;i++){const c=d.chars[i]; if(c&&Array.isArray(c.heroes)&&c.heroes.length) lsSet(CHAR_KEY(i),JSON.stringify(c)); else lsDel(CHAR_KEY(i))}
        ACC={gold:d.gold||0,cur:null,seenVer:d.seenVer||null}; S=null; saveAcc(); UI.scr='select'; render(); toast('Sauvegarde importée.'); return;
      }
      if(!d||!Array.isArray(d.heroes)||!d.heroes.length) throw 0;
      let i=0; while(i<MAXCH&&charRaw(i)) i++;
      if(i>=MAXCH){toast('Aucun emplacement libre : supprimez d’abord un personnage.');return}
      lsSet(CHAR_KEY(i),JSON.stringify(d)); saveAcc(); UI.scr='select'; render(); toast('Personnage importé dans l’emplacement '+(i+1)+'.');
    }catch(e){toast('Ce code n’est pas une sauvegarde valide.')}
  },
  reset:()=>{
    if(UI.confirm!=='reset'){UI.confirm='reset';render();return}
    C.abort=true;C.id++;C.phase='idle'; lsDel(SAVE_KEY); for(let i=0;i<MAXCH;i++) lsDel(CHAR_KEY(i));
    ACC={gold:80,cur:null,seenVer:VERSION}; saveAcc(); S=null; UI.confirm=null; UI.scr='menu'; render(); toast('Toutes les données ont été effacées.');
  },
  cancelReset:()=>{UI.confirm=null;render()},
  lmode:d=>{UI.lmode=d.m; UI.lerr=''; UI.lok=''; const e=$('#lemail'); if(e) UI.lemail=e.value; render(); const f=$('#lemail'); if(f) f.focus()},
  fbOffline:()=>{ACC.offline=true; saveAcc(); UI.scr='menu'; UI.lerr=''; render()},
  fbSubmit:async()=>{
    if(!FB.ready||UI.lbusy) return; const m=UI.lmode||'login',email=($('#lemail').value||'').trim(),pw=$('#lpass')?$('#lpass').value:'';
    UI.lemail=email; UI.lerr=''; UI.lok='';
    if(!email){UI.lerr='Entrez votre adresse e-mail.'; render(); return}
    if(m==='signup'&&pw!==($('#lpass2').value||'')){UI.lerr='Les deux mots de passe ne correspondent pas.'; render(); return}
    UI.lbusy=true; render();
    try{
      if(m==='reset'){ await FB.auth.sendPasswordResetEmail(email); UI.lok='Un e-mail de réinitialisation a été envoyé (pensez aux indésirables).'; UI.lmode='login' }
      else if(m==='signup'){ await FB.auth.createUserWithEmailAndPassword(email,pw); return }
      else { await FB.auth.signInWithEmailAndPassword(email,pw); return }
    }catch(e){ UI.lerr=fbErr(e) }
    UI.lbusy=false; render();
  },
  fbGoogle:async()=>{
    if(!FB.ready||UI.lbusy) return; UI.lerr=''; const pr=new firebase.auth.GoogleAuthProvider(); pr.setCustomParameters({prompt:'select_account'});
    try{ await FB.auth.signInWithPopup(pr) }
    catch(e){ if(e&&(e.code==='auth/popup-blocked'||e.code==='auth/operation-not-supported-in-this-environment')){ try{ await FB.auth.signInWithRedirect(pr); return }catch(e2){ UI.lerr=fbErr(e2) } } else UI.lerr=fbErr(e); render() }
  },
  fbLogout:async()=>{
    try{ await cloudPush(true) }catch(e){ toast('Synchronisation impossible : déconnexion annulée pour ne rien perdre. Réessayez.'); return }
    presence('off'); stopFriends(); stopPvp(); stopRaid(); stopMail(); ML.open=false; renderMail(); FB.prof=null; await FB.auth.signOut(); clearLocalChars(); ACC.offline=false; saveAcc(); UI.scr='login'; UI.lmode='login'; render(); toast('Déconnecté.') },
  pseudoOk:async()=>{
    if(UI.lbusy) return; const n=($('#pname').value||'').trim(); UI.pname=n; UI.perr='';
    if(!NAME_RE.test(n)){UI.perr='Le nom doit faire 3 à 16 caractères : lettres, chiffres, - ou _ (sans espace).'; render(); return}
    UI.lbusy=true; render();
    try{ await claimName(n); UI.lbusy=false; afterProfile(true) }
    catch(e){ UI.lbusy=false; UI.perr=e&&e.code==='name-taken'?'Ce nom de compte est déjà pris.':'Impossible d’enregistrer le nom ('+((e&&e.code)||'erreur')+'). Vérifiez les règles Firestore.'; render() }
  },
  frToggle:()=>{FR.open=!FR.open; UI.frmsg=''; UI.frerr=false; renderFriends(); renderTabs(); if(FR.open){const i=$('#frname'); if(i) i.focus()}},
  frAdd:async()=>{
    const i=$('#frname'),n=(i.value||'').trim(); if(!n) return;
    UI.frmsg='Envoi…'; UI.frerr=false; renderFriends();
    try{ const on=await frSendReq(n); i.value=''; UI.frmsg=`Demande envoyée à ${on}.`; }
    catch(e){ UI.frerr=true; UI.frmsg=e.msg||('Erreur : '+(e.code||'inconnue')) }
    renderFriends();
  },
  frAcc:async d=>{ try{ await FB.db.collection(COL('friendships')).doc(d.id).update({status:'accepted'}); UI.frmsg='Ami ajouté.'; UI.frerr=false }catch(e){ UI.frerr=true; UI.frmsg='Erreur : '+(e.code||'inconnue') } renderFriends() },
  frDel:async d=>{ if(!d.now&&UI.frdel!==d.id){UI.frdel=d.id; renderFriends(); return} UI.frdel=null;
    try{ await FB.db.collection(COL('friendships')).doc(d.id).delete() }catch(e){ UI.frerr=true; UI.frmsg='Erreur : '+(e.code||'inconnue') } renderFriends() },
  frDelNo:()=>{UI.frdel=null; renderFriends()},
  frMenu:d=>{UI.frMenu=UI.frMenu===d.id?null:d.id; renderFriends()},
  frChat:d=>{openChat(d.id); renderFriends()},
  chClose:()=>closeChat(),
  frDuel:async d=>{ UI.frMenu=null; renderFriends(); const f=FR.list.find(x=>x.id===d.id); if(!f) return;
    if(!pvpReady()){toast('Chargez un personnage (Jouer) pour lancer un duel.');return} if(inFight()){toast('Terminez d’abord votre combat en cours.');return} if(PV.match||RD.match){toast('Un combat en ligne est déjà en cours.');return}
    const o=f.users.find(x=>x!==pvpMe()),p=FR.prof[o];
    try{ await pvpPropose(o,otherName(f),p&&p.char?p.char:null,'friend'); toast('Demande de duel envoyée à '+otherName(f)+'.') }catch(e){ toast('Impossible d’envoyer la demande ('+(e.code||'erreur')+').') } },
  advMode:d=>{UI.advMode=d.m; render()},
  invTog:()=>openInv(!UI.invOpen),
  updReload:()=>{ try{save()}catch(e){} location.reload() },
  dgMat:()=>{ if(!FB.admin||!S||!S.heroes.length) return; const g=UI.dg,n=Math.max(1,Math.floor(+g.n||1)),k=g.k,nm=MAT_OBJ[k]||MAT_N[k]||k;
    if(isMatK(k)){ const left=storeMat(k,n); markNew(); save(); toast(`+${fmt(n-left)} ${nm}${left?` (stock plein, ${fmt(left)} perdus)`:''}.`); return }
    const got=dgPut({[k]:n}); markNew(); save(); toast(got<n?`${fmt(got)} × ${nm} donnés : sac et coffre pleins.`:`${fmt(n)} × ${nm} ajoutés.`) },
  dgItem:()=>{ if(!FB.admin||!S||!S.heroes.length) return; const g=UI.dg,it=genItem(g.slot,Math.max(1,Math.min(75,+g.lvl||1)),+g.rar,null,g.cls||undefined); it.up=Math.max(0,Math.min(10,+g.up||0));
    if(bagAddItem(S.bag,it)){ markNew(); save(); toast(`${it.name} (${RAR[it.rarity].n}, niv. ${it.ilvl}${it.up?', +'+it.up:''}) ajouté au sac.`); return }
    const T=stashD().tabs.find(T=>findSpot(T.bag,...SIZE(it),SW,SH)); if(T){ const sp=findSpot(T.bag,...SIZE(it),SW,SH); T.bag.push({x:sp[0],y:sp[1],o:it}); saveAcc(); toast(`${it.name} placé dans le coffre du compte (sac plein).`); return }
    toast('Sac et coffre du compte pleins.') },
  dgRelic:()=>{ if(!FB.admin) return; ACC.cos=ACC.cos||{}; ACC.cos['fr'+UI.dg.fr]=Date.now(); saveAcc(); toast(`Cadre ${pcFr(+UI.dg.fr)[0]} débloqué.`) },
  dgRelicAll:()=>{ if(!FB.admin) return; ACC.cos=ACC.cos||{}; PC_FR.forEach((F,i)=>{ if(F[2]==null&&!ACC.cos['fr'+i]) ACC.cos['fr'+i]=Date.now() }); saveAcc(); toast('Toutes les reliques débloquées.') },
  dgRelicNone:()=>{ if(!FB.admin) return; ACC.cos={}; const c=ACC.card; if(c&&pcFr(c.fr)[2]==null) c.fr=0; saveAcc(); toast('Reliques retirées (cadre remis à Or si besoin).') },
  chestNo:()=>closeChest(),
  chestOpen:()=>chestOpen(),
  chestAgain:()=>chestOpen(),
  chestGo:()=>{ closeChest(); UI.tab='comm'; UI.commT='custom'; UI.pcDraft=null; UI.invOpen=false; render() },
  soon:d=>toast(`${d.n} : arrive dans une prochaine mise à jour.`),
  pcLocked:d=>{ const el=document.activeElement&&document.activeElement.dataset&&document.activeElement.dataset.tip; if(el){ const t=document.createElement('div'); t.innerHTML=pcTip(el); toast(t.textContent.replace(/^(.*?)Verrouillé/,'$1 : ')) } },
  mlOpen:()=>{ ML.open=true; ML.adm=false; renderMail(); const x=$('#mailw .frx'); if(x) x.focus() },
  mlClose:()=>{ ML.open=false; UI.confirm=null; renderMail(); const b=$('#mailbtn'); if(b) b.focus() },
  mlSel:d=>{ ML.sel=d.id; UI.confirm=null; renderMail() },
  mlGet:d=>{ mlClaim([d.id]); renderMail() },
  mlGetAll:()=>{ mlClaim(mlToGet().map(m=>m.id)); renderMail() },
  mlDel:d=>{ const st=mlSt(); st.del[d.id]=1; st.read[d.id]=1; ML.sel=null; saveAcc(); renderMail(); mlRefresh() },
  mlAdm:()=>{ ML.adm=true; ML.admMsg=''; renderMail() },
  mlAdmBack:()=>{ ML.adm=false; renderMail() },
  mlF:d=>{ ML.form[d.k]=d.v; renderMail() },
  mlSend:()=>mlSend(),
  mlAdmDel:async d=>{ if(!FB.admin) return; if(UI.confirm!=='mldel'+d.id){UI.confirm='mldel'+d.id;renderMail();return} UI.confirm=null; try{ await mlCol().doc(d.id).delete(); toast('Message supprimé pour tous les joueurs.') }catch(e){ toast('Erreur : '+(e.code||'inconnue')) } },
  frBtn:()=>{ if(!FB.user||!FB.prof){toast('Connectez-vous à un compte en ligne pour voir vos amis.');return} FR.open=!FR.open; UI.frmsg=''; UI.frerr=false; renderFriends(); renderTabs(); if(FR.open){const i=$('#frname'); if(i) i.focus()} },
  frCard:d=>{ UI.frMenu=null; renderFriends(); friendCard(d.id) },
  pcClose:()=>pcfClose(),
  cardClose:()=>closeCard(),
  trCat:d=>{UI.trCat=d.c;render()},
  qCat:d=>{UI.qCat=d.c;render()},
  sqClaim:d=>sqClaim(d.id),
  sChOpen:d=>sChOpen(d.r),
  s8mClose:()=>{const m=$('#s8m'); if(m) m.remove()},
  s8Equip:d=>s8Equip(d.id),
  s8Cust:()=>{UI.tab='comm';UI.commT='custom';UI.pcDraft=null;render()},
  s8Troph:()=>{UI.tab='troph';UI.trCat='sea';render()},
  cu8:d=>{UI.cu8=d.c;render()},
  cu8f:d=>{UI.cu8f=d.f;render()},
  trF:d=>{UI.trF=d.f;render()},
  commT:d=>{UI.commT=d.t;UI.pcDraft=null;render()},
  ahTab:d=>{AH.tab=d.t;AH.conf=null;if(d.t!=='buy'&&FB.user) ahLoadMine().then(render).catch(()=>{}); render()},
  ahCat:d=>{AH.cat=d.c;render()},
  ahRar:d=>{AH.rar[+d.r]=AH.rar[+d.r]?0:1;render()},
  ahCls:d=>{AH.cls[d.c]=AH.cls[d.c]?0:1;render()},
  ahRefresh:()=>ahLoad(true),
  ahBuy:d=>ahBuy(d.id),
  ahPick:d=>{AH.sell=+d.id;AH.price='';hideTip();render();setTimeout(()=>{const n=$('#ahprice');if(n)n.focus()},30)},
  ahDur:d=>{AH.dur=+d.h;render()},
  ahSellX:()=>{AH.sell=null;render()},
  ahSellGo:()=>ahSellGo(),
  ahCancel:d=>ahCancel(d.id),
  pcSet:d=>{const c=pcDraft(); c[d.k]=d.k==='icon'?d.v:['orn','pf','aura','trail','cfx'].includes(d.k)?(d.v||null):+d.v; render()},
  pcConfirm:()=>{const c=pcDraft(); if(pcLockedSel(c).length){toast('Un élément sélectionné n’est pas encore débloqué.');return} ACC.card=pcClean(c); UI.pcDraft=null; pcSave(); toast('Carte de joueur enregistrée.')},
  pcReset:()=>{UI.pcDraft=null; render()},
  pcShow:d=>{const c=pcDraft(); const L=c.show=(c.show||[]).filter(id=>trGot(id)); const i=L.indexOf(d.id); if(i>=0) L.splice(i,1); else { if(L.length>=3){toast('3 trophées au maximum : retirez-en un d’abord.');return} L.push(d.id) } render()},
  comm:()=>{ if(!FB.user||!FB.prof){toast('Connectez-vous à un compte en ligne pour accéder à la communauté (amis, messages).');return} FR.open=!FR.open; UI.frmsg=''; UI.frerr=false; renderFriends(); renderTabs(); if(FR.open){const i=$('#frname'); if(i) i.focus()} },
  pvpFind:()=>pvpSearch(),
  pvpCancel:()=>pvpStopSearch(),
  pvpAcc:()=>pvpAccept(),
  pvpRef:()=>pvpRefuse(),
  pvpSk:d=>pvAct(d.id),
  pvpReady:()=>{ if(PV.match&&PV.match.state==='prep') pvpUpd({['ready.'+pvpMe()]:true}) },
  rdReady:()=>{ if(RD.match&&RD.match.state==='prep') rdUpd({['ready.'+pvpMe()]:true}) },
  prepGo:()=>{ C.prepGo=true },
  pvpPot:d=>pvPot(d.k),
  pvpEndT:()=>pvEnd(),
  pvpGiveUp:()=>{ if(UI.confirm!=='giveup'){UI.confirm='giveup'; renderPvp(); toast('Cliquez à nouveau pour abandonner : le duel sera compté comme une défaite.'); setTimeout(()=>{if(UI.confirm==='giveup'){UI.confirm=null; renderPvp()}},4000); return} UI.confirm=null; pvForfeit() },
  fcSend:d=>fcSend(d.k),
  rdBoss:d=>{UI.raidB=+d.i; UI.raidT=raidMax(RAIDS[UI.raidB].id); render()},
  rdFind:()=>rdSearch(),
  rdTier:d=>{if(RD.searching)return;UI.raidT=+d.t;render()},
  rdInv:()=>{ if(!FB.user||!FB.prof){toast('Connectez-vous à un compte en ligne pour inviter un ami.');return} FR.open=true; renderFriends(); renderTabs(); toast('Cliquez sur le nom d’un ami en ligne, puis sur « Raid » : le boss et le palier choisis ici seront utilisés.') },
  rdCancel:()=>rdStopSearch(),
  rdAcc:()=>rdAccept(),
  rdRef:()=>rdRefuse(),
  rdSk:d=>rdAct(d.id),
  rdPot:d=>rdPot(d.k),
  rdEndT:()=>rdEnd(),
  rdSkip:()=>rdSkip(),
  rdGiveUp:()=>{ if(UI.confirm!=='rdgiveup'){UI.confirm='rdgiveup'; renderRaid(); toast('Cliquez à nouveau pour abandonner : le raid sera compté comme une défaite.'); setTimeout(()=>{if(UI.confirm==='rdgiveup'){UI.confirm=null; renderRaid()}},4000); return} UI.confirm=null; rdForfeit() },
  rdLootOk:()=>{const d=$('#rdloot'); if(d) d.remove()},
  frRaid:async d=>{ UI.frMenu=null; renderFriends(); const f=FR.list.find(x=>x.id===d.id); if(!f) return;
    if(!pvpReady()){toast('Chargez un personnage (Jouer) pour lancer un raid.');return} if(inFight()){toast('Terminez d’abord votre combat en cours.');return} if(PV.match||RD.match){toast('Un combat en ligne est déjà en cours.');return}
    const r=RAIDS[UI.raidB||0],t=rdTier(); if(S.heroes[0].lvl<r.req){toast('Niveau '+r.req+' requis pour le raid '+r.n+'.');return}
    const o=f.users.find(x=>x!==pvpMe()),p=FR.prof[o];
    try{ await rdPropose(o,otherName(f),p&&p.char?p.char:null,'friend',r.id,t); toast('Invitation au raid '+r.n+' (palier +'+t+') envoyée à '+otherName(f)+'.') }catch(e){ toast('Impossible d’envoyer l’invitation ('+(e.code||'erreur')+').') } },
  pvpClaim:()=>pvClaim(),
  pvpLootOk:()=>{const d=$('#pvploot'); if(d) d.remove()},
  chSend:()=>sendChat(),
  copyUid:()=>{try{navigator.clipboard.writeText(FB.user.uid).then(()=>toast('Identifiant copié.'),()=>toast(FB.user.uid))}catch(e){toast(FB.user.uid)}},
  bestSk:d=>{const [zi,j]=d.k.split('.'),z=UI.bw.zones[+zi],o=j==='b'?z.boss:z.enemies[+j],i=o.sk.indexOf(d.s); if(i>=0) o.sk.splice(i,1); else o.sk.push(d.s); applyBest(UI.bw); UI.bdirty=true; const y=scrollY; render(); scrollTo(0,y)},
  bestUndo:()=>{let pub=null; try{pub=JSON.parse(lsGet(BEST_KEY)||'null')}catch(e){} applyBest(pub); UI.bw=bestSnap(); UI.bdirty=false; const y=scrollY; render(); scrollTo(0,y); toast('Modifications annulées.')},
  bestDef:()=>{UI.bw=JSON.parse(JSON.stringify(BEST_DEF)); applyBest(UI.bw); UI.bdirty=true; const y=scrollY; render(); scrollTo(0,y); toast('Valeurs d’origine rétablies (pensez à publier).')},
  bestPub:async()=>{ if(!FB.admin) return; const json=JSON.stringify({...(UI.bw||bestSnap()),bal:3});
    try{ await FB.db.collection(COL('config')).doc('bestiary').set({json,ts:firebase.firestore.FieldValue.serverTimestamp(),by:FB.user.uid}); lsSet(BEST_KEY,json); UI.bdirty=false; const y=scrollY; render(); scrollTo(0,y); toast('Bestiaire publié pour tous les joueurs.') }
    catch(e){ toast('Publication impossible ('+((e&&e.code)||'erreur')+'). Vérifiez les règles Firestore et le document config/admin.') } },
  bestTest:d=>{ if(!S||!S.heroes||!S.heroes.length){toast('Chargez d’abord un personnage (Jouer).');return}
    const [zi,j]=d.k.split('.'); C.force={z:+zi,j:j==='b'?-1:+j}; C.test=true; UI.bestFrom=true;
    S.diff=UI.bdiff||'normal'; UI.zone=+zi; UI.stage=j==='b'?10:(UI.bstage||5); UI.scr=null; UI.tab='combat'; C.phase='idle'; render(); scrollTo(0,0); startBattle() },
  bestBack:()=>{C.phase='idle'; C.result=null; UI.scr='best'; UI.fromGame=true; render()},
  dbgT:d=>{const D=DBG(); D[d.k]=!D[d.k]; saveAcc(); render(); toast((d.k==='free'?'Aucun coût':'Récoltes accélérées')+(D[d.k]?' : activé.':' : désactivé.'))},
  dbg:d=>{
    if(!S||!S.heroes||!S.heroes.length) return; const h=S.heroes[0],k=d.k; let msg='';
    const giveLvl=n=>{const t=Math.min(MAXL,h.lvl+n); h.sp+=t-h.lvl; h.lvl=t; h.xp=0};
    const each=f=>{for(const m of MATS) f(m)};
    switch(k){
      case 'mats0': S.mats={}; msg='Composants remis à 0.'; break;
      case 'matsMax': each(m=>S.mats[m]=matCap(m)); msg='Composants au maximum.'; break;
      case 'mats100': each(m=>storeMat(m,100)); msg='+100 de chaque composant.'; break;
      case 'prism': storeMat('prisme',5); msg='+5 Prismes divins.'; break;
      case 'gold0': S.gold=0; msg='Or remis à 0.'; break;
      case 'gold10k': S.gold+=10000; msg='+10 000 or.'; break;
      case 'gold1m': S.gold+=1000000; msg='+1 000 000 or.'; break;
      case 'lvlUp': giveLvl(1); msg='Niveau '+h.lvl+'.'; break;
      case 'lvl10': giveLvl(10); msg='Niveau '+h.lvl+'.'; break;
      case 'lvlMax': giveLvl(MAXL); msg='Niveau maximum ('+MAXL+').'; break;
      case 'lvl1': {const nh=newHero(h.name,h.cls,h.hue,1); Object.assign(h,{lvl:1,xp:0,sp:nh.sp,learned:nh.learned,loadout:nh.loadout,spec:null}); S.uid--; msg='Retour au niveau 1 (compétences réinitialisées).'; break}
      case 'sp5': h.sp+=5; msg='+5 points de compétence.'; break;
      case 'unequip': {let n=0,lost=0; for(const sl of Object.keys(h.equip)){const it=h.equip[sl]; delete h.equip[sl]; if(bagAddItem(S.bag,it)) n++; else {lost++; gain(salvageValue(it))}} msg=`${n} objet${n>1?'s':''} rangé${n>1?'s':''} dans l’inventaire${lost?`, ${lost} détruit${lost>1?'s':''} faute de place`:''}.`; break}
      case 'advAll': S.prog={zone:ZONES.length-1,stage:10}; S.progH={zone:ZONES.length-1,stage:10}; S.progM={zone:ZONES.length-1,stage:10}; S.mythOpen=true; {const P=prog();UI.zone=P.zone;UI.stage=P.stage} msg='Toutes les zones d’Aventure sont débloquées (Héroïque et Mythique demandent toujours le niveau 50).'; break;
      case 'advReset': S.prog={zone:0,stage:1}; S.progH={zone:0,stage:1}; S.progM={zone:0,stage:1}; S.mythOpen=false; S.diff='normal'; UI.zone=0; UI.stage=1; msg='Aventure remise à zéro.'; break;
      case 'itemRand': {const sl=pick(ITEM_SLOTS),it=genItem(sl,60,5); msg=addInv(it)?`${it.name} ajouté à l’inventaire.`:'Inventaire plein.'; break}
      case 'itemSet': {let n=0; for(const sl of ITEM_SLOTS){const it=genItem(sl,Math.max(1,Math.min(53,h.lvl)),4); if(addInv(it)) n++} msg=`${n} objet${n>1?'s':''} légendaire${n>1?'s':''} ajouté${n>1?'s':''} à l’inventaire.`; break}
      case 'bagClear': S.bag=[]; UI.bagSel=null; UI.fItem=null; msg='Inventaire vidé.'; break;
      case 'harvest': for(const si of SITES){const st=S.sites[si.id]; if(st.lvl>0){st.ready=siteRes(st); st.t=0}} msg='Toutes les zones ouvertes ont une récolte prête.'; break;
      case 'zonesOpen': for(const si of SITES){const st=S.sites[si.id]; if(st.lvl<1){st.lvl=1; st.t=0}} msg='Toutes les zones de collecte sont ouvertes.'; break;
      case 'treeMax': for(const si of SITES){const st=S.sites[si.id],t=tal(st); for(const b of branchesFor(si.id)){t[b.k]=b.max; t[b.cap.k]=1} t.auto=1} msg='Arbres de talents au maximum (récolte automatique comprise).'; break;
      case 'treeReset': for(const si of SITES){const st=S.sites[si.id]; st.tal={}; delete st.auto} msg='Arbres de talents remis à zéro (sans remboursement).'; break;
      case 'news': ACC.seenVer=null; saveAcc(); msg='Le point rouge « Nouveautés » est réaffiché.'; break;
      case 'resetChar': {
        if(UI.confirm!=='dbgReset'){UI.confirm='dbgReset';render();return}
        const g=S.gold,uid=S.uid; S=newGame(); S.gold=g; S.uid=uid; S.seenVer=VERSION;
        const nh=newHero(h.name,h.cls,h.hue,1); nh.id=h.id; S.heroes=[nh]; S.party=[nh.id];
        UI.zone=0; UI.stage=1; UI.bagSel=null; UI.fItem=null; UI.fLast=null; msg='Progression du personnage remise à zéro.'; break}
    }
    UI.confirm=null; C.phase='idle'; save(); render(); if(msg) toast(msg);
  },
  scr:d=>{ if(d.s==='news'){ACC.seenVer=VERSION;saveAcc()} if(d.s==='menu'||d.s==='select') UI.fromGame=false; UI.scr=d.s; UI.confirm=null; render(); scrollTo(0,0) },
  toMenu:()=>{ hideTip(); const dd=$('#menudd'); if(dd){closeMenuDD();return}
    const u=unseenVer(),m=document.createElement('div'); m.id='menudd'; m.className='ddmenu'; m.setAttribute('role','menu');
    m.innerHTML=`<button role="menuitem" data-act="ddOpt">Options</button><button role="menuitem" data-act="ddNews">Nouveautés${u?'<span class="ndot" aria-label="Nouvelle version"></span>':''}</button><button role="menuitem" data-act="ddChar">Changer de personnage</button><button role="menuitem" data-act="ddHelp">Aide</button>${FB.admin?'<button role="menuitem" class="ddadm" data-act="ddAdm">Admin</button>':''}`;
    document.body.append(m); $('#menubtn').setAttribute('aria-expanded','true'); m.querySelector('button').focus() },
  ddHelp:()=>{closeMenuDD(); UI.tab='help'; UI.scr=null; render(); scrollTo(0,0)},
  ddOpt:()=>{closeMenuDD(); save(); UI.fromGame=true; UI.scr='opts'; UI.confirm=null; render(); scrollTo(0,0)},
  ddAdm:()=>{closeMenuDD(); save(); UI.fromGame=true; UI.scr='admin'; UI.confirm=null; render(); scrollTo(0,0)},
  admUnlock:d=>admUnlock(d.w),
  admRkReset:()=>admRkReset(),
  sChAsk:d=>sChAsk(d.r),
  cpT:d=>{UI.cpT=d.t;UI.cpMulti=false;UI.cpItemPick=false;render()},
  cpSel:d=>{ if(UI.cpMulti){ UI.cpPick=UI.cpPick||new Set(); UI.cpPick.has(d.id)?UI.cpPick.delete(d.id):(cpById(d.id)&&!cpById(d.id).busy&&UI.cpPick.add(d.id)); UI.confirm=null; render(); return } UI.cpSel=UI.cpSel===d.id?null:d.id; UI.cpItemPick=false; render() },
  cpRelAsk:d=>{ const c=cpById(d.id); if(!c||c.busy) return; if(UI.confirm==='cpRel'+d.id){ cpRelease([d.id]); return } UI.confirm='cpRel'+d.id; render(); toast(`Cliquez encore pour relâcher ${cpName(c)} (+${cpRelTok(c)} jetons).`) },
  cpMulti:()=>{UI.cpMulti=!UI.cpMulti;UI.cpPick=new Set();UI.confirm=null;render()},
  cpMultiNo:()=>{UI.confirm=null;render()},
  cpPickG:d=>{ UI.cpPick=new Set(d.g==='none'?[]:cpS().list.filter(c=>!c.busy&&!c.shiny&&['C','D'].includes(cpGrade(c))).map(c=>c.id)); UI.confirm=null; render() },
  cpRelMany:()=>{ if(!UI.cpPick||!UI.cpPick.size) return; if(UI.confirm!=='cpRelMany'){ UI.confirm='cpRelMany'; render(); return } cpRelease([...UI.cpPick]) },
  cpFeed:d=>cpFeed(d.id,d.k), cpEvo:d=>cpEvo(d.id), cpItemPick:()=>{UI.cpItemPick=!UI.cpItemPick;render()}, cpEquip:d=>cpEquip(d.id,d.k||null),
  cpM:d=>{UI.cpM=d.id;render()},
  cpTeam:d=>{ UI.cpTeam=UI.cpTeam||[]; const i=UI.cpTeam.indexOf(d.id); if(i>=0) UI.cpTeam.splice(i,1); else { const M=cpBoard().find(m=>m.id===UI.cpM); if(M&&UI.cpTeam.length<M.sl) UI.cpTeam.push(d.id) } render() },
  cpBest:()=>{ const M=cpBoard().find(m=>m.id===UI.cpM); if(!M) return; UI.cpTeam=cpS().list.filter(c=>!c.busy).map(c=>({c,v:cpChance(M,[c]).T})).sort((a,b)=>b.v-a.v).slice(0,M.sl).map(x=>x.c.id); render() },
  cpGo:()=>cpLaunch(), cpClaim:d=>cpClaim(d.id), cpResX:()=>{const m=$('#cpres'); if(m) m.remove()},
  cpBuy:d=>cpBuy(d.k), cpTick:d=>cpTickAsk(d.k), cpGoTick:d=>cpGoTick(d.k,+d.n),
  cpSeeNew:()=>{ closeChest(); UI.tab='comp'; UI.cpT='c'; UI.cpSort='new'; UI.invOpen=false; render() },
  cpDbg:d=>cpDbg(d.k),
  mNav:d=>mNav(d.k), mGo:d=>mGo(d.k), mPlusX:()=>{UI.mPlus=false;renderTabs()},
  fPrN:d=>{ const h=matAll('prisme'); UI.fPrN=d.d==='max'?clamp(Math.min(PR_MAX,h),1,PR_MAX):clamp(prN()+(+d.d),1,PR_MAX); render() },
  rdInfo:()=>rdInfoOpen(), rdInfoX:()=>rdInfoX(),
  h82:d=>{ UI.h82=d.id; render(); const e=$('#h82_'+d.id); if(e){ e.open=true; e.scrollIntoView({block:'start',behavior:'smooth'}) } },
  shopSub:d=>{ UI.shopSub=d.s; if(d.s==='h'&&FB.user&&!AH.busy) setTimeout(()=>ahLoad(),0); render(); scrollTo(0,0) },
  stgBuy:d=>stgBuy(d.k), shPch:d=>{UI.shPch=d.c;render()},
  pchToggle:()=>{UI.pchInv=!UI.pchInv;renderInvPop()}, pchTab:d=>{UI.pchT=d.c;renderInvPop()}, pchOut:d=>pouchOut(d.c,d.k), pchSweep:()=>{ pouchSweep(); save(); renderInvPop() },
  fAffSel:d=>{UI.fAff=+d.i;render()},
  admTab:d=>{UI.admT=d.t; UI.confirm=null; render(); scrollTo(0,0)},
  admMail:()=>{ A.mlOpen(); A.mlAdm() },
  updAuto:()=>{ updSave({auto:!UPDM.auto}).then(()=>{ render(); if(UPDM.auto&&UPDM.last!==VERSION) toast('Envoi automatique activé : l’annonce partira à la prochaine ouverture du jeu.') }); render() },
  updSendNow:()=>updSend(true),
  updDef:()=>{ updSave({title:UPD_T,body:UPD_B}).then(render) },
  admMailTo:d=>{ A.mlOpen(); A.mlAdm(); if(ML.form){ ML.form.to='one'; ML.form.name=d.n; renderMail() } },
  admPl:()=>{ADM.players=null;ADM.pErr='';admLoadPlayers();render()},
  admSTitle:()=>admSeasonTitle(),
  admAdd:()=>{ const v=(($('#admnew')||{}).value||'').trim(); if(!v){toast('Indiquez un UID.');return} const L=(ADM.admins||[]).slice(); if(L.includes(v)){toast('Déjà administrateur.');return} L.push(v); admSetAdmins(L) },
  admDel:d=>{ if(UI.confirm!=='admdel'+d.u){UI.confirm='admdel'+d.u; toast('Cliquez à nouveau pour retirer cet administrateur.'); return} UI.confirm=null; admSetAdmins((ADM.admins||[]).filter(x=>x!==d.u)) },
  rdSolo:()=>raidSolo(),
  ddNews:()=>{closeMenuDD(); save(); UI.fromGame=true; ACC.seenVer=VERSION; saveAcc(); UI.scr='news'; render(); scrollTo(0,0)},
  ddChar:()=>{ closeMenuDD(); if($('#mconf')) return;
    const m=document.createElement('div'); m.className='modal'; m.id='mconf'; m.setAttribute('role','dialog'); m.setAttribute('aria-modal','true'); m.setAttribute('aria-labelledby','mconfT');
    m.innerHTML=`<div class="box"><h2 id="mconfT">Changer de personnage ?</h2><p>${inFight()?'Le combat en cours sera interrompu. ':''}Votre partie est sauvegardée.</p><div class="row"><button class="btn pri" data-act="menuYes">Oui</button><button class="btn" data-act="menuNo">Non</button></div></div>`;
    document.body.append(m); m.querySelector('[data-act=menuNo]').focus(); },
  backGame:()=>{UI.fromGame=false; if(!S||!S.heroes||!S.heroes.length){UI.scr='menu';render();return} UI.scr=null; render(); scrollTo(0,0)},
  menuNo:()=>{const m=$('#mconf'); if(m) m.remove(); const b=$('#menubtn'); if(b) b.focus()},
  menuYes:()=>{ const m=$('#mconf'); if(m) m.remove(); if(inFight()){C.abort=true;C.id++} C.phase='idle'; save(); cloudPush(); UI.fromGame=false; UI.scr='select'; UI.confirm=null; render(); scrollTo(0,0) },
  upShow:()=>upPopShow(true),
  playChar:d=>{ if(startChar(+d.i)){UI.scr=null; render(); scrollTo(0,0); presence(); setTimeout(()=>upPopShow(),350)} },
  upGo:d=>{ UPG=clamp(+d.i,0,UPOP.pages.length-1); upPopRender() },
  upClose:()=>upPopClose(),
  upHide:()=>upPopHide(),
  newChar:d=>{ const i=+d.i; if(charRaw(i)) return; if(S&&S.heroes&&S.heroes.length&&!UI.scr) save(); C.abort=true;C.id++;C.phase='idle'; ACC.cur=i; S=newGame(); S.gold=ACC.gold; UI.cname=''; UI.scr='create'; render(); scrollTo(0,0) },
  delChar:d=>{ const i=+d.i; if(UI.confirm!=='delc'+i){UI.confirm='delc'+i;render();return}
    lsDel(CHAR_KEY(i)); if(ACC.cur===i){ACC.cur=null; S=null} saveAcc(); UI.confirm=null; render(); toast('Personnage supprimé.') },
};
document.addEventListener('click',e=>{
  if(noClick){noClick=false;return}
  const b=e.target.closest('[data-act]'); if(!b) return;
  if(b.tagName==='INPUT'&&b.type==='checkbox'){A[b.dataset.act](b.dataset);return}
  if(b.tagName==='INPUT') return;
  if(A[b.dataset.act]) A[b.dataset.act](b.dataset);
});
document.addEventListener('keydown',e=>{ if(e.key==='Escape'){ if($('#menudd')){closeMenuDD();$('#menubtn').focus()} else if($('#mconf')) A.menuNo(); else if(UI.siteTree) A.treeClose(); else if(UI.siteOpt) A.optClose() } });
document.addEventListener('mousedown',e=>{ if(e.target.id==='mconf') A.menuNo(); else if(e.target.id==='tree') A.treeClose();
  if($('#menudd')&&!e.target.closest('#menudd,#menubtn')) closeMenuDD();
  if(UI.siteOpt&&!e.target.closest('#sopt,.sgear')) A.optClose() });
document.addEventListener('submit',e=>e.preventDefault());
document.addEventListener('keydown',e=>{ if(e.key==='Enter'&&e.target.id==='frname'){e.preventDefault();A.frAdd()} if(e.key==='Enter'&&e.target.id==='chin'){e.preventDefault();sendChat()} if(e.key==='Enter'&&e.target.id==='fcin'){e.preventDefault();fcSend(e.target.dataset.k)} if(e.key==='Escape'&&CH.id&&e.target.id==='chin') closeChat() });
document.addEventListener('mousedown',e=>{ if(UI.srt&&!e.target.closest('.srtw')){ UI.srt=null; renderInvPop() } },true);
document.addEventListener('mousedown',e=>{ if(FR.open&&!e.target.closest('#friends,#frchat,.dkfr,#pcfl')){FR.open=false;UI.frMenu=null;renderFriends()} else if(UI.frMenu&&!e.target.closest('.frpop,.frname')){UI.frMenu=null;renderFriends()} });
document.addEventListener('input',e=>{
  if(e.target.id==='cname') UI.cname=e.target.value;
  if(e.target.id==='admq'){ UI.admQ=e.target.value; const y=e.target.selectionStart; render(); const q=$('#admq'); if(q){q.focus(); try{q.setSelectionRange(y,y)}catch(_){}} }
  if(e.target.dataset&&e.target.dataset.bf){ bestSet(e.target.dataset.bf,e.target.value); bestRefreshStats() }
  if(e.target.id==='bstage'){ UI.bstage=+e.target.value; const b=e.target.nextElementSibling; if(b) b.textContent=UI.bstage; bestRefreshStats() }
});
document.addEventListener('input',e=>{ const t=e.target; if(t.dataset&&t.dataset.dg&&UI.dg) UI.dg[t.dataset.dg]=t.value; if(!ML.form) return; if(t.dataset.mlf&&t.tagName!=='SELECT'){ ML.form[t.dataset.mlf]=t.value; if(t.dataset.mlf==='title'||t.dataset.mlf==='body') renderMail() } if(t.dataset.mlatt){ ML.form.att[t.dataset.mlatt]=Math.max(0,Math.floor(+t.value||0)); renderMail() } });
document.addEventListener('keydown',e=>{ if(e.key==='Escape'&&ML.open&&!$('#pcard')){ e.stopPropagation(); A.mlClose() } },true);
document.addEventListener('change',e=>{
  if(e.target.dataset&&e.target.dataset.dg&&UI.dg){ UI.dg[e.target.dataset.dg]=e.target.value }
  if(e.target.dataset&&e.target.dataset.mlf&&e.target.tagName==='SELECT'&&ML.form){ ML.form[e.target.dataset.mlf]=e.target.dataset.mlf==='exp'?+e.target.value:e.target.value; renderMail() }
  if(e.target.dataset&&e.target.dataset.wipe&&UI.wipe){ UI.wipe[e.target.dataset.wipe]=e.target.checked }
  if(e.target.id==='bdiff'){ UI.bdiff=e.target.value; const y=scrollY; render(); scrollTo(0,y) }
  if(e.target.id==='flvl'){UI.fLvl=+e.target.value;render()}
  if(e.target.id==='rdtier'){UI.raidT=+e.target.value;render()}
  if(e.target.id==='cpsort'){UI.cpSort=e.target.value;render();return}
  if(e.target.id==='pctitle'){pcDraft().title=e.target.value||null;render()}
});

