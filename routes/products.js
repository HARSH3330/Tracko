const express = require('express');
const router = express.Router();
const db = require('../database/db');

// GET /api/products — list with filters, search, pagination
router.get('/', (req, res) => {
  try {
    const {
      category, material, bore_min, bore_max,
      engine, application, search,
      page = 1, limit = 12, sort = 'name', featured
    } = req.query;

    let where = [];
    let params = [];

    if (category) {
      where.push('c.slug = ?');
      params.push(category);
    }
    if (material) {
      where.push('p.material LIKE ?');
      params.push(`%${material}%`);
    }
    if (bore_min) {
      where.push('p.bore_diameter >= ?');
      params.push(parseFloat(bore_min));
    }
    if (bore_max) {
      where.push('p.bore_diameter <= ?');
      params.push(parseFloat(bore_max));
    }
    if (engine) {
      where.push('(p.engine_model LIKE ? OR p.application LIKE ?)');
      params.push(`%${engine}%`, `%${engine}%`);
    }
    if (application) {
      where.push('(p.application LIKE ? OR p.vehicle_type LIKE ?)');
      params.push(`%${application}%`, `%${application}%`);
    }
    if (featured === '1' || featured === 'true') {
      where.push('p.is_featured = 1');
    }
    if (search) {
      where.push('(p.name LIKE ? OR p.oem_number LIKE ? OR p.engine_model LIKE ? OR p.short_description LIKE ?)');
      params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
    }

    const whereClause = where.length > 0 ? `WHERE ${where.join(' AND ')}` : '';

    // Sorting
    const sortOptions = {
      name: 'p.name ASC',
      newest: 'p.created_at DESC',
      bore_asc: 'p.bore_diameter ASC',
      bore_desc: 'p.bore_diameter DESC'
    };
    const orderBy = sortOptions[sort] || 'p.name ASC';

    // Count total
    const countQuery = `SELECT COUNT(*) as total FROM products p LEFT JOIN categories c ON p.category_id = c.id ${whereClause}`;
    const { total } = db.prepare(countQuery).get(...params);

    // Paginate
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const dataQuery = `
      SELECT p.*, c.name as category_name, c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      ${whereClause}
      ORDER BY ${orderBy}
      LIMIT ? OFFSET ?
    `;
    const products = db.prepare(dataQuery).all(...params, parseInt(limit), offset);

    res.json({
      products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// GET /api/products/filters — get available filter values
router.get('/filters', (req, res) => {
  try {
    const materials = db.prepare('SELECT DISTINCT material FROM products WHERE material IS NOT NULL ORDER BY material').all();
    const engines = db.prepare('SELECT DISTINCT engine_model FROM products WHERE engine_model IS NOT NULL ORDER BY engine_model').all();
    const boreRange = db.prepare('SELECT MIN(bore_diameter) as min, MAX(bore_diameter) as max FROM products WHERE bore_diameter IS NOT NULL').get();
    const vehicleTypes = db.prepare('SELECT DISTINCT vehicle_type FROM products WHERE vehicle_type IS NOT NULL ORDER BY vehicle_type').all();

    res.json({
      materials: materials.map(m => m.material),
      engines: engines.map(e => e.engine_model),
      bore_range: boreRange,
      vehicle_types: vehicleTypes.map(v => v.vehicle_type)
    });
  } catch (err) {
    console.error('Error fetching filters:', err);
    res.status(500).json({ error: 'Failed to fetch filters' });
  }
});

// GET /api/products/:slug — single product
router.get('/:slug', (req, res) => {
  try {
    const product = db.prepare(`
      SELECT p.*, c.name as category_name, c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.slug = ?
    `).get(req.params.slug);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Get related products (same category, exclude self)
    const related = db.prepare(`
      SELECT id, name, slug, short_description, image_url, bore_diameter, material
      FROM products
      WHERE category_id = ? AND id != ?
      LIMIT 4
    `).all(product.category_id, product.id);

    res.json({ product, related });
  } catch (err) {
    console.error('Error fetching product:', err);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

module.exports = router;
