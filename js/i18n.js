/*
  Copyright (c) 2026 Цед Анна Викторовна
  Данный исходный код распространяется под лицензией MIT.
  Полный текст лицензии находится в файле LICENSE в корне проекта.
*/

class I18n {
  constructor(supportedLanguages = ['en', 'ru']) {
  this.translations = {};
  this.supportedLanguages = supportedLanguages;
  this.defaultLang = 'en';
    
  this.currentLang = this.determineInitialLanguage();
    
  this.langChangeCallbacks = [];
  }

  determineInitialLanguage() {
    // 1. Пробуем получить сохраненный язык
    const storedLang = localStorage.getItem('preferredLanguage');
    if (storedLang && this.supportedLanguages.includes(storedLang)) {
      return storedLang;
    }
    
    // 2. Пробуем определить язык браузера
    const browserLang = navigator.language.split('-')[0];
    if (this.supportedLanguages.includes(browserLang)) {
      return browserLang;
    }
    
    // 3. Возвращаем язык по умолчанию
    return this.defaultLang;
  }

  async loadTranslations(page) {
    try {
      // Загружаем обязательные общие переводы
      const commonResponse = await fetch('/locales/common.json?format=json');
      if (!commonResponse.ok) throw new Error('Common translations failed to load');
      this.translations.common = await commonResponse.json();
      
      // Загружаем переводы для страницы (если указана)
      if (page) {
        try {
          const pageResponse = await fetch(`/locales/${page}.json?format=json`);
          if (pageResponse.ok) {
            this.translations.page = await pageResponse.json();
          }
        } catch (e) {
          console.warn(`Page translations for ${page} not found`);
          this.translations.page = {};
        }
      }
      
      this.applyTranslationsToDOM();
      return true;
    } catch (error) {
      console.error('Translation loading failed:', error);
      this.translations = { common: {}, page: {} };
      return false;
    }
  }

  t(key, options = {}) {
    const keys = key.split('.');
    
    // Поиск перевода в текущей локали
    let value = this._nestedGet(this.translations.page?.[this.currentLang], keys) ||
                this._nestedGet(this.translations.common?.[this.currentLang], keys);
    
    // Fallback на английский, если перевод не найден
    if (!value) {
      value = this._nestedGet(this.translations.page?.en, keys) ||
              this._nestedGet(this.translations.common?.en, keys) ||
              key; // Последний fallback - возвращаем ключ
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
    if (!this.supportedLanguages.includes(lang)) {
      console.warn(`Language ${lang} is not supported`);
      return false;
    }
    
    if (this.currentLang !== lang) {
      this.currentLang = lang;
      localStorage.setItem('preferredLanguage', lang);
      this.applyTranslationsToDOM();
      this.notifyLanguageChange();
    }
    return true;
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

(async function() {
  await domReady();
  await initPage();
})();

export default i18n;