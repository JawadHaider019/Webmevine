import ServicesListingClient from '@/components/ServicesListingClient';
import { services } from '@/data/services';

const SITE_URL = 'https://webmavien.com';

// Structured data lives on this page only (not the layout), so the dedicated
// /services/[slug] pages do not inherit a second BreadcrumbList.
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'BreadcrumbList',
      '@id': `${SITE_URL}/services#breadcrumb`,
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Services', item: `${SITE_URL}/services` },
      ],
    },
    {
      '@type': 'Service',
      '@id': `${SITE_URL}/services#catalog`,
      serviceType: 'Web, SaaS & AI Development',
      provider: { '@id': `${SITE_URL}/#organization` },
      areaServed: 'Worldwide',
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'WebMavien Development Services',
        itemListElement: services.map((service) => ({
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            '@id': `${SITE_URL}/services/${service.slug}#service`,
            name: service.name,
            url: `${SITE_URL}/services/${service.slug}`,
          },
        })),
      },
    },
  ],
};

export default function ServicesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ServicesListingClient />
    </>
  );
}
