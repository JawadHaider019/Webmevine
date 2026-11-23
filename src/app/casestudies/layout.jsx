
const SITE_URL = 'https://webmavien.com';

export const metadata = {
  title: 'Web, SaaS & E-Commerce Development Case Studies',
  description:
    'Real web, SaaS MVP, e-commerce and AI case studies delivered by WebMavien in 21–28 days with React, Next.js, Node.js and Bubble.io, with measurable results.',
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

// Structured data is rendered by page.jsx so child pages do not inherit it.
export default function CaseStudiesLayout({ children }) {
  return children;
}
