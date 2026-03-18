"use client";

import { motion, useAnimation } from "framer-motion";
import { useState } from "react";
import SectionHeader from "./SectionHeader";
import GlowingButton from "./GlowingButton";
import Link from "next/link"; 

// Font Awesome imports
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRocket,
  faShieldHalved,
  faCode,
  faChartLine,
  faComments,
  faHeadset,
} from "@fortawesome/free-solid-svg-icons";

export default function Whyus() {
  const [hoveredCard, setHoveredCard] = useState(null);

  // Font Awesome icons
  const RocketIcon = ({ className = "w-6 h-6 text-red-600" }) => (
    <FontAwesomeIcon icon={faRocket} className={className} />
  );

  const ShieldIcon = ({ className = "w-6 h-6 text-red-600" }) => (
    <FontAwesomeIcon icon={faShieldHalved} className={className} />
  );

  const CodeIcon = ({ className = "w-6 h-6 text-red-600" }) => (
    <FontAwesomeIcon icon={faCode} className={className} />
  );

  const ChartIcon = ({ className = "w-6 h-6 text-red-600" }) => (
    <FontAwesomeIcon icon={faChartLine} className={className} />
  );

  const ConsultationIcon = ({ className = "w-6 h-6 text-red-600" }) => (
    <FontAwesomeIcon icon={faComments} className={className} />
  );

  const SupportIcon = ({ className = "w-6 h-6 text-red-600" }) => (
    <FontAwesomeIcon icon={faHeadset} className={className} />
  );

  const features = [
    {
      id: 1,
      title: "Launch in Just 21 Days",
      description: "No 3–6 month delays. We design, develop, and deploy your custom website. Clear roadmap. Defined milestones. 21-day delivery.",
      icon: RocketIcon,
      highlight: "Rapid Launch"
    },
    {
      id: 2,
      title: "Zero-Risk Guarantee",
      description: "Confidence changes everything. If you're not satisfied, you get your money back. We remove the risk so you can move forward with certainty.",
      icon: ShieldIcon,
      highlight: "Risk-Free"
    },
    {
      id: 3,
      title: "Built by Experts in React & Bubble.io",
      description: "Every E-com website is custom-coded in React JS or built strategically in Bubble.io for scalable SAAS. No Templates. No Shortcuts.",
      icon: CodeIcon,
      highlight: "Expert Built"
    },
    {
      id: 4,
      title: "E-Commerce & SaaS Specialists",
      description: "From custom e-commerce platforms to SaaS MVPs, we understand conversion psychology and performance optimization. We engineer buying decisions.",
      icon: ChartIcon,
      highlight: "Revenue Focused"
    },
    {
      id: 5,
      title: "Strategic Consultation",
      description: "Before you invest, we align on business goals, revenue model, customer psychology, and growth roadmap. This isn't order-taking—it's a strategic partnership.",
      icon: ConsultationIcon,
      highlight: "Real Strategy"
    },
    {
      id: 6,
      title: "Ongoing Support",
      description: "We don't disappear after launch. You get continued support from real experts who care about your long-term success.",
      icon: SupportIcon,
      highlight: "Always There"
    }
  ];

  return (
    <section className="py-16 relative overflow-hidden bg-white" id="whyus">
      {/* Explicit white background for the entire section */}
      <div className="absolute inset-0 bg-white" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with fade-in animation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <SectionHeader
            heading="Why High-Growth Founders Choose Us"
            description="Your Strategic Partner for Digital Excellence"
            gradientHeading={true}
            gradientFrom="from-black"
            gradientVia="via-red-600"
            gradientTo="to-gray-900"
          />
        </motion.div>
        
        {/* Features Grid - 6 Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            const isHovered = hoveredCard === feature.id;
            
            return (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                onHoverStart={() => setHoveredCard(feature.id)}
                onHoverEnd={() => setHoveredCard(null)}
                className="group relative cursor-pointer"
              >
                {/* Glow effect on hover */}
                <motion.div 
                  className="absolute -inset-0.5 bg-gradient-to-r from-red-600/20 to-red-300/30 rounded-2xl blur"
                  animate={{ 
                    opacity: isHovered ? 1 : 0
                  }}
                  transition={{ duration: 0.3 }}
                />
                
                {/* Card - with explicit white background */}
                <motion.div 
                  className="relative bg-white p-6 rounded-xl border shadow-sm border-gray-200/30 h-full flex flex-col"
                  style={{ backgroundColor: '#ffffff' }} // Explicit white background
                  animate={{ 
                    borderColor: isHovered ? '#ef4444' : '#e5e7eb',
                    y: isHovered ? -4 : 0,
                    boxShadow: isHovered ? '0 10px 25px -5px rgba(239, 68, 68, 0.1), 0 8px 10px -6px rgba(239, 68, 68, 0.1)' : '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
                  }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Icon with background */}
                  <motion.div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                    style={{ backgroundColor: isHovered ? '#ef4444' : '#fee2e2' }}
                    animate={{ 
                      scale: isHovered ? 1.1 : 1,
                    }}
                  >
                    <IconComponent className={`w-6 h-6 ${isHovered ? 'text-white' : 'text-red-600'}`} />
                  </motion.div>

                  {/* Highlight/Subtitle - Manrope font */}
                  <motion.p 
                    className="font-['Manrope'] text-red-600 text-xs font-semibold uppercase tracking-wider mb-2"
                    animate={{ 
                      x: isHovered ? 5 : 0
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    {feature.highlight}
                  </motion.p>

                  {/* Title - Marcellus font */}
                  <h3 className="font-['Marcellus'] text-lg font-bold text-gray-900 mb-3 leading-tight">
                    {feature.title}
                  </h3>

                  {/* Description - Manrope font */}
                  <div className="relative flex-grow">
                    <p className="font-['Manrope'] text-gray-600 text-sm leading-relaxed z-10">
                      {feature.description}
                    </p>
                  </div>

                  {/* Animated Number Background - Marcellus font */}
                  <motion.div 
                    className="font-['Marcellus'] absolute bottom-3 right-4 text-5xl font-black text-gray-300 select-none z-0"
                    animate={{ 
                      scale: isHovered ? 1.1 : 1,
                      opacity: isHovered ? 0.4 : 0.2,
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    {(index + 1).toString().padStart(2, '0')}
                  </motion.div>

                  {/* Bottom accent line on hover */}
                  <motion.div
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] bg-gradient-to-r from-red-600 to-red-700"
                    animate={{ 
                      width: isHovered ? '50%' : 0
                    }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
             <Link href="/contact"> 
              <GlowingButton 
                glowColor="255, 255, 255"
                spreadSize="small"
                speed="medium"
                waveCount={3}
              >
             Talk to an Expert
              </GlowingButton>
            </Link>
        </motion.div>
      </div>
    </section>
  );
}