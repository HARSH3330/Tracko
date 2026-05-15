const express = require('express');
const cors = require('cors');
const path = require('path');
const crypto = require('crypto');
const rateLimit = require('express-rate-limit');

// Initialize database (creates tables on first run)
const db = require('./database/db');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  message: { error: 'Too many requests, please try again later.' }
});
app.use('/api/', apiLimiter);

// Serve static frontend files
app.use(express.static(path.join(__dirname, 'public')));

// ---- Admin Authentication ----
const ADMIN_USER = process.env.ADMIN_USER || 'admin';
const ADMIN_PASS = process.env.ADMIN_PASS || 'tracko2024';

// Store valid tokens in memory (resets on server restart)
const validTokens = new Set();

// Login endpoint
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  if (username === ADMIN_USER && password === ADMIN_PASS) {
    const token = crypto.randomBytes(32).toString('hex');
    validTokens.add(token);
    return res.json({ success: true, token });
  }
  res.status(401).json({ error: 'Invalid username or password' });
});

// Logout endpoint
app.post('/api/admin/logout', (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (token) validTokens.delete(token);
  res.json({ success: true });
});

// Auth middleware for admin routes
function requireAdmin(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token || !validTokens.has(token)) {
    return res.status(401).json({ error: 'Unauthorized — please log in' });
  }
  next();
}

// API Routes
app.use('/api/products', require('./routes/products'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/inquiries', require('./routes/inquiries'));
app.use('/api/admin', requireAdmin, require('./routes/admin'));

// SPA-style fallback for clean URLs
app.get('/products/:slug', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'product.html'));
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`\n🚀 Tracko server running at http://localhost:${PORT}\n`);
});
