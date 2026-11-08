'use strict';
// SwimTrack Stage 6 - Training.
// ── TRAINING FORM ─────────────────────────────────────────────────────────────
function initTrainingForm(){
  const d=document.getElementById('tf-date');if(d){d.value=today();d.style.display='none';}
  setLoad(5);setWell(3);
}
function setDS(daysAgo,btn){
  document.querySelectorAll('#date-shortcuts .chip').forEach(b=>b.classList.remove('sel'));
  btn.classList.add('sel');
  const dateEl=document.getElementById('tf-date');
  if(daysAgo===-1){dateEl.style.display='';dateEl.focus();return;}
  const d=new Date();d.setDate(d.getDate()-daysAgo);
  dateEl.value=d.toISOString().slice(0,10);dateEl.style.display='none';
}
function pickType(btn){
  document.querySelectorAll('#type-chips .chip').forEach(c=>c.classList.remove('sel'));
  btn.classList.add('sel');document.getElementById('tf-type').value=btn.dataset.v;
  adaptForm(btn.dataset.v);
}
function adaptForm(type){
  const isSwim=type==='Wassertraining'||type==='Techniktraining';
  const isRegen=type==='Regeneration';
  const ss=document.getElementById('sets-section'),rs=document.getElementById('regen-section');
  const strokes=document.getElementById('strokes-section');
  const sl=document.getElementById('sets-label'),sh=document.getElementById('sets-hint');
  if(ss)ss.style.display=isRegen?'none':'';
  if(rs)rs.classList.toggle('hidden',!isRegen);
  if(strokes)strokes.style.display=isSwim?'':'none';
  const labels={'Wassertraining':'Schwimmaufgaben','Techniktraining':'Technikaufgaben','Krafttraining':'Kraftübungen','Athletiktraining':'Athletikaufgaben','Ausdauertraining':'Ausdaueraufgaben','Beweglichkeit':'Dehnübungen','Sonstiges':'Aufgaben'};
  const hints={'Wassertraining':'z.B. 4×200 Freistil BZ3, 8×50 Brust Paddles','Krafttraining':'z.B. 3×12 Kniebeugen, 4×10 Liegestütze','Athletiktraining':'z.B. 3×20m Sprint, 4×10 Burpees','Beweglichkeit':'z.B. 3×30s Hüftbeuger, 2×45s Schulter','Ausdauertraining':'z.B. 30 min Laufen, 20 min Radfahren'};
  if(sl)sl.textContent=labels[type]||'Trainingsaufgaben';
  if(sh)sh.textContent=hints[type]||'Beschreibe deine Trainingsaufgaben';
  document.getElementById('sets-container').innerHTML='';S.setIdx=0;
}
function pickLoad(btn){document.querySelectorAll('#load-btns .rbtn').forEach(b=>b.classList.remove('sel'));btn.classList.add('sel');document.getElementById('tf-load').value=btn.dataset.v;setText('tf-load-val',btn.dataset.v);}
function setLoad(v){document.querySelectorAll('#load-btns .rbtn').forEach(b=>b.classList.toggle('sel',b.dataset.v==v));const e=document.getElementById('tf-load');if(e)e.value=v;setText('tf-load-val',v);}
function pickWell(btn){document.querySelectorAll('#well-btns .wbtn').forEach(b=>b.classList.remove('sel'));btn.classList.add('sel');document.getElementById('tf-well').value=btn.dataset.v;setText('tf-well-val',btn.dataset.v);}
function setWell(v){document.querySelectorAll('#well-btns .wbtn').forEach(b=>b.classList.toggle('sel',b.dataset.v==v));const e=document.getElementById('tf-well');if(e)e.value=v;setText('tf-well-val',v);}
function toggleChip(btn){btn.classList.toggle('sel');}
function toggleOpt(){const el=document.getElementById('opt-fields'),btn=document.getElementById('opt-toggle');const open=el.classList.toggle('hidden');btn.textContent=open?'+ Weitere Details':'− Weniger Details';}

