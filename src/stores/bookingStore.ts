import { create } from 'zustand';
import * as bookingsApi from '@/services/bookings';
import type {
  Booking,
  CreateBookingRequest,
  BookingListParams,
  PaginatedResponse,
} from '@/types';

/* ------------------------------------------------------------------ */
/*  State & Actions                                                    */
/* ------------------------------------------------------------------ */

interface BookingState {
  /* List state */
  bookings: Booking[];
  totalPages: number;
  currentPage: number;
  totalCount: number;

  /* Single booking state */
  activeBooking: Booking | null;

  /* Loading / error */
  isLoading: boolean;
  isActionLoading: boolean;
  error: string | null;
}

interface BookingActions {
  /* List */
  fetchBookings: (params?: BookingListParams) => Promise<void>;

  /* Detail */
  fetchBooking: (id: string) => Promise<void>;

  /* Guest creates */
  createBooking: (data: CreateBookingRequest) => Promise<Booking>;

  /* Host actions */
  approveBooking: (id: string) => Promise<void>;
  rejectBooking: (id: string, reason?: string) => Promise<void>;
  checkInBooking: (id: string) => Promise<void>;
  completeBooking: (id: string) => Promise<void>;

  /* General */
  cancelBooking: (id: string, reason?: string) => Promise<void>;

  /* Helpers */
  clearError: () => void;
  clearActiveBooking: () => void;
}

type BookingStore = BookingState & BookingActions;

/* ------------------------------------------------------------------ */
/*  Helper: extract error message                                      */
/* ------------------------------------------------------------------ */

function extractError(err: unknown): string {
  const axiosErr = err as {
    response?: { data?: { detail?: string; message?: string } };
  };
  return (
    axiosErr?.response?.data?.detail ||
    axiosErr?.response?.data?.message ||
    'An error occurred'
  );
}

/* ------------------------------------------------------------------ */
/*  Store                                                              */
/* ------------------------------------------------------------------ */

export const useBookingStore = create<BookingStore>()((set) => ({
  /* ---------- initial state ---------- */
  bookings: [],
  totalPages: 1,
  currentPage: 1,
  totalCount: 0,
  activeBooking: null,
  isLoading: false,
  isActionLoading: false,
  error: null,

  /* ---------- list ---------- */
  fetchBookings: async (params?: BookingListParams) => {
    set({ isLoading: true, error: null });
    try {
      const data: PaginatedResponse<Booking> = await bookingsApi.getBookings(params);
      set({
        bookings: data.results,
        totalPages: data.total_pages,
        currentPage: data.current_page,
        totalCount: data.count,
        isLoading: false,
      });
    } catch (err) {
      set({ isLoading: false, error: extractError(err) });
    }
  },

  /* ---------- detail ---------- */
  fetchBooking: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const booking = await bookingsApi.getBooking(id);
      set({ activeBooking: booking, isLoading: false });
    } catch (err) {
      set({ isLoading: false, error: extractError(err) });
    }
  },

  /* ---------- create ---------- */
  createBooking: async (data: CreateBookingRequest) => {
    set({ isActionLoading: true, error: null });
    try {
      const booking = await bookingsApi.createBooking(data);
      set({ isActionLoading: false });
      return booking;
    } catch (err) {
      set({ isActionLoading: false, error: extractError(err) });
      throw err;
    }
  },

  /* ---------- host: approve ---------- */
  approveBooking: async (id: string) => {
    set({ isActionLoading: true, error: null });
    try {
      const updated = await bookingsApi.approveBooking(id);
      set((state) => ({
        activeBooking:
          state.activeBooking?.id === id ? updated : state.activeBooking,
        bookings: state.bookings.map((b) => (b.id === id ? updated : b)),
        isActionLoading: false,
      }));
    } catch (err) {
      set({ isActionLoading: false, error: extractError(err) });
      throw err;
    }
  },

  /* ---------- host: reject ---------- */
  rejectBooking: async (id: string, reason?: string) => {
    set({ isActionLoading: true, error: null });
    try {
      const updated = await bookingsApi.rejectBooking(id, reason);
      set((state) => ({
        activeBooking:
          state.activeBooking?.id === id ? updated : state.activeBooking,
        bookings: state.bookings.map((b) => (b.id === id ? updated : b)),
        isActionLoading: false,
      }));
    } catch (err) {
      set({ isActionLoading: false, error: extractError(err) });
      throw err;
    }
  },

  /* ---------- host: check-in ---------- */
  checkInBooking: async (id: string) => {
    set({ isActionLoading: true, error: null });
    try {
      const updated = await bookingsApi.checkInBooking(id);
      set((state) => ({
        activeBooking:
          state.activeBooking?.id === id ? updated : state.activeBooking,
        bookings: state.bookings.map((b) => (b.id === id ? updated : b)),
        isActionLoading: false,
      }));
    } catch (err) {
      set({ isActionLoading: false, error: extractError(err) });
      throw err;
    }
  },

  /* ---------- host: complete ---------- */
  completeBooking: async (id: string) => {
    set({ isActionLoading: true, error: null });
    try {
      const updated = await bookingsApi.completeBooking(id);
      set((state) => ({
        activeBooking:
          state.activeBooking?.id === id ? updated : state.activeBooking,
        bookings: state.bookings.map((b) => (b.id === id ? updated : b)),
        isActionLoading: false,
      }));
    } catch (err) {
      set({ isActionLoading: false, error: extractError(err) });
      throw err;
    }
  },

  /* ---------- cancel (guest or host) ---------- */
  cancelBooking: async (id: string, reason?: string) => {
    set({ isActionLoading: true, error: null });
    try {
      const updated = await bookingsApi.cancelBooking(id, reason);
      set((state) => ({
        activeBooking:
          state.activeBooking?.id === id ? updated : state.activeBooking,
        bookings: state.bookings.map((b) => (b.id === id ? updated : b)),
        isActionLoading: false,
      }));
    } catch (err) {
      set({ isActionLoading: false, error: extractError(err) });
      throw err;
    }
  },

  /* ---------- helpers ---------- */
  clearError: () => set({ error: null }),
  clearActiveBooking: () => set({ activeBooking: null }),
}));
