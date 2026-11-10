"use client";

import Image from "next/image";
import { useRef, useEffect } from "react";
import InteractiveGradient from "./InteractiveGradient";
import GlowingButton from "./GlowingButton";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Globe, Rocket, Zap, Star, ShieldCheck } from "lucide-react";

const HERO_SERVICE_CARDS = [
  {
    title: "Custom React & Next.js",
    desc: "10x Sales Growth & Full Technical SEO",
    proofLabel: "Pure Clay Case Study",
    href: "/casestudies/pure-clay",
    icon: <Rocket className="w-6 h-6 sm:w-7 sm:h-7 text-red-500" />,
  },
  {
    title: "Bubble.io & No-Code",
    desc: "Marketplaces & SaaS Launched in 21 Days",
    proofLabel: "Campuna Case Study",
    href: "/casestudies/campuna",
    icon: <Zap className="w-6 h-6 sm:w-7 sm:h-7 text-red-500" />,
  },
  {
    title: "AI SaaS Platforms",
    desc: "94% Hiring Accuracy & OpenAI Workflows",
    proofLabel: "Fintalio Case Study",
    href: "/casestudies/fintalio",
    icon: <Globe className="w-6 h-6 sm:w-7 sm:h-7 text-red-500" />,
  },
  {
    title: "E-Commerce & Marketplaces",
    desc: "Stripe Connect, Wallets & Automated Ops",
    proofLabel: "All Storefront Stories",
    href: "/casestudies?filter=Marketplace+%26+E-Commerce",
    icon: <CheckCircle2 className="w-6 h-6 sm:w-7 sm:h-7 text-red-500" />,
  },
];

