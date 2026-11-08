'use strict';
// SwimTrack v5 modular - Stage 10 bootstrap.
let resizeTimer=null;
function initResponsiveRedraw(){
  window.addEventListener('resize',()=>{
    clearTimeout(resizeTimer);
    resizeTimer=setTimeout(()=>{
      if(S.page==='fortschritt' && typeof renderFortschrittPage==='function') renderFortschrittPage();
    },200);
  });
}
async function initApp(){
  initDark();
  initResponsiveRedraw();
  initPWA();
  await initDB();
  initTrainingForm();
  const wkDate=document.getElementById('wk-date');
  if(wkDate) wkDate.value=today();
  addWkStart();
  getLVTStartDate();
  getPhysioStartDate();
  await renderHeutePage();
}
window.addEventListener('DOMContentLoaded',()=>{
  initApp().catch(error=>{
    console.error('SwimTrack Startfehler:',error);
    if(typeof showToast==='function') showToast('SwimTrack konnte nicht vollständig gestartet werden.');
  });
});
