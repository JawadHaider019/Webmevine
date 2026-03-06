// components/CTA.jsx
"use client";

import { motion } from "framer-motion";
import GlowingButton from "./GlowingButton";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function CTA({ onBookCall }) {
  const pathname = usePathname();
  const isContactPage = pathname === '/contact';

  const handleClick = (e) => {
    if (isContactPage) {
      // On contact page: smooth scroll to calendar
      if (onBookCall) {
        onBookCall(e);
      } else {
        e.preventDefault();
        const calendar = document.querySelector('#calendar');
        if (calendar) {
          const yOffset = -80;
          const y = calendar.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({
            top: y,
            behavior: 'smooth'
          });
        }
      }
    }
    // On other pages: let the Link component handle navigation to /contact
  };

  return (
    <section className="relative py-12 md:py-16 overflow-hidden px-4">
      {/* Gradient Background Container */}
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
          {/* Section Header */}
          <div className="text-center mb-6">
            <span className="text-white/90 text-sm font-['Manrope'] tracking-wider">
              LIMITED SPOTS
            </span>
            <h2 className="font-['Marcellus'] text-4xl md:text-5xl text-white mt-2 mb-4">
              Ready to Launch?
            </h2>
            <p className="text-gray-200 font-['Manrope'] max-w-2xl mx-auto">
              Join 100+ founders who launched in 4 weeks. Let's build something great.
            </p>
          </div>
        </motion.div>

        {/* CTA Button with conditional behavior */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          viewport={{ once: true }}
          className="flex justify-center items-center mt-6 md:mt-8 px-4"
        >
          {isContactPage ? (
            <GlowingButton 
              variant="secondary"
              glowColor="255, 150, 150"
              spreadSize="small"
              speed="slow"
              waveCount={3}
              onClick={handleClick}
            >
              Book Free Call
            </GlowingButton>
          ) : (
            <Link href="/contact">
              <GlowingButton 
                variant="secondary"
                glowColor="255, 150, 150"
                spreadSize="small"
                speed="slow"
                waveCount={3}
              >
                Book Free Call
              </GlowingButton>
            </Link>
          )}
        </motion.div>
      </div>
    </section>
  );
}