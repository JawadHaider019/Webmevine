"use client";

import { motion } from "framer-motion";
import SectionHeader from "./SectionHeader";
import GlowingButton from "./GlowingButton";

export default function FinalCTA() {
  return (
    <section className="relative py-12 md:py-16 overflow-hidden px-4">
      {/* Gradient Background Container - Fixed to show on all devices */}
      <div className="absolute inset-0 flex justify-center items-start pointer-events-none">
        <div 
          className="w-full max-w-6xl mx-auto h-full bg-gradient-to-r from-black via-red-600 to-black rounded-2xl md:rounded-3xl"
          style={{ 
            minHeight: '300px',
            maxHeight: '400px',
            width: 'calc(100% - 2rem)',
            margin: '0 auto'
          }}
        />
      </div>
      
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
            smallHeading="LIMITED SPOTS"
            heading="Ready to Launch?"
            description="Join 100+ founders who launched in 4 weeks. Let's build something great."
            gradientHeading={true}
            gradientFrom="from-white"
            gradientVia="via-gray-100"
            gradientTo="to-gray-300"
            smallHeadingColor="text-white/90"
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