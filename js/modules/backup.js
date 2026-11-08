'use strict';
// SwimTrack Stage 10.3 - vollständiger JSON-, Trainings- und Wettkampfexport.
function csvCell(value){
  if(value===null||value===undefined) value='';
  return '"'+String(value).replace(/"/g,'""')+'"';
}
function downloadTextFile(filename,text,mime){
  const blob=new Blob([text],{type:mime});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');
  a.href=url;a.download=filename;document.body.appendChild(a);a.click();a.remove();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
}
function exportTime(cs,min,sec,ms){
  const n=parseInt(cs,10);
  if(Number.isFinite(n)&&n>0&&typeof wkFmt==='function') return wkFmt(n);
  const m=parseInt(min,10)||0,s=parseInt(sec,10)||0,h=parseInt(ms,10)||0;
  if(typeof wkFmt==='function'&&(m||s||h)) return wkFmt(m*6000+s*100+h);
  return m+':'+String(s).padStart(2,'0')+','+String(h).padStart(2,'0');
}
async function exportData(){
  const [profile,training,competitions,pbs,log,badges]=await Promise.all([getProfile(),dbAll('training'),dbAll('competitions'),dbAll('pbs'),dbAll('points_log'),dbAll('badges')]);
  const data={exportDate:new Date().toISOString(),version:'5.0.0-stage10.3',profile,training,competitions,pbs,pointsLog:log,badges};
  downloadTextFile('swimtrack_komplett_'+today()+'.json',JSON.stringify(data,null,2),'application/json;charset=utf-8');
  showToast('Vollständiger JSON-Export gestartet.');
}
async function exportTrainingCSV(){
  const entries=await dbAll('training');
  const headers=['ID','Datum','Trainingsart','Einheit','Dauer (min)','Belastung','Wohlbefinden','Plan erfüllt','km','Punkte','Notiz','Sets (JSON)'];
  const rows=entries.map(e=>[e.id,e.date,e.type,e.unit,e.durationMin,e.load,e.wellbeing,e.planCompleted,e.km||'',e.pointsEarned,e.note||e.notes||'',JSON.stringify(e.sets||[])].map(csvCell).join(';'));
  downloadTextFile('swimtrack_training_'+today()+'.csv','\\uFEFF'+[headers.map(csvCell).join(';'),...rows].join('\\r\\n'),'text/csv;charset=utf-8');
  return entries.length;
}
async function exportCompetitionCSV(){
  const competitions=await dbAll('competitions');
  const splitDistances=[...new Set(competitions.flatMap(c=>(c.starts||[]).flatMap(s=>(s.splits||[]).map(sp=>parseInt(sp.distance,10)).filter(Number.isFinite))))].sort((a,b)=>a-b);
  const headers=['Wettkampf-ID','Datum','Wettkampf','Ort','Bahn (m)','Bewertung','Wettkampfnotiz','Start-Nr.','Start-ID','Strecke','Lage','Platz','Endzeit','Endzeit (Hundertstel)','Endzeit PB','Punkte Wettkampf',...splitDistances.map(d=>'Split '+d+' m'),...splitDistances.map(d=>'Split '+d+' m (Hundertstel)'),...splitDistances.map(d=>'Split '+d+' m PB')];
  const rows=[];
  competitions.forEach(c=>{
    const starts=c.starts||[];
    starts.forEach((s,index)=>{
      const byDistance={};(s.splits||[]).forEach(sp=>{byDistance[parseInt(sp.distance,10)]=sp;});
      const base=[c.id,c.date,c.name,c.location||'',c.poolLength||'',c.rating||'',c.note||'',index+1,s.id||'',s.distance||'',s.stroke||'',s.placement||'',exportTime(s.timeCs,s.timeMin,s.timeSec,s.timeMs),s.timeCs||'',s.isPB||s.wasPBAtEntry?'ja':'nein',c.pointsEarned||0];
      const splitTimes=splitDistances.map(d=>{const sp=byDistance[d];return sp?exportTime(sp.timeCs,sp.timeMin,sp.timeSec,sp.timeMs):'';});
      const splitCs=splitDistances.map(d=>byDistance[d]?byDistance[d].timeCs||'':'');
      const splitPB=splitDistances.map(d=>byDistance[d]?(byDistance[d].isPB||byDistance[d].wasPBAtEntry?'ja':'nein'):'');
      rows.push([...base,...splitTimes,...splitCs,...splitPB].map(csvCell).join(';'));
    });
  });
  downloadTextFile('swimtrack_wettkaempfe_'+today()+'.csv','\\uFEFF'+[headers.map(csvCell).join(';'),...rows].join('\\r\\n'),'text/csv;charset=utf-8');
  return {competitions:competitions.length,starts:rows.length,splits:splitDistances.length};
}
async function exportCSV(){
  const trainingCount=await exportTrainingCSV();
  const wk=await exportCompetitionCSV();
  showToast('CSV-Export: '+trainingCount+' Trainings, '+wk.starts+' Starts inkl. Splits/Endzeiten.');
}
function confirmReset(){
  showConfirm('Alle Daten löschen?','Diese Aktion kann nicht rückgängig gemacht werden.',async()=>{
    await Promise.all(['training','competitions','pbs','points_log','badges'].map(s=>dbClear(s)));
    closeModal('m-confirm');showToast('Alle Daten gelöscht.');renderHeutePage();
  });
}
