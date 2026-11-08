'use strict';
// SwimTrack Stage 5 - Wettkampfvorbereitung.
// ══════════════════════════════════════════════════════════════════
// WETTKAMPF-VORBEREITUNG v3
// - Countdown-Timer für Aufwärmphasen
// - Kindgerechte Sprache (10 Jahre)
// - Kein Einschw. im Wasser (Trainer übernimmt)
// - DQ-Warnungen visuell stark hervorgehoben
// - Strecken/Lagen-Auswahl eigenständig
// ══════════════════════════════════════════════════════════════════
'use strict';

// ── Timer-State ───────────────────────────────────────────────────
var WK_TIMER = {
  interval: null,
  remaining: 0,
  phaseIdx: 0,
  exIdx: 0,
  running: false,
  paused: false
};

// ── Aufwärm-Phasen (kindgerecht, knieschonend, ohne Einschwimmen) ─
var WK_WARMUP_PHASEN = [
  {
    name: 'Phase 1: Aufwachen & Locker machen',
    icon: '🔥',
    color: '#0044FF',
    totalSec: 120,
    uebungen: [
      { name: 'Arm-Kreisen', sec: 30, icon: '💪', anleitung: 'Strecke beide Arme aus und kreise sie – erst vorwärts, dann rückwärts. Schön groß und locker!' },
      { name: 'Schultern rollen', sec: 20, icon: '🔄', anleitung: 'Rolle deine Schultern langsam nach hinten – 10 Mal. Dann nach vorne – 10 Mal.' },
      { name: 'Hüfte kreisen', sec: 20, icon: '🌀', anleitung: 'Hände auf die Hüfte, Beine schulterbreit. Kreise mit der Hüfte – wie ein Hula-Hoop!' },
      { name: 'Oberkörper drehen', sec: 30, icon: '↔️', anleitung: 'Arme ausstrecken, Oberkörper langsam nach links und rechts drehen. Knie bleiben gerade.' }
    ]
  },
  {
    name: 'Phase 2: Knie schonen & Muskeln wecken',
    icon: '💙',
    color: '#00C853',
    totalSec: 120,
    uebungen: [
      { name: 'Gesäßbrücke', sec: 40, icon: '🌉', anleitung: 'Leg dich auf den Rücken, Knie angewinkelt. Hebe dein Gesäß hoch und halte kurz. 15 Mal wiederholen. Kein Stress für die Knie!' },
      { name: 'Muschel (Clamshell)', sec: 40, icon: '🦪', anleitung: 'Leg dich auf die Seite, Knie leicht gebeugt. Hebe das obere Knie zur Decke – wie eine Muschel die sich öffnet. 10 Mal je Seite.' },
      { name: 'Fußkreisen', sec: 20, icon: '🦶', anleitung: 'Sitz hin und kreise deinen Fuß – erst rechts, dann links. Das wärmt die Sprunggelenke auf!' },
      { name: 'Frosch-Dehnung', sec: 20, icon: '🐸', anleitung: 'Knie weit auseinander, langsam nach hinten setzen. Tief einatmen und entspannen.' }
    ]
  },
  {
    name: 'Phase 3: Schwimm-Modus an!',
    icon: '🏊',
    color: '#FF8F00',
    totalSec: 90,
    uebungen: [
      { name: 'Streamline üben', sec: 30, icon: '🚀', anleitung: 'Strecke dich so lang wie möglich – Arme über den Kopf, Hände übereinander. Halte 3 Sekunden. 5 Mal wiederholen. So liegst du im Wasser!' },
      { name: 'Schulter dehnen', sec: 30, icon: '🤸', anleitung: 'Ziehe einen Arm über die Brust und halte ihn mit dem anderen Arm fest. 15 Sekunden halten, dann Seite wechseln.' },
      { name: 'Rennen vorstellen', sec: 30, icon: '🧠', anleitung: 'Schließe die Augen. Stell dir vor, wie du ins Wasser springst, schwimmst und anschlägst. Alles perfekt! Das nennt man Visualisierung.' }
    ]
  }
];

// ── Technikkriterien (World Aquatics Regeln 2024/2025) ───────────
// Quelle: World Aquatics Swimming Reference Card, gültig ab 13.12.2024
var WK_TECHNIK = {
  'Freistil': {
    icon: '🏊',
    dq_risiken: [
      'Du musst die Wand bei jeder Wende und am Ziel berühren!',
      'Nach Start und Wende musst du vor der 15m-Markierung auftauchen',
      'Du darfst beim Schwimmen nicht komplett unter Wasser bleiben'
    ],
    start: [
      'Kraftvoll abspringen und Körper ganz strecken',
      'Sauber ins Wasser eintauchen – wenig Spritzer',
      'Sofort Streamline: Arme über den Kopf, Hände übereinander',
      'Mindestens 4 Delphinkicks unter Wasser',
      'Vor der 15m-Marke auftauchen – sonst DQ!'
    ],
    technik: [
      'Beine kräftig schlagen – Zehenspitzen durchbrechen die Wasseroberfläche',
      'Alle 3 Züge zur Seite atmen (3er-Atmung)',
      'Der Ellenbogen ist der höchste Punkt über Wasser – nicht die Hand!',
      'Arm weit nach vorne strecken und bis zum Oberschenkel durchziehen',
      'Körper leicht drehen – das macht den Zug stärker'
    ],
    wende: [
      'Wand berühren (mit irgendeinem Körperteil)',
      'Schnelle, kleine Rolle an der Wand',
      'Kräftig abstoßen in Streamline',
      'Vor der 15m-Marke auftauchen'
    ],
    tipps: [
      'Beim Sprint (50m): Alles geben von Anfang an!',
      'Bei 100m: Erste 50m kontrolliert, zweite 50m alles geben',
      'Gute Wende kann bis zu 1 Sekunde einsparen – üben lohnt sich!'
    ]
  },
  'Rücken': {
    icon: '🔄',
    dq_risiken: [
      'Du musst die ganze Zeit auf dem Rücken schwimmen – auf den Bauch drehen gibt sofort DQ!',
      'Nach Start und Wende musst du vor der 15m-Markierung auftauchen',
      'Du musst die Wand bei der Wende berühren',
      'Du musst das Rennen auf dem Rücken beenden'
    ],
    start: [
      'Griff am Startblock, Füße an der Wand',
      'Kräftig abwerfen und Körper strecken',
      'Rückwärts ins Wasser eintauchen',
      'Sofort Streamline und Delphinkicks',
      'Vor der 15m-Marke auftauchen'
    ],
    technik: [
      'Beine kräftig schlagen – Zehenspitzen durchbrechen die Wasseroberfläche',
      'Kopf ruhig halten – Nasenspitze zeigt zur Decke',
      'Kleiner Finger taucht zuerst ins Wasser ein',
      'Hand bleibt beim Abdruck unter Wasser',
      'Schulter kommt über Wasser wenn der Arm zurückgeführt wird'
    ],
    wende: [
      '5m-Fahne beachten: Noch 5m bis zur Wand!',
      'Züge zählen nach der Fahne – nicht umdrehen!',
      'Rollwende: Auf die Brust drehen, sofort Rolle, Abstoß auf dem Rücken',
      'Wand berühren während der Wende',
      'Vor der 15m-Marke auftauchen'
    ],
    tipps: [
      'Die 5m-Fahne zeigt dir: Noch 5m bis zur Wand!',
      'Züge zählen nach der Fahne – so weißt du wann du wendest',
      'Kopf ruhig halten macht dich schneller!'
    ]
  },
  'Brust': {
    icon: '🐸',
    dq_risiken: [
      'Anschlag: Immer BEIDE Hände gleichzeitig an die Wand – eine Hand allein gibt DQ!',
      'Arme und Beine müssen immer gleichzeitig bewegt werden – nicht abwechselnd!',
      'Nach Start und Wende: Nur EIN Delphinkick erlaubt – danach normaler Brustkick!',
      'Füße beim Beinschlag nach außen drehen (Froschfüße) – sonst DQ!'
    ],
    start: [
      'Kraftvoll abspringen',
      'Sauber eintauchen',
      'Einen vollständigen Brustzug unter Wasser (Tauchzug)',
      'Dann auftauchen und normal schwimmen',
      'Vor der 15m-Marke auftauchen'
    ],
    technik: [
      'Nach jedem Zug kurz gleiten – das ist wichtig bei Brust!',
      'Arme und Beine gleichzeitig und symmetrisch bewegen',
      'Hände gleichzeitig von der Brust nach vorne führen',
      'Ellenbogen bleiben unter Wasser beim Armzug',
      'Füße beim Beinschlag nach außen drehen (Froschfüße)',
      'Rhythmus: Arme ziehen → Beine anziehen → Strecken → Gleiten'
    ],
    wende: [
      'Beide Hände gleichzeitig an die Wand – das Wichtigste überhaupt!',
      'Schnell drehen',
      'Kräftig abstoßen in Streamline',
      'Tauchzug + vor der 15m-Marke auftauchen'
    ],
    tipps: [
      'Die Gleitphase macht Brust besonders – nicht weglassen!',
      'Beide Hände gleichzeitig anschlagen – immer üben!'
    ]
  },
  'Schmetterling': {
    icon: '🦋',
    dq_risiken: [
      'Anschlag: Immer BEIDE Hände gleichzeitig an die Wand – eine Hand allein gibt DQ!',
      'Arme und Beine müssen immer gleichzeitig bewegt werden – nicht abwechselnd!',
      'Nach Start und Wende vor der 15m-Markierung auftauchen'
    ],
    start: [
      'Kraftvoll abspringen',
      'Sauber eintauchen',
      'Sofort Streamline und Delphinkicks',
      'Vor der 15m-Marke auftauchen'
    ],
    technik: [
      '2 Beinschläge pro Armzug – Zehenspitzen durchbrechen die Wasseroberfläche',
      'Arme gleichzeitig über Wasser nach vorne schwingen',
      'Alle 2 Züge atmen (2er-Atmung)',
      'Körper macht eine Wellenbewegung (beginnt in der Hüfte)',
      'Beim Atmen kommt nur der Kopf raus – Brust bleibt im Wasser'
    ],
    wende: [
      'Beide Hände gleichzeitig an die Wand – sehr wichtig!',
      'Schnell drehen',
      'Kräftig abstoßen in Streamline',
      'Vor der 15m-Marke auftauchen'
    ],
    tipps: [
      'Die Wellenbewegung beginnt in der Hüfte – nicht in den Schultern',
      'Beide Hände gleichzeitig anschlagen – immer!'
    ]
  },
  'Lagen': {
    icon: '🔀',
    dq_risiken: [
      'Falsche Reihenfolge gibt sofort DQ! Merke: Schmetterling → Rücken → Brust → Freistil',
      'Rücken→Brust-Wende: Wenn du dich auf die Brust drehst, SOFORT wenden – nicht weiterschwimmen!',
      'Schmetterling- und Brust-Teil: Immer BEIDE Hände gleichzeitig anschlagen!',
      'Im Freistil-Teil darfst du nicht Schmetterling, Rücken oder Brust schwimmen'
    ],
    start: [
      'Reihenfolge merken: Schmetterling → Rücken → Brust → Freistil',
      'Start wie Schmetterling: Kraftvoll, Streamline, Delphinkicks'
    ],
    technik: [
      'Schmetterling: 2 Beinschläge, Wellenbewegung, 2er-Atmung',
      'Rücken: Kopf ruhig, Schulterrotation, kleiner Finger zuerst',
      'Brust: Gleiten, gleichzeitige Arm- und Beinbewegung, gleichzeitiger Anschlag',
      'Freistil: Kräftiger Beinschlag, 3er-Atmung, langer Abdruck'
    ],
    wende: [
      'Schmetterling→Rücken: Beide Hände gleichzeitig → Rücken-Wende',
      'Rücken→Brust: Auf die Brust drehen → SOFORT Wende einleiten → seitliche Rolle → Abstoß',
      '🚨 Rücken→Brust: Auf die Brust drehen und NICHT sofort wenden = DQ!',
      'Brust→Freistil: Beide Hände gleichzeitig → Kraulwende'
    ],
    tipps: [
      'Die Rücken→Brust-Wende ist die schwierigste – viel üben!',
      'Reihenfolge immer im Kopf behalten: Schmetterling, Rücken, Brust, Freistil'
    ]
  }
};


