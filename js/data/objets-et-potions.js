/* Cendrelame · data/objets-et-potions.js */
/* ============ données ============ */
const TEST=/\/test(\/|$|\/index\.html)/i.test(location.pathname)||/[?&]test=1\b/.test(location.search);
const KP=TEST?'cendrelame_TEST_':'cendrelame_';
const COL=n=>TEST?'test_'+n:n;
const SAVE_KEY=KP+'v1';
const SLOTS=['weapon','helm','armor','legs','boots','ring','ring2','amulet'];
const ITEM_SLOTS=['weapon','helm','armor','legs','boots','ring','amulet'];
const slotType=k=>k==='ring2'?'ring':k;
const SLOT_N={weapon:'Arme',helm:'Casque',armor:'Armure',legs:'Jambières',boots:'Bottes',ring:'Anneau',amulet:'Amulette',ring2:'Anneau (2)'};
const HARV=['fer','cuir','plante','cristal','essence'];
const MATS=['rune','prisme'];
const noHarv=c=>Object.fromEntries(Object.entries(c||{}).filter(([k])=>!HARV.includes(k)));
const MAT_N={fer:'Fer',cuir:'Cuir',plante:'Plante',cristal:'Cristal',essence:'Essence',rune:'Rune',prisme:'Prisme divin',gold:'Or'};
/* potions : objets 1x1 empilables, achetés chez le Marchand, utilisables en combat */
const POTS={
  p_vie1:{n:'Petite potion de vie',c:'#e8706a',p:15,d:'Rend 20 % des PV max.',cd:3},
  p_vie:{n:'Potion de vie',c:'#d8342b',p:30,d:'Rend 40 % des PV max.',cd:4},
  p_vie3:{n:'Grande potion de vie',c:'#a01818',p:75,d:'Rend 65 % des PV max.',cd:5},
  p_reg1:{n:'Potion de régénération',c:'#5ac87a',p:40,d:'Soigne 6 % des PV max au début de chacun de vos tours pendant 4 tours (24 % au total).',cd:5},
  p_reg2:{n:'Élixir de régénération',c:'#2a9a5a',p:100,d:'Soigne 10 % des PV max au début de chacun de vos tours pendant 5 tours (50 % au total).',cd:7},
  p_res:{n:'Potion de résistance',c:'#4a86c8',p:50,d:'+40 % Défense et Résistance pendant 3 tours.',cd:4},
  p_for:{n:'Potion de force',c:'#e07a1f',p:60,d:'+30 % Force pendant 3 tours (Guerrier et Paladin).',cls:'guerrier',cd:4},
  p_int:{n:'Potion d’intelligence',c:'#8a4fd8',p:60,d:'+30 % Intelligence pendant 3 tours.',cls:'mage',cd:4},
  p_pa:{n:'Potion d’action',c:'#d9b81f',p:70,cd:6,d:'+2 PA pendant 3 tours. En duel, uniquement pendant la préparation ou à votre premier tour.'},
  p_oubli:{n:'Potion d’oubli',c:'#5f7fa8',fix:{gold:5000},nocombat:1,d:'Réinitialise toutes vos compétences et votre spécialisation (points remboursés). Se boit depuis la fenêtre Personnage.'},
  sc_blank:{n:'Parchemin vierge',c:'#c9a86a',p:90,nocombat:1,d:'Support d’enchantement : placez-le en haut de l’autel d’Enchantement, puis combinez 3 Poudres runiques, une Essence magique et une Rune.'},
  p_xp:{n:'Élixir de savoir',c:'#3fae6a',p:80,d:'+50 % d’expérience gagnée en combat pendant 30 minutes (temps réel, même hors ligne).'},
  c_relic:{n:'Coffre des Reliques',c:'#8a4c22',fix:{gold:60000,ru_pri:1},nocombat:1,d:'Contient une relique cosmétique de cadre de carte (Or royal, Saphir, Améthyste, Braise vivante ou Prisme holographique). S’ouvre depuis l’inventaire.'},
  s_ch2:{n:'Coffre de saison épique',c:'#a050d8',fix:{gold:40000,ru_anc:1},nocombat:1,d:'Contient 1 cosmétique de la saison : Commun 10 %, Rare 30 %, Épique 55 %, Légendaire 5 %. Un cosmétique pas encore obtenu est prioritaire. Clic droit dans l’inventaire pour l’ouvrir.'},
  s_ch3:{n:'Coffre de saison légendaire',c:'#ff7a1a',fix:{gold:60000,ru_pri:1},nocombat:1,d:'Contient 1 cosmétique de la saison : Rare 15 %, Épique 45 %, Légendaire 40 %. Un cosmétique pas encore obtenu est prioritaire. Clic droit dans l’inventaire pour l’ouvrir.'},
  p_loot:{n:'Philtre de fortune',c:'#d9a62b',p:80,d:'+50 % d’or et de matériaux gagnés en combat pendant 30 minutes (temps réel, même hors ligne).'},
};
const potPrice=k=>Math.round(POTS[k].p*3*(1+((S&&S.heroes[0]&&S.heroes[0].lvl)||1)/10));
const MAT_OBJ={fer:'Lingot de fer',cuir:'Peau tannée',plante:'Herbe enchantée',cristal:'Éclat de cristal',essence:'Fiole d’essence',rune:'Pierre runique',prisme:'Prisme divin'};
const MAT_D={prisme:'Relique céleste, lâchée rarement par Le Dévoreur (10 %). À la forge légendaire, elle crée un objet de niveau 60 et de rareté Divin.',fer:'Sert à forger et à améliorer tout l’équipement.',cuir:'Indispensable à la forge et aux améliorations.',plante:'Herbe luminescente cueillie dans la Forêt Enchantée.',cristal:'Forges fines, relances de valeurs et améliorations avancées.',essence:'Forges de maître et remplacement d’affixes.',rune:'Rare. Forge légendaire, ascension et améliorations ultimes.'};
const GW=14,STACK=500; let GH=5,BAG=GW*GH;
/* taille d'un objet dans la grille (largeur x hauteur) */
const SIZE=o=>o.mat?[1,1]:({weapon:[1,2],armor:[1,2],legs:[1,2],helm:[1,2],boots:[1,2],ring:[1,1],amulet:[1,1]})[o.slot]||[1,1];
const STAT_N={hp:'PV',atk:'Force',mag:'Intelligence',def:'Défense physique',res:'Défense magique',ap:'Points d’action',rPhys:'Résistance physique',rMag:'Résistance magique',rFeu:'Résistance au feu',rGlace:'Résistance à la glace',rFoudre:'Résistance à la foudre',rTerre:'Résistance à la terre',spd:'Vitesse',crit:'Critique',critDmg:'Dégâts critiques',dodge:'Esquive',lifesteal:'Vol de vie',hpPct:'PV',dmgPct:'Dégâts',goldFind:'Or trouvé',dropRate:'Butin trouvé'};
const PCT=new Set(['rPhys','rMag','rFeu','rGlace','rFoudre','rTerre','crit','critDmg','dodge','lifesteal','hpPct','dmgPct','goldFind','dropRate']);
const fmtStat=(s,v)=>PCT.has(s)?`+${r1(v)}% ${STAT_N[s]}`:`+${Math.round(v)} ${STAT_N[s]}`;
const MAXL=50;
const CRIT_CAP=70,CDMG_CAP=300; /* plafonds : 70 % de chances de critique, 300 % de dégâts critiques */

