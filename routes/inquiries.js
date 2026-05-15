const express = require('express');
const router = express.Router();
const db = require('../database/db');

// POST /api/inquiries — submit quote request
router.post('/', (req, res) => {
  try {
    const { name, email, company, country, phone, message, product_id, product_reference } = req.body;

    // Validation
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email address.' });
    }

    const stmt = db.prepare(`
      INSERT INTO inquiries (name, email, company, country, phone, message, product_id, product_reference)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      name.trim(),
      email.trim(),
      (company || '').trim(),
      (country || '').trim(),
      (phone || '').trim(),
      message.trim(),
      product_id || null,
      (product_reference || '').trim()
    );

    res.status(201).json({
      success: true,
      message: 'Your inquiry has been submitted successfully. We will contact you shortly.',
      id: result.lastInsertRowid
    });
  } catch (err) {
    console.error('Error submitting inquiry:', err);
    res.status(500).json({ error: 'Failed to submit inquiry' });
  }
});

// GET /api/inquiries — admin: list all inquiries
router.get('/', (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    let where = '';
    let params = [];
    if (status) {
      where = 'WHERE i.status = ?';
      params.push(status);
    }

    const total = db.prepare(`SELECT COUNT(*) as total FROM inquiries i ${where}`).get(...params).total;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const inquiries = db.prepare(`
      SELECT i.*, p.name as product_name
      FROM inquiries i
      LEFT JOIN products p ON i.product_id = p.id
      ${where}
      ORDER BY i.created_at DESC
      LIMIT ? OFFSET ?
    `).all(...params, parseInt(limit), offset);

    res.json({
      inquiries,
      pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) }
    });
  } catch (err) {
    console.error('Error fetching inquiries:', err);
    res.status(500).json({ error: 'Failed to fetch inquiries' });
  }
});

module.exports = router;
