'use client';

import React, { useEffect, useState, useMemo, useRef } from 'react';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  Share2,
  ChevronRight,
  CheckCircle2,
  BookOpen,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  HelpCircle,
  ShieldCheck,
  List,
  Cpu,
  Layers,
  ThumbsUp,
  Check,
} from 'lucide-react';
import { parseArticleMarkdown, formatInlineText } from '@/utils/articleParser';
import { parseCmsSections, DEFAULT_CTA } from '@/utils/cmsSectionParser';

export default function ArticleClientView({
  slug,
  initialPost = null,
  initialParsed = null,
  initialRelated = [],
}) {
  const [post, setPost] = useState(initialPost);
  const [relatedPosts, setRelatedPosts] = useState(initialRelated);
  const [loading, setLoading] = useState(!initialPost);
  const [activeHeading, setActiveHeading] = useState('');
  const [copied, setCopied] = useState(false);
  const [helpfulVote, setHelpfulVote] = useState(null);
  const [readingProgress, setReadingProgress] = useState(0);
  const isProgrammaticScrollRef = useRef(false);
  const scrollAnimFrameRef = useRef(null);

  // Reading progress bar listener
  useEffect(() => {
    const onScroll = () => {
      const totalHeight =
        document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (totalHeight <= 0) return;
      const current = window.scrollY;
      setReadingProgress(Math.min(100, Math.max(0, (current / totalHeight) * 100)));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Client fallback fetch if not provided by SSR
  useEffect(() => {
    if (!slug || initialPost) return;
    setLoading(true);

    fetch(`/api/blogs/${encodeURIComponent(slug)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((found) => {
        if (found) {
          setPost(found);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug, initialPost]);

  const parsed = useMemo(() => {
    if (initialParsed && post?.content === initialPost?.content) {
      return initialParsed;
    }
    return parseArticleMarkdown(post?.content || '', { extractLead: true });
  }, [initialParsed, initialPost?.content, post?.content]);

  const cmsSections = useMemo(
    () => parseCmsSections(post?.content || ''),
    [post?.content]
  );

  const sidebarCta = useMemo(() => {
    const c = cmsSections?.cta || DEFAULT_CTA;
    return {
      heading: c.heading || DEFAULT_CTA.heading,
      description: c.description || DEFAULT_CTA.description,
      buttonText: c.buttonText || DEFAULT_CTA.buttonText,
      buttonLink: c.buttonLink || DEFAULT_CTA.buttonLink,
    };
  }, [cmsSections]);

  // Real-time Scrollspy for Table of Contents (60fps rAF throttled + programmatic scroll lock)
  useEffect(() => {
    if (!parsed.tocItems.length) return;

    let ticking = false;

    const computeActiveHeading = () => {
      ticking = false;
      if (isProgrammaticScrollRef.current) return;

      const headingElements = parsed.tocItems
        .map((item) => document.getElementById(item.id))
        .filter(Boolean);

      if (!headingElements.length) return;

      const scrollOffset = 180; // Reading line offset from viewport top
      let currentId = headingElements[0].id;

      for (const el of headingElements) {
        const rect = el.getBoundingClientRect();
        if (rect.top <= scrollOffset) {
          currentId = el.id;
        } else {
          break;
        }
      }

      // If scrolled near the very bottom of the page, activate the last heading
      if (
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 80
      ) {
        currentId = headingElements[headingElements.length - 1].id;
      }

      setActiveHeading((prev) => (prev !== currentId ? currentId : prev));
    };

    const onScrollOrResize = () => {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(computeActiveHeading);
      }
    };

    const cancelProgrammaticScroll = () => {
      if (scrollAnimFrameRef.current) {
        window.cancelAnimationFrame(scrollAnimFrameRef.current);
        scrollAnimFrameRef.current = null;
      }
      isProgrammaticScrollRef.current = false;
    };

    const timer = setTimeout(computeActiveHeading, 60);
    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize, { passive: true });
    window.addEventListener('wheel', cancelProgrammaticScroll, { passive: true });
    window.addEventListener('touchmove', cancelProgrammaticScroll, { passive: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', onScrollOrResize);
      window.removeEventListener('resize', onScrollOrResize);
      window.removeEventListener('wheel', cancelProgrammaticScroll);
      window.removeEventListener('touchmove', cancelProgrammaticScroll);
    };
  }, [parsed.tocItems]);

  const scrollToHeading = (id) => {
    const el = document.getElementById(id);
    if (!el) return;

    if (scrollAnimFrameRef.current) {
      window.cancelAnimationFrame(scrollAnimFrameRef.current);
    }

    isProgrammaticScrollRef.current = true;
    setActiveHeading(id);

    const startY = window.scrollY;
    const targetY = Math.max(0, el.getBoundingClientRect().top + startY - 110);
    const distance = targetY - startY;
    const duration = Math.min(680, Math.max(380, Math.abs(distance) * 0.35));
    const startTime = performance.now();

    const easeInOutCubic = (t) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    const step = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      const eased = easeInOutCubic(progress);

      window.scrollTo(0, startY + distance * eased);

      if (progress < 1) {
        scrollAnimFrameRef.current = window.requestAnimationFrame(step);
      } else {
        scrollAnimFrameRef.current = null;
        setTimeout(() => {
          isProgrammaticScrollRef.current = false;
        }, 60);
      }
    };

    scrollAnimFrameRef.current = window.requestAnimationFrame(step);
  };

  const handleShare = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    if (navigator.share) {
      try {
        await navigator.share({ title: post?.title, url });
        return;
      } catch {
        // Fallback to clipboard
      }
    }
    if (navigator.clipboard && url) {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-zinc-50 pt-10 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 animate-pulse space-y-8">
          <div className="h-[360px] rounded-3xl bg-zinc-200" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-4 h-96 rounded-2xl bg-zinc-200" />
            <div className="lg:col-span-8 space-y-4">
              <div className="h-8 bg-zinc-200 rounded w-3/4" />
              <div className="h-4 bg-zinc-200 rounded w-full" />
              <div className="h-4 bg-zinc-200 rounded w-5/6" />
              <div className="h-64 bg-zinc-200 rounded-2xl w-full mt-6" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!post) {
    return (
      <main className="min-h-screen bg-zinc-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl p-10 max-w-md w-full text-center border border-zinc-200 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto">
            <BookOpen className="w-6 h-6" />
          </div>
          <h1 className="font-['Marcellus'] text-2xl font-bold text-zinc-950">
            Article Not Found
          </h1>
          <p className="text-sm text-zinc-600">
            The requested blog article could not be found or may have been moved.
          </p>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Blog Overview
          </Link>
        </div>
      </main>
    );
  }

  const publishedDate = post.createdAt
    ? new Date(post.createdAt).toLocaleDateString('en-US', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        timeZone: 'UTC',
      })
    : '';

  const updatedDate = post.updatedAt
    ? new Date(post.updatedAt).toLocaleDateString('en-US', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        timeZone: 'UTC',
      })
    : publishedDate;

  const authorInitials = (post.author || 'WM')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <main className="min-h-screen bg-zinc-50 pb-24">
      {/* Top Reading Progress Indicator */}
      <div className="fixed top-0 left-0 right-0 h-1 z-50 bg-transparent pointer-events-none">
        <div
          className="h-full bg-gradient-to-r from-red-600 via-red-500 to-zinc-950 transition-all duration-150"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      {/* 1. HERO BANNER (Rounded Luxury Container) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-6 sm:pt-8">
        <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden min-h-[280px] sm:min-h-[380px] lg:min-h-[440px] flex items-end border border-zinc-900/15 shadow-[0_22px_55px_-22px_rgba(0,0,0,0.45)]">
          <img
            src={
              post.imageUrl ||
              post.image_url ||
              'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1600&auto=format&fit=crop&q=80'
            }
            alt={post.altText || post.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/70 to-black/25" />

          <div className="relative z-10 w-full p-6 sm:p-10 lg:p-14">
            <div className="max-w-4xl">
              <div className="flex flex-wrap items-center gap-2.5 mb-4">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-red-600 text-white text-xs font-bold uppercase tracking-wider shadow-sm">
                  {post.category || 'Engineering & AI'}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-white/90 text-xs font-medium border border-white/15">
                  <Clock className="w-3.5 h-3.5 text-red-400" />
                  {post.read_time || `${post.readTime || 5} Min. Read`}
                </span>
              </div>

              <h1 className="font-['Marcellus'] text-2xl sm:text-4xl lg:text-[44px] font-bold text-white leading-[1.16] tracking-tight">
                {post.title}
              </h1>

              {post.schemaCaption && (
                <p className="text-xs text-white/60 mt-3 italic">{post.schemaCaption}</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 2. BREADCRUMB + E-E-A-T TRUST & METADATA STRIP */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 mt-5">
        <div className="bg-white rounded-2xl border border-zinc-200/90 px-5 py-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Breadcrumbs */}
          <nav
            aria-label="Breadcrumb"
            className="flex items-center flex-wrap gap-1.5 text-xs text-zinc-500"
          >
            <Link href="/" className="hover:text-red-600 transition-colors font-medium">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
            <Link href="/blog" className="hover:text-red-600 transition-colors font-medium">
              Blog
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
            <span className="text-zinc-900 font-semibold truncate max-w-[240px] sm:max-w-[360px]">
              {post.breadcrumbTitle || post.title}
            </span>
          </nav>

          {/* Author, Published + Reviewed Date & Share */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-600">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-zinc-950 text-white font-bold flex items-center justify-center text-[11px] border border-red-500/30">
                {authorInitials}
              </div>
              <span className="font-semibold text-zinc-900 flex items-center gap-1">
                {post.author || 'WebMavien Engineering Team'}
                <ShieldCheck className="w-3.5 h-3.5 text-red-600" />
              </span>
            </div>

            {publishedDate && (
              <>
                <span className="text-zinc-300 hidden sm:inline">|</span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-red-600" />
                  Published: <strong className="text-zinc-900">{publishedDate}</strong>
                </span>
              </>
            )}

            {(parsed.standDate || updatedDate) && (
              <>
                <span className="text-zinc-300 hidden sm:inline">|</span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-50 text-red-700 font-semibold border border-red-100">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Reviewed: {parsed.standDate || updatedDate}
                </span>
              </>
            )}

            {post.chatGptLink && (
              <a
                href={post.chatGptLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-950 text-white hover:bg-red-600 font-semibold transition-all"
              >
                <Sparkles className="w-3.5 h-3.5 text-red-400" />
                Summarize in ChatGPT
              </a>
            )}

            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-50 hover:bg-red-600 hover:text-white text-zinc-700 font-semibold transition-all border border-zinc-200/80 cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" /> Link Copied
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" /> Share
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 3. TWO-COLUMN LAYOUT: LEFT STICKY SIDEBAR (TOC + CTA) + RIGHT ARTICLE CONTENT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 mt-8 sm:mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* =========================================================
              LEFT COLUMN (Sticky Table of Contents + Conversion Cards)
             ========================================================= */}
          <aside className="lg:col-span-4 lg:sticky lg:top-24 space-y-6 order-2 lg:order-1">
            {/* Table of Contents */}
            {parsed.tocItems.length > 0 && (
              <div className="bg-white rounded-2xl border border-zinc-200/90 p-5 sm:p-6 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.06)]">
                <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-zinc-100">
                  <div className="w-8 h-8 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                    <List className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="font-['Marcellus'] font-bold text-zinc-950 text-base leading-none">
                      Table of Contents
                    </h2>
                    <p className="text-[11px] text-zinc-400 mt-0.5">
                      {parsed.tocItems.length} sections in this article
                    </p>
                  </div>
                </div>

                <nav aria-label="Table of Contents" className="space-y-1">
                  {parsed.tocItems.map((item) => {
                    const isActive = activeHeading === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => scrollToHeading(item.id)}
                        style={
                          isActive
                            ? {
                                background:
                                  'linear-gradient(135deg, #dc2626 0%, #000000 100%)',
                                color: '#ffffff',
                              }
                            : undefined
                        }
                        className={`w-full text-left px-3 py-2.5 rounded-xl text-[13.5px] leading-snug transition-all flex items-start gap-2.5 cursor-pointer ${
                          isActive
                            ? 'text-white font-semibold shadow-md shadow-red-950/20'
                            : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${
                            isActive ? 'bg-white' : 'bg-red-600/50'
                          }`}
                        />
                        <span className="flex-1">{item.title}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>
            )}

            {/* Sticky Conversion Card 1: Custom Article CTA */}
            <div className="rounded-2xl bg-gradient-to-br from-black via-zinc-900 to-red-950 p-6 text-white shadow-xl relative overflow-hidden border border-red-500/20">
              <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-red-600/20 blur-2xl pointer-events-none" />
              <div className="relative z-10">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-600/20 border border-red-500/30 text-red-400 text-[11px] font-bold uppercase tracking-wider mb-3">
                  <Sparkles className="w-3 h-3" /> WebMavien Advisory
                </span>
                <h3 className="font-['Marcellus'] text-xl font-bold text-white leading-snug mb-2">
                  {sidebarCta.heading}
                </h3>
                <p className="text-white/75 text-xs sm:text-[13.5px] leading-relaxed mb-5">
                  {sidebarCta.description}
                </p>
                <Link
                  href={sidebarCta.buttonLink}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm transition-all shadow-md shadow-red-600/25"
                >
                  {sidebarCta.buttonText} <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Sticky Conversion Card 2: Quick Agency Shortcuts */}
            <div className="bg-white rounded-2xl border border-zinc-200/90 p-5 shadow-xs space-y-3">
              <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">
                Explore WebMavien Solutions
              </p>
              <Link
                href="/services"
                className="group flex items-center justify-between p-3 rounded-xl bg-zinc-50 hover:bg-red-600 hover:text-white transition-all border border-zinc-200/70"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-red-50 group-hover:bg-white/15 text-red-600 group-hover:text-white flex items-center justify-center transition-colors">
                    <Cpu className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-zinc-950 group-hover:text-white">
                      AI & Engineering Services
                    </p>
                    <p className="text-[11px] text-zinc-500 group-hover:text-white/75">
                      Custom LLMs, SaaS & web apps
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:text-white transition-transform group-hover:translate-x-0.5" />
              </Link>

              <Link
                href="/casestudies"
                className="group flex items-center justify-between p-3 rounded-xl bg-zinc-50 hover:bg-zinc-950 hover:text-white transition-all border border-zinc-200/70"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-zinc-100 group-hover:bg-white/15 text-zinc-900 group-hover:text-white flex items-center justify-center transition-colors">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-zinc-950 group-hover:text-white">
                      Client Case Studies
                    </p>
                    <p className="text-[11px] text-zinc-500 group-hover:text-white/75">
                      Real architectures & ROI metrics
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:text-white transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </aside>

          {/* =========================================================
              RIGHT COLUMN (Main Article Content + FAQ + Sources + Author)
             ========================================================= */}
          <div className="lg:col-span-8 order-1 lg:order-2 space-y-8">
            <article className="bg-white rounded-2xl sm:rounded-3xl border border-zinc-200/90 p-6 sm:p-10 lg:p-12 shadow-[0_12px_36px_-18px_rgba(0,0,0,0.06)]">
              {/* Lead Summary Paragraph */}
              {parsed.leadParagraph ? (
                <div className="pb-6 mb-6 border-b border-zinc-100">
                  <p
                    className="text-zinc-900 font-medium text-[17px] sm:text-[19px] leading-[1.75] m-0"
                    dangerouslySetInnerHTML={{ __html: parsed.leadParagraph }}
                  />
                </div>
              ) : post.excerpt ? (
                <div className="pb-6 mb-6 border-b border-zinc-100">
                  <p className="text-zinc-900 font-medium text-[17px] sm:text-[19px] leading-[1.75] m-0">
                    {post.excerpt}
                  </p>
                </div>
              ) : null}

              {/* Key Takeaways Box */}
              {parsed.takeawaysHtml && (
                <div dangerouslySetInnerHTML={{ __html: parsed.takeawaysHtml }} />
              )}

              {/* Rendered Article Body HTML */}
              <div
                className="article-body max-w-none"
                dangerouslySetInnerHTML={{ __html: parsed.bodyHtml }}
              />

              {/* Dedicated FAQ Accordion Section */}
              {parsed.faqItems.length > 0 && (
                <div className="mt-14 pt-10 border-t border-zinc-200">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center shadow-sm">
                      <HelpCircle className="w-5 h-5" />
                    </span>
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-widest text-red-600">
                        FAQ & Answers
                      </span>
                      <h2 className="font-['Marcellus'] text-2xl sm:text-3xl font-bold text-zinc-950 m-0">
                        Frequently Asked Questions
                      </h2>
                    </div>
                  </div>

                  <div className="space-y-3.5">
                    {parsed.faqItems.map((item, idx) => (
                      <details
                        key={idx}
                        open={idx === 0}
                        className="group bg-zinc-50/70 rounded-2xl border border-zinc-200/90 px-6 py-4 [&_summary::-webkit-details-marker]:hidden hover:bg-white hover:border-red-500/40 transition-all"
                      >
                        <summary className="flex items-center justify-between cursor-pointer font-['Marcellus'] font-bold text-zinc-950 text-[16.5px] sm:text-[17.5px] py-1 select-none">
                          <span
                            className="pr-4"
                            dangerouslySetInnerHTML={{ __html: formatInlineText(item.q) }}
                          />
                          <span className="w-7 h-7 rounded-full bg-white border border-zinc-200 text-zinc-900 flex items-center justify-center shrink-0 transition-transform duration-200 group-open:rotate-180 group-open:bg-red-600 group-open:text-white group-open:border-red-600 text-xs">
                            ▼
                          </span>
                        </summary>
                        <div
                          className="pt-3 pb-1 text-zinc-600 text-[15px] leading-relaxed border-t border-zinc-200/60 mt-3"
                          dangerouslySetInnerHTML={{ __html: formatInlineText(item.a) }}
                        />
                      </details>
                    ))}
                  </div>
                </div>
              )}

              {/* Authoritative Sources & Transparency Box */}
              {parsed.sourcesHtml && (
                <div className="mt-10">
                  <div dangerouslySetInnerHTML={{ __html: parsed.sourcesHtml }} />
                  {parsed.standDate && (
                    <p className="text-xs text-zinc-400 italic mt-2 text-right">
                      Editorial Verification: {parsed.standDate}
                    </p>
                  )}
                </div>
              )}

              {/* E-E-A-T Author Box */}
              <div className="mt-12 pt-8 border-t border-zinc-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 bg-zinc-50 p-6 rounded-2xl border border-zinc-200/80">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-zinc-950 text-white font-['Marcellus'] font-bold text-lg flex items-center justify-center shrink-0 shadow-sm border border-red-500/30">
                    {authorInitials}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-['Marcellus'] font-bold text-zinc-950 text-base">
                        {post.author || 'WebMavien Engineering Team'}
                      </h3>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-50 text-red-700 text-[10px] font-bold uppercase tracking-wider border border-red-200">
                        <CheckCircle2 className="w-3 h-3" /> Verified Author
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-zinc-500 mt-0.5">
                      {post.authorRole || 'Senior Full-Stack & AI Architects'}
                    </p>
                    <p className="text-xs sm:text-[13px] text-zinc-600 leading-relaxed mt-1.5 max-w-xl">
                      {post.authorBio ||
                        'The WebMavien Engineering Team specializes in high-performance Next.js architectures, custom AI agent workflows, and scalable SaaS platforms.'}
                    </p>
                  </div>
                </div>

                {/* Helpful Feedback Widget */}
                <div className="flex flex-col items-start sm:items-end gap-2 shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 border-zinc-200/60 w-full sm:w-auto">
                  <span className="text-[11px] font-semibold text-zinc-500">
                    Was this article helpful?
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setHelpfulVote('yes')}
                      className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                        helpfulVote === 'yes'
                          ? 'bg-red-600 text-white border-red-600'
                          : 'bg-white text-zinc-700 border-zinc-200 hover:border-red-600'
                      }`}
                    >
                      <ThumbsUp className="w-3.5 h-3.5" /> Yes, very!
                    </button>
                    <button
                      onClick={handleShare}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-white text-zinc-700 border border-zinc-200 hover:border-red-600 transition-all cursor-pointer"
                    >
                      <Share2 className="w-3.5 h-3.5" /> Share
                    </button>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* 4. RELATED ARTICLES SECTION */}
      {relatedPosts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 mt-16 sm:mt-20">
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-red-600 block mb-1.5">
                Continue Reading
              </span>
              <h2 className="font-['Marcellus'] text-2xl sm:text-3xl font-bold text-zinc-950">
                Related Engineering & AI Insights
              </h2>
            </div>
            <Link
              href="/blog"
              className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-red-600 hover:gap-2.5 transition-all"
            >
              All Articles <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedPosts.map((rel) => (
              <Link
                key={rel.slug || rel.id}
                href={`/blog/${rel.slug}`}
                className="group bg-white rounded-2xl overflow-hidden border border-zinc-200/90 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
              >
                <div className="relative h-48 overflow-hidden bg-zinc-100">
                  <img
                    src={
                      rel.imageUrl ||
                      rel.image_url ||
                      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80'
                    }
                    alt={rel.altText || rel.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/95 backdrop-blur-xs text-zinc-950 text-[11px] font-bold shadow-xs">
                    {rel.category || 'Engineering'}
                  </span>
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] text-zinc-400 font-medium flex items-center gap-1.5 mb-2">
                      <Clock className="w-3 h-3" />{' '}
                      {rel.read_time || `${rel.readTime || 5} Min. Read`}
                    </span>
                    <h3 className="font-['Marcellus'] font-bold text-lg text-zinc-950 group-hover:text-red-600 transition-colors line-clamp-2 leading-snug mb-2">
                      {rel.title}
                    </h3>
                    <p className="text-xs text-zinc-600 line-clamp-2 leading-relaxed">
                      {rel.metaDescription || rel.excerpt}
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 mt-4 group-hover:gap-2.5 transition-all">
                    Read Article <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

