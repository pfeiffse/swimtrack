'use strict';
// SwimTrack Stage 8 - Heute-Dashboard.
// ── HEUTE PAGE ────────────────────────────────────────────────────────────────
async function renderHeutePage(){
  const [profile,entries,stats]=await Promise.all([getProfile(),dbAll('training'),computeStats()]);
  const name=profile.name||'Sportlerin';
  const lv=getLvl(stats.totalPoints);
  const nextLv=LEVELS[lv.num]||null;
  const ptsIn=stats.totalPoints-lv.min;
  const range=nextLv?nextLv.min-lv.min:1;
  const pct=nextLv?Math.min(100,Math.round((ptsIn/range)*100)):100;
  const svg=buildAvatar(lv.num,90,true);
  const avC=document.getElementById('av-card-container');
  if(avC){
    avC.innerHTML='<div class="avatar-card" onclick="goTo(\'erfolge\')">'+
      '<div class="av-svg">'+svg+'</div>'+
      '<div class="av-info">'+
        '<div class="av-name">'+name+'</div>'+
        '<div class="av-level">Level '+lv.num+' – '+lv.name+'</div>'+
        '<div class="av-stats">'+
          '<div class="av-stat"><div class="av-stat-val">'+stats.totalPoints+'</div><div class="av-stat-lbl">Punkte</div></div>'+
          '<div class="av-stat"><div class="av-stat-val">'+stats.dayStreak+'🔥</div><div class="av-stat-lbl">Streak</div></div>'+
          '<div class="av-stat"><div class="av-stat-val">'+stats.weekEntries+'</div><div class="av-stat-lbl">Woche</div></div>'+
        '</div>'+
        '<div class="av-prog-wrap"><div class="av-prog-fill" style="width:'+pct+'%"></div></div>'+
        '<div class="av-prog-hint">'+(nextLv?'Noch '+(nextLv.min-stats.totalPoints)+' Punkte bis Level '+(lv.num+1):'🏆 Champion!')+'</div>'+
      '</div>'+
    '</div>';
  }
  const todayE=entries.filter(e=>e.date===today());
  const ico=document.getElementById('today-ico'),msg=document.getElementById('today-msg'),sc=document.getElementById('today-status');
  if(todayE.length>0){if(ico)ico.textContent='✅';if(msg)msg.textContent='Training erledigt und dokumentiert.';if(sc)sc.style.borderColor='var(--green)';}
  else{if(ico)ico.textContent='📋';if(msg)msg.textContent='Du hast heute noch keinen Eintrag vorgenommen.';if(sc)sc.style.borderColor='';}
  const rb=document.getElementById('repeat-btn');if(rb)rb.style.display=entries.length>0?'':'none';
  setText('st-pts',stats.totalPoints);setText('st-streak',stats.dayStreak);setText('st-week',stats.weekEntries);
  setText('hdr-pts',stats.totalPoints);setText('hdr-streak',stats.dayStreak);
  setText('lv-label','Level '+lv.num+' – '+lv.name);
  setText('lv-pts',stats.totalPoints+' / '+(nextLv?nextLv.min:'–'));
  setWidth('lv-bar',pct);
  setText('lv-hint',nextLv?'Noch '+(nextLv.min-stats.totalPoints)+' Punkte bis Level '+(lv.num+1):'Maximales Level erreicht!');
  renderLVTCard();renderPhysioCard();
  const recent=entries.slice().sort((a,b)=>b.date.localeCompare(a.date)).slice(0,3);
  const rl=document.getElementById('recent-list');
  if(rl){
    if(!recent.length)rl.innerHTML='<div class="empty"><div class="empty-ico">🏊</div><p>Noch keine Einträge.</p><p class="empty-sub">Trage dein erstes Training ein!</p></div>';
    else rl.innerHTML=recent.map(e=>buildEntryCard(e,true)).join('');
  }
  await updateHeaderAvatar();
}

function buildEntryCard(e,compact){
  const ico=TYPE_ICONS[e.type]||'📝';
  const lc=e.load>=8?'hi':e.load>=5?'md':'lo';
  const sets=e.sets||[];
  const setSum=sets.length>0?'<div style="margin-top:5px;padding:4px 7px;background:var(--blue-l);border-radius:6px;font-size:.68rem;font-weight:600;color:var(--blue-d)">'+sets.slice(0,3).map(s=>{const l=[s.reps>1?s.reps+'×':'',s.distance,s.stroke,s.zone].filter(Boolean).join(' ');return l||s.note||'–';}).join(' · ')+(sets.length>3?' +'+(sets.length-3):'')+'</div>':'';
  return '<div class="ecard" onclick="openEntry(\''+e.id+'\')">'+
    '<div class="eico">'+ico+'</div>'+
    '<div class="ebody">'+
      '<div class="etitle">'+e.type+'</div>'+
      '<div class="emeta">'+fmtDate(e.date)+' · '+e.durationMin+' min</div>'+
      '<div class="etags">'+
        '<span class="etag '+lc+'">Belastung '+e.load+'/10</span>'+
        '<span class="etag">Wohlbefinden '+e.wellbeing+'/5</span>'+
        (e.planCompleted==='ja'?'<span class="etag">Plan ✓</span>':'')+
      '</div>'+setSum+
    '</div>'+
    '<div style="display:flex;flex-direction:column;align-items:flex-end;gap:4px">'+
      '<span class="epts">+'+(e.pointsEarned||0)+'</span>'+
      (!compact?'<button class="btnlink" style="font-size:.65rem" onclick="event.stopPropagation();openEntry(\''+e.id+'\')">✏️</button>'+
      '<button class="btnlink" style="font-size:.65rem;color:var(--red)" onclick="event.stopPropagation();deleteEntry(\''+e.id+'\')">🗑️</button>':'')+
    '</div>'+
  '</div>';
}

