-- Categories
CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Products
CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category_id INTEGER,
  short_description TEXT,
  long_description TEXT,
  application TEXT,
  engine_model TEXT,
  oem_number TEXT,
  brand TEXT DEFAULT 'Tracko',
  material TEXT,
  image_url TEXT,
  gallery_images TEXT, -- JSON array of image URLs
  bore_diameter REAL,
  compression_height REAL,
  overall_height REAL,
  pin_diameter REAL,
  ring_groove_count INTEGER,
  ring_groove_width REAL,
  crown_type TEXT,
  skirt_type TEXT,
  coating_type TEXT,
  weight REAL,
  ring_diameter REAL,
  ring_thickness REAL,
  ring_material TEXT,
  ring_type TEXT,
  liner_type TEXT,
  outer_diameter REAL,
  inner_diameter REAL,
  length REAL,
  flange_type TEXT,
  hardness TEXT,
  surface_finish TEXT,
  vehicle_type TEXT,
  manufacturer TEXT,
  model TEXT,
  year_range TEXT,
  meta_title TEXT,
  meta_description TEXT,
  meta_keywords TEXT,
  inquiry_enabled INTEGER DEFAULT 1,
  minimum_order_quantity INTEGER DEFAULT 1,
  lead_time TEXT,
  is_featured INTEGER DEFAULT 0,
  source_url TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- Inquiries
CREATE TABLE IF NOT EXISTS inquiries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  country TEXT,
  phone TEXT,
  message TEXT,
  product_id INTEGER,
  product_reference TEXT,
  status TEXT DEFAULT 'new',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(is_featured);
CREATE INDEX IF NOT EXISTS idx_products_material ON products(material);
CREATE INDEX IF NOT EXISTS idx_products_bore ON products(bore_diameter);
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON inquiries(status);