// ── SETS ──────────────────────────────────────────────────────────────────────
function addSet(){
  S.setIdx++;const idx=S.setIdx;
  const type=document.getElementById('tf-type').value||'Wassertraining';
  const isSwim=type==='Wassertraining'||type==='Techniktraining';
  const isStrength=type==='Krafttraining';
  const isAthlet=type==='Athletiktraining';
  const isFlex=type==='Beweglichkeit';
  const isEnd=type==='Ausdauertraining';
  const c=document.getElementById('sets-container');
  const div=document.createElement('div');div.className='set-row';div.id='set-'+idx;
  let f1l='Wdh.',f1d='4',f2l='Strecke',f2o=['','25 m','50 m','100 m','200 m','400 m','800 m','1500 m'];
  let f3l='Lage/Stil',f3o=['','F','R','B','S','L','Technik','Kick','Pull','Drill'];
  let f4l='Zone',f4o=['','BZ1','BZ2','BZ3','BZ4','BZ5','GA1','GA2','WSA','Sprint','Locker'];
  if(isStrength){f1l='Sätze';f1d='3';f2l='Wdh.';f2o=['','5','8','10','12','15','20'];f3l='Übung';f3o=['','Kniebeugen','Liegestütze','Klimmzüge','Bankdrücken','Ausfallschritte','Plank','Crunches','Beinheben','Schulterdrücken','Sonstiges'];f4l='Intensität';f4o=['','Leicht','Mittel','Schwer','Maximal'];}
  else if(isAthlet){f1l='Sätze';f1d='3';f2l='Distanz/Zeit';f2o=['','10 m','20 m','30 m','50 m','100 m','10 min','15 min','20 min','30 min'];f3l='Übung';f3o=['','Sprint','Laufen','Radfahren','Seilspringen','Burpees','Box Jumps','Sonstiges'];f4l='Intensität';f4o=['','Locker','Mittel','Intensiv','Sprint'];}
  else if(isFlex){f1l='Wdh.';f1d='3';f2l='Dauer';f2o=['','10 s','20 s','30 s','45 s','60 s','90 s'];f3l='Übung';f3o=['','Hüftbeuger','Oberschenkel','Schulter-Querdehnung','Brustöffnung','Nacken','Latissimus','Adduktoren','IT-Band','Sonstiges'];f4l='Seite';f4o=['','Beide','Links','Rechts'];}
  else if(isEnd){f1l='Einheiten';f1d='1';f2l='Dauer/Distanz';f2o=['','10 min','20 min','30 min','45 min','60 min','5 km','10 km'];f3l='Aktivität';f3o=['','Laufen','Radfahren','Rudern','Schwimmen','Sonstiges'];f4l='Intensität';f4o=['','GA1','GA2','WSA','Intervall'];}
  const mkSel=(id,opts)=>'<select id="'+id+'" onchange="updPrev('+idx+')">'+opts.map(o=>'<option value="'+o+'">'+( o||'–')+'</option>').join('')+'</select>';
  div.innerHTML='<div class="set-hdr"><span class="set-title">Aufgabe '+idx+'</span><button type="button" class="set-rm" onclick="removeSet('+idx+')">✕</button></div>'+
    '<div class="sgrid">'+
      '<div class="sfield"><label>'+f1l+'</label><input type="number" id="sr-'+idx+'" min="1" max="99" value="'+f1d+'" oninput="updPrev('+idx+')"/></div>'+
      '<div class="sfield"><label>'+f2l+'</label>'+mkSel('sd-'+idx,f2o)+'</div>'+
    '</div>'+
    '<div class="sgrid">'+
      '<div class="sfield"><label>'+f3l+'</label>'+mkSel('ss-'+idx,f3o)+'</div>'+
      '<div class="sfield"><label>'+f4l+'</label>'+mkSel('sz-'+idx,f4o)+'</div>'+
    '</div>'+
    '<div class="sgrid">'+
      '<div class="sfield"><label>Pause (Sek.)</label><input type="number" id="sp-'+idx+'" min="0" max="600" value="'+(isSwim?30:60)+'" oninput="updPrev('+idx+')"/></div>'+
      '<div class="sfield"><label>Material/Equipment</label>'+mkSel('se-'+idx,isSwim?['','Pullbuoy','Paddles','Flossen','Schnorchel','Brett']:['','Körpergewicht','Hanteln','Theraband','Kettlebell','Sonstiges'])+'</div>'+
    '</div>'+
    '<div class="sfield" style="margin-top:6px"><label>Fokuspunkt</label><input type="text" id="sn-'+idx+'" placeholder="z.B. Hoher Ellenbogen, Knie über Zehen…" maxlength="150" oninput="updPrev('+idx+')"/></div>'+
    '<div class="sprev" id="sprev-'+idx+'">–</div>';
  c.appendChild(div);updPrev(idx);
}
function removeSet(idx){const e=document.getElementById('set-'+idx);if(e)e.remove();}
function updPrev(idx){
  const r=(document.getElementById('sr-'+idx)||{}).value||'1';
  const d=(document.getElementById('sd-'+idx)||{}).value||'';
  const s=(document.getElementById('ss-'+idx)||{}).value||'';
  const z=(document.getElementById('sz-'+idx)||{}).value||'';
  const p=(document.getElementById('sp-'+idx)||{}).value||'0';
  const e=(document.getElementById('se-'+idx)||{}).value||'';
  const n=(document.getElementById('sn-'+idx)||{}).value||'';
  let lbl='';
  if(r>1)lbl+=r+'×';if(d)lbl+=d;if(s)lbl+=' '+s;if(z)lbl+=' '+z;
  if(parseInt(p)>0)lbl+=' | Pause '+p+'s';if(e)lbl+=' | '+e;if(n)lbl+=' → '+n;
  const prev=document.getElementById('sprev-'+idx);if(prev)prev.textContent=lbl.trim()||'–';
}
function collectSets(){
  const sets=[];
  document.querySelectorAll('.set-row').forEach(row=>{
    const idx=row.id.replace('set-','');
    const s={reps:parseInt((document.getElementById('sr-'+idx)||{}).value)||1,distance:(document.getElementById('sd-'+idx)||{}).value||'',stroke:(document.getElementById('ss-'+idx)||{}).value||'',zone:(document.getElementById('sz-'+idx)||{}).value||'',restSec:parseInt((document.getElementById('sp-'+idx)||{}).value)||0,equipment:(document.getElementById('se-'+idx)||{}).value||'',note:(document.getElementById('sn-'+idx)||{}).value||''};
    if(s.distance||s.stroke||s.note)sets.push(s);
  });
  return sets;
}

