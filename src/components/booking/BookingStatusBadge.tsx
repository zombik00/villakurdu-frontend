'use client';

import { useTranslations } from 'next-intl';
import Badge from '@/components/ui/Badge';
import type { BookingStatus } from '@/types';

const statusVariantMap: Record<BookingStatus, 'warning' | 'primary' | 'success' | 'accent' | 'secondary' | 'danger'> = {
  pending: 'warning',
  approved: 'primary',
  confirmed: 'success',
  checked_in: 'accent',
  completed: 'secondary',
  cancelled_guest: 'danger',
  cancelled_host: 'danger',
  rejected: 'danger',
  expired: 'secondary',
};

interface BookingStatusBadgeProps {
  status: BookingStatus;
  className?: string;
}

export default function BookingStatusBadge({ status, className }: BookingStatusBadgeProps) {
  const t = useTranslations('bookings');
  const variant = statusVariantMap[status] || 'secondary';

  return (
    <Badge variant={variant} className={className}>
      {t(`status_${status}`)}
    </Badge>
  );
}
