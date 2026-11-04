/* Cendrelame · ui/sprites-et-selection.js */
/* ================= Sprites des héros (fichiers du dossier sprites/) ================= */
const SPRITES={mage:[{id:'mage_f',src:'assets/img/sprites/mage_f.webp',n:'Apparence 1'},{id:'mage_m',src:'assets/img/sprites/mage_m.webp',n:'Apparence 2'}],guerrier:[{id:'guerrier_m',src:'assets/img/classes/apparences/guerrier_m.png',n:'Apparence 1'},{id:'guerrier_f',src:'assets/img/classes/apparences/guerrier_f.png',n:'Apparence 2'}]};
const skinsOf=cls=>SPRITES[cls]||[];
const skinOf=(cls,id)=>{const L=skinsOf(cls);return L.find(s=>s.id===id)||L[0]||null};
/* image en pied ; repli sur le portrait si aucun sprite (ou fichier introuvable) */
function heroArt(cls,skin,cl=''){
  const s=skinOf(cls,skin),P=PORTRAIT[cls]||'';
  if(!s) return `<span class="hart port ${cl}"><img src="${P}" alt=""></span>`;
  return `<span class="hart ${cl}"><img src="${s.src}" alt="" onerror="this.onerror=null;this.src='${P}';this.parentNode.classList.add('port')"></span>`;
}
/* ---------- sélection : cartes verticales ---------- */
function viewSelect(){
  const n=Array.from({length:MAXCH},(_,i)=>charSum(i)).filter(Boolean).length;
  const cards=Array.from({length:MAXCH},(_,i)=>{
    const c=charSum(i);
    if(!c) return `<button class="sel5 empty" data-act="newChar" data-i="${i}"><b>+</b><span>Créer un personnage</span><small>Emplacement ${i+1}</small></button>`;
    const C0=CLASSES[c.cls]||CLASSES.guerrier,cf=UI.confirm==='delc'+i;
    return `<article class="sel5 ${ACC.cur===i?'cur':''}" data-sel="${i}" title="Double-cliquez pour jouer">${heroArt(c.cls,c.skin)}
      <div class="sel5cap">${ACC.cur===i?'<small class="sel5now">Personnage actuel</small>':''}<h3>${esc(c.name)}</h3><span>${C0.n} · niveau ${c.lvl}${c.stars?' · '+'★'.repeat(c.stars):''}</span>
       <div class="sel5btn">${cf?`<button class="btn sm danger" data-act="delChar" data-i="${i}">Confirmer</button><button class="btn sm" data-act="noConfirm">Annuler</button>`:`<button class="btn pri" data-act="playChar" data-i="${i}">Jouer</button><button class="btn sm" data-act="delChar" data-i="${i}">Supprimer</button>`}</div>
       ${cf?'<small class="sel5warn">Personnage, inventaire, matériaux et progression seront effacés.</small>':''}</div></article>`;
  }).join('');
  return `<div class="scrhead"><h2>Vos héros</h2><div class="row" style="gap:14px"><span class="sel5or">Or partagé : <b class="num">${fmt(ACC.gold)}</b> · ${n} / ${MAXCH} emplacements</span>${backBtn()}</div></div>
    <div class="sel5g">${cards}</div>`;
}
/* ---------- création : registre ---------- */
function viewCreator(){
  if(!CLASSES[UI.cc]) UI.cc='guerrier';
  const k=UI.cc,c=CLASSES[k],sk=skinsOf(k); if(sk.length&&!sk.find(s=>s.id===UI.cskin)) UI.cskin=sk[0].id;
  const mx={hp:Math.max(...Object.values(CLASSES).map(x=>x.base.hp)),a:Math.max(...Object.values(CLASSES).map(x=>Math.max(x.base.atk||0,x.base.mag||0))),def:Math.max(...Object.values(CLASSES).map(x=>x.base.def)),spd:Math.max(...Object.values(CLASSES).map(x=>x.base.spd))};
  const ms=c.role==='mag'?['Intelligence',c.base.mag]:['Force',c.base.atk];
  const st=[['PV',c.base.hp,mx.hp],[ms[0],ms[1],mx.a],['Défense',c.base.def,mx.def],['Vitesse',c.base.spd,mx.spd]].map(([n,v,m])=>`<span>${n}</span><i><b style="width:${Math.round(v/m*90)}%"></b></i><em class="num">${v}</em>`).join('');
  const cls=Object.entries(CLASSES).map(([id,x])=>`<button class="clsb ${k===id?'on':''}" data-act="pickClass" data-c="${id}" aria-pressed="${k===id}"><img src="${PORTRAIT[id]||''}" alt=""><span><b>${x.n}</b></span></button>`).join('');
  const skins=sk.length?`<h3>Apparence</h3><div class="ccth">${sk.map(s=>`<button class="ccthb ${UI.cskin===s.id?'on':''}" data-act="pickSkin" data-s="${s.id}" aria-pressed="${UI.cskin===s.id}" title="${s.n}">${heroArt(k,s.id)}</button>`).join('')}</div>`:`<h3>Apparence</h3><p class="mute ccnone">D’autres apparences arriveront pour le ${c.n}.</p>`;
  const specs=Object.values(c.specs||{}).map(sp=>{const act=sp.nodes.filter(n=>n.t==='a'&&!n.u).map(n=>n.n),ult={n:sp.nodes.filter(n=>n.u).map(n=>n.n).join(', ')};
    return `<article class="ccsp" style="--sc:${sp.co}"><header><span class="ccspi">${spIcon(sp)}</span><b>${esc(sp.n)}</b></header><p>${esc(sp.d||'')}</p><small><b>Compétences :</b> ${act.map(esc).join(', ')||'—'}</small>${ult.n?`<small><b>Ultimes (1 au choix) :</b> ${esc(ult.n)}</small>`:''}</article>`}).join('');
  return `<div class="ccbook"><section class="ccl">
     <div class="row between"><h2>Registre des héros</h2>${backBtn('select')}</div><p class="mute" style="margin:0">Inscrivez votre nom et choisissez votre voie.</p>
     <h3>Nom</h3><input type="text" id="cname" maxlength="18" placeholder="Ex. Aldéric" value="${esc(UI.cname||'')}" aria-label="Nom du héros">
     <h3>Classe</h3><div class="ccls">${cls}</div>
     ${skins}
     <h3>Statistiques de départ</h3><div class="ccstat">${st}</div>
     <h3>Spécialisations <small class="mute">choix au niveau 10</small></h3><div class="ccsps">${specs}</div>
</section>
    <section class="ccr">${heroArt(k,UI.cskin,'big')}<div class="ccrcap"><b>${c.n}</b><button class="btn pri ccgo" data-act="createHero">Créer le personnage</button></div></section></div>`;
}

/* ===== détection d'une nouvelle version déployée ===== */
const UPD={found:false,busy:false};
async function updCheck(){
  if(UPD.found||UPD.busy||!/^https?:$/.test(location.protocol)) return; UPD.busy=true;
  try{ const r=await fetch(new URL('js/version.js?v='+Date.now(),document.baseURI),{cache:'no-store'}); if(r.ok){ const t=await r.text(),m=t.match(/const BUILD='(\d+)'/); if(m&&m[1]!==BUILD&&m[1]>BUILD) updShow(t.match(/const VERSION='(\d[^']*)'/)) } }catch(e){}
  UPD.busy=false;
}
function updShow(vm){ UPD.found=true; const b=$('#updbar'); if(!b) return; if(vm&&vm[1]&&vm[1]!==VERSION) b.querySelector('b').textContent=`La version ${vm[1]} de Cendrelame est disponible.`; b.hidden=false; document.body.classList.add('hasupd') }
setInterval(updCheck,120000); setTimeout(updCheck,15000);
document.addEventListener('visibilitychange',()=>{ if(!document.hidden) updCheck() });

