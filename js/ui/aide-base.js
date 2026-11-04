/* Cendrelame · ui/aide-base.js */
/* --- aide --- */
function viewHelp(){
  const T=(head,rows)=>`<div class="htab"><table><thead><tr>${head.map(h=>`<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map((c,i)=>i?`<td>${c}</td>`:`<th scope="row">${c}</th>`).join('')}</tr>`).join('')}</tbody></table></div>`;
  const sec=(t,body,open)=>`<details class="hsec" ${open?'open':''}><summary>${t}</summary><div class="hbody">${body}</div></details>`;
  const stats=T(['Statistique','Effet','Détails'],[
    ['PV','Points de vie.','À 0, l’unité est vaincue. Vos PV sont entièrement restaurés après chaque combat.'],
    ['Force','Dégâts du Guerrier.','Toutes les attaques et compétences du Guerrier se basent sur la Force. Le Sorcier n’a pas de Force.'],
    ['Intelligence','Dégâts du Sorcier.','Toutes les attaques, brûlures et barrières du Sorcier se basent sur l’Intelligence. Le Guerrier n’a pas d’Intelligence.'],
    ['Défense','Réduit les dégâts physiques reçus.','Dégâts reçus × K / (K + Défense), avec K = 100 + 15 × niveau de l’attaquant. La Défense protège donc moins contre les ennemis de haut niveau.'],
    ['Défense magique','Réduit les dégâts magiques reçus.','Même formule que la Défense, contre les ennemis qui utilisent la magie (chamans, nécromanciens, sorcières, mages de braise, oracles, Seigneur de Cendre).'],
    ['Points d’action (PA)','Énergie pour lancer les compétences.','5 PA de base pour chaque classe. Chaque compétence coûte des PA (l’attaque de base est gratuite, une fois par tour) et tous vos PA sont rechargés au début de chacun de vos tours. Vous pouvez enchaîner plusieurs actions dans le même tour tant qu’il vous reste des PA, puis appuyer sur « Fin de tour ». Barre jaune segmentée sous la barre de vie.'],
    ['Résistance physique','Réduit les dégâts physiques reçus en %.','S’applique après la Défense. Plafonnée à 50 %.'],
    ['Résistance magique','Réduit les dégâts magiques reçus en %.','S’applique après la Défense magique. Plafonnée à 50 %.'],
    ['Résistances élémentaires','Feu, Glace, Foudre, Terre.','Réduisent en % les dégâts des compétences de cet élément (brûlures comprises). Plafonnées à 50 %. Une résistance négative est une faiblesse : les dégâts sont augmentés.'],
    ['Vitesse','Ordre d’action.','À chaque tour, les unités agissent de la plus rapide à la plus lente.'],
    ['Critique','Chance de coup critique.','5 % de base, plafonnée à 70 %. Un coup critique multiplie les dégâts par les Dégâts critiques.'],
    ['Dégâts critiques','Puissance des critiques.','150 % de base, plafonnés à 300 % : un critique inflige de 1,5 à 3 fois les dégâts.'],
    ['Esquive','Chance d’éviter une attaque.','L’attaque est annulée entièrement. Plafonnée à 30 %.'],
    ['Vol de vie','Soin sur les dégâts infligés.','Rend ce pourcentage des dégâts infligés en PV. Plafonné à 20 %.'],
    ['Dégâts bonus','Augmente tous vos dégâts.','+X % appliqué après la réduction par la Défense ou la Résistance.'],
    ['PV %','Augmente vos PV max.','S’applique sur le total (base + équipement).'],
    ['Or trouvé','Plus d’or en fin de combat.','+X % d’or gagné après une victoire.'],
    ['Puissance','Score global.','Indicateur qui résume vos statistiques pour comparer deux équipements (▲ / ▼ dans les infobulles). Il n’a pas d’effet en combat.'],
  ]);
  const dmg=`<p>Pour chaque coup : <b>stat d’attaque × multiplicateur de la compétence × K / (K + Défense ou Résistance de la cible)</b>, puis :</p>
    <ul><li>× (1 + Dégâts bonus) ;</li><li>× (1 − Résistance physique ou magique de la cible) ;</li><li>× (1 − Résistance à l’élément de la compétence, si elle en a un) ;</li><li>× un tirage aléatoire entre 92 % et 108 % ;</li><li>× Dégâts critiques en cas de coup critique ;</li><li>minimum 1 dégât.</li></ul>
    <p>K vaut 100 + 15 × niveau de l’attaquant. Les boucliers absorbent les dégâts avant les PV. Une Esquive réussie annule le coup.</p>`;
  const aff=T(['Effet','Type','Fonctionnement'],[
    ['<span class="b-dot">Saignement</span>','Dégâts sur la durée','Inflige un pourcentage de la stat d’attaque du lanceur au début de chaque tour de la cible. Un nouveau Saignement remplace l’ancien.'],
    ['<span class="b-dot">Brûlure</span>','Dégâts sur la durée','Comme le Saignement. Appliquée par la Boule de feu ou par les ennemis de feu.'],
    ['<span class="b-dot">Poison</span>','Dégâts sur la durée','Comme le Saignement, souvent plus long (4 tours).'],
    ['<span class="b-stun">Étourdi</span>','Contrôle','La cible passe son prochain tour. Les boss n’ont que la moitié des chances d’être étourdis.'],
    ['<span class="b-stun">Paralysie</span>','Contrôle (2 tours)','À chaque tour, la cible a 50 % de chances de perdre son tour (plus avec le talent Choc nerveux). Les boss n’ont que la moitié des chances d’être paralysés.'],
    ['<span class="b-taunt">Provoque</span>','Contrôle','Les ennemis doivent attaquer l’unité qui provoque (Mur de boucliers du Guerrier).'],
    ['Bouclier','Protection','Absorbe des dégâts avant les PV, jusqu’à épuisement. Ne peut pas dépasser les PV max.'],
  ]);
  const buffs=T(['Effet','Valeur','Source'],[
    ['<span class="b-buff">FOR +X %</span>','+25 % (rang 1) pendant 3 tours','Cri de guerre (Guerrier) ; Hurlement des ennemis : +30 %.'],
    ['<span class="b-buff">FOR / INT +30 %</span>','3 tours','Potion de force ou d’intelligence.'],
    ['<span class="b-buff">DEF / RÉS +40 %</span>','3 tours','Potion de résistance.'],
    ['<span class="b-dot">DEF −30 %</span>','3 tours','Malédiction des sorcières et oracles (malus).'],
  ])+`<p class="hint">Les bonus et malus d’une même statistique s’additionnent, mais une statistique ne descend jamais sous 25 % de sa valeur. La durée diminue à la fin du tour de l’unité concernée. Les compétences gagnent +12 % d’efficacité par rang au-delà du premier.</p>`;
  const rage=T(['Mode','Monstres','Boss'],[
    ['Normal','Rage dès le tour 31 : +10 % de dégâts par tour','Pareil que les monstres'],
    ['Héroïque','Rage dès le tour 31','Rage dès le tour 11 : +8 % de dégâts par tour'],
    ['Mythique','Rage dès le tour 31','Rage dès le tour 9 : +8 % par tour, et la Frappe dévastatrice (230 % de dégâts)'],
  ]);
  const diff=T(['Mode','Niveau des monstres','Particularités','Récompenses'],[
    ['Normal','Zone × 10 + étape (1 à 50)','—','Normales'],
    ['Héroïque','50','Débloqué au niveau 50 du héros. Monstres et surtout boss bien plus forts','Boss : +50 % d’XP et d’or'],
    ['Mythique','60','Débloqué en atteignant le dernier boss héroïque','Or, XP et matériaux ×2 ; Prisme divin à 25 %'],
  ]);
  const pots=T(['Potion','Effet'],Object.values(POTS).map(p=>[p.n,p.d+(p.cls?` <small class="mute">(${CLASSES[p.cls].n})</small>`:'')]))
    +`<p class="hint">Les potions se boivent en combat (et pendant les 10 secondes de préparation) sans utiliser votre tour. Seules les potions placées dans le sac de combat peuvent être bues : remplissez-le depuis l’inventaire (bouton Combat), hors combat. Limites : 10 potions de vie, 3 de résistance, 3 de force ou d’intelligence, 2 d’action, 1 Élixir de savoir et 1 Philtre de fortune. Chaque potion a son propre temps de recharge : vie, résistance, force et intelligence 4 tours, action 6 tours. L’Élixir de savoir et le Philtre de fortune ne s’utilisent qu’une fois par combat.</p>`;
  const rar=T(['Rareté','Affixes','Multiplicateur de stats'],RAR.map((r,i)=>[`<span style="color:var(--r${i});font-weight:700">${r.n}</span>`,r.aff+(r.leg?' + pouvoir légendaire':'')+(r.max?' (au maximum de la plage)':''),'×'+String(r.m).replace('.',',')]))
    +`<p class="hint">Niveau d’objet : il augmente toutes les valeurs de l’objet. Chaque amélioration (+1 à +10) ajoute 3 % à toutes ses stats. Les armes donnent Force ou Intelligence en plus de leurs affixes ; les armures et les bijoux n’ont que des affixes.</p>`
    +T(['Affixe','Rareté','Chances (1er affixe, Guerrier)'],(()=>{const pool=affPool('guerrier'),tot=pool.reduce((x,a)=>x+a.w,0);return AFX.slice().sort((a,b)=>b.w-a.w).map(a=>[STAT_N[a.s]+(PCT.has(a.s)&&!/^r/.test(a.s)?' %':''),affTier(a.w),pool.includes(a)?r1(a.w/tot*100)+' %':'—'])})());
  const asc=`<p>L’ascension demande le niveau maximum (${MAXL}). Chaque étoile ajoute <b>+10 %</b> aux statistiques de base du héros (hors équipement). Palier n : ${fmt(5000)} × n or et 5 × n Prismes divins, jusqu’à 5 étoiles.</p>`;
  return `<h2 style="margin-bottom:4px">Aide</h2><p class="hint" style="margin-bottom:16px">Tout ce qu’il faut savoir sur les statistiques et les effets de combat. Cliquez sur une section pour l’ouvrir ou la fermer.</p>
    ${sec('Statistiques',stats,true)}${sec('Calcul des dégâts',dmg)}${sec('Afflictions et effets de contrôle',aff)}${sec('Bonus et malus',buffs)}
    ${sec('Rage des ennemis',rage)}${sec('Difficultés',diff)}${sec('Potions',pots)}${sec('Rareté et équipement',rar)}${sec('Ascension',asc)}`;
}

