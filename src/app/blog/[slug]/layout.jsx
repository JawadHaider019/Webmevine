import { getBlogBySlugFromDb } from '@/lib/blogDb';
import { parseArticleMarkdown, stripMarkdown } from '@/utils/articleParser';

export const dynamic = 'force-dynamic';

const SITE_URL = 'https://webmavien.com';

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;
  const post = await getBlogBySlugFromDb(slug, { includeDrafts: true });

  if (!post) {
    return {
      title: 'Article Not Found | WebMavien Blog',
      description: 'Explore technical guides on Next.js, AI automation, and SaaS architecture on the WebMavien Blog.',
    };
  }

  const metaTitle = post.metaTitle || `${post.title} | WebMavien`;
  const metaDescription =
    stripMarkdown(post.metaDescription || post.excerpt) ||
    'In-depth engineering and AI strategy insights from WebMavien.';
  const canonicalUrl = `${SITE_URL}/blog/${post.slug}`;
  const ogImage =
    post.imageUrl ||
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop&q=80';
  const keywordsList =
    Array.isArray(post.tags) && post.tags.length > 0
      ? post.tags
      : [
          'SaaS Development Agency',
          'MVP Development Company',
          'Custom CRM Software',
          'Next.js E-Commerce Agency',
          'WebMavien',
        ];

  return {
    title: metaTitle,
    description: metaDescription,
    keywords: keywordsList,
    authors: [{ name: post.author || 'WebMavien Engineering Team' }],
    category: post.category || 'Engineering & AI',
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      url: canonicalUrl,
      siteName: 'WebMavien',
      type: 'article',
      publishedTime: post.createdAt,
      modifiedTime: post.updatedAt || post.createdAt,
      authors: [post.author || 'WebMavien Engineering Team'],
      section: post.category || 'Engineering & AI',
      tags: keywordsList,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: post.altText || post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description: metaDescription,
      images: [ogImage],
    },
  };
}

export default async function BlogArticleLayout({ children, params }) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;
  const post = await getBlogBySlugFromDb(slug, { includeDrafts: true });

  let jsonLdGraph = null;

  if (post) {
    const canonicalUrl = `${SITE_URL}/blog/${post.slug}`;
    const parsed = parseArticleMarkdown(post.content || '');
    const wordCount = (post.content || '')
      .replace(/:::\w+/g, '')
      .replace(/[#*|>-]/g, ' ')
      .trim()
      .split(/\s+/)
      .filter(Boolean).length;

    const graphEntities = [
      // 1. BreadcrumbList Schema
      {
        '@type': 'BreadcrumbList',
        '@id': `${canonicalUrl}#breadcrumb`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: SITE_URL,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Blog',
            item: `${SITE_URL}/blog`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: post.breadcrumbTitle || post.title,
            item: canonicalUrl,
          },
        ],
      },
      // 2. Author (Person) Schema
      {
        '@type': 'Person',
        '@id': `${canonicalUrl}#author`,
        name: post.author || 'WebMavien Engineering Team',
        jobTitle: post.authorRole || 'Senior Full-Stack & AI Architects',
        description:
          post.authorBio ||
          'The WebMavien Engineering Team specializes in high-performance Next.js architectures, custom AI agent workflows, and scalable SaaS platforms.',
        worksFor: {
          '@type': 'Organization',
          name: 'WebMavien',
          url: SITE_URL,
        },
      },
      // 3. BlogPosting Schema
      {
        '@type': 'BlogPosting',
        '@id': `${canonicalUrl}#article`,
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': canonicalUrl,
        },
        headline: post.metaTitle || post.title,
        name: post.title,
        description: stripMarkdown(post.metaDescription || post.excerpt),
        image: {
          '@type': 'ImageObject',
          url: post.imageUrl,
          caption: post.schemaCaption || post.altText || post.title,
        },
        datePublished: post.createdAt,
        dateModified: post.updatedAt || post.createdAt,
        author: {
          '@id': `${canonicalUrl}#author`,
        },
        publisher: {
          '@type': 'Organization',
          name: 'WebMavien',
          url: SITE_URL,
          logo: {
            '@type': 'ImageObject',
            url: `${SITE_URL}/logo.png`,
          },
        },
        articleSection: post.category || 'Development',
        keywords: Array.isArray(post.tags) ? post.tags.join(', ') : '',
        wordCount,
        isAccessibleForFree: true,
        inLanguage: 'en-US',
        speakable: {
          '@type': 'SpeakableSpecification',
          cssSelector: ['h1', 'h2', 'summary'],
        },
      },
    ];

    // 4. Dynamic FAQPage Schema (when the article contains :::faq items)
    if (parsed.faqItems && parsed.faqItems.length > 0) {
      graphEntities.push({
        '@type': 'FAQPage',
        '@id': `${canonicalUrl}#faq`,
        mainEntity: parsed.faqItems.map((item) => ({
          '@type': 'Question',
          name: stripMarkdown(item.q),
          acceptedAnswer: {
            '@type': 'Answer',
            text: stripMarkdown(item.a),
          },
        })),
      });
    }

    jsonLdGraph = {
      '@context': 'https://schema.org',
      '@graph': graphEntities,
    };
  }

  return (
    <>
      {jsonLdGraph && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdGraph) }}
        />
      )}
      {children}
    </>
  );
}

