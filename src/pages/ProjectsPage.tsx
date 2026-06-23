import { useState } from 'react';
import { Plus, Search, FolderKanban } from 'lucide-react';
import { useProjects } from '../hooks/useProjects';
import ProjectCard from '../components/ProjectCard';
import CreateProjectModal from '../components/CreateProjectModal';

export default function ProjectsPage() {
  const { projects, isLoading, createProject } = useProjects();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProjects = projects.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Projects</h1>
          <p className="text-sm text-slate-600 mt-1">Manage all your projects</p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <Plus size={16} />
          New Project
        </button>
      </div>

      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search projects..."
          className="w-full max-w-md pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-slate-200 p-5 animate-pulse">
              <div className="h-10 w-10 bg-slate-200 rounded-lg mb-3" />
              <div className="h-4 bg-slate-200 rounded w-3/4 mb-2" />
              <div className="h-3 bg-slate-200 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <FolderKanban size={40} className="mx-auto mb-4 text-slate-300" />
          <h3 className="text-lg font-medium text-slate-700">
            {searchQuery ? 'No projects found' : 'No projects yet'}
          </h3>
          <p className="text-sm text-slate-500 mt-2">
            {searchQuery ? 'Try a different search term' : 'Create your first project to get started'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProjects.map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))}
        </div>
      )}

      {isCreateModalOpen && (
        <CreateProjectModal
          onClose={() => setIsCreateModalOpen(false)}
          onCreate={createProject}
        />
      )}
    </div>
  );
}
