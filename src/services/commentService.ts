import api from './api';
import { ApiResponse, Comment } from '../types';

export const commentService = {
  createComment: async (data: { content: string; taskId: string }): Promise<ApiResponse<Comment>> => {
    const response = await api.post('/comments', data);
    return response.data;
  },

  getComments: async (taskId: string): Promise<ApiResponse<Comment[]>> => {
    const response = await api.get(`/comments/task/${taskId}`);
    return response.data;
  },

  updateComment: async (id: string, data: { content: string }): Promise<ApiResponse<Comment>> => {
    const response = await api.put(`/comments/${id}`, data);
    return response.data;
  },

  deleteComment: async (id: string): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/comments/${id}`);
    return response.data;
  },
};
