"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  FiArrowRight,
  FiCode,
  FiTag,
  FiClock,
  FiUsers,
  FiCheckCircle,
  FiStar,
  FiZap,
} from "react-icons/fi";
import { caseStudies } from "@/data/caseStudies";
import HeroSection from "@/components/HeroSection";

const FILTER_TABS = [
  { id: "all", label: "All Case Studies" },
  { id: "Bubble.io & No-Code", label: "Bubble.io & No-Code" },
  { id: "React & Full-Stack", label: "React & Full-Stack" },
  { id: "AI & SaaS", label: "AI & SaaS" },
  { id: "Marketplace & E-Commerce", label: "Marketplaces & E-Commerce" },
];

function CaseStudiesFilterSync({ onFilter }) {
  const searchParams = useSearchParams();
  const filterParam = searchParams?.get("filter") || "";

  useEffect(() => {
    if (filterParam && FILTER_TABS.some((t) => t.id === filterParam)) {
      onFilter(filterParam);
    }
  }, [filterParam, onFilter]);

  return null;
}

export default function CaseStudiesPage() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [imageErrors, setImageErrors] = useState({});

  const filteredStudies = useMemo(() => {
    if (activeFilter === "all") return caseStudies;
    if (activeFilter === "Marketplace & E-Commerce") {
      return caseStudies.filter(
        (s) =>
          s.category.toLowerCase().includes("marketplace") ||
          s.category.toLowerCase().includes("e-commerce") ||
          s.category.toLowerCase().includes("crowdfunding")
      );
    }
    if (activeFilter === "Bubble.io & No-Code") {
      return caseStudies.filter((s) =>
        s.technologies.some((t) => t.toLowerCase().includes("bubble"))
      );
    }
    if (activeFilter === "React & Full-Stack") {
      return caseStudies.filter((s) =>
        s.technologies.some(
          (t) =>
            t.toLowerCase().includes("react") ||
            t.toLowerCase().includes("node")
        )
      );
    }
    if (activeFilter === "AI & SaaS") {
      return caseStudies.filter(
        (s) =>
          s.stackGroup === "AI & SaaS" ||
          s.category.toLowerCase().includes("saas") ||
          s.category.toLowerCase().includes("ai")
      );
    }
    return caseStudies.filter((study) => study.category === activeFilter);
  }, [activeFilter]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 14,
        duration: 0.5,
      },
    },
  };

  const handleImageError = (studyId, imageType, index) => {
    setImageErrors((prev) => {
      if (imageType === "main") {
        return { ...prev, [`${studyId}-main`]: true };
      } else if (imageType === "gallery" && index !== undefined) {
        return { ...prev, [`${studyId}-gallery-${index}`]: true };
      }
      return prev;
    });
  };

  const getImageSource = (study, type, index) => {
    if (type === "main") {
      if (imageErrors[`${study.id}-main`]) {
        return `https://placehold.co/1200x800/1a1a1a/ffffff?text=${encodeURIComponent(
          study.title
        )}`;
      }
      return study.images.main;
    } else if (type === "gallery" && index !== undefined) {
      if (imageErrors[`${study.id}-gallery-${index}`]) {
        return `https://placehold.co/800x600/1a1a1a/ffffff?text=${encodeURIComponent(
          study.title
        )}+${index + 1}`;
      }
      return study.images.gallery[index];
    }
    return "";
  };

  return (
    <main className="min-h-screen bg-white">
      <Suspense fallback={null}>
        <CaseStudiesFilterSync onFilter={setActiveFilter} />
      </Suspense>
      {/* Hero Section */}
      <HeroSection
        heading="Launch"
        headingAccent="Stories"
        subheading="Each case study highlights our engineering process, 21–28 day delivery speed, and measurable business outcomes—bringing founders' visions to life with React, Next.js, AI, and Bubble.io."
        ctaText="Start Your Journey"
        ctaLink="/contact"
        gradientFrom="from-black"
        gradientVia="via-red-700"
        gradientTo="to-black"
      />

      {/* Executive Proof & Filter Strip */}
      <section className="pt-10 pb-4 px-4 border-b border-gray-100 bg-zinc-50/60">
        <div className="max-w-7xl mx-auto">
          {/* Aggregate Authority Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { value: "21–28 Days", label: "Average Production Launch" },
              { value: "5.0 ★", label: "Verified Founder Satisfaction" },
              { value: "100%", label: "Money-Back Delivery Guarantee" },
              { value: "React & Bubble.io", label: "Custom Code & Rapid SaaS Stacks" },
            ].map((metric, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-200/80 shadow-xs text-center"
              >
                <div className="font-['Marcellus'] text-xl sm:text-2xl font-bold text-red-600">
                  {metric.value}
                </div>
                <div className="font-['Manrope'] text-xs text-gray-600 mt-1 font-medium">
                  {metric.label}
                </div>
              </div>
            ))}
          </div>

          {/* Interactive Tech & Industry Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 pb-4">
            {FILTER_TABS.map((tab) => {
              const isActive = activeFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveFilter(tab.id)}
                  style={
                    isActive
                      ? {
                          background:
                            "linear-gradient(135deg, #dc2626 0%, #000000 100%)",
                          color: "#ffffff",
                        }
                      : undefined
                  }
                  className={`px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-['Manrope'] font-semibold transition-all duration-300 cursor-pointer ${
                    isActive
                      ? "text-white shadow-md shadow-red-950/20 scale-[1.02]"
                      : "bg-white text-gray-700 border border-gray-200 hover:border-red-500/40 hover:text-red-600"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Premium Case Studies List */}
      <section className="py-12 md:py-16 lg:py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            key={activeFilter}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col gap-8 md:gap-12 lg:gap-16"
          >
            {filteredStudies.map((study, index) => {
              const isEven = index % 2 === 0;

              return (
                <motion.article
                  key={study.id}
                  variants={itemVariants}
                  whileHover={{ y: -5 }}
                  className="group relative bg-white rounded-2xl md:rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl border border-gray-100 transition-all duration-500"
                >
                  <Link
                    href={`/casestudies/${study.slug}`}
                    className={`flex flex-col ${
                      isEven ? "lg:flex-row" : "lg:flex-row-reverse"
                    } gap-0 block`}
                  >
                    {/* Image Side */}
                    <div className="relative lg:w-1/2 h-[300px] sm:h-[350px] md:h-[400px] lg:h-[500px] xl:h-[550px] overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                      <Image
                        src={getImageSource(study, "main")}
                        alt={`${study.title} — ${study.category} Case Study by WebMavien`}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 800px"
                        className="object-cover object-top group-hover:scale-105 transition-transform duration-700"
                        onError={() => handleImageError(study.id, "main")}
                        priority={index < 2}
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 hidden sm:block" />

                      {/* Category Tag */}
                      <div
                        className={`absolute top-3 sm:top-4 md:top-6 ${
                          isEven
                            ? "left-3 sm:left-4 md:left-6"
                            : "right-3 sm:right-4 md:right-6"
                        } flex items-center gap-2`}
                      >
                        <span className="bg-white/95 backdrop-blur-sm text-red-600 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-[11px] sm:text-xs font-['Manrope'] font-bold shadow-lg">
                          {study.category}
                        </span>
                        {study.timeline && (
                          <span className="bg-black/80 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-[11px] font-['Manrope'] font-semibold shadow-lg hidden sm:inline-flex items-center gap-1">
                            <FiZap className="text-red-400 w-3 h-3" />{" "}
                            {study.timeline}
                          </span>
                        )}
                      </div>

                      {/* Number Badge */}
                      <div
                        className={`absolute bottom-4 md:bottom-6 ${
                          isEven
                            ? "right-4 md:right-6"
                            : "left-4 md:left-6"
                        } hidden sm:block`}
                      >
                        <span className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-['Marcellus'] font-black text-white/25">
                          {study.number}
                        </span>
                      </div>
                    </div>

                    {/* Content Side */}
                    <div className="lg:w-1/2 p-6 sm:p-8 md:p-10 xl:p-12 flex flex-col justify-center">
                      <h2 className="font-['Marcellus'] text-2xl sm:text-3xl md:text-4xl xl:text-5xl text-gray-900 mb-3 sm:mb-4 group-hover:text-red-600 transition-colors">
                        {study.title}
                      </h2>

                      <p className="font-['Manrope'] text-gray-600 text-sm sm:text-base md:text-lg mb-5 sm:mb-6 leading-relaxed">
                        {study.shortDescription || study.description}
                      </p>

                      {/* Stats Grid */}
                      <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-5 sm:mb-6">
                        {study.stats.map((stat, idx) => (
                          <div
                            key={idx}
                            className="bg-gray-50 border border-gray-100 p-3 sm:p-4 rounded-xl"
                          >
                            <div className="font-['Marcellus'] text-xl sm:text-2xl font-bold text-red-600">
                              {stat.value}
                            </div>
                            <div className="font-['Manrope'] text-xs text-gray-500 font-medium">
                              {stat.label}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Tech Stack */}
                      <div className="flex flex-wrap items-center gap-2 mb-5 sm:mb-6">
                        <FiCode className="text-red-600 w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                        <div className="flex flex-wrap gap-1.5 sm:gap-2">
                          {study.technologies.map((tech, idx) => (
                            <span
                              key={idx}
                              className="text-[11px] sm:text-xs font-['Manrope'] font-medium text-gray-700 bg-gray-100 px-2.5 py-1 rounded-full"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Project Meta */}
                      <div className="flex flex-wrap items-center gap-4 mb-6">
                        <div className="flex items-center gap-1.5">
                          <FiTag className="text-red-600 w-3.5 h-3.5" />
                          <span className="text-xs sm:text-sm font-['Manrope'] text-gray-500">
                            {study.industry || study.category}
                          </span>
                        </div>

                        {study.date && (
                          <div className="flex items-center gap-1.5">
                            <FiClock className="text-red-600 w-3.5 h-3.5" />
                            <span className="text-xs sm:text-sm font-['Manrope'] text-gray-500">
                              {study.date}
                            </span>
                          </div>
                        )}

                        {study.founder && (
                          <div className="flex items-center gap-1.5">
                            <FiUsers className="text-red-600 w-3.5 h-3.5" />
                            <span className="text-xs sm:text-sm font-['Manrope'] text-gray-600 font-medium">
                              {study.founder.name} ({study.founder.title})
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="w-full h-px bg-gradient-to-r from-transparent via-red-600/20 to-transparent mb-5" />

                      {/* Footer with CTA */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <p className="font-['Manrope'] text-xs sm:text-sm text-gray-500 italic line-clamp-2 sm:line-clamp-1 max-w-full sm:max-w-[62%]">
                          {study.achievement}
                        </p>

                        <div className="inline-flex items-center gap-2 text-red-600 font-semibold text-xs sm:text-sm group/link shrink-0">
                          <span className="font-['Manrope'] whitespace-nowrap">
                            Read Full Case Study
                          </span>
                          <div className="w-8 h-8 sm:w-9 sm:h-9 bg-red-600 rounded-full flex items-center justify-center group-hover/link:bg-black transition-colors">
                            <FiArrowRight className="w-4 h-4 text-white group-hover:translate-x-0.5 transition-transform" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.article>
              );
            })}
          </motion.div>

          {filteredStudies.length === 0 && (
            <div className="text-center py-16">
              <p className="font-['Manrope'] text-gray-500 text-base sm:text-lg">
                No case studies found in this category.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Bottom Executive Conversion Banner */}
      <section className="pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div
            style={{
              background:
                "linear-gradient(135deg, #000000 0%, #18181b 60%, #450a0a 100%)",
            }}
            className="rounded-3xl p-8 sm:p-12 lg:p-16 text-white shadow-2xl border border-red-500/20 relative overflow-hidden"
          >
            <div className="max-w-3xl relative z-10">
              <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-600/20 border border-red-500/30 text-red-400 text-xs font-bold uppercase tracking-widest mb-4">
                <FiStar className="w-3.5 h-3.5" /> 21-Day Launch Framework
              </span>
              <h2 className="font-['Marcellus'] text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4">
                Ready to Be Our Next Launch Story?
              </h2>
              <p className="font-['Manrope'] text-zinc-300 text-base sm:text-lg leading-relaxed mb-8">
                Whether you need a custom React &amp; Next.js platform, an AI-powered SaaS MVP, or a two-sided Bubble.io marketplace, we scope, engineer, and launch in 3 to 4 focused weeks—backed by our full satisfaction guarantee.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-7 py-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-['Manrope'] font-bold text-sm sm:text-base transition-all shadow-lg shadow-red-600/25"
                >
                  Book Your Free Strategy Call <FiArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/blog/how-to-choose-web-development-agency"
                  className="inline-flex items-center gap-2 px-6 py-4 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/15 font-['Manrope'] font-semibold text-sm sm:text-base transition-all"
                >
                  Read Our 2026 Agency Guide
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
