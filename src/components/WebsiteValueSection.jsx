"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { FiCheckCircle } from "react-icons/fi";
import GlowingButton from "./GlowingButton";

export default function WebsiteValueSection() {
  return (
    <section className="relative bg-white py-20 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div 
          className="absolute inset-0" 
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #000 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="order-2 lg:order-1"
          >
            {/* Small heading */}
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-red-600 text-sm font-['Manrope'] font-semibold uppercase tracking-wider mb-4 block"
            >
              BEYOND DESIGN
            </motion.span>

            {/* Main heading */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="font-['Marcellus'] text-4xl md:text-5xl lg:text-6xl text-gray-900 mb-6 leading-tight"
            >
              This Is Not{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-500">
                “Just a Website”
              </span>
            </motion.h2>

            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="font-['Manrope'] text-gray-700 text-lg mb-8"
            >
              Your website is not a design project. It's your:
            </motion.p>

            {/* List of value propositions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-4 mb-8"
            >
              {[
                "First impression",
                "Sales engine",
                "Investor validation tool",
                "Growth infrastructure"
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <FiCheckCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                  <span className="font-['Manrope'] text-gray-800 text-lg">{item}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* Warning text */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="mb-8 p-5 bg-red-50/50 border-l-4 border-red-600 rounded-r-lg"
            >
              <p className="font-['Manrope'] text-gray-700 italic">
                A slow, generic, template-based website <span className="font-bold text-red-600">silently kills trust.</span>
              </p>
            </motion.div>

            {/* Main message */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="font-['Manrope'] text-gray-700 text-lg mb-8 leading-relaxed"
            >
              At WebMavine, we build digital assets engineered for{" "}
              <span className="font-semibold text-gray-900">authority, speed, and conversion.</span>
            </motion.p>

            {/* Closing statement */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="font-['Marcellus'] text-xl text-gray-900 mb-8"
            >
              Because serious brands deserve serious infrastructure.
            </motion.p>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
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

          {/* Right Image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="order-1 lg:order-2 relative"
          >
            <div className="relative h-[400px] md:h-[500px] lg:h-[600px] rounded-2xl overflow-hidden">
              {/* Main Image */}
              <Image
                src="/value.jpg" 
                alt="Website as digital asset"
                fill
                className="object-cover"
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-red-600/20 via-transparent to-transparent" />
              
              {/* Decorative Elements */}
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-red-600/10 rounded-full blur-3xl" />
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-red-600/10 rounded-full blur-3xl" />
              
              {/* Floating Stats Card (Optional) */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="absolute bottom-8 left-8 bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">⚡</span>
                  </div>
                  <div>
                    <div className="font-['Marcellus'] text-xl font-bold text-gray-900">3x Faster</div>
                    <div className="font-['Manrope'] text-xs text-gray-500">Time to market</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}