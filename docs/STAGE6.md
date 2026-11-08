# Stage 6 – Training, Gamification und Backup

## Neue Fachmodule
- `training.js`: Trainingsformular, Sets, Speichern, Bearbeiten, Löschen und Schnellprotokoll.
- `gamification.js`: Statistikgrundlagen, Punkte, Wochenbonus, Badges, Erfolge, Punkteprotokoll sowie Save-/Confirm-Modals.
- `backup.js`: JSON-Export, CSV-Export und vollständiger lokaler Reset.

Die drei Implementierungsblöcke wurden aus `app.js` entfernt. IndexedDB und Datenmodell bleiben unverändert.

## Ladefolge
Data/Core → `app.js` → `gamification.js` → `training.js` → `backup.js` → Wettkampfmodule.
