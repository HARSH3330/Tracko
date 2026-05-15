# Architecture Documentation

## Project Overview

This project is a **modern product catalog website for a piston manufacturing company**.

The website will:

- showcase piston and engine component products
- provide a searchable product catalog
- scrape and synchronize product data from a reference supplier website
- allow users to browse specifications and request quotes

The UI/UX inspiration comes from the **Flozen Minimal AJAX Store theme** style.

---

# System Architecture

The system follows a **three layer architecture**:

1. Frontend
2. Backend API
3. Data Scraping Service

Client Browser
↓
Frontend (Next.js)
↓
Backend API (Node.js / Express)
↓
Database (PostgreSQL)

Scraper Service
↓
Fetch Data from External Website
↓
Store Structured Data in Database

---

# Frontend Architecture

Framework: **Next.js**

Responsibilities:

- Render product catalog
- Display product details
- Implement filtering and search
- Show company information
- Handle inquiry forms

Key Pages:

Home  
Products  
Product Details  
About Us  
Contact  
Quote Request

Component Structure

/components

HeroSection  
ProductCard  
ProductGrid  
CategoryMenu  
SearchBar  
FilterPanel  
Footer  
Header

---

# Backend Architecture

Framework: Node.js + Express

Responsibilities:

- Product API
- Category API
- Search API
- Inquiry API
- Scraper trigger endpoint

API Structure

/api

/products  
/products/:slug  
/categories  
/search  
/inquiry

---

# Database Architecture

Database: PostgreSQL

Tables:

Products

id  
name  
slug  
description  
category_id  
material  
diameter  
application  
image_url  
created_at  
updated_at

Categories

id  
name  
slug  
description

Inquiries

id  
name  
email  
company  
message  
product_id  
created_at

---

# Scraper Service

A scraping module extracts product data from:

https://trackoparts.com

Technology:

Puppeteer or Playwright

Scraper Flow

1. Fetch product category pages
2. Extract product links
3. Visit each product page
4. Parse product details
5. Normalize data
6. Save into database

Scraper runs:

- manually from admin
- automatically via cron job (24 hours)

---

# File Structure


root

/frontend
/components
/pages
/styles

/backend
/controllers
/routes
/services
/models

/scraper
scrapeProducts.js
parseProducts.js
saveProducts.js

/database
schema.sql

/docs
architecture.md
claude.md
designsystem.md


---

# Performance Strategy

Use:

Static generation for product pages  
Lazy loading images  
API caching  
CDN for assets

---

# Security

Implement:

rate limiting  
input validation  
scraper retry mechanism  
duplicate product detection

---

# Deployment

Frontend:

Vercel

Backend:

Render or Railway

Database:

Supabase or Neon