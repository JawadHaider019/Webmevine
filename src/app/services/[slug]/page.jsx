import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArrowRight, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import HeroSection from '@/components/HeroSection';
import FAQ from '@/components/FAQ';
import GlowingButton from '@/components/GlowingButton';
import { services, getServiceBySlug } from '@/data/services';
import { caseStudies } from '@/data/caseStudies';
import { getBlogBySlug } from '@/lib/blogs';

const SITE_URL = 'https://webmavien.com';

// Every service page is pre-rendered at build time; unknown slugs return 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return {};
  const url = `${SITE_URL}/services/${service.slug}`;
  return {
    title: { absolute: service.metaTitle },
    description: service.metaDescription,
    alternates: { canonical: url },
    openGraph: {
      title: service.metaTitle,
      description: service.metaDescription,
      url,
      siteName: 'WebMavien',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: service.metaTitle,
      description: service.metaDescription,
    },
  };
}

const PROCESS_STEPS = [
  { week: 'Week 1', title: 'Strategy & Scope', desc: 'We agree goals, the core workflow, acceptance criteria and the right stack, in writing.' },
  { week: 'Week 2', title: 'UX & Design', desc: 'Wireframes and interface designs for the key journeys, reviewed with you before build.' },
  { week: 'Week 3', title: 'Build', desc: 'Senior engineers build the product, with a working demo shared every week.' },
  { week: 'Week 4', title: 'QA & Launch', desc: 'Testing, performance tuning, analytics, launch and full handover of code and accounts.' },
];

