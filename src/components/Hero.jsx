"use client";

import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";
import InteractiveGradient from "./InteractiveGradient";

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
      className="relative flex items-center justify-center min-h-screen bg-black overflow-hidden cursor-none md:cursor-auto pb-10"
    >
      <div className="absolute inset-0 z-0">
        <InteractiveGradient />
      </div>
      
      {/* Luxury subtle gradient overlay */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        className="absolute inset-0 bg-gradient-to-br from-red-950/20 via-transparent to-black"
      />
      
      {/* Content */}
      <div className="container mx-auto pt-10 px-4 md:px-6 flex flex-col md:flex-row items-center gap-10 relative z-10">
        {/* Left column - text */}
        <motion.div 
          initial="hidden"
          animate="visible"
          transition={{ staggerChildren: 0.2 }}
          className="flex-1.5 text-center md:text-left"
        >
          <motion.h1 
            variants={textVariants}
            transition={{ duration: 0.6 }}
            className="boldonse-regular text-5xl md:text-6xl lg:text-7xl text-white mb-8 uppercase font-bold"
            style={{
              lineHeight: '1.1',
              textShadow: '0 4px 20px rgba(220, 38, 38, 0.15)',
              letterSpacing: '-0.09em',
              fontFamily: 'var(--font-marcellus)' 
            }}
          >
            Turn Your Dream <br /> 
            into a <span className="text-red-600 relative inline-block px-4">
              Real App
              <motion.span 
                className="absolute inset-0 -z-10 bg-white origin-left" 
                variants={backgroundFillVariants}
                initial="hidden"
                animate="visible"
                style={{ 
                  transform: 'skewX(-12deg)',
                  top: 0,
                  left: 0,
                  height: '100%',
                }} 
              />
            </span>
            <br />
            <span className="text-red-600 relative inline-block px-4">
              in 19 Days
              <motion.span 
                className="absolute inset-0 -z-10 bg-white origin-left"
                variants={backgroundFillVariants}
                initial="hidden"
                animate="visible"
                style={{ 
                  transform: 'skewX(-12deg)',
                  top: 0,
                  left: 0,
                  height: '100%',
                }}
              />
            </span>
          </motion.h1>

          <motion.p 
            variants={textVariants}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-xl text-gray-100 mb-10 max-w-2xl mx-auto md:mx-0 font-light leading-relaxed tracking-wide"
                style={{ fontFamily: 'var(--font-manrope)' }}
          >
            Build smarter, launch faster, and save more with AI-driven low-code solutions
          </motion.p>
          
          <motion.div 
            variants={textVariants}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center gap-6 justify-center md:justify-start"
          >
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary px-10 py-4 text-base relative overflow-hidden group"
            >
              <span className="relative z-10">Start My App</span>
              <motion.span 
                className="absolute inset-0 bg-gradient-to-r from-red-700 to-red-900"
                initial={{ x: "-100%" }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>
            
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group relative px-6 py-2 bg-transparent text-white rounded-full transition-all duration-300 overflow-hidden border border-[#ff0000] flex flex-col items-center gap-0"
            >
              <motion.div transition={{ duration: 0.6 }}>
                <Image 
                  src="/Bubble_Dark.svg" 
                  alt="Bubble logo" 
                  width={80} 
                  height={80}
                  className="object-contain opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                />
              </motion.div>
              <span className="text-[10px] font-light tracking-wider uppercase">Agency Partner</span>
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Right column - video placeholder - RESPONSIVE */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          whileHover={{ scale: 1.02 }}
          className="w-full max-w-[90%] sm:max-w-[80%] md:max-w-[600px] aspect-video md:h-[350px] relative rounded-2xl overflow-hidden border border-white/20 group cursor-pointer shadow-2xl shadow-red-600/10 hover:shadow-red-600/20 transition-all duration-500 mx-auto md:mx-0"
        >
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black" />
          
          {/* Abstract red glow with mouse follow */}
          <motion.div 
            className="absolute inset-0 opacity-40"
            animate={{
              background: [
                'radial-gradient(circle at 30% 40%, rgba(220,38,38,0.3) 0%, transparent 50%)',
                'radial-gradient(circle at 70% 60%, rgba(220,38,38,0.3) 0%, transparent 50%)',
                'radial-gradient(circle at 40% 70%, rgba(220,38,38,0.3) 0%, transparent 50%)',
              ]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          >
            {/* Top right glow - responsive */}
            <div className="absolute top-5 md:top-10 right-5 md:right-10 w-20 h-20 md:w-40 md:h-40 bg-red-600/20 rounded-full blur-2xl md:blur-3xl" />
            {/* Bottom left glow - responsive */}
            <div className="absolute bottom-5 md:bottom-10 left-5 md:left-10 w-20 h-20 md:w-40 md:h-40 bg-red-800/20 rounded-full blur-2xl md:blur-3xl" />
          </motion.div>
          
          {/* Play button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div 
              className="relative"
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              {/* Outer ring pulse effect - responsive */}
              <motion.div 
                className="absolute inset-0 bg-red-600/20 rounded-full blur-sm md:blur-md"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              
              {/* Play button - responsive size */}
              <motion.div 
                className="relative w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-white rounded-full flex items-center justify-center shadow-2xl shadow-red-600/50"
                transition={{ duration: 0.6 }}
              >
                <motion.svg 
                  className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-red-600 ml-1" 
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
                className="absolute w-0.5 h-0.5 sm:w-1 sm:h-1 bg-red-500/30 rounded-full"
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
      </div>

      {/* Bottom fade */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent"
      />
    </section>
  );
}