"use client";

import { motion } from "framer-motion";
import GlowingButton from "./GlowingButton";

// Reusable Hero Section Component
export default function HeroSection({
  // Content Props

  heading = "Who we are",
  headingAccent = "",
  subheading = "We're a leader in No Code digital transformation",
  ctaText = "Book a Free Call",
  ctaLink = "/contact",
  onCtaClick,
  
  // Styling Props
  gradientFrom = "from-black",
  gradientVia = "via-red-700",
  gradientTo = "to-black",
  textColor = "text-white",
  badgeColor = "text-amber-400",
  ctaBgColor = "bg-white",
  ctaTextColor = "text-black",
  patternOpacity = "opacity-30",
  
  // Layout Props
  height = "h-[60vh]",
  paddingTop = "pt-30",
  maxWidth = "max-w-7xl",
  
  // Animation Props
  animationDuration = 0.8,
  staggerDelay = 0.2,
  
  // Additional Content
  children,
  className = "",
}) {
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
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
        duration: animationDuration
      }
    }
  };

  const handleCtaClick = (e) => {
    if (onCtaClick) {
      onCtaClick(e); // Use custom click handler if provided
    } else if (ctaLink) {
      // If it's an anchor link, do smooth scroll
      if (ctaLink.startsWith('#')) {
        e.preventDefault();
        const element = document.querySelector(ctaLink);
        if (element) {
          const yOffset = -80;
          const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({
            top: y,
            behavior: 'smooth'
          });
        }
      } else {
        window.location.href = ctaLink;
      }
    }
  };

  return (
    <section className={`relative ${height} ${paddingTop} overflow-hidden bg-gradient-to-br ${gradientFrom} ${gradientVia} ${gradientTo} ${className}`}>
      {/* Background Pattern */}
      <div 
        className={`absolute inset-0 ${patternOpacity}`}
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: '30px 30px'
        }}
      />
      
      <div className={`relative z-10 ${maxWidth} mx-auto px-4 sm:px-6 lg:px-8 text-center`}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
        

          {/* Heading */}
          <motion.h1
            variants={itemVariants}
            className={`font-['Marcellus'] text-5xl md:text-6xl lg:text-7xl ${textColor} mb-6`}
          >
            {heading} {headingAccent && (
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-100 via-red-200 to-red-400">
                {headingAccent}
              </span>
            )}
          </motion.h1>

          {/* Subheading (Optional) */}
          {subheading && (
            <motion.p
              variants={itemVariants}
              className={`mt-8 ${textColor} text-lg font-['Manrope']`}
            >
              {subheading}
            </motion.p>
          )}

          {/* CTA Button (Optional) */}
          {ctaText && (
            <motion.div
              variants={itemVariants}
              className="mt-10"
            >
              <GlowingButton 
                glowColor="200, 0, 0"
                spreadSize="small"
                speed="medium"
                waveCount={3}
                variant="secondary"
                onClick={handleCtaClick}
              >
                {ctaText}
              </GlowingButton>
            </motion.div>
          )}

          {/* Additional Children (for custom content) */}
          {children}
        </motion.div>
      </div>
    </section>
  );
}