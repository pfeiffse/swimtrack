'use strict';
// SwimTrack Stage 6 - Punkte, Badges, Erfolge, Avatar-UI und Save-Modal.
// ── STATS ─────────────────────────────────────────────────────────────────────
async function computeStats(){
  const [entries,comps,pbs,log]=await Promise.all([dbAll('training'),dbAll('competitions'),dbAll('pbs'),dbAll('points_log')]);
  const totalPoints=log.reduce((s,l)=>s+l.points,0);
  const t=today(),ws=getWS(t),wd=getWD(ws);
  const weekEntries=entries.filter(e=>wd.includes(e.date)).length;
  let dayStreak=0;
  const entryDates=new Set(entries.map(e=>e.date));
  const d=new Date();
  for(let i=0;i<365;i++){
    const ds=d.toISOString().slice(0,10);
    if(entryDates.has(ds)){dayStreak++;d.setDate(d.getDate()-1);}
    else if(i===0){d.setDate(d.getDate()-1);}
    else break;
  }
  const allWs=new Set(entries.map(e=>getWS(e.date)));
  let completedWeeks=0;
  allWs.forEach(w=>{if(entries.some(e=>getWD(w).includes(e.date)))completedWeeks++;});
  const lvtState=JSON.parse(localStorage.getItem('st_lvt_state')||'{}');
  const physioState=JSON.parse(localStorage.getItem('st_physio_state')||'{}');
  return{
    totalPoints,weekEntries,dayStreak,completedWeeks,
    entries:entries.length,comps:comps.length,pbs:pbs.length,
    reflEntries:entries.filter(e=>e.reflGood||e.reflHard||e.reflNext).length,
    regenEntries:entries.filter(e=>e.type==='Regeneration').length,
    weeks:completedWeeks,
    lvtDays:(lvtState.completedDates||[]).length,
    physioDays:(physioState.completedDates||[]).length
  };
}
function getLvl(pts){let lv=LEVELS[0];for(const l of LEVELS){if(pts>=l.min)lv=l;}return lv;}

// ── POINTS ────────────────────────────────────────────────────────────────────
function calcPts(entry){
  const reasons=[];let total=0;
  const add=(r,p)=>{if(p>0){reasons.push({reason:r,pts:p});total+=p;}};
  const type=entry.type||'',dur=parseInt(entry.durationMin)||0,km=parseFloat(entry.km)||0;
  let base=0;
  if(type==='Wassertraining'||type==='Techniktraining'){base=Math.round(dur*0.15);if(km>=1)base+=Math.round(km*2);}
  else if(type==='Krafttraining'||type==='Athletiktraining'){base=Math.round(dur*0.10);}
  else if(type==='Ausdauertraining'){base=Math.round(dur*0.12);if(km>=1)base+=Math.round(km*1.5);}
  else if(type==='Beweglichkeit'){base=Math.round(dur*0.08);}
  else if(type==='Regeneration'){base=Math.round(dur*0.06)+2;}
  else{base=Math.round(dur*0.08);}
  base=Math.max(3,Math.min(20,base));
  add('Training dokumentiert ('+dur+' min'+(km>0?', '+km.toFixed(1)+' km':'')+')',base);
  if(entry.date&&entry.type&&entry.durationMin&&entry.load&&entry.wellbeing&&entry.planCompleted)add('Alle Pflichtfelder vollständig',2);
  if(entry.reflGood||entry.reflHard||entry.reflNext)add('Trainingsreflexion ausgefüllt',3);
  if(entry.planCompleted==='ja')add('Trainingsplan vollständig absolviert',5);
  else if(entry.planCompleted==='teilweise')add('Trainingsplan teilweise absolviert',2);
  const sets=entry.sets||[];
  if(sets.length>=2)add('Strukturiertes Training (≥2 Aufgaben)',2);
  return{total,reasons};
}
async function logPts(reasons,entryId,entryType,date){
  for(const r of reasons)await dbPut('points_log',{id:genId(),date,reason:r.reason,points:r.pts,entryId,entryType});
}
async function checkWeekBonus(date){
  const ws=getWS(date),wd=getWD(ws);
  const p=await getProfile();
  const entries=await dbAll('training');
  const cnt=entries.filter(e=>wd.includes(e.date)).length;
  const log=await dbAll('points_log');
  const already=log.some(l=>l.reason==='Vollständige Trainingswoche'&&l.date>=wd[0]&&l.date<=wd[6]);
  if(!already&&cnt>=(p.weeklyGoal||5))await logPts([{reason:'Vollständige Trainingswoche',pts:20}],'week_'+ws,'week',date);
}
async function checkBadges(){
  const stats=await computeStats();
  const existing=await dbAll('badges');
  const existingKeys=new Set(existing.map(b=>b.key));
  const newBadges=[];
  for(const b of BADGE_DEFS){
    if(!existingKeys.has(b.key)&&b.chk(stats)){
      await dbPut('badges',{id:genId(),key:b.key,unlockedAt:today()});
      newBadges.push(b);
    }
  }
  return newBadges;
}

