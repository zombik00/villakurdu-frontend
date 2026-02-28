import api from '@/services/api';
import type { PaginatedResponse } from '@/types';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface FavoriteItem {
  id: string;
  property: {
    id: string;
    slug: string;
    title: Record<string, string>;
    city: { name: Record<string, string>; slug: string };
    images: Array<{ image_url: string; is_cover: boolean }>;
    base_price: number;
    currency: string;
    average_rating?: number;
    review_count: number;
  };
  created_at: string;
}

/* ------------------------------------------------------------------ */
/*  List favorites                                                     */
/* ------------------------------------------------------------------ */

export async function getFavorites(
  params?: { page?: number; page_size?: number }
): Promise<PaginatedResponse<FavoriteItem>> {
  const query: Record<string, number> = {};
  if (params?.page) query.page = params.page;
  if (params?.page_size) query.page_size = params.page_size;

  const { data } = await api.get<PaginatedResponse<FavoriteItem>>(
    '/favorites/',
    { params: query }
  );
  return data;
}

/* ------------------------------------------------------------------ */
/*  Toggle favorite                                                    */
/* ------------------------------------------------------------------ */

export async function toggleFavorite(
  propertyId: string
): Promise<{ favorited: boolean }> {
  const { data } = await api.post<{ favorited: boolean }>(
    '/favorites/toggle/',
    { property_id: propertyId }
  );
  return data;
}

/* ------------------------------------------------------------------ */
/*  Check if favorited                                                 */
/* ------------------------------------------------------------------ */

export async function checkFavorite(
  propertyId: string
): Promise<{ is_favorited: boolean }> {
  const { data } = await api.get<{ is_favorited: boolean }>(
    '/favorites/check/',
    { params: { property_id: propertyId } }
  );
  return data;
}
