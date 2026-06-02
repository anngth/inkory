import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '@/lib/api';
import { Article, PaginatedResponse, Tag } from '@/types';
import ArticleCard from '@/components/ArticleCard';

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [popularTags, setPopularTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    loadPopularTags();
  }, []);

  useEffect(() => {
    loadArticles();
  }, [page]);

  const loadArticles = async () => {
    if (loading) return;

    setLoading(true);
    try {
      const response = await api.get<PaginatedResponse<Article>>('/articles', {
        params: { page, limit: 10 },
      });

      setArticles(prev =>
        page === 1 ? response.data.data : [...prev, ...response.data.data],
      );
      setHasMore(page < response.data.meta.totalPages);
    } catch (error) {
      console.error('Failed to load articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPopularTags = async () => {
    try {
      const response = await api.get<Tag[]>('/tags/popular', {
        params: { limit: 10 },
      });
      setPopularTags(response.data);
    } catch (error) {
      console.error('Failed to load tags:', error);
    }
  };

  const loadMore = () => {
    if (loading || !hasMore) return;
    setPage(prev => prev + 1);
  };

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
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2">
            <h1 className="text-3xl font-bold mb-8">Latest Articles</h1>

            {articles.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  No articles yet. Be the first to write!
                </p>
                <Link
                  to="/write"
                  className="inline-block mt-4 px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800"
                >
                  Write an Article
                </Link>
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
                      disabled={loading}
                      className="px-6 py-3 border border-gray-300 rounded-full hover:bg-gray-50 transition disabled:opacity-50"
                    >
                      {loading ? 'Loading...' : 'Load More'}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <h2 className="text-sm font-semibold mb-4 text-gray-900">
                Popular Tags
              </h2>
              <div className="flex flex-wrap gap-2">
                {popularTags.map(tag => (
                  <Link
                    key={tag.id}
                    to={`/tag/${tag.name}`}
                    className="px-4 py-2 bg-gray-100 rounded-full text-sm hover:bg-gray-200 transition"
                  >
                    {tag.name}
                  </Link>
                ))}
              </div>

              <div className="mt-8 p-6 bg-gray-50 rounded-lg">
                <h3 className="font-semibold mb-2">Welcome to Inkory</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Discover stories, thinking, and expertise from writers on any
                  topic.
                </p>
                <Link
                  to="/register"
                  className="inline-block w-full text-center px-4 py-2 bg-black text-white rounded-full hover:bg-gray-800 text-sm"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
