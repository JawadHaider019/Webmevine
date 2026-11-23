import BlogListingClient from '@/components/BlogListingClient';
import { getBlogSummaries } from '@/lib/blogs';

const SITE_URL = 'https://webmavien.com';

// Structured data lives on this page only (not the layout), so blog posts
// do not inherit a second, conflicting BreadcrumbList.
const blogJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'BreadcrumbList',
      '@id': `${SITE_URL}/blog#breadcrumb`,
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE_URL}/blog` },
      ],
    },
    {
      '@type': 'Blog',
      '@id': `${SITE_URL}/blog#blog`,
      name: 'WebMavien Engineering & AI Blog',
      description:
        'Practical guides on SaaS and MVP development, custom CRMs, AI products and Next.js e-commerce by WebMavien.',
      url: `${SITE_URL}/blog`,
      publisher: { '@id': `${SITE_URL}/#organization` },
    },
  ],
};

// Static page: built once from src/data/blogs.json (article bodies are not sent to the browser).
export default function BlogPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }}
      />
      <BlogListingClient posts={getBlogSummaries()} />
    </>
  );
}
