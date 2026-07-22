import client from '../../../shared/api/client';
import type { LoginRequest, LoginResponse, User } from '../types';

export const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
  const response = await client.post<LoginResponse>('/login', credentials);
  return response.data;
};

export const logout = async (): Promise<void> => {
  await client.post('/logout');
};

export const me = async (): Promise<User> => {
  const response = await client.get<{ user: User }>('/me');
  return response.data.user;
};
