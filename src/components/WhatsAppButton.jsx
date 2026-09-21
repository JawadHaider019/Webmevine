"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaWhatsapp } from "react-icons/fa";

export default function WhatsAppButton() {
  const [isHovered, setIsHovered] = useState(false);

  const phoneNumber = "447424672943";
  const defaultMessage = "Hi! I'm interested in discussing a project with WebMavien.";
  const encodedMessage = encodeURIComponent(defaultMessage);
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3">
      {/* Tooltip / Prompt Badge */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, x: 15, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 15, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="hidden sm:flex items-center gap-2 bg-gray-900/95 backdrop-blur-md text-white text-xs font-['Manrope'] font-medium px-3.5 py-2 rounded-full shadow-xl border border-white/10 pointer-events-none"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Chat on WhatsApp</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Floating Button */}
      <motion.a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp with WebMavien"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20
        }}
        className="relative group flex items-center justify-center w-14 h-14 rounded-full shadow-2xl focus:outline-none"
      >
        {/* Pulsing Ripple Effect */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-30 animate-ping pointer-events-none" />
        
        {/* Subtle Glow Layer */}
        <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-emerald-500 to-green-500 opacity-60 blur-md group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        {/* WhatsApp Button Body */}
        <div className="relative w-full h-full rounded-full bg-gradient-to-tr from-[#128C7E] via-[#20ba5a] to-[#25D366] flex items-center justify-center text-white shadow-lg border border-white/20">
          <FaWhatsapp className="w-7 h-7 transform group-hover:scale-110 transition-transform duration-200" />
        </div>

        {/* Online Status Dot */}
        <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-emerald-400 border-2 border-white rounded-full shadow-sm" />
      </motion.a>
    </div>
  );
}
