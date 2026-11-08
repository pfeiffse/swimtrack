'use strict';
// SwimTrack Stage 4 - Fachmodul Wettkampf.
// Enthält Formular, Starts/Splits, Verlauf, Löschen und die v3-validierte Speicherlogik.
// WETTKAMPF MODULE v5 – Alle Bugs behoben
// WICHTIG: addWkStart hier definiert, überschreibt alte Version
// ══════════════════════════════════════════════════════════════════
'use strict';

// ── Hilfsfunktionen ───────────────────────────────────────────────




function wkGetSplitDistances(distStr) {
  var d = parseInt(distStr) || 0;
  if (d <= 50)   return [];
  if (d === 100) return [50];
  if (d === 200) return [50, 100, 150];
  if (d === 400) return [100, 200, 300];
  if (d === 800) return [100, 200, 300, 400, 500, 600, 700];
  if (d === 1500) return [100,200,300,400,500,600,700,800,900,1000,1100,1200,1300,1400];
  return [];
}

// ── Start-Block aufbauen ──────────────────────────────────────────
// OVERRIDE: Diese Funktion ersetzt die alte addWkStart aus js_core

function wkRemoveStart(idx) {
  var el = document.getElementById('wk-start-block-' + idx);
  if (el) el.remove();
}

function wkUpdateSplits(idx) {
  var distEl = document.getElementById('wkd-' + idx);
  var container = document.getElementById('wk-splits-' + idx);
  if (!distEl || !container) return;
  var splits = wkGetSplitDistances(distEl.value);
  if (!splits.length) { container.innerHTML = ''; return; }

  var html = '<div style="background:var(--subtle);border-radius:8px;padding:10px;margin-top:4px">' +
    '<div style="font-size:.72rem;font-weight:700;color:var(--tm);margin-bottom:8px">Zwischenzeiten (optional)</div>';
  splits.forEach(function(sp) {
    html += '<div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">' +
      '<span style="font-size:.72rem;font-weight:700;color:var(--blue,#0044FF);min-width:48px">' + sp + 'm:</span>' +
      '<div style="display:flex;align-items:center;gap:4px">' +
        '<input type="number" id="wksplit-' + idx + '-' + sp + '-m" placeholder="0" min="0" max="59" style="width:44px;padding:6px 4px;border:1.5px solid var(--border);border-radius:6px;font-size:.85rem;font-weight:700;text-align:center;color:var(--t1);background:var(--card);outline:none"/>' +
        '<span style="font-size:.9rem;font-weight:700;color:var(--tm)">:</span>' +
        '<input type="number" id="wksplit-' + idx + '-' + sp + '-s" placeholder="00" min="0" max="59" style="width:44px;padding:6px 4px;border:1.5px solid var(--border);border-radius:6px;font-size:.85rem;font-weight:700;text-align:center;color:var(--t1);background:var(--card);outline:none"/>' +
        '<span style="font-size:.9rem;font-weight:700;color:var(--tm)">,</span>' +
        '<input type="number" id="wksplit-' + idx + '-' + sp + '-ms" placeholder="00" min="0" max="99" style="width:44px;padding:6px 4px;border:1.5px solid var(--border);border-radius:6px;font-size:.85rem;font-weight:700;text-align:center;color:var(--t1);background:var(--card);outline:none"/>' +
      '</div>' +
    '</div>';
  });
  html += '</div>';
  container.innerHTML = html;
}

function wkCollectSplits(idx, distStr) {
  var splits = wkGetSplitDistances(distStr);
  var result = [];
  splits.forEach(function(sp) {
    var mEl  = document.getElementById('wksplit-' + idx + '-' + sp + '-m');
    var sEl  = document.getElementById('wksplit-' + idx + '-' + sp + '-s');
    var msEl = document.getElementById('wksplit-' + idx + '-' + sp + '-ms');
    var m  = parseInt(mEl  ? mEl.value  : 0) || 0;
    var s  = parseInt(sEl  ? sEl.value  : 0) || 0;
    var ms = parseInt(msEl ? msEl.value : 0) || 0;
    var cs = m*6000 + s*100 + ms;
    if (cs > 0) result.push({ distance: sp, timeCs: cs, timeMin: m, timeSec: s, timeMs: ms });
  });
  return result;
}

/* ═══════════════════════════════════════════════════════════════
   WETTKAMPF MODULE v3 – Komplett neu, maximale Kompatibilität
   Kein optional chaining, kein arrow function in kritischen Pfaden
   ═══════════════════════════════════════════════════════════════ */

// ── Globaler Wettkampf-State ──────────────────────────────────────
var WK = {
  startIdx: 0
};

// ── Hilfsfunktionen ───────────────────────────────────────────────
function wkVal(id) {
  var el = document.getElementById(id);
  if (!el) return '';
  return el.value || '';
}

function wkIntVal(id) {
  var el = document.getElementById(id);
  if (!el) return 0;
  return parseInt(el.value) || 0;
}





