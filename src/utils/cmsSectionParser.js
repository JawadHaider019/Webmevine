/**
 * Parses and composes structured CMS fields (Summary, Key Takeaways, Body, Resources, FAQs, CTA)
 * into and out of the unified Markdown string stored in the database.
 */

import { normalizeHtmlToMarkdownIfNeeded } from './articleParser';

export const DEFAULT_CTA = {
  heading: 'Ready to Scale Your Digital Product?',
  description:
    'Book a free 30-minute architecture & AI strategy session with WebMavien — get a tailored roadmap, timeline, and transparent cost breakdown.',
  buttonText: 'Book Free Strategy Call',
  buttonLink: '/contact',
};

export function createEmptyFaqSlots(count = 8) {
  return Array.from({ length: count }, () => ({ q: '', a: '' }));
}

export function parseCmsSections(markdown = '') {
  if (!markdown || !markdown.trim()) {
    return {
      summary: '',
      takeawaysHeading: 'Key Takeaways: Executive Summary',
      takeawaysLead: '',
      takeaways: ['', '', ''],
      body: '',
      resources: [''],
      standDate: '',
      faqs: createEmptyFaqSlots(8),
      cta: { ...DEFAULT_CTA },
    };
  }

  let text = normalizeHtmlToMarkdownIfNeeded(markdown).replace(/\r\n/g, '\n');

  // 1. Extract :::takeaways block
  let takeawaysHeading = 'Key Takeaways: Executive Summary';
  let takeawaysLead = '';
  let takeaways = [];
  const takeawaysRegex = /:::takeaways\n([\s\S]*?)\n:::/i;
  const takeawaysMatch = text.match(takeawaysRegex);
  if (takeawaysMatch) {
    const inner = takeawaysMatch[1].split('\n').map((l) => l.trim()).filter(Boolean);
    inner.forEach((line) => {
      if (line.startsWith('### ') || line.startsWith('## ')) {
        takeawaysHeading = line.replace(/^#{2,3}\s+/, '').trim();
      } else if (line.startsWith('- ') || line.startsWith('* ') || line.startsWith('• ')) {
        takeaways.push(line.replace(/^[-*•]\s+/, '').trim());
      } else if (!takeawaysLead && takeaways.length === 0) {
        takeawaysLead = line;
      } else {
        takeaways.push(line);
      }
    });
    text = text.replace(takeawaysRegex, '').trim();
  }
  if (takeaways.length === 0) takeaways = ['', '', ''];

  // 2. Extract :::faq block
  const parsedFaqs = [];
  const faqRegex = /(?:#{2,3}\s+(?:Frequently Asked Questions|FAQ|Häufige Fragen)[^\n]*\n+)?:::faq\n([\s\S]*?)\n:::/i;
  const faqMatch = text.match(faqRegex);
  if (faqMatch) {
    const inner = faqMatch[1].split('\n').map((l) => l.trim()).filter(Boolean);
    let currentQ = null;
    let currentA = [];
    inner.forEach((line) => {
      if (line.startsWith('### ') || line.startsWith('**Q:') || line.startsWith('**F:')) {
        if (currentQ) {
          parsedFaqs.push({ q: currentQ, a: currentA.join(' ').trim() });
        }
        currentQ = line
          .replace(/^###\s+/, '')
          .replace(/^\*\*[QF]:\s*/, '')
          .replace(/\*\*$/, '')
          .trim();
        currentA = [];
      } else if (currentQ) {
        currentA.push(line);
      }
    });
    if (currentQ) {
      parsedFaqs.push({ q: currentQ, a: currentA.join(' ').trim() });
    }
    text = text.replace(faqRegex, '').trim();
  }

  // Pad FAQs to 8 slots
  const faqs = createEmptyFaqSlots(8).map((empty, idx) => parsedFaqs[idx] || empty);

  // 3. Extract :::sources or :::quellen block
  let resources = [];
  const sourcesRegex = /:::(?:sources|quellen)\n([\s\S]*?)\n:::/i;
  const sourcesMatch = text.match(sourcesRegex);
  if (sourcesMatch) {
    const inner = sourcesMatch[1].split('\n').map((l) => l.trim()).filter(Boolean);
    inner.forEach((line) => {
      resources.push(line.replace(/^[-*•]\s+/, '').trim());
    });
    text = text.replace(sourcesRegex, '').trim();
  }
  if (resources.length === 0) resources = [''];

  // 4. Extract :::cta block
  let cta = { ...DEFAULT_CTA };
  const ctaRegex = /:::cta\n([\s\S]*?)\n:::/i;
  const ctaMatch = text.match(ctaRegex);
  if (ctaMatch) {
    const inner = ctaMatch[1].split('\n').map((l) => l.trim()).filter(Boolean);
    inner.forEach((line) => {
      if (line.startsWith('### ') || line.startsWith('## ')) {
        cta.heading = line.replace(/^#{2,3}\s+/, '').trim();
      } else if (line.toLowerCase().startsWith('button:')) {
        const parts = line.replace(/^button:\s*/i, '').split('|');
        cta.buttonText = parts[0]?.trim() || cta.buttonText;
        cta.buttonLink = parts[1]?.trim() || cta.buttonLink;
      } else {
        cta.description = line;
      }
    });
    text = text.replace(ctaRegex, '').trim();
  }

  // 5. Extract "*Reviewed: ...*" or "*Stand: ...*" line if present
  let standDate = '';
  const standRegex = /^\*?(?:Reviewed|Last Reviewed|Verified|Stand):\s*([^\n*]+)\*?$/im;
  const standMatch = text.match(standRegex);
  if (standMatch) {
    standDate = standMatch[1].trim();
    text = text.replace(standRegex, '').trim();
  }

  // 6. Separate Summary (first paragraph before first ## heading) from Body
  let summary = '';
  let body = text.trim();

  const firstHeadingIdx = body.search(/^#{1,3}\s+/m);
  if (firstHeadingIdx > 0) {
    const beforeHeading = body.slice(0, firstHeadingIdx).trim();
    const afterHeading = body.slice(firstHeadingIdx).trim();
    if (!beforeHeading.startsWith(':::') && !beforeHeading.startsWith('|')) {
      summary = beforeHeading;
      body = afterHeading;
    }
  } else if (firstHeadingIdx === -1 && body.length > 0) {
    const paragraphs = body.split(/\n{2,}/);
    if (paragraphs.length > 1) {
      summary = paragraphs[0].trim();
      body = paragraphs.slice(1).join('\n\n').trim();
    }
  }

  return {
    summary,
    takeawaysHeading,
    takeawaysLead,
    takeaways,
    body,
    resources,
    standDate,
    faqs,
    cta,
  };
}

export function composeCmsSections({
  summary = '',
  takeawaysHeading = 'Key Takeaways: Executive Summary',
  takeawaysLead = '',
  takeaways = [],
  body = '',
  resources = [],
  standDate = '',
  faqs = [],
  cta = DEFAULT_CTA,
}) {
  const parts = [];

  // 1. Summary (Lead Paragraph)
  if (summary && summary.trim()) {
    parts.push(summary.trim());
  }

  // 2. Key Takeaways Box
  const cleanTakeaways = (takeaways || []).map((t) => t.trim()).filter(Boolean);
  if (cleanTakeaways.length > 0 || (takeawaysLead && takeawaysLead.trim())) {
    const heading = (takeawaysHeading || 'Key Takeaways: Executive Summary').trim();
    const leadLine = takeawaysLead && takeawaysLead.trim() ? `${takeawaysLead.trim()}\n` : '';
    const bulletLines = cleanTakeaways.map((t) => `- ${t.replace(/^[-*•]\s+/, '')}`).join('\n');
    parts.push(
      `:::takeaways\n### ${heading}\n${leadLine}${bulletLines}\n:::`.replace(/\n{2,}/g, '\n')
    );
  }

  // 3. Main Body Content
  if (body && body.trim()) {
    parts.push(body.trim());
  }

  // 4. Authoritative Resources (:::sources)
  const cleanResources = (resources || []).map((r) => r.trim()).filter(Boolean);
  if (cleanResources.length > 0) {
    parts.push(
      `:::sources\n${cleanResources.map((r) => `- ${r.replace(/^[-*•]\s+/, '')}`).join('\n')}\n:::`
    );
  }

  // 5. Reviewed Date
  if (standDate && standDate.trim()) {
    parts.push(`*Reviewed: ${standDate.trim()}*`);
  }

  // 6. FAQs (:::faq)
  const cleanFaqs = (faqs || []).filter((f) => f && f.q && f.q.trim() && f.a && f.a.trim());
  if (cleanFaqs.length > 0) {
    const faqLines = cleanFaqs
      .map((f) => `### ${f.q.trim()}\n${f.a.trim()}`)
      .join('\n');
    parts.push(`## Frequently Asked Questions (FAQ)\n\n:::faq\n${faqLines}\n:::`);
  }

  // 7. Sidebar / Custom CTA
  if (cta && (cta.heading?.trim() || cta.description?.trim())) {
    const h = (cta.heading || DEFAULT_CTA.heading).trim();
    const d = (cta.description || DEFAULT_CTA.description).trim();
    const btnText = (cta.buttonText || DEFAULT_CTA.buttonText).trim();
    const btnLink = (cta.buttonLink || DEFAULT_CTA.buttonLink).trim();
    parts.push(`:::cta\n### ${h}\n${d}\nbutton: ${btnText} | ${btnLink}\n:::`);
  }

  return parts.join('\n\n');
}

