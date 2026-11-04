/* Cendrelame · admin/bestiaire.js */
/* ============ Bestiaire (réglages des ennemis, publiés par l’administrateur) ============ */
const EFX=['v','dur','ch'];
const bestSnap=()=>JSON.parse(JSON.stringify({
  zones:ZONES.map(z=>({enemies:z.enemies.map(e=>({hp:e.hp,atk:e.atk,def:e.def,spd:e.spd||1,sk:[...(e.sk||[])],res:Object.fromEntries(RES_K.map(k=>[k,(e.res&&e.res[k])||0]))})),boss:{hp:z.boss.hp,atk:z.boss.atk,def:z.boss.def,spd:z.boss.spd||1,sk:[...(z.boss.sk||[])],res:Object.fromEntries(RES_K.map(k=>[k,(z.boss.res&&z.boss.res[k])||0]))}})),
  sk:Object.fromEntries(Object.entries(ENSK).map(([id,k])=>[id,{ap:k.ap||0,cd:k.cd,mult:k.mult==null?null:k.mult,fx:(k.fx||[]).map(f=>Object.fromEntries(EFX.filter(x=>f[x]!=null).map(x=>[x,f[x]])))}])),
  enf:{hp:[...ENF.hp],atk:[...ENF.atk],def:[...ENF.def]},
  diff:Object.fromEntries(['hero','myth'].map(d=>[d,{hp:DIFF[d].hp,atk:DIFF[d].atk,bHp:DIFF[d].bHp,bAtk:DIFF[d].bAtk,bDef:DIFF[d].bDef,rage:DIFF[d].rage}]))}));
