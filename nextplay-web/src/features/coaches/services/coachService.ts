import client from '../../../shared/api/client';
import type { PaginatedResponse, SingleResponse, QueryParams } from '../../../shared/types';
import type { Coach, CoachFormData } from '../types';

export const coachService = {
  list: async (params?: QueryParams) => {
    const response = await client.get<PaginatedResponse<Coach>>('/coaches', { params });
    return response.data;
  },

  get: async (id: number) => {
    const response = await client.get<SingleResponse<Coach>>(`/coaches/${id}`);
    return response.data;
  },

  create: async (data: CoachFormData) => {
    const response = await client.post<SingleResponse<Coach>>('/coaches', data);
    return response.data;
  },

  update: async (id: number, data: Partial<CoachFormData>) => {
    const response = await client.put<SingleResponse<Coach>>(`/coaches/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    await client.delete(`/coaches/${id}`);
  },
};