function wkSplitDists(distStr) {
  var d = parseInt(distStr) || 0;
  if (d <= 50)   return [];
  if (d === 100) return [50];
  if (d === 200) return [50, 100, 150];
  if (d === 400) return [100, 200, 300];
  if (d === 800) return [100, 200, 300, 400, 500, 600, 700];
  if (d === 1500) return [100,200,300,400,500,600,700,800,900,1000,1100,1200,1300,1400];
  return [];
}

function wkRadioVal(name, fallback) {
  var els = document.getElementsByName(name);
  for (var i = 0; i < els.length; i++) {
    if (els[i].checked) return els[i].value;
  }
  return fallback || '';
}

// ── Start-Block hinzufügen ────────────────────────────────────────
function addWkStart() {
  WK.startIdx = WK.startIdx + 1;
  var idx = WK.startIdx;
  var container = document.getElementById('wk-starts');
  if (!container) return;

  var distOpts   = ['50 m','100 m','200 m','400 m','800 m','1500 m'];
  var strokeOpts = ['Freistil','Rücken','Brust','Schmetterling','Lagen'];

  var distHtml = '<select id="wkd-' + idx + '" onchange="wkShowSplits(' + idx + ')">';
  for (var i = 0; i < distOpts.length; i++) {
    distHtml += '<option value="' + distOpts[i] + '">' + distOpts[i] + '</option>';
  }
  distHtml += '</select>';

  var strokeHtml = '<select id="wk-stroke-' + idx + '" data-field="stroke">';
  for (var j = 0; j < strokeOpts.length; j++) {
    strokeHtml += '<option value="' + strokeOpts[j] + '">' + strokeOpts[j] + '</option>';
  }
  strokeHtml += '</select>';

  var block = document.createElement('div');
  block.id = 'wk-start-block-' + idx;
  block.className = 'wk-start-block';
  block.innerHTML =
    '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">' +
      '<span style="font-size:.85rem;font-weight:700;color:#0044FF">Start ' + idx + '</span>' +
      '<button type="button" onclick="wkDelStart(' + idx + ')" style="width:26px;height:26px;border-radius:50%;background:#FFEBEE;color:#F44336;font-size:.8rem;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center">&#x2715;</button>' +
    '</div>' +
    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px">' +
      '<div>' +
        '<label style="font-size:.72rem;font-weight:600;color:#9090A8;display:block;margin-bottom:3px">Strecke</label>' +
        distHtml +
      '</div>' +
      '<div>' +
        '<label style="font-size:.72rem;font-weight:600;color:#9090A8;display:block;margin-bottom:3px">Lage</label>' +
        strokeHtml +
      '</div>' +
    '</div>' +
    '<div style="margin-bottom:8px">' +
      '<label style="font-size:.72rem;font-weight:600;color:#9090A8;display:block;margin-bottom:5px">Zeit &nbsp;<span style="font-weight:400">Min : Sek , Hundertstel</span></label>' +
      '<div style="display:flex;align-items:center;gap:6px">' +
        '<input type="number" id="wkm-' + idx + '" placeholder="0" min="0" max="59" style="width:52px;padding:9px 6px;border:1.5px solid #DCDCE8;border-radius:8px;font-size:1rem;font-weight:700;text-align:center;color:#0D0D1A;background:#FFF;outline:none">' +
        '<span style="font-size:1.1rem;font-weight:700;color:#9090A8">:</span>' +
        '<input type="number" id="wkse-' + idx + '" placeholder="00" min="0" max="59" style="width:52px;padding:9px 6px;border:1.5px solid #DCDCE8;border-radius:8px;font-size:1rem;font-weight:700;text-align:center;color:#0D0D1A;background:#FFF;outline:none">' +
        '<span style="font-size:1.1rem;font-weight:700;color:#9090A8">,</span>' +
        '<input type="number" id="wkms-' + idx + '" placeholder="00" min="0" max="99" style="width:52px;padding:9px 6px;border:1.5px solid #DCDCE8;border-radius:8px;font-size:1rem;font-weight:700;text-align:center;color:#0D0D1A;background:#FFF;outline:none">' +
      '</div>' +
    '</div>' +
    '<div style="margin-bottom:6px">' +
      '<label style="font-size:.72rem;font-weight:600;color:#9090A8;display:block;margin-bottom:3px">Platzierung <span style="font-weight:400">(optional)</span></label>' +
      '<input type="number" id="wkp-' + idx + '" placeholder="z.B. 3" min="1" style="width:100px;padding:8px 9px;border:1.5px solid #DCDCE8;border-radius:8px;font-size:15px;color:#0D0D1A;background:#FFF;outline:none">' +
    '</div>' +
    '<div id="wksplits-' + idx + '"></div>';

  container.appendChild(block);

  // Style the selects
  var selStyle = 'width:100%;padding:8px 9px;border:1.5px solid #DCDCE8;border-radius:8px;font-size:15px;color:#0D0D1A;background:#FFF;outline:none';
  var distSel = document.getElementById('wkd-' + idx);
  var strokeSel = document.getElementById('wk-stroke-' + idx);
  if (distSel) distSel.style.cssText = selStyle;
  if (strokeSel) strokeSel.style.cssText = selStyle;
}

