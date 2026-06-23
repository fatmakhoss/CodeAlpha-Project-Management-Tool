import { useState, useEffect, useCallback } from 'react';
import { taskService } from '../services/taskService';
import { Task } from '../types';

export const useTasks = (boardId: string) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    if (!boardId) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await taskService.getTasks(boardId);
      if (response.success) {
        setTasks(response.data || []);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch tasks');
    } finally {
      setIsLoading(false);
    }
  }, [boardId]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const createTask = async (data: {
    title: string;
    description?: string;
    column?: string;
    priority?: string;
    dueDate?: string;
    assignees?: string[];
    labels?: any[];
  }) => {
    try {
      const projectId = tasks[0]?.project;
      const response = await taskService.createTask({
        ...data,
        boardId,
        projectId: projectId || '',
      });
      if (response.success) {
        setTasks((prev) => [...prev, response.data as Task]);
        return response.data;
      }
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to create task');
    }
  };

  const updateTask = async (id: string, data: Partial<Task>) => {
    try {
      const response = await taskService.updateTask(id, data);
      if (response.success) {
        setTasks((prev) =>
          prev.map((t) => (t._id === id ? { ...t, ...(response.data as Task) } : t))
        );
        return response.data;
      }
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to update task');
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await taskService.deleteTask(id);
      setTasks((prev) => prev.filter((t) => t._id !== id));
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to delete task');
    }
  };

  const moveTask = async (id: string, column: string, order?: number) => {
    try {
      const response = await taskService.moveTask(id, { column, order });
      if (response.success) {
        setTasks((prev) =>
          prev.map((t) => (t._id === id ? { ...t, ...(response.data as Task) } : t))
        );
        return response.data;
      }
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to move task');
    }
  };

  return { tasks, isLoading, error, fetchTasks, createTask, updateTask, deleteTask, moveTask };
};
