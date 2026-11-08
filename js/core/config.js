'use strict';
// SwimTrack Stage 10 - zentrale unveränderliche Konfiguration.
// ── CONSTANTS ─────────────────────────────────────────────────────────────────
const LEVELS=[{num:1,name:'Einstieg',min:0},{num:2,name:'Rhythmus',min:50},{num:3,name:'Technik',min:150},{num:4,name:'Ausdauer',min:300},{num:5,name:'Fokus',min:500},{num:6,name:'Entwicklung',min:750},{num:7,name:'Wettkampfstärke',min:1050},{num:8,name:'Leistungsweg',min:1400},{num:9,name:'Bestform',min:1800},{num:10,name:'Champion',min:2300}];
const BADGE_DEFS=[
  {key:'first_entry',ico:'🌊',name:'Erster Eintrag',desc:'Ersten Trainingseintrag gespeichert',chk:s=>s.entries>=1,prog:s=>({c:Math.min(s.entries,1),m:1})},
  {key:'first_week',ico:'📅',name:'Erste vollständige Woche',desc:'Eine vollständige Woche dokumentiert',chk:s=>s.weeks>=1,prog:s=>({c:Math.min(s.weeks,1),m:1})},
  {key:'three_weeks',ico:'🗓️',name:'Drei vollständige Wochen',desc:'Drei Wochen dokumentiert',chk:s=>s.weeks>=3,prog:s=>({c:Math.min(s.weeks,3),m:3})},
  {key:'ten_entries',ico:'🔟',name:'10 Trainingseinträge',desc:'Zehn Einheiten dokumentiert',chk:s=>s.entries>=10,prog:s=>({c:Math.min(s.entries,10),m:10})},
  {key:'25_entries',ico:'🥈',name:'25 Trainingseinträge',desc:'25 Einheiten dokumentiert',chk:s=>s.entries>=25,prog:s=>({c:Math.min(s.entries,25),m:25})},
  {key:'50_entries',ico:'🥇',name:'50 Trainingseinträge',desc:'50 Einheiten dokumentiert',chk:s=>s.entries>=50,prog:s=>({c:Math.min(s.entries,50),m:50})},
  {key:'first_comp',ico:'🏆',name:'Erste Wettkampfdoku',desc:'Ersten Wettkampf dokumentiert',chk:s=>s.comps>=1,prog:s=>({c:Math.min(s.comps,1),m:1})},
  {key:'first_pb',ico:'⏱️',name:'Erste persönliche Bestzeit',desc:'Erste persönliche Bestzeit erzielt',chk:s=>s.pbs>=1,prog:s=>({c:Math.min(s.pbs,1),m:1})},
  {key:'three_pbs',ico:'🎯',name:'Drei persönliche Bestzeiten',desc:'Drei persönliche Bestzeiten erzielt',chk:s=>s.pbs>=3,prog:s=>({c:Math.min(s.pbs,3),m:3})},
  {key:'refl_pro',ico:'📝',name:'Reflexionsprofi',desc:'10 Einträge mit Reflexion',chk:s=>s.reflEntries>=10,prog:s=>({c:Math.min(s.reflEntries,10),m:10})},
  {key:'regen_aware',ico:'💙',name:'Regeneration im Blick',desc:'5 Regenerationseinheiten',chk:s=>s.regenEntries>=5,prog:s=>({c:Math.min(s.regenEntries,5),m:5})},
  {key:'streak_7',ico:'🔥',name:'7-Tage-Streak',desc:'7 Tage Streak',chk:s=>s.dayStreak>=7,prog:s=>({c:Math.min(s.dayStreak,7),m:7})},
  {key:'streak_30',ico:'⚡',name:'30-Tage-Streak',desc:'30 Tage Streak',chk:s=>s.dayStreak>=30,prog:s=>({c:Math.min(s.dayStreak,30),m:30})},
  {key:'lvt_done',ico:'🏅',name:'LVT-Vorbereitung',desc:'LVT-Programm abgeschlossen',chk:s=>s.lvtDays>=28,prog:s=>({c:Math.min(s.lvtDays||0,28),m:28})}
];
const TYPE_ICONS={'Wassertraining':'🏊','Techniktraining':'🎯','Krafttraining':'💪','Athletiktraining':'🏃','Ausdauertraining':'❤️','Beweglichkeit':'🤸','Regeneration':'💙','Wettkampf':'🏆','Sonstiges':'📝'};
const CHART_COLORS=['#0066FF','#00C2E0','#00C853','#FF8F00','#9C27B0','#F44336','#FF5722','#607D8B'];
