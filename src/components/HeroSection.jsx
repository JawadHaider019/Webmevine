"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";

// Reusable Hero Section Component
export default function HeroSection({
  // Content Props
  badge = "✦ Launch your app in 19 days — few spots left! ✦",
  heading = "Who we are",
  subheading = "We're a leader in No Code digital transformation",
  ctaText = "Book a Free Call",
  ctaLink = "/contact",
  
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
  height = "h-[70vh]",
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

  const badgeVariants = {
    hidden: { opacity: 0, scale: 0.9, y: -20 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15,
        delay: 0.1
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
          {/* Badge (Optional) */}
          {badge && (
            <motion.div
              variants={badgeVariants}
              className="inline-block mb-6"
            >
              <span className={`px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full ${badgeColor} text-sm font-['Manrope'] tracking-wider`}>
                {badge}
              </span>
            </motion.div>
          )}

          {/* Heading */}
          <motion.h1
            variants={itemVariants}
            className={`font-['Marcellus'] text-5xl md:text-6xl lg:text-7xl ${textColor} mb-6`}
          >
            {heading}
          </motion.h1>

          {/* CTA Button (Optional) */}
          {ctaText && (
            <motion.div
              variants={itemVariants}
            >
              <Link href={ctaLink}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={` ${ctaBgColor} ${ctaTextColor} btn-secondary`}
                >
                  
                    {ctaText}
                 
           
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-black/5 to-transparent"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "200%" }}
                    transition={{ duration: 0.8 }}
                  />
                </motion.button>
              </Link>
            </motion.div>
          )}

          {/* Subheading (Optional) */}
          {subheading && (
            <motion.p
              variants={itemVariants}
              className={`mt-8 ${textColor} text-lg font-['Manrope']`}
            >
              {subheading}
            </motion.p>
          )}

          {/* Additional Children (for custom content) */}
          {children}
        </motion.div>
      </div>
    </section>
  );
}