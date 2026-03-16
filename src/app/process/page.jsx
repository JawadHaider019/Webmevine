"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import HeroSection from "@/components/HeroSection";
import SectionHeader from "@/components/SectionHeader";
import Link from "next/link";
import { 
  FiCheckCircle, 
  FiUsers, 
  FiAward,
  FiShield,
  FiZap,
  FiClock
} from "react-icons/fi";
import HowItWorks from "@/components/HowItWorks";
import GlowingButton from "@/components/GlowingButton";

export default function ProcessPage() {
  const [hoveredCard, setHoveredCard] = useState(null);

  const features = [
    {
      id: 1,
      title: "Founder-First Approach",
      description: "You're not just a client — you're a partner. We deeply understand your vision, market, and goals to build websites and SaaS products that accelerate growth.",
      icon: FiUsers,
      highlight: "Strategic Partner",
      stats: "100%"
    },
    {
      id: 2,
      title: "Zero-Risk Guarantee",
      description: "Confidence changes everything. If you're not satisfied, you get your money back. We remove the risk so you can move forward with certainty. That's the level of conviction we operate with.",
      icon: FiShield,
      highlight: "Risk-Free",
      stats: "100%"
    },
    {
      id: 3,
      title: "Strategic Consultation",
      description: "Before you invest, we align on business goals, revenue model, customer psychology, and growth roadmap. This isn't order-taking. It's a strategic partnership.",
      icon: FiClock,
      highlight: "Founder-Led",
      stats: "Free"
    },
    {
      id: 4,
      title: "Full Code Ownership",
      description: "You own everything we build — from custom React JS websites to Bubble.io MVPs. No lock-ins, hidden fees, or proprietary systems.",
      icon: FiAward,
      highlight: "100% Yours",
      stats: "Ownership"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
        duration: 0.6
      }
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <HeroSection
        heading="From Idea to"
        headingAccent="Launch"
        subheading="We turn your vision into a live product in just 21 days with complete transparency every step of the way."
        ctaText="Start Your Journey"
        ctaLink="/contact"
        gradientFrom="from-black"
        gradientVia="via-red-700"
        gradientTo="to-black"
      />
      
      <HowItWorks />

      {/* Why Our Process Works Section - With enhanced hover effects */}
      <section className="w-full bg-white text-black flex flex-col items-center justify-center py-20 px-4 md:px-0 overflow-hidden">
        <div className="w-full max-w-7xl mx-auto flex flex-col gap-12">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <SectionHeader
              heading="Why Our Process Works"
              description="We've refined our approach through 200+ successful launches to ensure you get the best results."
              gradientHeading={true}
              gradientFrom="from-black"
              gradientVia="via-red-600"
              gradientTo="to-gray-900"
            />
          </motion.div>

          {/* Features Grid - 4 Cards */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {features.map((feature) => {
              const IconComponent = feature.icon;
              const isHovered = hoveredCard === feature.id;
              
              return (
                <motion.div
                  key={feature.id}
                  variants={itemVariants}
                  onHoverStart={() => setHoveredCard(feature.id)}
                  onHoverEnd={() => setHoveredCard(null)}
                  className="group relative cursor-pointer"
                >
                  {/* Glow effect on hover */}
                  <motion.div 
                    className="absolute -inset-0.5 bg-gradient-to-r from-red-600/20 to-red-300/30 rounded-2xl blur"
                    animate={{ 
                      opacity: isHovered ? 1 : 0
                    }}
                    transition={{ duration: 0.3 }}
                  />
                  
                  {/* Card */}
                  <motion.div 
                    className="relative bg-white p-6 rounded-xl border shadow-sm border-gray-200/30 h-full flex flex-col"
                    style={{ backgroundColor: '#ffffff' }}
                    animate={{ 
                      borderColor: isHovered ? '#ef4444' : '#e5e7eb',
                      y: isHovered ? -4 : 0,
                      boxShadow: isHovered ? '0 10px 25px -5px rgba(239, 68, 68, 0.1), 0 8px 10px -6px rgba(239, 68, 68, 0.1)' : '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    {/* Icon with background */}
                    <motion.div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                      style={{ backgroundColor: isHovered ? '#ef4444' : '#fee2e2' }}
                      animate={{ 
                        scale: isHovered ? 1.1 : 1,
                      }}
                    >
                      <IconComponent className={`w-6 h-6 ${isHovered ? 'text-white' : 'text-red-600'}`} />
                    </motion.div>

                    {/* Stats Number */}
                    <motion.div 
                      className="text-2xl font-bold text-red-600 mb-1 font-['Marcellus']"
                      animate={{ 
                        scale: isHovered ? 1.1 : 1,
                      }}
                    >
                      {feature.stats}
                    </motion.div>

                    {/* Highlight/Subtitle */}
                    <motion.p 
                      className="font-['Manrope'] text-red-600 text-xs font-semibold uppercase tracking-wider mb-2"
                      animate={{ 
                        x: isHovered ? 5 : 0
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      {feature.highlight}
                    </motion.p>

                    {/* Title */}
                    <h3 className="font-['Marcellus'] text-lg font-bold text-gray-900 mb-3 leading-tight">
                      {feature.title}
                    </h3>

                    {/* Description */}
                    <div className="relative flex-grow">
                      <p className="font-['Manrope'] text-gray-600 text-sm leading-relaxed z-10">
                        {feature.description}
                      </p>
                    </div>

                    {/* Animated Number Background */}
                    <motion.div 
                      className="font-['Marcellus'] absolute bottom-3 right-4 text-5xl font-black text-gray-300 select-none z-0"
                      animate={{ 
                        scale: isHovered ? 1.1 : 1,
                        opacity: isHovered ? 0.4 : 0.2,
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      {(feature.id).toString().padStart(2, '0')}
                    </motion.div>

                    {/* Bottom accent line on hover */}
                    <motion.div
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] bg-gradient-to-r from-red-600 to-red-700"
                      animate={{ 
                        width: isHovered ? '50%' : 0
                      }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.div>
                </motion.div>
              );
            })}
          </motion.div>
{/* CTA Button */}
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5, delay: 0.4 }}
  viewport={{ once: true }}
  className="text-center mt-8"
>
  <Link href="/contact">
    <GlowingButton 
      glowColor="255, 150, 150"
      spreadSize="small"
      speed="medium"
      waveCount={5} 
    >
      Book Your Free Strategy Call
    </GlowingButton>
  </Link>
</motion.div>
        </div>
      </section>

      {/* Results Section */}
      <section className="w-full bg-white text-black flex flex-col items-center justify-center py-20 px-4 md:px-0 overflow-hidden">
        <div className="w-full max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <motion.span 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-red-600 text-sm font-['Manrope'] font-semibold uppercase tracking-wider mb-4 block"
              >
                PROVEN RESULTS
              </motion.span>

              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="font-['Marcellus'] text-4xl md:text-5xl text-gray-900 mb-6 font-semibold"
              > 
                Web Development Company{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-black via-red-600 to-red-900">
                  Trusted by 100+ Growing Brands
                </span> 
              </motion.h2>

              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="font-['Manrope'] text-gray-600 text-lg mb-8 leading-relaxed"
              >
                WebMavine specializes in <strong>custom website development</strong>, <strong>React JS development</strong>, 
                and <strong>SaaS MVP builds</strong>. Our 21-day framework has helped founders, 
                e-commerce brands, and small businesses launch faster with scalable, 
                high-performance digital infrastructure.
              </motion.p>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: "100+", label: "Projects Delivered", delay: 0.4 },
                  { value: "21", label: "Days to Launch", delay: 0.45 },
                  { value: "100%", label: "Code Ownership", delay: 0.5 },
                  { value: "30", label: "Days Free Support", delay: 0.55 }
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    whileHover={{ 
                      y: -5, 
                      boxShadow: "0 20px 40px rgba(239,68,68,0.1)",
                      borderColor: "#ef4444",
                      transition: { duration: 0.3 }
                    }}
                    viewport={{ once: true }}
                    transition={{ delay: stat.delay }}
                    className="backdrop-blur-lg bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300 cursor-default"
                  >
                    <motion.div 
                      className="font-['Marcellus'] text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-black via-red-600 to-red-900 mb-2"
                      whileHover={{ scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      {stat.value}
                    </motion.div>
                    <div className="font-['Manrope'] text-sm text-gray-500">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right Content */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ 
                  boxShadow: "0 30px 60px rgba(239,68,68,0.15)",
                  borderColor: "#ef4444/40"
                }}
                transition={{ delay: 0.2 }}
                className="backdrop-blur-lg bg-gradient-to-br from-red-600/5 to-red-500/5 border border-red-600/20 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-500"
              >
                <motion.h3 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="font-['Marcellus'] text-2xl font-bold text-gray-900 mb-6"
                >
                  What You Get with WebMavine
                </motion.h3>

                <div className="space-y-4">
                  {[
                    "Custom coded website development — no templates, no shortcuts",
                    "Daily progress updates with demos, screenshots, and clear milestones",
                    "React JS or Bubble.io SaaS development built for scale",
                    "Full ownership of source code and digital assets",
                    "21-day structured delivery with zero-risk guarantee"
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      whileHover={{ x: 5 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className="flex items-start gap-3 group"
                    >
                      <motion.div
                        whileHover={{ scale: 1.2 }}
                        transition={{ duration: 0.5 }}
                        className="flex-shrink-0"
                      >
                        <FiCheckCircle className="w-6 h-6 text-red-600 group-hover:text-red-500 transition-colors duration-300" />
                      </motion.div>
                      <span className="font-['Manrope'] text-gray-700">
                        {item}
                      </span>
                    </motion.div>
                  ))}
                </div>

                {/* Premium Quote */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="mt-8 pt-6 border-t-2 border-red-600/20 relative overflow-hidden"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-red-600/5 to-transparent"
                    initial={{ x: "-100%" }}
                    whileInView={{ x: "100%" }}
                    transition={{ duration: 1.5, delay: 1 }}
                  />
                  <motion.p 
                    className="italic text-lg font-light text-gray-600 leading-relaxed"
                  >
                    “We don't just build websites. We engineer scalable digital assets 
                    that help founders launch faster, validate smarter, and grow with confidence.”
                  </motion.p>
                  <motion.div 
                    whileHover={{ x: 5 }}
                    className="text-sm text-red-600 font-semibold mt-3"
                  >
                    — WebMavine
                  </motion.div>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}