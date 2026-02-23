"use client";

import { motion } from "framer-motion";
import HeroSection from "@/components/HeroSection";
import { FiMail, FiPhone, FiMapPin, FiClock, FiCheckCircle } from "react-icons/fi";
import { BsCalendarCheck } from "react-icons/bs";
import { LuSparkles } from "react-icons/lu";
import { useState } from "react";
import Link from "next/link";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: ""
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <HeroSection
        badge="✦ LET'S CONNECT ✦"
        heading="Let's Build"
        headingAccent="Something Great"
        subheading="Book a free discovery call and let's discuss your vision over coffee (virtual or otherwise)"
        ctaText="Schedule a Call"
        ctaLink="#calendar"
        gradientFrom="from-black"
        gradientVia="via-red-600"
        gradientTo="to-black"
      />

      {/* Booking Calendar Section */}
      <section id="calendar" className="py-20 bg-gray-50">
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Calendar Embed */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-2 bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden"
            >
              <div className="p-6 bg-gradient-to-r from-red-600 to-black">
                <div className="flex items-center gap-3">
                  <BsCalendarCheck className="w-6 h-6 text-white" />
                  <h3 className="font-['Marcellus'] text-xl text-white">Select Your Preferred Time</h3>
                </div>
              </div>
              
              {/* Calendar Embed Placeholder */}
              <div className="h-[500px] bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-red-600/10 to-black/10 rounded-full flex items-center justify-center">
                    <BsCalendarCheck className="w-8 h-8 text-red-600" />
                  </div>
                  <p className="font-['Manrope'] text-gray-500 mb-2">Calendar integration will appear here</p>
                  <p className="font-['Manrope'] text-sm text-gray-400">You can embed Calendly, Cal.com, or any booking tool</p>
                </div>
              </div>
            </motion.div>

            {/* Quick Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6"
            >
              <h3 className="font-['Marcellus'] text-xl text-gray-900 mb-6">
                Quick Message
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="font-['Manrope'] text-sm text-gray-600 block mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg font-['Manrope'] text-gray-900 focus:outline-none focus:border-red-600 transition-colors"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="font-['Manrope'] text-sm text-gray-600 block mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg font-['Manrope'] text-gray-900 focus:outline-none focus:border-red-600 transition-colors"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label className="font-['Manrope'] text-sm text-gray-600 block mb-2">
                    Company (Optional)
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg font-['Manrope'] text-gray-900 focus:outline-none focus:border-red-600 transition-colors"
                    placeholder="Your Startup"
                  />
                </div>

                <div>
                  <label className="font-['Manrope'] text-sm text-gray-600 block mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="4"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg font-['Manrope'] text-gray-900 focus:outline-none focus:border-red-600 transition-colors resize-none"
                    placeholder="Tell us about your project..."
                  />
                </div>

                <button
                  type="submit"
                  className="btn-primary w-full"
                >
                  Send Message
                </button>

                {/* Success Message */}
                {isSubmitted && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 text-green-600 text-sm font-['Manrope']"
                  >
                    <FiCheckCircle className="w-4 h-4" />
                    Message sent successfully!
                  </motion.div>
                )}
              </form>
            </motion.div>
          </div>
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Email Card */}
            <motion.a
              href="mailto:hello@ahmtech.com"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              whileHover={{ y: -5 }}
              className="group relative bg-white p-8 rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300"
              style={{ boxShadow: '0 10px 30px -15px rgba(220, 38, 38, 0)' }}
              onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 20px 40px -15px rgba(220, 38, 38, 0.3)'}
              onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 10px 30px -15px rgba(220, 38, 38, 0)'}
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600/0 to-black/0 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-red-600/10 to-black/10 rounded-xl flex items-center justify-center mb-4">
                  <FiMail className="w-7 h-7 text-red-600" />
                </div>
                <h3 className="font-['Marcellus'] text-lg font-bold text-gray-900 mb-2">Email Us</h3>
                <p className="font-['Manrope'] text-gray-600 text-sm mb-3">hello@ahmtech.com</p>
                <p className="font-['Manrope'] text-xs text-gray-400">24-48h response time</p>
              </div>
            </motion.a>

            {/* Phone Card */}
            <motion.a
              href="tel:+1234567890"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              whileHover={{ y: -5 }}
              className="group relative bg-white p-8 rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300"
              style={{ boxShadow: '0 10px 30px -15px rgba(220, 38, 38, 0)' }}
              onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 20px 40px -15px rgba(220, 38, 38, 0.3)'}
              onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 10px 30px -15px rgba(220, 38, 38, 0)'}
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600/0 to-black/0 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-red-600/10 to-black/10 rounded-xl flex items-center justify-center mb-4">
                  <FiPhone className="w-7 h-7 text-red-600" />
                </div>
                <h3 className="font-['Marcellus'] text-lg font-bold text-gray-900 mb-2">Call Us</h3>
                <p className="font-['Manrope'] text-gray-600 text-sm mb-3">+1 (234) 567-890</p>
                <p className="font-['Manrope'] text-xs text-gray-400">Mon-Fri, 9am-6pm EST</p>
              </div>
            </motion.a>

            {/* Location Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              whileHover={{ y: -5 }}
              className="group relative bg-white p-8 rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300"
              style={{ boxShadow: '0 10px 30px -15px rgba(220, 38, 38, 0)' }}
              onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 20px 40px -15px rgba(220, 38, 38, 0.3)'}
              onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 10px 30px -15px rgba(220, 38, 38, 0)'}
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600/0 to-black/0 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-red-600/10 to-black/10 rounded-xl flex items-center justify-center mb-4">
                  <FiMapPin className="w-7 h-7 text-red-600" />
                </div>
                <h3 className="font-['Marcellus'] text-lg font-bold text-gray-900 mb-2">Visit Us</h3>
                <p className="font-['Manrope'] text-gray-600 text-sm mb-3">San Francisco, CA</p>
                <p className="font-['Manrope'] text-xs text-gray-400">Virtual meetings available</p>
              </div>
            </motion.div>

            {/* Hours Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              whileHover={{ y: -5 }}
              className="group relative bg-white p-8 rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300"
              style={{ boxShadow: '0 10px 30px -15px rgba(220, 38, 38, 0)' }}
              onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 20px 40px -15px rgba(220, 38, 38, 0.3)'}
              onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 10px 30px -15px rgba(220, 38, 38, 0)'}
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600/0 to-black/0 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-red-600/10 to-black/10 rounded-xl flex items-center justify-center mb-4">
                  <FiClock className="w-7 h-7 text-red-600" />
                </div>
                <h3 className="font-['Marcellus'] text-lg font-bold text-gray-900 mb-2">Business Hours</h3>
                <p className="font-['Manrope'] text-gray-600 text-sm mb-3">Mon-Fri: 9am - 6pm</p>
                <p className="font-['Manrope'] text-xs text-gray-400">Weekends: By appointment</p>
              </div>
            </motion.div>
          </div>

          {/* Map or Additional Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="mt-12 p-8 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-200"
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-red-600/10 to-black/10 rounded-full flex items-center justify-center">
                  <LuSparkles className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h4 className="font-['Marcellus'] text-lg font-bold text-gray-900">Prefer to chat first?</h4>
                  <p className="font-['Manrope'] text-gray-600">Book a discovery call above or send us a message</p>
                </div>
              </div>
              <Link href="#calendar">
                <button className="btn-primary">
                  Schedule a Call
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Bottom Decorative Line */}
      <div className="text-center pb-8">
        <p className="font-['Manrope'] text-xs text-gray-400">
          ✦ We typically respond within 24 hours ✦
        </p>
      </div>
    </div>
  );
}