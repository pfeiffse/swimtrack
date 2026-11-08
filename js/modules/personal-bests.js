'use strict';
// SwimTrack Stage 4 - Fachmodul persönliche Bestzeiten.
// Enthält PB-Ausgabe, Matrix, Quellenkennzeichnung und typische Wettkampfstrecken.
// ── Bestzeiten anzeigen ───────────────────────────────────────────
async function renderPBs() {
  var c = document.getElementById('pb-list');
  if (!c) return;

  var pbs = await dbAll('pbs');

  var pbPoolEl   = document.getElementById('pb-pool');
  var pbStrokeEl = document.getElementById('pb-stroke');
  var pool   = pbPoolEl   ? (pbPoolEl.value   || '') : '';
  var stroke = pbStrokeEl ? (pbStrokeEl.value || '') : '';

  var filtered = [];
  for (var i = 0; i < pbs.length; i++) {
    var p = pbs[i];
    if (pool   && p.poolLength !== pool)   continue;
    if (stroke && p.stroke    !== stroke)  continue;
    filtered.push(p);
  }

  if (!filtered.length) {
    c.innerHTML = '<div style="text-align:center;padding:28px 14px;color:#9090A8">' +
      '<div style="font-size:2.2rem;margin-bottom:7px">⏱️</div>' +
      '<p style="font-size:.875rem;font-weight:500">Noch keine Bestzeiten.</p>' +
      '<p style="font-size:.75rem;margin-top:3px">Trage deinen ersten Wettkampf ein!</p>' +
      '</div>';
    return;
  }

  filtered.sort(function(a, b) {
    var da = parseInt(a.distance) || 0;
    var db = parseInt(b.distance) || 0;
    if (da !== db) return da - db;
    return (a.stroke || '').localeCompare(b.stroke || '');
  });

  var html = '';
  for (var j = 0; j < filtered.length; j++) {
    var pb = filtered[j];
    var timeStr = wkFmt(pb.timeMin, pb.timeSec, pb.timeMs);
    var dateStr = typeof fmtDate === 'function' ? fmtDate(pb.date) : (pb.date || '');
    html += '<div style="background:var(--card,#FFF);border-radius:14px;padding:12px 13px;margin-bottom:8px;box-shadow:0 1px 3px rgba(0,0,0,.08);border:1px solid var(--border,#DCDCE8);display:flex;align-items:center;gap:10px">' +
      '<div style="width:36px;height:36px;border-radius:10px;background:#FFF3E0;display:flex;align-items:center;justify-content:center;font-size:.95rem;flex-shrink:0">⏱️</div>' +
      '<div style="flex:1">' +
        '<div style="font-size:.875rem;font-weight:700">' + (pb.distance || '') + ' ' + (pb.stroke || '') + '</div>' +
        '<div style="font-size:1.1rem;font-weight:800;color:#0044FF;letter-spacing:-.3px">' + timeStr + '</div>' +
        '<div style="font-size:.7rem;color:#9090A8">' + (pb.poolLength || '?') + 'm Bahn · ' + dateStr + '</div>' +
      '</div>' +
    '</div>';
  }
  c.innerHTML = html;
}


// ============================================================================
// BESTZEITEN FIX v4 - responsive Kurzbahn/Langbahn-Matrix + Quellenkennzeichnung
// ============================================================================
function pbV4DistanceNumber(value) { return parseInt(String(value || ''), 10) || 0; }
function pbV4EventKey(pb) { return String(pb.distance || '') + '|' + String(pb.stroke || ''); }
function pbV4SourceLabel(pb) { return pb && pb.sourceType === 'split' ? 'Zwischenzeit' : 'Endzeit'; }
function pbV4Cell(pb, poolClass) {
  if (!pb) return '<div class="pb-v4-empty">–</div>';
  var dateStr = typeof fmtDate === 'function' ? fmtDate(pb.date) : (pb.date || '');
  var source = pbV4SourceLabel(pb);
  var sourceClass = source === 'Zwischenzeit' ? 'split' : 'finish';
  return '<div class="pb-v4-cell '+poolClass+'">' +
    '<div class="pb-v4-time">'+wkEscapeHtml(wkFmt(pb.timeMin,pb.timeSec,pb.timeMs))+'</div>' +
    '<div class="pb-v4-meta">'+wkEscapeHtml(dateStr)+'</div>' +
    '<span class="pb-v4-tag '+sourceClass+'">'+source+'</span>' +
  '</div>';
}

