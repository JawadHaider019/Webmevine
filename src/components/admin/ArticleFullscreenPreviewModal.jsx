'use client';

import React, { useMemo, useState } from 'react';
import {
  X,
  Send,
  Save,
  Calendar,
  Clock,
  ShieldCheck,
  List,
  ArrowRight,
  HelpCircle,
  BookOpen,
  Sparkles,
  CheckCircle2,
  Eye,
} from 'lucide-react';
import { parseArticleMarkdown, formatInlineText } from '@/utils/articleParser';
import { DEFAULT_CTA } from '@/utils/cmsSectionParser';

export default function ArticleFullscreenPreviewModal({
  isOpen,
  onClose,
  formData,
  composedMarkdown,
  ctaData = DEFAULT_CTA,
  onSaveDraft,
  onPublish,
  saving = false,
}) {
  const [activeHeading, setActiveHeading] = useState('');

  const parsed = useMemo(
    () => parseArticleMarkdown(composedMarkdown || '', { extractLead: true }),
    [composedMarkdown]
  );

  if (!isOpen) return null;

  const formattedPubDate = formData.published_at
    ? new Date(formData.published_at).toLocaleDateString('en-US', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })
    : new Date().toLocaleDateString('en-US', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      });

  const formattedUpdDate = formData.updated_at_custom
    ? new Date(formData.updated_at_custom).toLocaleDateString('en-US', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })
    : formattedPubDate;

  const scrollToHeading = (id) => {
    setActiveHeading(id);
    const el = document.getElementById(`preview-${id}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handlePreviewScroll = (e) => {
    if (!parsed.tocItems.length) return;
    const container = e.currentTarget;
    const containerRect = container.getBoundingClientRect();

    let currentId = parsed.tocItems[0]?.id || '';
    for (const item of parsed.tocItems) {
      const el = document.getElementById(`preview-${item.id}`);
      if (!el) continue;
      const rect = el.getBoundingClientRect();
      if (rect.top - containerRect.top <= 160) {
        currentId = item.id;
      } else {
        break;
      }
    }
    setActiveHeading((prev) => (prev !== currentId ? currentId : prev));
  };

  // Prefix IDs inside preview body so clicking TOC works inside the modal
  const previewBodyHtml = useMemo(() => {
    return (parsed.bodyHtml || '').replace(/id="([^"]+)"/g, 'id="preview-$1"');
  }, [parsed.bodyHtml]);

  const effectiveCta = {
    heading: ctaData?.heading || DEFAULT_CTA.heading,
    description: ctaData?.description || DEFAULT_CTA.description,
    buttonText: ctaData?.buttonText || DEFAULT_CTA.buttonText,
    buttonLink: ctaData?.buttonLink || DEFAULT_CTA.buttonLink,
  };

  return (
    <div className="fixed inset-0 z-50 bg-zinc-50 flex flex-col overflow-hidden animate-in fade-in duration-200">
      {/* Top Preview Control Bar */}
      <div className="h-16 px-4 sm:px-8 bg-zinc-950 text-white border-b border-zinc-800 flex items-center justify-between shrink-0 z-30 shadow-lg">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600/20 border border-red-500/40 text-red-400 text-xs font-bold uppercase tracking-wider">
            <Eye className="w-3.5 h-3.5" /> Live Article Preview
          </span>
          <span className="hidden md:inline text-xs text-white/60">
            1:1 Simulation of the public reader view (/blog/{formData.slug || 'article-slug'})
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold transition-colors"
          >
            <X className="w-4 h-4" /> Back to Editor
          </button>

          {onSaveDraft && (
            <button
              type="button"
              disabled={saving}
              onClick={onSaveDraft}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-zinc-950 hover:bg-zinc-100 text-xs font-bold transition-colors disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" /> Save as Draft
            </button>
          )}

          {onPublish && (
            <button
              type="button"
              disabled={saving}
              onClick={onPublish}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md transition-all disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" /> Publish Now
            </button>
          )}
        </div>
      </div>

      {/* Scrollable 1:1 Public Article Canvas */}
      <div
        onScroll={handlePreviewScroll}
        className="flex-1 overflow-y-auto pb-24"
      >
        {/* Hero Banner */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-8">
          <div className="relative rounded-3xl overflow-hidden min-h-[340px] sm:min-h-[420px] flex items-end shadow-[0_24px_60px_-20px_rgba(0,0,0,0.45)] border border-zinc-800/30">
            <img
              src={
                formData.image_url ||
                'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1600&auto=format&fit=crop&q=80'
              }
              alt={formData.alt_text || formData.title || 'Article Preview'}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/75 to-black/25" />

            <div className="relative z-10 w-full p-6 sm:p-10 lg:p-14 max-w-4xl">
              <span className="inline-block px-3.5 py-1 rounded-full bg-red-600 text-white text-xs font-bold uppercase tracking-widest mb-4 shadow-sm">
                {formData.category || 'Engineering & AI'}
              </span>
              <h1 className="font-['Marcellus'] text-2xl sm:text-4xl lg:text-[44px] font-bold text-white leading-[1.16] tracking-tight">
                {formData.title || 'Untitled Blog Post'}
              </h1>
              {formData.schema_caption && (
                <p className="text-xs text-white/60 mt-3 italic">{formData.schema_caption}</p>
              )}
            </div>
          </div>
        </section>

        {/* E-E-A-T Trust & Metadata Bar */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 mt-6">
          <div className="bg-white rounded-2xl border border-zinc-200/90 p-4 sm:px-6 flex flex-wrap items-center justify-between gap-4 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-zinc-950 text-white flex items-center justify-center font-['Marcellus'] font-bold text-sm border border-red-500/30">
                {(formData.author || 'WM')
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .slice(0, 2)}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold text-zinc-950">
                    {formData.author || 'WebMavien Engineering Team'}
                  </span>
                  <ShieldCheck className="w-4 h-4 text-red-600" />
                </div>
                <p className="text-xs text-zinc-500">
                  {formData.author_role || 'Senior Full-Stack & AI Architects'}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-600">
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-red-600" />
                Published: <strong className="text-zinc-900">{formattedPubDate}</strong>
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 text-red-700 font-semibold border border-red-100">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Reviewed: {parsed.standDate || formattedUpdDate}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-zinc-400" />
                {formData.read_time || '5 Min. Read'}
              </span>
              {formData.chatgpt_link && (
                <a
                  href={formData.chatgpt_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-950 text-white font-semibold hover:bg-red-600 transition-colors"
                >
                  <Sparkles className="w-3 h-3 text-red-400" /> Summarize in ChatGPT
                </a>
              )}
            </div>
          </div>
        </section>

        {/* Main 2-Column Layout: Sticky Left TOC + CTA | Right Content */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 mt-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* LEFT SIDEBAR (Sticky TOC + Custom CTA) */}
            <aside className="lg:col-span-4 lg:sticky lg:top-8 space-y-6">
              {/* Table of Contents */}
              <div className="bg-white rounded-2xl border border-zinc-200/90 p-6 shadow-xs">
                <div className="flex items-center gap-2.5 pb-3.5 mb-4 border-b border-zinc-100">
                  <span className="w-7 h-7 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
                    <List className="w-4 h-4" />
                  </span>
                  <h2 className="font-['Marcellus'] font-bold text-base text-zinc-950 tracking-wide">
                    Table of Contents
                  </h2>
                </div>

                {parsed.tocItems.length > 0 ? (
                  <nav className="space-y-1.5">
                    {parsed.tocItems.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => scrollToHeading(item.id)}
                        style={
                          activeHeading === item.id
                            ? {
                                background:
                                  'linear-gradient(135deg, #dc2626 0%, #000000 100%)',
                                color: '#ffffff',
                              }
                            : undefined
                        }
                        className={`w-full text-left px-3.5 py-2.5 rounded-xl text-[13.5px] transition-all flex items-start gap-2.5 ${
                          activeHeading === item.id
                            ? 'text-white font-semibold shadow-md shadow-red-950/20'
                            : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950'
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current mt-2 shrink-0 opacity-60" />
                        <span className="leading-snug">{item.title}</span>
                      </button>
                    ))}
                  </nav>
                ) : (
                  <p className="text-xs text-zinc-400 italic">
                    Add <code className="bg-zinc-100 px-1 rounded">## Heading 2</code> sections in the body to populate the Table of Contents.
                  </p>
                )}
              </div>

              {/* Sticky Sidebar CTA Card */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-black via-zinc-900 to-red-950 text-white shadow-xl relative overflow-hidden border border-red-500/20">
                <div className="absolute -right-8 -bottom-8 w-36 h-36 rounded-full bg-red-600/15 blur-2xl pointer-events-none" />
                <span className="inline-block px-2.5 py-1 rounded-full bg-red-600/20 border border-red-500/30 text-red-400 text-[10px] font-bold uppercase tracking-widest mb-3">
                  WebMavien Advisory
                </span>
                <h3 className="font-['Marcellus'] text-xl font-bold text-white mb-2 leading-snug">
                  {effectiveCta.heading}
                </h3>
                <p className="text-xs text-white/80 leading-relaxed mb-5">
                  {effectiveCta.description}
                </p>
                <span className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-600 text-white text-xs font-bold shadow-md">
                  {effectiveCta.buttonText} <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </aside>

            {/* RIGHT MAIN ARTICLE CONTENT */}
            <div className="lg:col-span-8 space-y-8">
              <div className="bg-white rounded-3xl border border-zinc-200/90 p-6 sm:p-10 lg:p-12 shadow-xs">
                {/* Summary / Lead Paragraph */}
                {parsed.leadParagraph && (
                  <p
                    className="text-zinc-800 text-[17.5px] sm:text-[19px] leading-[1.8] font-medium mb-8 pb-6 border-b border-zinc-100"
                    dangerouslySetInnerHTML={{ __html: parsed.leadParagraph }}
                  />
                )}

                {/* Key Takeaways Box */}
                {parsed.takeawaysHtml && (
                  <div dangerouslySetInnerHTML={{ __html: parsed.takeawaysHtml }} />
                )}

                {/* Main Article Body */}
                <div
                  className="article-content"
                  dangerouslySetInnerHTML={{ __html: previewBodyHtml }}
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
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

