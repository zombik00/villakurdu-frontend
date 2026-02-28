'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import {
  Heart,
  Share2,
  MapPin,
  Users,
  Bed,
  Bath,
  Star,
  Shield,
  Wifi,
  Car,
  Waves,
  Flame,
  Wind,
  Tv,
  CookingPot,
  TreePine,
  Flag,
  MessageCircle,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Rating from '@/components/ui/Rating';
import Card from '@/components/ui/Card';
import PropertyCard from '@/components/common/PropertyCard';
import { cn, formatPrice, getLocalizedField, formatDate } from '@/lib/utils';
import type { Property, Review } from '@/types';

/* ---------- Mock data ---------- */

const MOCK_PROPERTY: Property = {
  id: '1',
  slug: 'deniz-manzarali-luks-villa',
  title: { tr: 'Deniz Manzarali Luks Villa', en: 'Luxury Sea View Villa' },
  description: {
    tr: 'Bu muhteserem villa, turkuaz deniz manzarasi ile size unutulmaz bir tatil deneyimi sunuyor. Ozel havuzlu, genis bahceli ve modern dekorasyonlu bu villa aileniz veya arkadaslarinizla birlikte huzurlu bir tatil gecirmeniz icin ideal. 4 yatak odasi, 3 banyo ve tam donanimli mutfak ile konforlu bir konaklama deneyimi yasayacaksiniz. Villanin genis terasi deniz manzarasina hakimdir ve aksamlari batan gunesi izleyebilirsiniz.',
    en: 'This magnificent villa offers you an unforgettable vacation experience with turquoise sea views. With a private pool, large garden, and modern decoration, this villa is ideal for a peaceful vacation with your family or friends. You will experience a comfortable stay with 4 bedrooms, 3 bathrooms, and a fully equipped kitchen. The villa\'s spacious terrace overlooks the sea and you can watch the sunset in the evenings.',
  },
  property_type: 'villa',
  city: { id: '1', name: { tr: 'Antalya', en: 'Antalya' }, slug: 'antalya', property_count: 245 },
  district: { id: '1', name: { tr: 'Kas', en: 'Kas' }, slug: 'kas', city: { id: '1', name: { tr: 'Antalya', en: 'Antalya' }, slug: 'antalya', property_count: 245 } },
  bedrooms: 4,
  bathrooms: 3,
  max_guests: 8,
  area_sqm: 220,
  price_per_night: 4500,
  currency: 'TRY',
  cleaning_fee: 500,
  images: [],
  amenities: [
    { id: '1', name: { tr: 'Wi-Fi', en: 'Wi-Fi' }, icon: 'wifi', category: 'general' },
    { id: '2', name: { tr: 'Ozel Havuz', en: 'Private Pool' }, icon: 'pool', category: 'outdoor' },
    { id: '3', name: { tr: 'Klima', en: 'Air Conditioning' }, icon: 'ac', category: 'general' },
    { id: '4', name: { tr: 'Ucretsiz Otopark', en: 'Free Parking' }, icon: 'parking', category: 'general' },
    { id: '5', name: { tr: 'Barbekyu', en: 'BBQ' }, icon: 'bbq', category: 'outdoor' },
    { id: '6', name: { tr: 'TV', en: 'TV' }, icon: 'tv', category: 'general' },
    { id: '7', name: { tr: 'Tam Donanimli Mutfak', en: 'Full Kitchen' }, icon: 'kitchen', category: 'general' },
    { id: '8', name: { tr: 'Bahce', en: 'Garden' }, icon: 'garden', category: 'outdoor' },
  ],
  host: {
    id: '1',
    email: 'ahmet@test.com',
    first_name: 'Ahmet',
    last_name: 'Yilmaz',
    role: 'host',
    is_verified: true,
    created_at: '2023-06-01T00:00:00Z',
    updated_at: '',
  },
  average_rating: 4.8,
  review_count: 24,
  cancellation_policy: 'moderate',
  house_rules: {
    tr: 'Sigara icilmez. Evcil hayvan kabul edilmez. Parti ve etkinlik yapilmaz. Giris saati: 14:00, Cikis saati: 11:00.',
    en: 'No smoking. No pets. No parties or events. Check-in: 2:00 PM, Check-out: 11:00 AM.',
  },
  check_in_time: '14:00',
  check_out_time: '11:00',
  is_active: true,
  is_featured: true,
  created_at: '2024-01-15T00:00:00Z',
  updated_at: '',
};

