'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import {
  ArrowLeft,
  Calendar,
  Users,
  Bed,
  MapPin,
  MessageSquare,
  User as UserIcon,
} from 'lucide-react';
import { formatDate, getLocalizedField } from '@/lib/utils';
import { useBookingStore } from '@/stores/bookingStore';
import { useAuthStore } from '@/stores/authStore';
import BookingStatusBadge from '@/components/booking/BookingStatusBadge';
import PriceBreakdown from '@/components/booking/PriceBreakdown';
import BookingStatusTimeline from '@/components/booking/BookingStatusTimeline';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Modal from '@/components/ui/Modal';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function BookingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('bookings');
  const tCommon = useTranslations('common');

  const bookingId = params.id as string;
  const { user } = useAuthStore();
  const {
    activeBooking: booking,
    isLoading,
    isActionLoading,
    error,
    fetchBooking,
    approveBooking,
    rejectBooking,
    cancelBooking,
    checkInBooking,
    completeBooking,
    clearActiveBooking,
  } = useBookingStore();

  /* ---- Modal state ---- */
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [reasonText, setReasonText] = useState('');

  useEffect(() => {
    if (bookingId) fetchBooking(bookingId);
    return () => clearActiveBooking();
  }, [bookingId, fetchBooking, clearActiveBooking]);

  /* ---- Role checks ---- */
  const isGuest = user?.id === booking?.guest?.id;
  const isHost = user?.id === booking?.property?.host?.id;

  /* ---- Handler helpers ---- */
  const handleApprove = async () => {
    if (!booking) return;
    await approveBooking(booking.id);
  };

  const handleReject = async () => {
    if (!booking) return;
    await rejectBooking(booking.id, reasonText || undefined);
    setShowRejectModal(false);
    setReasonText('');
  };

  const handleCancel = async () => {
    if (!booking) return;
    await cancelBooking(booking.id, reasonText || undefined);
    setShowCancelModal(false);
    setReasonText('');
  };

  const handleCheckIn = async () => {
    if (!booking) return;
    await checkInBooking(booking.id);
  };

  const handleComplete = async () => {
    if (!booking) return;
    await completeBooking(booking.id);
  };

  /* ---- Loading / Error ---- */
  if (isLoading || !booking) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-app py-12 text-center">
        <p className="text-red-600 mb-4">{error}</p>
        <Button variant="outline" onClick={() => router.back()}>
          {tCommon('back')}
        </Button>
      </div>
    );
  }

  /* ---- Derived data ---- */
  const property = booking.property;
  const title = getLocalizedField(property.title, locale);
  const cityName = getLocalizedField(property.city.name, locale);
  const coverImage = property.images?.find((img) => img.is_cover) || property.images?.[0];

  return (
    <div className="container-app py-8 md:py-12">
      {/* ---- Back nav ---- */}
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-1.5 text-sm text-secondary-600 hover:text-secondary-900 transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        {t('back_to_bookings')}
      </button>

      {/* ---- Header ---- */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-secondary-900">
            {t('booking_detail')}
          </h1>
          <p className="text-sm text-secondary-500 mt-1">
            {t('booking_id')}: {booking.id.slice(0, 8)}...
          </p>
        </div>
        <BookingStatusBadge status={booking.status} className="text-sm px-4 py-1" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ============================================= */}
        {/*  LEFT COLUMN: Property + Dates + Messages     */}
        {/* ============================================= */}
        <div className="lg:col-span-2 space-y-6">
          {/* ---- Property card ---- */}
          <Card className="overflow-hidden">
            <div className="flex flex-col sm:flex-row">
              {/* Image */}
              <div className="relative w-full sm:w-48 md:w-56 aspect-[4/3] sm:aspect-auto sm:min-h-[160px] shrink-0 overflow-hidden bg-warm-200">
                {coverImage ? (
                  <Image
                    src={coverImage.image}
                    alt={title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 224px"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-100 to-secondary-100">
                    <Bed className="h-10 w-10 text-primary-300" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-4 flex-1 min-w-0">
                <Link
                  href={`/${locale}/properties/${property.slug}`}
                  className="text-lg font-semibold text-secondary-900 hover:text-primary-600 transition-colors line-clamp-1"
                >
                  {title}
                </Link>
                <div className="flex items-center gap-1 text-secondary-500 mt-1">
                  <MapPin className="h-3.5 w-3.5" />
                  <span className="text-sm">{cityName}</span>
                </div>

                {/* Dates + Guests */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-4 text-sm text-secondary-600">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-secondary-400" />
                    <span>
                      {formatDate(booking.check_in, `${locale}-TR`)} &mdash;{' '}
                      {formatDate(booking.check_out, `${locale}-TR`)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="h-4 w-4 text-secondary-400" />
                    <span>
                      {booking.adults} {t('adults')}
                      {booking.children > 0 && `, ${booking.children} ${t('children')}`}
                      {booking.infants > 0 && `, ${booking.infants} ${t('infants')}`}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* ---- Messages section ---- */}
          {(booking.guest_message || booking.host_response_message) && (
            <Card className="p-5 space-y-4">
              <h3 className="font-semibold text-secondary-900 flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-secondary-400" />
                {t('messages')}
              </h3>

              {booking.guest_message && (
                <div className="bg-warm-50 rounded-lg p-4">
                  <p className="text-xs font-medium text-secondary-500 mb-1">
                    {t('guest_message')}
                  </p>
                  <p className="text-sm text-secondary-700">{booking.guest_message}</p>
                </div>
              )}

              {booking.host_response_message && (
                <div className="bg-primary-50 rounded-lg p-4">
                  <p className="text-xs font-medium text-secondary-500 mb-1">
                    {t('host_response')}
                  </p>
                  <p className="text-sm text-secondary-700">
                    {booking.host_response_message}
                  </p>
                </div>
              )}
            </Card>
          )}

          {/* ---- Cancellation info ---- */}
          {booking.cancellation_reason && (
            <Card className="p-5 border-l-4 border-red-400">
              <h3 className="font-semibold text-red-700 mb-2">{t('cancellation_reason')}</h3>
              <p className="text-sm text-secondary-700">{booking.cancellation_reason}</p>
            </Card>
          )}

          {/* ---- Status Timeline ---- */}
          {booking.status_logs && booking.status_logs.length > 0 && (
            <Card className="p-5">
              <BookingStatusTimeline
                statusLogs={booking.status_logs}
                locale={locale}
              />
            </Card>
          )}
        </div>

        {/* ============================================= */}
        {/*  RIGHT COLUMN: Price + People + Actions       */}
        {/* ============================================= */}
        <div className="space-y-6">
          {/* ---- Price Breakdown ---- */}
          <Card className="p-5">
            <PriceBreakdown
              numNights={booking.num_nights}
              nightlyRate={booking.nightly_rate}
              cleaningFee={booking.cleaning_fee}
              extraGuestFee={booking.extra_guest_fee}
              serviceFee={booking.service_fee}
              totalPrice={booking.total_price}
              currency={booking.currency}
              locale={locale}
            />
          </Card>

          {/* ---- Guest info (shown to host) ---- */}
          {isHost && (
            <Card className="p-5">
              <h3 className="font-semibold text-secondary-900 mb-3 flex items-center gap-2">
                <UserIcon className="h-5 w-5 text-secondary-400" />
                {t('guest_info')}
              </h3>
              <div className="flex items-center gap-3">
                {booking.guest.avatar ? (
                  <Image
                    src={booking.guest.avatar}
                    alt={booking.guest.first_name}
                    width={40}
                    height={40}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                    <span className="text-sm font-medium text-primary-700">
                      {booking.guest.first_name[0]}
                      {booking.guest.last_name[0]}
                    </span>
                  </div>
                )}
                <div>
                  <p className="font-medium text-secondary-900">
                    {booking.guest.first_name} {booking.guest.last_name}
                  </p>
                  <p className="text-xs text-secondary-500">{booking.guest.email}</p>
                </div>
              </div>
            </Card>
          )}

          {/* ---- Host info (shown to guest) ---- */}
          {isGuest && (
            <Card className="p-5">
              <h3 className="font-semibold text-secondary-900 mb-3 flex items-center gap-2">
                <UserIcon className="h-5 w-5 text-secondary-400" />
                {t('host_info')}
              </h3>
              <div className="flex items-center gap-3">
                {property.host.avatar ? (
                  <Image
                    src={property.host.avatar}
                    alt={property.host.first_name}
                    width={40}
                    height={40}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                    <span className="text-sm font-medium text-primary-700">
                      {property.host.first_name[0]}
                      {property.host.last_name[0]}
                    </span>
                  </div>
                )}
                <div>
                  <p className="font-medium text-secondary-900">
                    {property.host.first_name} {property.host.last_name}
                  </p>
                  <p className="text-xs text-secondary-500">{property.host.email}</p>
                </div>
              </div>
            </Card>
          )}

          {/* ---- Action Buttons ---- */}
          <Card className="p-5 space-y-3">
            <h3 className="font-semibold text-secondary-900 mb-1">{t('actions')}</h3>

            {/* HOST ACTIONS */}
            {isHost && booking.status === 'pending' && (
              <>
                <Button
                  fullWidth
                  onClick={handleApprove}
                  isLoading={isActionLoading}
                >
                  {t('approve')}
                </Button>
                <Button
                  variant="danger"
                  fullWidth
                  onClick={() => setShowRejectModal(true)}
                  isLoading={isActionLoading}
                >
                  {t('reject')}
                </Button>
              </>
            )}

            {isHost && booking.status === 'confirmed' && (
              <>
                <Button
                  fullWidth
                  onClick={handleCheckIn}
                  isLoading={isActionLoading}
                >
                  {t('check_in')}
                </Button>
                <Button
                  variant="danger"
                  fullWidth
                  onClick={() => setShowCancelModal(true)}
                  isLoading={isActionLoading}
                >
                  {tCommon('cancel')}
                </Button>
              </>
            )}

            {isHost && booking.status === 'checked_in' && (
              <Button
                fullWidth
                onClick={handleComplete}
                isLoading={isActionLoading}
              >
                {t('complete')}
              </Button>
            )}

            {/* GUEST ACTIONS */}
            {isGuest &&
              ['pending', 'approved', 'confirmed'].includes(booking.status) && (
                <Button
                  variant="danger"
                  fullWidth
                  onClick={() => setShowCancelModal(true)}
                  isLoading={isActionLoading}
                >
                  {t('cancel_booking')}
                </Button>
              )}

            {/* No actions available */}
            {!isHost &&
              !isGuest && (
                <p className="text-sm text-secondary-500">{t('no_actions')}</p>
              )}
            {(isHost || isGuest) &&
              !['pending', 'approved', 'confirmed', 'checked_in'].includes(
                booking.status
              ) && (
                <p className="text-sm text-secondary-500 text-center">
                  {t('no_actions_available')}
                </p>
              )}
          </Card>
        </div>
      </div>

      {/* ============================== */}
      {/*  REJECT MODAL                  */}
      {/* ============================== */}
      <Modal
        isOpen={showRejectModal}
        onClose={() => {
          setShowRejectModal(false);
          setReasonText('');
        }}
        title={t('reject_booking')}
      >
        <div className="space-y-4">
          <p className="text-sm text-secondary-600">{t('reject_confirm_message')}</p>
          <textarea
            value={reasonText}
            onChange={(e) => setReasonText(e.target.value)}
            placeholder={t('reason_placeholder')}
            rows={3}
            className="w-full rounded-lg border border-warm-200 px-3 py-2 text-sm text-secondary-900 placeholder:text-secondary-400 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-colors"
          />
          <div className="flex gap-3 justify-end">
            <Button
              variant="ghost"
              onClick={() => {
                setShowRejectModal(false);
                setReasonText('');
              }}
            >
              {tCommon('cancel')}
            </Button>
            <Button
              variant="danger"
              onClick={handleReject}
              isLoading={isActionLoading}
            >
              {t('reject')}
            </Button>
          </div>
        </div>
      </Modal>

      {/* ============================== */}
      {/*  CANCEL MODAL                  */}
      {/* ============================== */}
      <Modal
        isOpen={showCancelModal}
        onClose={() => {
          setShowCancelModal(false);
          setReasonText('');
        }}
        title={t('cancel_booking')}
      >
        <div className="space-y-4">
          <p className="text-sm text-secondary-600">{t('cancel_confirm_message')}</p>
          <textarea
            value={reasonText}
            onChange={(e) => setReasonText(e.target.value)}
            placeholder={t('reason_placeholder')}
            rows={3}
            className="w-full rounded-lg border border-warm-200 px-3 py-2 text-sm text-secondary-900 placeholder:text-secondary-400 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-colors"
          />
          <div className="flex gap-3 justify-end">
            <Button
              variant="ghost"
              onClick={() => {
                setShowCancelModal(false);
                setReasonText('');
              }}
            >
              {tCommon('cancel')}
            </Button>
            <Button
              variant="danger"
              onClick={handleCancel}
              isLoading={isActionLoading}
            >
              {t('confirm_cancel')}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