// ── AVATAR (STABLE) ───────────────────────────────────────────────────────────
function getAvApp(){try{return JSON.parse(localStorage.getItem('st_av_app')||'{}');}catch(e){return{};}}
function saveAvApp(a){localStorage.setItem('st_av_app',JSON.stringify(a));}

function buildAvatar(lvl,size,animated){
  const app=getAvApp();
  const skins={s1:'#FDBCB4',s2:'#E8A87C',s3:'#C68642',s4:'#8D5524',s5:'#4A2912'};
  const hairs={hc1:'#4A2C0A',hc2:'#8B5E3C',hc3:'#1A1A1A',hc4:'#D4A843',hc5:'#8B2500'};
  const eyes={e1:'#5C3317',e2:'#2980B9',e3:'#27AE60',e4:'#7F8C8D'};
  const skin=skins[app.skinKey]||'#FDBCB4';
  const hair=hairs[app.hairColorKey]||'#4A2C0A';
  const eye=eyes[app.eyeColorKey]||'#5C3317';
  const suit=lvl>=9?'#1A1A2E':lvl>=7?'#0D3B6E':lvl>=5?'#1A5276':lvl>=3?'#2E86C1':'#B0C4DE';
  const bc=lvl>=9?'#FFD700':lvl>=7?'#E74C3C':lvl>=5?'#8E44AD':'#0044FF';
  const W=size,H=size,cx=W/2,s=W/200;
  const anim=animated?'<animateTransform attributeName="transform" type="translate" values="0,0;2,1;0,0;-2,1;0,0" dur="2.5s" repeatCount="indefinite" additive="sum"/>'  :'';
  const p=[];
  p.push('<svg viewBox="0 0 '+W+' '+H+'" xmlns="http://www.w3.org/2000/svg" width="'+W+'" height="'+H+'">');
  p.push('<g>'+anim);
  p.push('<ellipse cx="'+cx+'" cy="'+(H*0.84)+'" rx="'+(W*0.46)+'" ry="'+(H*0.055)+'" fill="#0066FF" opacity="0.15"/>');
  p.push('<ellipse cx="'+cx+'" cy="'+(H*0.62)+'" rx="'+(W*0.17)+'" ry="'+(H*0.21)+'" fill="'+suit+'"/>');
  p.push('<line x1="'+(cx-W*0.17)+'" y1="'+(H*0.52)+'" x2="'+(cx-W*0.46)+'" y2="'+(H*0.56)+'" stroke="'+skin+'" stroke-width="'+(11*s)+'" stroke-linecap="round"/>');
  p.push('<line x1="'+(cx+W*0.17)+'" y1="'+(H*0.52)+'" x2="'+(cx+W*0.46)+'" y2="'+(H*0.56)+'" stroke="'+skin+'" stroke-width="'+(11*s)+'" stroke-linecap="round"/>');
  p.push('<line x1="'+(cx-W*0.09)+'" y1="'+(H*0.82)+'" x2="'+(cx-W*0.07)+'" y2="'+(H*0.96)+'" stroke="'+suit+'" stroke-width="'+(10*s)+'" stroke-linecap="round"/>');
  p.push('<line x1="'+(cx+W*0.09)+'" y1="'+(H*0.82)+'" x2="'+(cx+W*0.07)+'" y2="'+(H*0.94)+'" stroke="'+suit+'" stroke-width="'+(10*s)+'" stroke-linecap="round"/>');
  p.push('<rect x="'+(cx-W*0.055)+'" y="'+(H*0.38)+'" width="'+(W*0.11)+'" height="'+(H*0.09)+'" rx="'+(4*s)+'" fill="'+skin+'"/>');
  p.push('<ellipse cx="'+cx+'" cy="'+(H*0.29)+'" rx="'+(W*0.145)+'" ry="'+(H*0.135)+'" fill="'+skin+'"/>');
  p.push('<ellipse cx="'+cx+'" cy="'+(H*0.20)+'" rx="'+(W*0.145)+'" ry="'+(H*0.075)+'" fill="'+hair+'"/>');
  p.push('<circle cx="'+(cx-W*0.055)+'" cy="'+(H*0.295)+'" r="'+(3*s)+'" fill="'+eye+'"/>');
  p.push('<circle cx="'+(cx+W*0.055)+'" cy="'+(H*0.295)+'" r="'+(3*s)+'" fill="'+eye+'"/>');
  p.push('<circle cx="'+(cx-W*0.048)+'" cy="'+(H*0.29)+'" r="'+(1.2*s)+'" fill="white" opacity="0.6"/>');
  p.push('<circle cx="'+(cx+W*0.062)+'" cy="'+(H*0.29)+'" r="'+(1.2*s)+'" fill="white" opacity="0.6"/>');
  p.push('<ellipse cx="'+cx+'" cy="'+(H*0.35)+'" rx="'+(W*0.04)+'" ry="'+(H*0.014)+'" fill="#3A2010" opacity="0.55"/>');
  p.push('<circle cx="'+(cx-W*0.095)+'" cy="'+(H*0.325)+'" r="'+(4*s)+'" fill="#FFB6C1" opacity="0.4"/>');
  p.push('<circle cx="'+(cx+W*0.095)+'" cy="'+(H*0.325)+'" r="'+(4*s)+'" fill="#FFB6C1" opacity="0.4"/>');
  if(lvl>=9)p.push('<text x="'+cx+'" y="'+(H*0.12)+'" text-anchor="middle" font-size="'+(12*s)+'" fill="#FFD700">★</text>');
  p.push('</g>');
  p.push('<circle cx="'+(W*0.84)+'" cy="'+(H*0.14)+'" r="'+(13*s)+'" fill="'+bc+'" stroke="white" stroke-width="'+(2*s)+'"/>');
  p.push('<text x="'+(W*0.84)+'" y="'+(H*0.148)+'" text-anchor="middle" dominant-baseline="middle" font-size="'+(9*s)+'" fill="white" font-weight="bold" font-family="Inter,sans-serif">'+lvl+'</text>');
  p.push('</svg>');
  return p.join('');
}

