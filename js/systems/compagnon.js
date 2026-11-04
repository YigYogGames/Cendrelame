/* Cendrelame · systems/compagnon.js */
/* ================= 0.8.0 : mode Compagnon ================= */
UIC.paw=UIC.paw||'<circle cx="6.5" cy="10" r="2"/><circle cx="10" cy="6" r="2"/><circle cx="14" cy="6" r="2"/><circle cx="17.5" cy="10" r="2"/><path d="M12 11c-3 0-6 4-6 7a2.5 2.5 0 0 0 3.5 2.2c1.6-.7 3.4-.7 5 0A2.5 2.5 0 0 0 18 18c0-3-3-7-6-7z"/>';
UIC.trash=UIC.trash||'<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v6M14 11v6"/>';
UIC.cpbag=UIC.cpbag||'<path d="M4 9h16l-1 11H5z"/><path d="M9 9V6a3 3 0 0 1 6 0v3"/>';
const CTY={feu:{n:'Feu',a:'#e0562a',b:'#ffb04a',d:'#7a1e08',e:'#ffe08a'},eau:{n:'Eau',a:'#2a86d8',b:'#8fd0ff',d:'#0c3a6a',e:'#e0f6ff'},terre:{n:'Terre',a:'#8a6a3a',b:'#c8a86a',d:'#3a2a12',e:'#8fc85a'},ten:{n:'Ténèbres',a:'#5a3a9a',b:'#a07ad8',d:'#1a0c2e',e:'#ff5a8a'},lum:{n:'Lumière',a:'#e0b830',b:'#fff0a0',d:'#7a5a08',e:'#ffffff'}};
const CSTRONG={eau:'feu',feu:'terre',terre:'eau',lum:'ten',ten:'lum'};
const cpTyMod=(ct,mt)=>CSTRONG[ct]===mt?.2:CSTRONG[mt]===ct?-.2:0;
const CTYN={feu:'de feu',eau:'d’eau',terre:'de terre',ten:'des ténèbres',lum:'de lumière'};
/* espèces : base niveau 1, 1ʳᵉ forme */
const CSP=[
 {id:'brais',t:'feu',f:'drake',r:1,n:['Braisillon','Flammèche','Pyrodrake'],b:{hp:120,atk:22,mag:12,dp:14,dm:10,dod:4},lore:'Un petit dragon qui dort dans les cendres encore chaudes.'},
 {id:'cendr',t:'feu',f:'fox',r:0,n:['Cendrinet','Goupyre','Infernard'],b:{hp:100,atk:18,mag:16,dp:10,dm:12,dod:7},lore:'Un renardeau malin dont la queue fume quand il est content.'},
 {id:'goutt',t:'eau',f:'tad',r:0,n:['Gouttelin','Ondin','Léviathan'],b:{hp:130,atk:12,mag:20,dp:12,dm:14,dod:4},lore:'Né d’une goutte de pluie tombée dans un lac runique.'},
 {id:'coque',t:'eau',f:'crab',r:1,n:['Coquelune','Nacrabe','Abyssolon'],b:{hp:140,atk:18,mag:10,dp:20,dm:12,dod:3},lore:'Sa carapace garde la lumière de la lune.'},
 {id:'motte',t:'terre',f:'mole',r:0,n:['Mottelin','Rocaillon','Titanroc'],b:{hp:150,atk:16,mag:6,dp:20,dm:10,dod:2},lore:'Il creuse des galeries plus vite qu’un mineur.'},
 {id:'pouss',t:'terre',f:'sprout',r:1,n:['Pousselin','Ronceau','Sylvestre'],b:{hp:130,atk:12,mag:16,dp:14,dm:16,dod:4},lore:'Une pousse curieuse qui suit le soleil.'},
 {id:'ombre',t:'ten',f:'bat',r:1,n:['Ombrelin','Nocturne','Néantaile'],b:{hp:100,atk:18,mag:18,dp:10,dm:12,dod:9},lore:'Il ne sort qu’à la nuit tombée, et ne se perd jamais.'},
 {id:'spect',t:'ten',f:'wisp',r:2,n:['Spectrin','Hantise','Faucheuse'],b:{hp:110,atk:14,mag:24,dp:10,dm:18,dod:8},lore:'Un feu follet sombre qui murmure des noms oubliés.'},
 {id:'lueur',t:'lum',f:'fly',r:0,n:['Lueurin','Aurélion','Solarion'],b:{hp:95,atk:10,mag:20,dp:10,dm:16,dod:8},lore:'Une luciole qui éclaire les nuits des voyageurs.'},
 {id:'faon',t:'lum',f:'fawn',r:3,n:['Faonelle','Cerflumen','Sanctorne'],b:{hp:150,atk:20,mag:24,dp:16,dm:20,dod:6},lore:'Né d’un rayon de lune sur la neige. Il guide les voyageurs égarés.'}];
const CPK=Object.fromEntries(CSP.map(s=>[s.id,s]));
const CRR=[['Commune','#b0906a'],['Rare','#d6b032'],['Épique','#a050d8'],['Légendaire','#ff7a1a']];
const CSTN=[['hp','Vie','heart'],['atk','Attaque','swords'],['mag','Attaque magique','spark'],['dp','Défense physique','shield'],['dm','Défense magique','eye'],['dod','Esquive','auto']];
const CSTK=CSTN.map(x=>x[0]);
const CP_MAXL=50,CP_EVO=[20,40],CP_SHINY=.5,CP_IVP=1.3;
const CP_DRAW={ct_1:[62,28,8.5,1.5],ct_2:[0,60,32,8]};
/* passifs aléatoires */
const CPAS={
 st_hp:{n:'Robustesse',d:v=>`+${v} % de Vie`,r:[5,15]},st_atk:{n:'Crocs acérés',d:v=>`+${v} % d’Attaque`,r:[5,15]},st_mag:{n:'Éveil arcanique',d:v=>`+${v} % d’Attaque magique`,r:[5,15]},
 st_dp:{n:'Peau de pierre',d:v=>`+${v} % de Défense physique`,r:[5,15]},st_dm:{n:'Voile runique',d:v=>`+${v} % de Défense magique`,r:[5,15]},st_dod:{n:'Pas léger',d:v=>`+${v} Esquive`,r:[2,6]},
 succ:{n:'Instinct',d:v=>`+${v} % de réussite des expéditions`,r:[2,8]},loot:{n:'Flair du pilleur',d:v=>`+${v} % de butin`,r:[5,20]},time:{n:'Infatigable',d:v=>`−${v} % de durée des expéditions`,r:[4,12]},
 hung:{n:'Sobre',d:v=>`−${v} % de perte de faim`,r:[10,30]},xp:{n:'Curieux',d:v=>`+${v} % d’expérience`,r:[10,30]},tok:{n:'Collectionneur',d:v=>`+${v} % de jetons`,r:[10,30]},stone:{n:'Chercheur de pierres',d:v=>`+${v} % de chance de pierre d’évolution`,r:[10,40]}};
/* objets portés */
const CHELD={
 cw_atk:{n:'Griffe affûtée',d:'+15 % d’Attaque',st:{atk:15}},cw_mag:{n:'Amulette arcanique',d:'+15 % d’Attaque magique',st:{mag:15}},cw_hp:{n:'Collier de vigueur',d:'+15 % de Vie',st:{hp:15}},
 cw_dp:{n:'Carapace polie',d:'+15 % de Défense physique',st:{dp:15}},cw_dm:{n:'Voile d’argent',d:'+15 % de Défense magique',st:{dm:15}},cw_dod:{n:'Plume de vent',d:'+5 Esquive',dod:5},
 cw_succ:{n:'Boussole d’explorateur',d:'+5 % de réussite des expéditions',succ:5},cw_loot:{n:'Sac du pilleur',d:'+10 % de butin',loot:10},cw_time:{n:'Sablier de poche',d:'−10 % de durée des expéditions',time:10},cw_hung:{n:'Gourde sans fond',d:'−25 % de perte de faim',hung:25}};
