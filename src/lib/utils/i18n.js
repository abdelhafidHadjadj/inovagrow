import en from '$lib/i18n/en.json';
import fr from '$lib/i18n/fr.json';

const translations = { en, fr };

/**
 * @param {string} lang - Langue active ('en' ou 'fr')
 * @param {string} key - Clé d’accès à la chaîne, ex: 'dashboard.welcome'
 * @param {object} [params] - Paramètres dynamiques à interpoler
 * @returns {string}
 */
export function t(lang, key, params = {}) {
  const parts = key.split('.');
  let value = translations[lang];

  for (const part of parts) {
    if (value?.[part]) {
      value = value[part];
    } else {
      return key; // clé introuvable
    }
  }

  // interpolation dynamique
  if (typeof value === 'string') {
    return value.replace(/{{(.*?)}}/g, (_, p) => params[p.trim()] || '');
  }

  return key;
}


/**
 * Safe translation array accessor.
 * @param {string} lang - The active language.
 * @param {string} key - The translation key.
 * @returns {string[]} - Always returns an array (empty if invalid).
 */
export function tArray(lang, key) {
  const value = t(lang, key);
  return Array.isArray(value) ? value : [];
}