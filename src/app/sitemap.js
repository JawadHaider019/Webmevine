import { getBlogsFromDb } from '@/lib/blogDb';

const SITE_URL = 'https://webmavien.com';

export default async function sitemap() {
  const staticRoutes = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/services`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/process`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/casestudies`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ];

  let blogRoutes = [];
  try {
    const { blogs } = await getBlogsFromDb({
      status: 'published',
      includeFallbackIfEmpty: true,
    });
    blogRoutes = (blogs || []).map((post) => ({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: post.updatedAt || post.createdAt || new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    }));
  } catch (err) {
    console.error('Error building blog sitemap routes:', err);
  }

  return [...staticRoutes, ...blogRoutes];
}
