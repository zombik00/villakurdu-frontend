export const locales = ['tr', 'en', 'de', 'es', 'it', 'fr', 'ru', 'uk'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'tr';

export const localeNames: Record<Locale, string> = {
  tr: 'Turkce',
  en: 'English',
  de: 'Deutsch',
  es: 'Espanol',
  it: 'Italiano',
  fr: 'Francais',
  ru: 'Russkiy',
  uk: 'Ukrainska',
};

export const localeFlags: Record<Locale, string> = {
  tr: 'TR',
  en: 'GB',
  de: 'DE',
  es: 'ES',
  it: 'IT',
  fr: 'FR',
  ru: 'RU',
  uk: 'UA',
};
