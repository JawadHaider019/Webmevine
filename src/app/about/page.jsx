"use client";

import HeroSection from "@/components/HeroSection";
import FounderSection from "@/components/FounderSection";
import LeftRight from "@/components/LeftRight";
import FAQ from "@/components/FAQ";

export default function AboutPage() {
const sections = [
  {
    step: "01",
    title: "Strategic Website Development",
    description: "We combine conversion strategy, UX architecture, and custom development in React JS or Bubble.io to build scalable SaaS and e-commerce platforms. Every project is engineered for performance, growth, and long-term flexibility.",
    additional: "Enterprise-level execution. Startup-level speed."
  },
  {
    step: "02",
    title: "Founder-First Partnership",
    description: "You’re not just hiring developers  you’re gaining a strategic partner. We align on your business model, customer psychology, and growth roadmap before writing a single line of code.",
    additional: "Clear communication. Defined milestones. Full transparency."
  },
  {
    step: "03",
    title: "Proven 21-Day Launch System",
    description: "Our structured 4-week framework takes you from strategy and wireframes to development, testing, and launch without the typical 3–6 month delays. Every phase is optimized for speed and precision.",
    additional: "Launch in weeks. Not months."
  }
];
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <HeroSection
        badge=" 100+ Successful Launches "
        heading="We Build"
        headingAccent="Momentum"
        subheading="Your rapid launch partner for AI-powered apps"
        ctaText="Start Your Journey"
        ctaLink="/contact"
        gradientFrom="from-black"
        gradientVia="via-red-700"
        gradientTo="to-black"
      />
      
      {/* LeftRight Component with SectionHeader */}
      <LeftRight
        smallHeading="WHY FOUNDERS CHOOSE US"
        heading="Your Vision,"
        headingAccent="Our Execution"
        description="We don't just write code we build momentum. Our proven system helps founders launch AI-powered apps in as little as 19 days, giving you the speed to market you need to succeed."
        buttonText="Book Free Call"
        buttonLink="/contact"
        sections={sections}
        gradientFrom="from-black"
        gradientVia="via-red-500"
        gradientTo="to-black"
      />
      
      <FounderSection />
      <FAQ/>
    </div>
  );
}