/* habitats (cosmétiques du mode, hors saison) */
const CHAB=[['h_pre','Prairie',0,'linear-gradient(#2a4a2a,#0c1a0c)'],['h_vol','Volcan',300,'radial-gradient(ellipse at 50% 120%,#ff6a1a,#3a0c06 60%,#140604)'],['h_lag','Lagon',300,'radial-gradient(ellipse at 50% 120%,#3ab0d8,#0c2a4a 60%,#06101a)'],['h_for','Forêt d’ombre',300,'radial-gradient(ellipse at 50% 120%,#5a3a9a,#140a24 60%,#06030c)'],['h_tem','Temple solaire',500,'radial-gradient(ellipse at 50% 120%,#ffe08a,#7a5a08 55%,#1a1204)'],['h_cie','Ciel étoilé',800,'radial-gradient(circle at 30% 20%,#ffffff22 0 1px,transparent 2px) 0 0/34px 34px,radial-gradient(ellipse at 50% 120%,#3a4aa8,#0c1030 60%,#04060f)']];
/* ---------- objets du mode (inventaire) ---------- */
const CP_IT={
 cf_1:{n:'Croquettes de créature',r:0,cat:'Nourriture',d:'Rend 25 % de faim à une créature.',food:25,svg:'<path d="M5 14c0-4 3-7 7-7s7 3 7 7H5z" fill="#c8864a" stroke="#4a2a10" stroke-width="1.2"/><path d="M3 14h18v3a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3z" fill="#8a5a2a" stroke="#4a2a10" stroke-width="1.2"/><circle cx="9" cy="11" r="1.3" fill="#6a3a10"/><circle cx="14" cy="10" r="1.3" fill="#6a3a10"/>'},
 cf_2:{n:'Ragoût du dresseur',r:1,cat:'Nourriture',d:'Rend 60 % de faim à une créature.',food:60,svg:'<path d="M3 11h18l-2 8a2 2 0 0 1-2 1H7a2 2 0 0 1-2-1z" fill="#6a6a7a" stroke="#2a2a30" stroke-width="1.2"/><path d="M4 11c1-3 4-4 8-4s7 1 8 4" fill="#d88a3a" stroke="#6a3a10" stroke-width="1"/><path d="M9 6c1-2 0-3 1-4M13 6c1-2 0-3 1-4" stroke="#c8c8c8" stroke-width="1.2" fill="none"/>'},
 cf_3:{n:'Festin élémentaire',r:2,cat:'Nourriture',d:'Faim à 100 %, et la faim ne baisse plus pendant 6 heures.',food:100,free:6,svg:'<path d="M12 3l2.5 5 5.5.8-4 3.9 1 5.5L12 15.5 7 18.2l1-5.5-4-3.9L9.5 8z" fill="#ffb04a" stroke="#6a2400" stroke-width="1.2"/><circle cx="12" cy="11" r="2.5" fill="#fff6d0"/>'},
 ct_1:{n:'Ticket de découverte',r:2,cat:'Invocation',d:'Clic droit : révèle une nouvelle créature (×1 ou ×10). Commune 62 %, Rare 28 %, Épique 8,5 %, Légendaire 1,5 %. Shiny : 0,5 %.',svg:'<path d="M3 7h18v4a2 2 0 0 0 0 4v4H3v-4a2 2 0 0 0 0-4z" fill="#5ac8b0" stroke="#0c4a3a" stroke-width="1.2"/><path d="M9 7v12" stroke="#0c4a3a" stroke-width="1" stroke-dasharray="2 2"/><path d="M15 10l1 2 2 .3-1.5 1.4.4 2-1.9-1-1.9 1 .4-2L12 12.3l2-.3z" fill="#fff6d0"/>'},
 ct_2:{n:'Ticket de découverte supérieur',r:3,cat:'Invocation',d:'Clic droit : créature Rare ou mieux. Rare 60 %, Épique 32 %, Légendaire 8 %. Shiny : 0,5 %.',svg:'<path d="M3 7h18v4a2 2 0 0 0 0 4v4H3v-4a2 2 0 0 0 0-4z" fill="#ffb04a" stroke="#6a2400" stroke-width="1.2"/><path d="M9 7v12" stroke="#6a2400" stroke-width="1" stroke-dasharray="2 2"/><path d="M15 10l1 2 2 .3-1.5 1.4.4 2-1.9-1-1.9 1 .4-2L12 12.3l2-.3z" fill="#fff"/>'}};
for(const t of Object.keys(CTY)) CP_IT['cs_'+t]={n:'Pierre d’évolution '+CTYN[t],r:3,cat:'Évolution',d:`Fait évoluer une créature de type ${CTY[t].n} (niveau 20 pour la 2ᵉ forme, 40 pour la 3ᵉ).`,svg:`<path d="M12 2l6 6-3 13H9L6 8z" fill="${CTY[t].a}" stroke="${CTY[t].d}" stroke-width="1.2" stroke-linejoin="round"/><path d="M12 2l-2 6 2 13 2-13z" fill="${CTY[t].b}" opacity=".7"/><path d="M6 8h12" stroke="${CTY[t].d}" stroke-width=".8"/>`};
const CHELD_SVG='<path d="M5 9h14v11H5z" fill="#c99a3a" stroke="#4a2a10" stroke-width="1.2"/><path d="M3 6h18v3H3z" fill="#e8c060" stroke="#4a2a10" stroke-width="1.2"/><path d="M12 6v14" stroke="#7b2a1a" stroke-width="2"/><path d="M12 6C10 2 6 2 7 4.5S12 6 12 6s4-1 5-1.5S14 2 12 6z" fill="#7b2a1a"/>';
for(const [k,H] of Object.entries(CHELD)) CP_IT[k]={n:H.n,r:2,cat:'Objet porté de créature',d:H.d+' Une créature ne peut porter qu’un seul objet.',svg:CHELD_SVG};
for(const [k,o] of Object.entries(CP_IT)){ NEWI[k]=o; MI[k]=o.svg; MAT_OBJ[k]=o.n; MAT_N[k]=o.n; MAT_D[k]=o.d }
/* Marchand */
Object.assign(POTS,{ct_1:{n:CP_IT.ct_1.n,c:'#5ac8b0',p:330,nocombat:1,d:CP_IT.ct_1.d},ct_2:{n:CP_IT.ct_2.n,c:'#ffb04a',fix:{gold:60000,ru_anc:1},nocombat:1,d:CP_IT.ct_2.d},cf_1:{n:CP_IT.cf_1.n,c:'#c8864a',p:12,nocombat:1,d:CP_IT.cf_1.d},cf_2:{n:CP_IT.cf_2.n,c:'#d88a3a',p:35,nocombat:1,d:CP_IT.cf_2.d}});
/* ---------- état ---------- */
function cpS(){ if(!ACC.comp) ACC.comp={v:1,cap:30,tok:0,list:[],run:[],board:[],bk:null,seen:{},disc:0,nexp:0,hab:{h_pre:1},habSel:'h_pre',uid:0}; const C=ACC.comp; C.run=C.run||[]; C.list=C.list||[]; return C }
const cpNow=()=>Date.now();
const cpById=id=>cpS().list.find(c=>c.id===id);
const cpSpK=c=>CPK[c.sp];
const cpName=c=>c.nick||cpSpK(c).n[c.st];
const cpGradeV=c=>c.shiny?1:CSTK.reduce((a,s)=>a+c.iv[s],0)/6;
const cpGrade=c=>c.shiny?'★':((v)=>v>=.75?'S':v>=.62?'A':v>=.5?'B':v>=.38?'C':'D')(cpGradeV(c));
const CGRC={'★':'#ff7af0',S:'#ff7a1a',A:'#a050d8',B:'#2a86d8',C:'#5ac87a',D:'#8a7a6a'};
const cpPasOn=c=>(c.pas||[]).filter((p,i)=>i<=c.st);
const cpPasSum=(team,k)=>team.reduce((a,c)=>a+cpPasOn(c).filter(p=>p.k===k).reduce((b,p)=>b+p.v,0),0);
const cpItemV=(c,k)=>{const H=c.item&&CHELD[c.item]; return H?(H[k]||0):0};
const cpLvF=lv=>1+.07*(lv-1), cpStF=st=>[1,1.3,1.65][st];
function cpStat(c,s,mis){ const S=cpSpK(c),iv=c.shiny?1:c.iv[s],sh=c.shiny?1.15:1;
  let v=S.b[s]*cpLvF(c.lv)*cpStF(c.st)*(.6+.8*iv)*sh;
  const pk='st_'+s,pb=cpPasOn(c).filter(p=>p.k===pk).reduce((a,p)=>a+p.v,0),H=c.item&&CHELD[c.item];
  if(s==='dod') v+=pb+(H&&H.dod||0); else v*=1+(pb+(H&&H.st&&H.st[s]||0))/100;
  if(mis) v*=1-cpHuMal(cpHu(c))/100;
  return s==='dod'?Math.min(40,Math.round(v*10)/10):Math.round(v) }
