"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import SectionHeader from "./SectionHeader";
import GlowingButton from "./GlowingButton";
import { caseStudies } from "@/data/caseStudies";

export default function CaseStudiesSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Get only the first 4 case studies
  const featuredCaseStudies = caseStudies.slice(0, 4);

  // Check if mobile on mount and when window resizes
  useEffect(() => {
    setMounted(true);
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Don't render on server to avoid hydration mismatch
  if (!mounted) {
    return null;
  }

  const handleSlideClick = (index) => {
    // On desktop, clicking a closed slide opens it
    if (!isMobile) {
      setActiveIndex(index);
    }
  };

  const handleOpenSlideClick = (slug) => {
    // Navigate to case study detail page when clicking on open slide
    window.location.href = `/casestudies/${slug}`;
  };

  // Responsive widths
  const getSlideWidth = (index) => {
    if (isMobile) {
      // On mobile, stack vertically
      return "100%";
    }
    if (index === activeIndex) return "70%"; // Open slide
    return "10%"; // Closed slides
  };

  // Responsive height
  const getSlideHeight = (index) => {
    if (isMobile) {
      return index === activeIndex ? "auto" : "80px";
    }
    return "100%";
  };

  // Responsive order
  const getSlideOrder = (index) => {
    if (isMobile) return index; // Natural order on mobile
    if (index === activeIndex) return 2; // Active in middle
    if (index < activeIndex) return 1; // Left slides
    return 3; // Right slides
  };

  // Mobile navigation
  const nextSlide = () => {
    if (activeIndex < featuredCaseStudies.length - 1) {
      setActiveIndex(activeIndex + 1);
    }
  };

  const prevSlide = () => {
    if (activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
    }
  };

  return (
    <section className="relative min-h-screen bg-gradient-to-r from-black via-red-600 to-black pt-16 pb-20 overflow-hidden">
      {/* Remove scrollbar completely with global style */}
      <style dangerouslySetInnerHTML={{
        __html: `
          .no-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .no-scrollbar::-webkit-scrollbar {
            display: none;
          }
        `
      }} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        {/* Header with fade-in animation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <SectionHeader
            heading="Success Stories"
            description="Real results from real projects. See how we've helped founders launch faster."
            gradientHeading={true}
            smallHeadingColor="text-white" 
            descriptionColor="text-white"
            gradientFrom="from-white"
            gradientVia="via-gray-100"
            gradientTo="to-gray-300"
          />
        </motion.div>
        
        {/* Mobile Navigation Arrows (visible only on mobile) */}
        {isMobile && (
          <div className="flex justify-between items-center mb-4 px-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={prevSlide}
              className={`w-10 h-10 rounded-full bg-white/10 flex items-center justify-center ${
                activeIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={activeIndex === 0}
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={nextSlide}
              className={`w-10 h-10 rounded-full bg-white/10 flex items-center justify-center ${
                activeIndex === featuredCaseStudies.length - 1 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={activeIndex === featuredCaseStudies.length - 1}
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </motion.button>
          </div>
        )}

        {/* Slides Container - No scrollbar */}
        <div className={`relative w-full ${isMobile ? 'h-auto' : 'h-[400px] md:h-[500px] lg:h-[600px]'}`}>
          <div className={`flex ${isMobile ? 'flex-col' : 'flex-row'} gap-3 h-full no-scrollbar`}>
            {featuredCaseStudies.map((study, index) => {
              const isActive = index === activeIndex;
              const width = getSlideWidth(index);
              const height = getSlideHeight(index);
              const order = getSlideOrder(index);

              return (
                <motion.div
                  key={study.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1,
                    width: width,
                    height: height,
                    order: order,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 35,
                    mass: 1,
                    layout: { duration: 0.6, ease: [0.4, 0, 0.2, 1] }
                  }}
                  onClick={() => isActive ? handleOpenSlideClick(study.slug) : handleSlideClick(index)}
                  className={`
                    relative rounded-2xl md:rounded-3xl overflow-hidden cursor-pointer
                    ${isActive ? 'shadow-2xl' : 'shadow-lg hover:shadow-xl'}
                    ${isMobile ? 'mb-3' : ''}
                    ${isMobile && !isActive ? 'hover:bg-gray-50 transition-colors' : ''}
                  `}
                  style={{ 
                    backgroundColor: study.color,
                    flexShrink: 0,
                  }}
                  whileHover={!isActive && !isMobile ? { scale: 1.02, y: -5 } : {}}
                >
                  {/* White background with subtle gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${study.gradient} opacity-90`} />
                  
                  {/* Subtle pattern overlay */}
                  <div className="absolute inset-0 opacity-[0.02]">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(0,0,0,0.1)_0%,transparent_50%)]" />
                  </div>

                  {/* Content based on active state */}
                  <AnimatePresence mode="wait">
                    {isActive ? (
                      /* Open Slide Content */
                      <motion.div
                        key="open"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4 }}
                        className="relative h-full flex flex-col lg:flex-row p-3 sm:p-4 md:p-6 lg:p-8 gap-4 md:gap-6 lg:gap-8 items-center"
                      >
                        {/* Left side - Image */}
                        <div className="relative w-full lg:w-[45%] h-48 sm:h-56 md:h-64 lg:h-[80%] flex flex-col">
                          {/* Image */}
                          <div className="relative w-full bg-[#1c1c1c] h-full rounded-xl md:rounded-2xl overflow-hidden shadow-md md:shadow-xl mb-3 md:mb-4">
                            {study.images.main ? (
                              <Image
                                src={study.images.main}
                                alt={study.category}
                                fill
                                className="object-contain transition-transform duration-700"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                                <span className="text-4xl md:text-6xl text-gray-400">📱</span>
                              </div>
                            )}
                          </div>
                          
                          {/* Founder info - hidden on small mobile, visible on larger screens */}
                          <div className="hidden sm:block bg-gray-50 rounded-lg md:rounded-xl p-3 md:p-4">
                            <p className="font-['Manrope'] text-xs md:text-sm text-gray-600 mb-1">{study.founder.name}</p>
                            <p className="font-['Manrope'] text-xs text-gray-400">{study.founder.title}</p>
                          </div>
                        </div>

                        {/* Right side - Content */}
                        <div className="flex-1 flex flex-col justify-center">
                          {/* Category tag */}
                          <div className="inline-block mb-2 md:mb-4">
                            <span className="font-['Manrope'] text-[10px] md:text-xs font-semibold text-red-600 bg-red-50 px-2 md:px-3 py-1 rounded-full">
                              {study.category}
                            </span>
                          </div>

                          {/* Title */}
                          <h3 className="font-['Marcellus'] text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 md:mb-4">
                            {study.title}
                          </h3>

                          {/* Description */}
                          <p className="font-['Manrope'] text-gray-900 text-sm sm:text-base md:text-lg lg:text-xl font-medium mb-2 md:mb-4">
                            {study.shortDescription || study.description}
                          </p>
                          
                          {/* Achievement */}
                          <p className="font-['Manrope'] text-gray-700 text-xs sm:text-sm md:text-base mb-4 md:mb-6 lg:mb-8 leading-relaxed">
                            {study.achievement}
                          </p>
                          
                          {/* Stats Grid - Two columns */}
                          <div className="grid grid-cols-2 gap-3 md:gap-4 lg:gap-6 mb-4 md:mb-6 lg:mb-8">
                            {study.stats.map((stat, idx) => (
                              <div key={idx}>
                                <div className="font-['Marcellus'] text-lg sm:text-xl md:text-2xl font-bold text-gray-900">{stat.value}</div>
                                <div className="font-['Manrope'] text-[10px] sm:text-xs md:text-sm text-gray-500 mt-1">{stat.label}</div>
                              </div>
                            ))}
                          </div>

                          {/* Founder info - visible only on mobile */}
                          <div className="block sm:hidden bg-gray-50 rounded-lg p-2 mb-3">
                            <p className="font-['Manrope'] text-xs text-gray-600 mb-1">{study.founder.name}</p>
                            <p className="font-['Manrope'] text-[10px] text-gray-400">{study.founder.title}</p>
                          </div>

                          {/* "Read the Story" text indicator - Enhanced */}
                          <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5, duration: 0.5 }}
                            whileHover={{ x: 5 }}
                            className="flex items-center gap-2 text-red-600 text-xs sm:text-sm mt-4 group cursor-pointer"
                          >
                            <motion.span 
                              className="relative font-medium"
                              whileHover={{ letterSpacing: "0.05em" }}
                              transition={{ duration: 0.3 }}
                            >
                              Read The Story
                              <motion.span 
                                className="absolute -bottom-1 left-0 h-[2px] bg-red-600 rounded-full"
                                initial={{ width: 0 }}
                                whileHover={{ width: "100%" }}
                                transition={{ duration: 0.3 }}
                              />
                            </motion.span>
                            
                            <motion.div
                              animate={{ 
                                x: [0, 3, 0],
                              }}
                              transition={{ 
                                duration: 1.5, 
                                repeat: Infinity,
                                repeatType: "loop",
                                ease: "easeInOut"
                              }}
                              whileHover={{ 
                                scale: 1.2,
                                x: 5,
                                rotate: [0, 10, 0]
                              }}
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                              </svg>
                            </motion.div>
                          </motion.div>
                        </div>
                      </motion.div>
                    ) : (
                      /* Closed Slide Content */
                      <motion.div
                        key="closed"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="relative h-full flex items-center justify-center p-2 group"
                      >
                        {/* Mobile closed view */}
                        {isMobile ? (
                          <div className="flex items-center justify-between w-full px-4">
                            <span className="font-['Manrope'] text-sm font-medium text-gray-700 truncate max-w-[70%]">{study.category}</span>
                            <span className="font-['Marcellus'] text-lg font-bold text-gray-400 ml-2">{study.number}</span>
                          </div>
                        ) : (
                          /* Desktop closed view with hover effects */
                          <div className="relative z-10 flex flex-col items-center justify-center w-full h-full">
                            {/* Number at top - changes color on hover */}
                            <motion.div 
                              className="absolute top-4 left-1/2 -translate-x-1/2 w-full text-center"
                              whileHover={{ scale: 1.1 }}
                            >
                              <span className="font-['Marcellus'] text-5xl font-black transition-colors duration-300 group-hover:text-red-600 text-gray-400">
                                {study.number}
                              </span>
                            </motion.div>
                            
                            {/* Vertical category in middle - changes color on hover */}
                            <div className="flex items-center justify-center h-full">
                              <motion.span 
                                className="font-['Manrope'] text-[10px] md:text-xs font-medium tracking-wider whitespace-nowrap rotate-90 origin-center uppercase transition-colors duration-300 group-hover:text-red-600"
                                whileHover={{ scale: 1.1 }}
                              >
                                {study.category}
                              </motion.span>
                            </div>
                          </div>
                        )}
                        
                        {/* Hover effect overlay */}
                        {!isActive && !isMobile && (
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-t from-red-600/10 to-transparent"
                            initial={{ opacity: 0 }}
                            whileHover={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                          />
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Navigation Dots */}
        <div className="flex justify-center gap-3 mt-8 md:mt-10">
          {featuredCaseStudies.map((_, index) => (
            <motion.button
              key={index}
              className={`relative h-2 rounded-full transition-all ${
                index === activeIndex ? 'w-8 md:w-10 bg-red-500' : 'w-2 bg-white/30'
              }`}
              onClick={() => handleSlideClick(index)}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            >
              {index === activeIndex && (
                <motion.div
                  className="absolute inset-0 rounded-full bg-red-400"
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
            </motion.button>
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
          className="flex justify-center mt-12"
        >
          <Link href="/casestudies">
            <GlowingButton 
              glowColor="255, 255, 255"
              spreadSize="small"
              speed="fast"
              waveCount={3}
              variant="secondary"
            >
              View All Case Studies
            </GlowingButton>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}