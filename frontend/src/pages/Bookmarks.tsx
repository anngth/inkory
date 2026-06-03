import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';
import { Article, PaginatedResponse } from '@/types';
import ArticleCard from '@/components/ArticleCard';

export default function BookmarksPage() {
  const navigate = useNavigate();
  const { user, isLoading } = useAuthStore();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const isFetchingRef = useRef(false);

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login');
    }
  }, [user, isLoading, navigate]);

  useEffect(() => {
    if (user) {
      loadBookmarks();
    }
  }, [user, page]);

  const loadBookmarks = async () => {
    if (isFetchingRef.current) return;

    isFetchingRef.current = true;
    if (page === 1) {
      setLoading(true);
    } else {
      setIsLoadingMore(true);
    }
    try {
      const response = await api.get<PaginatedResponse<Article>>('/bookmarks', {
        params: { page, limit: 10 },
      });

      setArticles(prev =>
        page === 1 ? response.data.data : [...prev, ...response.data.data],
      );
      setHasMore(page < response.data.meta.totalPages);
    } catch (error) {
      console.error('Failed to load bookmarks:', error);
    } finally {
      setLoading(false);
      setIsLoadingMore(false);
      isFetchingRef.current = false;
    }
  };

  const loadMore = () => {
    if (isLoadingMore || !hasMore) return;
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
        <h1 className="text-3xl font-bold mb-8">Your Bookmarks</h1>

        {articles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No bookmarks yet. Start saving articles you like!
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
                  disabled={isLoadingMore}
                  className="px-6 py-3 border border-gray-300 rounded-full hover:bg-gray-50 transition disabled:opacity-50"
                >
                  {isLoadingMore ? 'Loading...' : 'Load More'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
