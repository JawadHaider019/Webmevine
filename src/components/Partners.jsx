"use client";

import { motion, useAnimation, useInView } from "framer-motion";
import Image from "next/image";
import { useRef, useEffect, useState } from "react";
import SectionHeader from "./SectionHeader";

export default function Partners() {
  const sliderRef = useRef(null);
  const statsRef = useRef(null);
  const controls = useAnimation();
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

  // All partner logos combined into one array
  const allPartners = [
    { id: 1, src: "/partner/campuna.png", alt: "Campuna", width: 120, height: 40 },
    { id: 2, src: "/partner/cdl school.png", alt: "CDL School", width: 120, height: 40 },
    { id: 3, src: "/partner/eternox.png", alt: "Eternox", width: 120, height: 40 },
    { id: 4, src: "/partner/fintalio.png", alt: "Fintalio", width: 120, height: 40 },
    { id: 5, src: "/partner/fivup.png", alt: "Fivup", width: 120, height: 40 },
    { id: 6, src: "/partner/goodbyemama.png", alt: "Goodbye Mama", width: 120, height: 40 },
    { id: 7, src: "/partner/jocelyn.png", alt: "Jocelyn", width: 120, height: 40 },
    { id: 8, src: "/partner/magus.png", alt: "Magus", width: 120, height: 40 },
    { id: 9, src: "/partner/pureclay.png", alt: "Pure Clay", width: 120, height: 40 },
    { id: 10, src: "/partner/righthire.png", alt: "Right Hire", width: 120, height: 40 },
    { id: 11, src: "/partner/unitedmercy.png", alt: "United Mercy", width: 120, height: 40 },
    { id: 12, src: "/partner/zola.png", alt: "Zola", width: 120, height: 40 },
  ];

  // Calculate total width for smooth infinite scroll
  const partnerWidth = 120; // Smaller width
  const gap = 32; // gap-8 = 2rem = 32px
  const totalWidth = (partnerWidth + gap) * allPartners.length;

  // Duplicate partners for infinite scroll effect (need enough copies for seamless loop)
  const duplicatedPartners = [...allPartners, ...allPartners, ...allPartners, ...allPartners];

  // Start slider animations automatically
  useEffect(() => {
    controls.start({
      x: [0, -totalWidth],
      transition: {
        x: {
          repeat: Infinity,
          repeatType: "loop",
          duration: 40,
          ease: "linear",
          repeatDelay: 0,
        },
      },
    });
  }, [controls, totalWidth]);

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
    <section className="bg-white py-16 border-t border-white/10 overflow-hidden">
      <div className="mx-auto px-0">
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

        {/* Single Slider - All Partners in One Row */}
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
            ref={sliderRef}
            animate={controls}
            className="flex gap-8 items-center"
            style={{ width: "fit-content", willChange: "transform" }}
          >
            {duplicatedPartners.map((partner, index) => (
              <motion.div
                key={`partner-${partner.id}-${index}`}
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

        {/* Stats Section with counting numbers */}
        <motion.div
          ref={statsRef}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
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