// Static blog data layer. All posts live in src/data/blogs.json and are
// bundled at build time, so blog pages are pre-rendered with no database calls.
// To add or edit a post, edit src/data/blogs.json and redeploy.
import blogsJson from '@/data/blogs.json';

const DEFAULT_IMAGE =
  'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop&q=80';

function normalize(post) {
  const readTime = String(post.readTime || '5').replace(/[^\d]/g, '') || '5';
  const imageUrl = post.imageUrl || DEFAULT_IMAGE;
  return {
    ...post,
    id: post.slug,
    imageUrl,
    image_url: imageUrl,
    altText: post.altText || post.title,
    breadcrumbTitle: post.breadcrumbTitle || post.title,
    metaTitle: post.metaTitle || post.title,
    excerpt: post.excerpt || post.metaDescription || '',
    tags: Array.isArray(post.tags) ? post.tags : [],
    author: post.author || 'WebMavien Engineering Team',
    authorRole: post.authorRole || 'Senior Full-Stack & AI Architects',
    authorBio:
      post.authorBio ||
      'The WebMavien Engineering Team specializes in high-performance Next.js architectures, custom AI agent workflows, and scalable SaaS platforms.',
    readTime,
    read_time: `${readTime} Min. Read`,
    updatedAt: post.updatedAt || post.createdAt,
  };
}

// Newest first
const ALL_POSTS = blogsJson
  .map(normalize)
  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

/** All posts, newest first. */
export function getAllBlogs() {
  return ALL_POSTS;
}

/** All posts without the article body: for listings, where the body is not needed. */
export function getBlogSummaries() {
  return ALL_POSTS.map(({ content, ...summary }) => summary);
}

/** A single post by slug, or null. */
export function getBlogBySlug(slug) {
  if (!slug) return null;
  const decoded = decodeURIComponent(slug).trim();
  return ALL_POSTS.find((p) => p.slug === decoded) || null;
}

/** Up to `limit` related posts: same category first, then newest. Bodies are omitted. */
export function getRelatedBlogs(post, limit = 3) {
  if (!post) return [];
  const category = (post.category || '').toLowerCase();
  const others = getBlogSummaries().filter((p) => p.slug !== post.slug);
  const same = others.filter((p) => (p.category || '').toLowerCase() === category);
  const rest = others.filter((p) => (p.category || '').toLowerCase() !== category);
  return [...same, ...rest].slice(0, limit);
}