// ── Strecken-Tipps ────────────────────────────────────────────────
var WK_STRECKEN = {
  '50 m':   { emoji:'⚡', pacing:'Alles geben von Anfang an!', tipps:['Start und Tauchphase sind super wichtig – hier gewinnst du Zeit','Atme so wenig wie möglich – das bremst dich','Maximale Geschwindigkeit von Anfang bis Ende','Gute Tauchphase: 7,5–10 m unter Wasser'] },
  '100 m':  { emoji:'🔥', pacing:'Erste 50m kontrolliert schnell, zweite 50m alles geben', tipps:['Nicht zu schnell starten – sonst bist du am Ende kaputt','Die Wende ist sehr wichtig – übe sie viel!','Zweite 50m: Technik beibehalten auch wenn du müde wirst','Atemrhythmus beibehalten'] },
  '200 m':  { emoji:'💪', pacing:'Gleichmäßig schwimmen – alle 50m ähnlich schnell', tipps:['Teile das Rennen in 4×50m auf','Erste 50m: Ruhig starten','Zweite Hälfte leicht schneller als erste (Negative Split)','Technik bei Müdigkeit aufrechterhalten'] },
  '400 m':  { emoji:'🏃', pacing:'Gleichmäßig schwimmen, letzte 50m Spurt', tipps:['Teile das Rennen in 4×100m auf','Erste 100m: Sehr ruhig starten','Regelmäßig atmen – das ist bei langen Strecken wichtig','Letzte 50m: Alles geben!'] },
  '800 m':  { emoji:'🌊', pacing:'Gleichmäßig schwimmen, letzte 100m Spurt', tipps:['Teile das Rennen in 8×100m auf','Sehr ruhig starten – du hast noch viel vor dir','Effizienz ist wichtiger als Geschwindigkeit','Letzte 100m: Alles geben!'] },
  '1500 m': { emoji:'🏆', pacing:'Gleichmäßig schwimmen, letzte 100m Spurt', tipps:['Teile das Rennen in Abschnitte auf','Sehr ruhig starten','Langer, effizienter Zug spart Energie','Letzte 100m: Alles geben!'] }
};

