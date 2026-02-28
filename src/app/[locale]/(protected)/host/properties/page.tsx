'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import {
  Plus,
  MapPin,
  Bed,
  Users,
  Star,
  Eye,
  CalendarDays,
  Home,
} from 'lucide-react';
import { formatPrice, getLocalizedField } from '@/lib/utils';
import { ROUTES } from '@/lib/constants';
import * as propertiesApi from '@/services/properties';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import type { HostProperty, PropertyStatus, PaginatedResponse } from '@/types';

/* ------------------------------------------------------------------ */
/*  Status badge                                                       */
/* ------------------------------------------------------------------ */

const statusVariantMap: Record<PropertyStatus, 'success' | 'secondary' | 'warning' | 'danger' | 'primary'> = {
  published: 'success',
  draft: 'secondary',
  unlisted: 'warning',
  suspended: 'danger',
  pending_review: 'primary',
};

function PropertyStatusBadge({ status }: { status: PropertyStatus }) {
  const t = useTranslations('host');
  const variant = statusVariantMap[status] || 'secondary';
  const labelMap: Record<PropertyStatus, string> = {
    published: t('published'),
    draft: t('draft'),
    unlisted: t('unlisted'),
    suspended: t('suspended'),
    pending_review: t('pending_review'),
  };

  return <Badge variant={variant}>{labelMap[status]}</Badge>;
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function HostPropertiesPage() {
  const t = useTranslations('host');
  const tCommon = useTranslations('common');
  const locale = useLocale();

  const [properties, setProperties] = useState<HostProperty[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProperties = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data: PaginatedResponse<HostProperty> = await propertiesApi.getMyProperties({
        page: currentPage,
      });
      setProperties(data.results);
      setTotalPages(data.total_pages);
    } catch {
      setError(tCommon('error'));
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, tCommon]);

  useEffect(() => {
    loadProperties();
  }, [loadProperties]);

  return (
    <div className="container-app py-8 md:py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-secondary-900">
          {t('my_properties')}
        </h1>
        <Link href={`/${locale}${ROUTES.HOST_NEW_PROPERTY}`}>
          <Button variant="primary" size="md">
            <Plus className="h-4 w-4" />
            {t('add_property')}
          </Button>
        </Link>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <LoadingSpinner size="lg" />
        </div>
      ) : error ? (
        <Card className="p-8 text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button variant="outline" onClick={loadProperties}>
            {tCommon('try_again')}
          </Button>
        </Card>
      ) : properties.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => {
              const title = getLocalizedField(property.title, locale);
              const cityName = getLocalizedField(property.city.name, locale);
              const coverImage = property.images?.find((img) => img.is_cover) || property.images?.[0];

              return (
                <Link
                  key={property.id}
                  href={`/${locale}${ROUTES.HOST_EDIT_PROPERTY(property.id)}`}
                >
                  <Card hoverLift className="overflow-hidden flex flex-col h-full">
                    {/* Image */}
                    <div className="relative aspect-[4/3] overflow-hidden bg-warm-200">
                      {coverImage ? (
                        <Image
                          src={coverImage.image}
                          alt={title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-100 to-secondary-100">
                          <Home className="h-12 w-12 text-primary-300" />
                        </div>
                      )}
                      <div className="absolute top-3 right-3">
                        <PropertyStatusBadge status={property.status} />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4 flex-1 flex flex-col">
                      <h3 className="font-semibold text-secondary-900 line-clamp-1 mb-1">
                        {title}
                      </h3>

                      <div className="flex items-center gap-1 text-secondary-500 mb-3">
                        <MapPin className="h-3.5 w-3.5 shrink-0" />
                        <span className="text-sm line-clamp-1">{cityName}</span>
                      </div>

                      {/* Stats row */}
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-secondary-500 mb-3">
                        <div className="flex items-center gap-1">
                          <Bed className="h-3.5 w-3.5" />
                          <span>{property.bedrooms}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-3.5 w-3.5" />
                          <span>{property.max_guests}</span>
                        </div>
                        {property.average_rating && (
                          <div className="flex items-center gap-1">
                            <Star className="h-3.5 w-3.5 text-yellow-500" />
                            <span>{property.average_rating.toFixed(1)}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Eye className="h-3.5 w-3.5" />
                          <span>{property.view_count}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <CalendarDays className="h-3.5 w-3.5" />
                          <span>{property.booking_count}</span>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="mt-auto pt-3 border-t border-warm-100 flex items-center justify-between">
                        <span className="text-lg font-bold text-primary-600">
                          {formatPrice(property.price_per_night, property.currency, `${locale}-TR`)}
                        </span>
                        <span className="text-xs text-secondary-400">{tCommon('per_night')}</span>
                      </div>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage <= 1}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-warm-100 text-secondary-600 hover:bg-warm-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {tCommon('previous')}
              </button>
              <span className="text-sm text-secondary-600">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
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
            <Home className="h-8 w-8 text-warm-400" />
          </div>
          <h3 className="text-lg font-semibold text-secondary-900 mb-2">
            {t('no_properties')}
          </h3>
          <p className="text-secondary-500 text-sm max-w-sm mb-6">
            {t('no_properties_description')}
          </p>
          <Link href={`/${locale}${ROUTES.HOST_NEW_PROPERTY}`}>
            <Button variant="primary">
              <Plus className="h-4 w-4" />
              {t('add_property')}
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
