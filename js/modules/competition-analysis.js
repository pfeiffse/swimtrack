'use strict';
// SwimTrack Stage 5 - Wettkampfanalyse.
// ══════════════════════════════════════════════════════════════════
// WETTKAMPF ANALYSE v2
// - Pace-Analyse mit Split-Vergleich
// - Bestzeiten-Entwicklung als Liniendiagramm
// - Wettkampf-Vergleich
// - PBs pro Saison
// ══════════════════════════════════════════════════════════════════
'use strict';

// ── PACE ANALYSE ──────────────────────────────────────────────────────────────
function calcPaceAnalysis(start, totalDist) {
  var splits = start.splits || [];
  if (!splits.length) return null;
  var d = parseInt(totalDist) || 0;
  var totalCs = start.timeMin*6000 + start.timeSec*100 + start.timeMs;
  if (!totalCs) return null;

  // Build split segments: [0→50, 50→100, 100→150, ...]
  var allPoints = [{distance:0, cs:0}];
  splits.forEach(function(sp) { allPoints.push({distance:sp.distance, cs:sp.timeCs}); });
  allPoints.push({distance:d, cs:totalCs});
  allPoints.sort(function(a,b){return a.distance-b.distance;});

  var segments = [];
  for (var i=1; i<allPoints.length; i++) {
    var prev = allPoints[i-1], curr = allPoints[i];
    var segDist = curr.distance - prev.distance;
    var segCs   = curr.cs - prev.cs;
    if (segDist > 0 && segCs > 0) {
      var pace50 = Math.round(segCs * 50 / segDist); // normalize to per-50m
      segments.push({
        label: prev.distance + '-' + curr.distance + 'm',
        dist: segDist, cs: segCs, pace50: pace50,
        timeStr: csToStr(segCs)
      });
    }
  }

  // Analysis
  var firstHalfCs = 0, secondHalfCs = 0;
  var half = d / 2;
  segments.forEach(function(seg, i) {
    var midDist = allPoints[i].distance + seg.dist/2;
    if (midDist <= half) firstHalfCs += seg.cs;
    else secondHalfCs += seg.cs;
  });

  var splitDiff = secondHalfCs - firstHalfCs; // positive = second half slower
  var fastestSeg = segments.reduce(function(b,s){return s.pace50<b.pace50?s:b;}, segments[0]);
  var slowestSeg = segments.reduce(function(b,s){return s.pace50>b.pace50?s:b;}, segments[0]);
  var maxVariation = slowestSeg.pace50 - fastestSeg.pace50;

  return {
    segments: segments,
    firstHalfCs: firstHalfCs,
    secondHalfCs: secondHalfCs,
    splitDiff: splitDiff,
    fastestSeg: fastestSeg,
    slowestSeg: slowestSeg,
    maxVariation: maxVariation,
    totalCs: totalCs
  };
}

function csToStr(cs) {
  var min = Math.floor(cs / 6000);
  var sec = Math.floor((cs % 6000) / 100);
  var ms  = cs % 100;
  if (min > 0) return min + ':' + pad(sec) + ',' + pad(ms);
  return sec + ',' + pad(ms) + ' s';
}
function pad(n) { return n < 10 ? '0'+n : ''+n; }