const RAR=[
  {n:'Commun',aff:0,m:1},{n:'Magique',aff:1,m:1.05},{n:'Rare',aff:2,m:1.10},{n:'Épique',aff:3,m:1.15},{n:'Légendaire',aff:3,m:1.20,leg:1},{n:'Divin',aff:3,m:1.25,max:1}
];
const BASES=[
  {n:'Épée',slot:'weapon',cls:'guerrier',imp:[['atk',6,1.8]]},
  {n:'Bâton',slot:'weapon',cls:'mage',imp:[['mag',6,1.8]]},
  {n:'Heaume',slot:'helm',cls:'guerrier',imp:[]},
  {n:'Capuche',slot:'helm',cls:'mage',imp:[]},
  {n:'Cuirasse',slot:'armor',cls:'guerrier',imp:[]},
  {n:'Robe',slot:'armor',cls:'mage',imp:[]},
  {n:'Bottes',slot:'boots',cls:'guerrier',imp:[]},
  {n:'Sandales',slot:'boots',cls:'mage',imp:[]},
  {n:'Jambières',slot:'legs',cls:'guerrier',imp:[]},
  {n:'Jambières',slot:'legs',cls:'mage',imp:[]},
  {n:'Anneau',slot:'ring',imp:[]},
  {n:'Amulette',slot:'amulet',imp:[]},
];
const baseFor=(slot,cls)=>BASES.find(b=>b.slot===slot&&(!b.cls||b.cls===cls));
const AFX=[
  {s:'hp',w:16,b:24,p:7.8},{s:'atk',w:16,b:2,p:.6},{s:'mag',w:16,b:2,p:.6},{s:'def',w:9,b:2,p:.6},
  {s:'spd',w:9,b:1,p:.1,ep:'de Célérité'},
  {s:'hpPct',w:5,b:2,p:.1,ep:'du Titan'},{s:'dmgPct',w:4,b:1.5,p:.1,ep:'de Fureur'},{s:'crit',w:3,b:1,p:.07,ep:'du Prédateur'},
  {s:'critDmg',w:3,b:2,p:.12,ep:'de Ruine'},{s:'dodge',w:3,b:1,p:.035,ep:'du Vent'},{s:'lifesteal',w:2,b:.6,p:.02,ep:'du Vampire'},
  {s:'goldFind',w:5,b:3,p:.5,ep:'d’Opulence'},
];
AFX.push({s:'rPhys',w:5,b:1.5,p:.06,ep:'du Rempart'},{s:'rMag',w:5,b:1.5,p:.06,ep:'de l’Égide'},{s:'rFeu',w:7,b:3,p:.12,ep:'Ignifugé'},{s:'rGlace',w:7,b:3,p:.12,ep:'du Givre'},{s:'rFoudre',w:7,b:3,p:.12,ep:'de l’Orage'},{s:'rTerre',w:7,b:3,p:.12,ep:'de la Roche'});
const AFXM=Object.fromEntries(AFX.map(a=>[a.s,a]));
/* tirage pondéré sans remise : PV, Force et Intelligence sortent souvent, Critique et Vol de vie rarement */
function wPick(pool,n){ const a=pool.slice(),out=[]; while(out.length<n&&a.length){ let t=a.reduce((x,y)=>x+(y.w||5),0)*Math.random(),i=0; for(;i<a.length-1;i++){ t-=a[i].w||5; if(t<=0) break } out.push(a.splice(i,1)[0]) } return out }
const affTier=w=>w>=14?'Très courant':w>=7?'Courant':w>=5?'Peu courant':w>=3?'Rare':'Très rare';
/* éléments et résistances */
const ELEM={feu:{n:'Feu',k:'rFeu',c:'#e0612a'},glace:{n:'Glace',k:'rGlace',c:'#4fa8d8'},foudre:{n:'Foudre',k:'rFoudre',c:'#c9a814'},terre:{n:'Terre',k:'rTerre',c:'#8a6a3a'}};
const RES_K=['rPhys','rMag','rFeu','rGlace','rFoudre','rTerre'],RES_CAP=50;
const RES_S={rPhys:'Physique',rMag:'Magique',rFeu:'Feu',rGlace:'Glace',rFoudre:'Foudre',rTerre:'Terre'};
/* pouvoir légendaire (même effet pour l’instant, un nom par type d’équipement) */
const LEGP={weapon:'Fil du destin',helm:'Regard du prédateur',armor:'Cœur de braise',legs:'Foulée du chasseur',boots:'Course fatale',ring:'Sceau du bourreau',amulet:'Œil de l’oracle'};
const LEG_FX={crit:6,critDmg:10},LEG_D='Augmente les chances de coup critique de 6 % et les dégâts critiques de 10 %.';
/* affixes possibles : pas d’Intelligence sur l’équipement de Guerrier, pas de Force sur celui du Sorcier */
const affPool=c=>{ const r=typeof CLASSES!=='undefined'&&CLASSES[c]?CLASSES[c].role:(c==='mage'?'mag':'atk'); return AFX.filter(a=>!(r==='atk'&&a.s==='mag')&&!(r==='mag'&&a.s==='atk')) };
/* potion réservée : la Potion de force sert à toutes les classes de Force */
const potFor=(k,cls)=>{ const c=POTS[k]&&POTS[k].cls; return !c||c===cls||(c==='guerrier'&&typeof CLASSES!=='undefined'&&CLASSES[cls]&&CLASSES[cls].role==='atk') };
const EPITHETS=['de Cendre','des Damnés','du Crépuscule','de l’Aube','d’Aldrec','des Abysses','du Gardien','de la Braise','du Dernier Siège'];

