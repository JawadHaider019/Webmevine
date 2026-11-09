'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Link2,
  Image as ImageIcon,
  Table as TableIcon,
  Code2,
  Eye,
  Sparkles,
  ChevronDown,
  Loader2,
  Check,
  X,
} from 'lucide-react';
import { blogService } from '@/services/blogService';
import {
  stripHeadingNumbers,
  repairCorruptedLinks,
} from '@/utils/articleParser';

/**
 * Converts Markdown into clean editable HTML for the Visual WYSIWYG surface
 */
function markdownToVisualHtml(md = '') {
  if (!md || !md.trim()) return '<p><br></p>';

  const lines = md.replace(/\r\n/g, '\n').split('\n');
  const html = [];
  let inUl = false;
  let inOl = false;
  let tableRows = [];
  let customBlock = null;
  let customLines = [];

  const formatInline = (text = '') =>
    repairCorruptedLinks(text)
      .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label, rawUrl) => {
        let url = rawUrl.trim();
        if (/^www\./i.test(url)) url = `https://${url}`;
        return `<a href="${url}" data-md-link="true">${label.trim()}</a>`;
      });

  const closeLists = () => {
    if (inUl) {
      html.push('</ul>');
      inUl = false;
    }
    if (inOl) {
      html.push('</ol>');
      inOl = false;
    }
  };

  const flushTable = () => {
    if (!tableRows.length) return;
    const parseRow = (r) =>
      r
        .replace(/^\|/, '')
        .replace(/\|$/, '')
        .split('|')
        .map((c) => c.trim());

    const headers = parseRow(tableRows[0]);
    const startIdx =
      tableRows.length > 1 && /^[\s|:-]+$/.test(tableRows[1]) ? 2 : 1;
    const body = tableRows.slice(startIdx).map(parseRow);

    html.push(
      `<table data-md-table="true" class="w-full my-4 border-collapse border border-zinc-300 rounded-xl overflow-hidden"><thead><tr class="bg-zinc-950 text-white">${headers
        .map(
          (h) =>
            `<th class="p-2.5 text-left text-xs font-bold border border-zinc-800">${formatInline(
              h
            )}</th>`
        )
        .join('')}</tr></thead><tbody>${body
        .map(
          (r) =>
            `<tr class="border-b border-zinc-200">${r
              .map(
                (c) =>
                  `<td class="p-2.5 text-sm border border-zinc-200">${formatInline(
                    c
                  )}</td>`
              )
              .join('')}</tr>`
        )
        .join('')}</tbody></table>`
    );
    tableRows = [];
  };

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    const line = raw.trim();

    if (customBlock) {
      if (line === ':::') {
        const blockRaw = `:::${customBlock}\n${customLines.join('\n')}\n:::`;
        html.push(
          `<div data-md-block="${encodeURIComponent(
            blockRaw
          )}" contenteditable="false" class="my-4 p-4 rounded-xl bg-red-50/50 border border-red-200 text-xs font-mono text-zinc-800 select-all"><div class="font-sans font-bold text-red-600 uppercase tracking-wider text-[10px] mb-1">Custom Block: :::${customBlock} (Switch to Markdown Code mode to edit block internals)</div><pre class="whitespace-pre-wrap m-0 font-mono text-xs">${customLines.join(
            '\n'
          )}</pre></div>`
        );
        customBlock = null;
        customLines = [];
      } else {
        customLines.push(raw);
      }
      continue;
    }

    const blockStart = line.match(/^:::(\w+)\s*$/);
    if (blockStart) {
      closeLists();
      flushTable();
      customBlock = blockStart[1];
      customLines = [];
      continue;
    }

    if (line.startsWith('|') && line.endsWith('|')) {
      closeLists();
      tableRows.push(line);
      continue;
    } else if (tableRows.length) {
      flushTable();
    }

    if (!line) {
      closeLists();
      continue;
    }

    const imgMatch = line.match(/^!\[([^\]]*)\]\(([^\s)]+)(?:\s+"([^"]+)")?\)$/);
    if (imgMatch) {
      closeLists();
      const [, alt, src] = imgMatch;
      html.push(
        `<figure data-md-img="true" class="my-4"><img src="${src}" alt="${
          alt || ''
        }" class="max-h-72 rounded-xl border border-zinc-200 object-cover" /></figure>`
      );
      continue;
    }

    if (line.startsWith('#### ')) {
      closeLists();
      html.push(`<h4>${formatInline(stripHeadingNumbers(line.slice(5)))}</h4>`);
      continue;
    }
    if (line.startsWith('### ')) {
      closeLists();
      html.push(`<h3>${formatInline(stripHeadingNumbers(line.slice(4)))}</h3>`);
      continue;
    }
    if (line.startsWith('## ') || line.startsWith('# ')) {
      closeLists();
      const clean = stripHeadingNumbers(line.replace(/^#{1,2}\s+/, ''));
      html.push(`<h2>${formatInline(clean)}</h2>`);
      continue;
    }
    if (line.startsWith('> ')) {
      closeLists();
      html.push(`<blockquote>${formatInline(line.slice(2))}</blockquote>`);
      continue;
    }
    if (line.startsWith('- ') || line.startsWith('* ') || line.startsWith('• ')) {
      if (inOl) {
        html.push('</ol>');
        inOl = false;
      }
      if (!inUl) {
        html.push('<ul>');
        inUl = true;
      }
      html.push(`<li>${formatInline(line.replace(/^[-*•]\s+/, ''))}</li>`);
      continue;
    }
    const olMatch = line.match(/^\d+\.\s+(.+)/);
    if (olMatch) {
      if (inUl) {
        html.push('</ul>');
        inUl = false;
      }
      if (!inOl) {
        html.push('<ol>');
        inOl = true;
      }
      html.push(`<li>${formatInline(olMatch[1])}</li>`);
      continue;
    }

    closeLists();
    html.push(`<p>${formatInline(line)}</p>`);
  }

  closeLists();
  flushTable();

  return html.join('\n') || '<p><br></p>';
}