export default async function ServicePage({ params }) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) notFound();

  const url = `${SITE_URL}/services/${service.slug}`;
  const proof = service.caseStudies
    .map((s) => caseStudies.find((c) => c.slug === s))
    .filter(Boolean);
  const guides = service.guides.map((g) => getBlogBySlug(g)).filter(Boolean);
  const related = services.filter((s) => s.slug !== service.slug);
  const faqItems = service.faqs.map((f, i) => ({ id: i + 1, question: f.q, answer: f.a }));

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        '@id': `${url}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Services', item: `${SITE_URL}/services` },
          { '@type': 'ListItem', position: 3, name: service.name, item: url },
        ],
      },
      {
        '@type': 'Service',
        '@id': `${url}#service`,
        name: service.name,
        serviceType: service.name,
        description: service.intro,
        url,
        provider: { '@id': `${SITE_URL}/#organization` },
        areaServed: ['United Kingdom', 'United States', 'United Arab Emirates', 'Germany', 'Worldwide'],
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: `${service.name} deliverables`,
          itemListElement: service.deliverables.map((d) => ({
            '@type': 'Offer',
            itemOffered: { '@type': 'Service', name: d.title, description: d.desc },
          })),
        },
      },
    ],
  };

  return (
    <div className="bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <HeroSection
        kicker={service.kicker}
        heading={service.heading}
        headingAccent={service.headingAccent}
        subheading={service.subheading}
        ctaText="Book a Free Strategy Call"
        ctaLink="/contact"
        gradientFrom="from-black"
        gradientVia="via-red-700"
        gradientTo="to-black"
      />

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <ol className="flex flex-wrap items-center gap-2 font-['Manrope'] text-xs text-gray-500">
          <li><Link href="/" className="hover:text-red-600">Home</Link></li>
          <li aria-hidden="true">/</li>
          <li><Link href="/services" className="hover:text-red-600">Services</Link></li>
          <li aria-hidden="true">/</li>
          <li className="text-gray-900 font-semibold">{service.name}</li>
        </ol>
      </nav>

      {/* Direct answer + highlights */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid lg:grid-cols-2 gap-10 items-center">
        <div>
          <span className="font-['Manrope'] text-xs font-bold uppercase tracking-widest text-red-600">
            {service.name}
          </span>
          <h2 className="font-['Marcellus'] text-3xl md:text-4xl text-gray-900 mt-3 mb-5 leading-tight">
            What is WebMavien&apos;s {service.name} service?
          </h2>
          <p className="font-['Manrope'] text-gray-700 text-base md:text-lg leading-relaxed">
            {service.intro}
          </p>
        </div>
        <ul className="space-y-4 bg-zinc-50 border border-gray-200 rounded-2xl p-6 sm:p-8">
          {service.highlights.map((h) => (
            <li key={h} className="flex items-start gap-3 font-['Manrope'] text-gray-800">
              <CheckCircle2 className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <span>{h}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Deliverables */}
      <section className="bg-zinc-50 border-y border-gray-200 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-['Marcellus'] text-3xl md:text-4xl text-gray-900 text-center mb-3">
            What We Build
          </h2>
          <p className="font-['Manrope'] text-gray-600 text-center max-w-2xl mx-auto mb-10">
            Everything included in our {service.name.toLowerCase()} service.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {service.deliverables.map((d, i) => (
              <div key={d.title} className="bg-white rounded-2xl border border-gray-200 p-6 hover:border-red-500/40 hover:shadow-md transition-all">
                <span className="font-['Marcellus'] text-sm text-red-600/60 font-bold">
                  {(i + 1).toString().padStart(2, '0')}
                </span>
                <h3 className="font-['Marcellus'] text-xl text-gray-900 mt-2 mb-2">{d.title}</h3>
                <p className="font-['Manrope'] text-sm text-gray-600 leading-relaxed">{d.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="font-['Marcellus'] text-3xl md:text-4xl text-gray-900 text-center mb-3">
          How We Deliver in 21–28 Days
        </h2>
        <p className="font-['Manrope'] text-gray-600 text-center max-w-2xl mx-auto mb-10">
          An agreed scope, weekly demos and a clear launch date.{' '}
          <Link href="/process" className="text-red-600 font-semibold hover:underline">See our full process</Link>.
        </p>
        <ol className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {PROCESS_STEPS.map((step) => (
            <li key={step.week} className="rounded-2xl border border-gray-200 p-6">
              <span className="inline-block px-3 py-1 rounded-full bg-red-50 text-red-700 text-[11px] font-bold uppercase tracking-wider">
                {step.week}
              </span>
              <h3 className="font-['Marcellus'] text-lg text-gray-900 mt-3 mb-2">{step.title}</h3>
              <p className="font-['Manrope'] text-sm text-gray-600 leading-relaxed">{step.desc}</p>
            </li>
          ))}
        </ol>

        <div className="mt-10 text-center">
          <h3 className="font-['Manrope'] text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">
            Technologies we use
          </h3>
          <ul className="flex flex-wrap justify-center gap-2">
            {service.stack.map((t) => (
              <li key={t} className="px-3 py-1.5 rounded-full border border-gray-200 bg-white font-['Manrope'] text-sm text-gray-700">
                {t}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Case study proof */}
      {proof.length > 0 && (
        <section className="bg-gradient-to-br from-black via-zinc-900 to-red-950 py-16 text-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-['Marcellus'] text-3xl md:text-4xl text-center mb-3">
              Proven Results
            </h2>
            <p className="font-['Manrope'] text-zinc-300 text-center max-w-2xl mx-auto mb-10">
              Real projects we have delivered for founders and businesses.
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {proof.map((study) => (
                <Link
                  key={study.slug}
                  href={`/casestudies/${study.slug}`}
                  className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-red-500/50 transition-colors"
                >
                  {study.images?.main && (
                    <div className="relative h-44 bg-zinc-800">
                      <Image
                        src={study.images.main}
                        alt={`${study.title} case study`}
                        fill
                        sizes="(max-width: 768px) 100vw, 380px"
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <span className="text-[11px] font-bold uppercase tracking-widest text-red-400">
                      {study.category}
                    </span>
                    <h3 className="font-['Marcellus'] text-xl mt-2 mb-2">{study.title}</h3>
                    <p className="font-['Manrope'] text-sm text-zinc-300 leading-relaxed mb-4">
                      {study.shortDescription}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {(study.stats || []).slice(0, 2).map((st) => (
                        <span key={st.label} className="px-2.5 py-1 rounded-lg bg-red-600/20 text-red-200 text-xs font-bold">
                          {st.value} {st.label}
                        </span>
                      ))}
                    </div>
                    <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-red-400 group-hover:text-white transition-colors">
                      Read the case study <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related guides */}
      {guides.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="font-['Marcellus'] text-3xl md:text-4xl text-gray-900 text-center mb-10">
            Guides for Founders
          </h2>
          <div className="grid md:grid-cols-3 gap-5">
            {guides.map((g) => (
              <Link
                key={g.slug}
                href={`/blog/${g.slug}`}
                className="group rounded-2xl border border-gray-200 p-6 hover:border-red-500/40 hover:shadow-md transition-all flex flex-col"
              >
                <span className="text-[11px] font-bold uppercase tracking-widest text-red-600">{g.category}</span>
                <h3 className="font-['Marcellus'] text-lg text-gray-900 mt-2 mb-3 leading-snug">{g.title}</h3>
                <p className="font-['Manrope'] text-sm text-gray-600 leading-relaxed line-clamp-3 mb-4">{g.excerpt}</p>
                <span className="mt-auto inline-flex items-center gap-1 text-sm font-semibold text-red-600">
                  Read guide <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <FAQ
        items={faqItems}
        smallHeading={`${service.name} FAQ`}
        heading="Frequently Asked Questions"
        description={`Common questions about our ${service.name.toLowerCase()} service`}
        sectionId="service-faq"
      />

      {/* CTA + related services */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="rounded-3xl bg-gradient-to-br from-black via-zinc-900 to-red-950 p-8 sm:p-12 text-white text-center border border-red-500/20">
          <h2 className="font-['Marcellus'] text-2xl sm:text-4xl mb-3">
            Ready to Start Your {service.name} Project?
          </h2>
          <p className="font-['Manrope'] text-zinc-300 max-w-2xl mx-auto mb-8">
            Book a free 30-minute strategy call. We will map your scope, recommend the right stack and send a written plan and timeline.
          </p>
          <Link href="/contact" className="inline-block">
            <GlowingButton glowColor="255, 255, 255" variant="primary">
              Book Your Free Strategy Call
            </GlowingButton>
          </Link>
        </div>

        <div className="mt-12">
          <h2 className="font-['Manrope'] text-xs font-bold uppercase tracking-widest text-gray-500 text-center mb-4">
            Other services
          </h2>
          <ul className="flex flex-wrap justify-center gap-3">
            {related.map((s) => (
              <li key={s.slug}>
                <Link
                  href={`/services/${s.slug}`}
                  className="inline-block px-4 py-2 rounded-full border border-gray-200 font-['Manrope'] text-sm text-gray-700 hover:border-red-500 hover:text-red-600 transition-colors"
                >
                  {s.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
