"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import GlowingButton from './GlowingButton';
import { serviceNavGroups } from '@/data/serviceNav';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

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
    { href: "/services", label: "Services" },
    { href: "/casestudies", label: "Case Studies" },
    { href: "/process", label: "Process" },
    { href: "/blog", label: "Blog" },
    { href: "/about", label: "About" },
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

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50">
        <div className="w-full mx-auto">
          {/* Main navbar container */}
          <div className="relative group">
            {/* Main navbar with scroll-based blur */}
            <div
              className="relative shadow-xl px-3 sm:px-4 py-1 transition-all duration-300"
              style={{
                backgroundColor: scrolled ? 'rgba(255, 255, 255, 0.92)' : '#ffffff',
                backdropFilter: scrolled ? 'blur(10px)' : 'none',
                WebkitBackdropFilter: scrolled ? 'blur(10px)' : 'none',
                boxShadow: scrolled
                  ? '0 4px 30px rgba(0, 0, 0, 0.1)'
                  : '0 2px 10px rgba(0, 0, 0, 0.05)',
              }}
            >
              <div className="flex items-center justify-between h-15">
                {/* Logo */}
                <div>
                  <Link href="/" className="flex items-center group/logo">
                    <div className="w-[80px] sm:w-[100px] md:w-[120px] lg:w-[140px]">
                      <Image
                        src="/logo.png"
                        alt="WebMavien Logo"
                        width={140}
                        height={140}
                        className="object-contain w-full h-auto"
                        priority
                      />
                    </div>
                  </Link>
                </div>

                {/* Desktop Navigation Links */}
                <div className="hidden lg:flex items-center self-stretch gap-0.5 xl:gap-1">
                  {navLinks.map((link) => {
                    const isActive =
                      link.href === '/'
                        ? pathname === '/'
                        : pathname === link.href || pathname?.startsWith(`${link.href}/`);
                    const linkClass = `relative px-2.5 xl:px-3.5 py-1.5 uppercase transition-all duration-300 text-[11px] xl:text-xs tracking-[0.16em] font-light group/link whitespace-nowrap ${
                      isActive ? 'text-red-600 font-normal' : 'text-black hover:text-red-600'
                    }`;

                    if (link.href === '/services') {
                      return (
                        <div key={link.href} className="group/services h-full flex items-center">
                          <Link
                            href={link.href}
                            className={`${linkClass} inline-flex items-center gap-1 group-hover/services:text-red-600`}
                            style={{ fontFamily: 'var(--font-manrope)' }}
                            aria-haspopup="true"
                          >
                            <span className="relative z-10 font-bold">{link.label}</span>
                            <svg className="w-3 h-3 transition-transform duration-300 group-hover/services:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                            </svg>
                            {isActive && (
                              <span className="absolute bottom-0 left-2.5 right-2.5 h-[2px] bg-red-600" />
                            )}
                          </Link>

                          {/* Services mega menu: full navbar width, CSS hover / keyboard focus.
                              -mt-1/pt-1 bridges the navbar's bottom padding so hover is not lost. */}
                          <div
                            onClick={(e) => {
                              // Close the panel after choosing a link (drop focus so :focus-within no longer holds it open)
                              if (e.target.closest('a')) document.activeElement?.blur();
                            }}
                            className="absolute left-0 right-0 top-full -mt-1 pt-1 invisible opacity-0 -translate-y-1 group-hover/services:visible group-hover/services:opacity-100 group-hover/services:translate-y-0 group-focus-within/services:visible group-focus-within/services:opacity-100 group-focus-within/services:translate-y-0 transition-all duration-200"
                          >
                            <div className="bg-white border-t border-gray-100 rounded-b-3xl overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.08)]">
                              <div className="max-w-6xl mx-auto px-8 py-8 grid grid-cols-4 gap-10">
                                {serviceNavGroups.map((group) => (
                                  <div key={group.category}>
                                    <p
                                      className="text-xs font-bold uppercase tracking-[0.08em] text-red-600 mb-5"
                                      style={{ fontFamily: 'var(--font-manrope)' }}
                                    >
                                      {group.category}
                                    </p>
                                    <ul className="space-y-3.5">
                                      {group.items.map((s) => {
                                        const href = `/services/${s.slug}`;
                                        const activeItem = pathname === href;
                                        return (
                                          <li key={s.slug}>
                                            <Link
                                              href={href}
                                              className={`text-[15px] transition-colors ${activeItem ? 'text-red-600 font-semibold' : 'text-gray-800 hover:text-red-600'}`}
                                              style={{ fontFamily: 'var(--font-manrope)' }}
                                            >
                                              {s.name}
                                            </Link>
                                          </li>
                                        );
                                      })}
                                    </ul>
                                  </div>
                                ))}
                              </div>
                              <div className="max-w-6xl mx-auto px-8 pb-6 -mt-2">
                                <Link
                                  href="/services"
                                  className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-gray-500 hover:text-red-600 transition-colors"
                                  style={{ fontFamily: 'var(--font-manrope)' }}
                                >
                                  View all services
                                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                  </svg>
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    }

                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={linkClass}
                        style={{ fontFamily: 'var(--font-manrope)' }}
                      >
                        <span className="relative z-10 font-bold">{link.label}</span>
                        {isActive && (
                          <span className="absolute bottom-0 left-2.5 right-2.5 h-[2px] bg-red-600" />
                        )}
                      </Link>
                    );
                  })}
                </div>

                {/* Book Meeting - Desktop & Tablet (text) + Mobile (icon) */}
                <div className="flex items-center gap-1">
                  {/* Desktop & Tablet: Text button */}
                  <Link
                    href="/contact"
                    className="relative group/btn hidden sm:block"
                  >
                    <GlowingButton
                      glowColor="255, 255, 255"
                      variant="primary"
                      className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 text-base sm:text-lg"
                    >
                      Book Free Call
                    </GlowingButton>
                  </Link>

                  {/* Mobile: Icon button */}
                  <Link
                    href="/contact"
                    className="relative group/btn sm:hidden"
                    aria-label="Book a Meeting"
                  >
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600 to-red-800 rounded-full opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 blur-sm" />
                    <div className="relative w-10 h-10 bg-gradient-to-r from-red-600 to-red-700 rounded-full flex items-center justify-center shadow-lg shadow-red-600/20">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </Link>

                  {/* Mobile/Tablet Menu Button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsOpen(true)}
                    className="lg:hidden relative w-10 h-10 flex items-center justify-center transition-colors duration-300 focus:outline-none group"
                    aria-label="Open navigation menu"
                  >
                    <svg
                      className="w-6 h-6 text-gray-900"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>


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
                  className="w-11 h-11 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-300 group"
                  aria-label="Close navigation menu"
                >
                  <svg className="w-5 h-5 text-gray-600 group-hover:text-gray-900 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>
              </motion.div>

              {/* Drawer Navigation Links */}
              <div className="p-6">
                <div className="flex flex-col gap-2">
                  {navLinks.map((link, index) => {
                    const isActive = pathname === link.href;

                    if (link.href === '/services') {
                      const inServices = pathname === '/services' || pathname?.startsWith('/services/');
                      return (
                        <motion.div
                          key={link.href}
                          custom={index}
                          variants={mobileNavItemVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                        >
                          <div className={`flex items-center rounded-xl transition-all duration-300 ${inServices ? 'bg-red-600/5' : 'hover:bg-gray-100/80'}`}>
                            <Link
                              href={link.href}
                              onClick={() => setIsOpen(false)}
                              className={`relative flex-1 px-4 py-3 ${inServices ? 'text-red-500' : 'text-gray-700 hover:text-gray-900'}`}
                            >
                              {inServices && (
                                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-red-600 to-red-800 rounded-full" />
                              )}
                              <span
                                className={`block text-sm sm:text-base tracking-[0.15em] uppercase ${inServices ? 'font-normal' : 'font-light'}`}
                                style={{ fontFamily: 'var(--font-manrope)' }}
                              >
                                {link.label}
                              </span>
                            </Link>
                            <button
                              type="button"
                              onClick={() => setServicesOpen((v) => !v)}
                              className="w-11 h-11 mr-1 flex items-center justify-center rounded-full text-gray-600 hover:text-red-600 hover:bg-white transition-colors"
                              aria-expanded={servicesOpen}
                              aria-controls="mobile-services-menu"
                              aria-label={servicesOpen ? 'Hide services' : 'Show services'}
                            >
                              <svg className={`w-4 h-4 transition-transform duration-300 ${servicesOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                              </svg>
                            </button>
                          </div>

                          <div
                            id="mobile-services-menu"
                            className={`grid transition-all duration-300 ease-in-out ${servicesOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
                          >
                            <div className="overflow-hidden ml-4 pl-3 border-l border-red-600/20">
                              {serviceNavGroups.map((group) => (
                                <div key={group.category} className="pt-3">
                                  <p
                                    className="px-3 pb-1 text-[10px] font-bold uppercase tracking-[0.12em] text-red-600"
                                    style={{ fontFamily: 'var(--font-manrope)' }}
                                  >
                                    {group.category}
                                  </p>
                                  <ul>
                                    {group.items.map((s) => {
                                      const href = `/services/${s.slug}`;
                                      const activeItem = pathname === href;
                                      return (
                                        <li key={s.slug}>
                                          <Link
                                            href={href}
                                            onClick={() => setIsOpen(false)}
                                            tabIndex={servicesOpen ? 0 : -1}
                                            className={`block px-3 py-2 rounded-lg text-[13px] transition-colors ${activeItem ? 'text-red-600 bg-red-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/80'}`}
                                            style={{ fontFamily: 'var(--font-manrope)' }}
                                          >
                                            {s.name}
                                          </Link>
                                        </li>
                                      );
                                    })}
                                  </ul>
                                </div>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      );
                    }

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
                          className={`group relative px-4 py-3 rounded-xl transition-all duration-300 block ${isActive
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
                            className={`block text-sm sm:text-base tracking-[0.15em] uppercase ${isActive ? 'font-normal' : 'font-light'
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
                    href="/contact"
                    onClick={() => setIsOpen(false)}
                    className="sm:hidden block"
                  >
                    <GlowingButton
                      glowColor="255, 255, 255"
                      variant="primary"
                      className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 text-base sm:text-lg"
                    >
                      Book a Meeting
                    </GlowingButton>
                  </Link>
                </motion.div>

                {/* Footer */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.7 }}
                  className="mt-8 text-center"
                >
                  <p className="text-[8px] text-gray-400 tracking-[0.3em] uppercase">© {currentYear} WebMavien</p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}