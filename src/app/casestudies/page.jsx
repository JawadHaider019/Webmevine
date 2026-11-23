import CaseStudiesListingClient from '@/components/CaseStudiesListingClient';
import { caseStudies } from '@/data/caseStudies';

const SITE_URL = 'https://webmavien.com';

// Structured data lives on this page only (not the layout), so case study
// detail pages do not inherit a second, conflicting BreadcrumbList.
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'BreadcrumbList',
      '@id': `${SITE_URL}/casestudies#breadcrumb`,
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Case Studies', item: `${SITE_URL}/casestudies` },
      ],
    },
    {
      '@type': 'CollectionPage',
      '@id': `${SITE_URL}/casestudies#collection`,
      url: `${SITE_URL}/casestudies`,
      name: 'WebMavien Client Case Studies & Launch Stories',
      description:
        'Verified client case studies showcasing custom React, Node.js, Bubble.io, and AI SaaS platforms delivered by WebMavien.',
      isPartOf: { '@id': `${SITE_URL}/#website` },
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

export default function CaseStudiesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CaseStudiesListingClient />
    </>
  );
}
