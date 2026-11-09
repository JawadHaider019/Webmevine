'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import {
  FileText,
  Plus,
  Search,
  Edit3,
  Trash2,
  Eye,
  CheckCircle2,
  Clock,
  Star,
  Calendar,
  ExternalLink,
  AlertCircle,
  Loader2,
  Sparkles,
  LogOut,
  Globe,
} from 'lucide-react';
import { blogService } from '@/services/blogService';
import WordPressBlogEditor from '@/components/admin/WordPressBlogEditor';

const DEFAULT_CATEGORIES = [
  'AI & Automation',
  'Web Development',
  'SaaS & MVP',
  'Technical SEO',
  'Cloud & DevOps',
  'UI/UX & Product Design',
  'Case Studies & ROI',
];

export default function BlogManager() {
  const [blogs, setBlogs] = useState([]);
  const [stats, setStats] = useState({ total: 0, published: 0, draft: 0, featured: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Editor View State
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchBlogs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await blogService.getBlogs({
        status: statusFilter,
        category: categoryFilter === 'all' ? '' : categoryFilter,
        search,
        withStats: true,
      });
      const list = Array.isArray(res) ? res : res.blogs || [];
      setBlogs(list);
      if (res.stats) {
        setStats(res.stats);
      } else {
        setStats({
          total: list.length,
          published: list.filter((b) => b.published || b.status === 'published').length,
          draft: list.filter((b) => !b.published && b.status !== 'published').length,
          featured: list.filter((b) => b.featured).length,
        });
      }
    } catch (err) {
      showToast(err.message || 'Error loading blog articles', 'error');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, categoryFilter, search]);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  // All categories discovered from posts + defaults
  const availableCategories = useMemo(() => {
    const set = new Set(DEFAULT_CATEGORIES);
    blogs.forEach((b) => {
      if (b.category) set.add(b.category);
    });
    return Array.from(set);
  }, [blogs]);

  const openCreateModal = () => {
    setEditingPost(null);
    setIsEditorOpen(true);
  };

  const openEditModal = (post) => {
    setEditingPost(post);
    setIsEditorOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await blogService.deleteBlog(id);
      showToast('Article deleted successfully.');
      setDeleteConfirmId(null);
      fetchBlogs();
    } catch (err) {
      showToast(err.message || 'Error deleting article', 'error');
    }
  };

  const handleQuickToggleStatus = async (post) => {
    const postId = post.id || post._id;
    const isCurrentlyPublished = post.status === 'published' || post.published;
    const nextStatus = isCurrentlyPublished ? 'draft' : 'published';
    try {
      await blogService.updateBlog(postId, {
        ...post,
        status: nextStatus,
        published: nextStatus === 'published',
      });
      showToast(
        nextStatus === 'published'
          ? 'Article published live!'
          : 'Article moved to drafts.'
      );
      fetchBlogs();
    } catch (err) {
      showToast(err.message || 'Status update failed', 'error');
    }
  };

  const handleQuickToggleFeatured = async (post) => {
    const postId = post.id || post._id;
    try {
      await blogService.updateBlog(postId, {
        ...post,
        featured: !post.featured,
      });
      showToast(
        !post.featured
          ? 'Marked as Featured Spotlight article!'
          : 'Removed from Featured Spotlight.'
      );
      fetchBlogs();
    } catch (err) {
      showToast(err.message || 'Update failed', 'error');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin-auth');
    localStorage.removeItem('isAdmin');
    window.location.reload();
  };

  // Render full WordPress / Sanity Style Editor when creating or editing
  if (isEditorOpen) {
    return (
      <WordPressBlogEditor
        initialPost={editingPost}
        onCancel={() => {
          setIsEditorOpen(false);
          setEditingPost(null);
        }}
        onSaved={() => {
          setIsEditorOpen(false);
          setEditingPost(null);
          showToast(
            editingPost ? 'Article updated successfully!' : 'New article created!'
          );
          fetchBlogs();
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 py-10 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto space-y-6 pb-12">
        {/* Toast Notification */}
        {toast && (
          <div
            className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl border text-sm font-semibold transition-all ${
              toast.type === 'error'
                ? 'bg-red-950 text-white border-red-800'
                : 'bg-zinc-950 text-white border-red-500/40'
            }`}
          >
            {toast.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-red-400" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-red-500" />
            )}
            {toast.msg}
          </div>
        )}

        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-zinc-200/90 shadow-xs">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full bg-red-600 animate-pulse" />
              <span className="text-[11px] font-bold uppercase tracking-widest text-red-600">
                WebMavien Editorial & Technical SEO Suite
              </span>
            </div>
            <h1 className="font-['Marcellus'] text-2xl sm:text-3xl font-bold text-zinc-950 mt-1">
              Blog & Content Management
            </h1>
            <p className="text-sm text-zinc-500 mt-1">
              Manage articles, structured JSON-LD schemas, Key Takeaways, FAQs, and conversion CTAs.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href="/blog"
              target="_blank"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 font-bold text-xs transition-all"
            >
              <Globe className="w-4 h-4 text-red-600" />
              View Live Blog
            </Link>
            <button
              onClick={openCreateModal}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-600/20 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Create New Article
            </button>
            <button
              onClick={handleLogout}
              title="Sign Out"
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-zinc-200 bg-zinc-50 hover:bg-red-50 hover:text-red-600 hover:border-red-200 text-zinc-600 font-bold text-xs transition-all cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 4-Card Bento Metrics Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: 'Total Articles',
              val: stats.total,
              icon: FileText,
              color: 'text-zinc-950 bg-zinc-100',
            },
            {
              label: 'Published (Live)',
              val: stats.published,
              icon: CheckCircle2,
              color: 'text-emerald-700 bg-emerald-50 border border-emerald-200/60',
            },
            {
              label: 'Drafts',
              val: stats.draft,
              icon: Clock,
              color: 'text-amber-700 bg-amber-50 border border-amber-200/60',
            },
            {
              label: 'Featured Spotlight',
              val: stats.featured,
              icon: Star,
              color: 'text-red-600 bg-red-50 border border-red-200/60',
            },
          ].map((card, i) => {
            const Icon = card.icon;
            return (
              <div
                key={i}
                className="bg-white rounded-2xl p-5 border border-zinc-200/90 shadow-xs flex items-center justify-between"
              >
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    {card.label}
                  </p>
                  <p className="text-2xl sm:text-3xl font-bold text-zinc-950 mt-1 font-['Marcellus']">
                    {card.val}
                  </p>
                </div>
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center ${card.color}`}
                >
                  <Icon className="w-5 h-5" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white rounded-2xl p-4 border border-zinc-200/90 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, slug, excerpt, or category..."
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3.5 py-2.5 text-xs font-semibold bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-700 focus:outline-none focus:border-red-600"
            >
              <option value="all">All Categories</option>
              {availableCategories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <div className="flex bg-zinc-100 p-1 rounded-xl">
              {[
                { id: 'all', label: 'All' },
                { id: 'published', label: 'Published' },
                { id: 'draft', label: 'Drafts' },
              ].map((st) => (
                <button
                  key={st.id}
                  onClick={() => setStatusFilter(st.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    statusFilter === st.id
                      ? 'bg-zinc-950 text-white shadow-2xs'
                      : 'text-zinc-500 hover:text-zinc-900'
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Blog Posts List */}
        {loading ? (
          <div className="bg-white rounded-2xl p-16 border border-zinc-200/80 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-7 h-7 text-red-600 animate-spin" />
            <p className="text-sm text-zinc-500">Loading articles from MongoDB...</p>
          </div>
        ) : blogs.length === 0 ? (
          <div className="bg-white rounded-2xl p-16 border border-zinc-200/80 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-zinc-950">No blog posts found</h3>
              <p className="text-xs text-zinc-500 mt-1">
                Create your first SEO-optimized article with structured schemas, FAQs, and comparison tables.
              </p>
            </div>
            <button
              onClick={openCreateModal}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700 transition-colors"
            >
              <Plus className="w-4 h-4" /> Create First Article
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3.5">
            {blogs.map((post) => {
              const postId = post.id || post._id;
              const isPublished = post.status === 'published' || post.published;
              return (
                <div
                  key={postId}
                  className="bg-white rounded-2xl p-4 sm:p-5 border border-zinc-200/90 shadow-xs hover:shadow-md hover:border-zinc-300 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start sm:items-center gap-4 min-w-0 flex-1">
                    <div className="w-24 h-20 rounded-xl overflow-hidden bg-zinc-100 shrink-0 border border-zinc-200/60 relative">
                      <img
                        src={
                          post.imageUrl ||
                          post.image_url ||
                          'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80'
                        }
                        alt={post.altText || post.title}
                        className="w-full h-full object-cover"
                      />
                      {post.featured && (
                        <span className="absolute top-1.5 left-1.5 w-5 h-5 rounded-full bg-amber-400 text-white flex items-center justify-center shadow">
                          <Star className="w-3 h-3 fill-current" />
                        </span>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <button
                          onClick={() => handleQuickToggleStatus(post)}
                          title="Click to toggle Published / Draft status"
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider cursor-pointer transition-colors ${
                            isPublished
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isPublished ? 'bg-emerald-500' : 'bg-amber-500'
                            }`}
                          />
                          {isPublished ? 'Published' : 'Draft'}
                        </button>

                        <span className="px-2.5 py-0.5 rounded-full bg-red-50 text-red-700 text-[11px] font-semibold">
                          {post.category || 'Development'}
                        </span>

                        <span className="text-[11px] text-zinc-400 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {post.createdAt
                            ? new Date(post.createdAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })
                            : '—'}
                        </span>

                        <span className="text-[11px] text-zinc-400">
                          • {post.read_time || `${post.readTime || 5} Min. Read`}
                        </span>
                      </div>

                      <h3 className="font-['Marcellus'] font-bold text-zinc-950 text-base sm:text-lg truncate">
                        {post.title}
                      </h3>
                      <p className="text-xs text-zinc-500 line-clamp-1 mt-0.5">
                        {post.metaDescription || post.excerpt}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <button
                      onClick={() => handleQuickToggleFeatured(post)}
                      title={
                        post.featured
                          ? 'Featured Article (Click to unfeature)'
                          : 'Mark as Featured Article'
                      }
                      className={`p-2 rounded-xl border transition-colors ${
                        post.featured
                          ? 'bg-amber-50 border-amber-200 text-amber-500'
                          : 'border-zinc-200 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-50'
                      }`}
                    >
                      <Star className={`w-4 h-4 ${post.featured ? 'fill-current' : ''}`} />
                    </button>

                    <Link
                      href={`/blog/${post.slug}`}
                      target="_blank"
                      title="Open Public Article Page"
                      className="p-2 rounded-xl border border-zinc-200 text-zinc-600 hover:text-red-600 hover:bg-red-50/50 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>

                    <button
                      onClick={() => openEditModal(post)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-zinc-950 text-white text-xs font-semibold hover:bg-red-600 transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      Edit
                    </button>

                    <button
                      onClick={() => setDeleteConfirmId(postId)}
                      className="p-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                      title="Delete Article"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirmId && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-zinc-200 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-zinc-950 font-['Marcellus']">
                  Delete Article Permanently?
                </h3>
                <p className="text-xs text-zinc-500 mt-1">
                  This action cannot be undone. The article and its URL slug will be removed from MongoDB.
                </p>
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  className="px-4 py-2 rounded-xl border border-zinc-200 text-xs font-semibold text-zinc-600 hover:bg-zinc-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirmId)}
                  className="px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-semibold hover:bg-red-700"
                >
                  Yes, Delete Permanently
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
