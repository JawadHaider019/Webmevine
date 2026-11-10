import { caseStudies } from '@/data/caseStudies';

const SITE_URL = 'https://webmavien.com';

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;
  const study = caseStudies.find((s) => s.slug === slug);

  if (!study) {
    return {
      title: 'Case Study Not Found | WebMavien',
      description: 'The requested project case study could not be found.',
    };
  }

  const canonicalUrl = `${SITE_URL}/casestudies/${study.slug}`;
  const ogImage = study.images?.main
    ? `${SITE_URL}${study.images.main}`
    : `${SITE_URL}/fav.png`;

  return {
    title:
      study.seoTitle ||
      `${study.title} Case Study (${study.category}) | WebMavien`,
    description: study.metaDescription || study.shortDescription || study.fullDescription,
    keywords: study.keywords || [
      study.title,
      study.category,
      ...(study.technologies || []),
      'WebMavien case study',
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title:
        study.seoTitle ||
        `${study.title} — ${study.category} Case Study | WebMavien`,
      description: study.metaDescription || study.shortDescription,
      url: canonicalUrl,
      siteName: 'WebMavien',
      type: 'article',
      images: [
        {
          url: ogImage,
          alt: `${study.title} — ${study.category} built by WebMavien`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title:
        study.seoTitle ||
        `${study.title} — ${study.category} Case Study | WebMavien`,
      description: study.metaDescription || study.shortDescription,
      images: [ogImage],
    },
  };
}

export default async function CaseStudyDetailLayout({ children, params }) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;
  const study = caseStudies.find((s) => s.slug === slug);

  if (!study) {
    return <>{children}</>;
  }

  const canonicalUrl = `${SITE_URL}/casestudies/${study.slug}`;
  const ogImage = study.images?.main
    ? `${SITE_URL}${study.images.main}`
    : `${SITE_URL}/fav.png`;

  const graph = [
    {
      '@type': 'BreadcrumbList',
      '@id': `${canonicalUrl}#breadcrumb`,
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
        {
          '@type': 'ListItem',
          position: 3,
          name: study.title,
          item: canonicalUrl,
        },
      ],
    },
    {
      '@type': 'CreativeWork',
      '@id': `${canonicalUrl}#casestudy`,
      name: study.seoTitle || `${study.title} Case Study`,
      headline: `${study.title} — ${study.category}`,
      description: study.metaDescription || study.fullDescription,
      url: canonicalUrl,
      image: ogImage,
      genre: study.category,
      keywords: (study.technologies || []).join(', '),
      creator: {
        '@type': 'Organization',
        name: 'WebMavien',
        url: SITE_URL,
      },
      ...(study.testimonial
        ? {
            review: {
              '@type': 'Review',
              reviewRating: {
                '@type': 'Rating',
                ratingValue: study.testimonial.rating || 5,
                bestRating: 5,
              },
              author: {
                '@type': 'Person',
                name: study.founder?.name || study.testimonial.name,
                jobTitle: study.founder?.title || study.testimonial.role,
              },
              reviewBody: study.testimonial.content,
            },
          }
        : {}),
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': graph,
          }),
        }}
      />
      {children}
    </>
  );
}

