import { caseStudies } from '@/data/caseStudies';

const SITE_URL = 'https://webmavien.com';

export const metadata = {
  title: 'Case Studies & Client Launch Stories | WebMavien Web Development Agency',
  description:
    'Explore real-world web development, SaaS MVP, e-commerce, and AI case studies delivered by WebMavien in 21–28 days using React, Next.js, Node.js, and Bubble.io.',
  keywords: [
    'WebMavien case studies',
    'web development agency portfolio',
    'Bubble.io case studies',
    'React e-commerce case study',
    'AI SaaS development case study',
    '21-day website delivery',
  ],
  alternates: {
    canonical: `${SITE_URL}/casestudies`,
  },
  openGraph: {
    title: 'Case Studies & Client Launch Stories | WebMavien',
    description:
      'See how WebMavien helps founders and businesses build high-converting marketplaces, AI SaaS products, and custom e-commerce stores in weeks, not months.',
    url: `${SITE_URL}/casestudies`,
    siteName: 'WebMavien',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Case Studies & Client Launch Stories | WebMavien',
    description:
      'Real-world SaaS, Marketplace, and E-Commerce case studies engineered by WebMavien.',
  },
};

export default function CaseStudiesLayout({ children }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        '@id': `${SITE_URL}/casestudies#breadcrumb`,
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
            name: 'Case Studies',
            item: `${SITE_URL}/casestudies`,
          },
        ],
      },
      {
        '@type': 'CollectionPage',
        '@id': `${SITE_URL}/casestudies#collection`,
        url: `${SITE_URL}/casestudies`,
        name: 'WebMavien Client Case Studies & Launch Stories',
        description:
          'Verified client case studies showcasing custom React, Node.js, Bubble.io, and AI SaaS platforms delivered by WebMavien.',
        isPartOf: {
          '@type': 'WebSite',
          name: 'WebMavien',
          url: SITE_URL,
        },
        mainEntity: {
          '@type': 'ItemList',
          itemListElement: caseStudies.map((study, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            url: `${SITE_URL}/casestudies/${study.slug}`,
            name: `${study.title} — ${study.category}`,
            description: study.shortDescription,
          })),
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
