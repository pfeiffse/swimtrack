'use strict';
// Stage 2: zentraler IndexedDB-Zugriff, unverändert aus v4.1/Stage 1.
let db;
function initDB(){
  return new Promise((res,rej)=>{
    const req=indexedDB.open('SwimTrackDB',1);
    req.onupgradeneeded=e=>{
      const d=e.target.result;
      [['training',{keyPath:'id'}],['competitions',{keyPath:'id'}],['pbs',{keyPath:'id'}],
       ['points_log',{keyPath:'id'}],['badges',{keyPath:'id'}],['profile',{keyPath:'id'}]
      ].forEach(([n,o])=>{if(!d.objectStoreNames.contains(n))d.createObjectStore(n,o);});
    };
    req.onsuccess=e=>{db=e.target.result;res();};
    req.onerror=e=>rej(e.target.error);
  });
}
const dbAll=s=>new Promise((r,j)=>{const q=db.transaction(s,'readonly').objectStore(s).getAll();q.onsuccess=()=>r(q.result||[]);q.onerror=()=>j(q.error);});
const dbGet=(s,id)=>new Promise((r,j)=>{const q=db.transaction(s,'readonly').objectStore(s).get(id);q.onsuccess=()=>r(q.result);q.onerror=()=>j(q.error);});
const dbPut=(s,o)=>new Promise((r,j)=>{const q=db.transaction(s,'readwrite').objectStore(s).put(o);q.onsuccess=()=>r(q.result);q.onerror=()=>j(q.error);});
const dbDel=(s,id)=>new Promise((r,j)=>{const q=db.transaction(s,'readwrite').objectStore(s).delete(id);q.onsuccess=()=>r();q.onerror=()=>j(q.error);});
const dbClear=s=>new Promise((r,j)=>{const q=db.transaction(s,'readwrite').objectStore(s).clear();q.onsuccess=()=>r();q.onerror=()=>j(q.error);});
