"use client";

import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import SectionHeader from "./SectionHeader";
import Image from "next/image";

// Font Awesome imports
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faQuoteRight, 
  faStar
} from "@fortawesome/free-solid-svg-icons";

// Country flags using flagcdn.com for reliable flags
const countryFlags = {
  "Romania": "https://flagcdn.com/w20/ro.png",
  "United States": "https://flagcdn.com/w20/us.png",
  "United Kingdom": "https://flagcdn.com/w20/gb.png",
  "Italy": "https://flagcdn.com/w20/it.png",
  "India": "https://flagcdn.com/w20/in.png"
};

export default function Testimonials() {
  const [isPaused, setIsPaused] = useState(false);
  const [currentX, setCurrentX] = useState(-1920);
  const scrollRef = useRef(null);
  const [width, setWidth] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // Check if mobile on mount and when window resizes
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const testimonials = [
    {
      id: 1,
      quote: "Great experience! He worked quickly, responded fast, and understood exactly what was needed. Highly recommend!",
      author: "alex_octa12",
      rating: 5,
      location: "Romania"
    },
    {
      id: 2,
      quote: "I've worked with many freelancers before, but Muhammad genuinely stands out. His workflow was smooth, his communication was clear, and every delivery was spot-on. What impressed me most was his ability to think ahead and suggest smarter ways to approach the task. He's a rare combination of skill, strategy, and reliability. Working with him gave me total peace of mind. Highly recommended.",
      author: "thomas5542",
      rating: 5,
      location: "United States"
    },
    {
      id: 3,
      quote: "Working with Muhammad was an outstanding experience from start to finish. He immediately grasped what I needed, even things I hadn't fully explained, and translated them into clean, professional, high-quality work. He was highly responsive, proactive with suggestions, and delivered ahead of schedule. It's rare to find someone who combines technical expertise, clear communication, and genuine care for the final result like Muhammad does. He exceeded expectations, and I'll absolutely work with him again.",
      author: "fanninmathew",
      rating: 5,
      location: "United States"
    },
    {
      id: 4,
      quote: "Always a pleasure working with mo, he is always professional and has a great ethic of work",
      author: "dianarobinso282",
      rating: 5,
      location: "United Kingdom"
    },
    {
      id: 5,
      quote: "Working with Muhammad Ahmad was an absolute pleasure! His code expertise and attention to detail truly SHINE, and his professionalism elevated the entire project. Plus, his quick responsiveness and cooperation made the process a BREEZE",
      author: "martinez_cole",
      rating: 5,
      location: "United Kingdom"
    },
    {
      id: 6,
      quote: "i asking for more work and my second order, Is very good delivery on coding quality and timing. i likes to collaborate for my next order👍",
      author: "paolosili",
      rating: 5,
      location: "Italy"
    },
    {
      id: 7,
      quote: "very fast and with good feel to code quality and delivery time.",
      author: "paolosili",
      rating: 5,
      location: "Italy"
    },
    {
      id: 8,
      quote: "Great sense of understanding the platform and understands our need and over delivers",
      author: "unitedmercy",
      rating: 5,
      location: "India"
    },
    {
      id: 9,
      quote: "It is great working with Ahmad. He is very good at his job and goes beyond the work to be done and always available to support wherever required",
      author: "unitedmercy",
      rating: 5,
      location: "India"
    },
    {
      id: 10,
      quote: "Understood the project well and worked hand in hand throughout, well incorporated modifications.",
      author: "Sahil",
      rating: 5,
      location: "India"
    },
    {
      id: 11,
      quote: "I came back to him for a second project, and that honestly says everything. His attention to detail is on another level, and what I value most is the peace of mind. I never have to second-guess anything — he thinks ahead, catches issues early, and makes smart improvements that truly elevate the product. If you want someone who treats your project like a real business, not just a gig, he's the right choice. Reliable, professional, and genuinely comfortable to work with. I wouldn't hesitate to hire him again.",
      author: "thomas5542",
      rating: 5,
      location: "United States"
    }
  ];

  // Duplicate testimonials for infinite scroll effect (6x for seamless loop)
  const duplicatedTestimonials = [
    ...testimonials, 
    ...testimonials, 
    ...testimonials,
    ...testimonials, 
    ...testimonials, 
    ...testimonials
  ];

  useEffect(() => {
    if (scrollRef.current) {
      setWidth(scrollRef.current.scrollWidth / 4);
    }
  }, []);

  // Handle pause (hover on desktop, touch on mobile)
  const handlePause = () => {
    if (scrollRef.current && !isDragging) {
      const transform = window.getComputedStyle(scrollRef.current).transform;
      if (transform !== 'none') {
        const matrix = new DOMMatrix(transform);
        setCurrentX(matrix.m41);
      }
    }
    setIsPaused(true);
  };

  // Handle resume
  const handleResume = () => {
    if (!isDragging) {
      setIsPaused(false);
    }
  };

  // Drag handlers for mobile
  const handleDragStart = (event, info) => {
    setDragStartX(info.point.x);
    setIsDragging(true);
    handlePause();
  };

  const handleDrag = (event, info) => {
    setDragOffset(info.offset.x);
  };

  const handleDragEnd = (event, info) => {
    setIsDragging(false);
    
    // Update currentX based on drag
    if (scrollRef.current) {
      const transform = window.getComputedStyle(scrollRef.current).transform;
      if (transform !== 'none') {
        const matrix = new DOMMatrix(transform);
        setCurrentX(matrix.m41);
      }
    }
    
    // Small delay before resuming auto-scroll
    setTimeout(() => {
      if (!isPaused) {
        setIsPaused(false);
      }
    }, 100);
  };

  // Touch events - only used on mobile
  const touchHandlers = isMobile ? {
    onTouchStart: (e) => {
      e.preventDefault();
      handlePause();
    },
    onTouchEnd: (e) => {
      e.preventDefault();
      handleResume();
    },
    onTouchCancel: (e) => {
      e.preventDefault();
      handleResume();
    },
  } : {};

  return (
    <section className="py-16 bg-gradient-to-b from-white via-gray-50 to-white relative overflow-hidden">
      {/* Luxury Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Subtle pattern */}
        <div className="absolute inset-0 opacity-[0.02]" 
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #000 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      <div className="relative z-10 max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with animation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <SectionHeader
            smallHeading="Client Stories"
            heading="Trusted by Innovators"
            description="What our partners say about their journey with us"
            gradientHeading={true}
            gradientFrom="from-black"
            gradientVia="via-red-600"
            gradientTo="to-gray-900"
            smallHeadingColor="text-red-600"
            descriptionColor="text-gray-600"
          />
        </motion.div>

        {/* Running Carousel Container */}
        <div className="mt-16 relative">
          {/* Gradient fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-5 bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-5 bg-gradient-to-l from-white via-white/80 to-transparent z-10 pointer-events-none" />

          {/* Running carousel */}
          <div className="overflow-hidden">
            <motion.div
              ref={scrollRef}
              animate={!isPaused && !isDragging ? {
                x: [currentX, currentX - width],
              } : {
                x: currentX + (isDragging ? dragOffset : 0)
              }}
              transition={!isPaused && !isDragging ? {
                x: {
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 120,
                  ease: "linear",
                  repeatDelay: 0
                }
              } : {
                duration: 0.1,
                ease: "linear"
              }}
              // Desktop hover events (always enabled)
              onHoverStart={handlePause}
              onHoverEnd={handleResume}
              // Mobile touch events (only enabled on mobile)
              {...touchHandlers}
              className={`flex gap-6 ${isMobile ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'}`}
              style={{ width: "fit-content", touchAction: isMobile ? "pan-y" : "auto" }}
              // Enable dragging only on mobile
              drag={isMobile ? "x" : false}
              dragConstraints={false}
              dragElastic={0.1}
              dragMomentum={false}
              onDragStart={handleDragStart}
              onDrag={handleDrag}
              onDragEnd={handleDragEnd}
              whileDrag={{ scale: 1 }}
            >
              {duplicatedTestimonials.map((testimonial, index) => (
                <motion.div
                  key={`${testimonial.id}-${index}`}
                  className="min-w-[350px] md:min-w-[400px] lg:min-w-[450px] select-none"
                  whileTap={isMobile ? { scale: 0.98 } : undefined}
                >
                  {/* Testimonial Card */}
                  <div className="relative h-[280px] my-5">
                    {/* Card */}
                    <div className="relative h-full bg-white/90 backdrop-blur-sm p-8 rounded-2xl border border-gray-100 shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
                      
                      {/* Large Quote Icon */}
                      <div className="absolute top-4 right-4">
                        <FontAwesomeIcon 
                          icon={faQuoteRight} 
                          className="w-20 h-20 text-red-600/15"
                        />
                      </div>

                      {/* Rating stars */}
                      <div className="flex gap-1 mb-4 relative z-10">
                        {[...Array(5)].map((_, i) => (
                          <FontAwesomeIcon 
                            key={i}
                            icon={faStar} 
                            className={`w-4 h-4 ${
                              i < testimonial.rating
                                ? 'text-yellow-400'
                                : 'text-gray-200'
                            }`}
                          />
                        ))}
                      </div>

                      {/* Quote */}
                      <div className="flex-1 relative z-10">
                        <p className="font-['Manrope'] text-gray-700 text-sm leading-relaxed line-clamp-4">
                          "{testimonial.quote}"
                        </p>
                      </div>

                      {/* Author info with flag */}
                      <div className="pt-4 border-t border-gray-100 mt-4 relative z-10">
                        <div className="flex items-center justify-between">
                          <h4 className="font-['Marcellus'] text-base font-bold text-gray-900">
                            {testimonial.author}
                          </h4>
                          <div className="flex items-center gap-2">
                            {/* Flag image from flagcdn.com */}
                            <div className="relative w-5 h-3.5 overflow-hidden rounded-sm shadow-sm">
                              <Image
                                src={countryFlags[testimonial.location]}
                                alt={`${testimonial.location} flag`}
                                fill
                                className="object-cover"
                                unoptimized
                              />
                            </div>
                            <span className="font-['Manrope'] text-xs text-gray-500">
                              {testimonial.location}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}