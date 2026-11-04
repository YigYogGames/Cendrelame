/* Cendrelame · data/icones-des-sorts.js */
/* icônes de sorts */
const SPI={
  sword:'<path d="M19 2h3v3L10.5 16.5l-3-3z"/><path d="M5.2 12.8l1.4-1.4 6 6-1.4 1.4zM6 16.6l1.4 1.4L3.4 22 2 20.6z"/>',
  shield:'<path d="M12 2l8 3v6.5c0 4.8-3.4 8.7-8 10.5-4.6-1.8-8-5.7-8-10.5V5z"/>',
  whirl:'<path d="M12 3a9 9 0 0 1 8.9 7.6h2.6l-4 4.4-4-4.4h2.6A6.2 6.2 0 0 0 12 5.8zM12 21a9 9 0 0 1-8.9-7.6H.5l4-4.4 4 4.4H5.9A6.2 6.2 0 0 0 12 18.2z"/>',
  claw:'<path d="M3.5 20.5L12.8 3l1.8.9-9.3 17.5zM8.6 22l8.2-15.6 1.8.9-8.2 15.6zM14 22.4l6-11.5 1.8.9-6 11.5z"/>',
  saw:'<path d="M4 20L18 3l3 2.5L7 22.5z"/><path d="M15 6.5l-2 .3.8-1.9zM12.6 9.4l-2 .3.8-1.9zM10.2 12.3l-2 .3.8-1.9zM7.8 15.2l-2 .3.8-1.9z"/>',
  drop:'<path d="M12 2c3.2 4.6 6.6 8.5 6.6 12.4a6.6 6.6 0 0 1-13.2 0C5.4 10.5 8.8 6.6 12 2z"/>',
  dagger:'<path d="M14.5 2.5L21 3l.5 6.5-8.8 8.8-1.6-1.6zM10 15.9l2.1 2.1-1.4 1.4-.8-.8L5 23.5 3.5 22l4.9-4.9-.8-.8z"/>',
  skull:'<path d="M12 2a8 8 0 0 0-8 8c0 2.8 1.4 4.6 3 5.6V19h2v2h2v-2h2v2h2v-2h2v-3.4c1.6-1 3-2.8 3-5.6a8 8 0 0 0-8-8zM8.5 9a2 2 0 1 1 0 4 2 2 0 0 1 0-4zm7 0a2 2 0 1 1 0 4 2 2 0 0 1 0-4zM12 13l1.4 2.6h-2.8z" fill-rule="evenodd"/>',
  axe:'<path d="M3 20.5L14.5 9l1.5 1.5L4.5 22z"/><path d="M12.6 3.4c4.8-1.6 8.6 2.1 8 7.8-1.9-2.7-4.8-3.7-7.8-2.3l-2.3-2.3c1-1 1.6-2.1 2.1-3.2z"/>',
  fist:'<path d="M7 9V5.5a1.5 1.5 0 0 1 3 0V9h.5V4.5a1.5 1.5 0 0 1 3 0V9h.5V5.5a1.5 1.5 0 0 1 3 0V10h.5V8a1.5 1.5 0 0 1 3 0v6a8 8 0 0 1-8 8h-1a7 7 0 0 1-7-7v-3a2 2 0 0 1 2-2z"/>',
  rage:'<path d="M12 2c2.4 3 6.3 4.2 6.3 9.3 0 1.4-.5 2.6-1.1 3.4l2.3 1.8c-1.8 3.4-4.3 5.5-7.5 5.5s-5.7-2.1-7.5-5.5l2.3-1.8c-.6-.8-1.1-2-1.1-3.4C5.7 6.2 9.6 5 12 2zM8.5 12.5l2.6 1-.6 1.5zM15.5 12.5l-2.6 1 .6 1.5z"/>',
  heart:'<path d="M12 21l-1.4-1.3C5.4 15 2 11.9 2 8.1 2 5 4.4 2.6 7.5 2.6c1.7 0 3.4.8 4.5 2.1 1.1-1.3 2.8-2.1 4.5-2.1C19.6 2.6 22 5 22 8.1c0 3.8-3.4 6.9-8.6 11.6z"/>',
  horn:'<path d="M2.5 9.5L14 4v16L2.5 14.5zM15.8 7.5h2v9h-2zM19.4 5.2l1.4-1 1.2 1.6-1.4 1zM20 11h3v2h-3zM19.4 18.8l1.4 1 1.2-1.6-1.4-1z"/>',
  wind:'<path d="M2 8.2h12.2a2.6 2.6 0 1 0-2.6-2.6h2a.6.6 0 1 1 .6.6H2zM2 11.4h15.4a2.8 2.8 0 1 1-2.8 2.8h2a.8.8 0 1 0 .8-.8H2zM2 16.4h8.5v2H2z"/>',
  star:'<path d="M12 2l2.6 6.9 7.4.4-5.7 4.6 1.9 7.1L12 17l-6.2 4 1.9-7.1L2 9.3l7.4-.4z"/>',
  nova:'<path d="M12 7.5a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9zM11 1h2v4.5h-2zM11 18.5h2V23h-2zM1 11h4.5v2H1zM18.5 11H23v2h-4.5zM4.2 5.6l1.4-1.4 3 3-1.4 1.4zM15.4 16.8l1.4-1.4 3 3-1.4 1.4zM4.2 18.4l3-3 1.4 1.4-3 3zM15.4 7.2l3-3 1.4 1.4-3 3z"/>',
  flame:'<path d="M12 2c1 3.6 5.2 5.6 5.2 10.6A5.2 5.2 0 0 1 12 22a5.2 5.2 0 0 1-5.2-5.2c0-2.7 1.5-4.1 2.7-5.8.3 1.7 1 2.7 2.2 3.2-.6-3.5-1-8.5.3-12.2z"/>',
  sun:'<path d="M12 6.5a5.5 5.5 0 1 1 0 11 5.5 5.5 0 0 1 0-11zM11 0h2v4h-2zM11 20h2v4h-2zM0 11h4v2H0zM20 11h4v2h-4z"/>',
  burst:'<path d="M12 1l2 6 5-4-2 6 6 1-5 3 4 5-6-1v6l-4-5-4 5v-6l-6 1 4-5-5-3 6-1-2-6 5 4z"/>',
  wave:'<path d="M2 15c3 0 3-3 6-3s3 3 6 3 3-3 6-3h2v3c-3 0-3 3-6 3s-3-3-6-3-3 3-6 3H2zM2 8c3 0 3-3 6-3s3 3 6 3 3-3 6-3h2v3c-3 0-3 3-6 3S11 8 8 8s-3 3-6 3H2z"/>',
  eye:'<path d="M12 5c5 0 9 4 10.5 7C21 15 17 19 12 19S3 15 1.5 12C3 9 7 5 12 5zm0 3.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7z" fill-rule="evenodd"/>',
  hour:'<path d="M5.5 2h13v2h-1.3v3L13 12l4.2 5v3h1.3v2h-13v-2h1.3v-3L11 12 6.8 7V4H5.5z"/>',
  meteor:'<path d="M15 9.5a6 6 0 1 1 0 12 6 6 0 0 1 0-12zM2 2l9.5 7.5-1.6 1.6zM6 1l6.5 6.5-1.2 1.2zM1 6l7 5.5-1.2 1.2z"/>',
  bolt:'<path d="M13.5 1L4 14h6.5L9 23l10-13.5h-6.5z"/>',
  spark:'<path d="M12 1.5l2 7.6 7.5 2.4-7.5 2.4-2 8.6-2-8.6-7.5-2.4 7.5-2.4z"/>',
  chain:'<path d="M3 2l8.5 6.5-3.2 1.2 7.4 5.2-3.2 1.3L21 22.5l-11.4-6 3.1-1.3-7.4-5.2 3.2-1.2z"/>',
  storm:'<path d="M6.5 14.5a4.8 4.8 0 0 1-.4-9.6A6 6 0 0 1 17.6 6a4.3 4.3 0 0 1-.4 8.5zM12.5 13.5h3.2l-2 3.8h2.6L10 24l1.6-5H9z"/>',
  hammer:'<path d="M2.5 4h12v6.5h-12zM14.5 6h3v2.5h-3zM7.2 10.5h2.6V22H7.2zM19.5 9l1.5-6 1 .3-1.1 5.2 2.6.2-3.6 6.3-.8-.3 1.2-5.4z"/>',
};
const spIcon=s=>skImg(s)||`<svg viewBox="0 0 24 24" aria-hidden="true">${SPI[s&&s.si]||SPI.star}</svg>`;
const ENSK={
  e_heavy:{ap:2,n:'Coup brutal',cd:3,mult:1.7,tg:'one'},
  e_bleed:{ap:2,n:'Morsure sanglante',cd:3,mult:1,tg:'one',fx:[{k:'dot',n:'Saignement',v:.3,dur:3}]},
  e_burn:{ap:2,el:'feu',n:'Trait de feu',cd:3,mult:1.1,tg:'one',fx:[{k:'dot',n:'Brûlure',v:.35,dur:3}]},
  e_poison:{ap:2,el:'terre',n:'Crachat toxique',cd:3,mult:.8,tg:'one',fx:[{k:'dot',n:'Poison',v:.4,dur:4}]},
  e_stun:{ap:3,n:'Coup assommant',cd:4,mult:1.2,tg:'one',fx:[{k:'stun',ch:45,dur:1}]},
  e_heal:{ap:2,n:'Soin sombre',cd:4,tg:'lowAlly',fx:[{k:'heal',v:1.6,of:'mag'}]},
  e_cry:{ap:2,n:'Hurlement',cd:5,tg:'allies',fx:[{k:'buff',stat:'atk',v:30,dur:3}]},
  e_aoe:{ap:3,el:'glace',n:'Déferlante',cd:4,mult:.75,tg:'all'},
  e_smash:{ap:3,n:'Frappe dévastatrice',cd:4,mult:2.3,tg:'one'},
  e_curse:{ap:2,n:'Malédiction',cd:4,mult:.8,tg:'one',fx:[{k:'debuff',stat:'def',v:-30,dur:3}]},
};
for(const [id,s] of Object.entries(ENSK))SK[id]={id,...s};

