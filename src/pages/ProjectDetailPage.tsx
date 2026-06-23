import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Plus,
  ArrowLeft,
  Trash2,
  Edit3,
  MoreHorizontal,
  Palette,
  X,
  Check,
  UserPlus,
  Shield,
  Crown,
} from 'lucide-react';
import { Project, Board } from '../types';
import { projectService } from '../services/projectService';
import { boardService } from '../services/boardService';
import KanbanBoard from '../components/KanbanBoard';
import InviteMemberModal from '../components/InviteMemberModal';
import CreateBoardModal from '../components/CreateBoardModal';
import { useAuth } from '../context/AuthContext';

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [boards, setBoards] = useState<Board[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [isCreateBoardOpen, setIsCreateBoardOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'boards' | 'members'>('boards');

  const fetchProject = async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      const [projectRes, boardsRes] = await Promise.all([
        projectService.getProject(id),
        boardService.getBoards(id),
      ]);
      if (projectRes.success) {
        setProject(projectRes.data as Project);
        setEditedName((projectRes.data as Project).name);
        setEditedDescription((projectRes.data as Project).description || '');
      }
      if (boardsRes.success) {
        setBoards(boardsRes.data || []);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load project');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProject();
  }, [id]);

  const handleUpdateProject = async () => {
    if (!id) return;
    try {
      const response = await projectService.updateProject(id, {
        name: editedName,
        description: editedDescription,
      });
      if (response.success) {
        setProject(response.data as Project);
        setIsEditing(false);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update project');
    }
  };

  const handleDeleteProject = async () => {
    if (!id || !confirm('Are you sure you want to delete this project?')) return;
    try {
      await projectService.deleteProject(id);
      navigate('/projects');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete project');
    }
  };

  const handleInvite = async (data: { email: string; role: string }) => {
    if (!id) return;
    const response = await projectService.inviteMember(id, data);
    if (response.success) {
      setProject(response.data as Project);
    }
  };

  const handleCreateBoard = async (data: { name: string; description?: string; columns?: any[] }) => {
    if (!id) return;
    const response = await boardService.createBoard({ ...data, projectId: id });
    if (response.success) {
      setBoards((prev) => [...prev, response.data as Board]);
    }
  };

  const handleBoardUpdate = async (boardId: string, data: any) => {
    const response = await boardService.updateBoard(boardId, data);
    if (response.success) {
      setBoards((prev) =>
        prev.map((b) => (b._id === boardId ? { ...b, ...(response.data as Board) } : b))
      );
    }
  };

  const handleBoardDelete = async (boardId: string) => {
    if (!confirm('Are you sure you want to delete this board?')) return;
    await boardService.deleteBoard(boardId);
    setBoards((prev) => prev.filter((b) => b._id !== boardId));
  };

  const handleTaskCreate = async (data: any) => {
    const { taskService } = await import('../services/taskService');
    const response = await taskService.createTask(data);
    if (response.success) {
      fetchProject();
    }
  };

  const handleTaskUpdate = async (taskId: string, data: any) => {
    const { taskService } = await import('../services/taskService');
    const response = await taskService.updateTask(taskId, data);
    if (response.success) {
      fetchProject();
    }
  };

  const handleTaskDelete = async (taskId: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    const { taskService } = await import('../services/taskService');
    await taskService.deleteTask(taskId);
    fetchProject();
  };

  const handleTaskMove = async (taskId: string, column: string, order: number) => {
    const { taskService } = await import('../services/taskService');
    await taskService.moveTask(taskId, { column, order });
    fetchProject();
  };

  const userRole = project?.members?.find((m) => m.user._id === user?._id)?.role;
  const isOwner = userRole === 'owner';
  const isAdmin = userRole === 'admin';
  const canManage = isOwner || isAdmin;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{error || 'Project not found'}</p>
        <button
          onClick={() => navigate('/projects')}
          className="mt-4 text-blue-600 hover:text-blue-700"
        >
          Back to Projects
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/projects')}
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-semibold"
              style={{ backgroundColor: project.color }}
            >
              {project.name.charAt(0).toUpperCase()}
            </div>
            <div>
              {isEditing ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm font-semibold"
                  />
                  <button onClick={handleUpdateProject} className="p-1.5 bg-blue-600 text-white rounded-lg">
                    <Check size={14} />
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setEditedName(project.name);
                    }}
                    className="p-1.5 rounded-lg hover:bg-slate-100"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <h1 className="text-xl font-bold text-slate-900">{project.name}</h1>
              )}
              <p className="text-sm text-slate-500">{project.description}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {canManage && (
            <button
              onClick={() => setIsInviteOpen(true)}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <UserPlus size={16} />
              Invite
            </button>
          )}
          <div className="relative">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <MoreHorizontal size={18} />
            </button>
            {showSettings && (
              <div className="absolute right-0 top-10 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-10">
                <button
                  onClick={() => { setIsEditing(true); setShowSettings(false); }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-slate-50"
                >
                  <Edit3 size={14} />
                  Edit Project
                </button>
                {isOwner && (
                  <button
                    onClick={() => { handleDeleteProject(); setShowSettings(false); }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <Trash2 size={14} />
                    Delete Project
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('boards')}
          className={`px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === 'boards'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-slate-600 hover:text-slate-800'
          }`}
        >
          Boards
        </button>
        <button
          onClick={() => setActiveTab('members')}
          className={`px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === 'members'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-slate-600 hover:text-slate-800'
          }`}
        >
          Members
        </button>
      </div>

      {activeTab === 'boards' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-800">Boards</h2>
            {canManage && (
              <button
                onClick={() => setIsCreateBoardOpen(true)}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Plus size={16} />
                Add Board
              </button>
            )}
          </div>

          {boards.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
              <Palette size={40} className="mx-auto mb-4 text-slate-300" />
              <h3 className="text-lg font-medium text-slate-700">No boards yet</h3>
              <p className="text-sm text-slate-500 mt-2">Create a board to start organizing tasks</p>
            </div>
          ) : (
            <div className="space-y-6">
              {boards.map((board) => (
                <KanbanBoard
                  key={board._id}
                  board={board}
                  tasks={(board.tasks as any[]) || []}
                  onTaskCreate={handleTaskCreate}
                  onTaskUpdate={handleTaskUpdate}
                  onTaskDelete={handleTaskDelete}
                  onTaskMove={handleTaskMove}
                  onBoardUpdate={handleBoardUpdate}
                  onBoardDelete={handleBoardDelete}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'members' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-800">Team Members</h2>
            {canManage && (
              <button
                onClick={() => setIsInviteOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
              >
                <UserPlus size={16} />
                Invite Member
              </button>
            )}
          </div>

          <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100">
            {project.members?.map((member) => (
              <div key={member.user._id} className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-sm font-medium text-blue-700">
                    {member.user.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-sm text-slate-800">{member.user.name}</p>
                    <p className="text-xs text-slate-500">{member.user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium ${
                    member.role === 'owner'
                      ? 'bg-amber-100 text-amber-700'
                      : member.role === 'admin'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    {member.role === 'owner' && <Crown size={12} />}
                    {member.role === 'admin' && <Shield size={12} />}
                    {member.role}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {isInviteOpen && (
        <InviteMemberModal onClose={() => setIsInviteOpen(false)} onInvite={handleInvite} />
      )}

      {isCreateBoardOpen && (
        <CreateBoardModal onClose={() => setIsCreateBoardOpen(false)} onCreate={handleCreateBoard} />
      )}
    </div>
  );
}
