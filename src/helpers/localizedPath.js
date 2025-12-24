import i18next from 'i18next';

/**
 * Generates a URL path prefixed with the current language.
 * @param path - The relative path (should start with `/`).
 * @returns The localized path, e.g., `/en/products`.
 */
export const localizedPath = (path) => {
  const lang = i18next.language || 'ar';
  return `/${lang}${path.startsWith('/') ? path : `/${path}`}`;
};