const ZONES=[
  {n:'Forêt des Murmures',mats:['fer','cuir'],enemies:[
    {n:'Gobelin',ic:'brute',role:'atk',hp:1,atk:1,def:1},
    {n:'Loup affamé',ic:'beast',role:'atk',hp:.85,atk:1.1,def:.8,spd:1.25,sk:['e_bleed']},
    {n:'Chaman gobelin',res:{rFeu:20},ic:'hood',role:'mag',hp:.8,atk:1.1,def:.7,sk:['e_burn','e_heal']}],
   boss:{n:'Roi Gobelin',ic:'boss',role:'atk',hp:3.2,atk:1.25,def:1.2,sk:['e_heavy','e_cry']}},
  {n:'Catacombes oubliées',mats:['fer','cristal'],enemies:[
    {n:'Squelette',res:{rPhys:15,rGlace:25},ic:'skull',role:'atk',hp:1,atk:1,def:1.1},
    {n:'Revenant',res:{rGlace:20},ic:'brute',role:'atk',hp:1.2,atk:.95,def:1,sk:['e_stun']},
    {n:'Nécromancien',res:{rMag:15},ic:'hood',role:'mag',hp:.8,atk:1.15,def:.7,sk:['e_poison','e_heal']}],
   boss:{n:'Le Roi sans nom',res:{rPhys:10,rGlace:30},ic:'boss',role:'atk',hp:3.3,atk:1.3,def:1.2,sk:['e_heavy','e_stun','e_cry']}},
  {n:'Marais putride',mats:['cuir','essence'],enemies:[
    {n:'Crapaud géant',res:{rTerre:25},ic:'blob',role:'atk',hp:1.2,atk:.9,def:.9,sk:['e_poison']},
    {n:'Sorcière des tourbières',res:{rMag:15,rTerre:20},ic:'hood',role:'mag',hp:.85,atk:1.15,def:.7,sk:['e_curse','e_heal']},
    {n:'Goule',ic:'beast',role:'atk',hp:1,atk:1.1,def:.9,spd:1.2,sk:['e_bleed']}],
   boss:{n:'Hydre des marais',res:{rTerre:30,rGlace:15},ic:'boss',role:'atk',hp:3.4,atk:1.25,def:1.2,sk:['e_aoe','e_poison','e_heavy']}},
  {n:'Pic de Cendre',mats:['cristal','essence'],enemies:[
    {n:'Salamandre',res:{rFeu:40},ic:'beast',role:'atk',hp:1,atk:1.1,def:.9,spd:1.15,sk:['e_burn']},
    {n:'Golem de lave',res:{rFeu:50,rPhys:20,rGlace:-20},ic:'brute',role:'atk',hp:1.5,atk:1,def:1.3,spd:.8,sk:['e_heavy','e_stun']},
    {n:'Mage de braise',res:{rFeu:40,rMag:10},ic:'hood',role:'mag',hp:.8,atk:1.2,def:.7,sk:['e_burn','e_aoe']}],
   boss:{n:'Seigneur de Cendre',res:{rFeu:50,rMag:15},ic:'boss',role:'mag',hp:3.5,atk:1.35,def:1.2,sk:['e_aoe','e_heavy','e_burn']}},
  {n:'Abysses du Néant',mats:['essence','rune'],enemies:[
    {n:'Rôdeur du vide',res:{rMag:20},ic:'beast',role:'atk',hp:1,atk:1.15,def:.9,spd:1.25,sk:['e_bleed']},
    {n:'Abomination',res:{rPhys:20},ic:'blob',role:'atk',hp:1.6,atk:1,def:1.1,sk:['e_heavy','e_poison']},
    {n:'Oracle déchu',res:{rMag:25,rFoudre:20},ic:'hood',role:'mag',hp:.9,atk:1.2,def:.8,sk:['e_curse','e_heal']}],
   boss:{n:'Le Dévoreur',res:{rPhys:15,rMag:15,rFeu:15,rGlace:15,rFoudre:15,rTerre:15},ic:'boss',role:'atk',hp:3.8,atk:1.4,def:1.25,sk:['e_aoe','e_heavy','e_cry','e_curse']}},
];

