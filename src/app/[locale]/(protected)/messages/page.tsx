'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { MessageSquare, Home } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/lib/constants';
import { useMessageStore } from '@/stores/messageStore';
import { useAuthStore } from '@/stores/authStore';
import Card from '@/components/ui/Card';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function timeAgo(dateStr: string, locale: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffMin < 1) return locale === 'tr' ? 'Az once' : 'Just now';
  if (diffMin < 60) return `${diffMin}${locale === 'tr' ? 'dk' : 'm'}`;
  if (diffHour < 24) return `${diffHour}${locale === 'tr' ? 'sa' : 'h'}`;
  if (diffDay < 7) return `${diffDay}${locale === 'tr' ? 'g' : 'd'}`;

  return new Intl.DateTimeFormat(`${locale}-TR`, {
    month: 'short',
    day: 'numeric',
  }).format(date);
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function MessagesPage() {
  const t = useTranslations('messages');
  const locale = useLocale();
  const { user } = useAuthStore();
  const { conversations, isLoading, fetchConversations } = useMessageStore();

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  return (
    <div className="container-app py-8 md:py-12">
      {/* Page title */}
      <h1 className="text-2xl md:text-3xl font-bold text-secondary-900 mb-6">
        {t('conversations')}
      </h1>

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <LoadingSpinner size="lg" />
        </div>
      ) : conversations.length > 0 ? (
        <div className="space-y-2">
          {conversations.map((conversation) => {
            // Determine the "other" participant based on whether the
            // current user is the guest or the host of this conversation.
            const isCurrentUserGuest = conversation.guest === user?.id;
            const otherName = isCurrentUserGuest
              ? conversation.host_name
              : conversation.guest_name;
            const otherProfileImage = isCurrentUserGuest
              ? conversation.host_profile_image
              : conversation.guest_profile_image;
            const otherInitials = otherName
              ? otherName.split(' ').map((n) => n[0]).join('')
              : '?';

            const propertyTitle = conversation.property_title || '';

            const lastMessage = conversation.last_message_preview;
            const unreadCount = isCurrentUserGuest
              ? conversation.guest_unread_count
              : conversation.host_unread_count;
            const isUnread = unreadCount > 0;

            return (
              <Link
                key={conversation.id}
                href={`/${locale}${ROUTES.CONVERSATION(conversation.id)}`}
              >
                <Card
                  hoverLift
                  className={cn(
                    'p-4 flex items-start gap-3 transition-colors',
                    isUnread && 'bg-primary-50/50 border-l-4 border-l-primary-500'
                  )}
                >
                  {/* Avatar */}
                  <div className="shrink-0">
                    {otherProfileImage ? (
                      <Image
                        src={otherProfileImage}
                        alt={otherName}
                        width={48}
                        height={48}
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                        <span className="text-primary-700 font-semibold text-sm">
                          {otherInitials}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h3
                          className={cn(
                            'text-sm line-clamp-1',
                            isUnread
                              ? 'font-bold text-secondary-900'
                              : 'font-medium text-secondary-700'
                          )}
                        >
                          {otherName}
                        </h3>
                        {propertyTitle && (
                          <div className="flex items-center gap-1 text-xs text-secondary-400 mt-0.5">
                            <Home className="h-3 w-3 shrink-0" />
                            <span className="line-clamp-1">{propertyTitle}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {lastMessage && (
                          <span className="text-xs text-secondary-400">
                            {timeAgo(lastMessage.created_at, locale)}
                          </span>
                        )}
                        {isUnread && (
                          <span className="bg-primary-600 text-white text-xs font-bold min-w-[20px] h-5 flex items-center justify-center px-1.5 rounded-full">
                            {unreadCount}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Last message preview */}
                    {lastMessage && (
                      <p
                        className={cn(
                          'text-sm mt-1 line-clamp-1',
                          isUnread
                            ? 'text-secondary-700 font-medium'
                            : 'text-secondary-500'
                        )}
                      >
                        {lastMessage.sender === user?.id && (
                          <span className="text-secondary-400">
                            {locale === 'tr' ? 'Siz: ' : 'You: '}
                          </span>
                        )}
                        {lastMessage.content}
                      </p>
                    )}
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      ) : (
        /* Empty state */
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 rounded-full bg-warm-100 flex items-center justify-center mb-6">
            <MessageSquare className="h-8 w-8 text-warm-400" />
          </div>
          <h3 className="text-lg font-semibold text-secondary-900 mb-2">
            {t('no_conversations')}
          </h3>
          <p className="text-secondary-500 text-sm max-w-sm">
            {t('no_conversations_description')}
          </p>
        </div>
      )}
    </div>
  );
}
