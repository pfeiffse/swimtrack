'use strict';
// SwimTrack Stage 8 - Navigation.
// ── NAVIGATION ────────────────────────────────────────────────────────────────
function goTo(page){
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('.nb').forEach(b=>b.classList.remove('active'));
  const pe=document.getElementById('page-'+page);
  const ne=document.getElementById('nb-'+page);
  if(pe)pe.classList.add('active');
  if(ne)ne.classList.add('active');
  const morePages=['fortschritt','uebungen','einstellungen'];
  if(morePages.includes(page))var nbMehr=document.getElementById('nb-mehr');if(nbMehr)nbMehr.classList.add('active');
  S.page=page;
  try{const ps=document.getElementById('page-'+page);if(ps)ps.scrollTop=0;}catch(e){}
  if(page==='heute')renderHeutePage();
  if(page==='fortschritt')renderFortschrittPage();
  if(page==='erfolge')renderErfolgePage();
  if(page==='wettkampf')renderWettkampfPage();
  if(page==='einstellungen')loadSettingsPage();
  if(page==='uebungen')renderUebungenPage();
}
function openMehr(){document.getElementById('mehr-menu').classList.remove('hidden');haptic();}
function closeMehr(){document.getElementById('mehr-menu').classList.add('hidden');}

