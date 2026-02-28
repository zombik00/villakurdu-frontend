import { create } from 'zustand';
import * as notificationsApi from '@/services/notifications';
import type { Notification, PaginatedResponse } from '@/types';

/* ------------------------------------------------------------------ */
/*  State & Actions                                                    */
/* ------------------------------------------------------------------ */

interface NotificationState {
  notifications: Notification[];
  totalPages: number;
  currentPage: number;
  totalCount: number;
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
}

interface NotificationActions {
  fetchNotifications: (params?: notificationsApi.NotificationListParams) => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  fetchUnreadCount: () => Promise<void>;
  clearError: () => void;
}

type NotificationStore = NotificationState & NotificationActions;

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

export const useNotificationStore = create<NotificationStore>()((set) => ({
  /* ---------- initial state ---------- */
  notifications: [],
  totalPages: 1,
  currentPage: 1,
  totalCount: 0,
  unreadCount: 0,
  isLoading: false,
  error: null,

  /* ---------- list ---------- */
  fetchNotifications: async (params?: notificationsApi.NotificationListParams) => {
    set({ isLoading: true, error: null });
    try {
      const data: PaginatedResponse<Notification> =
        await notificationsApi.getNotifications(params);
      set({
        notifications: data.results,
        totalPages: data.total_pages,
        currentPage: data.current_page,
        totalCount: data.count,
        isLoading: false,
      });
    } catch (err) {
      set({ isLoading: false, error: extractError(err) });
    }
  },

  /* ---------- mark single as read ---------- */
  markAsRead: async (id: string) => {
    try {
      await notificationsApi.markAsRead(id);
      set((state) => {
        const notification = state.notifications.find((n) => n.id === id);
        const wasUnread = notification && !notification.is_read;
        return {
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, is_read: true } : n
          ),
          unreadCount: wasUnread ? Math.max(0, state.unreadCount - 1) : state.unreadCount,
        };
      });
    } catch (err) {
      set({ error: extractError(err) });
    }
  },

  /* ---------- mark all as read ---------- */
  markAllAsRead: async () => {
    try {
      await notificationsApi.markAllAsRead();
      set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, is_read: true })),
        unreadCount: 0,
      }));
    } catch (err) {
      set({ error: extractError(err) });
    }
  },

  /* ---------- unread count ---------- */
  fetchUnreadCount: async () => {
    try {
      const count = await notificationsApi.getUnreadCount();
      set({ unreadCount: count });
    } catch {
      // Silently ignore
    }
  },

  /* ---------- helpers ---------- */
  clearError: () => set({ error: null }),
}));
