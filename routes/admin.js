const express = require('express');
const router = express.Router();
const db = require('../database/db');
const slugify = require('slugify');

// PUT /api/admin/products/:id — edit product
router.put('/products/:id', (req, res) => {
  try {
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const fields = req.body;
    const updates = [];
    const params = [];

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
        updates.push(`${field} = ?`);
        params.push(fields[field]);
      }
    }

    if (fields.name) {
      updates.push('slug = ?');
      params.push(slugify(fields.name, { lower: true, strict: true }));
    }

    updates.push('updated_at = CURRENT_TIMESTAMP');
    params.push(req.params.id);

    db.prepare(`UPDATE products SET ${updates.join(', ')} WHERE id = ?`).run(...params);

    const updated = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
    res.json({ success: true, product: updated });
  } catch (err) {
    console.error('Error updating product:', err);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// DELETE /api/admin/products/:id
router.delete('/products/:id', (req, res) => {
  try {
    const result = db.prepare('DELETE FROM products WHERE id = ?').run(req.params.id);
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ success: true, message: 'Product deleted' });
  } catch (err) {
    console.error('Error deleting product:', err);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// POST /api/admin/categories — add category
router.post('/categories', (req, res) => {
  try {
    const { name, description, image_url } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Category name is required' });
    }

    const slug = slugify(name, { lower: true, strict: true });
    const existing = db.prepare('SELECT id FROM categories WHERE slug = ?').get(slug);
    if (existing) {
      return res.status(409).json({ error: 'Category already exists' });
    }

    const result = db.prepare(
      'INSERT INTO categories (name, slug, description, image_url) VALUES (?, ?, ?, ?)'
    ).run(name, slug, description || '', image_url || '');

    const category = db.prepare('SELECT * FROM categories WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json({ success: true, category });
  } catch (err) {
    console.error('Error creating category:', err);
    res.status(500).json({ error: 'Failed to create category' });
  }
});

// POST /api/admin/scrape — trigger scraper
router.post('/scrape', async (req, res) => {
  try {
    const scraper = require('../scraper/scraper');
    res.json({ success: true, message: 'Scraping started. Check server logs for progress.' });
    // Run scraper asynchronously
    scraper.run().then(result => {
      console.log('Scraper finished:', result);
    }).catch(err => {
      console.error('Scraper error:', err);
    });
  } catch (err) {
    console.error('Error triggering scraper:', err);
    res.status(500).json({ error: 'Failed to start scraper' });
  }
});

// PUT /api/admin/inquiries/:id/status — update inquiry status
router.put('/inquiries/:id/status', (req, res) => {
  try {
    const { status } = req.body;
    if (!['new', 'read', 'replied', 'closed'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    db.prepare('UPDATE inquiries SET status = ? WHERE id = ?').run(status, req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.error('Error updating inquiry:', err);
    res.status(500).json({ error: 'Failed to update inquiry status' });
  }
});

// GET /api/admin/stats — dashboard stats
router.get('/stats', (req, res) => {
  try {
    const totalProducts = db.prepare('SELECT COUNT(*) as count FROM products').get().count;
    const totalCategories = db.prepare('SELECT COUNT(*) as count FROM categories').get().count;
    const totalInquiries = db.prepare('SELECT COUNT(*) as count FROM inquiries').get().count;
    const newInquiries = db.prepare("SELECT COUNT(*) as count FROM inquiries WHERE status = 'new'").get().count;

    res.json({ totalProducts, totalCategories, totalInquiries, newInquiries });
  } catch (err) {
    console.error('Error fetching stats:', err);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

module.exports = router;
