"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, CheckCircle2, Cpu, Layers, Rocket, ShieldCheck } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import SectionHeader from "./SectionHeader";
import GlowingButton from "./GlowingButton";

const PROJECT_GOALS = [
  {
    id: "ai-saas",
    label: "AI / SaaS MVP",
    subtitle: "OpenAI workflows, user subscriptions, admin dashboard",
    recommendedStack: {
      rapid: "Bubble.io + OpenAI API + Stripe",
      scale: "Next.js App Router + Node.js + OpenAI",
    },
    timeline: {
      rapid: "21 Days",
      scale: "3–4 Weeks",
    },
    caseStudy: {
      title: "Fintalio & FivUp AI",
      slug: "fintalio",
      metric: "94% AI Hiring Accuracy & 1,000+ Active Users in 4 Weeks",
    },
    deliverables: [
      "Deterministic AI prompt & API pipeline (server-protected)",
      "Stripe subscriptions, webhooks & customer workspace",
      "Analytics dashboard + 30-day post-launch support included",
    ],
  },
  {
    id: "marketplace",
    label: "Two-Sided Marketplace",
    subtitle: "Listings, host dashboards, admin verification, split payouts",
    recommendedStack: {
      rapid: "Bubble.io + Stripe Connect + Maps API",
      scale: "Next.js + MongoDB + Stripe Connect",
    },
    timeline: {
      rapid: "21–28 Days",
      scale: "4 Weeks",
    },
    caseStudy: {
      title: "Campuna & United Mercy",
      slug: "campuna",
      metric: "200+ Verified Listings & $250K+ Raised via Digital Wallets",
    },
    deliverables: [
      "Dual supply/demand dashboards & flexible listing attributes",
      "Admin quality approval queue & automated notifications",
      "Integrated Stripe payouts & escrow-ready checkout flow",
    ],
  },
  {
    id: "ecommerce",
    label: "Custom E-Commerce Store",
    subtitle: "High-converting DTC storefront, automated orders & SEO",
    recommendedStack: {
      rapid: "Next.js + Express + MongoDB + Stripe",
      scale: "Custom Headless React + Node.js + Technical SEO",
    },
    timeline: {
      rapid: "21 Days",
      scale: "3–4 Weeks",
    },
    caseStudy: {
      title: "Pure Clay Organic Store",
      slug: "pure-clay",
      metric: "10x Sales Growth & 100% Automated Order Fulfillment",
    },
    deliverables: [
      "Conversion-engineered product pages & fast mobile checkout",
      "Automated inventory, order tracking & CMS blog engine",
      "Full JSON-LD product & schema SEO for Google rankings",
    ],
  },
  {
    id: "business-platform",
    label: "Custom Web Platform / CRM",
    subtitle: "Client portals, scheduling, review workflows & automation",
    recommendedStack: {
      rapid: "Bubble.io + Automated Calendar & Webhooks",
      scale: "React + Next.js + Custom REST APIs",
    },
    timeline: {
      rapid: "21 Days",
      scale: "3–4 Weeks",
    },
    caseStudy: {
      title: "Zola Business SaaS",
      slug: "zola",
      metric: "70% Operational Efficiency Gain Across 500+ Beta Users",
    },
    deliverables: [
      "Unified client messaging, calendar sync & role permissions",
      "Full technical SEO setup (SSR metadata, sitemap, schema)",
      "100% ownership & zero-risk money-back guarantee",
    ],
  },
];

const TIMELINE_MODES = [
  { id: "rapid", label: "Launch Fast (21-Day MVP)" },
  { id: "scale", label: "Custom Scale & Full Code" },
];

