'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  ArrowLeft,
  Save,
  Send,
  Eye,
  Plus,
  Trash2,
  Sparkles,
  Image as ImageIcon,
  Calendar,
  Clock,
  Globe,
  CheckCircle2,
  HelpCircle,
  BookOpen,
  Megaphone,
  FileText,
  Upload,
  Loader2,
  Star,
  LayoutGrid,
  ChevronDown,
  ChevronUp,
  Columns,
  Maximize2,
  UserCheck,
  Wand2,
  Link2,
  X,
} from 'lucide-react';
import { blogService } from '@/services/blogService';
import {
  parseArticleMarkdown,
  BLOG_SNIPPETS,
  formatInlineText,
  stripMarkdown,
  extractInlinePasteMarkdown,
  hasRichFormatting,
} from '@/utils/articleParser';
import {
  parseCmsSections,
  composeCmsSections,
  DEFAULT_CTA,
  createEmptyFaqSlots,
} from '@/utils/cmsSectionParser';
import CustomTableEditorModal from './CustomTableEditorModal';
import RichWysiwygEditor from './RichWysiwygEditor';
import ArticleFullscreenPreviewModal from './ArticleFullscreenPreviewModal';

const DEFAULT_CATEGORIES = [
  'AI & Automation',
  'Web Development',
  'SaaS & MVP',
  'Technical SEO',
  'Cloud & DevOps',
  'UI/UX & Product Design',
  'Case Studies & ROI',
];

const STOCK_PRESET_IMAGES = [
  {
    label: 'Next.js & Modern Code',
    url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1400&auto=format&fit=crop&q=80',
  },
  {
    label: 'AI Neural Architecture',
    url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1400&auto=format&fit=crop&q=80',
  },
  {
    label: 'SaaS Analytics Dashboard',
    url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1400&auto=format&fit=crop&q=80',
  },
  {
    label: 'Executive Strategy & Team',
    url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1400&auto=format&fit=crop&q=80',
  },
];

const AUTHOR_PRESETS = [
  {
    name: 'WebMavien Engineering Team',
    role: 'Senior Full-Stack & AI Architects',
    bio: 'The WebMavien Engineering Team specializes in high-performance Next.js architectures, custom AI agent workflows, and scalable SaaS platforms.',
  },
  {
    name: 'WebMavien AI Lab',
    role: 'LLM & Autonomous Agent Specialists',
    bio: 'Our AI Lab designs production-grade RAG pipelines, custom OpenAI/Anthropic integrations, and automated enterprise workflows.',
  },
  {
    name: 'WebMavien Growth & SEO Desk',
    role: 'Technical SEO & Conversion Strategists',
    bio: 'Focused on programmatic SEO, Core Web Vitals optimization, structured JSON-LD schema engineering, and high-converting digital experiences.',
  },
];

