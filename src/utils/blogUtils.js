// src/utils/blogUtils.js
// Helper functions for working with blogs - GitHub only, no fallbacks
import { decapApi } from '@/services/decapApi';

// Cache for blogs to avoid excessive API calls
let blogsCache = null;
let cacheTimestamp = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const getPublishedBlogs = async () => {
  try {
    // Check cache first
    if (blogsCache && cacheTimestamp && (Date.now() - cacheTimestamp < CACHE_DURATION)) {
      const cachedPublished = blogsCache.filter(blog => blog.status === 'published')
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      if (cachedPublished.length > 0) {
        return cachedPublished;
      }
    }
    
    // Fetch from Decap API (GitHub)
    const apiBlogs = await decapApi.getAllBlogs();
    
    if (!apiBlogs || apiBlogs.length === 0) {
      return []; // Return empty array if no blogs found
    }
    
    // Update cache
    blogsCache = apiBlogs;
    cacheTimestamp = Date.now();
    
    return apiBlogs.filter(blog => blog.status === 'published')
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
  } catch (error) {
    console.error('Error loading blogs from GitHub:', error);
    throw new Error('Failed to fetch blogs from GitHub'); // Throw error to be handled by UI
  }
};

export const getBlogBySlug = async (slug) => {
  try {
    // Check cache first
    if (blogsCache) {
      const cached = blogsCache.find(blog => blog.slug === slug || blog.id === slug);
      if (cached) return cached;
    }
    
    // Fetch from API
    const blog = await decapApi.getBlogBySlug(slug);
    
    if (!blog) {
      throw new Error(`Blog not found: ${slug}`);
    }
    
    return blog;
    
  } catch (error) {
    console.error('Error loading blog from GitHub:', error);
    throw new Error('Failed to fetch blog from GitHub');
  }
};

export const getAllCategories = async () => {
  try {
    const blogs = await getPublishedBlogs();
    const categories = [...new Set(blogs.map(blog => blog.category).filter(Boolean))];
    return categories.sort();
  } catch (error) {
    console.error('Error fetching categories:', error);
    return []; // Return empty array on error
  }
};

export const getBlogsByCategory = async (category) => {
  try {
    const blogs = await getPublishedBlogs();
    if (category === 'all') return blogs;
    return blogs.filter(blog => blog.category === category);
  } catch (error) {
    console.error('Error filtering blogs by category:', error);
    return [];
  }
};

export const searchBlogs = async (query) => {
  try {
    const blogs = await getPublishedBlogs();
    if (!query) return blogs;
    
    const searchTerm = query.toLowerCase();
    return blogs.filter(blog => 
      blog.title?.toLowerCase().includes(searchTerm) ||
      blog.content?.toLowerCase().includes(searchTerm) ||
      blog.excerpt?.toLowerCase().includes(searchTerm) ||
      blog.tags?.some(tag => tag?.toLowerCase().includes(searchTerm))
    );
  } catch (error) {
    console.error('Error searching blogs:', error);
    return [];
  }
};

export const getRelatedBlogs = async (currentBlog, limit = 3) => {
  try {
    const blogs = await getPublishedBlogs();
    
    const related = blogs.filter(blog => 
      blog.id !== currentBlog.id && (
        blog.category === currentBlog.category ||
        blog.tags?.some(tag => currentBlog.tags?.includes(tag))
      )
    );
    
    return related.slice(0, limit);
  } catch (error) {
    console.error('Error fetching related blogs:', error);
    return [];
  }
};

export const formatDate = (dateString) => {
  if (!dateString) return '';
  
  try {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};

// Function to clear cache (useful after publishing/updating)
export const clearBlogCache = () => {
  blogsCache = null;
  cacheTimestamp = null;
};