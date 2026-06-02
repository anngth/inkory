import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';
import { User, Article, PaginatedResponse } from '@/types';
import ArticleCard from '@/components/ArticleCard';
import { UserPlus, UserMinus, Settings } from 'lucide-react';

export default function ProfilePage() {
  const { username } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuthStore();
  const [user, setUser] = useState<User | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [following, setFollowing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
    loadArticles();
  }, [username]);

  useEffect(() => {
    if (currentUser && user && currentUser.id !== user.id) {
      checkFollowing();
    }
  }, [currentUser, user]);

  const loadProfile = async () => {
    try {
      const response = await api.get<User>(`/users/${username}`);
      setUser(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load profile:', error);
      setLoading(false);
    }
  };

  const loadArticles = async () => {
    try {
      const userResponse = await api.get<User>(`/users/${username}`);
      const response = await api.get<PaginatedResponse<Article>>(
        `/articles/user/${userResponse.data.id}`,
        { params: { page: 1, limit: 20 } },
      );
      setArticles(response.data.data);
    } catch (error) {
      console.error('Failed to load articles:', error);
    }
  };

  const checkFollowing = async () => {
    try {
      const response = await api.get(`/follows/users/${user?.id}/check`);
      setFollowing(response.data.following);
    } catch (error) {
      console.error('Failed to check following:', error);
    }
  };

  const handleFollow = async () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    try {
      await api.post(`/follows/users/${user?.id}`);
      setFollowing(!following);
      loadProfile();
    } catch (error) {
      console.error('Failed to toggle follow:', error);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto animate-pulse">
          <div className="h-24 w-24 bg-gray-200 rounded-full mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold">User not found</h1>
      </div>
    );
  }

  const isOwnProfile = currentUser?.id === user.id;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="mb-12">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-6">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.username}
                  className="w-24 h-24 rounded-full"
                />
              ) : (
                <div className="w-24 h-24 bg-gray-300 rounded-full" />
              )}
              <div>
                <h1 className="text-3xl font-bold mb-2">{user.username}</h1>
                {user.bio && <p className="text-gray-600 mb-4">{user.bio}</p>}
                <div className="flex gap-6 text-sm text-gray-600">
                  <span>
                    <strong className="text-black">
                      {user.followersCount || 0}
                    </strong>{' '}
                    Followers
                  </span>
                  <span>
                    <strong className="text-black">
                      {user.followingCount || 0}
                    </strong>{' '}
                    Following
                  </span>
                  <span>
                    <strong className="text-black">
                      {user.articlesCount || 0}
                    </strong>{' '}
                    Articles
                  </span>
                </div>
              </div>
            </div>

            {isOwnProfile ? (
              <button
                onClick={() => navigate('/settings')}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-full hover:bg-gray-50"
              >
                <Settings size={18} />
                Edit Profile
              </button>
            ) : (
              currentUser && (
                <button
                  onClick={handleFollow}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition ${
                    following
                      ? 'border border-gray-300 hover:bg-gray-50'
                      : 'bg-black text-white hover:bg-gray-800'
                  }`}
                >
                  {following ? (
                    <>
                      <UserMinus size={18} />
                      Unfollow
                    </>
                  ) : (
                    <>
                      <UserPlus size={18} />
                      Follow
                    </>
                  )}
                </button>
              )
            )}
          </div>
        </div>

        {/* Articles */}
        <div>
          <h2 className="text-2xl font-bold mb-6">
            {isOwnProfile ? 'Your Articles' : `Articles by ${user.username}`}
          </h2>

          {articles.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                {isOwnProfile
                  ? "You haven't written any articles yet."
                  : `${user.username} hasn't written any articles yet.`}
              </p>
            </div>
          ) : (
            <div className="space-y-0">
              {articles.map(article => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
