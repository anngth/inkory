'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';
import { Hand } from 'lucide-react';

interface ClapButtonProps {
  articleId: string;
  initialCount?: number;
}

export default function ClapButton({ articleId, initialCount = 0 }: ClapButtonProps) {
  const { user } = useAuthStore();
  const [totalClaps, setTotalClaps] = useState(initialCount);
  const [userClaps, setUserClaps] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (user) {
      loadUserClaps();
    }
    loadTotalClaps();
  }, [articleId, user]);

  const loadUserClaps = async () => {
    try {
      const response = await api.get(`/articles/${articleId}/claps/user`);
      setUserClaps(response.data.count);
    } catch (error) {
      console.error('Failed to load user claps:', error);
    }
  };

  const loadTotalClaps = async () => {
    try {
      const response = await api.get(`/articles/${articleId}/claps`);
      setTotalClaps(response.data.totalClaps);
    } catch (error) {
      console.error('Failed to load total claps:', error);
    }
  };

  const handleClap = async () => {
    if (!user || userClaps >= 50) return;

    try {
      setIsAnimating(true);
      await api.post(`/articles/${articleId}/claps`, { count: 1 });
      setUserClaps((prev) => prev + 1);
      setTotalClaps((prev) => prev + 1);
      setTimeout(() => setIsAnimating(false), 300);
    } catch (error) {
      console.error('Failed to clap:', error);
      setIsAnimating(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleClap}
        disabled={!user || userClaps >= 50}
        className={`flex items-center gap-2 px-4 py-2 border rounded-full transition ${
          isAnimating ? 'scale-110' : ''
        } ${
          userClaps > 0
            ? 'bg-green-50 border-green-500 text-green-700'
            : 'hover:bg-gray-100'
        } ${!user || userClaps >= 50 ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <Hand size={20} className={userClaps > 0 ? 'fill-green-700' : ''} />
        <span className="font-medium">{totalClaps}</span>
      </button>
      {user && userClaps > 0 && (
        <span className="text-sm text-gray-500">You clapped {userClaps} time{userClaps > 1 ? 's' : ''}</span>
      )}
    </div>
  );
}
