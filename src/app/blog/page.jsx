// src/app/blog/page.jsx
"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import HeroSection from '@/components/HeroSection'
import { 
  FiSearch, FiCalendar, FiClock, FiTag, FiArrowRight,
  FiGrid, FiList, FiChevronLeft, FiChevronRight, FiRefreshCw
} from 'react-icons/fi';
import { LuSparkles } from 'react-icons/lu';
import { getPublishedBlogs, getAllCategories, searchBlogs, formatDate, clearBlogCache } from '@/utils/blogUtils';

export default function BlogPage() {
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const postsPerPage = 9;

  // Function to strip markdown for excerpts
  const stripMarkdown = (text) => {
    if (!text) return '';
    
    return text
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

  // Load blogs on mount
  useEffect(() => {
    loadBlogs();
  }, []);

  const loadBlogs = async (refresh = false) => {
    if (refresh) {
      setIsRefreshing(true);
      clearBlogCache(); // Clear cache to force fresh data
    } else {
      setIsLoading(true);
    }
    
    try {
      const publishedBlogs = await getPublishedBlogs();
      setBlogs(publishedBlogs);
      setFilteredBlogs(publishedBlogs);
      
      const cats = await getAllCategories();
      setCategories(cats);
    } catch (error) {
      console.error('Error loading blogs:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // Handle search and filter
  useEffect(() => {
    const filterBlogsAsync = async () => {
      let results = blogs;
      
      // Apply category filter
      if (selectedCategory !== 'all') {
        results = results.filter(blog => blog.category === selectedCategory);
      }
      
      // Apply search
      if (searchQuery) {
        results = await searchBlogs(searchQuery);
        if (selectedCategory !== 'all') {
          results = results.filter(blog => blog.category === selectedCategory);
        }
      }
      
      setFilteredBlogs(results);
      setCurrentPage(1);
    };

    filterBlogsAsync();
  }, [selectedCategory, searchQuery, blogs]);

  // Pagination
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredBlogs.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredBlogs.length / postsPerPage);

  // Featured post (first published blog)
  const featuredPost = blogs[0];

  return (
    <div className="min-h-screen bg-white">
   
    
      {/* Hero Section */}
      <HeroSection
        heading="Insights &"
        headingAccent="Stories"
        subheading="Discover the latest trends, tips, and stories from our team"
        ctaText="Start Your Journey"
        ctaLink="/contact"
        gradientFrom="from-black"
        gradientVia="via-red-700"
        gradientTo="to-black"
      />
      
      {/* Search and Filter Bar */}
      <section className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-gray-200 z-10 py-4">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative w-full sm:w-96">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search articles..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Categories */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 w-full sm:w-auto">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                All Posts
              </button>
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    selectedCategory === category
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* View Toggle & Refresh */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => loadBlogs(true)}
                disabled={isRefreshing}
                className="p-2 text-gray-500 hover:text-red-600 rounded-lg hover:bg-gray-100 transition-colors"
                title="Refresh from MongoDB"
              >
                <FiRefreshCw size={18} className={isRefreshing ? 'animate-spin' : ''} />
              </button>
              
              <div className="hidden sm:flex items-center gap-1 p-1 bg-gray-100 rounded-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'grid' ? 'bg-white text-red-600 shadow-sm' : 'text-gray-500'
                  }`}
                >
                  <FiGrid size={18} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'list' ? 'bg-white text-red-600 shadow-sm' : 'text-gray-500'
                  }`}
                >
                  <FiList size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Post */}
      {featuredPost && selectedCategory === 'all' && !searchQuery && !isLoading && (
        <section className="max-w-7xl mx-auto px-4 py-12">
          <Link href={`/blog/${featuredPost.slug || featuredPost.id}`}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="group relative bg-gradient-to-br from-gray-900 to-black rounded-2xl overflow-hidden cursor-pointer"
            >
              <div className="absolute inset-0 opacity-50">
                {featuredPost.imageUrl && (
                  <img
                    src={featuredPost.imageUrl}
                    alt={featuredPost.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                )}
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
              
              <div className="relative p-8 md:p-12">
                <div className="max-w-3xl">
                  <div className="flex items-center gap-3 text-sm text-red-400 mb-4">
                    <span className="bg-red-600/20 text-red-400 px-3 py-1 rounded-full">
                      Featured Post
                    </span>
                    <span className="flex items-center gap-1">
                      <FiCalendar size={14} />
                      {formatDate(featuredPost.createdAt)}
                    </span>
                    <span className="flex items-center gap-1">
                      <FiClock size={14} />
                      {featuredPost.readTime} min read
                    </span>
                  </div>
                  
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 group-hover:text-red-400 transition-colors">
                    {featuredPost.title}
                  </h2>
                  
                  <p className="text-gray-300 text-lg mb-6 line-clamp-2">
                    {featuredPost.excerpt || stripMarkdown(featuredPost.content?.substring(0, 200))}...
                  </p>
                  
                  <div className="flex items-center gap-4">
                    <span className="text-white font-medium">Read Article</span>
                    <FiArrowRight className="text-red-400 group-hover:translate-x-2 transition-transform" size={20} />
                  </div>
                </div>
              </div>
            </motion.div>
          </Link>
        </section>
      )}

      {/* Blog Grid/List */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        {/* Results count */}
        {!isLoading && !isRefreshing && (
          <div className="flex items-center justify-between mb-6">
            <p className="text-gray-600">
              Showing <span className="font-semibold text-gray-900">{currentPosts.length}</span> of{' '}
              <span className="font-semibold text-gray-900">{filteredBlogs.length}</span> articles
            </p>
          </div>
        )}

        {/* Loading State */}
        {(isLoading || isRefreshing) && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-48 bg-gray-200 rounded-t-xl" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                  <div className="h-4 bg-gray-200 rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Results */}
        {!isLoading && !isRefreshing && filteredBlogs.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
              <FiSearch className="text-gray-400" size={32} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No articles found</h3>
            <p className="text-gray-600">Try adjusting your search or filter</p>
          </motion.div>
        )}

        {/* Grid View */}
        {!isLoading && !isRefreshing && viewMode === 'grid' && filteredBlogs.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="wait">
              {currentPosts.map((blog, index) => (
                <motion.div
                  key={blog.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link href={`/blog/${blog.slug || blog.id}`}>
                    <div className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                      {/* Image */}
                      <div className="relative h-48 overflow-hidden bg-gray-100">
                        {blog.imageUrl ? (
                          <img
                            src={blog.imageUrl}
                            alt={blog.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-gray-400">No image</span>
                          </div>
                        )}
                        
                        {/* Category Tag */}
                        {blog.category && (
                          <div className="absolute top-3 left-3">
                            <span className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                              {blog.category}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-5">
                        <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                          <span className="flex items-center gap-1">
                            <FiCalendar size={12} />
                            {formatDate(blog.createdAt)}
                          </span>
                          <span className="flex items-center gap-1">
                            <FiClock size={12} />
                            {blog.readTime} min
                          </span>
                        </div>

                        <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-red-600 transition-colors line-clamp-2">
                          {blog.title}
                        </h3>

                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {blog.excerpt || stripMarkdown(blog.content?.substring(0, 120))}...
                        </p>

                        {/* Tags */}
                        {blog.tags && blog.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {blog.tags.slice(0, 3).map(tag => (
                              <span
                                key={tag}
                                className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="flex items-center text-red-600 text-sm font-medium group-hover:gap-2 transition-all">
                          Read More
                          <FiArrowRight className="ml-1 group-hover:ml-2 transition-all" size={14} />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* List View */}
        {!isLoading && !isRefreshing && viewMode === 'list' && filteredBlogs.length > 0 && (
          <div className="space-y-4">
            <AnimatePresence mode="wait">
              {currentPosts.map((blog, index) => (
                <motion.div
                  key={blog.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link href={`/blog/${blog.slug || blog.id}`}>
                    <div className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1">
                      <div className="flex flex-col md:flex-row">
                        {/* Image */}
                        <div className="md:w-64 h-48 bg-gray-100">
                          {blog.imageUrl ? (
                            <img
                              src={blog.imageUrl}
                              alt={blog.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <span className="text-gray-400">No image</span>
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 p-6">
                          <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
                            {blog.category && (
                              <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
                                {blog.category}
                              </span>
                            )}
                            <span className="flex items-center gap-1">
                              <FiCalendar size={12} />
                              {formatDate(blog.createdAt)}
                            </span>
                            <span className="flex items-center gap-1">
                              <FiClock size={12} />
                              {blog.readTime} min
                            </span>
                          </div>

                          <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-red-600 transition-colors">
                            {blog.title}
                          </h3>

                          <p className="text-gray-600 mb-4 line-clamp-2">
                            {blog.excerpt || stripMarkdown(blog.content?.substring(0, 150))}...
                          </p>

                          {/* Tags */}
                          {blog.tags && blog.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-4">
                              {blog.tags.slice(0, 3).map(tag => (
                                <span
                                  key={tag}
                                  className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                                >
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          )}

                          <div className="flex items-center text-red-600 text-sm font-medium">
                            Read Article
                            <FiArrowRight className="ml-1 group-hover:ml-2 transition-all" size={14} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Pagination */}
        {!isLoading && !isRefreshing && totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-12">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <FiChevronLeft size={20} />
            </button>
            
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                  currentPage === i + 1
                    ? 'bg-red-600 text-white'
                    : 'border border-gray-200 hover:bg-gray-50'
                }`}
              >
                {i + 1}
              </button>
            ))}
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <FiChevronRight size={20} />
            </button>
          </div>
        )}
      </section>
    </div>
  );
}