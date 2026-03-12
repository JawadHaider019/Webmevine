"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import SectionHeader from "./SectionHeader";

export default function FAQ() {
  const [openItems, setOpenItems] = useState([1]); // First item open by default

  const faqItems = [
  {
    id: 1,
    question: "How does the 21-day website development process work?",
    answer: "Our 21-day framework is structured and milestone-driven. Week 1 focuses on strategy and conversion architecture. Week 2 covers UX design and wireframes. Week 3 is dedicated to custom React or Bubble.io development. Week 4 includes QA testing, performance optimization, and launch. No delays. No guesswork."
  },
  {
    id: 2,
    question: "Do you build custom-coded websites or use templates?",
    answer: "We specialize in custom website development. Every project is either custom-coded in React JS with scalable architecture or strategically built in Bubble.io for SaaS MVPs. No templates. No shortcuts."
  },
  {
    id: 3,
    question: "Are you a React JS development company or a Bubble.io agency?",
    answer: "We are both. WebMavine is a React JS development company and a Bubble.io development agency. We choose the right technology based on your business model, scalability needs, and growth roadmap."
  },
  {
    id: 4,
    question: "Do you build SaaS and e-commerce platforms?",
    answer: "Yes. We specialize in SaaS website development and high-performance e-commerce website development. From MVP validation to scalable revenue-driven platforms, we build for growth and conversions."
  },
  {
    id: 5,
    question: "What if I'm not satisfied with the final result?",
    answer: "We operate with a zero-risk guarantee. If you're not satisfied after project completion, you get your money back. We remove hesitation so you can move forward with confidence."
  },
  {
    id: 6,
    question: "How much does a custom website cost?",
    answer: "Pricing depends on scope, complexity, and integrations. Most custom-coded websites and SaaS MVPs start at premium-tier pricing due to performance, scalability, and strategy focus. We discuss exact investment during your strategy call."
  },
  {
    id: 7,
    question: "Do you offer support after launch?",
    answer: "Yes. We provide post-launch support, optimization, and performance monitoring. We don’t disappear after deployment. We build long-term partnerships."
  },
  {
    id: 8,
    question: "Is WebMavine a good fit for small businesses?",
    answer: "We work with serious small businesses, SaaS founders, and e-commerce brands focused on long-term growth. If you're looking for the cheapest option, we’re not the right fit. If you're building for scale, we are."
  }
];

  // Toggle FAQ item
  const toggleItem = (id) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(itemId => itemId !== id)
        : [...prev, id]
    );
  };

  return (
    <section className="py-16 bg-gradient-to-b from-white via-gray-50 to-white relative overflow-hidden" id="faq">
      {/* Luxury Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-0 w-96 h-96 bg-gradient-to-l from-red-600/5 via-amber-200/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-0 w-96 h-96 bg-gradient-to-r from-red-600/5 via-amber-200/5 to-transparent rounded-full blur-3xl" />
        
        {/* Subtle pattern */}
        <div className="absolute inset-0 opacity-[0.02]" 
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #000 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <SectionHeader
            smallHeading="Got Questions?"
            heading="Frequently Asked Questions"
            description="Everything you need to know about working with us"
            gradientHeading={true}
            gradientFrom="from-black"
            gradientVia="via-red-600"
            gradientTo="to-gray-900"
            smallHeadingColor="text-red-600"
            descriptionColor="text-gray-600"
          />
        </motion.div>

        {/* FAQ Items */}
        <motion.div 
          className="mt-12 space-y-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          {faqItems.map((item, index) => {
            const isOpen = openItems.includes(item.id);
            
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative group"
              >
                {/* Glow effect on hover */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600/10 via-amber-400/10 to-red-600/10 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* FAQ Card */}
                <div className="relative bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
                  
                  {/* Question Button */}
                  <button
                    onClick={() => toggleItem(item.id)}
                    className="w-full text-left p-6 pr-12 focus:outline-none"
                  >
                    <div className="flex items-center justify-between">
                      {/* Question with number */}
                      <div className="flex items-center gap-4">
                        <span className="font-['Marcellus'] text-sm text-red-600/50 font-bold">
                          {(index + 1).toString().padStart(2, '0')}
                        </span>
                        <h3 className="font-['Marcellus'] text-lg text-gray-900">
                          {item.question}
                        </h3>
                      </div>

                      {/* Plus/Minus Icon */}
                      <motion.div
                        animate={{ rotate: isOpen ? 45 : 0 }}
                        transition={{ duration: 0.3 }}
                        className="w-8 h-8 rounded-full bg-red-600/10 flex items-center justify-center flex-shrink-0"
                      >
                        <svg 
                          className="w-5 h-5 text-red-600" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </motion.div>
                    </div>
                  </button>

                  {/* Answer */}
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="p-6 pt-0 border-t border-gray-100">
                          <div className="flex gap-4">
                            {/* Decorative line */}
                            <motion.div 
                              initial={{ scaleY: 0 }}
                              animate={{ scaleY: 1 }}
                              transition={{ delay: 0.2 }}
                              className="w-1 bg-gradient-to-b from-red-600 to-red-400 rounded-full origin-top"
                            />
                            
                            {/* Answer text */}
                            <p className="font-['Manrope'] text-gray-600 leading-relaxed">
                              {item.answer}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

      </div>
    </section>
  );
}