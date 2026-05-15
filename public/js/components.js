/* ========================================
   TRACKO — Reusable UI Components
   ======================================== */

const TrackoUI = {

  /* ======== SVG Icons ======== */
  icons: {
    search: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>',
    filter: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>',
    chevronDown: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',
    chevronRight: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>',
    arrowRight: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>',
    arrowUp: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m18 15-6-6-6 6"/></svg>',
    mail: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>',
    phone: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',
    mapPin: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>',
    globe: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>',
    clock: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
    shield: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></svg>',
    package: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16.5 9.4 7.55 4.24"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.29 7 12 12 20.71 7"/><line x1="12" x2="12" y1="22" y2="12"/></svg>',
    settings: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>',
    eye: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>',
    x: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',
    menu: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>',
    database: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5V19A9 3 0 0 0 21 19V5"/><path d="M3 12A9 3 0 0 0 21 12"/></svg>',
    inbox: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>',
    layers: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22.54 12.43-1.96-.89L12.6 15.44a2 2 0 0 1-1.2 0l-7.98-3.9-1.96.89a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 .26-1.84Z"/></svg>',
    zap: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/></svg>',
  },

  /* ======== Header Component ======== */
  renderHeader(activePage = '') {
    return `
    <header class="header" id="site-header">
      <div class="header__top">
        <div class="container">
          <div class="header__top-links">
            ${this.icons.mail} <a href="mailto:info@trackoparts.com">info@trackoparts.com</a>
            <span style="opacity:0.3">|</span>
            ${this.icons.phone} <a href="tel:+911234567890">+91 123 456 7890</a>
          </div>
          <div class="header__top-links">
            ${this.icons.globe} Exporting to 40+ Countries
          </div>
        </div>
      </div>
      <div class="header__main">
        <div class="container">
          <a href="/" class="header__logo">
            TRACK<span>O</span>
          </a>
          <nav class="header__nav" id="main-nav">
            <a href="/" class="${activePage === 'home' ? 'active' : ''}">Home</a>
            <a href="/products.html" class="${activePage === 'products' ? 'active' : ''}">Products</a>
            <a href="/about.html" class="${activePage === 'about' ? 'active' : ''}">About Us</a>
            <a href="/contact.html" class="${activePage === 'contact' ? 'active' : ''}">Contact</a>
            <a href="/quote.html" class="btn btn--primary btn--sm">Request Quote</a>
          </nav>
          <div class="header__actions">
            <button class="header__menu-toggle" id="menu-toggle" aria-label="Toggle menu">
              ${this.icons.menu}
            </button>
          </div>
        </div>
      </div>
    </header>`;
  },

  /* ======== Footer Component ======== */
  renderFooter() {
    return `
    <footer class="footer" id="site-footer">
      <div class="container">
        <div class="footer__grid">
          <div>
            <div class="footer__brand">TRACK<span>O</span></div>
            <p class="footer__desc">
              India's trusted manufacturer of precision engine pistons, piston rings, 
              cylinder liners, and engine components. Exporting quality worldwide since 2005.
            </p>
            <div class="footer__social">
              <a href="#" aria-label="Facebook">f</a>
              <a href="#" aria-label="LinkedIn">in</a>
              <a href="#" aria-label="Twitter">𝕏</a>
              <a href="#" aria-label="YouTube">▶</a>
            </div>
          </div>
          <div>
            <h4 class="footer__heading">Products</h4>
            <div class="footer__links">
              <a href="/products.html?category=pistons">Pistons</a>
              <a href="/products.html?category=piston-rings">Piston Rings</a>
              <a href="/products.html?category=cylinder-liners">Cylinder Liners</a>
              <a href="/products.html?category=engine-components">Engine Components</a>
              <a href="/products.html?category=repair-kits">Repair Kits</a>
            </div>
          </div>
          <div>
            <h4 class="footer__heading">Company</h4>
            <div class="footer__links">
              <a href="/about.html">About Us</a>
              <a href="/about.html#manufacturing">Manufacturing</a>
              <a href="/about.html#certifications">Certifications</a>
              <a href="/contact.html">Contact</a>
              <a href="/quote.html">Request Quote</a>
              <a href="/admin-login.html">Admin Login</a>
            </div>
          </div>
          <div>
            <h4 class="footer__heading">Contact</h4>
            <div class="footer__contact-item">
              ${this.icons.mapPin}
              <span>Plot 45, Industrial Area, Phase-II,<br>Rajkot, Gujarat 360002, India</span>
            </div>
            <div class="footer__contact-item">
              ${this.icons.phone}
              <span>+91 123 456 7890</span>
            </div>
            <div class="footer__contact-item">
              ${this.icons.mail}
              <span>info@trackoparts.com</span>
            </div>
            <div class="footer__contact-item">
              ${this.icons.clock}
              <span>Mon–Sat: 9:00 AM – 6:00 PM</span>
            </div>
          </div>
        </div>
      </div>
      <div class="footer__bottom">
        <div class="container">
          © ${new Date().getFullYear()} Tracko Parts. All Rights Reserved. | Precision Engineered in India
        </div>
      </div>
    </footer>
    <button class="scroll-top" aria-label="Scroll to top">${this.icons.arrowUp}</button>`;
  },

  /* ======== Product Card Component ======== */
  renderProductCard(product) {
    const imgSrc = product.image_url || getPlaceholderImage(product.name);
    const specs = [];
    if (product.bore_diameter) specs.push({ label: 'Bore', value: `${product.bore_diameter}mm` });
    if (product.material) specs.push({ label: 'Material', value: product.material });
    if (product.engine_model) specs.push({ label: 'Engine', value: product.engine_model });
    if (product.weight) specs.push({ label: 'Weight', value: `${product.weight}g` });

    return `
    <div class="product-card fade-in" id="product-${product.id}">
      <div class="product-card__image">
        <img src="${sanitize(imgSrc)}" alt="${sanitize(product.name)}" loading="lazy"
             onerror="this.src='${getPlaceholderImage(product.name)}'">
        ${product.is_featured ? '<span class="product-card__badge badge badge--primary">Featured</span>' : ''}
        <a href="/product.html?slug=${sanitize(product.slug)}" class="product-card__quick-view" aria-label="View details">
          ${this.icons.eye}
        </a>
      </div>
      <div class="product-card__body">
        <span class="product-card__category">${sanitize(product.category_name || '')}</span>
        <h3 class="product-card__name">
          <a href="/product.html?slug=${sanitize(product.slug)}">${sanitize(product.name)}</a>
        </h3>
        <div class="product-card__spec">
          ${specs.map(s => `
            <div class="product-card__spec-row">
              <span class="product-card__spec-label">${s.label}</span>
              <span class="product-card__spec-value">${sanitize(s.value)}</span>
            </div>
          `).join('')}
        </div>
        <div class="product-card__actions">
          <a href="/product.html?slug=${sanitize(product.slug)}" class="btn btn--primary btn--sm">
            View Details ${this.icons.arrowRight}
          </a>
        </div>
      </div>
    </div>`;
  },

  /* ======== Product Grid Component ======== */
  renderProductGrid(products) {
    if (!products.length) {
      return `
        <div class="empty-state">
          <div class="empty-state__icon">${this.icons.package}</div>
          <h3 class="empty-state__title">No Products Found</h3>
          <p class="empty-state__desc">Try adjusting your search or filters to find what you're looking for.</p>
          <button class="btn btn--outline btn--sm" onclick="clearAllFilters()">Clear Filters</button>
        </div>`;
    }
    return `<div class="product-grid">${products.map(p => this.renderProductCard(p)).join('')}</div>`;
  },

  /* ======== Pagination Component ======== */
  renderPagination(pagination, onPageChange) {
    if (pagination.pages <= 1) return '';
    
    let html = '<div class="pagination">';
    
    // Previous button
    html += `<button class="pagination__btn" ${pagination.page <= 1 ? 'disabled' : ''} 
              onclick="${onPageChange}(${pagination.page - 1})">‹</button>`;
    
    // Page numbers
    const start = Math.max(1, pagination.page - 2);
    const end = Math.min(pagination.pages, pagination.page + 2);
    
    if (start > 1) {
      html += `<button class="pagination__btn" onclick="${onPageChange}(1)">1</button>`;
      if (start > 2) html += '<span class="pagination__btn" style="border:none;cursor:default">…</span>';
    }
    
    for (let i = start; i <= end; i++) {
      html += `<button class="pagination__btn ${i === pagination.page ? 'active' : ''}" 
                onclick="${onPageChange}(${i})">${i}</button>`;
    }
    
    if (end < pagination.pages) {
      if (end < pagination.pages - 1) html += '<span class="pagination__btn" style="border:none;cursor:default">…</span>';
      html += `<button class="pagination__btn" onclick="${onPageChange}(${pagination.pages})">${pagination.pages}</button>`;
    }
    
    // Next button
    html += `<button class="pagination__btn" ${pagination.page >= pagination.pages ? 'disabled' : ''} 
              onclick="${onPageChange}(${pagination.page + 1})">›</button>`;
    
    html += '</div>';
    return html;
  },

  /* ======== Spec Table Component ======== */
  renderSpecTable(product) {
    const specs = [];
    const add = (label, value, unit = '') => {
      if (value) specs.push({ label, value: `${value}${unit}` });
    };

    add('Bore Diameter', product.bore_diameter, ' mm');
    add('Compression Height', product.compression_height, ' mm');
    add('Overall Height', product.overall_height, ' mm');
    add('Pin Diameter', product.pin_diameter, ' mm');
    add('Ring Groove Count', product.ring_groove_count);
    add('Crown Type', product.crown_type);
    add('Skirt Type', product.skirt_type);
    add('Coating', product.coating_type);
    add('Material', product.material);
    add('Weight', product.weight, ' g');
    add('OEM Number', product.oem_number);
    if (product.ring_diameter) add('Ring Diameter', product.ring_diameter, ' mm');
    if (product.ring_thickness) add('Ring Thickness', product.ring_thickness, ' mm');
    if (product.ring_type) add('Ring Type', product.ring_type);
    if (product.ring_material) add('Ring Material', product.ring_material);
    if (product.liner_type) add('Liner Type', product.liner_type);
    if (product.outer_diameter) add('Outer Diameter', product.outer_diameter, ' mm');
    if (product.inner_diameter) add('Inner Diameter', product.inner_diameter, ' mm');
    if (product.length) add('Length', product.length, ' mm');
    if (product.flange_type) add('Flange Type', product.flange_type);
    if (product.hardness) add('Hardness', product.hardness);
    if (product.surface_finish) add('Surface Finish', product.surface_finish);

    if (!specs.length) return '<p class="text-muted">No specifications available.</p>';

    return `
      <table class="spec-table">
        <tbody>
          ${specs.map(s => `
            <tr>
              <th>${sanitize(s.label)}</th>
              <td>${sanitize(s.value)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>`;
  },

  /* ======== Breadcrumb Component ======== */
  renderBreadcrumb(items) {
    return `
    <nav class="breadcrumb">
      ${items.map((item, i) => {
        if (i === items.length - 1) {
          return `<span style="color:var(--color-dark);font-weight:var(--fw-medium)">${sanitize(item.label)}</span>`;
        }
        return `<a href="${item.href}">${sanitize(item.label)}</a><span class="breadcrumb__separator">/</span>`;
      }).join('')}
    </nav>`;
  },

  /* ======== Initialize mobile menu ======== */
  initMobileMenu() {
    const toggle = document.getElementById('menu-toggle');
    const nav = document.getElementById('main-nav');
    if (toggle && nav) {
      toggle.addEventListener('click', () => nav.classList.toggle('open'));
      document.addEventListener('click', (e) => {
        if (!toggle.contains(e.target) && !nav.contains(e.target)) {
          nav.classList.remove('open');
        }
      });
    }
  }
};
