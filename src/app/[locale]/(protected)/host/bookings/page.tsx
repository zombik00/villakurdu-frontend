'use client';

import { useEffect, useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { CalendarX2 } from 'lucide-react';
import { useBookingStore } from '@/stores/bookingStore';
import BookingCard from '@/components/booking/BookingCard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import type { BookingStatus } from '@/types';

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

interface StatusTab {
  key: BookingStatus | 'all';
  translationKey: string;
}

const STATUS_TABS: StatusTab[] = [
  { key: 'all', translationKey: 'filter_all' },
  { key: 'pending', translationKey: 'status_pending' },
  { key: 'approved', translationKey: 'status_approved' },
  { key: 'confirmed', translationKey: 'status_confirmed' },
  { key: 'checked_in', translationKey: 'status_checked_in' },
  { key: 'completed', translationKey: 'status_completed' },
  { key: 'cancelled_host', translationKey: 'status_cancelled_host' },
  { key: 'rejected', translationKey: 'status_rejected' },
];

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function HostBookingsPage() {
  const t = useTranslations('bookings');
  const tCommon = useTranslations('common');
  const tHost = useTranslations('host');

  const { bookings, isLoading, fetchBookings, totalPages, currentPage } =
    useBookingStore();

  const [statusFilter, setStatusFilter] = useState<BookingStatus | 'all'>('all');
  const [page, setPage] = useState(1);

  const loadBookings = useCallback(() => {
    fetchBookings({
      role: 'host',
      status: statusFilter === 'all' ? undefined : statusFilter,
      page,
    });
  }, [fetchBookings, statusFilter, page]);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  /* Reset page when filters change */
  useEffect(() => {
    setPage(1);
  }, [statusFilter]);

  return (
    <div className="container-app py-8 md:py-12">
      {/* Page title */}
      <h1 className="text-2xl md:text-3xl font-bold text-secondary-900 mb-6">
        {tHost('bookings')}
      </h1>

      {/* Status filter tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setStatusFilter(tab.key)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              statusFilter === tab.key
                ? 'bg-secondary-900 text-white'
                : 'bg-warm-100 text-secondary-600 hover:bg-warm-200'
            }`}
          >
            {t(tab.translationKey)}
          </button>
        ))}
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <LoadingSpinner size="lg" />
        </div>
      ) : bookings.length > 0 ? (
        <>
          <div className="space-y-4">
            {bookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
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
            <CalendarX2 className="h-8 w-8 text-warm-400" />
          </div>
          <h3 className="text-lg font-semibold text-secondary-900 mb-2">
            {t('no_bookings')}
          </h3>
          <p className="text-secondary-500 text-sm max-w-sm">
            {t('no_bookings_description')}
          </p>
        </div>
      )}
    </div>
  );
}
