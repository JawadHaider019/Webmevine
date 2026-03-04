// app/contact/page.jsx
"use client";

import { motion } from "framer-motion";
import HeroSection from "@/components/HeroSection";
import { FiMail, FiPhone, FiMapPin, FiClock, FiCheckCircle } from "react-icons/fi";
import { BsCalendarCheck } from "react-icons/bs";
import { useState, useRef, useCallback, useEffect } from "react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: ""
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isBrave, setIsBrave] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const calendarRef = useRef(null);

  // Detect Brave browser
  useEffect(() => {
    // @ts-ignore
    const isBraveBrowser = navigator.brave?.isBrave?.name === 'isBrave';
    setIsBrave(!!isBraveBrowser);
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
    setFormData({
      name: "",
      email: "",
      company: "",
      message: ""
    });
  };

  const scrollToCalendar = useCallback((e) => {
    e.preventDefault();
    if (calendarRef.current) {
      const yOffset = -80;
      const element = calendarRef.current;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({
        top: y,
        behavior: 'smooth'
      });
    }
  }, []);

  const handleIframeError = () => {
    setLoadError(true);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <HeroSection
        heading="Let's Build"
        headingAccent="Something Great"
        subheading="Book a free discovery call and let's discuss your vision over coffee (virtual or otherwise)"
        ctaText="Schedule a Call"
        ctaLink="#calendar"
        onCtaClick={scrollToCalendar}
        gradientFrom="from-black"
        gradientVia="via-red-600"
        gradientTo="to-black"
      />

      {/* Booking Calendar Section */}
      <section id="calendar" ref={calendarRef} className="py-20 bg-gray-50 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="font-['Marcellus'] text-3xl md:text-4xl text-gray-900 mb-4">
              Schedule Your Free <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-black">Discovery Call</span>
            </h2>
            <p className="font-['Manrope'] text-gray-600 max-w-2xl mx-auto">
              Pick a time that works for you. We'll discuss your project, answer your questions, and create a roadmap together.
            </p>
          </motion.div>

          <div className="grid grid-cols-1">
            {/* Calendar Embed */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden"
            >
              <div className="p-6 bg-gradient-to-r from-red-600 to-black">
                <div className="flex items-center gap-3">
                  <BsCalendarCheck className="w-6 h-6 text-white" />
                  <h3 className="font-['Marcellus'] text-xl text-white">Select Your Preferred Time</h3>
                </div>
              </div>
              
              {/* Error Message if iframe fails */}
              {loadError ? (
                <div className="p-8 text-center">
                  <div className="text-red-600 mb-4">
                    <p className="font-['Manrope'] text-lg mb-2">Unable to load calendar</p>
                    <p className="font-['Manrope'] text-sm text-gray-600">
                      Please try one of these options:
                    </p>
                  </div>
                  <div className="space-y-3">
                    <a 
                      href="https://calendly.com/codewithjerry0o0/30min" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-block bg-gradient-to-r from-red-600 to-black text-white font-['Manrope'] py-3 px-6 rounded-lg hover:shadow-lg transition-all"
                    >
                      Open Calendar in New Tab
                    </a>
                    {isBrave && (
                      <p className="font-['Manrope'] text-sm text-gray-500 mt-4">
                        💡 Tip: Try disabling Brave's Shields for this site or use another browser
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                /* Direct Iframe Embed with error handling */
                <div className="w-full bg-white">
                  <iframe 
                    src="https://calendly.com/codewithjerry0o0/30min?hide_gdpr_banner=1&primary_color=ff0000&embed_domain=localhost"
                    width="100%"
                    height="700px"
                    frameBorder="0"
                    title="Schedule a Discovery Call"
                    className="rounded-lg"
                    allow="camera; microphone; fullscreen; payment; autoplay"
                    onError={handleIframeError}
                    sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-downloads allow-modals"
                  />
                </div>
              )}
            </motion.div>
          </div>

          {/* Brave Browser Notice */}
          {isBrave && !loadError && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 text-center"
            >
              <p className="font-['Manrope'] text-sm text-gray-500">
                ⚡ If the calendar doesn't load, please disable Brave Shields for this site or click the brave icon in the address bar and turn off shields.
              </p>
            </motion.div>
          )}
        </div>
      </section>

      {/* Contact Info Section */}
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
              Other Ways to <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-black">Connect</span>
            </h2>
            <p className="font-['Manrope'] text-gray-600 max-w-2xl mx-auto">
              Choose the channel that works best for you. We're always here to help.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* Email Card */}
            <motion.a
              href="mailto:hello@ahmtech.com"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              whileHover={{ y: -5 }}
              className="group bg-white p-4 sm:p-6 lg:p-8 rounded-xl sm:rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-red-600/10 to-black/10 rounded-lg sm:rounded-xl flex items-center justify-center mb-2 sm:mb-3 lg:mb-4">
                <FiMail className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-red-600" />
              </div>
              <h3 className="font-['Marcellus'] text-sm sm:text-base lg:text-lg font-bold text-gray-900 mb-1 sm:mb-2">Email Us</h3>
              <p className="font-['Manrope'] text-gray-600 text-xs sm:text-sm mb-1 sm:mb-2 lg:mb-3 break-all">hello@ahmtech.com</p>
              <p className="font-['Manrope'] text-[10px] sm:text-xs text-gray-400">24-48h response</p>
            </motion.a>

            {/* Phone Card */}
            <motion.a
              href="tel:+1234567890"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              whileHover={{ y: -5 }}
              className="group bg-white p-4 sm:p-6 lg:p-8 rounded-xl sm:rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-red-600/10 to-black/10 rounded-lg sm:rounded-xl flex items-center justify-center mb-2 sm:mb-3 lg:mb-4">
                <FiPhone className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-red-600" />
              </div>
              <h3 className="font-['Marcellus'] text-sm sm:text-base lg:text-lg font-bold text-gray-900 mb-1 sm:mb-2">Call Us</h3>
              <p className="font-['Manrope'] text-gray-600 text-xs sm:text-sm mb-1 sm:mb-2 lg:mb-3">+1 (234) 567-890</p>
              <p className="font-['Manrope'] text-[10px] sm:text-xs text-gray-400">Mon-Fri, 9am-6pm</p>
            </motion.a>

            {/* Location Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              whileHover={{ y: -5 }}
              className="group bg-white p-4 sm:p-6 lg:p-8 rounded-xl sm:rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-red-600/10 to-black/10 rounded-lg sm:rounded-xl flex items-center justify-center mb-2 sm:mb-3 lg:mb-4">
                <FiMapPin className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-red-600" />
              </div>
              <h3 className="font-['Marcellus'] text-sm sm:text-base lg:text-lg font-bold text-gray-900 mb-1 sm:mb-2">Visit Us</h3>
              <p className="font-['Manrope'] text-gray-600 text-xs sm:text-sm mb-1 sm:mb-2 lg:mb-3">San Francisco, CA</p>
              <p className="font-['Manrope'] text-[10px] sm:text-xs text-gray-400">Virtual meetings available</p>
            </motion.div>

            {/* Hours Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              whileHover={{ y: -5 }}
              className="group bg-white p-4 sm:p-6 lg:p-8 rounded-xl sm:rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-red-600/10 to-black/10 rounded-lg sm:rounded-xl flex items-center justify-center mb-2 sm:mb-3 lg:mb-4">
                <FiClock className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-red-600" />
              </div>
              <h3 className="font-['Marcellus'] text-sm sm:text-base lg:text-lg font-bold text-gray-900 mb-1 sm:mb-2">Business Hours</h3>
              <p className="font-['Manrope'] text-gray-600 text-xs sm:text-sm mb-1 sm:mb-2 lg:mb-3">Mon-Fri: 9am-6pm</p>
              <p className="font-['Manrope'] text-[10px] sm:text-xs text-gray-400">Weekends: By appointment</p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}