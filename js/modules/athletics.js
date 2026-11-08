'use strict';
// SwimTrack Stage 9 - Athletikübungen, Templates und Generator.
// ══════════════════════════════════════════════════════════════════
// ATHLETIK-ÜBUNGEN – Verfeinert für Schwimmer
// Quellen: ScoreMeUp Dryland Menu, USMS, Foundational Rehab
// Knieschonend markiert für Sportler mit Knieproblemen
// ══════════════════════════════════════════════════════════════════

const ATHLETIK_EXERCISES = {

  // ── OBERKÖRPER / ZUG (wichtigste Schwimmer-Muskelgruppe) ──────────
  liegestuetze: {
    name:'Liegestütze',ico:'💪',cat:'kraft',unit:'Wdh.',lvt:true,knieSafe:true,
    swimRelevance:'Schulterstabilität, Trizeps-Finish des Zugs',
    desc:'Hände schulterbreit, Finger nach vorn. Körper gerade wie im Streamline. Brust berührt den Boden.',
    tech:'Ellenbogen zeigen leicht nach hinten – nicht seitlich abspreizen. Schulterblätter zusammenziehen beim Hochdrücken. Bauch anspannen wie im Wasser.',
    warning:null
  },
  klimmzuege: {
    name:'Klimmzüge',ico:'🏋️',cat:'kraft',unit:'Wdh.',lvt:true,knieSafe:true,
    swimRelevance:'Latissimus – der wichtigste Zugmuskel im Schwimmen',
    desc:'Ristgriff schulterbreit. Aus dem Streckhang das Kinn über die Stange ziehen. Kontrolliert absenken.',
    tech:'Schulterblätter zuerst nach unten ziehen, dann Arme beugen – so aktivierst du den Lat optimal. Kein Schwingen. Arme nach jeder Wiederholung vollständig strecken.',
    warning:null
  },
  lat_pulldown_band: {
    name:'Lat-Zug mit Theraband',ico:'🔄',cat:'kraft',unit:'Wdh.',lvt:false,knieSafe:true,
    swimRelevance:'Latissimus – simuliert den Unterwasser-Zugpfad',
    desc:'Theraband über einer Tür befestigen. Im Stehen oder Sitzen die Arme von oben nach unten ziehen – wie beim Kraul-Zug.',
    tech:'Ellenbogen nah am Körper vorbeiführen. Schulterblätter am Ende zusammenziehen. Langsam zurück – die exzentrische Phase stärkt genauso.',
    warning:null
  },
  rudern_band: {
    name:'Rudern mit Theraband',ico:'🚣',cat:'kraft',unit:'Wdh.',lvt:false,knieSafe:true,
    swimRelevance:'Oberer Rücken, Schulterblatt-Stabilität – wichtig für alle Lagen',
    desc:'Theraband um einen Pfosten. Aufrecht sitzen oder stehen, Arme nach hinten ziehen wie beim Rudern.',
    tech:'Ellenbogen eng am Körper. Schulterblätter am Ende fest zusammenziehen und 1 Sekunde halten. Rücken gerade – nicht mit dem Oberkörper schwingen.',
    warning:null
  },
  dips: {
    name:'Trizeps-Dips',ico:'💪',cat:'kraft',unit:'Wdh.',lvt:false,knieSafe:true,
    swimRelevance:'Trizeps – der Finish-Muskel jedes Schwimmzugs',
    desc:'Hände auf Stuhlkante hinter dem Körper. Körper absenken bis Ellenbogen 90°, dann hochdrücken.',
    tech:'Ellenbogen zeigen nach hinten – nicht seitlich. Körper nah an der Stuhlkante. Schultern nicht hochziehen.',
    warning:null
  },
  schulter_rotation_band: {
    name:'Schulter-Außenrotation (Band)',ico:'🔄',cat:'kraft',unit:'Wdh./Seite',lvt:false,knieSafe:true,
    swimRelevance:'Rotatorenmanschette – Schulterprävention für alle Schwimmlagen',
    desc:'Theraband auf Hüfthöhe befestigen. Ellenbogen 90° am Körper, Unterarm nach außen drehen.',
    tech:'Ellenbogen bleibt fest am Körper – nur der Unterarm dreht. Langsam und kontrolliert. Kein Schwingen. Besonders wichtig für Schmetterling und Kraul.',
    warning:'Schmerzen in der Schulter? Sofort stoppen und Arzt aufsuchen.'
  },
  hollow_body: {
    name:'Hollow Body Hold',ico:'🍌',cat:'kraft',unit:'Sek.',lvt:false,knieSafe:true,
    swimRelevance:'Streamline-Position – die wichtigste Körperspannung im Schwimmen',
    desc:'Rückenlage. Arme gestreckt über dem Kopf, Beine gestreckt leicht angehoben. Rücken flach auf dem Boden.',
    tech:'Lendenwirbel muss den Boden berühren – das ist der Unterschied zum Hohlkreuz. Bauch fest einziehen. Genau die Position wie im Streamline nach dem Start.',
    warning:null
  },
  dead_bug: {
    name:'Dead Bug',ico:'🐛',cat:'kraft',unit:'Wdh./Seite',lvt:false,knieSafe:true,
    swimRelevance:'Rumpfstabilität bei Arm-Bein-Koordination – wie beim Schwimmen',
    desc:'Rückenlage, Arme senkrecht nach oben, Beine 90° angewinkelt. Abwechselnd Arm und Gegenbein strecken.',
    tech:'Rücken bleibt flach auf dem Boden – das ist entscheidend. Langsam und kontrolliert. Genau das Muster, das du beim Kraul-Schwimmen brauchst.',
    warning:null
  },
  plank: {
    name:'Plank (Unterarmstütz)',ico:'🏋️',cat:'kraft',unit:'Sek.',lvt:false,knieSafe:true,
    swimRelevance:'Rumpfspannung – hält die Hüfte hoch im Wasser',
    desc:'Unterarme auf dem Boden, Körper gerade wie ein Brett. Hüfte weder hängen noch hochschieben.',
    tech:'Bauch fest anspannen, Gesäß leicht anspannen. Blick zum Boden. Atme gleichmäßig weiter – nicht die Luft anhalten.',
    warning:null
  },
  seitstütz: {
    name:'Seitstütz',ico:'💪',cat:'kraft',unit:'Sek./Seite',lvt:false,knieSafe:true,
    swimRelevance:'Seitliche Rumpfstabilität – wichtig für Körperrotation im Kraul',
    desc:'Seitlage auf dem Unterarm. Hüfte anheben, Körper gerade. Oberer Arm an der Hüfte oder gestreckt.',
    tech:'Hüfte nicht absacken lassen. Schulter direkt über dem Ellenbogen. Die Körperrotation beim Kraul kommt aus genau dieser Muskelgruppe.',
    warning:null
  },
  superman: {
    name:'Superman',ico:'🦸',cat:'kraft',unit:'Wdh.',lvt:true,knieSafe:true,
    swimRelevance:'Rückenstrecker – Eintauchhaltung und Streamline',
    desc:'Bauchlage, Arme nach vorn gestreckt (Eintauchhaltung). Arme und Beine gleichzeitig anheben.',
    tech:'Langsam heben, 2 Sekunden oben halten, langsam absenken. Blick bleibt nach unten – kein Hohlkreuz. Genau die Haltung wie beim Gleiten nach dem Start.',
    warning:null
  },
  bauchmuskel: {
    name:'Bauchmuskeltest (LVT)',ico:'🏋️',cat:'kraft',unit:'Stufen',lvt:true,knieSafe:true,
    swimRelevance:'Rumpfkraft – Körperspannung in allen Schwimmlagen',
    desc:'Rückenlage, Beine 90° angewinkelt. Stufe 1: Arme vorgestreckt (1P). Stufe 2: Arme verschränkt (2P). Stufe 3: Stab hinter Kopf (3P).',
    tech:'Langsam aufrichten – kein Schwung! Füße bleiben auf dem Boden. Stufe 3 ist sehr anspruchsvoll – erst üben wenn Stufe 2 sicher klappt.',
    warning:null
  },
  rueckenhaltetest: {
    name:'Rückenhaltetest (LVT)',ico:'🦸',cat:'kraft',unit:'Sek.',lvt:true,knieSafe:true,
    swimRelevance:'Rückenstrecker-Ausdauer – Streamline über die gesamte Schwimmstrecke',
    desc:'Bauchlage auf erhöhtem Kasten. Oberkörper waagerecht halten, Arme in Eintauchhaltung nach vorn.',
    tech:'Blick nach unten – kein Hohlkreuz. Arme gestreckt wie beim Eintauchen. Ruhig atmen. Maximum beim LVT: 1 Minute 20 Sekunden.',
    warning:null
  },

  // ── BEINE / SCHNELLKRAFT ──────────────────────────────────────────
  schlussdreisprung: {
    name:'Schlussdreisprung (LVT)',ico:'🦘',cat:'schnell',unit:'Versuche',lvt:true,knieSafe:false,
    swimRelevance:'Explosivkraft der Beine – Startsprung und Abstoß von der Wand',
    desc:'Vor der Absprunglinie in leichter Hocke. Drei beidbeinige Sprünge ohne Pause, Arme schwingen mit.',
    tech:'Arme maximal einsetzen – sie geben bis zu 20% der Sprungweite. Drei Sprünge fließend ohne Halt. Weiche Landung auf beiden Beinen gleichzeitig.',
    warning:'Knieschmerzen? Diese Übung weglassen und durch Hip Drive (knieschonend) ersetzen.'
  },
  hip_drive: {
    name:'Hip Drive (knieschonend)',ico:'🦵',cat:'schnell',unit:'Wdh./Seite',lvt:false,knieSafe:true,
    swimRelevance:'Explosivkraft der Hüfte – Alternative zum Schlussdreisprung bei Knieproblemen',
    desc:'Versetzter Stand (ein Fuß vorn). Aus der Hüfte nach vorne beugen, dann explosiv aufrichten. Hüfte nach vorne treiben.',
    tech:'Knie bleibt leicht gebeugt – keine volle Streckung nötig. Fokus auf die Hüftstreckung, nicht auf das Knie. Empfohlen von USMS für Schwimmer mit Knieproblemen.',
    warning:null
  },
  squat_jump: {
    name:'Squat Jumps',ico:'🦘',cat:'schnell',unit:'Wdh.',lvt:false,knieSafe:false,
    swimRelevance:'Explosivkraft – Startsprung vom Block',
    desc:'Kniebeuge, dann explosiv hochspringen. Weiche Landung in der Kniebeuge.',
    tech:'Knie zeigen über die Zehen. Weich landen – Fersen zuerst, dann Knie beugen um den Aufprall abzufedern. Arme schwingen mit.',
    warning:'Knieschmerzen? Durch Hip Drive ersetzen.'
  },
  kniebeugen: {
    name:'Kniebeugen',ico:'🦵',cat:'kraft',unit:'Wdh.',lvt:false,knieSafe:false,
    swimRelevance:'Beingrundkraft – Abstoß von der Wand, Startsprung',
    desc:'Füße hüftbreit, Zehen leicht nach außen. Langsam in die Hocke, Oberschenkel parallel zum Boden.',
    tech:'Knie zeigen in Richtung der Zehen – nicht nach innen fallen lassen! Rücken gerade, Blick geradeaus. Gewicht auf den Fersen.',
    warning:'Knieschmerzen? Nur bis 60° beugen oder durch Glutebridge ersetzen.'
  },
  glutebridge: {
    name:'Gesäßbrücke (Glute Bridge)',ico:'🌉',cat:'kraft',unit:'Wdh.',lvt:false,knieSafe:true,
    swimRelevance:'Gesäß und Hüftstrecker – Kick-Kraft und Körperspannung',
    desc:'Rückenlage, Knie gebeugt, Füße flach. Hüfte anheben bis Körper gerade, Gesäß anspannen.',
    tech:'Knie zeigen nach außen – nicht nach innen fallen lassen. Oben 2 Sekunden halten. Besonders wichtig bei X-Beinen: Theraband über den Knien.',
    warning:null
  },
  ausfallschritte: {
    name:'Ausfallschritte',ico:'🦵',cat:'kraft',unit:'Wdh./Seite',lvt:false,knieSafe:false,
    swimRelevance:'Einbeinige Kraft – Gleichgewicht und Abstoß',
    desc:'Großer Schritt nach vorne. Beide Knie 90° beugen, hinteres Knie fast auf den Boden.',
    tech:'Vorderes Knie nicht über die Zehen. Oberkörper aufrecht. Gewicht gleichmäßig auf beiden Beinen.',
    warning:'Knieschmerzen? Durch Glutebridge oder Hip Drive ersetzen.'
  },

  // ── KOORDINATION / AKTIVIERUNG ────────────────────────────────────
  high_knees: {
    name:'High Knees',ico:'🏃',cat:'koord',unit:'Sek.',lvt:false,knieSafe:true,
    swimRelevance:'Aktivierung, Koordination – Aufwärmen vor dem Training',
    desc:'Auf der Stelle laufen, Knie abwechselnd hoch zur Brust ziehen. Arme schwingen mit.',
    tech:'Aufrecht bleiben – nicht nach vorne beugen. Auf den Fußballen landen, nicht auf der Ferse. Tempo langsam steigern.',
    warning:null
  },
  burpees: {
    name:'Burpees',ico:'⚡',cat:'koord',unit:'Wdh.',lvt:false,knieSafe:false,
    swimRelevance:'Ganzkörper-Kondition, Explosivkraft',
    desc:'Aus dem Stand in den Liegestütz, Liegestütz ausführen, zurück in den Stand, Sprung mit Armen nach oben.',
    tech:'Fließende Bewegung ohne Pause. Beim Liegestütz Körper gerade halten. Weiche Landung beim Sprung.',
    warning:'Knieschmerzen? Sprung weglassen – nur aufstehen statt springen.'
  },
  med_ball_slam: {
    name:'Medizinball-Slam',ico:'🏐',cat:'schnell',unit:'Wdh.',lvt:false,knieSafe:true,
    swimRelevance:'Explosiver Zug von oben – simuliert den Catch und Pull im Schwimmen',
    desc:'Medizinball über den Kopf heben, dann explosiv auf den Boden schmettern. Ball aufheben, wiederholen.',
    tech:'Arme gestreckt über dem Kopf – genau wie beim Eintauchen. Dann explosiv nach unten – wie der Catch. Rücken gerade beim Aufheben.',
    warning:null
  },

  // ── BEWEGLICHKEIT (schwimmerspezifisch) ──────────────────────────
  schulterbeweglichkeit: {
    name:'Schulterbeweglichkeit (LVT)',ico:'🔄',cat:'beweg',unit:'cm',lvt:true,knieSafe:true,
    swimRelevance:'Schulterflexibilität – Überkopf-Bewegung in Kraul, Rücken, Schmetterling',
    desc:'Bauchlage, Stab schulterbreit in gestreckten Armen. Arme so hoch wie möglich anheben, Abstand Stab-Boden messen.',
    tech:'Stirn und Oberkörper berühren den Boden. Handgelenke nicht abknicken. Stab parallel zum Boden halten. Messung zwischen den Handgelenken.',
    warning:null
  },
  rumpfbeugen: {
    name:'Rumpfbeugen (LVT)',ico:'🤸',cat:'beweg',unit:'Punkte',lvt:true,knieSafe:true,
    swimRelevance:'Rumpfbeweglichkeit – Körperrotation und Streamline',
    desc:'Aus dem Streckstand langsam nach vorne beugen. Knie gestreckt. Fingerspitzen (1P), Faust (2P), Handfläche (3P).',
    tech:'Langsam und gleichmäßig ausatmen beim Beugen. Knie müssen gestreckt bleiben – das ist die Herausforderung. Position 3 Sekunden halten.',
    warning:null
  },
  fussstreckung: {
    name:'Fußstreckung & -beugung (LVT)',ico:'🦶',cat:'beweg',unit:'Grad',lvt:true,knieSafe:true,
    swimRelevance:'Sprunggelenk-Beweglichkeit – Kick-Effizienz in allen Lagen',
    desc:'Im Strecksitz Fuß maximal strecken (Plantarflexion) und anziehen (Dorsalflexion). Winkel messen.',
    tech:'Fuß ohne Einwärts- oder Auswärtsdrehung bewegen – gerade strecken und anziehen. Schlechterer Fuß wird gemessen. Endstellung halten.',
    warning:null
  },
  huefte_dehnen: {
    name:'Hüftbeuger-Dehnung',ico:'🤸',cat:'beweg',unit:'Sek./Seite',lvt:false,knieSafe:true,
    swimRelevance:'Hüftflexibilität – Körperlage im Wasser, Kick-Amplitude',
    desc:'Knie auf dem Boden, hinteres Bein gestreckt. Hüfte nach vorne schieben bis Dehnung spürbar.',
    tech:'Rücken gerade – nicht ins Hohlkreuz fallen. Langsam einatmen beim Dehnen. Becken gerade halten, nicht verdrehen.',
    warning:null
  },
  schulter_quer: {
    name:'Schulter-Querdehnung',ico:'💪',cat:'beweg',unit:'Sek./Arm',lvt:false,knieSafe:true,
    swimRelevance:'Schulterkapsel-Dehnung – Verletzungsprävention für Schwimmer',
    desc:'Arm quer vor der Brust, mit dem anderen Arm heranziehen. Schulter auf Höhe halten.',
    tech:'Schulter entspannt lassen – nicht hochziehen. 30 Sekunden halten. Besonders wichtig nach intensivem Schultertraining.',
    warning:null
  },
  oberschenkel: {
    name:'Oberschenkel-Dehnung',ico:'🦵',cat:'beweg',unit:'Sek./Bein',lvt:false,knieSafe:true,
    swimRelevance:'Quadrizeps-Flexibilität – Kick-Beweglichkeit',
    desc:'Im Stehen ein Bein nach hinten anwinkeln, Fuß zur Gesäßseite ziehen. Knie zeigt nach unten.',
    tech:'Knie zeigt nach unten – nicht zur Seite. Hüfte gerade halten. An einer Wand festhalten wenn nötig.',
    warning:null
  },
  brustdehnung: {
    name:'Brustöffnung / Pec-Stretch',ico:'🫁',cat:'beweg',unit:'Sek.',lvt:false,knieSafe:true,
    swimRelevance:'Brustmuskel-Dehnung – Gegenbewegung zum Schwimmen, Haltungskorrektur',
    desc:'Arme seitlich auf Schulterhöhe, Hände an einem Türrahmen. Körper langsam nach vorne lehnen.',
    tech:'Langsam einatmen beim Öffnen. Schultern nach unten und hinten. Besonders wichtig für Schmetterling-Schwimmer.',
    warning:null
  },
  it_band: {
    name:'IT-Band Dehnung',ico:'🦵',cat:'beweg',unit:'Sek./Seite',lvt:false,knieSafe:true,
    swimRelevance:'Außenseite Oberschenkel – häufige Ursache von Knieschmerzen bei Schwimmern',
    desc:'Im Stehen ein Bein hinter das andere kreuzen. Zur Seite lehnen bis Dehnung an der Außenseite spürbar.',
    tech:'Langsam zur Seite lehnen. 30 Sekunden halten. Besonders wichtig bei Knieschmerzen.',
    warning:null
  }
};

