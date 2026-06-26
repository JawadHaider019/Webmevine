"use client";

import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import SectionHeader from "./SectionHeader";
import Image from "next/image";

import { Quote, Star } from "lucide-react";

// Country flags using flagcdn.com for reliable flags
const countryFlags = {
  Romania: "https://flagcdn.com/ro.svg",
  "United States": "https://flagcdn.com/us.svg",
  "United Kingdom": "https://flagcdn.com/gb.svg",
  "Italy": "https://flagcdn.com/it.svg",
  "India": "https://flagcdn.com/in.svg",
  "Pakistan": "https://flagcdn.com/pk.svg",
  "South Africa": "https://flagcdn.com/sa.svg"

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
      quote: "WebMavine brought our AI-powered freelancing tool to life in record time. The platform they built generates high-converting proposals that actually work—our users are seeing 85% success rates. Their expertise in Bubble.io and AI integration made all the difference.",
      author: "Michael Roberts",
      rating: 5,
      location: "United States"
    },
    {

      id: 2,
      quote: "Before WebMavine, I was manually handling orders through Instagram. They built a beautiful e-commerce platform that automated everything. Now my customers love the seamless shopping experience, and I've finally escaped the chaos of social media order management.",
      author: "Mudasir ",
      rating: 5,
      location: "Pakistan"
    },

    {
      id: 3,
      quote: "Working with WebMavine on Zola was exceptional. They understood our vision for a unified business management platform and delivered a powerful Bubble.io solution in just 4 weeks. The automated review management and smart scheduling features have completely transformed how our beta users operate their businesses.",
      author: "David Ramos",
      rating: 5,
      location: "United States"

    },
    {
      id: 4,
      quote: "WebMavine delivered exactly what they promised—a comprehensive skill assessment platform with 250+ tests and AI-powered candidate ranking. The platform has 94% hiring accuracy, and our clients love how it eliminates bias from their recruitment process. Exceptional work delivered in just 4 weeks.",
      author: "James Wilson",
      rating: 5,
      location: "Italy"
    },
    {
      id: 5,
      quote: "Great experience! He worked quickly, responded fast, and understood exactly what was needed. Highly recommend!",
      author: "Alex Octa",
      rating: 5,
      location: "Romania"
    },
    {
      id: 6,
      quote: "I've worked with many freelancers before, but Muhammad genuinely stands out. His workflow was smooth, his communication was clear, and every delivery was spot-on. What impressed me most was his ability to think ahead and suggest smarter ways to approach the task. He's a rare combination of skill, strategy, and reliability. Working with him gave me total peace of mind. Highly recommended.",
      author: "Thomas",
      rating: 5,
      location: "United States"
    },
    {
      id: 7,
      quote: "Working with Muhammad was an outstanding experience from start to finish. He immediately grasped what I needed, even things I hadn't fully explained, and translated them into clean, professional, high-quality work. He was highly responsive, proactive with suggestions, and delivered ahead of schedule. It's rare to find someone who combines technical expertise, clear communication, and genuine care for the final result like Muhammad does. He exceeded expectations, and I'll absolutely work with him again.",
      author: "Fannin Mathew",
      rating: 5,
      location: "United States"
    },
    {
      id: 8,
      quote: "Always a pleasure working with mo, he is always professional and has a great ethic of work",
      author: "Diana Robinson",
      rating: 5,
      location: "United Kingdom"
    },
    {
      id: 9,
      quote: "Working with Muhammad Ahmad was an absolute pleasure! His code expertise and attention to detail truly SHINE, and his professionalism elevated the entire project. Plus, his quick responsiveness and cooperation made the process a BREEZE",
      author: "Martinez Cole",
      rating: 5,
      location: "United Kingdom"
    },
    {
      id: 10,
      quote: "i asking for more work and my second order, Is very good delivery on coding quality and timing. i likes to collaborate for my next order👍",
      author: "Paolo Sili",
      rating: 5,
      location: "Italy"
    },
    {
      id: 11,
      quote: "very fast and with good feel to code quality and delivery time.",
      author: "Paolo Sili",
      rating: 5,
      location: "Italy"
    },
    {
      id: 12,
      quote: "Great sense of understanding the platform and understands our need and over delivers",
      author: "United Mercy",
      rating: 5,
      location: "South Afica"
    },
    {
      id: 13,
      quote: "It is great working with Ahmad. He is very good at his job and goes beyond the work to be done and always available to support wherever required",
      author: "United Mercy",
      rating: 5,
      location: "South Afica"
    },
    {
      id: 14,
      quote: "Understood the project well and worked hand in hand throughout, well incorporated modifications.",
      author: "Sahil",
      rating: 5,
      location: "India"
    },
    {
      id: 15,
      quote: "I came back to him for a second project, and that honestly says everything. His attention to detail is on another level, and what I value most is the peace of mind. I never have to second-guess anything — he thinks ahead, catches issues early, and makes smart improvements that truly elevate the product. If you want someone who treats your project like a real business, not just a gig, he's the right choice. Reliable, professional, and genuinely comfortable to work with. I wouldn't hesitate to hire him again.",
      author: "Thomas",
      rating: 5,
      location: "United States"
    }
  ];

  // Duplicate testimonials for infinite scroll effect (3x for seamless loop)
  const duplicatedTestimonials = [
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
                        <Quote
                          className="w-20 h-20 text-red-600/15 rotate-180"
                        />
                      </div>

                      {/* Rating stars */}
                      <div className="flex gap-1 mb-4 relative z-10">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < testimonial.rating
                              ? 'text-yellow-400 fill-yellow-400'
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
                          <h3 className="font-['Marcellus'] text-base font-bold text-gray-900">
                            {testimonial.author}
                          </h3>
                          <div className="flex items-center gap-2">
                            {/* Flag image from flagcdn.com */}
                            {countryFlags[testimonial.location] && <div className="relative w-5 h-3.5 overflow-hidden rounded-sm shadow-sm">
                              <Image
                                src={countryFlags[testimonial.location]}
                                alt={`${testimonial.location} flag`}
                                fill
                                className="object-cover"
                                unoptimized
                              />
                            </div>}
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