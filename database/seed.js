/**
 * TRACKO — Database Seed Script (PostgreSQL)
 * Run with: npm run seed
 * Requires DATABASE_URL env variable to be set.
 */

require('dotenv').config({ path: '.env.local' });
const { getPool, initializeDatabase } = require('./db');
const slugify = require('slugify');

function makeSlug(text) {
  return slugify(text, { lower: true, strict: true });
}

const categories = [
  { name: 'Pistons', description: 'High-performance engine pistons manufactured with precision engineering for automotive and industrial applications.', image_url: '/images/categories/pistons.jpg' },
  { name: 'Piston Rings', description: 'Precision-engineered piston rings for optimal sealing, oil control, and heat transfer in modern engines.', image_url: '/images/categories/piston-rings.jpg' },
  { name: 'Cylinder Liners', description: 'Wet and dry cylinder liners crafted from premium materials for maximum durability and performance.', image_url: '/images/categories/cylinder-liners.jpg' },
  { name: 'Engine Components', description: 'Complete range of engine rebuild components including pins, bearings, and gasket kits.', image_url: '/images/categories/engine-components.jpg' },
  { name: 'Repair Kits', description: 'Complete engine repair kits with matched components for hassle-free engine rebuilds.', image_url: '/images/categories/repair-kits.jpg' }
];