// ── Hauptfunktion ─────────────────────────────────────────────────
function renderWkPrep() {
  var container = document.getElementById('wk-prep-content');
  if (!container) return;

  var selStrecke = localStorage.getItem('wk_prep_strecke') || '';
  var selLage    = localStorage.getItem('wk_prep_lage')    || '';

  var strecken = ['50 m','100 m','200 m','400 m','800 m','1500 m'];
  var lagen    = ['Freistil','Rücken','Brust','Schmetterling','Lagen'];
  var lagenIcons = {'Freistil':'🏊','Rücken':'🔄','Brust':'🐸','Schmetterling':'🦋','Lagen':'🔀'};

  var html = '';

  // ── Auswahl ──
  html += '<div style="background:var(--hero);border-radius:18px;padding:16px;margin-bottom:16px;color:#fff">' +
    '<div style="font-size:.9rem;font-weight:800;margin-bottom:12px">🎯 Was schwimmst du heute?</div>' +
    '<div style="margin-bottom:12px">' +
      '<div style="font-size:.72rem;font-weight:700;opacity:.8;margin-bottom:6px;text-transform:uppercase;letter-spacing:.5px">Strecke</div>' +
      '<div style="display:flex;flex-wrap:wrap;gap:6px">' +
        strecken.map(function(s){
          var a = s===selStrecke;
          return '<button onclick="wkPrepSelect(\'strecke\',\''+s+'\')" style="padding:7px 13px;border-radius:999px;border:1.5px solid '+(a?'#fff':'rgba(255,255,255,.35)')+';background:'+(a?'#fff':'rgba(255,255,255,.12)')+';color:'+(a?'#0033CC':'#fff')+';font-size:.78rem;font-weight:700;cursor:pointer">'+s+'</button>';
        }).join('') +
      '</div>' +
    '</div>' +
    '<div>' +
      '<div style="font-size:.72rem;font-weight:700;opacity:.8;margin-bottom:6px;text-transform:uppercase;letter-spacing:.5px">Lage</div>' +
      '<div style="display:flex;flex-wrap:wrap;gap:6px">' +
        lagen.map(function(l){
          var a = l===selLage;
          return '<button onclick="wkPrepSelect(\'lage\',\''+l+'\')" style="padding:7px 13px;border-radius:999px;border:1.5px solid '+(a?'#fff':'rgba(255,255,255,.35)')+';background:'+(a?'#fff':'rgba(255,255,255,.12)')+';color:'+(a?'#0033CC':'#fff')+';font-size:.78rem;font-weight:700;cursor:pointer">'+(lagenIcons[l]||'')+' '+l+'</button>';
        }).join('') +
      '</div>' +
    '</div>' +
  '</div>';

  // ── Aufwärmen mit Timer ──
  html += '<div style="margin-bottom:16px">' +
    '<div style="font-size:.9rem;font-weight:800;margin-bottom:4px">🔥 Aufwärmen – kurz vor dem Start</div>' +
    '<div style="font-size:.75rem;color:var(--tm);margin-bottom:10px">Mach das direkt bevor du an den Startblock gehst – ca. 5 Minuten</div>' +
    '<div style="background:rgba(0,68,255,.08);border:1.5px solid rgba(0,68,255,.2);border-radius:12px;padding:10px 12px;margin-bottom:12px;font-size:.78rem;color:var(--blue,#0044FF);font-weight:600">' +
      '💙 Knie-Hinweis: Keine Sprünge, kein Laufen, keine Kniebeugen. Alle Übungen sind knieschonend!' +
    '</div>';

  // Timer-Anzeige
  html += '<div id="wk-timer-display" style="background:var(--card);border-radius:16px;padding:16px;margin-bottom:12px;box-shadow:var(--sh);border:1px solid var(--border);text-align:center;display:none">' +
    '<div id="wk-timer-phase" style="font-size:.78rem;font-weight:700;color:var(--tm);margin-bottom:4px">Phase 1</div>' +
    '<div id="wk-timer-ex" style="font-size:1rem;font-weight:800;margin-bottom:8px">Übung</div>' +
    '<div id="wk-timer-anleitung" style="font-size:.78rem;color:var(--t2);margin-bottom:12px;line-height:1.5"></div>' +
    '<div style="position:relative;width:100px;height:100px;margin:0 auto 12px">' +
      '<svg viewBox="0 0 100 100" style="width:100px;height:100px;transform:rotate(-90deg)">' +
        '<circle cx="50" cy="50" r="44" fill="none" stroke="var(--subtle)" stroke-width="8"/>' +
        '<circle id="wk-timer-ring" cx="50" cy="50" r="44" fill="none" stroke="#0044FF" stroke-width="8" stroke-linecap="round" stroke-dasharray="276.5" stroke-dashoffset="0"/>' +
      '</svg>' +
      '<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:1.8rem;font-weight:900;color:var(--t1)" id="wk-timer-secs">30</div>' +
    '</div>' +
    '<div style="display:flex;gap:8px;justify-content:center">' +
      '<button id="wk-timer-pause-btn" onclick="wkTimerPause()" style="padding:9px 18px;border-radius:999px;background:var(--subtle);color:var(--t1);font-size:.83rem;font-weight:700;border:1.5px solid var(--border);cursor:pointer">⏸ Pause</button>' +
      '<button onclick="wkTimerSkip()" style="padding:9px 18px;border-radius:999px;background:var(--subtle);color:var(--t1);font-size:.83rem;font-weight:700;border:1.5px solid var(--border);cursor:pointer">⏭ Überspringen</button>' +
      '<button onclick="wkTimerStop()" style="padding:9px 18px;border-radius:999px;background:var(--red-l,#FFEBEE);color:var(--red,#F44336);font-size:.83rem;font-weight:700;border:none;cursor:pointer">✕ Stop</button>' +
    '</div>' +
  '</div>';

  // Start-Button
  html += '<button id="wk-timer-start-btn" onclick="wkTimerStart()" style="width:100%;padding:14px;border-radius:16px;background:linear-gradient(135deg,#0044FF,#0033CC);color:#fff;font-size:.95rem;font-weight:800;border:none;cursor:pointer;box-shadow:0 4px 12px rgba(0,68,255,.3);margin-bottom:12px">▶ Aufwärmen starten (5 Min)</button>';

  // Phasen-Übersicht
  WK_WARMUP_PHASEN.forEach(function(phase, pi) {
    html += '<div style="background:var(--subtle);border-radius:12px;padding:12px;margin-bottom:8px;border-left:3px solid '+phase.color+'">' +
      '<div style="font-size:.82rem;font-weight:700;margin-bottom:8px">'+phase.icon+' '+phase.name+'</div>';
    phase.uebungen.forEach(function(ue) {
      html += '<div style="display:flex;align-items:flex-start;gap:8px;padding:5px 0;border-bottom:1px solid var(--border)">' +
        '<span style="font-size:1rem;flex-shrink:0">'+ue.icon+'</span>' +
        '<div style="flex:1"><div style="font-size:.78rem;font-weight:700">'+ue.name+'</div><div style="font-size:.7rem;color:var(--tm);margin-top:1px">'+ue.anleitung+'</div></div>' +
        '<div style="font-size:.72rem;font-weight:700;color:'+phase.color+';white-space:nowrap;flex-shrink:0">'+ue.sec+' Sek</div>' +
      '</div>';
    });
    html += '</div>';
  });
  html += '</div>';

  // ── DQ-Warnungen (wenn Lage gewählt) ──
  if (selLage && WK_TECHNIK[selLage] && WK_TECHNIK[selLage].dq_risiken.length > 0) {
    var dqs = WK_TECHNIK[selLage].dq_risiken;
    html += '<div style="background:#FF0000;border-radius:14px;padding:14px;margin-bottom:16px;color:#fff">' +
      '<div style="display:flex;align-items:center;gap:8px;margin-bottom:10px">' +
        '<span style="font-size:1.4rem">🚨</span>' +
        '<div style="font-size:.9rem;font-weight:900">DISQUALIFIKATIONS-RISIKEN: '+selLage+'</div>' +
      '</div>' +
      '<div style="font-size:.72rem;opacity:.9;margin-bottom:10px">Diese Fehler führen sofort zur Disqualifikation – merke sie dir gut!</div>';
    dqs.forEach(function(dq) {
      var isKnie = dq.indexOf('KNIE') >= 0;
      var isDQ   = dq.indexOf('DISQUALIFIKATION') >= 0;
      html += '<div style="display:flex;align-items:flex-start;gap:8px;padding:7px 10px;background:rgba(255,255,255,'+(isKnie?'.15':'.2')+';border-radius:8px;margin-bottom:6px">' +
        '<span style="font-size:1rem;flex-shrink:0">'+(isKnie?'💙':'⛔')+'</span>' +
        '<div style="font-size:.78rem;font-weight:'+(isDQ?'700':'600')+'">' + dq.replace('⚠️ DISQUALIFIKATION: ','').replace('⚠️ KNIE-HINWEIS: ','') + '</div>' +
      '</div>';
    });
    html += '</div>';
  }

  // ── Technikkriterien ──
  if (selLage && WK_TECHNIK[selLage]) {
    var t = WK_TECHNIK[selLage];
    html += '<div style="margin-bottom:16px">' +
      '<div style="font-size:.9rem;font-weight:800;margin-bottom:4px">'+t.icon+' Technik-Checkliste: '+selLage+'</div>' +
      '<div style="font-size:.72rem;color:var(--tm);margin-bottom:10px">Das musst du beim Schwimmen beachten</div>';

    // Start
    html += '<div style="background:var(--subtle);border-radius:12px;padding:12px;margin-bottom:8px">' +
      '<div style="font-size:.78rem;font-weight:700;color:#0044FF;margin-bottom:7px">🚀 Start & Tauchphase</div>';
    t.start.forEach(function(k,i){
      html += '<div style="display:flex;align-items:flex-start;gap:8px;padding:5px 0;border-bottom:1px solid var(--border)">' +
        '<div style="width:18px;height:18px;border-radius:50%;background:#0044FF;color:#fff;font-size:.6rem;font-weight:800;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:1px">'+(i+1)+'</div>' +
        '<div style="font-size:.78rem">'+k+'</div></div>';
    });
    html += '</div>';

    // Technik
    html += '<div style="background:var(--subtle);border-radius:12px;padding:12px;margin-bottom:8px">' +
      '<div style="font-size:.78rem;font-weight:700;color:#0044FF;margin-bottom:7px">🏊 Schwimmtechnik</div>';
    t.technik.forEach(function(k,i){
      html += '<div style="display:flex;align-items:flex-start;gap:8px;padding:5px 0;border-bottom:1px solid var(--border)">' +
        '<div style="width:18px;height:18px;border-radius:50%;background:#0044FF;color:#fff;font-size:.6rem;font-weight:800;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:1px">'+(i+1)+'</div>' +
        '<div style="font-size:.78rem">'+k+'</div></div>';
    });
    html += '</div>';

    // Wende
    html += '<div style="background:var(--subtle);border-radius:12px;padding:12px;margin-bottom:8px">' +
      '<div style="font-size:.78rem;font-weight:700;color:#0044FF;margin-bottom:7px">🔁 Wende</div>';
    t.wende.forEach(function(k,i){
      var isDanger = k.indexOf('🚨') >= 0 || k.indexOf('NIEMALS') >= 0;
      html += '<div style="display:flex;align-items:flex-start;gap:8px;padding:5px 0;border-bottom:1px solid var(--border);'+(isDanger?'background:rgba(244,67,54,.08);border-radius:6px;padding:6px 8px;margin-bottom:4px':'')+'">'+
        '<div style="width:18px;height:18px;border-radius:50%;background:'+(isDanger?'#F44336':'#0044FF')+';color:#fff;font-size:.6rem;font-weight:800;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:1px">'+(isDanger?'!':i+1)+'</div>' +
        '<div style="font-size:.78rem;'+(isDanger?'color:#F44336;font-weight:700':'')+'">'+k+'</div></div>';
    });
    html += '</div>';

    // Tipps
    if (t.tipps && t.tipps.length) {
      html += '<div style="background:linear-gradient(135deg,rgba(0,68,255,.06),rgba(0,194,224,.06));border:1px solid rgba(0,68,255,.15);border-radius:12px;padding:12px;margin-bottom:8px">' +
        '<div style="font-size:.78rem;font-weight:700;color:#0044FF;margin-bottom:7px">💡 Tipps für dein Rennen</div>';
      t.tipps.forEach(function(tip){
        html += '<div style="display:flex;align-items:flex-start;gap:6px;padding:4px 0">' +
          '<span style="color:#0044FF;font-size:.85rem;flex-shrink:0">→</span>' +
          '<div style="font-size:.75rem;color:var(--t2)">'+tip+'</div></div>';
      });
      html += '</div>';
    }
    html += '</div>';
  } else if (!selLage) {
    html += '<div style="background:var(--subtle);border-radius:12px;padding:16px;margin-bottom:16px;text-align:center">' +
      '<div style="font-size:1.6rem;margin-bottom:6px">📋</div>' +
      '<div style="font-size:.83rem;font-weight:700">Lage wählen</div>' +
      '<div style="font-size:.75rem;color:var(--tm);margin-top:4px">Wähle oben deine Lage – dann siehst du die Technik-Tipps und Disqualifikations-Risiken.</div>' +
    '</div>';
  }

  // ── Renntaktik ──
  if (selStrecke && WK_STRECKEN[selStrecke]) {
    var st = WK_STRECKEN[selStrecke];
    html += '<div style="margin-bottom:16px">' +
      '<div style="font-size:.9rem;font-weight:800;margin-bottom:4px">'+st.emoji+' Renntaktik: '+selStrecke+'</div>' +
      '<div style="background:var(--subtle);border-radius:12px;padding:12px;margin-bottom:8px">' +
        '<div style="background:var(--card);border-radius:8px;padding:9px;margin-bottom:10px">' +
          '<div style="font-size:.62rem;font-weight:700;color:var(--tm);text-transform:uppercase;letter-spacing:.5px;margin-bottom:3px">Deine Strategie</div>' +
          '<div style="font-size:.82rem;font-weight:700">'+st.pacing+'</div>' +
        '</div>';
    st.tipps.forEach(function(tip){
      html += '<div style="display:flex;align-items:flex-start;gap:6px;padding:5px 0;border-bottom:1px solid var(--border)">' +
        '<span style="color:#0044FF;font-size:.85rem;flex-shrink:0">✓</span>' +
        '<div style="font-size:.78rem">'+tip+'</div></div>';
    });
    html += '</div></div>';
  } else if (!selStrecke) {
    html += '<div style="background:var(--subtle);border-radius:12px;padding:16px;margin-bottom:16px;text-align:center">' +
      '<div style="font-size:1.6rem;margin-bottom:6px">📊</div>' +
      '<div style="font-size:.83rem;font-weight:700">Strecke wählen</div>' +
      '<div style="font-size:.75rem;color:var(--tm);margin-top:4px">Wähle oben deine Strecke – dann siehst du die Renntaktik.</div>' +
    '</div>';
  }

  // ── Checkliste ──
  html += '<div style="background:linear-gradient(135deg,#1A1A2E,#0D3B6E);border-radius:12px;padding:14px;margin-bottom:16px;color:#fff">' +
    '<div style="font-size:.85rem;font-weight:800;margin-bottom:10px">✅ Kurz vor dem Start – hast du alles?</div>';
  ['Badeanzug/Badehose an','Schwimmbrille sitzt richtig','Badekappe auf','Genug getrunken (Wasser!)','Aufwärmen gemacht','Startzeit und Bahn gemerkt','Rennen im Kopf durchgegangen','Knie-Übungen gemacht'].forEach(function(item){
    html += '<div style="display:flex;align-items:center;gap:8px;padding:5px 0;border-bottom:1px solid rgba(255,255,255,.1)">' +
      '<span style="font-size:.85rem;opacity:.7">☐</span><span style="font-size:.78rem">'+item+'</span></div>';
  });
  html += '</div>';

  container.innerHTML = html;
}

