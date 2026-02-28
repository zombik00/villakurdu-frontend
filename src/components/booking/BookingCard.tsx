'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { Calendar, Users, Bed, MapPin } from 'lucide-react';
import { cn, formatPrice, formatDate, getLocalizedField } from '@/lib/utils';
import BookingStatusBadge from '@/components/booking/BookingStatusBadge';
import Card from '@/components/ui/Card';
import type { Booking } from '@/types';

interface BookingCardProps {
  booking: Booking;
  className?: string;
}

export default function BookingCard({ booking, className }: BookingCardProps) {
  const locale = useLocale();
  const t = useTranslations('bookings');
  const tCommon = useTranslations('common');

  const property = booking.property;
  const title = getLocalizedField(property.title, locale);
  const cityName = getLocalizedField(property.city.name, locale);
  const coverImage = property.images?.find((img) => img.is_cover) || property.images?.[0];

  const totalGuests = booking.adults + booking.children + booking.infants;

  return (
    <Link href={`/${locale}/bookings/${booking.id}`}>
      <Card
        hoverLift
        className={cn('overflow-hidden flex flex-col sm:flex-row', className)}
      >
        {/* Image */}
        <div className="relative w-full sm:w-48 md:w-56 aspect-[4/3] sm:aspect-auto sm:h-auto shrink-0 overflow-hidden bg-warm-200">
          {coverImage ? (
            <Image
              src={coverImage.image}
              alt={title}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 224px"
            />
          ) : (
            <div className="w-full h-full min-h-[140px] flex items-center justify-center bg-gradient-to-br from-primary-100 to-secondary-100">
              <Bed className="h-10 w-10 text-primary-300" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 p-4 flex flex-col justify-between min-w-0">
          <div>
            {/* Title + Status */}
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className="font-semibold text-secondary-900 line-clamp-1 text-base">
                {title}
              </h3>
              <BookingStatusBadge status={booking.status} />
            </div>

            {/* Location */}
            <div className="flex items-center gap-1 text-secondary-500 mb-3">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              <span className="text-sm line-clamp-1">{cityName}</span>
            </div>

            {/* Info row */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-secondary-600">
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
                  {totalGuests} {tCommon('guests')}
                </span>
              </div>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-1 mt-3 pt-3 border-t border-warm-100">
            <span className="text-lg font-bold text-primary-600">
              {formatPrice(booking.total_price, booking.currency, `${locale}-TR`)}
            </span>
            <span className="text-sm text-secondary-400">
              {t('for_nights', { count: booking.num_nights })}
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