// ── ATHLETIK TEMPLATES (verfeinert) ──────────────────────────────────────────
const ATHLETIK_TEMPLATES = {
  15: {
    lvt_kraft: {
      name:'LVT-Kraft Kompakt (15 min)',
      desc:'Die wichtigsten LVT-Kraftübungen – Oberkörper und Rumpf',
      warmup:3,cooldown:2,
      blocks:[
        {name:'Block 1: Oberkörper-Zug',
         exs:[{k:'klimmzuege',s:3,r:3,rest:90},{k:'lat_pulldown_band',s:3,r:12,rest:45}]},
        {name:'Block 2: Rumpf',
         exs:[{k:'hollow_body',s:3,r:20,rest:30},{k:'superman',s:3,r:10,rest:30}]}
      ]
    },
    lvt_beweg: {
      name:'LVT-Beweglichkeit Kompakt (15 min)',
      desc:'Alle drei LVT-Beweglichkeitstests – schwimmerspezifisch',
      warmup:2,cooldown:2,
      blocks:[
        {name:'Block 1: Schulter & Rumpf',
         exs:[{k:'schulterbeweglichkeit',s:3,r:1,rest:30},{k:'rumpfbeugen',s:3,r:1,rest:20}]},
        {name:'Block 2: Fuß & Hüfte',
         exs:[{k:'fussstreckung',s:2,r:1,rest:20},{k:'huefte_dehnen',s:2,r:30,rest:15}]}
      ]
    },
    knieschonend: {
      name:'Knieschonend Kompakt (15 min)',
      desc:'Vollständiges Training ohne Kniebelastung – sicher bei Knieproblemen',
      warmup:3,cooldown:2,
      blocks:[
        {name:'Block 1: Oberkörper',
         exs:[{k:'liegestuetze',s:3,r:10,rest:60},{k:'rudern_band',s:3,r:12,rest:45}]},
        {name:'Block 2: Rumpf & Hüfte',
         exs:[{k:'glutebridge',s:3,r:15,rest:30},{k:'dead_bug',s:3,r:8,rest:30}]}
      ]
    }
  },
  30: {
    lvt_komplett: {
      name:'LVT-Komplett (30 min)',
      desc:'Alle LVT-Disziplinen – Kraft, Schnellkraft und Beweglichkeit',
      warmup:5,cooldown:5,
      blocks:[
        {name:'Block 1: Oberkörper-Kraft',
         exs:[{k:'liegestuetze',s:3,r:12,rest:60},{k:'klimmzuege',s:3,r:4,rest:90}]},
        {name:'Block 2: Rumpf',
         exs:[{k:'bauchmuskel',s:2,r:1,rest:30},{k:'rueckenhaltetest',s:2,r:45,rest:60}]},
        {name:'Block 3: Schnellkraft',
         exs:[{k:'schlussdreisprung',s:3,r:1,rest:60}]},
        {name:'Block 4: Beweglichkeit',
         exs:[{k:'schulterbeweglichkeit',s:2,r:1,rest:30},{k:'rumpfbeugen',s:2,r:1,rest:20},{k:'fussstreckung',s:2,r:1,rest:20}]}
      ]
    },
    knieschonend_komplett: {
      name:'Knieschonend Komplett (30 min)',
      desc:'Vollständiges Schwimmer-Training ohne Kniebelastung',
      warmup:5,cooldown:5,
      blocks:[
        {name:'Block 1: Zug-Kraft (Lat)',
         exs:[{k:'klimmzuege',s:3,r:4,rest:90},{k:'lat_pulldown_band',s:3,r:12,rest:45},{k:'rudern_band',s:3,r:12,rest:45}]},
        {name:'Block 2: Drück-Kraft',
         exs:[{k:'liegestuetze',s:3,r:12,rest:60},{k:'dips',s:3,r:10,rest:45}]},
        {name:'Block 3: Rumpf & Streamline',
         exs:[{k:'hollow_body',s:3,r:25,rest:30},{k:'dead_bug',s:3,r:8,rest:30},{k:'plank',s:3,r:30,rest:30}]},
        {name:'Block 4: Hüfte & Gesäß',
         exs:[{k:'glutebridge',s:3,r:15,rest:30},{k:'hip_drive',s:3,r:6,rest:45}]}
      ]
    },
    schulter_fokus: {
      name:'Schulter-Fokus (30 min)',
      desc:'Schulterprävention und -kraft – für alle Schwimmlagen',
      warmup:5,cooldown:5,
      blocks:[
        {name:'Block 1: Schulter-Prävention',
         exs:[{k:'schulter_rotation_band',s:3,r:15,rest:30},{k:'rudern_band',s:3,r:12,rest:45}]},
        {name:'Block 2: Schulter-Kraft',
         exs:[{k:'klimmzuege',s:4,r:4,rest:90},{k:'lat_pulldown_band',s:4,r:12,rest:45}]},
        {name:'Block 3: Rumpf-Stabilität',
         exs:[{k:'hollow_body',s:3,r:25,rest:30},{k:'seitstütz',s:3,r:30,rest:30}]},
        {name:'Block 4: Schulter-Dehnen',
         exs:[{k:'schulterbeweglichkeit',s:3,r:1,rest:30},{k:'schulter_quer',s:3,r:30,rest:15},{k:'brustdehnung',s:2,r:30,rest:15}]}
      ]
    },
    schnellkraft: {
      name:'Schnellkraft (30 min)',
      desc:'Explosivkraft für Start und Wende – mit knieschonender Alternative',
      warmup:6,cooldown:4,
      blocks:[
        {name:'Block 1: Aktivierung',
         exs:[{k:'high_knees',s:3,r:30,rest:30},{k:'hip_drive',s:3,r:6,rest:45}]},
        {name:'Block 2: Explosivkraft',
         exs:[{k:'schlussdreisprung',s:4,r:1,rest:60},{k:'squat_jump',s:3,r:8,rest:45}]},
        {name:'Block 3: Oberkörper-Explosiv',
         exs:[{k:'liegestuetze',s:3,r:12,rest:60},{k:'med_ball_slam',s:3,r:8,rest:45}]},
        {name:'Block 4: Dehnen',
         exs:[{k:'huefte_dehnen',s:2,r:30,rest:15},{k:'oberschenkel',s:2,r:30,rest:15}]}
      ]
    }
  },
  45: {
    lvt_simulation: {
      name:'LVT-Simulation (45 min)',
      desc:'Vollständige Simulation aller LVT-Disziplinen in Wettkampf-Reihenfolge',
      warmup:8,cooldown:7,
      blocks:[
        {name:'Station 1: Liegestütze (LVT)',exs:[{k:'liegestuetze',s:1,r:20,rest:120}]},
        {name:'Station 2: Schlussdreisprung (LVT)',exs:[{k:'schlussdreisprung',s:3,r:1,rest:60}]},
        {name:'Station 3: Klimmzüge (LVT)',exs:[{k:'klimmzuege',s:1,r:6,rest:120}]},
        {name:'Station 4: Bauchmuskeltest (LVT)',exs:[{k:'bauchmuskel',s:1,r:1,rest:60}]},
        {name:'Station 5: Rückenhaltetest (LVT)',exs:[{k:'rueckenhaltetest',s:1,r:60,rest:60}]},
        {name:'Station 6: Beweglichkeit (LVT)',exs:[{k:'schulterbeweglichkeit',s:1,r:1,rest:30},{k:'rumpfbeugen',s:1,r:1,rest:30},{k:'fussstreckung',s:1,r:1,rest:30}]}
      ]
    },
    knieschonend_intensiv: {
      name:'Knieschonend Intensiv (45 min)',
      desc:'Anspruchsvolles Training komplett ohne Kniebelastung',
      warmup:7,cooldown:8,
      blocks:[
        {name:'Block 1: Zug-Kraft',
         exs:[{k:'klimmzuege',s:4,r:5,rest:90},{k:'lat_pulldown_band',s:4,r:12,rest:45},{k:'rudern_band',s:3,r:12,rest:45}]},
        {name:'Block 2: Drück-Kraft',
         exs:[{k:'liegestuetze',s:4,r:15,rest:60},{k:'dips',s:3,r:12,rest:45}]},
        {name:'Block 3: Rumpf-Komplex',
         exs:[{k:'hollow_body',s:4,r:30,rest:30},{k:'dead_bug',s:3,r:10,rest:30},{k:'plank',s:3,r:45,rest:30},{k:'seitstütz',s:3,r:30,rest:30}]},
        {name:'Block 4: Hüfte & Schulter',
         exs:[{k:'glutebridge',s:4,r:15,rest:30},{k:'hip_drive',s:3,r:8,rest:45},{k:'schulter_rotation_band',s:3,r:15,rest:30}]},
        {name:'Block 5: Beweglichkeit',
         exs:[{k:'schulterbeweglichkeit',s:2,r:1,rest:30},{k:'huefte_dehnen',s:2,r:30,rest:15},{k:'it_band',s:2,r:30,rest:15}]}
      ]
    },
    kraft_ausdauer: {
      name:'Kraft-Ausdauer (45 min)',
      desc:'Hohe Wiederholungszahlen, kurze Pausen – Kraftausdauer wie beim LVT',
      warmup:7,cooldown:8,
      blocks:[
        {name:'Runde 1 (volle Kraft)',
         exs:[{k:'liegestuetze',s:1,r:15,rest:30},{k:'glutebridge',s:1,r:20,rest:30},{k:'hollow_body',s:1,r:25,rest:30},{k:'rudern_band',s:1,r:15,rest:30}]},
        {name:'Runde 2 (Ausdauer)',
         exs:[{k:'liegestuetze',s:1,r:12,rest:30},{k:'dead_bug',s:1,r:10,rest:30},{k:'plank',s:1,r:45,rest:30},{k:'lat_pulldown_band',s:1,r:15,rest:30}]},
        {name:'Runde 3 (Finish)',
         exs:[{k:'liegestuetze',s:1,r:10,rest:30},{k:'seitstütz',s:1,r:30,rest:30},{k:'superman',s:1,r:12,rest:30},{k:'hip_drive',s:1,r:8,rest:30}]},
        {name:'Abschluss: Dehnen',
         exs:[{k:'huefte_dehnen',s:2,r:30,rest:15},{k:'schulter_quer',s:2,r:30,rest:15},{k:'brustdehnung',s:2,r:30,rest:15}]}
      ]
    }
  },
  60: {
    lvt_intensiv: {
      name:'LVT-Intensiv (60 min)',
      desc:'Maximale Vorbereitung – alle LVT-Disziplinen mit voller Intensität',
      warmup:10,cooldown:10,
      blocks:[
        {name:'Block 1: Oberkörper-Kraft',
         exs:[{k:'liegestuetze',s:4,r:15,rest:60},{k:'klimmzuege',s:4,r:5,rest:90},{k:'dips',s:3,r:12,rest:45}]},
        {name:'Block 2: Rücken & Schulter',
         exs:[{k:'rudern_band',s:4,r:12,rest:45},{k:'lat_pulldown_band',s:4,r:12,rest:45},{k:'schulter_rotation_band',s:3,r:15,rest:30}]},
        {name:'Block 3: Rumpf & Streamline',
         exs:[{k:'bauchmuskel',s:3,r:1,rest:30},{k:'rueckenhaltetest',s:2,r:60,rest:60},{k:'hollow_body',s:3,r:30,rest:30},{k:'dead_bug',s:3,r:10,rest:30}]},
        {name:'Block 4: Beine & Schnellkraft',
         exs:[{k:'schlussdreisprung',s:5,r:1,rest:60},{k:'squat_jump',s:3,r:10,rest:45},{k:'glutebridge',s:3,r:15,rest:30}]},
        {name:'Block 5: Beweglichkeit LVT',
         exs:[{k:'schulterbeweglichkeit',s:3,r:1,rest:30},{k:'rumpfbeugen',s:3,r:1,rest:20},{k:'fussstreckung',s:3,r:1,rest:20},{k:'huefte_dehnen',s:2,r:30,rest:15}]}
      ]
    },
    knieschonend_60: {
      name:'Knieschonend Komplett (60 min)',
      desc:'60 Minuten Schwimmer-Training ohne jede Kniebelastung',
      warmup:10,cooldown:10,
      blocks:[
        {name:'Block 1: Zug-Kraft (Lat & Rücken)',
         exs:[{k:'klimmzuege',s:5,r:5,rest:90},{k:'lat_pulldown_band',s:4,r:12,rest:45},{k:'rudern_band',s:4,r:12,rest:45}]},
        {name:'Block 2: Drück-Kraft & Schulter',
         exs:[{k:'liegestuetze',s:4,r:15,rest:60},{k:'dips',s:3,r:12,rest:45},{k:'schulter_rotation_band',s:3,r:15,rest:30}]},
        {name:'Block 3: Rumpf-Komplex',
         exs:[{k:'hollow_body',s:4,r:30,rest:30},{k:'dead_bug',s:4,r:10,rest:30},{k:'plank',s:3,r:45,rest:30},{k:'seitstütz',s:3,r:30,rest:30},{k:'superman',s:3,r:12,rest:30}]},
        {name:'Block 4: Hüfte & Explosivkraft',
         exs:[{k:'glutebridge',s:4,r:15,rest:30},{k:'hip_drive',s:4,r:8,rest:45},{k:'med_ball_slam',s:3,r:8,rest:45}]},
        {name:'Block 5: Beweglichkeit komplett',
         exs:[{k:'schulterbeweglichkeit',s:3,r:1,rest:30},{k:'rumpfbeugen',s:3,r:1,rest:20},{k:'fussstreckung',s:2,r:1,rest:20},{k:'huefte_dehnen',s:2,r:30,rest:15},{k:'it_band',s:2,r:30,rest:15},{k:'brustdehnung',s:2,r:30,rest:15}]}
      ]
    }
  }
};

