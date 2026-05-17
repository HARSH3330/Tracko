const express = require('express');
const cors = require('cors');
const path = require('path');
const crypto = require('crypto');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3000;

// ---- Middleware ----
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { error: 'Too many requests, please try again later.' }
});
app.use('/api/', apiLimiter);

// Serve static frontend files from /public
app.use(express.static(path.join(__dirname, 'public')));

// ---- Admin Auth ----
const ADMIN_USER = process.env.ADMIN_USER || 'admin';
const ADMIN_PASS = process.env.ADMIN_PASS || 'tracko2024';
const validTokens = new Set();

app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  if (username === ADMIN_USER && password === ADMIN_PASS) {
    const token = crypto.randomBytes(32).toString('hex');
    validTokens.add(token);
    return res.json({ success: true, token });
  }
  res.status(401).json({ error: 'Invalid username or password' });
});

app.post('/api/admin/logout', (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (token) validTokens.delete(token);
  res.json({ success: true });
});

function requireAdmin(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token || !validTokens.has(token)) {
    return res.status(401).json({ error: 'Unauthorized — please log in' });
  }
  next();
}

// ---- DB Init Middleware (lazy — runs once on first API call) ----
let dbReady = false;
let dbError = null;

async function ensureDb(req, res, next) {
  if (dbReady) return next();
  if (dbError) return res.status(503).json({ error: 'Database unavailable. Check DATABASE_URL.', detail: dbError });

  try {
    const { initializeDatabase } = require('./database/db');
    await initializeDatabase();
    dbReady = true;
    next();
  } catch (err) {
    dbError = err.message;
    console.error('DB init failed:', err.message);
    res.status(503).json({ error: 'Database unavailable. Check DATABASE_URL env var.', detail: err.message });
  }
}

// ---- API Routes (DB required) ----
app.use('/api/products',   ensureDb, require('./routes/products'));
app.use('/api/categories', ensureDb, require('./routes/categories'));
app.use('/api/inquiries',  ensureDb, require('./routes/inquiries'));
app.use('/api/admin',      ensureDb, requireAdmin, require('./routes/admin'));

// ---- Health check (no DB needed) ----
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', db: dbReady, timestamp: new Date().toISOString() });
});

// ---- SPA fallbacks ----
app.get('/products/:slug', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'product.html'));
});

// Serve index.html for root and any unmatched HTML routes
app.get('*', (req, res) => {
  // Only serve index.html for non-file routes (no extension)
  if (!path.extname(req.path)) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  } else {
    res.status(404).send('Not found');
  }
});

// ---- Error handler ----
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// ---- Local dev only — don't listen on Vercel ----
if (process.env.VERCEL !== '1' && require.main === module) {
  app.listen(PORT, () => {
    console.log(`\n🚀 Tracko running at http://localhost:${PORT}\n`);
  });
}

// Export for Vercel serverless
module.exports = app;
