"use client";

import { motion } from "framer-motion";
import SectionHeader from "./SectionHeader";
import GlowingButton from "./GlowingButton";

export default function FinalCTA() {
  return (
    <section className="relative -translate-y-5 md:-translate-y-10 py-12 md:py-16 overflow-hidden px-4">
      {/* Gradient Background Container - Fully Responsive */}
      <div 
        className="absolute inset-0 bg-gradient-to-r from-black via-red-600 to-black rounded-2xl md:rounded-3xl lg:rounded-4xl"
        style={{ 
          left: '50%', 
          transform: 'translateX(-50%)', 
          width: 'calc(100% - 1rem)', 
          maxWidth: '1280px',
          height: 'auto',
          minHeight: '300px',
          maxHeight: '400px'
        }} 
      />
      
      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="px-4 md:px-6 lg:px-8"
        >
          <SectionHeader
            smallHeading="LIMITED AVAILABILITY"
            heading="Ready to Launch Your Dream Project?"
            description="Join 100+ founders who launched their MVPs in 4 weeks. Let's build something extraordinary together."
            gradientHeading={true}
            gradientFrom="from-white"
            gradientVia="via-gray-100"
            gradientTo="to-gray-300"
            smallHeadingColor="text-white"
            descriptionColor="text-gray-200"
          />
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-6 md:mt-8 px-4"
        >
         <GlowingButton 
           variant="secondary"
  glowColor="255, 150, 150"
  spreadSize="small"
  speed="slow"
  waveCount={3}
          >
           Book Free Call
          </GlowingButton>
        </motion.div>

   
      </div>
    </section>
  );
}