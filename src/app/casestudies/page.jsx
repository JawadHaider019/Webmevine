// app/case-studies/[slug]/page.jsx
"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { FiArrowLeft, FiCheckCircle, FiCalendar, FiTag } from "react-icons/fi";
import GlowingButton from "@/components/GlowingButton";

const caseStudies = [
  {
    id: 1,
    slug: "zola",
    category: "Business Management SaaS",
    title: "Zola",
    shortDescription: "An all-in-one business management platform to streamline communication, reviews, and scheduling.",
    fullDescription: "Zola is an all-in-one business management platform designed to streamline communication, manage customer reviews, and simplify scheduling. Built with Bubble.io, this powerful web application provides business owners with a centralized dashboard to handle chats, meetings, and customer feedback effortlessly—eliminating scattered tools and improving operational efficiency.",
    challenge: "Business owners struggle with disorganized chats, scattered meeting appointments, and inconsistent customer reviews—resulting in lost opportunities and inefficiencies.",
    solution: "By bringing all essential business interactions into a single, intuitive dashboard, Zola empowers business owners to stay on top of conversations, schedule appointments seamlessly, and manage their online reputation without hassle.",
    achievement: "We built a powerful Bubble.io platform with unified communication hub, automated review management, and smart scheduling—delivered in just 4 weeks.",
    stats: [
      { label: "Beta Users", value: "500+" },
      { label: "Efficiency Gain", value: "70%" }
    ],
    founder: {
      name: "David Ramos",
      title: "Founder & CEO"
    },
    image: "/casestudy/zola.png",
    number: "01",
    gradient: "from-gray-50 to-white",
    technologies: ["Bubble.io", "No-Code", "API Integrations"],
    features: [
      "Unified Communication Hub – Manage all business chats in one place, reducing missed conversations.",
      "Automated Review Management – Collect, respond to, and monitor customer reviews effortlessly.",
      "Smart Scheduling System – Easily set up and track meetings without back-and-forth emails.",
      "No-Code Customization – Fully built on Bubble.io, allowing for rapid enhancements and scalability.",
      "Seamless Business Workflow – Integrates various tools to streamline daily operations.",
      "User-Friendly Dashboard – Simple, intuitive, and designed for efficiency.",
      "Secure & Scalable – Ensures data privacy while allowing businesses to grow without tech limitations."
    ],
    mission: "Zola's mission is to simplify business management by integrating communication, scheduling, and reputation control into a single, powerful platform. With no-code technology at its core, it enables businesses to automate their workflows effortlessly—freeing up time to focus on growth.",
    impact: "Zola has transformed how businesses handle daily operations. By centralizing communication, automating appointment scheduling, and simplifying review management, it allows business owners to stay organized and responsive. With a no-code foundation, Zola ensures startups and enterprises can scale seamlessly—without technical bottlenecks—resulting in higher productivity, improved customer relationships, and better business growth.",
    date: "Apr. 2023 - Jun. 2023",
    role: "Senior Bubble Developer, No-Code Expert",
    service: "No-Code Development, Custom Development",
    industry: "Business Management, SaaS"
  },
  {
    id: 2,
    slug: "fivup-ai",
    category: "AI-Powered Freelancing Tool",
    title: "FivUp AI",
    shortDescription: "AI-powered tool helping freelancers optimize Fiverr and Upwork profiles with high-converting proposals.",
    fullDescription: "FivUp AI is an innovative AI-powered tool designed to help freelancers optimize their Fiverr and Upwork profiles. It simplifies the process of crafting high-quality job proposals, gig descriptions, and profile summaries, ensuring that freelancers stand out in competitive marketplaces.",
    challenge: "Freelancers struggle to craft compelling proposals and optimize their profiles, leading to low response rates and missed opportunities.",
    solution: "By leveraging advanced AI, FivUp AI generates high-converting proposals, gig descriptions, and profile summaries in seconds—eliminating hours of manual work.",
    achievement: "We built an AI platform generating optimized proposals, gig descriptions, and profile summaries using OpenAI—delivered in just 4 weeks.",
    stats: [
      { label: "Active Users", value: "1,000+" },
      { label: "Success Rate", value: "85%" }
    ],
    founder: {
      name: "Michael Roberts",
      title: "CEO, FivUp AI"
    },
    image: "/casestudy/fivupai.png",
    number: "02",
    gradient: "from-gray-50 to-white",
    technologies: ["React", "Node.js", "OpenAI API", "Tailwind CSS"],
    features: [
      "AI-Optimized Proposals – Generates persuasive job proposals tailored to specific client requirements.",
      "Gig Description Generator – Crafts compelling Fiverr gig descriptions optimized for higher visibility.",
      "Profile Summary Enhancements – Helps freelancers present themselves in the best possible way.",
      "Industry-Specific Templates – Pre-designed templates tailored for different niches.",
      "SEO Optimization – Ensures descriptions and titles align with Fiverr and Upwork algorithms.",
      "User-Friendly Dashboard – Minimal learning curve, enabling freelancers to get started instantly.",
      "Performance Analytics – Insights into proposal effectiveness and optimization suggestions."
    ],
    mission: "The mission behind FivUp AI is simple—to empower freelancers with AI-driven tools that eliminate guesswork and maximize their chances of success. Every feature is designed to help users create standout profiles, attract the right clients, and ultimately increase their income.",
    impact: "FivUp AI has transformed the way freelancers approach job proposals and profile optimization. By automating time-consuming tasks, it allows users to focus on their work while increasing their chances of landing high-quality projects. With AI-generated, high-converting content, freelancers experience improved response rates, stronger client engagement, and greater earning potential—giving them the confidence to grow their careers effortlessly.",
    date: "Nov. 2023 - Dec. 2024",
    role: "Web Developer, UI/UX Designer",
    service: "Web Development, AI Integration",
    industry: "Freelancing & Gig Economy, AI & Automation"
  },
  {
    id: 3,
    slug: "pure-clay",
    category: "E-Commerce & Organic Products",
    title: "Pure Clay",
    shortDescription: "E-commerce platform for organic food and skincare products with brand storytelling.",
    fullDescription: "Pure Clay is an e-commerce platform for organic food and skincare products with brand storytelling and educational content. The platform enables customers to easily browse and purchase oils, nuts, dates, and teas while learning about organic living.",
    challenge: "Outdated website design, manual order handling via social media (Instagram/Facebook), poor product presentation, and non-responsive design causing lost sales.",
    solution: "Modern e-commerce platform with clean organic aesthetic, automated ordering system, intuitive product categories, and mobile-responsive design.",
    achievement: "We launched a modern e-commerce platform with automated ordering, intuitive product catalog, and mobile-responsive design—delivered in just 4 weeks.",
    stats: [
      { label: "Products Launched", value: "50+" },
      { label: "Order Efficiency", value: "100%" }
    ],
    founder: {
      name: "Sarah Chen",
      title: "Founder, Pure Clay"
    },
    image: "/casestudy/pureclay.png",
    number: "03",
    gradient: "from-gray-50 to-white",
    technologies: ["React", "Node.js", "Express", "Tailwind CSS", "MongoDB"],
    features: [
      "Custom admin panel for managing products, blog, and orders",
      "Automated ordering system replacing manual social media order handling",
      "Product catalog with categories for Oils, Nuts, Dates, and Teas",
      "Blog section with organic food tips and cooking ideas",
      "Customer review and rating system for social proof",
      "Fast checkout process with minimal steps",
      "Mobile-responsive design for seamless shopping on all devices",
      "Product search and filtering by category and price",
      "Newsletter subscription for exclusive deals and recipes",
      "Stock availability indicators with low stock alerts"
    ],
    mission: "Pure Clay's mission is to make organic food and skincare accessible through a beautiful, intuitive e-commerce experience that educates and inspires customers.",
    impact: "The platform transformed Pure Clay's business—eliminating manual order management, providing seamless mobile shopping, and creating an organized product catalog that drives sales. With SEO-optimized content and improved user experience, the brand now reaches more customers and builds lasting relationships.",
    date: "2024",
    role: "Web Developer, UI/UX Designer",
    service: "Web Development, E-Commerce Development",
    industry: "E-Commerce, Organic Products"
  },
  {
    id: 4,
    slug: "fintalio",
    category: "HR & Recruitment SaaS",
    title: "Fintalio",
    shortDescription: "AI-powered skill assessment platform for data-driven recruitment decisions.",
    fullDescription: "Fintalio is a cutting-edge skill assessment platform designed to revolutionize hiring by enabling companies to make data-driven recruitment decisions. With AI-powered evaluations and a comprehensive test library, it ensures that businesses identify and hire top-tier talent with confidence and precision.",
    challenge: "Traditional hiring methods often rely too heavily on resumes, leading to biased decisions, mis-hires, and inefficient recruitment processes.",
    solution: "By offering 250+ pre-employment tests, AI-driven CV screening, and automated candidate ranking, Fintalio empowers recruiters to make smarter hiring decisions in a fraction of the time.",
    achievement: "We delivered a comprehensive skill assessment platform with AI-powered candidate ranking and 250+ pre-employment tests—delivered in just 4 weeks.",
    stats: [
      { label: "Tests Available", value: "250+" },
      { label: "Hiring Accuracy", value: "94%" }
    ],
    founder: {
      name: "James Wilson",
      title: "CEO, Fintalio"
    },
    image: "/casestudy/fintalio.png",
    number: "04",
    gradient: "from-gray-50 to-white",
    technologies: ["React", "Node.js", "AI/ML", "PostgreSQL", "Redis"],
    features: [
      "AI-Powered Candidate Ranking – Intelligent scoring system highlights top candidates instantly.",
      "250+ Skill-Based Assessments – Covers technical, cognitive, and behavioral skills across industries.",
      "Automated CV Screening – Quickly filters applications, saving recruiters valuable time.",
      "Bias-Free Hiring – Data-driven assessments ensure fair and objective evaluations.",
      "Custom Test Creation – Companies can design tailored assessments to fit specific roles.",
      "Real-Time Analytics & Insights – Detailed performance reports help refine hiring strategies.",
      "Seamless ATS Integration – Easily connects with existing recruitment tools for efficiency."
    ],
    mission: "Fintalio's mission is to eliminate hiring guesswork by leveraging AI and data-driven assessments—helping businesses build stronger teams, reduce mis-hires, and optimize their recruitment strategies.",
    impact: "Fintalio has redefined the hiring landscape by making recruitment smarter, faster, and bias-free. Companies using the platform experience reduced screening times, improved hiring accuracy, and stronger employee retention. With AI-driven insights and automated workflows, businesses can confidently select the best talent—leading to more efficient teams, cost savings, and long-term growth.",
    date: "Sep. 2023 - Dec. 2024",
    role: "Web Developer, AI Integration Specialist",
    service: "Web Development, Automation Implementation",
    industry: "HR & Recruitment, Enterprise SaaS"
  }
];

