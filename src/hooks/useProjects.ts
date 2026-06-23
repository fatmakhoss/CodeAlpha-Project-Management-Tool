import { useState, useEffect, useCallback } from 'react';
import { projectService } from '../services/projectService';
import { Project } from '../types';

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await projectService.getProjects();
      if (response.success) {
        setProjects(response.data || []);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch projects');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const createProject = async (data: { name: string; description?: string; color?: string }) => {
    try {
      const response = await projectService.createProject(data);
      if (response.success) {
        setProjects((prev) => [response.data as Project, ...prev]);
        return response.data;
      }
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to create project');
    }
  };

  const deleteProject = async (id: string) => {
    try {
      await projectService.deleteProject(id);
      setProjects((prev) => prev.filter((p) => p._id !== id));
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to delete project');
    }
  };

  return { projects, isLoading, error, fetchProjects, createProject, deleteProject };
};
