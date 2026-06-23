import { useState } from 'react';
import { Calendar, MessageSquare, GripVertical, Flag, MoreHorizontal, Trash2, Edit3 } from 'lucide-react';
import { Task } from '../types';
import { format, isPast, isToday } from 'date-fns';
import TaskModal from './TaskModal';

interface TaskCardProps {
  task: Task;
  onDelete: (id: string) => void;
  onUpdate: (id: string, data: any) => void;
}

export default function TaskCard({ task, onDelete, onUpdate }: TaskCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const priorityColors = {
    low: 'bg-slate-100 text-slate-600',
    medium: 'bg-amber-100 text-amber-700',
    high: 'bg-orange-100 text-orange-700',
    urgent: 'bg-red-100 text-red-700',
  };

  const isOverdue = task.dueDate && isPast(new Date(task.dueDate)) && !isToday(new Date(task.dueDate));

  return (
    <>
      <div
        className="bg-white rounded-lg border border-slate-200 p-3 hover:shadow-md transition-shadow cursor-pointer group"
        onClick={() => setIsModalOpen(true)}
      >
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-1">
            <GripVertical size={14} className="text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
            <h4 className="text-sm font-medium text-slate-800 line-clamp-2">{task.title}</h4>
          </div>
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              className="p-1 rounded hover:bg-slate-100 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MoreHorizontal size={14} />
            </button>
            {showMenu && (
              <div className="absolute right-0 top-6 w-32 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-10">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsModalOpen(true);
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs hover:bg-slate-50"
                >
                  <Edit3 size={12} />
                  Edit
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(task._id);
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-600 hover:bg-red-50"
                >
                  <Trash2 size={12} />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>

        {task.description && (
          <p className="text-xs text-slate-500 mb-2 line-clamp-2">{task.description}</p>
        )}

        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${priorityColors[task.priority]}`}>
            <Flag size={10} className="inline mr-1" />
            {task.priority}
          </span>
          {task.labels?.map((label, idx) => (
            <span
              key={idx}
              className="text-xs px-2 py-0.5 rounded-full"
              style={{ backgroundColor: label.color + '20', color: label.color }}
            >
              {label.name}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex -space-x-1.5">
            {task.assignees?.slice(0, 3).map((user, idx) => (
              <div
                key={idx}
                className="w-6 h-6 rounded-full bg-blue-100 border border-white flex items-center justify-center text-xs font-medium text-blue-700"
                title={user.name}
              >
                {user.name?.charAt(0).toUpperCase()}
              </div>
            ))}
            {task.assignees?.length > 3 && (
              <div className="w-6 h-6 rounded-full bg-slate-100 border border-white flex items-center justify-center text-xs text-slate-600">
                +{task.assignees.length - 3}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500">
            {task.comments?.length > 0 && (
              <div className="flex items-center gap-0.5">
                <MessageSquare size={12} />
                <span>{task.comments.length}</span>
              </div>
            )}
            {task.dueDate && (
              <div className={`flex items-center gap-0.5 ${isOverdue ? 'text-red-500' : ''}`}>
                <Calendar size={12} />
                <span>{format(new Date(task.dueDate), 'MMM d')}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <TaskModal
          task={task}
          onClose={() => setIsModalOpen(false)}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      )}
    </>
  );
}
