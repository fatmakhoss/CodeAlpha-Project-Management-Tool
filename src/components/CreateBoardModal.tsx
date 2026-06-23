import { useState } from 'react';
import { X, Layout, Plus, Minus } from 'lucide-react';

interface CreateBoardModalProps {
  onClose: () => void;
  onCreate: (data: { name: string; description?: string; columns: any[] }) => void;
}

const defaultColumns = [
  { name: 'To Do', order: 0, color: '#EF4444' },
  { name: 'In Progress', order: 1, color: '#F59E0B' },
  { name: 'Done', order: 2, color: '#10B981' },
];

export default function CreateBoardModal({ onClose, onCreate }: CreateBoardModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [columns, setColumns] = useState(defaultColumns);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setIsLoading(true);
    setError('');
    try {
      await onCreate({ name, description, columns });
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create board');
    } finally {
      setIsLoading(false);
    }
  };

  const addColumn = () => {
    setColumns([...columns, { name: '', order: columns.length, color: '#3B82F6' }]);
  };

  const removeColumn = (index: number) => {
    setColumns(columns.filter((_, i) => i !== index));
  };

  const updateColumn = (index: number, field: string, value: string) => {
    const updated = [...columns];
    updated[index] = { ...updated[index], [field]: value };
    setColumns(updated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <h2 className="text-lg font-semibold text-slate-800">Create New Board</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Board Name</label>
            <div className="relative">
              <Layout size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter board name"
                className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter board description (optional)"
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={2}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-slate-700">Columns</label>
              <button
                type="button"
                onClick={addColumn}
                className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700"
              >
                <Plus size={12} />
                Add Column
              </button>
            </div>
            <div className="space-y-2">
              {columns.map((col, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={col.name}
                    onChange={(e) => updateColumn(idx, 'name', e.target.value)}
                    placeholder="Column name"
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  />
                  <input
                    type="color"
                    value={col.color}
                    onChange={(e) => updateColumn(idx, 'color', e.target.value)}
                    className="w-10 h-9 rounded-lg cursor-pointer"
                  />
                  {columns.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeColumn(idx)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                    >
                      <Minus size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !name.trim()}
              className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating...' : 'Create Board'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
