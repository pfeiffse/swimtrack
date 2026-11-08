# Stage 4 – Wettkampf und Bestzeiten als Fachmodule

## Module
- `js/modules/competition.js`: Startformular, Splits, validiertes Speichern, Verlauf und Löschen.
- `js/modules/personal-bests.js`: PB-Darstellung, Kurz-/Langbahn-Matrix, Quellenart und typische Wettkampfstrecken.

`app.js` enthält diese Implementierungen nicht mehr. Wettkampfanalyse und Wettkampfvorbereitung verbleiben zunächst in `app.js`, weil sie eigene spätere Module werden.

## Ladefolge
Core/Data → `app.js` → `competition.js` → `personal-bests.js`. Die PB-v4.1-Kompatibilitätswrapper werden dadurch erst nach der Wettkampflogik installiert.
