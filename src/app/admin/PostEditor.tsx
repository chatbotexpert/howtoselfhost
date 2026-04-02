'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Eye, EyeOff, Save, Send, Loader2, Upload, X, ImageIcon } from 'lucide-react';
import { slugify } from '@/lib/utils';
import type { Post } from '@/types';

const CATEGORIES = ['Docker', 'VPS', 'Nginx', 'Databases', 'Security', 'Monitoring', 'Blockchain', 'Media', 'Files', 'VPN', 'Automation', 'CI/CD', 'Communication'];

interface PostEditorProps {
  mode: 'new' | 'edit';
  post?: Post;
}

export default function PostEditor({ mode, post }: PostEditorProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState(post?.title ?? '');
  const [slug, setSlug] = useState(post?.slug ?? '');
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? '');
  const [category, setCategory] = useState(post?.category ?? 'Docker');
  const [tags, setTags] = useState(post?.tags?.join(', ') ?? '');
  const [content, setContent] = useState(post?.content ?? '');
  const [coverImage, setCoverImage] = useState(post?.coverImage ?? '');
  const [published, setPublished] = useState(post?.published ?? false);
  const [featured, setFeatured] = useState(post?.featured ?? false);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

  useEffect(() => {
    if (!slugManuallyEdited && mode === 'new') {
      setSlug(slugify(title));
    }
  }, [title, slugManuallyEdited, mode]);

  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const form = new FormData();
      form.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: form });
      const data = await res.json();
      if (res.ok) {
        setCoverImage(data.url);
      } else {
        setError(data.error ?? 'Image upload failed.');
      }
    } catch {
      setError('Image upload failed.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSave = async (publish: boolean) => {
    setSaving(true);
    setError('');

    const tagsArray = tags
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);

    const body = {
      title,
      slug,
      excerpt,
      category,
      tags: tagsArray,
      content,
      coverImage: coverImage || null,
      published: publish,
      featured,
      readingTime,
      publishedAt: publish ? new Date().toISOString() : null,
    };

    try {
      const url = mode === 'edit' && post ? `/api/posts/${post.id}` : '/api/posts';
      const method = mode === 'edit' ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        router.push('/admin');
        router.refresh();
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? 'Failed to save post.');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-xl font-bold text-white">
              {mode === 'new' ? 'New Post' : 'Edit Post'}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setPreview(!preview)}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg transition-colors duration-200"
            >
              {preview ? (
                <>
                  <EyeOff className="w-4 h-4" />
                  Edit
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4" />
                  Preview
                </>
              )}
            </button>
            <button
              onClick={() => handleSave(false)}
              disabled={saving || !title || !content}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-200 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Save Draft
            </button>
            <button
              onClick={() => handleSave(true)}
              disabled={saving || !title || !content || !excerpt}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-black bg-green-500 hover:bg-green-400 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              Publish
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main editor */}
          <div className="lg:col-span-2 space-y-4">
            {/* Title */}
            <div>
              <input
                type="text"
                placeholder="Post title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-2xl font-bold bg-transparent border-none text-white placeholder-gray-600 focus:outline-none py-2"
              />
            </div>

            {/* Slug */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 font-mono flex-shrink-0">
                /blog/
              </span>
              <input
                type="text"
                value={slug}
                onChange={(e) => {
                  setSlug(e.target.value);
                  setSlugManuallyEdited(true);
                }}
                className="flex-1 text-sm font-mono bg-gray-800/50 border border-gray-700/50 rounded-lg px-3 py-1.5 text-gray-300 focus:outline-none focus:border-green-500/50 transition-colors duration-200"
                placeholder="post-slug"
              />
            </div>

            {/* Excerpt */}
            <div>
              <label className="block text-xs text-gray-500 mb-1.5 font-medium uppercase tracking-wider">
                Excerpt
              </label>
              <textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Brief description of the post (used in cards and SEO)..."
                rows={3}
                className="w-full bg-gray-800/50 border border-gray-700/50 rounded-xl px-4 py-3 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-green-500/50 resize-none transition-colors duration-200"
              />
            </div>

            {/* Content */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                  Content (MDX)
                </label>
                <span className="text-xs text-gray-600 font-mono">
                  {wordCount} words · ~{readingTime} min read
                </span>
              </div>
              {preview ? (
                <div className="min-h-96 bg-gray-900 border border-gray-700/50 rounded-xl p-6 text-sm text-gray-300 leading-relaxed whitespace-pre-wrap font-mono overflow-auto">
                  {content || <span className="text-gray-600">No content yet...</span>}
                </div>
              ) : (
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder={`## Introduction\n\nWrite your post content here using MDX...\n\n\`\`\`bash\n# Example code block\necho "Hello, World!"\n\`\`\``}
                  rows={24}
                  className="w-full bg-gray-900 border border-gray-700/50 rounded-xl px-4 py-3 text-sm font-mono text-gray-200 placeholder-gray-600 focus:outline-none focus:border-green-500/50 resize-y transition-colors duration-200 leading-relaxed"
                />
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Status */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-white mb-3">Status</h3>
              <div className="space-y-3">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-sm text-gray-300">Published</span>
                  <button
                    type="button"
                    onClick={() => setPublished(!published)}
                    className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors duration-200 ${
                      published ? 'bg-green-500' : 'bg-gray-700'
                    }`}
                  >
                    <span
                      className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform duration-200 ${
                        published ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-sm text-gray-300">Featured</span>
                  <button
                    type="button"
                    onClick={() => setFeatured(!featured)}
                    className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors duration-200 ${
                      featured ? 'bg-yellow-500' : 'bg-gray-700'
                    }`}
                  >
                    <span
                      className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform duration-200 ${
                        featured ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </label>
              </div>
            </div>

            {/* Category */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-white mb-3">Category</h3>
              <div className="grid grid-cols-2 gap-1.5">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors duration-150 text-left ${
                      category === cat
                        ? 'bg-green-500/10 text-green-400 border border-green-500/30'
                        : 'bg-gray-800 text-gray-400 border border-gray-700/50 hover:bg-gray-700 hover:text-gray-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Cover Image */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-white mb-3">Cover Image</h3>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              {coverImage ? (
                <div className="relative group">
                  <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-gray-800">
                    <Image
                      src={coverImage}
                      alt="Cover"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div className="flex gap-2 mt-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs text-gray-300 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg transition-colors duration-200 disabled:opacity-50"
                    >
                      {uploading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Upload className="w-3 h-3" />}
                      Replace
                    </button>
                    <button
                      type="button"
                      onClick={() => setCoverImage('')}
                      className="flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-lg transition-colors duration-200"
                    >
                      <X className="w-3 h-3" />
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="w-full flex flex-col items-center justify-center gap-2 py-6 border-2 border-dashed border-gray-700 hover:border-green-500/50 rounded-xl text-gray-500 hover:text-gray-400 transition-colors duration-200 disabled:opacity-50"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin" />
                      <span className="text-xs">Uploading...</span>
                    </>
                  ) : (
                    <>
                      <ImageIcon className="w-6 h-6" />
                      <span className="text-xs">Click to upload cover image</span>
                      <span className="text-xs text-gray-600">PNG, JPG, WebP up to 10MB</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Tags */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-white mb-2">Tags</h3>
              <p className="text-xs text-gray-500 mb-2">Comma-separated</p>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="docker, containers, tutorial"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-green-500/50 transition-colors duration-200"
              />
            </div>

            {/* Info */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-white mb-3">Info</h3>
              <dl className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <dt className="text-gray-500">Word count</dt>
                  <dd className="text-gray-300 font-mono">{wordCount}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Reading time</dt>
                  <dd className="text-gray-300 font-mono">{readingTime} min</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Characters</dt>
                  <dd className="text-gray-300 font-mono">{content.length}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
