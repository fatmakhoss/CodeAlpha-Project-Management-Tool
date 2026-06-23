import api from './api';
import { ApiResponse, User } from '../types';

export const userService = {
  getUsers: async (): Promise<ApiResponse<User[]>> => {
    const response = await api.get('/users');
    return response.data;
  },

  getUserById: async (id: string): Promise<ApiResponse<User>> => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  searchUsers: async (query: string): Promise<ApiResponse<User[]>> => {
    const response = await api.get(`/users/search?q=${encodeURIComponent(query)}`);
    return response.data;
  },
};
