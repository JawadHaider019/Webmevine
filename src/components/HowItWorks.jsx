"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import SectionHeader from "./SectionHeader";
import GlowingButton from "./GlowingButton";

// Font Awesome imports
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartLine,
  faPencilRuler,
  faCode,
  faRocket,
} from "@fortawesome/free-solid-svg-icons";

export default function HowItWorks() {
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile on mount and when window resizes
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const steps = [
    {
      id: 1,
      number: "01",
      week: "Week 1",
      title: "Strategy & Conversion Planning",
      description: "We research your market, define clear goals, and build a conversion-focused strategy to ensure your website drives measurable results.",
      icon: faChartLine
    },
    {
      id: 2,
      number: "02",
      week: "Week 2",
      title: "UX Design & Wireframing",
      description: "We create intuitive wireframes and user flows designed for clarity, engagement, and high-converting user experience.",
      icon: faPencilRuler
    },
    {
      id: 3,
      number: "03",
      week: "Week 3",
      title: "Development & System Build",
      description: "Your custom website is built in React JS or Bubble.io, optimized for performance, scalability, and seamless integrations.",
      icon: faCode
    },
    {
      id: 4,
      number: "04",
      week: "Week 4",
      title: "Testing, Optimization & Launch",
      description: "We run full QA testing, refine performance, and deploy your site smoothly ensuring a confident, high-impact launch.",
      icon: faRocket
    }
  ];

  // Variants for animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 30
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
        duration: 0.6
      }
    }
  };

  const numberVariants = {
    hidden: { 
      opacity: 0,
      scale: 0,
    },
    visible: { 
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15,
        delay: 0.2
      }
    }
  };

  // Mobile-friendly variants
  const cardVariants = {
    hidden: { 
      opacity: 0,
      x: -20
    },
    visible: { 
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 12,
        duration: 0.6
      }
    }
  };

  return (
    <section className="py-16 md:py-20 bg-white relative overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(239,68,68,0.1) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <SectionHeader
            heading="How It Works"
            description="Your Rapid Launch Partner, Built for Founders"
            gradientHeading={true}
            gradientFrom="from-black"
            gradientVia="via-red-600"
            gradientTo="to-gray-900"
          />
        </motion.div>

        {/* Steps Timeline */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px", amount: 0.1 }}
          className="relative mt-8 md:mt-16"
        >
          {/* Vertical Line - Desktop only */}
          {!isMobile && (
            <motion.div 
              className="absolute left-1/2 -translate-x-1/2 w-[2px] h-full hidden md:block"
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              style={{ transformOrigin: "top" }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-red-600 via-red-400 to-red-600" />
              <div className="absolute inset-0 blur-[2px] bg-red-600/30" />
            </motion.div>
          )}

          {/* Mobile vertical line */}
          {isMobile && (
            <div className="absolute left-6 top-0 bottom-0 w-[2px] bg-gradient-to-b from-red-600/20 via-red-600 to-red-600/20 md:hidden" />
          )}

          {steps.map((step, index) => {
            // For mobile: simple left-aligned layout
            // For desktop: alternating left/right
            const isLeft = !isMobile && index % 2 === 0;
            
            return (
              <motion.div
                key={step.id}
                variants={itemVariants}
                className={`relative flex flex-col ${
                  isMobile ? 'ml-12 mb-8' : `md:flex-row items-start gap-8 mb-8 last:mb-0 ${
                    isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`
                }`}
              >
                {/* Number Circle with Icon */}
                <motion.div 
                  className={`${
                    isMobile 
                      ? 'absolute -left-12 top-0' 
                      : 'absolute left-0 md:left-1/2 md:-translate-x-1/2 -top-2 md:top-1/2 md:-translate-y-1/2 z-10'
                  }`}
                  variants={numberVariants}
                >
                  <motion.div
                    whileHover={{ scale: 1.1}}
                    whileTap={{ scale: 0.95 }}
                    className="relative w-14 h-14 rounded-full flex items-center justify-center shadow-lg cursor-default"
                  >
                    {/* Gradient Border */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-red-600 via-red-400 to-red-600 p-[2px]">
                      <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                        {/* Icon inside */}
                        <FontAwesomeIcon 
                          icon={step.icon} 
                          className="w-5 h-5 text-red-600"
                        />
                      </div>
                    </div>
                    
            
                  </motion.div>
                </motion.div>

                {/* Content Card */}
                <div className={`w-full ${
                  isMobile 
                    ? '' 
                    : `md:w-[calc(50%-40px)] ${
                        isLeft ? 'md:pr-8' : 'md:pl-8 md:text-right'
                      }`
                }`}>
                  <motion.div
                    variants={isMobile ? cardVariants : (isLeft ? leftCardVariants : rightCardVariants)}
                    whileHover={!isMobile ? { 
                      y: -5,
                      boxShadow: "0 20px 40px rgba(239,68,68,0.15)"
                    } : {}}
                    className="relative bg-white p-5 md:p-6 rounded-xl border border-gray-100 shadow-sm transition-all duration-300"
                  >
                    {/* Week Badge - Positioned based on card side */}
                    {!isMobile && (
                      <div className={`absolute top-4 ${isLeft ? 'right-4' : 'left-4'}`}>
                        <span className="font-['Manrope'] text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-900">
                          {step.week}
                        </span>
                      </div>
                    )}

                    {/* Title with Icon for Mobile */}
                    {isMobile && (
                      <div className="flex items-center gap-2 mb-2">
                      
                        <span className="text-sm font-['Manrope'] text-red-600 font-semibold">
                          {step.week}
                        </span>
                      </div>
                    )}

                    {/* Title */}
                    <h3 className={`font-['Marcellus'] text-lg md:text-xl lg:text-2xl font-bold text-gray-900 mb-2 ${
                      !isMobile && isLeft ? 'pr-20' : !isMobile && !isLeft ? 'pl-20' : ''
                    }`}>
                      {step.title}
                    </h3>

                    {/* Description */}
                    <p className={`font-['Manrope'] text-gray-600 text-sm md:text-base leading-relaxed ${
                      !isMobile && isLeft ? 'pr-20' : !isMobile && !isLeft ? 'pl-20' : ''
                    }`}>
                      {step.description}
                    </p>

                    {/* Bottom Accent Line */}
                    <motion.div
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] bg-gradient-to-r from-red-600 to-red-700"
                      initial={{ width: 0 }}
                      whileInView={{ width: '30%' }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                      viewport={{ once: true }}
                    />

                    {/* Visible Step Number - Positioned based on card side */}
                    {!isMobile && (
                      <div className={`absolute top-1/2 -translate-y-1/2 ${
                        isLeft ? 'left-4' : 'right-4'
                      } opacity-20`}>
                        <span className="font-['Marcellus'] text-8xl font-black text-gray-300">
                          {step.number}
                        </span>
                      </div>
                    )}
                  </motion.div>
                </div>

                {/* Empty space for desktop alignment */}
                {!isMobile && <div className="hidden md:block md:w-[calc(50%-40px)]" />}
              </motion.div>
            );
          })}
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-8 md:mt-16"
        >
         <GlowingButton 
            glowColor="255, 150, 150"
            spreadSize="small"
            speed="medium"
            waveCount={5} 
          >
            Get Your Custom Roadmap
          </GlowingButton>
        </motion.div>
      </div>
    </section>
  );
}

// Keep these variants outside the component
const leftCardVariants = {
  hidden: { 
    opacity: 0,
    x: -50,
    rotateY: -15
  },
  visible: { 
    opacity: 1,
    x: 0,
    rotateY: 0,
    transition: {
      type: "spring",
      stiffness: 80,
      damping: 12,
      duration: 0.8
    }
  }
};

const rightCardVariants = {
  hidden: { 
    opacity: 0,
    x: 50,
    rotateY: 15
  },
  visible: { 
    opacity: 1,
    x: 0,
    rotateY: 0,
    transition: {
      type: "spring",
      stiffness: 80,
      damping: 12,
      duration: 0.8
    }
  }
};