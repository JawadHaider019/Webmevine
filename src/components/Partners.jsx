"use client";

import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { useRef, useEffect, useState } from "react";
import SectionHeader from "./SectionHeader";

const ALL_PARTNERS = [
  { id: 1, src: "/partner/campuna.png", alt: "Campuna", width: 120, height: 40 },
  { id: 2, src: "/partner/cdl school.png", alt: "CDL School", width: 120, height: 40 },
  { id: 3, src: "/partner/eternox.png", alt: "Eternox", width: 120, height: 40 },
  { id: 4, src: "/partner/fintalio.png", alt: "Fintalio", width: 120, height: 40 },
  { id: 5, src: "/partner/fivup.png", alt: "Fivup", width: 120, height: 40 },
  { id: 6, src: "/partner/goodbyemama.png", alt: "Goodbye Mama", width: 120, height: 40 },
  { id: 7, src: "/partner/jocelyn.png", alt: "Jocelyn", width: 120, height: 40 },
  { id: 8, src: "/partner/magus.png", alt: "Magus", width: 120, height: 40 },
  { id: 9, src: "/partner/pureclay.png", alt: "Pure Clay", width: 120, height: 40 },
  { id: 10, src: "/partner/righthire.png", alt: "Right Hire", width: 120, height: 40 },
  { id: 11, src: "/partner/unitedmercy.png", alt: "United Mercy", width: 120, height: 40 },
  { id: 12, src: "/partner/zola.png", alt: "Zola", width: 120, height: 40 },
];

// Duplicated 2x for seamless CSS GPU marquee (-50% transform)
const MARQUEE_PARTNERS = [...ALL_PARTNERS, ...ALL_PARTNERS];

function StatCounter({ target, suffix, label, delay = 0 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let rafId;
    const duration = 1200;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      const next = Math.round(target * eased);
      setValue((prev) => (prev !== next ? next : prev));
      if (progress < 1) {
        rafId = window.requestAnimationFrame(tick);
      }
    };

    rafId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(rafId);
  }, [isInView, target]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.92 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="text-center"
    >
      <div
        className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-black via-red-600 to-gray-900"
        style={{ fontFamily: "var(--font-marcellus)" }}
      >
        {value}
        {suffix}
      </div>
      <div className="text-gray-600 text-sm md:text-base mt-2 font-['Manrope']">
        {label}
      </div>
    </motion.div>
  );
}

export default function Partners() {
  return (
    <section className="bg-white py-16 border-t border-white/10 overflow-hidden">
      <div className="mx-auto px-0">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <SectionHeader
            smallHeading="Our Network"
            heading="Trusted Partners"
            description="We collaborate with industry-leading companies to deliver exceptional results"
            gradientHeading={true}
            gradientFrom="from-black"
            gradientVia="via-red-600"
            gradientTo="to-gray-900"
          />
        </motion.div>

        {/* GPU CSS Marquee Slider (zero JS main-thread animation loop) */}
        <div className="relative mt-8 mb-12 overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-24 sm:w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 sm:w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

          <div className="animate-partners-marquee gap-10 items-center">
            {MARQUEE_PARTNERS.map((partner, index) => (
              <div
                key={`partner-${partner.id}-${index}`}
                className="flex-shrink-0 grayscale hover:grayscale-0 hover:scale-105 transition-all duration-300"
              >
                <Image
                  src={partner.src}
                  alt={partner.alt}
                  width={partner.width}
                  height={partner.height}
                  loading="lazy"
                  className="object-contain h-10 w-auto"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Isolated Counter Stats */}
        <div className="flex items-center justify-center flex-wrap gap-8 md:gap-16 mt-16 px-4">
          <StatCounter target={100} suffix="+" label="Projects Delivered" delay={0} />
          <StatCounter
            target={100}
            suffix="+"
            label="International Client Base"
            delay={0.08}
          />
          <StatCounter
            target={99}
            suffix="%"
            label="Client Retention Rate"
            delay={0.16}
          />
        </div>
      </div>
    </section>
  );
}
