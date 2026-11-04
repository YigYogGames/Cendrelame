/* Cendrelame · ui/aide.js */
/* ---------- aide détaillée ---------- */
const _viewHelp0=viewHelp;
function help82(){
  const T=(head,rows)=>`<div class="htab"><table><thead><tr>${head.map(h=>`<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map((c,i)=>i?`<td>${c}</td>`:`<th scope="row">${c}</th>`).join('')}</tr>`).join('')}</tbody></table></div>`;
  const sec=(id,t,body)=>`<details class="hsec" id="h82_${id}" ${UI.h82===id?'open':''}><summary>${t}</summary><div class="hbody">${body}</div></details>`;
  const P=x=>`<p class="hint">${x}</p>`,rn=r=>`<span style="color:var(--r${r});font-weight:700">${RAR[r].n}</span>`,mul=m=>'×'+String(m).replace('.',','),num=v=>String(v).replace('.',',');
  const old=_viewHelp0(),blocks=old.split('<details class="hsec"').slice(1).map(s=>'<details class="hsec"'+s.replace(/\s*$/,''));
  const keep=blocks.slice(0,4).join('');
  const out=[];
  out.push(['rage','Rage des ennemis',T(['Mode','Monstres','Boss'],Object.entries(DIFF).map(([k,D])=>[D.n,'Rage dès le tour 31 : +10 % de dégâts par tour',`Rage dès le tour ${D.rage+1} : +8 % de dégâts par tour${D.extra?' et Frappe dévastatrice (230 % de dégâts)':''}`]).concat([['Défis','—',`Rage dès le tour ${RD_RAGE+1}`]]))]);
  out.push(['diff','Difficultés',T(['Mode','Niveau des monstres','Niveau d’objet du butin','Déblocage','Récompenses'],[
    ['Normal','Zone × 10 + étape (1 à 50)','Égal au niveau des monstres','—','Normales'],
    ['Héroïque',DIFF.hero.L,DIFF.hero.iL,`Niveau ${HERO_L} du héros`,'Boss : +50 % d’XP et d’or ; chances de butin ×1,5 et raretés plus hautes'],
    ['Mythique',DIFF.myth.L,DIFF.myth.iL,'Dernier boss héroïque vaincu',`Or, XP et matériaux ×${DIFF.myth.rw} ; chances de butin ×3 et raretés encore plus hautes ; Prisme divin à ${DIFF.myth.prism*100} % sur Le Dévoreur`],
    ['Défis','25 à 50 selon le boss','65 (paliers +0 à +9), 70 (palier +10 et plus)','Niveau requis du boss','Équipement garanti, Cristal d’ascension, coffre']])
    +P(`Le niveau d’objet du butin ne dépasse jamais 70. Le niveau requis pour porter un objet reste plafonné à ${MAXL}. Un Cristal d’ascension peut ensuite ajouter +5 niveaux d’objet, une seule fois par objet.`)]);
  out.push(['loot','Butin de l’aventure',ZONES.map((Zn,z)=>{const Z=zLoot(z),tot=Z.rw.reduce((a,b)=>a+b,0);
    return `<h4>${esc(Zn.n)} <small class="mute">· équipement ${num(Z.eq)} % par combat (boss : ${num(Math.min(95,Z.eq*3))} %)</small></h4>`
     +T(['Rareté',...Z.rw.map((w,r)=>w?RAR[r].n:null).filter(Boolean)],[['Part de l’équipement',...Z.rw.filter(Boolean).map(w=>pc82(w/tot*100))]])
     +T(['Objet','Rareté','Chance par combat','Boss (×3)'],Z.it.map(([k,p])=>[`${tIc82(k)}${esc(MAT_OBJ[k])}`,rn(nwR(k)),pc82(p),pc82(Math.min(95,p*3))]))}).join('')
    +P('Chaque objet est tiré séparément (plusieurs objets possibles dans le même combat). Le Philtre de fortune ajoute +50 % à toutes les chances, et le mode Mythique les double. Les chances sont plafonnées à 95 %.')]);
  const pool=affPool('guerrier'),ptot=pool.reduce((x,a)=>x+a.w,0);
  out.push(['rar','Rareté et affixes',T(['Rareté','Puissance','Obtention','Affixe bonus','Particularité'],RAR.map((R,i)=>[rn(i),mul(R.m),i===5?'Prisme divin sur un objet légendaire':i===4?'Aventure (zones 2 à 5), défis, Pierre de rareté':i===0?'Aventure':'Aventure, défis, Pierre de rareté',i===2||i===3?'12 % de chance':'—',i===4?'1 pouvoir légendaire tiré au hasard (voir Pouvoirs légendaires)':i===5?'Affixes toujours au maximum de leur plage':'—']))
    +P('La puissance multiplie toutes les valeurs de l’objet (affixes et statistique fixe de l’arme). Chaque rareté ajoute 15 % des valeurs de base ; Divin ajoute 50 %.')
    +`<h4>Affixes</h4>`+P('Tout objet a 2 affixes principales : PV ou PV % et la statistique principale de votre classe (Force ou Intelligence). Les Rares et Épiques ont 12 % de chance d’avoir 1 affixe bonus en plus. Les parchemins ajoutent jusqu’à 3 affixes secondaires ; les anneaux peuvent recevoir en plus +1 Point d’action par Fusion.')
    +T(['Affixe','Rareté','Chance (affixe bonus, Guerrier)'],AFX.slice().sort((a,b)=>b.w-a.w).map(a=>[STAT_N[a.s]+(PCT.has(a.s)&&!/^r/.test(a.s)?' %':''),affTier(a.w),pool.includes(a)?pc82(a.w/ptot*100):'—']))
    +P('Valeur d’une affixe à l’obtention : entre 70 % et 100 % de son maximum au niveau de l’objet, multipliée par la puissance de la rareté.')]);
  const it50={ilvl:50,rarity:2,up:0},rows=UP_CH.map((p,i)=>[`+${i} → +${i+1}`,p+' %',stNeed({up:i}),fmt(upCostG.st({ilvl:50,up:i}))+' or']);
  out.push(['legp','Pouvoirs légendaires',T(['Pouvoir','Objet légendaire','Objet divin'],Object.values(LPW).map(p=>[esc(p.n),esc(p.D(1)),esc(p.D(p.fix?1:1.5))]))+P('Chaque objet légendaire reçoit un pouvoir au hasard. Le même pouvoir se cumule sur 3 objets au maximum (Moisson : 1). Les objets divins ont la version renforcée du pouvoir.')]);
  out.push(['slotf','Affixes selon l’emplacement',T(['Emplacement','Attaque (Force, Intelligence, critique, dégâts)','Vie et défense (PV, PV %, Défense)','Résistances'],[['Bijoux (anneaux, amulette)','×1,5','×0,75','×0,75'],['Armures (casque, torse, jambes, bottes)','×0,7','×1,15','×1,25'],['Arme','×1','×1','×1']])+P('Ce multiplicateur s’applique à la valeur des affixes, y compris celles ajoutées par parchemin ou par remodelage. Vitesse, esquive, vol de vie et or trouvé ne changent pas.')]);
  out.push(['forge','Forge : renforcer un objet',`<h4>Pierre de renforcement</h4>`+T(['Niveau','Réussite','Pierres','Or (objet niv. 50)'],rows)
    +P('Chaque niveau ajoute +3 % à toutes les statistiques de l’objet (+30 % à +10). En cas d’échec, les pierres et le bonus sont perdus mais l’objet reste intact.')
    +T(['Bonus de réussite','Effet'],[[esc(NEWI.ch_pou.n),'+'+NEWI.ch_pou.bon+' %'],[esc(NEWI.ch_tre.n),'+'+NEWI.ch_tre.bon+' %']])
    +`<h4>Pierres de rareté et Prisme divin</h4>`+T(['Objet','Rareté','Réussite','Or (objet niv. 50)'],[['gm_mag',0],['gm_rar',1],['gm_epi',2],['gm_leg',3]].map(([k,g])=>[`${tIc82(k)}${esc(MAT_OBJ[k])}`,`${RAR[g].n} → ${RAR[g+1].n}`,'100 %',fmt(upCostG.gem({ilvl:50,rarity:g}))+' or']).concat([[`${tIc82('prisme')}Prisme divin ×1 à ×10`,'Légendaire → Divin','10 % par prisme (10 = 100 %)',fmt(upCostG.gem({ilvl:50,rarity:4}))+' or']]))
    +P('Tous les prismes placés sont consommés, même en cas d’échec ; l’objet reste alors légendaire et intact.')
    +`<h4>Parchemins</h4>`+T(['Parchemin','Affixe obtenue'],Object.values(SC_T).map(S2=>[S2.n,esc(S2.d)]))+T(['Rareté du parchemin','Valeur de l’affixe'],[1,2,3,4].map(r=>[rn(r),Math.round(SC_R[r][0]*100)+' à '+Math.round(SC_R[r][1]*100)+' % du maximum']))
    +P(`Un parchemin ajoute toujours son affixe (100 %), si l’objet a encore un emplacement libre (3 au maximum). Coût : 100 or + 10 or par niveau d’objet.`)
    +`<h4>Améliorations légendaires</h4>`+T(['Objet','Effet','Limite'],[[`${tIc82('cr_asc')}${esc(NEWI.cr_asc.n)}`,'+5 niveaux d’objet, toutes les affixes recalculées','1 fois par objet'],[`${tIc82('fu_ap')}${esc(NEWI.fu_ap.n)}`,'+1 Point d’action (hors emplacements)','Anneaux, 1 fois']])]);
  out.push(['ench','Enchantement, fusion et recyclage',T(['Case','Objet','Rôle'],[['Haut','Parchemin vierge','Catalyseur (Marchand)'],['Gauche','Poudre runique ×3','Composant'],['Centre','Essence magique','Type : pierre → Robustesse, braise → Fureur, vent → Adresse'],['Droite','Rune','Rareté : mineure → Magique, majeure → Rare, ancienne → Épique, primordiale → Légendaire']])
    +P('Enchanter réussit toujours. Coût : 100 or (rune mineure) à 280 or (rune primordiale).')
    +T(['Fusion','Coût','Résultat'],[[esc(FUSE9[0].n),'10 Prismes divins, 3 Runes primordiales, 1 Parchemin vierge, 20 000 or',esc(NEWI.fu_ap.d)]])
    +P('Recycler un objet rend 25 % de ses matériaux et 1 Poudre runique par rareté (Commun 1, Magique 2… Divin 6).')]);
  out.push(['pot','Potions et sac de combat',T(['Potion','Effet','Recharge','Max dans le sac'],Object.entries(POTS).filter(([k])=>CB_LIM[k]).map(([k,p])=>[p.n,p.d,p.cd?p.cd+' tours':'1 fois par combat',CB_LIM[k]]))
    +P('Seules les potions du sac de combat peuvent être bues, sans utiliser votre tour (aussi pendant les 10 secondes de préparation). Remplissez le sac depuis l’inventaire, hors combat. La Potion d’oubli se boit depuis la page Personnage.')]);
  out.push(['tal','Compétences et talents',T(['Règle','Détail'],[['Points de compétence',`1 par niveau, ${SP_MAX} au maximum`],['Spécialisation',`Au niveau ${SPEC_L}, choix définitif entre deux arbres`],['Barre de sorts',`${LOADOUT_MAX} emplacements`],['Réinitialisation gratuite','1 par personnage : rembourse tous les points et la spécialisation'],['Potion d’oubli',`Réinitialisations suivantes : ${fmt(POTS.p_oubli.fix.gold)} or chez le Marchand`]])]);
  out.push(['raid','Défis',T(['Boss','Niveau','Requis','PV (palier +0)','Attaque (palier +0)','Compétences'],RAIDS.map(r=>{const b=soloBoss({r:r.id,t:0});return [esc(r.n),r.L,r.req,fmt(b.hp),fmt(Math.round(b.atk)),r.sk.map(id=>esc(SK[id].n)).join(', ')]}))
    +P(`Chaque victoire débloque le palier suivant : +5 % de PV, d’attaque et de défense par palier (cumulatif). Rage au tour ${RD_RAGE+1}. Cliquez sur l’icône Infos d’un boss pour voir ses statistiques au palier choisi.`)
    +T(['Palier','Équipement (garanti)','Rare','Épique','Légendaire','2ᵉ équipement','Cristal d’ascension','Remodelage','Coffre des Reliques'],[0,5,10,15,20].map(t=>{const W=RD_EQW(t),s=W.reduce((a,b)=>a+b,0);return ['+'+t,'niveau '+RD_IL(t),pc82(W[2]/s*100),pc82(W[3]/s*100),pc82(W[4]/s*100),pc82(rdG2(t)),pc82(ascCh(t)),pc82(rmCh(t)),pc82(chestRate(t))]}))
    +P('Équipement bonus : +2 % par palier (30 % au maximum). Runes, essences et cristaux : +5 % par palier. Récompenses en or, runes, essences et cristaux à chaque victoire, plus élevées à chaque palier. Pierre de remodelage : 5 % au palier +0, puis +0,75 % par palier (25 % au maximum).')]);
  out.push(['duel','Duels',T(['Règle','Détail'],[['Victoire',fmt(PVP_GOLD)+' or'],['PV en duel',`${num(PVP_HP)} × vos PV`],['Dégâts en duel',`−${Math.round((1-PVP_DMG)*100)} % sur tous les dégâts entre joueurs`],['Temps par tour',PVP_TURN+' secondes (un joueur inactif peut être déclaré perdant)']])
    +`<h4>Cosmétiques de duel</h4>`+T(['Cosmétique','Type','Rareté','Victoires'],DCOS.map(c=>[esc(c.n),COS_T[c.t],`<span style="color:${SRAR[c.r][1]}">${SRAR[c.r][0]}</span>`,c.w]))+P('Les cosmétiques de duel sont permanents : ils ne sont pas liés à la saison. Les victoires comptent sur tout votre compte.')]);
  out.push(['comp','Compagnon',T(['Ticket','Commune','Rare','Épique','Légendaire'],Object.entries(CP_DRAW).map(([k,W])=>[esc(MAT_OBJ[k]),...W.map(w=>w?num(w)+' %':'—')]))
    +T(['Qualité','Part des créatures'],[['S','≈ 0,5 %'],['A','≈ 6 %'],['B','≈ 23 %'],['C et D','le reste']])
    +P(`Shiny : ${num(CP_SHINY)} % de chance, qualité maximale partout et +15 % de statistiques. Évolution aux niveaux ${CP_EVO.join(' et ')} avec une Pierre d’évolution du type. Faim : −1 % par heure au repos, −2 % en expédition ; sous 75 %, la créature perd de 20 à 60 % de ses statistiques en expédition.`)]);
  out.push(['sea','Quêtes, saison et coffres',T(['Quêtes','Renouvellement'],[['Journalières (5)','Chaque jour à 6 h 00'],['Hebdomadaires (3)','Le mercredi à 6 h 00'],['Saison (10)','Toute la saison, sans renouvellement']])
    +T(['Coffre de saison',...SRAR.map(x=>x[0])],SCH_W.map((W,i)=>['Coffre '+SRAR[i][0].toLowerCase(),...W.map(w=>w?w+' %':'—')]))
    +P('Chaque coffre donne 1 cosmétique : un cosmétique que vous n’avez pas encore est toujours choisi en priorité.')
    +T(['Lot','Contenu'],Object.values(LOT8).map(L=>[esc(L.n),L.it.map(([m,a,b,p])=>`${esc(MAT_OBJ[m])} ×${a===b?a:a+'-'+b}${p<100?' ('+p+' %)':''}`).join(', ')]))]);
  out.push(['asc','Ascension',P(`L’ascension demande le niveau maximum (${MAXL}). Chaque étoile ajoute +10 % aux statistiques de base du héros (hors équipement), jusqu’à 5 étoiles. Étoile n : ${fmt(5000)} × n or et 5 × n Prismes divins.`)]);
  const toc=[['Statistiques','stat'],...out.map(([id,t])=>[t,id])];
  return `<h2 style="margin-bottom:4px">Aide</h2><p class="hint" style="margin-bottom:10px">Tout ce qu’il faut savoir sur le jeu : statistiques, butin, taux, Forge, défis… Cliquez sur une section pour l’ouvrir ou la fermer.</p>
   <nav class="h82toc" aria-label="Sommaire">${out.map(([id,t])=>`<button data-act="h82" data-id="${id}" class="${UI.h82===id?'on':''}">${t}</button>`).join('')}</nav>${keep}${out.map(([id,t,b])=>sec(id,t,b)).join('')}`;
}
viewHelp=help82;
MAT_D.prisme='Relique céleste, lâchée rarement par Le Dévoreur. À la Forge, placez de 1 à 10 prismes sur un objet légendaire pour le faire passer en Divin : 10 % de réussite par prisme. Sert aussi à l’ascension et à la Fusion légendaire.';

