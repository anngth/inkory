import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '@/lib/api';
import { Article, PaginatedResponse } from '@/types';
import ArticleCard from '@/components/ArticleCard';
import { Search as SearchIcon } from 'lucide-react';

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const fetchArticlesForQuery = async (queryString: string) => {
    if (!queryString.trim()) return;

    setLoading(true);
    setSearched(true);

    try {
      const response = await api.get<PaginatedResponse<Article>>(
        '/articles/search',
        {
          params: { q: queryString, page: 1, limit: 20 },
        },
      );

      setArticles(response.data.data);
    } catch (error) {
      console.error('Failed to search:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    fetchArticlesForQuery(query);
  };

  useEffect(() => {
    const q = searchParams.get('q');
    if (q) {
      setQuery(q);
      fetchArticlesForQuery(q);
    }
  }, [searchParams]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Search Articles</h1>

        <form onSubmit={handleSearch} className="mb-8">
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search for articles..."
              className="w-full px-6 py-4 pr-12 text-lg border border-gray-300 rounded-full focus:ring-2 focus:ring-black focus:border-transparent"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-black text-white rounded-full hover:bg-gray-800"
            >
              <SearchIcon size={20} />
            </button>
          </div>
        </form>

        {loading ? (
          <div className="animate-pulse space-y-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="border-b pb-8">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
              </div>
            ))}
          </div>
        ) : searched ? (
          articles.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                No articles found for "{query}"
              </p>
            </div>
          ) : (
            <div>
              <p className="text-gray-600 mb-6">
                Found {articles.length} article
                {articles.length !== 1 ? 's' : ''}
              </p>
              <div className="space-y-0">
                {articles.map(article => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            </div>
          )
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              Enter a search query to find articles
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
