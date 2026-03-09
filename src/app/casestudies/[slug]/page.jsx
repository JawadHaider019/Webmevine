// app/case-studies/[slug]/page.jsx
"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { FiArrowLeft, FiCheckCircle, FiCalendar, FiTag, FiCode, FiUsers, FiStar, FiExternalLink, FiX } from "react-icons/fi";
import GlowingButton from "@/components/GlowingButton";
import { caseStudies } from "@/data/caseStudies";
import SectionHeader from "@/components/SectionHeader";

export default function CaseStudyDetail() {
  const params = useParams();
  const [mounted, setMounted] = useState(false);
  const [relatedStudies, setRelatedStudies] = useState([]);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageErrors, setImageErrors] = useState({});
  const [farmerAnimation, setFarmerAnimation] = useState({
    walking: false,
    wave: false,
    work: false
  });

  useEffect(() => {
    setMounted(true);
    
    // Farmer animation sequence
    const animationSequence = setInterval(() => {
      setFarmerAnimation(prev => ({
        walking: !prev.walking,
        wave: Math.random() > 0.7,
        work: Math.random() > 0.8
      }));
    }, 3000);

    return () => clearInterval(animationSequence);
  }, []);

  const study = caseStudies.find(s => s.slug === params.slug);

  useEffect(() => {
    if (study) {
      // Get related studies from same category (excluding current)
      const related = caseStudies
        .filter(s => s.category === study.category && s.id !== study.id)
        .slice(0, 2);
      setRelatedStudies(related);
    }
  }, [study]);

  const handleImageError = (imageKey) => {
    setImageErrors(prev => ({ ...prev, [imageKey]: true }));
  };

  const getImageSource = (imagePath, fallbackTitle) => {
    // Return null if no image path provided
    if (!imagePath) return null;
    
    // Return placeholder if image failed to load
    if (imageErrors[imagePath]) {
      return `https://placehold.co/800x600/1a1a1a/ffffff?text=${encodeURIComponent(fallbackTitle || 'Image')}`;
    }
    return imagePath;
  };

  const hasValidImages = () => {
    if (!study || !study.images) return false;
    
    const mainImage = study.image || study.images.main;
    const galleryImages = study.images.gallery || [];
    
    return mainImage || galleryImages.length > 0;
  };

  const getValidGalleryImages = () => {
    if (!study || !study.images || !study.images.gallery) return [];
    
    // Filter out any null/undefined images
    return study.images.gallery.filter(img => img && typeof img === 'string' && img.trim() !== '');
  };

  if (!mounted) return null;

  if (!study) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-xl sm:text-2xl font-bold mb-4">Case Study Not Found</h1>
          <Link href="/casestudies" className="text-red-600 hover:underline">
            Back to Case Studies
          </Link>
        </div>
      </div>
    );
  }

  // Get main image with fallback
  const mainImage = study.image || study.images?.main || null;
  const galleryImages = getValidGalleryImages();
  const totalImages = (mainImage ? 1 : 0) + galleryImages.length;

  // Farmer SVG Animation Component
  const FarmerAnimation = () => (
    <motion.div 
      className="fixed bottom-4 left-4 z-50 pointer-events-none"
      initial={{ opacity: 0, x: -100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        animate={{
          x: farmerAnimation.walking ? [0, 10, 0] : 0,
          rotate: farmerAnimation.wave ? [0, -10, 10, -10, 0] : 0,
          scale: farmerAnimation.work ? [1, 1.1, 1] : 1
        }}
        transition={{
          duration: farmerAnimation.walking ? 0.5 : 0.3,
          repeat: farmerAnimation.walking ? Infinity : 0,
          repeatType: "loop"
        }}
        className="relative w-16 h-16 sm:w-20 sm:h-20"
      >
        {/* Farmer SVG */}
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full drop-shadow-lg"
        >
          {/* Hat */}
          <motion.path
            animate={{ rotate: farmerAnimation.wave ? -5 : 0 }}
            d="M30 35 L70 35 L65 25 L35 25 L30 35"
            fill="#8B4513"
            stroke="#654321"
            strokeWidth="2"
          />
          <circle cx="50" cy="30" r="12" fill="#DEB887" stroke="#8B6C4A" strokeWidth="2" />
          
          {/* Face */}
          <circle cx="50" cy="45" r="15" fill="#FFE4B5" stroke="#D2B48C" strokeWidth="2" />
          
          {/* Eyes - animated based on work */}
          <motion.circle
            animate={{ scale: farmerAnimation.work ? [1, 1.2, 1] : 1 }}
            cx="42" cy="45" r="2" fill="#000000"
          />
          <motion.circle
            animate={{ scale: farmerAnimation.work ? [1, 1.2, 1] : 1 }}
            cx="58" cy="45" r="2" fill="#000000"
          />
          
          {/* Smile - animated based on wave */}
          <motion.path
            animate={{ d: farmerAnimation.wave ? "M42 52 Q50 58, 58 52" : "M42 52 Q50 55, 58 52" }}
            stroke="#000000"
            strokeWidth="2"
            fill="none"
          />
          
          {/* Body/Overalls */}
          <rect x="38" y="60" width="24" height="25" fill="#4A6FA5" stroke="#2C3E50" strokeWidth="2" rx="3" />
          
          {/* Straps */}
          <path d="M38 62 L32 52 M62 62 L68 52" stroke="#2C3E50" strokeWidth="3" />
          
          {/* Arms - animated based on wave */}
          <motion.g
            animate={{
              rotate: farmerAnimation.wave ? [0, 30, -10, 20, 0] : 0,
              originX: "45px",
              originY: "60px"
            }}
          >
            <line x1="38" y1="65" x2="28" y2="55" stroke="#4A6FA5" strokeWidth="4" strokeLinecap="round" />
            <circle cx="28" cy="52" r="3" fill="#DEB887" />
          </motion.g>
          
          <motion.g
            animate={{
              rotate: farmerAnimation.work ? [0, 15, 0] : 0,
              originX: "65px",
              originY: "60px"
            }}
          >
            <line x1="62" y1="65" x2="72" y2="55" stroke="#4A6FA5" strokeWidth="4" strokeLinecap="round" />
            <circle cx="74" cy="52" r="3" fill="#DEB887" />
          </motion.g>
          
          {/* Boots */}
          <ellipse cx="42" cy="85" rx="5" ry="3" fill="#8B4513" />
          <ellipse cx="58" cy="85" rx="5" ry="3" fill="#8B4513" />
          
          {/* Tool (pitchfork) - appears during work animation */}
          {farmerAnimation.work && (
            <motion.g
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
            >
              <line x1="72" y1="45" x2="82" y2="25" stroke="#A9A9A9" strokeWidth="3" />
              <line x1="82" y1="25" x2="86" y2="30" stroke="#A9A9A9" strokeWidth="3" />
              <line x1="86" y1="30" x2="78" y2="35" stroke="#A9A9A9" strokeWidth="3" />
            </motion.g>
          )}
        </svg>
      </motion.div>
    </motion.div>
  );

  // Image Gallery Modal
  const ImageModal = ({ image, onClose }) => {
    if (!image) return null;

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.8 }}
          className="relative max-w-5xl w-full h-[80vh]"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute -top-12 right-0 text-white hover:text-red-500 transition-colors"
          >
            <FiX className="w-8 h-8" />
          </button>
          <div className="relative w-full h-full">
            <Image
              src={image}
              alt={`${study.title} gallery image`}
              fill
              className="object-contain"
              onError={() => handleImageError(image)}
            />
          </div>
        </motion.div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-white relative overflow-x-hidden">
      {/* Image Modal */}
      <ImageModal 
        image={selectedImage} 
        onClose={() => setSelectedImage(null)} 
      />

      {/* Farmer Animation - Only show for agriculture-related categories */}
      {study.category && (
        study.category.toLowerCase().includes('agriculture') || 
        study.category.toLowerCase().includes('farm') || 
        study.category.toLowerCase().includes('agri')
      ) && <FarmerAnimation />}

      {/* Back Navigation with enhanced hover */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24">
        <motion.div
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <Link href="/casestudies" className="inline-flex items-center gap-1 sm:gap-2 text-gray-600 hover:text-red-600 transition-colors font-['Manrope'] text-xs sm:text-sm group">
            <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back to Case Studies
          </Link>
        </motion.div>
      </div>

      {/* Hero Section */}
      <section className="relative py-8 sm:py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center">
            
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="order-2 lg:order-1"
            >
              <motion.div
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                className="inline-block mb-3 sm:mb-4"
              >
                <span className="bg-red-600 text-white px-3 py-1 sm:px-4 sm:py-2 rounded-full text-[10px] sm:text-xs font-['Manrope'] shadow-md hover:shadow-xl transition-shadow">
                  {study.category}
                </span>
              </motion.div>
              
              <motion.h1 
                className="font-['Marcellus'] text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-gray-900 mb-4 sm:mb-6 leading-tight"
                transition={{ type: "spring", stiffness: 300, damping: 10 }}
              >
                {study.title}
              </motion.h1>
              
              <p className="font-['Manrope'] text-gray-600 text-sm sm:text-base md:text-lg mb-6 sm:mb-8 leading-relaxed">
                {study.fullDescription || study.description}
              </p>
              
              {/* Quick Info with hover effects */}
              <div className="flex flex-wrap gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8">
                {[
                  { icon: FiCalendar, text: study.date || "2024" },
                  { icon: FiTag, text: study.industry || study.category },
                  ...(study.role ? [{ icon: FiUsers, text: study.role }] : [])
                ].map((item, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ y: -2, scale: 1.05 }}
                    className="flex items-center gap-1 sm:gap-2 cursor-default"
                  >
                    <item.icon className="text-red-600 w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="font-['Manrope'] text-xs sm:text-sm text-gray-600">{item.text}</span>
                  </motion.div>
                ))}
              </div>

              {/* Stats Grid with enhanced hover */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8">
                {study.stats.map((stat, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    whileHover={{ 
                      y: -5,
                      scale: 1.05,
                      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                    }}
                    className="bg-gray-50 p-3 sm:p-4 rounded-lg sm:rounded-xl cursor-default group"
                  >
                    <motion.div 
                      className="font-['Marcellus'] text-xl sm:text-2xl md:text-3xl font-bold text-red-600"
                      whileHover={{ scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      {stat.value}
                    </motion.div>
                    <div className="font-['Manrope'] text-[10px] sm:text-xs text-gray-500 group-hover:text-gray-700 transition-colors">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right Image with enhanced hover - Only render if mainImage exists */}
            {mainImage && (
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                whileHover={{ scale: 1.02, rotateY: 5 }}
                className="relative h-[250px] sm:h-[300px] md:h-[350px] lg:h-[450px] xl:h-[500px] rounded-xl sm:rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 shadow-xl order-1 lg:order-2 group cursor-pointer"
                onClick={() => setSelectedImage(mainImage)}
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                  className="w-full h-full"
                >
                  <Image
                    src={getImageSource(mainImage, study.title)}
                    alt={study.title}
                    fill
                    className="object-cover"
                    onError={() => handleImageError(mainImage)}
                  />
                </motion.div>
                
                {/* Number Badge with hover effect */}
                <motion.div 
                  className="absolute bottom-4 sm:bottom-6 right-4 sm:right-6 hidden sm:block"
                  whileHover={{ scale: 1.2, rotate: 5 }}
                >
                  <span className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-['Marcellus'] font-black text-black/10 group-hover:text-red-600/20 transition-colors">
                    {study.number}
                  </span>
                </motion.div>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Challenge & Solution with enhanced cards */}
      {(study.challenge || study.solution) && (
        <section className="py-12 sm:py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
              {study.challenge && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  whileHover={{ 
                    y: -8,
                    boxShadow: "0 25px 30px -12px rgba(220, 38, 38, 0.25)"
                  }}
                  className="bg-white p-5 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl shadow-lg transition-all duration-300 border-2 border-transparent group"
                >
                  <motion.h2 
                    className="font-['Marcellus'] text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 group-hover:text-red-600 transition-colors"
                    whileHover={{ x: 5 }}
                  >
                    The Challenge
                  </motion.h2>
                  <p className="font-['Manrope'] text-sm sm:text-base text-gray-600 leading-relaxed group-hover:text-gray-900 transition-colors">
                    {study.challenge}
                  </p>
                </motion.div>
              )}
              
              {study.solution && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  whileHover={{ 
                    y: -8,
                    boxShadow: "0 25px 30px -12px rgba(220, 38, 38, 0.25)"
                  }}
                  className="bg-white p-5 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl shadow-lg transition-all duration-300 border-2 border-transparent group"
                >
                  <motion.h2 
                    className="font-['Marcellus'] text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 group-hover:text-red-600 transition-colors"
                    whileHover={{ x: 5 }}
                  >
                    The Solution
                  </motion.h2>
                  <p className="font-['Manrope'] text-sm sm:text-base text-gray-600 leading-relaxed group-hover:text-gray-900 transition-colors">
                    {study.solution}
                  </p>
                </motion.div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Key Features with enhanced cards */}
      {study.features && study.features.length > 0 && (
        <section className="py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader
              heading="Key Features"
              gradientHeading={true}
              gradientFrom="from-black"
              gradientVia="via-red-600"
              gradientTo="to-gray-900"
              alignment="center"
              descriptionColor="text-gray-600"
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mt-8 sm:mt-12">
              {study.features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ 
                    x: 10,
                    backgroundColor: "#FEF2F2",
                    boxShadow: "0 10px 15px -3px rgba(220, 38, 38, 0.1)"
                  }}
                  className="flex items-start gap-2 sm:gap-3 p-3 sm:p-4 bg-gray-50 rounded-lg sm:rounded-xl transition-all duration-300 cursor-default group"
                  onHoverStart={() => setHoveredCard(`feature-${index}`)}
                  onHoverEnd={() => setHoveredCard(null)}
                >
                  <motion.div
                    animate={{ 
                      scale: hoveredCard === `feature-${index}` ? 1.2 : 1
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <FiCheckCircle className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-red-600 flex-shrink-0 mt-0.5" />
                  </motion.div>
                  <span className="font-['Manrope'] text-xs sm:text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
                    {feature}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Technologies Used with enhanced hover */}
      {study.technologies && study.technologies.length > 0 && (
        <section className="py-12 sm:py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader
              heading="Technologies Used"
              gradientHeading={true}
              gradientFrom="from-black"
              gradientVia="via-red-600"
              gradientTo="to-gray-900"
              alignment="center"
              descriptionColor="text-gray-600"
            />
            
            <div className="flex flex-wrap gap-2 sm:gap-3 justify-center mt-8 sm:mt-12">
              {study.technologies.map((tech, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ 
                    scale: 1.15,
                    y: -5,
                    backgroundColor: "#DC2626",
                    color: "#FFFFFF"
                  }}
                  className="px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 bg-white rounded-full shadow-sm sm:shadow-md font-['Manrope'] text-[10px] sm:text-xs text-gray-700 border border-gray-200 transition-all duration-300 cursor-default"
                >
                  <motion.span
                    animate={{ rotate: hoveredCard === `tech-${index}` ? 360 : 0 }}
                  >
                    <FiCode className="inline w-2 h-2 sm:w-3 sm:h-3 mr-1 transition-colors group-hover:text-white" />
                  </motion.span>
                  {tech}
                </motion.span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Mission & Impact with enhanced cards */}
      {(study.mission || study.impact) && (
        <section className="py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
              {study.mission && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  whileHover={{ 
                    scale: 1.02,
                    boxShadow: "0 25px 30px -12px rgba(220, 38, 38, 0.3)"
                  }}
                  className="bg-gradient-to-br from-red-600/5 to-red-500/5 p-5 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl border-2 border-red-600/10 transition-all duration-300 group"
                >
                  <motion.h2 
                    className="font-['Marcellus'] text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 group-hover:text-red-600 transition-colors"
                    whileHover={{ x: 5 }}
                  >
                    Mission
                  </motion.h2>
                  <p className="font-['Manrope'] text-sm sm:text-base text-gray-700 leading-relaxed italic group-hover:text-gray-900 transition-colors">
                    "{study.mission}"
                  </p>
                </motion.div>
              )}
              
              {study.impact && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  whileHover={{ 
                    scale: 1.02,
                    boxShadow: "0 25px 30px -12px rgba(220, 38, 38, 0.3)"
                  }}
                  className="bg-gradient-to-br from-red-600/5 to-red-500/5 p-5 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl border-2 border-red-600/10 transition-all duration-300 group"
                >
                  <motion.h2 
                    className="font-['Marcellus'] text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 group-hover:text-red-600 transition-colors"
                    whileHover={{ x: 5 }}
                  >
                    Impact
                  </motion.h2>
                  <p className="font-['Manrope'] text-sm sm:text-base text-gray-700 leading-relaxed group-hover:text-gray-900 transition-colors">
                    {study.impact}
                  </p>
                </motion.div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Founder Quote with enhanced hover */}
      {study.founder && (
        <section className="py-12 sm:py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
              className="relative group cursor-default"
            >
              <motion.svg 
                className="absolute top-0 left-0 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-red-600/20 -translate-x-3 sm:-translate-x-4 md:-translate-x-6 -translate-y-3 sm:-translate-y-4 md:-translate-y-6 group-hover:text-red-600/40 transition-colors"
                fill="currentColor" 
                viewBox="0 0 24 24"
                animate={{ rotate: hoveredCard === 'quote' ? [0, 5, -5, 0] : 0 }}
              >
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </motion.svg>
              <p className="font-['Manrope'] text-base sm:text-lg md:text-xl text-gray-700 mb-3 sm:mb-4 italic px-4 sm:px-8 md:px-12 group-hover:text-gray-900 transition-colors">
                "Working with WebMavine was a game-changer. They understood our vision and delivered beyond expectations."
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3">
                <div className="text-center sm:text-left">
                  <p className="font-['Marcellus'] text-base sm:text-lg font-bold text-gray-900 group-hover:text-red-600 transition-colors">
                    {study.founder.name}
                  </p>
                  <p className="font-['Manrope'] text-xs sm:text-sm text-gray-500 group-hover:text-gray-700 transition-colors">
                    {study.founder.title}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Image Gallery Section - Only render if there are images */}
      {totalImages > 0 && (
        <section className="py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader
              heading="Project Gallery"
              subheading="Explore the full story through these snapshots"
              gradientHeading={true}
              gradientFrom="from-black"
              gradientVia="via-red-600"
              gradientTo="to-gray-900"
              alignment="center"
              descriptionColor="text-gray-600"
            />
            
            <div className={`grid ${totalImages === 1 ? 'grid-cols-1' : totalImages === 2 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-3'} gap-4 sm:gap-6 mt-8 sm:mt-12`}>
              {/* Main Image - Only render if exists */}
              {mainImage && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  whileHover={{ 
                    y: -10,
                    scale: 1.02,
                    boxShadow: "0 30px 35px -12px rgba(220, 38, 38, 0.3)"
                  }}
                  className="relative h-64 sm:h-72 md:h-80 rounded-xl overflow-hidden bg-gray-100 shadow-lg group cursor-pointer"
                  onClick={() => setSelectedImage(mainImage)}
                >
                  <Image
                    src={getImageSource(mainImage, `${study.title} Main`)}
                    alt={`${study.title} main view`}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={() => handleImageError(mainImage)}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-start p-4">
                    <span className="text-white font-['Manrope'] text-sm">Main View</span>
                  </div>
                </motion.div>
              )}

              {/* Gallery Images - Only render if they exist */}
              {galleryImages.map((image, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: (index + 1) * 0.1 }}
                  whileHover={{ 
                    y: -10,
                    scale: 1.02,
                    boxShadow: "0 30px 35px -12px rgba(220, 38, 38, 0.3)"
                  }}
                  className="relative h-64 sm:h-72 md:h-80  rounded-xl overflow-hidden bg-gray-100 shadow-lg group cursor-pointer"
                  onClick={() => setSelectedImage(image)}
                >
                  <Image
                    src={getImageSource(image, `${study.title} Gallery ${index + 1}`)}
                    alt={`${study.title} gallery image ${index + 1}`}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={() => handleImageError(image)}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-start p-4">
                    <span className="text-white font-['Manrope'] text-sm">View {index + 2}</span>
                  </div>
                </motion.div>
              ))}
            </div>

          </div>
        </section>
      )}

      {/* Related Case Studies with enhanced hover */}
      {relatedStudies.length > 0 && (
        <section className="py-12 sm:py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader
              smallHeading="More Success Stories"
              heading="Related Case Studies"
              description="Explore similar projects we've delivered for our clients"
              gradientHeading={true}
              gradientFrom="from-black"
              gradientVia="via-red-600"
              gradientTo="to-gray-900"
              alignment="center"
              smallHeadingColor="text-red-600"
              descriptionColor="text-gray-600"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8 mt-8 sm:mt-12">
              {relatedStudies.map((study, index) => (
                <motion.div
                  key={study.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ 
                    y: -10,
                    scale: 1.02,
                    boxShadow: "0 30px 35px -12px rgba(220, 38, 38, 0.3)"
                  }}
                  className="group cursor-pointer bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 relative"
                  onClick={() => window.location.href = `/casestudies/${study.slug}`}
                  onHoverStart={() => setHoveredCard(`related-${study.id}`)}
                  onHoverEnd={() => setHoveredCard(null)}
                >
                  <div className="relative h-40 sm:h-44 md:h-48 bg-gray-100 overflow-hidden">
                    <motion.div
                      animate={{ 
                        scale: hoveredCard === `related-${study.id}` ? 1.1 : 1,
                        rotate: hoveredCard === `related-${study.id}` ? 2 : 0
                      }}
                      transition={{ duration: 0.4 }}
                      className="w-full h-full"
                    >
                      <Image
                        src={getImageSource(study.image, study.title)}
                        alt={study.title}
                        fill
                        className="object-contain p-3 sm:p-4"
                        onError={() => handleImageError(study.image)}
                      />
                    </motion.div>
                    
                    {/* Overlay with external link icon */}
                    <motion.div 
                      className="absolute inset-0 bg-red-600/0 flex items-center justify-center"
                      whileHover={{ backgroundColor: "rgba(220, 38, 38, 0.1)" }}
                    >
                      <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ 
                          opacity: hoveredCard === `related-${study.id}` ? 1 : 0,
                          scale: hoveredCard === `related-${study.id}` ? 1 : 0.5
                        }}
                        transition={{ duration: 0.2 }}
                      >
                        <FiExternalLink className="w-8 h-8 text-red-600" />
                      </motion.div>
                    </motion.div>
                  </div>
                  
                  <div className="p-4 sm:p-5 md:p-6 relative">
                    <motion.span 
                      className="text-[10px] sm:text-xs font-['Manrope'] text-red-600 mb-1 sm:mb-2 block"
                      animate={{ 
                        x: hoveredCard === `related-${study.id}` ? 5 : 0
                      }}
                    >
                      {study.category}
                    </motion.span>
                    
                    <motion.h3 
                      className="font-['Marcellus'] text-lg sm:text-xl text-gray-900 mb-1 sm:mb-2 group-hover:text-red-600 transition-colors"
                      animate={{ 
                        x: hoveredCard === `related-${study.id}` ? 5 : 0
                      }}
                    >
                      {study.title}
                    </motion.h3>
                    
                    <p className="font-['Manrope'] text-xs sm:text-sm text-gray-600 line-clamp-2">
                      {study.description}
                    </p>
                    
                    {/* Learn more indicator */}
                    <motion.div 
                      className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
                      animate={{ 
                        x: hoveredCard === `related-${study.id}` ? 0 : 10
                      }}
                    >
                      <span className="text-xs text-red-600 font-['Manrope']">Learn more →</span>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      </div>
  );
}