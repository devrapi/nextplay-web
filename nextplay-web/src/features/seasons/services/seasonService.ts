import client from '../../../shared/api/client';
import type { PaginatedResponse, SingleResponse, QueryParams } from '../../../shared/types';
import type { Season, SeasonFormData } from '../types';

export const seasonService = {
  list: async (params?: QueryParams) => {
    const response = await client.get<PaginatedResponse<Season>>('/seasons', { params });
    return response.data;
  },

  get: async (id: number) => {
    const response = await client.get<SingleResponse<Season>>(`/seasons/${id}`);
    return response.data;
  },

  create: async (data: SeasonFormData) => {
    const response = await client.post<SingleResponse<Season>>('/seasons', data);
    return response.data;
  },

  update: async (id: number, data: Partial<SeasonFormData>) => {
    const response = await client.put<SingleResponse<Season>>(`/seasons/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    await client.delete(`/seasons/${id}`);
  },
};