function wkDelStart(idx) {
  var el = document.getElementById('wk-start-block-' + idx);
  if (el) el.parentNode.removeChild(el);
}

function wkShowSplits(idx) {
  var distEl = document.getElementById('wkd-' + idx);
  var container = document.getElementById('wksplits-' + idx);
  if (!distEl || !container) return;

  var splits = wkSplitDists(distEl.value);
  if (!splits.length) { container.innerHTML = ''; return; }

  var html = '<div style="background:#F0F0F8;border-radius:8px;padding:10px;margin-top:4px">' +
    '<div style="font-size:.72rem;font-weight:700;color:#9090A8;margin-bottom:8px">Zwischenzeiten (optional)</div>';

  for (var i = 0; i < splits.length; i++) {
    var sp = splits[i];
    html += '<div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">' +
      '<span style="font-size:.72rem;font-weight:700;color:#0044FF;min-width:48px">' + sp + 'm:</span>' +
      '<div style="display:flex;align-items:center;gap:4px">' +
        '<input type="number" id="wksp-' + idx + '-' + sp + '-m" placeholder="0" min="0" max="59" style="width:44px;padding:6px 4px;border:1.5px solid #DCDCE8;border-radius:6px;font-size:.85rem;font-weight:700;text-align:center;color:#0D0D1A;background:#FFF;outline:none">' +
        '<span style="font-size:.9rem;font-weight:700;color:#9090A8">:</span>' +
        '<input type="number" id="wksp-' + idx + '-' + sp + '-s" placeholder="00" min="0" max="59" style="width:44px;padding:6px 4px;border:1.5px solid #DCDCE8;border-radius:6px;font-size:.85rem;font-weight:700;text-align:center;color:#0D0D1A;background:#FFF;outline:none">' +
        '<span style="font-size:.9rem;font-weight:700;color:#9090A8">,</span>' +
        '<input type="number" id="wksp-' + idx + '-' + sp + '-ms" placeholder="00" min="0" max="99" style="width:44px;padding:6px 4px;border:1.5px solid #DCDCE8;border-radius:6px;font-size:.85rem;font-weight:700;text-align:center;color:#0D0D1A;background:#FFF;outline:none">' +
      '</div>' +
    '</div>';
  }
  html += '</div>';
  container.innerHTML = html;
}

function wkGetSplits(idx, distStr) {
  var splits = wkSplitDists(distStr);
  var result = [];
  for (var i = 0; i < splits.length; i++) {
    var sp = splits[i];
    var m  = wkIntVal('wksp-' + idx + '-' + sp + '-m');
    var s  = wkIntVal('wksp-' + idx + '-' + sp + '-s');
    var ms = wkIntVal('wksp-' + idx + '-' + sp + '-ms');
    var cs = wkToCs(m, s, ms);
    if (cs > 0) {
      result.push({ distance: sp, timeCs: cs, timeMin: m, timeSec: s, timeMs: ms });
    }
  }
  return result;
}

