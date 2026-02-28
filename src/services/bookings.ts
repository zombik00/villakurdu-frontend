import api from '@/services/api';
import type {
  Booking,
  CreateBookingRequest,
  PriceCalculation,
  BookingListParams,
  PaginatedResponse,
} from '@/types';

/* ------------------------------------------------------------------ */
/*  Create booking                                                     */
/* ------------------------------------------------------------------ */

export async function createBooking(data: CreateBookingRequest): Promise<Booking> {
  const { data: booking } = await api.post<Booking>('/bookings/', data);
  return booking;
}

/* ------------------------------------------------------------------ */
/*  List bookings (paginated, with filters)                            */
/* ------------------------------------------------------------------ */

export async function getBookings(
  params?: BookingListParams
): Promise<PaginatedResponse<Booking>> {
  const query: Record<string, string | number> = {};

  if (params?.role) query.role = params.role;
  if (params?.status && params.status !== 'all') query.status = params.status;
  if (params?.page) query.page = params.page;
  if (params?.page_size) query.page_size = params.page_size;

  const { data } = await api.get<PaginatedResponse<Booking>>('/bookings/list/', {
    params: query,
  });
  return data;
}

/* ------------------------------------------------------------------ */
/*  Get single booking                                                 */
/* ------------------------------------------------------------------ */

export async function getBooking(id: string): Promise<Booking> {
  const { data } = await api.get<Booking>(`/bookings/${id}/`);
  return data;
}

/* ------------------------------------------------------------------ */
/*  Host actions                                                       */
/* ------------------------------------------------------------------ */

export async function approveBooking(id: string): Promise<Booking> {
  const { data } = await api.post<Booking>(`/bookings/${id}/approve/`);
  return data;
}

export async function rejectBooking(id: string, reason?: string): Promise<Booking> {
  const { data } = await api.post<Booking>(`/bookings/${id}/reject/`, {
    reason,
  });
  return data;
}

export async function checkInBooking(id: string): Promise<Booking> {
  const { data } = await api.post<Booking>(`/bookings/${id}/check-in/`);
  return data;
}

export async function completeBooking(id: string): Promise<Booking> {
  const { data } = await api.post<Booking>(`/bookings/${id}/complete/`);
  return data;
}

/* ------------------------------------------------------------------ */
/*  Guest / general actions                                            */
/* ------------------------------------------------------------------ */

export async function cancelBooking(id: string, reason?: string): Promise<Booking> {
  const { data } = await api.post<Booking>(`/bookings/${id}/cancel/`, {
    reason,
  });
  return data;
}

/* ------------------------------------------------------------------ */
/*  Price calculation (no auth required)                               */
/* ------------------------------------------------------------------ */

export interface PriceCalculationParams {
  property_id: string;
  check_in: string;
  check_out: string;
  adults: number;
  children?: number;
}

export async function calculatePrice(
  params: PriceCalculationParams
): Promise<PriceCalculation> {
  const { data } = await api.get<PriceCalculation>('/bookings/price-calculation/', {
    params,
  });
  return data;
}
