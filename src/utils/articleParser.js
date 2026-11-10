// Unified Markdown & Custom Block Engine for WebMavien Blog & Admin Editor
// Supports headings (with auto-IDs for Scrollspy TOC), lists, blockquotes, links,
// fenced code blocks, responsive tables, images, raw HTML fallback conversion,
// and signature WebMavien blocks:
// :::takeaways, :::tip (or :::tipp), :::warning (or :::warnung),
// :::steps (or :::schritte), :::grid, :::cta, :::faq, :::sources (or :::quellen)

export function slugifyHeading(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/[*_`~]/g, '')
    .replace(/^\d+[\.\)]\s*/, '') // Strip leading numbers for clean IDs
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

/**
 * Strips leading step/section numbers from headings so H2/H3 titles never render numbers
 * e.g. "1. Why Next.js Scales" -> "Why Next.js Scales", "2) Architecture" -> "Architecture"
 */
export function stripHeadingNumbers(text) {
  return String(text || '').replace(/^\s*\d+[\.\)\-:]\s+/, '').trim();
}

/**
 * Repairs common corrupted Markdown link patterns pasted or typed by editors:
 * 1. Nested double-brackets: [[Label](https://...)](https://...) -> [Label](https://...)
 * 2. Empty label with URL: [](https://example.com) -> [https://example.com](https://example.com)
 * 3. Escaped brackets: \[Label\](https://...) -> [Label](https://...)
 */
export function repairCorruptedLinks(text) {
  if (!text) return '';
  let out = String(text);

  // Unescape accidentally escaped markdown links \[label\](url)
  out = out.replace(/\\\[([^\]]+)\\\]\(([^)]+)\)/g, '[$1]($2)');

  // Collapse nested links [[text](url1)](url2) -> [text](url1)
  out = out.replace(/\[\s*\[([^\]]+)\]\(([^)\s]+)\)\s*\]\(([^)]*)\)/g, '[$1]($2)');

  // Fix empty label links [](url) -> [url](url)
  out = out.replace(/\[\s*\]\((https?:\/\/[^\s)]+|\/[^\s)]+)\)/g, '[$1]($1)');

  return out;
}

/**
 * Converts a raw HTML document (e.g. <!DOCTYPE html>...<body>...</body>) or HTML fragment
 * into clean WebMavien Markdown so posts pasted as raw HTML still render with full Campuna/WebMavien styling.
 */
export function normalizeHtmlToMarkdownIfNeeded(raw = '') {
  if (!raw) return '';
  const trimmed = String(raw).trim();

  // Only run if it looks like an HTML document or contains HTML block tags
  const hasHtmlDoctype = /<!DOCTYPE\s+html/i.test(trimmed) || /<html[\s>]/i.test(trimmed);
  const hasHtmlBlocks =
    /<(section|table|thead|tbody|div|h2|h3|ul|ol|p)\b[^>]*>/i.test(trimmed) &&
    !/^#{1,3}\s+/m.test(trimmed);

  if (!hasHtmlDoctype && !hasHtmlBlocks) {
    return raw;
  }

  let bodyHtml = trimmed;

  // Extract <body> content if present
  const bodyMatch = bodyHtml.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  if (bodyMatch) {
    bodyHtml = bodyMatch[1];
  }

  // Strip <head>, <script>, <style>, and HTML comments
  bodyHtml = bodyHtml
    .replace(/<head[^>]*>[\s\S]*?<\/head>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '');

  // Remove duplicate top article-meta, breadcrumb, related articles, and top <h1> (rendered by Hero Banner)
  bodyHtml = bodyHtml
    .replace(/<div[^>]*class=["'][^"']*(?:article-meta|breadcrumb|related)[^"']*["'][^>]*>[\s\S]*?<\/div>/gi, '')
    .replace(/<h1[^>]*>[\s\S]*?<\/h1>/gi, '');

  // Convert <div class="faq-item"> blocks into :::faq
  const faqMatches = [
    ...bodyHtml.matchAll(
      /<div[^>]*class=["'][^"']*faq-item[^"']*["'][^>]*>\s*<div[^>]*class=["'][^"']*faq-q[^"']*["'][^>]*>([\s\S]*?)<\/div>\s*<div[^>]*class=["'][^"']*faq-a[^"']*["'][^>]*>([\s\S]*?)<\/div>\s*<\/div>/gi
    ),
  ];
  if (faqMatches.length > 0) {
    const faqLines = faqMatches.map((m) => {
      const q = m[1].replace(/<[^>]+>/g, '').trim();
      const a = m[2].replace(/<[^>]+>/g, '').trim();
      return `### ${q}\n${a}`;
    });
    const faqBlock = `\n\n:::faq\n${faqLines.join('\n')}\n:::\n\n`;
    bodyHtml = bodyHtml.replace(
      /(<div[^>]*class=["'][^"']*faq-item[^"']*["'][^>]*>[\s\S]*?<\/div>\s*<\/div>\s*)+/i,
      faqBlock
    );
  }

  // Convert <div class="cta-box"> into :::cta
  bodyHtml = bodyHtml.replace(
    /<div[^>]*class=["'][^"']*cta-box[^"']*["'][^>]*>([\s\S]*?)<\/div>\s*(?=<|$)/gi,
    (_, inner) => {
      const h2Match = inner.match(/<h[23][^>]*>([\s\S]*?)<\/h[23]>/i);
      const pMatches = [...inner.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)];
      const aMatch = inner.match(/<a[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/i);
      const heading = h2Match
        ? h2Match[1].replace(/<[^>]+>/g, '').trim()
        : 'Ready to Scale Your Digital Product?';
      const desc = pMatches
        .map((p) => p[1].replace(/<[^>]+>/g, '').trim())
        .filter(Boolean)
        .join(' ');
      const btnUrl = aMatch ? aMatch[1].replace('https://webmavien.com', '') || '/contact' : '/contact';
      const btnLabel = aMatch
        ? aMatch[2].replace(/<[^>]+>|→/g, '').trim()
        : 'Book Your Free Strategy Call';
      return `\n\n:::cta\n### ${heading}\n${desc}\nbutton: ${btnLabel} | ${btnUrl}\n:::\n\n`;
    }
  );

  // Convert HTML <table> into Markdown tables
  bodyHtml = bodyHtml.replace(/<table[^>]*>([\s\S]*?)<\/table>/gi, (_, tableInner) => {
    const rows = [...tableInner.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)];
    if (!rows.length) return '';
    const mdRows = rows.map((r) => {
      const cells = [...r[1].matchAll(/<(th|td)[^>]*>([\s\S]*?)<\/\1>/gi)].map((c) =>
        c[2]
          .replace(/<strong[^>]*>([\s\S]*?)<\/strong>/gi, '**$1**')
          .replace(/<[^>]+>/g, '')
          .replace(/\s+/g, ' ')
          .trim()
      );
      return `| ${cells.join(' | ')} |`;
    });
    if (mdRows.length >= 1) {
      const colCount = (mdRows[0].match(/\|/g) || []).length - 1 || 2;
      const sep = `| ${Array(Math.max(1, colCount)).fill(':---').join(' | ')} |`;
      mdRows.splice(1, 0, sep);
    }
    return `\n\n${mdRows.join('\n')}\n\n`;
  });

  // Convert <div class="callout"> into :::tip
  bodyHtml = bodyHtml.replace(
    /<div[^>]*class=["'][^"']*callout[^"']*["'][^>]*>([\s\S]*?)<\/div>/gi,
    (_, inner) => {
      const text = inner
        .replace(/<strong[^>]*>([\s\S]*?)<\/strong>/gi, '**$1**')
        .replace(/<em[^>]*>([\s\S]*?)<\/em>/gi, '$1')
        .replace(/<[^>]+>/g, '')
        .replace(/\s+/g, ' ')
        .trim();
      return `\n\n:::tip\n### Key Insight\n${text}\n:::\n\n`;
    }
  );

  // Convert inline formatting & headings/lists/paragraphs
  let md = bodyHtml
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<strong[^>]*>([\s\S]*?)<\/strong>/gi, '**$1**')
    .replace(/<b[^>]*>([\s\S]*?)<\/b>/gi, '**$1**')
    .replace(/<em[^>]*>([\s\S]*?)<\/em>/gi, '*$1*')
    .replace(/<i[^>]*>([\s\S]*?)<\/i>/gi, '*$1*')
    .replace(/<a[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi, (_, href, label) => {
      const cleanLabel = label.replace(/<[^>]+>/g, '').trim();
      return `[${cleanLabel}](${href.trim()})`;
    })
    .replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, (_, inner) => {
      const clean = stripHeadingNumbers(inner.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim());
      return `\n\n## ${clean}\n\n`;
    })
    .replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, (_, inner) => {
      const clean = stripHeadingNumbers(inner.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim());
      return `\n\n### ${clean}\n\n`;
    })
    .replace(/<h4[^>]*>([\s\S]*?)<\/h4>/gi, (_, inner) => {
      const clean = stripHeadingNumbers(inner.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim());
      return `\n\n#### ${clean}\n\n`;
    })
    .replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, (_, inner) => {
      const clean = inner
        .replace(/<span[^>]*class=["'][^"']*redflag-icon[^"']*["'][^>]*>[\s\S]*?<\/span>/gi, '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
      return clean ? `- ${clean}\n` : '';
    })
    .replace(/<\/?(?:ul|ol)[^>]*>/gi, '\n\n')
    .replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, (_, inner) => {
      const clean = inner.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
      return clean ? `\n\n${clean}\n\n` : '';
    })
    .replace(/<hr\s*\/?>/gi, '\n\n---\n\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  return md;
}

