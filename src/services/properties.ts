import api from '@/services/api';
import type { HostProperty, PaginatedResponse, Property } from '@/types';

/* ------------------------------------------------------------------ */
/*  List public properties (with search filters)                       */
/* ------------------------------------------------------------------ */

export interface PropertyListParams {
  page?: number;
  page_size?: number;
  city?: string;
  district?: string;
  property_type?: string;
  min_price?: number;
  max_price?: number;
  min_guests?: number;
  bedrooms?: number;
  bathrooms?: number;
  amenities?: string;
  ordering?: string;
  search?: string;
}

export async function getProperties(
  params?: PropertyListParams
): Promise<PaginatedResponse<Property>> {
  const query: Record<string, string | number> = {};
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        query[key] = value;
      }
    });
  }

  const { data } = await api.get<PaginatedResponse<Property>>(
    '/properties/',
    { params: query }
  );
  return data;
}

/* ------------------------------------------------------------------ */
/*  Get single property by slug                                        */
/* ------------------------------------------------------------------ */

export async function getProperty(slug: string): Promise<Property> {
  const { data } = await api.get<Property>(`/properties/${slug}/`);
  return data;
}

/* ------------------------------------------------------------------ */
/*  List host's own properties                                         */
/* ------------------------------------------------------------------ */

export interface HostPropertyListParams {
  page?: number;
  page_size?: number;
  status?: string;
}

export async function getMyProperties(
  params?: HostPropertyListParams
): Promise<PaginatedResponse<HostProperty>> {
  const query: Record<string, string | number> = {};
  if (params?.page) query.page = params.page;
  if (params?.page_size) query.page_size = params.page_size;
  if (params?.status) query.status = params.status;

  const { data } = await api.get<PaginatedResponse<HostProperty>>(
    '/properties/my/',
    { params: query }
  );
  return data;
}
