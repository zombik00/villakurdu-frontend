'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { CalendarX2 } from 'lucide-react';
import { useBookingStore } from '@/stores/bookingStore';
import { useAuthStore } from '@/stores/authStore';
import BookingCard from '@/components/booking/BookingCard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import type { BookingStatus } from '@/types';

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

type RoleTab = 'guest' | 'host';

interface StatusTab {
  key: BookingStatus | 'all';
  translationKey: string;
}

const STATUS_TABS: StatusTab[] = [
  { key: 'all', translationKey: 'filter_all' },
  { key: 'pending', translationKey: 'status_pending' },
  { key: 'confirmed', translationKey: 'status_confirmed' },
  { key: 'approved', translationKey: 'status_approved' },
  { key: 'completed', translationKey: 'status_completed' },
  { key: 'cancelled_guest', translationKey: 'filter_cancelled' },
];

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function BookingsPage() {
  const t = useTranslations('bookings');
  const tCommon = useTranslations('common');

  const { user } = useAuthStore();
  const { bookings, isLoading, fetchBookings, totalPages, currentPage } =
    useBookingStore();

  const isHost = user?.role === 'host';

  const [roleTab, setRoleTab] = useState<RoleTab>(isHost ? 'host' : 'guest');
  const [statusFilter, setStatusFilter] = useState<BookingStatus | 'all'>('all');
  const [page, setPage] = useState(1);

  /* Track whether filters changed so we can reset page first */
  const filtersChangedRef = useRef(false);

  const loadBookings = useCallback(
    (overridePage?: number) => {
      fetchBookings({
        role: roleTab,
        status: statusFilter === 'all' ? undefined : statusFilter,
        page: overridePage ?? page,
      });
    },
    [fetchBookings, roleTab, statusFilter, page],
  );

  /* Fetch on page change (when filters didn't change) */
  useEffect(() => {
    if (filtersChangedRef.current) {
      filtersChangedRef.current = false;
      return; // skip – the filter handler already fetched with page=1
    }
    loadBookings();
  }, [loadBookings]);

  /* When role or status changes, reset page and fetch once */
  const handleRoleTab = useCallback(
    (tab: RoleTab) => {
      filtersChangedRef.current = true;
      setRoleTab(tab);
      setPage(1);
      fetchBookings({
        role: tab,
        status: statusFilter === 'all' ? undefined : statusFilter,
        page: 1,
      });
    },
    [fetchBookings, statusFilter],
  );

  const handleStatusFilter = useCallback(
    (status: BookingStatus | 'all') => {
      filtersChangedRef.current = true;
      setStatusFilter(status);
      setPage(1);
      fetchBookings({
        role: roleTab,
        status: status === 'all' ? undefined : status,
        page: 1,
      });
    },
    [fetchBookings, roleTab],
  );

  return (
    <div className="container-app py-8 md:py-12">
      {/* Page title */}
      <h1 className="text-2xl md:text-3xl font-bold text-secondary-900 mb-6">
        {t('my_bookings')}
      </h1>

      {/* ---- Role tabs (guest / host) ---- */}
      {isHost && (
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => handleRoleTab('guest')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              roleTab === 'guest'
                ? 'bg-primary-600 text-white'
                : 'bg-warm-100 text-secondary-600 hover:bg-warm-200'
            }`}
          >
            {t('as_guest')}
          </button>
          <button
            onClick={() => handleRoleTab('host')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              roleTab === 'host'
                ? 'bg-primary-600 text-white'
                : 'bg-warm-100 text-secondary-600 hover:bg-warm-200'
            }`}
          >
            {t('as_host')}
          </button>
        </div>
      )}

      {/* ---- Status filter tabs ---- */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => handleStatusFilter(tab.key)}
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

      {/* ---- Content ---- */}
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

          {/* ---- Pagination ---- */}
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
        /* ---- Empty state ---- */
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
