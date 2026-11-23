const SITE_URL = 'https://webmavien.com';

export const metadata = {
  title: { absolute: 'About WebMavien | Web & SaaS Development Agency' },
  description:
    'Why founders, e-commerce brands and startups choose WebMavien: senior engineers, full code ownership and 21-day launches, led by founder Muhammad Ahmad.',
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
        mainEntity: { '@id': `${SITE_URL}/#organization` },
        about: { '@id': `${SITE_URL}/about#muhammad-ahmad` },
      },
      {
        '@type': 'Person',
        '@id': `${SITE_URL}/about#muhammad-ahmad`,
        name: 'Muhammad Ahmad',
        jobTitle: 'Founder & CEO',
        url: `${SITE_URL}/about`,
        image: `${SITE_URL}/founder-webmavien.png`,
        description:
          'Founder of WebMavien with 8+ years of experience building React, Next.js and Bubble.io websites, SaaS MVPs and AI-powered platforms, with 100+ projects delivered.',
        worksFor: { '@id': `${SITE_URL}/#organization` },
        knowsAbout: [
          'React and Next.js development',
          'Bubble.io development',
          'SaaS MVP development',
          'AI integrations',
          'Conversion-focused web design',
        ],
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
