import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import ar from './locales/ar.json';
import bn from './locales/bn.json';
import en from './locales/en.json';
import es from './locales/es.json';
import fj from './locales/fj.json';
import fr from './locales/fr.json';
import to from './locales/to.json';

const STORAGE_KEY = 'msupply-language';

const savedLang = localStorage.getItem(STORAGE_KEY) || 'en';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    ar: { translation: ar },
    bn: { translation: bn },
    fr: { translation: fr },
    es: { translation: es },
    fj: { translation: fj },
    to: { translation: to },
  },
  lng: savedLang,
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

// Persist language changes
i18n.on('languageChanged', (lng) => {
  localStorage.setItem(STORAGE_KEY, lng);
});

export default i18n;
