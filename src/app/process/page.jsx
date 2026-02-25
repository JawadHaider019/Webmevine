"use client";

import { motion } from "framer-motion";
import HeroSection from "@/components/HeroSection";
import { FiArrowRight, FiCheckCircle, FiClock, FiUsers, FiCode, FiZap, FiTarget, FiAward } from "react-icons/fi";
import { BsRocket, BsCalendarCheck, BsShieldCheck } from "react-icons/bs";
import { LuSparkles } from "react-icons/lu";
import { HiOutlineLightBulb } from "react-icons/hi";
import Link from "next/link";
import HowItWorks from "@/components/HowItWorks";
import CTA from '@/components/CTA'

export default function ProcessPage() {
  const steps = [
    {
      id: 1,
      number: "01",
      title: "Discovery Call",
      description: "We dive deep into your project to understand your goals, your users, and what success looks like for you.",
      icon: HiOutlineLightBulb,
      duration: "Day 1-2",
      color: "from-red-600 to-red-500"
    },
    {
      id: 2,
      number: "02",
      title: "UI/UX Design",
      description: "We map your entire user journey and create rough UI wireframes in Figma. You'll see everything before we even start developing.",
      icon: FiTarget,
      duration: "Day 3-7",
      color: "from-red-500 to-black"
    },
    {
      id: 3,
      number: "03",
      title: "Development",
      description: "We build your app over 3 weeks with constant updates throughout, so you never have to ask about the progress on that feature you love.",
      icon: FiCode,
      duration: "Day 8-21",
      color: "from-red-600 to-red-500"
    },
    {
      id: 4,
      number: "04",
      title: "Quality Assurance",
      description: "The next week is dedicated to QA testing. We catch the bugs before your users do, so they get something that actually works.",
      icon: BsShieldCheck,
      duration: "Day 22-26",
      color: "from-red-500 to-red-600"
    },
    {
      id: 5,
      number: "05",
      title: "Launch & Support",
      description: "Once everything is done, we launch your apps, and stick with you for 19 days in case you need any support from us.",
      icon: BsRocket,
      duration: "Day 15-10",
      color: "from-red-600 to-amber-600"
    }
  ];

  const features = [
    {
      title: "Founder-First Approach",
      description: "You're not just a client — you're a partner. We take time to understand your vision, your market, and your goals.",
      icon: FiUsers,
      stats: "100%"
    },
    {
      title: "Daily Updates",
      description: "No more waiting weeks to see progress. You get daily updates with screenshots, videos, and demos.",
      icon: FiClock,
      stats: "24/7"
    },
    {
      title: "No Technical Jargon",
      description: "We speak founder language, not developer jargon. Clear communication every step of the way.",
      icon: FiZap,
      stats: "Zero"
    },
    {
      title: "Full Code Ownership",
      description: "You own everything we build. No lock-ins, no hidden fees, no proprietary systems.",
      icon: FiAward,
      stats: "100%"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
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
        badge="✦ OUR PROCESS ✦"
        heading="From Idea to"
        headingAccent="Launch"
        subheading="We turn your vision into a live product in just 30 days — with complete transparency every step of the way."
        ctaText="Start Your Journey"
        ctaLink="/contact"
        gradientFrom="from-black"
        gradientVia="via-red-700"
        gradientTo="to-black"
      />
      
      <HowItWorks />

      {/* Why Our Process Works Section - Using the new card design */}
      <section className="w-full bg-white text-black flex flex-col items-center justify-center py-20 px-4 md:px-0">
        <div className="w-full max-w-7xl mx-auto flex flex-col gap-12">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="font-['Marcellus'] text-4xl md:text-5xl text-gray-900 mb-4">
              Why Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-500">Process Works</span>
            </h2>
            <p className="font-['Manrope'] text-gray-600 max-w-3xl mx-auto">
              We've refined our approach through 200+ successful launches to ensure you get the best results.
            </p>
          </motion.div>

          {/* Features Grid - Using the new card design */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="group relative"
                >
                  {/* Card with the new design */}
                  <div className="backdrop-blur-lg bg-gradient-to-br from-white to-gray-50 border border-gray-200 w-full rounded-2xl py-8 px-6 shadow-lg hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                    {/* Icon with gradient background */}
                    <div className="w-14 h-14 bg-gradient-to-br from-red-600/10 to-red-500/10 rounded-xl flex items-center justify-center mb-6">
                      <Icon className="w-7 h-7 text-red-600" />
                    </div>

                    {/* Stats Number (like in the reference) */}
                    <div className="text-3xl font-bold text-red-600 mb-2 font-['Marcellus']">
                      {feature.stats}
                    </div>

                    {/* Title */}
                    <h3 className="font-['Marcellus'] text-xl font-bold text-gray-900 mb-3">
                      {feature.title}
                    </h3>

                    {/* Description */}
                    <p className="font-['Manrope'] text-gray-600 text-sm leading-relaxed">
                      {feature.description}
                    </p>

                    {/* Decorative bottom line */}
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-gradient-to-r from-red-600 to-red-500 group-hover:w-1/2 transition-all duration-300" />
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Results Section - Using the new card design */}
      <section className="w-full bg-white text-black flex flex-col items-center justify-center py-20 px-4 md:px-0">
        <div className="w-full max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-red-600 text-sm font-['Manrope'] font-semibold uppercase tracking-wider mb-4 block">
                PROVEN RESULTS
              </span>
              <h2 className="font-['Marcellus'] text-4xl md:text-5xl text-gray-900 mb-6">
                We've Helped <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-500">200+ Founders</span> Launch Successfully
              </h2>
              <p className="font-['Manrope'] text-gray-600 text-lg mb-8 leading-relaxed">
                Our process isn't just theory — it's been tested and refined through hundreds of real projects. From bootstrapped startups to funded companies, we've helped founders across industries bring their visions to life.
              </p>

              {/* Stats Grid - Using the new card design */}
              <div className="grid grid-cols-2 gap-4">
                <div className="backdrop-blur-lg bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-2xl p-6 text-center">
                  <div className="font-['Marcellus'] text-4xl font-bold text-red-600 mb-2">200+</div>
                  <div className="font-['Manrope'] text-sm text-gray-500">Successful Launches</div>
                </div>
                <div className="backdrop-blur-lg bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-2xl p-6 text-center">
                  <div className="font-['Marcellus'] text-4xl font-bold text-red-600 mb-2">30</div>
                  <div className="font-['Manrope'] text-sm text-gray-500">Days to Launch</div>
                </div>
                <div className="backdrop-blur-lg bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-2xl p-6 text-center">
                  <div className="font-['Marcellus'] text-4xl font-bold text-red-600 mb-2">100%</div>
                  <div className="font-['Manrope'] text-sm text-gray-500">Code Ownership</div>
                </div>
                <div className="backdrop-blur-lg bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-2xl p-6 text-center">
                  <div className="font-['Marcellus'] text-4xl font-bold text-red-600 mb-2">24/7</div>
                  <div className="font-['Manrope'] text-sm text-gray-500">Support</div>
                </div>
              </div>
            </motion.div>

            {/* Right Content - Features List Card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="backdrop-blur-lg bg-gradient-to-br from-red-600/5 to-red-500/5 border border-red-600/20 rounded-2xl p-8 shadow-lg">
                <h3 className="font-['Marcellus'] text-2xl font-bold text-gray-900 mb-6">
                  What You Get
                </h3>
                <div className="space-y-4">
                  {[
                    "Daily progress updates with screenshots and videos",
                    "No technical jargon — we speak founder language",
                    "Full ownership of all code and assets",
                    "30 days of free post-launch support",
                    "Flexible scaling as your user base grows"
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <FiCheckCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                      <span className="font-['Manrope'] text-gray-700">{item}</span>
                    </motion.div>
                  ))}
                </div>

                {/* Quote Section - Like in the reference */}
                <div className="mt-8 pt-6 border-t-2 border-red-600/20">
                  <p className="italic text-lg font-light text-gray-600">
                    “Our process is designed to get you to market faster without sacrificing quality.”
                  </p>
                  <div className="text-sm text-red-600 font-semibold mt-3">— Ahmtech Team</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

    </div>
  );
}