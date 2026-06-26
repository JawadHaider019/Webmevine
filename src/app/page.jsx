import dynamic from 'next/dynamic';
import Hero from "@/components/Hero";

const WebsiteValueSection = dynamic(() => import('@/components/WebsiteValueSection'), { ssr: true });
const Whyus = dynamic(() => import('@/components/Whyus'), { ssr: true });
const CaseStudies = dynamic(() => import('@/components/CaseStudies'), { ssr: true });
const Partners = dynamic(() => import('@/components/Partners'), { ssr: true });
const HowItWorks = dynamic(() => import('@/components/HowItWorks'), { ssr: true });
const Testimonials = dynamic(() => import('@/components/Testimonials'), { ssr: true });
const FAQ = dynamic(() => import('@/components/FAQ'), { ssr: true });

export default function Home() {
  return (
    <>
      <Hero />
      <WebsiteValueSection />
      <Whyus />
      <CaseStudies />
      <Partners />
      <HowItWorks />
      <Testimonials />
      <FAQ />
    </>
  );
}
