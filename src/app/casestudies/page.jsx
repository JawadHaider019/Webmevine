"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState, useEffect } from "react";
import { FiArrowRight, FiCode, FiTag, FiClock, FiUsers } from "react-icons/fi";
import { caseStudies } from "@/data/caseStudies";
import HeroSection from '@/components/HeroSection'

export default function CaseStudiesPage() {
  const [mounted, setMounted] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [imageErrors, setImageErrors] = useState({});

  useEffect(() => {
    setMounted(true);
  }, []);

  // Get unique categories
  const categories = ["all", ...new Set(caseStudies.map(study => study.category))];

  const filteredStudies = activeFilter === "all" 
    ? caseStudies 
    : caseStudies.filter(study => study.category === activeFilter);

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

  const handleImageError = (studyId, imageType, index) => {
    setImageErrors(prev => {
      if (imageType === 'main') {
        return { ...prev, [`${studyId}-main`]: true };
      } else if (imageType === 'gallery' && index !== undefined) {
        return { ...prev, [`${studyId}-gallery-${index}`]: true };
      }
      return prev;
    });
  };

  const getImageSource = (study, type, index) => {
    if (type === 'main') {
      if (imageErrors[`${study.id}-main`]) {
        // Return a placeholder or fallback image
        return `https://placehold.co/1200x800/1a1a1a/ffffff?text=${encodeURIComponent(study.title)}`;
      }
      return study.images.main;
    } else if (type === 'gallery' && index !== undefined) {
      if (imageErrors[`${study.id}-gallery-${index}`]) {
        return `https://placehold.co/800x600/1a1a1a/ffffff?text=${encodeURIComponent(study.title)}+${index + 1}`;
      }
      return study.images.gallery[index];
    }
    return '';
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <HeroSection
        heading="Launch"
        headingAccent="Stories"
        subheading="Each case study highlights our process, speed, and results bringing founders' visions to life with scalable, high-performance web solutions"
        ctaText="Start Your Journey"
        ctaLink="/contact"
        gradientFrom="from-black"
        gradientVia="via-red-700"
        gradientTo="to-black"
      />

  
      
      {/* Premium Case Studies - Fully Responsive */}
      <section className="py-12 md:py-16 lg:py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col gap-8 md:gap-12 lg:gap-16"
          >
            {filteredStudies.map((study, index) => {
              const isEven = index % 2 === 0;
              
              return (
                <motion.div
                  key={study.id}
                  variants={itemVariants}
                  whileHover={{ y: -5 }}
                  className="group relative bg-white rounded-2xl md:rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer"
                  onClick={() => window.location.href = `/casestudies/${study.slug}`}
                >
                  <div className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-0`}>
                    {/* Image Side - Responsive heights */}
                    <div className="relative lg:w-1/2 h-[300px] sm:h-[350px] md:h-[400px] lg:h-[500px] xl:h-[550px] overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                      <Image
                        src={getImageSource(study, 'main')}
                        alt={study.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 800px"
                        className="object-cover object-top group-hover:scale-110 transition-transform duration-700"
                        onError={() => handleImageError(study.id, 'main')}
                        priority={index < 2}
                      />
                      
                      {/* Gradient Overlay - Hidden on mobile, visible on hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 hidden sm:block" />
                      
                      {/* Category Tag - Responsive positioning */}
                      <div className={`absolute top-3 sm:top-4 md:top-6 ${isEven ? 'left-3 sm:left-4 md:left-6' : 'right-3 sm:right-4 md:right-6'}`}>
                        <span className="bg-white/90 backdrop-blur-sm text-red-600 px-2 py-1 sm:px-3 sm:py-1.5 md:px-4 md:py-2 rounded-full text-[10px] sm:text-xs font-['Manrope'] font-semibold shadow-lg">
                          {study.category}
                        </span>
                      </div>

                      {/* Number Badge - Hidden on mobile, visible on tablet/desktop */}
                      <div className={`absolute bottom-4 md:bottom-6 ${isEven ? 'right-4 md:right-6' : 'left-4 md:left-6'} hidden sm:block`}>
                        <span className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-['Marcellus'] font-black text-white/20">
                          {study.number}
                        </span>
                      </div>
                    </div>

                    {/* Content Side - Responsive padding */}
                    <div className="lg:w-1/2 p-5 sm:p-6 md:p-8 lg:p-10 xl:p-12 flex flex-col justify-center">
                      {/* Title - Responsive font sizes */}
                      <h3 className="font-['Marcellus'] text-2xl sm:text-3xl md:text-4xl lg:text-4xl xl:text-5xl text-gray-900 mb-2 sm:mb-3 md:mb-4 group-hover:text-red-600 transition-colors">
                        {study.title}
                      </h3>
                      
                      {/* Description */}
                      <p className="font-['Manrope'] text-gray-600 text-sm sm:text-base md:text-lg mb-4 sm:mb-5 md:mb-6 leading-relaxed">
                        {study.shortDescription || study.description}
                      </p>

                      {/* Stats Grid - Responsive grid */}
                      <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-5 md:mb-6">
                        {study.stats.map((stat, idx) => (
                          <div key={idx} className="bg-gray-50 p-2 sm:p-3 md:p-4 rounded-lg sm:rounded-xl">
                            <div className="font-['Marcellus'] text-lg sm:text-xl md:text-2xl font-bold text-red-600">{stat.value}</div>
                            <div className="font-['Manrope'] text-[10px] sm:text-xs text-gray-500">{stat.label}</div>
                          </div>
                        ))}
                      </div>

                      {/* Tech Stack - Responsive wrap */}
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-5 md:mb-6">
                        <div className="flex items-center gap-1 sm:gap-2">
                          <FiCode className="text-red-600 w-4 h-4 sm:w-5 sm:h-5" />
                          <div className="flex flex-wrap gap-1 sm:gap-2">
                            {study.technologies.slice(0, 3).map((tech, idx) => (
                              <span 
                                key={idx}
                                className="text-[9px] sm:text-xs font-['Manrope'] text-gray-600 bg-gray-100 px-2 py-1 sm:px-3 sm:py-1.5 rounded-full"
                              >
                                {tech}
                              </span>
                            ))}
                            {study.technologies.length > 3 && (
                              <span className="text-[9px] sm:text-xs font-['Manrope'] text-gray-500">
                                +{study.technologies.length - 3}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Project Meta - Responsive */}
                      <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-4 sm:mb-6 md:mb-8">
                        <div className="flex items-center gap-1 sm:gap-2">
                          <FiTag className="text-red-600 w-3 h-3 sm:w-4 sm:h-4" />
                          <span className="text-[10px] sm:text-xs md:text-sm font-['Manrope'] text-gray-500 capitalize">
                            {study.industry || study.category}
                          </span>
                        </div>

                        {study.date && (
                          <div className="flex items-center gap-1 sm:gap-2">
                            <FiClock className="text-red-600 w-3 h-3 sm:w-4 sm:h-4" />
                            <span className="text-[10px] sm:text-xs md:text-sm font-['Manrope'] text-gray-500">
                              {study.date}
                            </span>
                          </div>
                        )}

                        {study.founder && (
                          <div className="flex items-center gap-1 sm:gap-2">
                            <FiUsers className="text-red-600 w-3 h-3 sm:w-4 sm:h-4" />
                            <span className="text-[10px] sm:text-xs md:text-sm font-['Manrope'] text-gray-500">
                              {study.founder.name}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Divider */}
                      <div className="w-full h-px bg-gradient-to-r from-transparent via-red-600/20 to-transparent mb-4 sm:mb-5 md:mb-6" />

                      {/* Footer with CTA - Responsive */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                        {/* Achievement Preview - Hidden on very small screens */}
                        <p className="font-['Manrope'] text-xs sm:text-sm text-gray-500 italic line-clamp-2 sm:line-clamp-1 max-w-full sm:max-w-[60%]">
                          {study.achievement}
                        </p>

                        {/* Read More Link */}
                        <div className="flex items-center gap-1 sm:gap-2 text-red-600 font-semibold text-xs sm:text-sm group/link">
                          <span className="font-['Manrope'] whitespace-nowrap">Read Full Story</span>
                          <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 bg-red-600 rounded-full flex items-center justify-center group-hover/link:bg-red-700 transition-colors">
                            <FiArrowRight className="w-3 h-3 sm:w-4 sm:h-4 text-white group-hover/link:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Show Message if No Results */}
          {filteredStudies.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 sm:py-16 md:py-20"
            >
              <p className="font-['Manrope'] text-gray-500 text-base sm:text-lg">No case studies found in this category.</p>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}