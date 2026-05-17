const express = require('express');
const router = express.Router();
const { getPool } = require('../database/db');

// GET /api/products — list with filters, search, pagination
router.get('/', async (req, res) => {
  try {
    const db = getPool();
    const {
      category, material, bore_min, bore_max,
      engine, application, search,
      page = 1, limit = 12, sort = 'name', featured
    } = req.query;

    let where = [];
    let params = [];
    let idx = 1;

    if (category) {
      where.push(`c.slug = $${idx++}`);
      params.push(category);
    }
    if (material) {
      where.push(`p.material ILIKE $${idx++}`);
      params.push(`%${material}%`);
    }
    if (bore_min) {
      where.push(`p.bore_diameter >= $${idx++}`);
      params.push(parseFloat(bore_min));
    }
    if (bore_max) {
      where.push(`p.bore_diameter <= $${idx++}`);
      params.push(parseFloat(bore_max));
    }
    if (engine) {
      where.push(`(p.engine_model ILIKE $${idx} OR p.application ILIKE $${idx + 1})`);
      params.push(`%${engine}%`, `%${engine}%`);
      idx += 2;
    }
    if (application) {
      where.push(`(p.application ILIKE $${idx} OR p.vehicle_type ILIKE $${idx + 1})`);
      params.push(`%${application}%`, `%${application}%`);
      idx += 2;
    }
    if (featured === '1' || featured === 'true') {
      where.push(`p.is_featured = TRUE`);
    }
    if (search) {
      where.push(`(p.name ILIKE $${idx} OR p.oem_number ILIKE $${idx + 1} OR p.engine_model ILIKE $${idx + 2} OR p.short_description ILIKE $${idx + 3})`);
      params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
      idx += 4;
    }

    const whereClause = where.length > 0 ? `WHERE ${where.join(' AND ')}` : '';

    const sortOptions = {
      name:      'p.name ASC',
      newest:    'p.created_at DESC',
      bore_asc:  'p.bore_diameter ASC NULLS LAST',
      bore_desc: 'p.bore_diameter DESC NULLS LAST'
    };
    const orderBy = sortOptions[sort] || 'p.name ASC';

    // Count
    const countResult = await db.query(
      `SELECT COUNT(*) AS total FROM products p LEFT JOIN categories c ON p.category_id = c.id ${whereClause}`,
      params
    );
    const total = parseInt(countResult.rows[0].total, 10);

    // Paginated data
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const dataParams = [...params, parseInt(limit), offset];
    const dataResult = await db.query(`
      SELECT p.*, c.name AS category_name, c.slug AS category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      ${whereClause}
      ORDER BY ${orderBy}
      LIMIT $${idx} OFFSET $${idx + 1}
    `, dataParams);

    res.json({
      products: dataResult.rows,
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

// GET /api/products/filters — available filter values
router.get('/filters', async (req, res) => {
  try {
    const db = getPool();
    const [materials, engines, boreRange, vehicleTypes] = await Promise.all([
      db.query('SELECT DISTINCT material FROM products WHERE material IS NOT NULL ORDER BY material'),
      db.query('SELECT DISTINCT engine_model FROM products WHERE engine_model IS NOT NULL ORDER BY engine_model'),
      db.query('SELECT MIN(bore_diameter) AS min, MAX(bore_diameter) AS max FROM products WHERE bore_diameter IS NOT NULL'),
      db.query('SELECT DISTINCT vehicle_type FROM products WHERE vehicle_type IS NOT NULL ORDER BY vehicle_type'),
    ]);

    res.json({
      materials:    materials.rows.map(m => m.material),
      engines:      engines.rows.map(e => e.engine_model),
      bore_range:   boreRange.rows[0],
      vehicle_types: vehicleTypes.rows.map(v => v.vehicle_type),
    });
  } catch (err) {
    console.error('Error fetching filters:', err);
    res.status(500).json({ error: 'Failed to fetch filters' });
  }
});

// GET /api/products/:slug — single product + related
router.get('/:slug', async (req, res) => {
  try {
    const db = getPool();
    const result = await db.query(`
      SELECT p.*, c.name AS category_name, c.slug AS category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.slug = $1
    `, [req.params.slug]);

    if (!result.rows.length) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const product = result.rows[0];

    const related = await db.query(`
      SELECT id, name, slug, short_description, image_url, bore_diameter, material
      FROM products
      WHERE category_id = $1 AND id != $2
      LIMIT 4
    `, [product.category_id, product.id]);

    res.json({ product, related: related.rows });
  } catch (err) {
    console.error('Error fetching product:', err);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

module.exports = router;