// ── RENDER ANALYSE PAGE ───────────────────────────────────────────────────────
async function renderWkAnalyse() {
  var c = document.getElementById('wk-analyse-content');
  if (!c) return;
  var comps = await dbAll('competitions');
  var pbs   = await dbAll('pbs');
  if (!comps.length) {
    c.innerHTML = '<div class="empty"><div class="empty-ico">&#x1F4CA;</div><p>Noch keine Wettkampfdaten.</p><p class="empty-sub">Trage deinen ersten Wettkampf ein!</p></div>';
    return;
  }

  // ── SUMMARY STATS ──
  var totalStarts = comps.reduce(function(s,c){return s+(c.starts||[]).length;},0);
  var totalPBs    = comps.reduce(function(s,c){return s+(c.starts||[]).filter(function(st){return st.isPB;}).length;},0);

  // ── PBs PRO SAISON ──
  var pbsBySeason = {};
  comps.forEach(function(comp) {
    var year = (comp.date||'').slice(0,4);
    if (!year) return;
    (comp.starts||[]).forEach(function(s) {
      if (s.isPB) {
        if (!pbsBySeason[year]) pbsBySeason[year] = 0;
        pbsBySeason[year]++;
      }
    });
  });

  // ── TIMELINE PER DISTANCE+STROKE ──
  var timeline = {};
  comps.forEach(function(comp) {
    (comp.starts||[]).forEach(function(s) {
      var key = s.distance+'|'+s.stroke+'|'+(comp.poolLength||'25');
      if (!timeline[key]) timeline[key] = [];
      timeline[key].push({
        date: comp.date, compName: comp.name,
        cs: s.timeMin*6000+s.timeSec*100+s.timeMs,
        timeStr: fmtTime(s.timeMin,s.timeSec,s.timeMs),
        isPB: s.isPB, placement: s.placement,
        splits: s.splits||[], dist: s.distance, stroke: s.stroke,
        pool: comp.poolLength||'25'
      });
    });
  });

  var html = '';

  // ── SUMMARY CARD ──
  html += '<div class="card" style="margin-bottom:14px">' +
    '<div style="font-size:.83rem;font-weight:700;margin-bottom:10px">Wettkampf-Statistik</div>' +
    '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;text-align:center">' +
      '<div><div style="font-size:1.3rem;font-weight:800;color:var(--blue)">'+comps.length+'</div><div style="font-size:.62rem;color:var(--tm)">Wettkämpfe</div></div>' +
      '<div><div style="font-size:1.3rem;font-weight:800;color:var(--blue)">'+totalStarts+'</div><div style="font-size:.62rem;color:var(--tm)">Starts</div></div>' +
      '<div><div style="font-size:1.3rem;font-weight:800;color:var(--amber)">'+totalPBs+'</div><div style="font-size:.62rem;color:var(--tm)">Bestzeiten</div></div>' +
      '<div><div style="font-size:1.3rem;font-weight:800;color:var(--green)">'+pbs.length+'</div><div style="font-size:.62rem;color:var(--tm)">Aktuelle PBs</div></div>' +
    '</div>' +
  '</div>';

  // ── PBs PRO SAISON ──
  var seasons = Object.keys(pbsBySeason).sort();
  if (seasons.length > 0) {
    html += '<div class="card" style="margin-bottom:14px">' +
      '<div style="font-size:.83rem;font-weight:700;margin-bottom:10px">Bestzeiten pro Saison</div>';
    var maxPBs = Math.max.apply(null, seasons.map(function(y){return pbsBySeason[y];}));
    seasons.forEach(function(year) {
      var count = pbsBySeason[year];
      var pct = Math.round((count/Math.max(maxPBs,1))*100);
      html += '<div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">' +
        '<div style="font-size:.78rem;font-weight:700;min-width:36px">'+year+'</div>' +
        '<div style="flex:1;height:20px;background:var(--subtle);border-radius:999px;overflow:hidden">' +
          '<div style="height:100%;width:'+pct+'%;background:var(--grad);border-radius:999px;transition:width .6s ease"></div>' +
        '</div>' +
        '<div style="font-size:.78rem;font-weight:800;color:var(--amber);min-width:24px;text-align:right">'+count+'</div>' +
      '</div>';
    });
    html += '</div>';
  }

  // ── BESTZEITEN-ENTWICKLUNG PRO STRECKE ──
  html += '<div style="font-size:.83rem;font-weight:700;margin-bottom:10px">Bestzeiten-Entwicklung</div>';

  Object.keys(timeline).sort().forEach(function(key) {
    var parts = key.split('|');
    var dist=parts[0], stroke=parts[1], pool=parts[2];
    var entries = timeline[key].sort(function(a,b){return a.date.localeCompare(b.date);});
    if (entries.length < 1) return;

    var best = entries.reduce(function(b,e){return e.cs<b.cs?e:b;}, entries[0]);
    var improvement = entries.length>=2 ? (entries[0].cs - entries[entries.length-1].cs)/100 : null;

    html += '<div class="card" style="margin-bottom:12px">' +
      '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">' +
        '<div>' +
          '<div style="font-size:.9rem;font-weight:800">'+dist+' '+stroke+'</div>' +
          '<div style="font-size:.7rem;color:var(--tm)">'+pool+'m Bahn &middot; '+entries.length+' Start'+(entries.length>1?'s':'')+'</div>' +
        '</div>' +
        '<div style="text-align:right">' +
          '<div style="font-size:1.1rem;font-weight:800;color:var(--blue)">'+best.timeStr+'</div>' +
          '<div style="font-size:.62rem;color:var(--green);font-weight:600">Bestzeit</div>' +
        '</div>' +
      '</div>';

    // Improvement banner
    if (improvement !== null && improvement > 0) {
      html += '<div style="background:var(--green-l);border-radius:8px;padding:6px 10px;margin-bottom:10px;font-size:.78rem;font-weight:600;color:var(--green)">' +
        '&#x1F4C8; Verbesserung: '+improvement.toFixed(2)+'s seit dem ersten Start' +
      '</div>';
    } else if (improvement !== null && improvement < 0) {
      html += '<div style="background:var(--amber-l);border-radius:8px;padding:6px 10px;margin-bottom:10px;font-size:.78rem;font-weight:600;color:var(--amber)">' +
        'Noch Luft nach oben – weiter trainieren!' +
      '</div>';
    }

    // Line chart
    if (entries.length >= 2) {
      html += '<div style="margin-bottom:10px"><canvas id="chart-'+key.replace(/[|]/g,'-')+'" style="width:100%;height:100px"></canvas></div>';
    }

    // Timeline list with pace analysis
    html += '<div style="display:flex;flex-direction:column;gap:0">';
    entries.slice().reverse().forEach(function(entry, ei) {
      var pace = calcPaceAnalysis(entry, parseInt(dist));
      var paceHTML = '';
      if (pace && pace.segments.length >= 2) {
        var diffSec = pace.splitDiff / 100;
        var diffStr = (diffSec >= 0 ? '+' : '') + diffSec.toFixed(2) + 's';
        var diffColor = diffSec > 1.5 ? 'var(--red)' : diffSec > 0.5 ? 'var(--amber)' : 'var(--green)';
        var diffLabel = diffSec > 1.5 ? 'Einbruch 2. Hälfte' : diffSec > 0.5 ? 'Leichter Einbruch' : diffSec < -0.5 ? 'Negative Split!' : 'Gleichmäßig';
        paceHTML = '<div style="margin-top:5px;display:flex;gap:6px;flex-wrap:wrap">' +
          '<span style="font-size:.62rem;background:var(--subtle);padding:2px 6px;border-radius:4px;color:var(--tm)">2. Hälfte: <strong style="color:'+diffColor+'">'+diffStr+'</strong></span>' +
          '<span style="font-size:.62rem;background:var(--subtle);padding:2px 6px;border-radius:4px;color:'+diffColor+'">'+diffLabel+'</span>' +
          (pace.maxVariation > 200 ? '<span style="font-size:.62rem;background:var(--red-l);padding:2px 6px;border-radius:4px;color:var(--red)">Pace-Variation: '+( pace.maxVariation/100).toFixed(2)+'s/50m</span>' : '') +
        '</div>';
        // Splits bar
        var maxPace = Math.max.apply(null, pace.segments.map(function(s){return s.pace50;}));
        var minPace = Math.min.apply(null, pace.segments.map(function(s){return s.pace50;}));
        var paceRange = maxPace - minPace || 1;
        paceHTML += '<div style="display:flex;gap:3px;margin-top:5px;align-items:flex-end;height:28px">';
        pace.segments.forEach(function(seg) {
          var h = Math.round(10 + ((seg.pace50-minPace)/paceRange)*18);
          var col = seg === pace.fastestSeg ? 'var(--green)' : seg === pace.slowestSeg ? 'var(--red)' : 'var(--blue)';
          paceHTML += '<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:1px">' +
            '<div style="font-size:.52rem;color:var(--tm)">'+seg.timeStr+'</div>' +
            '<div style="width:100%;height:'+h+'px;background:'+col+';border-radius:3px 3px 0 0;opacity:.8"></div>' +
            '<div style="font-size:.52rem;color:var(--tm)">'+seg.label+'</div>' +
          '</div>';
        });
        paceHTML += '</div>';
      }

      html += '<div style="padding:8px 0;border-bottom:1px solid var(--border)">' +
        '<div style="display:flex;align-items:center;gap:8px">' +
          '<div style="font-size:.7rem;color:var(--tm);min-width:55px">'+fmtDateS(entry.date)+'</div>' +
          '<div style="font-size:.88rem;font-weight:800;color:var(--blue)">'+entry.timeStr+'</div>' +
          (entry.isPB?'<span style="font-size:.6rem;background:var(--amber-l);color:var(--amber);padding:1px 5px;border-radius:4px;font-weight:700">PB</span>':'') +
          (entry.placement?'<span style="font-size:.68rem;color:var(--tm)">Platz '+entry.placement+'</span>':'') +
          '<div style="font-size:.68rem;color:var(--tm);margin-left:auto;text-align:right">'+entry.compName+'</div>' +
        '</div>' +
        paceHTML +
      '</div>';
    });
    html += '</div></div>';
  });

  c.innerHTML = html;

  // Draw line charts
  Object.keys(timeline).sort().forEach(function(key) {
    var parts = key.split('|');
    var dist=parts[0];
    var entries = timeline[key].sort(function(a,b){return a.date.localeCompare(b.date);});
    if (entries.length < 2) return;
    var canvasId = 'chart-'+key.replace(/[|]/g,'-');
    var canvas = document.getElementById(canvasId);
    if (!canvas) return;
    var labels = entries.map(function(e){return fmtDateS(e.date);});
    var data   = entries.map(function(e){return e.cs/100;});
    var minY = Math.min.apply(null,data)*0.995;
    var maxY = Math.max.apply(null,data)*1.005;
    drawLineChart(canvasId, labels, data, '#0066FF', minY, maxY);
  });
}