async function updateHeaderAvatar(){
  const av=document.getElementById('hdr-avatar');if(!av)return;
  const img=localStorage.getItem('st_avatar_img');
  if(img){av.innerHTML='<img src="'+img+'" style="width:32px;height:32px;object-fit:cover;border-radius:50%"/>';return;}
  try{
    const stats=await computeStats();
    const lv=getLvl(stats.totalPoints);
    const emoEl=document.getElementById('hdr-av-emoji');
    if(emoEl)emoEl.style.display='none';
    av.innerHTML=buildAvatar(lv.num,32,false);
  }catch(e){
    const emoEl=document.getElementById('hdr-av-emoji');
    if(emoEl){emoEl.style.display='';emoEl.textContent='🏊';}
  }
}

// ── MODALS & TOAST ────────────────────────────────────────────────────────────
function closeModal(id){var el=document.getElementById(id);if(el)el.classList.add('hidden');}
function showToast(msg,ms=2500){
  const t=document.getElementById('toast'),tx=document.getElementById('toast-txt');
  if(!t||!tx)return;tx.textContent=msg;t.classList.remove('hidden');
  clearTimeout(t._t);t._t=setTimeout(()=>t.classList.add('hidden'),ms);
}
function showSaveModal(pts,newBadges,title){
  setText('m-save-ico','✅');setText('m-save-title',title);
  const pe=document.getElementById('m-save-pts');
  if(pe)pe.innerHTML='<strong>+'+pts.total+' Punkte</strong><br>'+(pts.reasons||[]).map(r=>r.reason+': +'+r.pts).join('<br>');
  const be=document.getElementById('m-save-badge');
  if(be){if(newBadges&&newBadges.length>0){be.classList.remove('hidden');be.innerHTML=newBadges.map(b=>'🏅 Neues Abzeichen: '+b.name).join('<br>');}else be.classList.add('hidden');}
  document.getElementById('m-save').classList.remove('hidden');
}
function showConfirm(title,text,action){
  setText('m-confirm-title',title);setText('m-confirm-text',text);
  document.getElementById('m-confirm-btn').onclick=action;
  document.getElementById('m-confirm').classList.remove('hidden');
}
document.addEventListener('click',e=>{if(e.target.classList.contains('modal-overlay'))e.target.classList.add('hidden');});


