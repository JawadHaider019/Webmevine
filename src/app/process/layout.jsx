const SITE_URL = 'https://webmavien.com';

export const metadata = {
  title: 'Our 21-Day Website & SaaS MVP Development Process | WebMavien',
  description:
    'Discover WebMavien’s 4-week milestone-driven engineering framework: Week 1 Strategy & Architecture, Week 2 UX Wireframes, Week 3 React or Bubble.io Build, and Week 4 QA & Production Launch.',
  keywords: [
    '21-day website development process',
    '4-week MVP launch framework',
    'agile SaaS development process',
    'custom web development workflow',
    'money-back guarantee web agency',
  ],
  alternates: {
    canonical: `${SITE_URL}/process`,
  },
  openGraph: {
    title: 'Our 21-Day Website & SaaS MVP Development Process | WebMavien',
    description:
      'From idea to live production product in 21–28 days with 100% code ownership and a zero-risk money-back guarantee.',
    url: `${SITE_URL}/process`,
    siteName: 'WebMavien',
    type: 'website',
  },
};

export default function ProcessLayout({ children }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        '@id': `${SITE_URL}/process#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Process',
            item: `${SITE_URL}/process`,
          },
        ],
      },
      {
        '@type': 'HowTo',
        '@id': `${SITE_URL}/process#howto`,
        name: 'How WebMavien Launches Websites and SaaS MVPs in 21 Days',
        description:
          'A structured 4-week engineering process from business discovery and UX wireframing to full-stack React or Bubble.io deployment.',
        totalTime: 'P21D',
        step: [
          {
            '@type': 'HowToStep',
            position: 1,
            name: 'Week 1: Strategy & Conversion Planning',
            text: 'We research your market, define clear business goals, and build a conversion-focused product architecture.',
          },
          {
            '@type': 'HowToStep',
            position: 2,
            name: 'Week 2: UX Design & Wireframing',
            text: 'We create intuitive wireframes and user flows designed for clarity, engagement, and high conversion rates.',
          },
          {
            '@type': 'HowToStep',
            position: 3,
            name: 'Week 3: Development & System Build',
            text: 'Your custom platform is engineered in React JS, Next.js, or Bubble.io with APIs, payments, and technical SEO built in.',
          },
          {
            '@type': 'HowToStep',
            position: 4,
            name: 'Week 4: Testing, Optimization & Launch',
            text: 'Full QA testing across devices, Core Web Vitals optimization, and smooth production launch backed by post-launch support.',
          },
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