const cpAvgB=s=>CSP.reduce((a,x)=>a+x.b[s],0)/CSP.length;
const cpRef=(s,L)=>cpAvgB(s)*cpLvF(L)*cpStF(L<20?0:L<40?1:2);
/* faim */
const cpHuMal=v=>v>=75?0:v>=50?20:v>=25?40:60;
function cpHuRate(c){ return (c.busy?2:1)*(1-Math.min(80,cpPasSum([c],'hung')+cpItemV(c,'hung'))/100) }
function cpHu(c){ const n=cpNow(),from=Math.max(c.huT||n,c.huF||0); if(n<=from) return Math.round(c.hu); return Math.max(0,Math.round(c.hu-(n-from)/36e5*cpHuRate(c))) }
function cpSettle(c){ c.hu=cpHu(c); c.huT=cpNow() }
/* expérience */
const cpXpN=lv=>Math.round(40*Math.pow(lv,1.5));
function cpGainXp(c,x){ let up=0; if(c.lv>=CP_MAXL){ c.xp=0; return 0 } c.xp=(c.xp||0)+x; while(c.lv<CP_MAXL&&c.xp>=cpXpN(c.lv)){ c.xp-=cpXpN(c.lv); c.lv++; up++ } if(c.lv>=CP_MAXL) c.xp=0; return up }
/* ---------- invocation ---------- */
function cpRollPas(){ const ks=Object.keys(CPAS),out=[]; while(out.length<3){ const k=ks[Math.floor(Math.random()*ks.length)]; if(out.some(p=>p.k===k)) continue; const [a,b]=CPAS[k].r; out.push({k,v:Math.round(a+(b-a)*Math.pow(Math.random(),1.4))}) } return out }
function cpRoll(kind){ const W=CP_DRAW[kind]||CP_DRAW.ct_1; let x=Math.random()*100,r=0; for(let i=0;i<4;i++){ if(x<W[i]){r=i;break} x-=W[i] }
  const L=CSP.filter(s=>s.r===r),sp=L[Math.floor(Math.random()*L.length)],shiny=Math.random()*100<CP_SHINY,iv={};
  for(const s of CSTK) iv[s]=shiny?1:Math.round(Math.pow(Math.random(),CP_IVP)*1000)/1000;
  const C=cpS(); C.uid=(C.uid||0)+1;
  return {id:'c'+Date.now().toString(36)+C.uid,sp:sp.id,st:0,lv:1,xp:0,iv,pas:cpRollPas(),shiny,hu:100,huT:cpNow(),item:null,busy:null,t:Date.now()} }
const cpRoom=()=>cpS().cap-cpS().list.length;
function cpSummon(kind,n){ const C=cpS(); n=Math.min(n,matAll(kind)); if(n<1) return null; if(cpRoom()<n){ toast(`Stockage plein : ${cpRoom()} place${cpRoom()>1?'s':''} libre${cpRoom()>1?'s':''}. Relâchez des créatures ou agrandissez le stockage.`); return null }
  removeMat(kind,n); const got=[]; for(let i=0;i<n;i++){ const c=cpRoll(kind); C.list.push(c); C.seen[c.sp]=1; C.disc=(C.disc||0)+1; got.push(c) }
  save(); saveAcc(); try{ trophyCheck() }catch(e){} return got }
/* ---------- tableau des expéditions ---------- */
const CMT=[['Le nid des salamandres','feu',['atk','dp'],'Des salamandres ont pris un ancien four de forge. Récupérez les braises rares.'],['Les grottes englouties','eau',['mag','dm'],'Un réseau de grottes inondées où dorment des coquillages runiques.'],['Le col des éboulis','terre',['hp','dp'],'Escortez une caravane de mineurs à travers un col instable.'],['Ruines nocturnes','ten',['mag','dm','dod'],'Des ombres hantent un monastère oublié. Il faut tenir jusqu’à l’aube.'],['Le sanctuaire solaire','lum',['hp','mag','dm'],'Au sommet du monde, la lumière ne s’éteint jamais.'],['La forge abandonnée','feu',['hp','atk'],'Des golems de braise gardent les dernières enclumes.'],['Le lac aux reflets','eau',['dod','mag'],'Des esprits d’eau imitent chaque pas des visiteurs.'],['La forêt pétrifiée','terre',['atk','dp'],'Des arbres de pierre cachent des runes anciennes.'],['Les catacombes murmurantes','ten',['atk','dod'],'Des voix appellent depuis le fond des tombes.'],['La tour des augures','lum',['mag','dod'],'Les prêtres-oiseaux protègent leurs prophéties.'],['Le marais brumeux','eau',['hp','dm'],'Une brume qui fait oublier le chemin du retour.'],['La faille de cendre','feu',['mag','dp'],'Une fissure de lave qui s’élargit chaque nuit.']];
const CP_H=[[1,10],[2,14],[3,12],[4,14],[6,14],[8,12],[12,14],[24,10]];
const CP_BOARD=5,CP_REFRESH=6*36e5;
function cpMaxLv(){ return Math.max(1,...cpS().list.map(c=>c.lv)) }
function cpGenM(seed,i){ const R=qRng(seed+'_'+i),T=CMT[Math.floor(R()*CMT.length)],tot=CP_H.reduce((a,x)=>a+x[1],0); let x=R()*tot,h=1; for(const [hh,w] of CP_H){ if(x<w){h=hh;break} x-=w }
  const sl=h<=2?(R()<.5?1:2):h<=8?2:3,lv=Math.max(1,Math.min(CP_MAXL,cpMaxLv()-4+Math.floor(R()*10)+(h>=24?5:h>=12?2:0)));
  return {id:seed+'_'+i,n:T[0],t:T[1],st:T[2],d:T[3],h,sl,lv} }
function cpBoard(){ const C=cpS(),k=Math.floor(cpNow()/CP_REFRESH); if(C.bk!==k||!Array.isArray(C.board)||!C.board.length){ C.bk=k; C.board=Array.from({length:CP_BOARD},(_,i)=>cpGenM('b'+k+(ACC.owner||''),i)); saveAcc() } return C.board }
const cpBoardLeft=()=>(Math.floor(cpNow()/CP_REFRESH)+1)*CP_REFRESH-cpNow();
/* butin */
function cpLootPool(L){ const p=[['pd_rune',4,8],['es_pie',1,3],['es_bra',1,3],['es_ven',1,3],['sc_blank',1,2],['cf_1',1,2]]; if(L>=15) p.push(['st_up',1,2],['ru_min',1,2],['gm_mag',1,1]); if(L>=30) p.push(['ru_maj',1,1],['gm_rar',1,1],['ch_pou',1,1],['cf_2',1,1]); if(L>=45) p.push(['ru_anc',1,1],['gm_epi',1,1]); return p }
function cpRewards(M){ const R=qRng('rw'+M.id),P=cpLootPool(M.lv).slice(),out=[],f=1+M.h/8; for(let i=0;i<3&&P.length;i++){ const j=Math.floor(R()*P.length),[k,a,b]=P.splice(j,1)[0]; out.push([k,Math.max(1,Math.round(a*f)),Math.max(1,Math.round(b*f))]) }
  return {mats:out,gold:Math.round(220*Math.pow(M.h,.85)*(1+M.lv/10)),tok:[Math.round(5*Math.pow(M.h,.8)),Math.round(9*Math.pow(M.h,.8))],stone:Math.round(1.5*Math.pow(M.h,.75)*10)/10} }
/* chance de réussite */
function cpChance(M,team){ const lines=[]; if(!team.length) return {ch:0,lines,T:0};
  const sc=team.map(c=>{ const s=M.st.reduce((a,k)=>a+cpStat(c,k,true)/cpRef(k,M.lv),0)/M.st.length,tm=cpTyMod(cpSpK(c).t,M.t); return {c,s,tm,v:s*(1+tm)} });
  const T=sc.reduce((a,x)=>a+x.v,0)/M.sl,base=Math.round(60*T);
  lines.push([`Statistiques de l’équipe (${M.st.map(k=>CSTN.find(z=>z[0]===k)[1]).join(', ')})`,base,'']);
  for(const x of sc) if(x.tm) lines.push([`${cpName(x.c)} : ${CTY[cpSpK(x.c).t].n} contre ${CTY[M.t].n}`,null,(x.tm>0?'+':'−')+'20 % sur ses statistiques']);
  for(const c of team){ const m=cpHuMal(cpHu(c)); if(m) lines.push([`${cpName(c)} a faim (${cpHu(c)} %)`,null,`−${m} % sur ses statistiques`]) }
  if(team.length<M.sl) lines.push([`${team.length} créature${team.length>1?'s':''} sur ${M.sl} places`,null,'équipe incomplète']);
  const al=team.reduce((a,c)=>a+c.lv,0)/team.length,dl=al-M.lv,lm=dl<0?Math.max(-40,Math.round(dl*2)):Math.min(10,Math.round(dl*.5));
  if(lm) lines.push([`Niveau moyen ${Math.round(al)} / ${M.lv}`,lm,'']);
  const sb=Math.round(cpPasSum(team,'succ')+team.reduce((a,c)=>a+cpItemV(c,'succ'),0)); if(sb) lines.push(['Passifs et objets portés',sb,'']);
  return {ch:Math.max(5,Math.min(95,base+lm+sb)),lines,T} }
