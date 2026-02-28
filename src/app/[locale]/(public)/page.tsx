'use client';

import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { Search, Calendar, Smile, ArrowRight } from 'lucide-react';
import SearchBar from '@/components/common/SearchBar';
import PropertyCard from '@/components/common/PropertyCard';
import { cn, getLocalizedField } from '@/lib/utils';
import type { Property, City } from '@/types';

/* ---------- Mock data ---------- */

const MOCK_CITIES: (City & { color: string })[] = [
  {
    id: '1',
    name: { tr: 'Antalya', en: 'Antalya' },
    slug: 'antalya',
    property_count: 245,
    color: 'from-orange-400 to-orange-600',
  },
  {
    id: '2',
    name: { tr: 'Mugla', en: 'Mugla' },
    slug: 'mugla',
    property_count: 189,
    color: 'from-teal-400 to-teal-600',
  },
  {
    id: '3',
    name: { tr: 'Izmir', en: 'Izmir' },
    slug: 'izmir',
    property_count: 132,
    color: 'from-blue-400 to-blue-600',
  },
  {
    id: '4',
    name: { tr: 'Istanbul', en: 'Istanbul' },
    slug: 'istanbul',
    property_count: 98,
    color: 'from-purple-400 to-purple-600',
  },
  {
    id: '5',
    name: { tr: 'Aydin', en: 'Aydin' },
    slug: 'aydin',
    property_count: 76,
    color: 'from-emerald-400 to-emerald-600',
  },
  {
    id: '6',
    name: { tr: 'Bolu', en: 'Bolu' },
    slug: 'bolu',
    property_count: 54,
    color: 'from-green-500 to-green-700',
  },
];

const MOCK_PROPERTIES: Property[] = [
  {
    id: '1',
    slug: 'deniz-manzarali-luks-villa',
    title: { tr: 'Deniz Manzarali Luks Villa', en: 'Luxury Sea View Villa' },
    description: { tr: 'Muhteserem deniz manzarasina sahip ozel havuzlu villa.', en: 'Villa with magnificent sea view and private pool.' },
    property_type: 'villa',
    city: { id: '1', name: { tr: 'Antalya', en: 'Antalya' }, slug: 'antalya', property_count: 245 },
    bedrooms: 4,
    bathrooms: 3,
    max_guests: 8,
    price_per_night: 4500,
    currency: 'TRY',
    images: [],
    amenities: [],
    host: { id: '1', email: 'host@test.com', first_name: 'Ahmet', last_name: 'Yilmaz', role: 'host', is_verified: true, created_at: '', updated_at: '' },
    average_rating: 4.8,
    review_count: 24,
    cancellation_policy: 'moderate',
    is_active: true,
    is_featured: true,
    created_at: '',
    updated_at: '',
  },
  {
    id: '2',
    slug: 'bodrum-sahil-dairesi',
    title: { tr: 'Bodrum Sahil Dairesi', en: 'Bodrum Beachfront Apartment' },
    description: { tr: 'Sahile sifir konumda modern daire.', en: 'Modern apartment right on the beach.' },
    property_type: 'apartment',
    city: { id: '2', name: { tr: 'Mugla', en: 'Mugla' }, slug: 'mugla', property_count: 189 },
    bedrooms: 2,
    bathrooms: 1,
    max_guests: 4,
    price_per_night: 2800,
    currency: 'TRY',
    images: [],
    amenities: [],
    host: { id: '2', email: 'host2@test.com', first_name: 'Fatma', last_name: 'Demir', role: 'host', is_verified: true, created_at: '', updated_at: '' },
    average_rating: 4.6,
    review_count: 18,
    cancellation_policy: 'flexible',
    is_active: true,
    is_featured: true,
    created_at: '',
    updated_at: '',
  },
  {
    id: '3',
    slug: 'sapanca-dag-evi',
    title: { tr: 'Sapanca Dag Evi', en: 'Sapanca Mountain Chalet' },
    description: { tr: 'Dogayla ic ice huzurlu bir dag evi.', en: 'A peaceful mountain chalet surrounded by nature.' },
    property_type: 'chalet',
    city: { id: '6', name: { tr: 'Bolu', en: 'Bolu' }, slug: 'bolu', property_count: 54 },
    bedrooms: 3,
    bathrooms: 2,
    max_guests: 6,
    price_per_night: 3200,
    currency: 'TRY',
    images: [],
    amenities: [],
    host: { id: '3', email: 'host3@test.com', first_name: 'Mehmet', last_name: 'Kaya', role: 'host', is_verified: true, created_at: '', updated_at: '' },
    average_rating: 4.9,
    review_count: 31,
    cancellation_policy: 'moderate',
    is_active: true,
    is_featured: true,
    created_at: '',
    updated_at: '',
  },
  {
    id: '4',
    slug: 'alacati-butik-otel',
    title: { tr: 'Alacati Butik Otel', en: 'Alacati Boutique Hotel' },
    description: { tr: 'Alacati sokaklarinda sakin bir butik otel.', en: 'A quiet boutique hotel in the streets of Alacati.' },
    property_type: 'boutique_hotel',
    city: { id: '3', name: { tr: 'Izmir', en: 'Izmir' }, slug: 'izmir', property_count: 132 },
    bedrooms: 1,
    bathrooms: 1,
    max_guests: 2,
    price_per_night: 1800,
    currency: 'TRY',
    images: [],
    amenities: [],
    host: { id: '4', email: 'host4@test.com', first_name: 'Zeynep', last_name: 'Celik', role: 'host', is_verified: true, created_at: '', updated_at: '' },
    average_rating: 4.7,
    review_count: 42,
    cancellation_policy: 'strict',
    is_active: true,
    is_featured: true,
    created_at: '',
    updated_at: '',
  },
];