// ── Wettkampf speichern ───────────────────────────────────────────
function saveWettkampf(e) {
  e.preventDefault();

  var btn = null;
  var form = document.getElementById('wkform');
  if (form) {
    var btns = form.getElementsByTagName('button');
    for (var b = 0; b < btns.length; b++) {
      if (btns[b].type === 'submit') { btn = btns[b]; break; }
    }
  }
  if (btn) { btn.disabled = true; btn.textContent = 'Speichern…'; }

  var dateEl   = document.getElementById('wk-date');
  var nameEl   = document.getElementById('wk-name');
  var locEl    = document.getElementById('wk-loc');
  var noteEl   = document.getElementById('wk-note');

  var date   = dateEl   ? (dateEl.value   || '').trim() : '';
  var name   = nameEl   ? (nameEl.value   || '').trim() : '';
  var loc    = locEl    ? (locEl.value    || '').trim() : '';
  var note   = noteEl   ? (noteEl.value   || '').trim() : '';
  var pool   = wkRadioVal('wk-pool',   '25');
  var rating = wkRadioVal('wk-rating', 'gut');

  if (!date || !name) {
    showToast('Bitte Datum und Name ausfüllen.');
    if (btn) { btn.disabled = false; btn.textContent = 'Wettkampf speichern'; }
    return;
  }

  // Collect starts
  var startBlocks = document.getElementById('wk-starts');
  if (!startBlocks) {
    showToast('Fehler: Starts-Container nicht gefunden.');
    if (btn) { btn.disabled = false; btn.textContent = 'Wettkampf speichern'; }
    return;
  }

  var blocks = startBlocks.getElementsByClassName('wk-start-block');
  var startsData = [];

  for (var i = 0; i < blocks.length; i++) {
    var blockId = blocks[i].id; // 'wk-start-block-N'
    var idx = blockId.replace('wk-start-block-', '');

    var distEl   = document.getElementById('wkd-'  + idx);
    var strokeEl = document.getElementById('wk-stroke-'  + idx);
    var minEl    = document.getElementById('wkm-'  + idx);
    var secEl    = document.getElementById('wkse-' + idx);
    var msEl     = document.getElementById('wkms-' + idx);
    var placeEl  = document.getElementById('wkp-'  + idx);

    var dist   = distEl   ? (distEl.value   || '') : '';
    var stroke = strokeEl ? (strokeEl.value || '') : '';
    var min    = minEl    ? (parseInt(minEl.value)  || 0) : 0;
    var sec    = secEl    ? (parseInt(secEl.value)  || 0) : 0;
    var ms     = msEl     ? (parseInt(msEl.value)   || 0) : 0;
    var place  = placeEl  ? (parseInt(placeEl.value) || 0) : 0;

    if (!dist || !stroke) continue;
    var cs = wkToCs(min, sec, ms);
    if (cs === 0) continue;

    var splits = wkGetSplits(idx, dist);
    startsData.push({
      idx: idx, dist: dist, stroke: stroke,
      min: min, sec: sec, ms: ms, cs: cs,
      place: place > 0 ? place : null,
      splits: splits
    });
  }

  // Process async
  wkSaveAsync(date, name, loc, note, pool, rating, startsData, btn);
}

async function wkSaveAsync(date, name, loc, note, pool, rating, startsData, btn) {
  try {
    var pbs = await dbAll('pbs');
    var starts = [];
    var newPBs = [];

    for (var i = 0; i < startsData.length; i++) {
      var sd = startsData[i];
      var pbKey = sd.dist + '|' + sd.stroke + '|' + pool;

      // Find existing PB
      var existing = null;
      for (var j = 0; j < pbs.length; j++) {
        if (pbs[j].key === pbKey) { existing = pbs[j]; break; }
      }

      var existingCs = existing
        ? wkToCs(existing.timeMin, existing.timeSec, existing.timeMs)
        : 999999;
      var isPB = sd.cs < existingCs;

      if (isPB) {
        var improvement = existing ? (existingCs - sd.cs) / 100 : null;
        newPBs.push({
          dist: sd.dist, stroke: sd.stroke, pool: pool,
          min: sd.min, sec: sd.sec, ms: sd.ms,
          improvement: improvement, isFirst: !existing
        });
        var pbEntry = {
          id: existing ? existing.id : genId(),
          key: pbKey,
          distance: sd.dist, stroke: sd.stroke, poolLength: pool,
          timeMin: sd.min, timeSec: sd.sec, timeMs: sd.ms,
          date: date
        };
        await dbPut('pbs', pbEntry);
        // Update local pbs array
        var found = false;
        for (var k = 0; k < pbs.length; k++) {
          if (pbs[k].key === pbKey) { pbs[k] = pbEntry; found = true; break; }
        }
        if (!found) pbs.push(pbEntry);
      }

      starts.push({
        id: genId(),
        distance: sd.dist, stroke: sd.stroke,
        timeMin: sd.min, timeSec: sd.sec, timeMs: sd.ms,
        placement: sd.place, isPB: isPB, splits: sd.splits
      });
    }

    // Points
    var totalPts = 5;
    var ptReasons = [{ reason: 'Wettkampfergebnis eingetragen', pts: 5 }];
    for (var p = 0; p < newPBs.length; p++) {
      totalPts += 15;
      ptReasons.push({ reason: 'Neue persönliche Bestzeit: ' + newPBs[p].dist + ' ' + newPBs[p].stroke, pts: 15 });
    }

    // Save competition
    var compId = genId();
    await dbPut('competitions', {
      id: compId, date: date, name: name, location: loc,
      poolLength: pool, rating: rating, note: note,
      starts: starts, pointsEarned: totalPts
    });
    await logPts(ptReasons, compId, 'competition', date);
    var newBadges = await checkBadges();

    // Reset form
    var startsContainer = document.getElementById('wk-starts');
    if (startsContainer) startsContainer.innerHTML = '';
    WK.startIdx = 0;

    var dateEl = document.getElementById('wk-date');
    if (dateEl) dateEl.value = today();

    var wkformEl = document.getElementById('wkform');
    if (wkformEl) {
      var inputs = wkformEl.getElementsByTagName('input');
      for (var ri = 0; ri < inputs.length; ri++) {
        if (inputs[ri].type === 'text' || inputs[ri].type === 'url') inputs[ri].value = '';
        if (inputs[ri].type === 'number') inputs[ri].value = '';
      }
      var textareas = wkformEl.getElementsByTagName('textarea');
      for (var rt = 0; rt < textareas.length; rt++) textareas[rt].value = '';
    }

    addWkStart();

    // Show result
    if (newPBs.length > 0) {
      var pb = newPBs[0];
      var detailEl = document.getElementById('m-pb-detail');
      var imprEl   = document.getElementById('m-pb-impr');
      var mpbEl    = document.getElementById('m-pb');
      if (detailEl) detailEl.textContent = 'Neuer persönlicher Rekord: ' + pb.dist + ' ' + pb.stroke;
      if (imprEl) {
        if (pb.isFirst) {
          imprEl.textContent = 'Erste Zeit für diese Strecke eingetragen!';
        } else {
          imprEl.textContent = 'Du hast dich um ' + pb.improvement.toFixed(2) + ' Sekunden verbessert.';
        }
      }
      if (mpbEl) mpbEl.classList.remove('hidden');
    } else {
      showSaveModal({ total: totalPts, reasons: ptReasons }, newBadges, 'Wettkampf gespeichert!');
    }

    renderPBs();
    renderWkHist();

  } catch (err) {
    console.error('WK save error:', err);
    showToast('Fehler beim Speichern: ' + (err.message || String(err)));
  } finally {
    if (btn) { btn.disabled = false; btn.textContent = 'Wettkampf speichern'; }
  }
}

