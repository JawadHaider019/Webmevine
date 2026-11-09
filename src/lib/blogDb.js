// src/lib/blogDb.js
// Server-side MongoDB data access & normalization layer for WebMavien Blog & SEO
import clientPromise from './mongodb';
import { ObjectId } from 'mongodb';
import { blogPosts as fallbackBlogPosts } from '@/data/blogData';

const DB_NAME = 'webmavien';
const COLLECTION_NAME = 'blogs';

/**
 * Generates a URL-safe slug from any title or string
 */
export function createSlug(text = '') {
  return String(text || '')
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Normalizes a blog document from MongoDB or static fallback into a unified shape
 */
export function normalizeBlogDocument(doc) {
  if (!doc) return null;

  const idStr = doc._id ? doc._id.toString() : String(doc.id || '');
  const isPublished =
    doc.status === 'published' ||
    (doc.status === undefined && doc.published !== false);

  const status = isPublished ? 'published' : 'draft';
  const published = isPublished;

  const createdAt = doc.createdAt
    ? new Date(doc.createdAt).toISOString()
    : new Date().toISOString();
  const updatedAt = doc.updatedAt
    ? new Date(doc.updatedAt).toISOString()
    : createdAt;

  const imageUrl =
    doc.imageUrl ||
    doc.image_url ||
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop&q=80';

  const rawReadTime = String(doc.readTime || doc.read_time || '5');
  const readTimeNumeric = rawReadTime.replace(/[^\d]/g, '') || '5';

  return {
    ...doc,
    _id: idStr,
    id: idStr,
    title: doc.title || 'Untitled Article',
    slug: doc.slug || createSlug(doc.title || idStr),
    content: doc.content || '',
    excerpt:
      doc.excerpt ||
      doc.metaDescription ||
      (doc.content ? doc.content.replace(/[#*`:::]/g, '').slice(0, 160).trim() + '...' : ''),
    metaTitle: doc.metaTitle || doc.meta_title || doc.title || '',
    metaDescription:
      doc.metaDescription ||
      doc.meta_description ||
      doc.excerpt ||
      '',
    breadcrumbTitle: doc.breadcrumbTitle || doc.breadcrumb_title || doc.title || '',
    imageUrl,
    image_url: imageUrl,
    altText: doc.altText || doc.alt_text || doc.title || 'WebMavien Blog Article',
    schemaCaption: doc.schemaCaption || doc.schema_caption || '',
    author: doc.author || 'WebMavien Engineering Team',
    authorRole: doc.authorRole || doc.author_role || 'Senior Full-Stack & AI Architects',
    authorBio:
      doc.authorBio ||
      doc.author_bio ||
      'The WebMavien Engineering Team specializes in high-performance Next.js architectures, custom AI agent workflows, and scalable SaaS platforms.',
    category: doc.category || 'Development',
    tags: Array.isArray(doc.tags)
      ? doc.tags
      : typeof doc.tags === 'string' && doc.tags.trim()
      ? doc.tags.split(',').map((t) => t.trim()).filter(Boolean)
      : [],
    readTime: readTimeNumeric,
    read_time: `${readTimeNumeric} Min. Read`,
    chatGptLink: doc.chatGptLink || doc.chatgpt_link || '',
    published,
    status,
    featured: Boolean(doc.featured),
    createdAt,
    updatedAt,
  };
}

/**
 * Fetches a single blog post by slug (or ObjectId fallback) from MongoDB,
 * falling back to static blogData if not found in DB.
 */
export async function getBlogBySlugFromDb(slug, { includeDrafts = true } = {}) {
  if (!slug) return null;
  const decodedSlug = decodeURIComponent(slug).trim();

  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    let blog = await collection.findOne({ slug: decodedSlug });

    if (!blog && ObjectId.isValid(decodedSlug)) {
      blog = await collection.findOne({ _id: new ObjectId(decodedSlug) });
    }

    if (blog) {
      const normalized = normalizeBlogDocument(blog);
      if (!includeDrafts && !normalized.published) {
        return null;
      }
      return normalized;
    }
  } catch (error) {
    console.error('Error querying blog by slug from MongoDB:', error);
  }

  // Fallback to static blogPosts in src/data/blogData.js
  const fallback = (fallbackBlogPosts || []).find(
    (p) => p.slug === decodedSlug || String(p.id) === decodedSlug
  );
  if (fallback) {
    return normalizeBlogDocument(fallback);
  }

  return null;
}

/**
 * Fetches blogs from MongoDB with optional filters (status, category, search, featured, limit)
 */
export async function getBlogsFromDb({
  status = 'all',
  category = '',
  search = '',
  featured,
  excludeSlug = '',
  limit = 0,
  includeFallbackIfEmpty = false,
} = {}) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const docs = await collection.find({}).sort({ createdAt: -1 }).toArray();
    let normalized = docs.map(normalizeBlogDocument);

    if (normalized.length === 0 && includeFallbackIfEmpty) {
      normalized = (fallbackBlogPosts || []).map(normalizeBlogDocument);
    }

    // Compute overall stats before filtering
    const stats = {
      total: normalized.length,
      published: normalized.filter((b) => b.published).length,
      draft: normalized.filter((b) => !b.published).length,
      featured: normalized.filter((b) => b.featured).length,
    };

    let filtered = normalized;

    if (status === 'published') {
      filtered = filtered.filter((b) => b.published);
    } else if (status === 'draft') {
      filtered = filtered.filter((b) => !b.published);
    }

    if (category && category !== 'all' && category !== 'All') {
      filtered = filtered.filter(
        (b) => (b.category || '').toLowerCase() === category.toLowerCase()
      );
    }

    if (featured !== undefined && featured !== null && featured !== '') {
      const wantFeatured = featured === true || featured === 'true';
      filtered = filtered.filter((b) => Boolean(b.featured) === wantFeatured);
    }

    if (excludeSlug) {
      filtered = filtered.filter((b) => b.slug !== excludeSlug);
    }

    if (search && search.trim()) {
      const q = search.toLowerCase().trim();
      filtered = filtered.filter(
        (b) =>
          (b.title || '').toLowerCase().includes(q) ||
          (b.excerpt || '').toLowerCase().includes(q) ||
          (b.category || '').toLowerCase().includes(q) ||
          (b.slug || '').toLowerCase().includes(q) ||
          (b.author || '').toLowerCase().includes(q)
      );
    }

    if (limit && limit > 0) {
      filtered = filtered.slice(0, Number(limit));
    }

    return { blogs: filtered, stats };
  } catch (error) {
    console.error('Error fetching blogs from MongoDB:', error);
    const fallback = includeFallbackIfEmpty
      ? (fallbackBlogPosts || []).map(normalizeBlogDocument)
      : [];
    return {
      blogs: fallback,
      stats: {
        total: fallback.length,
        published: fallback.length,
        draft: 0,
        featured: fallback.filter((b) => b.featured).length,
      },
    };
  }
}

