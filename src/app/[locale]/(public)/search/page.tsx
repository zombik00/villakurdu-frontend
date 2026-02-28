'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import {
  SlidersHorizontal,
  X,
  ChevronLeft,
  ChevronRight,
  Search as SearchIcon,
} from 'lucide-react';
import SearchBar from '@/components/common/SearchBar';
import PropertyCard from '@/components/common/PropertyCard';
import Button from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { useSearchStore } from '@/stores/searchStore';
import { PROPERTY_TYPES } from '@/lib/constants';
import type { Property } from '@/types';

/* ---------- Mock data ---------- */
const MOCK_RESULTS: Property[] = [
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
    host: { id: '1', email: 'h@t.com', first_name: 'Ahmet', last_name: 'Yilmaz', role: 'host', is_verified: true, created_at: '', updated_at: '' },
    average_rating: 4.8, review_count: 24,
    cancellation_policy: 'moderate', is_active: true, is_featured: true, created_at: '', updated_at: '',
  },
  {
    id: '2',
    slug: 'bodrum-sahil-dairesi',
    title: { tr: 'Bodrum Sahil Dairesi', en: 'Bodrum Beachfront Apartment' },
    description: { tr: '', en: '' },
    property_type: 'apartment',
    city: { id: '2', name: { tr: 'Mugla', en: 'Mugla' }, slug: 'mugla', property_count: 189 },
    bedrooms: 2, bathrooms: 1, max_guests: 4,
    price_per_night: 2800, currency: 'TRY',
    images: [], amenities: [],
    host: { id: '2', email: 'h@t.com', first_name: 'Fatma', last_name: 'Demir', role: 'host', is_verified: true, created_at: '', updated_at: '' },
    average_rating: 4.6, review_count: 18,
    cancellation_policy: 'flexible', is_active: true, is_featured: false, created_at: '', updated_at: '',
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
    host: { id: '3', email: 'h@t.com', first_name: 'Mehmet', last_name: 'Kaya', role: 'host', is_verified: true, created_at: '', updated_at: '' },
    average_rating: 4.9, review_count: 31,
    cancellation_policy: 'moderate', is_active: true, is_featured: true, created_at: '', updated_at: '',
  },
  {
    id: '4',
    slug: 'alacati-butik-otel',
    title: { tr: 'Alacati Butik Otel', en: 'Alacati Boutique Hotel' },
    description: { tr: '', en: '' },
    property_type: 'boutique_hotel',
    city: { id: '3', name: { tr: 'Izmir', en: 'Izmir' }, slug: 'izmir', property_count: 132 },
    bedrooms: 1, bathrooms: 1, max_guests: 2,
    price_per_night: 1800, currency: 'TRY',
    images: [], amenities: [],
    host: { id: '4', email: 'h@t.com', first_name: 'Zeynep', last_name: 'Celik', role: 'host', is_verified: true, created_at: '', updated_at: '' },
    average_rating: 4.7, review_count: 42,
    cancellation_policy: 'strict', is_active: true, is_featured: false, created_at: '', updated_at: '',
  },
  {
    id: '5',
    slug: 'kas-bungalov',
    title: { tr: 'Kas Deniz Kenarinda Bungalov', en: 'Kas Seaside Bungalow' },
    description: { tr: '', en: '' },
    property_type: 'bungalow',
    city: { id: '1', name: { tr: 'Antalya', en: 'Antalya' }, slug: 'antalya', property_count: 245 },
    bedrooms: 2, bathrooms: 1, max_guests: 4,
    price_per_night: 2200, currency: 'TRY',
    images: [], amenities: [],
    host: { id: '5', email: 'h@t.com', first_name: 'Ali', last_name: 'Ozturk', role: 'host', is_verified: true, created_at: '', updated_at: '' },
    average_rating: 4.5, review_count: 15,
    cancellation_policy: 'flexible', is_active: true, is_featured: false, created_at: '', updated_at: '',
  },
  {
    id: '6',
    slug: 'fethiye-oludeniz-villa',
    title: { tr: 'Fethiye Oludeniz Villasi', en: 'Fethiye Oludeniz Villa' },
    description: { tr: '', en: '' },
    property_type: 'villa',
    city: { id: '2', name: { tr: 'Mugla', en: 'Mugla' }, slug: 'mugla', property_count: 189 },
    bedrooms: 5, bathrooms: 4, max_guests: 10,
    price_per_night: 6500, currency: 'TRY',
    images: [], amenities: [],
    host: { id: '6', email: 'h@t.com', first_name: 'Ayse', last_name: 'Yildiz', role: 'host', is_verified: true, created_at: '', updated_at: '' },
    average_rating: 4.9, review_count: 56,
    cancellation_policy: 'strict', is_active: true, is_featured: true, created_at: '', updated_at: '',
  },
];

