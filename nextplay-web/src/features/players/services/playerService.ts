import client from '../../../shared/api/client';
import type { PaginatedResponse, SingleResponse, QueryParams } from '../../../shared/types';
import type { Player, PlayerFormData } from '../types';

export const playerService = {
  list: async (params?: QueryParams) => {
    const response = await client.get<PaginatedResponse<Player>>('/players', { params });
    return response.data;
  },

  get: async (id: number) => {
    const response = await client.get<SingleResponse<Player>>(`/players/${id}`);
    return response.data;
  },

  create: async (data: PlayerFormData) => {
    const response = await client.post<SingleResponse<Player>>('/players', data);
    return response.data;
  },

  update: async (id: number, data: Partial<PlayerFormData>) => {
    const response = await client.put<SingleResponse<Player>>(`/players/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    await client.delete(`/players/${id}`);
  },
};
