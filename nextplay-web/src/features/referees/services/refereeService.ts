import client from '../../../shared/api/client';
import type { PaginatedResponse, SingleResponse, QueryParams } from '../../../shared/types';
import type { Referee, RefereeFormData } from '../types';

export const refereeService = {
  list: async (params?: QueryParams) => {
    const response = await client.get<PaginatedResponse<Referee>>('/referees', { params });
    return response.data;
  },

  get: async (id: number) => {
    const response = await client.get<SingleResponse<Referee>>(`/referees/${id}`);
    return response.data;
  },

  create: async (data: RefereeFormData) => {
    const response = await client.post<SingleResponse<Referee>>('/referees', data);
    return response.data;
  },

  update: async (id: number, data: Partial<RefereeFormData>) => {
    const response = await client.put<SingleResponse<Referee>>(`/referees/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    await client.delete(`/referees/${id}`);
  },
};