// ── Auswahl speichern ─────────────────────────────────────────────
function wkPrepSelect(type, value) {
  if (type === 'strecke') localStorage.setItem('wk_prep_strecke', value);
  if (type === 'lage')    localStorage.setItem('wk_prep_lage',    value);
  renderWkPrep();
}

// ── Timer-Logik ───────────────────────────────────────────────────
function wkTimerStart() {
  WK_TIMER.phaseIdx = 0;
  WK_TIMER.exIdx    = 0;
  WK_TIMER.running  = true;
  WK_TIMER.paused   = false;
  wkTimerShowDisplay(true);
  wkTimerLoadExercise();
}

function wkTimerShowDisplay(show) {
  var disp = document.getElementById('wk-timer-display');
  var btn  = document.getElementById('wk-timer-start-btn');
  if (disp) disp.style.display = show ? 'block' : 'none';
  if (btn)  btn.style.display  = show ? 'none'  : 'block';
}

function wkTimerLoadExercise() {
  if (WK_TIMER.phaseIdx >= WK_WARMUP_PHASEN.length) {
    wkTimerDone(); return;
  }
  var phase = WK_WARMUP_PHASEN[WK_TIMER.phaseIdx];
  if (WK_TIMER.exIdx >= phase.uebungen.length) {
    WK_TIMER.phaseIdx++;
    WK_TIMER.exIdx = 0;
    wkTimerLoadExercise(); return;
  }
  var ex = phase.uebungen[WK_TIMER.exIdx];
  WK_TIMER.remaining = ex.sec;

  var phaseEl = document.getElementById('wk-timer-phase');
  var exEl    = document.getElementById('wk-timer-ex');
  var anlEl   = document.getElementById('wk-timer-anleitung');
  if (phaseEl) phaseEl.textContent = phase.icon + ' ' + phase.name;
  if (exEl)    exEl.textContent    = ex.icon + ' ' + ex.name;
  if (anlEl)   anlEl.textContent   = ex.anleitung;

  wkTimerUpdateDisplay();
  clearInterval(WK_TIMER.interval);
  WK_TIMER.interval = setInterval(wkTimerTick, 1000);
}

function wkTimerTick() {
  if (WK_TIMER.paused) return;
  WK_TIMER.remaining--;
  wkTimerUpdateDisplay();
  if (WK_TIMER.remaining <= 0) {
    clearInterval(WK_TIMER.interval);
    // Vibrate if supported
    try { if (navigator.vibrate) navigator.vibrate([200,100,200]); } catch(e){}
    WK_TIMER.exIdx++;
    setTimeout(wkTimerLoadExercise, 500);
  }
}

function wkTimerUpdateDisplay() {
  var secsEl = document.getElementById('wk-timer-secs');
  var ring   = document.getElementById('wk-timer-ring');
  if (secsEl) secsEl.textContent = WK_TIMER.remaining;

  if (ring) {
    var phase = WK_WARMUP_PHASEN[WK_TIMER.phaseIdx];
    var ex    = phase ? phase.uebungen[WK_TIMER.exIdx] : null;
    var total = ex ? ex.sec : 30;
    var pct   = WK_TIMER.remaining / total;
    var circ  = 276.5;
    ring.style.strokeDashoffset = circ * (1 - pct);
    ring.style.stroke = WK_TIMER.remaining <= 5 ? '#F44336' : (phase ? phase.color : '#0044FF');
  }
}

function wkTimerPause() {
  WK_TIMER.paused = !WK_TIMER.paused;
  var btn = document.getElementById('wk-timer-pause-btn');
  if (btn) btn.textContent = WK_TIMER.paused ? '▶ Weiter' : '⏸ Pause';
}

function wkTimerSkip() {
  clearInterval(WK_TIMER.interval);
  WK_TIMER.exIdx++;
  wkTimerLoadExercise();
}

function wkTimerStop() {
  clearInterval(WK_TIMER.interval);
  WK_TIMER.running = false;
  WK_TIMER.paused  = false;
  wkTimerShowDisplay(false);
}

function wkTimerDone() {
  clearInterval(WK_TIMER.interval);
  WK_TIMER.running = false;
  var disp = document.getElementById('wk-timer-display');
  if (disp) {
    disp.innerHTML = '<div style="text-align:center;padding:16px">' +
      '<div style="font-size:2.5rem;margin-bottom:8px">🎉</div>' +
      '<div style="font-size:1rem;font-weight:800;margin-bottom:4px">Aufwärmen fertig!</div>' +
      '<div style="font-size:.83rem;color:var(--tm);margin-bottom:14px">Super gemacht! Du bist bereit für deinen Start.</div>' +
      '<button onclick="wkTimerStop()" style="padding:10px 20px;border-radius:999px;background:linear-gradient(135deg,#0044FF,#0033CC);color:#fff;font-size:.875rem;font-weight:700;border:none;cursor:pointer">Fertig ✓</button>' +
    '</div>';
    disp.style.display = 'block';
  }
  var btn = document.getElementById('wk-timer-start-btn');
  if (btn) btn.style.display = 'none';
  try { if (navigator.vibrate) navigator.vibrate([300,100,300,100,300]); } catch(e){}
}
// ── ÜBUNGEN PAGE ─────────────────────────────────────────────────────────────
function uebTab(id,btn){
  document.querySelectorAll('#page-uebungen .tabpane').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('#page-uebungen .tabbtn').forEach(b=>b.classList.remove('active'));
  document.getElementById(id).classList.add('active');btn.classList.add('active');
  if(id==='ue-lvt')renderLVTDetail();
  if(id==='ue-physio')renderPhysioDetail();
  if(id==='ue-athletik')renderAthletikGenerator();
}
function renderUebungenPage(){renderLVTDetail();renderPhysioDetail();}

// ── LVT DATA ──────────────────────────────────────────────────────────────────
const LVT_EXERCISES={
  liegestuetze:{name:'Liegestütze',ico:'💪',desc:'Körper gerade wie ein Brett. Brust berührt den Boden. Arme vollständig strecken.',tech:'Hände schulterbreit, Finger nach vorn. Takt: 30 Liegestütze/Minute.',unit:'Wiederholungen',def:10,sets:3,rest:60},
  klimmzuege:{name:'Klimmzüge',ico:'🏋️',desc:'Streckhang mit Ristgriff. Kinn über die Stange. Keine Körperschwünge.',tech:'Schulterbreiter Ristgriff. Arme nach jeder Wiederholung vollständig strecken.',unit:'Wiederholungen',def:3,sets:2,rest:90},
  schlussdreisprung:{name:'Schlussdreisprung',ico:'🦘',desc:'Drei aufeinanderfolgende beidbeinige Sprünge ohne Pause.',tech:'Leichte Hockstellung. Arme zum Schwungholen nutzen. Drei Sprünge fließend.',unit:'Meter (Gesamtweite)',def:1,sets:3,rest:60},
  bauchmuskel:{name:'Bauchmuskeltest',ico:'🏋️',desc:'Aus der Rückenlage in den Sitz. Drei Stufen: Arme vorgestreckt (1P), verschränkt (2P), hinter Kopf (3P).',tech:'Beine ca. 90° angewinkelt. Kein schwungvolles Aufrichten.',unit:'Punkte (1–3)',def:1,sets:1,rest:30},
  rueckenhaltetest:{name:'Rückenhaltetest',ico:'🦸',desc:'In Bauchlage auf erhöhtem Kasten. Oberkörper waagerecht halten, Arme nach vorn gestreckt.',tech:'Eintauchhaltung. Ruhig halten – kein Hohlkreuz. Max. 1:20 min.',unit:'Sekunden',def:30,sets:1,rest:30},
  schulterbeweglichkeit:{name:'Schulterbeweglichkeit',ico:'🔄',desc:'In Bauchlage, Stab mit gestreckten Armen anheben. Abstand Stab–Boden messen.',tech:'Arme schulterbreit parallel. Stirn und Oberkörper berühren den Boden.',unit:'Zentimeter',def:1,sets:2,rest:30},
  rumpfbeugen:{name:'Rumpfbeugen',ico:'🤸',desc:'Aus dem Streckstand langsam nach vorne beugen. Knie gestreckt. Fingerspitzen (1P), Faust (2P), Handfläche (3P).',tech:'Langsam und gleichmäßig ausatmen. Knie müssen gestreckt bleiben.',unit:'Punkte (1–3)',def:1,sets:1,rest:20},
  fussstreckung:{name:'Fußstreckung & -beugung',ico:'🦶',desc:'Im Strecksitz Fuß strecken und anziehen. Winkel in Grad messen.',tech:'Fuß ohne Einwärts- oder Auswärtsdrehung bewegen. Endstellung halten.',unit:'Grad',def:1,sets:1,rest:20}
};

