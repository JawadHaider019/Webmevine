"use client";

import React, { useState } from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import HeroSection from "@/components/HeroSection";
import Partners from "@/components/Partners";
import Testimonials from "@/components/Testimonials";
import GlowingButton from "@/components/GlowingButton";

const SERVICES = [
  {
    title: "AI-Powered MVP Development",
    description: [
      "Launch your MVP in as little as 21 days using cutting-edge AI tools and low-code platforms.",
      "We combine the speed of no-code with the flexibility of custom development to get you to market faster.",
      "Perfect for founders who need to validate their idea without months of development time."
    ]
  },
  {
    title: "Full-Stack Web Applications",
    description: [
      "Custom web applications built with modern frameworks like React, Next.js, and Node.js.",
      "Scalable architecture that grows with your user base and business needs.",
      "Responsive design that works flawlessly across all devices."
    ]
  },

  {
    title: "AI Integration & Automation",
    description: [
      "Integrate powerful AI features into your existing or new applications.",
      "Automate workflows, generate content, analyze data, and enhance user experiences.",
      "Custom AI solutions tailored to your specific business needs."
    ]
  },
  {
    title: "UI/UX Design & Prototyping",
    description: [
      "Beautiful, intuitive designs that users love to interact with.",
      "Rapid prototyping in Figma to visualize your idea before development.",
      "User-centered design approach focused on conversion and engagement."
    ]
  },
  {
    title: "Business Process Automation",
    description: [
      "Streamline your operations with custom automation solutions.",
      "Reduce manual work, eliminate errors, and save thousands of hours.",
      "Integrate with your existing tools and workflows seamlessly."
    ]
  },
  {
    title: "Payment & Wallet Integration",
    description: [
      "Secure payment processing with Stripe, PayPal, and local payment methods.",
      "Digital wallet systems for escrow-protected transactions.",
      "Multi-currency support and automated payout systems."
    ]
  },
  {
    title: "Real-Time Features & Notifications",
    description: [
      "Live chat, real-time updates, and instant notifications using WebSockets.",
      "Keep your users engaged with timely alerts and messages.",
      "Scalable infrastructure for thousands of concurrent connections."
    ]
  },
  {
    title: "Analytics & Dashboard Solutions",
    description: [
      "Custom admin dashboards with real-time metrics and insights.",
      "Track user behavior, conversion rates, and business KPIs.",
      "Beautiful data visualization that helps you make informed decisions."
    ]
  },
  {
    title: "Founder Consultation & Strategy",
    description: [
      "Not sure where to start? We'll help you define your vision and create a roadmap.",
      "Technical guidance without the jargon — we speak founder language.",
      "Ongoing support and advice as you scale your business."
    ]
  },
  {
    title: "Maintenance & Support",
    description: [
      "We don't disappear after launch. Get 30 days of free support included.",
      "Flexible maintenance packages for ongoing updates and improvements.",
      "24/7 monitoring and quick response times for critical issues."
    ]
  }
];


