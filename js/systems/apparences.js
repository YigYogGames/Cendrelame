/* Cendrelame · systems/apparences.js (0.8.17)
   Apparences supplémentaires du héros : déposez les PNG dans assets/img/skins/sorcier/ ou assets/img/skins/guerrier/,
   puis lancez outils\mettre-a-jour-images.bat. Chaque image devient une apparence (nom tiré du nom de fichier).
   Choix dans Communauté → Personnalisation → Apparence du héros.
   Pour l’instant tout est débloqué (test) : les conditions se mettront dans SKIN_COND. */
const SKIN_DIR={sorcier:'mage',mage:'mage',guerrier:'guerrier',paladin:'paladin'};
/* conditions de déblocage, à remplir plus tard. Exemple : sk_mage_pyromancien:()=>S.heroes[0].lvl>=30 */
const SKIN_COND={};
const SKIN_HOW={}; /* texte affiché quand une apparence est verrouillée, même clé que SKIN_COND */
const skinOk=id=>!SKIN_COND[id]||!!SKIN_COND[id]();
/* noms affichés (avec accents) ; sinon le nom vient du fichier */
const SKIN_NAMES={berserker:'Berserker',defenseur:'Défenseure',evocatrice:'Évocatrice',evocateur:'Évocateur',pyromancienne:'Pyromancienne',pyromancien:'Pyromancien',saison_1:'Saison 1',saison_1_b:'Saison 1 · variante 2',saison_1_c:'Saison 1 · variante 3',gardien_aube:'Gardien de l’Aube',heraut_jugement:'Héraut du Jugement'};
const skinName=f=>{ if(SKIN_NAMES[f]) return SKIN_NAMES[f]; const t=f.replace(/[_-]+/g,' ').trim(); return t.charAt(0).toUpperCase()+t.slice(1) };
(function skinLoad(){
  const L=(typeof IMG_PRESENTES!=='undefined'?IMG_PRESENTES:[]);
  for(const rel of L){ const m=/^skins\/([a-z]+)\/([a-z0-9_]+)\.png$/.exec(rel); if(!m) continue; /* seuls les noms en minuscules sans espaces sont pris */
    const cls=SKIN_DIR[m[1].toLowerCase()]; if(!cls||!SPRITES[cls]) continue;
    const id='sk_'+cls+'_'+imgSlug(m[2]); if(SPRITES[cls].some(s=>s.id===id)) continue;
    SPRITES[cls].push({id,src:imgSrc(rel),n:skinName(m[2]),extra:1}) }
})();
function skinPrev(){ const h=S.heroes[0],s=skinOf(h.cls,h.skin);
  return `<div class="skpv">${heroArt(h.cls,h.skin,'skart')}</div><small class="s8pl">Apparence actuelle : ${s?esc(s.n):'portrait de classe'}</small>` }
function skinTiles(tile){ const h=S.heroes[0],L=skinsOf(h.cls);
  if(!L.length) return `<div class="cu8wide"><p class="mute">Aucune apparence pour cette classe.</p></div>`;
  const cur=(skinOf(h.cls,h.skin)||{}).id;
  const T=s=>{ const ok=skinOk(s.id);
    return tile(cur===s.id,!ok,`<span class="skth"><img src="${s.src}" alt=""></span>`,esc(s.n),cur===s.id?'Équipée':ok?(s.extra?'Débloquée':'De base'):(SKIN_HOW[s.id]||'Verrouillée'),`data-act="skinSet" data-id="${s.id}"`,false,ttip(s.n,ok?'Cliquez pour l’équiper : elle s’affiche partout (accueil, combat, duel, carte).':(SKIN_HOW[s.id]||'Apparence verrouillée.'))) };
  const g=s=>!s.extra?'Base':/saison_(\d+)/.test(s.id)?'Saison '+s.id.match(/saison_(\d+)/)[1]:'Spécialisations';
  return ['Base','Spécialisations',...[...new Set(L.map(g))].filter(x=>/^Saison/.test(x)).sort()].map(n=>cu8Grp(n,L.filter(s=>g(s)===n).map(T).join(''))).join('')+
   `<div class="cu8wide"><small class="mute">Nouvelles apparences : déposez les images dans assets/img/skins/${h.cls==='mage'?'sorcier':h.cls}/.</small></div>` }
Object.assign(A,{ skinSet:d=>{ const h=S.heroes[0]; if(!skinOk(d.id)){ toast('Apparence verrouillée.'); return } h.skin=d.id; save(); render(); toast('Apparence équipée.') } });
