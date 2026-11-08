'use strict';
// SwimTrack Stage 10 - einzige PWA-Registrierung. Das statische manifest.json und sw.js sind maßgeblich.
function showUpdateBanner(){
  const banner=document.getElementById('update-banner');
  if(banner) banner.classList.remove('hidden');
}
async function initPWA(){
  if(!('serviceWorker' in navigator)) return null;
  try{
    const registration=await navigator.serviceWorker.register('./sw.js',{scope:'./'});
    registration.addEventListener('updatefound',()=>{
      const worker=registration.installing;
      if(!worker) return;
      worker.addEventListener('statechange',()=>{
        if(worker.state==='installed' && navigator.serviceWorker.controller) showUpdateBanner();
      });
    });
    return registration;
  }catch(error){
    console.warn('SwimTrack Service Worker:',error);
    return null;
  }
}
