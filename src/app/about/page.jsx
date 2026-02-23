"use client";

import HeroSection from "@/components/HeroSection";
import FounderSection from "@/components/FounderSection";
import LeftRight from "@/components/LeftRight";
import FAQ from "@/components/FAQ";

export default function AboutPage() {
  const sections = [
    {
      step: "01",
      title: "AI-Powered Development",
      description: "We leverage cutting-edge AI tools and low-code platforms to build your MVP in record time. Our hybrid approach combines the speed of no-code with the flexibility of custom development.",
      additional: "Enterprise-grade quality at startup speed."
    },
    {
      step: "02",
      title: "Founder-First Partnership",
      description: "You're not just a client — you're a partner. We take time to understand your vision, your market, and your goals. No technical jargon, just clear communication and daily updates.",
      additional: "Your success is our success."
    },
    {
      step: "03",
      title: "Proven Launch System",
      description: "With 100+ successful launches, we've perfected a repeatable system that delivers. From discovery to deployment, every step is optimized for speed without sacrificing quality.",
      additional: "Launch in weeks, not months."
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
        description="We don't just write code — we build momentum. Our proven system helps founders launch AI-powered apps in as little as 19 days, giving you the speed to market you need to succeed."
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