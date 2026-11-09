'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Search,
  Clock,
  Calendar,
  ArrowRight,
  Sparkles,
  BookOpen,
  Star,
  ShieldCheck,
} from 'lucide-react';
import { getAllBlogPosts } from '@/utils/blogUtils';
import { blogPosts as fallbackPosts } from '@/data/blogData';

export default function BlogListingPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function loadBlogs() {
      setLoading(true);
      try {
        const fetched = await getAllBlogPosts({ status: 'published' });
        if (fetched && fetched.length > 0) {
          setPosts(fetched);
        } else {
          setPosts(fallbackPosts.filter((p) => p.status === 'published'));
        }
      } catch (err) {
        console.error('Error loading blogs, falling back to static data:', err);
        setPosts(fallbackPosts.filter((p) => p.status === 'published'));
      } finally {
        setLoading(false);
      }
    }
    loadBlogs();
  }, []);

  const categories = useMemo(() => {
    const unique = new Set(posts.map((p) => p.category).filter(Boolean));
    return ['All', ...Array.from(unique)];
  }, [posts]);

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesCat =
        selectedCategory === 'All' || post.category === selectedCategory;
      if (!matchesCat) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      return (
        (post.title || '').toLowerCase().includes(q) ||
        (post.excerpt || '').toLowerCase().includes(q) ||
        (post.metaDescription || '').toLowerCase().includes(q) ||
        (post.category || '').toLowerCase().includes(q) ||
        (post.author || '').toLowerCase().includes(q)
      );
    });
  }, [posts, selectedCategory, searchQuery]);

  // Featured post (either explicitly marked featured or the newest post) when not searching
  const featuredPost = useMemo(() => {
    if (searchQuery.trim() || selectedCategory !== 'All') return null;
    return filteredPosts.find((p) => p.featured) || filteredPosts[0] || null;
  }, [filteredPosts, searchQuery, selectedCategory]);

  const gridPosts = useMemo(() => {
    if (!featuredPost) return filteredPosts;
    return filteredPosts.filter((p) => (p.slug || p.id) !== (featuredPost.slug || featuredPost.id));
  }, [filteredPosts, featuredPost]);

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      {/* 1. LUXURY HERO SECTION */}
      <section className="relative bg-zinc-950 text-white py-20 sm:py-24 px-4 sm:px-6 lg:px-10 overflow-hidden border-b border-zinc-800">
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle at 2px 2px, rgba(220,38,38,0.45) 1px, transparent 0)',
            backgroundSize: '36px 36px',
          }}
        />
        <div className="absolute -top-32 right-1/4 w-96 h-96 rounded-full bg-red-600/15 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-600/15 border border-red-500/30 text-red-400 text-xs font-bold uppercase tracking-widest mb-5">
              <Sparkles className="w-3.5 h-3.5" /> WebMavien Engineering & AI Insights
            </span>
            <h1 className="font-['Marcellus'] text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white max-w-4xl mx-auto leading-[1.12]">
              Architecting the Future of <span className="text-red-500">Web & AI</span>
            </h1>
            <p className="text-zinc-400 text-base sm:text-lg max-w-2xl mx-auto mt-5 leading-relaxed">
              Deep-dive technical guides, SaaS architecture blueprints, AI agent workflows, and programmatic SEO playbooks written by our senior engineering team.
            </p>

            {/* Live Search Bar */}
            <div className="max-w-xl mx-auto mt-8 relative">
              <Search className="w-4 h-4 text-zinc-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles by topic, stack, or keyword..."
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-sm text-white placeholder-zinc-400 focus:outline-none focus:bg-white/15 focus:border-red-500 transition-all"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. CATEGORY FILTER BAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 -mt-6 relative z-20">
        <div className="bg-white rounded-2xl border border-zinc-200/90 p-3 sm:px-5 shadow-md flex items-center justify-between gap-4 overflow-x-auto">
          <div className="flex items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 hover:text-zinc-950'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <span className="text-xs font-semibold text-zinc-400 whitespace-nowrap hidden md:inline">
            {filteredPosts.length} {filteredPosts.length === 1 ? 'Article' : 'Articles'}
          </span>
        </div>
      </section>

      {/* 3. FEATURED ARTICLE SPOTLIGHT + GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-12 sm:py-16 space-y-14">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="bg-white rounded-2xl border border-zinc-200 overflow-hidden h-96 animate-pulse flex flex-col"
              >
                <div className="h-48 bg-zinc-200" />
                <div className="p-6 space-y-3 flex-1">
                  <div className="h-4 bg-zinc-200 rounded w-1/3" />
                  <div className="h-6 bg-zinc-200 rounded w-4/5" />
                  <div className="h-4 bg-zinc-200 rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="bg-white rounded-3xl border border-zinc-200 p-16 text-center max-w-lg mx-auto space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto">
              <BookOpen className="w-6 h-6" />
            </div>
            <h2 className="font-['Marcellus'] text-2xl font-bold text-zinc-950">
              No matching articles found
            </h2>
            <p className="text-sm text-zinc-500">
              Try clearing your search filter or selecting another category.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="px-5 py-2.5 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700 transition-colors"
            >
              Show All Articles
            </button>
          </div>
        ) : (
          <>
            {/* Featured Spotlight Card */}
            {featuredPost && (
              <Link
                href={`/blog/${featuredPost.slug}`}
                className="group block bg-white rounded-3xl border border-zinc-200/90 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12">
                  <div className="lg:col-span-7 relative min-h-[280px] sm:min-h-[380px] overflow-hidden bg-zinc-900">
                    <img
                      src={
                        featuredPost.imageUrl ||
                        featuredPost.image_url ||
                        'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop&q=80'
                      }
                      alt={featuredPost.altText || featuredPost.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-4 left-4 flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-red-600 text-white text-xs font-bold uppercase tracking-wider shadow">
                        <Star className="w-3 h-3 fill-current" /> Featured Guide
                      </span>
                      <span className="px-3 py-1 rounded-full bg-black/75 backdrop-blur-md text-white text-xs font-semibold">
                        {featuredPost.category || 'Engineering'}
                      </span>
                    </div>
                  </div>

                  <div className="lg:col-span-5 p-6 sm:p-10 flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 text-xs text-zinc-500">
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-red-600" />
                          {featuredPost.createdAt
                            ? new Date(featuredPost.createdAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })
                            : ''}
                        </span>
                        <span>•</span>
                        <span className="inline-flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-zinc-400" />
                          {featuredPost.read_time || `${featuredPost.readTime || 5} Min. Read`}
                        </span>
                      </div>

                      <h2 className="font-['Marcellus'] text-2xl sm:text-3xl font-bold text-zinc-950 group-hover:text-red-600 transition-colors leading-snug">
                        {featuredPost.title}
                      </h2>

                      <p className="text-sm text-zinc-600 leading-relaxed line-clamp-3">
                        {featuredPost.metaDescription || featuredPost.excerpt}
                      </p>
                    </div>

                    <div className="pt-6 mt-6 border-t border-zinc-100 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-zinc-950 text-white text-xs font-bold flex items-center justify-center">
                          {(featuredPost.author || 'WM')
                            .split(' ')
                            .map((n) => n[0])
                            .join('')
                            .slice(0, 2)}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-zinc-900 flex items-center gap-1">
                            {featuredPost.author || 'WebMavien Engineering Team'}
                            <ShieldCheck className="w-3.5 h-3.5 text-red-600" />
                          </p>
                        </div>
                      </div>

                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 group-hover:gap-2.5 transition-all">
                        Read Full Guide <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            )}

            {/* 3-Column Article Grid */}
            {gridPosts.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
                {gridPosts.map((post, idx) => (
                  <motion.article
                    key={post.slug || post.id || idx}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: idx * 0.05 }}
                    className="group bg-white rounded-2xl overflow-hidden border border-zinc-200/90 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
                  >
                    <Link href={`/blog/${post.slug}`} className="flex flex-col flex-1">
                      <div className="relative h-52 overflow-hidden bg-zinc-100">
                        <img
                          src={
                            post.imageUrl ||
                            post.image_url ||
                            'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80'
                          }
                          alt={post.altText || post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                        <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/95 backdrop-blur-xs text-zinc-950 text-[11px] font-bold shadow-xs">
                          {post.category || 'Engineering'}
                        </span>
                      </div>

                      <div className="p-6 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-3 text-[11px] text-zinc-400 font-medium mb-2.5">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-red-600" />
                              {post.createdAt
                                ? new Date(post.createdAt).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric',
                                  })
                                : ''}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {post.read_time || `${post.readTime || 5} Min. Read`}
                            </span>
                          </div>

                          <h3 className="font-['Marcellus'] text-xl font-bold text-zinc-950 group-hover:text-red-600 transition-colors line-clamp-2 leading-snug mb-2.5">
                            {post.title}
                          </h3>

                          <p className="text-xs sm:text-[13.5px] text-zinc-600 line-clamp-3 leading-relaxed">
                            {post.metaDescription || post.excerpt}
                          </p>
                        </div>

                        <div className="pt-4 mt-5 border-t border-zinc-100 flex items-center justify-between">
                          <span className="text-xs font-semibold text-zinc-700 truncate max-w-[160px]">
                            {post.author || 'WebMavien Team'}
                          </span>
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-red-600 group-hover:gap-2 transition-all">
                            Read Article <ArrowRight className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  </motion.article>
                ))}
              </div>
            )}
          </>
        )}
      </section>

      {/* 4. BOTTOM CONVERSION BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pb-20">
        <div className="rounded-3xl bg-gradient-to-br from-black via-zinc-900 to-red-950 p-8 sm:p-12 lg:p-16 text-white shadow-2xl relative overflow-hidden border border-red-500/20 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="absolute -right-16 -bottom-16 w-72 h-72 rounded-full bg-red-600/20 blur-3xl pointer-events-none" />
          <div className="max-w-2xl relative z-10">
            <span className="inline-block px-3 py-1 rounded-full bg-red-600/20 border border-red-500/30 text-red-400 text-xs font-bold uppercase tracking-widest mb-3">
              WebMavien Engineering Partner
            </span>
            <h2 className="font-['Marcellus'] text-2xl sm:text-4xl font-bold text-white leading-tight mb-3">
              Ready to Turn These Blueprints Into Your Production Platform?
            </h2>
            <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
              Book a free 30-minute architecture & AI strategy session with our senior engineers to map out your timeline, stack, and ROI.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 relative z-10 shrink-0">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-7 py-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-lg shadow-red-600/25 transition-all"
            >
              Book Free Consultation <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/casestudies"
              className="inline-flex items-center gap-2 px-6 py-4 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-sm border border-white/15 transition-all"
            >
              View Case Studies
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
