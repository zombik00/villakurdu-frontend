'use client';

import { useLocale, useTranslations } from 'next-intl';
import { Heart } from 'lucide-react';
import PropertyCard from '@/components/common/PropertyCard';
import type { Property } from '@/types';

/* ---------- Mock favorites ---------- */
const MOCK_FAVORITES: Property[] = [
  {
    id: '1',
    slug: 'deniz-manzarali-luks-villa',
    title: { tr: 'Deniz Manzarali Luks Villa', en: 'Luxury Sea View Villa' },
    description: { tr: '', en: '' },
    property_type: 'villa',
    city: { id: '1', name: { tr: 'Antalya', en: 'Antalya' }, slug: 'antalya', property_count: 245 },
    bedrooms: 4, bathrooms: 3, max_guests: 8,
    price_per_night: 4500, currency: 'TRY',
    images: [], amenities: [],
    host: { id: '1', email: 'h@t.com', first_name: 'Ahmet', last_name: 'Y.', role: 'host', is_verified: true, created_at: '', updated_at: '' },
    average_rating: 4.8, review_count: 24,
    cancellation_policy: 'moderate', is_active: true, is_featured: true, created_at: '', updated_at: '',
  },
  {
    id: '3',
    slug: 'sapanca-dag-evi',
    title: { tr: 'Sapanca Dag Evi', en: 'Sapanca Mountain Chalet' },
    description: { tr: '', en: '' },
    property_type: 'chalet',
    city: { id: '6', name: { tr: 'Bolu', en: 'Bolu' }, slug: 'bolu', property_count: 54 },
    bedrooms: 3, bathrooms: 2, max_guests: 6,
    price_per_night: 3200, currency: 'TRY',
    images: [], amenities: [],
    host: { id: '3', email: 'h@t.com', first_name: 'Mehmet', last_name: 'K.', role: 'host', is_verified: true, created_at: '', updated_at: '' },
    average_rating: 4.9, review_count: 31,
    cancellation_policy: 'moderate', is_active: true, is_featured: true, created_at: '', updated_at: '',
  },
];

export default function FavoritesPage() {
  const locale = useLocale();
  const t = useTranslations('nav');

  return (
    <div className="container-app py-8 md:py-12">
      <h1 className="text-2xl md:text-3xl font-bold text-secondary-900 mb-8">
        {t('favorites')}
      </h1>

      {MOCK_FAVORITES.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {MOCK_FAVORITES.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              isFavorite={true}
              onToggleFavorite={(id) => console.log('Remove favorite:', id)}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 rounded-full bg-warm-100 flex items-center justify-center mb-6">
            <Heart className="h-8 w-8 text-warm-400" />
          </div>
          <h3 className="text-lg font-semibold text-secondary-900 mb-2">
            {locale === 'tr' ? 'Henuz favoriniz yok' : 'No favorites yet'}
          </h3>
          <p className="text-secondary-500 text-sm max-w-sm">
            {locale === 'tr'
              ? 'Begendiginiz villalari favorilere ekleyerek daha sonra kolayca bulabilirsiniz.'
              : 'Add villas you like to favorites to easily find them later.'}
          </p>
        </div>
      )}
    </div>
  );
}
