const express = require('express');
const router = express.Router();
const { getPool } = require('../database/db');

// POST /api/inquiries — submit quote/contact
router.post('/', async (req, res) => {
  try {
    const db = getPool();
    const { name, email, company, country, phone, message, product_id, product_reference } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email address.' });
    }

    const result = await db.query(`
      INSERT INTO inquiries (name, email, company, country, phone, message, product_id, product_reference)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id
    `, [
      name.trim(),
      email.trim(),
      (company || '').trim(),
      (country || '').trim(),
      (phone || '').trim(),
      message.trim(),
      product_id || null,
      (product_reference || '').trim()
    ]);

    res.status(201).json({
      success: true,
      message: 'Your inquiry has been submitted successfully. We will contact you shortly.',
      id: result.rows[0].id
    });
  } catch (err) {
    console.error('Error submitting inquiry:', err);
    res.status(500).json({ error: 'Failed to submit inquiry' });
  }
});

// GET /api/inquiries — admin: list all inquiries
router.get('/', async (req, res) => {
  try {
    const db = getPool();
    const { status, page = 1, limit = 20 } = req.query;

    let where = '';
    let params = [];

    if (status) {
      where = 'WHERE i.status = $1';
      params.push(status);
    }

    const countResult = await db.query(
      `SELECT COUNT(*)::int AS total FROM inquiries i ${where}`,
      params
    );
    const total = countResult.rows[0].total;

    const offset = (parseInt(page) - 1) * parseInt(limit);
    const dataParams = status
      ? [status, parseInt(limit), offset]
      : [parseInt(limit), offset];
    const limitIdx = status ? 2 : 1;

    const inquiries = await db.query(`
      SELECT i.*, p.name AS product_name
      FROM inquiries i
      LEFT JOIN products p ON i.product_id = p.id
      ${where}
      ORDER BY i.created_at DESC
      LIMIT $${limitIdx} OFFSET $${limitIdx + 1}
    `, dataParams);

    res.json({
      inquiries: inquiries.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (err) {
    console.error('Error fetching inquiries:', err);
    res.status(500).json({ error: 'Failed to fetch inquiries' });
  }
});

module.exports = router;
