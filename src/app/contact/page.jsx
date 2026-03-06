// app/contact/page.jsx
"use client";

import { motion } from "framer-motion";
import HeroSection from "@/components/HeroSection";
import { FiMail, FiPhone, FiMapPin, FiClock } from "react-icons/fi";
import { BsCalendarCheck } from "react-icons/bs";
import { useRef, useCallback } from "react";
import CalendlyEmbed from "@/components/CalendlyEmbed";

export default function ContactPage() {
  const calendarRef = useRef(null);

  const scrollToCalendar = useCallback((e) => {
    e.preventDefault();

    if (calendarRef.current) {
      const yOffset = -80;
      const y = calendarRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;

      window.scrollTo({
        top: y,
        behavior: "smooth"
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <HeroSection
        heading="Let's Build"
        headingAccent="Something Great"
        subheading="Book a free discovery call and let's discuss your vision."
        ctaText="Schedule a Call"
        ctaLink="#calendar"
        onCtaClick={scrollToCalendar}
        gradientFrom="from-black"
        gradientVia="via-red-600"
        gradientTo="to-black"
      />

      {/* Calendar Section */}
      <section
        id="calendar"
        ref={calendarRef}
        className="py-16 scroll-mt-24"
      >
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="font-['Marcellus'] text-3xl md:text-4xl text-gray-900 mb-4">
              Schedule Your Free{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-black">
                Discovery Call
              </span>
            </h2>

            <p className="font-['Manrope'] text-gray-600 max-w-2xl mx-auto">
              Pick a time that works for you and let's discuss your project.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden"
          >
            <div className="p-6 bg-gradient-to-r from-red-600 to-black">
              <div className="flex items-center gap-3">
                <BsCalendarCheck className="w-6 h-6 text-white" />
                <h3 className="font-['Marcellus'] text-xl text-white">
                  Select Your Preferred Time
                </h3>
              </div>
            </div>

              <CalendlyEmbed />
          
          </motion.div>

          {/* Trust Badge */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 text-center"
          >
            <p className="font-['Manrope'] text-sm text-gray-500 flex items-center justify-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span>Free consultation • 30-minute call • No obligation</span>
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="font-['Marcellus'] text-3xl md:text-4xl text-gray-900 mb-4">
              Other Ways to{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-black">
                Connect
              </span>
            </h2>
            <p className="font-['Manrope'] text-gray-600 max-w-2xl mx-auto">
              Choose the channel that works best for you
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <ContactCard
              icon={<FiMail />}
              title="Email"
              text="team@webmavein.com"
              link="mailto:team@webmavein.com"
              delay={0.1}
            />

            <ContactCard
              icon={<FiPhone />}
              title="Call"
              text="+44 7424 672943"
              link="tel:+447424672943"
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
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
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
          Click to {title === 'Email' ? 'send email' : title === 'Call' ? 'call now' : 'view hours'} →
        </div>
      )}
    </motion.div>
  );

  return link ? <a href={link} className="block">{content}</a> : content;
}