ZONES.forEach(z=>{z.boss.hp=Math.round(z.boss.hp*.6*100)/100;z.boss.atk=Math.round(z.boss.atk*.75*100)/100});
const BEST_DEF=bestSnap();
function applyBest(cfg){
  const src=[BEST_DEF,cfg&&cfg.bal>=3?cfg:null].filter(Boolean);
  for(const c of src){
    (c.zones||[]).forEach((z,i)=>{const Z=ZONES[i]; if(!Z||!z) return;
      (z.enemies||[]).forEach((e,j)=>{if(Z.enemies[j]&&e) Object.assign(Z.enemies[j],{hp:+e.hp,atk:+e.atk,def:+e.def,spd:+e.spd||1,sk:(e.sk||[]).filter(x=>ENSK[x])},e.res?{res:Object.fromEntries(Object.entries(e.res).map(([k,v])=>[k,+v]))}:{})});
      if(z.boss) Object.assign(Z.boss,{hp:+z.boss.hp,atk:+z.boss.atk,def:+z.boss.def,spd:+z.boss.spd||1,sk:(z.boss.sk||[]).filter(x=>ENSK[x])},z.boss.res?{res:Object.fromEntries(Object.entries(z.boss.res).map(([k,v])=>[k,+v]))}:{})});
    for(const [id,k] of Object.entries(c.sk||{})){const E=ENSK[id]; if(!E) continue; E.cd=+k.cd; if(k.ap!=null) E.ap=+k.ap; if(k.mult!=null) E.mult=+k.mult;
      (k.fx||[]).forEach((f,i)=>{if(E.fx&&E.fx[i]) for(const x of EFX) if(f[x]!=null) E.fx[i][x]=+f[x]}); SK[id]={id,...E}}
    if(c.enf) for(const k of ['hp','atk','def']) if(c.enf[k]) ENF[k]=c.enf[k].map(Number);
    if(c.diff) for(const d of ['hero','myth']) if(c.diff[d]) Object.assign(DIFF[d],Object.fromEntries(Object.entries(c.diff[d]).map(([k,v])=>[k,+v])));
  }
}
const BEST_KEY=KP+'best';
{const r=lsGet(BEST_KEY); if(r){try{applyBest(JSON.parse(r))}catch(e){}}}
async function bestLoad(){
  try{ const d=await FB.db.collection(COL('config')).doc('bestiary').get(); if(d.exists&&d.data().json){ lsSet(BEST_KEY,d.data().json); applyBest(JSON.parse(d.data().json)); FB.bestTs=d.data().ts||null } }catch(e){}
}
const UPD_T='Mise à jour {version} : {titre}';
const UPD_B='Bonjour {joueur} !\n\nLa version {version} de Cendrelame est en ligne : « {titre} ».\n\nAu programme :\n{resume}\n\nRetrouvez le détail dans le menu Nouveautés. Rafraîchissez la page si le jeu vous le propose.\n\nBon jeu !';
const UPDM={loaded:false,auto:false,last:null,title:UPD_T,body:UPD_B,busy:false,msg:'',err:false};
const updResume=()=>PATCH[0].sec.flatMap(x=>x[1]).slice(0,3).map(l=>'• '+(l.length>140?l.slice(0,138)+'…':l)).join('\n');
const updFill=s=>String(s||'').replace(/\{version\}/g,PATCH[0].v).replace(/\{titre\}/g,PATCH[0].t).replace(/\{resume\}/g,updResume());
const mlName=()=>(FB.prof&&FB.prof.name)||(S&&S.heroes&&S.heroes[0]&&S.heroes[0].name)||'aventurier';
const mlPers=s=>String(s||'').replace(/\{joueur\}/g,mlName());
async function updLoad(){ try{ const d=await FB.db.collection(COL('config')).doc('updmsg').get(); const x=d.exists?d.data():{}; Object.assign(UPDM,{loaded:true,auto:!!x.auto,last:x.last||null,title:x.title||UPD_T,body:x.body||UPD_B}) }catch(e){ UPDM.loaded=true; UPDM.err=true; UPDM.msg='Lecture impossible : '+((e&&e.code)||'erreur')+' (règle config).' } }
async function updSend(manual){
  if(!FB.admin||UPDM.busy) return false; UPDM.busy=true; UPDM.msg=manual?'Envoi…':''; UPDM.err=false; if(manual) render();
  const ref=FB.db.collection(COL('config')).doc('updmsg'),v=VERSION;
  try{
    const ok=await FB.db.runTransaction(async tx=>{ const d=await tx.get(ref),x=d.exists?d.data():{}; if(!manual&&(!x.auto||x.last===v)) return false; tx.set(ref,{last:v,lastTs:Date.now(),by:FB.user.uid},{merge:true}); return true });
    if(ok){ await mlCol().add({to:'all',kind:'info',title:updFill(UPDM.title).slice(0,80),body:updFill(UPDM.body).slice(0,2000),att:{},from:'L’équipe Cendrelame',ts:firebase.firestore.FieldValue.serverTimestamp(),tsMs:Date.now(),exp:0,by:FB.user.uid,upd:v}); UPDM.last=v; UPDM.msg='Annonce de la version '+v+' envoyée à tous les joueurs.'; if(!manual) toast('Annonce de la mise à jour '+v+' envoyée à tous les joueurs.') }
    UPDM.busy=false; if(manual||ok) render(); return ok;
  }catch(e){ UPDM.busy=false; UPDM.err=true; UPDM.msg='Erreur : '+((e&&e.code)||'inconnue')+' (vérifiez les règles Firestore config et mail).'; render(); return false }
}
async function updSave(patch){ Object.assign(UPDM,patch); try{ await FB.db.collection(COL('config')).doc('updmsg').set({auto:UPDM.auto,title:UPDM.title,body:UPDM.body},{merge:true}); UPDM.err=false }catch(e){ UPDM.err=true; UPDM.msg='Enregistrement impossible : '+((e&&e.code)||'erreur')+'.' } }
async function updAuto(){ if(!FB.admin) return; await updLoad(); if(UPDM.auto&&UPDM.last!==VERSION) await updSend(false) }
function updCardHTML(){
  if(!UPDM.loaded){ setTimeout(()=>{ if(!UPDM.loaded) updLoad().then(()=>{ if(UI.scr==='admin') render() }) },0); return admCard('send','Annonce de mise à jour','Chargement…','<p class="hint">Lecture des réglages…</p>') }
  const v=VERSION,done=UPDM.last===v,K=ML_K.info;
  const st=`<div class="updst ${done?'':'wait'}">${uic(done?'check':'info')}<span>Dernière annonce : <b>${esc(UPDM.last||'aucune')}</b> · version actuelle : <b>${v}</b>${done?' · déjà annoncée.':UPDM.auto?' → l’annonce partira à la prochaine ouverture du jeu par un administrateur.':' → envoi automatique désactivé.'}</span></div>`;
  const card=admCard('send','Annonce de mise à jour','Message automatique envoyé à tous les joueurs à chaque nouvelle version',`<div class="updc">
    <div class="row2"><span class="lab"><b>Envoi automatique</b><small>À la 1re ouverture du jeu par un administrateur après une nouvelle version, le message part tout seul (une seule fois par version).</small></span><button class="sw ${UPDM.auto?'':'off'}" data-act="updAuto" role="switch" aria-checked="${UPDM.auto}" ${ttip(UPDM.auto?'Désactiver l’envoi automatique':'Activer l’envoi automatique')}></button></div>${st}
    <label><b>Titre</b><input class="pcsel" data-upd="title" maxlength="80" value="${esc(UPDM.title)}"></label>
    <label><b>Message</b><textarea class="pcsel" rows="9" data-upd="body" maxlength="2000">${esc(UPDM.body)}</textarea></label>
    <div class="vars"><small class="mute">Variables :</small><code ${ttip('{version}','Numéro de la version actuelle.')}>{version}</code><code ${ttip('{titre}','Titre de la note de mise à jour.')}>{titre}</code><code ${ttip('{resume}','Les 3 premiers changements de la note.')}>{resume}</code><code ${ttip('{joueur}','Nom du joueur qui lit le message.')}>{joueur}</code></div>
    ${UPDM.msg?`<p class="${UPDM.err?'lerr':'hint'}">${esc(UPDM.msg)}</p>`:''}
    <div class="row" style="margin-top:8px"><button class="btn pri" data-act="updSendNow" ${UPDM.busy?'disabled':''}>${uic('send')} Envoyer maintenant (${v})</button><button class="btn sm" data-act="updDef">Message par défaut</button></div></div>`);
  const prev=`<div class="updprev"><small class="mute">Aperçu dans la messagerie des joueurs</small><article class="mlread" style="--kc:${K[0]}"><header><span class="mlic big">${uic(K[2])}</span><div><small>${K[1]} · ${mlDate(Date.now())}</small><h2>${esc(mlPers(updFill(UPDM.title)))}</h2><small>De : L’équipe Cendrelame</small></div></header><p>${esc(mlPers(updFill(UPDM.body))).replace(/\n/g,'<br>')}</p></article></div>`;
  return `<div class="updgrid">${card}${prev}</div>`;
}
document.addEventListener('input',e=>{ const k=e.target.dataset&&e.target.dataset.upd; if(!k) return; UPDM[k]=e.target.value; clearTimeout(UPDM.t); UPDM.t=setTimeout(()=>{ updSave({}); const pv=$('.updprev'); if(pv){ pv.querySelector('h2').textContent=mlPers(updFill(UPDM.title)); pv.querySelector('p').innerHTML=esc(mlPers(updFill(UPDM.body))).replace(/\n/g,'<br>') } },400) });
async function adminCheck(){
  FB.admin=false; if(!FB.user) return;
  try{ const d=await FB.db.collection(COL('config')).doc('admin').get(); FB.admin=!!(d.exists&&(d.data().uids||[]).includes(FB.user.uid)) }catch(e){}
}
const ROLE_N={atk:'Physique',mag:'Magique'};
const skDescE=id=>{const k=ENSK[id]; if(!k) return ''; const t=[]; if(k.ap) t.push(k.ap+' PA'); if(k.el&&ELEM[k.el]) t.push(ELEM[k.el].n); if(k.mult) t.push(`${Math.round(k.mult*100)} % de l’attaque`+(k.tg==='all'?' sur tous':''));
  for(const f of k.fx||[]){ if(f.k==='dot') t.push(`${f.n} ${Math.round(f.v*100)} % / tour, ${f.dur} tours`); else if(f.k==='stun') t.push(`${f.ch} % d’étourdir ${f.dur} tour`); else if(f.k==='heal') t.push(`soigne un allié (×${f.v})`); else if(f.k==='buff') t.push(`+${f.v} % ${f.stat==='atk'?'attaque':f.stat} aux alliés, ${f.dur} tours`); else if(f.k==='debuff') t.push(`${f.v} % ${f.stat==='def'?'défense':f.stat}, ${f.dur} tours`) }
  return t.join(' · ')+` · recharge ${k.cd}`};
