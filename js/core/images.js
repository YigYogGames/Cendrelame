/* Cendrelame · core/images.js
   Images du jeu (style vectoriel flat).
   Chaque élément du jeu peut avoir son image PNG dans assets/img/… (voir assets/img/LISTE-DES-IMAGES.txt).
   Le jeu n'utilise que les fichiers listés dans js/data/images-presentes.js (outil : outils/mettre-a-jour-images.bat).
   Si une image manque, le jeu garde le dessin actuel. */
const IMG_DIR = 'assets/img/';
const IMG_OK = new Set((typeof IMG_PRESENTES !== 'undefined' ? IMG_PRESENTES : []).map(p => p.toLowerCase()));
/* nom de fichier sans accents ni espaces : « Loup affamé » → loup_affame */
const imgSlug = t => String(t).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[’']/g, '').replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
const imgHas = rel => IMG_OK.has(rel.toLowerCase());
const imgSrc = rel => IMG_DIR + rel + (typeof VERSION !== 'undefined' ? '?v=' + VERSION : '');
/* image dans un <svg> : garde toutes les tailles prévues pour les dessins actuels */
const imgSvgIn = (rel, vb = 24) => `<image href="${imgSrc(rel)}" x="0" y="0" width="${vb}" height="${vb}" preserveAspectRatio="xMidYMid meet"/>`;
const imgSvg = (rel, vb = 24, cls = '') => `<svg ${cls ? `class="${cls}" ` : ''}viewBox="0 0 ${vb} ${vb}" aria-hidden="true">${imgSvgIn(rel, vb)}</svg>`;
/* buste : l'image remplit la vignette, cadrée sur le haut (tête et épaules) */
const imgBust = (rel, vb = 24) => `<svg class="imbust" viewBox="0 0 ${vb} ${vb}" aria-hidden="true"><image href="${imgSrc(rel)}" x="0" y="0" width="${vb}" height="${vb}" preserveAspectRatio="xMidYMin slice"/></svg>`;

/* ---------- catalogue : toutes les images que le jeu sait utiliser ---------- */
function imgItemFolder(k) {
  if (/^s_ch\d$/.test(k) || k === 'c_relic') return 'coffres';
  if (/^c[tfsw]_/.test(k)) return 'compagnon/objets';
  if (POTS[k] && /^p_/.test(k)) return 'potions';
  return 'ressources';
}
const IMG_BASE = b => imgSlug(b.n) + (BASES.filter(x => x.n === b.n).length > 1 ? '_' + (b.cls === 'mage' ? 'sorcier' : b.cls || 'commun') : '');
const imgEnemy = (name, kind) => (kind || 'ennemis') + '/' + imgSlug(name) + '.png';
function imgCatalog() {
  const L = [], add = (rel, label, note) => { if (!L.some(x => x.rel === rel)) L.push({ rel, label, note: note || '' }) };
  for (const [c, C] of Object.entries(CLASSES)) add('classes/portraits/' + c + '.png', 'Portrait : ' + C.n, 'carré, visage et buste');
  for (const [c, A] of Object.entries(SPRITES)) for (const s of A) add('classes/apparences/' + s.id + '.png', 'Apparence en pied : ' + CLASSES[c].n + ' (' + s.n + ')', 'personnage entier, fond transparent');
  for (const Z of ZONES) { for (const e of Z.enemies) add(imgEnemy(e.n), e.n + ' (' + Z.n + ')', 'ennemi en pied'); add(imgEnemy(Z.boss.n, 'boss'), Z.boss.n + ' (boss, ' + Z.n + ')', 'boss en pied') }
  for (const r of RAIDS) add('defis/' + r.id + '.png', r.n + ' (boss de défi)', 'boss en pied');
  for (const b of BASES) add('equipement/' + IMG_BASE(b) + '.png', b.n + (b.cls ? ' (' + CLASSES[b.cls].n + ')' : '') + ' · ' + (SLOT_N[b.slot] || b.slot), 'icône carrée, la couleur de rareté est ajoutée par le jeu');
  for (const k of Object.keys(MI)) { if (EQP[k]) continue; let n = MAT_OBJ[k] || (POTS[k] && POTS[k].n) || MAT_N[k] || k; if (NEWI[k] && NEWI[k].sc) n += ' (' + RAR[NEWI[k].r].n + ')'; if (['fer', 'cuir', 'plante'].includes(k)) n += ' (ancien matériau, peu utilisé)'; add(imgItemFolder(k) + '/' + k + '.png', n, 'icône carrée') }
  for (const sk of Object.values(SK)) if (!/^e_/.test(sk.id)) add('competences/' + sk.id + '.png', sk.n + (sk.t === 'p' ? ' (talent passif)' : ''), 'icône carrée de compétence');
  for (const sp of CSP) for (let f = 1; f <= 3; f++) add('compagnon/creatures/' + sp.id + '_' + f + '.png', ((Array.isArray(sp.n) ? sp.n[f - 1] : sp.n) || sp.id) + ' · forme ' + f, 'créature, fond transparent');
  for (let z = 0; z < 7; z++) add('decors/zones/zone_' + z + '.jpg', 'Fond de zone ' + (ZONES[z] ? ZONES[z].n : z === 5 ? 'glace (Wyrm)' : 'arène / défis'), 'paysage large 1920 × 640 (PNG accepté, converti en JPG)');
  return L;
}

/* ---------- application au démarrage ---------- */
function imgApply() {
  if (!IMG_OK.size) return;
  for (const k of Object.keys(MI)) { if (EQP[k]) continue; const rel = imgItemFolder(k) + '/' + k + '.png'; if (imgHas(rel)) MI[k] = imgSvgIn(rel) }
  for (const c of Object.keys(CLASSES)) { const rel = 'classes/portraits/' + c + '.png'; if (imgHas(rel)) PORTRAIT[c] = imgSrc(rel) }
  for (const A of Object.values(SPRITES)) for (const s of A) { const rel = 'classes/apparences/' + s.id + '.png'; if (imgHas(rel)) s.src = imgSrc(rel) }
}
/* équipement : image du type d'objet (Épée, Robe…) si elle existe */
function eqImg(it) { if (!it || !IMG_OK.size) return ''; const b = BASES.find(x => x.n === it.base && (x.cls || null) === (it.cls || null)) || BASES.find(x => x.n === it.base); if (!b) return ''; const rel = 'equipement/' + IMG_BASE(b) + '.png'; return imgHas(rel) ? imgSvg(rel, 48, 'eqimg') : '' }
/* ennemis, boss et boss de défi : image en pied */
function foeImgRel(o) { if (!IMG_OK.size || !o) return ''; const r = o.rid ? 'defis/' + o.rid + '.png' : imgEnemy(o.name || o.n, o.boss ? 'boss' : 'ennemis'); return imgHas(r) ? r : '' }
function foeIcon(e, fallback) { const r = foeImgRel(e); return r ? imgBust(r) : icon(fallback || e.ic || 'boss') }
/* taille en combat : ennemis un peu plus petits que le héros, boss plus grands */
const foeScale = o => o.rid ? 1.25 : o.boss ? 1.15 : .88;
const skImg = s => s && s.id && IMG_OK.size && imgHas('competences/' + s.id + '.png') ? imgSvg('competences/' + s.id + '.png') : '';
const creaImg = (id, st, px) => { const r = 'compagnon/creatures/' + id + '_' + (st + 1) + '.png'; return IMG_OK.size && imgHas(r) ? `<svg class="cpcr" viewBox="0 0 120 120" width="${px}" height="${px}" aria-hidden="true">${imgSvgIn(r, 120)}</svg>` : '' };