const MOCK_AMENITIES = [
  { id: '1', label: { tr: 'Ozel Havuz', en: 'Private Pool' } },
  { id: '2', label: { tr: 'Wi-Fi', en: 'Wi-Fi' } },
  { id: '3', label: { tr: 'Klima', en: 'Air Conditioning' } },
  { id: '4', label: { tr: 'Ucretsiz Otopark', en: 'Free Parking' } },
  { id: '5', label: { tr: 'Denize Yakin', en: 'Near Beach' } },
  { id: '6', label: { tr: 'Bahce', en: 'Garden' } },
  { id: '7', label: { tr: 'Barbekyu', en: 'BBQ' } },
  { id: '8', label: { tr: 'Camasir Makinesi', en: 'Washing Machine' } },
];

export default function SearchPage() {
  const locale = useLocale();
  const t = useTranslations('properties');
  const tCommon = useTranslations('common');

  const {
    propertyType,
    priceRange,
    bedrooms,
    bathrooms,
    amenities,
    sortBy,
    setPropertyType,
    setPriceRange,
    setBedrooms,
    setBathrooms,
    setAmenities,
    setSortBy,
    resetFilters,
  } = useSearchStore();

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = 5; // mock

  return (
    <div className="min-h-screen">
      {/* Search bar */}
      <div className="bg-white shadow-card border-b border-warm-200 py-4">
        <div className="container-app">
          <SearchBar variant="hero" />
        </div>
      </div>

      <div className="container-app py-6 md:py-8">
        {/* Results header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-secondary-900">
              {t('all_properties')}
            </h1>
            <p className="text-sm text-secondary-500 mt-1">
              {MOCK_RESULTS.length} {locale === 'tr' ? 'ilan bulundu' : 'properties found'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Sort dropdown */}
            <div className="hidden md:block">
              <select
                value={sortBy || ''}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="h-10 px-3 pr-8 rounded-lg border border-warm-300 text-sm text-secondary-700 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">{t('sort_by')}</option>
                <option value="newest">{t('newest')}</option>
                <option value="price_low">{t('price_low')}</option>
                <option value="price_high">{t('price_high')}</option>
                <option value="top_rated">{t('top_rated')}</option>
              </select>
            </div>
            {/* Filter toggle */}
            <Button
              variant="outline"
              size="md"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="md:hidden"
            >
              <SlidersHorizontal className="h-4 w-4" />
              {t('filters')}
            </Button>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Filters sidebar */}
          <aside
            className={cn(
              'md:block md:w-64 lg:w-72 shrink-0',
              isFilterOpen
                ? 'fixed inset-0 z-50 bg-white p-4 overflow-auto md:relative md:inset-auto md:z-auto md:bg-transparent md:p-0'
                : 'hidden'
            )}
          >
            {/* Mobile filter header */}
            <div className="flex items-center justify-between mb-6 md:hidden">
              <h2 className="text-lg font-semibold text-secondary-900">{t('filters')}</h2>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="p-2 rounded-lg hover:bg-warm-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Property type */}
              <FilterSection title={t('property_types')}>
                <div className="space-y-2">
                  {PROPERTY_TYPES.map((type) => (
                    <label key={type} className="flex items-center gap-2.5 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={propertyType?.includes(type) || false}
                        onChange={(e) => {
                          const current = propertyType || [];
                          if (e.target.checked) {
                            setPropertyType([...current, type]);
                          } else {
                            setPropertyType(current.filter((t) => t !== type));
                          }
                        }}
                        className="w-4 h-4 rounded border-warm-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-sm text-secondary-600 group-hover:text-secondary-900 transition-colors">
                        {t(type)}
                      </span>
                    </label>
                  ))}
                </div>
              </FilterSection>

              {/* Price range */}
              <FilterSection title={t('price_range')}>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder={t('min_price')}
                    value={priceRange.min || ''}
                    onChange={(e) => setPriceRange({ min: Number(e.target.value) || undefined })}
                    className="w-full h-9 px-3 rounded-lg border border-warm-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <span className="text-secondary-400">-</span>
                  <input
                    type="number"
                    placeholder={t('max_price')}
                    value={priceRange.max || ''}
                    onChange={(e) => setPriceRange({ max: Number(e.target.value) || undefined })}
                    className="w-full h-9 px-3 rounded-lg border border-warm-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </FilterSection>

              {/* Bedrooms */}
              <FilterSection title={tCommon('bedrooms')}>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      onClick={() => setBedrooms(bedrooms === n ? undefined : n)}
                      className={cn(
                        'w-10 h-10 rounded-lg border text-sm font-medium transition-colors',
                        bedrooms === n
                          ? 'bg-primary-600 text-white border-primary-600'
                          : 'border-warm-300 text-secondary-600 hover:border-secondary-400'
                      )}
                    >
                      {n}+
                    </button>
                  ))}
                </div>
              </FilterSection>

              {/* Bathrooms */}
              <FilterSection title={tCommon('bathrooms')}>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4].map((n) => (
                    <button
                      key={n}
                      onClick={() => setBathrooms(bathrooms === n ? undefined : n)}
                      className={cn(
                        'w-10 h-10 rounded-lg border text-sm font-medium transition-colors',
                        bathrooms === n
                          ? 'bg-primary-600 text-white border-primary-600'
                          : 'border-warm-300 text-secondary-600 hover:border-secondary-400'
                      )}
                    >
                      {n}+
                    </button>
                  ))}
                </div>
              </FilterSection>

              {/* Amenities */}
              <FilterSection title={t('amenities')}>
                <div className="space-y-2">
                  {MOCK_AMENITIES.map((amenity) => (
                    <label key={amenity.id} className="flex items-center gap-2.5 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={amenities?.includes(amenity.id) || false}
                        onChange={(e) => {
                          const current = amenities || [];
                          if (e.target.checked) {
                            setAmenities([...current, amenity.id]);
                          } else {
                            setAmenities(current.filter((a) => a !== amenity.id));
                          }
                        }}
                        className="w-4 h-4 rounded border-warm-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-sm text-secondary-600 group-hover:text-secondary-900 transition-colors">
                        {amenity.label[locale as 'tr' | 'en'] || amenity.label.en}
                      </span>
                    </label>
                  ))}
                </div>
              </FilterSection>

              {/* Reset button */}
              <Button variant="ghost" fullWidth onClick={resetFilters}>
                {tCommon('reset')}
              </Button>

              {/* Mobile apply */}
              <div className="md:hidden">
                <Button fullWidth onClick={() => setIsFilterOpen(false)}>
                  {tCommon('apply')}
                </Button>
              </div>
            </div>
          </aside>

          {/* Results grid */}
          <div className="flex-1 min-w-0">
            {MOCK_RESULTS.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {MOCK_RESULTS.map((property) => (
                    <PropertyCard
                      key={property.id}
                      property={property}
                      onToggleFavorite={(id) => console.log('Toggle favorite:', id)}
                    />
                  ))}
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-center gap-2 mt-10">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-warm-300 text-secondary-600 hover:bg-warm-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={cn(
                        'w-10 h-10 rounded-lg text-sm font-medium transition-colors',
                        currentPage === page
                          ? 'bg-primary-600 text-white'
                          : 'text-secondary-600 hover:bg-warm-100'
                      )}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-warm-300 text-secondary-600 hover:bg-warm-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </>
            ) : (
              /* Empty state */
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-20 h-20 rounded-full bg-warm-100 flex items-center justify-center mb-6">
                  <SearchIcon className="h-8 w-8 text-warm-400" />
                </div>
                <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                  {tCommon('no_results')}
                </h3>
                <p className="text-secondary-500 text-sm max-w-sm">
                  {locale === 'tr'
                    ? 'Farkli filtreler deneyerek yeni sonuclar kesfedebilirsiniz.'
                    : 'Try adjusting your filters to discover new results.'}
                </p>
                <Button variant="outline" className="mt-6" onClick={resetFilters}>
                  {tCommon('reset')}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl p-4 md:p-0 md:bg-transparent">
      <h3 className="text-sm font-semibold text-secondary-900 mb-3">{title}</h3>
      {children}
    </div>
  );
}
