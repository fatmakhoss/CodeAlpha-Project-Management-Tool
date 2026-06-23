import api from './api';
import { ApiResponse, User } from '../types';

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

interface AuthResponse {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
  token: string;
}

export const authService = {
  login: async (data: LoginData): Promise<ApiResponse<AuthResponse>> => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  register: async (data: RegisterData): Promise<ApiResponse<AuthResponse>> => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  getMe: async (): Promise<ApiResponse<User>> => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  updateProfile: async (data: Partial<User>): Promise<ApiResponse<User>> => {
    const response = await api.put('/auth/profile', data);
    return response.data;
  },
};
