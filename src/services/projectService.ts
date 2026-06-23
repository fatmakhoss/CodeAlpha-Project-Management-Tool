import api from './api';
import { ApiResponse, Project } from '../types';

export const projectService = {
  createProject: async (data: { name: string; description?: string; color?: string }): Promise<ApiResponse<Project>> => {
    const response = await api.post('/projects', data);
    return response.data;
  },

  getProjects: async (): Promise<ApiResponse<Project[]>> => {
    const response = await api.get('/projects');
    return response.data;
  },

  getProject: async (id: string): Promise<ApiResponse<Project>> => {
    const response = await api.get(`/projects/${id}`);
    return response.data;
  },

  updateProject: async (id: string, data: Partial<Project>): Promise<ApiResponse<Project>> => {
    const response = await api.put(`/projects/${id}`, data);
    return response.data;
  },

  deleteProject: async (id: string): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/projects/${id}`);
    return response.data;
  },

  inviteMember: async (projectId: string, data: { email: string; role?: string }): Promise<ApiResponse<Project>> => {
    const response = await api.post(`/projects/${projectId}/invite`, data);
    return response.data;
  },

  removeMember: async (projectId: string, userId: string): Promise<ApiResponse<Project>> => {
    const response = await api.delete(`/projects/${projectId}/members/${userId}`);
    return response.data;
  },

  updateMemberRole: async (projectId: string, userId: string, role: string): Promise<ApiResponse<Project>> => {
    const response = await api.put(`/projects/${projectId}/members/${userId}/role`, { role });
    return response.data;
  },
};
