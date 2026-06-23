import { useState, useEffect, useCallback } from 'react';
import { notificationService } from '../services/notificationService';
import { Notification } from '../types';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await notificationService.getNotifications();
      if (response.success) {
        setNotifications(response.data || []);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch notifications');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const markAsRead = async (id: string) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to mark as read');
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to mark all as read');
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return { notifications, isLoading, error, unreadCount, fetchNotifications, markAsRead, markAllAsRead };
};
