/* ========================================
   TRACKO — Language Translator
   Google Translate Integration
   ======================================== */

window.TrackoI18n = {
  /* Supported languages with display names and flags */
  languages: [
    { code: 'en', name: 'English',    flag: '🇬🇧' },
    { code: 'hi', name: 'हिन्दी',     flag: '🇮🇳' },
    { code: 'ar', name: 'العربية',    flag: '🇸🇦' },
    { code: 'de', name: 'Deutsch',    flag: '🇩🇪' },
    { code: 'fr', name: 'Français',   flag: '🇫🇷' },
    { code: 'es', name: 'Español',    flag: '🇪🇸' },
    { code: 'pt', name: 'Português',  flag: '🇧🇷' },
    { code: 'tr', name: 'Türkçe',     flag: '🇹🇷' },
    { code: 'id', name: 'Indonesia',  flag: '🇮🇩' },
    { code: 'zh-CN', name: '中文',    flag: '🇨🇳' },
    { code: 'ja', name: '日本語',     flag: '🇯🇵' },
    { code: 'ko', name: '한국어',     flag: '🇰🇷' },
    { code: 'ru', name: 'Русский',    flag: '🇷🇺' },
    { code: 'sw', name: 'Kiswahili',  flag: '🇰🇪' },
    { code: 'yo', name: 'Yorùbá',     flag: '🇳🇬' },
  ],

  getCurrentLang() {
    const cookie = document.cookie.match(/googtrans=\/en\/([^;]+)/);
    return cookie ? cookie[1] : 'en';
  },

  translateTo(langCode) {
    if (langCode === 'en') {
      // Reset to English: clear the googtrans cookie and reload
      document.cookie = 'googtrans=/en/en; path=/; domain=' + window.location.hostname;
      document.cookie = 'googtrans=/en/en; path=/';
      window.location.reload();
      return;
    }
    const select = document.querySelector('.goog-te-combo');
    if (select) {
      select.value = langCode;
      select.dispatchEvent(new Event('change'));
    } else {
      document.cookie = `googtrans=/en/${langCode}; path=/; domain=${window.location.hostname}`;
      document.cookie = `googtrans=/en/${langCode}; path=/`;
      window.location.reload();
    }
    localStorage.setItem('tracko_lang', langCode);
    this.updateDropdownUI(langCode);
  },

  updateDropdownUI(langCode) {
    const lang = this.languages.find(l => l.code === langCode) || this.languages[0];
    const btn = document.getElementById('lang-switcher-btn');
    if (btn) {
      btn.innerHTML = `${lang.flag} ${lang.name} <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>`;
    }
  },

  renderSwitcher() {
    const current = this.getCurrentLang();
    const lang = this.languages.find(l => l.code === current) || this.languages[0];
    const items = this.languages.map(l => `
      <button class="lang-option${l.code === current ? ' active' : ''}" onclick="TrackoI18n.translateTo('${l.code}')">
        <span class="lang-option__flag">${l.flag}</span>
        <span class="lang-option__name">${l.name}</span>
        ${l.code === current ? '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 4.5 4.5L19 7"/></svg>' : ''}
      </button>
    `).join('');

    return `
      <div class="lang-switcher" id="lang-switcher">
        <button class="lang-switcher__btn" id="lang-switcher-btn" onclick="TrackoI18n.toggleDropdown()" aria-label="Change language">
          ${lang.flag} ${lang.name}
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
        </button>
        <div class="lang-switcher__dropdown" id="lang-dropdown">
          <div class="lang-dropdown__header">Select Language</div>
          <div class="lang-dropdown__grid">${items}</div>
        </div>
        <!-- Hidden Google Translate element -->
        <div id="google_translate_element" style="display:none;"></div>
      </div>
    `;
  },

  toggleDropdown() {
    const dropdown = document.getElementById('lang-dropdown');
    const switcher = document.getElementById('lang-switcher');
    if (dropdown && switcher) {
      const isOpen = dropdown.classList.toggle('open');
      switcher.classList.toggle('open', isOpen);
    }
  },

  init() {
    // Load Google Translate script
    const script = document.createElement('script');
    script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    document.head.appendChild(script);

    // Google Translate callback
    window.googleTranslateElementInit = function () {
      new google.translate.TranslateElement({
        pageLanguage: 'en',
        autoDisplay: false,
        layout: google.translate.TranslateElement.InlineLayout.SIMPLE
      }, 'google_translate_element');
    };

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      const switcher = document.getElementById('lang-switcher');
      if (switcher && !switcher.contains(e.target)) {
        document.getElementById('lang-dropdown')?.classList.remove('open');
        switcher.classList.remove('open');
      }
    });

    // Restore last selected language
    const savedLang = localStorage.getItem('tracko_lang');
    if (savedLang && savedLang !== 'en') {
      this.updateDropdownUI(savedLang);
    }

    // Hide the ugly Google bar
    const style = document.createElement('style');
    style.textContent = `
      .goog-te-banner-frame, .goog-te-gadget { display:none !important; }
      body { top: 0 !important; }
      .skiptranslate { display:none !important; }
    `;
    document.head.appendChild(style);
  }
};
