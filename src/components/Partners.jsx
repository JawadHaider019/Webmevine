"use client";

import { motion, useAnimation, useInView } from "framer-motion";
import Image from "next/image";
import { useRef, useEffect, useState } from "react";
import SectionHeader from "./SectionHeader";

export default function Partners() {
  const topSliderRef = useRef(null);
  const bottomSliderRef = useRef(null);
  const statsRef = useRef(null);
  const topControls = useAnimation();
  const bottomControls = useAnimation();
  const isInView = useInView(statsRef, { once: true, margin: "-100px" });
  
  // State for animated numbers
  const [counts, setCounts] = useState({
    projects: 0,
    clients: 0,
    retention: 0
  });

  // Stats data with numeric values
  const stats = [
    { id: 1, value: 100, suffix: "+", label: "Projects Delivered", key: "projects" },
    { id: 2, value: 100, suffix: "+", label: "International Client Base", key: "clients" },
    { id: 3, value: 99, suffix: "%", label: "Client Retention Rate", key: "retention" },
  ];

  // Partner logos array - First 6 for top slider
  const topPartners = [
    { id: 1, src: "/partner/campuna.png", alt: "Campuna", width: 180, height: 60 },
    { id: 2, src: "/partner/cdl school.png", alt: "CDL School", width: 180, height: 60 },
    { id: 3, src: "/partner/eternox.png", alt: "Eternox", width: 180, height: 60 },
    { id: 4, src: "/partner/fintalio.png", alt: "Fintalio", width: 180, height: 60 },
    { id: 5, src: "/partner/fivup.png", alt: "Fivup", width: 180, height: 60 },
    { id: 6, src: "/partner/goodbyemama.png", alt: "Goodbye Mama", width: 180, height: 60 },
  ];

  // Partner logos array - Next 6 for bottom slider
  const bottomPartners = [
    { id: 7, src: "/partner/jocelyn.png", alt: "Jocelyn", width: 180, height: 60 },
    { id: 8, src: "/partner/magus.png", alt: "Magus", width: 180, height: 60 },
    { id: 9, src: "/partner/pureclay.png", alt: "Pure Clay", width: 180, height: 60 },
    { id: 10, src: "/partner/righthire.png", alt: "Right Hire", width: 180, height: 60 },
    { id: 11, src: "/partner/unitedmercy.png", alt: "United Mercy", width: 180, height: 60 },
    { id: 12, src: "/partner/zola.png", alt: "Zola", width: 180, height: 60 },
  ];

  // Calculate total width for smooth infinite scroll
  const partnerWidth = 180; // width
  const gap = 40; // gap-10 = 2.5rem = 40px
  const topTotalWidth = (partnerWidth + gap) * topPartners.length;
  const bottomTotalWidth = (partnerWidth + gap) * bottomPartners.length;

  // Duplicate partners for infinite scroll effect
  const duplicatedTopPartners = [...topPartners, ...topPartners, ...topPartners, ...topPartners];
  const duplicatedBottomPartners = [...bottomPartners, ...bottomPartners, ...bottomPartners, ...bottomPartners];

  // Start slider animations automatically
  useEffect(() => {
    topControls.start({
      x: [0, -topTotalWidth],
      transition: {
        x: {
          repeat: Infinity,
          repeatType: "loop",
          duration: 30,
          ease: "linear",
          repeatDelay: 0,
        },
      },
    });
  }, [topControls, topTotalWidth]); // Fixed dependency array

  useEffect(() => {
    bottomControls.start({
      x: [-bottomTotalWidth, 0],
      transition: {
        x: {
          repeat: Infinity,
          repeatType: "loop",
          duration: 30,
          ease: "linear",
          repeatDelay: 0,
        },
      },
    });
  }, [bottomControls, bottomTotalWidth]); // Fixed dependency array

  // Animate numbers when stats come into view
  useEffect(() => {
    if (isInView) {
      const duration = 2000; // 2 seconds
      const steps = 60; // 60fps
      const interval = duration / steps;
      let step = 0;

      const timer = setInterval(() => {
        step++;
        const progress = Math.min(step / steps, 1);
        
        // Easing function for smooth animation
        const eased = 1 - Math.pow(1 - progress, 3); // Cubic ease-out
        
        setCounts({
          projects: Math.min(Math.floor(100 * eased), 100),
          clients: Math.min(Math.floor(100 * eased), 100),
          retention: Math.min(Math.floor(99 * eased), 99)
        });

        if (progress >= 1) {
          clearInterval(timer);
        }
      }, interval);

      return () => clearInterval(timer);
    }
  }, [isInView]);

  return (
    <section className="bg-white py-20 border-t border-white/10 overflow-hidden">
      <div className=" mx-auto px-0">
        {/* Header with fade-in animation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <SectionHeader
            smallHeading="Our Network"
            heading="Trusted Partners"
            description="We collaborate with industry-leading companies to deliver exceptional results"
            gradientHeading={true}
            gradientFrom="from-black"
            gradientVia="via-red-600"
            gradientTo="to-gray-900"
          />
        </motion.div>

        {/* First Slider - Top 6 Partners (Left to Right) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="relative mt-8 mb-12"
        >
          {/* Gradient fade edges for smooth appearance/disappearance */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
          
          <motion.div
            ref={topSliderRef}
            animate={topControls}
            className="flex gap-10 items-center"
            style={{ width: "fit-content", willChange: "transform" }}
          >
            {duplicatedTopPartners.map((partner, index) => (
              <motion.div
                key={`top-${partner.id}-${index}`}
                className="flex-shrink-0 group cursor-pointer"
                whileHover={{ 
                  scale: 1.1,
                  transition: { duration: 0.3, ease: "easeOut" }
                }}
              >
                <div className="relative overflow-hidden rounded-lg">
                  {/* Grayscale filter with smooth transition */}
                  <motion.div
                    whileHover={{ filter: "grayscale(0%)" }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="grayscale"
                  >
                    <Image
                      src={partner.src}
                      alt={partner.alt}
                      width={partner.width}
                      height={partner.height}
                      className="object-contain"
                      priority={index < 10}
                    />
                  </motion.div>
                  
                  {/* Smooth shine effect on hover */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "200%" }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Second Slider - Bottom 6 Partners (Right to Left) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="relative mt-8"
        >
          {/* Gradient fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
          
          <motion.div
            ref={bottomSliderRef}
            animate={bottomControls}
            className="flex gap-10 items-center"
            style={{ width: "fit-content", willChange: "transform" }}
          >
            {duplicatedBottomPartners.map((partner, index) => (
              <motion.div
                key={`bottom-${partner.id}-${index}`}
                className="flex-shrink-0 group cursor-pointer"
                whileHover={{ 
                  scale: 1.1,
                  transition: { duration: 0.3, ease: "easeOut" }
                }}
              >
                <div className="relative overflow-hidden">
                  {/* Grayscale filter with smooth transition */}
                  <motion.div
                    whileHover={{ filter: "grayscale(0%)" }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="grayscale"
                  >
                    <Image
                      src={partner.src}
                      alt={partner.alt}
                      width={partner.width}
                      height={partner.height}
                      className="object-contain"
                      priority={index < 10}
                    />
                  </motion.div>
                  
                  {/* Smooth shine effect on hover */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "200%" }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Stats Section with counting numbers */}
        <motion.div
          ref={statsRef}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          className="flex items-center justify-center flex-wrap gap-8 md:gap-16 mt-20 px-4"
        >
          {/* 100+ Projects Delivered */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ 
              duration: 0.6, 
              delay: 0,
              type: "spring",
              stiffness: 80,
              damping: 12
            }}
            className="text-center"
          >
            <motion.div
              className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-black via-red-600 to-gray-900"
              style={{ fontFamily: 'var(--font-marcellus)' }}
            >
              {counts.projects}+
            </motion.div>
            <motion.div 
              className="text-gray-600 text-sm md:text-base mt-2 font-['Manrope']"
            >
              Projects Delivered
            </motion.div>
          </motion.div>

          {/* International Client Base */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ 
              duration: 0.6, 
              delay: 0.1,
              type: "spring",
              stiffness: 80,
              damping: 12
            }}
            className="text-center"
          >
            <motion.div
              className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-black via-red-600 to-gray-900"
              style={{ fontFamily: 'var(--font-marcellus)' }}
            >
              {counts.clients}+
            </motion.div>
            <motion.div 
              className="text-gray-600 text-sm md:text-base mt-2 font-['Manrope']"
            >
              International Client Base
            </motion.div>
          </motion.div>

          {/* High Client Retention Rate */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ 
              duration: 0.6, 
              delay: 0.2,
              type: "spring",
              stiffness: 80,
              damping: 12
            }}
            className="text-center"
          >
            <motion.div
              className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-black via-red-600 to-gray-900"
              style={{ fontFamily: 'var(--font-marcellus)' }}
            >
              {counts.retention}%
            </motion.div>
            <motion.div 
              className="text-gray-600 text-sm md:text-base mt-2 font-['Manrope']"
            >
              Client Retention Rate
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}