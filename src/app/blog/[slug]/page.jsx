// src/app/blog/[slug]/page.jsx
"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { 
  FiCalendar, FiClock, FiUser, FiTag, FiArrowLeft,
  FiTwitter, FiFacebook, FiLinkedin, FiLink, FiCheck, FiRefreshCw
} from 'react-icons/fi';
import { LuSparkles } from 'react-icons/lu';
import { getBlogBySlug, getRelatedBlogs, formatDate } from '@/utils/blogUtils';

// Markdown Renderer
const MarkdownRenderer = ({ content }) => {
  if (!content) return null;

  const renderFormattedContent = (text) => {
    const lines = text.split('\n');
    
    return lines.map((line, lineIndex) => {
      // Headers
      if (line.startsWith('# ')) {
        return <h1 key={lineIndex} className="text-3xl font-bold text-gray-900 mt-8 mb-4">{line.substring(2)}</h1>;
      }
      if (line.startsWith('## ')) {
        return <h2 key={lineIndex} className="text-2xl font-bold text-gray-800 mt-6 mb-3">{line.substring(3)}</h2>;
      }
      if (line.startsWith('### ')) {
        return <h3 key={lineIndex} className="text-xl font-semibold text-gray-800 mt-5 mb-2">{line.substring(4)}</h3>;
      }
      
      // Images
      if (line.startsWith('![') && line.includes('](')) {
        const altMatch = line.match(/!\[(.*?)\]/);
        const urlMatch = line.match(/\((.*?)\)/);
        if (urlMatch) {
          return (
            <div key={lineIndex} className="my-8">
              <img 
                src={urlMatch[1]} 
                alt={altMatch ? altMatch[1] : ''} 
                className="w-full rounded-xl shadow-lg"
              />
            </div>
          );
        }
      }
      
      // Process inline formatting
      if (line.trim()) {
        let processedContent = line;
        
        // Bold
        processedContent = processedContent.replace(
          /\*\*(.*?)\*\*/g, 
          '<strong class="font-bold text-gray-900">$1</strong>'
        );
        
        // Italic
        processedContent = processedContent.replace(
          /\*(.*?)\*/g, 
          '<em class="italic">$1</em>'
        );
        
        // Links
        processedContent = processedContent.replace(
          /\[([^\]]+)\]\(([^)]+)\)/g,
          '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-red-600 hover:text-red-700 underline">$1</a>'
        );
        
        // Lists
        if (line.startsWith('- ')) {
          return (
            <li key={lineIndex} className="ml-6 list-disc text-gray-700 mb-2">
              <span dangerouslySetInnerHTML={{ __html: processedContent.substring(2) }} />
            </li>
          );
        }
        
        if (/^\d+\.\s/.test(line)) {
          return (
            <li key={lineIndex} className="ml-6 list-decimal text-gray-700 mb-2">
              <span dangerouslySetInnerHTML={{ __html: processedContent.replace(/^\d+\.\s/, '') }} />
            </li>
          );
        }
        
        return (
          <p key={lineIndex} className="mb-4 text-gray-700 leading-relaxed">
            <span dangerouslySetInnerHTML={{ __html: processedContent }} />
          </p>
        );
      }
      
      return <br key={lineIndex} />;
    });
  };

  return (
    <div className="prose max-w-none">
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
      const post = await getBlogBySlug(params.slug);
      
      if (post) {
        setBlog(post);
        const related = await getRelatedBlogs(post);
        setRelatedPosts(related);
      } else {
        setError('Blog post not found');
      }
    } catch (error) {
      console.error('Error loading blog:', error);
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
    return headings.slice(0, 5); // Limit to 5 headings
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
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-4">
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
        <div className="max-w-4xl mx-auto px-4 py-4">
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
            />
          )}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
        
        <div className="relative max-w-4xl mx-auto px-4">
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
                {blog.author || 'Admin'}
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-4xl mx-auto px-4 py-12">
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
                          className={`text-gray-600 hover:text-red-600 block ${
                            heading.level === 2 ? 'ml-3' : heading.level === 3 ? 'ml-6' : ''
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
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              Related Articles
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map(post => (
                <Link key={post.id} href={`/blog/${post.slug || post.id}`}>
                  <motion.div
                    whileHover={{ y: -4 }}
                    className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all cursor-pointer"
                  >
                    {post.imageUrl && (
                      <img
                        src={post.imageUrl}
                        alt={post.title}
                        className="w-full h-40 object-cover"
                      />
                    )}
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {post.excerpt || post.content?.substring(0, 100)}...
                      </p>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}