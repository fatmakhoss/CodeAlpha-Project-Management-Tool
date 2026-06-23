import { useState, useEffect, useCallback } from 'react';
import { boardService } from '../services/boardService';
import { Board } from '../types';

export const useBoards = (projectId: string) => {
  const [boards, setBoards] = useState<Board[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBoards = useCallback(async () => {
    if (!projectId) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await boardService.getBoards(projectId);
      if (response.success) {
        setBoards(response.data || []);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch boards');
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchBoards();
  }, [fetchBoards]);

  const createBoard = async (data: { name: string; description?: string; columns?: any[] }) => {
    try {
      const response = await boardService.createBoard({ ...data, projectId });
      if (response.success) {
        setBoards((prev) => [...prev, response.data as Board]);
        return response.data;
      }
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to create board');
    }
  };

  const deleteBoard = async (id: string) => {
    try {
      await boardService.deleteBoard(id);
      setBoards((prev) => prev.filter((b) => b._id !== id));
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to delete board');
    }
  };

  return { boards, isLoading, error, fetchBoards, createBoard, deleteBoard };
};
