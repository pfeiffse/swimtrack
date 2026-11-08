# Stage 3 – Zeitfunktionen konsolidiert

`js/core/time.js` ist jetzt die einzige Implementierungsquelle für Zeitumrechnung, Formatierung, Validierung und Rückkonvertierung.

Zentrale API: `SwimTime.toCentiseconds`, `SwimTime.fromCentiseconds`, `SwimTime.validate`, `SwimTime.format`.

Die bisherigen Namen `fmtTime`, `timeToCs`, `wkFmtTime`, `wkTimeToCs`, `wkFmt`, `wkToCs`, `wkValidClock`, `wkCsToParts` bleiben vorerst als dünne Kompatibilitätsadapter erhalten. Dadurch ändert Stage 3 weder Datenwerte noch Aufrufer im Wettkampfmodul.

Nächster Schritt nach erfolgreichem Test: Aufrufer schrittweise auf `SwimTime` umstellen und anschließend die Adapter löschen.
