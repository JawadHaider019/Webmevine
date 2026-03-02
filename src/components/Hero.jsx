"use client";

import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";
import InteractiveGradient from "./InteractiveGradient";
import GlowingButton from './GlowingButton'

export default function Hero() {
  const sectionRef = useRef(null);
  
  // Mouse position values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Smooth spring physics for the glow movement
  const springConfig = { damping: 25, stiffness: 150 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);
  
  // Transform mouse position to glow position (centered around mouse)
  const glowX = useTransform(smoothX, (x) => x - 300);
  const glowY = useTransform(smoothY, (y) => y - 300);

  // Handle mouse move
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  // Handle mouse leave - reset glow position to center
  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // Text animation variants
  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // Background fill animation variants
  const backgroundFillVariants = {
    hidden: { 
      width: "0%",
      opacity: 0.8
    },
    visible: { 
      width: "100%",
      opacity: 1,
      transition: {
        duration: 1,
        ease: "easeInOut",
        delay: 0.1
      }
    }
  };

  return (
    <section 
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative flex items-center justify-center min-h-screen bg-[#000000] overflow-hidden cursor-none md:cursor-auto py-10 md:py-0"
    >
      <div className="absolute inset-0 z-0">
        <InteractiveGradient />
      </div>
      
      {/* Luxury subtle gradient overlay */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        className="absolute inset-0 bg-gradient-to-br from-red-950/20 via-transparent to-[#000000]"
      />
      
      {/* Content - Optimized for laptop 1024px screens */}
      <div className="container mx-auto px-4 md:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-6 lg:gap-8 xl:gap-10 relative z-10 mt- ">
        {/* Left column - text */}
        <motion.div 
          initial="hidden"
          animate="visible"
          transition={{ staggerChildren: 0.2 }}
          className="flex-1 lg:flex-1.5 w-full lg:w-auto text-center lg:text-left"
          style={{ backgroundColor: 'transparent' }}
        >
          <motion.h1 
            variants={textVariants}
            transition={{ duration: 0.6 }}
            className="boldonse-regular text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl text-white mb-4 uppercase font-bold"
            style={{
              lineHeight: '1.3',
              textShadow: '0 4px 20px rgba(220, 38, 38, 0.15)',
              letterSpacing: '-0.09em',
              fontFamily: 'var(--font-marcellus)',
            }}
          >
            Custom Websites <br/> in {" "}

            <span className="text-red-600 relative inline-block px-2 sm:px-3 lg:px-4">
              21 Days Or
              <motion.span 
                className="absolute inset-0 -z-10 bg-white origin-left" 
                variants={backgroundFillVariants}
                initial="hidden"
                animate="visible"
                style={{ 
                  transform: 'skewX(-12deg)',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                }} 
              />
            </span>
            <br  />

            <span className="text-red-600 relative inline-block px-2 sm:px-3 lg:px-4 mt-1">
              Money Back
              <motion.span 
                className="absolute inset-0 -z-10 bg-white origin-left"
                variants={backgroundFillVariants}
                initial="hidden"
                animate="visible"
                style={{ 
                  transform: 'skewX(-12deg)',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                }}
              />
            </span>
          </motion.h1>

          <motion.p 
            variants={textVariants}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-base sm:text-lg lg:text-base xl:text-lg text-[#f3f4f6] mb-6 lg:mb-8 max-w-2xl mx-auto lg:mx-0 font-light leading-relaxed tracking-wide px-2 sm:px-0"
            style={{ fontFamily: 'var(--font-manrope)' }}
          >
            WebMavine builds high-performance React JS, Node.js, and Bubble.io websites for small businesses, e-commerce brands, and SaaS founders, fast, scalable, and conversion-focused.
          </motion.p>
 
          <motion.div 
            variants={textVariants}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center gap-4 sm:gap-5 lg:gap-4 xl:gap-6 justify-center lg:justify-start px-2 sm:px-0"
          >
            <GlowingButton 
               glowColor="255, 255, 255"
              spreadSize="small"
              speed="medium"
              waveCount={3} 
            >
              Book Your Free Strategy Call
            </GlowingButton>
          </motion.div>
        </motion.div>

        {/* Right column - video placeholder */}
        <div className="w-full lg:w-[45%] xl:w-auto flex flex-col items-center">
          <motion.div 
            initial={{ opacity: 0, x: 0, y: 20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-br from-[#111827] to-[#000000] w-[95%] sm:w-[90%] md:w-[85%] lg:w-full max-w-[500px] xl:max-w-[600px] aspect-video relative rounded-2xl group cursor-pointer shadow-2xl shadow-[#dc2626]/10 hover:shadow-[#dc2626]/20 transition-all duration-500 mx-auto"
          >
            {/* Play button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div 
                className="relative"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                {/* Play button - responsive size */}
                <motion.div 
                  className="relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-14 lg:h-14 xl:w-20 xl:h-20 bg-[#ffffff] rounded-full flex items-center justify-center shadow-2xl shadow-[#dc2626]/50"
                  transition={{ duration: 0.6 }}
                >
                  <motion.svg 
                    className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-5 lg:h-5 xl:w-8 xl:h-8 text-[#dc2626] ml-1" 
                    fill="currentColor" 
                    viewBox="0 0 24 24"
                    whileHover={{ scale: 1.1 }}
                  >
                    <path d="M8 5v14l11-7z" />
                  </motion.svg>
                </motion.div>
              </motion.div>
            </div>
            
            {/* Floating particles effect - hidden on mobile */}
            <div className="hidden sm:block">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-0.5 h-0.5 sm:w-1 sm:h-1 bg-[#dc2626]/30 rounded-full"
                  style={{
                    left: `${20 + i * 15}%`,
                    top: `${30 + i * 10}%`,
                  }}
                  animate={{
                    y: [0, -20, 0],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 3 + i,
                    repeat: Infinity,
                    delay: i * 0.5,
                  }}
                />
              ))}
            </div>
          </motion.div>

<motion.div
  className="mt-4 flex flex-wrap justify-center items-center gap-2 px-4"
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8, delay: 0.6 }}

>
  {/* Authority / Social Proof Text */}
  {[
    { text: "Trusted Partner" },
    { text: "100+ Projects" },
    { text: "International Clients" },
    { text: "Scalable Solutions" }
  ].map((item, index) => (
    <motion.span
      key={index}
      whileHover={{ scale: 1.1}}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
      className="cursor-pointer inline-flex items-center whitespace-nowrap bg-white/90 backdrop-blur-sm rounded-full text-red-600 font-['Manrope'] text-xs sm:text-sm px-3 py-1 shadow-sm border border-red-100/50 hover:shadow-md transition-all duration-300"
    >
     {item.text}
    </motion.span>
  ))}
</motion.div>

        </div>
      </div>

      {/* Bottom fade */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#000000] to-transparent"
      />
    </section>
  );
}