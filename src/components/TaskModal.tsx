import { useState, useEffect } from 'react';
import { X, Calendar, Flag, MessageSquare, Send, Clock, Activity, Trash2 } from 'lucide-react';
import { Task, Comment } from '../types';
import { commentService } from '../services/commentService';
import { format } from 'date-fns';

interface TaskModalProps {
  task: Task;
  onClose: () => void;
  onUpdate: (id: string, data: any) => void;
  onDelete: (id: string) => void;
}

export default function TaskModal({ task, onClose, onUpdate, onDelete }: TaskModalProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState(task);
  const [activeTab, setActiveTab] = useState<'details' | 'comments' | 'activity'>('details');

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const response = await commentService.getComments(task._id);
      if (response.success) {
        setComments(response.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch comments');
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      const response = await commentService.createComment({
        content: newComment,
        taskId: task._id,
      });
      if (response.success) {
        setComments((prev) => [response.data as Comment, ...prev]);
        setNewComment('');
      }
    } catch (err) {
      console.error('Failed to add comment');
    }
  };

  const handleSave = () => {
    onUpdate(task._id, editedTask);
    setIsEditing(false);
  };

  const priorityColors = {
    low: 'bg-slate-100 text-slate-600',
    medium: 'bg-amber-100 text-amber-700',
    high: 'bg-orange-100 text-orange-700',
    urgent: 'bg-red-100 text-red-700',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            {isEditing ? (
              <input
                type="text"
                value={editedTask.title}
                onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
                className="text-lg font-semibold text-slate-800 border border-slate-300 rounded-lg px-3 py-1 w-full"
              />
            ) : (
              <h2 className="text-lg font-semibold text-slate-800">{task.title}</h2>
            )}
          </div>
          <div className="flex items-center gap-2">
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="text-sm text-blue-600 hover:text-blue-700 px-3 py-1.5 rounded-lg hover:bg-blue-50"
              >
                Edit
              </button>
            )}
            {isEditing && (
              <button
                onClick={handleSave}
                className="text-sm bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700"
              >
                Save
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-100">
          {(['details', 'comments', 'activity'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 text-sm font-medium capitalize transition-colors ${
                activeTab === tab
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto max-h-[60vh]">
          {activeTab === 'details' && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Description</label>
                {isEditing ? (
                  <textarea
                    value={editedTask.description || ''}
                    onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
                    className="w-full mt-1 p-3 border border-slate-300 rounded-lg text-sm resize-none"
                    rows={4}
                  />
                ) : (
                  <p className="mt-1 text-sm text-slate-700">{task.description || 'No description'}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Priority</label>
                  <div className="mt-1">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${priorityColors[task.priority]}`}>
                      <Flag size={10} className="inline mr-1" />
                      {task.priority}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Status</label>
                  <div className="mt-1">
                    <span className="text-xs px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 font-medium capitalize">
                      {task.status.replace('-', ' ')}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Due Date</label>
                <div className="flex items-center gap-2 mt-1 text-sm text-slate-700">
                  <Calendar size={14} />
                  {task.dueDate ? format(new Date(task.dueDate), 'PPP') : 'No due date'}
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Assignees</label>
                <div className="flex items-center gap-2 mt-1">
                  {task.assignees?.map((user, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 bg-slate-100 rounded-full px-3 py-1">
                      <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-xs font-medium text-blue-700">
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-xs text-slate-700">{user.name}</span>
                    </div>
                  )) || <span className="text-sm text-slate-500">No assignees</span>}
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Labels</label>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  {task.labels?.map((label, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-2.5 py-1 rounded-full font-medium"
                      style={{ backgroundColor: label.color + '20', color: label.color }}
                    >
                      {label.name}
                    </span>
                  )) || <span className="text-sm text-slate-500">No labels</span>}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'comments' && (
            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                />
                <button
                  onClick={handleAddComment}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Send size={16} />
                </button>
              </div>

              <div className="space-y-3">
                {comments.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">
                    <MessageSquare size={32} className="mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No comments yet</p>
                  </div>
                ) : (
                  comments.map((comment) => (
                    <div key={comment._id} className="flex gap-3 p-3 bg-slate-50 rounded-lg">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-sm font-medium text-blue-700 shrink-0">
                        {comment.author?.name?.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{comment.author?.name}</span>
                          <span className="text-xs text-slate-500">
                            {format(new Date(comment.createdAt), 'MMM d, h:mm a')}
                          </span>
                          {comment.isEdited && (
                            <span className="text-xs text-slate-400">(edited)</span>
                          )}
                        </div>
                        <p className="text-sm text-slate-700 mt-1">{comment.content}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="space-y-3">
              {task.activityLog?.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  <Activity size={32} className="mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No activity yet</p>
                </div>
              ) : (
                task.activityLog?.map((log, idx) => (
                  <div key={idx} className="flex gap-3 p-3 bg-slate-50 rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center shrink-0">
                      <Clock size={14} className="text-slate-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-700">{log.details}</p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {format(new Date(log.timestamp), 'MMM d, h:mm a')}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-5 border-t border-slate-100">
          <div className="text-xs text-slate-500">
            Created {format(new Date(task.createdAt), 'MMM d, yyyy')}
          </div>
          <button
            onClick={() => {
              onDelete(task._id);
              onClose();
            }}
            className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700 px-4 py-2 rounded-lg hover:bg-red-50 transition-colors"
          >
            <Trash2 size={14} />
            Delete Task
          </button>
        </div>
      </div>
    </div>
  );
}
