// src/app/blog/[slug]/page.jsx
"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  FiCalendar, FiClock, FiUser, FiTag, FiArrowLeft, FiArrowRight,
  FiTwitter, FiFacebook, FiLinkedin, FiLink, FiCheck, FiRefreshCw,
  FiAlertCircle
} from 'react-icons/fi';
import { LuSparkles } from 'react-icons/lu';
import SectionHeader from '@/components/SectionHeader';
import { getBlogBySlug, getRelatedBlogs, formatDate } from '@/utils/blogUtils';

// Function to strip markdown for excerpts
const stripMarkdown = (text) => {
  if (!text) return '';

  return text
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/\*\*\*(.*?)\*\*\*/g, '$1')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/__(.*?)__/g, '$1')
    .replace(/_(.*?)_/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/!\[.*?\]\(.*?\)/g, '')
    .replace(/#{1,6}\s/g, '')
    .replace(/`{3}[\s\S]*?`{3}/g, '')
    .replace(/`(.*?)`/g, '$1')
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
};

// Markdown Renderer
const MarkdownRenderer = ({ content }) => {
  if (!content) return null;

  const renderFormattedContent = (text) => {
    if (!text) return null;

    // Check for raw HTML / Custom styled pages
    if (text.toLowerCase().includes('<!doctype html>') || text.includes('<!-- RAW_HTML -->')) {
      return (
        <iframe
          srcDoc={text}
          className="w-full border-0 bg-white"
          style={{ overflow: 'hidden' }}
          scrolling="no"
          title="Custom HTML Content"
          onLoad={(e) => {
            const iframe = e.target;
            const adjustHeight = () => {
              try {
                const height = iframe.contentWindow.document.documentElement.scrollHeight;
                iframe.style.height = height + 'px';
              } catch (err) { }
            };
            adjustHeight();
            setTimeout(adjustHeight, 500);
            setTimeout(adjustHeight, 2000);
          }}
        />
      );
    }

    const lines = text.split('\n');
    const result = [];
    let i = 0;

    const processInlineFormatting = (content) => {
      let processedContent = content;
      // Custom Button: [Text](btn:url)
      processedContent = processedContent.replace(
        /\[([^\]]+)\]\(btn:([^)]+)\)/g,
        '<a href="$2" target="_blank" rel="noopener noreferrer" class="inline-flex items-center px-8 py-4 bg-gradient-to-r from-red-600 to-black text-white font-bold rounded-full hover:scale-105 transition-all shadow-xl hover:shadow-2xl my-4">$1</a>'
      );
      // Bold/Italic/Links
      processedContent = processedContent.replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>');
      processedContent = processedContent.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      processedContent = processedContent.replace(/\*(.*?)\*/g, '<em>$1</em>');
      processedContent = processedContent.replace(
        /\[([^\]]+)\]\(([^)]+)\)/g,
        (match, linkText, url) => {
          if (url.startsWith('btn:')) return match;
          return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-red-600 hover:text-red-700 underline">${linkText}</a>`;
        }
      );
      return processedContent;
    };

    while (i < lines.length) {
      const line = lines[i];

      // Handle Tables
      if (line.trim().startsWith('|') && i + 1 < lines.length && lines[i + 1].replace(/\s/g, '').includes('|-')) {
        const tableLines = [];
        let j = i;
        while (j < lines.length && lines[j].trim().startsWith('|')) {
          tableLines.push(lines[j]);
          j++;
        }

        if (tableLines.length >= 2) {
          const headers = tableLines[0].split('|').filter(cell => cell.trim() !== '').map(cell => cell.trim());
          const rows = tableLines.slice(2).map(row =>
            row.split('|').filter(cell => cell.trim() !== '').map(cell => cell.trim())
          );

          result.push(
            <div key={`table-${i}`} className="overflow-x-auto my-8 rounded-xl border border-gray-200 shadow-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {headers.map((header, idx) => (
                      <th key={idx} className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                        <span dangerouslySetInnerHTML={{ __html: processInlineFormatting(header) }} />
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {rows.map((row, rowIdx) => (
                    <tr key={rowIdx} className={rowIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                      {row.map((cell, cellIdx) => (
                        <td key={cellIdx} className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          <span dangerouslySetInnerHTML={{ __html: processInlineFormatting(cell) }} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
          i = j;
          continue;
        }
      }

      // Headers
      if (line.startsWith('# ')) {
        result.push(<h1 key={i} className="text-3xl font-bold text-gray-900 mt-8 mb-4"><span dangerouslySetInnerHTML={{ __html: processInlineFormatting(line.substring(2)) }} /></h1>);
      } else if (line.startsWith('## ')) {
        result.push(<h2 key={i} className="text-2xl font-bold text-gray-800 mt-6 mb-3"><span dangerouslySetInnerHTML={{ __html: processInlineFormatting(line.substring(3)) }} /></h2>);
      } else if (line.startsWith('### ')) {
        result.push(<h3 key={i} className="text-xl font-semibold text-gray-800 mt-5 mb-2"><span dangerouslySetInnerHTML={{ __html: processInlineFormatting(line.substring(4)) }} /></h3>);
      }

      // Images
      else if (line.startsWith('![') && line.includes('](')) {
        const altMatch = line.match(/!\[(.*?)\]/);
        const urlMatch = line.match(/\((.*?)\)/);
        if (urlMatch) {
          result.push(
            <div key={i} className="my-8">
              <img
                src={urlMatch[1]}
                alt={altMatch ? altMatch[1] : ''}
                className="w-full rounded-xl shadow-lg"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/800x400?text=Image+Not+Found';
                }}
              />
            </div>
          );
        }
      }

      else if (line.trim()) {
        if (line.startsWith('- ')) {
          result.push(
            <li key={i} className="ml-6 list-disc text-gray-700 mb-2">
              <span dangerouslySetInnerHTML={{ __html: processInlineFormatting(line.substring(2)) }} />
            </li>
          );
        } else if (/^\d+\.\s/.test(line)) {
          result.push(
            <li key={i} className="ml-6 list-decimal text-gray-700 mb-2">
              <span dangerouslySetInnerHTML={{ __html: processInlineFormatting(line.replace(/^\d+\.\s/, '')) }} />
            </li>
          );
        } else {
          result.push(
            <p key={i} className="mb-4 text-gray-700 leading-relaxed">
              <span dangerouslySetInnerHTML={{ __html: processInlineFormatting(line) }} />
            </p>
          );
        }
      } else {
        result.push(<br key={i} />);
      }
      i++;
    }
    return result;
  };

  return (
    <div className="prose prose-lg max-w-none text-gray-900">
      {renderFormattedContent(content)}
    </div>
  );
};

export default function BlogPostPage() {
  const params = useParams();
  const [blog, setBlog] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadBlog();
  }, [params.slug]);

  const loadBlog = async () => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('🔍 Looking for blog with slug:', params.slug);
      const post = await getBlogBySlug(params.slug);

      if (post) {
        console.log('✅ Blog found:', post.title);
        setBlog(post);
        const related = await getRelatedBlogs(post);
        setRelatedPosts(related);
      } else {
        console.error('❌ Blog not found for slug:', params.slug);
        setError('Blog post not found');
      }
    } catch (error) {
      console.error('❌ Error loading blog:', error);
      setError('Failed to load blog post');
    } finally {
      setIsLoading(false);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Extract headings for table of contents
  const extractHeadings = (content) => {
    if (!content) return [];
    const headings = [];
    const lines = content.split('\n');
    lines.forEach(line => {
      if (line.startsWith('# ')) {
        headings.push({ level: 1, text: line.substring(2) });
      } else if (line.startsWith('## ')) {
        headings.push({ level: 2, text: line.substring(3) });
      } else if (line.startsWith('### ')) {
        headings.push({ level: 3, text: line.substring(4) });
      }
    });
    return headings.slice(0, 5);
  };

  const headings = extractHeadings(blog?.content);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <FiRefreshCw className="animate-spin text-red-600 text-3xl mx-auto mb-4" />
          <p className="text-gray-600">Loading article...</p>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-4 flex items-center gap-2">
            <FiAlertCircle size={20} />
            <p className="font-medium">{error || 'Post not found'}</p>
          </div>
          <Link href="/blog" className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 font-medium">
            <FiArrowLeft size={18} />
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Back Navigation */}
      <div className="border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <Link href="/blog" className="inline-flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors">
            <FiArrowLeft size={18} />
            Back to Blog
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 to-black text-white py-16">
        <div className="absolute inset-0 opacity-30">
          {blog.imageUrl && (
            <img
              src={blog.imageUrl}
              alt={blog.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          )}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />

        <div className="relative max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            {blog.category && (
              <span className="inline-block bg-red-600 text-white px-4 py-1 rounded-full text-sm font-medium mb-4">
                {blog.category}
              </span>
            )}

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              {blog.title}
            </h1>

            <div className="flex items-center justify-center gap-4 text-sm text-gray-300">
              <span className="flex items-center gap-1">
                <FiCalendar size={14} />
                {formatDate(blog.createdAt)}
              </span>
              <span className="flex items-center gap-1">
                <FiClock size={14} />
                {blog.readTime} min read
              </span>
              <span className="flex items-center gap-1">
                <FiUser size={14} />
                By WebMavien
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <motion.article
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="prose prose-lg max-w-none"
            >
              <MarkdownRenderer content={blog.content} />
            </motion.article>

            {/* Tags */}
            {blog.tags && blog.tags.length > 0 && (
              <div className="mt-8 pt-8 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-500 mb-3 flex items-center gap-2">
                  <FiTag size={14} />
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {blog.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Share */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-medium text-gray-900 mb-3">Share this post</h3>
                <div className="flex flex-wrap gap-2">
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(blog.title)}&url=${encodeURIComponent(window.location.href)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-[#1DA1F2] text-white rounded-lg hover:opacity-90 transition-opacity"
                  >
                    <FiTwitter size={18} />
                  </a>
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-[#4267B2] text-white rounded-lg hover:opacity-90 transition-opacity"
                  >
                    <FiFacebook size={18} />
                  </a>
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-[#0077B5] text-white rounded-lg hover:opacity-90 transition-opacity"
                  >
                    <FiLinkedin size={18} />
                  </a>
                  <button
                    onClick={copyLink}
                    className="p-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    {copied ? <FiCheck size={18} /> : <FiLink size={18} />}
                  </button>
                </div>
              </div>

              {/* Table of Contents */}
              {headings.length > 0 && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-medium text-gray-900 mb-3">Table of Contents</h3>
                  <ul className="space-y-2 text-sm">
                    {headings.map((heading, index) => (
                      <li key={index}>
                        <a
                          href={`#heading-${index}`}
                          className={`text-gray-600 hover:text-red-600 block ${heading.level === 2 ? 'ml-3' : heading.level === 3 ? 'ml-6' : ''
                            }`}
                        >
                          {heading.text}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="mb-12">
              <SectionHeader
                smallHeading="Keep Reading"
                heading="Related Articles"
                gradientHeading={true}
                gradientFrom="from-black"
                gradientVia="via-red-600"
                gradientTo="to-gray-900"
                smallHeadingColor="text-red-600"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedPosts.map(post => {
                const postDate = post.createdAt ? new Date(post.createdAt) : new Date();
                const day = postDate.getDate();
                const month = postDate.toLocaleString('en', { month: 'short' });
                const year = postDate.getFullYear();

                return (
                  <Link
                    href={`/blog/${post.slug}`}
                    key={post.id}
                    className="group bg-white rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden hover:border-gray-400"
                  >
                    {/* Featured Image */}
                    <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                      {post.imageUrl ? (
                        <img
                          src={post.imageUrl}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-gray-400">No image</span>
                        </div>
                      )}

                      {/* Category Overlay */}
                      {post.category && (
                        <div className="absolute top-4 left-4">
                          <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-gray-900 text-xs font-semibold uppercase tracking-wider rounded-full shadow-lg">
                            {post.category}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      {/* Date and Read Time */}
                      <div className="flex items-center gap-4 mb-3 text-gray-500">
                        <div className="flex items-center gap-1">
                          <FiCalendar className="w-4 h-4" />
                          <span className="text-sm">{day} {month}, {year}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <FiClock className="w-4 h-4" />
                          <span className="text-sm">{post.readTime} min</span>
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="font-marcellus text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-red-600 transition-colors duration-300">
                        {post.title}
                      </h3>

                      {/* Author and Read More */}
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-700">By WebMavien</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-600 group-hover:text-red-600 transition-colors duration-300">
                          <span className="text-sm font-medium">Read More</span>
                          <FiArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}