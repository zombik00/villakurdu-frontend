'use client';

import { useTranslations } from 'next-intl';
import { formatDate } from '@/lib/utils';
import { Check, Clock, X, LogIn, Star, Ban } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { BookingStatusLog, BookingStatus } from '@/types';

const statusIconMap: Record<BookingStatus, typeof Check> = {
  pending: Clock,
  approved: Check,
  confirmed: Check,
  checked_in: LogIn,
  completed: Star,
  cancelled_guest: X,
  cancelled_host: X,
  rejected: Ban,
  expired: Clock,
};

const statusColorMap: Record<BookingStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-600 border-yellow-300',
  approved: 'bg-blue-100 text-blue-600 border-blue-300',
  confirmed: 'bg-green-100 text-green-600 border-green-300',
  checked_in: 'bg-indigo-100 text-indigo-600 border-indigo-300',
  completed: 'bg-gray-100 text-gray-600 border-gray-300',
  cancelled_guest: 'bg-red-100 text-red-600 border-red-300',
  cancelled_host: 'bg-red-100 text-red-600 border-red-300',
  rejected: 'bg-red-100 text-red-600 border-red-300',
  expired: 'bg-gray-100 text-gray-400 border-gray-300',
};

interface BookingStatusTimelineProps {
  statusLogs: BookingStatusLog[];
  locale: string;
}

export default function BookingStatusTimeline({ statusLogs, locale }: BookingStatusTimelineProps) {
  const t = useTranslations('bookings');

  if (!statusLogs || statusLogs.length === 0) return null;

  // Sort by date ascending
  const sorted = [...statusLogs].sort(
    (a, b) => new Date(a.changed_at).getTime() - new Date(b.changed_at).getTime()
  );

  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-secondary-900">{t('status_history')}</h3>
      <div className="relative">
        {sorted.map((log, index) => {
          const Icon = statusIconMap[log.status] || Clock;
          const colorClasses = statusColorMap[log.status] || statusColorMap.pending;
          const isLast = index === sorted.length - 1;

          return (
            <div key={index} className="flex gap-3 pb-4 last:pb-0">
              {/* Icon + connector line */}
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    'w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0',
                    colorClasses
                  )}
                >
                  <Icon className="h-4 w-4" />
                </div>
                {!isLast && (
                  <div className="w-0.5 flex-1 bg-warm-200 mt-1" />
                )}
              </div>

              {/* Content */}
              <div className="pt-1 pb-2 min-w-0">
                <p className="text-sm font-medium text-secondary-900">
                  {t(`status_${log.status}`)}
                </p>
                <p className="text-xs text-secondary-500 mt-0.5">
                  {formatDate(log.changed_at, `${locale}-TR`)}
                </p>
                {log.note && (
                  <p className="text-xs text-secondary-400 mt-1 italic">
                    {log.note}
                  </p>
                )}
                {log.changed_by && (
                  <p className="text-xs text-secondary-400 mt-0.5">
                    {log.changed_by.first_name} {log.changed_by.last_name}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
