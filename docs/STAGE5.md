# Stage 5 – Analyse und Wettkampfvorbereitung

## Neue Fachmodule
- `js/modules/competition-analysis.js`: Pace-Analyse, Analyse-Seite, PB-/Wettkampfvergleich und Analyse-Diagramme.
- `js/modules/competition-preparation.js`: Vorbereitungsansicht, Technik-/Streckentipps, Warm-up-Phasen und Countdown-Timer.

Beide Blöcke wurden aus `app.js` entfernt. Training, Erfolge, LVT/Physio, Athletik und PWA-Bootstrap verbleiben vorerst dort.

## Ladefolge
Data/Core → `app.js` → `competition.js` → `personal-bests.js` → `competition-analysis.js` → `competition-preparation.js`.

Das Datenmodell und IndexedDB bleiben unverändert.
