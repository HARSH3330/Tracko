const axios = require('axios');
const cheerio = require('cheerio');
const slugify = require('slugify');
const db = require('../database/db');

const BASE_URL = 'https://trackoparts.com';
const DELAY_MS = 1500; // Delay between requests to be polite

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function makeSlug(text) {
  return slugify(text, { lower: true, strict: true });
}

/**
 * Fetch HTML content from a URL
 */
async function fetchPage(url) {
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml',
      },
      timeout: 15000
    });
    return response.data;
  } catch (err) {
    console.error(`Failed to fetch: ${url}`, err.message);
    return null;
  }
}

/**
 * Extract product links from a category page
 */
function extractProductLinks(html, baseUrl) {
  const $ = cheerio.load(html);
  const links = new Set();

  // Common WooCommerce / product listing selectors
  $('a[href*="/product/"], a.woocommerce-LoopProduct-link, .product a, .product-item a').each((_, el) => {
    let href = $(el).attr('href');
    if (href) {
      if (href.startsWith('/')) href = baseUrl + href;
      if (href.includes(baseUrl)) links.add(href);
    }
  });

  return [...links];
}

/**
 * Parse product data from a product page
 */
function parseProductPage(html, url) {
  const $ = cheerio.load(html);

  const name = $('h1.product_title, h1.entry-title, h1').first().text().trim();
  if (!name) return null;

  const description = $('.woocommerce-product-details__short-description, .product-short-description, .summary .description').first().text().trim();
  const longDescription = $('#tab-description, .woocommerce-Tabs-panel--description, .product-description').first().text().trim();

  // Extract image
  const imageUrl = $('img.wp-post-image, .woocommerce-product-gallery img, .product-image img').first().attr('src') || '';

  // Extract gallery images
  const galleryImages = [];
  $('.woocommerce-product-gallery__image img, .product-gallery img').each((_, el) => {
    const src = $(el).attr('src') || $(el).attr('data-src');
    if (src) galleryImages.push(src);
  });

  // Extract specifications from table or attributes
  const specs = {};
  $('table.shop_attributes tr, table.woocommerce-product-attributes tr, .product-attributes tr').each((_, el) => {
    const label = $(el).find('th, td:first-child').text().trim().toLowerCase();
    const value = $(el).find('td:last-child, td.product_weight, td.product_dimensions').text().trim();
    if (label && value) {
      specs[label] = value;
    }
  });

  // Extract additional data attributes
  $('.product_meta span, .posted_in a, .tagged_as a').each((_, el) => {
    const text = $(el).text().trim();
    if (text) {
      const parent = $(el).parent().text().trim().toLowerCase();
      if (parent.includes('category')) specs.category = text;
    }
  });

  // Extract category from breadcrumb or meta
  let category = specs.category || '';
  if (!category) {
    category = $('.breadcrumb a, .woocommerce-breadcrumb a').last().text().trim();
  }

  // Normalize fields
  const product = {
    name,
    slug: makeSlug(name),
    short_description: description || name,
    long_description: longDescription || description || '',
    image_url: imageUrl,
    gallery_images: JSON.stringify(galleryImages),
    source_url: url,
    material: specs.material || specs['material type'] || null,
    bore_diameter: parseFloat(specs['bore diameter'] || specs['bore'] || specs['diameter']) || null,
    compression_height: parseFloat(specs['compression height']) || null,
    pin_diameter: parseFloat(specs['pin diameter'] || specs['piston pin']) || null,
    ring_groove_count: parseInt(specs['ring grooves'] || specs['ring groove count']) || null,
    weight: parseFloat(specs['weight'] || specs['net weight']) || null,
    engine_model: specs['engine'] || specs['engine model'] || specs['engine type'] || null,
    application: specs['application'] || specs['vehicle'] || null,
    oem_number: specs['oem'] || specs['oem number'] || specs['part number'] || null,
    vehicle_type: specs['vehicle type'] || null,
    manufacturer: specs['manufacturer'] || specs['brand'] || null,
  };

  return product;
}

/**
 * Save product to database (prevent duplicates by slug)
 */
