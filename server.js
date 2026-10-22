const express = require('express');
const path    = require('path');
const app     = express();
const PORT    = process.env.PORT || 3000;

// Serve static files from public/
app.use(express.static(path.join(__dirname, 'public'), {
  setHeaders: (res, filePath) => {
    // Service Worker must be served from root scope
    if (filePath.endsWith('sw.js')) {
      res.setHeader('Service-Worker-Allowed', '/');
      res.setHeader('Cache-Control', 'no-cache');
    }
    // PWA manifest
    if (filePath.endsWith('manifest.json')) {
      res.setHeader('Content-Type', 'application/manifest+json');
    }
  }
}));

// Health check for Railway
app.get('/health', (req, res) => res.json({ status: 'ok', app: 'SwimTrack' }));

// SPA fallback
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`\n  ╔═══════════════════════════════════╗`);
  console.log(`  ║  SwimTrack läuft auf Port ${PORT}    ║`);
  console.log(`  ╚═══════════════════════════════════╝\n`);
});