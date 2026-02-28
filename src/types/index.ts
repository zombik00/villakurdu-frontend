/* ------------------------------------------------------------------ */
/*  Auth                                                               */
/* ------------------------------------------------------------------ */

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: 'guest' | 'host' | 'admin';
  avatar?: string;
  phone?: string;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  password_confirm: string;
  first_name: string;
  last_name: string;
  role: 'guest' | 'host';
}

/* ------------------------------------------------------------------ */
/*  Property                                                           */
/* ------------------------------------------------------------------ */

export interface PropertyImage {
  id: string;
  image: string;
  caption?: Record<string, string>;
  is_cover: boolean;
  order: number;
}

export interface Amenity {
  id: string;
  name: Record<string, string>;
  icon: string;
  category: string;
}

export interface City {
  id: string;
  name: Record<string, string>;
  slug: string;
  image?: string;
  property_count: number;
}

export interface District {
  id: string;
  name: Record<string, string>;
  slug: string;
  city: City;
}

export interface Property {
  id: string;
  slug: string;
  title: Record<string, string>;
  description: Record<string, string>;
  property_type: 'villa' | 'apartment' | 'house' | 'boutique_hotel' | 'bungalow' | 'chalet' | 'penthouse';
  city: City;
  district?: District;
  address?: string;
  latitude?: number;
  longitude?: number;
  bedrooms: number;
  bathrooms: number;
  max_guests: number;
  area_sqm?: number;
  price_per_night: number;
  currency: string;
  cleaning_fee?: number;
  images: PropertyImage[];
  amenities: Amenity[];
  host: User;
  average_rating?: number;
  review_count: number;
  cancellation_policy: 'flexible' | 'moderate' | 'strict';
  house_rules?: Record<string, string>;
  check_in_time?: string;
  check_out_time?: string;
  is_active: boolean;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

/* ------------------------------------------------------------------ */
/*  Booking                                                            */
/* ------------------------------------------------------------------ */

export type BookingStatus =
  | 'pending'
  | 'approved'
  | 'confirmed'
  | 'checked_in'
  | 'completed'
  | 'cancelled_guest'
  | 'cancelled_host'
  | 'rejected'
  | 'expired';

export interface BookingStatusLog {
  status: BookingStatus;
  changed_at: string;
  changed_by?: User;
  note?: string;
}

export interface Booking {
  id: string;
  property: Property;
  guest: User;
  check_in: string;
  check_out: string;
  adults: number;
  children: number;
  infants: number;
  num_nights: number;
  nightly_rate: number;
  cleaning_fee: number;
  extra_guest_fee: number;
  service_fee: number;
  total_price: number;
  currency: string;
  status: BookingStatus;
  guest_message?: string;
  host_response_message?: string;
  cancellation_reason?: string;
  status_logs: BookingStatusLog[];
  created_at: string;
  updated_at: string;
}

export interface CreateBookingRequest {
  property_id: string;
  check_in: string;
  check_out: string;
  adults: number;
  children: number;
  infants: number;
  guest_message?: string;
}

export interface PriceCalculation {
  property_id: string;
  check_in: string;
  check_out: string;
  num_nights: number;
  nightly_rate: number;
  cleaning_fee: number;
  extra_guest_fee: number;
  service_fee: number;
  total_price: number;
  currency: string;
}

export interface BookingListParams {
  role?: 'guest' | 'host';
  status?: BookingStatus | 'all';
  page?: number;
  page_size?: number;
}

/* ------------------------------------------------------------------ */
/*  Review                                                             */
/* ------------------------------------------------------------------ */

export interface Review {
  id: string;
  property: string;
  author: User;
  rating: number;
  comment: string;
  created_at: string;
}

/* ------------------------------------------------------------------ */
/*  Messaging                                                          */
/* ------------------------------------------------------------------ */

export interface Message {
  id: string;
  conversation: string;
  sender: User;
  content: string;
  is_read: boolean;
  created_at: string;
}

export interface LastMessagePreview {
  id: string;
  sender: string;
  sender_name: string;
  content: string;
  is_system_message: boolean;
  created_at: string;
}

export interface Conversation {
  id: string;
  guest: string;
  guest_name: string;
  guest_profile_image?: string;
  host: string;
  host_name: string;
  host_profile_image?: string;
  property?: string;
  property_title?: string;
  booking?: string;
  last_message_preview?: LastMessagePreview | null;
  guest_unread_count: number;
  host_unread_count: number;
  last_message_at?: string;
  is_archived_by_guest: boolean;
  is_archived_by_host: boolean;
  created_at: string;
}

export interface ConversationDetailProperty {
  slug: string;
  title: Record<string, string>;
  city: { name: Record<string, string> };
  images?: PropertyImage[];
}

export interface ConversationDetail {
  id: string;
  guest: string;
  guest_name: string;
  guest_email: string;
  guest_profile_image?: string;
  host: string;
  host_name: string;
  host_email: string;
  host_profile_image?: string;
  property?: ConversationDetailProperty;
  property_title?: string;
  booking?: string;
  guest_unread_count: number;
  host_unread_count: number;
  last_message_at?: string;
  messages: Message[];
  created_at: string;
  updated_at: string;
}

/* ------------------------------------------------------------------ */
/*  Notifications                                                      */
/* ------------------------------------------------------------------ */

export type NotificationType =
  | 'booking_request'
  | 'booking_approved'
  | 'booking_rejected'
  | 'booking_cancelled'
  | 'booking_completed'
  | 'new_message'
  | 'new_review'
  | 'payment_received'
  | 'system';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  is_read: boolean;
  link?: string;
  created_at: string;
}

/* ------------------------------------------------------------------ */
/*  Host Property                                                      */
/* ------------------------------------------------------------------ */

export type PropertyStatus = 'published' | 'draft' | 'unlisted' | 'suspended' | 'pending_review';

export interface HostProperty {
  id: string;
  slug: string;
  title: Record<string, string>;
  property_type: Property['property_type'];
  city: City;
  district?: District;
  status: PropertyStatus;
  price_per_night: number;
  currency: string;
  images: PropertyImage[];
  bedrooms: number;
  bathrooms: number;
  max_guests: number;
  average_rating?: number;
  review_count: number;
  booking_count: number;
  view_count: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

/* ------------------------------------------------------------------ */
/*  API                                                                */
/* ------------------------------------------------------------------ */

export interface PaginatedResponse<T> {
  count: number;
  total_pages: number;
  current_page: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface ApiError {
  detail?: string;
  message?: string;
  errors?: Record<string, string[]>;
  status_code?: number;
}

/* ------------------------------------------------------------------ */
/*  Search                                                             */
/* ------------------------------------------------------------------ */

export interface SearchFilters {
  location?: string;
  checkIn?: string;
  checkOut?: string;
  guests: {
    adults: number;
    children: number;
    infants: number;
  };
  priceRange: {
    min?: number;
    max?: number;
  };
  propertyType?: string[];
  bedrooms?: number;
  bathrooms?: number;
  amenities?: string[];
  sortBy?: 'newest' | 'price_low' | 'price_high' | 'top_rated';
}