// ── ATHLETIK GENERATOR UI ─────────────────────────────────────────────────────
var currentWorkout=null;

function renderAthletikGenerator(){
  var container=document.getElementById('athletik-generator');
  if(!container)return;
  container.innerHTML=
    '<div class="card" style="margin-bottom:14px">'+
      '<h4 style="font-size:.95rem;font-weight:800;margin-bottom:4px">Athletik-Training Generator</h4>'+
      '<p class="muted" style="margin-bottom:14px">Strukturiertes Schwimmer-Landtraining mit Pausen. Knieschonende Varianten verfuegbar.</p>'+
      '<div class="fsec">'+
        '<label class="label req">Trainingsdauer</label>'+
        '<div class="chips" id="at-dur-chips">'+
          '<button type="button" class="chip" data-v="15" onclick="pickAtDur(this)">15 min</button>'+
          '<button type="button" class="chip" data-v="30" onclick="pickAtDur(this)">30 min</button>'+
          '<button type="button" class="chip" data-v="45" onclick="pickAtDur(this)">45 min</button>'+
          '<button type="button" class="chip" data-v="60" onclick="pickAtDur(this)">60 min</button>'+
        '</div>'+
        '<input type="hidden" id="at-dur" value=""/>'+
      '</div>'+
      '<div class="fsec" id="at-focus-section" style="display:none">'+
        '<label class="label req">Schwerpunkt</label>'+
        '<div id="at-focus-chips" class="chips"></div>'+
        '<input type="hidden" id="at-focus" value=""/>'+
      '</div>'+
      '<button class="btn full lg" id="at-generate-btn" onclick="generateWorkout()" style="display:none">Training generieren</button>'+
    '</div>'+
    '<div id="at-workout-display"></div>';
}