const MOCK_REVIEWS: Review[] = [
  {
    id: '1',
    property: '1',
    author: { id: '10', email: 'g1@test.com', first_name: 'Elif', last_name: 'K.', role: 'guest', is_verified: true, created_at: '', updated_at: '' },
    rating: 5,
    comment: 'Muhteserem bir villa! Her sey cok temiz ve bakimli. Manzara harika. Kesinlikle tekrar geliriz.',
    created_at: '2024-08-15T00:00:00Z',
  },
  {
    id: '2',
    property: '1',
    author: { id: '11', email: 'g2@test.com', first_name: 'Michael', last_name: 'S.', role: 'guest', is_verified: true, created_at: '', updated_at: '' },
    rating: 4.5,
    comment: 'Great villa with an amazing view. The host was very responsive and helpful. Would recommend!',
    created_at: '2024-07-20T00:00:00Z',
  },
  {
    id: '3',
    property: '1',
    author: { id: '12', email: 'g3@test.com', first_name: 'Anna', last_name: 'M.', role: 'guest', is_verified: true, created_at: '', updated_at: '' },
    rating: 5,
    comment: 'Wunderschoene Villa! Perfekt fuer den Familienurlaub. Die Kinder haben den Pool geliebt.',
    created_at: '2024-06-10T00:00:00Z',
  },
];

const SIMILAR_PROPERTIES: Property[] = [
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
    host: { id: '5', email: 'h@t.com', first_name: 'Ali', last_name: 'Oz', role: 'host', is_verified: true, created_at: '', updated_at: '' },
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
    host: { id: '6', email: 'h@t.com', first_name: 'Ayse', last_name: 'Y.', role: 'host', is_verified: true, created_at: '', updated_at: '' },
    average_rating: 4.9, review_count: 56,
    cancellation_policy: 'strict', is_active: true, is_featured: true, created_at: '', updated_at: '',
  },
];

const AMENITY_ICONS: Record<string, React.ReactNode> = {
  wifi: <Wifi className="h-5 w-5" />,
  pool: <Waves className="h-5 w-5" />,
  ac: <Wind className="h-5 w-5" />,
  parking: <Car className="h-5 w-5" />,
  bbq: <Flame className="h-5 w-5" />,
  tv: <Tv className="h-5 w-5" />,
  kitchen: <CookingPot className="h-5 w-5" />,
  garden: <TreePine className="h-5 w-5" />,
};

