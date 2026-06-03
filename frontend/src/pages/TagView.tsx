import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import api from '@/lib/api';
import { Article, PaginatedResponse } from '@/types';
import ArticleCard from '@/components/ArticleCard';
import { Tag } from 'lucide-react';

export default function TagPage() {
  const { name } = useParams();
  const tagName = name as string;
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const currentTagRef = useRef(tagName);

  useEffect(() => {
    const tagChanged = currentTagRef.current !== tagName;
    currentTagRef.current = tagName;

    if (tagChanged) {
      setPage(1);
      setArticles([]);
      setHasMore(true);
      setLoading(true);
    }

    loadArticles();
  }, [tagName, page]);

  const loadArticles = async () => {
    const requestTag = tagName;
    const requestPage = page;

    try {
      const response = await api.get<PaginatedResponse<Article>>('/articles', {
        params: { tag: requestTag, page: requestPage, limit: 10 },
      });

      // Ignore stale responses
      if (requestTag !== currentTagRef.current) return;

      setArticles(prev =>
        requestPage === 1
          ? response.data.data
          : [...prev, ...response.data.data],
      );
      setHasMore(requestPage < response.data.meta.totalPages);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load articles:', error);
      setLoading(false);
    }
  };

  const loadMore = () => {
    setPage(prev => prev + 1);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-12 bg-gray-200 rounded w-1/3 mb-8"></div>
            <div className="space-y-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="border-b pb-8">
                  <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Tag size={32} className="text-gray-600" />
          <h1 className="text-4xl font-bold capitalize">{tagName}</h1>
        </div>

        {articles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No articles found with tag "{tagName}"
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
