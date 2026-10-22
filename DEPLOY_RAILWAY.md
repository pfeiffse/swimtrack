# SwimTrack – In 15 Minuten online

## Was du am Ende hast
Eine echte Web-Adresse wie `https://swimtrack-xyz.railway.app` –
deine Tochter öffnet sie in Chrome auf dem Samsung XCover 7 und
installiert SwimTrack als App auf dem Homescreen.

---

## Was du brauchst
- E-Mail-Adresse (für GitHub und Railway)
- Ca. 15 Minuten Zeit

---

## Teil 1 – GitHub-Konto erstellen (5 Minuten)

GitHub ist ein kostenloser Dienst zum Speichern von Code.

1. Gehe zu **https://github.com**
2. Klicke oben rechts auf **„Sign up"**
3. E-Mail-Adresse eingeben → Passwort wählen → Benutzernamen wählen
4. Kostenloses Konto bestätigen (E-Mail-Verifizierung)
5. Alle Fragen überspringen → **„Skip personalization"**

---

## Teil 2 – Code hochladen (3 Minuten)

### Neues Repository erstellen:
1. Nach dem Login auf **https://github.com/new** gehen
2. Repository name: `swimtrack`
3. Sichtbarkeit: **Private** ✓ (wichtig!)
4. Klicke **„Create repository"**

### Dateien hochladen:
1. Auf der leeren Repository-Seite klicke **„uploading an existing file"**
2. Öffne den `swimtrack_railway`-Ordner auf deinem Computer
3. **Alle Dateien und Ordner** in das Upload-Fenster ziehen:
   - `server.js`
   - `package.json`
   - `railway.json`
   - `.gitignore`
   - Den ganzen `public`-Ordner
4. Unten auf **„Commit changes"** klicken

---

## Teil 3 – Railway-Konto erstellen (2 Minuten)

1. Gehe zu **https://railway.app**
2. Klicke **„Login"** → **„Login with GitHub"**
3. GitHub-Konto verbinden → Zugriff erlauben
4. Fertig – du bist eingeloggt

---

## Teil 4 – App deployen (3 Minuten)

1. Auf **https://railway.app/new** gehen
2. Klicke **„Deploy from GitHub repo"**
3. Wähle das `swimtrack`-Repository aus
4. Railway erkennt automatisch Node.js und startet den Build
5. Warte ca. 2 Minuten bis der Build fertig ist
   (grüner Haken = fertig)

---

## Teil 5 – Web-Adresse einrichten (2 Minuten)

1. Im Railway-Dashboard auf dein Projekt klicken
2. Oben auf **„Settings"** klicken
3. Runterscrollen zu **„Networking"**
4. Klicke **„Generate Domain"**
5. Du bekommst eine Adresse wie:
   `https://swimtrack-production-abc123.railway.app`

**Diese Adresse notieren!** Das ist die App-Adresse für deine Tochter.

---

## Teil 6 – App auf dem Samsung XCover 7 installieren

1. Chrome auf dem Handy öffnen
2. Die Railway-Adresse eingeben (z.B. `https://swimtrack-production-abc123.railway.app`)
3. SwimTrack öffnet sich
4. Oben rechts auf die **drei Punkte** ⋮ tippen
5. **„App installieren"** oder **„Zum Startbildschirm hinzufügen"** tippen
6. **„Installieren"** bestätigen

✅ **Fertig!** SwimTrack erscheint als App auf dem Homescreen –
mit eigenem Icon, ohne Browser-Leiste, im Vollbild.

---

## Kosten

| Plan | Preis | Ausreichend für |
|---|---|---|
| **Hobby (kostenlos)** | 0 € | 500 Stunden/Monat – reicht für eine Familie |
| Pro | ~5 €/Monat | Unbegrenzt, empfohlen bei täglicher Nutzung |

**Tipp:** Starte kostenlos. Wenn die App täglich genutzt wird,
lohnt sich der Pro-Plan für ~5 €/Monat.

---

## Häufige Fragen

**„App installieren" erscheint nicht**
→ Seite einmal neu laden
→ Sicherstellen dass die Adresse mit `https://` beginnt

**Daten gehen verloren wenn Railway neu startet?**
→ Nein! Alle Daten sind auf dem Handy gespeichert (IndexedDB)
→ Railway hostet nur die App-Dateien, nicht die Daten

**Wie aktualisiere ich die App?**
→ Neue Dateien auf GitHub hochladen
→ Railway deployt automatisch innerhalb von 2 Minuten

---

## Hilfe

Bei Problemen: railway.app/help oder einfach hier fragen!