function bestCalc(t,isBoss,zi){
  const dk=UI.bdiff||'normal',D=DIFF[dk],st=isBoss?10:(UI.bstage||5),L=D.L||zi*10+st;
  const hp=Math.round(enStat('hp',L)*t.hp*(isBoss?.8*D.bHp:D.hp)),atk=enStat('atk',L)*t.atk*(isBoss?.88*D.bAtk:D.atk),def=enStat('def',L)*t.def*(isBoss?D.bDef:1),spd=(8+.15*L)*(t.spd||1);
  let cmp='';
  if(S&&S.heroes&&S.heroes[0]){ const h=S.heroes[0],hs=heroStats(h),mag=CLASSES[h.cls].role==='mag',ha=mag?hs.mag:hs.atk,ed=mag?def*.9:def,Kh=100+15*h.lvl,dh=Math.max(1,ha*Kh/(Kh+ed));
    const Ke=100+15*L,hd=t.role==='mag'?hs.res:hs.def,de=Math.max(1,atk*Ke/(Ke+hd)),n1=Math.ceil(hp/dh),n2=Math.ceil(hs.hp/de);
    cmp=`<div class="bcmp ${n1<=n2?'ok':'bad'}"><span>Vous : <b>${n1}</b> coup${n1>1?'s':''}</span><span>Lui : <b>${n2}</b> coup${n2>1?'s':''}</span></div>` }
  return `<div class="bvals"><span><small>PV</small><b>${fmt(hp)}</b></span><span><small>${t.role==='mag'?'INT':'ATQ'}</small><b>${fmt(Math.round(atk))}</b></span><span><small>DEF</small><b>${fmt(Math.round(def))}</b></span><span><small>VIT</small><b>${r1(spd)}</b></span></div><small class="mute">Niveau ${L}</small>${cmp}`;
}
function bestCard(zi,j){
  const Z=ZONES[zi],boss=j<0,t=boss?Z.boss:Z.enemies[j],key=zi+'.'+(boss?'b':j),w=boss?UI.bw.zones[zi].boss:UI.bw.zones[zi].enemies[j];
  const inp=(k,lab,step)=>`<label><span>${lab}</span><input type="number" step="${step}" min="0" data-bf="z.${key}.${k}" value="${w[k]}"></label>`;
  const extra=boss&&DIFF[UI.bdiff||'normal'].extra;
  return `<article class="bcard ${boss?'boss':''}"><header><span class="bic">${icon(t.ic)}</span><div><b>${esc(t.n)}</b><small>${boss?'Boss · ':''}${ROLE_N[t.role]||t.role}</small></div><button class="btn sm" data-act="bestTest" data-k="${key}" title="Lancer un combat de test contre cet ennemi">⚔ Tester</button></header>
    <div class="binp">${inp('hp','PV ×',.05)}${inp('atk','Attaque ×',.05)}${inp('def','Défense ×',.05)}${inp('spd','Vitesse ×',.05)}</div>
    <details class="bres"><summary>Résistances ${RES_K.filter(k=>w.res&&w.res[k]).map(k=>`<em>${RES_S[k]} ${w.res[k]}%</em>`).join('')}</summary><div class="binp b3">${RES_K.map(k=>`<label><span>${RES_S[k]} %</span><input type="number" step="5" min="-100" max="75" data-bf="z.${key}.res.${k}" value="${(w.res&&w.res[k])||0}"></label>`).join('')}</div></details>
    <div data-bstat="${key}">${bestCalc(t,boss,zi)}</div>
    <div class="bsk">${Object.keys(ENSK).map(id=>`<button class="bchip ${w.sk.includes(id)?'on':''}" data-act="bestSk" data-k="${key}" data-s="${id}" title="${esc(skDescE(id))}">${esc(ENSK[id].n)}</button>`).join('')}${extra?`<span class="bchip lock" title="Ajoutée par la difficulté">${esc(ENSK[extra].n)} (difficulté)</span>`:''}</div></article>`;
}
function viewBest(){
  if(!UI.bw) UI.bw=bestSnap();
  const dk=UI.bdiff||'normal',W=UI.bw;
  const zones=ZONES.map((z,i)=>`<section class="bzone"><h3>${esc(z.n)} <small class="mute">· niveaux ${i*10+1} à ${i*10+10}</small></h3><div class="bgrid">${z.enemies.map((_,j)=>bestCard(i,j)).join('')}${bestCard(i,-1)}</div></section>`).join('');
  const skRows=Object.entries(ENSK).map(([id,k])=>{const w=W.sk[id];return `<tr><td><b>${esc(k.n)}</b><br><small class="mute">${esc(skDescE(id))}</small></td>
    <td><input type="number" step="1" min="0" max="10" data-bf="s.${id}.ap" value="${w.ap||0}"></td><td><input type="number" step="1" min="0" data-bf="s.${id}.cd" value="${w.cd}"></td>
    <td>${w.mult==null?'—':`<input type="number" step=".05" min="0" data-bf="s.${id}.mult" value="${w.mult}">`}</td>
    <td>${(w.fx||[]).map((f,i)=>EFX.filter(x=>f[x]!=null).map(x=>`<label class="bfx"><span>${x==='v'?'Valeur':x==='dur'?'Durée':'Chance %'}</span><input type="number" step="${x==='v'&&Math.abs(f[x])<5?'.05':'1'}" data-bf="s.${id}.fx.${i}.${x}" value="${f[x]}"></label>`).join('')).join('')||'—'}</td></tr>`}).join('');
  const enfRows=['hp','atk','def'].map(k=>`<tr><td><b>${k==='hp'?'PV':k==='atk'?'Attaque':'Défense'}</b></td>${[0,1,2].map(i=>`<td><input type="number" step="${i===2?'.01':'.1'}" data-bf="e.${k}.${i}" value="${W.enf[k][i]}"></td>`).join('')}</tr>`).join('');
  const dfRows=['hero','myth'].map(d=>`<tr><td><b>${DIFF[d].n}</b></td>${['hp','atk','bHp','bAtk','bDef','rage'].map(k=>`<td><input type="number" step="${k==='rage'?1:.05}" data-bf="d.${d}.${k}" value="${W.diff[d][k]}"></td>`).join('')}</tr>`).join('');
  return `<div class="scrhead"><h2>Bestiaire</h2><div class="row">${UI.bdirty?'<span class="bdirty">Modifications non publiées</span>':''}<button class="btn pri" data-act="bestPub" ${FB.admin?'':'disabled'}>Publier pour tous les joueurs</button><button class="btn" data-act="bestUndo">Annuler les modifications</button><button class="btn" data-act="bestDef">Valeurs d’origine</button>${backBtn('opts')}</div></div>
    <p class="hint" style="margin-bottom:12px">Les changements s’appliquent tout de suite sur votre appareil pour tester. « Publier » les envoie à tous les joueurs (au prochain chargement du jeu). Survolez une compétence pour voir son effet ; cliquez pour l’ajouter ou la retirer.</p>
    <div class="bbar"><label>Difficulté <select id="bdiff">${Object.entries(DIFF).map(([k,d])=>`<option value="${k}" ${k===dk?'selected':''}>${d.n}</option>`).join('')}</select></label>
      ${dk==='normal'?`<label>Étape des monstres <input type="range" id="bstage" min="1" max="9" value="${UI.bstage||5}"><b>${UI.bstage||5}</b></label>`:`<span class="mute">Monstres niveau ${DIFF[dk].L}</span>`}
      <span class="mute">${S&&S.heroes&&S.heroes[0]?`Comparaison avec ${esc(S.heroes[0].name)} (niveau ${S.heroes[0].lvl}) : coups pour vaincre l’ennemi / coups qu’il lui faut pour vous vaincre.`:'Chargez un personnage pour voir la comparaison avec votre héros.'}</span></div>
    ${zones}
    <section class="panel" style="margin-top:18px"><h3 style="margin-bottom:8px">Compétences des ennemis</h3><div class="btable"><table><thead><tr><th>Compétence</th><th>PA</th><th>Recharge</th><th>Dégâts ×</th><th>Effets</th></tr></thead><tbody>${skRows}</tbody></table></div></section>
    <div class="grid g2" style="margin-top:14px">
      <section class="panel"><h3 style="margin-bottom:6px">Formules de niveau</h3><p class="hint" style="margin-bottom:8px">Valeur = base + par niveau × niveau + quadratique × niveau².</p><div class="btable"><table><thead><tr><th></th><th>Base</th><th>Par niveau</th><th>Quadratique</th></tr></thead><tbody>${enfRows}</tbody></table></div></section>
      <section class="panel"><h3 style="margin-bottom:6px">Difficultés</h3><p class="hint" style="margin-bottom:8px">Multiplicateurs des monstres, des boss, et tour où les boss entrent en rage.</p><div class="btable"><table><thead><tr><th></th><th>PV</th><th>ATQ</th><th>PV boss</th><th>ATQ boss</th><th>DEF boss</th><th>Rage</th></tr></thead><tbody>${dfRows}</tbody></table></div></section>
    </div>`;
}
function bestSet(path,val){
  const p=path.split('.'),W=UI.bw,v=val===''?0:+val; if(!isFinite(v)) return;
  if(p[0]==='z'){const z=W.zones[+p[1]],o=p[2]==='b'?z.boss:z.enemies[+p[2]]; if(p[3]==='res'){o.res=o.res||{}; o.res[p[4]]=v} else o[p[3]]=v}
  else if(p[0]==='s'){const k=W.sk[p[1]]; if(p[2]==='fx') k.fx[+p[3]][p[4]]=v; else k[p[2]]=v}
  else if(p[0]==='e'){W.enf[p[1]][+p[2]]=v}
  else if(p[0]==='d'){W.diff[p[1]][p[2]]=v}
  applyBest(UI.bw); UI.bdirty=true;
}
function bestRefreshStats(){
  document.querySelectorAll('[data-bstat]').forEach(el=>{const [zi,j]=el.dataset.bstat.split('.'),Z=ZONES[+zi],b=j==='b';el.innerHTML=bestCalc(b?Z.boss:Z.enemies[+j],b,+zi)});
  const d=$('.bdirty'); if(!d&&UI.bdirty){const r=$('.scrhead .row'); if(r) r.insertAdjacentHTML('afterbegin','<span class="bdirty">Modifications non publiées</span>')}
}

