import { useState } from 'react';
import { User, Mail, Save } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email] = useState(user?.email || '');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setIsLoading(true);
    try {
      const response = await authService.updateProfile({ name });
      if (response.success) {
        updateUser(response.data as any);
        setMessage('Profile updated successfully');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Profile</h1>
        <p className="text-sm text-slate-600 mt-1">Manage your account settings</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-8">
        {message && (
          <div className="mb-4 p-3 bg-green-50 text-green-700 text-sm rounded-lg">
            {message}
          </div>
        )}
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg">
            {error}
          </div>
        )}

        <div className="flex items-center gap-4 mb-8">
          <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-2xl font-bold text-blue-700">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-800">{user?.name}</h2>
            <p className="text-sm text-slate-500">{user?.email}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
            <div className="relative">
              <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                value={email}
                disabled
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-500 cursor-not-allowed"
              />
            </div>
            <p className="text-xs text-slate-500 mt-1">Email cannot be changed</p>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Save size={16} />
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
