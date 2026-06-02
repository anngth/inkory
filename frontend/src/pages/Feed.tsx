import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';
import { Article, PaginatedResponse } from '@/types';
import ArticleCard from '@/components/ArticleCard';

export default function FeedPage() {
  const navigate = useNavigate();
  const { user, isLoading } = useAuthStore();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login');
    }
  }, [user, isLoading, navigate]);

  useEffect(() => {
    if (user) {
      loadFeed();
    }
  }, [user, page]);

  const loadFeed = async () => {
    try {
      const response = await api.get<PaginatedResponse<Article>>(
        '/articles/feed',
        {
          params: { page, limit: 10 },
        },
      );

      setArticles(prev =>
        page === 1 ? response.data.data : [...prev, ...response.data.data],
      );
      setHasMore(page < response.data.meta.totalPages);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load feed:', error);
      setLoading(false);
    }
  };

  const loadMore = () => {
    setPage(prev => prev + 1);
  };

  if (isLoading || !user) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="border-b pb-8">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Your Feed</h1>

        {articles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">
              Your feed is empty. Follow some writers to see their articles
              here!
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-0">
              {articles.map(article => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>

            {hasMore && (
              <div className="text-center mt-8">
                <button
                  onClick={loadMore}
                  className="px-6 py-3 border border-gray-300 rounded-full hover:bg-gray-50 transition"
                >
                  Load More
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
