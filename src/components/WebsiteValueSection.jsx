"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { FiCheckCircle } from "react-icons/fi";
import GlowingButton from "./GlowingButton";

export default function WebsiteValueSection() {
  return (
    <section className="w-full bg-white text-black flex flex-col items-center justify-center py-20 px-4 md:px-0 overflow-hidden">
      <div className="w-full max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Left Content - More Concise */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.span 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-red-600 text-sm font-['Manrope'] font-semibold uppercase tracking-wider mb-4 block"
            >
              BEYOND DESIGN
            </motion.span>

            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="font-['Marcellus'] text-4xl md:text-5xl text-gray-900 mb-6 font-semibold leading-tight"
            > 
              This Is Not{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-black via-red-600 to-red-900">
                “Just a Website”
              </span> 
            </motion.h2>

            {/* Value Props - Condensed */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {[
                "First impression",
                "Sales engine",
                "Investor validation",
                "Growth infrastructure"
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="flex items-center gap-2 bg-gray-50/50 p-3 rounded-lg"
                >
                  <FiCheckCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                  <span className="font-['Manrope'] text-gray-700 text-sm">{item}</span>
                </motion.div>
              ))}
            </div>

            {/* Warning Box - More Compact */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mb-6 p-4 bg-red-50/50 border-l-4 border-red-600 rounded-r-lg"
            >
              <p className="font-['Manrope'] text-gray-700 text-sm">
                <span className="font-bold text-red-600">Template-based websites</span> silently kill trust.
              </p>
            </motion.div>

            {/* Value Proposition - Single Line */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="font-['Manrope'] text-gray-700 mb-4"
            >
              We build digital assets engineered for{" "}
              <span className="font-semibold text-gray-900">authority, speed, and conversion.</span>
            </motion.p>

            {/* Closing Statement - Brief */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="font-['Marcellus'] text-lg text-gray-900 mb-6"
            >
              Serious brands deserve serious infrastructure.
            </motion.p>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <GlowingButton
                glowColor="200, 0, 0"
                spreadSize="small"
                speed="medium"
                waveCount={3}
                onClick={() => window.location.href = "/contact"}
              >
                Build Your Digital Asset
              </GlowingButton>
            </motion.div>
          </motion.div>

          {/* Right Content - Image (Unchanged) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ 
                boxShadow: "0 30px 60px rgba(239,68,68,0.15)",
              }}
              transition={{ delay: 0.2 }}
              className="backdrop-blur-lg bg-gradient-to-br from-red-600/5 to-red-500/5 border border-red-600/20 rounded-2xl p-2 shadow-lg hover:shadow-xl transition-all duration-500"
            >
              <div className="relative h-[400px] md:h-[500px] w-full rounded-xl overflow-hidden">
                <Image
                  src="/value.jpg"
                  alt="Website as digital asset"
                  fill
                  className="object-cover transition-transform duration-700 hover:scale-105"
                />
                    
              </div>
            </motion.div>

           
          </motion.div>

        </div>
      </div>
    </section>
  );
}