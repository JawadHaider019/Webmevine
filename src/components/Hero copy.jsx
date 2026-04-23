"use client";

import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform, useInView } from "framer-motion";
import { useRef, useEffect } from "react";
import InteractiveGradient from "./InteractiveGradient";
import GlowingButton from './GlowingButton';
import Link from "next/link";
import { Play, CheckCircle2, Globe, Rocket, Zap } from "lucide-react";

export default function Hero() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true });

  // Mouse position values for parallax effects
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 150 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Parallax transforms
  const rotateX = useTransform(smoothY, [0, 1000], [2, -2]);
  const rotateY = useTransform(smoothX, [0, 1000], [-2, 2]);

  const handleMouseMove = (e) => {
    const rect = sectionRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
    },
  };

  const badgeVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { type: "spring", stiffness: 200, damping: 15 }
    }
  };

  // Missing variants requested by USER changes
  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

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
      className="relative flex items-center justify-center min-h-screen bg-[#020202] overflow-hidden py-20 lg:py-0"
    >
      {/* Background Layer */}
      <div className="absolute inset-0 z-0">
        <InteractiveGradient />
        {/* Dot Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, #ffffff 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}
        />
        {/* Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000_100%)]" />
      </div>

      {/* Glow Overlays */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-600/10 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-red-900/10 blur-[150px] rounded-full translate-y-1/2 -translate-x-1/2" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="container mx-auto px-4 sm:px-6 lg:px-12 relative z-10 grid lg:grid-cols-2 gap-10 lg:gap-16 items-center pt-6 lg:pt-0"
      >
        {/* Left Content */}
        <div className="max-w-3xl text-center lg:text-left mx-auto lg:mx-0 order-1 lg:order-1">
          <motion.h1
            variants={textVariants}
            transition={{ duration: 0.6 }}
            className="boldonse-regular text-4xl md:text-5xl lg:text-5xl xl:text-6xl text-white mb-6 uppercase font-bold"
            style={{
              lineHeight: '1.2',
              textShadow: '0 4px 20px rgba(220, 38, 38, 0.15)',
              letterSpacing: '-0.07em',
              fontFamily: 'var(--font-marcellus)',
            }}
          >
            Custom Websites <br /> in {" "}

            <span className="text-red-600 relative inline-block px-1.5 sm:px-3 lg:px-4">
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
            <br />

            <span className="text-red-600 relative inline-block px-1.5 sm:px-3 lg:px-4 mt-2">
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
            variants={itemVariants}
            className="text-sm sm:text-md md:text-lg text-gray-400 mb-8 sm:mb-10 leading-relaxed font-light max-w-xl mx-auto lg:mx-0"
            style={{ fontFamily: 'var(--font-manrope)' }}
          >
            WebMavine builds high-performance React JS, Node.js, and Bubble.io websites for small businesses, e-commerce brands, and SaaS founders.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center gap-6 justify-center lg:justify-start"
          >
            <Link href="/contact" className="w-full sm:w-auto">
              <GlowingButton
                glowColor="255, 255, 255"
                variant="primary"
                className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 text-base sm:text-lg"
              >
                Book Your Free Strategy Call
              </GlowingButton>
            </Link>

            <div className="flex -space-x-3 items-center">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-[#020202] bg-gray-800 flex items-center justify-center overflow-hidden">
                  <Image
                    src={`https://i.pravatar.cc/100?img=${i + 10}`}
                    alt="User"
                    width={40}
                    height={40}
                  />
                </div>
              ))}
              <div className="pl-4 sm:pl-6 text-xs sm:text-sm text-gray-400 text-left">
                <span className="text-white font-bold block">100+ Projects</span>
                Completed Successfully
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Visual Component */}
        <div className="flex flex-col gap-8 lg:gap-10 w-full relative z-10 order-1 lg:order-2 mb-8 lg:mb-0">
          <motion.div
            style={{ rotateX, rotateY, perspective: 1000, transformStyle: "preserve-3d" }}
            className="relative group w-full"
          >
            {/* Main Visual Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="relative aspect-video rounded-xl sm:rounded-2xl overflow-hidden bg-gradient-to-br from-gray-900 to-black border border-white/10 shadow-2xl"
            >
              {/* Glassmorphism Video UI Mockup */}
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1000')] bg-cover bg-center opacity-40 mix-blend-luminosity" />

              {/* Play Overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors duration-500 cursor-pointer">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-full flex items-center justify-center shadow-2xl shadow-red-600/20 relative z-10"
                >
                  <Play className="text-red-600 fill-red-600 ml-1 w-6 h-6 sm:w-8 sm:h-8" />
                  {/* Ripple Effect */}
                  <div className="absolute inset-0 rounded-full border-2 border-white animate-ping opacity-20" />
                </motion.div>
              </div>

              <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 p-2 sm:p-3 rounded-lg sm:rounded-xl bg-black/60 backdrop-blur-md border border-white/10">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-1">
                    {[1, 2, 3].map(i => <div key={i} className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-red-600 border border-black" />)}
                  </div>
                  <span className="text-[8px] sm:text-[10px] text-gray-300 font-medium">9.8/10 Satisfaction</span>
                </div>
              </div>
            </motion.div>

            {/* Decorative glowing blobs */}
            <div className="absolute -z-10 -top-6 -right-6 sm:-top-10 sm:-right-10 w-24 h-24 sm:w-40 sm:h-40 bg-red-600/20 blur-2xl sm:blur-3xl rounded-full" />
            <div className="absolute -z-10 -bottom-6 -left-6 sm:-bottom-10 sm:-left-10 w-24 h-24 sm:w-40 sm:h-40 bg-red-600/20 blur-2xl sm:blur-3xl rounded-full" />
          </motion.div>

          {/* Features Row */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap justify-center lg:justify-start gap-3 sm:gap-4"
          >
            {[
              { icon: <Globe size={16} />, text: "Global Clients" },
              { icon: <CheckCircle2 size={16} />, text: "Standardized QC" },
              { icon: <Rocket size={16} />, text: "Rapid Launch" }
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 text-gray-400 hover:text-red-500 transition-all duration-300 group bg-white/[0.03] backdrop-blur-md px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-white/5 hover:border-red-500/30">
                <span className="text-red-600/60 group-hover:text-red-600 transition-colors">{item.icon}</span>
                <span className="text-[9px] sm:text-[11px] font-semibold uppercase tracking-widest">{item.text}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Decorative base gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black to-transparent pointer-events-none" />
    </section>
  );
}
