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
            <a
              href="https://wa.me/447424672943"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-3 bg-white border border-gray-200 shadow-sm hover:shadow-md hover:border-green-400 transition-all duration-300 rounded-2xl px-5 py-3 group"
            >
              {/* WhatsApp Icon */}
              <span className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </span>
              <span className="font-['Manrope'] text-sm text-gray-600 group-hover:text-gray-800 transition-colors">
                Have a quick question?{" "}
                <span className="text-green-600 font-semibold">Chat with us on WhatsApp →</span>
              </span>
            </a>
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
              icon={<svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>}
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
          Click to {title === 'Email' ? 'send email' : title === 'WhatsApp' ? 'chat now' : 'view hours'} →
        </div>
      )}
    </motion.div>
  );

  return link ? <a href={link} className="block">{content}</a> : content;
}