/* Cendrelame · systems/sac-de-base.js (0.8.16)
   Le Sac agrandi est retiré : l’inventaire revient à 14 × 5 cases pour tout le monde (les sacoches restent).
   - Les achats du Sac agrandi sont remboursés une fois (or + runes), au premier personnage chargé.
   - Un objet qui ne tient plus dans le sac part dans le coffre du compte ; s’il n’y a plus de place nulle part, il est vendu. */
fitBag=function(d){ try{ stgSync() }catch(e){}
  if(!Array.isArray(d.bag)) return d;
  const out=d.bag.filter(e=>{const [w,h]=SIZE(e.o);return e.x+w>GW||e.y+h>GH});
  if(!out.length) return d;
  d.bag=d.bag.filter(e=>!out.includes(e)); let gold=0,sold=0,st=0;
  out.sort((a,b)=>{const A=SIZE(a.o),B=SIZE(b.o);return (b.o.mat?1:0)-(a.o.mat?1:0)||B[0]*B[1]-A[0]*A[1]});
  const toStash=o=>{ try{ const [w,h]=SIZE(o); for(const T of stashD().tabs){ const sp=findSpot(T.bag,w,h,SW,SH); if(sp){ T.bag.push({x:sp[0],y:sp[1],o}); return true } } }catch(e){} return false };
  for(const e of out){
    if(e.o.mat){ const left=bagAddMat(d.bag,e.o.mat,e.o.n); if(left>0){ const o=Object.assign({},e.o,{n:left}); if(toStash(o)) st++ } continue }
    const [w,h]=SIZE(e.o),sp=findSpot(d.bag,w,h);
    if(sp) d.bag.push({x:sp[0],y:sp[1],o:e.o}); else if(toStash(e.o)) st++; else {gold+=sellValue(e.o);sold++}
  }
  if(st) try{ saveAcc() }catch(e){}
  d.gold=(d.gold||0)+gold;
  MIG_MSG=(MIG_MSG?MIG_MSG+' ':'')+'Inventaire ramené à 14 × 5 cases : les objets ont été réorganisés.'+(st?` ${st} objet${st>1?'s':''} rangé${st>1?'s':''} dans le coffre du compte.`:'')+(sold?` ${sold} objet${sold>1?'s':''} sans place vendu${sold>1?'s':''} pour ${fmt(gold)} or.`:'');
  return d;
};
function stgRefund(){
  const lv=ACC&&ACC.stg&&ACC.stg.bag|0; if(!lv||!S) return;
  const c={gold:0}; for(const x of STG85.bag.cost.slice(0,lv)){ c.gold+=x[0]; if(x[1]) c[x[1]]=(c[x[1]]||0)+1 }
  ACC.stg.bag=0; saveAcc(); gain(c); save();
  setTimeout(()=>toast(`Sac agrandi retiré : vos ${lv} amélioration${lv>1?'s':''} vous ${lv>1?'sont remboursées':'est remboursée'} (${fmt(c.gold)} or${c.ru_anc?' + 1 Rune ancienne':''}${c.ru_pri?' + 1 Rune primordiale':''}).`),1200);
}
{ const _boot=bootChar; bootChar=function(){ const r=_boot.apply(this,arguments); try{ stgRefund() }catch(e){ console.error(e) } return r } }
