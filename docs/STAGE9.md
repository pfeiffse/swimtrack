# Stage 9 – Athletikmodul

## Neues Fachmodul
`js/modules/athletics.js` enthält den vollständigen bisherigen Athletikbereich: Übungskatalog, Templates, Fokusdefinitionen, Generator, Workout-Darstellung und Speichern als Trainingseintrag.

Der Block wurde vollständig aus `app.js` entfernt. Datenmodell und IndexedDB bleiben unverändert.

## Abhängigkeiten
Das Athletikmodul wird nach `gamification.js` und `training.js` geladen, da gespeicherte Workouts bestehende Trainings-/Punktefunktionen nutzen.
