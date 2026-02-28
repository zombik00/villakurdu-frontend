'use client';

import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { Search, MapPin, Calendar, Users, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useSearchStore } from '@/stores/searchStore';
import { cn } from '@/lib/utils';

// Mock cities for static display
const MOCK_CITIES = [
  { slug: 'antalya', name: { tr: 'Antalya', en: 'Antalya' } },
  { slug: 'mugla', name: { tr: 'Mugla', en: 'Mugla' } },
  { slug: 'izmir', name: { tr: 'Izmir', en: 'Izmir' } },
  { slug: 'istanbul', name: { tr: 'Istanbul', en: 'Istanbul' } },
  { slug: 'aydin', name: { tr: 'Aydin', en: 'Aydin' } },
  { slug: 'bolu', name: { tr: 'Bolu', en: 'Bolu' } },
  { slug: 'canakkale', name: { tr: 'Canakkale', en: 'Canakkale' } },
  { slug: 'trabzon', name: { tr: 'Trabzon', en: 'Trabzon' } },
];

interface SearchBarProps {
  variant?: 'hero' | 'compact';
  className?: string;
}

export default function SearchBar({ variant = 'hero', className }: SearchBarProps) {
  const t = useTranslations('home');
  const tCommon = useTranslations('common');
  const tProp = useTranslations('properties');
  const locale = useLocale();
  const router = useRouter();

  const { location, checkIn, checkOut, guests, setLocation, setCheckIn, setCheckOut, setGuests } =
    useSearchStore();

  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [showGuestDropdown, setShowGuestDropdown] = useState(false);
  const cityRef = useRef<HTMLDivElement>(null);
  const guestRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (cityRef.current && !cityRef.current.contains(e.target as Node)) {
        setShowCityDropdown(false);
      }
      if (guestRef.current && !guestRef.current.contains(e.target as Node)) {
        setShowGuestDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const totalGuests = guests.adults + guests.children + guests.infants;

  const handleSearch = () => {
    router.push(`/${locale}/search`);
  };

  const selectedCity = MOCK_CITIES.find((c) => c.slug === location);

  if (variant === 'compact') {
    return (
      <div
        className={cn(
          'flex items-center gap-2 bg-white rounded-full shadow-card border border-warm-200 px-4 py-2 cursor-pointer hover:shadow-card-hover transition-shadow',
          className
        )}
        onClick={() => router.push(`/${locale}/search`)}
      >
        <Search className="h-4 w-4 text-primary-600" />
        <span className="text-sm text-secondary-500">{t('search_placeholder')}</span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'w-full max-w-4xl mx-auto',
        className
      )}
    >
      <div className="bg-white rounded-2xl shadow-modal p-2 md:p-3">
        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-0">
          {/* Location */}
          <div ref={cityRef} className="relative flex-1 md:border-r border-warm-200">
            <button
              onClick={() => setShowCityDropdown(!showCityDropdown)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-warm-50 transition-colors text-left"
            >
              <MapPin className="h-5 w-5 text-primary-600 shrink-0" />
              <div>
                <p className="text-xs font-medium text-secondary-500">{tProp('location')}</p>
                <p className={cn('text-sm', location ? 'text-secondary-900 font-medium' : 'text-secondary-400')}>
                  {selectedCity
                    ? (selectedCity.name as Record<string, string>)[locale] || selectedCity.name.tr
                    : t('search_placeholder')}
                </p>
              </div>
            </button>
            {showCityDropdown && (
              <div className="absolute left-0 top-full mt-1 w-full min-w-[200px] bg-white rounded-xl shadow-modal border border-warm-200 py-1 z-50 animate-scale-in">
                {MOCK_CITIES.map((city) => (
                  <button
                    key={city.slug}
                    onClick={() => {
                      setLocation(city.slug);
                      setShowCityDropdown(false);
                    }}
                    className={cn(
                      'flex items-center gap-3 w-full px-4 py-2.5 text-sm transition-colors',
                      location === city.slug
                        ? 'bg-primary-50 text-primary-700 font-medium'
                        : 'text-secondary-700 hover:bg-warm-50'
                    )}
                  >
                    <MapPin className="h-4 w-4" />
                    <span>{(city.name as Record<string, string>)[locale] || city.name.tr}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Check-in */}
          <div className="flex-1 md:border-r border-warm-200">
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-warm-50 transition-colors">
              <Calendar className="h-5 w-5 text-primary-600 shrink-0" />
              <div className="flex-1">
                <p className="text-xs font-medium text-secondary-500">{tProp('check_in')}</p>
                <input
                  type="date"
                  value={checkIn || ''}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="w-full text-sm text-secondary-900 bg-transparent border-none outline-none cursor-pointer"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>
          </div>

          {/* Check-out */}
          <div className="flex-1 md:border-r border-warm-200">
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-warm-50 transition-colors">
              <Calendar className="h-5 w-5 text-primary-600 shrink-0" />
              <div className="flex-1">
                <p className="text-xs font-medium text-secondary-500">{tProp('check_out')}</p>
                <input
                  type="date"
                  value={checkOut || ''}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="w-full text-sm text-secondary-900 bg-transparent border-none outline-none cursor-pointer"
                  min={checkIn || new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>
          </div>

          {/* Guests */}
          <div ref={guestRef} className="relative flex-1">
            <button
              onClick={() => setShowGuestDropdown(!showGuestDropdown)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-warm-50 transition-colors text-left"
            >
              <Users className="h-5 w-5 text-primary-600 shrink-0" />
              <div>
                <p className="text-xs font-medium text-secondary-500">{tCommon('guests')}</p>
                <p className="text-sm text-secondary-900 font-medium">
                  {totalGuests} {tCommon('guests')}
                </p>
              </div>
              <ChevronDown className={cn('h-4 w-4 text-secondary-400 ml-auto transition-transform', showGuestDropdown && 'rotate-180')} />
            </button>
            {showGuestDropdown && (
              <div className="absolute right-0 top-full mt-1 w-64 bg-white rounded-xl shadow-modal border border-warm-200 p-4 z-50 animate-scale-in">
                {/* Adults */}
                <GuestCounter
                  label={tCommon('guests')}
                  value={guests.adults}
                  min={1}
                  onChange={(v) => setGuests({ adults: v })}
                />
                {/* Children */}
                <GuestCounter
                  label={tProp('check_in') === 'Check-in' ? 'Children' : 'Cocuk'}
                  value={guests.children}
                  min={0}
                  onChange={(v) => setGuests({ children: v })}
                />
                {/* Infants */}
                <GuestCounter
                  label={tProp('check_in') === 'Check-in' ? 'Infants' : 'Bebek'}
                  value={guests.infants}
                  min={0}
                  onChange={(v) => setGuests({ infants: v })}
                />
              </div>
            )}
          </div>

          {/* Search button */}
          <button
            onClick={handleSearch}
            className="bg-primary-600 hover:bg-primary-700 text-white rounded-xl p-3 md:ml-2 transition-colors flex items-center justify-center gap-2"
          >
            <Search className="h-5 w-5" />
            <span className="md:hidden font-medium">{tCommon('search')}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function GuestCounter({
  label,
  value,
  min = 0,
  onChange,
}: {
  label: string;
  value: number;
  min?: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-secondary-700">{label}</span>
      <div className="flex items-center gap-3">
        <button
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          className="w-8 h-8 flex items-center justify-center rounded-full border border-warm-300 text-secondary-600 hover:border-secondary-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          -
        </button>
        <span className="text-sm font-medium w-4 text-center">{value}</span>
        <button
          onClick={() => onChange(value + 1)}
          className="w-8 h-8 flex items-center justify-center rounded-full border border-warm-300 text-secondary-600 hover:border-secondary-500 transition-colors"
        >
          +
        </button>
      </div>
    </div>
  );
}