// ── Tab-Navigation ────────────────────────────────────────────────
function wkTab(id, btn) {
  var panes = document.querySelectorAll('#page-wettkampf .tabpane');
  for (var i = 0; i < panes.length; i++) panes[i].classList.remove('active');
  var btns = document.querySelectorAll('#page-wettkampf .tabbtn');
  for (var j = 0; j < btns.length; j++) btns[j].classList.remove('active');

  var pane = document.getElementById(id);
  if (pane) pane.classList.add('active');
  if (btn) btn.classList.add('active');

  if (id === 'wk-pbs')     renderPBs();
  if (id === 'wk-hist')    renderWkHist();
  if (id === 'wk-analyse') { if (typeof renderWkAnalyse === 'function') renderWkAnalyse(); }
  if (id === 'wk-prep')    { if (typeof renderWkPrep    === 'function') renderWkPrep(); }
}

// ── Seite initialisieren ──────────────────────────────────────────
function renderWettkampfPage() {
  var dateEl = document.getElementById('wk-date');
  if (dateEl) dateEl.value = today();
  var startsContainer = document.getElementById('wk-starts');
  if (startsContainer && startsContainer.children.length === 0) {
    addWkStart();
  }
  renderPBs();
  renderWkHist();
}


// ── Verlauf anzeigen ──────────────────────────────────────────────
async function renderWkHist() {
  var c = document.getElementById('wk-hist-list');
  if (!c) return;

  var comps = await dbAll('competitions');
  if (!comps.length) {
    c.innerHTML = '<div style="text-align:center;padding:28px 14px;color:#9090A8">' +
      '<div style="font-size:2.2rem;margin-bottom:7px">🏆</div>' +
      '<p style="font-size:.875rem;font-weight:500">Noch keine Wettkämpfe.</p>' +
      '<p style="font-size:.75rem;margin-top:3px">Trage deinen ersten Wettkampf ein!</p>' +
      '</div>';
    return;
  }

  comps.sort(function(a, b) { return b.date.localeCompare(a.date); });

  var ratingMap = { 'sehr gut': '⭐⭐⭐', 'gut': '⭐⭐', 'okay': '⭐', 'schwierig': '💪' };
  var html = '';

  for (var ci = 0; ci < comps.length; ci++) {
    var comp = comps[ci];
    var starts = comp.starts || [];
    var fmtD = typeof fmtDate === 'function' ? fmtDate(comp.date) : (comp.date || '');
    var ratingStr = ratingMap[comp.rating] || '';

    var startsHtml = '';
    if (starts.length === 0) {
      startsHtml = '<div style="font-size:.78rem;color:#9090A8;padding:6px 0;font-style:italic">Keine Starts eingetragen.</div>';
    } else {
      for (var si = 0; si < starts.length; si++) {
        var st = starts[si];
        var timeStr = wkFmt(st.timeMin, st.timeSec, st.timeMs);
        var pbBadge = st.isPB ? '<span style="font-size:.6rem;background:#FFF3E0;color:#FF8F00;padding:2px 6px;border-radius:4px;font-weight:700;margin-left:6px">PB ⭐</span>' : '';
        var placeStr = st.placement ? '<span style="font-size:.7rem;color:#9090A8;margin-left:6px">Platz ' + st.placement + '</span>' : '';

        var splitsHtml = '';
        var spl = st.splits || [];
        if (spl.length > 0) {
          var splParts = [];
          for (var spi = 0; spi < spl.length; spi++) {
            splParts.push(spl[spi].distance + 'm: ' + wkFmt(spl[spi].timeMin || 0, spl[spi].timeSec || 0, spl[spi].timeMs || 0));
          }
          splitsHtml = '<div style="margin-top:4px;font-size:.65rem;color:#9090A8">' + splParts.join(' · ') + '</div>';
        }

        startsHtml +=
          '<div style="display:flex;align-items:flex-start;gap:10px;padding:8px 0;border-bottom:1px solid var(--border,#DCDCE8)">' +
            '<div style="min-width:90px">' +
              '<div style="font-size:.82rem;font-weight:700">' + (st.distance || '') + ' ' + (st.stroke || '') + '</div>' +
              '<div style="font-size:.65rem;color:#9090A8">' + (comp.poolLength || '?') + 'm Bahn</div>' +
            '</div>' +
            '<div style="flex:1">' +
              '<div style="display:flex;align-items:center;flex-wrap:wrap">' +
                '<span style="font-size:1.05rem;font-weight:800;color:#0044FF">' + timeStr + '</span>' +
                pbBadge + placeStr +
              '</div>' +
              splitsHtml +
            '</div>' +
          '</div>';
      }
    }

    html +=
      '<div style="background:var(--card,#FFF);border-radius:16px;padding:14px;margin-bottom:12px;box-shadow:0 1px 3px rgba(0,0,0,.08);border:1px solid var(--border,#DCDCE8)">' +
        '<div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:10px">' +
          '<div style="flex:1">' +
            '<div style="font-size:.95rem;font-weight:800">' + wkEscapeHtml(comp.name || 'Wettkampf') + '</div>' +
            '<div style="font-size:.72rem;color:#9090A8;margin-top:2px">' +
              fmtD +
              (comp.location ? ' · ' + comp.location : '') +
              ' · ' + (comp.poolLength || '?') + 'm' +
              (ratingStr ? ' · ' + ratingStr : '') +
            '</div>' +
          '</div>' +
          '<div style="display:flex;gap:6px;align-items:center;flex-shrink:0">' +
            '<span style="font-size:.72rem;font-weight:700;color:#0044FF">+' + (comp.pointsEarned || 0) + ' Pkt.</span>' +
            '<button onclick="wkDelComp(\'' + comp.id + '\')" style="width:26px;height:26px;border-radius:50%;background:#FFEBEE;color:#F44336;font-size:.75rem;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center">🗑️</button>' +
          '</div>' +
        '</div>' +
        '<div>' + startsHtml + '</div>' +
        (comp.note ? '<div style="margin-top:8px;font-size:.75rem;color:#9090A8;font-style:italic;padding-top:6px;border-top:1px solid var(--border,#DCDCE8)">' + wkEscapeHtml(comp.note) + '</div>' : '') +
      '</div>';
  }

  c.innerHTML = html;
}