export default function CaseStudyDetail() {
  const params = useParams();
  const study = caseStudies.find(s => s.slug === params.slug);

  if (!study) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Case Study Not Found</h1>
          <Link href="/case-studies" className="text-red-600 hover:underline">
            Back to Case Studies
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Back Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <Link href="/case-studies" className="inline-flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors font-['Manrope']">
          <FiArrowLeft /> Back to Case Studies
        </Link>
      </div>

      {/* Hero Section */}
      <section className="relative py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-block mb-4">
                <span className="bg-red-600 text-white px-4 py-2 rounded-full text-sm font-['Manrope']">
                  {study.category}
                </span>
              </div>
              <h1 className="font-['Marcellus'] text-5xl md:text-6xl lg:text-7xl text-gray-900 mb-6">
                {study.title}
              </h1>
              <p className="font-['Manrope'] text-gray-600 text-lg mb-8 leading-relaxed">
                {study.fullDescription}
              </p>
              
              {/* Quick Info */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="flex items-center gap-2">
                  <FiCalendar className="text-red-600" />
                  <span className="font-['Manrope'] text-sm text-gray-600">{study.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiTag className="text-red-600" />
                  <span className="font-['Manrope'] text-sm text-gray-600">{study.industry}</span>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-6 mb-8">
                {study.stats.map((stat, idx) => (
                  <div key={idx}>
                    <div className="font-['Marcellus'] text-3xl font-bold text-red-600">{stat.value}</div>
                    <div className="font-['Manrope'] text-sm text-gray-500">{stat.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right Image */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="relative h-[400px] lg:h-[500px] rounded-2xl overflow-hidden bg-gray-100"
            >
              <Image
                src={study.image}
                alt={study.title}
                fill
                className="object-contain p-8"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Challenge & Solution */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-2xl shadow-lg"
            >
              <h2 className="font-['Marcellus'] text-2xl font-bold text-gray-900 mb-4">The Challenge</h2>
              <p className="font-['Manrope'] text-gray-600 leading-relaxed">{study.challenge}</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white p-8 rounded-2xl shadow-lg"
            >
              <h2 className="font-['Marcellus'] text-2xl font-bold text-gray-900 mb-4">The Solution</h2>
              <p className="font-['Manrope'] text-gray-600 leading-relaxed">{study.solution}</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-['Marcellus'] text-3xl md:text-4xl text-center text-gray-900 mb-12"
          >
            Key <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-500">Features</span>
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {study.features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-3"
              >
                <FiCheckCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                <span className="font-['Manrope'] text-gray-700">{feature}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Technologies Used */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-['Marcellus'] text-3xl md:text-4xl text-center text-gray-900 mb-12"
          >
            Technologies <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-500">Used</span>
          </motion.h2>
          
          <div className="flex flex-wrap gap-3 justify-center">
            {study.technologies.map((tech, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="px-4 py-2 bg-white rounded-full shadow-md font-['Manrope'] text-sm text-gray-700"
              >
                {tech}
              </motion.span>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Impact */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-red-600/5 to-red-500/5 p-8 rounded-2xl"
            >
              <h2 className="font-['Marcellus'] text-2xl font-bold text-gray-900 mb-4">Mission</h2>
              <p className="font-['Manrope'] text-gray-700 leading-relaxed italic">"{study.mission}"</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-red-600/5 to-red-500/5 p-8 rounded-2xl"
            >
              <h2 className="font-['Marcellus'] text-2xl font-bold text-gray-900 mb-4">Impact</h2>
              <p className="font-['Manrope'] text-gray-700 leading-relaxed">{study.impact}</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Founder Quote */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <svg className="absolute top-0 left-0 w-12 h-12 text-red-600/20 -translate-x-6 -translate-y-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
            </svg>
            <p className="font-['Manrope'] text-xl text-gray-700 mb-4 italic px-12">
              "Working with WebMavine was a game-changer. They understood our vision and delivered beyond expectations."
            </p>
            <div>
              <p className="font-['Marcellus'] text-lg font-bold text-gray-900">{study.founder.name}</p>
              <p className="font-['Manrope'] text-sm text-gray-500">{study.founder.title}</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-['Marcellus'] text-3xl md:text-4xl text-gray-900 mb-4">
              Ready to Build Something{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-500">
                Extraordinary?
              </span>
            </h2>
            <p className="font-['Manrope'] text-gray-600 mb-8 max-w-2xl mx-auto">
              Let's create your success story. Book a free strategy call and let's discuss your project.
            </p>
            <GlowingButton
              glowColor="200, 0, 0"
              spreadSize="small"
              speed="medium"
              waveCount={3}
              onClick={() => window.location.href = "/contact"}
            >
              Book Your Free Strategy Call
            </GlowingButton>
          </motion.div>
        </div>
      </section>
    </div>
  );
}