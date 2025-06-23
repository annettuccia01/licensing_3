class I18n {
  constructor() {
    this.translations = {};
    this.currentLang = localStorage.getItem('preferredLanguage') || 
                      navigator.language.split('-')[0] || 
                      'en';
    this.langChangeCallbacks = [];
  }

  async loadTranslations(page) {
    try {
      // Загружаем общие переводы
      const commonResponse = await fetch('/locales/common.json');
      this.translations.common = await commonResponse.json();
      
      // Загружаем специфичные для страницы переводы
      if (page) {
        try {
          const pageResponse = await fetch(`/locales/${page}.json`);
          this.translations.page = await pageResponse.json();
        } catch (e) {
          console.warn(`Page-specific translations not found for ${page}`);
          this.translations.page = {};
        }
      }
      
      this.applyTranslationsToDOM();
      return true;
    } catch (error) {
      console.error('Error loading translations:', error);
      this.translations = { common: {}, page: {} };
      return false;
    }
  }

  t(key, options = {}) {
    const keys = key.split('.');
    let value = this._nestedGet(this.translations.page?.[this.currentLang], keys) ||
                this._nestedGet(this.translations.common?.[this.currentLang], keys);
    
    if (!value) {
      value = this._nestedGet(this.translations.page?.en, keys) ||
              this._nestedGet(this.translations.common?.en, keys) ||
              key;
    }
    
    return this._replaceVariables(value, options);
  }

  _nestedGet(obj, keys) {
    return keys.reduce((acc, key) => acc?.[key], obj);
  }

  _replaceVariables(text, variables) {
    return Object.entries(variables).reduce(
      (acc, [key, val]) => acc.replace(`{{${key}}}`, val), 
      text
    );
  }

  switchLanguage(lang) {
    if (this.currentLang !== lang) {
      this.currentLang = lang;
      localStorage.setItem('preferredLanguage', lang);
      this.applyTranslationsToDOM();
      this.notifyLanguageChange();
    }
  }

  onLanguageChange(callback) {
    this.langChangeCallbacks.push(callback);
  }

  notifyLanguageChange() {
    this.langChangeCallbacks.forEach(cb => cb(this.currentLang));
  }

  applyTranslationsToDOM() {
    // Находим все элементы с data-i18n атрибутом
    document.querySelectorAll('[data-i18n]').forEach(element => {
      const key = element.getAttribute('data-i18n');
      const translation = this.t(key);
      
      // Для разных типов элементов применяем перевод по-разному
      if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
        element.placeholder = translation;
      } else if (element.tagName === 'IMG' && element.hasAttribute('alt')) {
        element.alt = translation;
      } else {
        element.textContent = translation;
      }
    });
  }
}

// Создаем экземпляр i18n
const i18n = new I18n();

// Определяем имя страницы на основе URL
function getPageName() {
  const path = window.location.pathname;
  if (path.includes('contact')) return 'contact';
  if (path.includes('about')) return 'about';
  if (path.includes('refund')) return 'refund';
  if (path.includes('shipping')) return 'shipping';
  if (path.includes('privacy')) return 'privacy';
  if (path.includes('terms')) return 'terms';
  if (path.includes('home')) return 'home';
  return null;
}

async function initPage() {
  try {
    document.documentElement.classList.add('i18n-loading');
    
    const pageName = getPageName();
    await i18n.loadTranslations(pageName);
    
    // Настраиваем переключение языка
    const langButton = document.querySelector('.header_change--lang');
    if (langButton) {
      // Удаляем старый обработчик, если есть
      const newButton = langButton.cloneNode(true);
      langButton.parentNode.replaceChild(newButton, langButton);
      
      newButton.addEventListener('click', (e) => {
        e.preventDefault();
        const newLang = i18n.currentLang === 'en' ? 'ru' : 'en';
        i18n.switchLanguage(newLang);
      });
    }
    
    document.documentElement.classList.remove('i18n-loading');
    document.documentElement.classList.add('i18n-loaded');
  } catch (error) {
    console.error('Page initialization error:', error);
    document.documentElement.classList.remove('i18n-loading');
  }
}

function domReady() {
  return new Promise(resolve => {
    if (document.readyState !== 'loading') {
      resolve();
    } else {
      document.addEventListener('DOMContentLoaded', resolve);
    }
  });
}

// Инициализация при загрузке страницы
(async function() {
  await domReady();
  await initPage();
})();

// Экспортируем экземпляр i18n для использования в других модулях
export default i18n;