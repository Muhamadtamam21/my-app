const express = require('express');
const cors    = require('cors');
const fs      = require('fs');
const path    = require('path');
const https   = require('https');
const http    = require('http');

const app  = express();
const PORT = process.env.PORT || 3000;
const DB_PATH = path.join(__dirname, 'database.json');

// ── Middleware ──────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// ── Helpers ─────────────────────────────────────────────────
function readDB() {
  try {
    const raw = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return { feedback: [] };
  }
}

function writeDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const mod = url.startsWith('https') ? https : http;
    mod.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
      let body = '';
      res.on('data', chunk => { body += chunk; });
      res.on('end', () => {
        try { resolve(JSON.parse(body)); }
        catch { reject(new Error('Invalid JSON response')); }
      });
    }).on('error', reject);
  });
}

// ── API: Feedback GET ───────────────────────────────────────
app.get('/api/feedback', (req, res) => {
  const db = readDB();
  res.json(db.feedback || []);
});

// ── API: Feedback POST ──────────────────────────────────────
app.post('/api/feedback', (req, res) => {
  const { name, comment, rating } = req.body;

  if (!name || !comment || !rating) {
    return res.status(400).json({ error: 'name, comment, and rating are required.' });
  }
  if (typeof rating !== 'number' || rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'rating must be a number between 1 and 5.' });
  }

  const db = readDB();
  const entry = {
    id:      Date.now(),
    name:    String(name).slice(0, 100),
    comment: String(comment).slice(0, 1000),
    rating:  Math.round(rating),
    date:    new Date().toISOString()
  };

  db.feedback.push(entry);
  writeDB(db);
  res.status(201).json(entry);
});

// ── API: Download Proxy ─────────────────────────────────────
app.get('/api/download', async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'url query parameter is required.' });
  }

  // Basic URL validation
  try { new URL(url); } catch {
    return res.status(400).json({ error: 'Invalid URL provided.' });
  }

  const apiUrl = `https://api.betabotz.eu.org/api/download/allin?url=${encodeURIComponent(url)}&apikey=Btz-w3xcj`;

  try {
    const data = await fetchUrl(apiUrl);
    res.json(data);
  } catch (err) {
    res.status(502).json({ error: 'Failed to fetch from download API: ' + err.message });
  }
});

// ── Catch-all: serve frontend SPA ───────────────────────────
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// ── Start ───────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 Portfolio server running at http://localhost:${PORT}`);
  console.log(`   API Feedback : http://localhost:${PORT}/api/feedback`);
  console.log(`   API Download : http://localhost:${PORT}/api/download?url=...`);
  console.log(`   Frontend     : http://localhost:${PORT}\n`);
});

module.exports = app;