// ── SAVE TRAINING ─────────────────────────────────────────────────────────────
async function saveTraining(e){
  e.preventDefault();
  const btn=document.getElementById('tf-submit');btn.disabled=true;btn.textContent='Speichern…';
  try{
    const date=document.getElementById('tf-date').value;
    const type=document.getElementById('tf-type').value;
    const unit=(document.querySelector('input[name="tf-unit"]:checked')||{}).value||'absolviert';
    const dur=parseInt(document.getElementById('tf-dur').value)||60;
    const load=parseInt(document.getElementById('tf-load').value)||5;
    const well=parseInt(document.getElementById('tf-well').value)||3;
    const plan=(document.querySelector('input[name="tf-plan"]:checked')||{}).value||'teilweise';
    if(!date||!type){showToast('Bitte Datum und Trainingsart ausfüllen.');return;}
    if(!S.editId){
      const existing=await dbAll('training');
      const dup=existing.find(en=>en.date===date&&en.type===type&&en.durationMin===dur);
      if(dup){showToast('Ein ähnlicher Eintrag für diesen Tag existiert bereits.');return;}
    }
    const km=parseFloat((document.getElementById('tf-km')||{}).value)||null;
    const focus=(document.getElementById('tf-focus')||{}).value.trim()||'';
    const strokes=Array.from(document.querySelectorAll('#stroke-chips .chip.sel')).map(c=>c.dataset.v);
    const reflGood=(document.getElementById('tf-good')||{}).value.trim()||'';
    const reflHard=(document.getElementById('tf-hard')||{}).value.trim()||'';
    const reflNext=(document.getElementById('tf-next')||{}).value.trim()||'';
    const note=(document.getElementById('tf-note')||{}).value.trim()||'';
    const sets=collectSets();
    const id=S.editId||genId();
    const entry={id,date,type,unit,durationMin:dur,load,wellbeing:well,planCompleted:plan,km,focus,strokes,reflGood,reflHard,reflNext,note,sets,createdAt:new Date().toISOString()};
    const pts=calcPts(entry);entry.pointsEarned=pts.total;
    if(S.editId){
      const log=await dbAll('points_log');
      const oldPts=log.filter(l=>l.entryId===S.editId).reduce((s,l)=>s+l.points,0);
      if(oldPts!==0)await dbPut('points_log',{id:genId(),date:today(),reason:'Eintrag bearbeitet (Korrektur)',points:-oldPts,entryId:S.editId,entryType:'correction'});
    }
    await dbPut('training',entry);
    if(pts.total>0)await logPts(pts.reasons,id,'training',date);
    await checkWeekBonus(date);
    const newBadges=await checkBadges();
    cancelEdit();resetTrainingForm();
    showSaveModal(pts,newBadges,S.editId?'Eintrag aktualisiert!':'Training gespeichert!');
    goTo('heute');
  }catch(err){showToast(err.message||'Fehler beim Speichern.');}
  finally{btn.disabled=false;btn.textContent=S.editId?'Änderungen speichern':'Training speichern';}
}
function resetTrainingForm(){
  var tformEl=document.getElementById('tform');if(tformEl)tformEl.reset();
  const d=document.getElementById('tf-date');if(d){d.value=today();d.style.display='none';}
  document.getElementById('tf-type').value='';
  document.querySelectorAll('#type-chips .chip').forEach(c=>c.classList.remove('sel'));
  document.querySelectorAll('#stroke-chips .chip').forEach(c=>c.classList.remove('sel'));
  document.getElementById('tf-dur').value=60;setText('tf-dur-val','60');
  setLoad(5);setWell(3);
  document.getElementById('opt-fields').classList.add('hidden');
  document.getElementById('opt-toggle').textContent='+ Weitere Details';
  document.getElementById('sets-container').innerHTML='';S.setIdx=0;
  document.getElementById('sets-section').style.display='';
  document.getElementById('regen-section').classList.add('hidden');
  document.querySelectorAll('#date-shortcuts .chip').forEach((b,i)=>b.classList.toggle('sel',i===0));
}
function cancelEdit(){S.editId=null;document.getElementById('edit-banner').classList.add('hidden');const btn=document.getElementById('tf-submit');if(btn)btn.textContent='Training speichern';}
async function openEntry(id){
  const e=await dbGet('training',id);if(!e)return;
  goTo('training');S.editId=id;
  document.getElementById('tf-date').value=e.date;document.getElementById('tf-date').style.display='';
  document.getElementById('tf-type').value=e.type;
  document.querySelectorAll('#type-chips .chip').forEach(c=>c.classList.toggle('sel',c.dataset.v===e.type));
  adaptForm(e.type);
  const ur=document.querySelector('input[name="tf-unit"][value="'+e.unit+'"]');if(ur)ur.checked=true;
  document.getElementById('tf-dur').value=e.durationMin;setText('tf-dur-val',e.durationMin);
  setLoad(e.load);setWell(e.wellbeing);
  const pr=document.querySelector('input[name="tf-plan"][value="'+e.planCompleted+'"]');if(pr)pr.checked=true;
  if(e.km)document.getElementById('tf-km').value=e.km;
  if(e.focus)document.getElementById('tf-focus').value=e.focus;
  if(e.strokes)document.querySelectorAll('#stroke-chips .chip').forEach(c=>c.classList.toggle('sel',e.strokes.includes(c.dataset.v)));
  if(e.reflGood)document.getElementById('tf-good').value=e.reflGood;
  if(e.reflHard)document.getElementById('tf-hard').value=e.reflHard;
  if(e.reflNext)document.getElementById('tf-next').value=e.reflNext;
  if(e.note)document.getElementById('tf-note').value=e.note;
  if(e.km||e.focus||e.reflGood||e.reflHard||e.reflNext||e.note){document.getElementById('opt-fields').classList.remove('hidden');document.getElementById('opt-toggle').textContent='− Weniger Details';}
  document.getElementById('sets-container').innerHTML='';S.setIdx=0;
  if(e.sets&&e.sets.length){e.sets.forEach(s=>{addSet();const idx=S.setIdx;if(s.reps)document.getElementById('sr-'+idx).value=s.reps;if(s.distance)document.getElementById('sd-'+idx).value=s.distance;if(s.stroke)document.getElementById('ss-'+idx).value=s.stroke;if(s.zone)document.getElementById('sz-'+idx).value=s.zone;if(s.restSec)document.getElementById('sp-'+idx).value=s.restSec;if(s.equipment)document.getElementById('se-'+idx).value=s.equipment;if(s.note)document.getElementById('sn-'+idx).value=s.note;updPrev(idx);});}
  document.getElementById('edit-banner').classList.remove('hidden');
  const btn=document.getElementById('tf-submit');if(btn)btn.textContent='Änderungen speichern';
}
async function deleteEntry(id){
  showConfirm('Eintrag löschen?','Dieser Eintrag und die damit verbundenen Punkte werden entfernt.',async()=>{
    const log=await dbAll('points_log');
    const oldPts=log.filter(l=>l.entryId===id).reduce((s,l)=>s+l.points,0);
    if(oldPts!==0)await dbPut('points_log',{id:genId(),date:today(),reason:'Eintrag gelöscht',points:-oldPts,entryId:id,entryType:'deletion'});
    await dbDel('training',id);closeModal('m-confirm');showToast('Eintrag gelöscht.');
    if(S.page==='heute')renderHeutePage();if(S.page==='fortschritt')renderFortschrittPage();
  });
}