export default function Hero() {
  const sectionRef = useRef(null);
  const gridRef = useRef(null);
  const rectRef = useRef(null);
  const rafRef = useRef(null);

  const updateRect = () => {
    if (sectionRef.current) {
      rectRef.current = sectionRef.current.getBoundingClientRect();
    }
  };

  useEffect(() => {
    window.addEventListener("resize", updateRect, { passive: true });
    return () => {
      window.removeEventListener("resize", updateRect);
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const handleMouseMove = (e) => {
    if (!gridRef.current || (typeof window !== "undefined" && window.innerWidth < 1024)) return;
    if (!rectRef.current) updateRect();
    if (!rectRef.current) return;

    const nx = Math.max(0, Math.min(1, (e.clientX - rectRef.current.left) / (rectRef.current.width || 1)));
    const ny = Math.max(0, Math.min(1, (e.clientY - rectRef.current.top) / (rectRef.current.height || 1)));

    const rx = (0.5 - ny) * 4; // +/- 2deg
    const ry = (nx - 0.5) * 4; // +/- 2deg

    if (rafRef.current) return;
    rafRef.current = window.requestAnimationFrame(() => {
      rafRef.current = null;
      if (gridRef.current) {
        gridRef.current.style.transform = `perspective(1000px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`;
      }
    });
  };

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="relative flex items-center justify-center min-h-screen bg-[#020202] overflow-hidden py-24 lg:py-0"
    >
      {/* Background Layer */}
      <div className="absolute inset-0 z-0">
        <InteractiveGradient />
        {/* Dot Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, #ffffff 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
        {/* Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000_100%)]" />
      </div>

      {/* Glow Overlays */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-600/10 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-red-900/10 blur-[150px] rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-12 relative z-10 grid lg:grid-cols-2 gap-10 lg:gap-16 items-center pt-6 lg:pt-0">
        {/* Left Content (Always immediately visible for zero LCP delay) */}
        <div className="max-w-3xl text-center lg:text-left mx-auto lg:mx-0 order-1">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-['Manrope'] font-semibold text-zinc-200 mb-5">
            <ShieldCheck className="w-3.5 h-3.5 text-red-500" />
            <span>100+ Launches • 21-Day Milestone Guarantee</span>
          </div>

          <h1
            className="text-4xl sm:text-5xl lg:text-5xl xl:text-6xl text-white mb-6 uppercase font-bold"
            style={{
              lineHeight: "1.18",
              textShadow: "0 4px 20px rgba(220, 38, 38, 0.15)",
              letterSpacing: "-0.02em",
              fontFamily: "var(--font-marcellus)",
            }}
          >
            Custom Websites <br /> in{" "}
            <span className="text-red-600 relative inline-block px-2 sm:px-3.5 lg:px-4">
              21 Days Or
              <span
                className="absolute inset-0 -z-10 bg-white"
                style={{ transform: "skewX(-12deg)" }}
              />
            </span>
            <br />
            <span className="text-red-600 relative inline-block px-2 sm:px-3.5 lg:px-4 mt-2">
              Money Back
              <span
                className="absolute inset-0 -z-10 bg-white"
                style={{ transform: "skewX(-12deg)" }}
              />
            </span>
          </h1>

          <p
            className="text-sm sm:text-base md:text-lg text-gray-300 mb-8 sm:mb-9 leading-relaxed font-light max-w-xl mx-auto lg:mx-0"
            style={{ fontFamily: "var(--font-manrope)" }}
          >
            WebMavien engineers conversion-focused React, Next.js, Node.js, and Bubble.io products for SaaS founders, e-commerce brands, and ambitious startups.
          </p>

          {/* Dual-Path CTA Bar (High-Intent Booking + Low-Friction Proof Exploration) */}
          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start mb-8">
            <Link href="/contact" className="w-full sm:w-auto">
              <GlowingButton
                glowColor="255, 255, 255"
                variant="primary"
                className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 text-base sm:text-lg"
              >
                Book Your Free Strategy Call
              </GlowingButton>
            </Link>

            <Link
              href="/casestudies"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 font-['Manrope'] font-semibold text-sm sm:text-base transition-all duration-300 group"
            >
              <span>See Case Studies</span>
              <ArrowRight className="w-4 h-4 text-red-400 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Real Client Outcome Proof Strip with Real Human Portraits */}
          <Link
            href="/casestudies"
            className="inline-flex flex-wrap items-center justify-center lg:justify-start gap-4 px-4 py-3 rounded-2xl bg-white/5 border border-white/10 hover:border-red-500/40 transition-colors group"
          >
            <div className="flex -space-x-2.5 items-center">
              {[
                {
                  src: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=160&h=160&fit=crop&crop=faces&q=80",
                  alt: "SaaS Founder — Fintalio (94% Hiring Accuracy)",
                },
                {
                  src: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=160&h=160&fit=crop&crop=faces&q=80",
                  alt: "Platform Founder — United Mercy ($250K+ Raised)",
                },
                {
                  src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&h=160&fit=crop&crop=faces&q=80",
                  alt: "E-Commerce Founder — Pure Clay (10x Sales Growth)",
                },
                {
                  src: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=160&h=160&fit=crop&crop=faces&q=80",
                  alt: "Marketplace Founder — Campuna (200+ Listings)",
                },
              ].map((client, i) => (
                <div
                  key={i}
                  title={client.alt}
                  className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-[#020202] bg-zinc-800 overflow-hidden shadow-md group-hover:scale-105 transition-transform duration-300"
                >
                  <Image
                    src={client.src}
                    alt={client.alt}
                    width={40}
                    height={40}
                    className="object-cover w-full h-full"
                    priority
                  />
                </div>
              ))}
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1.5 text-white text-xs sm:text-sm font-bold font-['Manrope']">
                <span>5.0</span>
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span>Verified Client ROI</span>
              </div>
              <span className="text-[11px] sm:text-xs text-gray-400 group-hover:text-red-400 transition-colors block">
                10x E-Com Growth • 94% AI Accuracy • $250K+ Raised →
              </span>
            </div>
          </Link>
        </div>

        {/* Right Visual Component: 4 Clickable Service Proof Cards */}
        <div className="flex flex-col items-center justify-center gap-4 w-full relative z-10 order-2">
          <div
            ref={gridRef}
            className="relative w-full grid grid-cols-1 sm:grid-cols-2 gap-4 transition-transform duration-150 ease-out"
            style={{ transformStyle: "preserve-3d", willChange: "transform" }}
          >
            {HERO_SERVICE_CARDS.map((service, idx) => (
              <Link
                key={idx}
                href={service.href}
                className="bg-gray-900/50 backdrop-blur-lg border border-white/10 p-6 sm:p-7 rounded-2xl sm:rounded-3xl hover:border-red-600/60 hover:bg-gray-900/75 hover:-translate-y-1.5 transition-all duration-300 group shadow-2xl relative overflow-hidden flex flex-col justify-between items-start cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-red-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                <div className="w-full relative z-10">
                  <div className="bg-red-600/10 w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-red-600/20 transition-all duration-300">
                    {service.icon}
                  </div>
                  <h2
                    className="text-white text-base sm:text-lg font-bold mb-1.5 tracking-wide group-hover:text-red-400 transition-colors"
                    style={{ fontFamily: "var(--font-marcellus)" }}
                  >
                    {service.title}
                  </h2>
                  <p
                    className="text-gray-400 text-xs sm:text-sm leading-relaxed mb-4"
                    style={{ fontFamily: "var(--font-manrope)" }}
                  >
                    {service.desc}
                  </p>
                </div>

                <div className="relative z-10 inline-flex items-center gap-1.5 text-[11px] font-['Manrope'] font-semibold text-red-400 group-hover:text-white transition-colors">
                  <span>{service.proofLabel}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}

            {/* Decorative glowing blobs */}
            <div className="absolute -z-10 -top-6 -right-6 sm:-top-10 sm:-right-10 w-24 h-24 sm:w-40 sm:h-40 bg-red-600/20 blur-2xl sm:blur-3xl rounded-full" />
            <div className="absolute -z-10 -bottom-6 -left-6 sm:-bottom-10 sm:-left-10 w-24 h-24 sm:w-40 sm:h-40 bg-red-600/20 blur-2xl sm:blur-3xl rounded-full" />
          </div>

          {/* Trust Pills */}
          <div className="flex flex-wrap justify-center lg:justify-start gap-3">
            {[
              { icon: <Globe size={15} />, text: "Global Clients" },
              { icon: <CheckCircle2 size={15} />, text: "Standardized QA" },
              { icon: <Rocket size={15} />, text: "21-Day Rapid Launch" },
            ].map((item, idx) => (
              <Link
                key={idx}
                href="/process"
                className="flex items-center gap-2 text-zinc-200 hover:text-white transition-colors duration-200 bg-white/10 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-white/10 hover:border-red-500/40"
              >
                <span className="text-red-400">{item.icon}</span>
                <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-widest">
                  {item.text}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Decorative base gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black to-transparent pointer-events-none" />
    </section>
  );
}
