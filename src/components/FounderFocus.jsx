"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import SectionHeader from "./SectionHeader";

export default function FounderFocus() {
  const [activeVideo, setActiveVideo] = useState(null);

  const founders = [
    {
      id: 1,
      name: "Alexander Chen",
      company: "FinTech Labs",
      role: "Founder & CEO",
      quote: "Ahmtech built our MVP in 4 weeks. We launched, got traction, and raised our seed round within 3 months.",
      videoThumb: "/founder-1.jpg", // Replace with actual thumbnail
      videoUrl: "/videos/founder-1.mp4", // Replace with actual video
      duration: "2:34",
      location: "Singapore"
    },
    {
      id: 2,
      name: "Victoria Laurent",
      company: "Luxe Retail",
      role: "Co-Founder",
      quote: "The team understood our vision immediately. They didn't just code—they contributed ideas that shaped our product.",
      videoThumb: "/founder-2.jpg",
      videoUrl: "/videos/founder-2.mp4",
      duration: "1:58",
      location: "Paris"
    },
    {
      id: 3,
      name: "Marcus Webb",
      company: "HealthTech Solutions",
      role: "CTO",
      quote: "Working with Ahmtech felt like having an extension of our own team. Technical excellence with founder mindset.",
      videoThumb: "/founder-3.jpg",
      videoUrl: "/videos/founder-3.mp4",
      duration: "3:12",
      location: "London"
    },
    {
      id: 4,
      name: "Sophia Rahman",
      company: "EduPlatform",
      role: "Founder",
      quote: "From concept to launch in under 4 weeks—absolutely incredible. The platform handles thousands of users flawlessly.",
      videoThumb: "/founder-4.jpg",
      videoUrl: "/videos/founder-4.mp4",
      duration: "2:45",
      location: "Dubai"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white via-gray-50 to-white relative overflow-hidden">
      {/* Luxury Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-0 w-96 h-96 bg-gradient-to-l from-red-600/5 via-amber-200/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-0 w-96 h-96 bg-gradient-to-r from-red-600/5 via-amber-200/5 to-transparent rounded-full blur-3xl" />
        
        {/* Subtle pattern */}
        <div className="absolute inset-0 opacity-[0.02]" 
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #000 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <SectionHeader
            smallHeading="Founder Focus"
            heading="Proven Results. Built for Founders Like You"
            description="Hear directly from founders who launched their dreams with us"
            gradientHeading={true}
            gradientFrom="from-black"
            gradientVia="via-red-600"
            gradientTo="to-gray-900"
            smallHeadingColor="text-red-600"
            descriptionColor="text-gray-600"
          />
        </motion.div>

        {/* Video Grid */}
        <motion.div 
          className="mt-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          {founders.map((founder, index) => (
            <motion.div
              key={founder.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="relative group cursor-pointer"
              onClick={() => setActiveVideo(founder)}
            >
              {/* Video Card - 9:16 Aspect Ratio */}
              <div className="relative aspect-[9/16] rounded-xl overflow-hidden shadow-lg">
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 z-10" />
                
                {/* Thumbnail placeholder */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900">
                  {/* This would be your actual thumbnail image */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-red-600/80 flex items-center justify-center">
                      <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Founder info overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                  <h3 className="font-['Marcellus'] text-white text-sm md:text-base font-bold truncate">
                    {founder.name}
                  </h3>
                  <p className="font-['Manrope'] text-white/70 text-xs truncate">
                    {founder.company}
                  </p>
                </div>

                {/* Duration badge */}
                <div className="absolute top-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded-full font-['Manrope'] z-20">
                  {founder.duration}
                </div>

                {/* Play button on hover */}
                <motion.div 
                  className="absolute inset-0 bg-black/40 flex items-center justify-center z-30"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </motion.div>
              </div>

              {/* Quote preview on hover (optional) */}
              <motion.div 
                className="absolute -bottom-2 left-0 right-0 bg-white/95 backdrop-blur-sm p-3 rounded-lg shadow-lg z-40 border border-gray-200"
                initial={{ opacity: 0, y: 10 }}
                whileHover={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <p className="font-['Manrope'] text-xs text-gray-600 line-clamp-2">
                  "{founder.quote}"
                </p>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

     
      
      </div>
    </section>
  );
}