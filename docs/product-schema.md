# Product Schema – Piston Catalog

This document defines the **data schema and technical attributes** used for piston and engine component products.

The goal is to support **industrial-grade product specifications** similar to automotive OEM catalogs.

The system must support **thousands of products with detailed engineering specifications.**

---

# Product Entity

Each product represents an engine component such as:

- Piston
- Piston Ring
- Cylinder Liner
- Engine Sleeve
- Engine Kit

Products must contain both **marketing information and technical specifications.**

---

# Core Product Fields

id  
name  
slug  
category  
short_description  
long_description  
application  
engine_model  
oem_number  
brand  
material  
image_url  
created_at  
updated_at

---

# Piston Specification Fields

These fields are specific to piston components.

bore_diameter  
compression_height  
overall_height  
pin_diameter  
ring_groove_count  
ring_groove_width  
crown_type  
skirt_type  
coating_type  
weight

Units should be standardized:

mm for dimensions  
grams for weight

---

# Piston Ring Specifications

If the product category is **Piston Rings**, include:

ring_diameter  
ring_thickness  
ring_material  
coating  
ring_type

Types may include:

compression ring  
oil control ring  
scraper ring

---

# Cylinder Liner Specifications

If the product category is **Cylinder Liner**, include:

liner_type  
outer_diameter  
inner_diameter  
length  
flange_type  
hardness  
surface_finish

Possible liner types:

dry liner  
wet liner

---

# Material Specifications

Materials may include:

aluminum alloy  
cast iron  
ductile iron  
steel alloy

Include additional material properties if available:

tensile_strength  
hardness_rating  
thermal_expansion

---

# Application Data

Each product should store the engine compatibility.

application_engine  
vehicle_type  
manufacturer  
model  
year_range

Example:

Manufacturer: Toyota  
Model: Hilux  
Engine: 2KD-FTV

---

# Product Images

Each product can have multiple images.

images

primary_image  
gallery_images

Images should be stored as URLs.

---

# Product Categories

Categories include:

Pistons  
Piston Rings  
Cylinder Liners  
Engine Components  
Repair Kits

Each product must belong to one category.

---

# Product Relationships

Products may be related.

Examples:

piston → compatible piston rings  
piston → compatible cylinder liner  
engine kit → multiple components

Use relational mapping.

---

# SEO Fields

Each product should also store:

meta_title  
meta_description  
meta_keywords

---

# Inquiry Support

Products should support direct inquiry.

Fields:

inquiry_enabled  
minimum_order_quantity  
lead_time

---

# Example Product Object


{
"name": "Aluminum Engine Piston 87mm",
"category": "Pistons",
"bore_diameter": 87,
"compression_height": 32.5,
"pin_diameter": 21,
"ring_groove_count": 3,
"material": "Aluminum Alloy",
"weight": 420,
"application_engine": "Toyota 2KD-FTV",
"vehicle_type": "Pickup Truck"
}


---

# Data Validation Rules

The system must validate:

bore_diameter > 0  
compression_height > 0  
ring_groove_count >= 1

Text fields must be sanitized before database insertion.

---

# Future Expansion

The schema should allow expansion for:

- crankshafts
- connecting rods
- engine rebuild kits
- valves
- bearings

The system must be designed to support **10,000+ products without performance issues.**