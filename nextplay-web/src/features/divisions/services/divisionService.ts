import client from '../../../shared/api/client';
import type { PaginatedResponse, SingleResponse, QueryParams } from '../../../shared/types';
import type { Division, DivisionFormData } from '../types';
import type { Team } from '../../teams/types';

export const divisionService = {
  list: async (params?: QueryParams) => {
    const response = await client.get<PaginatedResponse<Division>>('/divisions', { params });
    return response.data;
  },

  get: async (id: number, params?: Record<string, string>) => {
    const response = await client.get<SingleResponse<Division>>(`/divisions/${id}`, { params });
    return response.data;
  },

  create: async (data: DivisionFormData) => {
    const response = await client.post<SingleResponse<Division>>('/divisions', data);
    return response.data;
  },

  update: async (id: number, data: Partial<DivisionFormData>) => {
    const response = await client.put<SingleResponse<Division>>(`/divisions/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    await client.delete(`/divisions/${id}`);
  },

  availableTeams: async (divisionId: number) => {
    const response = await client.get<PaginatedResponse<Team>>(`/divisions/${divisionId}/available-teams`);
    return response.data;
  },

  registerTeams: async (divisionId: number, data: { team_ids: number[] }) => {
    const response = await client.post<SingleResponse<Division>>(`/divisions/${divisionId}/register-teams`, data);
    return response.data;
  },

  removeTeam: async (divisionId: number, teamId: number) => {
    await client.delete(`/divisions/${divisionId}/teams/${teamId}`);
  },
};
