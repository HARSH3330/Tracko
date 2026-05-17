const express = require('express');
const router = express.Router();
const { getPool } = require('../database/db');
const slugify = require('slugify');

// PUT /api/admin/products/:id — edit product
router.put('/products/:id', async (req, res) => {
  try {
    const db = getPool();
    const check = await db.query('SELECT id FROM products WHERE id = $1', [req.params.id]);
    if (!check.rows.length) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const fields = req.body;
    const updates = [];
    const params = [];
    let idx = 1;

    const allowedFields = [
      'name', 'short_description', 'long_description', 'category_id',
      'application', 'engine_model', 'oem_number', 'material', 'image_url',
      'bore_diameter', 'compression_height', 'pin_diameter', 'ring_groove_count',
      'weight', 'crown_type', 'skirt_type', 'coating_type', 'vehicle_type',
      'manufacturer', 'model', 'year_range', 'is_featured',
      'meta_title', 'meta_description', 'meta_keywords'
    ];

    for (const field of allowedFields) {
      if (fields[field] !== undefined) {
        updates.push(`${field} = $${idx++}`);
        params.push(fields[field]);
      }
    }

    if (fields.name) {
      updates.push(`slug = $${idx++}`);
      params.push(slugify(fields.name, { lower: true, strict: true }));
    }

    updates.push(`updated_at = NOW()`);
    params.push(req.params.id);

    await db.query(
      `UPDATE products SET ${updates.join(', ')} WHERE id = $${idx}`,
      params
    );

    const updated = await db.query('SELECT * FROM products WHERE id = $1', [req.params.id]);
    res.json({ success: true, product: updated.rows[0] });
  } catch (err) {
    console.error('Error updating product:', err);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// DELETE /api/admin/products/:id
router.delete('/products/:id', async (req, res) => {
  try {
    const db = getPool();
    const result = await db.query(
      'DELETE FROM products WHERE id = $1 RETURNING id',
      [req.params.id]
    );
    if (!result.rows.length) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ success: true, message: 'Product deleted' });
  } catch (err) {
    console.error('Error deleting product:', err);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// POST /api/admin/categories — add category
router.post('/categories', async (req, res) => {
  try {
    const db = getPool();
    const { name, description, image_url } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Category name is required' });
    }

    const slug = slugify(name, { lower: true, strict: true });
    const existing = await db.query('SELECT id FROM categories WHERE slug = $1', [slug]);
    if (existing.rows.length) {
      return res.status(409).json({ error: 'Category already exists' });
    }

    const result = await db.query(
      'INSERT INTO categories (name, slug, description, image_url) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, slug, description || '', image_url || '']
    );
    res.status(201).json({ success: true, category: result.rows[0] });
  } catch (err) {
    console.error('Error creating category:', err);
    res.status(500).json({ error: 'Failed to create category' });
  }
});

// POST /api/admin/scrape — trigger scraper (disabled on Vercel serverless)
router.post('/scrape', async (req, res) => {
  res.json({
    success: false,
    message: 'Scraper is not available in serverless mode. Run locally with: npm run scrape'
  });
});

// PUT /api/admin/inquiries/:id/status
router.put('/inquiries/:id/status', async (req, res) => {
  try {
    const db = getPool();
    const { status } = req.body;
    if (!['new', 'read', 'replied', 'closed'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    await db.query('UPDATE inquiries SET status = $1 WHERE id = $2', [status, req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error('Error updating inquiry:', err);
    res.status(500).json({ error: 'Failed to update inquiry status' });
  }
});

// GET /api/admin/stats — dashboard stats
router.get('/stats', async (req, res) => {
  try {
    const db = getPool();
    const [products, categories, inquiries, newInq] = await Promise.all([
      db.query('SELECT COUNT(*)::int AS count FROM products'),
      db.query('SELECT COUNT(*)::int AS count FROM categories'),
      db.query('SELECT COUNT(*)::int AS count FROM inquiries'),
      db.query("SELECT COUNT(*)::int AS count FROM inquiries WHERE status = 'new'"),
    ]);

    res.json({
      totalProducts:    products.rows[0].count,
      totalCategories:  categories.rows[0].count,
      totalInquiries:   inquiries.rows[0].count,
      newInquiries:     newInq.rows[0].count,
    });
  } catch (err) {
    console.error('Error fetching stats:', err);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

module.exports = router;
