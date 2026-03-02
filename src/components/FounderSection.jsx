"use client";

import { useRef, useState } from 'react';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import SectionHeader from './SectionHeader';

const FounderSection = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.2 });
  const [imageLoaded, setImageLoaded] = useState(false);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.2
      }
    }
  };

  const contentVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 15,
        duration: 0.7
      }
    }
  };

  const imageVariants = {
    hidden: { opacity: 0, x: 30, scale: 0.95 },
    visible: { 
      opacity: 1, 
      x: 0, 
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 15,
        duration: 0.7,
        delay: 0.2
      }
    }
  };

  return (
    <section 
      ref={sectionRef} 
      className="relative py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-r from-black via-red-600 to-black"
    >
      {/* Background Effects */}
      <div className="absolute inset-0">
        <motion.div 
          className="absolute top-20 -left-20 w-64 sm:w-80 lg:w-96 h-64 sm:h-80 lg:h-96 bg-gradient-to-r from-red-600/10 to-amber-600/10 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-20 -right-20 w-64 sm:w-80 lg:w-96 h-64 sm:h-80 lg:h-96 bg-gradient-to-l from-amber-600/10 to-red-600/10 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        <div className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: '30px 30px'
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto w-full relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <SectionHeader
            heading="Meet the Founder"
            description="Crafting High-Performance Websites & Scalable Digital Solutions."
            gradientHeading={true}
            smallHeadingColor="text-white" 
            descriptionColor="text-white"
            gradientFrom="from-white"
            gradientVia="via-gray-100"
            gradientTo="to-gray-300"
          />
        </motion.div>

        {/* Main Content Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="flex flex-col lg:flex-row gap-8 lg:gap-12 xl:gap-16 items-center justify-center px-4 sm:px-6 lg:px-8"
        >
          {/* Left Column - Content */}
          <motion.div
            variants={contentVariants}
            className="w-full lg:w-1/2 space-y-6 lg:space-y-8 order-2 lg:order-1"
          >
            <div className="space-y-4 text-center lg:text-left">
              <motion.h3
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.5 }}
                className="font-['Marcellus'] text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-bold text-white"
              >
                Muhammad Ahmad 
              </motion.h3>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-4 text-white/80 leading-relaxed text-sm sm:text-base lg:text-lg text-center lg:text-left font-['Manrope']"
            >
              <p>
             I’m a specialist web designer and developer with 5+ years of experience creating high-performance websites and custom web applications for startups, businesses, and ambitious founders. With 100+ projects successfully delivered, I combine React JS development, Bubble.io SaaS builds, and AI-powered integrations to craft websites that are not only visually appealing but also conversion-focused and scalable. </p>
              
              <p>
              At WebMavine, we don’t just write code we engineer digital assets that drive growth. From custom website development to fast MVP launches, every project is built with speed, quality, and ROI in mind.

My approach blends minimalist, user-centric design with robust technical architecture, ensuring your website or SaaS platform is future-ready, performance-optimized, and designed to scale. </p>
            </motion.div>
          </motion.div>

          {/* Right Column - Image */}
          <motion.div
            variants={imageVariants}
            className="w-full lg:w-1/2 flex justify-center items-center order-1 lg:order-2"
          >
            <div className="relative group w-[350px] sm:w-[450px] md:w-[450px] lg:w-[480px] xl:w-[500px] h-[350px] sm:h-[450px] md:h-[450px] lg:h-[480px] xl:h-[500px]">
             
              {/* Main Card */}
              <div className="relative w-full h-full bg-gradient-to-br from-gray-900 to-black rounded-2xl p-2 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-red-600/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative w-full h-full rounded-xl overflow-hidden">
                  <Image
                    src="/Ahmad.jpeg"
                    alt="Muhammad Ahmad - Founder & CEO"
                    fill
                    className={`object-cover transition-all duration-700 ${
                      imageLoaded ? 'scale-100 blur-0' : 'scale-105 blur-sm'
                    } group-hover:scale-105`}
                    onLoad={() => setImageLoaded(true)}
                    priority
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default FounderSection;