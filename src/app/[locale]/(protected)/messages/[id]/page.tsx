'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { ArrowLeft, Send, Home, Check, CheckCheck } from 'lucide-react';
import { cn, getLocalizedField } from '@/lib/utils';
import { ROUTES } from '@/lib/constants';
import { useMessageStore } from '@/stores/messageStore';
import { useAuthStore } from '@/stores/authStore';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function formatMessageTime(dateStr: string, locale: string): string {
  return new Intl.DateTimeFormat(`${locale}-TR`, {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateStr));
}

function formatMessageDate(dateStr: string, locale: string): string {
  const date = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return locale === 'tr' ? 'Bugun' : 'Today';
  }
  if (date.toDateString() === yesterday.toDateString()) {
    return locale === 'tr' ? 'Dun' : 'Yesterday';
  }

  return new Intl.DateTimeFormat(`${locale}-TR`, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function MessageDetailPage() {
  const t = useTranslations('messages');
  const locale = useLocale();
  const params = useParams();
  const conversationId = params.id as string;

  const { user } = useAuthStore();
  const {
    activeConversation,
    isLoading,
    isSending,
    fetchConversation,
    sendMessage,
    markAsRead,
    clearActiveConversation,
  } = useMessageStore();

  const [messageInput, setMessageInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  /* Load conversation */
  useEffect(() => {
    if (conversationId) {
      fetchConversation(conversationId);
      markAsRead(conversationId);
    }
    return () => {
      clearActiveConversation();
    };
  }, [conversationId, fetchConversation, markAsRead, clearActiveConversation]);

  /* Scroll to bottom on new messages */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConversation?.messages]);

  /* Handle send */
  const handleSend = async () => {
    const content = messageInput.trim();
    if (!content || isSending) return;

    try {
      setMessageInput('');
      await sendMessage(conversationId, content);
      inputRef.current?.focus();
    } catch {
      setMessageInput(content);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (isLoading || !activeConversation) {
    return (
      <div className="container-app py-8 md:py-12">
        <div className="flex items-center justify-center py-20">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  // Determine the "other" participant from guest/host fields
  const isCurrentUserGuest = activeConversation.guest === user?.id;
  const otherName = isCurrentUserGuest
    ? activeConversation.host_name
    : activeConversation.guest_name;
  const otherProfileImage = isCurrentUserGuest
    ? activeConversation.host_profile_image
    : activeConversation.guest_profile_image;
  const otherInitials = otherName
    ? otherName.split(' ').map((n) => n[0]).join('')
    : '?';

  const propertyTitle = activeConversation.property
    ? getLocalizedField(activeConversation.property.title, locale)
    : (activeConversation.property_title || '');

  /* Group messages by date */
  const messagesByDate: Record<string, typeof activeConversation.messages> = {};
  activeConversation.messages.forEach((msg) => {
    const dateKey = new Date(msg.created_at).toDateString();
    if (!messagesByDate[dateKey]) {
      messagesByDate[dateKey] = [];
    }
    messagesByDate[dateKey].push(msg);
  });

  return (
    <div className="container-app py-4 md:py-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <Link
          href={`/${locale}${ROUTES.MESSAGES}`}
          className="p-2 rounded-lg text-secondary-400 hover:text-secondary-600 hover:bg-warm-100 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {otherProfileImage ? (
            <Image
              src={otherProfileImage}
              alt={otherName}
              width={40}
              height={40}
              className="rounded-full object-cover shrink-0"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
              <span className="text-primary-700 font-semibold text-sm">
                {otherInitials}
              </span>
            </div>
          )}
          <div className="min-w-0">
            <h2 className="font-semibold text-secondary-900 line-clamp-1">
              {otherName}
            </h2>
            {propertyTitle && (
              <div className="flex items-center gap-1 text-xs text-secondary-400">
                <Home className="h-3 w-3 shrink-0" />
                <span className="line-clamp-1">{propertyTitle}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Property info card */}
      {activeConversation.property && (
        <Card className="p-3 mb-4">
          <Link
            href={`/${locale}${ROUTES.PROPERTY_DETAIL(activeConversation.property.slug)}`}
            className="flex items-center gap-3"
          >
            {activeConversation.property.images?.[0] && (
              <div className="relative w-16 h-12 rounded-lg overflow-hidden shrink-0">
                <Image
                  src={activeConversation.property.images[0].image}
                  alt={propertyTitle}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </div>
            )}
            <div className="min-w-0">
              <h4 className="text-sm font-medium text-secondary-900 line-clamp-1">
                {propertyTitle}
              </h4>
              <p className="text-xs text-secondary-500">
                {getLocalizedField(activeConversation.property.city.name, locale)}
              </p>
            </div>
          </Link>
        </Card>
      )}

      {/* Messages */}
      <div className="bg-warm-50 rounded-xl p-4 mb-4 min-h-[400px] max-h-[calc(100vh-360px)] overflow-y-auto">
        {Object.entries(messagesByDate).map(([dateKey, messages]) => (
          <div key={dateKey}>
            {/* Date separator */}
            <div className="flex items-center justify-center my-4">
              <span className="text-xs text-secondary-400 bg-warm-100 px-3 py-1 rounded-full">
                {formatMessageDate(messages[0].created_at, locale)}
              </span>
            </div>

            {/* Messages for this date */}
            {messages.map((message) => {
              const isOwn = message.sender.id === user?.id;

              return (
                <div
                  key={message.id}
                  className={cn(
                    'flex mb-3',
                    isOwn ? 'justify-end' : 'justify-start'
                  )}
                >
                  <div
                    className={cn(
                      'max-w-[75%] rounded-2xl px-4 py-2.5 break-words',
                      isOwn
                        ? 'bg-primary-600 text-white rounded-br-md'
                        : 'bg-white text-secondary-900 shadow-sm rounded-bl-md'
                    )}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    <div
                      className={cn(
                        'flex items-center justify-end gap-1 mt-1',
                        isOwn ? 'text-primary-200' : 'text-secondary-400'
                      )}
                    >
                      <span className="text-[10px]">
                        {formatMessageTime(message.created_at, locale)}
                      </span>
                      {isOwn && (
                        message.is_read ? (
                          <CheckCheck className="h-3 w-3" />
                        ) : (
                          <Check className="h-3 w-3" />
                        )
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message input */}
      <div className="flex items-end gap-2">
        <div className="flex-1 relative">
          <textarea
            ref={inputRef}
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t('type_message')}
            rows={1}
            className="w-full resize-none rounded-xl border border-warm-200 bg-white px-4 py-3 text-sm text-secondary-900 placeholder:text-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            style={{ maxHeight: '120px' }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = 'auto';
              target.style.height = `${Math.min(target.scrollHeight, 120)}px`;
            }}
          />
        </div>
        <Button
          variant="primary"
          size="md"
          onClick={handleSend}
          disabled={!messageInput.trim() || isSending}
          isLoading={isSending}
          className="shrink-0 rounded-xl h-[46px] w-[46px] p-0"
        >
          {!isSending && <Send className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
}