function cpDur(M,team){ const red=Math.min(40,cpPasSum(team,'time')+team.reduce((a,c)=>a+cpItemV(c,'time'),0)); return Math.round(M.h*36e5*(1-red/100)) }
/* lancer / terminer */
function cpLaunch(){ const C=cpS(),B=cpBoard(),M=B.find(m=>m.id===UI.cpM); if(!M) return; if(C.run.some(r=>r.m.id===M.id)){ toast('Cette expédition est déjà en cours.'); return }
  const team=(UI.cpTeam||[]).map(cpById).filter(c=>c&&!c.busy).slice(0,M.sl); if(!team.length){ toast('Choisissez au moins une créature.'); return }
  const {ch}=cpChance(M,team),dur=cpDur(M,team),r={id:'r'+Date.now().toString(36),m:Object.assign({},M),team:team.map(c=>c.id),t0:cpNow(),t1:cpNow()+dur,ch};
  for(const c of team){ cpSettle(c); c.busy=r.id } C.run.push(r); UI.cpTeam=[]; saveAcc(); render(); toast(`Expédition lancée : ${M.n} (${cpFmtT(dur)}).`) }
const cpFmtT=ms=>{ const m=Math.max(0,Math.ceil(ms/60000)),h=Math.floor(m/60),mm=m%60; return h?`${h} h${mm?' '+String(mm).padStart(2,'0'):''}`:`${mm} min` };
function cpClaim(rid){ const C=cpS(),r=C.run.find(x=>x.id===rid); if(!r||cpNow()<r.t1) return;
  const team=r.team.map(cpById).filter(Boolean),M=r.m,ok=Math.random()*100<r.ch,RW=cpRewards(M),f=ok?1:.25;
  const lb=1+(cpPasSum(team,'loot')+team.reduce((a,c)=>a+cpItemV(c,'loot'),0))/100,tb=1+cpPasSum(team,'tok')/100,xb=1+cpPasSum(team,'xp')/100,sb=1+cpPasSum(team,'stone')/100;
  const got=[]; for(const [k,a,b] of RW.mats){ const n=Math.round((a+Math.floor(Math.random()*(b-a+1)))*lb*f); if(n>0) got.push([k,n]) }
  const gold=Math.round(RW.gold*lb*f),tok=Math.round((RW.tok[0]+Math.random()*(RW.tok[1]-RW.tok[0]))*tb*f);
  if(ok&&Math.random()*100<RW.stone*sb) got.push(['cs_'+M.t,1]);
  if(got.length) qGive(got); S.gold+=gold; C.tok=(C.tok||0)+tok;
  const xp=Math.round(25*Math.pow(M.lv,.9)*Math.pow(M.h,.75)*xb*(ok?1:.5)),ups=[];
  for(const c of team){ cpSettle(c); c.busy=null; const u=cpGainXp(c,xp); if(u) ups.push(`${cpName(c)} passe niveau ${c.lv}`) }
  C.run=C.run.filter(x=>x!==r); C.nexp=(C.nexp||0)+1; if(ok) qEv('cexp'); save(); saveAcc(); try{ trophyCheck() }catch(e){} render();
  cpResModal(M,ok,got,gold,tok,xp,ups) }
function cpResModal(M,ok,got,gold,tok,xp,ups){ const w=document.createElement('div'); w.className='s8m'; w.id='cpres'; w.setAttribute('role','dialog'); w.setAttribute('aria-modal','true');
  w.innerHTML=`<div class="s8mb cpresb" style="--cc:${ok?'#5ac87a':'#c0392b'}"><small>${esc(M.n)}</small><b>${ok?'Expédition réussie !':'Expédition échouée'}</b><p>${ok?'Vos créatures rentrent avec tout le butin.':'Vos créatures rentrent avec 25 % du butin et la moitié de l’expérience.'}</p><div class="cprw">${got.map(([k,n])=>`<span data-tip="nw:${k}">${matIcon(k)}${fmt(n)}</span>`).join('')}<span>${matIcon('gold')}${fmt(gold)}</span><span>${CPTOK}${fmt(tok)}</span><span>+${fmt(xp)} XP</span></div>${ups.length?`<p class="cpup">${ups.map(esc).join(' · ')}</p>`:''}<div class="row"><button class="btn pri" data-act="cpResX">Fermer</button></div></div>`;
  w.addEventListener('click',e=>{ if(e.target===w) w.remove() }); document.body.append(w) }
const cpDone=()=>cpS().run.filter(r=>cpNow()>=r.t1).length;
let CPD=-1;
function compTick(){ if(!ACC.comp) return; const d=cpDone(); if(d!==CPD){ CPD=d; if(typeof renderTabs==='function'&&!UI.scr) renderTabs(); if(UI.tab==='comp'&&!UI.scr) render() }
  if(UI.tab==='comp'&&!UI.scr) document.querySelectorAll('[data-cpt]').forEach(e=>{ const t=+e.dataset.cpt; e.textContent=t>cpNow()?cpFmtT(t-cpNow()):'Terminée' }) }
/* ---------- relâcher ---------- */
const cpRelTok=c=>3+cpSpK(c).r*4+({'★':0,S:20,A:8,B:3,C:1,D:0})[cpGrade(c)]+(c.shiny?100:0)+Math.floor(c.lv/5)+c.st*3;
function cpRelease(ids){ const C=cpS(); let tok=0,n=0; for(const id of ids){ const c=cpById(id); if(!c||c.busy) continue; if(c.item) qGive([[c.item,1]]); tok+=cpRelTok(c); n++; C.list=C.list.filter(x=>x!==c) }
  C.tok=(C.tok||0)+tok; if(ids.includes(UI.cpSel)) UI.cpSel=null; UI.cpPick=new Set(); UI.cpMulti=false; UI.confirm=null; save(); saveAcc(); render(); if(n) toast(`${n} créature${n>1?'s':''} relâchée${n>1?'s':''} : +${fmt(tok)} jetons.`) }
/* ---------- boutique du dresseur ---------- */
const CSHOP=[['cf_1',10],['cf_2',25],['cf_3',80],['ct_1',150],...Object.keys(CTY).map(t=>['cs_'+t,450]),...Object.keys(CHELD).map(k=>[k,160])];
const cpCapCost=()=>300*(1+Math.round((cpS().cap-30)/10));
function cpBuy(k){ const C=cpS();
  if(k==='cap'){ const p=cpCapCost(); if(C.cap>=100){ toast('Stockage maximum atteint (100).'); return } if(C.tok<p) return; C.tok-=p; C.cap+=10; saveAcc(); render(); toast(`Stockage agrandi : ${C.cap} places.`); return }
  if(k.startsWith('h_')){ const H=CHAB.find(x=>x[0]===k); if(!H) return; if(C.hab[k]){ C.habSel=k; saveAcc(); render(); return } if(C.tok<H[2]) return; C.tok-=H[2]; C.hab[k]=1; C.habSel=k; saveAcc(); render(); toast(`Habitat ${H[1]} débloqué.`); return }
  const E=CSHOP.find(x=>x[0]===k); if(!E||C.tok<E[1]) return; if(matRoom(k)<1){ toast('Inventaire plein.'); return } C.tok-=E[1]; bagAddMat(S.bag,k,1); markNew(); save(); saveAcc(); render(); toast(`Achat : ${MAT_OBJ[k]}.`) }