export function formatInlineText(text) {
  if (!text) return '';
  const repaired = repairCorruptedLinks(text);

  return repaired
    // Bold + Italic
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong class="font-bold italic text-zinc-950">$1</strong>')
    // Bold
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-zinc-950">$1</strong>')
    // Italic
    .replace(/\*(.+?)\*/g, '<em class="italic">$1</em>')
    // Inline code
    .replace(
      /`([^`]+)`/g,
      '<code class="px-1.5 py-0.5 bg-red-50 text-red-700 rounded text-[0.9em] font-mono border border-red-200/70">$1</code>'
    )
    // Links [text](url)
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label, rawUrl) => {
      let url = rawUrl.trim();
      if (/^www\./i.test(url)) {
        url = `https://${url}`;
      }
      const isInternal = url.startsWith('/') || url.startsWith('#') || url.includes('webmavien.com');
      const targetAttr = isInternal ? '' : ' target="_blank" rel="noopener noreferrer"';
      return `<a href="${url}"${targetAttr} class="text-red-600 font-semibold underline decoration-red-600/35 underline-offset-4 hover:decoration-red-600 hover:text-red-700 transition-colors cursor-pointer">${label.trim()}</a>`;
    });
}

/**
 * Strips Markdown formatting to plain text (for meta descriptions, schema, etc.)
 */
export function stripMarkdown(text) {
  if (!text) return '';
  return repairCorruptedLinks(String(text))
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1')
    .replace(/\*\*\*(.+?)\*\*\*/g, '$1')
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/^#+\s+/gm, '')
    .trim();
}

/**
 * Converts HTML (from clipboard paste or inline contentEditable) into clean Markdown
 * Preserves bold, italic, inline code, links, headings, lists, and line breaks.
 */
export function convertHtmlToInlineMarkdown(html) {
  if (!html || typeof window === 'undefined') return html || '';

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  function walk(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      return node.textContent || '';
    }
    if (node.nodeType !== Node.ELEMENT_NODE) {
      return '';
    }

    const tag = node.tagName.toLowerCase();

    if (tag === 'style' || tag === 'script' || tag === 'meta' || tag === 'head') {
      return '';
    }

    if (tag === 'br') {
      return '\n';
    }

    const childrenText = Array.from(node.childNodes).map(walk).join('');

    if (tag === 'strong' || tag === 'b') {
      const trimmed = childrenText.trim();
      return trimmed ? `**${trimmed}**` : '';
    }

    if (tag === 'em' || tag === 'i') {
      const trimmed = childrenText.trim();
      return trimmed ? `*${trimmed}*` : '';
    }

    if (tag === 'code') {
      const trimmed = childrenText.trim();
      return trimmed ? `\`${trimmed}\`` : '';
    }

    if (tag === 'a') {
      let href = (node.getAttribute('href') || '').trim();
      const label = childrenText.replace(/\s+/g, ' ').trim();
      if (!href || href === '#' || href.startsWith('javascript:')) {
        return label;
      }
      if (/^www\./i.test(href)) {
        href = `https://${href}`;
      }
      const cleanLabel = label.replace(/^\[+|\]+$/g, '').trim() || href;
      return `[${cleanLabel}](${href})`;
    }

    if (tag === 'h1' || tag === 'h2') {
      const clean = stripHeadingNumbers(childrenText.replace(/\s+/g, ' ').trim());
      return clean ? `\n\n## ${clean}\n\n` : '';
    }
    if (tag === 'h3') {
      const clean = stripHeadingNumbers(childrenText.replace(/\s+/g, ' ').trim());
      return clean ? `\n\n### ${clean}\n\n` : '';
    }
    if (tag === 'h4' || tag === 'h5' || tag === 'h6') {
      const clean = stripHeadingNumbers(childrenText.replace(/\s+/g, ' ').trim());
      return clean ? `\n\n#### ${clean}\n\n` : '';
    }

    if (tag === 'li') {
      const parentTag = node.parentElement?.tagName.toLowerCase();
      const clean = childrenText.replace(/\n+/g, ' ').trim();
      if (!clean) return '';
      if (parentTag === 'ol') {
        const index = Array.from(node.parentElement.children).indexOf(node) + 1;
        return `${index}. ${clean}\n`;
      }
      return `- ${clean}\n`;
    }

    if (tag === 'ul' || tag === 'ol') {
      return `\n${childrenText.trim()}\n\n`;
    }

    if (tag === 'p' || tag === 'div' || tag === 'section' || tag === 'article') {
      const style = (node.getAttribute('style') || '').toLowerCase();
      let content = childrenText;
      if (
        (style.includes('font-weight: 700') ||
          style.includes('font-weight:700') ||
          style.includes('font-weight: bold')) &&
        !content.includes('**')
      ) {
        const t = content.trim();
        if (t) content = `**${t}**`;
      }
      return `${content}\n\n`;
    }

    if (tag === 'span') {
      const style = (node.getAttribute('style') || '').toLowerCase();
      let content = childrenText;
      const isBold =
        style.includes('font-weight: 700') ||
        style.includes('font-weight:700') ||
        style.includes('font-weight: bold') ||
        style.includes('font-weight:bold') ||
        style.includes('font-weight: 600');
      const isItalic = style.includes('font-style: italic') || style.includes('font-style:italic');
      if (isBold && !content.includes('**') && content.trim()) {
        content = `**${content.trim()}**`;
      }
      if (isItalic && !content.includes('*') && content.trim()) {
        content = `*${content.trim()}*`;
      }
      return content;
    }

    return childrenText;
  }

  const rawMd = walk(doc.body);
  return repairCorruptedLinks(
    rawMd
      .replace(/\u00A0/g, ' ')
      .replace(/[ \t]+\n/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim()
  );
}

