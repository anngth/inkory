import Link from 'next/link';
import Image from 'next/image';
import { Article } from '@/types';
import { formatDate } from '@/lib/utils';
import { Eye, MessageCircle } from 'lucide-react';

interface ArticleCardProps {
  article: Article;
}

export default function ArticleCard({ article }: ArticleCardProps) {
  const excerpt = article.content.substring(0, 150) + '...';

  return (
    <article className="py-8 border-b border-gray-200 hover:bg-gray-50 transition px-4 -mx-4">
      <Link href={`/article/${article.id}`}>
        <div className="flex gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <Link
                href={`/profile/${article.author.username}`}
                className="flex items-center gap-2 hover:underline"
                onClick={e => e.stopPropagation()}
              >
                {article.author.avatar ? (
                  <Image
                    src={article.author.avatar}
                    alt={article.author.username}
                    width={24}
                    height={24}
                    className="rounded-full"
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
                    href={`/tag/${tag.name}`}
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
              <Image
                src={article.coverImage}
                alt={article.title}
                width={128}
                height={128}
                className="w-full h-full object-cover rounded"
              />
            </div>
          )}
        </div>
      </Link>
    </article>
  );
}
