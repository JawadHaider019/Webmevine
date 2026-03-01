"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  // Handle mount state to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle scroll effect - only on client side
  useEffect(() => {
    if (!mounted) return;
    
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    // Initial check
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled, mounted]);

  // Prevent scrolling when drawer is open
  useEffect(() => {
    if (!mounted) return;
    
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, mounted]);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/services", label: "Services" },
    { href: "/process", label: "Process" },
    { href: "/contact", label: "Contact" },
  ];

  // Animation variants for mobile nav items (right to left)
  const mobileNavItemVariants = {
    hidden: { 
      opacity: 0,
      x: 50,
      filter: "blur(4px)"
    },
    visible: (custom) => ({
      opacity: 1,
      x: 0,
      filter: "blur(0px)",
      transition: {
        delay: 0.1 + custom * 0.08,
        duration: 0.4,
        ease: "easeOut"
      }
    }),
    exit: (custom) => ({
      opacity: 0,
      x: 50,
      filter: "blur(4px)",
      transition: {
        delay: custom * 0.03,
        duration: 0.3
      }
    })
  };

  // Don't render anything until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <>
        <nav className="fixed top-0 left-0 right-0 z-50">
          <div className="w-full mx-auto">
            <div className="relative group">
              <div className="relative shadow-xl px-3 sm:px-4 py-1 bg-white">
                <div className="flex items-center justify-between h-12 sm:h-14">
                  <div className="flex items-center">
                <div className="flex items-center">
  <div className="w-[80px] sm:w-[100px] md:w-[120px] lg:w-[140px]">
    <Image 
      src="/logo.png" 
      alt="AHMTECH Logo"
      width={140}
      height={140}
      className="object-contain w-full h-auto"
      priority
    />
  </div>
