import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  FolderKanban,
  Clock,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Users,
  Crown,
} from 'lucide-react';
import { useProjects } from '../hooks/useProjects';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/userService';
import { taskService } from '../services/taskService';
import { User } from '../types';
import ProjectCard from '../components/ProjectCard';
import CreateProjectModal from '../components/CreateProjectModal';

type DashboardRole = 'user' | 'host' | 'admin';

const getDashboardRole = (role?: string): DashboardRole => {
  if (role === 'admin' || role === 'host') return role;
  return 'user';
};

export default function DashboardPage() {
  const { user } = useAuth();
  const { projects, isLoading, createProject } = useProjects();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [tasksDueToday, setTasksDueToday] = useState(0);

  const role = getDashboardRole(user?.role);

  const totalProjects = projects.length;
  const activeProjects = projects.filter((p) => !p.isArchived).length;
  const ownedProjects = projects.filter((p) => p.owner?._id === user?._id).length;
  const teamProjects = projects.filter((p) =>
    p.members?.some((member) => member.user?._id === user?._id)
  ).length;

  useEffect(() => {
    if (role !== 'admin') return;

    const fetchUsers = async () => {
      try {
        const response = await userService.getUsers();
        if (response.success) {
          setUsers(response.data || []);
        }
      } catch {
        setUsers([]);
      }
    };

    fetchUsers();
  }, [role]);

  useEffect(() => {
    const fetchTasksDueToday = async () => {
      try {
        const response = await taskService.getTasksDueToday();
        if (response.success) {
          setTasksDueToday(response.data?.length || 0);
        }
      } catch {
        setTasksDueToday(0);
      }
    };

    fetchTasksDueToday();
  }, []);

  const roleConfig = {
    user: {
      title: 'User Dashboard',
      subtitle: 'Track your assigned projects and daily work',
      icon: FolderKanban,
      actionLabel: 'New Project',
      canCreate: true,
    },
    host: {
      title: 'Host Dashboard',
      subtitle: 'Manage the projects and teams you coordinate',
      icon: Crown,
      actionLabel: 'Host Project',
      canCreate: true,
    },
    admin: {
      title: 'Admin Dashboard',
      subtitle: 'Monitor users, projects, and workspace activity',
      icon: ShieldCheck,
      actionLabel: 'New Project',
      canCreate: true,
    },
  }[role];

  const RoleIcon = roleConfig.icon;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
            <RoleIcon size={22} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{roleConfig.title}</h1>
            <p className="text-sm text-slate-600 mt-1">{roleConfig.subtitle}</p>
          </div>
        </div>
        {roleConfig.canCreate && (
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            <Plus size={16} />
            {roleConfig.actionLabel}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <FolderKanban size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{totalProjects}</p>
              <p className="text-sm text-slate-600">Total Projects</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <CheckCircle2 size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{activeProjects}</p>
              <p className="text-sm text-slate-600">Active Projects</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-violet-50 rounded-lg flex items-center justify-center">
              {role === 'admin' ? (
                <Users size={20} className="text-violet-600" />
              ) : (
                <Crown size={20} className="text-violet-600" />
              )}
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">
                {role === 'admin' ? users.length : role === 'host' ? teamProjects : ownedProjects}
              </p>
              <p className="text-sm text-slate-600">
                {role === 'admin' ? 'Registered Users' : role === 'host' ? 'Team Projects' : 'Owned Projects'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
              <Clock size={20} className="text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{tasksDueToday}</p>
              <p className="text-sm text-slate-600">Tasks Due Today</p>
            </div>
          </div>
        </div>
      </div>

      {role === 'admin' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {(['user', 'host', 'admin'] as const).map((item) => (
            <div key={item} className="bg-white rounded-xl border border-slate-200 p-5">
              <p className="text-sm font-medium text-slate-600 capitalize">{item}s</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">
                {users.filter((u) => u.role === item).length}
              </p>
            </div>
          ))}
        </div>
      )}

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-800">
            {role === 'admin' ? 'All Accessible Projects' : role === 'host' ? 'Hosted Projects' : 'Your Projects'}
          </h2>
          <Link to="/projects" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            View All
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl border border-slate-200 p-5 animate-pulse">
                <div className="h-10 w-10 bg-slate-200 rounded-lg mb-3" />
                <div className="h-4 bg-slate-200 rounded w-3/4 mb-2" />
                <div className="h-3 bg-slate-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
            <AlertCircle size={40} className="mx-auto mb-4 text-slate-300" />
            <h3 className="text-lg font-medium text-slate-700 mb-2">No projects yet</h3>
            <p className="text-sm text-slate-500 mb-4">Create your first project to get started</p>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
            >
              <Plus size={16} />
              Create Project
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project) => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </div>
        )}
      </div>

      {isCreateModalOpen && (
        <CreateProjectModal
          onClose={() => setIsCreateModalOpen(false)}
          onCreate={createProject}
        />
      )}
    </div>
  );
}