// ── ERFOLGE ───────────────────────────────────────────────────────────────────
function erfTab(id,btn){
  document.querySelectorAll('#page-erfolge .tabpane').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('#page-erfolge .tabbtn').forEach(b=>b.classList.remove('active'));
  document.getElementById(id).classList.add('active');btn.classList.add('active');
  if(id==='erf-avatar')renderAvatarCustomizer();
  if(id==='erf-log')renderPtsLog();
}
async function renderErfolgePage(){
  const stats=await computeStats();
  const lv=getLvl(stats.totalPoints);
  const nextLv=LEVELS[lv.num]||null;
  const ptsIn=stats.totalPoints-lv.min;
  const range=nextLv?nextLv.min-lv.min:1;
  const pct=nextLv?Math.min(100,Math.round((ptsIn/range)*100)):100;
  const svg=buildAvatar(lv.num,90,false);
  const avC=document.getElementById('erfolge-av-card');
  if(avC){
    avC.innerHTML='<div class="avatar-card" onclick="erfTab(\'erf-avatar\',document.querySelector(\'#page-erfolge .tabbtn:nth-child(3)\'))">'+
      '<div class="av-svg">'+svg+'</div>'+
      '<div class="av-info">'+
        '<div class="av-name">Level '+lv.num+' – '+lv.name+'</div>'+
        '<div class="av-level">'+stats.totalPoints+' Punkte gesamt</div>'+
        '<div class="av-prog-wrap"><div class="av-prog-fill" style="width:'+pct+'%"></div></div>'+
        '<div class="av-prog-hint">'+(nextLv?'Noch '+(nextLv.min-stats.totalPoints)+' Punkte bis Level '+(lv.num+1):'🏆 Champion!')+'</div>'+
        '<div style="margin-top:6px;font-size:.68rem;color:rgba(255,255,255,.7)">Tippe zum Anpassen →</div>'+
      '</div>'+
    '</div>';
  }
  // Level path
  const lp=document.getElementById('level-path');
  if(lp)lp.innerHTML=LEVELS.map(l=>{
    const done=stats.totalPoints>=l.min,cur=l.num===lv.num;
    return '<div class="lp-item"><div class="lp-circle '+(cur?'cur':done?'done':'')+'">'+(done||cur?l.num:l.num)+'</div><div><div class="lp-name">'+l.name+'</div><div class="lp-pts">'+l.min+' Punkte</div></div>'+(done?'<span style="font-size:.72rem;color:var(--green);font-weight:700;margin-left:auto">✓</span>':'')+'</div>';
  }).join('');
  // Badges
  const badges=await dbAll('badges');
  const unlockedMap={};badges.forEach(b=>{unlockedMap[b.key]=b.unlockedAt;});
  const bg=document.getElementById('badges-grid');
  if(bg){
    bg.innerHTML=BADGE_DEFS.map(b=>{
      const unlocked=!!unlockedMap[b.key];
      const pr=b.prog(stats);const bpct=Math.min(100,Math.round((pr.c/pr.m)*100));
      return '<div class="badge-card '+(unlocked?'unlocked':'locked')+'">'+
        '<div class="badge-ico">'+b.ico+'</div>'+
        '<div class="badge-name">'+b.name+'</div>'+
        '<div class="badge-desc">'+b.desc+'</div>'+
        (unlocked?'<div class="badge-date">✓ '+fmtDateS(unlockedMap[b.key])+'</div>':
          '<div style="width:100%;height:4px;background:var(--subtle);border-radius:999px;overflow:hidden"><div style="height:100%;background:var(--amber);border-radius:999px;width:'+bpct+'%"></div></div>'+
          '<div style="font-size:.6rem;color:var(--tm)">'+pr.c+' / '+pr.m+'</div>')+
      '</div>';
    }).join('');
  }
  await updateHeaderAvatar();
}

