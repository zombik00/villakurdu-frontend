import { create } from 'zustand';
import * as messagesApi from '@/services/messages';
import type {
  Conversation,
  ConversationDetail,
  Message,
  PaginatedResponse,
} from '@/types';

/* ------------------------------------------------------------------ */
/*  State & Actions                                                    */
/* ------------------------------------------------------------------ */

interface MessageState {
  /* List state */
  conversations: Conversation[];
  totalPages: number;
  currentPage: number;
  totalCount: number;

  /* Active conversation with messages */
  activeConversation: ConversationDetail | null;

  /* Unread badge */
  unreadCount: number;

  /* Loading / error */
  isLoading: boolean;
  isSending: boolean;
  error: string | null;
}

interface MessageActions {
  fetchConversations: (params?: messagesApi.ConversationListParams) => Promise<void>;
  fetchConversation: (id: string) => Promise<void>;
  sendMessage: (conversationId: string, content: string) => Promise<void>;
  markAsRead: (conversationId: string) => Promise<void>;
  fetchUnreadCount: () => Promise<void>;
  clearError: () => void;
  clearActiveConversation: () => void;
}

type MessageStore = MessageState & MessageActions;

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

export const useMessageStore = create<MessageStore>()((set) => ({
  /* ---------- initial state ---------- */
  conversations: [],
  totalPages: 1,
  currentPage: 1,
  totalCount: 0,
  activeConversation: null,
  unreadCount: 0,
  isLoading: false,
  isSending: false,
  error: null,

  /* ---------- list conversations ---------- */
  fetchConversations: async (params?: messagesApi.ConversationListParams) => {
    set({ isLoading: true, error: null });
    try {
      const data: PaginatedResponse<Conversation> =
        await messagesApi.getConversations(params);
      set({
        conversations: data.results,
        totalPages: data.total_pages,
        currentPage: data.current_page,
        totalCount: data.count,
        isLoading: false,
      });
    } catch (err) {
      set({ isLoading: false, error: extractError(err) });
    }
  },

  /* ---------- get single conversation ---------- */
  fetchConversation: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const conversation = await messagesApi.getConversation(id);
      set({ activeConversation: conversation, isLoading: false });
    } catch (err) {
      set({ isLoading: false, error: extractError(err) });
    }
  },

  /* ---------- send message ---------- */
  sendMessage: async (conversationId: string, content: string) => {
    set({ isSending: true, error: null });
    try {
      const sent = await messagesApi.sendMessage(conversationId, content);
      set((state) => {
        /* Append to active conversation messages if it matches */
        const newMessage: Message = {
          id: sent.id,
          conversation: sent.conversation,
          sender: sent.sender as Message['sender'],
          content: sent.content,
          is_read: sent.is_read,
          created_at: sent.created_at,
        };

        const activeConversation = state.activeConversation;
        if (activeConversation && activeConversation.id === conversationId) {
          return {
            activeConversation: {
              ...activeConversation,
              messages: [...activeConversation.messages, newMessage],
            },
            isSending: false,
          };
        }
        return { isSending: false };
      });
    } catch (err) {
      set({ isSending: false, error: extractError(err) });
      throw err;
    }
  },

  /* ---------- mark as read ---------- */
  markAsRead: async (conversationId: string) => {
    try {
      await messagesApi.markAsRead(conversationId);
      set((state) => {
        const conversation = state.conversations.find((c) => c.id === conversationId);
        const prevGuestUnread = conversation?.guest_unread_count ?? 0;
        const prevHostUnread = conversation?.host_unread_count ?? 0;
        const prevUnread = prevGuestUnread + prevHostUnread;
        return {
          conversations: state.conversations.map((c) =>
            c.id === conversationId
              ? { ...c, guest_unread_count: 0, host_unread_count: 0 }
              : c
          ),
          unreadCount: Math.max(0, state.unreadCount - prevUnread),
        };
      });
    } catch {
      // Silently ignore read marking failures
    }
  },

  /* ---------- unread count ---------- */
  fetchUnreadCount: async () => {
    try {
      const count = await messagesApi.getUnreadCount();
      set({ unreadCount: count });
    } catch {
      // Silently ignore
    }
  },

  /* ---------- helpers ---------- */
  clearError: () => set({ error: null }),
  clearActiveConversation: () => set({ activeConversation: null }),
}));
