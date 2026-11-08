// SwimTrack modular stage 10 - v5.0.0-stage10.3
const CACHE = 'swimtrack-v5.0.0-stage10.3';
const APP_SHELL = [
 './','./index.html','./manifest.json','./css/app.css?v=5.0.0-stage10.3',
 './js/data/db.js?v=5.0.0-stage10.3','./js/core/utils.js?v=5.0.0-stage10.3',
 './js/core/dates.js?v=5.0.0-stage10.3','./js/core/time.js?v=5.0.0-stage10.3',
 './js/core/config.js?v=5.0.0-stage10.3','./js/core/state.js?v=5.0.0-stage10.3','./js/core/pwa.js?v=5.0.0-stage10.3','./js/app.js?v=5.0.0-stage10.3','./js/core/navigation.js?v=5.0.0-stage10.3','./js/modules/dashboard.js?v=5.0.0-stage10.3','./js/modules/progress.js?v=5.0.0-stage10.3','./js/modules/profile-settings.js?v=5.0.0-stage10.3','./js/modules/gamification.js?v=5.0.0-stage10.3','./js/modules/training.js?v=5.0.0-stage10.3','./js/modules/athletics.js?v=5.0.0-stage10.3','./js/modules/backup.js?v=5.0.0-stage10.3','./js/modules/competition.js?v=5.0.0-stage10.3','./js/modules/personal-bests.js?v=5.0.0-stage10.3','./js/modules/competition-analysis.js?v=5.0.0-stage10.3','./js/modules/competition-preparation.js?v=5.0.0-stage10.3','./icons/icon-192.png','./icons/icon-512.png'
];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>Promise.allSettled(APP_SHELL.map(u=>c.add(u)))));self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));self.clients.claim();});
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;if(e.request.mode==='navigate'){e.respondWith(fetch(e.request).then(r=>{const x=r.clone();caches.open(CACHE).then(c=>c.put('./index.html',x));return r;}).catch(()=>caches.match('./index.html')));return;}e.respondWith(caches.match(e.request).then(c=>c||fetch(e.request).then(r=>{if(r&&r.status===200){const x=r.clone();caches.open(CACHE).then(k=>k.put(e.request,x));}return r;})));});
