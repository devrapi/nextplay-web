import client from '../../../shared/api/client';
import type { PaginatedResponse, SingleResponse, QueryParams } from '../../../shared/types';
import type { Game, GameFormData } from '../types';

export const gameService = {
  list: async (params?: QueryParams) => {
    const response = await client.get<PaginatedResponse<Game>>('/games', { params });
    return response.data;
  },

  get: async (id: number) => {
    const response = await client.get<SingleResponse<Game>>(`/games/${id}`);
    return response.data;
  },

  create: async (data: GameFormData) => {
    const response = await client.post<SingleResponse<Game>>('/games', data);
    return response.data;
  },

  update: async (id: number, data: Partial<GameFormData>) => {
    const response = await client.put<SingleResponse<Game>>(`/games/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    await client.delete(`/games/${id}`);
  },
};