var FOCUS_LABELS={
  lvt_kraft:'LVT-Kraft',lvt_beweg:'LVT-Beweglichkeit',knieschonend:'Knieschonend',
  lvt_komplett:'LVT-Komplett',knieschonend_komplett:'Knieschonend Komplett',
  schulter_fokus:'Schulter-Fokus',schnellkraft:'Schnellkraft',
  lvt_simulation:'LVT-Simulation',knieschonend_intensiv:'Knieschonend Intensiv',
  kraft_ausdauer:'Kraft-Ausdauer',lvt_intensiv:'LVT-Intensiv',knieschonend_60:'Knieschonend 60 min'
};
var FOCUS_ICONS={
  lvt_kraft:'LVT',lvt_beweg:'LVT',knieschonend:'Knie OK',
  lvt_komplett:'LVT',knieschonend_komplett:'Knie OK',
  schulter_fokus:'Schulter',schnellkraft:'Explosiv',
  lvt_simulation:'LVT Sim',knieschonend_intensiv:'Knie OK',
  kraft_ausdauer:'Ausdauer',lvt_intensiv:'LVT',knieschonend_60:'Knie OK'
};

function pickAtDur(btn){
  document.querySelectorAll('#at-dur-chips .chip').forEach(function(c){c.classList.remove('sel');});
  btn.classList.add('sel');
  var dur=btn.dataset.v;
  document.getElementById('at-dur').value=dur;
  document.getElementById('at-focus').value='';
  var templates=ATHLETIK_TEMPLATES[parseInt(dur)]||{};
  var focusSection=document.getElementById('at-focus-section');
  var focusChips=document.getElementById('at-focus-chips');
  var genBtn=document.getElementById('at-generate-btn');
  var chips='';
  Object.keys(templates).forEach(function(k){
    var isKnieSafe=k.indexOf('knieschonend')>=0;
    chips+='<button type="button" class="chip" data-v="'+k+'" onclick="pickAtFocus(this)">'+
      (isKnieSafe?'<span style="font-size:.6rem;background:var(--green-l);color:var(--green);padding:1px 4px;border-radius:3px;margin-right:3px">Knie OK</span>':'')+
      (FOCUS_LABELS[k]||k)+'</button>';
  });
  focusChips.innerHTML=chips;
  focusSection.style.display='';
  genBtn.style.display='none';
  document.getElementById('at-workout-display').innerHTML='';
  haptic();
}

