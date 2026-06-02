import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';
import { Upload } from 'lucide-react';

export default function SettingsPage() {
  const navigate = useNavigate();
  const { user, isLoading, setUser } = useAuthStore();
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [timeoutId, setTimeoutId] = useState<number | null>(null);

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login');
    }
  }, [user, isLoading, navigate]);

  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setBio(user.bio || '');
      setAvatar(user.avatar || '');
    }
  }, [user]);

  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [timeoutId]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await api.post('/upload/image', formData);
      setAvatar(response.data.url);
    } catch (error) {
      console.error('Failed to upload avatar:', error);
      alert('Failed to upload avatar');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await api.put('/users/profile', {
        username,
        bio: bio || undefined,
        avatar: avatar || undefined,
      });

      setUser(response.data);
      setMessage('Profile updated successfully!');

      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      const newTimeoutId = setTimeout(() => {
        navigate(`/profile/${response.data.username}`);
      }, 1500);
      setTimeoutId(newTimeoutId);
    } catch (error: any) {
      console.error('Failed to update profile:', error);
      setMessage(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (isLoading || !user) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Profile Settings</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {message && (
            <div
              className={`px-4 py-3 rounded ${
                message.includes('success')
                  ? 'bg-green-50 border border-green-200 text-green-700'
                  : 'bg-red-50 border border-red-200 text-red-700'
              }`}
            >
              {message}
            </div>
          )}

          {/* Avatar */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Profile Picture
            </label>
            <div className="flex items-center gap-4">
              {avatar ? (
                <img
                  src={avatar}
                  alt="Avatar"
                  className="w-24 h-24 rounded-full object-cover"
                />
              ) : (
                <div className="w-24 h-24 bg-gray-300 rounded-full" />
              )}
              <label className="cursor-pointer px-4 py-2 border border-gray-300 rounded-full hover:bg-gray-50 flex items-center gap-2">
                <Upload size={18} />
                {uploading ? 'Uploading...' : 'Upload New'}
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  disabled={uploading}
                />
              </label>
              {avatar && (
                <button
                  type="button"
                  onClick={() => setAvatar('')}
                  className="text-red-600 hover:text-red-700"
                >
                  Remove
                </button>
              )}
            </div>
          </div>

          {/* Username */}
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium mb-2"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
            />
          </div>

          {/* Bio */}
          <div>
            <label htmlFor="bio" className="block text-sm font-medium mb-2">
              Bio
            </label>
            <textarea
              id="bio"
              value={bio}
              onChange={e => setBio(e.target.value)}
              rows={4}
              placeholder="Tell us about yourself..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent resize-none"
            />
          </div>

          {/* Email (readonly) */}
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={user.email}
              disabled
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
            />
            <p className="text-sm text-gray-500 mt-1">
              Email cannot be changed
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition disabled:opacity-50 font-medium"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-8 py-3 border border-gray-300 rounded-full hover:bg-gray-50 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