/* ---------- nourrir, évoluer, objet ---------- */
function cpFeed(id,k){ const c=cpById(id),F=CP_IT[k]; if(!c||!F||matAll(k)<1) return; cpSettle(c); if(c.hu>=100&&!F.free){ toast(`${cpName(c)} n’a pas faim.`); return } removeMat(k,1); c.hu=Math.min(100,c.hu+F.food); c.huT=cpNow(); if(F.free) c.huF=cpNow()+F.free*36e5; save(); saveAcc(); render(); toast(`${cpName(c)} mange : ${F.n} (faim ${c.hu} %).`) }
function cpEvo(id){ const c=cpById(id); if(!c||c.st>=2) return; const need=CP_EVO[c.st],k='cs_'+cpSpK(c).t; if(c.lv<need||matAll(k)<1) return; removeMat(k,1); c.st++; save(); saveAcc(); try{ trophyCheck() }catch(e){} render(); toast(`✦ ${cpSpK(c).n[c.st-1]} évolue en ${cpSpK(c).n[c.st]} ! Nouveau passif débloqué.`) }
function cpEquip(id,k){ const c=cpById(id); if(!c) return; if(k){ if(matAll(k)<1) return; removeMat(k,1) } if(c.item) qGive([[c.item,1]]); c.item=k||null; UI.cpItemPick=false; save(); saveAcc(); render() }
/* ---------- dessin ---------- */
const CPTOK='<svg viewBox="0 0 24 24" class="cptok" aria-hidden="true"><circle cx="12" cy="12" r="9" fill="#5ac8b0" stroke="#0c4a3a" stroke-width="1.5"/><path d="M8 13c0-3 2-5 4-5s4 2 4 5c0 2-2 3-4 3s-4-1-4-3z" fill="#e0fff6"/><circle cx="9" cy="8" r="1.6" fill="#e0fff6"/><circle cx="15" cy="8" r="1.6" fill="#e0fff6"/></svg>';
const cpTYI=t=>`<svg viewBox="0 0 24 24" class="cpti" aria-hidden="true">${({feu:'<path d="M12 2c1 4 5 5.5 5 10.5A5 5 0 0 1 7 12.5c0-2 1-3.2 2-4 0 2 1 3 2 3-1-3 0-6.5 1-9.5z" fill="currentColor"/>',eau:'<path d="M12 2C9 7 5 11 5 15a7 7 0 0 0 14 0c0-4-4-8-7-13z" fill="currentColor"/>',terre:'<path d="M2 20l6-10 4 6 3-4 7 8z" fill="currentColor"/>',ten:'<path d="M15 3a9 9 0 1 0 6 15A7 7 0 0 1 15 3z" fill="currentColor"/>',lum:'<circle cx="12" cy="12" r="4.5" fill="currentColor"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M5 19l2-2M17 7l2-2" stroke="currentColor" stroke-width="2"/>'})[t]}</svg>`;
const cpTyB=(t,big)=>`<span class="cpty ${big?'big':''}" style="--ta:${CTY[t].a};--tb:${CTY[t].b}" ${ttip('Type '+CTY[t].n,'Fort contre '+CTY[CSTRONG[t]].n+(t==='lum'||t==='ten'?'':' ; faible contre '+CTY[Object.keys(CSTRONG).find(k=>CSTRONG[k]===t)].n)+'. ±20 % sur les statistiques en expédition.')}>${cpTYI(t)}${CTY[t].n}</span>`;
const cpHuBar=(v,sm)=>{const c=v>=75?'#5ac87a':v>=50?'#e0b830':v>=25?'#e07a2a':'#d8342b',m=cpHuMal(v);return `<span class="cphu ${sm?'sm':''}" ${ttip('Faim : '+v+' %',m?`Malus de −${m} % sur les statistiques en expédition.`:'Aucun malus (75 % ou plus).')}><svg viewBox="0 0 24 24"><path d="M8 3c2 3-1 5 1 8M12 3c2 3-1 5 1 8M16 3c2 3-1 5 1 8" stroke="currentColor" stroke-width="1.6" fill="none"/><path d="M4 13h16a8 8 0 0 1-16 0z" fill="currentColor"/></svg><i><b style="width:${v}%;background:${c}"></b></i><em class="num">${v} %</em></span>`};
const cpGrB=c=>{const g=cpGrade(c);return `<span class="cpgr" style="--gc:${CGRC[g]}" ${ttip(g==='★'?'Shiny':'Qualité '+g,g==='★'?'Toutes les statistiques au maximum, +15 %.':`Qualité moyenne des statistiques : ${Math.round(cpGradeV(c)*100)} %. S ≥ 75 %, A ≥ 62 %, B ≥ 50 %, C ≥ 38 %.`)}>${g}</span>`};
const cpArt=(c,px)=>`<span class="cpart ${c.shiny?'shiny':''}">${cpCrea(c.sp,c.st,px)}${c.shiny?'<i class="cpsp s1"></i><i class="cpsp s2"></i><i class="cpsp s3"></i>':''}</span>`;
const cpMi=k=>k==='gold'?matIcon('gold'):`<svg class="mfi" viewBox="0 0 24 24">${MI[k]||''}</svg>`;
function cpNav(t){ const C=cpS(),d=cpDone(),run=C.run.length;
  const B=(k,ic,n,s,em,lk)=>`<button class="${t===k?'on':''} ${lk?'cplk':''}" ${lk?`aria-disabled="true" ${ttip(n,'Arrive dans une prochaine mise à jour.')}`:`data-act="cpT" data-t="${k}"`} aria-pressed="${t===k}">${uic(ic)}<span><b>${n}</b><small>${s}</small></span>${em?`<em>${em}</em>`:''}${lk?uic('lock'):''}</button>`;
  return `<nav class="cpnav" aria-label="Compagnon"><small>Compagnon</small>${B('c','paw','Mes créatures',`${C.list.length} / ${C.cap}${run?' · '+C.list.filter(c=>c.busy).length+' en expédition':''}`)}${B('e','flag','Expéditions',`${run} en cours`,d)}${B('d','swords','Duels de créatures','Bientôt','',1)}${B('s','coin','Boutique du dresseur','Nourriture, objets, habitats')}
   <div class="cpcur" ${ttip('Jetons de ménagerie','Monnaie du mode Compagnon : expéditions et créatures relâchées.')}>${CPTOK}<b class="num">${fmt(C.tok||0)}</b><small>jetons</small></div>
   <div class="cptk">${['ct_1','ct_2'].map(k=>`<button class="cptkb" data-act="cpTick" data-k="${k}" ${matAll(k)?'':'disabled'} ${ttip(MAT_OBJ[k],'Vous en avez '+matAll(k)+'. Clic droit dans l’inventaire, ou ici.')}><svg viewBox="0 0 24 24">${MI[k]}</svg><em class="num">${matAll(k)}</em></button>`).join('')}<small>Invoquer</small></div></nav>` }
const CP_SORT=[['grade','Qualité'],['lv','Niveau'],['rar','Rareté'],['type','Type'],['new','Récentes']];
function cpSorted(){ const L=cpS().list.slice(),k=UI.cpSort||'grade',ty=Object.keys(CTY);
  const f={grade:c=>-(c.shiny?2:cpGradeV(c)),lv:c=>-c.lv,rar:c=>-cpSpK(c).r,type:c=>ty.indexOf(cpSpK(c).t),new:c=>-(c.t||0)}[k]; return L.sort((a,b)=>f(a)-f(b)) }
function cpCard(c){ const S=cpSpK(c),on=UI.cpSel===c.id,pk=UI.cpMulti&&UI.cpPick&&UI.cpPick.has(c.id);
  return `<div class="cpcard ${on?'on':''} ${pk?'pk':''} ${c.busy?'busy':''}" style="--ta:${CTY[S.t].a}" data-act="cpSel" data-id="${c.id}" role="button" tabindex="0" aria-label="${esc(cpName(c))}">${cpTyB(S.t)}<span class="cplv">Niv ${c.lv}</span>${cpGrB(c)}${cpArt(c,100)}${c.busy?`<span class="cpbusy">${uic('flag')} En expédition</span>`:''}<b>${esc(cpName(c))}</b><small style="color:${CRR[S.r][1]}">${CRR[S.r][0]}${c.shiny?' · Shiny':''}</small>${cpHuBar(cpHu(c),1)}
   ${UI.cpMulti?`<span class="cpck">${pk?uic('check'):''}</span>`:''}${on&&!UI.cpMulti?`<div class="cpside"><button data-act="cpRelAsk" data-id="${c.id}" ${c.busy?'disabled':''} ${ttip('Relâcher '+cpName(c),c.busy?'Impossible pendant une expédition.':`Rend ${cpRelTok(c)} jetons. L’objet porté retourne dans l’inventaire.`)}>${uic('trash')}</button></div>`:''}</div>` }
