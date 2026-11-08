# Stage 2

Aus `js/app.js` wurden ausschließlich die frühesten Infrastrukturblöcke ausgelagert:

- `js/data/db.js`: IndexedDB `SwimTrackDB` und `dbAll/dbGet/dbPut/dbDel/dbClear`
- `js/core/utils.js`: `genId`, `setText`, `setWidth`, `haptic`
- `js/core/dates.js`: `today`, `fmtDate`, `fmtDateS`, `getWS`, `getWD`
- `js/core/time.js`: bestehende `fmtTime`, `timeToCs`

Die späteren Wettkampf-spezifischen Helfer wie `wkToCs`, `wkFmt` bleiben absichtlich noch in `app.js`. Diese Doppelungen werden erst nach erfolgreich bestandenem Stage-2-Test vereinheitlicht. Das Datenmodell und die IndexedDB-Version bleiben unverändert.
