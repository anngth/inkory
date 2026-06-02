import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';
import MarkdownEditor from '@/components/MarkdownEditor';
import { Image as ImageIcon } from 'lucide-react';

export default function WritePage() {
  const navigate = useNavigate();
  const { user, isLoading } = useAuthStore();
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [tags, setTags] = useState('');
  const [published, setPublished] = useState(true);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login');
    }
  }, [user, isLoading, navigate]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/png', 'image/jpeg', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      alert('Invalid file type. Please upload PNG, JPEG, or GIF images only.');
      return;
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      alert('File size exceeds 5MB limit. Please choose a smaller image.');
      return;
    }

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
    setLoading(true);

    try {
      const tagArray = tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      const response = await api.post('/articles', {
        title,
        subtitle: subtitle || undefined,
        content,
        coverImage: coverImage || undefined,
        tags: tagArray,
        published,
      });

      navigate(`/article/${response.data.id}`);
    } catch (error: any) {
      console.error('Failed to create article:', error);
      alert(error.response?.data?.message || 'Failed to create article');
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Write a new article</h1>

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
                      <p className="text-xs text-gray-500">
                        PNG, JPG, GIF up to 5MB
                      </p>
                    </>
                  )}
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/png, image/jpeg, image/gif"
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
              <span className="text-sm">Publish immediately</span>
            </label>
          </div>

          {/* Submit */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading || !title || !content}
              className="px-8 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition disabled:opacity-50 font-medium"
            >
              {loading
                ? 'Publishing...'
                : published
                  ? 'Publish'
                  : 'Save as Draft'}
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
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
