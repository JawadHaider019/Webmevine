"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { FiZap, FiTrendingUp, FiShield, FiUsers } from "react-icons/fi";
import { BsRocket } from "react-icons/bs";
import { LuSparkles } from "react-icons/lu";

export default function ValueSection() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });

  const valuePoints = [
    {
      icon: FiZap,
      title: "First Impression",
      description: "Your website is often the first interaction potential clients have with your brand. Make it count."
    },
    {
      icon: BsRocket,
      title: "Sales Engine",
      description: "A high-converting asset that turns visitors into customers, 24/7, without resting."
    },
    {
      icon: FiUsers,
      title: "Investor Validation",
      description: "Serious infrastructure signals serious potential. Your website speaks before you do."
    },
    {
      icon: FiTrendingUp,
      title: "Growth Infrastructure",
      description: "Built to scale, adapt, and evolve as your business grows and markets shift."
    }
  ];

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
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  return (
    <section className="relative py-16 bg-white overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, black 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}
      />

      {/* Gradient Accent Lines */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-red-600/20 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-red-600/20 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Left Column - Main Message */}
          <motion.div
            ref={sectionRef}
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="space-y-6"
          >
            {/* Small Heading */}
            <div className="inline-block">
              <span className="px-4 py-2 bg-red-600/5 border border-red-600/10 rounded-full text-red-600 text-sm font-['Manrope'] font-semibold tracking-wider">
                ✦ Beyond Design ✦
              </span>
            </div>

            {/* Main Heading */}
            <h2 className="font-['Marcellus'] text-4xl md:text-5xl lg:text-6xl text-gray-900 leading-tight">
              This Is Not <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-400">"Just a Website"</span>
            </h2>

            {/* Subheading */}
            <p className="font-['Manrope'] text-xl text-gray-700">
              Your website is not a design project. It's your:
            </p>

            {/* Warning Message */}
            <div className="bg-red-600/5 border-l-4 border-red-600 p-5 rounded-r-xl">
              <p className="font-['Manrope'] text-gray-800 text-sm leading-relaxed">
                <span className="font-bold text-red-600">A slow, generic, template-based website</span> silently kills trust. Don't let your digital presence become a liability.
              </p>
            </div>

            {/* Brand Statement */}
            <div className="pt-4">
              <p className="font-['Manrope'] text-gray-600 text-lg leading-relaxed">
                At <span className="font-bold text-red-600">WebMavine</span>, we build digital assets engineered for authority, speed, and conversion. Because serious brands deserve serious infrastructure.
              </p>
            </div>

            {/* CTA Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-4 group relative px-8 py-4 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-full font-['Manrope'] font-semibold text-lg shadow-xl hover:shadow-red-600/30 transition-all duration-300 overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-3">
                Build Your Digital Asset
                <LuSparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              </span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                initial={{ x: "-100%" }}
                whileHover={{ x: "200%" }}
                transition={{ duration: 0.8 }}
              />
            </motion.button>
          </motion.div>

          {/* Right Column - Value Points Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="grid grid-cols-1 sm:grid-cols-2 gap-5"
          >
            {valuePoints.map((point, index) => {
              const Icon = point.icon;
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="group relative"
                >
                  {/* Card Glow Effect */}
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600/10 to-red-400/10 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Card */}
                  <div className="relative bg-white p-6 rounded-2xl border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300 h-full">
                    {/* Icon with Background */}
                    <div className="w-12 h-12 bg-gradient-to-br from-red-600/10 to-red-400/10 rounded-xl flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-red-600" />
                    </div>

                    {/* Title */}
                    <h3 className="font-['Marcellus'] text-lg font-bold text-gray-900 mb-2">
                      {point.title}
                    </h3>

                    {/* Description */}
                    <p className="font-['Manrope'] text-gray-600 text-sm leading-relaxed">
                      {point.description}
                    </p>

                    {/* Decorative Corner */}
                    <div className="absolute bottom-3 right-3 opacity-10">
                      <LuSparkles className="w-6 h-6 text-red-600" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* Bottom Trust Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-8 mt-16 pt-8 border-t border-gray-200"
        >
          {["Enterprise Grade", "Conversion Focused", "Performance Optimized", "Future Ready"].map((badge, index) => (
            <div key={index} className="flex items-center gap-2">
              <FiShield className="w-4 h-4 text-red-600" />
              <span className="font-['Manrope'] text-sm text-gray-600">{badge}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}