const PM=1/60; /* taux exprimés par minute */
const SITES_ALL=[
  {id:'mine',n:'La Mine',unlock:0,out:{gold:15},cache:.0008,desc:'Des galeries étroites où résonnent les pioches. On y extrait de l’or.'},
  {id:'bois',off:1,n:'Forêt Enchantée',unlock:120,out:{plante:2,cuir:2},cache:.0008,desc:'Des sous-bois baignés de lueurs, riches en herbes rares et en gibier.'},
  {id:'ruines',off:1,n:'Ruines englouties',unlock:450,out:{rune:1,cristal:4},caps:{cristal:25},cache:.001,desc:'Des salles noyées où les cristaux affleurent entre les glyphes runiques.'},
  {id:'marais',off:1,n:'Marais des brumes',unlock:1400,out:{essence:2,rune:1},cache:.0012,desc:'On y récolte l’essence qui suinte des racines.'},
];
const SITES=SITES_ALL.filter(s=>!s.off);
const TIERS=[
  {n:'Forge ordinaire',lv:[1,15],cost:{fer:15,cuir:8},odds:[80,20,0,0,0]},
  {n:'Forge fine',lv:[10,30],cost:{fer:25,cuir:12,cristal:6},odds:[40,50,10,0,0]},
  {n:'Forge de maître',lv:[25,45],cost:{fer:35,cuir:18,cristal:12,essence:4},odds:[0,10,45,45,0]},
  {n:'Forge légendaire',lv:[40,53],cost:{fer:45,cuir:22,cristal:18,essence:8,rune:3},odds:[0,0,20,70,10]},
];
const HUES=[8,38,140,190,260,320];
const ICONS={
  sword:'<path d="M12 2l2.2 2.2v9.3L12 15.7l-2.2-2.2V4.2z"/><path d="M6.5 14.5h11v2.2h-11z"/><path d="M10.9 16.7h2.2V22h-2.2z"/>',
  staff:'<circle cx="12" cy="6.5" r="4.2"/><path d="M10.9 11h2.2v11h-2.2z"/>',
  dagger:'<path d="M12 2l3.2 10.2L12 15.4 8.8 12.2z"/><path d="M9.5 15.5h5v2h-5z"/><path d="M10.9 17.5h2.2V22h-2.2z"/>',
  cross:'<path d="M9.8 2h4.4v7.6H22v4.4h-7.8V22H9.8v-8H2V9.6h7.8z"/>',
  skull:'<path d="M12 2a8 8 0 0 0-8 8c0 3 1.5 4.7 3 5.6V21h2.3v-2.2h1.4V21h2.6v-2.2h1.4V21H17v-5.4c1.5-.9 3-2.6 3-5.6a8 8 0 0 0-8-8z"/><circle cx="8.8" cy="10.5" r="2" fill="#1b110a"/><circle cx="15.2" cy="10.5" r="2" fill="#1b110a"/>',
  beast:'<path d="M3 3.5l5.2 3.5h7.6L21 3.5 20 13l-4 8H8l-4-8z"/><path d="M8 11l3 1.5L8 14zM16 11l-3 1.5 3 1.5z" fill="#1b110a"/>',
  hood:'<path d="M12 2C8 2 5 6 5 11v11h14V11c0-5-3-9-7-9z"/><ellipse cx="12" cy="12" rx="3.6" ry="3" fill="#1b110a"/><circle cx="10.6" cy="12" r=".9"/><circle cx="13.4" cy="12" r=".9"/>',
  brute:'<path d="M4 10l4-6h8l4 6-2 11H6z"/><path d="M8 11h3v2H8zM13 11h3v2h-3z" fill="#1b110a"/>',
  blob:'<path d="M2.5 19c0-7 4.5-13 9.5-13s9.5 6 9.5 13z"/><circle cx="9" cy="14" r="1.6" fill="#1b110a"/><circle cx="15" cy="14" r="1.6" fill="#1b110a"/>',
  helm:'<path d="M12 3C7.6 3 4.5 6.3 4.5 10.5V15h3v3h9v-3h3v-4.5C19.5 6.3 16.4 3 12 3z"/><path d="M9 10.5h6v2.4H9z" fill="#1b110a"/>',
  chest:'<path d="M8 3L3 6l2 5 3-1v11h8V10l3 1 2-5-5-3c-.5 1.6-2 2.6-4 2.6S8.5 4.6 8 3z"/>',
  legs:'<path d="M6 3h12v4l-1.2 14H13l-1-10-1 10H7.2L6 7z"/><path d="M6 6.2h12" stroke="#1b110a" stroke-width="1" fill="none"/>',
  boots:'<path d="M8 3h6v8l5 3c1 .6 1.5 1.4 1.5 2.5V20H5.5v-3.6c0-.8.4-1.5 1-1.9L8 13z"/>',
  ring:'<path fill-rule="evenodd" d="M12 9a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13zm0 3a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7z"/><path d="M9.5 2h5l2 4.5h-9z"/>',
  amulet:'<path d="M5 3l7 9 7-9" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M12 11.5l4.2 5.3L12 22l-4.2-5.2z"/>',
  boss:'<path d="M3 3l4 4 5-5 5 5 4-4-1.5 9H4.5z"/><path d="M5 14h14v3.5l-2 3.5H7l-2-3.5z"/><path d="M8.5 16h2.2v2H8.5zM13.3 16h2.2v2h-2.2z" fill="#1b110a"/>',
};
const icon=n=>`<svg viewBox="0 0 24 24" aria-hidden="true">${ICONS[n]||''}</svg>`;
const MI={
  gold:'<path d="M3.5 15.5l1.6-4.6 3.6-2.2 3.4-3 4.2 2.2 3.2 3.4-.8 4.4-3.8 3.4-5.2.8-4.6-1.4z" fill="#d9a62b" stroke="#6e4a0c" stroke-width="1.2" stroke-linejoin="round"/><path d="M8.7 8.7l3.4-3 3.2 1.6-2.6 3.3-3.6.7z" fill="#f6dc7c"/><path d="M9.6 17.6l4.6-.8 3.4-3-1.4-2.4-3.6 2.8z" fill="#b57f17"/>',
  fer:'<path d="M3 13.5l3-5.5h12l3 5.5z" fill="#c9ccd2" stroke="#3f434a" stroke-width="1.2" stroke-linejoin="round"/><path d="M3 13.5h18V18a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z" fill="#7d818a" stroke="#3f434a" stroke-width="1.2" stroke-linejoin="round"/><path d="M7.5 10h6l-.8 1.8H6.5z" fill="#f1f2f4"/><path d="M6 16h12" stroke="#5b5f67" stroke-width="1"/>',
  cuir:'<path d="M7 3.5l3 2h4l3-2 3.5 4-2 3 2 4-3 1-1 5H8l-1-5-3-1 2-4-2-3z" fill="#a8693a" stroke="#4a2810" stroke-width="1.2" stroke-linejoin="round"/><path d="M12 7v11" stroke="#4a2810" stroke-width="1" stroke-dasharray="1.6 1.6"/><path d="M8.5 9.5l1.5 3-1.5 2" fill="none" stroke="#d29a63" stroke-width="1"/>',
  plante:'<path d="M12 21V11" stroke="#3d5a1e" stroke-width="1.6" fill="none" stroke-linecap="round"/><path d="M12 14C7 14 4 11 4 6c5 0 8 3 8 8z" fill="#6fae3a" stroke="#2f4f14" stroke-width="1.2" stroke-linejoin="round"/><path d="M12 12c0-5 3-8 8-8 0 5-3 8-8 8z" fill="#8fcf52" stroke="#2f4f14" stroke-width="1.2" stroke-linejoin="round"/><circle cx="12" cy="4.5" r="1.7" fill="#e6d35c" stroke="#7a6a14" stroke-width=".8"/>',
  prisme:'<path d="M12 2.5L21 19H3z" fill="#eef7ff" stroke="#3b4a7a" stroke-width="1.2" stroke-linejoin="round"/><path d="M12 2.5L15.5 19H8.5z" fill="#cfe8ff"/><path d="M1.5 11.5l10.5 1" stroke="#fff3b0" stroke-width="1.5" stroke-linecap="round"/><path d="M14 12.2l8.5 1.8" stroke="#e8463a" stroke-width="1.4" stroke-linecap="round"/><path d="M14.4 13.6l8 3" stroke="#f2b632" stroke-width="1.4" stroke-linecap="round"/><path d="M14.8 15l7.2 4" stroke="#4aa3e8" stroke-width="1.4" stroke-linecap="round"/>',
  cristal:'<path d="M12 2l6 6.5L12 22 6 8.5z" fill="#5db4e8" stroke="#1b5a86" stroke-width="1.2" stroke-linejoin="round"/><path d="M12 2l-2.4 6.5L12 22l2.4-13.5z" fill="#a9defa"/><path d="M6 8.5h12" stroke="#1b5a86" stroke-width="1"/>',
  essence:'<rect x="9.4" y="2" width="5.2" height="2.6" rx=".6" fill="#8a5a2b" stroke="#4a2c10" stroke-width="1"/><path d="M10 4.6h4v4.2l4.2 7.4A3 3 0 0 1 15.6 20.6H8.4a3 3 0 0 1-2.6-4.4L10 8.8z" fill="#e6d8f2" stroke="#4d2a68" stroke-width="1.2" stroke-linejoin="round"/><path d="M7.4 15h9.2l1.2 2.2a2 2 0 0 1-1.8 2.9H8a2 2 0 0 1-1.8-2.9z" fill="#a15be0"/>',
  rune:'<path d="M7 3h10l3 4-1 12-3 2H8l-3-2-1-12z" fill="#857a6a" stroke="#352e25" stroke-width="1.2" stroke-linejoin="round"/><path d="M12 7v10M9 10l3-3 3 3M9.2 15.2l5.6-3" stroke="#f6c64f" stroke-width="1.7" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',
};
for(const [k,p] of Object.entries(POTS)){MAT_OBJ[k]=p.n;MAT_N[k]=p.n;MAT_D[k]=p.d;MI[k]=`<path d="M9.5 2h5v2.4h-5z" fill="#8a5a2b" stroke="#4a2c10" stroke-width=".9"/><path d="M10 4.4h4v3.4c3 1.1 5 3.9 5 7.2a7 7 0 0 1-14 0c0-3.3 2-6.1 5-7.2z" fill="#efe6d6" stroke="#3a2616" stroke-width="1.1" stroke-linejoin="round"/><path d="M6.2 13.5h11.6a5.9 5.9 0 0 1-11.6 0z" fill="${p.c}"/><circle cx="9.5" cy="11.3" r="1" fill="#fff" opacity=".8"/>`}
MAT_OBJ.c_relic='Coffre des Reliques';MAT_N.c_relic='Coffre des Reliques';
MAT_D.c_relic='Un coffre scellé arraché aux boss de raid, orné de runes anciennes. Il renferme une relique cosmétique pour votre carte de joueur. Obtenu rarement en réussissant un raid : 1 % au palier +0, puis +0,5 % par palier (10 % maximum). Clic droit pour l’ouvrir.';
MI.s_ch2='<path d="M3 10h18v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z" fill="#7a3aa8" stroke="#24082e" stroke-width="1.2"/><path d="M3 10c0-4 3.5-6 9-6s9 2 9 6z" fill="#a050d8" stroke="#24082e" stroke-width="1.2"/><path d="M7 4.6V20M17 4.6V20" stroke="#ffe3a8" stroke-width="1.6"/><path d="M12 11l2 3-2 3-2-3z" fill="#fff6d0" stroke="#5a3a10" stroke-width=".8"/>';
MI.s_ch3=MI.s_ch2.replace(/#7a3aa8/g,'#c0461a').replace(/#a050d8/g,'#ff8a3a').replace(/#24082e/g,'#3a1006');
MI.c_relic='<path d="M3 10h18v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z" fill="#6b3a1c" stroke="#2a1408" stroke-width="1.2"/><path d="M3 10c0-4 3.5-6 9-6s9 2 9 6z" fill="#8a4c22" stroke="#2a1408" stroke-width="1.2"/><path d="M3 10h18M7 5.5V20M17 5.5V20" stroke="#e8c25a" stroke-width="1.6"/><rect x="10" y="9" width="4" height="5" rx="1" fill="#e8c25a" stroke="#6e4a0c" stroke-width=".8"/><circle cx="12" cy="11.5" r=".9" fill="#2a1408"/><path d="M5 3l.6 1.4L7 5l-1.4.6L5 7l-.6-1.4L3 5l1.4-.6zM19.5 2l.5 1 1 .5-1 .5-.5 1-.5-1-1-.5 1-.5z" fill="#fff6c8"/>';
const matIcon=k=>`<svg class="mi" viewBox="0 0 24 24" aria-hidden="true">${MI[k]||''}</svg>`;
const matChip=(k,v)=>`<span class="mc" title="${MAT_N[k]}">+${fmt(v)} ${matIcon(k)}<span class="sr">${MAT_N[k]}</span></span>`;

