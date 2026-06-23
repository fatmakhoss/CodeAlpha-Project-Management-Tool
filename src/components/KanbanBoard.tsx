import { useState, useCallback } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Plus, MoreHorizontal, Trash2, Edit3, X, Check } from 'lucide-react';
import { Board, Task } from '../types';
import TaskCard from './TaskCard';
import CreateTaskModal from './CreateTaskModal';

interface KanbanBoardProps {
  board: Board;
  tasks: Task[];
  onTaskCreate: (data: any) => void;
  onTaskUpdate: (id: string, data: any) => void;
  onTaskDelete: (id: string) => void;
  onTaskMove: (id: string, column: string, order: number) => void;
  onBoardUpdate: (id: string, data: any) => void;
  onBoardDelete: (id: string) => void;
}

export default function KanbanBoard({
  board,
  tasks,
  onTaskCreate,
  onTaskUpdate,
  onTaskDelete,
  onTaskMove,
  onBoardUpdate,
  onBoardDelete,
}: KanbanBoardProps) {
  const [isAddingTask, setIsAddingTask] = useState<string | null>(null);
  const [isEditingBoard, setIsEditingBoard] = useState(false);
  const [boardName, setBoardName] = useState(board.name);
  const [showBoardMenu, setShowBoardMenu] = useState(false);

  const handleDragEnd = useCallback(
    (result: DropResult) => {
      if (!result.destination) return;

      const { draggableId, destination } = result;
      const column = destination.droppableId;
      const order = destination.index;

      onTaskMove(draggableId, column, order);
    },
    [onTaskMove]
  );

  const handleBoardSave = () => {
    onBoardUpdate(board._id, { name: boardName });
    setIsEditingBoard(false);
  };

  const columns = board.columns || [];

  const getTasksByColumn = (columnName: string) => {
    return tasks
      .filter((t) => t.column === columnName)
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  };

  return (
    <div className="bg-slate-50 rounded-xl border border-slate-200">
      {/* Board Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200">
        {isEditingBoard ? (
          <div className="flex items-center gap-2 flex-1">
            <input
              type="text"
              value={boardName}
              onChange={(e) => setBoardName(e.target.value)}
              className="flex-1 px-3 py-1.5 border border-slate-300 rounded-lg text-sm font-medium"
              autoFocus
            />
            <button onClick={handleBoardSave} className="p-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700">
              <Check size={14} />
            </button>
            <button onClick={() => { setIsEditingBoard(false); setBoardName(board.name); }} className="p-1.5 rounded-lg hover:bg-slate-100">
              <X size={14} />
            </button>
          </div>
        ) : (
          <h3 className="font-semibold text-slate-800">{board.name}</h3>
        )}

        {!isEditingBoard && (
          <div className="relative">
            <button
              onClick={() => setShowBoardMenu(!showBoardMenu)}
              className="p-1.5 rounded-lg hover:bg-slate-200 transition-colors"
            >
              <MoreHorizontal size={16} />
            </button>
            {showBoardMenu && (
              <div className="absolute right-0 top-8 w-36 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-10">
                <button
                  onClick={() => { setIsEditingBoard(true); setShowBoardMenu(false); }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-slate-50"
                >
                  <Edit3 size={14} />
                  Edit Board
                </button>
                <button
                  onClick={() => { onBoardDelete(board._id); setShowBoardMenu(false); }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <Trash2 size={14} />
                  Delete Board
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Kanban Columns */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex gap-4 p-4 overflow-x-auto">
          {columns.map((column) => {
            const columnTasks = getTasksByColumn(column.name);
            return (
              <div key={column.name} className="min-w-[280px] w-[280px] flex-shrink-0">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: column.color }}
                    />
                    <span className="font-medium text-sm text-slate-700">{column.name}</span>
                    <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                      {columnTasks.length}
                    </span>
                  </div>
                </div>

                <Droppable droppableId={column.name}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`space-y-2 min-h-[120px] p-2 rounded-lg transition-colors ${
                        snapshot.isDraggingOver ? 'bg-blue-50/50' : 'bg-slate-100/50'
                      }`}
                    >
                      {columnTasks.map((task, index) => (
                        <Draggable key={task._id} draggableId={task._id} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <TaskCard
                                task={task}
                                onDelete={onTaskDelete}
                                onUpdate={onTaskUpdate}
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>

                <button
                  onClick={() => setIsAddingTask(column.name)}
                  className="w-full mt-2 flex items-center justify-center gap-1.5 py-2 text-sm text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <Plus size={14} />
                  Add Task
                </button>
              </div>
            );
          })}
        </div>
      </DragDropContext>

      {isAddingTask && (
        <CreateTaskModal
          column={isAddingTask}
          boardId={board._id}
          projectId={typeof board.project === 'string' ? board.project : board.project._id}
          onClose={() => setIsAddingTask(null)}
          onCreate={onTaskCreate}
        />
      )}
    </div>
  );
}
