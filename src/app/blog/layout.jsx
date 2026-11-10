const SITE_URL = 'https://webmavien.com';

export const metadata = {
  title: 'SaaS, MVP, Custom CRM & E-Commerce Engineering Blog | WebMavien',
  description:
    'In-depth 2026 cost guides, architecture blueprints, and AI automation playbooks for SaaS MVPs, custom CRMs, and Next.js e-commerce across the UK, USA, and UAE.',
  keywords: [
    'SaaS Development Cost 2026',
    'MVP Development Agency',
    'Custom CRM vs HubSpot Cost',
    'Next.js E-Commerce Agency',
    'Hire React Developer UK USA UAE',
    'Bubble.io vs React Next.js',
    'Two-Sided Marketplace Development',
    'AI SaaS MVP 21 Days',
  ],
  alternates: {
    canonical: `${SITE_URL}/blog`,
  },
  openGraph: {
    title: 'Engineering, AI & Technical SEO Blog | WebMavien',
    description:
      'In-depth guides, architecture blueprints, and AI automation strategies from WebMavien senior engineers.',
    url: `${SITE_URL}/blog`,
    siteName: 'WebMavien',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Engineering, AI & Technical SEO Blog | WebMavien',
    description:
      'In-depth guides, architecture blueprints, and AI automation strategies from WebMavien senior engineers.',
  },
};

export default function BlogLayout({ children }) {
  const blogJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        '@id': `${SITE_URL}/blog#breadcrumb`,
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
        ],
      },
      {
        '@type': 'Blog',
        '@id': `${SITE_URL}/blog#blog`,
        name: 'WebMavien Engineering & AI Blog',
        description:
          'Technical guides, AI automation blueprints, and software architecture insights by WebMavien.',
        url: `${SITE_URL}/blog`,
        publisher: {
          '@type': 'Organization',
          name: 'WebMavien',
          url: SITE_URL,
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }}
      />
      {children}
    </>
  );
}
