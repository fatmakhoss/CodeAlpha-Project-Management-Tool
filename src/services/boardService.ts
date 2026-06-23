import api from './api';
import { ApiResponse, Board } from '../types';

export const boardService = {
  createBoard: async (data: { name: string; description?: string; projectId: string; columns?: any[] }): Promise<ApiResponse<Board>> => {
    const response = await api.post('/boards', data);
    return response.data;
  },

  getBoards: async (projectId: string): Promise<ApiResponse<Board[]>> => {
    const response = await api.get(`/boards/project/${projectId}`);
    return response.data;
  },

  getBoard: async (id: string): Promise<ApiResponse<Board>> => {
    const response = await api.get(`/boards/${id}`);
    return response.data;
  },

  updateBoard: async (id: string, data: Partial<Board>): Promise<ApiResponse<Board>> => {
    const response = await api.put(`/boards/${id}`, data);
    return response.data;
  },

  deleteBoard: async (id: string): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/boards/${id}`);
    return response.data;
  },
};
