// app/contact/page.jsx
"use client";

import { motion } from "framer-motion";
import HeroSection from "@/components/HeroSection";
import { FiMail, FiClock, FiCheckCircle, FiShield, FiSend, FiLayers } from "react-icons/fi";
import { BsCalendarCheck } from "react-icons/bs";
import { FaWhatsapp } from "react-icons/fa";
import { useRef, useCallback, useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import CalendlyEmbed from "@/components/CalendlyEmbed";
import { caseStudies } from "@/data/caseStudies";

const GOAL_LABELS = {
  "ai-saas": "AI / SaaS MVP",
  marketplace: "Two-Sided Marketplace",
  ecommerce: "Custom E-Commerce Store",
  "business-platform": "Custom Web Platform / CRM",
};

function ContactQuerySync({ onSync }) {
  const searchParams = useSearchParams();
  const projectSlug = searchParams?.get("project") || "";
  const goalSlug = searchParams?.get("goal") || "";

  useEffect(() => {
    if (projectSlug || goalSlug) {
      onSync({ projectSlug, goalSlug });
    }
  }, [projectSlug, goalSlug, onSync]);

  return null;
}

export default function ContactPage() {
  const calendarRef = useRef(null);
  const [projectSlug, setProjectSlug] = useState("");
  const [goalSlug, setGoalSlug] = useState("");

  const matchedProject = caseStudies.find((s) => s.slug === projectSlug);
  const goalLabel = GOAL_LABELS[goalSlug] || "";

  const [contactMode, setContactMode] = useState("calendar"); // 'calendar' | 'brief'
  const [briefName, setBriefName] = useState("");
  const [briefEmail, setBriefEmail] = useState("");
  const [briefType, setBriefType] = useState("AI / SaaS MVP");
  const [briefTimeline, setBriefTimeline] = useState("21-Day Rapid Launch");
  const [briefNotes, setBriefNotes] = useState("");

  const handleQuerySync = useCallback(({ projectSlug: p, goalSlug: g }) => {
    setProjectSlug(p);
    setGoalSlug(g);
    const proj = caseStudies.find((s) => s.slug === p);
    const gLabel = GOAL_LABELS[g] || "";
    if (gLabel || proj) {
      setBriefType(gLabel || proj.category || "AI / SaaS MVP");
    }
    if (proj) {
      setBriefNotes(
        `Interested in building a platform similar to ${proj.title} (${proj.category}).`
      );
    }
  }, []);

  const scrollToCalendar = useCallback((e) => {
    e.preventDefault();
    if (calendarRef.current) {
      const yOffset = -80;
      const y =
        calendarRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  }, []);

  const buildBriefMessage = () => {
    return [
      `Hi WebMavien Team! Here is my quick project brief:`,
      `• Name: ${briefName || "Not provided"}`,
      `• Email: ${briefEmail || "Not provided"}`,
      `• Project Category: ${briefType}`,
      matchedProject ? `• Reference Case Study: ${matchedProject.title}` : null,
      `• Target Timeline: ${briefTimeline}`,
      `• Scope Summary: ${briefNotes || "Looking for technical guidance & 21-day roadmap."}`,
    ]
      .filter(Boolean)
      .join("\n");
  };

  const handleSendWhatsAppBrief = (e) => {
    e.preventDefault();
    const url = `https://wa.me/447424672943?text=${encodeURIComponent(
      buildBriefMessage()
    )}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleSendEmailBrief = () => {
    const subject = encodeURIComponent(
      `Project Inquiry: ${briefType}${matchedProject ? ` (Ref: ${matchedProject.title})` : ""}`
    );
    const body = encodeURIComponent(buildBriefMessage());
    window.location.href = `mailto:team@webmavien.com?subject=${subject}&body=${body}`;
  };

  return (
    <div className="min-h-screen bg-white">
      <Suspense fallback={null}>
        <ContactQuerySync onSync={handleQuerySync} />
      </Suspense>
      {/* Hero Section */}
      <HeroSection
        heading="Let's Build"
        headingAccent="Something Great"
        subheading="Book a free 30-minute discovery call—or send a 60-second project brief—to get a custom architecture roadmap and 21-day delivery plan."
        ctaText="Schedule a Call"
        ctaLink="#calendar"
        onCtaClick={scrollToCalendar}
        gradientFrom="from-black"
        gradientVia="via-red-600"
        gradientTo="to-black"
      />

      {/* What Happens Next + Money-Back Reassurance Strip */}
      <section className="py-10 bg-zinc-50 border-b border-gray-200/80 px-4">
        <div className="max-w-7xl mx-auto">
          {(matchedProject || goalLabel) && (
            <div className="mb-8 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-black via-zinc-900 to-red-950 text-white border border-red-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
              <div className="flex items-start sm:items-center gap-3">
                <span className="w-9 h-9 rounded-xl bg-red-600 flex items-center justify-center shrink-0">
                  <FiLayers className="w-4 h-4 text-white" />
                </span>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-red-400">
                    Tailored Strategy Session
                  </p>
                  <p className="font-['Manrope'] text-xs sm:text-sm text-zinc-100">
                    {matchedProject
                      ? `Scoping a build inspired by ${matchedProject.title} (${matchedProject.category}). We'll review architecture, 21-day milestones, and fixed pricing.`
                      : `Scoping your ${goalLabel} — we'll map out stack choice (React vs Bubble.io) and a clear 21-day launch plan.`}
                  </p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 shrink-0">
                <FiShield className="w-4 h-4" /> Money-Back Guarantee
              </span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {[
              {
                step: "01",
                title: "Honest Stack & Scope Review",
                desc: "We analyze your product goals and recommend whether custom React/Next.js or Bubble.io gives you the best ROI.",
              },
              {
                step: "02",
                title: "Clear 21-Day Milestone Plan",
                desc: "Walk away with a week-by-week blueprint covering UX wireframes, core integrations, QA, and launch.",
              },
              {
                step: "03",
                title: "Fixed Pricing + Zero Risk",
                desc: "Transparent scope and fixed investment before any commitment—backed by our full satisfaction guarantee.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="bg-white rounded-2xl p-5 border border-gray-200/90 shadow-xs flex items-start gap-3.5"
              >
                <span className="font-['Marcellus'] text-lg font-bold text-red-600 bg-red-50 w-9 h-9 rounded-xl flex items-center justify-center shrink-0">
                  {item.step}
                </span>
                <div>
                  <h3 className="font-['Marcellus'] text-base font-bold text-gray-900 mb-1">
                    {item.title}
                  </h3>
                  <p className="font-['Manrope'] text-xs text-gray-600 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Calendar / Async Brief Section */}
      <section id="calendar" ref={calendarRef} className="py-16 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="font-['Marcellus'] text-3xl md:text-4xl text-gray-900 mb-3">
              Choose How You Prefer to{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-black">
                Connect
              </span>
            </h2>
            <p className="font-['Manrope'] text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
              Pick an instant calendar slot below or send a 60-second project brief if you prefer async messaging first.
            </p>

            {/* Dual-Path Toggle */}
            <div className="inline-flex flex-wrap justify-center gap-2 bg-zinc-100 p-1.5 rounded-2xl border border-zinc-200 mt-6">
              <button
                type="button"
                onClick={() => setContactMode("calendar")}
                style={
                  contactMode === "calendar"
                    ? {
                        background:
                          "linear-gradient(135deg, #dc2626 0%, #000000 100%)",
                        color: "#ffffff",
                      }
                    : undefined
                }
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-['Manrope'] font-bold transition-all cursor-pointer ${
                  contactMode === "calendar"
                    ? "text-white shadow-md"
                    : "text-gray-700 hover:text-red-600"
                }`}
              >
                <BsCalendarCheck className="w-4 h-4" />
                <span>Book 30-Min Strategy Call</span>
              </button>

              <button
                type="button"
                onClick={() => setContactMode("brief")}
                style={
                  contactMode === "brief"
                    ? {
                        background:
                          "linear-gradient(135deg, #dc2626 0%, #000000 100%)",
                        color: "#ffffff",
                      }
                    : undefined
                }
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-['Manrope'] font-bold transition-all cursor-pointer ${
                  contactMode === "brief"
                    ? "text-white shadow-md"
                    : "text-gray-700 hover:text-red-600"
                }`}
              >
                <FiSend className="w-4 h-4" />
                <span>Send 60-Second Project Brief</span>
              </button>
            </div>
          </div>

          {contactMode === "calendar" ? (
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
              <div className="p-6 bg-gradient-to-r from-red-600 to-black">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-3">
                    <BsCalendarCheck className="w-6 h-6 text-white" />
                    <h3 className="font-['Marcellus'] text-xl text-white">
                      Select Your Preferred Time
                    </h3>
                  </div>
                  <span className="text-xs font-['Manrope'] font-semibold text-white/90 bg-white/15 px-3 py-1 rounded-full">
                    Free • Zero Obligation
                  </span>
                </div>
              </div>

              <CalendlyEmbed />
            </div>
          ) : (
            <form
              onSubmit={handleSendWhatsAppBrief}
              className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden"
            >
              <div className="p-6 bg-gradient-to-r from-black via-zinc-900 to-red-900 text-white">
                <h3 className="font-['Marcellus'] text-xl sm:text-2xl font-bold">
                  60-Second Project Scope Brief
                </h3>
                <p className="font-['Manrope'] text-xs sm:text-sm text-zinc-300 mt-1">
                  Share a few details and send directly via WhatsApp or Email for a fast technical response.
                </p>
              </div>

              <div className="p-6 sm:p-8 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-['Manrope'] text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Your Name
                    </label>
                    <input
                      type="text"
                      value={briefName}
                      onChange={(e) => setBriefName(e.target.value)}
                      placeholder="e.g. Alex Morgan"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-red-600"
                    />
                  </div>
                  <div>
                    <label className="block font-['Manrope'] text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Work Email
                    </label>
                    <input
                      type="email"
                      value={briefEmail}
                      onChange={(e) => setBriefEmail(e.target.value)}
                      placeholder="alex@company.com"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-red-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-['Manrope'] text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      What Are You Building?
                    </label>
                    <select
                      value={briefType}
                      onChange={(e) => setBriefType(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 bg-white focus:outline-none focus:border-red-600"
                    >
                      <option value="AI / SaaS MVP">AI / SaaS MVP</option>
                      <option value="Two-Sided Marketplace">Two-Sided Marketplace</option>
                      <option value="Custom E-Commerce Store">Custom E-Commerce Store</option>
                      <option value="Custom Web Platform / CRM">
                        Custom Web Platform / CRM
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-['Manrope'] text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Target Timeline
                    </label>
                    <select
                      value={briefTimeline}
                      onChange={(e) => setBriefTimeline(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 bg-white focus:outline-none focus:border-red-600"
                    >
                      <option value="21-Day Rapid Launch">
                        21-Day Rapid Launch (ASAP)
                      </option>
                      <option value="Within 4–6 Weeks">Within 4–6 Weeks</option>
                      <option value="Exploring Options / Roadmap">
                        Exploring Options / Roadmap
                      </option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-['Manrope'] text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Key Features or Goals
                  </label>
                  <textarea
                    rows={4}
                    value={briefNotes}
                    onChange={(e) => setBriefNotes(e.target.value)}
                    placeholder="Briefly describe your product idea, target users, or must-have features..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-red-600"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    type="submit"
                    className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-['Manrope'] font-bold text-sm transition-all cursor-pointer shadow-md"
                  >
                    <FaWhatsapp className="w-5 h-5" />
                    <span>Send Brief via WhatsApp</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSendEmailBrief}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-zinc-950 hover:bg-red-600 text-white font-['Manrope'] font-bold text-sm transition-all cursor-pointer shadow-md"
                  >
                    <FiMail className="w-4 h-4" />
                    <span>Send Brief via Email</span>
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Trust Badge */}
          <div className="mt-8 text-center">
            <p className="font-['Manrope'] text-sm text-gray-500 flex items-center justify-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span>Free consultation • 30-minute call • No obligation</span>
            </p>
            <a
              href="https://wa.me/447424672943"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-3 bg-white border border-gray-200 shadow-sm hover:shadow-md hover:border-green-400 transition-all duration-300 rounded-2xl px-5 py-3 group"
            >
              <span className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <FaWhatsapp className="w-4 h-4 text-white" />
              </span>
              <span className="font-['Manrope'] text-sm text-gray-600 group-hover:text-gray-800 transition-colors">
                Have a quick question?{" "}
                <span className="text-green-600 font-semibold">
                  Chat with us on WhatsApp →
                </span>
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="py-16 bg-zinc-50 border-t border-gray-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-['Marcellus'] text-3xl md:text-4xl text-gray-900 mb-4">
              Other Ways to{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-black">
                Connect
              </span>
            </h2>
            <p className="font-['Manrope'] text-gray-600 max-w-2xl mx-auto">
              Choose the channel that works best for you
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <ContactCard
              icon={<FiMail />}
              title="Email"
              text="team@webmavien.com"
              link="mailto:team@webmavien.com"
              delay={0.1}
            />

            <ContactCard
              icon={<FaWhatsapp className="w-5 h-5 text-red-600" />}
              title="WhatsApp"
              text="+44 7424 672943"
              link="https://wa.me/447424672943"
              delay={0.2}
            />

            <ContactCard
              icon={<FiClock />}
              title="Hours"
              text="Mon-Fri 9am-6pm"
              delay={0.3}
            />
          </div>
        </div>
      </section>
    </div>
  );
}

/* Contact Card Component */
function ContactCard({ icon, title, text, link, delay = 0 }) {
  const content = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      whileHover={{
        y: -5,
        boxShadow:
          "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      }}
      className="group bg-white p-6 rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
    >
      <div className="w-12 h-12 bg-gradient-to-br from-red-600/10 to-black/10 rounded-xl flex items-center justify-center mb-4 text-red-600 text-xl group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>

      <h3 className="font-['Marcellus'] text-lg font-bold mb-1 text-gray-900">
        {title}
      </h3>

      <p className="font-['Manrope'] text-gray-600 text-sm">{text}</p>

      {link && (
        <div className="mt-3 text-xs text-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          Click to{" "}
          {title === "Email"
            ? "send email"
            : title === "WhatsApp"
            ? "chat now"
            : "view hours"}{" "}
          →
        </div>
      )}
    </motion.div>
  );

  return link ? (
    <a href={link} className="block">
      {content}
    </a>
  ) : (
    content
  );
}
