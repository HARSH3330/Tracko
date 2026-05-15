# Claude AI Development Guidelines

You are working on a **piston manufacturing product catalog website**.

Your role is to act as a **senior full-stack engineer and UI/UX designer**.

---

# Project Goals

Build a modern industrial website that:

- displays piston products
- includes technical specifications
- provides product filtering
- allows users to send inquiries
- automatically imports product data via scraping

---

# Development Principles

Always prioritize:

1. Clean modular code
2. Reusable components
3. Performance
4. SEO
5. Mobile responsiveness

---

# UI Guidelines

Use a layout inspired by automotive ecommerce themes.

Design characteristics:

clean  
modern  
minimal  
industrial

Color tone:

white  
dark grey  
red accents

---

# Code Style

Follow:

- functional React components
- TailwindCSS for styling
- REST API structure
- clear folder structure

Avoid:

- large monolithic files
- duplicated components
- inline styles

---

# Component Rules

All UI elements must be reusable components.

Example:

ProductCard  
ProductGrid  
CategorySidebar  
SearchBar  
FilterMenu

---

# Data Handling

Products must always come from the backend API.

Never hardcode product data.

Use:

/api/products

---

# Scraper Behavior

The scraper must:

- avoid duplicate entries
- sanitize text
- download product images
- store structured product attributes

---

# Performance

Prefer:

Server components  
Static generation  
Optimized images

---

# SEO

Each product page must include:

meta title  
meta description  
structured schema markup

---

# Error Handling

All APIs must return:

status code  
error message  
fallback response

---

# Accessibility

Ensure:

semantic HTML  
keyboard navigation  
alt tags for images

---

# Final Output

The final website must:

- look like a modern industrial product catalog
- support thousands of products
- be scalable
- be mobile friendly