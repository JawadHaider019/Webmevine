const SITE_URL = 'https://webmavien.com';

export const metadata = {
  title: 'Custom Web App, AI MVP & Bubble.io Development Services | WebMavien',
  description:
    'Explore WebMavien services: AI-powered MVP development, custom React & Next.js web applications, Bubble.io no-code platforms, Stripe & wallet integrations, and 21-day product launches.',
  keywords: [
    'AI MVP development services',
    'custom React Next.js web development agency',
    'Bubble.io no-code development agency',
    'SaaS web application development',
    'Stripe payment wallet integration',
    'full-stack web engineering',
  ],
  alternates: {
    canonical: `${SITE_URL}/services`,
  },
  openGraph: {
    title: 'Custom Web App, AI MVP & Bubble.io Development Services | WebMavien',
    description:
      'From AI-powered MVPs launched in 21 days to full-scale React, Next.js, and Node.js platforms. Backed by our money-back guarantee.',
    url: `${SITE_URL}/services`,
    siteName: 'WebMavien',
    type: 'website',
  },
};

export default function ServicesLayout({ children }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        '@id': `${SITE_URL}/services#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Services',
            item: `${SITE_URL}/services`,
          },
        ],
      },
      {
        '@type': 'Service',
        '@id': `${SITE_URL}/services#catalog`,
        serviceType: 'Web Application & AI SaaS Development',
        provider: {
          '@type': 'Organization',
          name: 'WebMavien',
          url: SITE_URL,
        },
        areaServed: 'Worldwide',
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'WebMavien Engineering & MVP Services',
          itemListElement: [
            'AI-Powered MVP Development',
            'Full-Stack Web Applications (React / Next.js / Node.js)',
            'AI Integration & Automation',
            'UI/UX Design & Prototyping',
            'Business Process Automation',
            'Payment & Wallet Integration',
            'Real-Time Features & Notifications',
            'Analytics & Dashboard Solutions',
            'Founder Consultation & Strategy',
            'Maintenance & Support',
          ].map((serviceName) => ({
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: serviceName,
            },
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
