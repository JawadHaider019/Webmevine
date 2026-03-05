"use client";

import { motion } from "framer-motion";
import HeroSection from "@/components/HeroSection";
import { FiMail, FiPhone, FiMapPin, FiClock } from "react-icons/fi";
import { BsCalendarCheck } from "react-icons/bs";
import { useState, useRef, useCallback, useEffect } from "react";
import CalendlyEmbed from "@/components/CalendlyEmbed";

export default function ContactPage() {

  const calendarRef = useRef(null);


  const scrollToCalendar = useCallback((e) => {
    e.preventDefault();

    if (calendarRef.current) {
      const yOffset = -80;

      const y =
        calendarRef.current.getBoundingClientRect().top +
        window.pageYOffset +
        yOffset;

      window.scrollTo({
        top: y,
        behavior: "smooth"
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-white">

   
      {/* Hero */}
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
        className="py-20 bg-gray-50 scroll-mt-24"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

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

          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">

            <div className="p-6 bg-gradient-to-r from-red-600 to-black">
              <div className="flex items-center gap-3">
                <BsCalendarCheck className="w-6 h-6 text-white" />
                <h3 className="font-['Marcellus'] text-xl text-white">
                  Select Your Preferred Time
                </h3>
              </div>
            </div>

            <CalendlyEmbed />

          </div>

       

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
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">

            <ContactCard
              icon={<FiMail />}
              title="Email"
              text="hello@webmavein.com"
              link="mailto:hello@webmavein.com"
            />

            <ContactCard
              icon={<FiPhone />}
              title="Call"
              text="+1 (234) 567-890"
              link="tel:+1234567890"
            />

            <ContactCard
              icon={<FiMapPin />}
              title="Location"
              text="San Francisco"
            />

            <ContactCard
              icon={<FiClock />}
              title="Hours"
              text="Mon-Fri 9am-6pm"
            />

          </div>

        </div>
      </section>
    </div>
  );
}

/* ===============================
   Contact Card Component
=============================== */

function ContactCard({ icon, title, text, link }) {
  const content = (
    <div className="group bg-white p-6 rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition">

      <div className="w-12 h-12 bg-gradient-to-br from-red-600/10 to-black/10 rounded-xl flex items-center justify-center mb-4 text-red-600 text-xl">
        {icon}
      </div>

      <h3 className="font-['Marcellus'] text-lg font-bold mb-1">
        {title}
      </h3>

      <p className="text-gray-600 text-sm">{text}</p>

    </div>
  );

  return link ? <a href={link}>{content}</a> : content;
}