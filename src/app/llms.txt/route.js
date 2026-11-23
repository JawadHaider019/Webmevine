import { NextResponse } from 'next/server';
import { caseStudies } from '@/data/caseStudies';
import { getAllBlogs } from '@/lib/blogs';

const SITE_URL = 'https://webmavien.com';

// Built once at build time from src/data/blogs.json.
export const dynamic = 'force-static';

export async function GET() {
  const blogPosts = getAllBlogs();

  const lines = [
    '# WebMavien — Rapid Launch Web, AI & SaaS Engineering Agency',
    '',
    '> WebMavien builds custom React / Next.js web applications, AI-powered SaaS MVPs, custom e-commerce stores, and Bubble.io marketplaces in 21–28 days—backed by a 100% money-back satisfaction guarantee.',
    '',
    '## Core Pages',
    `- [Home](${SITE_URL}/): 21-day website & SaaS MVP delivery with money-back guarantee.`,
    `- [Services](${SITE_URL}/services): AI-Powered MVP Development, Full-Stack React/Next.js/Node.js, AI Integration & Automation, Stripe/Wallet Payments.`,
    `- [Process](${SITE_URL}/process): Structured 4-week engineering framework (Strategy -> UX -> Build -> Launch) with 100% code ownership.`,
    `- [Case Studies](${SITE_URL}/casestudies): Verified production launches with measurable ROI and founder testimonials.`,
    `- [Engineering Blog](${SITE_URL}/blog): Technical architecture guides, stack comparisons, and founder playbooks.`,
    `- [Contact / Book Free Strategy Call](${SITE_URL}/contact): Schedule a 30-minute architecture & roadmap call (team@webmavien.com | +44 7424 672943).`,
    '',
    '## Verified Case Studies',
    ...caseStudies.map((study) => {
      const statsStr = (study.stats || [])
        .map((s) => `${s.value} ${s.label}`)
        .join(', ');
      return `- [${study.title} — ${study.category}](${SITE_URL}/casestudies/${study.slug}): ${study.shortDescription} Tech: ${(study.technologies || []).join(', ')}. Metrics: ${statsStr}.`;
    }),
    '',
    '## Engineering & Founder Guides (Blog)',
    ...blogPosts.map((post) => {
      const kw =
        Array.isArray(post.tags) && post.tags.length > 0
          ? ` [Keywords: ${post.tags.slice(0, 6).join(', ')}]`
          : '';
      return `- [${post.title}](${SITE_URL}/blog/${post.slug}): ${post.metaDescription || post.excerpt || ''}${kw}`;
    }),
    '',
  ];

  return new NextResponse(lines.join('\n'), {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}

