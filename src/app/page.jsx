import dynamic from 'next/dynamic';
import Hero from "@/components/Hero";

const WebsiteValueSection = dynamic(() => import('@/components/WebsiteValueSection'), { ssr: true });
const Whyus = dynamic(() => import('@/components/Whyus'), { ssr: true });
const CaseStudies = dynamic(() => import('@/components/CaseStudies'), { ssr: true });
const Partners = dynamic(() => import('@/components/Partners'), { ssr: true });
const HowItWorks = dynamic(() => import('@/components/HowItWorks'), { ssr: false, loading: () => <div className="h-96 bg-black/5 animate-pulse" /> });
const Testimonials = dynamic(() => import('@/components/Testimonials'), { ssr: false, loading: () => <div className="h-96 bg-black/5 animate-pulse" /> });
const FAQ = dynamic(() => import('@/components/FAQ'), { ssr: false, loading: () => <div className="h-96 bg-black/5 animate-pulse" /> });

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