export default function ServicesPage() {
  const [expanded, setExpanded] = useState(0); // First item open by default

  // Toggle function - closes if clicked again, opens if clicked different
  const toggleExpand = (idx) => {
    setExpanded(expanded === idx ? null : idx);
  };

  // Animation variants
  const descriptionVariants = {
    hidden: { 
      height: 0,
      opacity: 0,
      transition: {
        height: { duration: 0.3, ease: "easeInOut" },
        opacity: { duration: 0.2, ease: "easeInOut" }
      }
    },
    visible: { 
      height: "auto",
      opacity: 1,
      transition: {
        height: { duration: 0.4, ease: "easeInOut" },
        opacity: { duration: 0.3, delay: 0.1, ease: "easeInOut" }
      }
    }
  };

  const arrowVariants = {
    open: { rotate: 180 },
    closed: { rotate: 0 }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <HeroSection
        badge="✦ OUR SERVICES ✦"
        heading="We Build"
        headingAccent="Solutions"
        subheading="From AI-powered MVPs to full-scale platforms — we turn your vision into reality"
        ctaText="Start Your Project"
        ctaLink="/contact"
        gradientFrom="from-black"
        gradientVia="via-red-700"
        gradientTo="to-black"
      />

      {/* Services Section */}
      <section className="w-full bg-white py-24 px-6 md:px-20">
        {/* Top Header: Split layout */}
        <div className="flex flex-col md:flex-row justify-between items-center px-6 py-12 text-gray-900 max-w-7xl mx-auto">
          <h1 className="font-['Marcellus'] text-6xl md:text-7xl lg:text-8xl font-bold uppercase bg-clip-text text-transparent bg-gradient-to-r from-black via-red-600  to-black leading-none text-left mt-8 md:mt-0">
            WHAT <br />WE <br />
              BUILD
          </h1>
          <p className="font-['Manrope'] text-base md:text-lg text-gray-600 tracking-wide max-w-md">
            Every service is designed with one goal: getting you to market faster with a product you're proud of. From AI-powered MVPs to full-scale platforms.
          </p>
        </div>

        {/* Service List */}
        <div className="max-w-6xl mx-auto rounded-2xl border border-gray-200 bg-white shadow-xl overflow-hidden divide-y divide-gray-100">
          {SERVICES.map((service, idx) => {
            const isOpen = expanded === idx;
            return (
              <motion.div
                key={idx}
                className={`group flex flex-col md:flex-row items-start md:items-center px-6 md:px-12 py-8 md:py-10 transition-colors duration-300 cursor-pointer ${
                  isOpen ? "bg-gradient-to-r from-red-50/50 to-red-50/50" : "hover:bg-gray-50"
                }`}
                onClick={() => toggleExpand(idx)}
                layout
                transition={{ layout: { duration: 0.3, ease: "easeInOut" } }}
              >
                {/* Left: Number */}
                <div className="flex flex-col items-start justify-start md:w-1/6 w-full text-left">
                  <motion.span 
                    className={`font-['Marcellus'] text-5xl font-bold tracking-widest transition-colors duration-300 ${
                      isOpen ? "text-red-600" : "text-gray-300"
                    }`}
                    layout="position"
                  >
                    {String(idx + 1).padStart(2, "0")}
                  </motion.span>
                </div>

                {/* Center: Title */}
                <div className="flex flex-col justify-center md:w-1/3 w-full pl-0 md:pl-4 md:pr-8 min-h-[60px]">
                  <motion.span 
                    className={`font-['Marcellus'] text-xl md:text-2xl font-bold uppercase tracking-tight w-full transition-colors duration-300 ${
                      isOpen ? "text-red-600" : "text-gray-900"
                    }`}
                    layout="position"
                  >
                    {service.title}
                  </motion.span>
                </div>

                {/* Right: Arrow & Description */}
                <div className="flex flex-col items-end justify-center md:w-1/2 w-full mt-4 md:mt-0">
                  <div className="flex flex-col items-end w-full">
                    {/* Arrow with rotation animation */}
                    <motion.div
                      variants={arrowVariants}
                      animate={isOpen ? "open" : "closed"}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="mb-2"
                    >
                      {isOpen ? (
                        <ArrowUpRight className={`w-8 h-8 transition-colors duration-300 ${
                          isOpen ? "text-red-600" : "text-gray-400"
                        }`} />
                      ) : (
                        <ArrowDownRight className={`w-8 h-8 transition-colors duration-300 ${
                          isOpen ? "text-red-600" : "text-gray-400"
                        }`} />
                      )}
                    </motion.div>

                    {/* Description with smooth height animation */}
                    <AnimatePresence mode="wait">
                      {isOpen && (
                        <motion.div
                          variants={descriptionVariants}
                          initial="hidden"
                          animate="visible"
                          exit="hidden"
                          className="w-full overflow-hidden"
                        >
                          <div className="flex flex-col gap-2 mt-4">
                            {service.description.map((desc, i) => (
                              <motion.p
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ 
                                  duration: 0.3, 
                                  delay: 0.1 + (i * 0.05),
                                  ease: "easeOut"
                                }}
                                className="font-['Manrope'] text-gray-600 text-base leading-relaxed text-right"
                              >
                                {desc}
                              </motion.p>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="font-['Manrope'] text-gray-500 mb-6">
            Not sure which service you need? Let's talk about your project.
          </p>
         <GlowingButton 
    glowColor="200, 0, 0"
    spreadSize="small"
    speed="medium"
     waveCount={3} 
  >
    Book Your Free Strategy Call
  </GlowingButton>
        </div>
      </section>
      
          <Partners/>
          <Testimonials/>
    </div>
  );
}