</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>
   
      </>
    );
  }

  return (
    <>
      <motion.nav 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50"
      >
        <div className="w-full mx-auto">
          {/* Main navbar container */}
          <div className="relative group">
            {/* Main navbar with scroll-based blur - SOLUTION 3 APPLIED */}
            <motion.div 
              animate={{
                backgroundColor: scrolled ? 'rgba(255, 255, 255, 0.9)' : 'white',
                backdropFilter: scrolled ? 'blur(10px)' : 'none',
                boxShadow: scrolled 
                  ? '0 4px 30px rgba(0, 0, 0, 0.1)' 
                  : '0 2px 10px rgba(0, 0, 0, 0.05)',
              }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="relative shadow-xl px-3 sm:px-4 py-1"
              style={{
                WebkitBackdropFilter: scrolled ? 'blur(10px)' : 'none',
              }}
            >
              <div className="flex items-center justify-between h-12 sm:h-14">
                {/* Logo */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                 <Link href="/" className="flex items-center group/logo">
  <div className="w-[80px] sm:w-[100px] md:w-[120px] lg:w-[140px]">
    <Image 
      src="/logo.png" 
      alt="WebMevine Logo"
      width={140}
      height={140}
      className="object-contain w-full h-auto"
      priority
    />
  </div>
</Link>
                </motion.div>

                {/* Desktop Navigation Links */}
                <div className="hidden lg:flex items-center gap-1">
                  {navLinks.map((link, index) => {
                    const isActive = pathname === link.href;
                    return (
                      <motion.div
                        key={link.href}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
                      >
                        <Link
                          href={link.href}
                          className={`relative px-3 xl:px-4 py-1.5 uppercase transition-all duration-300 text-[11px] xl:text-xs tracking-[0.2em] font-light group/link ${
                            isActive 
                              ? 'text-red-600 font-normal' 
                              : 'text-black hover:text-gray-800'
                          }`}
                          style={{ fontFamily: 'var(--font-manrope)' }}
                        >
                          <span className="relative z-10 font-bold ">{link.label}</span>
                          {isActive && (
                            <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-red-600 " />
                          )}
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Book Meeting - Desktop & Tablet (text) + Mobile (icon) */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="flex items-center gap-1"
                >
                  {/* Desktop & Tablet: Text button */}
                  <Link
                    href="/book-meeting"
                    className="relative group/btn hidden sm:block"
                  >
                    <button className="btn-primary px-3 py-1 text-[9px] sm:text-[10px] whitespace-nowrap tracking-wider">
                      Book Meeting
                    </button>
                  </Link>

                  {/* Mobile: Icon button */}
                  <Link
                    href="/book-meeting"
                    className="relative group/btn sm:hidden"
                  >
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600 to-red-800 rounded-full opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 blur-sm" />
                    <button className="relative w-7 h-7 bg-gradient-to-r from-red-600 to-red-700 rounded-full flex items-center justify-center shadow-lg shadow-red-600/20">
                      <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </Link>

                  {/* Mobile/Tablet Menu Button */}
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsOpen(true)}
                    className="lg:hidden relative w-6 h-6 sm:w-7 sm:h-7 transition-colors duration-300 focus:outline-none group"
                  >
                    <svg 
                      className="w-3.5 h-3.5 sm:w-4 sm:h-4 mx-auto text-gray-900" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.nav>


      {/* Premium Side Drawer for Mobile/Tablet */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100]">
            {/* Backdrop with blur */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-md"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Drawer - Premium Design */}
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="absolute top-0 right-0 h-full w-[280px] sm:w-[320px] bg-gradient-to-b from-white to-gray-50/95 shadow-2xl"
              style={{ boxShadow: '-10px 0 40px rgba(0, 0, 0, 0.15)' }}
            >
              {/* Decorative red gradient line */}
              <motion.div 
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 via-red-400 to-red-600 origin-left"
              />
              
              {/* Drawer Header with close button */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.15 }}
                className="relative flex items-center justify-between p-6 border-b border-red-600/10"
              >
                <span 
                  className="text-gray-900 text-sm sm:text-base tracking-[0.3em] uppercase font-light"
                  style={{ fontFamily: 'var(--font-manrope)' }}
                >
                  Navigation
                </span>
                <motion.button 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-300 group"
                >
                  <svg className="w-4 h-4 text-gray-600 group-hover:text-gray-900 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>
              </motion.div>

              {/* Drawer Navigation Links */}
              <div className="p-6">
                <div className="flex flex-col gap-2">
                  {navLinks.map((link, index) => {
                    const isActive = pathname === link.href;
                    return (
                      <motion.div
                        key={link.href}
                        custom={index}
                        variants={mobileNavItemVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                      >
                        <Link
                          href={link.href}
                          onClick={() => setIsOpen(false)}
                          className={`group relative px-4 py-3 rounded-xl transition-all duration-300 block ${
                            isActive 
                              ? 'text-red-500 bg-red-600/5' 
                              : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100/80'
                          }`}
                        >
                          {/* Active indicator */}
                          {isActive && (
                            <motion.span 
                              initial={{ scaleY: 0 }}
                              animate={{ scaleY: 1 }}
                              transition={{ duration: 0.3 }}
                              className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-red-600 to-red-800 rounded-full origin-top"
                            />
                          )}
                          
                          {/* Link text */}
                          <span 
                            className={`block text-sm sm:text-base tracking-[0.15em] uppercase ${
                              isActive ? 'font-normal' : 'font-light'
                            }`}
                            style={{ fontFamily: 'var(--font-manrope)' }}
                          >
                            {link.label}
                          </span>
                          
                          {/* Subtle hover effect */}
                          <span className="absolute inset-x-4 bottom-2 h-[1px] bg-gradient-to-r from-red-600/0 via-red-600/0 to-red-600/0 group-hover:from-red-600/0 group-hover:via-red-600/30 group-hover:to-red-600/0 transition-all duration-500" />
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Premium Divider */}
                <motion.div 
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="my-6 border-t border-red-600/10 origin-left"
                />

                {/* Book Meeting button inside drawer */}
                <motion.div
                  custom={navLinks.length}
                  variants={mobileNavItemVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <Link
                    href="/book-meeting"
                    onClick={() => setIsOpen(false)}
                    className="sm:hidden block"
                  >
                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full px-4 py-3.5 bg-gradient-to-r from-red-600 to-red-700 text-white text-sm font-normal rounded-xl transition-all duration-300 tracking-[0.15em] uppercase shadow-lg shadow-red-600/20 flex items-center justify-center gap-3 hover:shadow-xl hover:shadow-red-600/30"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Book Meeting
                    </motion.button>
                  </Link>
                </motion.div>

                {/* Footer */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.7 }}
                  className="mt-8 text-center"
                >
                  <p className="text-[8px] text-gray-400 tracking-[0.3em] uppercase">AHMTECH © 2024</p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}