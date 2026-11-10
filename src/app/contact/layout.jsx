const SITE_URL = 'https://webmavien.com';

export const metadata = {
  title: 'Contact WebMavien | Book a Free 30-Minute Strategy Call',
  description:
    'Ready to launch your website, AI SaaS MVP, or marketplace in 21 days? Book a free 30-minute discovery and architecture consultation with WebMavien.',
  keywords: [
    'contact WebMavien',
    'book free web development strategy call',
    'hire React Next.js agency',
    'hire Bubble.io developer',
    'custom SaaS quote',
  ],
  alternates: {
    canonical: `${SITE_URL}/contact`,
  },
  openGraph: {
    title: 'Contact WebMavien | Book a Free Strategy Call',
    description:
      'Schedule a free consultation or reach us via WhatsApp & email to scope your custom React, AI, or Bubble.io build.',
    url: `${SITE_URL}/contact`,
    siteName: 'WebMavien',
    type: 'website',
  },
};

export default function ContactLayout({ children }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    '@id': `${SITE_URL}/contact#contactpage`,
    url: `${SITE_URL}/contact`,
    name: 'Contact WebMavien',
    mainEntity: {
      '@type': 'Organization',
      name: 'WebMavien',
      url: SITE_URL,
      email: 'team@webmavien.com',
      telephone: '+44 7424 672943',
    },
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
