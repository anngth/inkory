import { Link, useNavigate } from 'react-router-dom';
import { Article } from '@/types';
import { formatDate } from '@/lib/utils';
import { Eye, MessageCircle } from 'lucide-react';

interface ArticleCardProps {
  article: Article;
}

export default function ArticleCard({ article }: ArticleCardProps) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/article/${article.id}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      navigate(`/article/${article.id}`);
    }
  };

  return (
    <article
      className="py-8 border-b border-gray-200 hover:bg-gray-50 transition px-4 -mx-4 cursor-pointer"
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
    >
      <div className="flex gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <Link
              to={`/profile/${article.author.username}`}
              className="flex items-center gap-2 hover:underline"
              onClick={e => e.stopPropagation()}
            >
              {article.author.avatar ? (
                <img
                  src={article.author.avatar}
                  alt={article.author.username}
                  className="w-6 h-6 rounded-full"
                />
              ) : (
                <div className="w-6 h-6 bg-gray-300 rounded-full" />
              )}
              <span className="text-sm font-medium">
                {article.author.username}
              </span>
            </Link>
          </div>

          <h2 className="text-xl font-bold mb-2 line-clamp-2">
            {article.title}
          </h2>

          {article.subtitle && (
            <p className="text-gray-600 mb-3 line-clamp-2">
              {article.subtitle}
            </p>
          )}

          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>{formatDate(article.createdAt)}</span>
            <span>·</span>
            <span>{article.readingTime} min read</span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Eye size={16} />
              {article.viewCount}
            </span>
            {article.commentsCount !== undefined && (
              <>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <MessageCircle size={16} />
                  {article.commentsCount}
                </span>
              </>
            )}
          </div>

          {article.tags && article.tags.length > 0 && (
            <div className="flex gap-2 mt-3 flex-wrap">
              {article.tags.slice(0, 3).map(tag => (
                <Link
                  key={tag.id}
                  to={`/tag/${tag.name}`}
                  className="text-xs bg-gray-100 px-3 py-1 rounded-full hover:bg-gray-200"
                  onClick={e => e.stopPropagation()}
                >
                  {tag.name}
                </Link>
              ))}
            </div>
          )}
        </div>

        {article.coverImage && (
          <div className="w-32 h-32 flex-shrink-0">
            <img
              src={article.coverImage}
              alt={article.title}
              className="w-full h-full object-cover rounded"
            />
          </div>
        )}
      </div>
    </article>
  );
}