function cpDetail(c){ if(!c) return `<div class="cpdet cpempty"><div class="cpbody"><h3>Ménagerie</h3><p>Choisissez une créature pour voir sa fiche. Les statistiques et les passifs de chaque créature sont tirés au hasard : invoquez souvent pour trouver les meilleures, et relâchez les autres contre des jetons.</p><ul class="cppas"><li><b>Qualité</b>S, A, B, C ou D selon la moyenne de ses statistiques</li><li><b>Shiny</b>0,5 % de chance : toutes les statistiques au maximum, +15 %</li><li><b>Évolution</b>Niveau 20 puis 40 + une pierre d’évolution de son type</li></ul></div></div>`;
  const S=cpSpK(c),C=cpS(),H=CHAB.find(x=>x[0]===C.habSel)||CHAB[0],hu=cpHu(c),need=CP_EVO[c.st],sk='cs_'+S.t,canEvo=c.st<2&&c.lv>=need&&matAll(sk)>0;
  const stats=CSTN.map(([k,n,ic])=>{const v=cpStat(c,k),q=c.shiny?100:Math.round(c.iv[k]*100);return `<div class="cpsb" ${ttip(n+' : '+v+(k==='dod'?' %':''),`Qualité de cette statistique : ${q} %${c.shiny?' (Shiny : maximum + 15 %)':''}.`)}><span>${uic(UIC[ic]?ic:'star')}${n}</span><i><b style="width:${q}%;background:${q>=80?'linear-gradient(90deg,#c0461a,#ffb04a)':q>=55?'linear-gradient(90deg,#3a9a4a,#8fe08a)':'linear-gradient(90deg,#8a7a6a,#c8b8a0)'}"></b></i><em class="num">${v}${k==='dod'?' %':''}</em></div>`}).join('');
  const held=c.item&&CHELD[c.item],own=Object.keys(CHELD).filter(k=>matAll(k)>0);
  return `<div class="cpdet" style="--ta:${CTY[S.t].a}"><div class="cphero" style="background:${H[3]}"><button class="cpclose" data-act="cpSel" data-id="${c.id}" ${ttip('Fermer la fiche')}>${uic('xx')}</button>${cpTyB(S.t,1)}<span class="cplv">Niveau ${c.lv}</span>${cpArt(c,190)}<button class="cprel" data-act="cpRelAsk" data-id="${c.id}" ${c.busy?'disabled':''} ${ttip('Relâcher',c.busy?'Impossible pendant une expédition.':`Rend ${cpRelTok(c)} jetons.`)}>${uic('trash')}</button></div><div class="cpbody">
   <div class="cpnm"><h3>${esc(cpName(c))}</h3>${cpGrB(c)}</div><small style="color:#c8ad80">${CRR[S.r][0]}${c.shiny?' · <b style="color:#ff9af0">Shiny</b>':''} · ${S.n.join(' → ')}</small>
   ${c.lv<CP_MAXL?`<div class="cpxp"><b style="width:${Math.min(100,(c.xp||0)/cpXpN(c.lv)*100)}%"></b></div><small class="num" style="color:#8fe0d0">${fmt(c.xp||0)} / ${fmt(cpXpN(c.lv))} XP</small>`:'<small style="color:#8fe0d0">Niveau maximum</small>'}
   ${c.busy?`<p class="cpwarn" style="color:#8fe0d0">${uic('flag')} En expédition.</p>`:''}
   <h4>Faim</h4>${cpHuBar(hu)}${c.huF>cpNow()?`<small style="color:#8fe0d0">Rassasiée encore ${cpFmtT(c.huF-cpNow())}</small>`:''}<div class="cpfeed">${['cf_1','cf_2','cf_3'].map(k=>`<button data-act="cpFeed" data-id="${c.id}" data-k="${k}" ${matAll(k)?'':'disabled'} data-tip="nw:${k}"><svg viewBox="0 0 24 24">${MI[k]}</svg>${CP_IT[k].n.split(' ')[0]} <small>×${matAll(k)}</small></button>`).join('')}</div>
   <h4>Statistiques <small class="mute">barre = qualité</small></h4>${stats}
   <h4>Évolution</h4><div class="cpevo">${S.n.map((n,i)=>`<div class="${i===c.st?'on':i>c.st?'lk':''}">${cpCrea(c.sp,i,50)}<b>${n}</b><small>${i?'Niv '+CP_EVO[i-1]:'Forme 1'}</small></div>${i<2?'<b>›</b>':''}`).join('')}</div>
   ${c.st<2?`<div class="cpreq"><svg class="cpst" viewBox="0 0 24 24">${MI[sk]}</svg><span>Niveau ${need} ${c.lv>=need?'✓':`(${c.lv})`} + 1 ${MAT_OBJ[sk]} <small>(${matAll(sk)})</small></span><button class="btn sm ${canEvo?'pri':''}" data-act="cpEvo" data-id="${c.id}" ${canEvo?'':'disabled'}>Faire évoluer</button></div>`:''}
   <h4>Passifs</h4><ul class="cppas">${(c.pas||[]).map((p,i)=>`<li class="${i>c.st?'lk':''}"><b>${CPAS[p.k].n}</b>${CPAS[p.k].d(p.v)}<em>${i>c.st?'Forme '+(i+1):'Actif'}</em></li>`).join('')}</ul>
   <h4>Objet porté</h4><div class="cphld"><span class="cphi">${held?`<svg viewBox="0 0 24 24">${CHELD_SVG}</svg>`:uic('plus')}</span><span><b>${held?held.n:'Aucun objet'}</b><small>${held?held.d:'Un seul objet par créature.'}</small></span><button class="btn sm" data-act="cpItemPick" style="margin-left:auto" ${c.busy?'disabled':''}>${held?'Changer':'Équiper'}</button></div>
   ${UI.cpItemPick&&!c.busy?`<div class="cpipick">${own.map(k=>`<button data-act="cpEquip" data-id="${c.id}" data-k="${k}" data-tip="nw:${k}"><svg viewBox="0 0 24 24">${CHELD_SVG}</svg>${CHELD[k].n} <small>×${matAll(k)}</small></button>`).join('')||'<small class="mute">Aucun objet porté dans l’inventaire. Achetez-en à la Boutique du dresseur.</small>'}${held?`<button data-act="cpEquip" data-id="${c.id}" data-k="">${uic('xx')} Retirer</button>`:''}</div>`:''}
   <p class="cplore">« ${esc(S.lore)} »</p></div></div>` }
function cpViewC(){ const C=cpS(),L=cpSorted(),sel=UI.cpSel&&cpById(UI.cpSel);
  const tb=`<div class="cptb"><label>Trier <select class="pcsel" id="cpsort">${CP_SORT.map(([k,n])=>`<option value="${k}" ${(UI.cpSort||'grade')===k?'selected':''}>${n}</option>`).join('')}</select></label><span class="cpcap num" ${ttip('Stockage',`${C.list.length} créatures sur ${C.cap} places. Agrandissez-le à la Boutique du dresseur.`)}>${uic('cpbag')}${C.list.length} / ${C.cap}</span>
   <button class="btn sm ${UI.cpMulti?'pri':''}" data-act="cpMulti" ${ttip('Relâcher plusieurs','Sélectionnez plusieurs créatures puis relâchez-les en une fois.')}>${uic('trash')} Relâcher plusieurs</button></div>`;
  const pick=UI.cpPick||new Set(),pt=[...pick].map(cpById).filter(Boolean).reduce((a,c)=>a+cpRelTok(c),0);
  const mb=UI.cpMulti?`<div class="cpmb"><b>${pick.size} sélectionnée${pick.size>1?'s':''}</b><span>+${fmt(pt)} jetons</span><button class="btn sm" data-act="cpPickG" data-g="DC">Toutes les D et C</button><button class="btn sm" data-act="cpPickG" data-g="none">Aucune</button>${UI.confirm==='cpRelMany'?`<button class="btn sm danger" data-act="cpRelMany">Confirmer (${pick.size})</button><button class="btn sm" data-act="cpMultiNo">Annuler</button>`:`<button class="btn sm danger" data-act="cpRelMany" ${pick.size?'':'disabled'}>Relâcher</button><button class="btn sm" data-act="cpMulti">Terminer</button>`}</div>`:'';
  const cards=L.map(cpCard).join('')+(C.list.length<C.cap?`<button class="cpcard add" data-act="cpTick" data-k="${matAll('ct_1')?'ct_1':matAll('ct_2')?'ct_2':'ct_1'}" ${matAll('ct_1')||matAll('ct_2')?'':'disabled'}><svg viewBox="0 0 24 24">${MI.ct_1}</svg><b>Nouvelle créature</b><small>${matAll('ct_1')+matAll('ct_2')?'Utiliser un Ticket de découverte':'Tickets au Marchand ou à la Boutique du dresseur'}</small></button>`:'');
  return `<div class="cpmid">${tb}${mb}<div class="cpgrid">${cards}</div></div>${UI.cpMulti?'<div></div>':cpDetail(sel)}` }