/**
 * Extracts inline Markdown from a paste event (for single-line or multi-line inputs
 * like Takeaways, FAQ answers, Summary, etc.)
 */
export function extractInlinePasteMarkdown(clipboardData, { singleLine = false } = {}) {
  if (!clipboardData) return '';
  const html = clipboardData.getData('text/html');
  const plain = clipboardData.getData('text/plain');

  let result = '';
  if (html && html.trim()) {
    result = convertHtmlToInlineMarkdown(html);
  } else {
    result = repairCorruptedLinks(plain || '');
  }

  if (singleLine) {
    result = result
      .replace(/^#+\s+/gm, '')
      .replace(/^[-*•]\s+/gm, '')
      .replace(/\n+/g, ' ')
      .replace(/\s{2,}/g, ' ')
      .trim();
  }

  return result;
}

/**
 * Checks whether a string contains any Markdown formatting (links, bold, italic, code)
 */
export function hasRichFormatting(text) {
  if (!text) return false;
  return /(\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/.test(text);
}

const SVG_ICONS = {
  zap: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/></svg>`,
  checkSm: `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>`,
  lightbulb: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>`,
  alertTriangle: `<svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>`,
  xCircle: `<svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>`,
  checkCircle: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>`,
  portfolio: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>`,
  star: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
  chart: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>`,
  rocket: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>`,
  code: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`,
  layers: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/></svg>`,
  bookOpen: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/></svg>`,
  arrowUpRight: `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg>`,
  arrowRight: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>`,
  chevronDown: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>`,
};

function stripLeadingEmojis(str = '') {
  return String(str)
    .replace(
      /^(\p{Extended_Pictographic}|\p{Emoji_Presentation}|[\u{2000}-\u{3300}\u{1F000}-\u{1FAFF}\u{FE0F}\u{200D}\s])+/gu,
      ''
    )
    .trim();
}

function getGridCardIcon(title = '', index = 0) {
  const lower = title.toLowerCase();
  if (lower.includes('portfolio') || lower.includes('design') || lower.includes('ui')) {
    return SVG_ICONS.portfolio;
  }
  if (lower.includes('review') || lower.includes('rating') || lower.includes('client') || lower.includes('trust')) {
    return SVG_ICONS.star;
  }
  if (lower.includes('case') || lower.includes('result') || lower.includes('roi') || lower.includes('growth') || lower.includes('scale')) {
    return SVG_ICONS.chart;
  }
  if (lower.includes('bubble') || lower.includes('rapid') || lower.includes('launch') || lower.includes('mvp')) {
    return SVG_ICONS.rocket;
  }
  if (lower.includes('react') || lower.includes('next') || lower.includes('code') || lower.includes('performance') || lower.includes('tech')) {
    return SVG_ICONS.code;
  }
  const fallbackOrder = [SVG_ICONS.portfolio, SVG_ICONS.star, SVG_ICONS.chart, SVG_ICONS.layers];
  return fallbackOrder[index % fallbackOrder.length];
}

function renderCustomBlock(type, rawLines) {
  const lines = rawLines.map((l) => l.trim()).filter(Boolean);
  if (lines.length === 0) return { html: '', faqItems: [] };

  // 1. KEY TAKEAWAYS BOX (:::takeaways)
  if (type === 'takeaways') {
    let title = 'Key Takeaways: Executive Summary';
    let leadText = '';
    const bullets = [];

    lines.forEach((line) => {
      if (line.startsWith('### ') || line.startsWith('## ')) {
        title = stripLeadingEmojis(line.replace(/^#{2,3}\s+/, ''));
      } else if (line.startsWith('- ') || line.startsWith('* ') || line.startsWith('• ')) {
        bullets.push(line.replace(/^[-*•]\s+/, ''));
      } else if (!leadText && bullets.length === 0) {
        leadText = line;
      } else {
        bullets.push(line);
      }
    });

    const leadHtml = leadText
      ? `<p style="margin: 0 0 16px 0; color: #3f3f46;" class="text-[15.5px] sm:text-[16.5px] leading-relaxed font-medium">${formatInlineText(leadText)}</p>`
      : '';

    const bulletsHtml = bullets
      .map(
        (b) => `
        <li style="display: flex; align-items: flex-start; gap: 14px;" class="text-[15px] sm:text-[16px] text-zinc-800 leading-relaxed">
          <span style="background: linear-gradient(135deg, #dc2626 0%, #000000 100%); color: #ffffff; width: 22px; height: 22px; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; border-radius: 9999px; margin-top: 3px;" class="shadow-sm">${SVG_ICONS.checkSm}</span>
          <span style="color: #27272a; flex: 1;">${formatInlineText(b)}</span>
        </li>`
      )
      .join('');

    return {
      html: `
      <div class="my-8 p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-zinc-50 via-white to-red-50/40 border border-zinc-200/90 border-l-4 border-l-red-600 shadow-[0_12px_35px_-15px_rgba(220,38,38,0.12)]">
        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 14px;">
          <span style="background: linear-gradient(135deg, #dc2626 0%, #000000 100%); color: #ffffff; width: 36px; height: 36px; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; border-radius: 10px;" class="shadow-sm">${SVG_ICONS.zap}</span>
          <h3 style="margin: 0; padding: 0; color: #09090b;" class="font-['Marcellus'] text-xl sm:text-2xl font-bold leading-snug">${formatInlineText(title)}</h3>
        </div>
        ${leadHtml}
        <ul style="margin: 0; padding: 0; list-style: none;" class="space-y-3">${bulletsHtml}</ul>
      </div>`,
      faqItems: [],
    };
  }

  // 2. PRO TIP / KEY INSIGHT CALLOUT (:::tip or :::tipp)
  if (type === 'tip' || type === 'tipp') {
    let title = 'Key Insight';
    const bodyLines = [];
    lines.forEach((line, idx) => {
      if (idx === 0 && (line.startsWith('### ') || line.startsWith('**'))) {
        title = stripLeadingEmojis(line.replace(/^###\s+/, '').replace(/^\*\*(.+?)\*\*$/, '$1'));
      } else {
        bodyLines.push(line);
      }
    });

    const formatTipInline = (str) =>
      formatInlineText(str)
        .replace(/text-zinc-950/g, 'text-white')
        .replace(/text-red-600/g, 'text-red-400');

    return {
      html: `
      <div style="background: linear-gradient(135deg, #09090b 0%, #18181b 65%, #450a0a 100%); color: #ffffff; border-left: 4px solid #dc2626;" class="my-7 p-6 sm:p-7 rounded-2xl border border-zinc-800 shadow-lg">
        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
          <span style="background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); color: #ffffff; width: 36px; height: 36px; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; border-radius: 10px;" class="shadow-sm">${SVG_ICONS.lightbulb}</span>
          <p style="margin: 0; color: #f87171; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;" class="text-xs sm:text-sm">${formatTipInline(title)}</p>
        </div>
        <div style="color: #f4f4f5;" class="text-[15px] sm:text-[15.5px] leading-relaxed space-y-2">
          ${bodyLines.map((l) => `<p style="margin: 0; color: #f4f4f5;">${formatTipInline(l)}</p>`).join('')}
        </div>
      </div>`,
      faqItems: [],
    };
  }

  // 3. WARNING CALLOUT (:::warning or :::warnung)
  if (type === 'warning' || type === 'warnung') {
    let title = 'Critical Watch-Out';
    const bodyLines = [];
    lines.forEach((line, idx) => {
      if (idx === 0 && (line.startsWith('### ') || line.startsWith('**'))) {
        title = stripLeadingEmojis(line.replace(/^###\s+/, '').replace(/^\*\*(.+?)\*\*$/, '$1'));
      } else {
        bodyLines.push(line);
      }
    });

    const renderedBodyItems = bodyLines
      .map((l) => {
        const isBullet = /^[-*•]\s+/.test(l);
        const cleanLine = l.replace(/^[-*•]\s+/, '').trim();
        if (isBullet) {
          return `
            <div style="display: flex; align-items: flex-start; gap: 12px; background: rgba(255, 255, 255, 0.75); border: 1px solid #fecaca; padding: 11px 14px; border-radius: 12px;">
              <span style="color: #dc2626; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 3px;">${SVG_ICONS.xCircle}</span>
              <span style="color: #450a0a; flex: 1;" class="text-[14.5px] sm:text-[15px] leading-relaxed">${formatInlineText(cleanLine)}</span>
            </div>`;
        }
        return `<p style="margin: 0; color: #7f1d1d;" class="text-[15px] leading-relaxed">${formatInlineText(cleanLine)}</p>`;
      })
      .join('');

    return {
      html: `
      <div style="background: linear-gradient(135deg, #fff5f5 0%, #fef2f2 100%); border: 1px solid #fecaca; border-left: 4px solid #dc2626;" class="my-8 p-6 sm:p-7 rounded-2xl shadow-sm">
        <div style="display: flex; align-items: center; gap: 14px; margin-bottom: 16px;">
          <span style="background: linear-gradient(135deg, #dc2626 0%, #000000 100%); color: #ffffff; width: 38px; height: 38px; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; border-radius: 10px;" class="shadow-sm">${SVG_ICONS.alertTriangle}</span>
          <h4 style="margin: 0; padding: 0; color: #450a0a; line-height: 1.25;" class="font-['Marcellus'] font-bold text-lg sm:text-xl">${formatInlineText(title)}</h4>
        </div>
        <div class="space-y-2.5">
          ${renderedBodyItems}
        </div>
      </div>`,
      faqItems: [],
    };
  }

  // 4. STEP-BY-STEP CARDS (:::steps or :::schritte)
  if (type === 'steps' || type === 'schritte') {
    const rawText = rawLines.join('\n');
    const chunks = rawText
      .split(/\n---\n/)
      .map((c) => c.trim())
      .filter(Boolean);

    const cardsHtml = chunks
      .map((chunk, idx) => {
        const cLines = chunk.split('\n').map((l) => l.trim()).filter(Boolean);
        let stepTitle = `Step ${idx + 1}`;
        let stepBody = cLines;
        if (cLines[0]?.startsWith('### ') || cLines[0]?.startsWith('**')) {
          stepTitle = stripLeadingEmojis(cLines[0].replace(/^###\s+/, '').replace(/^\*\*(.+?)\*\*$/, '$1'));
          stepBody = cLines.slice(1);
        }
        return `
        <div class="p-5 sm:p-6 rounded-2xl bg-white border border-zinc-200/90 shadow-sm hover:border-red-500/40 hover:shadow-md transition-all">
          <div style="display: flex; align-items: center; gap: 14px; margin-bottom: 10px;">
            <span style="background: linear-gradient(135deg, #dc2626 0%, #000000 100%); color: #ffffff; width: 36px; height: 36px; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; border-radius: 10px; font-weight: 700;" class="font-['Marcellus'] text-base shadow-sm">${idx + 1}</span>
            <h4 style="margin: 0; padding: 0; color: #09090b; line-height: 1.25;" class="font-['Marcellus'] font-bold text-lg sm:text-[19px]">${formatInlineText(stepTitle)}</h4>
          </div>
          <div style="color: #52525b;" class="text-[15px] sm:text-[15.5px] leading-relaxed space-y-1.5">
            ${stepBody.map((l) => `<p style="margin: 0; color: #52525b;">${formatInlineText(l)}</p>`).join('')}
          </div>
        </div>`;
      })
      .join('');

    return {
      html: `<div class="my-7 space-y-4">${cardsHtml}</div>`,
      faqItems: [],
    };
  }

  // 5. INFO CARD GRID (:::grid)
  if (type === 'grid') {
    const rawText = rawLines.join('\n');
    const chunks = rawText
      .split(/\n---\n/)
      .map((c) => c.trim())
      .filter(Boolean);

    // 2 cards side-by-side on desktop; 3+ cards stack as spacious full-width horizontal cards so text never cramps
    const isStackedRowLayout = chunks.length >= 3;
    const gridWrapperClass = isStackedRowLayout
      ? 'my-8 space-y-4'
      : 'my-8 grid grid-cols-1 sm:grid-cols-2 gap-5';

    const cardsHtml = chunks
      .map((chunk, idx) => {
        const cLines = chunk.split('\n').map((l) => l.trim()).filter(Boolean);
        let rawTitle = '';
        let cardBody = cLines;
        if (cLines[0]?.startsWith('### ') || cLines[0]?.startsWith('**')) {
          rawTitle = cLines[0].replace(/^###\s+/, '').replace(/^\*\*(.+?)\*\*$/, '$1');
          cardBody = cLines.slice(1);
        }
        const cleanTitle = stripLeadingEmojis(rawTitle);
        const iconSvg = getGridCardIcon(cleanTitle, idx);

        const leadLines = [];
        const bulletLines = [];
        cardBody.forEach((l) => {
          if (/^[-*•]\s+/.test(l)) {
            bulletLines.push(l.replace(/^[-*•]\s+/, '').trim());
          } else if (bulletLines.length === 0) {
            leadLines.push(l);
          } else {
            bulletLines.push(l);
          }
        });

        const leadHtml = leadLines
          .map(
            (l) =>
              `<p style="margin: 0 0 10px 0; color: #3f3f46;" class="text-[14.5px] sm:text-[15px] leading-relaxed">${formatInlineText(l)}</p>`
          )
          .join('');

        const bulletGridClass =
          isStackedRowLayout && bulletLines.length >= 3
            ? 'grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5'
            : 'space-y-2.5';

        const bulletsHtml = bulletLines.length
          ? `<ul style="margin: 0; padding: 0; list-style: none;" class="${bulletGridClass}">
              ${bulletLines
                .map(
                  (b) => `
                  <li style="display: flex; align-items: flex-start; gap: 10px;">
                    <span style="color: #dc2626; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 3px;">${SVG_ICONS.checkCircle}</span>
                    <span style="color: #3f3f46; flex: 1;" class="text-[14.5px] sm:text-[15px] leading-relaxed">${formatInlineText(b)}</span>
                  </li>`
                )
                .join('')}
            </ul>`
          : '';

        return `
        <div class="p-6 rounded-2xl bg-white border border-zinc-200/90 shadow-sm hover:border-red-500/40 hover:shadow-md transition-all flex flex-col justify-between">
          <div>
            ${
              cleanTitle
                ? `<div style="display: flex; align-items: center; gap: 13px; margin-bottom: 14px; padding-bottom: 12px; border-bottom: 1px solid #f4f4f5;">
                    <span style="background: linear-gradient(135deg, #dc2626 0%, #000000 100%); color: #ffffff; width: 38px; height: 38px; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; border-radius: 10px;" class="shadow-sm">${iconSvg}</span>
                    <h4 style="margin: 0; padding: 0; color: #09090b; line-height: 1.25;" class="font-['Marcellus'] font-bold text-lg sm:text-[19px]">${formatInlineText(cleanTitle)}</h4>
                  </div>`
                : ''
            }
            ${leadHtml}
            ${bulletsHtml}
          </div>
        </div>`;
      })
      .join('');

    return {
      html: `<div class="${gridWrapperClass}">${cardsHtml}</div>`,
      faqItems: [],
    };
  }

  // 6. IN-ARTICLE CTA BANNER (:::cta)
  if (type === 'cta') {
    let title = 'Ready to Build Your Next Digital Product?';
    let desc = 'Book a free strategy call with WebMavien engineers and get a tailored roadmap.';
    let btnLabel = 'Book Free Consultation';
    let btnUrl = '/contact';

    lines.forEach((line) => {
      if (line.startsWith('### ') || line.startsWith('## ')) {
        title = stripLeadingEmojis(line.replace(/^#{2,3}\s+/, ''));
      } else if (line.toLowerCase().startsWith('button:')) {
        const parts = line.replace(/^button:\s*/i, '').split('|');
        btnLabel = parts[0]?.trim() || btnLabel;
        btnUrl = parts[1]?.trim() || btnUrl;
      } else {
        desc = line;
      }
    });

    return {
      html: `
      <div style="background: linear-gradient(135deg, #000000 0%, #18181b 60%, #450a0a 100%); color: #ffffff;" class="my-9 p-6 sm:p-8 rounded-2xl shadow-xl relative overflow-hidden border border-red-500/20">
        <div class="absolute -right-10 -bottom-10 w-44 h-44 rounded-full bg-red-600/15 blur-2xl pointer-events-none"></div>
        <div class="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div class="max-w-xl">
            <span style="color: #f87171;" class="inline-block px-3 py-1 rounded-full bg-red-600/20 border border-red-500/30 text-[11px] font-bold uppercase tracking-widest mb-2.5">WebMavien Advisory</span>
            <h3 style="margin: 0 0 8px 0; color: #ffffff;" class="font-['Marcellus'] text-xl sm:text-2xl font-bold">${formatInlineText(title)}</h3>
            <p style="margin: 0; color: #e4e4e7;" class="text-sm sm:text-[15px] leading-relaxed">${formatInlineText(desc)}</p>
          </div>
          <a href="${btnUrl}" style="background: #dc2626; color: #ffffff; display: inline-flex; align-items: center; gap: 8px;" class="justify-center px-6 py-3.5 rounded-xl hover:bg-red-700 font-bold text-sm transition-all shrink-0 shadow-lg shadow-red-600/25">
            <span>${formatInlineText(btnLabel)}</span>
            ${SVG_ICONS.arrowRight}
          </a>
        </div>
      </div>`,
      faqItems: [],
    };
  }

  // 7. FAQ ACCORDION BLOCK (:::faq)
  if (type === 'faq') {
    const faqItems = [];
    let currentQ = null;
    let currentA = [];

    lines.forEach((line) => {
      if (line.startsWith('### ') || line.startsWith('**Q:') || line.startsWith('**F:')) {
        if (currentQ) {
          faqItems.push({ q: currentQ, a: currentA.join(' ') });
        }
        currentQ = line
          .replace(/^###\s+/, '')
          .replace(/^\*\*[QF]:\s*/, '')
          .replace(/\*\*$/, '');
        currentA = [];
      } else if (currentQ) {
        currentA.push(line);
      }
    });
    if (currentQ) {
      faqItems.push({ q: currentQ, a: currentA.join(' ') });
    }

    const accordionsHtml = faqItems
      .map(
        (item, idx) => `
        <details class="group bg-white rounded-2xl border border-zinc-200/90 px-6 py-4 [&_summary::-webkit-details-marker]:hidden shadow-xs hover:border-red-500/40 transition-colors" ${idx === 0 ? 'open' : ''}>
          <summary class="flex items-center justify-between cursor-pointer font-['Marcellus'] font-bold text-zinc-950 text-[16.5px] sm:text-[17.5px] py-1 select-none">
            <span class="pr-4">${formatInlineText(item.q)}</span>
            <span class="w-7 h-7 rounded-full bg-zinc-100 text-zinc-900 flex items-center justify-center shrink-0 transition-transform duration-200 group-open:rotate-180 group-open:bg-red-600 group-open:text-white">${SVG_ICONS.chevronDown}</span>
          </summary>
          <div class="pt-3 pb-1 text-zinc-600 text-[15px] sm:text-[15.5px] leading-relaxed border-t border-zinc-100 mt-3">
            ${formatInlineText(item.a)}
          </div>
        </details>`
      )
      .join('');

    return {
      html: `<div class="my-6 space-y-3.5">${accordionsHtml}</div>`,
      faqItems,
    };
  }

  // 8. SOURCES / REFERENCES BLOCK (:::sources or :::quellen)
  if (type === 'sources' || type === 'quellen') {
    const itemsHtml = lines
      .map((line) => {
        const cleaned = line.replace(/^[-*•]\s+/, '');
        if (cleaned.includes('|')) {
          const [label, url] = cleaned.split('|').map((s) => s.trim());
          return `
            <li style="display: flex; align-items: flex-start; gap: 10px;" class="text-sm text-zinc-600">
              <span style="color: #dc2626; display: inline-flex; align-items: center; margin-top: 2px; flex-shrink: 0;">${SVG_ICONS.arrowUpRight}</span>
              <a href="${url}" target="_blank" rel="noopener noreferrer" class="text-zinc-800 font-medium hover:text-red-600 underline decoration-zinc-300 hover:decoration-red-600 underline-offset-4 transition-colors break-all">${formatInlineText(label)}</a>
            </li>`;
        }
        return `
          <li style="display: flex; align-items: flex-start; gap: 10px;" class="text-sm text-zinc-600">
            <span style="color: #dc2626; display: inline-flex; align-items: center; margin-top: 3px; flex-shrink: 0;">${SVG_ICONS.checkCircle}</span>
            <span>${formatInlineText(cleaned)}</span>
          </li>`;
      })
      .join('');

    return {
      html: `
      <div class="my-8 p-6 rounded-2xl bg-zinc-50 border border-zinc-200/90">
        <p style="display: flex; align-items: center; gap: 8px; margin: 0 0 12px 0; color: #52525b;" class="text-xs font-bold uppercase tracking-widest">
          <span style="color: #dc2626; display: inline-flex; align-items: center;">${SVG_ICONS.bookOpen}</span>
          <span>References & Authoritative Sources</span>
        </p>
        <ul style="margin: 0; padding: 0; list-style: none;" class="space-y-2.5">${itemsHtml}</ul>
      </div>`,
      faqItems: [],
    };
  }

  // 9. CASE STUDY PROOF CARD BLOCK (:::casestudy)
  if (type === 'casestudy') {
    let title = 'Featured Client Case Study';
    let category = 'WebMavien Launch Story';
    let summary = '';
    let quote = '';
    let author = '';
    let metrics = [];
    let linkLabel = 'Read Full Case Study';
    let linkUrl = '/casestudies';

    lines.forEach((line) => {
      if (line.startsWith('### ') || line.startsWith('## ')) {
        title = stripLeadingEmojis(line.replace(/^#{2,3}\s+/, ''));
      } else if (line.toLowerCase().startsWith('category:')) {
        category = line.replace(/^category:\s*/i, '').trim();
      } else if (line.toLowerCase().startsWith('metrics:')) {
        metrics = line
          .replace(/^metrics:\s*/i, '')
          .split('|')
          .map((m) => m.trim())
          .filter(Boolean);
      } else if (line.toLowerCase().startsWith('quote:')) {
        quote = line.replace(/^quote:\s*/i, '').replace(/^["']|["']$/g, '').trim();
      } else if (line.toLowerCase().startsWith('author:')) {
        author = line.replace(/^author:\s*/i, '').trim();
      } else if (line.toLowerCase().startsWith('link:') || line.toLowerCase().startsWith('button:')) {
        const parts = line.replace(/^(?:link|button):\s*/i, '').split('|');
        linkLabel = parts[0]?.trim() || linkLabel;
        linkUrl = parts[1]?.trim() || linkUrl;
      } else if (!summary) {
        summary = line;
      }
    });

    const metricsHtml = metrics.length
      ? `<div class="flex flex-wrap gap-2.5 my-4">
          ${metrics
            .map(
              (m) =>
                `<span style="background: #fef2f2; color: #991b1b; border: 1px solid #fecaca;" class="px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold">${formatInlineText(m)}</span>`
            )
            .join('')}
        </div>`
      : '';

    const quoteHtml = quote
      ? `<blockquote style="margin: 12px 0 0 0; padding: 12px 16px; background: #fafafa; border-left: 3px solid #dc2626; border-radius: 0 12px 12px 0;">
          <p style="margin: 0; color: #3f3f46; font-style: italic;" class="text-xs sm:text-sm leading-relaxed">"${formatInlineText(quote)}"</p>
          ${author ? `<p style="margin: 6px 0 0 0; color: #09090b; font-weight: 700;" class="text-xs">— ${formatInlineText(author)}</p>` : ''}
        </blockquote>`
      : '';

    return {
      html: `
      <div class="my-8 p-6 sm:p-7 rounded-2xl bg-white border border-zinc-200/90 border-l-4 border-l-red-600 shadow-md hover:shadow-lg transition-all">
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; margin-bottom: 12px;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <span style="background: linear-gradient(135deg, #dc2626 0%, #000000 100%); color: #ffffff; width: 38px; height: 38px; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; border-radius: 10px;" class="shadow-sm">${SVG_ICONS.chart}</span>
            <div>
              <span style="color: #dc2626;" class="block text-[11px] font-bold uppercase tracking-widest">${formatInlineText(category)}</span>
              <h4 style="margin: 0; padding: 0; color: #09090b;" class="font-['Marcellus'] text-lg sm:text-xl font-bold">${formatInlineText(title)}</h4>
            </div>
          </div>
          <a href="${linkUrl}" style="background: linear-gradient(135deg, #dc2626 0%, #000000 100%); color: #ffffff; display: inline-flex; align-items: center; gap: 6px;" class="px-4 py-2 rounded-xl text-xs font-bold shadow-sm hover:opacity-95 transition-opacity">
            <span>${formatInlineText(linkLabel)}</span>
            ${SVG_ICONS.arrowRight}
          </a>
        </div>
        ${summary ? `<p style="margin: 0; color: #3f3f46;" class="text-[15px] leading-relaxed">${formatInlineText(summary)}</p>` : ''}
        ${metricsHtml}
        ${quoteHtml}
      </div>`,
      faqItems: [],
    };
  }

  return { html: '', faqItems: [] };
}

/**
 * Main parser: returns HTML string + extracted metadata (TOC headings, FAQ items, separated sections)
 */
export function parseArticleMarkdown(md, options = {}) {
  if (!md) {
    return {
      html: '',
      leadParagraph: '',
      takeawaysHtml: '',
      bodyHtml: '',
      faqHtml: '',
      sourcesHtml: '',
      ctaHtml: '',
      standDate: '',
      tocItems: [],
      faqItems: [],
    };
  }

  const normalizedMd = normalizeHtmlToMarkdownIfNeeded(md);
  const lines = normalizedMd.replace(/\r\n/g, '\n').split('\n');
  const htmlBlocks = [];
  const bodyBlocks = [];
  const tocItems = [];
  const allFaqItems = [];

  let leadParagraph = '';
  let takeawaysHtml = '';
  let sourcesHtml = '';
  let ctaHtml = '';
  let standDate = '';

  let listItems = [];
  let orderedItems = [];
  let tableRows = [];
  let customBlockType = null;
  let customBlockLines = [];
  let inCodeBlock = false;
  let codeBlockLang = '';
  let codeBlockLines = [];

  const pushBlock = (html) => {
    htmlBlocks.push(html);
    bodyBlocks.push(html);
  };

  const flushUnordered = () => {
    if (!listItems.length) return;
    const html = `<ul class="my-5 space-y-2.5 pl-1 list-none">${listItems
      .map(
        (item) =>
          `<li class="flex items-start gap-3 text-zinc-700 text-[16px] sm:text-[17px] leading-[1.8]">
            <span class="w-2 h-2 rounded-full bg-red-600 mt-2.5 shrink-0"></span>
            <span class="flex-1">${formatInlineText(item)}</span>
          </li>`
      )
      .join('')}</ul>`;
    pushBlock(html);
    listItems = [];
  };

  const flushOrdered = () => {
    if (!orderedItems.length) return;
    const html = `<ol class="my-5 space-y-3 pl-1 list-none">${orderedItems
      .map(
        (item, idx) =>
          `<li class="flex items-start gap-3.5 text-zinc-700 text-[16px] sm:text-[17px] leading-[1.8]">
            <span class="w-6 h-6 rounded-full bg-zinc-950 text-white text-xs font-bold flex items-center justify-center mt-1 shrink-0">${idx + 1}</span>
            <span class="flex-1">${formatInlineText(item)}</span>
          </li>`
      )
      .join('')}</ol>`;
    pushBlock(html);
    orderedItems = [];
  };

  const flushTable = () => {
    if (!tableRows.length) return;
    const parseRow = (row) =>
      row
        .replace(/^\|/, '')
        .replace(/\|$/, '')
        .split('|')
        .map((cell) => cell.trim());

    const headers = parseRow(tableRows[0]);
    let alignments = headers.map(() => 'left');
    let dataStartIndex = 1;

    if (tableRows.length > 1 && /^[\s|:-]+$/.test(tableRows[1])) {
      const sepCells = parseRow(tableRows[1]);
      alignments = sepCells.map((cell) => {
        const c = cell.trim();
        if (c.startsWith(':') && c.endsWith(':')) return 'center';
        if (c.endsWith(':')) return 'right';
        return 'left';
      });
      dataStartIndex = 2;
    }

    const alignClass = (colIdx) => {
      const align = alignments[colIdx] || 'left';
      if (align === 'center') return 'text-center';
      if (align === 'right') return 'text-right';
      return 'text-left';
    };

    const bodyRows = tableRows.slice(dataStartIndex).map(parseRow);

    const thead = `<thead class="bg-gradient-to-r from-black via-zinc-900 to-red-950 text-white"><tr>${headers
      .map(
        (h, cIdx) =>
          `<th class="px-4 sm:px-5 py-3.5 ${alignClass(cIdx)} text-[13px] font-bold uppercase tracking-wider border-b border-zinc-800 first:rounded-tl-xl last:rounded-tr-xl">${formatInlineText(h)}</th>`
      )
      .join('')}</tr></thead>`;

    const tbody = `<tbody class="divide-y divide-zinc-200/80 bg-white">${bodyRows
      .map(
        (row, rIdx) =>
          `<tr class="${rIdx % 2 === 1 ? 'bg-zinc-50/70' : 'bg-white'} hover:bg-red-50/40 transition-colors">${row
            .map(
              (cell, cIdx) =>
                `<td class="px-4 sm:px-5 py-3.5 text-[14.5px] sm:text-[15px] ${alignClass(cIdx)} ${
                  cIdx === 0 ? 'font-semibold text-zinc-950' : 'text-zinc-700'
                }">${formatInlineText(cell)}</td>`
            )
            .join('')}</tr>`
      )
      .join('')}</tbody>`;

    const html = `<div class="my-7 overflow-x-auto rounded-2xl border border-zinc-200 shadow-[0_8px_28px_-12px_rgba(0,0,0,0.08)]"><table class="w-full border-collapse min-w-[520px]">${thead}${tbody}</table></div>`;
    pushBlock(html);
    tableRows = [];
  };

  const flushAll = () => {
    flushUnordered();
    flushOrdered();
    flushTable();
  };

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const line = rawLine.trim();

    // Fenced code blocks ```lang ... ```
    if (line.startsWith('```')) {
      if (!inCodeBlock) {
        flushAll();
        inCodeBlock = true;
        codeBlockLang = line.slice(3).trim();
        codeBlockLines = [];
      } else {
        const escapedCode = codeBlockLines
          .join('\n')
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;');
        pushBlock(`
          <div class="my-6 rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-800 shadow-lg">
            ${
              codeBlockLang
                ? `<div class="px-4 py-2 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between"><span class="text-[11px] font-mono font-bold uppercase tracking-wider text-red-400">${codeBlockLang}</span><span class="flex gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-red-500/70"></span><span class="w-2.5 h-2.5 rounded-full bg-amber-500/70"></span><span class="w-2.5 h-2.5 rounded-full bg-emerald-500/70"></span></span></div>`
                : ''
            }
            <pre class="p-4 sm:p-5 overflow-x-auto text-xs sm:text-sm font-mono text-zinc-100 leading-relaxed m-0"><code>${escapedCode}</code></pre>
          </div>
        `);
        inCodeBlock = false;
        codeBlockLang = '';
        codeBlockLines = [];
      }
      continue;
    }

    if (inCodeBlock) {
      codeBlockLines.push(rawLine);
      continue;
    }

    // Handle inside custom :::block
    if (customBlockType) {
      if (line === ':::') {
        const { html, faqItems } = renderCustomBlock(customBlockType, customBlockLines);
        if (html) {
          htmlBlocks.push(html);
          if (customBlockType === 'takeaways' && !takeawaysHtml) {
            takeawaysHtml = html;
          } else if ((customBlockType === 'sources' || customBlockType === 'quellen') && !sourcesHtml) {
            sourcesHtml = html;
          } else if (customBlockType === 'cta') {
            ctaHtml = html;
          } else if (customBlockType !== 'faq') {
            bodyBlocks.push(html);
          }
        }
        if (faqItems.length) allFaqItems.push(...faqItems);
        customBlockType = null;
        customBlockLines = [];
      } else {
        customBlockLines.push(rawLine);
      }
      continue;
    }

    // Start of custom :::block
    const blockMatch = line.match(/^:::(\w+)\s*$/);
    if (blockMatch) {
      flushAll();
      customBlockType = blockMatch[1].toLowerCase();
      customBlockLines = [];
      continue;
    }

    if (!line) {
      flushAll();
      continue;
    }

    // Detect "Reviewed: ..." / "Stand: ..." line
    if (/^\*?(?:Stand|Reviewed|Last Reviewed|Verified):\s*(.+?)\*?$/i.test(line)) {
      flushAll();
      standDate = line
        .replace(/^\*?(?:Stand|Reviewed|Last Reviewed|Verified):\s*/i, '')
        .replace(/\*$/, '')
        .trim();
      continue;
    }

    // Skip duplicate FAQ headings in body since FAQ is rendered in its own dedicated section
    if (
      /^#{2,3}\s+(?:\d+[\.\)]\s*)?(?:Frequently Asked Questions|FAQ|Häufige Fragen)/i.test(line)
    ) {
      flushAll();
      continue;
    }

    // Table detection
    if (line.startsWith('|') && line.endsWith('|')) {
      flushUnordered();
      flushOrdered();
      tableRows.push(line);
      continue;
    } else if (tableRows.length) {
      flushTable();
    }

    // Horizontal Rule
    if (/^(-{3,}|\*{3,})$/.test(line)) {
      flushAll();
      pushBlock('<hr class="my-9 border-zinc-200" />');
      continue;
    }

    // Standalone Markdown Image: ![alt](url "optional caption")
    const imgMatch = line.match(/^!\[([^\]]*)\]\(([^\s)]+)(?:\s+"([^"]+)")?\)$/);
    if (imgMatch) {
      flushAll();
      const [, alt, src, caption] = imgMatch;
      pushBlock(`
        <figure class="my-8 rounded-2xl overflow-hidden border border-zinc-200 bg-zinc-50 shadow-sm">
          <img src="${src}" alt="${alt || 'Article visual'}" class="w-full max-h-[480px] object-cover" loading="lazy" />
          ${
            caption || alt
              ? `<figcaption class="px-4 py-2.5 text-xs text-zinc-500 text-center border-t border-zinc-200/70 italic">${formatInlineText(caption || alt)}</figcaption>`
              : ''
          }
        </figure>
      `);
      continue;
    }

    // Headings (H4, H3, H2, H1)
    if (line.startsWith('#### ')) {
      flushAll();
      const cleanH4 = stripHeadingNumbers(line.slice(5));
      pushBlock(
        `<h4 class="font-['Marcellus'] text-lg sm:text-xl font-bold text-zinc-950 mt-7 mb-2.5">${formatInlineText(cleanH4)}</h4>`
      );
      continue;
    }

    if (line.startsWith('### ')) {
      flushAll();
      const rawText = stripHeadingNumbers(line.slice(4));
      const id = slugifyHeading(rawText);
      pushBlock(
        `<h3 id="${id}" class="scroll-mt-28 font-['Marcellus'] text-xl sm:text-[22px] font-bold text-zinc-950 mt-8 mb-3">${formatInlineText(rawText)}</h3>`
      );
      continue;
    }

    if (line.startsWith('## ')) {
      flushAll();
      const rawText = stripHeadingNumbers(line.slice(3));
      const id = slugifyHeading(rawText);
      tocItems.push({ id, title: rawText.replace(/[*_`]/g, ''), level: 2 });
      pushBlock(
        `<h2 id="${id}" class="scroll-mt-28 font-['Marcellus'] text-2xl sm:text-[28px] font-bold text-zinc-950 mt-12 mb-4 pb-3 border-b border-zinc-200 leading-snug">${formatInlineText(rawText)}</h2>`
      );
      continue;
    }

    if (line.startsWith('# ')) {
      flushAll();
      // Skip if it's the very first line duplicating the Hero H1
      if (tocItems.length === 0 && bodyBlocks.length === 0 && !leadParagraph) {
        continue;
      }
      const rawText = stripHeadingNumbers(line.slice(2));
      const id = slugifyHeading(rawText);
      pushBlock(
        `<h2 id="${id}" class="scroll-mt-28 font-['Marcellus'] text-2xl sm:text-3xl font-bold text-zinc-950 mt-10 mb-4">${formatInlineText(rawText)}</h2>`
      );
      continue;
    }

    // Blockquote
    if (line.startsWith('> ')) {
      flushAll();
      pushBlock(
        `<blockquote class="my-7 pl-5 pr-6 py-4 border-l-4 border-red-600 bg-zinc-50 rounded-r-2xl italic text-zinc-800 text-[16px] sm:text-[17px] leading-relaxed shadow-xs">${formatInlineText(
          line.slice(2)
        )}</blockquote>`
      );
      continue;
    }

    // Unordered list
    if (line.startsWith('- ') || line.startsWith('* ') || line.startsWith('• ')) {
      flushOrdered();
      listItems.push(line.replace(/^[-*•]\s+/, ''));
      continue;
    }

    // Ordered list
    const orderedMatch = line.match(/^\d+\.\s+(.+)/);
    if (orderedMatch) {
      flushUnordered();
      orderedItems.push(orderedMatch[1]);
      continue;
    }

    flushAll();

    // Capture the very first plain paragraph before takeaways/headings as leadParagraph if options.extractLead is true
    if (options.extractLead && !leadParagraph && tocItems.length === 0 && !takeawaysHtml && bodyBlocks.length === 0) {
      leadParagraph = formatInlineText(line);
      htmlBlocks.push(
        `<p class="text-zinc-700 text-[17px] sm:text-[18.5px] leading-[1.85] my-5 font-medium">${leadParagraph}</p>`
      );
      continue;
    }

    pushBlock(
      `<p class="text-zinc-700 text-[16.5px] sm:text-[17.5px] leading-[1.85] my-4">${formatInlineText(line)}</p>`
    );
  }

  // Close any unclosed custom block
  if (customBlockType && customBlockLines.length) {
    const { html, faqItems } = renderCustomBlock(customBlockType, customBlockLines);
    if (html) {
      htmlBlocks.push(html);
      bodyBlocks.push(html);
    }
    if (faqItems.length) allFaqItems.push(...faqItems);
  }

  flushAll();

  return {
    html: htmlBlocks.join('\n'),
    leadParagraph,
    takeawaysHtml,
    bodyHtml: bodyBlocks.join('\n'),
    sourcesHtml,
    ctaHtml,
    standDate,
    tocItems,
    faqItems: allFaqItems,
  };
}

/**
 * Ready-to-insert snippet templates for the Admin Blog Editor toolbar
 */
export const BLOG_SNIPPETS = [
  {
    id: 'takeaways',
    label: '⚡ Key Takeaways',
    badge: 'Top Box',
    description: 'Executive summary box with checkmarks at the top of the article',
    snippet: `\n:::takeaways\n### Key Takeaways: Executive Summary\n- **Core Insight:** Summarize the primary engineering or business takeaway in one sentence.\n- **Cost & Timeline Impact:** Highlight key ROI, speed, or scalability metrics.\n- **Actionable Recommendation:** Give the reader a concrete next step they can apply immediately.\n:::\n`,
  },
  {
    id: 'table',
    label: '📊 Comparison Table',
    badge: 'Table',
    description: 'Responsive dark/red header data table for comparisons & metrics',
    snippet: `\n| Architecture / Option | Typical Timeline | Scalability | Best Use Case |\n| :--- | :--- | :--- | :--- |\n| **Custom Next.js + AI Stack** | 4 – 8 Weeks | Enterprise-grade | High-growth SaaS & SEO-critical platforms |\n| **No-Code / Low-Code MVP** | 2 – 3 Weeks | Moderate | Early prototype validation |\n| **Legacy Monolith** | 12+ Weeks | High maintenance | Internal enterprise systems |\n`,
  },
  {
    id: 'tip',
    label: '💡 Engineering Tip',
    badge: 'Callout',
    description: 'Dark luxury callout box for expert advice and best practices',
    snippet: `\n:::tip\n### WebMavien Engineering Tip\nImplement server-side rendering (SSR) with structured JSON-LD schemas from day one—retrofitting technical SEO later costs 3x more engineering effort.\n:::\n`,
  },
  {
    id: 'warning',
    label: '⚠️ Warning Box',
    badge: 'Alert',
    description: 'Red alert box for common pitfalls, risks, or security mistakes',
    snippet: `\n:::warning\n### Critical Watch-Out\nNever expose raw LLM API keys or unvalidated database queries in client-side components. Always route sensitive operations through server endpoints.\n:::\n`,
  },
  {
    id: 'steps',
    label: '🔢 Step-by-Step Cards',
    badge: 'Process',
    description: 'Numbered cards (1, 2, 3) for implementation roadmaps & workflows',
    snippet: `\n:::steps\n### Discovery & Architecture Blueprint\nDefine core user journeys, data models, and technical SEO requirements before writing code.\n---\n### Agile Sprint Execution\nBuild modular frontend and API layers with automated testing and continuous deployment.\n---\n### Performance & SEO Launch\nVerify Core Web Vitals, schema markup, and analytics tracking prior to production rollout.\n:::\n`,
  },
  {
    id: 'grid',
    label: 'Feature Card Grid',
    badge: 'Grid',
    description: 'Structured cards with SVG icons for pros/cons, tech stacks, or service tiers',
    snippet: `\n:::grid\n### High Performance\nSub-second page loads powered by Next.js App Router, edge caching, and optimized assets.\n---\n### AI-Native Workflows\nSeamless integration with OpenAI, vector databases, and automated lead qualification.\n---\n### Technical SEO Built-In\nAutomated JSON-LD schemas, canonical URLs, dynamic sitemaps, and semantic HTML.\n:::\n`,
  },
  {
    id: 'casestudy',
    label: 'Case Study Proof Card',
    badge: 'Client ROI',
    description: 'Embed a verified WebMavien client case study with ROI stats, founder quote, and link',
    snippet: `\n:::casestudy\n### Campuna — German Camping Marketplace\ncategory: Marketplace & Travel Tech (Bubble.io)\nWe engineered a two-sided German camping marketplace with flexible host listings, admin verification workflows, and integrated Stripe bookings in 4 weeks.\nmetrics: 200+ Listings Launched | 50% Platform Growth | 4-Week Delivery\nquote: Campuna is live! Thank you from the bottom of my heart for bringing this project to life together with me.\nauthor: Voigt, Founder of Campuna\nlink: Read Campuna Case Study | /casestudies/campuna\n:::\n`,
  },
  {
    id: 'faq',
    label: '❓ FAQ Accordion',
    badge: 'SEO Schema',
    description: 'Expandable Q&A accordions (automatically generates Google FAQPage JSON-LD)',
    snippet: `\n:::faq\n### How long does it take to launch a production-ready MVP?\nMost custom web or AI MVPs take between 4 to 8 weeks from architecture blueprint to production deployment.\n### Does this architecture support technical SEO out of the box?\nYes. Every page includes server-rendered metadata, canonical URLs, and structured JSON-LD schema graphs.\n### Can we scale the platform after initial launch?\nAbsolutely. The modular Next.js and cloud database architecture scales horizontally without requiring a rewrite.\n:::\n`,
  },
  {
    id: 'cta',
    label: '🎯 Conversion Banner',
    badge: 'Lead Gen',
    description: 'Dark/red call-to-action banner with button inside the article',
    snippet: `\n:::cta\n### Ready to Scale Your Digital Product?\nBook a free 30-minute technical discovery session with WebMavien's senior architects.\nbutton: Book Strategy Call | /contact\n:::\n`,
  },
  {
    id: 'sources',
    label: '📚 Sources & References',
    badge: 'E-E-A-T',
    description: 'Authoritative reference list at the bottom of the article for Google E-E-A-T',
    snippet: `\n:::sources\n- Google Search Central — Structured Data Documentation | https://developers.google.com/search/docs/appearance/structured-data\n- Next.js Official Documentation — App Router & Metadata | https://nextjs.org/docs\n- Web.dev — Core Web Vitals & Performance Benchmarks | https://web.dev/vitals/\n:::\n`,
  },
];
