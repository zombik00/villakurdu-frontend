import api from '@/services/api';
import type { Notification, PaginatedResponse } from '@/types';

/* ------------------------------------------------------------------ */
/*  List notifications                                                 */
/* ------------------------------------------------------------------ */

export interface NotificationListParams {
  page?: number;
  page_size?: number;
  is_read?: boolean;
}

export async function getNotifications(
  params?: NotificationListParams
): Promise<PaginatedResponse<Notification>> {
  const query: Record<string, string | number | boolean> = {};
  if (params?.page) query.page = params.page;
  if (params?.page_size) query.page_size = params.page_size;
  if (params?.is_read !== undefined) query.is_read = params.is_read;

  const { data } = await api.get<PaginatedResponse<Notification>>(
    '/notifications/',
    { params: query }
  );
  return data;
}

/* ------------------------------------------------------------------ */
/*  Mark single notification as read                                   */
/* ------------------------------------------------------------------ */

export async function markAsRead(id: string): Promise<void> {
  await api.post(`/notifications/${id}/read/`);
}

/* ------------------------------------------------------------------ */
/*  Mark all notifications as read                                     */
/* ------------------------------------------------------------------ */

export async function markAllAsRead(): Promise<void> {
  await api.post('/notifications/read-all/');
}

/* ------------------------------------------------------------------ */
/*  Get unread count                                                   */
/* ------------------------------------------------------------------ */

export async function getUnreadCount(): Promise<number> {
  const { data } = await api.get<{ unread_count: number }>(
    '/notifications/unread-count/'
  );
  return data.unread_count;
}
