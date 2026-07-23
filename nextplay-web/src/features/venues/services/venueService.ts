import client from '../../../shared/api/client';
import type { PaginatedResponse, SingleResponse, QueryParams } from '../../../shared/types';
import type { Venue, VenueFormData } from '../types';

export const venueService = {
  list: async (params?: QueryParams) => {
    const response = await client.get<PaginatedResponse<Venue>>('/venues', { params });
    return response.data;
  },

  get: async (id: number) => {
    const response = await client.get<SingleResponse<Venue>>(`/venues/${id}`);
    return response.data;
  },

  create: async (data: VenueFormData) => {
    const response = await client.post<SingleResponse<Venue>>('/venues', data);
    return response.data;
  },

  update: async (id: number, data: Partial<VenueFormData>) => {
    const response = await client.put<SingleResponse<Venue>>(`/venues/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    await client.delete(`/venues/${id}`);
  },
};