/**
 * Converts Visual WYSIWYG DOM nodes back into clean Markdown
 */
function visualHtmlToMarkdown(containerEl) {
  if (!containerEl) return '';

  const serializeInline = (node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      return node.textContent || '';
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return '';

    const tag = node.tagName.toLowerCase();
    const inner = Array.from(node.childNodes).map(serializeInline).join('');

    if (tag === 'strong' || tag === 'b') {
      return inner.trim() ? `**${inner.trim()}**` : '';
    }
    if (tag === 'em' || tag === 'i') {
      return inner.trim() ? `*${inner.trim()}*` : '';
    }
    if (tag === 'code') {
      return inner.trim() ? `\`${inner.trim()}\`` : '';
    }
    if (tag === 'a') {
      let href = (node.getAttribute('href') || '').trim();
      if (/^www\./i.test(href)) href = `https://${href}`;
      const cleanLabel = inner.replace(/^\[+|\]+$/g, '').trim() || href;
      return href ? `[${cleanLabel}](${href})` : cleanLabel;
    }
    if (tag === 'br') {
      return '\n';
    }
    if (tag === 'img') {
      const src = node.getAttribute('src') || '';
      const alt = node.getAttribute('alt') || 'Image';
      return src ? `\n![${alt}](${src})\n` : '';
    }
    return inner;
  };

  const blocks = [];

  Array.from(containerEl.childNodes).forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const t = (node.textContent || '').trim();
      if (t) blocks.push(t);
      return;
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return;

    const tag = node.tagName.toLowerCase();

    if (node.getAttribute('data-md-block')) {
      blocks.push(decodeURIComponent(node.getAttribute('data-md-block')));
      return;
    }

    if (tag === 'figure' || tag === 'img') {
      const img = tag === 'img' ? node : node.querySelector('img');
      if (img) {
        const src = img.getAttribute('src') || '';
        const alt = img.getAttribute('alt') || 'Image';
        if (src) blocks.push(`![${alt}](${src})`);
      }
      return;
    }

    if (tag === 'table') {
      const rows = Array.from(node.querySelectorAll('tr'));
      if (!rows.length) return;
      const mdRows = rows.map((tr) => {
        const cells = Array.from(tr.querySelectorAll('th, td')).map((cell) =>
          serializeInline(cell).replace(/\n/g, ' ').trim() || ' '
        );
        return `| ${cells.join(' | ')} |`;
      });
      if (mdRows.length >= 1) {
        const colCount = Array.from(rows[0].querySelectorAll('th, td')).length || 2;
        const sep = `| ${Array(colCount).fill(':---').join(' | ')} |`;
        mdRows.splice(1, 0, sep);
      }
      blocks.push(mdRows.join('\n'));
      return;
    }

    if (tag === 'h1' || tag === 'h2') {
      const text = stripHeadingNumbers(serializeInline(node).trim());
      if (text) blocks.push(`## ${text}`);
      return;
    }
    if (tag === 'h3') {
      const text = stripHeadingNumbers(serializeInline(node).trim());
      if (text) blocks.push(`### ${text}`);
      return;
    }
    if (tag === 'h4' || tag === 'h5' || tag === 'h6') {
      const text = stripHeadingNumbers(serializeInline(node).trim());
      if (text) blocks.push(`#### ${text}`);
      return;
    }
    if (tag === 'blockquote') {
      const text = serializeInline(node).trim();
      if (text) blocks.push(`> ${text}`);
      return;
    }
    if (tag === 'ul') {
      const items = Array.from(node.querySelectorAll('li'))
        .map((li) => serializeInline(li).trim())
        .filter(Boolean)
        .map((t) => `- ${t}`);
      if (items.length) blocks.push(items.join('\n'));
      return;
    }
    if (tag === 'ol') {
      const items = Array.from(node.querySelectorAll('li'))
        .map((li) => serializeInline(li).trim())
        .filter(Boolean)
        .map((t, i) => `${i + 1}. ${t}`);
      if (items.length) blocks.push(items.join('\n'));
      return;
    }

    const text = serializeInline(node).trim();
    if (text) blocks.push(text);
  });

  return repairCorruptedLinks(blocks.join('\n\n'));
}

