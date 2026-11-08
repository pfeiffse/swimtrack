# Stage 7 – Profil und Einstellungen

## Neues Fachmodul
`js/modules/profile-settings.js` enthält:
- `getProfile()` aus dem IndexedDB-Store `profile` mit Key `main`
- `saveProfile()` für Name, Verein und Wochenziel
- `loadSettingsPage()`
- Dark-Mode-Initialisierung, Umschaltung und UI-Synchronisierung

Das Datenmodell bleibt unverändert. Der bisherige Default bleibt `{id:'main', name:'', club:'', weeklyGoal:5}`. Die Dark-Mode-Einstellung bleibt in `localStorage` unter `st_dark`.