const LVT_CHALLENGES=[
  {day:1,focus:'Einstieg – Gesäß aktivieren',exs:[{k:'liegestuetze',s:2,r:8,rest:60}],pts:4,tip:'Heute lernst du die wichtigsten Übungen kennen. Qualität vor Quantität!'},
  {day:2,focus:'Schulterbeweglichkeit',exs:[{k:'schulterbeweglichkeit',s:3,r:1,rest:30}],pts:4,tip:'Langsam und kontrolliert – Qualität vor Quantität.'},
  {day:3,focus:'Rumpfbeugen & Dehnen',exs:[{k:'rumpfbeugen',s:3,r:1,rest:20}],pts:4,tip:'Knie gestreckt lassen – das ist die Herausforderung!'},
  {day:4,focus:'Klimmzüge',exs:[{k:'klimmzuege',s:3,r:2,rest:90}],pts:5,tip:'Auch 1 Klimmzug ist ein Klimmzug. Arme vollständig strecken!'},
  {day:5,focus:'Fußbeweglichkeit',exs:[{k:'fussstreckung',s:2,r:1,rest:20}],pts:4,tip:'Fuß ohne Drehung bewegen – gerade strecken und anziehen.'},
  {day:6,focus:'Bauchmuskeltest',exs:[{k:'bauchmuskel',s:3,r:1,rest:30}],pts:4,tip:'Langsam aufrichten – kein Schwung!'},
  {day:7,focus:'Aktive Erholung',exs:[{k:'schulterbeweglichkeit',s:2,r:1,rest:30}],pts:3,tip:'Heute locker bleiben – Erholung ist Training.'},
  {day:8,focus:'Liegestütze Aufbau',exs:[{k:'liegestuetze',s:4,r:10,rest:60}],pts:5,tip:'Takt halten: 1 Sekunde runter, 1 Sekunde hoch.'},
  {day:9,focus:'Rückenhaltetest',exs:[{k:'rueckenhaltetest',s:2,r:30,rest:60}],pts:5,tip:'Eintauchhaltung – Arme nach vorn, Blick nach unten.'},
  {day:10,focus:'Klimmzüge Aufbau',exs:[{k:'klimmzuege',s:4,r:3,rest:90}],pts:5,tip:'Kontrolliert absenken – das stärkt genauso wie hochziehen.'},
  {day:11,focus:'Sprungkraft',exs:[{k:'schlussdreisprung',s:3,r:1,rest:60}],pts:5,tip:'Arme schwingen mit! Drei Sprünge fließend ohne Pause.'},
  {day:12,focus:'Beweglichkeit komplett',exs:[{k:'rumpfbeugen',s:2,r:1,rest:20},{k:'fussstreckung',s:2,r:1,rest:20},{k:'schulterbeweglichkeit',s:2,r:1,rest:30}],pts:6,tip:'Alle drei Beweglichkeitstests des LVT in einer Einheit.'},
  {day:13,focus:'Kraft & Aktivierung',exs:[{k:'liegestuetze',s:4,r:12,rest:60},{k:'klimmzuege',s:3,r:3,rest:90}],pts:6,tip:'Heute die längste Einheit bisher. Du bist auf dem richtigen Weg!'},
  {day:14,focus:'Aktive Erholung',exs:[{k:'schulterbeweglichkeit',s:2,r:1,rest:30}],pts:2,tip:'Erholung ist Teil des Trainings. Heute locker bleiben.'},
  {day:15,focus:'Liegestütze Intensiv',exs:[{k:'liegestuetze',s:4,r:12,rest:60}],pts:6,tip:'Wenn du den Takt nicht mehr halten kannst, ist Schluss.'},
  {day:16,focus:'Klimmzüge Intensiv',exs:[{k:'klimmzuege',s:4,r:4,rest:90}],pts:6,tip:'Ristgriff, schulterbreit. Kein Schwingen!'},
  {day:17,focus:'Bauch & Rücken',exs:[{k:'bauchmuskel',s:3,r:1,rest:30},{k:'rueckenhaltetest',s:2,r:40,rest:60}],pts:6,tip:'Bauch und Rücken zusammen – das ist dein Kraftzentrum.'},
  {day:18,focus:'Sprungkraft Intensiv',exs:[{k:'schlussdreisprung',s:5,r:1,rest:60}],pts:6,tip:'Bester von 3 Versuchen zählt beim LVT. Heute 5 Versuche!'},
  {day:19,focus:'Schulter Intensiv',exs:[{k:'schulterbeweglichkeit',s:4,r:1,rest:30}],pts:7,tip:'Schultergesundheit ist das A und O im Schwimmen.'},
  {day:20,focus:'Beweglichkeit Intensiv',exs:[{k:'rumpfbeugen',s:3,r:1,rest:20},{k:'fussstreckung',s:3,r:1,rest:20}],pts:6,tip:'Ziel: Handfläche beim Rumpfbeugen. Knie gestreckt!'},
  {day:21,focus:'Aktive Erholung',exs:[{k:'schulterbeweglichkeit',s:2,r:1,rest:30}],pts:3,tip:'Letzte Ruhewoche vor dem Endspurt.'},
  {day:22,focus:'LVT-Simulation Athletik 1',exs:[{k:'liegestuetze',s:1,r:20,rest:120},{k:'klimmzuege',s:1,r:5,rest:120}],pts:8,tip:'Wie beim echten LVT: Ein Versuch, maximale Leistung.'},
  {day:23,focus:'LVT-Simulation Beweglichkeit',exs:[{k:'schulterbeweglichkeit',s:1,r:1,rest:60},{k:'rumpfbeugen',s:1,r:1,rest:60},{k:'fussstreckung',s:1,r:1,rest:60}],pts:7,tip:'Alle drei Beweglichkeitstests – wie beim echten LVT.'},
  {day:24,focus:'LVT-Simulation Athletik 2',exs:[{k:'schlussdreisprung',s:3,r:1,rest:60},{k:'bauchmuskel',s:1,r:1,rest:60}],pts:8,tip:'Schlussdreisprung: 3 Versuche, bester zählt.'},
  {day:25,focus:'Rücken & Stabilität',exs:[{k:'rueckenhaltetest',s:3,r:60,rest:60}],pts:7,tip:'1 Minute und 20 Sekunden ist das Maximum beim LVT.'},
  {day:26,focus:'Kompletteinheit',exs:[{k:'liegestuetze',s:3,r:10,rest:60},{k:'klimmzuege',s:3,r:3,rest:90},{k:'bauchmuskel',s:2,r:1,rest:30}],pts:8,tip:'Alle Athletik-Tests in einer Einheit.'},
  {day:27,focus:'Letzte Beweglichkeit',exs:[{k:'schulterbeweglichkeit',s:3,r:1,rest:30},{k:'rumpfbeugen',s:3,r:1,rest:20},{k:'fussstreckung',s:2,r:1,rest:20}],pts:6,tip:'Letzte Vorbereitung – locker und konzentriert.'},
  {day:28,focus:'Ruhetag vor LVT',exs:[{k:'schulterbeweglichkeit',s:2,r:1,rest:30}],pts:3,tip:'Heute nur locker dehnen. Morgen bist du bereit!'}
];