const productData = [
  // Pistons
  {
    name: 'Aluminum Engine Piston 87mm — Toyota 2KD-FTV', category: 'pistons',
    short_description: 'High-strength aluminum alloy piston for Toyota Hilux 2.5L diesel engines.',
    long_description: 'Precision-engineered aluminum alloy piston designed for the Toyota 2KD-FTV engine. Features optimized crown geometry for efficient combustion, anti-friction skirt coating, and precision-machined ring grooves.',
    application: 'Toyota Hilux, Innova, Fortuner', engine_model: '2KD-FTV', oem_number: '13101-30080',
    material: 'Aluminum Alloy', bore_diameter: 87.0, compression_height: 32.5, pin_diameter: 21.0,
    ring_groove_count: 3, weight: 420, crown_type: 'Bowl', skirt_type: 'Full Skirt', coating_type: 'Graphite',
    vehicle_type: 'Pickup Truck / SUV', manufacturer: 'Toyota', model: 'Hilux', year_range: '2005-2015',
    is_featured: true, image_url: '/images/products/piston-87mm-toyota.jpg'
  },
  {
    name: 'Forged Piston 92mm — Cummins ISBe', category: 'pistons',
    short_description: 'Heavy-duty forged steel piston for Cummins ISBe 4.5L/6.7L truck engines.',
    long_description: 'Forged steel piston engineered for Cummins ISBe series engines. Built to withstand extreme combustion pressures in heavy-duty commercial vehicles. Features advanced thermal barrier coating.',
    application: 'Commercial Trucks, Buses', engine_model: 'ISBe 4.5 / 6.7', oem_number: '4955337',
    material: 'Forged Steel', bore_diameter: 92.0, compression_height: 45.0, pin_diameter: 30.0,
    ring_groove_count: 3, weight: 780, crown_type: 'Re-entrant Bowl', skirt_type: 'Strut', coating_type: 'Ceramic TBC',
    vehicle_type: 'Heavy Commercial Vehicle', manufacturer: 'Cummins', model: 'ISBe Series', year_range: '2007-2020',
    is_featured: true, image_url: '/images/products/piston-92mm-cummins.jpg'
  },
  {
    name: 'Aluminum Piston 76mm — Honda L15A', category: 'pistons',
    short_description: 'Lightweight aluminum piston for Honda 1.5L i-VTEC engines.',
    long_description: 'Ultra-lightweight aluminum piston for Honda L15A engines. Designed for fuel-efficient performance with low-friction skirt profile and precision ring grooves for minimal blow-by.',
    application: 'Honda City, Jazz, Fit', engine_model: 'L15A', oem_number: '13101-REB-Z01',
    material: 'Aluminum Alloy', bore_diameter: 76.0, compression_height: 28.5, pin_diameter: 18.0,
    ring_groove_count: 3, weight: 280, crown_type: 'Flat Top', skirt_type: 'Slipper', coating_type: 'Moly',
    vehicle_type: 'Sedan / Hatchback', manufacturer: 'Honda', model: 'City', year_range: '2008-2020',
    is_featured: true, image_url: '/images/products/piston-76mm-honda.jpg'
  },
  {
    name: 'Piston 100mm — Ashok Leyland H-Series', category: 'pistons',
    short_description: 'Robust cast iron piston for Ashok Leyland heavy-duty diesel buses.',
    long_description: 'Heavy-duty cast iron piston designed for Ashok Leyland H-Series diesel engines. Premium surface finish and tight tolerance machining for extended service life.',
    application: 'Ashok Leyland Buses, Trucks', engine_model: 'H-Series 6.0L', oem_number: 'AL-PST-100',
    material: 'Cast Iron', bore_diameter: 100.0, compression_height: 52.0, pin_diameter: 34.0,
    ring_groove_count: 4, weight: 950, crown_type: 'Toroidal Bowl', skirt_type: 'Full Skirt', coating_type: 'Phosphate',
    vehicle_type: 'Bus / Heavy Truck', manufacturer: 'Ashok Leyland', model: 'H-Series', year_range: '2010-2022',
    is_featured: false, image_url: '/images/products/piston-100mm-al.jpg'
  },
  {
    name: 'Performance Piston 86mm — Maruti K-Series', category: 'pistons',
    short_description: 'High-compression aluminum piston for Maruti K-Series 1.2L petrol engines.',
    long_description: 'Performance-oriented piston for Maruti Suzuki K-Series engines. Optimized compression ratio for improved power delivery and fuel economy. Anti-scuff coated skirt.',
    application: 'Maruti Swift, Baleno, DZire', engine_model: 'K12M / K12N', oem_number: '12100-69L00',
    material: 'Aluminum Alloy', bore_diameter: 86.0, compression_height: 30.0, pin_diameter: 19.0,
    ring_groove_count: 3, weight: 310, crown_type: 'Dome', skirt_type: 'Slipper', coating_type: 'DLC',
    vehicle_type: 'Hatchback / Sedan', manufacturer: 'Maruti Suzuki', model: 'Swift', year_range: '2011-2024',
    is_featured: true, image_url: '/images/products/piston-86mm-maruti.jpg'
  },
  {
    name: 'Piston Assembly 83mm — Tata DI Engine', category: 'pistons',
    short_description: 'Complete piston assembly for Tata DI small commercial vehicle engines.',
    long_description: 'Ready-to-install piston assembly for Tata DI engines. Pre-assembled with piston pin and circlips. Tin-plated skirt for anti-scuff protection during break-in.',
    application: 'Tata Ace, Super Ace', engine_model: 'Tata DI 2.0L', oem_number: 'TR-PST-83-TATA',
    material: 'Aluminum Alloy', bore_diameter: 83.0, compression_height: 35.0, pin_diameter: 22.0,
    ring_groove_count: 3, weight: 380, crown_type: 'Bowl', skirt_type: 'Full Skirt', coating_type: 'Tin',
    vehicle_type: 'Light Commercial Vehicle', manufacturer: 'Tata', model: 'Ace', year_range: '2005-2018',
    is_featured: false, image_url: '/images/products/piston-83mm-tata.jpg'
  },
  // Piston Rings
  {
    name: 'Compression Ring Set — 87mm Toyota', category: 'piston-rings',
    short_description: 'Chrome-plated compression ring set for 87mm Toyota diesel pistons.',
    long_description: 'Premium chrome-plated compression ring set for Toyota 2KD-FTV engines. Superior sealing, reduced blow-by, and extended service life.',
    application: 'Toyota Hilux, Innova', engine_model: '2KD-FTV', oem_number: '13011-30080',
    material: 'Chrome-Plated Steel', ring_diameter: 87.0, ring_thickness: 1.5, ring_type: 'Compression Ring',
    ring_material: 'Chrome Steel', coating_type: 'Chrome',
    vehicle_type: 'Pickup Truck', manufacturer: 'Toyota', model: 'Hilux', year_range: '2005-2015',
    is_featured: true, image_url: '/images/products/ring-87mm-comp.jpg'
  },
  {
    name: 'Oil Control Ring Set — 87mm Universal', category: 'piston-rings',
    short_description: 'Multi-piece oil control ring for 87mm bore engines with nitrided finish.',
    long_description: 'Three-piece oil control ring set with nitrided finish. Features spring-loaded expander for consistent radial pressure and optimal oil film control.',
    application: 'Universal 87mm', engine_model: 'Various', oem_number: 'TR-OCR-87',
    material: 'Nitrided Steel', ring_diameter: 87.0, ring_thickness: 2.0, ring_type: 'Oil Control Ring',
    ring_material: 'Nitrided Steel', coating_type: 'Nitride',
    vehicle_type: 'Universal', manufacturer: 'Various', model: 'Universal', year_range: 'All',
    is_featured: false, image_url: '/images/products/ring-87mm-oil.jpg'
  },
  {
    name: 'Ring Set 92mm — Cummins ISBe', category: 'piston-rings',
    short_description: 'Complete piston ring set for 92mm Cummins heavy-duty engines.',
    long_description: 'Complete OEM-grade ring set for Cummins ISBe engines. Includes top compression, second ring, and oil control ring. PVD-coated for extreme durability.',
    application: 'Cummins ISBe Trucks', engine_model: 'ISBe 4.5 / 6.7', oem_number: '4955169',
    material: 'PVD Coated Steel', ring_diameter: 92.0, ring_thickness: 2.0, ring_type: 'Full Ring Set',
    ring_material: 'Steel Alloy', coating_type: 'PVD',
    vehicle_type: 'Heavy Commercial Vehicle', manufacturer: 'Cummins', model: 'ISBe', year_range: '2007-2020',
    is_featured: true, image_url: '/images/products/ring-92mm-cummins.jpg'
  },
  // Cylinder Liners
  {
    name: 'Wet Cylinder Liner — Toyota 2KD-FTV', category: 'cylinder-liners',
    short_description: 'Centrifugally cast wet liner for Toyota 2.5L diesel blocks.',
    long_description: 'Centrifugally cast wet cylinder liner for Toyota 2KD-FTV engines. Precision-honed bore surface, plateau honing finish.',
    application: 'Toyota Hilux, Innova, Fortuner', engine_model: '2KD-FTV', oem_number: '11461-30050',
    material: 'Cast Iron', liner_type: 'Wet Liner', outer_diameter: 95.0, inner_diameter: 87.0, length: 145.0,
    flange_type: 'Flanged Top', hardness: '220-260 BHN', surface_finish: 'Plateau Honed',
    vehicle_type: 'Pickup Truck / SUV', manufacturer: 'Toyota', model: 'Hilux', year_range: '2005-2015',
    is_featured: true, image_url: '/images/products/liner-wet-toyota.jpg'
  },
  {
    name: 'Dry Cylinder Liner — Honda L15A', category: 'cylinder-liners',
    short_description: 'Press-fit dry liner for Honda 1.5L petrol engine blocks.',
    long_description: 'Precision-machined dry cylinder liner for Honda L15A engines. Thin-wall design, diamond-honed bore for minimal friction.',
    application: 'Honda City, Jazz', engine_model: 'L15A', oem_number: 'TR-DL-76',
    material: 'Ductile Iron', liner_type: 'Dry Liner', outer_diameter: 80.0, inner_diameter: 76.0, length: 120.0,
    flange_type: 'Flangeless', hardness: '200-240 BHN', surface_finish: 'Diamond Honed',
    vehicle_type: 'Sedan / Hatchback', manufacturer: 'Honda', model: 'City', year_range: '2008-2020',
    is_featured: false, image_url: '/images/products/liner-dry-honda.jpg'
  },
  {
    name: 'Heavy-Duty Wet Liner — Cummins ISBe', category: 'cylinder-liners',
    short_description: 'Thick-wall wet liner for Cummins medium/heavy-duty diesel engines.',
    long_description: 'Heavy-duty wet cylinder liner for Cummins ISBe series. Centrifugally cast with high-phosphorus iron for exceptional wear resistance.',
    application: 'Commercial Trucks', engine_model: 'ISBe 6.7', oem_number: '3904167',
    material: 'High-Phosphorus Cast Iron', liner_type: 'Wet Liner', outer_diameter: 102.0,
    inner_diameter: 92.0, length: 180.0, flange_type: 'Mid-Stop Flanged', hardness: '260-300 BHN',
    surface_finish: 'Plateau Honed',
    vehicle_type: 'Heavy Commercial Vehicle', manufacturer: 'Cummins', model: 'ISBe 6.7', year_range: '2007-2020',
    is_featured: false, image_url: '/images/products/liner-wet-cummins.jpg'
  },
  // Engine Components
  {
    name: 'Piston Pin — 21mm Toyota', category: 'engine-components',
    short_description: 'Case-hardened piston pin for Toyota 87mm pistons.',
    long_description: 'Case-hardened, precision-ground piston pin for Toyota 87mm pistons. Diamond-polished surface finish for reduced friction.',
    application: 'Toyota Hilux, Innova', engine_model: '2KD-FTV', oem_number: '13111-30060',
    material: 'Case-Hardened Steel', pin_diameter: 21.0, weight: 95, length: 62.0,
    vehicle_type: 'Pickup Truck / SUV', manufacturer: 'Toyota', model: 'Hilux', year_range: '2005-2015',
    is_featured: false, image_url: '/images/products/pin-21mm-toyota.jpg'
  },
  {
    name: 'Piston Pin — 30mm Cummins', category: 'engine-components',
    short_description: 'Heavy-duty piston pin for Cummins 92mm pistons.',
    long_description: 'Heavy-duty piston pin for Cummins ISBe series engines. Induction-hardened surface with ground finish.',
    application: 'Cummins Trucks', engine_model: 'ISBe 6.7', oem_number: '3934046',
    material: 'Induction-Hardened Steel', pin_diameter: 30.0, weight: 180, length: 75.0,
    vehicle_type: 'Heavy Commercial Vehicle', manufacturer: 'Cummins', model: 'ISBe', year_range: '2007-2020',
    is_featured: false, image_url: '/images/products/pin-30mm-cummins.jpg'
  },
  {
    name: 'Connecting Rod Bearing — Toyota 2KD', category: 'engine-components',
    short_description: 'Tri-metal connecting rod bearing shells for Toyota diesel engines.',
    long_description: 'Tri-metal connecting rod bearing set for Toyota 2KD-FTV engines. Features copper-lead-tin overlay on steel backing.',
    application: 'Toyota Hilux, Innova', engine_model: '2KD-FTV', oem_number: '13041-30020',
    material: 'Tri-Metal (Steel/Copper/Tin)', bore_diameter: 52.0, weight: 45,
    vehicle_type: 'Pickup Truck', manufacturer: 'Toyota', model: 'Hilux', year_range: '2005-2015',
    is_featured: false, image_url: '/images/products/bearing-toyota-2kd.jpg'
  },
  {
    name: 'Cylinder Head Gasket — Toyota 2KD', category: 'engine-components',
    short_description: 'Multi-layer steel (MLS) head gasket for Toyota 2.5L diesel engines.',
    long_description: 'Three-layer steel head gasket with elastomer coating for Toyota 2KD-FTV engines. Reliable sealing at high combustion pressures.',
    application: 'Toyota Hilux, Fortuner', engine_model: '2KD-FTV', oem_number: '11115-30060',
    material: 'Multi-Layer Steel', bore_diameter: 87.0, ring_thickness: 1.2,
    vehicle_type: 'Pickup Truck / SUV', manufacturer: 'Toyota', model: 'Hilux', year_range: '2005-2015',
    is_featured: false, image_url: '/images/products/gasket-toyota-2kd.jpg'
  },
  // Repair Kits
  {
    name: 'Engine Rebuild Kit — Toyota 2KD-FTV', category: 'repair-kits',
    short_description: 'Complete rebuild kit including pistons, rings, liners, gaskets, and bearings.',
    long_description: 'All-in-one engine rebuild kit for Toyota 2KD-FTV engines. Includes 4 pistons, ring sets, cylinder liners, head gasket, piston pins, and connecting rod bearings.',
    application: 'Toyota Hilux, Innova, Fortuner', engine_model: '2KD-FTV', oem_number: 'TR-KIT-2KD',
    material: 'Mixed (Aluminum, Steel, Iron)', bore_diameter: 87.0,
    vehicle_type: 'Pickup Truck / SUV', manufacturer: 'Toyota', model: 'Hilux', year_range: '2005-2015',
    is_featured: true, image_url: '/images/products/kit-toyota-2kd.jpg'
  },
  {
    name: 'Piston & Ring Kit — Honda L15A', category: 'repair-kits',
    short_description: 'Matched piston and ring set for Honda 1.5L engines.',
    long_description: 'Matched piston and ring kit for Honda L15A engines. Includes 4 pistons with pre-fitted ring grooves and matching ring sets.',
    application: 'Honda City, Jazz, Fit', engine_model: 'L15A', oem_number: 'TR-KIT-L15A',
    material: 'Aluminum Alloy / Chrome Steel', bore_diameter: 76.0,
    vehicle_type: 'Sedan / Hatchback', manufacturer: 'Honda', model: 'City', year_range: '2008-2020',
    is_featured: false, image_url: '/images/products/kit-honda-l15a.jpg'
  },
  {
    name: 'HD Rebuild Kit — Cummins ISBe 6.7', category: 'repair-kits',
    short_description: 'Heavy-duty rebuild kit for Cummins ISBe 6-cylinder diesel engines.',
    long_description: 'Commercial-grade rebuild kit for Cummins ISBe 6.7L engines. Includes 6 forged pistons, complete ring sets, wet liners, and all gaskets.',
    application: 'Commercial Trucks, Buses', engine_model: 'ISBe 6.7', oem_number: 'TR-KIT-ISBE67',
    material: 'Forged Steel / Cast Iron', bore_diameter: 92.0,
    vehicle_type: 'Heavy Commercial Vehicle', manufacturer: 'Cummins', model: 'ISBe 6.7', year_range: '2007-2020',
    is_featured: false, image_url: '/images/products/kit-cummins-isbe.jpg'
  }
];

