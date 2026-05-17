/* ========================================
   TRACKO — PostgreSQL Database Connection
   Uses Neon (or any Postgres) via DATABASE_URL
   ======================================== */

const { Pool } = require('pg');

let pool;

function getPool() {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production'
        ? { rejectUnauthorized: false }
        : false,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    });

    pool.on('error', (err) => {
      console.error('Unexpected DB pool error:', err);
    });
  }
  return pool;
}

/**
 * Run schema migrations — idempotent, safe to call on every cold start
 */
async function initializeDatabase() {
  const db = getPool();
  await db.query(`
    CREATE TABLE IF NOT EXISTS categories (
      id        SERIAL PRIMARY KEY,
      name      TEXT NOT NULL UNIQUE,
      slug      TEXT NOT NULL UNIQUE,
      description TEXT,
      image_url TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS products (
      id                    SERIAL PRIMARY KEY,
      name                  TEXT NOT NULL,
      slug                  TEXT NOT NULL UNIQUE,
      category_id           INTEGER REFERENCES categories(id),
      short_description     TEXT,
      long_description      TEXT,
      application           TEXT,
      engine_model          TEXT,
      oem_number            TEXT,
      brand                 TEXT DEFAULT 'Tracko',
      material              TEXT,
      image_url             TEXT,
      gallery_images        TEXT,
      bore_diameter         NUMERIC,
      compression_height    NUMERIC,
      overall_height        NUMERIC,
      pin_diameter          NUMERIC,
      ring_groove_count     INTEGER,
      ring_groove_width     NUMERIC,
      crown_type            TEXT,
      skirt_type            TEXT,
      coating_type          TEXT,
      weight                NUMERIC,
      ring_diameter         NUMERIC,
      ring_thickness        NUMERIC,
      ring_material         TEXT,
      ring_type             TEXT,
      liner_type            TEXT,
      outer_diameter        NUMERIC,
      inner_diameter        NUMERIC,
      length                NUMERIC,
      flange_type           TEXT,
      hardness              TEXT,
      surface_finish        TEXT,
      vehicle_type          TEXT,
      manufacturer          TEXT,
      model                 TEXT,
      year_range            TEXT,
      meta_title            TEXT,
      meta_description      TEXT,
      meta_keywords         TEXT,
      inquiry_enabled       BOOLEAN DEFAULT TRUE,
      minimum_order_quantity INTEGER DEFAULT 1,
      lead_time             TEXT,
      is_featured           BOOLEAN DEFAULT FALSE,
      source_url            TEXT,
      created_at            TIMESTAMPTZ DEFAULT NOW(),
      updated_at            TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS inquiries (
      id                SERIAL PRIMARY KEY,
      name              TEXT NOT NULL,
      email             TEXT NOT NULL,
      company           TEXT,
      country           TEXT,
      phone             TEXT,
      message           TEXT,
      product_id        INTEGER REFERENCES products(id),
      product_reference TEXT,
      status            TEXT DEFAULT 'new',
      created_at        TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE INDEX IF NOT EXISTS idx_products_category  ON products(category_id);
    CREATE INDEX IF NOT EXISTS idx_products_slug      ON products(slug);
    CREATE INDEX IF NOT EXISTS idx_products_featured  ON products(is_featured);
    CREATE INDEX IF NOT EXISTS idx_products_material  ON products(material);
    CREATE INDEX IF NOT EXISTS idx_products_bore      ON products(bore_diameter);
    CREATE INDEX IF NOT EXISTS idx_inquiries_status   ON inquiries(status);
  `);
  console.log('✓ Database initialized');
}

module.exports = { getPool, initializeDatabase };
