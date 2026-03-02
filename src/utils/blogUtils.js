// src/utils/blogUtils.js
// Helper functions for working with blogs
import { decapApi } from '@/services/decapApi';
import { blogPosts } from '@/data/blogData';

// Cache for blogs to avoid excessive API calls
let blogsCache = null;
let cacheTimestamp = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const getPublishedBlogs = async () => {
  // Try to get from Decap API first
  try {
    // Check cache first
    if (blogsCache && cacheTimestamp && (Date.now() - cacheTimestamp < CACHE_DURATION)) {
      const cachedPublished = blogsCache.filter(blog => blog.status === 'published')
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      if (cachedPublished.length > 0) {
        return cachedPublished;
      }
    }
    
    // Fetch from Decap API
    const apiBlogs = await decapApi.getAllBlogs();
    
    if (apiBlogs && apiBlogs.length > 0) {
      // Update cache
      blogsCache = apiBlogs;
      cacheTimestamp = Date.now();
      
      return apiBlogs.filter(blog => blog.status === 'published')
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
  } catch (error) {
    console.error('Error loading from Decap API:', error);
  }
  
  // Fallback to localStorage
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('blogs');
      if (saved) {
        const allBlogs = JSON.parse(saved);
        const publishedFromStorage = allBlogs.filter(blog => blog.status === 'published')
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        if (publishedFromStorage.length > 0) {
          return publishedFromStorage;
        }
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error);
    }
  }
  
  // Final fallback to mock data
  return blogPosts.filter(blog => blog.status === 'published')
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

export const getBlogBySlug = async (slug) => {
  // Try Decap API first
  try {
    // Check cache first
    if (blogsCache) {
      const cached = blogsCache.find(blog => blog.slug === slug || blog.id === slug);
      if (cached) return cached;
    }
    
    // Fetch from API
    const blog = await decapApi.getBlogBySlug(slug);
    if (blog) return blog;
  } catch (error) {
    console.error('Error loading from Decap API:', error);
  }
  
  // Fallback to localStorage
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('blogs');
      if (saved) {
        const allBlogs = JSON.parse(saved);
        const blog = allBlogs.find(blog => 
          blog.slug === slug || blog.id === slug
        );
        if (blog) return blog;
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error);
    }
  }
  
  // Final fallback to mock data
  return blogPosts.find(blog => blog.slug === slug || blog.id === slug);
};

export const getAllCategories = async () => {
  const blogs = await getPublishedBlogs();
  const categories = [...new Set(blogs.map(blog => blog.category).filter(Boolean))];
  return categories.sort();
};

export const getBlogsByCategory = async (category) => {
  const blogs = await getPublishedBlogs();
  if (category === 'all') return blogs;
  return blogs.filter(blog => blog.category === category);
};

export const searchBlogs = async (query) => {
  const blogs = await getPublishedBlogs();
  if (!query) return blogs;
  
  const searchTerm = query.toLowerCase();
  return blogs.filter(blog => 
    blog.title?.toLowerCase().includes(searchTerm) ||
    blog.content?.toLowerCase().includes(searchTerm) ||
    blog.excerpt?.toLowerCase().includes(searchTerm) ||
    blog.tags?.some(tag => tag?.toLowerCase().includes(searchTerm))
  );
};

export const getRelatedBlogs = async (currentBlog, limit = 3) => {
  const blogs = await getPublishedBlogs();
  
  const related = blogs.filter(blog => 
    blog.id !== currentBlog.id && (
      blog.category === currentBlog.category ||
      blog.tags?.some(tag => currentBlog.tags?.includes(tag))
    )
  );
  
  return related.slice(0, limit);
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

// Optional: Function to clear cache (useful after publishing/updating)
export const clearBlogCache = () => {
  blogsCache = null;
  cacheTimestamp = null;
};