function slugifyText(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function toDateInputValue(isoString) {
  if (!isoString) return new Date().toISOString().slice(0, 10);
  try {
    return new Date(isoString).toISOString().slice(0, 10);
  } catch {
    return new Date().toISOString().slice(0, 10);
  }
}

export default function WordPressBlogEditor({
  initialPost = null,
  onCancel,
  onSaved,
}) {
  const isEditing = Boolean(initialPost?.id || initialPost?._id);

  const initialSections = useMemo(
    () => parseCmsSections(initialPost?.content || ''),
    [initialPost]
  );

  // 1. Core Metadata & SEO State
  const [title, setTitle] = useState(initialPost?.title || '');
  const [slug, setSlug] = useState(initialPost?.slug || '');
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(Boolean(initialPost?.slug));
  const [category, setCategory] = useState(initialPost?.category || DEFAULT_CATEGORIES[0]);
  const [customCategories, setCustomCategories] = useState([]);
  const [showNewCategoryModal, setShowNewCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  const [author, setAuthor] = useState(initialPost?.author || AUTHOR_PRESETS[0].name);
  const [authorRole, setAuthorRole] = useState(
    initialPost?.authorRole || initialPost?.author_role || AUTHOR_PRESETS[0].role
  );
  const [authorBio, setAuthorBio] = useState(
    initialPost?.authorBio || initialPost?.author_bio || AUTHOR_PRESETS[0].bio
  );
  const [showAuthorModal, setShowAuthorModal] = useState(false);

  const [imageUrl, setImageUrl] = useState(
    initialPost?.imageUrl || initialPost?.image_url || STOCK_PRESET_IMAGES[0].url
  );
  const [showImageModal, setShowImageModal] = useState(false);
  const [altText, setAltText] = useState(initialPost?.altText || initialPost?.alt_text || '');
  const [schemaCaption, setSchemaCaption] = useState(
    initialPost?.schemaCaption || initialPost?.schema_caption || ''
  );

  // SEO & Dates
  const [metaTitle, setMetaTitle] = useState(
    initialPost?.metaTitle || initialPost?.meta_title || initialPost?.title || ''
  );
  const [metaDescription, setMetaDescription] = useState(
    initialPost?.metaDescription || initialPost?.meta_description || initialPost?.excerpt || ''
  );
  const [breadcrumbTitle, setBreadcrumbTitle] = useState(
    initialPost?.breadcrumbTitle || initialPost?.breadcrumb_title || ''
  );
  const [publishedDate, setPublishedDate] = useState(
    toDateInputValue(initialPost?.createdAt || initialPost?.published_at)
  );
  const [updatedDate, setUpdatedDate] = useState(
    toDateInputValue(initialPost?.updatedAt || initialPost?.createdAt)
  );
  const [readTime, setReadTime] = useState(
    initialPost?.readTime ? `${String(initialPost.readTime).replace(/[^\d]/g, '') || 5} Min. Read` : '6 Min. Read'
  );
  const [chatGptLink, setChatGptLink] = useState(
    initialPost?.chatGptLink || initialPost?.chatgpt_link || ''
  );
  const [status, setStatus] = useState(
    initialPost?.status || (initialPost?.published === false ? 'draft' : 'published')
  );
  const [featured, setFeatured] = useState(Boolean(initialPost?.featured));

  // 2. Structured Content Sections
  const [summary, setSummary] = useState(initialSections.summary);
  const [takeawaysHeading, setTakeawaysHeading] = useState(
    initialSections.takeawaysHeading || 'Key Takeaways: Executive Summary'
  );
  const [takeawaysLead, setTakeawaysLead] = useState(initialSections.takeawaysLead || '');
  const [takeaways, setTakeaways] = useState(initialSections.takeaways);
  const [body, setBody] = useState(initialSections.body);
  const [resources, setResources] = useState(initialSections.resources);
  const [faqs, setFaqs] = useState(initialSections.faqs || createEmptyFaqSlots(8));
  const [cta, setCta] = useState(initialSections.cta || DEFAULT_CTA);

  // UI & Modal Controls
  const [activeSectionTab, setActiveSectionTab] = useState('all'); // 'all' | 'content' | 'seo' | 'cta'
  const [splitPreview, setSplitPreview] = useState(false);
  const [fullscreenPreviewOpen, setFullscreenPreviewOpen] = useState(false);
  const [tableModalOpen, setTableModalOpen] = useState(false);
  const [uploadingHero, setUploadingHero] = useState(false);
  const [saving, setSaving] = useState(false);
  const [openFaqSlot, setOpenFaqSlot] = useState(0);

  // Available categories (Default + current post category + newly added)
  const allCategories = useMemo(() => {
    const set = new Set([...DEFAULT_CATEGORIES, ...customCategories]);
    if (category) set.add(category);
    return Array.from(set);
  }, [customCategories, category]);

  // Auto-generate slug, breadcrumb, and default SEO title when typing Title on a new post
  const handleTitleChange = (val) => {
    setTitle(val);
    if (!slugManuallyEdited) {
      setSlug(slugifyText(val));
    }
    if (!breadcrumbTitle) {
      setBreadcrumbTitle(val);
    }
    if (!metaTitle) {
      setMetaTitle(`${val} | WebMavien`.slice(0, 65));
    }
    if (!altText) {
      setAltText(val);
    }
  };

  // Compose unified markdown for database storage & live preview
  const formattedReviewDate = useMemo(() => {
    try {
      return new Date(updatedDate).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return '';
    }
  }, [updatedDate]);

  const composedMarkdown = useMemo(
    () =>
      composeCmsSections({
        summary,
        takeawaysHeading,
        takeawaysLead,
        takeaways,
        body,
        resources,
        standDate: formattedReviewDate,
        faqs,
        cta,
      }),
    [summary, takeawaysHeading, takeawaysLead, takeaways, body, resources, formattedReviewDate, faqs, cta]
  );

  // Auto-calculate reading time from word count
  const wordCount = useMemo(() => {
    const words = composedMarkdown
      .replace(/:::\w+/g, '')
      .replace(/[#*|>-]/g, ' ')
      .trim()
      .split(/\s+/)
      .filter(Boolean).length;
    return words;
  }, [composedMarkdown]);

  const autoCalculateReadTime = () => {
    const mins = Math.max(2, Math.ceil(wordCount / 200));
    setReadTime(`${mins} Min. Read`);
  };

  // Hero Image Upload Handler
  const handleHeroFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingHero(true);
    try {
      const uploadedUrl = await blogService.uploadImage(file);
      setImageUrl(uploadedUrl);
    } catch (err) {
      alert(err.message || 'Image upload failed');
    } finally {
      setUploadingHero(false);
      e.target.value = '';
    }
  };

  // Takeaways array helpers
  const updateTakeaway = (idx, val) => {
    const next = [...takeaways];
    next[idx] = val;
    setTakeaways(next);
  };
  const addTakeaway = () => setTakeaways([...takeaways, '']);
  const removeTakeaway = (idx) => {
    if (takeaways.length <= 1) return;
    setTakeaways(takeaways.filter((_, i) => i !== idx));
  };

  // Resources array helpers
  const updateResource = (idx, val) => {
    const next = [...resources];
    next[idx] = val;
    setResources(next);
  };
  const addResource = () => setResources([...resources, '']);
  const removeResource = (idx) => {
    if (resources.length <= 1) {
      setResources(['']);
      return;
    }
    setResources(resources.filter((_, i) => i !== idx));
  };

  // FAQ 8-slot helper
  const updateFaqSlot = (idx, field, val) => {
    const next = faqs.map((item, i) => (i === idx ? { ...item, [field]: val } : item));
    setFaqs(next);
  };

  // Save / Publish Handler
  const handleSave = async (targetStatus = status) => {
    if (!title.trim()) {
      alert('Please enter an Article Title (H1).');
      return;
    }
    if (!body.trim() && !summary.trim()) {
      alert('Please enter article content.');
      return;
    }

    setSaving(true);
    try {
      const plainSummary = stripMarkdown(summary);
      const plainMetaDesc = stripMarkdown(metaDescription);

      const finalExcerpt =
        plainMetaDesc.trim() ||
        plainSummary.slice(0, 160).trim() ||
        stripMarkdown(body).slice(0, 160).trim();

      const readTimeNumeric = String(readTime || '5').replace(/[^\d]/g, '') || '5';
      const isPublished = targetStatus === 'published';

      const payload = {
        title: title.trim(),
        slug: slug.trim() || slugifyText(title),
        category: category.trim() || 'Development',
        excerpt: finalExcerpt,
        metaTitle: metaTitle.trim() || title.trim(),
        metaDescription: finalExcerpt,
        breadcrumbTitle: breadcrumbTitle.trim() || title.trim(),
        content: composedMarkdown,
        imageUrl: imageUrl.trim() || STOCK_PRESET_IMAGES[0].url,
        altText: altText.trim() || title.trim(),
        schemaCaption: schemaCaption.trim(),
        author: author.trim() || 'WebMavien Engineering Team',
        authorRole: authorRole.trim() || 'Senior Full-Stack & AI Architects',
        authorBio: authorBio.trim(),
        readTime: readTimeNumeric,
        chatGptLink: chatGptLink.trim(),
        status: targetStatus,
        published: isPublished,
        featured: Boolean(featured),
        createdAt: publishedDate ? new Date(publishedDate).toISOString() : new Date().toISOString(),
        updatedAt: updatedDate ? new Date(updatedDate).toISOString() : new Date().toISOString(),
      };

      const postId = initialPost?.id || initialPost?._id;
      if (isEditing && postId) {
        await blogService.updateBlog(postId, payload);
      } else {
        await blogService.createBlog(payload);
      }

      if (onSaved) onSaved();
    } catch (err) {
      alert(err.message || 'Error saving article');
    } finally {
      setSaving(false);
    }
  };

  // Filtered body snippets (since Takeaways, FAQ, Sources, CTA have dedicated visual form builders!)
  const bodyDesignSnippets = useMemo(
    () =>
      BLOG_SNIPPETS.filter((s) =>
        ['tip', 'warning', 'steps', 'grid', 'casestudy'].includes(s.id)
      ),
    []
  );

  // Live parsed preview for split screen
  const liveParsed = useMemo(
    () => parseArticleMarkdown(composedMarkdown, { extractLead: true }),
    [composedMarkdown]
  );

  return (
    <div className="min-h-screen bg-zinc-50 pb-24">
      {/* Sticky Top CMS Action Header */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-zinc-200 px-4 sm:px-8 py-3.5 shadow-xs">
        <div className="max-w-[1600px] mx-auto flex flex-wrap items-center justify-between gap-4">
          {/* Left: Back & Post Status */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-xs font-bold text-zinc-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Overview
            </button>

            <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-zinc-200">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  status === 'published' ? 'bg-emerald-500' : 'bg-amber-500'
                }`}
              />
              <span className="text-xs font-bold text-zinc-900">
                {isEditing ? 'Edit Article' : 'Create New Article'}
              </span>
              <span className="text-[11px] text-zinc-400 font-medium">
                ({wordCount} words · {readTime})
              </span>
            </div>
          </div>

          {/* Center: Section Filter Tabs */}
          <div className="flex items-center bg-zinc-100 p-1 rounded-xl border border-zinc-200/60">
            {[
              { id: 'all', label: 'All Fields' },
              { id: 'content', label: 'Content' },
              { id: 'seo', label: 'SEO & Dates' },
              { id: 'cta', label: 'Sidebar CTA' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveSectionTab(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeSectionTab === tab.id
                    ? 'bg-zinc-950 text-white shadow-2xs'
                    : 'text-zinc-600 hover:text-zinc-950'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Right: Preview, Save Draft & Publish Actions */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSplitPreview((v) => !v)}
              title="Toggle Split-Screen Live Preview"
              className={`hidden xl:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-bold transition-all ${
                splitPreview
                  ? 'bg-red-50 border-red-600 text-red-700'
                  : 'bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50'
              }`}
            >
              <Columns className="w-4 h-4" />
              Split View
            </button>

            <button
              type="button"
              onClick={() => setFullscreenPreviewOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-950 text-white hover:bg-zinc-800 text-xs font-bold shadow-xs transition-all"
            >
              <Maximize2 className="w-3.5 h-3.5 text-red-500" />
              <span>Preview</span>
            </button>

            <button
              type="button"
              disabled={saving}
              onClick={() => {
                setStatus('draft');
                handleSave('draft');
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-zinc-300 bg-white hover:bg-zinc-50 text-zinc-800 text-xs font-bold transition-all disabled:opacity-50"
            >
              {saving && status === 'draft' ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Save className="w-3.5 h-3.5" />
              )}
              Save Draft
            </button>

            <button
              type="button"
              disabled={saving}
              onClick={() => {
                setStatus('published');
                handleSave('published');
              }}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md shadow-red-600/20 transition-all disabled:opacity-50"
            >
              {saving && status === 'published' ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Send className="w-3.5 h-3.5" />
              )}
              {isEditing && status === 'published' ? 'Save Changes' : 'Publish Now'}
            </button>
          </div>
        </div>
      </header>

      {/* Main Editor Container (Supports Single or Split-View) */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 pt-8">
        <div
          className={`grid grid-cols-1 ${
            splitPreview ? 'xl:grid-cols-12 gap-8' : 'max-w-5xl mx-auto'
          } items-start`}
        >
          {/* LEFT / MAIN COLUMN: STRUCTURED CMS FORM */}
          <div className={`${splitPreview ? 'xl:col-span-7' : ''} space-y-8`}>
            {/* =========================================================
                SECTION 1: CORE ARTICLE DETAILS (Title, Category, Image)
               ========================================================= */}
            {(activeSectionTab === 'all' || activeSectionTab === 'content') && (
              <div className="bg-white rounded-3xl border border-zinc-200/90 p-6 sm:p-8 shadow-xs space-y-6">
                <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
                  <div className="flex items-center gap-3">
                    <span className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                      <FileText className="w-5 h-5" />
                    </span>
                    <div>
                      <h2 className="font-['Marcellus'] text-xl font-bold text-zinc-950">
                        1. Article Core Details & Hero Image
                      </h2>
                      <p className="text-xs text-zinc-500">
                        Main H1 headline, category, author credentials, and hero banner
                      </p>
                    </div>
                  </div>

                  {/* Featured Toggle */}
                  <label className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-amber-50/70 border border-amber-200/80 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={featured}
                      onChange={(e) => setFeatured(e.target.checked)}
                      className="rounded text-amber-500 focus:ring-amber-500"
                    />
                    <Star
                      className={`w-3.5 h-3.5 ${
                        featured ? 'fill-amber-400 text-amber-500' : 'text-zinc-400'
                      }`}
                    />
                    <span className="text-xs font-bold text-amber-950">Featured Article</span>
                  </label>
                </div>

                {/* Title (H1) */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-2">
                    Article Title (H1) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="e.g. How to Build a Scalable AI SaaS Platform with Next.js 16"
                    className="w-full px-4 py-3.5 rounded-2xl border border-zinc-200 bg-zinc-50/40 font-['Marcellus'] text-xl sm:text-2xl font-bold text-zinc-950 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600 transition-all"
                  />
                </div>

                {/* Category & Author Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Category Selector + New Category Modal Trigger */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-zinc-600">
                        Category <span className="text-red-500">*</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowNewCategoryModal(true)}
                        className="text-[11px] font-bold text-red-600 hover:underline flex items-center gap-0.5"
                      >
                        <Plus className="w-3 h-3" /> + Create New Category
                      </button>
                    </div>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 bg-white text-sm font-semibold text-zinc-800 focus:outline-none focus:border-red-600"
                    >
                      {allCategories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Author with Pop-up Selection Modal */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-zinc-600">
                        Author (E-E-A-T Signal)
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowAuthorModal(true)}
                        className="text-[11px] font-bold text-red-600 hover:underline flex items-center gap-1"
                      >
                        <UserCheck className="w-3 h-3" /> Choose / Customize Author
                      </button>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        placeholder="WebMavien Engineering Team"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 bg-white text-sm text-zinc-800 focus:outline-none focus:border-red-600"
                      />
                    </div>
                  </div>
                </div>

                {/* Featured Image + Alt Text + Schema Caption */}
                <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200/80 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-red-600" />
                      Featured Image (Hero Image)
                    </label>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setShowImageModal(true)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-red-600 text-white hover:bg-red-700 text-xs font-bold transition-colors shadow-2xs"
                      >
                        <ImageIcon className="w-3.5 h-3.5" /> Choose / Upload Image
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    {/* Thumbnail Preview */}
                    <div
                      onClick={() => setShowImageModal(true)}
                      className="md:col-span-4 h-36 rounded-xl overflow-hidden bg-zinc-200 border border-zinc-300 relative cursor-pointer group"
                    >
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={altText || title || 'Preview'}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-zinc-400">
                          Click to select image
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="px-3 py-1.5 rounded-lg bg-white text-zinc-900 text-xs font-bold shadow">
                          Change Image
                        </span>
                      </div>
                    </div>

                    {/* URL + Alt Text + Schema Caption */}
                    <div className="md:col-span-8 space-y-3">
                      <div>
                        <label className="block text-[11px] font-bold text-zinc-600 mb-1">
                          Alt Text (Image SEO & Accessibility)
                        </label>
                        <input
                          type="text"
                          value={altText}
                          onChange={(e) => setAltText(e.target.value)}
                          placeholder="Descriptive alt text for Google Image Search & screen readers..."
                          className="w-full px-3 py-2 rounded-xl border border-zinc-200 bg-white text-xs text-zinc-800 focus:outline-none focus:border-red-600"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-zinc-600 mb-1">
                          Schema / Figure Caption (Optional)
                        </label>
                        <input
                          type="text"
                          value={schemaCaption}
                          onChange={(e) => setSchemaCaption(e.target.value)}
                          placeholder="e.g. Architecture diagram of a multi-tenant AI SaaS platform"
                          className="w-full px-3 py-2 rounded-xl border border-zinc-200 bg-white text-xs text-zinc-800 focus:outline-none focus:border-red-600"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* =========================================================
                SECTION 2: STRUCTURED ARTICLE CONTENT
               ========================================================= */}
            {(activeSectionTab === 'all' || activeSectionTab === 'content') && (
              <div className="bg-white rounded-3xl border border-zinc-200/90 p-6 sm:p-8 shadow-xs space-y-8">
                <div className="border-b border-zinc-100 pb-4">
                  <h2 className="font-['Marcellus'] text-xl font-bold text-zinc-950">
                    2. Structured Article Content
                  </h2>
                  <p className="text-xs text-zinc-500">
                    Summary, Key Takeaways, Main Article Body, Authoritative Sources, and FAQs
                  </p>
                </div>

                {/* 2A. Summary (Lead Paragraph) */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-700">
                      Summary (Lead Paragraph) <span className="text-red-500">*</span>
                    </label>
                    <span className="text-[11px] text-zinc-400">
                      Appears in bold at the very top of the article (supports links & formatting)
                    </span>
                  </div>
                  <RichWysiwygEditor
                    value={summary}
                    onChange={setSummary}
                    placeholder="2–3 compelling opening sentences summarizing the core value of this guide..."
                    minHeight={120}
                    compact={true}
                  />
                </div>

                {/* 2B. Key Takeaways (List Builder) */}
                <div className="p-5 rounded-2xl bg-gradient-to-br from-zinc-50 via-white to-red-50/30 border border-zinc-200/90 border-l-4 border-l-red-600 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h3 className="font-['Marcellus'] font-bold text-base text-zinc-950 flex items-center gap-2">
                        <span>⚡</span> Key Takeaways Box (Executive Summary)
                      </h3>
                      <p className="text-xs text-zinc-600">
                        Custom heading, optional intro sentence, and bullet points with links/bold support
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={addTakeaway}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700 transition-colors shadow-2xs"
                    >
                      <Plus className="w-3.5 h-3.5" /> + Add Point
                    </button>
                  </div>

                  {/* Custom Heading & Optional Lead Sentence for Takeaways */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="block text-[11px] font-bold text-zinc-700 mb-1">
                        Box Heading
                      </label>
                      <input
                        type="text"
                        value={takeawaysHeading}
                        onChange={(e) => setTakeawaysHeading(e.target.value)}
                        placeholder="Key Takeaways: Executive Summary"
                        className="w-full px-3 py-2 rounded-xl border border-zinc-200 bg-white text-xs font-bold text-zinc-900 focus:outline-none focus:border-red-600"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-zinc-700 mb-1">
                        Intro Lead Sentence (Optional)
                      </label>
                      <input
                        type="text"
                        value={takeawaysLead}
                        onChange={(e) => setTakeawaysLead(e.target.value)}
                        onPaste={(e) => {
                          const html = e.clipboardData?.getData('text/html');
                          if (html && html.trim()) {
                            e.preventDefault();
                            const md = extractInlinePasteMarkdown(e.clipboardData, {
                              singleLine: true,
                            });
                            setTakeawaysLead(md);
                          }
                        }}
                        placeholder="e.g. Everything CTOs and founders need to know in 60 seconds:"
                        className="w-full px-3 py-2 rounded-xl border border-zinc-200 bg-white text-xs text-zinc-800 focus:outline-none focus:border-red-600"
                      />
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    {takeaways.map((item, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-red-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
                            ✓
                          </span>
                          <input
                            type="text"
                            value={item}
                            onChange={(e) => updateTakeaway(idx, e.target.value)}
                            onPaste={(e) => {
                              const html = e.clipboardData?.getData('text/html');
                              if (html && html.trim()) {
                                e.preventDefault();
                                const md = extractInlinePasteMarkdown(e.clipboardData, {
                                  singleLine: true,
                                });
                                updateTakeaway(idx, md);
                              }
                            }}
                            placeholder={`Key Takeaway #${idx + 1} (e.g. **3x Faster Launch:** Modular Next.js architecture cuts delivery time)...`}
                            className="flex-1 px-3.5 py-2 rounded-xl border border-zinc-200 bg-white text-xs text-zinc-800 focus:outline-none focus:border-red-600"
                          />
                          {takeaways.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeTakeaway(idx)}
                              className="p-2 rounded-lg text-zinc-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                        {hasRichFormatting(item) && (
                          <div className="ml-8 px-3 py-1 rounded-lg bg-white/90 border border-zinc-200 text-[11px] text-zinc-700 flex items-center gap-1.5">
                            <span className="text-[9px] font-bold uppercase tracking-wider text-red-600 shrink-0">
                              Preview:
                            </span>
                            <span
                              dangerouslySetInnerHTML={{ __html: formatInlineText(item) }}
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2C. Article Body (Rich WYSIWYG Editor + Table Builder) */}
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-zinc-700">
                        Article Body (Main Content) <span className="text-red-500">*</span>
                      </label>
                      <p className="text-[11px] text-zinc-400">
                        Every <strong className="text-zinc-600">Heading 2 (H2)</strong> automatically appears in the sticky Table of Contents
                      </p>
                    </div>
                  </div>

                  <RichWysiwygEditor
                    value={body}
                    onChange={setBody}
                    onOpenTableBuilder={() => setTableModalOpen(true)}
                    snippets={bodyDesignSnippets}
                    minHeight={420}
                    placeholder="Write your main article sections here. Use the toolbar above for H2/H3 headings, bold text, links, images, and interactive tables..."
                  />
                </div>

                {/* 2D. Authoritative Resources (List Builder with Link Support) */}
                <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200/90 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h3 className="font-['Marcellus'] font-bold text-base text-zinc-950 flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-red-600" />
                        Authoritative Resources & References (E-E-A-T)
                      </h3>
                      <p className="text-xs text-zinc-500">
                        Format: <code className="bg-white px-1.5 py-0.5 rounded border">Source Title | https://url.com</code> or Markdown links <code className="bg-white px-1.5 py-0.5 rounded border">[Label](https://...)</code>
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={addResource}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white border border-zinc-200 text-xs font-bold text-zinc-700 hover:border-red-600 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" /> + Add Source
                    </button>
                  </div>

                  <div className="space-y-2">
                    {resources.map((res, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-red-600 w-5 text-center">
                            ↗
                          </span>
                          <input
                            type="text"
                            value={res}
                            onChange={(e) => updateResource(idx, e.target.value)}
                            onPaste={(e) => {
                              const html = e.clipboardData?.getData('text/html');
                              if (html && html.trim()) {
                                e.preventDefault();
                                const md = extractInlinePasteMarkdown(e.clipboardData, {
                                  singleLine: true,
                                });
                                updateResource(idx, md);
                              }
                            }}
                            placeholder="e.g. Google Search Central — Structured Data Docs | https://developers.google.com/search/docs"
                            className="flex-1 px-3.5 py-2 rounded-xl border border-zinc-200 bg-white text-xs text-zinc-800 focus:outline-none focus:border-red-600"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const url = window.prompt('Enter source URL:', 'https://');
                              if (!url) return;
                              const label =
                                window.prompt('Enter display title for source:', res || 'Official Documentation') || url;
                              updateResource(idx, `${label.trim()} | ${url.trim()}`);
                            }}
                            title="Add Link to Source"
                            className="px-2.5 py-2 rounded-xl border border-zinc-200 bg-white hover:border-red-600 text-xs font-semibold text-zinc-700 flex items-center gap-1 shrink-0"
                          >
                            <Link2 className="w-3.5 h-3.5 text-red-600" /> Link
                          </button>
                          <button
                            type="button"
                            onClick={() => removeResource(idx)}
                            className="p-2 rounded-lg text-zinc-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        {(res.includes('|') || hasRichFormatting(res)) && (
                          <div className="ml-7 px-3 py-1 rounded-lg bg-white border border-zinc-200/80 text-[11px] text-zinc-600 flex items-center gap-1.5">
                            <span className="text-[9px] font-bold uppercase tracking-wider text-red-600">
                              Link Preview:
                            </span>
                            {res.includes('|') ? (
                              <a
                                href={res.split('|')[1]?.trim()}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-red-600 font-semibold underline"
                              >
                                {res.split('|')[0]?.trim()} ↗
                              </a>
                            ) : (
                              <span
                                dangerouslySetInnerHTML={{ __html: formatInlineText(res) }}
                              />
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2E. Dedicated FAQ Section (Up to 8 Questions & Answers) */}
                <div className="p-5 sm:p-6 rounded-2xl bg-zinc-50/70 border border-zinc-200/90 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="w-8 h-8 rounded-xl bg-red-600 text-white flex items-center justify-center">
                        <HelpCircle className="w-4 h-4" />
                      </span>
                      <div>
                        <h3 className="font-['Marcellus'] font-bold text-base text-zinc-950">
                          FAQ Section (Up to 8 Questions & Answers — Auto Google FAQPage Schema)
                        </h3>
                        <p className="text-xs text-zinc-500">
                          Filled FAQ slots automatically render as accordions and generate Google Rich Snippet JSON-LD
                        </p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-white border border-zinc-200 text-xs font-bold text-red-600">
                      {faqs.filter((f) => f.q.trim() && f.a.trim()).length} / 8 Filled
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-2.5">
                    {faqs.map((faq, idx) => {
                      const isFilled = Boolean(faq.q.trim() || faq.a.trim());
                      const isOpen = openFaqSlot === idx;
                      return (
                        <div
                          key={idx}
                          className={`rounded-xl border transition-all overflow-hidden ${
                            isFilled
                              ? 'bg-white border-red-600/30 shadow-2xs'
                              : 'bg-white/60 border-zinc-200/80'
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => setOpenFaqSlot(isOpen ? -1 : idx)}
                            className="w-full px-4 py-3 flex items-center justify-between text-left"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <span
                                className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 ${
                                  isFilled
                                    ? 'bg-red-600 text-white'
                                    : 'bg-zinc-100 text-zinc-500'
                                }`}
                              >
                                Q{idx + 1}
                              </span>
                              <span
                                className={`text-xs truncate ${
                                  faq.q.trim()
                                    ? 'font-bold text-zinc-900'
                                    : 'text-zinc-400 italic'
                                }`}
                              >
                                {faq.q.trim() || `FAQ Question #${idx + 1} (Optional — click to edit)`}
                              </span>
                            </div>
                            {isOpen ? (
                              <ChevronUp className="w-4 h-4 text-zinc-400 shrink-0" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-zinc-400 shrink-0" />
                            )}
                          </button>

                          {isOpen && (
                            <div className="px-4 pb-4 pt-1 border-t border-zinc-100 space-y-3">
                              <div>
                                <label className="block text-[11px] font-bold text-zinc-600 mb-1">
                                  FAQ Question {idx + 1}
                                </label>
                                <input
                                  type="text"
                                  value={faq.q}
                                  onChange={(e) => updateFaqSlot(idx, 'q', e.target.value)}
                                  placeholder="e.g. How long does it take to build a custom AI SaaS MVP?"
                                  className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 bg-zinc-50/50 text-xs font-bold text-zinc-900 focus:bg-white focus:outline-none focus:border-red-600"
                                />
                              </div>
                              <div>
                                <div className="flex items-center justify-between mb-1">
                                  <label className="block text-[11px] font-bold text-zinc-600">
                                    FAQ Answer {idx + 1} (Supports links, bold & paste)
                                  </label>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const url = window.prompt('Enter URL:', 'https://');
                                      if (!url) return;
                                      const label =
                                        window.prompt('Enter link text:', 'Learn more') || url;
                                      updateFaqSlot(
                                        idx,
                                        'a',
                                        `${faq.a ? faq.a + ' ' : ''}[${label.trim()}](${url.trim()})`
                                      );
                                    }}
                                    className="text-[10px] font-bold text-red-600 hover:underline flex items-center gap-0.5"
                                  >
                                    <Link2 className="w-3 h-3" /> + Insert Link
                                  </button>
                                </div>
                                <textarea
                                  rows={2}
                                  value={faq.a}
                                  onChange={(e) => updateFaqSlot(idx, 'a', e.target.value)}
                                  onPaste={(e) => {
                                    const html = e.clipboardData?.getData('text/html');
                                    if (html && html.trim()) {
                                      e.preventDefault();
                                      const md = extractInlinePasteMarkdown(e.clipboardData, {
                                        singleLine: true,
                                      });
                                      updateFaqSlot(idx, 'a', md);
                                    }
                                  }}
                                  placeholder="Concise, authoritative answer (2–4 sentences)..."
                                  className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 bg-zinc-50/50 text-xs text-zinc-800 focus:bg-white focus:outline-none focus:border-red-600"
                                />
                                {hasRichFormatting(faq.a) && (
                                  <div className="mt-1.5 px-3 py-1.5 rounded-lg bg-zinc-50 border border-zinc-200 text-[11px] text-zinc-700">
                                    <span className="text-[9px] font-bold uppercase tracking-wider text-red-600 mr-1.5">
                                      Preview:
                                    </span>
                                    <span
                                      dangerouslySetInnerHTML={{
                                        __html: formatInlineText(faq.a),
                                      }}
                                    />
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* =========================================================
                SECTION 3: TECHNICAL SEO, DATES & CHATGPT LINK
               ========================================================= */}
            {(activeSectionTab === 'all' || activeSectionTab === 'seo') && (
              <div className="bg-white rounded-3xl border border-zinc-200/90 p-6 sm:p-8 shadow-xs space-y-6">
                <div className="flex items-center gap-3 border-b border-zinc-100 pb-4">
                  <span className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                    <Globe className="w-5 h-5" />
                  </span>
                  <div>
                    <h2 className="font-['Marcellus'] text-xl font-bold text-zinc-950">
                      3. Technical SEO, Slug & Dates
                    </h2>
                    <p className="text-xs text-zinc-500">
                      Meta Title, Meta Description, URL Slug, Breadcrumb, Publication Date & Reading Time
                    </p>
                  </div>
                </div>

                {/* Meta Title & Meta Description with Character Progress Counters */}
                <div className="grid grid-cols-1 gap-5">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-zinc-700">
                        Meta Title (SEO Title Tag) <span className="text-red-500">*</span>
                      </label>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setMetaTitle(`${title} | WebMavien`.slice(0, 60))}
                          className="text-[11px] font-bold text-red-600 hover:underline flex items-center gap-1"
                        >
                          <Wand2 className="w-3 h-3" /> Auto-Fill from H1
                        </button>
                        <span
                          className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                            metaTitle.length >= 45 && metaTitle.length <= 65
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-amber-50 text-amber-700'
                          }`}
                        >
                          {metaTitle.length} / 60 chars (Optimal: 50–60)
                        </span>
                      </div>
                    </div>
                    <input
                      type="text"
                      value={metaTitle}
                      onChange={(e) => setMetaTitle(e.target.value)}
                      placeholder="e.g. Custom AI & Next.js Development Guide 2026 | WebMavien"
                      className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 text-sm font-semibold text-zinc-900 focus:outline-none focus:border-red-600"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-zinc-700">
                        Meta Description <span className="text-red-500">*</span>
                      </label>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            setMetaDescription(stripMarkdown(summary).slice(0, 155).trim())
                          }
                          className="text-[11px] font-bold text-red-600 hover:underline flex items-center gap-1"
                        >
                          <Wand2 className="w-3 h-3" /> Auto-Fill from Summary
                        </button>
                        <span
                          className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                            metaDescription.length >= 120 && metaDescription.length <= 165
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-amber-50 text-amber-700'
                          }`}
                        >
                          {metaDescription.length} / 160 chars (Optimal: 120–160)
                        </span>
                      </div>
                    </div>
                    <textarea
                      rows={2}
                      value={metaDescription}
                      onChange={(e) => setMetaDescription(e.target.value)}
                      placeholder="Compelling summary for Google search results (140–160 characters)..."
                      className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 text-xs text-zinc-800 leading-relaxed focus:outline-none focus:border-red-600"
                    />
                  </div>
                </div>

                {/* Live Google SERP Preview */}
                <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/80">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-2">
                    Google Search Result Preview (SERP Snippet)
                  </p>
                  <div className="bg-white p-4 rounded-xl border border-zinc-200/70 max-w-2xl">
                    <div className="flex items-center gap-2 text-xs text-zinc-500 mb-1">
                      <span className="w-5 h-5 rounded-full bg-zinc-950 text-white text-[10px] font-bold flex items-center justify-center">
                        W
                      </span>
                      <span>webmavien.com › blog › {slug || 'article-slug'}</span>
                    </div>
                    <h4 className="text-[#1a0dab] text-base sm:text-lg font-medium hover:underline truncate">
                      {metaTitle || title || 'Article Title | WebMavien'}
                    </h4>
                    <p className="text-xs text-[#4d5156] line-clamp-2 mt-1 leading-relaxed">
                      {stripMarkdown(metaDescription) ||
                        stripMarkdown(summary) ||
                        'Enter a meta description above to preview how your article appears in Google Search.'}
                    </p>
                  </div>
                </div>

                {/* Slug & Breadcrumb Title */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-zinc-600">
                        URL Slug <span className="text-red-500">*</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setSlug(slugifyText(title));
                          setSlugManuallyEdited(false);
                        }}
                        className="text-[11px] font-semibold text-red-600 hover:underline"
                      >
                        Regenerate from Title
                      </button>
                    </div>
                    <div className="flex items-center rounded-xl border border-zinc-200 bg-zinc-50 overflow-hidden focus-within:bg-white focus-within:border-red-600">
                      <span className="px-3 py-2.5 text-xs text-zinc-400 bg-zinc-100 border-r border-zinc-200 font-mono">
                        /blog/
                      </span>
                      <input
                        type="text"
                        value={slug}
                        onChange={(e) => {
                          setSlugManuallyEdited(true);
                          setSlug(slugifyText(e.target.value));
                        }}
                        placeholder="article-slug"
                        className="w-full px-3 py-2.5 text-xs font-mono text-zinc-900 bg-transparent focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-1.5">
                      Breadcrumb Title
                    </label>
                    <input
                      type="text"
                      value={breadcrumbTitle}
                      onChange={(e) => setBreadcrumbTitle(e.target.value)}
                      placeholder="Short title for breadcrumbs..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-xs text-zinc-800 focus:outline-none focus:border-red-600"
                    />
                  </div>
                </div>

                {/* Publication Date, Updated Date, Reading Time & ChatGPT Link */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-1.5">
                      Publication Date
                    </label>
                    <input
                      type="date"
                      value={publishedDate}
                      onChange={(e) => setPublishedDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-xs text-zinc-800 focus:outline-none focus:border-red-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-1.5">
                      Updated / Reviewed Date
                    </label>
                    <input
                      type="date"
                      value={updatedDate}
                      onChange={(e) => setUpdatedDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-xs text-zinc-800 focus:outline-none focus:border-red-600"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-zinc-600">
                        Reading Time
                      </label>
                      <button
                        type="button"
                        onClick={autoCalculateReadTime}
                        className="text-[10px] font-bold text-red-600 hover:underline"
                      >
                        Calculate
                      </button>
                    </div>
                    <input
                      type="text"
                      value={readTime}
                      onChange={(e) => setReadTime(e.target.value)}
                      placeholder="6 Min. Read"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-xs text-zinc-800 focus:outline-none focus:border-red-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-1.5">
                      Summarize in ChatGPT URL
                    </label>
                    <input
                      type="text"
                      value={chatGptLink}
                      onChange={(e) => setChatGptLink(e.target.value)}
                      placeholder="https://chat.openai.com/?q=..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-xs text-zinc-800 focus:outline-none focus:border-red-600"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* =========================================================
                SECTION 4: STICKY SIDEBAR CTA BUILDER
               ========================================================= */}
            {(activeSectionTab === 'all' || activeSectionTab === 'cta') && (
              <div className="bg-white rounded-3xl border border-zinc-200/90 p-6 sm:p-8 shadow-xs space-y-6">
                <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
                  <div className="flex items-center gap-3">
                    <span className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                      <Megaphone className="w-5 h-5" />
                    </span>
                    <div>
                      <h2 className="font-['Marcellus'] text-xl font-bold text-zinc-950">
                        4. Sticky Sidebar Call-to-Action (CTA)
                      </h2>
                      <p className="text-xs text-zinc-500">
                        Conversion card displayed in the sticky left sidebar below the Table of Contents
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCta({ ...DEFAULT_CTA })}
                    className="text-xs font-semibold text-red-600 hover:underline"
                  >
                    Reset to Default
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  <div className="md:col-span-7 space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-zinc-700 mb-1">
                        CTA Heading
                      </label>
                      <input
                        type="text"
                        value={cta.heading}
                        onChange={(e) => setCta({ ...cta, heading: e.target.value })}
                        placeholder="Ready to Scale Your Digital Product?"
                        className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 text-xs font-bold text-zinc-900 focus:outline-none focus:border-red-600"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-zinc-700 mb-1">
                        CTA Description
                      </label>
                      <textarea
                        rows={2}
                        value={cta.description}
                        onChange={(e) => setCta({ ...cta, description: e.target.value })}
                        placeholder="Book a free 30-minute strategy session with WebMavien..."
                        className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 text-xs text-zinc-800 focus:outline-none focus:border-red-600"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-zinc-700 mb-1">
                          Button Text
                        </label>
                        <input
                          type="text"
                          value={cta.buttonText}
                          onChange={(e) => setCta({ ...cta, buttonText: e.target.value })}
                          placeholder="Book Free Strategy Call"
                          className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 text-xs font-bold text-zinc-900 focus:outline-none focus:border-red-600"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-zinc-700 mb-1">
                          Button Link (URL)
                        </label>
                        <input
                          type="text"
                          value={cta.buttonLink}
                          onChange={(e) => setCta({ ...cta, buttonLink: e.target.value })}
                          placeholder="/contact"
                          className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 text-xs font-mono text-zinc-800 focus:outline-none focus:border-red-600"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Live Card Preview */}
                  <div className="md:col-span-5">
                    <div className="p-6 rounded-2xl bg-gradient-to-br from-black via-zinc-900 to-red-950 text-white shadow-lg relative overflow-hidden border border-red-500/20">
                      <span className="inline-block px-2.5 py-0.5 rounded-full bg-red-600/20 border border-red-500/30 text-red-400 text-[10px] font-bold uppercase tracking-widest mb-2.5">
                        Sidebar Preview
                      </span>
                      <h3 className="font-['Marcellus'] text-lg font-bold text-white mb-2 leading-snug">
                        {cta.heading || DEFAULT_CTA.heading}
                      </h3>
                      <p className="text-xs text-white/80 leading-relaxed mb-4">
                        {cta.description || DEFAULT_CTA.description}
                      </p>
                      <span className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-red-600 text-white text-xs font-bold">
                        {cta.buttonText || DEFAULT_CTA.buttonText} →
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: LIVE SPLIT-SCREEN PREVIEW (When Toggled) */}
          {splitPreview && (
            <div className="xl:col-span-5 xl:sticky xl:top-24 bg-white rounded-3xl border border-zinc-200/90 shadow-sm overflow-hidden max-h-[calc(100vh-7rem)] flex flex-col">
              <div className="px-5 py-3.5 bg-zinc-950 text-white flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-red-500" />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Live Reader Preview
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setFullscreenPreviewOpen(true)}
                  className="text-xs text-red-400 hover:underline flex items-center gap-1 font-semibold"
                >
                  <Maximize2 className="w-3 h-3" /> Fullscreen (1:1)
                </button>
              </div>

              <div className="p-6 overflow-y-auto space-y-6 flex-1">
                {/* Mini Hero */}
                <div className="relative rounded-2xl overflow-hidden h-48 flex items-end p-5">
                  <img
                    src={imageUrl || STOCK_PRESET_IMAGES[0].url}
                    alt={altText || title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
                  <div className="relative z-10">
                    <span className="px-2.5 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-bold uppercase">
                      {category}
                    </span>
                    <h1 className="font-['Marcellus'] text-xl font-bold text-white mt-1.5 leading-snug">
                      {title || 'Untitled Blog Post'}
                    </h1>
                  </div>
                </div>

                {/* Mini TOC */}
                {liveParsed.tocItems.length > 0 && (
                  <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200/80">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 mb-2">
                      Table of Contents ({liveParsed.tocItems.length} H2 Headings)
                    </p>
                    <ul className="space-y-1 text-xs text-zinc-700">
                      {liveParsed.tocItems.map((t) => (
                        <li key={t.id} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
                          <span>{t.title}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Rendered Content */}
                {liveParsed.leadParagraph && (
                  <p
                    className="text-sm text-zinc-800 font-medium leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: liveParsed.leadParagraph }}
                  />
                )}
                {liveParsed.takeawaysHtml && (
                  <div dangerouslySetInnerHTML={{ __html: liveParsed.takeawaysHtml }} />
                )}
                <div
                  className="text-sm space-y-3"
                  dangerouslySetInnerHTML={{ __html: liveParsed.bodyHtml }}
                />
                {liveParsed.sourcesHtml && (
                  <div dangerouslySetInnerHTML={{ __html: liveParsed.sourcesHtml }} />
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Interactive Table Builder Modal */}
      <CustomTableEditorModal
        isOpen={tableModalOpen}
        onClose={() => setTableModalOpen(false)}
        onInsert={(tableMarkdown) => {
          setBody((prev) => `${prev}\n${tableMarkdown}\n`);
        }}
      />

      {/* Fullscreen 1:1 Public Reader Preview Modal */}
      <ArticleFullscreenPreviewModal
        isOpen={fullscreenPreviewOpen}
        onClose={() => setFullscreenPreviewOpen(false)}
        formData={{
          title,
          slug,
          category,
          author,
          author_role: authorRole,
          image_url: imageUrl,
          alt_text: altText,
          schema_caption: schemaCaption,
          published_at: publishedDate,
          updated_at_custom: updatedDate,
          read_time: readTime,
          chatgpt_link: chatGptLink,
        }}
        composedMarkdown={composedMarkdown}
        ctaData={cta}
        saving={saving}
        onSaveDraft={() => {
          setFullscreenPreviewOpen(false);
          setStatus('draft');
          handleSave('draft');
        }}
        onPublish={() => {
          setFullscreenPreviewOpen(false);
          setStatus('published');
          handleSave('published');
        }}
      />

      {/* =========================================================
          POP-UP MODAL 1: CREATE NEW CATEGORY
         ========================================================= */}
      {showNewCategoryModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-zinc-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <h3 className="font-['Marcellus'] text-xl font-bold text-zinc-950">
                Create New Category
              </h3>
              <button
                type="button"
                onClick={() => setShowNewCategoryModal(false)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-zinc-500">
              Enter a name for the new blog category. It will be immediately selected for this article.
            </p>
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="e.g. Generative AI & Agents"
              autoFocus
              className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 text-sm text-zinc-900 focus:outline-none focus:border-red-600"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowNewCategoryModal(false)}
                className="px-4 py-2 rounded-xl border border-zinc-200 text-xs font-semibold text-zinc-600 hover:bg-zinc-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  const clean = newCategoryName.trim();
                  if (clean) {
                    setCustomCategories((prev) => [...prev, clean]);
                    setCategory(clean);
                  }
                  setNewCategoryName('');
                  setShowNewCategoryModal(false);
                }}
                className="px-5 py-2 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700"
              >
                Add Category
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          POP-UP MODAL 2: CHOOSE OR CREATE AUTHOR
         ========================================================= */}
      {showAuthorModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-zinc-200 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <h3 className="font-['Marcellus'] text-xl font-bold text-zinc-950">
                Choose or Customize Author
              </h3>
              <button
                type="button"
                onClick={() => setShowAuthorModal(false)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                WebMavien Editorial Presets
              </p>
              {AUTHOR_PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => {
                    setAuthor(preset.name);
                    setAuthorRole(preset.role);
                    setAuthorBio(preset.bio);
                    setShowAuthorModal(false);
                  }}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center justify-between ${
                    author === preset.name
                      ? 'border-red-600 bg-red-50/40'
                      : 'border-zinc-200 hover:border-red-600/40'
                  }`}
                >
                  <div>
                    <p className="text-sm font-bold text-zinc-900">{preset.name}</p>
                    <p className="text-xs text-zinc-500">{preset.role}</p>
                  </div>
                  {author === preset.name && (
                    <CheckCircle2 className="w-4 h-4 text-red-600 shrink-0" />
                  )}
                </button>
              ))}
            </div>

            <div className="pt-2 border-t border-zinc-100 space-y-3">
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">
                  Author Name
                </label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="e.g. Alex Rivera — Principal Solutions Architect"
                  className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 text-sm text-zinc-900 focus:outline-none focus:border-red-600"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">
                  Author Role / Credentials
                </label>
                <input
                  type="text"
                  value={authorRole}
                  onChange={(e) => setAuthorRole(e.target.value)}
                  placeholder="e.g. Senior Full-Stack & AI Architects"
                  className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 text-xs text-zinc-800 focus:outline-none focus:border-red-600"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">
                  Author Bio (Displayed in E-E-A-T Author Card & Schema)
                </label>
                <textarea
                  rows={2}
                  value={authorBio}
                  onChange={(e) => setAuthorBio(e.target.value)}
                  placeholder="Brief bio highlighting expertise and credentials..."
                  className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 text-xs text-zinc-800 focus:outline-none focus:border-red-600"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setShowAuthorModal(false)}
                className="px-5 py-2 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700"
              >
                Apply Author
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          POP-UP MODAL 3: FEATURED IMAGE PICKER & CLOUDINARY UPLOAD
         ========================================================= */}
      {showImageModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-zinc-200 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <h3 className="font-['Marcellus'] text-xl font-bold text-zinc-950">
                Select or Upload Featured Hero Image
              </h3>
              <button
                type="button"
                onClick={() => setShowImageModal(false)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Option 1: Upload from Computer to Cloudinary */}
            <div className="p-5 rounded-2xl border-2 border-dashed border-zinc-300 bg-zinc-50 text-center space-y-2">
              <p className="text-xs font-bold text-zinc-700">
                1. Upload Image from Your Computer (Cloudinary CDN)
              </p>
              <label className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 text-white hover:bg-red-700 text-xs font-bold cursor-pointer transition-colors shadow-sm">
                {uploadingHero ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Upload className="w-4 h-4" />
                )}
                <span>{uploadingHero ? 'Uploading to Cloudinary...' : 'Choose Image File'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    await handleHeroFileUpload(e);
                    setShowImageModal(false);
                  }}
                  className="hidden"
                />
              </label>
            </div>

            {/* Option 2: Stock Presets */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2.5">
                2. Or Choose a WebMavien Tech / Agency Cover
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {STOCK_PRESET_IMAGES.map((img) => (
                  <button
                    key={img.url}
                    type="button"
                    onClick={() => {
                      setImageUrl(img.url);
                      setShowImageModal(false);
                    }}
                    className={`group rounded-xl overflow-hidden border-2 text-left transition-all ${
                      imageUrl === img.url
                        ? 'border-red-600 ring-2 ring-red-600/20'
                        : 'border-zinc-200 hover:border-red-600/50'
                    }`}
                  >
                    <div className="h-20 overflow-hidden bg-zinc-100">
                      <img
                        src={img.url}
                        alt={img.label}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <p className="p-2 text-[11px] font-bold text-zinc-700 truncate">
                      {img.label}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Option 3: Custom Image URL */}
            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">
                3. Or Paste Direct Image URL
              </label>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-xs text-zinc-800 focus:outline-none focus:border-red-600"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setShowImageModal(false)}
                className="px-5 py-2 rounded-xl bg-zinc-950 text-white text-xs font-bold hover:bg-zinc-800"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

