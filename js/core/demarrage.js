/* Cendrelame · core/demarrage.js */
/* ============ démarrage ============ */ imgApply();
if(TEST){$('#testbar').hidden=false; document.body.classList.add('istest'); document.title='[TEST] '+document.title}
loadAcc();
S=null; UI.scr=ACC.offline?'menu':'login';
render(); fbInit();
setInterval(tick,1000);
setInterval(()=>{if(!UI.scr)save()},10000);
document.addEventListener('visibilitychange',()=>{if(document.hidden){if(!UI.scr)save(); cloudPush()}});
window.addEventListener('pagehide',()=>{if(!UI.scr)save(); cloudPush(); presence('off')});

