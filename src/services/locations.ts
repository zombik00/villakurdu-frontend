import api from '@/services/api';
import type { City, District } from '@/types';

/* ------------------------------------------------------------------ */
/*  List cities                                                        */
/* ------------------------------------------------------------------ */

export async function getCities(): Promise<City[]> {
  const { data } = await api.get<City[]>('/locations/cities/');
  return data;
}

/* ------------------------------------------------------------------ */
/*  Featured cities                                                    */
/* ------------------------------------------------------------------ */

export async function getFeaturedCities(): Promise<City[]> {
  const { data } = await api.get<City[]>('/locations/cities/featured/');
  return data;
}

/* ------------------------------------------------------------------ */
/*  City detail                                                        */
/* ------------------------------------------------------------------ */

export async function getCity(slug: string): Promise<City> {
  const { data } = await api.get<City>(`/locations/cities/${slug}/`);
  return data;
}

/* ------------------------------------------------------------------ */
/*  Districts for a city                                               */
/* ------------------------------------------------------------------ */

export async function getDistricts(citySlug: string): Promise<District[]> {
  const { data } = await api.get<District[]>(
    `/locations/cities/${citySlug}/districts/`
  );
  return data;
}