async function renderPBs() {
  var c=document.getElementById('pb-list'); if(!c) return;
  var pbs=await dbAll('pbs');
  var poolEl=document.getElementById('pb-pool');
  var strokeEl=document.getElementById('pb-stroke');
  var pool=poolEl ? String(poolEl.value||'') : '';
  var stroke=strokeEl ? String(strokeEl.value||'') : '';
  var filtered=pbs.filter(function(pb){
    return (!pool || String(pb.poolLength)===pool) && (!stroke || pb.stroke===stroke);
  });
  if(!filtered.length){
    c.innerHTML='<div style="text-align:center;padding:28px 14px;color:#9090A8"><div style="font-size:2.2rem;margin-bottom:7px">⏱️</div><p style="font-size:.875rem;font-weight:500">Noch keine Bestzeiten.</p><p style="font-size:.75rem;margin-top:3px">Trage deinen ersten Wettkampf ein!</p></div>';
    return;
  }
  var rows={};
  filtered.forEach(function(pb){
    var key=pbV4EventKey(pb);
    if(!rows[key]) rows[key]={distance:String(pb.distance||''),stroke:String(pb.stroke||''),short:null,long:null};
    if(String(pb.poolLength)==='25') rows[key].short=pb;
    if(String(pb.poolLength)==='50') rows[key].long=pb;
  });
  var data=Object.keys(rows).map(function(k){return rows[k];});
  data.sort(function(a,b){var d=pbV4DistanceNumber(a.distance)-pbV4DistanceNumber(b.distance);return d||a.stroke.localeCompare(b.stroke,'de');});
  var showShort=!pool||pool==='25', showLong=!pool||pool==='50';
  var html='<div class="pb-v4-legend">';
  if(showShort) html+='<div class="pb-v4-legend-item short">🔵 Kurzbahn · 25 m</div>';
  if(showLong) html+='<div class="pb-v4-legend-item long">🟠 Langbahn · 50 m</div>';
  html+='</div><div class="pb-v4-table-wrap"><table class="pb-v4-table"><thead><tr><th>Strecke · Lage</th>';
  if(showShort) html+='<th class="short">Kurzbahn<br>25 m</th>';
  if(showLong) html+='<th class="long">Langbahn<br>50 m</th>';
  html+='</tr></thead><tbody>';
  data.forEach(function(row){
    html+='<tr><td class="pb-v4-event">'+wkEscapeHtml(row.distance)+'<br><span style="font-weight:600;color:var(--tm,#818397)">'+wkEscapeHtml(row.stroke)+'</span></td>';
    if(showShort) html+='<td>'+pbV4Cell(row.short,'short')+'</td>';
    if(showLong) html+='<td>'+pbV4Cell(row.long,'long')+'</td>';
    html+='</tr>';
  });
  html+='</tbody></table></div>';
  c.innerHTML=html;
}

async function pbV4MigrateSourceTypes() {
  if(localStorage.getItem('st_pb_source_v4')==='1') return;
  try { await wkRebuildPBs(); localStorage.setItem('st_pb_source_v4','1'); }
  catch(err) { console.warn('PB source migration v4:',err); }
}
document.addEventListener('DOMContentLoaded',function(){
  setTimeout(function(){ pbV4MigrateSourceTypes().then(renderPBs); },500);
});


// ============================================================================
// BESTZEITEN FIX v4.1 - nur typische Einzel-Wettkampfstrecken
// ============================================================================
function pbV41IsTypicalEvent(distance, stroke, pool) {
  var d=parseInt(String(distance||''),10)||0;
  var st=String(stroke||'');
  if(st==='Freistil') return [50,100,200,400,800,1500].indexOf(d)!==-1;
  if(st==='Rücken' || st==='Brust' || st==='Schmetterling') return [50,100,200].indexOf(d)!==-1;
  if(st==='Lagen') {
    // 100 m Lagen ist als Einzelstrecke nur auf der 25-m-Bahn vorgesehen.
    if(d===100) return String(pool)==='25';
    return d===200 || d===400;
  }
  return false;
}

// v4.1 overrides: PB-Neuaufbau ignoriert nicht-typische Splitdistanzen (z.B. 150 m).
async function wkRebuildPBs() {
  var comps=await dbAll('competitions'), best={};
  for(var ci=0;ci<comps.length;ci++){
    var comp=comps[ci]||{}, pool=String(comp.poolLength||'25');
    var starts=Array.isArray(comp.starts)?comp.starts:[];
    for(var si=0;si<starts.length;si++){
      var st=starts[si]||{}, stroke=st.stroke||'', dist=st.distance||'';
      var finishCs=wkToCs(st.timeMin,st.timeSec,st.timeMs);
      if(stroke && dist && finishCs>0 && pbV41IsTypicalEvent(dist,stroke,pool)) wkTakeBest(best,dist,stroke,pool,finishCs,comp.date,'finish');
      var splits=Array.isArray(st.splits)?st.splits:[];
      for(var pi=0;pi<splits.length;pi++){
        var sp=splits[pi]||{}, splitCs=parseInt(sp.timeCs,10)||wkToCs(sp.timeMin,sp.timeSec,sp.timeMs);
        if(stroke && sp.distance && splitCs>0 && pbV41IsTypicalEvent(sp.distance,stroke,pool)) wkTakeBest(best,sp.distance+' m',stroke,pool,splitCs,comp.date,'split');
      }
    }
  }
  await dbClear('pbs');
  var keys=Object.keys(best); for(var k=0;k<keys.length;k++) await dbPut('pbs',best[keys[k]]);
  return keys.length;
}

// Wrap the v3 save implementation: non-typical split PBs may have been inserted during save;
// after every successful-looking change, rebuild the PB index from competitions using v4.1 rules.
var pbV41SaveBase=saveWettkampf;
saveWettkampf=async function(e){
  await pbV41SaveBase(e);
  try { await wkRebuildPBs(); await renderPBs(); } catch(err){ console.warn('PB v4.1 rebuild:',err); }
};

// Matrix filter as a second guard for legacy PB records.
var pbV41RenderBase=renderPBs;
renderPBs=async function(){
  // First remove legacy non-competition PB rows once, preserving competitions themselves.
  if(localStorage.getItem('st_pb_typical_v41')!=='1'){
    try { await wkRebuildPBs(); localStorage.setItem('st_pb_typical_v41','1'); } catch(err){ console.warn('PB v4.1 migration:',err); }
  }
  return pbV41RenderBase();
};