async function seed() {
  await initializeDatabase();
  const db = getPool();

  // Insert categories
  for (const cat of categories) {
    await db.query(`
      INSERT INTO categories (name, slug, description, image_url)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (slug) DO NOTHING
    `, [cat.name, makeSlug(cat.name), cat.description, cat.image_url]);
  }
  console.log('✓ Categories seeded');

  // Fetch category IDs
  const catResult = await db.query('SELECT id, slug FROM categories');
  const catMap = {};
  for (const row of catResult.rows) catMap[row.slug] = row.id;

  // Insert products
  let count = 0;
  for (const p of productData) {
    const slug = makeSlug(p.name);
    const categoryId = catMap[p.category];

    await db.query(`
      INSERT INTO products (
        name, slug, category_id, short_description, long_description,
        application, engine_model, oem_number, brand, material, image_url,
        bore_diameter, compression_height, pin_diameter, ring_groove_count, weight,
        crown_type, skirt_type, coating_type, vehicle_type, manufacturer, model,
        year_range, ring_diameter, ring_thickness, ring_type, ring_material,
        liner_type, outer_diameter, inner_diameter, length, flange_type,
        hardness, surface_finish, is_featured, meta_title, meta_description
      ) VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,'Tracko',$9,$10,
        $11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,
        $22,$23,$24,$25,$26,$27,$28,$29,$30,$31,$32,$33,$34,$35,$36
      )
      ON CONFLICT (slug) DO NOTHING
    `, [
      p.name, slug, categoryId, p.short_description, p.long_description || null,
      p.application || null, p.engine_model || null, p.oem_number || null,
      p.material || null, p.image_url || null,
      p.bore_diameter || null, p.compression_height || null, p.pin_diameter || null,
      p.ring_groove_count || null, p.weight || null,
      p.crown_type || null, p.skirt_type || null, p.coating_type || null,
      p.vehicle_type || null, p.manufacturer || null, p.model || null,
      p.year_range || null, p.ring_diameter || null, p.ring_thickness || null,
      p.ring_type || null, p.ring_material || null,
      p.liner_type || null, p.outer_diameter || null, p.inner_diameter || null,
      p.length || null, p.flange_type || null,
      p.hardness || null, p.surface_finish || null, p.is_featured || false,
      `${p.name} | Tracko Parts`, p.short_description
    ]);
    count++;
  }

  console.log(`✓ ${count} products seeded`);
  console.log('✓ Database seeding complete');
  await db.end();
}

seed().catch(err => {
  console.error('Seed failed:', err);
  process.exit(1);
});
