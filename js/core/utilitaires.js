/* Cendrelame · core/utilitaires.js */

var ZM=1;
function applyZoom(){ const w=innerWidth,h=innerHeight,d=document.documentElement; ZM=w>760?Math.max(.5,Math.min(2,Math.min(w/1440,h/900))):1; d.style.zoom=ZM===1?'':String(ZM); d.style.setProperty('--vh1',(h/ZM/100)+'px'); d.style.setProperty('--vw1',(w/ZM/100)+'px') }
applyZoom(); addEventListener('resize',()=>{ applyZoom(); if(document.querySelector('.t7tree')) requestAnimationFrame(drawSkLinks); for(const id of ['invpop','stashpop','pcfl']){ const e=document.getElementById(id); if(e&&e.style.left){ const r=e.getBoundingClientRect(); if(r.right>innerWidth||r.bottom>innerHeight){ e.style.left=''; e.style.top=''; e.style.right=''; e.style.bottom='' } } } });
'use strict';
/* ============ utilitaires ============ */
const $=(s,r=document)=>r.querySelector(s);
const rand=(a,b)=>a+Math.random()*(b-a);
const ri=(a,b)=>Math.floor(rand(a,b+1));
const pick=a=>a[Math.floor(Math.random()*a.length)];
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const shuffle=a=>{for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const wpick=w=>{let t=w.reduce((a,b)=>a+b,0),r=Math.random()*t;for(let i=0;i<w.length;i++){r-=w[i];if(r<0)return i}return w.length-1};
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt=n=>n>=1e6?(n/1e6).toFixed(1)+' M':n>=1e4?(n/1e3).toFixed(1)+' k':Math.floor(n).toLocaleString('fr-FR');
const r1=v=>Math.round(v*10)/10;
const WT=(()=>{ try{ const u=URL.createObjectURL(new Blob(["onmessage=e=>{const[i,m]=e.data;setTimeout(()=>postMessage(i),m)}"],{type:'text/javascript'})),w=new Worker(u),cb=new Map(); let n=0; w.onmessage=e=>{ const f=cb.get(e.data); if(f){cb.delete(e.data); f()} }; w.onerror=()=>{ WT.ok=false }; return {ok:true,set(f,ms){ const i=++n; cb.set(i,f); w.postMessage([i,Math.max(0,ms||0)]); return i }} }catch(e){ return {ok:false} } })();
const wTO=(f,ms)=>WT.ok?WT.set(f,ms):setTimeout(f,ms);
const sleep=ms=>new Promise(r=>wTO(async()=>{ while(typeof C!=='undefined'&&C.paused&&C.phase!=='result'&&!C.abort) await new Promise(q=>wTO(q,120)); r() },ms/(S&&S.speed||1)));