// ── PHYSIO DATA ───────────────────────────────────────────────────────────────
const PHYSIO_EXERCISES={
  glutebridge:{name:'Gesäßbrücke',ico:'🌉',desc:'Rückenlage, Knie gebeugt. Hüfte anheben und Gesäß anspannen. Knie nach außen drücken.',tech:'Knie zeigen nach außen – nicht nach innen fallen lassen! Oben 2 Sekunden halten.',unit:'Wiederholungen',def:15,sets:3,rest:30,safe:true},
  clamshell:{name:'Muschel (Clamshell)',ico:'🦪',desc:'Seitlage, Knie 45° gebeugt, Füße zusammen. Oberes Knie zur Decke heben ohne Hüfte zu drehen.',tech:'Hüfte darf nicht nach hinten rollen! Langsam heben und senken.',unit:'Wdh. je Seite',def:15,sets:3,rest:30,safe:true},
  seitliches_beinheben:{name:'Seitliches Beinheben',ico:'🦵',desc:'Seitlage, unteres Knie gebeugt. Oberes Bein gestreckt zur Decke heben.',tech:'Fuß bleibt waagerecht. 5 Sekunden halten. Langsam absenken.',unit:'Wdh. je Seite',def:15,sets:3,rest:30,safe:true},
  fire_hydrant:{name:'Fire Hydrant',ico:'🔥',desc:'Auf Händen und Knien. Knie seitlich zur Decke heben.',tech:'Knie bleibt 90° gebeugt. Hüfte nicht mitdrehen. Langsam und kontrolliert.',unit:'Wdh. je Seite',def:12,sets:3,rest:30,safe:true},
  seitgang_band:{name:'Seitgang mit Band',ico:'🦀',desc:'Theraband über Knien. Leichte Hocke. Seitwärts gehen – Spannung halten.',tech:'Knie zeigen nach außen. Schritte gleichmäßig.',unit:'Schritte je Richtung',def:20,sets:3,rest:45,safe:true},
  einbeinstand:{name:'Einbeinstand',ico:'🦩',desc:'Auf einem Bein stehen. Knie leicht gebeugt. Knie zeigt über die Zehen – nicht nach innen!',tech:'Im Spiegel kontrollieren. 30 Sekunden halten.',unit:'Sekunden je Bein',def:30,sets:3,rest:30,safe:true},
  kniebeuge_band:{name:'Kniebeuge mit Band',ico:'🏋️',desc:'Theraband über den Knien. Kniebeuge – Knie aktiv nach außen drücken.',tech:'Knie zeigen über die Zehen. Nur so tief wie schmerzfrei!',unit:'Wiederholungen',def:12,sets:3,rest:45,safe:false},
  adduktoren_dehnen:{name:'Adduktoren-Dehnung (Frosch)',ico:'🐸',desc:'Auf Händen und Knien, Knie weit auseinander. Langsam nach hinten setzen.',tech:'Langsam und ohne Schmerz. Tief einatmen. 30-60 Sekunden halten.',unit:'Sekunden',def:45,sets:2,rest:15,safe:true},
  huefte_90_90:{name:'Hüftdehnung 90/90',ico:'🤸',desc:'Sitzen: Vorderbein 90° vor dir, Hinterbein 90° zur Seite. Aufrecht sitzen.',tech:'Rücken gerade. Beide Seiten gleich lang dehnen.',unit:'Sekunden je Seite',def:30,sets:2,rest:15,safe:true},
  it_band_dehnen:{name:'IT-Band Dehnung',ico:'🦵',desc:'Im Stehen: Bein hinter das andere kreuzen. Zur Seite lehnen.',tech:'Langsam zur Seite lehnen bis Zug spürbar. 30 Sekunden halten.',unit:'Sekunden je Seite',def:30,sets:2,rest:15,safe:true},
  knie_strecken:{name:'Knie strecken im Sitzen',ico:'🪑',desc:'Auf Stuhlkante sitzen. Knie langsam strecken, 5 Sekunden halten, absenken.',tech:'Schmerzfreier Bereich! Langsam und kontrolliert.',unit:'Wdh. je Bein',def:12,sets:3,rest:20,safe:true}
};

const PHYSIO_PLAN=[
  {day:1,focus:'Einstieg – Gesäß aktivieren',exs:[{k:'glutebridge',s:2,r:12,rest:30},{k:'clamshell',s:2,r:12,rest:30}],pts:4,tip:'Heute lernst du die wichtigsten Muskeln kennen.',safety:'Alle Übungen sind knieschonend.'},
  {day:2,focus:'Hüftabduktoren stärken',exs:[{k:'seitliches_beinheben',s:3,r:12,rest:30},{k:'fire_hydrant',s:2,r:10,rest:30}],pts:4,tip:'Hüfte nicht mitdrehen – das ist die häufigste Fehlerquelle.',safety:'Kein Schmerz im Knie – sofort stoppen wenn Schmerz.'},
  {day:3,focus:'Dehnen & Mobilisieren',exs:[{k:'adduktoren_dehnen',s:2,r:45,rest:15},{k:'huefte_90_90',s:2,r:30,rest:15},{k:'it_band_dehnen',s:2,r:30,rest:15}],pts:3,tip:'Dehnen löst die Spannung die X-Beine verursacht.',safety:'Sanft dehnen – nie in den Schmerz.'},
  {day:4,focus:'Gesäßbrücke + Muschel',exs:[{k:'glutebridge',s:3,r:15,rest:30},{k:'clamshell',s:3,r:15,rest:30}],pts:4,tip:'Theraband über den Knien macht die Übungen effektiver.',safety:'Knieschonend – ideal bei Knieschmerzen.'},
  {day:5,focus:'Gleichgewicht & Kontrolle',exs:[{k:'einbeinstand',s:3,r:20,rest:30}],pts:3,tip:'Im Spiegel kontrollieren: Knie zeigt über die Zehen – nicht nach innen!',safety:'Knieschonend.'},
  {day:6,focus:'Knie stärken (sitzend)',exs:[{k:'knie_strecken',s:3,r:12,rest:20},{k:'seitliches_beinheben',s:2,r:12,rest:30}],pts:4,tip:'Knie strecken im Sitzen ist die sicherste Übung bei Knieschmerzen.',safety:'Nur im schmerzfreien Bereich!'},
  {day:7,focus:'Aktive Erholung',exs:[{k:'adduktoren_dehnen',s:2,r:45,rest:15},{k:'huefte_90_90',s:2,r:30,rest:15}],pts:2,tip:'Heute locker dehnen. Der Körper braucht Erholung.',safety:'Sanft und entspannt.'},
  {day:8,focus:'Gesäßbrücke intensiver',exs:[{k:'glutebridge',s:3,r:15,rest:30},{k:'clamshell',s:3,r:15,rest:30},{k:'fire_hydrant',s:3,r:12,rest:30}],pts:5,tip:'Heute alle drei Aktivierungsübungen zusammen.',safety:'Knieschonend.'},
  {day:9,focus:'Seitgang einführen',exs:[{k:'seitgang_band',s:3,r:20,rest:45},{k:'einbeinstand',s:3,r:25,rest:30}],pts:5,tip:'Seitgang: Knie zeigen nach außen – nicht zusammenfallen lassen!',safety:'Knieschonend.'},
  {day:10,focus:'Dehnen komplett',exs:[{k:'adduktoren_dehnen',s:3,r:45,rest:15},{k:'huefte_90_90',s:3,r:30,rest:15},{k:'it_band_dehnen',s:3,r:30,rest:15}],pts:4,tip:'Alle drei Dehnübungen – das ist dein Beweglichkeitsprogramm.',safety:'Sanft dehnen.'},
  {day:11,focus:'Knie-Kontrolle üben',exs:[{k:'knie_strecken',s:3,r:15,rest:20},{k:'einbeinstand',s:3,r:30,rest:30}],pts:4,tip:'Einbeinstand: Augen zu für mehr Schwierigkeit!',safety:'Knieschonend.'},
  {day:12,focus:'Kraft & Aktivierung',exs:[{k:'glutebridge',s:4,r:15,rest:30},{k:'seitgang_band',s:3,r:20,rest:45},{k:'clamshell',s:3,r:15,rest:30}],pts:6,tip:'Heute die längste Einheit bisher.',safety:'Knieschonend.'},
  {day:13,focus:'Aktive Erholung',exs:[{k:'adduktoren_dehnen',s:2,r:60,rest:15},{k:'huefte_90_90',s:2,r:45,rest:15}],pts:2,tip:'Erholung ist Teil des Trainings.',safety:'Sanft.'},
  {day:14,focus:'Kniebeuge mit Band',exs:[{k:'kniebeuge_band',s:3,r:10,rest:45},{k:'glutebridge',s:3,r:15,rest:30}],pts:6,tip:'Kniebeuge NUR wenn kein Schmerz! Knie zeigen über die Zehen.',safety:'⚠️ Nur wenn das Knie schmerzfrei ist!'},
  {day:15,focus:'Seitgang + Einbeinstand',exs:[{k:'seitgang_band',s:4,r:20,rest:45},{k:'einbeinstand',s:4,r:30,rest:30}],pts:6,tip:'Seitgang: Tempo langsam, Kontrolle hoch.',safety:'Knieschonend.'},
  {day:16,focus:'Kompletteinheit',exs:[{k:'glutebridge',s:3,r:15,rest:30},{k:'clamshell',s:3,r:15,rest:30},{k:'seitgang_band',s:3,r:20,rest:45},{k:'einbeinstand',s:3,r:30,rest:30}],pts:7,tip:'Alle Hauptübungen in einer Einheit.',safety:'Knieschonend.'},
  {day:17,focus:'Aktive Erholung',exs:[{k:'adduktoren_dehnen',s:2,r:60,rest:15}],pts:2,tip:'Letzte Ruhewoche.',safety:'Sanft.'},
  {day:18,focus:'Kraft-Fokus',exs:[{k:'seitgang_band',s:4,r:20,rest:45},{k:'kniebeuge_band',s:3,r:12,rest:45}],pts:7,tip:'Qualität bleibt das Wichtigste.',safety:'⚠️ Kniebeuge nur wenn schmerzfrei!'},
  {day:19,focus:'Kontrolle & Balance',exs:[{k:'einbeinstand',s:4,r:40,rest:30},{k:'knie_strecken',s:3,r:15,rest:20}],pts:6,tip:'Einbeinstand 40 Sekunden – das ist dein neues Ziel!',safety:'Knieschonend.'},
  {day:20,focus:'Dehnen intensiv',exs:[{k:'adduktoren_dehnen',s:3,r:60,rest:15},{k:'huefte_90_90',s:3,r:45,rest:15},{k:'it_band_dehnen',s:3,r:45,rest:15}],pts:5,tip:'Beweglichkeit ist genauso wichtig wie Kraft.',safety:'Sanft.'},
  {day:21,focus:'Kompletteinheit',exs:[{k:'glutebridge',s:3,r:15,rest:30},{k:'seitgang_band',s:4,r:20,rest:45},{k:'einbeinstand',s:3,r:35,rest:30}],pts:8,tip:'Fast geschafft!',safety:'Knieschonend.'},
  {day:22,focus:'Letzte Aktivierung',exs:[{k:'clamshell',s:3,r:15,rest:30},{k:'fire_hydrant',s:3,r:12,rest:30},{k:'adduktoren_dehnen',s:2,r:60,rest:15}],pts:5,tip:'Vorletzter Tag.',safety:'Knieschonend.'},
  {day:23,focus:'Abschluss & Ausblick',exs:[{k:'glutebridge',s:2,r:15,rest:30},{k:'einbeinstand',s:2,r:30,rest:30},{k:'adduktoren_dehnen',s:2,r:45,rest:15}],pts:5,tip:'Diese Übungen täglich weiterführen – das ist der Schlüssel.',safety:'Täglich weiterführen!'},
  {day:24,focus:'Erhaltungstraining',exs:[{k:'glutebridge',s:3,r:15,rest:30},{k:'clamshell',s:3,r:15,rest:30}],pts:4,tip:'Weiter so!',safety:'Knieschonend.'},
  {day:25,focus:'Kraft & Dehnen',exs:[{k:'seitgang_band',s:3,r:20,rest:45},{k:'adduktoren_dehnen',s:3,r:45,rest:15}],pts:5,tip:'Kraft und Dehnen kombiniert.',safety:'Knieschonend.'},
  {day:26,focus:'Balance & Kontrolle',exs:[{k:'einbeinstand',s:4,r:40,rest:30},{k:'knie_strecken',s:3,r:15,rest:20}],pts:6,tip:'Knie-Kontrolle im Alltag.',safety:'Knieschonend.'},
  {day:27,focus:'Dehnen komplett',exs:[{k:'adduktoren_dehnen',s:3,r:60,rest:15},{k:'huefte_90_90',s:3,r:45,rest:15},{k:'it_band_dehnen',s:3,r:45,rest:15}],pts:5,tip:'Beweglichkeit erhalten.',safety:'Sanft.'},
  {day:28,focus:'Abschluss',exs:[{k:'glutebridge',s:2,r:15,rest:30},{k:'einbeinstand',s:2,r:30,rest:30}],pts:4,tip:'28 Tage geschafft! Diese Übungen täglich weiterführen.',safety:'Täglich weiterführen!'}
];

