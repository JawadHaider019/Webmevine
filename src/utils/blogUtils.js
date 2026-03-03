// src/utils/blogUtils.js
// Helper functions for working with blogs - MongoDB only
import { blogService } from '@/services/blogService';

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
    
    // Fetch from MongoDB
    const apiBlogs = await blogService.getAllBlogs();
    
    if (!apiBlogs || apiBlogs.length === 0) {
      return []; // Return empty array if no blogs found
    }
    
    // Update cache
    blogsCache = apiBlogs;
    cacheTimestamp = Date.now();
    
    return apiBlogs.filter(blog => blog.status === 'published')
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
  } catch (error) {
    console.error('Error loading blogs from MongoDB:', error);
    throw new Error('Failed to fetch blogs from MongoDB');
  }
};

export const getBlogBySlug = async (slug) => {
  try {
    // Check cache first
    if (blogsCache) {
      const cached = blogsCache.find(blog => blog.slug === slug || blog.id === slug);
      if (cached) return cached;
    }
    
    // Fetch from MongoDB
    const blog = await blogService.getBlogBySlug(slug);
    
    if (!blog) {
      throw new Error(`Blog not found: ${slug}`);
    }
    
    return blog;
    
  } catch (error) {
    console.error('Error loading blog from MongoDB:', error);
    throw new Error('Failed to fetch blog from MongoDB');
  }
};

export const getAllCategories = async () => {
  try {
    // Use the service method that's optimized for this
    const categories = await blogService.getAllCategories();
    return categories;
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
    // Use the service's search method for better performance
    const results = await blogService.searchBlogs(query);
    return results;
  } catch (error) {
    console.error('Error searching blogs:', error);
    return [];
  }
};

export const getRelatedBlogs = async (currentBlog, limit = 3) => {
  try {
    // Use the service's optimized method
    const related = await blogService.getRelatedBlogs(currentBlog, limit);
    return related;
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