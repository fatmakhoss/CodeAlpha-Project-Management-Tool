import { useState } from 'react';
import { X, Mail, UserPlus } from 'lucide-react';

interface InviteMemberModalProps {
  onClose: () => void;
  onInvite: (data: { email: string; role: string }) => void;
}

const roles = [
  { value: 'member', label: 'Member', description: 'Can view and edit tasks' },
  { value: 'admin', label: 'Admin', description: 'Can manage project settings and members' },
];

export default function InviteMemberModal({ onClose, onInvite }: InviteMemberModalProps) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('member');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setIsLoading(true);
    setError('');
    try {
      await onInvite({ email, role });
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to invite member');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <h2 className="text-lg font-semibold text-slate-800">Invite Member</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter member's email"
                className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Role</label>
            <div className="space-y-2">
              {roles.map((r) => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setRole(r.value)}
                  className={`w-full flex items-start gap-3 p-3 rounded-lg border transition-all ${
                    role === r.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full border-2 mt-0.5 flex items-center justify-center ${
                    role === r.value ? 'border-blue-500' : 'border-slate-300'
                  }`}>
                    {role === r.value && <div className="w-2 h-2 rounded-full bg-blue-500" />}
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-sm">{r.label}</div>
                    <div className="text-xs text-slate-500">{r.description}</div>
                  </div>
                </button>
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
              disabled={isLoading || !email.trim()}
              className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <UserPlus size={16} />
              {isLoading ? 'Inviting...' : 'Invite'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