export default function RichWysiwygEditor({
  value = '',
  onChange,
  placeholder = 'Write your article content here...',
  minHeight = 360,
  compact = false,
  onOpenTableBuilder,
  snippets = [],
}) {
  const [mode, setMode] = useState('visual'); // 'visual' | 'code'
  const [currentBlockTag, setCurrentBlockTag] = useState('p');
  const [uploadingImg, setUploadingImg] = useState(false);
  const [showSnippetsMenu, setShowSnippetsMenu] = useState(false);

  // Custom inline Link Popover state
  const [showLinkPopover, setShowLinkPopover] = useState(false);
  const [linkUrl, setLinkUrl] = useState('https://');
  const [linkText, setLinkText] = useState('');
  const savedSelectionRef = useRef(null);

  const visualRef = useRef(null);
  const codeTextareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const isInternalChange = useRef(false);

  // Sync external markdown value into Visual Editor when needed
  useEffect(() => {
    if (mode !== 'visual' || !visualRef.current) return;
    if (isInternalChange.current) {
      isInternalChange.current = false;
      return;
    }
    const nextHtml = markdownToVisualHtml(value);
    if (visualRef.current.innerHTML !== nextHtml) {
      visualRef.current.innerHTML = nextHtml;
    }
  }, [value, mode]);

  // Detect active block tag (p, h2, h3, h4, blockquote) when cursor moves
  const detectCurrentLineBlock = useCallback(() => {
    if (mode !== 'visual' || !visualRef.current) return;
    const sel = window.getSelection();
    if (!sel || !sel.rangeCount) return;
    let node = sel.anchorNode;
    if (!node) return;
    if (node.nodeType === Node.TEXT_NODE) node = node.parentElement;

    while (node && node !== visualRef.current) {
      const tag = node.tagName?.toLowerCase();
      if (['p', 'h2', 'h3', 'h4', 'blockquote'].includes(tag)) {
        setCurrentBlockTag(tag);
        return;
      }
      node = node.parentElement;
    }
    setCurrentBlockTag('p');
  }, [mode]);

  const handleVisualInput = () => {
    if (!visualRef.current) return;
    isInternalChange.current = true;
    const md = visualHtmlToMarkdown(visualRef.current);
    onChange(md);
    detectCurrentLineBlock();
  };

  // Smart paste handler: converts rich HTML (from Word, Google Docs, web pages, ChatGPT) OR Markdown into clean Visual blocks
  const handleVisualPaste = (e) => {
    e.preventDefault();
    const htmlData = e.clipboardData.getData('text/html');
    const textData = e.clipboardData.getData('text/plain');

    let cleanHtmlToInsert = '';

    if (htmlData && htmlData.trim()) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlData, 'text/html');

      const sanitizeNode = (node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          return node.textContent
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
        }
        if (node.nodeType !== Node.ELEMENT_NODE) return '';

        const tag = node.tagName.toLowerCase();
        if (['style', 'script', 'meta', 'head', 'svg'].includes(tag)) return '';

        const childrenHtml = Array.from(node.childNodes).map(sanitizeNode).join('');

        if (tag === 'h1' || tag === 'h2') {
          const clean = stripHeadingNumbers(node.textContent || '');
          return clean ? `<h2>${clean}</h2>` : '';
        }
        if (tag === 'h3') {
          const clean = stripHeadingNumbers(node.textContent || '');
          return clean ? `<h3>${clean}</h3>` : '';
        }
        if (tag === 'h4' || tag === 'h5' || tag === 'h6') {
          const clean = stripHeadingNumbers(node.textContent || '');
          return clean ? `<h4>${clean}</h4>` : '';
        }

        if (tag === 'b' || tag === 'strong') return `<strong>${childrenHtml}</strong>`;
        if (tag === 'i' || tag === 'em') return `<em>${childrenHtml}</em>`;
        if (tag === 'code') return `<code>${childrenHtml}</code>`;
        if (tag === 'a') {
          let href = (node.getAttribute('href') || '').trim();
          if (/^www\./i.test(href)) href = `https://${href}`;
          return href ? `<a href="${href}">${childrenHtml}</a>` : childrenHtml;
        }
        if (tag === 'ul') return `<ul>${childrenHtml}</ul>`;
        if (tag === 'ol') return `<ol>${childrenHtml}</ol>`;
        if (tag === 'li') return `<li>${childrenHtml}</li>`;
        if (tag === 'blockquote') return `<blockquote>${childrenHtml}</blockquote>`;
        if (tag === 'br') return '<br>';
        if (tag === 'p' || tag === 'div') {
          const style = (node.getAttribute('style') || '').toLowerCase();
          const fontSizeMatch = style.match(/font-size:\s*(\d+)pt/i);
          const ptSize = fontSizeMatch ? Number(fontSizeMatch[1]) : 0;
          if (ptSize >= 16) {
            return `<h2>${stripHeadingNumbers(node.textContent || '')}</h2>`;
          }
          if (ptSize >= 13) {
            return `<h3>${stripHeadingNumbers(node.textContent || '')}</h3>`;
          }
          return childrenHtml.trim() ? `<p>${childrenHtml}</p>` : '';
        }
        if (tag === 'span') {
          const style = (node.getAttribute('style') || '').toLowerCase();
          const isBold =
            style.includes('font-weight: 700') ||
            style.includes('font-weight: bold') ||
            style.includes('font-weight:700');
          return isBold ? `<strong>${childrenHtml}</strong>` : childrenHtml;
        }

        return childrenHtml;
      };

      cleanHtmlToInsert = Array.from(doc.body.childNodes).map(sanitizeNode).join('');
    }

    if (
      !cleanHtmlToInsert ||
      (textData && /(^#{1,4}\s|\*\*|\[.+\]\(.+\)|^:::)/m.test(textData))
    ) {
      cleanHtmlToInsert = markdownToVisualHtml(textData);
    }

    document.execCommand('insertHTML', false, cleanHtmlToInsert);
    handleVisualInput();
  };

  // Apply formatting in Visual or Code mode
  const applyBlockTag = (tag) => {
    setCurrentBlockTag(tag);
    if (mode === 'visual' && visualRef.current) {
      visualRef.current.focus();
      document.execCommand('formatBlock', false, `<${tag}>`);
      handleVisualInput();
    } else if (mode === 'code' && codeTextareaRef.current) {
      const prefix =
        tag === 'h2'
          ? '## '
          : tag === 'h3'
          ? '### '
          : tag === 'h4'
          ? '#### '
          : tag === 'blockquote'
          ? '> '
          : '';
      insertMarkdownSyntax(prefix, '');
    }
  };

  const applyInlineCommand = (cmd) => {
    if (mode === 'visual' && visualRef.current) {
      visualRef.current.focus();
      document.execCommand(cmd, false, null);
      handleVisualInput();
    } else if (mode === 'code') {
      if (cmd === 'bold') insertMarkdownSyntax('**', '**', 'bold text');
      if (cmd === 'italic') insertMarkdownSyntax('*', '*', 'italic text');
      if (cmd === 'insertUnorderedList') insertMarkdownSyntax('\n- ', '', 'List item');
      if (cmd === 'insertOrderedList') insertMarkdownSyntax('\n1. ', '', 'List item');
    }
  };

  const insertMarkdownSyntax = (prefix, suffix = '', defaultText = '') => {
    const textarea = codeTextareaRef.current;
    if (!textarea) {
      onChange(`${value}\n${prefix}${defaultText}${suffix}`);
      return;
    }
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = value.substring(start, end) || defaultText;
    const next =
      value.substring(0, start) + prefix + selected + suffix + value.substring(end);
    onChange(next);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + selected.length);
    }, 10);
  };

  const openLinkDialog = () => {
    if (mode === 'visual' && visualRef.current) {
      const sel = window.getSelection();
      if (sel && sel.rangeCount > 0) {
        savedSelectionRef.current = sel.getRangeAt(0).cloneRange();
        const selectedStr = sel.toString().trim();
        let existingHref = 'https://';
        let node = sel.anchorNode;
        if (node && node.nodeType === Node.TEXT_NODE) node = node.parentElement;
        const anchorEl = node?.closest?.('a');
        if (anchorEl) {
          existingHref = anchorEl.getAttribute('href') || 'https://';
        }
        setLinkText(selectedStr || (anchorEl ? anchorEl.textContent : ''));
        setLinkUrl(existingHref);
      } else {
        setLinkText('');
        setLinkUrl('https://');
      }
    } else if (mode === 'code' && codeTextareaRef.current) {
      const textarea = codeTextareaRef.current;
      const selected = value.substring(textarea.selectionStart, textarea.selectionEnd).trim();
      setLinkText(selected);
      setLinkUrl('https://');
    }
    setShowLinkPopover(true);
  };

  const confirmInsertLink = (e) => {
    if (e) e.preventDefault();
    let cleanUrl = linkUrl.trim();
    if (!cleanUrl) {
      setShowLinkPopover(false);
      return;
    }
    if (/^www\./i.test(cleanUrl)) {
      cleanUrl = `https://${cleanUrl}`;
    } else if (!/^(https?:\/\/|\/|#|mailto:|tel:)/i.test(cleanUrl)) {
      cleanUrl = `https://${cleanUrl}`;
    }

    const displayLabel = (linkText || '').replace(/^\[+|\]+$/g, '').trim() || cleanUrl;

    if (mode === 'visual' && visualRef.current) {
      visualRef.current.focus();
      if (savedSelectionRef.current) {
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(savedSelectionRef.current);
      }
      const anchorHtml = `<a href="${cleanUrl}" data-md-link="true">${displayLabel}</a> `;
      document.execCommand('insertHTML', false, anchorHtml);
      handleVisualInput();
    } else {
      insertMarkdownSyntax(`[${displayLabel}](`, ')', cleanUrl);
    }

    setShowLinkPopover(false);
    setLinkUrl('https://');
    setLinkText('');
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImg(true);
    try {
      const url = await blogService.uploadImage(file);
      const mdImg = `\n\n![${file.name.replace(/\.[^.]+$/, '')}](${url})\n\n`;
      const nextMd = `${value}${mdImg}`;
      onChange(nextMd);
      if (mode === 'visual' && visualRef.current) {
        visualRef.current.innerHTML = markdownToVisualHtml(nextMd);
      }
    } catch (err) {
      alert(err.message || 'Image upload failed');
    } finally {
      setUploadingImg(false);
      e.target.value = '';
    }
  };

  return (
    <div className="rounded-2xl border border-zinc-200/90 bg-white shadow-xs overflow-hidden focus-within:ring-2 focus-within:ring-red-600/20 focus-within:border-red-600 transition-all">
      {/* Top WordPress / Sanity Style Formatting Toolbar */}
      <div className="px-3 py-2 bg-zinc-50 border-b border-zinc-200/80 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1">
          {/* Paragraph / Heading Style Selector (Automatically reflects current line!) */}
          <select
            value={currentBlockTag}
            onChange={(e) => applyBlockTag(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-white border border-zinc-200 text-xs font-bold text-zinc-800 focus:outline-none focus:border-red-600 cursor-pointer shadow-2xs"
            title="Format for current line (Paragraph or Heading)"
          >
            <option value="p">Paragraph (Normal)</option>
            <option value="h2">Heading 2 (H2 — In TOC)</option>
            <option value="h3">Heading 3 (H3 — Subheading)</option>
            <option value="h4">Heading 4 (H4 — Minor Heading)</option>
            <option value="blockquote">Blockquote (Quote)</option>
          </select>

          <div className="w-px h-5 bg-zinc-200 mx-1" />

          <button
            type="button"
            onClick={() => applyInlineCommand('bold')}
            title="Bold (Ctrl+B)"
            className="p-1.5 rounded-lg text-zinc-700 hover:bg-white hover:shadow-2xs transition-all"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => applyInlineCommand('italic')}
            title="Italic (Ctrl+I)"
            className="p-1.5 rounded-lg text-zinc-700 hover:bg-white hover:shadow-2xs transition-all"
          >
            <Italic className="w-4 h-4" />
          </button>

          <div className="w-px h-5 bg-zinc-200 mx-1" />

          <button
            type="button"
            onClick={() => applyInlineCommand('insertUnorderedList')}
            title="Bullet List"
            className="p-1.5 rounded-lg text-zinc-700 hover:bg-white hover:shadow-2xs transition-all"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => applyInlineCommand('insertOrderedList')}
            title="Numbered List"
            className="p-1.5 rounded-lg text-zinc-700 hover:bg-white hover:shadow-2xs transition-all"
          >
            <ListOrdered className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => applyBlockTag('blockquote')}
            title="Quote Block"
            className="p-1.5 rounded-lg text-zinc-700 hover:bg-white hover:shadow-2xs transition-all"
          >
            <Quote className="w-4 h-4" />
          </button>

          <div className="w-px h-5 bg-zinc-200 mx-1" />

          {/* Link Popover Trigger */}
          <div className="relative">
            <button
              type="button"
              onClick={openLinkDialog}
              title="Insert Link (Ctrl+K)"
              className={`p-1.5 rounded-lg transition-all flex items-center gap-1 text-xs font-semibold ${
                showLinkPopover
                  ? 'bg-red-600 text-white shadow-2xs'
                  : 'text-zinc-700 hover:bg-white hover:shadow-2xs'
              }`}
            >
              <Link2 className="w-4 h-4" />
              <span className="hidden sm:inline">Link</span>
            </button>

            {showLinkPopover && (
              <div className="absolute left-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-zinc-200 p-4 z-40 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-900 flex items-center gap-1.5">
                    <Link2 className="w-3.5 h-3.5 text-red-600" />
                    Insert or Edit Link
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowLinkPopover(false)}
                    className="p-1 rounded-lg text-zinc-400 hover:text-zinc-700"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">
                    Display Text (Anchor Text)
                  </label>
                  <input
                    type="text"
                    value={linkText}
                    onChange={(e) => setLinkText(e.target.value)}
                    placeholder="e.g. AI Consultation Services"
                    className="w-full px-3 py-1.5 rounded-lg border border-zinc-200 text-xs text-zinc-900 focus:outline-none focus:border-red-600"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">
                    Destination URL
                  </label>
                  <input
                    type="text"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') confirmInsertLink(e);
                    }}
                    placeholder="https://... or /contact"
                    autoFocus
                    className="w-full px-3 py-1.5 rounded-lg border border-zinc-200 text-xs font-mono text-zinc-900 focus:outline-none focus:border-red-600"
                  />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div className="flex gap-1">
                    {[
                      { label: '/contact', url: '/contact' },
                      { label: '/blog', url: '/blog' },
                    ].map((preset) => (
                      <button
                        key={preset.url}
                        type="button"
                        onClick={() => setLinkUrl(preset.url)}
                        className="px-2 py-0.5 rounded bg-zinc-100 hover:bg-zinc-200 text-[10px] font-mono text-zinc-600"
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={confirmInsertLink}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs font-bold hover:bg-red-700 transition-colors"
                  >
                    <Check className="w-3.5 h-3.5" /> Insert Link
                  </button>
                </div>
              </div>
            )}
          </div>

          {!compact && (
            <>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingImg}
                title="Upload & Insert Image"
                className="p-1.5 rounded-lg text-zinc-700 hover:bg-white hover:shadow-2xs transition-all flex items-center gap-1 text-xs font-semibold"
              >
                {uploadingImg ? (
                  <Loader2 className="w-4 h-4 animate-spin text-red-600" />
                ) : (
                  <ImageIcon className="w-4 h-4 text-red-600" />
                )}
              </button>

              {onOpenTableBuilder && (
                <button
                  type="button"
                  onClick={onOpenTableBuilder}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-red-50 text-red-700 border border-red-200 text-xs font-bold hover:bg-red-600 hover:text-white transition-all ml-1"
                >
                  <TableIcon className="w-3.5 h-3.5" />
                  <span>+ Table</span>
                </button>
              )}

              {snippets.length > 0 && (
                <div className="relative ml-1">
                  <button
                    type="button"
                    onClick={() => setShowSnippetsMenu((v) => !v)}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white border border-zinc-200 text-xs font-bold text-zinc-700 hover:border-red-600 transition-all"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-red-600" />
                    <span>+ Design Block</span>
                    <ChevronDown className="w-3 h-3" />
                  </button>

                  {showSnippetsMenu && (
                    <div className="absolute left-0 top-full mt-1.5 w-72 bg-white rounded-2xl shadow-xl border border-zinc-200 p-2 z-30 space-y-1">
                      {snippets.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => {
                            const nextMd = `${value}\n${item.snippet}\n`;
                            onChange(nextMd);
                            if (mode === 'visual' && visualRef.current) {
                              visualRef.current.innerHTML = markdownToVisualHtml(nextMd);
                            }
                            setShowSnippetsMenu(false);
                          }}
                          className="w-full text-left p-2.5 rounded-xl hover:bg-zinc-50 transition-colors flex flex-col gap-0.5"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-zinc-900">{item.label}</span>
                            <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-red-50 text-red-700">
                              {item.badge}
                            </span>
                          </div>
                          <span className="text-[11px] text-zinc-500">{item.description}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Right: Visual vs Markdown Code Toggle */}
        <div className="flex items-center bg-zinc-200/70 p-0.5 rounded-lg text-[11px] font-bold">
          <button
            type="button"
            onClick={() => setMode('visual')}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md transition-all ${
              mode === 'visual'
                ? 'bg-white text-zinc-950 shadow-2xs'
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            <Eye className="w-3 h-3" /> Visual
          </button>
          <button
            type="button"
            onClick={() => setMode('code')}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md transition-all ${
              mode === 'code'
                ? 'bg-white text-zinc-950 shadow-2xs'
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            <Code2 className="w-3 h-3" /> Markdown
          </button>
        </div>
      </div>

      {/* Editor Surface */}
      {mode === 'visual' ? (
        <div
          ref={visualRef}
          contentEditable
          suppressContentEditableWarning
          onInput={handleVisualInput}
          onKeyUp={detectCurrentLineBlock}
          onKeyDown={(e) => {
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
              e.preventDefault();
              openLinkDialog();
            }
          }}
          onMouseUp={detectCurrentLineBlock}
          onPaste={handleVisualPaste}
          data-placeholder={placeholder}
          style={{ minHeight: `${minHeight}px` }}
          className="p-5 focus:outline-none text-zinc-800 text-[15.5px] leading-[1.8]
            [&_h2]:font-['Marcellus'] [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-zinc-950 [&_h2]:mt-6 [&_h2]:mb-2 [&_h2]:pb-1.5 [&_h2]:border-b [&_h2]:border-zinc-200
            [&_h3]:font-['Marcellus'] [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-zinc-950 [&_h3]:mt-5 [&_h3]:mb-1.5
            [&_h4]:font-['Marcellus'] [&_h4]:text-lg [&_h4]:font-bold [&_h4]:text-zinc-950 [&_h4]:mt-4 [&_h4]:mb-1
            [&_p]:my-2.5
            [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-3 [&_ul]:space-y-1
            [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:my-3 [&_ol]:space-y-1
            [&_blockquote]:pl-4 [&_blockquote]:py-2 [&_blockquote]:my-3 [&_blockquote]:border-l-4 [&_blockquote]:border-red-600 [&_blockquote]:bg-zinc-50 [&_blockquote]:italic [&_blockquote]:rounded-r-xl
            [&_a]:text-red-600 [&_a]:font-semibold [&_a]:underline [&_a]:decoration-red-600/40 [&_a]:underline-offset-4
            [&_strong]:font-bold [&_strong]:text-zinc-950"
        />
      ) : (
        <textarea
          ref={codeTextareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={{ minHeight: `${minHeight}px` }}
          className="w-full p-5 text-sm font-mono text-zinc-800 leading-relaxed focus:outline-none resize-y bg-zinc-950/[0.02]"
        />
      )}
    </div>
  );
}

