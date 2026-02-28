import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number, currency: string = 'TRY', locale: string = 'tr-TR') {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: string | Date, locale: string = 'tr-TR') {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
}

export function getLocalizedField(
  field: Record<string, string> | undefined,
  locale: string,
  fallback: string = 'tr'
): string {
  if (!field) return '';
  return field[locale] || field[fallback] || field['en'] || Object.values(field)[0] || '';
}