// ── LINE CHART HELPER ─────────────────────────────────────────────────────────
function drawLineChart(canvasId, labels, data, color, minY, maxY) {
  var canvas = document.getElementById(canvasId);
  if (!canvas) return;
  var dpr = window.devicePixelRatio||1;
  var rect = canvas.parentElement.getBoundingClientRect();
  var W = Math.max(rect.width||300,200), H = 100;
  canvas.width=W*dpr; canvas.height=H*dpr;
  canvas.style.width=W+'px'; canvas.style.height=H+'px';
  var ctx = canvas.getContext('2d');
  ctx.scale(dpr,dpr); ctx.clearRect(0,0,W,H);
  var pad={t:8,r:8,b:22,l:42};
  var cW=W-pad.l-pad.r, cH=H-pad.t-pad.b;
  var range=(maxY-minY)||1;
  var toX=function(i){return pad.l+(i/Math.max(data.length-1,1))*cW;};
  var toY=function(v){return pad.t+cH-((v-minY)/range)*cH;};

  // Grid
  for(var i=0;i<=3;i++){
    var y=pad.t+(i/3)*cH;
    ctx.strokeStyle='#DCDCE8';ctx.lineWidth=.5;
    ctx.beginPath();ctx.moveTo(pad.l,y);ctx.lineTo(pad.l+cW,y);ctx.stroke();
    var val=maxY-(i/3)*range;
    ctx.fillStyle='#9090A8';ctx.font='8px Inter,sans-serif';ctx.textAlign='right';
    ctx.fillText(val.toFixed(2)+'s',pad.l-3,y+3);
  }

  // Area
  var ag=ctx.createLinearGradient(0,pad.t,0,pad.t+cH);
  ag.addColorStop(0,color+'28');ag.addColorStop(1,color+'00');
  ctx.fillStyle=ag;ctx.beginPath();ctx.moveTo(toX(0),toY(data[0]));
  data.forEach(function(v,i){if(i>0)ctx.lineTo(toX(i),toY(v));});
  ctx.lineTo(toX(data.length-1),pad.t+cH);ctx.lineTo(toX(0),pad.t+cH);ctx.closePath();ctx.fill();

  // Line
  ctx.strokeStyle=color;ctx.lineWidth=2;ctx.lineJoin='round';
  ctx.beginPath();data.forEach(function(v,i){i===0?ctx.moveTo(toX(i),toY(v)):ctx.lineTo(toX(i),toY(v));});ctx.stroke();

  // Dots + PB markers
  data.forEach(function(v,i){
    var isPB = false;
    // Check if this is a PB (lowest value so far)
    var minSoFar = Math.min.apply(null, data.slice(0,i+1));
    if (v <= minSoFar && i > 0) isPB = true;
    ctx.fillStyle=isPB?'#FF8F00':color;
    ctx.beginPath();ctx.arc(toX(i),toY(v),isPB?4:3,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='white';ctx.beginPath();ctx.arc(toX(i),toY(v),isPB?2:1.5,0,Math.PI*2);ctx.fill();
  });

  // X labels
  var step=Math.max(1,Math.floor(labels.length/5));
  ctx.fillStyle='#9090A8';ctx.font='8px Inter,sans-serif';ctx.textAlign='center';
  labels.forEach(function(l,i){if(i%step===0)ctx.fillText(l,toX(i),H-4);});
}
