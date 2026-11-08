# Struktur v5, Konsolidierungsstufe 1

```text
index.html
manifest.json
sw.js
css/app.css
js/app.js
icons/   (aus dem bestehenden Repository übernehmen)
docs/
tests/
```

## Absicht

Die erste Stufe trennt nur HTML, CSS und JavaScript. Alle globalen Funktionen bleiben erhalten, damit bestehende Inline-Handler wie `onclick="..."` weiterarbeiten. Eine Aufteilung in Fachmodule erfolgt erst nach bestandenem Gleichheitstest.
