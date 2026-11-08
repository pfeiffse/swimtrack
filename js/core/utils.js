'use strict';
// Stage 2: allgemeine UI-/ID-Helfer.
const genId=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,6);
const setText=(id,v)=>{const e=document.getElementById(id);if(e)e.textContent=v;};
const setWidth=(id,p)=>{const e=document.getElementById(id);if(e)e.style.width=p+'%';};
const haptic=()=>{try{navigator.vibrate&&navigator.vibrate(10);}catch(e){}};