function saveProduct(product) {
  const existing = db.prepare('SELECT id FROM products WHERE slug = ?').get(product.slug);
  if (existing) {
    console.log(`  ⏭  Skipping duplicate: ${product.name}`);
    return false;
  }

  // Try to match category
  let categoryId = null;
  if (product.category) {
    const cat = db.prepare('SELECT id FROM categories WHERE name LIKE ?').get(`%${product.category}%`);
    if (cat) categoryId = cat.id;
  }
  if (!categoryId) {
    // Default to first category
    const defaultCat = db.prepare('SELECT id FROM categories LIMIT 1').get();
    categoryId = defaultCat?.id || 1;
  }

  db.prepare(`
    INSERT INTO products (
      name, slug, category_id, short_description, long_description,
      image_url, gallery_images, source_url, material,
      bore_diameter, compression_height, pin_diameter, ring_groove_count,
      weight, engine_model, application, oem_number, vehicle_type, manufacturer,
      meta_title, meta_description
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    product.name, product.slug, categoryId,
    product.short_description, product.long_description,
    product.image_url, product.gallery_images, product.source_url,
    product.material, product.bore_diameter, product.compression_height,
    product.pin_diameter, product.ring_groove_count, product.weight,
    product.engine_model, product.application, product.oem_number,
    product.vehicle_type, product.manufacturer,
    `${product.name} | Tracko Parts`, product.short_description
  );

  console.log(`  ✓  Saved: ${product.name}`);
  return true;
}

/**
 * Main scraper function
 */
async function run() {
  console.log('\n🔍 Starting Tracko scraper...');
  console.log(`   Target: ${BASE_URL}\n`);

  let totalSaved = 0;
  let totalSkipped = 0;

  // Step 1: Fetch the main page to discover category/product links
  const mainHtml = await fetchPage(BASE_URL);
  if (!mainHtml) {
    console.error('Failed to fetch main page');
    return { saved: 0, skipped: 0, error: 'Failed to fetch main page' };
  }

  // Step 2: Discover product URLs
  const $ = cheerio.load(mainHtml);
  const categoryLinks = new Set();

  // Collect category page links
  $('a[href*="/product-category/"], a[href*="/shop/"], nav a, .menu a').each((_, el) => {
    const href = $(el).attr('href');
    if (href && href.includes(BASE_URL)) {
      categoryLinks.add(href);
    }
  });

  // Also try common WooCommerce paths
  const commonPaths = ['/shop/', '/products/', '/product-category/pistons/', '/product-category/piston-rings/'];
  for (const p of commonPaths) {
    categoryLinks.add(BASE_URL + p);
  }

  console.log(`Found ${categoryLinks.size} potential category pages\n`);

  // Step 3: Visit each category page and collect product links
  const allProductLinks = new Set();

  for (const catUrl of categoryLinks) {
    console.log(`📂 Scanning: ${catUrl}`);
    const catHtml = await fetchPage(catUrl);
    if (catHtml) {
      const links = extractProductLinks(catHtml, BASE_URL);
      links.forEach(l => allProductLinks.add(l));
      console.log(`   Found ${links.length} product links`);
    }
    await sleep(DELAY_MS);
  }

  console.log(`\n🔗 Total unique product links: ${allProductLinks.size}\n`);

  // Step 4: Visit each product page and parse data
  for (const productUrl of allProductLinks) {
    console.log(`📦 Scraping: ${productUrl}`);
    const productHtml = await fetchPage(productUrl);
    if (productHtml) {
      const product = parseProductPage(productHtml, productUrl);
      if (product) {
        const saved = saveProduct(product);
        if (saved) totalSaved++;
        else totalSkipped++;
      }
    }
    await sleep(DELAY_MS);
  }

  console.log(`\n✅ Scraping complete!`);
  console.log(`   Saved: ${totalSaved}`);
  console.log(`   Skipped: ${totalSkipped}\n`);

  return { saved: totalSaved, skipped: totalSkipped };
}

module.exports = { run };

// Run directly if called from CLI
if (require.main === module) {
  run().catch(console.error);
}