// ── Wettkampf löschen ─────────────────────────────────────────────
function wkDelComp(id) {
  showConfirm(
    'Wettkampf löschen?',
    'Dieser Wettkampf und die damit verbundenen Punkte werden entfernt.',
    function() { wkDelCompAsync(id); }
  );
}

async function wkDelCompAsync(id) {
  try {
    var log = await dbAll('points_log');
    var oldPts = 0;
    for (var i = 0; i < log.length; i++) {
      if (log[i].entryId === id) oldPts += log[i].points;
    }
    if (oldPts !== 0) {
      await dbPut('points_log', {
        id: genId(), date: today(),
        reason: 'Wettkampf gelöscht', points: -oldPts,
        entryId: id, entryType: 'deletion'
      });
    }
    await dbDel('competitions', id);
    closeModal('m-confirm');
    showToast('Wettkampf gelöscht.');
    renderPBs();
    renderWkHist();
  } catch (err) {
    showToast('Fehler: ' + (err.message || String(err)));
  }
}
// ══════════════════════════════════════════════════════════════════

// ============================================================================
// WETTKAMPF FIX v3 - Validierung, Split-PBs, PB-Neuberechnung, sichere Ausgabe
// ============================================================================
function wkEscapeHtml(value) {
  return String(value == null ? '' : value)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}





function wkPbKey(distance, stroke, pool) {
  return String(distance) + '|' + String(stroke) + '|' + String(pool);
}

function wkFindPB(pbs, key) {
  for (var i=0; i<pbs.length; i++) if (pbs[i].key === key) return pbs[i];
  return null;
}

