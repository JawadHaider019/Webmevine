const SITE_URL = 'https://webmavien.com';

export const metadata = {
  title: 'SaaS, MVP, CRM & E-Commerce Development Blog',
  description:
    'Practical guides on SaaS and MVP development, custom CRMs, AI products and Next.js e-commerce for founders and businesses in the UK, USA and UAE.',
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
    title: 'Guides for Building Web, SaaS & AI Products | WebMavien',
    description:
      'Practical guides on MVP and SaaS development, AI products, custom CRMs, e-commerce and hiring the right agency, by WebMavien.',
    url: `${SITE_URL}/blog`,
    siteName: 'WebMavien',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Guides for Building Web, SaaS & AI Products | WebMavien',
    description:
      'Practical guides on MVP and SaaS development, AI products, custom CRMs, e-commerce and hiring the right agency, by WebMavien.',
  },
};

// Structured data is rendered by page.jsx so child pages do not inherit it.
export default function BlogLayout({ children }) {
  return children;
}
