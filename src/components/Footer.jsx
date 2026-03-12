"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { 
  FiLinkedin, 
  FiInstagram, 
  FiMail,
  FiPhone,
  FiArrowRight
} from "react-icons/fi";

export default function Footer() {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { name: "Why Choose Us", href: "#whyus" },
      { name: "How It Works", href: "#howwork" },
      { name: "Case Studies", href: "#case" },
      { name: "FAQ", href: "#faq" }
    ],
    company: [
      { name: "About", href: "/about" },
      { name: "Services", href: "/services" },
      { name: "Process", href: "/process" },
      { name: "Contact", href: "/contact" },
      { name: "Blogs", href: "/blog" }
    ],
    legal: [
      { name: "Privacy", href: "/" },
      { name: "Terms", href: "/" },
      { name: "Cookies", href: "/" }
    ]
  };

  // Smooth scroll function for hash links
  const handleSmoothScroll = (e, href) => {
    // Check if it's a hash link (starts with #)
    if (href.startsWith('#')) {
      e.preventDefault();
      
      const targetId = href.substring(1); // Remove the #
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
        
        // Optional: Update URL without page jump
        window.history.pushState(null, '', href);
      }
    }
  };

  // Handle Get In Touch click based on current page
  const handleGetInTouch = (e) => {
    e.preventDefault();
    
    if (pathname === '/contact') {
      // On contact page - scroll to calendar
      const calendar = document.querySelector('#calendar');
      if (calendar) {
        const yOffset = -80;
        const y = calendar.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({
          top: y,
          behavior: 'smooth'
        });
      }
    } else {
      // On other pages - navigate to contact
      window.location.href = '/contact';
    }
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

  const slideInLeft = {
    hidden: { opacity: 0, x: -100 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 50,
        damping: 20
      }
    }
  };

  const slideInRight = {
    hidden: { opacity: 0, x: 100 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 50,
        damping: 20
      }
    }
  };

  const scaleUp = {
    hidden: { scale: 0 },
    visible: {
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15
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
    hidden: { scale: 0 },
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
    <>
      {/* Collaboration Section - Reduced height on mobile */}
      <section className="overflow-x-hidden border-b border-white/10 relative flex items-center justify-center flex-col gap-3 md:gap-8 text-center bg-gradient-to-r from-black via-red-600 to-black min-h-[50vh] md:min-h-screen py-12 md:py-0 px-4">
        {/* Animated background elements - smaller on mobile */}
        <div className="absolute bottom-20 left-4 sm:left-10 w-32 h-32 sm:w-72 sm:h-72 bg-white/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-20 right-4 sm:right-10 w-32 h-32 sm:w-72 sm:h-72 bg-white/10 rounded-full blur-3xl animate-pulse" />

        {/* Circle Button - Get In Touch with conditional navigation */}
        <button onClick={handleGetInTouch}>
          <motion.div 
            variants={scaleUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="z-45 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white hover:bg-white/10 hover:text-white w-12 h-12 md:w-28 md:h-28 lg:w-36 lg:h-36 rounded-full text-red-600 font-bold flex flex-col items-center justify-center text-[8px] md:text-base tracking-wider transition-all duration-300 hover:scale-110 cursor-pointer group border border-white/20 hover:border-white"
          >
            <FiArrowRight className="group-hover:rotate-[-40deg] transition-transform duration-300 mb-0.5 md:mb-1 w-3 h-3 md:w-6 md:h-6" />
            <span className="text-[8px] md:text-sm">Get In Touch</span>
          </motion.div>
        </button>
        
        {/* Text Content */}
        <motion.h1 
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-sm md:text-2xl font-bold text-white"
        >
          LET'S COLLABORATE
        </motion.h1>
        
        <h1 className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl xl:text-[12rem] font-bold leading-tight md:leading-none px-2 text-white">
          <motion.span 
            variants={slideInLeft}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="inline-block"
          >
            LET'S WORK
          </motion.span>
          <br/>
          <motion.span 
            variants={slideInRight}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="inline-block"
          >
            TOGETHER
          </motion.span>
        </h1>
      </section>

      {/* Footer Section - White Background */}
      <motion.footer 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8 }}
        className="relative bg-white overflow-hidden"
      >
        {/* Animated Premium Background Elements - Subtle for white bg */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div 
            variants={backgroundOrbVariants}
            animate="animate"
            className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-red-600/5 to-transparent rounded-full blur-3xl"
          />
          <motion.div 
            variants={backgroundOrbVariants}
            animate="animate"
            custom={1}
            className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-red-600/5 to-transparent rounded-full blur-3xl"
          />
          
          {/* Additional animated circles */}
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.05, 0.1, 0.05],
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
            className="absolute top-1/4 right-1/3 w-24 h-24 sm:w-40 sm:h-40 bg-red-600/5 rounded-full blur-2xl"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.05, 0.1, 0.05],
            }}
            transition={{
              duration: 9,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 3
            }}
            className="absolute bottom-1/3 left-1/4 w-20 h-20 sm:w-32 sm:h-32 bg-red-600/5 rounded-full blur-xl"
          />
        </div>

        {/* Main Footer Content */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8"
        >
          {/* Top Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-4">
            {/* Brand Column with Logo */}
            <motion.div variants={itemVariants} className="lg:col-span-4 border border-gray-200 p-6 rounded-2xl hover:shadow-lg hover:shadow-red-600/10 transition-all hover:-translate-y-2 duration-300 bg-white">
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="mb-2"
              >
                <Link href="/" className="inline-block">
                  <Image 
                    src="/logo.png" 
                    alt="WebMavein Logo" 
                    width={140}
                    height={140}
                    className="object-contain w-full h-auto"
                  />
                </Link>
              </motion.div>
              
              <motion.p 
                variants={itemVariants}
                className="font-['Manrope'] text-gray-600 text-sm leading-relaxed mb-2"
              >
                Your rapid launch partner, built for founders. 
                We turn ideas into production-ready apps in weeks, not months.
              </motion.p>
              
              {/* Contact Info */}
              <motion.div variants={itemVariants} className="space-y-3">
                <motion.div
                  className="flex items-center gap-3 group cursor-pointer"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-black rounded-full flex items-center justify-center group-hover:from-black group-hover:to-red-600 transition-all duration-300 border border-transparent group-hover:scale-110">
                    <FiMail className="text-white text-sm transition-all duration-300" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">Email us</p>
                    <a href="mailto:team@webmavein.com" className="text-gray-900 font-medium text-sm hover:text-red-600 transition-colors">
                      team@webmavein.com
                    </a>
                  </div>
                </motion.div>
                
                <div 
                  className="flex items-center gap-3 group cursor-pointer"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-black rounded-full flex items-center justify-center group-hover:from-black group-hover:to-red-600 transition-all duration-300 border border-transparent group-hover:scale-110">
                    <FiPhone className="text-white text-sm transition-all duration-300" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">Contact us</p>
                    <p className="text-gray-900 font-medium text-sm hover:text-red-600 transition-colors"> +44 7424 672943</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            <div className='flex flex-col justify-between lg:col-span-8'>
              {/* Links Grid */}
              <motion.div 
                variants={itemVariants}
                className="lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 pb-8 mb-8"
              >
                {/* Product */}
                <div className="md:border-r md:border-gray-200 md:pr-6 pb-6 md:pb-0 border-b border-gray-200 md:border-b-0">
                  <h3 className="font-['Marcellus'] text-gray-900 text-lg font-bold mb-6 pb-2 inline-block border-b-2 border-red-600">
                    Product
                  </h3>
                  <ul className="space-y-3">
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
                          onClick={(e) => handleSmoothScroll(e, link.href)}
                          className="font-['Manrope'] text-sm text-gray-500 hover:text-red-600 transition-colors inline-block hover:translate-x-1 transform duration-200"
                        >
                          {link.name}
                        </Link>
                      </motion.li>
                    ))}
                  </ul>
                </div>

                {/* Company */}
                <div className="md:border-r md:border-gray-200 md:pr-6 pb-6 md:pb-0 border-b border-gray-200 md:border-b-0">
                  <h3 className="font-['Marcellus'] text-gray-900 text-lg font-bold mb-6 pb-2 inline-block border-b-2 border-red-600">
                    Company
                  </h3>
                  <ul className="space-y-3">
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
                          className="font-['Manrope'] text-sm text-gray-500 hover:text-red-600 transition-colors inline-block hover:translate-x-1 transform duration-200"
                        >
                          {link.name}
                        </Link>
                      </motion.li>
                    ))}
                  </ul>
                </div>

                {/* Connect */}
                <div>
                  <h3 className="font-['Marcellus'] text-gray-900 text-lg font-bold mb-6 pb-2 inline-block border-b-2 border-red-600">
                    Connect
                  </h3>
                  <motion.div 
                    variants={containerVariants}
                    className="flex gap-3"
                  >
                    {[
                      { icon: FiLinkedin, href: 'https://www.linkedin.com/company/web-mavien', label: 'LinkedIn' },
                      { icon: FiInstagram, href: 'https://www.instagram.com/webmevine', label: 'Instagram' },
                    ].map((social, i) => (
                      <motion.a
                        key={social.label}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        custom={i}
                        variants={socialVariants}
                        initial="hidden"
                        whileInView="visible"
                        whileHover="hover"
                        viewport={{ once: true }}
                        className="w-12 h-12 bg-gradient-to-br from-red-600 to-black rounded-full flex items-center justify-center text-white hover:from-black hover:to-red-600 shadow-md hover:shadow-red-600/30 transition-all duration-300"
                        aria-label={social.label}
                      >
                        <social.icon className="w-5 h-5" />
                      </motion.a>
                    ))}
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Bottom Bar */}
          <motion.div 
            variants={itemVariants}
            className="pt-8 mt-8 border-t border-gray-200"
          >
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              {/* Copyright */}
              <motion.p 
                whileHover={{ scale: 1.02 }}
                className="font-['Manrope'] text-xs text-gray-400 order-2 md:order-1"
              >
                © {currentYear} WebMavein. All rights reserved.
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
    </>
  );
}