async function wkRebuildPBs() {
  var comps = await dbAll('competitions');
  var best = {};
  for (var ci=0; ci<comps.length; ci++) {
    var comp = comps[ci] || {};
    var pool = String(comp.poolLength || '25');
    var starts = Array.isArray(comp.starts) ? comp.starts : [];
    for (var si=0; si<starts.length; si++) {
      var st = starts[si] || {};
      var stroke = st.stroke || '';
      var dist = st.distance || '';
      var finishCs = wkToCs(st.timeMin, st.timeSec, st.timeMs);
      if (stroke && dist && finishCs > 0) wkTakeBest(best, dist, stroke, pool, finishCs, comp.date, 'finish');
      var splits = Array.isArray(st.splits) ? st.splits : [];
      for (var pi=0; pi<splits.length; pi++) {
        var sp = splits[pi] || {};
        var splitCs = parseInt(sp.timeCs,10) || wkToCs(sp.timeMin,sp.timeSec,sp.timeMs);
        if (stroke && sp.distance && splitCs > 0) wkTakeBest(best, sp.distance + ' m', stroke, pool, splitCs, comp.date, 'split');
      }
    }
  }
  await dbClear('pbs');
  var keys = Object.keys(best);
  for (var k=0; k<keys.length; k++) await dbPut('pbs', best[keys[k]]);
  return keys.length;
}

function wkTakeBest(best, distance, stroke, pool, cs, date, sourceType) {
  var key = wkPbKey(distance, stroke, pool);
  if (!best[key] || cs < best[key]._cs) {
    var t = wkCsToParts(cs);
    best[key] = { id:key, key:key, distance:String(distance), stroke:stroke,
      poolLength:String(pool), timeMin:t.timeMin, timeSec:t.timeSec,
      timeMs:t.timeMs, date:date || '', sourceType:sourceType || 'finish', _cs:cs };
  }
}

function wkCollectValidatedStarts() {
  var wrap = document.getElementById('wk-starts');
  if (!wrap) throw new Error('Starts-Container nicht gefunden.');
  var blocks = wrap.getElementsByClassName('wk-start-block');
  var result = [];
  for (var i=0; i<blocks.length; i++) {
    var idx = blocks[i].id.replace('wk-start-block-', '');
    var distEl=document.getElementById('wkd-'+idx);
    var strokeEl=document.getElementById('wk-stroke-'+idx);
    var minEl=document.getElementById('wkm-'+idx);
    var secEl=document.getElementById('wkse-'+idx);
    var hsEl=document.getElementById('wkms-'+idx);
    var placeEl=document.getElementById('wkp-'+idx);
    var dist=distEl ? String(distEl.value || '') : '';
    var stroke=strokeEl ? String(strokeEl.value || '') : '';
    var min=minEl ? (parseInt(minEl.value,10)||0) : 0;
    var sec=secEl ? (parseInt(secEl.value,10)||0) : 0;
    var hs=hsEl ? (parseInt(hsEl.value,10)||0) : 0;
    var placeRaw=placeEl ? String(placeEl.value || '').trim() : '';
    if (!dist && !stroke && !min && !sec && !hs && !placeRaw) continue;
    if (!dist || !stroke) throw new Error('Bei Start '+(i+1)+' fehlen Strecke oder Lage.');
    if (!wkValidClock(min,sec,hs)) throw new Error('Ungültige Zeit bei Start '+(i+1)+'. Sekunden 0–59, Hundertstel 0–99.');
    var cs=wkToCs(min,sec,hs);
    if (cs<=0) throw new Error('Bitte bei Start '+(i+1)+' eine gültige Zeit eintragen.');
    var place=placeRaw ? parseInt(placeRaw,10) : null;
    if (placeRaw && (!Number.isInteger(place) || place<1)) throw new Error('Die Platzierung bei Start '+(i+1)+' muss mindestens 1 sein.');
    var splits=wkGetSplits(idx,dist);
    var prev=0;
    for (var j=0; j<splits.length; j++) {
      if (!wkValidClock(splits[j].timeMin,splits[j].timeSec,splits[j].timeMs)) throw new Error('Ungültige Zwischenzeit bei Start '+(i+1)+'.');
      if (splits[j].timeCs<=prev) throw new Error('Zwischenzeiten bei Start '+(i+1)+' müssen streng ansteigen.');
      if (splits[j].timeCs>=cs) throw new Error('Zwischenzeiten bei Start '+(i+1)+' müssen unter der Endzeit liegen.');
      prev=splits[j].timeCs;
    }
    result.push({idx:idx,dist:dist,stroke:stroke,min:min,sec:sec,ms:hs,cs:cs,place:place,splits:splits});
  }
  if (!result.length) throw new Error('Bitte mindestens einen Start mit gültiger Zeit eintragen.');
  return result;
}