// ── AVATAR CUSTOMIZER ─────────────────────────────────────────────────────────

function uploadAvPhoto(input){
  const file=input.files[0];if(!file)return;
  const reader=new FileReader();
  reader.onload=e=>{localStorage.setItem('st_avatar_img',e.target.result);showToast('Profilbild gesetzt.');updateHeaderAvatar();renderAvatarCustomizer();};
  reader.readAsDataURL(file);
}

// ── POINTS LOG ────────────────────────────────────────────────────────────────
async function renderPtsLog(){
  const container=document.getElementById('pts-log');if(!container)return;
  const log=await dbAll('points_log');
  const sorted=log.slice().sort((a,b)=>b.id.localeCompare(a.id)).slice(0,50);
  if(!sorted.length){container.innerHTML='<div class="empty"><p>Noch keine Punkte vergeben.</p></div>';return;}
  container.innerHTML=sorted.map(l=>'<div style="display:flex;align-items:center;gap:9px;padding:9px 0;border-bottom:1px solid var(--border)">'+
    '<div style="font-size:.83rem;font-weight:800;color:'+(l.points<0?'var(--red)':'var(--blue)')+';min-width:38px">'+(l.points>0?'+':'')+l.points+'</div>'+
    '<div style="flex:1"><div style="font-size:.78rem;font-weight:600">'+l.reason+'</div><div style="font-size:.68rem;color:var(--tm)">'+fmtDate(l.date)+'</div></div>'+
  '</div>').join('');
}



