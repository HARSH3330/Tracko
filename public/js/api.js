/* ========================================
   TRACKO — API Client
   ======================================== */

const API_BASE = '/api';

const TrackoAPI = {
  /**
   * Fetch products with optional filters
   */
  async getProducts(params = {}) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        query.set(key, val);
      }
    });
    const res = await fetch(`${API_BASE}/products?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch products');
    return res.json();
  },

  /**
   * Fetch single product by slug
   */
  async getProduct(slug) {
    const res = await fetch(`${API_BASE}/products/${slug}`);
    if (!res.ok) throw new Error('Product not found');
    return res.json();
  },

  /**
   * Fetch filter options
   */
  async getFilters() {
    const res = await fetch(`${API_BASE}/products/filters`);
    if (!res.ok) throw new Error('Failed to fetch filters');
    return res.json();
  },

  /**
   * Fetch all categories
   */
  async getCategories() {
    const res = await fetch(`${API_BASE}/categories`);
    if (!res.ok) throw new Error('Failed to fetch categories');
    return res.json();
  },

  /**
   * Submit an inquiry / quote request
   */
  async submitInquiry(data) {
    const res = await fetch(`${API_BASE}/inquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to submit inquiry');
    return json;
  },

  // ---- Admin endpoints ----

  _adminHeaders() {
    const token = localStorage.getItem('tracko_admin_token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  },

  async _adminFetch(url, options = {}) {
    options.headers = { ...this._adminHeaders(), ...options.headers };
    const res = await fetch(url, options);
    if (res.status === 401) {
      localStorage.removeItem('tracko_admin_token');
      window.location.href = '/admin-login.html';
      throw new Error('Session expired');
    }
    return res;
  },

  checkAdminAuth() {
    if (!localStorage.getItem('tracko_admin_token')) {
      window.location.href = '/admin-login.html';
      return false;
    }
    return true;
  },

  async adminLogout() {
    try {
      await fetch(`${API_BASE}/admin/logout`, {
        method: 'POST',
        headers: this._adminHeaders()
      });
    } catch (e) { /* ignore */ }
    localStorage.removeItem('tracko_admin_token');
    window.location.href = '/admin-login.html';
  },

  async getStats() {
    const res = await this._adminFetch(`${API_BASE}/admin/stats`);
    if (!res.ok) throw new Error('Failed to fetch stats');
    return res.json();
  },

  async getInquiries(params = {}) {
    const query = new URLSearchParams(params);
    const res = await this._adminFetch(`${API_BASE}/inquiries?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch inquiries');
    return res.json();
  },

  async updateProduct(id, data) {
    const res = await this._adminFetch(`${API_BASE}/admin/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to update product');
    return json;
  },

  async deleteProduct(id) {
    const res = await this._adminFetch(`${API_BASE}/admin/products/${id}`, {
      method: 'DELETE'
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to delete product');
    return json;
  },

  async addCategory(data) {
    const res = await this._adminFetch(`${API_BASE}/admin/categories`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to add category');
    return json;
  },

  async triggerScrape() {
    const res = await this._adminFetch(`${API_BASE}/admin/scrape`, {
      method: 'POST'
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to trigger scraper');
    return json;
  },

  async updateInquiryStatus(id, status) {
    const res = await this._adminFetch(`${API_BASE}/admin/inquiries/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to update inquiry');
    return json;
  }
};

