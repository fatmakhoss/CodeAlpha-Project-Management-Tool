import { Link } from 'react-router-dom';
import { Users, Calendar, ArrowRight } from 'lucide-react';
import { Project } from '../types';
import { format } from 'date-fns';

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const memberCount = project.members?.length || 1;
  const boardCount = Array.isArray(project.boards) ? project.boards.length : 0;

  return (
    <Link
      to={`/projects/${project._id}`}
      className="block bg-white rounded-xl border border-slate-200 p-5 hover:shadow-lg hover:border-blue-200 transition-all duration-200 group"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-semibold"
            style={{ backgroundColor: project.color || '#3B82F6' }}
          >
            {project.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">
              {project.name}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">{boardCount} boards</p>
          </div>
        </div>
        <ArrowRight
          size={18}
          className="text-slate-400 group-hover:text-blue-600 transition-colors opacity-0 group-hover:opacity-100"
        />
      </div>

      {project.description && (
        <p className="text-sm text-slate-600 mb-4 line-clamp-2">{project.description}</p>
      )}

      <div className="flex items-center gap-4 text-xs text-slate-500">
        <div className="flex items-center gap-1">
          <Users size={14} />
          <span>{memberCount} members</span>
        </div>
        <div className="flex items-center gap-1">
          <Calendar size={14} />
          <span>{format(new Date(project.createdAt), 'MMM d')}</span>
        </div>
      </div>

      {/* Member avatars */}
      <div className="flex -space-x-2 mt-4">
        {project.members?.slice(0, 4).map((member, idx) => (
          <div
            key={idx}
            className="w-7 h-7 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center text-xs font-medium text-blue-700"
            title={member.user?.name}
          >
            {member.user?.name?.charAt(0).toUpperCase()}
          </div>
        ))}
        {memberCount > 4 && (
          <div className="w-7 h-7 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-xs font-medium text-slate-600">
            +{memberCount - 4}
          </div>
        )}
      </div>
    </Link>
  );
}
