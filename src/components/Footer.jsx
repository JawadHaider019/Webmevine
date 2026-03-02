"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { 
  FiLinkedin, 
  FiInstagram, 
  FiMail,
  FiMapPin,
  FiPhone,
  FiArrowRight
} from "react-icons/fi";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { name: "How It Works", href: "/how-it-works" },
      { name: "Case Studies", href: "/case-studies" },
      { name: "Pricing", href: "/pricing" },
      { name: "FAQ", href: "/faq" }
    ],
    company: [
      { name: "About", href: "/about" },
      { name: "Services", href: "/services" },
      { name: "Process", href: "/process" },
      { name: "Contact", href: "/contact" }
    ],
    legal: [
      { name: "Privacy", href: "/privacy" },
      { name: "Terms", href: "/terms" },
      { name: "Cookies", href: "/cookies" }
    ]
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  const linkVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.05,
        type: "spring",
        stiffness: 200,
        damping: 15
      }
    }),
    hover: {
      x: 5,
      color: "#dc2626",
      transition: { duration: 0.2 }
    }
  };

  const socialVariants = {
    hidden: { scale: 0,},
    visible: (i) => ({
      scale: 1,
      transition: {
        delay: 0.3 + i * 0.1,
        type: "spring",
        stiffness: 200,
        damping: 15
      }
    }),
    hover: { 
      y: -5, 
      scale: 1.1,
      transition: { 
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    }
  };

  const backgroundOrbVariants = {
    animate: {
      scale: [1, 1.2, 1],
      opacity: [0.3, 0.5, 0.3],
      x: [0, 20, 0],
      y: [0, -20, 0],
      transition: {
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.footer 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8 }}
      className="relative bg-white border-t border-gray-100 overflow-hidden"
    >
      {/* Animated Premium Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div 
          variants={backgroundOrbVariants}
          animate="animate"
          className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-red-50 to-transparent rounded-full blur-3xl opacity-60"
        />
        <motion.div 
          variants={backgroundOrbVariants}
          animate="animate"
          custom={1}
          className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-amber-50 to-transparent rounded-full blur-3xl opacity-60"
          style={{ animationDelay: "2s" }}
        />
      </div>

      {/* Main Footer */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8"
      >
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
          {/* Brand Column */}
          <motion.div variants={itemVariants} className="md:col-span-4">
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Link href="/" className="inline-block mb-4 group">
                <motion.span 
                  initial={{ backgroundPosition: "0% 50%" }}
                  whileHover={{ backgroundPosition: "100% 50%" }}
                  transition={{ duration: 0.8 }}
                  className="font-['Marcellus'] text-2xl font-bold bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 bg-[length:200%_100%] bg-clip-text text-transparent group-hover:from-red-600 group-hover:via-amber-500 group-hover:to-red-600 transition-all duration-500"
                >
                  WebMevine
                </motion.span>
              </Link>
            </motion.div>
            
            <motion.p 
              variants={itemVariants}
              className="font-['Manrope'] text-gray-900 text-sm leading-relaxed max-w-sm mb-6"
            >
              Your rapid launch partner, built for founders. 
              We turn ideas into production-ready apps in weeks, not months.
            </motion.p>
            
            {/* Contact Info */}
            <motion.div variants={itemVariants} className="space-y-3">
              {[
                { icon: FiMail, text: "hello@ahmtech.com", href: "mailto:hello@ahmtech.com" },
                { icon: FiPhone, text: "+1 (234) 567-890", href: "tel:+1234567890" },
                { icon: FiMapPin, text: "San Francisco, CA", href: null }
              ].map((contact, i) => (
                <motion.div
                  key={i}
                  variants={itemVariants}
                  custom={i}
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {contact.href ? (
                    <a 
                      href={contact.href} 
                      className="font-['Manrope'] text-sm text-gray-400 hover:text-red-600 flex items-center gap-3 transition-colors group"
                    >
                      <motion.span 
                       
                        className="w-8 h-8 bg-gray-90 group-hover:bg-red-50 rounded-lg flex items-center justify-center transition-colors"
                      >
                        <contact.icon className="w-4 h-4" />
                      </motion.span>
                      {contact.text}
                    </a>
                  ) : (
                    <span className="font-['Manrope'] text-sm text-gray-400 flex items-center gap-3">
                      <span className="w-8 h-8 bg-gray-90 rounded-lg flex items-center justify-center">
                        <contact.icon className="w-4 h-4" />
                      </span>
                      {contact.text}
                    </span>
                  )}
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Product Links */}
          <motion.div variants={itemVariants} className="md:col-span-2 md:col-start-6">
            <motion.h3 
              variants={itemVariants}
              className="font-['Marcellus'] text-gray-900 text-sm font-bold mb-6 uppercase tracking-wider"
            >
              Product
            </motion.h3>
            <ul className="space-y-4">
              {footerLinks.product.map((link, i) => (
                <motion.li 
                  key={link.name}
                  custom={i}
                  variants={linkVariants}
                  initial="hidden"
                  whileInView="visible"
                  whileHover="hover"
                  viewport={{ once: true }}
                >
                  <Link 
                    href={link.href}
                    className="font-['Manrope'] text-sm text-gray-400 hover:text-red-600 inline-flex items-center gap-2 group"
                  >
                    <motion.span
                      initial={{ width: 0, opacity: 0 }}
                      whileHover={{ width: 12, opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <FiArrowRight className="w-3 h-3" />
                    </motion.span>
                    {link.name}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Company Links */}
          <motion.div variants={itemVariants} className="md:col-span-2">
            <motion.h3 
              variants={itemVariants}
              className="font-['Marcellus'] text-gray-900 text-sm font-bold mb-6 uppercase tracking-wider"
            >
              Company
            </motion.h3>
            <ul className="space-y-4">
              {footerLinks.company.map((link, i) => (
                <motion.li 
                  key={link.name}
                  custom={i + 4}
                  variants={linkVariants}
                  initial="hidden"
                  whileInView="visible"
                  whileHover="hover"
                  viewport={{ once: true }}
                >
                  <Link 
                    href={link.href}
                    className="font-['Manrope'] text-sm text-gray-400 hover:text-red-600 inline-flex items-center gap-2 group"
                  >
                    <motion.span
                      initial={{ width: 0, opacity: 0 }}
                      whileHover={{ width: 12, opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <FiArrowRight className="w-3 h-3" />
                    </motion.span>
                    {link.name}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Social Links */}
          <motion.div variants={itemVariants} className="md:col-span-2">
            <motion.h3 
              variants={itemVariants}
              className="font-['Marcellus'] text-gray-900 text-sm font-bold mb-6 uppercase tracking-wider"
            >
              Connect
            </motion.h3>
            <motion.div 
              variants={containerVariants}
              className="flex gap-3"
            >
              {[
                { icon: FiLinkedin, href: '#', label: 'LinkedIn' },
                { icon: FiInstagram, href: '#', label: 'Instagram' },
              ].map((social, i) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  custom={i}
                  variants={socialVariants}
                  initial="hidden"
                  whileInView="visible"
                  whileHover="hover"
                  viewport={{ once: true }}
                  className="w-12 h-12 bg-gradient-to-br from-gray-90 to-white hover:from-red-50 hover:to-amber-50 rounded-full flex items-center justify-center text-gray-400 hover:text-red-600 shadow-sm hover:shadow transition-all duration-300 border border-gray-100"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </motion.div>

         
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div 
          variants={itemVariants}
          className="pt-8 mt-8 border-t border-gray-100"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Copyright */}
            <motion.p 
              whileHover={{ scale: 1.02 }}
              className="font-['Manrope'] text-xs text-gray-400 order-2 md:order-1"
            >
              © {currentYear} WebMevien. All rights reserved.
            </motion.p>

            {/* Legal Links */}
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 order-1 md:order-2">
              {footerLinks.legal.map((link, index) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -2 }}
                >
                  <Link
                    href={link.href}
                    className="font-['Manrope'] text-xs text-gray-400 hover:text-red-600 transition-colors relative group"
                  >
                    {link.name}
                    <motion.span 
                      className="absolute -bottom-1 left-0 h-px bg-red-600"
                      initial={{ width: 0 }}
                      whileHover={{ width: "100%" }}
                      transition={{ duration: 0.3 }}
                    />
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.footer>
  );
}