async function saveWettkampf(e) {
  if (e && e.preventDefault) e.preventDefault();
  if (WK.saving) return;
  WK.saving=true;
  var form=document.getElementById('wkform');
  var btn=form ? form.querySelector('button[type="submit"]') : null;
  if (btn) { btn.disabled=true; btn.textContent='Speichern…'; }
  try {
    var dateEl=document.getElementById('wk-date');
    var nameEl=document.getElementById('wk-name');
    var locEl=document.getElementById('wk-loc');
    var noteEl=document.getElementById('wk-note');
    var date=dateEl ? String(dateEl.value||'').trim() : '';
    var name=nameEl ? String(nameEl.value||'').trim() : '';
    var loc=locEl ? String(locEl.value||'').trim() : '';
    var note=noteEl ? String(noteEl.value||'').trim() : '';
    var pool=wkRadioVal('wk-pool','25');
    var rating=wkRadioVal('wk-rating','gut');
    if (!date || !name) throw new Error('Bitte Datum und Name ausfüllen.');
    var data=wkCollectValidatedStarts();
    var pbs=await dbAll('pbs');
    var newPBs=[];
    var starts=[];

    async function registerPB(distance, stroke, cs, sourceType) {
      var key=wkPbKey(distance,stroke,pool);
      var existing=wkFindPB(pbs,key);
      var existingCs=existing ? wkToCs(existing.timeMin,existing.timeSec,existing.timeMs) : Infinity;
      if (cs>=existingCs) return false;
      var t=wkCsToParts(cs);
      var pb={id:existing ? existing.id : genId(),key:key,distance:String(distance),stroke:stroke,
        poolLength:String(pool),timeMin:t.timeMin,timeSec:t.timeSec,timeMs:t.timeMs,date:date,sourceType:sourceType};
      await dbPut('pbs',pb);
      if (existing) pbs[pbs.indexOf(existing)]=pb; else pbs.push(pb);
      newPBs.push({dist:String(distance),stroke:stroke,improvement:existing?(existingCs-cs)/100:null,isFirst:!existing,sourceType:sourceType});
      return true;
    }

    for (var i=0;i<data.length;i++) {
      var d=data[i];
      var finishPB=await registerPB(d.dist,d.stroke,d.cs,'finish');
      var splitResults=[];
      for (var j=0;j<d.splits.length;j++) {
        var sp=d.splits[j];
        var splitPB=await registerPB(sp.distance+' m',d.stroke,sp.timeCs,'split');
        splitResults.push({distance:sp.distance,timeCs:sp.timeCs,timeMin:sp.timeMin,timeSec:sp.timeSec,timeMs:sp.timeMs,wasPBAtEntry:splitPB,isPB:splitPB});
      }
      starts.push({id:genId(),distance:d.dist,stroke:d.stroke,timeMin:d.min,timeSec:d.sec,timeMs:d.ms,
        timeCs:d.cs,placement:d.place,wasPBAtEntry:finishPB,isPB:finishPB,splits:splitResults});
    }

    var totalPts=5+newPBs.length*15;
    var reasons=[{reason:'Wettkampfergebnis eingetragen',pts:5}];
    for (var r=0;r<newPBs.length;r++) reasons.push({reason:'Neue persönliche Bestzeit: '+newPBs[r].dist+' '+newPBs[r].stroke,pts:15});
    var compId=genId();
    await dbPut('competitions',{id:compId,date:date,name:name,location:loc,poolLength:pool,rating:rating,note:note,starts:starts,pointsEarned:totalPts});
    await logPts(reasons,compId,'competition',date);
    var newBadges=await checkBadges();

    if (form) form.reset();
    var wrap=document.getElementById('wk-starts'); if (wrap) wrap.innerHTML='';
    WK.startIdx=0; addWkStart();
    var newDate=document.getElementById('wk-date'); if (newDate) newDate.value=today();

    if (newPBs.length) {
      var first=newPBs[0], detail=document.getElementById('m-pb-detail'), impr=document.getElementById('m-pb-impr'), modal=document.getElementById('m-pb');
      if (detail) detail.textContent=(first.sourceType==='split'?'Neue Zwischenzeit-Bestzeit: ':'Neuer persönlicher Rekord: ')+first.dist+' '+first.stroke;
      if (impr) impr.textContent=first.isFirst?'Erste Zeit für diese Strecke eingetragen!':'Du hast dich um '+first.improvement.toFixed(2)+' Sekunden verbessert.';
      if (modal) modal.classList.remove('hidden');
    } else showSaveModal({total:totalPts,reasons:reasons},newBadges,'Wettkampf gespeichert!');
    await renderPBs(); await renderWkHist();
  } catch(err) {
    console.error('WK v3 save error:',err);
    showToast(err.message || String(err));
  } finally {
    WK.saving=false;
    if (btn) { btn.disabled=false; btn.textContent='Wettkampf speichern'; }
  }
}

async function wkDelCompAsync(id) {
  try {
    var log=await dbAll('points_log'), oldPts=0;
    for (var i=0;i<log.length;i++) if (log[i].entryId===id) oldPts+=Number(log[i].points)||0;
    if (oldPts!==0) await dbPut('points_log',{id:genId(),date:today(),reason:'Wettkampf gelöscht',points:-oldPts,entryId:id,entryType:'deletion'});
    await dbDel('competitions',id);
    await wkRebuildPBs();
    closeModal('m-confirm'); showToast('Wettkampf gelöscht. Bestzeiten wurden neu berechnet.');
    await renderPBs(); await renderWkHist();
  } catch(err) { showToast('Fehler: '+(err.message||String(err))); }
}


