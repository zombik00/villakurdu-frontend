'use client';

import { useEffect, useState, useCallback } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import {
  Bell,
  CalendarDays,
  Check,
  X,
  MessageSquare,
  Star,
  Wallet,
  Info,
  CheckCircle2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNotificationStore } from '@/stores/notificationStore';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import type { NotificationType } from '@/types';

/* ------------------------------------------------------------------ */
/*  Icon map                                                           */
/* ------------------------------------------------------------------ */

const notificationIcons: Record<NotificationType, React.ReactNode> = {
  booking_request: <CalendarDays className="h-5 w-5 text-yellow-600" />,
  booking_approved: <Check className="h-5 w-5 text-green-600" />,
  booking_rejected: <X className="h-5 w-5 text-red-600" />,
  booking_cancelled: <X className="h-5 w-5 text-red-600" />,
  booking_completed: <CheckCircle2 className="h-5 w-5 text-green-600" />,
  new_message: <MessageSquare className="h-5 w-5 text-primary-600" />,
  new_review: <Star className="h-5 w-5 text-yellow-500" />,
  payment_received: <Wallet className="h-5 w-5 text-green-600" />,
  system: <Info className="h-5 w-5 text-secondary-500" />,
};

const notificationBgs: Record<NotificationType, string> = {
  booking_request: 'bg-yellow-50',
  booking_approved: 'bg-green-50',
  booking_rejected: 'bg-red-50',
  booking_cancelled: 'bg-red-50',
  booking_completed: 'bg-green-50',
  new_message: 'bg-primary-50',
  new_review: 'bg-yellow-50',
  payment_received: 'bg-green-50',
  system: 'bg-secondary-50',
};

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

  if (locale === 'tr') {
    if (diffMin < 1) return 'Az once';
    if (diffMin < 60) return `${diffMin} dakika once`;
    if (diffHour < 24) return `${diffHour} saat once`;
    if (diffDay < 7) return `${diffDay} gun once`;
  } else {
    if (diffMin < 1) return 'Just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHour < 24) return `${diffHour}h ago`;
    if (diffDay < 7) return `${diffDay}d ago`;
  }

  return new Intl.DateTimeFormat(`${locale}-TR`, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function NotificationsPage() {
  const t = useTranslations('notifications');
  const tCommon = useTranslations('common');
  const locale = useLocale();

  const {
    notifications,
    isLoading,
    unreadCount,
    totalPages,
    currentPage,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    fetchUnreadCount,
  } = useNotificationStore();

  const [page, setPage] = useState(1);

  const loadData = useCallback(() => {
    fetchNotifications({ page });
    fetchUnreadCount();
  }, [fetchNotifications, fetchUnreadCount, page]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleMarkAsRead = async (id: string) => {
    await markAsRead(id);
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
  };

  return (
    <div className="container-app py-8 md:py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-secondary-900">
            {t('notifications')}
          </h1>
          {unreadCount > 0 && (
            <p className="text-sm text-secondary-500 mt-1">
              {t('unread_count', { count: unreadCount })}
            </p>
          )}
        </div>
        {unreadCount > 0 && (
          <Button variant="ghost" size="sm" onClick={handleMarkAllAsRead}>
            <CheckCircle2 className="h-4 w-4" />
            {t('mark_all_read')}
          </Button>
        )}
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <LoadingSpinner size="lg" />
        </div>
      ) : notifications.length > 0 ? (
        <>
          <div className="space-y-2">
            {notifications.map((notification) => {
              const icon = notificationIcons[notification.type] || notificationIcons.system;
              const iconBg = notificationBgs[notification.type] || notificationBgs.system;

              return (
                <Card
                  key={notification.id}
                  className={cn(
                    'p-4 flex items-start gap-3 cursor-pointer transition-colors hover:bg-warm-50',
                    !notification.is_read && 'bg-primary-50/30 border-l-4 border-l-primary-500'
                  )}
                  onClick={() => {
                    if (!notification.is_read) {
                      handleMarkAsRead(notification.id);
                    }
                  }}
                >
                  {/* Icon */}
                  <div
                    className={cn(
                      'flex items-center justify-center w-10 h-10 rounded-full shrink-0',
                      iconBg
                    )}
                  >
                    {icon}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3
                        className={cn(
                          'text-sm line-clamp-1',
                          !notification.is_read
                            ? 'font-bold text-secondary-900'
                            : 'font-medium text-secondary-700'
                        )}
                      >
                        {notification.title}
                      </h3>
                      <span className="text-xs text-secondary-400 whitespace-nowrap shrink-0">
                        {timeAgo(notification.created_at, locale)}
                      </span>
                    </div>
                    <p
                      className={cn(
                        'text-sm mt-0.5 line-clamp-2',
                        !notification.is_read
                          ? 'text-secondary-600'
                          : 'text-secondary-500'
                      )}
                    >
                      {notification.message}
                    </p>
                  </div>

                  {/* Unread indicator */}
                  {!notification.is_read && (
                    <div className="w-2 h-2 rounded-full bg-primary-600 shrink-0 mt-2" />
                  )}
                </Card>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={currentPage <= 1}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-warm-100 text-secondary-600 hover:bg-warm-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {tCommon('previous')}
              </button>
              <span className="text-sm text-secondary-600">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage >= totalPages}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-warm-100 text-secondary-600 hover:bg-warm-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {tCommon('next')}
              </button>
            </div>
          )}
        </>
      ) : (
        /* Empty state */
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 rounded-full bg-warm-100 flex items-center justify-center mb-6">
            <Bell className="h-8 w-8 text-warm-400" />
          </div>
          <h3 className="text-lg font-semibold text-secondary-900 mb-2">
            {t('no_notifications')}
          </h3>
          <p className="text-secondary-500 text-sm max-w-sm">
            {t('no_notifications_description')}
          </p>
        </div>
      )}
    </div>
  );
}
