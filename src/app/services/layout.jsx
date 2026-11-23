const SITE_URL = 'https://webmavien.com';

export const metadata = {
  title: 'Web, SaaS, AI & Bubble.io Development Services',
  description:
    'AI MVPs, React & Next.js web apps, Bubble.io platforms, custom CRMs, e-commerce stores and marketplaces, launched in 21 days with a money-back guarantee.',
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
    title: 'Web, SaaS, AI & Bubble.io Development Services',
    description:
      'From AI-powered MVPs launched in 21 days to full-scale React, Next.js, and Node.js platforms. Backed by our money-back guarantee.',
    url: `${SITE_URL}/services`,
    siteName: 'WebMavien',
    type: 'website',
  },
};

// Structured data is rendered by page.jsx so service detail pages do not inherit it.
export default function ServicesLayout({ children }) {
  return children;
}
