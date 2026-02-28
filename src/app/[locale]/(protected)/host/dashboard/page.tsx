'use client';

import { useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import {
  Home,
  CalendarDays,
  Clock,
  TrendingUp,
  MessageSquare,
  ArrowRight,
  Check,
  X,
} from 'lucide-react';
import { cn, formatPrice, formatDate, getLocalizedField } from '@/lib/utils';
import { ROUTES } from '@/lib/constants';
import { useBookingStore } from '@/stores/bookingStore';
import { useMessageStore } from '@/stores/messageStore';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import BookingStatusBadge from '@/components/booking/BookingStatusBadge';

/* ------------------------------------------------------------------ */
/*  Stat Card                                                          */
/* ------------------------------------------------------------------ */

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  iconBg: string;
}

function StatCard({ icon, label, value, iconBg }: StatCardProps) {
  return (
    <Card className="p-5">
      <div className="flex items-center gap-4">
        <div className={cn('flex items-center justify-center w-12 h-12 rounded-xl', iconBg)}>
          {icon}
        </div>
        <div>
          <p className="text-sm text-secondary-500">{label}</p>
          <p className="text-2xl font-bold text-secondary-900">{value}</p>
        </div>
      </div>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function HostDashboardPage() {
  const t = useTranslations('host');
  const tBookings = useTranslations('bookings');
  const tCommon = useTranslations('common');
  const locale = useLocale();

  const {
    bookings: pendingBookings,
    isLoading: bookingsLoading,
    isActionLoading,
    fetchBookings,
    approveBooking,
    rejectBooking,
  } = useBookingStore();

  const { unreadCount, fetchUnreadCount } = useMessageStore();

  const loadData = useCallback(() => {
    fetchBookings({ role: 'host', status: 'pending', page_size: 5 });
    fetchUnreadCount();
  }, [fetchBookings, fetchUnreadCount]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleApprove = async (id: string) => {
    try {
      await approveBooking(id);
      loadData();
    } catch {
      // error handled in store
    }
  };

  const handleReject = async (id: string) => {
    try {
      await rejectBooking(id);
      loadData();
    } catch {
      // error handled in store
    }
  };

  return (
    <div className="container-app py-8 md:py-12">
      {/* Page title */}
      <h1 className="text-2xl md:text-3xl font-bold text-secondary-900 mb-8">
        {t('dashboard')}
      </h1>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={<Home className="h-6 w-6 text-primary-600" />}
          label={t('total_properties')}
          value={0}
          iconBg="bg-primary-50"
        />
        <StatCard
          icon={<CalendarDays className="h-6 w-6 text-green-600" />}
          label={t('active_bookings')}
          value={0}
          iconBg="bg-green-50"
        />
        <StatCard
          icon={<Clock className="h-6 w-6 text-yellow-600" />}
          label={t('pending_requests')}
          value={pendingBookings.length}
          iconBg="bg-yellow-50"
        />
        <StatCard
          icon={<TrendingUp className="h-6 w-6 text-accent-600" />}
          label={t('total_revenue')}
          value={formatPrice(0, 'TRY', `${locale}-TR`)}
          iconBg="bg-accent-50"
        />
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Link href={`/${locale}${ROUTES.HOST_PROPERTIES}`}>
          <Card hoverLift className="p-5 flex items-center justify-between group">
            <div className="flex items-center gap-3">
              <Home className="h-5 w-5 text-primary-600" />
              <span className="font-medium text-secondary-900">{t('my_properties')}</span>
            </div>
            <ArrowRight className="h-4 w-4 text-secondary-400 group-hover:text-primary-600 transition-colors" />
          </Card>
        </Link>

        <Link href={`/${locale}${ROUTES.HOST_BOOKINGS}`}>
          <Card hoverLift className="p-5 flex items-center justify-between group">
            <div className="flex items-center gap-3">
              <CalendarDays className="h-5 w-5 text-green-600" />
              <span className="font-medium text-secondary-900">{t('bookings')}</span>
            </div>
            <ArrowRight className="h-4 w-4 text-secondary-400 group-hover:text-primary-600 transition-colors" />
          </Card>
        </Link>

        <Link href={`/${locale}${ROUTES.MESSAGES}`}>
          <Card hoverLift className="p-5 flex items-center justify-between group">
            <div className="flex items-center gap-3">
              <MessageSquare className="h-5 w-5 text-accent-600" />
              <span className="font-medium text-secondary-900">{t('messages')}</span>
              {unreadCount > 0 && (
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </div>
            <ArrowRight className="h-4 w-4 text-secondary-400 group-hover:text-primary-600 transition-colors" />
          </Card>
        </Link>
      </div>

      {/* Recent pending requests */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-secondary-900">{t('recent_requests')}</h2>
          <Link
            href={`/${locale}${ROUTES.HOST_BOOKINGS}`}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            {tCommon('view_all')}
          </Link>
        </div>

        {bookingsLoading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : pendingBookings.length > 0 ? (
          <div className="space-y-3">
            {pendingBookings.map((booking) => {
              const title = getLocalizedField(booking.property.title, locale);
              const cityName = getLocalizedField(booking.property.city.name, locale);

              return (
                <Card key={booking.id} className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-secondary-900 line-clamp-1">{title}</h3>
                        <BookingStatusBadge status={booking.status} />
                      </div>
                      <p className="text-sm text-secondary-500 mb-1">{cityName}</p>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-secondary-600">
                        <span>
                          {booking.guest.first_name} {booking.guest.last_name}
                        </span>
                        <span>
                          {formatDate(booking.check_in, `${locale}-TR`)} &mdash;{' '}
                          {formatDate(booking.check_out, `${locale}-TR`)}
                        </span>
                        <span className="font-semibold text-primary-600">
                          {formatPrice(booking.total_price, booking.currency, `${locale}-TR`)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        variant="primary"
                        size="sm"
                        isLoading={isActionLoading}
                        onClick={() => handleApprove(booking.id)}
                      >
                        <Check className="h-4 w-4" />
                        {tBookings('approve')}
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        isLoading={isActionLoading}
                        onClick={() => handleReject(booking.id)}
                      >
                        <X className="h-4 w-4" />
                        {tBookings('reject')}
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="p-8 text-center">
            <Clock className="h-10 w-10 text-warm-300 mx-auto mb-3" />
            <p className="text-secondary-500 text-sm">{t('no_pending_requests')}</p>
          </Card>
        )}
      </div>
    </div>
  );
}