export default function ProjectEstimatorSection() {
  const [selectedGoalId, setSelectedGoalId] = useState("ai-saas");
  const [timelineMode, setTimelineMode] = useState("rapid");

  const activeGoal =
    PROJECT_GOALS.find((g) => g.id === selectedGoalId) || PROJECT_GOALS[0];
  const recommendedStack = activeGoal.recommendedStack[timelineMode];
  const estimatedTimeline = activeGoal.timeline[timelineMode];

  const whatsappText = encodeURIComponent(
    `Hi WebMavien! I used the 21-Day Project Fit Tool on your homepage:\n- Goal: ${activeGoal.label}\n- Mode: ${
      timelineMode === "rapid" ? "Launch Fast (21-Day MVP)" : "Custom Scale & Full Code"
    }\n- Recommended Stack: ${recommendedStack}\nI'd love to discuss scoping this project.`
  );

  return (
    <section
      id="project-fit"
      className="py-16 md:py-20 bg-gradient-to-b from-white via-gray-50 to-white relative overflow-hidden"
    >
      {/* Subtle Ambient Orbs matching FAQ / Footer */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-12 left-0 w-80 h-80 bg-gradient-to-r from-red-600/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-12 right-0 w-80 h-80 bg-gradient-to-l from-red-600/5 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Animated Section Header matching Whyus / FAQ */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <SectionHeader
            smallHeading="Interactive Roadmap"
            heading="See Your Ideal 21-Day Launch Blueprint"
            description="Select what you are building to preview the recommended architecture, matched case study proof, and milestone roadmap before your call."
            gradientHeading={true}
            gradientFrom="from-black"
            gradientVia="via-red-600"
            gradientTo="to-gray-900"
            smallHeadingColor="text-red-600"
            descriptionColor="text-gray-600"
          />
        </motion.div>

        {/* Animated Split Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          {/* Left Card: Step 1 & Step 2 Controls */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7 bg-white rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 sm:p-8 flex flex-col justify-between space-y-7"
          >
            <div className="space-y-7">
              {/* Step 1 */}
              <div>
                <p className="font-['Manrope'] text-xs font-bold uppercase tracking-wider text-red-600 mb-3 flex items-center gap-2">
                  <Layers className="w-4 h-4" />
                  <span>Step 1 — What Are You Building?</span>
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {PROJECT_GOALS.map((goal) => {
                    const isActive = goal.id === selectedGoalId;
                    return (
                      <motion.button
                        key={goal.id}
                        type="button"
                        onClick={() => setSelectedGoalId(goal.id)}
                        whileHover={{ y: -3, scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ duration: 0.2 }}
                        className={`text-left p-4 rounded-xl border transition-colors duration-300 cursor-pointer relative overflow-hidden ${
                          isActive
                            ? "bg-red-50/75 border-red-600 shadow-md shadow-red-600/10"
                            : "bg-gray-50/70 border-gray-200 hover:border-red-400 hover:bg-white"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="font-['Marcellus'] font-bold text-base sm:text-lg text-gray-900">
                            {goal.label}
                          </span>
                          <motion.span
                            animate={{ scale: isActive ? 1.2 : 1 }}
                            transition={{ type: "spring", stiffness: 350, damping: 20 }}
                            className={`w-2.5 h-2.5 rounded-full shrink-0 transition-colors ${
                              isActive ? "bg-red-600" : "bg-gray-300"
                            }`}
                          />
                        </div>
                        <p className="font-['Manrope'] text-xs text-gray-600 leading-relaxed">
                          {goal.subtitle}
                        </p>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Step 2 */}
              <div>
                <p className="font-['Manrope'] text-xs font-bold uppercase tracking-wider text-red-600 mb-3 flex items-center gap-2">
                  <Rocket className="w-4 h-4" />
                  <span>Step 2 — Choose Delivery Priority</span>
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {TIMELINE_MODES.map((mode) => {
                    const isActive = mode.id === timelineMode;
                    return (
                      <motion.button
                        key={mode.id}
                        type="button"
                        onClick={() => setTimelineMode(mode.id)}
                        whileHover={{ y: -2, scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ duration: 0.2 }}
                        className={`px-4 py-3.5 rounded-xl font-['Manrope'] text-xs sm:text-sm font-semibold border transition-colors duration-300 cursor-pointer flex items-center justify-between ${
                          isActive
                            ? "bg-black text-white border-black shadow-md"
                            : "bg-gray-50/70 text-gray-700 border-gray-200 hover:border-red-400 hover:bg-white"
                        }`}
                      >
                        <span>{mode.label}</span>
                        <CheckCircle2
                          className={`w-4 h-4 transition-transform duration-300 ${
                            isActive ? "text-red-500 scale-110" : "text-gray-400"
                          }`}
                        />
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Deliverables Preview with smooth AnimatePresence transition */}
            <div className="pt-5 border-t border-gray-100">
              <p className="font-['Manrope'] text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
                Included In Your Milestone Scope
              </p>
              <AnimatePresence mode="wait">
                <motion.ul
                  key={activeGoal.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="space-y-2.5"
                >
                  {activeGoal.deliverables.map((item, idx) => (
                    <motion.li
                      key={idx}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.25, delay: idx * 0.06 }}
                      className="flex items-start gap-2.5 font-['Manrope'] text-xs sm:text-sm text-gray-700"
                    >
                      <CheckCircle2 className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </motion.li>
                  ))}
                </motion.ul>
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Right Card: Tailored Blueprint & Matching Signature Buttons */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.65, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5 bg-white rounded-2xl border-2 border-red-600/20 shadow-lg hover:shadow-xl hover:border-red-600/40 transition-all duration-300 p-6 sm:p-8 flex flex-col justify-between gap-6 relative overflow-hidden"
          >
            {/* Top Gradient Accent Bar */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-black via-red-600 to-black" />

            <div className="space-y-5 pt-1">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-red-600 text-[11px] font-['Manrope'] font-bold uppercase tracking-wider">
                  <Cpu className="w-3.5 h-3.5" /> Tailored Blueprint
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-['Manrope'] font-semibold text-gray-700">
                  <ShieldCheck className="w-4 h-4 text-red-600" />
                  <span>Money-Back Guarantee</span>
                </span>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={`${activeGoal.id}-${timelineMode}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  className="space-y-5"
                >
                  <div>
                    <p className="font-['Manrope'] text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">
                      Recommended Tech Stack
                    </p>
                    <h3 className="font-['Marcellus'] text-2xl font-bold text-gray-900 leading-snug">
                      {recommendedStack}
                    </h3>
                  </div>

                  {/* Clean Metric Tiles */}
                  <div className="grid grid-cols-2 gap-3.5">
                    <motion.div
                      whileHover={{ y: -2 }}
                      className="p-4 rounded-xl bg-gray-50 border border-gray-200/80 transition-all"
                    >
                      <div className="font-['Manrope'] text-[11px] text-gray-500 font-medium mb-1">
                        Target Delivery
                      </div>
                      <div className="font-['Marcellus'] text-xl font-bold text-red-600">
                        {estimatedTimeline}
                      </div>
                    </motion.div>
                    <motion.div
                      whileHover={{ y: -2 }}
                      className="p-4 rounded-xl bg-gray-50 border border-gray-200/80 transition-all"
                    >
                      <div className="font-['Manrope'] text-[11px] text-gray-500 font-medium mb-1">
                        Post-Launch Support
                      </div>
                      <div className="font-['Marcellus'] text-xl font-bold text-gray-900">
                        30 Days Included
                      </div>
                    </motion.div>
                  </div>

                  {/* Matched Case Study Card */}
                  <Link
                    href={`/casestudies/${activeGoal.caseStudy.slug}`}
                    className="block p-4 rounded-xl bg-gradient-to-br from-red-600/5 to-red-500/5 border border-red-600/20 hover:border-red-600 hover:-translate-y-0.5 transition-all group"
                  >
                    <div className="font-['Manrope'] text-[11px] font-bold uppercase tracking-wider text-red-600 mb-1">
                      Proven Case Study: {activeGoal.caseStudy.title}
                    </div>
                    <p className="font-['Manrope'] text-xs sm:text-sm text-gray-700 mb-2 leading-relaxed">
                      {activeGoal.caseStudy.metric}
                    </p>
                    <span className="inline-flex items-center gap-1.5 text-xs font-['Manrope'] font-bold text-gray-900 group-hover:text-red-600 transition-colors">
                      Inspect Full Case Study{" "}
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Link>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Signature WebMavien Pill Glowing Buttons */}
            <div className="space-y-3 pt-2">
              <Link
                href={`/contact?goal=${encodeURIComponent(
                  activeGoal.id
                )}&project=${encodeURIComponent(activeGoal.caseStudy.slug)}`}
                className="block w-full"
              >
                <GlowingButton
                  glowColor="200, 0, 0"
                  variant="primary"
                  spreadSize="small"
                  speed="medium"
                  waveCount={3}
                  className="w-full justify-center py-4 text-xs sm:text-sm"
                >
                  <span>Book Strategy Call With This Scope</span>
                  <ArrowRight className="w-4 h-4" />
                </GlowingButton>
              </Link>

              <a
                href={`https://wa.me/447424672943?text=${whatsappText}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full"
              >
                <GlowingButton
                  glowColor="0, 0, 0"
                  variant="secondary"
                  spreadSize="small"
                  speed="medium"
                  waveCount={2}
                  className="w-full justify-center py-3.5 text-xs sm:text-sm border border-gray-200 shadow-xs"
                >
                  <FaWhatsapp className="w-4 h-4 text-emerald-600" />
                  <span>Discuss Blueprint on WhatsApp</span>
                </GlowingButton>
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