function pickAtFocus(btn){
  document.querySelectorAll('#at-focus-chips .chip').forEach(function(c){c.classList.remove('sel');});
  btn.classList.add('sel');
  document.getElementById('at-focus').value=btn.dataset.v;
  document.getElementById('at-generate-btn').style.display='';
  haptic();
}

function generateWorkout(){
  var dur=parseInt(document.getElementById('at-dur').value);
  var focus=document.getElementById('at-focus').value;
  if(!dur||!focus)return;
  var template=ATHLETIK_TEMPLATES[dur]&&ATHLETIK_TEMPLATES[dur][focus];
  if(!template){showToast('Kein Training gefunden.');return;}
  currentWorkout={dur:dur,focus:focus,template:template};
  renderWorkout(template);
  haptic();
}

function renderWorkout(t){
  var container=document.getElementById('at-workout-display');
  if(!container)return;
  var totalExs=t.blocks.reduce(function(s,b){return s+b.exs.length;},0);
  var workMin=t.dur-(t.warmup||0)-(t.cooldown||0);
  var isKnieSafe=t.name.toLowerCase().indexOf('knieschonend')>=0;

  var html=
    '<div style="background:var(--hero);border-radius:var(--r-xl);padding:18px;margin-bottom:12px;color:#fff">'+
      '<div style="font-size:1rem;font-weight:800;margin-bottom:4px">'+t.name+'</div>'+
      '<div style="font-size:.78rem;color:rgba(255,255,255,.8);margin-bottom:10px">'+t.desc+'</div>'+
      (isKnieSafe?'<div style="background:rgba(0,200,83,.2);border:1px solid rgba(0,200,83,.3);border-radius:8px;padding:5px 10px;font-size:.72rem;font-weight:700;color:#00E676;margin-bottom:10px">Knieschonend – sicher bei Knieproblemen</div>':'')+
      '<div style="display:flex;gap:12px">'+
        '<div style="text-align:center"><div style="font-size:1.2rem;font-weight:800">'+(t.warmup||0)+'</div><div style="font-size:.6rem;opacity:.75">min Aufwaermen</div></div>'+
        '<div style="text-align:center"><div style="font-size:1.2rem;font-weight:800">'+workMin+'</div><div style="font-size:.6rem;opacity:.75">min Training</div></div>'+
        '<div style="text-align:center"><div style="font-size:1.2rem;font-weight:800">'+(t.cooldown||0)+'</div><div style="font-size:.6rem;opacity:.75">min Abkuehlen</div></div>'+
        '<div style="text-align:center"><div style="font-size:1.2rem;font-weight:800">'+totalExs+'</div><div style="font-size:.6rem;opacity:.75">Uebungen</div></div>'+
      '</div>'+
    '</div>'+
    '<div class="card" style="border-left:4px solid var(--amber);margin-bottom:10px">'+
      '<div style="font-size:.78rem;font-weight:800;color:var(--amber);margin-bottom:6px">AUFWAERMEN - '+(t.warmup||5)+' Minuten</div>'+
      '<div style="font-size:.8rem;color:var(--t2);line-height:1.7">'+
        '- Armkreisen vorwaerts + rueckwaerts (je 30 Sek.)<br>'+
        '- Schultern lockern, Nacken dehnen (30 Sek.)<br>'+
        '- Huefte kreisen (30 Sek.)<br>'+
        '- High Knees locker (30 Sek.)<br>'+
        '- Leichte Kniebeugen oder Glutebridge (10 Wdh.)'+
      '</div>'+
    '</div>';

  t.blocks.forEach(function(block){
    html+='<div class="card" style="border-left:4px solid var(--blue);margin-bottom:10px">'+
      '<div style="font-size:.78rem;font-weight:800;color:var(--blue);margin-bottom:8px">'+block.name+'</div>';
    block.exs.forEach(function(ex){
      var def=ATHLETIK_EXERCISES[ex.k];
      if(!def)return;
      var isLVT=def.lvt;
      var isKS=def.knieSafe;
      html+='<div style="padding:10px 0;border-bottom:1px solid var(--border)">'+
        '<div style="display:flex;align-items:flex-start;gap:10px;margin-bottom:5px">'+
          '<span style="font-size:1.2rem;flex-shrink:0">'+def.ico+'</span>'+
          '<div style="flex:1">'+
            '<div style="font-size:.83rem;font-weight:700">'+def.name+
              (isLVT?'<span style="font-size:.6rem;background:var(--amber-l);color:var(--amber);padding:1px 5px;border-radius:4px;margin-left:5px;font-weight:700">LVT</span>':'')+
              (isKS?'<span style="font-size:.6rem;background:var(--green-l);color:var(--green);padding:1px 5px;border-radius:4px;margin-left:3px;font-weight:700">Knie OK</span>':'')+
            '</div>'+
            '<div style="font-size:.7rem;color:var(--blue);font-weight:600;margin-top:2px">'+
              (ex.s>1?ex.s+' Saetze x ':'')+ex.r+' '+def.unit+
              (ex.rest?' | Pause '+ex.rest+'s':'')+
            '</div>'+
          '</div>'+
        '</div>'+
        '<div style="font-size:.78rem;color:var(--t2);line-height:1.5;margin-bottom:4px">'+def.desc+'</div>'+
        '<div style="font-size:.73rem;color:var(--tm);padding:5px 8px;background:var(--subtle);border-radius:7px;border-left:3px solid var(--blue)">'+
          '<strong>Technik:</strong> '+def.tech+
        '</div>'+
        (def.swimRelevance?'<div style="font-size:.68rem;color:var(--blue);margin-top:4px;font-style:italic">Schwimm-Relevanz: '+def.swimRelevance+'</div>':'')+
        (def.warning?'<div style="font-size:.68rem;color:var(--red);margin-top:4px;font-weight:600">Achtung: '+def.warning+'</div>':'')+
      '</div>';
    });
    html+='</div>';
  });

  html+=
    '<div class="card" style="border-left:4px solid var(--green);margin-bottom:10px">'+
      '<div style="font-size:.78rem;font-weight:800;color:var(--green);margin-bottom:6px">ABKUEHLEN - '+(t.cooldown||5)+' Minuten</div>'+
      '<div style="font-size:.8rem;color:var(--t2);line-height:1.7">'+
        '- Huefte dehnen (je 30 Sek.)<br>'+
        '- Schulter-Querdehnung (je 30 Sek.)<br>'+
        '- Brustdehnung am Tuerrahmen (30 Sek.)<br>'+
        '- Oberschenkel dehnen (je 30 Sek.)<br>'+
        '- Tief einatmen, Koerper entspannen'+
      '</div>'+
    '</div>'+
    '<button class="btn full" onclick="saveWorkoutAsEntry()" style="margin-bottom:8px">Als Training speichern</button>'+
    '<button class="btn2 full" onclick="generateWorkout()">Neues Training generieren</button>';

  container.innerHTML=html;
}

