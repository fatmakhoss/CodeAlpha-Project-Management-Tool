import api from './api';
import { ApiResponse, Notification } from '../types';

export const notificationService = {
  getNotifications: async (): Promise<ApiResponse<Notification[]>> => {
    const response = await api.get('/notifications');
    return response.data;
  },

  markAsRead: async (id: string): Promise<ApiResponse<Notification>> => {
    const response = await api.put(`/notifications/${id}/read`);
    return response.data;
  },

  markAllAsRead: async (): Promise<ApiResponse<void>> => {
    const response = await api.put('/notifications/read-all');
    return response.data;
  },

  deleteNotification: async (id: string): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/notifications/${id}`);
    return response.data;
  },
};
