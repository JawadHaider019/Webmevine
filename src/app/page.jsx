// Server component: the page shell is static HTML; each section hydrates its own interactivity.
import Hero from "@/components/Hero";
import WebsiteValueSection from "@/components/WebsiteValueSection";
import Whyus from "@/components/Whyus";
import CaseStudies from "@/components/CaseStudies";
import Partners from "@/components/Partners";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";

export default function Home() {
  return (
    <>
      <Hero />
      <WebsiteValueSection />
      <Whyus />
      <CaseStudies />
      <Partners />
      <Testimonials />
      <FAQ />
    </>
  );
}
