'use strict';
// SwimTrack Stage 7 - Profil, Einstellungen und Dark Mode.
// ── PROFILE ───────────────────────────────────────────────────────────────────
async function getProfile(){const p=await dbGet('profile','main');return p||{id:'main',name:'',club:'',weeklyGoal:5};}
async function saveProfile(){
  const p=await getProfile();
  p.name=(document.getElementById('s-name')||{}).value.trim()||p.name;
  p.club=(document.getElementById('s-club')||{}).value.trim()||p.club;
  p.weeklyGoal=parseInt((document.getElementById('s-goal')||{}).value)||5;
  await dbPut('profile',p);showToast('Profil gespeichert.');renderHeutePage();
}
async function loadSettingsPage(){
  const p=await getProfile();
  const sn=document.getElementById('s-name'),sc=document.getElementById('s-club'),sg=document.getElementById('s-goal'),sv=document.getElementById('s-goal-val');
  if(sn)sn.value=p.name||'';if(sc)sc.value=p.club||'';
  if(sg){sg.value=p.weeklyGoal||5;if(sv)sv.textContent=p.weeklyGoal||5;}
  updateDarkToggle();
}

// ── DARK MODE ─────────────────────────────────────────────────────────────────
function initDark(){
  const saved=localStorage.getItem('st_dark');
  const sysDark=window.matchMedia('(prefers-color-scheme:dark)').matches;
  if(saved==='1'||(saved===null&&sysDark))document.documentElement.setAttribute('data-dark','');
  updateDarkToggle();
}
function toggleDark(){
  const isDark=document.documentElement.hasAttribute('data-dark');
  if(isDark){document.documentElement.removeAttribute('data-dark');localStorage.setItem('st_dark','0');}
  else{document.documentElement.setAttribute('data-dark','');localStorage.setItem('st_dark','1');}
  updateDarkToggle();
}
function updateDarkToggle(){
  const btn=document.getElementById('dark-toggle');if(!btn)return;
  const isDark=document.documentElement.hasAttribute('data-dark');
  btn.classList.toggle('on',isDark);
  const k=btn.querySelector('.toggle-knob');if(k)k.textContent=isDark?'🌙':'☀️';
}

