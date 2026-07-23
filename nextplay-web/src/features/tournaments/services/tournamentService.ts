import client from '../../../shared/api/client';
import type { PaginatedResponse, SingleResponse, QueryParams } from '../../../shared/types';
import type { Tournament, TournamentFormData } from '../types';

export const tournamentService = {
  list: async (params?: QueryParams) => {
    const response = await client.get<PaginatedResponse<Tournament>>('/tournaments', { params });
    return response.data;
  },

  get: async (id: number) => {
    const response = await client.get<SingleResponse<Tournament>>(`/tournaments/${id}`);
    return response.data;
  },

  create: async (data: TournamentFormData) => {
    const response = await client.post<SingleResponse<Tournament>>('/tournaments', data);
    return response.data;
  },

  update: async (id: number, data: Partial<TournamentFormData>) => {
    const response = await client.put<SingleResponse<Tournament>>(`/tournaments/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    await client.delete(`/tournaments/${id}`);
  },
};