/* ---------- Component ---------- */

export default function HomePage() {
  const locale = useLocale();
  const t = useTranslations('home');
  const tCommon = useTranslations('common');

  return (
    <>
      {/* ===== HERO ===== */}
      <section className="relative bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-700 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl" />
          <div className="absolute top-40 right-40 w-48 h-48 bg-primary-400/5 rounded-full blur-2xl" />
        </div>

        <div className="relative container-app py-20 md:py-28 lg:py-36">
          <div className="text-center max-w-3xl mx-auto mb-10 md:mb-14">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight">
              {t('hero_title')}
            </h1>
            <p className="mt-4 md:mt-6 text-lg md:text-xl text-white/70 leading-relaxed">
              {t('hero_subtitle')}
            </p>
          </div>
          <SearchBar variant="hero" />
        </div>
      </section>

      {/* ===== FEATURED CITIES ===== */}
      <section className="container-app py-14 md:py-20">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-secondary-900">
            {t('featured_cities')}
          </h2>
          <Link
            href={`/${locale}/search`}
            className="hidden md:flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
          >
            {tCommon('view_all')}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {MOCK_CITIES.map((city) => (
            <Link
              key={city.id}
              href={`/${locale}/search?location=${city.slug}`}
              className="group relative aspect-[4/5] rounded-2xl overflow-hidden hover-lift"
            >
              <div className={cn('absolute inset-0 bg-gradient-to-br', city.color)} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="font-semibold text-white text-lg">
                  {getLocalizedField(city.name, locale)}
                </h3>
                <p className="text-white/70 text-sm">
                  {city.property_count} {locale === 'tr' ? 'ilan' : 'properties'}
                </p>
              </div>
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          ))}
        </div>
      </section>

      {/* ===== POPULAR PROPERTIES ===== */}
      <section className="bg-white py-14 md:py-20">
        <div className="container-app">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-secondary-900">
              {t('popular_properties')}
            </h2>
            <Link
              href={`/${locale}/search`}
              className="hidden md:flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
            >
              {tCommon('view_all')}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {MOCK_PROPERTIES.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                onToggleFavorite={(id) => console.log('Toggle favorite:', id)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="container-app py-14 md:py-20">
        <h2 className="text-2xl md:text-3xl font-bold text-secondary-900 text-center mb-12">
          {t('how_it_works')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 max-w-4xl mx-auto">
          {[
            {
              icon: Search,
              title: t('step1_title'),
              desc: t('step1_desc'),
              color: 'bg-primary-100 text-primary-600',
            },
            {
              icon: Calendar,
              title: t('step2_title'),
              desc: t('step2_desc'),
              color: 'bg-secondary-100 text-secondary-600',
            },
            {
              icon: Smile,
              title: t('step3_title'),
              desc: t('step3_desc'),
              color: 'bg-accent-100 text-accent-600',
            },
          ].map((step, i) => (
            <div key={i} className="text-center">
              <div className="flex items-center justify-center mb-5">
                <div className={cn('w-16 h-16 rounded-2xl flex items-center justify-center', step.color)}>
                  <step.icon className="h-7 w-7" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-secondary-900 mb-2">{step.title}</h3>
              <p className="text-secondary-600 text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== BECOME A HOST CTA ===== */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-700 py-16 md:py-20">
        <div className="container-app text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            {t('become_host_title')}
          </h2>
          <p className="text-lg text-white/80 mb-8 max-w-xl mx-auto">
            {t('become_host_subtitle')}
          </p>
          <Link
            href={`/${locale}/register`}
            className="inline-flex items-center gap-2 bg-white text-primary-700 px-8 py-3.5 rounded-xl font-semibold hover:bg-primary-50 transition-colors shadow-lg"
          >
            {t('become_host_cta')}
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </>
  );
}
