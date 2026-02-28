export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api/v1';
export const TOKEN_STORAGE_KEY = 'villakurdu_tokens';

export const ROUTES = {
  HOME: '/',
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  FORGOT_PASSWORD: '/auth/forgot-password',
  SEARCH: '/search',
  PROPERTY_DETAIL: (slug: string) => `/properties/${slug}`,
  DASHBOARD: '/dashboard',
  BOOKINGS: '/bookings',
  BOOKING_DETAIL: (id: string) => `/bookings/${id}`,
  MESSAGES: '/messages',
  CONVERSATION: (id: string) => `/messages/${id}`,
  FAVORITES: '/favorites',
  PROFILE: '/profile',
  SETTINGS: '/profile/settings',
  NOTIFICATIONS: '/notifications',
  HOST_DASHBOARD: '/host/dashboard',
  HOST_PROPERTIES: '/host/properties',
  HOST_NEW_PROPERTY: '/host/properties/new',
  HOST_EDIT_PROPERTY: (id: string) => `/host/properties/${id}/edit`,
  HOST_BOOKINGS: '/host/bookings',
  HOST_REVIEWS: '/host/reviews',
  HOST_PAYOUTS: '/host/payouts',
} as const;

export const PROPERTY_TYPES = ['villa', 'apartment', 'house', 'boutique_hotel', 'bungalow', 'chalet', 'penthouse'] as const;
export type PropertyType = (typeof PROPERTY_TYPES)[number];

export const CANCELLATION_POLICIES = ['flexible', 'moderate', 'strict'] as const;
export type CancellationPolicy = (typeof CANCELLATION_POLICIES)[number];