// ── QUICK LOG ─────────────────────────────────────────────────────────────────
function openQuickLog(){
  document.querySelectorAll('#ql-chips .chip').forEach(c=>c.classList.remove('sel'));
  document.getElementById('ql-type').value='';
  document.getElementById('ql-dur').value=60;setText('ql-dur-val','60');
  document.querySelectorAll('#ql-well-btns .wbtn').forEach(b=>b.classList.toggle('sel',b.dataset.v==='3'));
  document.getElementById('ql-well').value='3';
  document.getElementById('m-quicklog').classList.remove('hidden');
}
function qlPickType(btn){document.querySelectorAll('#ql-chips .chip').forEach(c=>c.classList.remove('sel'));btn.classList.add('sel');document.getElementById('ql-type').value=btn.dataset.v;}
function qlPickWell(btn){document.querySelectorAll('#ql-well-btns .wbtn').forEach(b=>b.classList.remove('sel'));btn.classList.add('sel');document.getElementById('ql-well').value=btn.dataset.v;}
async function saveQuickLog(){
  const type=document.getElementById('ql-type').value;
  const dur=parseInt(document.getElementById('ql-dur').value)||60;
  const well=parseInt(document.getElementById('ql-well').value)||3;
  if(!type){showToast('Bitte Trainingsart auswählen.');return;}
  const id=genId();
  const entry={id,date:today(),type,unit:'absolviert',durationMin:dur,load:5,wellbeing:well,planCompleted:'teilweise',km:null,focus:'',strokes:[],reflGood:'',reflHard:'',reflNext:'',note:'',sets:[],createdAt:new Date().toISOString()};
  const pts=calcPts(entry);entry.pointsEarned=pts.total;
  await dbPut('training',entry);
  if(pts.total>0)await logPts(pts.reasons,id,'training',today());
  await checkWeekBonus(today());
  const newBadges=await checkBadges();
  closeModal('m-quicklog');haptic();
  showSaveModal(pts,newBadges,'Training gespeichert! ⚡');
  renderHeutePage();
}
async function repeatLast(){
  const entries=await dbAll('training');if(!entries.length)return;
  const last=entries.slice().sort((a,b)=>b.date.localeCompare(a.date))[0];
  const todayE=entries.filter(e=>e.date===today()&&e.type===last.type);
  if(todayE.length>0){showToast('Für heute existiert bereits ein ähnlicher Eintrag.');return;}
  const id=genId();
  const entry={...last,id,date:today(),createdAt:new Date().toISOString()};
  const pts=calcPts(entry);entry.pointsEarned=pts.total;
  await dbPut('training',entry);
  if(pts.total>0)await logPts(pts.reasons,id,'training',today());
  await checkWeekBonus(today());
  const newBadges=await checkBadges();
  haptic();showSaveModal(pts,newBadges,last.type+' wiederholt! 🔁');renderHeutePage();
}

