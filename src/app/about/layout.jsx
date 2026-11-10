const SITE_URL = 'https://webmavien.com';

export const metadata = {
  title: 'About WebMavien | Founder-First React, AI & Bubble.io Development Agency',
  description:
    'Learn why SaaS founders, e-commerce brands, and startups partner with WebMavien for strategic web engineering, full code ownership, and 21-day production launches.',
  keywords: [
    'About WebMavien',
    'founder-first web development agency',
    'React JS agency',
    'Bubble.io certified developers',
    'custom SaaS engineering partner',
  ],
  alternates: {
    canonical: `${SITE_URL}/about`,
  },
  openGraph: {
    title: 'About WebMavien | Founder-First React, AI & Bubble.io Agency',
    description:
      '100+ successful launches. We combine conversion strategy, custom React/Next.js architecture, and Bubble.io speed to ship digital products in 21 days.',
    url: `${SITE_URL}/about`,
    siteName: 'WebMavien',
    type: 'website',
  },
};

export default function AboutLayout({ children }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        '@id': `${SITE_URL}/about#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'About',
            item: `${SITE_URL}/about`,
          },
        ],
      },
      {
        '@type': 'AboutPage',
        '@id': `${SITE_URL}/about#aboutpage`,
        url: `${SITE_URL}/about`,
        name: 'About WebMavien',
        mainEntity: {
          '@type': 'Organization',
          name: 'WebMavien',
          url: SITE_URL,
          logo: `${SITE_URL}/fav.png`,
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