// Stage 10 - Avatar-Anpassung.
function renderAvatarCustomizer(){
  var container=document.getElementById('avatar-customizer');
  if(!container)return;
  var app=getAvApp();
  var SKINS=[{k:'s1',n:'Hell',c:'#FDBCB4'},{k:'s2',n:'Mittel-hell',c:'#E8A87C'},{k:'s3',n:'Mittel',c:'#C68642'},{k:'s4',n:'Mittel-dunkel',c:'#8D5524'},{k:'s5',n:'Dunkel',c:'#4A2912'}];
  var HSTYLES=[{k:'h1',n:'Kurz'},{k:'h2',n:'Lang'},{k:'h3',n:'Zopf'},{k:'h4',n:'Dutt'}];
  var HCOLORS=[{k:'hc1',n:'Dunkelbraun',c:'#4A2C0A'},{k:'hc2',n:'Hellbraun',c:'#8B5E3C'},{k:'hc3',n:'Schwarz',c:'#1A1A1A'},{k:'hc4',n:'Blond',c:'#D4A843'},{k:'hc5',n:'Rot',c:'#8B2500'}];
  var ECOLORS=[{k:'e1',n:'Braun',c:'#5C3317'},{k:'e2',n:'Blau',c:'#2980B9'},{k:'e3',n:'Gruen',c:'#27AE60'},{k:'e4',n:'Grau',c:'#7F8C8D'}];
  function mkColor(arr,propKey){
    var s='';
    arr.forEach(function(x){
      var active=app[propKey]===x.k?'active':'';
      s+='<button class="color-btn '+active+'" style="background:'+x.c+'" onclick="setAvAppLive(\''+propKey+'\',\''+x.k+'\')" title="'+x.n+'"></button>';
    });
    return s;
  }
  function mkOpt(arr,propKey){
    var s='';
    arr.forEach(function(x){
      var active=app[propKey]===x.k?'active':'';
      s+='<button class="opt-btn '+active+'" onclick="setAvAppLive(\''+propKey+'\',\''+x.k+'\')">'+x.n+'</button>';
    });
    return s;
  }
  var hasPhoto=!!localStorage.getItem('st_avatar_img');
  var photoBtn=hasPhoto?'<button class="btn2 full" onclick="removeAvPhoto()" style="margin-top:6px;color:var(--red)">Foto entfernen</button>':'';
  container.innerHTML=
    '<div style="text-align:center;margin-bottom:16px;background:var(--hero);border-radius:var(--r-xl);padding:20px">'+
      '<div id="av-preview" style="display:inline-block"></div>'+
      '<p style="font-size:.72rem;color:rgba(255,255,255,.75);margin-top:8px">Vorschau aktualisiert sich sofort</p>'+
    '</div>'+
    '<div class="fsec"><label class="label">Hautfarbe</label><div class="color-row">'+mkColor(SKINS,'skinKey')+'</div></div>'+
    '<div class="fsec"><label class="label">Frisur</label><div class="opt-row">'+mkOpt(HSTYLES,'hairStyleKey')+'</div></div>'+
    '<div class="fsec"><label class="label">Haarfarbe</label><div class="color-row">'+mkColor(HCOLORS,'hairColorKey')+'</div></div>'+
    '<div class="fsec"><label class="label">Augenfarbe</label><div class="color-row">'+mkColor(ECOLORS,'eyeColorKey')+'</div></div>'+
    '<div class="fsec"><label class="label">Eigenes Foto</label>'+
      '<label class="btn2 full" style="cursor:pointer;text-align:center">Foto auswaehlen'+
        '<input type="file" accept="image/*" onchange="uploadAvPhoto(this)" style="display:none"/>'+
      '</label>'+photoBtn+
    '</div>'+
    '<button class="btn full" onclick="saveAvApp()">Avatar speichern</button>';
  computeStats().then(function(stats){
    var lv=getLvl(stats.totalPoints);
    var el=document.getElementById('av-preview');
    if(el)el.innerHTML=buildAvatar(lv.num,120,false);
  }).catch(function(){
    var el=document.getElementById('av-preview');
    if(el)el.innerHTML=buildAvatar(1,120,false);
  });
}
function setAvAppLive(key,val){
  var app=getAvApp();app[key]=val;saveAvApp(app);
  document.querySelectorAll('.color-btn,.opt-btn').forEach(function(b){
    var oc=b.getAttribute('onclick')||'';
    if(oc.indexOf(key)>=0)b.classList.toggle('active',oc.indexOf(val)>=0);
  });
  computeStats().then(function(stats){
    var lv=getLvl(stats.totalPoints);
    var el=document.getElementById('av-preview');
    if(el){el.innerHTML=buildAvatar(lv.num,120,false);el.style.transition='transform .2s';el.style.transform='scale(1.05)';setTimeout(function(){el.style.transform='scale(1)';},150);}
    updateHeaderAvatar();
    var hc=document.getElementById('av-card-container');
    if(hc){var svg=hc.querySelector('.av-svg');if(svg)svg.innerHTML=buildAvatar(lv.num,90,true);}
  }).catch(function(){
    var el=document.getElementById('av-preview');
    if(el)el.innerHTML=buildAvatar(1,120,false);
  });
  haptic();
}
function removeAvPhoto(){
  localStorage.removeItem('st_avatar_img');
  showToast('Foto entfernt.');
  renderAvatarCustomizer();
  updateHeaderAvatar();
}
