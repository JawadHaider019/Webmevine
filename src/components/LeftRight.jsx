"use client";

import { useRef } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import SectionHeader from './SectionHeader';
import GlowingButton from './GlowingButton';

const LeftRight = ({
  smallHeading,
  heading,
  headingAccent,
  description,
  buttonText = "Get Free Quote",
  buttonLink = "/contact",
  sections,
  gradientFrom = "from-black",
  gradientVia = "via-red-600",
  gradientTo = "to-gray-900"
}) => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { 
    once: true, 
    margin: "-100px 0px"
  });

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        when: "beforeChildren"
      }
    }
  };

  const leftContentVariants = {
    hidden: { 
      opacity: 0, 
      x: -30 
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const rightItemVariants = {
    hidden: { 
      opacity: 0, 
      y: 40 
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.section 
      ref={sectionRef}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={containerVariants}
      className="relative z-10 w-full bg-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        {/* Mobile: Stack layout */}
        <div className="flex flex-col lg:flex-row gap-8 sm:gap-10 lg:gap-12 xl:gap-20">
          {/* Left Side - SectionHeader */}
          <div className="lg:w-2/5 lg:sticky lg:top-24 lg:self-start py-4 sm:py-8 lg:py-8">
            <motion.div 
              variants={leftContentVariants}
              className="w-full"
            >
              <SectionHeader
                smallHeading={smallHeading}
                heading={heading}
                headingAccent={headingAccent}
                description={description}
                gradientHeading={true}
                gradientFrom={gradientFrom}
                gradientVia={gradientVia}
                gradientTo={gradientTo}
                alignment="left"
              />

              {buttonText && (
                <motion.div 
                  variants={leftContentVariants}
                  className="flex flex-row gap-3 justify-center lg:justify-start mt-8"
                >
                  <GlowingButton 
                    glowColor="200, 0, 0"
                    spreadSize="small"
                    speed="medium"
                    waveCount={3}
                    onClick={() => window.location.href = buttonLink}
                  >
                    {buttonText}
                  </GlowingButton>
                </motion.div>
              )}
            </motion.div>
          </div>

          {/* Right Side - Content Sections */}
          <motion.div 
            variants={containerVariants}
            className="lg:w-3/5 flex flex-col gap-0 sm:gap-8"
          >
            {sections?.map((section, index) => (
              <motion.div
                key={index}
                variants={rightItemVariants}
                className="flex items-center py-4 sm:py-6 border-b border-gray-100 last:border-0"
              >
                <div className="w-full space-y-3 sm:space-y-4 text-center lg:text-left">
                  <motion.div 
                    className="text-red-500 text-sm sm:text-base lg:text-lg font-semibold font-['Manrope']"
                  >
                    STEP {section.step}
                  </motion.div>
                  
                  <motion.h3 
                    className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-['Marcellus'] text-gray-900 leading-tight"
                  >
                    {section.title}
                  </motion.h3>
                  
                  <motion.p 
                    className="text-gray-600 text-sm sm:text-base lg:text-lg xl:text-xl leading-relaxed font-['Manrope']"
                  >
                    {section.description}
                  </motion.p>
                  
                  {section.additional && (
                    <motion.p 
                      className="text-gray-400 text-xs sm:text-sm lg:text-base leading-relaxed font-['Manrope'] italic"
                    >
                      {section.additional}
                    </motion.p>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default LeftRight;