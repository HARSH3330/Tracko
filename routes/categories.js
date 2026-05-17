const express = require('express');
const router = express.Router();
const { getPool } = require('../database/db');

// GET /api/categories — list all with product count
router.get('/', async (req, res) => {
  try {
    const db = getPool();
    const result = await db.query(`
      SELECT c.*, COUNT(p.id)::int AS product_count
      FROM categories c
      LEFT JOIN products p ON p.category_id = c.id
      GROUP BY c.id
      ORDER BY c.name
    `);
    res.json({ categories: result.rows });
  } catch (err) {
    console.error('Error fetching categories:', err);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// GET /api/categories/:slug
router.get('/:slug', async (req, res) => {
  try {
    const db = getPool();
    const result = await db.query('SELECT * FROM categories WHERE slug = $1', [req.params.slug]);
    if (!result.rows.length) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json({ category: result.rows[0] });
  } catch (err) {
    console.error('Error fetching category:', err);
    res.status(500).json({ error: 'Failed to fetch category' });
  }
});

module.exports = router;