// ── CHALLENGE STATE ───────────────────────────────────────────────────────────
function getLVTState(){try{return JSON.parse(localStorage.getItem('st_lvt_state')||'{}');}catch(e){return{};}}
function saveLVTState(s){localStorage.setItem('st_lvt_state',JSON.stringify(s));}
function getLVTStartDate(){const s=getLVTState();if(!s.startDate){s.startDate=today();saveLVTState(s);}return s.startDate;}
function getLVTDay(){const start=getLVTStartDate();const diff=Math.floor((new Date(today()+'T12:00:00')-new Date(start+'T12:00:00'))/86400000);return Math.min(Math.max(diff+1,1),28);}
function getTodayLVT(){const day=getLVTDay();return LVT_CHALLENGES.find(c=>c.day===day)||LVT_CHALLENGES[0];}
function isLVTDoneToday(){const s=getLVTState();return(s.completedDates||[]).includes(today());}

function getPhysioState(){try{return JSON.parse(localStorage.getItem('st_physio_state')||'{}');}catch(e){return{};}}
function savePhysioState(s){localStorage.setItem('st_physio_state',JSON.stringify(s));}
function getPhysioStartDate(){const s=getPhysioState();if(!s.startDate){s.startDate=today();savePhysioState(s);}return s.startDate;}
function getPhysioDay(){const start=getPhysioStartDate();const diff=Math.floor((new Date(today()+'T12:00:00')-new Date(start+'T12:00:00'))/86400000);return Math.min(Math.max(diff+1,1),28);}
function getTodayPhysio(){const day=getPhysioDay();return PHYSIO_PLAN.find(c=>c.day===day)||PHYSIO_PLAN[0];}
function isPhysioDoneToday(){const s=getPhysioState();return(s.completedDates||[]).includes(today());}

// ── CHALLENGE CARDS (Heute-Seite) ─────────────────────────────────────────────
function renderLVTCard(){
  const container=document.getElementById('lvt-container');if(!container)return;
  const ch=getTodayLVT();const done=isLVTDoneToday();const day=getLVTDay();
  const pct=Math.round((day/28)*100);
  const exList=ch.exs.map(ex=>{const def=LVT_EXERCISES[ex.k];if(!def)return'';return'<div class="ch-ex"><span class="ch-ex-ico">'+def.ico+'</span><div><div class="ch-ex-name">'+def.name+'</div><div class="ch-ex-reps">'+(ex.s>1?ex.s+'×':'')+ex.r+' '+def.unit+(ex.rest?' · Pause '+ex.rest+'s':'')+'</div></div></div>';}).join('');
  container.innerHTML='<div class="ch-card lvt '+(done?'done':'')+'" onclick="showChDetail(\'lvt\')">'+
    '<div class="ch-hdr"><div><div class="ch-badge">LVT Tag '+day+'/28</div><div class="ch-focus">'+ch.focus+'</div></div><div class="ch-pts">+'+ch.pts+' Pkt.</div></div>'+
    '<div class="ch-prog-wrap"><div class="ch-prog-fill" style="width:'+pct+'%"></div></div>'+
    '<div class="ch-exlist">'+exList+'</div>'+
    '<div class="ch-tip">💡 '+ch.tip+'</div>'+
    (done?'<div class="ch-done">✓ Heute erledigt!</div>':'<button class="btn full" onclick="event.stopPropagation();completeLVT()" style="margin-top:8px">✓ LVT-Herausforderung erledigt!</button>')+
  '</div>';
}

function renderPhysioCard(){
  const container=document.getElementById('physio-container');if(!container)return;
  const ch=getTodayPhysio();const done=isPhysioDoneToday();const day=getPhysioDay();
  const pct=Math.round((day/28)*100);
  const exList=ch.exs.map(ex=>{const def=PHYSIO_EXERCISES[ex.k];if(!def)return'';return'<div class="ch-ex"><span class="ch-ex-ico">'+def.ico+'</span><div><div class="ch-ex-name">'+def.name+'</div><div class="ch-ex-reps">'+(ex.s>1?ex.s+'×':'')+ex.r+' '+def.unit+(ex.rest?' · Pause '+ex.rest+'s':'')+'</div></div></div>';}).join('');
  container.innerHTML='<div class="ch-card physio '+(done?'done':'')+'" onclick="showChDetail(\'physio\')">'+
    '<div class="ch-hdr"><div><div class="ch-badge">Knie-Physio Tag '+day+'/28</div><div class="ch-focus">'+ch.focus+'</div></div><div class="ch-pts green">+'+ch.pts+' Pkt.</div></div>'+
    '<div class="ch-prog-wrap"><div class="ch-prog-fill" style="width:'+pct+'%"></div></div>'+
    (ch.safety?'<div class="ch-safety">'+ch.safety+'</div>':'')+
    '<div class="ch-exlist">'+exList+'</div>'+
    '<div class="ch-tip">💡 '+ch.tip+'</div>'+
    (done?'<div class="ch-done">✓ Heute erledigt!</div>':'<button class="btn full green" onclick="event.stopPropagation();completePhysio()" style="margin-top:8px">✓ Physiotherapie erledigt!</button>')+
  '</div>';
}