async function saveWorkoutAsEntry(){
  if(!currentWorkout)return;
  var t=currentWorkout.template;
  var sets=[];
  t.blocks.forEach(function(b){
    b.exs.forEach(function(ex){
      var def=ATHLETIK_EXERCISES[ex.k];
      sets.push({reps:ex.s||1,distance:ex.r+' '+(def?def.unit:'Wdh.'),stroke:def?def.name:ex.k,zone:'',restSec:ex.rest||0,equipment:'',note:def?def.swimRelevance:''});
    });
  });
  var id=genId();
  var entry={id:id,date:today(),type:'Athletiktraining',unit:'absolviert',durationMin:currentWorkout.dur,load:7,wellbeing:3,planCompleted:'ja',km:null,focus:t.name,strokes:[],reflGood:'',reflHard:'',reflNext:'',note:t.desc,sets:sets,createdAt:new Date().toISOString()};
  var pts=calcPts(entry);entry.pointsEarned=pts.total;
  await dbPut('training',entry);
  if(pts.total>0)await logPts(pts.reasons,id,'training',today());
  await checkWeekBonus(today());
  var newBadges=await checkBadges();
  haptic();
  showSaveModal(pts,newBadges,'Athletik-Training gespeichert!');
  goTo('heute');
}




// Stage 4: competition and personal-best implementations are loaded from js/modules/.

// Stage 6: training, gamification and backup loaded from js/modules/.

// Stage 8: navigation, dashboard and progress loaded from dedicated files.
