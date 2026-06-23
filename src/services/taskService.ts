import api from './api';
import { ApiResponse, Task } from '../types';

export const taskService = {
  createTask: async (data: {
    title: string;
    description?: string;
    boardId: string;
    projectId: string;
    column?: string;
    priority?: string;
    dueDate?: string;
    assignees?: string[];
    labels?: any[];
  }): Promise<ApiResponse<Task>> => {
    const response = await api.post('/tasks', data);
    return response.data;
  },

  getTasks: async (boardId: string): Promise<ApiResponse<Task[]>> => {
    const response = await api.get(`/tasks/board/${boardId}`);
    return response.data;
  },

  getTasksDueToday: async (): Promise<ApiResponse<Task[]>> => {
    const response = await api.get('/tasks/due-today');
    return response.data;
  },

  getTask: async (id: string): Promise<ApiResponse<Task>> => {
    const response = await api.get(`/tasks/${id}`);
    return response.data;
  },

  updateTask: async (id: string, data: Partial<Task>): Promise<ApiResponse<Task>> => {
    const response = await api.put(`/tasks/${id}`, data);
    return response.data;
  },

  deleteTask: async (id: string): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  },

  moveTask: async (id: string, data: { column: string; order?: number }): Promise<ApiResponse<Task>> => {
    const response = await api.put(`/tasks/${id}/move`, data);
    return response.data;
  },
};
