import Hero from "@/components/Hero";
import Whyus from "@/components/Whyus";
import CaseStudies from "@/components/CaseStudies";
import Partners from "@/components/Partners";
import HowItWorks from "@/components/HowItWorks";
import Testimonials from "@/components/Testimonials";
import FounderFocus from "@/components/FounderFocus";
import FAQ from "@/components/FAQ";
import CTA from '@/components/CTA'
import ValueSection from "@/components/ValueSection";

export default function Home() {
  return (
    <>
      <Hero />
       <Whyus/>
       <CaseStudies/>
       <Partners />
       <HowItWorks/>
       <Testimonials/>
       <FounderFocus/>
       <FAQ/>
      
    </>
  );
}
