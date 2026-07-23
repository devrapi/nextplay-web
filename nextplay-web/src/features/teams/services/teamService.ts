import client from '../../../shared/api/client';
import type { PaginatedResponse, SingleResponse, QueryParams } from '../../../shared/types';
import type { Team, TeamFormData, TeamPlayer } from '../types';
import type { Coach } from '../../coaches/types';

export const teamService = {
  list: async (params?: QueryParams) => {
    const response = await client.get<PaginatedResponse<Team>>('/teams', { params });
    return response.data;
  },

  get: async (id: number, params?: Record<string, string>) => {
    const response = await client.get<SingleResponse<Team>>(`/teams/${id}`, { params });
    return response.data;
  },

  create: async (data: TeamFormData) => {
    const response = await client.post<SingleResponse<Team>>('/teams', data);
    return response.data;
  },

  update: async (id: number, data: Partial<TeamFormData>) => {
    const response = await client.put<SingleResponse<Team>>(`/teams/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    await client.delete(`/teams/${id}`);
  },

  availableCoaches: async (teamId: number) => {
    const response = await client.get<PaginatedResponse<Coach>>(`/teams/${teamId}/available-coaches`);
    return response.data;
  },

  availablePlayers: async (teamId: number) => {
    const response = await client.get<PaginatedResponse<TeamPlayer>>(`/teams/${teamId}/available-players`);
    return response.data;
  },

  assignCoach: async (teamId: number, data: { coach_id: number }) => {
    const response = await client.post<SingleResponse<Team>>(`/teams/${teamId}/assign-coach`, data);
    return response.data;
  },

  removeCoach: async (teamId: number) => {
    await client.delete(`/teams/${teamId}/remove-coach`);
  },

  assignPlayers: async (teamId: number, data: { player_ids: number[] }) => {
    const response = await client.post<SingleResponse<Team>>(`/teams/${teamId}/assign-players`, data);
    return response.data;
  },

  removePlayer: async (teamId: number, playerId: number) => {
    await client.delete(`/teams/${teamId}/players/${playerId}`);
  },
};