// ── CHALLENGE DETAIL MODAL ────────────────────────────────────────────────────
function showChDetail(type){
  const isLVT=type==='lvt';
  const ch=isLVT?getTodayLVT():getTodayPhysio();
  const exercises=isLVT?LVT_EXERCISES:PHYSIO_EXERCISES;
  const day=isLVT?getLVTDay():getPhysioDay();
  setText('m-ch-title',(isLVT?'LVT-Herausforderung':'Knie-Physiotherapie')+' Tag '+day);
  const content=document.getElementById('m-ch-content');
  if(content){
    content.innerHTML=
      (ch.safety?'<div class="ch-safety" style="margin-bottom:10px">'+ch.safety+'</div>':'')+
      ch.exs.map(ex=>{
        const def=exercises[ex.k];if(!def)return'';
        return '<div style="background:var(--subtle);border-radius:var(--r);padding:12px;margin-bottom:8px">'+
          '<div style="display:flex;align-items:flex-start;gap:10px;margin-bottom:6px">'+
            '<span style="font-size:1.4rem">'+def.ico+'</span>'+
            '<div style="flex:1"><div style="font-size:.9rem;font-weight:700">'+def.name+'</div>'+
            '<div style="font-size:.72rem;color:var(--blue);font-weight:600">'+(ex.s>1?ex.s+'×':'')+ex.r+' '+def.unit+(ex.rest?' · Pause '+ex.rest+'s':'')+'</div></div>'+
          '</div>'+
          '<div style="font-size:.8rem;color:var(--t2);line-height:1.5;margin-bottom:5px">'+def.desc+'</div>'+
          '<div style="font-size:.75rem;color:var(--tm);padding:5px 8px;background:var(--card);border-radius:7px;border-left:3px solid var(--blue)"><strong>Technik:</strong> '+def.tech+'</div>'+
        '</div>';
      }).join('')+
      '<div style="background:var(--amber-l);border-radius:var(--r);padding:10px;margin-top:8px;display:flex;gap:8px">'+
        '<span>💡</span><p style="font-size:.83rem;color:var(--amber);font-weight:500">'+ch.tip+'</p>'+
      '</div>'+
      (!isLVT?'<div style="background:var(--blue-l);border-radius:var(--r);padding:8px;margin-top:8px;font-size:.72rem;color:var(--blue)">ℹ️ Diese Übungen ersetzen keine ärztliche Behandlung. Bei Schmerzen sofort stoppen.</div>':'');
  }
  const btn=document.getElementById('m-ch-btn');
  if(btn){
    const done=isLVT?isLVTDoneToday():isPhysioDoneToday();
    btn.textContent=done?'✓ Bereits erledigt':'✓ Erledigt!';
    btn.disabled=done;
    btn.onclick=()=>{if(isLVT)completeLVT();else completePhysio();closeModal('m-ch-detail');};
    if(isLVT)btn.style.background='';else btn.style.background='linear-gradient(135deg,#27AE60,#1ABC9C)';
  }
  document.getElementById('m-ch-detail').classList.remove('hidden');
}

async function completeLVT(){
  const ch=getTodayLVT();const s=getLVTState();
  if(!s.completedDates)s.completedDates=[];
  if(!s.completedDates.includes(today())){
    s.completedDates.push(today());saveLVTState(s);
    await logPts([{reason:'LVT-Herausforderung Tag '+ch.day+': '+ch.focus,pts:ch.pts}],'lvt_'+today(),'lvt',today());
    haptic();showToast('LVT-Challenge abgeschlossen! +'+ch.pts+' Punkte 🏆');
    renderLVTCard();await checkBadges();
  }
}

async function completePhysio(){
  const ch=getTodayPhysio();const s=getPhysioState();
  if(!s.completedDates)s.completedDates=[];
  if(!s.completedDates.includes(today())){
    s.completedDates.push(today());savePhysioState(s);
    await logPts([{reason:'Physiotherapie Tag '+ch.day+': '+ch.focus,pts:ch.pts}],'physio_'+today(),'physio',today());
    haptic();showToast('Physiotherapie erledigt! +'+ch.pts+' Punkte 💙');
    renderPhysioCard();
  }
}

// ── DETAIL VIEWS (Übungen-Seite) ──────────────────────────────────────────────
function renderLVTDetail(){
  const container=document.getElementById('lvt-detail');if(!container)return;
  const ch=getTodayLVT();const done=isLVTDoneToday();const day=getLVTDay();
  const pct=Math.round((day/28)*100);
  container.innerHTML=
    '<div class="card" style="margin-bottom:12px">'+
      '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">'+
        '<span style="font-size:.83rem;font-weight:700">LVT-Vorbereitung – Tag '+day+'/28</span>'+
        '<span style="font-size:.75rem;font-weight:600;color:var(--blue)">'+pct+'%</span>'+
      '</div>'+
      '<div class="pbar-wrap"><div class="pbar-fill" style="width:'+pct+'%"></div></div>'+
      '<p class="muted" style="margin-top:4px">Basiert auf dem DSV Landesvielseitigkeitstest Testmanual 2017/2018</p>'+
    '</div>'+
    '<div class="ch-card lvt '+(done?'done':'')+'" style="cursor:default">'+
      '<div class="ch-hdr"><div><div class="ch-badge">Heute: Tag '+day+'</div><div class="ch-focus">'+ch.focus+'</div></div><div class="ch-pts">+'+ch.pts+' Pkt.</div></div>'+
      ch.exs.map(ex=>{const def=LVT_EXERCISES[ex.k];if(!def)return'';return'<div style="background:rgba(255,255,255,.08);border-radius:8px;padding:10px;margin-bottom:6px">'+
        '<div style="display:flex;align-items:center;gap:8px;margin-bottom:5px"><span style="font-size:1.2rem">'+def.ico+'</span><div><div style="font-size:.83rem;font-weight:700;color:#fff">'+def.name+'</div><div style="font-size:.7rem;color:rgba(255,255,255,.7)">'+(ex.s>1?ex.s+'×':'')+ex.r+' '+def.unit+'</div></div></div>'+
        '<div style="font-size:.75rem;color:rgba(255,255,255,.8);line-height:1.4">'+def.desc+'</div>'+
        '<div style="font-size:.72rem;color:rgba(255,255,255,.6);margin-top:4px;font-style:italic">Technik: '+def.tech+'</div>'+
      '</div>';}).join('')+
      '<div class="ch-tip">💡 '+ch.tip+'</div>'+
      (done?'<div class="ch-done">✓ Heute erledigt!</div>':'<button class="btn full" onclick="completeLVT()" style="margin-top:8px">✓ Herausforderung erledigt!</button>')+
    '</div>'+
    '<div style="margin-top:16px"><div style="font-size:.83rem;font-weight:700;margin-bottom:10px">Alle LVT-Übungen</div>'+
    Object.entries(LVT_EXERCISES).map(([k,def])=>'<div class="ecard" style="cursor:default"><div class="eico">'+def.ico+'</div><div class="ebody"><div class="etitle">'+def.name+'</div><div class="emeta">'+def.unit+' · '+def.sets+'×'+def.def+'</div><div style="font-size:.72rem;color:var(--tm);margin-top:3px">'+def.desc+'</div></div></div>').join('')+
    '</div>'+
    '<button class="btn2 full" onclick="resetLVT()" style="margin-top:12px">Programm neu starten</button>';
}

function renderPhysioDetail(){
  const container=document.getElementById('physio-detail');if(!container)return;
  const ch=getTodayPhysio();const done=isPhysioDoneToday();const day=getPhysioDay();
  const pct=Math.round((day/28)*100);
  container.innerHTML=
    '<div class="card" style="margin-bottom:12px">'+
      '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">'+
        '<span style="font-size:.83rem;font-weight:700">Knie-Physiotherapie – Tag '+day+'/28</span>'+
        '<span style="font-size:.75rem;font-weight:600;color:var(--green)">'+pct+'%</span>'+
      '</div>'+
      '<div class="pbar-wrap"><div class="pbar-fill green" style="width:'+pct+'%"></div></div>'+
      '<p class="muted" style="margin-top:4px">Evidenzbasiertes Programm für X-Beine und Kniebeschwerden</p>'+
    '</div>'+
    '<div class="ch-card physio '+(done?'done':'')+'" style="cursor:default">'+
      '<div class="ch-hdr"><div><div class="ch-badge">Heute: Tag '+day+'</div><div class="ch-focus">'+ch.focus+'</div></div><div class="ch-pts green">+'+ch.pts+' Pkt.</div></div>'+
      (ch.safety?'<div class="ch-safety">'+ch.safety+'</div>':'')+
      ch.exs.map(ex=>{const def=PHYSIO_EXERCISES[ex.k];if(!def)return'';return'<div style="background:rgba(255,255,255,.08);border-radius:8px;padding:10px;margin-bottom:6px">'+
        '<div style="display:flex;align-items:center;gap:8px;margin-bottom:5px"><span style="font-size:1.2rem">'+def.ico+'</span><div><div style="font-size:.83rem;font-weight:700;color:#fff">'+def.name+'</div><div style="font-size:.7rem;color:rgba(255,255,255,.7)">'+(ex.s>1?ex.s+'×':'')+ex.r+' '+def.unit+'</div></div></div>'+
        '<div style="font-size:.75rem;color:rgba(255,255,255,.8);line-height:1.4">'+def.desc+'</div>'+
        '<div style="font-size:.72rem;color:rgba(255,255,255,.6);margin-top:4px;font-style:italic">Technik: '+def.tech+'</div>'+
      '</div>';}).join('')+
      '<div class="ch-tip">💡 '+ch.tip+'</div>'+
      (done?'<div class="ch-done">✓ Heute erledigt!</div>':'<button class="btn full green" onclick="completePhysio()" style="margin-top:8px">✓ Physiotherapie erledigt!</button>')+
    '</div>'+
    '<div style="background:var(--blue-l);border-radius:var(--r);padding:10px;margin-bottom:12px;font-size:.75rem;color:var(--blue)">ℹ️ Diese Übungen ersetzen keine ärztliche oder physiotherapeutische Behandlung. Bei Schmerzen sofort stoppen und den Arzt konsultieren.</div>'+
    '<button class="btn2 full" onclick="resetPhysio()" style="margin-top:4px">Programm neu starten</button>';
}

function resetLVT(){showConfirm('LVT-Programm neu starten?','Der Fortschritt wird zurückgesetzt.',()=>{const s=getLVTState();s.startDate=today();s.completedDates=[];saveLVTState(s);closeModal('m-confirm');showToast('LVT-Programm neu gestartet!');renderLVTCard();renderLVTDetail();});}
function resetPhysio(){showConfirm('Physio-Programm neu starten?','Der Fortschritt wird zurückgesetzt.',()=>{const s=getPhysioState();s.startDate=today();s.completedDates=[];savePhysioState(s);closeModal('m-confirm');showToast('Physio-Programm neu gestartet!');renderPhysioCard();renderPhysioDetail();});}

