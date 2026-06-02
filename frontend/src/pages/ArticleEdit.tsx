import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';
import { Article } from '@/types';
import MarkdownEditor from '@/components/MarkdownEditor';
import { Image as ImageIcon } from 'lucide-react';

export default function EditArticlePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isLoading } = useAuthStore();
  const [article, setArticle] = useState<Article | null>(null);
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [tags, setTags] = useState('');
  const [published, setPublished] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login');
    }
  }, [user, isLoading, navigate]);

  useEffect(() => {
    if (user) {
      loadArticle();
    }
  }, [id, user]);

  const loadArticle = async () => {
    try {
      const response = await api.get<Article>(`/articles/${id}`);
      const articleData = response.data;

      if (articleData.authorId !== user?.id) {
        alert('You can only edit your own articles');
        navigate(`/article/${id}`);
        return;
      }

      setArticle(articleData);
      setTitle(articleData.title);
      setSubtitle(articleData.subtitle || '');
      setContent(articleData.content);
      setCoverImage(articleData.coverImage || '');
      setTags(articleData.tags?.map(tag => tag.name).join(', ') || '');
      setPublished(articleData.published);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load article:', error);
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await api.post('/upload/image', formData);
      setCoverImage(response.data.url);
    } catch (error) {
      console.error('Failed to upload image:', error);
      alert('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const tagArray = tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      await api.put(`/articles/${id}`, {
        title,
        subtitle: subtitle || undefined,
        content,
        coverImage: coverImage || undefined,
        tags: tagArray,
        published,
      });

      navigate(`/article/${id}`);
    } catch (error: any) {
      console.error('Failed to update article:', error);
      alert(error.response?.data?.message || 'Failed to update article');
    } finally {
      setSaving(false);
    }
  };

  if (isLoading || loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  if (!user || !article) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Edit Article</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Cover Image */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Cover Image (optional)
            </label>
            {coverImage ? (
              <div className="relative">
                <img
                  src={coverImage}
                  alt="Cover"
                  className="w-full h-64 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => setCoverImage('')}
                  className="absolute top-2 right-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Remove
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  {uploading ? (
                    <p className="text-gray-500">Uploading...</p>
                  ) : (
                    <>
                      <ImageIcon size={48} className="text-gray-400 mb-3" />
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span>{' '}
                        cover image
                      </p>
                    </>
                  )}
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                />
              </label>
            )}
          </div>

          {/* Title */}
          <div>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
              placeholder="Article title"
              className="w-full text-4xl font-bold border-0 focus:ring-0 focus:outline-none placeholder-gray-300"
            />
          </div>

          {/* Subtitle */}
          <div>
            <input
              type="text"
              value={subtitle}
              onChange={e => setSubtitle(e.target.value)}
              placeholder="Article subtitle (optional)"
              className="w-full text-xl text-gray-600 border-0 focus:ring-0 focus:outline-none placeholder-gray-300"
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Content (Markdown supported)
            </label>
            <MarkdownEditor
              value={content}
              onChange={setContent}
              placeholder="Write your story..."
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              value={tags}
              onChange={e => setTags(e.target.value)}
              placeholder="javascript, react, tutorial"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
            />
          </div>

          {/* Publish options */}
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={published}
                onChange={e => setPublished(e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-sm">Published</span>
            </label>
          </div>

          {/* Submit */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={saving || !title || !content}
              className="px-8 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition disabled:opacity-50 font-medium"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={() => navigate(`/article/${id}`)}
              className="px-8 py-3 border border-gray-300 rounded-full hover:bg-gray-50 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