export default function PropertyDetailPage() {
  const locale = useLocale();
  const t = useTranslations('properties');
  const tCommon = useTranslations('common');
  const tBooking = useTranslations('booking');

  const property = MOCK_PROPERTY;
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guestCount, setGuestCount] = useState(1);

  const title = getLocalizedField(property.title, locale);
  const description = getLocalizedField(property.description, locale);
  const cityName = getLocalizedField(property.city.name, locale);
  const districtName = property.district ? getLocalizedField(property.district.name, locale) : '';
  const houseRules = getLocalizedField(property.house_rules, locale);

  // Calculate booking cost
  const nights = checkIn && checkOut
    ? Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24))
    : 0;
  const subtotal = nights * property.price_per_night;
  const serviceFee = Math.round(subtotal * 0.12);
  const total = subtotal + (property.cleaning_fee || 0) + serviceFee;

  return (
    <div>
      {/* Image gallery */}
      <div className="container-app py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 rounded-2xl overflow-hidden">
          {/* Main image */}
          <div className="md:col-span-2 md:row-span-2 aspect-[4/3] md:aspect-auto bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center relative group">
            <div className="text-center">
              <Bed className="h-16 w-16 text-primary-300 mx-auto mb-2" />
              <span className="text-primary-400 text-sm">{title}</span>
            </div>
          </div>
          {/* Small thumbnails */}
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={cn(
                'aspect-[4/3] bg-gradient-to-br flex items-center justify-center',
                i === 1 && 'from-secondary-100 to-accent-100',
                i === 2 && 'from-accent-100 to-primary-100',
                i === 3 && 'from-warm-100 to-secondary-100 hidden md:flex',
                i === 4 && 'from-primary-50 to-warm-100 hidden md:flex relative'
              )}
            >
              <span className="text-secondary-300 text-xs">
                {locale === 'tr' ? `Foto ${i + 1}` : `Photo ${i + 1}`}
              </span>
              {i === 4 && (
                <button className="absolute inset-0 bg-black/30 flex items-center justify-center text-white text-sm font-medium hover:bg-black/40 transition-colors">
                  {t('show_all_photos')}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="container-app pb-16 md:pb-20">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Left column: property info */}
          <div className="flex-1 min-w-0">
            {/* Title & basic info */}
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="primary">{t(property.property_type)}</Badge>
                  {property.is_featured && (
                    <Badge variant="accent">{locale === 'tr' ? 'One Cikan' : 'Featured'}</Badge>
                  )}
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-secondary-900">{title}</h1>
                <div className="flex items-center gap-2 mt-2 text-secondary-500">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm">
                    {districtName && `${districtName}, `}{cityName}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button className="p-2.5 rounded-full border border-warm-300 text-secondary-600 hover:bg-warm-50 transition-colors">
                  <Share2 className="h-5 w-5" />
                </button>
                <button className="p-2.5 rounded-full border border-warm-300 text-secondary-600 hover:bg-warm-50 transition-colors">
                  <Heart className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Capacity icons */}
            <div className="flex items-center gap-6 py-5 border-y border-warm-200 mb-8">
              <div className="flex items-center gap-2 text-secondary-700">
                <Users className="h-5 w-5 text-secondary-400" />
                <span className="text-sm">{property.max_guests} {tCommon('guests')}</span>
              </div>
              <div className="flex items-center gap-2 text-secondary-700">
                <Bed className="h-5 w-5 text-secondary-400" />
                <span className="text-sm">{property.bedrooms} {tCommon('bedrooms')}</span>
              </div>
              <div className="flex items-center gap-2 text-secondary-700">
                <Bath className="h-5 w-5 text-secondary-400" />
                <span className="text-sm">{property.bathrooms} {tCommon('bathrooms')}</span>
              </div>
              {property.area_sqm && (
                <div className="flex items-center gap-2 text-secondary-700">
                  <span className="text-sm">{property.area_sqm} m&sup2;</span>
                </div>
              )}
            </div>

            {/* Host info */}
            <div className="flex items-center gap-4 mb-8 p-4 bg-warm-50 rounded-xl">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-400 to-secondary-500 flex items-center justify-center text-white text-xl font-medium shrink-0">
                {property.host.first_name[0]}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-secondary-900">
                    {property.host.first_name} {property.host.last_name}
                  </span>
                  {property.host.is_verified && (
                    <Badge variant="accent">
                      <Shield className="h-3 w-3 mr-1" />
                      {tCommon('verified')}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-secondary-500 mt-0.5">
                  {locale === 'tr' ? 'Uye tarihi:' : 'Member since:'} {formatDate(property.host.created_at, `${locale}-TR`)}
                </p>
              </div>
              <Button variant="outline" size="sm">
                <MessageCircle className="h-4 w-4" />
                {t('contact_host')}
              </Button>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-secondary-900 mb-3">{t('about_property')}</h2>
              <p className="text-secondary-600 leading-relaxed whitespace-pre-line">{description}</p>
            </div>

            {/* Amenities */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-secondary-900 mb-4">{t('amenities')}</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {property.amenities.map((amenity) => (
                  <div
                    key={amenity.id}
                    className="flex items-center gap-3 p-3 rounded-xl bg-warm-50"
                  >
                    <div className="text-primary-600">
                      {AMENITY_ICONS[amenity.icon] || <Star className="h-5 w-5" />}
                    </div>
                    <span className="text-sm text-secondary-700">
                      {getLocalizedField(amenity.name, locale)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* House rules */}
            {houseRules && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-secondary-900 mb-3">{t('house_rules')}</h2>
                <div className="p-4 bg-warm-50 rounded-xl">
                  <p className="text-secondary-600 text-sm leading-relaxed">{houseRules}</p>
                </div>
              </div>
            )}

            {/* Cancellation policy */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-secondary-900 mb-3">{t('cancellation_policy')}</h2>
              <Badge
                variant={
                  property.cancellation_policy === 'flexible'
                    ? 'success'
                    : property.cancellation_policy === 'moderate'
                      ? 'warning'
                      : 'danger'
                }
              >
                {property.cancellation_policy === 'flexible'
                  ? (locale === 'tr' ? 'Esnek' : 'Flexible')
                  : property.cancellation_policy === 'moderate'
                    ? (locale === 'tr' ? 'Orta' : 'Moderate')
                    : (locale === 'tr' ? 'Katı' : 'Strict')}
              </Badge>
            </div>

            {/* Reviews */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-6">
                <h2 className="text-xl font-semibold text-secondary-900">{tCommon('reviews')}</h2>
                <div className="flex items-center gap-1.5">
                  <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                  <span className="font-semibold text-secondary-900">
                    {property.average_rating?.toFixed(1)}
                  </span>
                  <span className="text-secondary-500">
                    ({property.review_count} {tCommon('reviews')})
                  </span>
                </div>
              </div>
              <div className="space-y-6">
                {MOCK_REVIEWS.map((review) => (
                  <div key={review.id} className="pb-6 border-b border-warm-100 last:border-0">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-secondary-300 to-secondary-500 flex items-center justify-center text-white text-sm font-medium">
                        {review.author.first_name[0]}
                      </div>
                      <div>
                        <p className="font-medium text-secondary-900 text-sm">
                          {review.author.first_name} {review.author.last_name}
                        </p>
                        <p className="text-xs text-secondary-400">
                          {formatDate(review.created_at, `${locale}-TR`)}
                        </p>
                      </div>
                      <div className="ml-auto">
                        <Rating rating={review.rating} size="sm" showValue={false} />
                      </div>
                    </div>
                    <p className="text-secondary-600 text-sm leading-relaxed">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Location */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-secondary-900 mb-3">{t('location')}</h2>
              <div className="aspect-[16/9] bg-warm-100 rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-8 w-8 text-primary-400 mx-auto mb-2" />
                  <p className="text-secondary-400 text-sm">
                    {districtName && `${districtName}, `}{cityName}
                  </p>
                  <p className="text-xs text-secondary-300 mt-1">
                    {locale === 'tr' ? 'Harita yaklasik konumu gostermektedir' : 'Map shows approximate location'}
                  </p>
                </div>
              </div>
            </div>

            {/* Similar properties */}
            <div>
              <h2 className="text-xl font-semibold text-secondary-900 mb-6">{t('similar_properties')}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {SIMILAR_PROPERTIES.map((p) => (
                  <PropertyCard key={p.id} property={p} />
                ))}
              </div>
            </div>
          </div>

          {/* Right column: Booking card (sticky) */}
          <div className="lg:w-[380px] shrink-0">
            <div className="sticky top-24">
              <Card className="p-6">
                {/* Price */}
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-2xl font-bold text-secondary-900">
                    {formatPrice(property.price_per_night, property.currency, `${locale}-TR`)}
                  </span>
                  <span className="text-secondary-500">{tCommon('per_night')}</span>
                </div>

                {/* Rating */}
                {property.average_rating && (
                  <div className="flex items-center gap-1.5 mb-6">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-sm font-medium">{property.average_rating.toFixed(1)}</span>
                    <span className="text-sm text-secondary-400">
                      ({property.review_count} {tCommon('reviews')})
                    </span>
                  </div>
                )}

                {/* Date pickers */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div>
                    <label className="block text-xs font-medium text-secondary-500 mb-1">
                      {t('check_in')}
                    </label>
                    <input
                      type="date"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full h-10 px-3 rounded-lg border border-warm-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-secondary-500 mb-1">
                      {t('check_out')}
                    </label>
                    <input
                      type="date"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      min={checkIn || new Date().toISOString().split('T')[0]}
                      className="w-full h-10 px-3 rounded-lg border border-warm-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>

                {/* Guest selector */}
                <div className="mb-4">
                  <label className="block text-xs font-medium text-secondary-500 mb-1">
                    {tCommon('guests')}
                  </label>
                  <select
                    value={guestCount}
                    onChange={(e) => setGuestCount(Number(e.target.value))}
                    className="w-full h-10 px-3 rounded-lg border border-warm-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    {Array.from({ length: property.max_guests }, (_, i) => i + 1).map((n) => (
                      <option key={n} value={n}>
                        {n} {tCommon('guests')}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price breakdown */}
                {nights > 0 && (
                  <div className="space-y-2 mb-4 pt-4 border-t border-warm-200">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-secondary-600">
                        {formatPrice(property.price_per_night, property.currency, `${locale}-TR`)} x {nights} {locale === 'tr' ? 'gece' : 'nights'}
                      </span>
                      <span className="text-secondary-900">
                        {formatPrice(subtotal, property.currency, `${locale}-TR`)}
                      </span>
                    </div>
                    {property.cleaning_fee && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-secondary-600">{tBooking('cleaning_fee')}</span>
                        <span className="text-secondary-900">
                          {formatPrice(property.cleaning_fee, property.currency, `${locale}-TR`)}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-secondary-600">{tBooking('service_fee')}</span>
                      <span className="text-secondary-900">
                        {formatPrice(serviceFee, property.currency, `${locale}-TR`)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-3 mt-3 border-t border-warm-200 font-semibold">
                      <span className="text-secondary-900">{tBooking('total')}</span>
                      <span className="text-secondary-900">
                        {formatPrice(total, property.currency, `${locale}-TR`)}
                      </span>
                    </div>
                  </div>
                )}

                {/* Book button */}
                <Button fullWidth size="lg">
                  {t('request_booking')}
                </Button>

                <p className="text-center text-xs text-secondary-400 mt-3">
                  {locale === 'tr' ? 'Henuz ucret alinmayacaktir' : 'You won\'t be charged yet'}
                </p>
              </Card>

              {/* Report link */}
              <div className="flex items-center justify-center mt-4">
                <button className="flex items-center gap-1.5 text-sm text-secondary-400 hover:text-secondary-600 transition-colors">
                  <Flag className="h-4 w-4" />
                  {t('report_listing')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