function cpViewE(){ const C=cpS(),B=cpBoard(),run=C.run.slice().sort((a,b)=>a.t1-b.t1);
  if(!B.some(m=>m.id===UI.cpM)) UI.cpM=(B.find(m=>!C.run.some(r=>r.m.id===m.id))||{}).id;
  const rl=run.map(r=>{const d=cpNow()>=r.t1,p=Math.min(100,(cpNow()-r.t0)/(r.t1-r.t0)*100);return `<div class="cpexi cprun" style="--ta:${CTY[r.m.t].a}"><span class="cpmi">${cpTYI(r.m.t)}</span><div><b>${esc(r.m.n)}</b><small>${r.team.map(cpById).filter(Boolean).map(c=>esc(cpName(c))).join(', ')} · ${r.ch} % de réussite</small></div><div class="cpdur">${d?`<button class="qbtn" data-act="cpClaim" data-id="${r.id}">Récupérer</button>`:`<span data-cpt="${r.t1}">${cpFmtT(r.t1-cpNow())}</span><small>restantes</small>`}</div><div class="cpbar"><b style="width:${p}%"></b></div></div>`}).join('');
  const bl=B.map(m=>{const r=C.run.find(x=>x.m.id===m.id);if(r) return '';return `<div class="cpexi ${UI.cpM===m.id?'on':''}" style="--ta:${CTY[m.t].a}" data-act="cpM" data-id="${m.id}" role="button" tabindex="0"><span class="cpmi">${cpTYI(m.t)}</span><div><b>${esc(m.n)}</b><small>${cpTyB(m.t)} Niveau ${m.lv} · ${m.sl} créature${m.sl>1?'s':''} max · ${m.st.map(k=>CSTN.find(s=>s[0]===k)[1]).join(', ')}</small></div><div class="cpdur">${m.h} h</div></div>`}).join('');
  const M=B.find(m=>m.id===UI.cpM);
  let det='<div class="cpdet cpempty"><div class="cpbody"><h3>Expéditions</h3><p>Toutes les expéditions disponibles sont en cours. De nouvelles arrivent bientôt.</p></div></div>';
  if(M){ UI.cpTeam=(UI.cpTeam||[]).filter(id=>{const c=cpById(id);return c&&!c.busy}).slice(0,M.sl); const team=UI.cpTeam.map(cpById),X=cpChance(M,team),RW=cpRewards(M),dur=cpDur(M,team);
    const free=cpS().list.filter(c=>!c.busy&&!UI.cpTeam.includes(c.id)).map(c=>({c,v:cpChance(M,[c]).T*M.sl})).sort((a,b)=>b.v-a.v);
    const slots=Array.from({length:M.sl},(_,i)=>{const c=team[i];if(!c) return `<div class="cpslot">${uic('plus')}<span>Emplacement libre</span><small>${i?'(facultatif)':'choisissez ci-dessous'}</small></div>`;const tm=cpTyMod(cpSpK(c).t,M.t);return `<button class="cpslot full" style="--ta:${CTY[cpSpK(c).t].a}" data-act="cpTeam" data-id="${c.id}" ${ttip('Retirer '+cpName(c))}>${tm?`<span class="cpadv ${tm<0?'no':''}">${tm>0?'+':'−'}20 %</span>`:''}${cpArt(c,64)}<b>${esc(cpName(c))}</b><small>Niv ${c.lv} · ${cpHu(c)} %</small></button>`}).join('');
    det=`<div class="cpdet" style="--ta:${CTY[M.t].a}"><div class="cpbody"><h3>${esc(M.n)}</h3><small style="color:#c8ad80;display:flex;gap:8px;align-items:center;flex-wrap:wrap">${cpTyB(M.t)} Niveau ${M.lv} · ${M.h} h · jusqu’à ${M.sl} créature${M.sl>1?'s':''}</small><p style="font-size:.82rem;color:#e8d4a8">${esc(M.d)}</p>
     <h4>Équipe</h4><div class="cpslots">${slots}</div>
     <div class="cpfree">${free.length?free.slice(0,12).map(({c,v})=>`<button class="cpfr" data-act="cpTeam" data-id="${c.id}" ${UI.cpTeam.length>=M.sl?'disabled':''} ${ttip(cpName(c),`Niveau ${c.lv} · faim ${cpHu(c)} % · apport estimé ${Math.round(60*v/M.sl)} %`)}>${cpArt(c,40)}<small>${esc(cpName(c))}</small><em>${cpGrade(c)}</em></button>`).join(''):'<small class="mute">Aucune créature disponible.</small>'}</div>
     <button class="btn sm" data-act="cpBest" ${free.length?'':'disabled'}>${uic('star')} Meilleure équipe</button>
     <div class="cpchg"><div class="cpring" style="--p:${X.ch}"><b class="num">${X.ch} %</b></div><ul class="cpcalc">${X.lines.map(([t,v,s])=>`<li>${esc(t)} <span class="${v!=null?(v>=0?'ok':'no'):(s.startsWith('+')?'ok':s?'no':'')}">${v!=null?(v>=0?'+':'')+v+' %':esc(s)}</span></li>`).join('')||'<li>Ajoutez des créatures pour estimer la réussite.</li>'}</ul></div>
     <h4>Butin possible</h4><div class="cprw">${RW.mats.map(([k,a,b])=>`<span data-tip="nw:${k}">${cpMi(k)}${a===b?a:a+'-'+b}</span>`).join('')}<span>${matIcon('gold')}${fmt(RW.gold)}</span><span>${CPTOK}${RW.tok[0]}-${RW.tok[1]}</span><span data-tip="nw:cs_${M.t}">${cpMi('cs_'+M.t)}${String(RW.stone).replace('.',',')} %</span></div>
     <button class="btn pri cpgo" data-act="cpGo" ${team.length?'':'disabled'}>${uic('flag')} Lancer l’expédition (${cpFmtT(dur)})</button><small style="color:#c8ad80;display:block;margin-top:6px">En expédition, la faim baisse 2 fois plus vite. En cas d’échec : 25 % du butin et la moitié de l’expérience.</small></div></div>` }
  return `<div class="cpex">${rl?`<h4 class="cpsec">En cours</h4>${rl}`:''}<h4 class="cpsec">Disponibles <small class="mute">nouvelles expéditions dans ${qLeft(cpBoardLeft())}</small></h4>${bl||'<p class="mute">Aucune expédition disponible pour le moment.</p>'}</div>${det}` }
function cpViewS(){ const C=cpS();
  const it=(k,p)=>`<div class="cpit"><span style="--rc:var(--r${nwR(k)})" data-tip="nw:${k}"><svg viewBox="0 0 24 24">${MI[k]}</svg></span><span><b>${esc(MAT_OBJ[k])}</b><small>${esc(CP_IT[k].d.split('. ')[0])}. <span class="mute">(${matAll(k)})</span></small></span><button class="btn sm ${C.tok>=p?'pri':''}" data-act="cpBuy" data-k="${k}" ${C.tok>=p?'':'disabled'}>${CPTOK}${fmt(p)}</button></div>`;
  const cap=cpCapCost();
  return `<div class="cpmid cpshop"><div class="cpbox"><h3>Boutique du dresseur</h3><p class="mute" style="margin:0 0 10px">Tout se paie en Jetons de ménagerie, gagnés en expédition et en relâchant des créatures.</p>
    <h4>Stockage</h4><div class="cpit"><span>${uic('cpbag')}</span><span><b>Agrandir le stockage (+10 places)</b><small>Actuellement ${C.cap} places (maximum 100).</small></span><button class="btn sm ${C.tok>=cap&&C.cap<100?'pri':''}" data-act="cpBuy" data-k="cap" ${C.tok>=cap&&C.cap<100?'':'disabled'}>${CPTOK}${fmt(cap)}</button></div>
    <h4>Nourriture et invocation</h4><div class="cpitems">${CSHOP.filter(([k])=>/^c[ft]_/.test(k)).map(([k,p])=>it(k,p)).join('')}</div>
    <h4>Pierres d’évolution</h4><div class="cpitems">${CSHOP.filter(([k])=>/^cs_/.test(k)).map(([k,p])=>it(k,p)).join('')}</div>
    <h4>Objets portés</h4><div class="cpitems">${CSHOP.filter(([k])=>/^cw_/.test(k)).map(([k,p])=>it(k,p)).join('')}</div>
    <h4>Habitats <small class="mute">fond de la fiche des créatures</small></h4><div class="cphabs">${CHAB.map(([k,n,p,bg])=>{const o=C.hab[k];return `<button class="cphab ${C.habSel===k?'on':''}" data-act="cpBuy" data-k="${k}" ${!o&&C.tok<p?'disabled':''} style="--hb:${bg}"><i></i><b>${n}</b><small>${C.habSel===k?'Choisi':o?'Choisir':`${fmt(p)} jetons`}</small></button>`}).join('')}</div></div></div><div></div>` }
function viewComp(){ const C=cpS();
  if(!C.gift){ C.gift=1; qGive([['ct_1',3],['cf_1',5]]); save(); saveAcc(); setTimeout(()=>toast('Cadeau de bienvenue : 3 Tickets de découverte et 5 Croquettes dans votre inventaire.'),300) }
  const t=['c','e','s'].includes(UI.cpT)?UI.cpT:'c';
  const body=t==='e'?cpViewE():t==='s'?cpViewS():cpViewC();
  return `<div class="cpx"><div class="cph"><h2>Compagnon</h2><small>${t==='e'?'Envoyez vos créatures en expédition pour rapporter or, ressources, jetons et pierres d’évolution.':t==='s'?'Dépensez vos Jetons de ménagerie.':'Invoquez des créatures, nourrissez-les et faites-les évoluer.'}</small></div><div class="cpa">${cpNav(t)}${body}</div></div>` }
