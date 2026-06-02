import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';
import { Article, Comment } from '@/types';
import { formatDate } from '@/lib/utils';
import ClapButton from '@/components/ClapButton';
import { Bookmark, MessageCircle, Eye, Edit, Trash2 } from 'lucide-react';

export default function ArticlePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [article, setArticle] = useState<Article | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [bookmarked, setBookmarked] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadArticle();
    loadComments();
    if (user) {
      checkBookmark();
    }
  }, [id, user]);

  const loadArticle = async () => {
    try {
      const response = await api.get<Article>(`/articles/${id}`);
      setArticle(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load article:', error);
      setLoading(false);
    }
  };

  const loadComments = async () => {
    try {
      const response = await api.get<Comment[]>(`/articles/${id}/comments`);
      setComments(response.data);
    } catch (error) {
      console.error('Failed to load comments:', error);
    }
  };

  const checkBookmark = async () => {
    try {
      const response = await api.get(`/bookmarks/articles/${id}/check`);
      setBookmarked(response.data.bookmarked);
    } catch (error) {
      console.error('Failed to check bookmark:', error);
    }
  };

  const handleBookmark = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      await api.post(`/bookmarks/articles/${id}`);
      setBookmarked(!bookmarked);
    } catch (error) {
      console.error('Failed to toggle bookmark:', error);
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newComment.trim()) return;

    try {
      await api.post(`/articles/${id}/comments`, {
        content: newComment,
      });
      setNewComment('');
      loadComments();
    } catch (error) {
      console.error('Failed to post comment:', error);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this article?')) return;

    try {
      await api.delete(`/articles/${id}`);
      navigate('/');
    } catch (error) {
      console.error('Failed to delete article:', error);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="h-64 bg-gray-200 rounded mb-8"></div>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold">Article not found</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <article className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-5xl font-bold mb-4">{article.title}</h1>
          {article.subtitle && (
            <p className="text-2xl text-gray-600 mb-6">{article.subtitle}</p>
          )}

          {/* Author info */}
          <div className="flex items-center justify-between">
            <Link
              to={`/profile/${article.author.username}`}
              className="flex items-center gap-3 hover:opacity-80"
            >
              {article.author.avatar ? (
                <img
                  src={article.author.avatar}
                  alt={article.author.username}
                  className="w-12 h-12 rounded-full"
                />
              ) : (
                <div className="w-12 h-12 bg-gray-300 rounded-full" />
              )}
              <div>
                <p className="font-medium">{article.author.username}</p>
                <p className="text-sm text-gray-500">
                  {formatDate(article.createdAt)} · {article.readingTime} min
                  read
                </p>
              </div>
            </Link>

            {user?.id === article.authorId && (
              <div className="flex gap-2">
                <Link
                  to={`/article/${article.id}/edit`}
                  className="p-2 hover:bg-gray-100 rounded-full"
                  aria-label="Edit article"
                >
                  <Edit size={20} />
                </Link>
                <button
                  onClick={handleDelete}
                  className="p-2 hover:bg-red-50 text-red-600 rounded-full"
                  aria-label="Delete article"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Cover Image */}
        {article.coverImage && (
          <div className="mb-8">
            <img
              src={article.coverImage}
              alt={article.title}
              className="w-full rounded-lg"
            />
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-4 py-4 border-y mb-8">
          <ClapButton
            articleId={article.id}
            initialCount={article.clapsCount}
          />
          <button
            onClick={handleBookmark}
            className={`flex items-center gap-2 px-4 py-2 border rounded-full transition ${
              bookmarked
                ? 'bg-yellow-50 border-yellow-500'
                : 'hover:bg-gray-100'
            }`}
            aria-label="Toggle bookmark"
            aria-pressed={bookmarked}
          >
            <Bookmark
              size={20}
              className={bookmarked ? 'fill-yellow-500' : ''}
            />
          </button>
          <div className="flex items-center gap-2 text-gray-600">
            <Eye size={20} />
            <span>{article.viewCount}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <MessageCircle size={20} />
            <span>{comments.length}</span>
          </div>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none mb-12">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code({ node, inline, className, children, ...props }: any) {
                const match = /language-(\w+)/.exec(className || '');
                return !inline && match ? (
                  <SyntaxHighlighter
                    style={tomorrow}
                    language={match[1]}
                    PreTag="div"
                    {...props}
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              },
            }}
          >
            {article.content}
          </ReactMarkdown>
        </div>

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="flex gap-2 mb-8 flex-wrap">
            {article.tags.map(tag => (
              <Link
                key={tag.id}
                to={`/tag/${tag.name}`}
                className="px-4 py-2 bg-gray-100 rounded-full text-sm hover:bg-gray-200"
              >
                {tag.name}
              </Link>
            ))}
          </div>
        )}

        {/* Comments */}
        <div className="border-t pt-8">
          <h2 className="text-2xl font-bold mb-6">
            Comments ({comments.length})
          </h2>

          {user ? (
            <form onSubmit={handleComment} className="mb-8">
              <textarea
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent resize-none"
                rows={3}
              />
              <button
                type="submit"
                disabled={!newComment.trim()}
                className="mt-2 px-6 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition disabled:opacity-50"
              >
                Post Comment
              </button>
            </form>
          ) : (
            <div className="mb-8 p-4 bg-gray-50 rounded-lg text-center">
              <p className="text-gray-600">
                <Link
                  to="/login"
                  className="text-black font-medium hover:underline"
                >
                  Sign in
                </Link>{' '}
                to leave a comment
              </p>
            </div>
          )}

          <div className="space-y-6">
            {comments.map(comment => (
              <div key={comment.id} className="flex gap-3">
                {comment.author.avatar ? (
                  <img
                    src={comment.author.avatar}
                    alt={comment.author.username}
                    className="w-10 h-10 rounded-full"
                  />
                ) : (
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex-shrink-0" />
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Link
                      to={`/profile/${comment.author.username}`}
                      className="font-medium hover:underline"
                    >
                      {comment.author.username}
                    </Link>
                    <span className="text-sm text-gray-500">
                      {formatDate(comment.createdAt)}
                    </span>
                  </div>
                  <p className="text-gray-700">{comment.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </article>
    </div>
  );
}
