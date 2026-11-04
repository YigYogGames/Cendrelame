/* Cendrelame · systems/coffres-et-admin.js */
/* ================= 0.7.10 : coffres, admin, sac de combat ================= */
for(const r of [0,1]){ const k='s_ch'+r,n='Coffre de saison '+SRAR[r][0].toLowerCase(); MAT_OBJ[k]=n; MAT_N[k]=n; MAT_D[k]=`Contient 1 cosmétique de la saison (${SCH_W[r].map((w,i)=>w?SRAR[i][0]+' '+w+' %':'').filter(Boolean).join(', ')}). Un cosmétique pas encore obtenu est prioritaire. Clic droit pour l’ouvrir.`;
  MI[k]=MI.s_ch2.replace(/#7a3aa8/g,r?'#a8861a':'#7a5a3a').replace(/#a050d8/g,r?'#d6b032':'#b0906a').replace(/#24082e/g,'#2a1a08') }
/* sac de combat : limites */
function cbClamp(){ if(!S||!S.cbag) return; let ch=false; for(const [k,v] of Object.entries(S.cbag)){ const L=CB_LIM[k]||0; if(v>L){ const ex=v-L; S.cbag[k]=L; if(!L) delete S.cbag[k]; const left=bagAddMat(S.bag,k,ex); if(left>0){ const t=mlPlace({[k]:left}); if(t){ for(const x of t) x.T.bag=x.bag; saveAcc() } } ch=true } } if(ch){ markNew(); save() } }
/* fonds de zone débloqués par l'admin */
PC_BG.forEach(B=>{ const f=B[2]; B[2]=()=>!!ACC.admAll||f() });
/* admin : tout débloquer */
function admUnlock(what){ if(!FB.admin) return; const now=Date.now();
  if(what==='cos'||what==='all'){ ACC.scos=ACC.scos||{}; for(const c of COS8) ACC.scos[c.id]=ACC.scos[c.id]||now; ACC.cos=ACC.cos||{}; PC_FR.forEach((F,i)=>{ if(F[2]==null) ACC.cos['fr'+i]=ACC.cos['fr'+i]||now }); ACC.admAll=1 }
  if(what==='tr'||what==='all'){ ACC.troph=ACC.troph||{}; for(const t of TROPHIES) ACC.troph[t.id]=ACC.troph[t.id]||now; ACC.stro=ACC.stro||{}; for(const t of SEA_TR()) ACC.stro[stroK(t.id)]=ACC.stro[stroK(t.id)]||now }
  if(what==='none'){ delete ACC.scos; ACC.cos={}; delete ACC.admAll; const c=ACC.card; if(c){ for(const k of ['orn','pf','aura','trail','cfx']) c[k]=null; if(c.bg>=100) c.bg=3; if(pcFr(c.fr)[2]==null) c.fr=0 } UI.pcDraft=null }
  saveAcc(); presence(); render();
  toast(what==='none'?'Cosmétiques retirés (reliques, cosmétiques de saison, fonds).':what==='tr'?'Tous les trophées et trophées de saison débloqués.':what==='cos'?'Tous les cosmétiques débloqués (reliques, saison, fonds).':'Tout est débloqué : cosmétiques, trophées et titres.') }
/* admin : remise à zéro du classement */
async function admRkReset(){ if(!FB.admin) return; if(UI.confirm!=='rkReset'){ UI.confirm='rkReset'; render(); return }
  UI.confirm=null; const r=((FB.season&&+FB.season.rkr)||0)+1;
  try{ await FB.db.collection(COL('config')).doc('reset').set({rkr:r},{merge:true}); FB.season=Object.assign({},FB.season||{n:0},{rkr:r}); RK.list=null; RK.final=null; toast('Classement remis à zéro pour tous les joueurs.') }
  catch(e){ toast('Échec ('+((e&&e.code)||'erreur')+') : vérifiez la règle Firestore de config/reset.') }
  render() }
const admRkCard=()=>admCard('podium','Classement','Duels et défis de la saison en cours',`<p class="hint">Remet le classement à zéro pour tous les joueurs (victoires, défaites et records de défis). Les anciens résultats ne sont plus affichés ; la saison, les personnages et les trophées ne changent pas.${(FB.season&&+FB.season.rkr)?` Remises à zéro cette saison : <b>${+FB.season.rkr}</b>.`:''}</p><div class="row">${UI.confirm==='rkReset'?`<button class="btn sm danger" data-act="admRkReset">Oui, remettre le classement à zéro</button><button class="btn sm" data-act="cancelReset">Annuler</button>`:`<button class="btn sm danger" data-act="admRkReset">${uic('podium')} Réinitialiser le classement</button>`}</div>`);
