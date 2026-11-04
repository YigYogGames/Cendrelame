/* Cendrelame · ui/nouveautes-suite.js */
function viewNews0(){
  return `<div class="scrhead" style="margin-bottom:4px"><h2>Nouveautés</h2>${backBtn()}</div><p class="hint" style="margin-bottom:18px">Journal des modifications de Cendrelame.</p>`+
    PATCH.map((p,i)=>`<section class="pn"><h3>Version ${p.v}${i===0?'<span class="tagv">Actuelle</span>':''}</h3><small class="mute">${esc(p.t)}</small>
      ${p.sec.map(([h,l])=>`<h4>${esc(h)}</h4><ul>${l.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`).join('')}</section>`).join('');
}

