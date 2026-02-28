'use client';

import { useTranslations } from 'next-intl';
import { formatPrice } from '@/lib/utils';

interface PriceBreakdownProps {
  numNights: number;
  nightlyRate: number;
  cleaningFee: number;
  extraGuestFee: number;
  serviceFee: number;
  totalPrice: number;
  currency: string;
  locale: string;
}

export default function PriceBreakdown({
  numNights,
  nightlyRate,
  cleaningFee,
  extraGuestFee,
  serviceFee,
  totalPrice,
  currency,
  locale,
}: PriceBreakdownProps) {
  const t = useTranslations('bookings');
  const fmt = (amount: number) => formatPrice(amount, currency, `${locale}-TR`);

  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-secondary-900">{t('price_breakdown')}</h3>

      <div className="space-y-2 text-sm">
        {/* Nightly rate x nights */}
        <div className="flex justify-between">
          <span className="text-secondary-600">
            {fmt(nightlyRate)} x {numNights} {t('nights')}
          </span>
          <span className="text-secondary-900">{fmt(nightlyRate * numNights)}</span>
        </div>

        {/* Cleaning fee */}
        {cleaningFee > 0 && (
          <div className="flex justify-between">
            <span className="text-secondary-600">{t('cleaning_fee')}</span>
            <span className="text-secondary-900">{fmt(cleaningFee)}</span>
          </div>
        )}

        {/* Extra guest fee */}
        {extraGuestFee > 0 && (
          <div className="flex justify-between">
            <span className="text-secondary-600">{t('extra_guest_fee')}</span>
            <span className="text-secondary-900">{fmt(extraGuestFee)}</span>
          </div>
        )}

        {/* Service fee */}
        {serviceFee > 0 && (
          <div className="flex justify-between">
            <span className="text-secondary-600">{t('service_fee')}</span>
            <span className="text-secondary-900">{fmt(serviceFee)}</span>
          </div>
        )}
      </div>

      {/* Total */}
      <div className="flex justify-between pt-3 border-t border-warm-200">
        <span className="font-semibold text-secondary-900">{t('total')}</span>
        <span className="font-bold text-lg text-primary-600">{fmt(totalPrice)}</span>
      </div>
    </div>
  );
}