/* ---------- invocation : fenêtre ---------- */
function cpTickAsk(k){ if(!CP_IT[k]) return; closeChest(); const n=matAll(k),room=cpRoom(),w=document.createElement('div'); w.id='chestw'; w.className='chestm'; w.setAttribute('role','dialog'); w.setAttribute('aria-modal','true');
  w.innerHTML=`<div class="box chask"><span class="chico"><svg viewBox="0 0 24 24" width="56" height="56">${MI[k]}</svg></span><h2>${esc(CP_IT[k].n)}</h2><p>${esc((d=>d.charAt(0).toUpperCase()+d.slice(1))(CP_IT[k].d.replace(/^Clic droit : /,'')))}</p><p class="mute">Vous en avez ${n} · stockage : ${room} place${room>1?'s':''} libre${room>1?'s':''}.</p><div class="row"><button class="btn" data-act="chestNo">Annuler</button><button class="btn pri" data-act="cpGoTick" data-k="${k}" data-n="1" ${n>=1&&room>=1?'':'disabled'}>Invoquer ×1</button><button class="btn pri" data-act="cpGoTick" data-k="${k}" data-n="10" ${n>=10&&room>=10?'':'disabled'} ${ttip('Invoquer ×10',n<10?'Il faut 10 tickets.':room<10?'Il faut 10 places libres.':'Utilise 10 tickets.')}>Invoquer ×10</button></div></div>`;
  document.body.append(w) }
function cpResCard(c,i){ const S=cpSpK(c); return `<div class="cpres ${c.shiny?'shiny':''}" style="--ta:${CTY[S.t].a};--rc:${CRR[S.r][1]};animation-delay:${(i||0)*.18}s">${cpTyB(S.t)}${cpGrB(c)}${cpArt(c,92)}<b>${esc(cpName(c))}</b><small style="color:${CRR[S.r][1]}">${CRR[S.r][0]}${c.shiny?' · Shiny !':''}</small><div class="cpivs">${CSTN.map(([k,n])=>`<i ${ttip(n+' : qualité '+(c.shiny?100:Math.round(c.iv[k]*100))+' %')}><b style="height:${c.shiny?100:Math.round(c.iv[k]*100)}%"></b></i>`).join('')}</div></div>` }
function cpGoTick(k,n){ const got=cpSummon(k,n); if(!got){ return } let w=$('#chestw'); if(!w){ w=document.createElement('div'); w.id='chestw'; w.className='chestm'; document.body.append(w) }
  const left=matAll(k),again=`<div class="row">${left>=1&&cpRoom()>=1?`<button class="btn" data-act="cpGoTick" data-k="${k}" data-n="1">Encore ×1 (${left})</button>`:''}${left>=10&&cpRoom()>=10?`<button class="btn" data-act="cpGoTick" data-k="${k}" data-n="10">Encore ×10</button>`:''}<button class="btn pri" data-act="cpSeeNew">Voir mes créatures</button></div>`;
  if(n>1){ const sh=got.some(c=>c.shiny); w.innerHTML=`<div class="box chopen cpx10"><h2>Invocation ×10${sh?' · <span style="color:#ff9af0">Shiny !</span>':''}</h2><div class="cp10">${got.map(cpResCard).join('')}</div>${again}</div>`; render(); return }
  const c=got[0],W=40,strip=Array.from({length:46},(_,i)=>i===W?c:cpRoll(k)),tile=(x,win)=>`<div class="chtile ${win?'win':''}" style="--rc:${CRR[cpSpK(x).r][1]}"><span class="cptl">${cpCrea(x.sp,0,58)}</span><b>${esc(cpSpK(x).n[0])}</b><small>${CRR[cpSpK(x).r][0]}</small></div>`;
  w.innerHTML=`<div class="box chopen"><h2>${esc(CP_IT[k].n)}</h2><div class="chwin"><div class="chstrip">${strip.map((x,i)=>tile(x,i===W)).join('')}</div><i class="chmark"></i></div><div class="chres" aria-live="polite"></div></div>`;
  const st=w.querySelector('.chstrip'),win=w.querySelector('.chwin'),tw=st.children[0].offsetWidth+10,target=W*tw+tw/2-win.clientWidth/2+(Math.random()-.5)*(tw*.7),quick=matchMedia('(prefers-reduced-motion: reduce)').matches;
  requestAnimationFrame(()=>{ st.style.transition=`transform ${quick?.3:5}s cubic-bezier(.08,.75,.18,1)`; st.style.transform=`translateX(${-target}px)` });
  let fired=false; const done=()=>{ if(fired||!$('#chestw')) return; fired=true; st.children[W].classList.add('hl'); w.querySelector('.chres').innerHTML=`<div class="cp1">${cpResCard(c,0)}<div class="cp1t"><ul class="cppas">${c.pas.map((p,i)=>`<li class="${i?'lk':''}"><b>${CPAS[p.k].n}</b>${CPAS[p.k].d(p.v)}<em>${i?'Forme '+(i+1):'Actif'}</em></li>`).join('')}</ul></div></div>${again}`; render() };
  st.addEventListener('transitionend',done,{once:true}); setTimeout(done,quick?600:5400) }
/* ---------- débogage (admin) ---------- */
function cpDbg(k){ const C=cpS();
  if(k==='tok') C.tok=(C.tok||0)+1000;
  else if(k==='tick') qGive([['ct_1',10]]); else if(k==='tick2') qGive([['ct_2',10]]);
  else if(k==='items') qGive([['cf_1',20],['cf_2',10],['cf_3',5],...Object.keys(CTY).map(t=>['cs_'+t,5]),...Object.keys(CHELD).map(h=>[h,1])]);
  else if(k==='fin') for(const r of C.run) r.t1=cpNow()-1;
  else if(k==='lv') for(const c of C.list) c.lv=Math.min(CP_MAXL,c.lv+10);
  else if(k==='hu0'||k==='hu100') for(const c of C.list){ c.hu=k==='hu0'?0:100; c.huT=cpNow(); c.huF=0 }
  else if(k==='board'){ C.bk=null; C.board=[] }
  save(); saveAcc(); render(); toast('Compagnon : '+({tok:'+1 000 jetons',tick:'+10 tickets',tick2:'+10 tickets supérieurs',items:'objets ajoutés',fin:'expéditions terminées',lv:'+10 niveaux',hu0:'faim à 0',hu100:'faim à 100',board:'nouvelles expéditions'})[k]+'.') }
/* ---------- récapitulatif des grandes mises à jour manquées ---------- */
const vcmp=(a,b)=>{ const A=String(a).split('.').map(Number),B=String(b).split('.').map(Number); for(let i=0;i<3;i++){ const d=(A[i]||0)-(B[i]||0); if(d) return d<0?-1:1 } return 0 };
const vMaj=v=>String(v).split('.').slice(0,2).join('.');
const stripH=t=>String(t).replace(/<[^>]*>/g,'');
const cut=(t,n)=>{ t=stripH(t); return t.length>n?t.slice(0,n-1).replace(/\s+\S*$/,'')+'…':t };
function upRecap(from){ if(!from||vcmp(from,UPOP.v)>=0) return [];
  const L=PATCH.slice().sort((a,b)=>vcmp(a.v,b.v)),cur=vMaj(UPOP.v),pages=[],imgs=[1,4,6,2,3,5];
  const own=L.filter(p=>vMaj(p.v)===vMaj(from)&&vcmp(p.v,from)>0&&vMaj(p.v)!==cur);
  if(own.length) pages.push({ic:'gear',img:imgs[0],t:`Depuis votre dernière visite (${from})`,d:`<span class="uprc">${own.slice(-8).map(p=>`<span><b>${p.v}</b> ${esc(p.t)}</span>`).join('')}</span>`});
  const majors=L.filter(p=>/\.0$/.test(p.v)&&vcmp(p.v,from)>0&&vMaj(p.v)!==cur&&vMaj(p.v)!==vMaj(from));
  majors.forEach((M,i)=>{ const minors=L.filter(p=>vMaj(p.v)===vMaj(M.v)&&p.v!==M.v);
    pages.push({ic:'star',img:imgs[(i+1)%imgs.length],t:`Récap ${M.v} · ${M.t}`,d:`<span class="uprc">${(M.sec||[]).slice(0,6).map(([n,ls])=>`<span><b>${esc(n)}</b> ${esc(cut((ls||[])[0]||'',120))}</span>`).join('')}${minors.length?`<span class="uprm">Puis ${minors.length} petite${minors.length>1?'s':''} mise${minors.length>1?'s':''} à jour : ${minors.slice(-5).map(p=>esc(p.t)).join(' · ')}${minors.length>5?'…':''}</span>`:''}</span>`}) });
  if(pages.length) pages.push({ic:'star',img:0,t:`Et maintenant : la ${UPOP.v}`,d:'Voici les nouveautés de la dernière grande mise à jour. Toutes les notes détaillées sont dans Menu → Nouveautés.'});
  return pages }
function upRecapPrep(){ if(UI.upRcDone) return; UI.upRcDone=1;
  const cand=[ACC.lastPlayV,ACC.upHide,ACC.seenVer].filter(v=>v&&/^\d+\.\d+\.\d+$/.test(v)).sort(vcmp),from=ACC.lastPlayV||cand[cand.length-1]||null;
  UI.upRecap=upRecap(from); ACC.lastPlayV=VERSION; saveAcc(); UPOP.pages=[...UI.upRecap,...UPOP.base] }
