'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { Heart, MapPin, Users, Bed, Bath, Star } from 'lucide-react';
import { cn, formatPrice, getLocalizedField } from '@/lib/utils';
import Badge from '@/components/ui/Badge';
import type { Property } from '@/types';

interface PropertyCardProps {
  property: Property;
  className?: string;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
}

export default function PropertyCard({
  property,
  className,
  isFavorite = false,
  onToggleFavorite,
}: PropertyCardProps) {
  const locale = useLocale();
  const t = useTranslations('common');
  const tProp = useTranslations('properties');

  const title = getLocalizedField(property.title, locale);
  const cityName = getLocalizedField(property.city.name, locale);
  const coverImage = property.images.find((img) => img.is_cover) || property.images[0];

  return (
    <Link
      href={`/${locale}/properties/${property.slug}`}
      className={cn(
        'group block bg-white rounded-xl shadow-card overflow-hidden hover-lift',
        className
      )}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-warm-200">
        {coverImage ? (
          <Image
            src={coverImage.image}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-100 to-secondary-100">
            <span className="text-4xl text-primary-300">
              <Bed className="h-12 w-12" />
            </span>
          </div>
        )}

        {/* Favorite button */}
        {onToggleFavorite && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleFavorite(property.id);
            }}
            className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors"
          >
            <Heart
              className={cn(
                'h-5 w-5 transition-colors',
                isFavorite ? 'fill-red-500 text-red-500' : 'text-secondary-600'
              )}
            />
          </button>
        )}

        {/* Property type badge */}
        <div className="absolute top-3 left-3">
          <Badge variant="warm">
            {tProp(property.property_type)}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <h3 className="font-semibold text-secondary-900 line-clamp-1 group-hover:text-primary-600 transition-colors">
          {title}
        </h3>

        {/* Location */}
        <div className="flex items-center gap-1 mt-1 text-secondary-500">
          <MapPin className="h-3.5 w-3.5" />
          <span className="text-sm">{cityName}</span>
        </div>

        {/* Rating */}
        {property.average_rating && property.average_rating > 0 && (
          <div className="flex items-center gap-1 mt-2">
            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
            <span className="text-sm font-medium text-secondary-700">
              {property.average_rating.toFixed(1)}
            </span>
            <span className="text-sm text-secondary-400">
              ({property.review_count} {t('reviews')})
            </span>
          </div>
        )}

        {/* Amenity icons */}
        <div className="flex items-center gap-3 mt-3 text-secondary-500">
          <div className="flex items-center gap-1">
            <Users className="h-3.5 w-3.5" />
            <span className="text-xs">{property.max_guests}</span>
          </div>
          <div className="flex items-center gap-1">
            <Bed className="h-3.5 w-3.5" />
            <span className="text-xs">{property.bedrooms}</span>
          </div>
          <div className="flex items-center gap-1">
            <Bath className="h-3.5 w-3.5" />
            <span className="text-xs">{property.bathrooms}</span>
          </div>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-1 mt-3 pt-3 border-t border-warm-100">
          <span className="text-lg font-bold text-primary-600">
            {formatPrice(property.price_per_night, property.currency, `${locale}-TR`)}
          </span>
          <span className="text-sm text-secondary-400">{t('per_night')}</span>
        </div>
      </div>
    </Link>
  );
}
