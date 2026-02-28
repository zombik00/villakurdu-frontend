import api from '@/services/api';
import type {
  Conversation,
  ConversationDetail,
  PaginatedResponse,
} from '@/types';

/* ------------------------------------------------------------------ */
/*  List conversations                                                 */
/* ------------------------------------------------------------------ */

export interface ConversationListParams {
  page?: number;
  page_size?: number;
}

export async function getConversations(
  params?: ConversationListParams
): Promise<PaginatedResponse<Conversation>> {
  const query: Record<string, string | number> = {};
  if (params?.page) query.page = params.page;
  if (params?.page_size) query.page_size = params.page_size;

  const { data } = await api.get<PaginatedResponse<Conversation>>(
    '/messages/conversations/',
    { params: query }
  );
  return data;
}

/* ------------------------------------------------------------------ */
/*  Get single conversation with messages                              */
/* ------------------------------------------------------------------ */

export async function getConversation(id: string): Promise<ConversationDetail> {
  const { data } = await api.get<ConversationDetail>(
    `/messages/conversations/${id}/`
  );
  return data;
}

/* ------------------------------------------------------------------ */
/*  Create a new conversation                                          */
/* ------------------------------------------------------------------ */

export async function createConversation(
  propertyId: string,
  message: string
): Promise<Conversation> {
  const { data } = await api.post<Conversation>('/messages/conversations/create/', {
    property_id: propertyId,
    message,
  });
  return data;
}

/* ------------------------------------------------------------------ */
/*  Send message in a conversation                                     */
/* ------------------------------------------------------------------ */

export interface SendMessageResponse {
  id: string;
  conversation: string;
  sender: { id: string; first_name: string; last_name: string };
  content: string;
  is_read: boolean;
  created_at: string;
}

export async function sendMessage(
  conversationId: string,
  content: string
): Promise<SendMessageResponse> {
  const { data } = await api.post<SendMessageResponse>(
    `/messages/conversations/${conversationId}/send/`,
    { content }
  );
  return data;
}

/* ------------------------------------------------------------------ */
/*  Mark conversation as read                                          */
/* ------------------------------------------------------------------ */

export async function markAsRead(conversationId: string): Promise<void> {
  await api.post(`/messages/conversations/${conversationId}/read/`);
}

/* ------------------------------------------------------------------ */
/*  Get unread count                                                   */
/* ------------------------------------------------------------------ */

export async function getUnreadCount(): Promise<number> {
  const { data } = await api.get<{ unread_count: number }>(
    '/messages/unread-count/'
  );
  return data.unread_count;
}
