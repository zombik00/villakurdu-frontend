import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SearchFilters } from '@/types';

interface SearchState extends SearchFilters {
  setLocation: (location: string) => void;
  setCheckIn: (date: string) => void;
  setCheckOut: (date: string) => void;
  setGuests: (guests: Partial<SearchFilters['guests']>) => void;
  setPriceRange: (range: Partial<SearchFilters['priceRange']>) => void;
  setPropertyType: (types: string[]) => void;
  setBedrooms: (count: number | undefined) => void;
  setBathrooms: (count: number | undefined) => void;
  setAmenities: (amenities: string[]) => void;
  setSortBy: (sort: SearchFilters['sortBy']) => void;
  resetFilters: () => void;
}

const defaultFilters: SearchFilters = {
  location: undefined,
  checkIn: undefined,
  checkOut: undefined,
  guests: {
    adults: 1,
    children: 0,
    infants: 0,
  },
  priceRange: {
    min: undefined,
    max: undefined,
  },
  propertyType: undefined,
  bedrooms: undefined,
  bathrooms: undefined,
  amenities: undefined,
  sortBy: undefined,
};

export const useSearchStore = create<SearchState>()(
  persist(
    (set) => ({
      ...defaultFilters,

      setLocation: (location) => set({ location }),
      setCheckIn: (checkIn) => set({ checkIn }),
      setCheckOut: (checkOut) => set({ checkOut }),

      setGuests: (partial) =>
        set((state) => ({
          guests: { ...state.guests, ...partial },
        })),

      setPriceRange: (partial) =>
        set((state) => ({
          priceRange: { ...state.priceRange, ...partial },
        })),

      setPropertyType: (propertyType) => set({ propertyType }),
      setBedrooms: (bedrooms) => set({ bedrooms }),
      setBathrooms: (bathrooms) => set({ bathrooms }),
      setAmenities: (amenities) => set({ amenities }),
      setSortBy: (sortBy) => set({ sortBy }),

      resetFilters: () => set(defaultFilters),
    }),
    {
      name: 'villakurdu-search',
    }
  )
);
