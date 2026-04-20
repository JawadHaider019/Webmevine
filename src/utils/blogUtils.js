// src/utils/blogUtils.js
// Helper functions for working with blogs - MongoDB only
import { blogService } from '@/services/blogService';

// Cache for blogs to avoid excessive API calls
let blogsCache = null;
let cacheTimestamp = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const getPublishedBlogs = async () => {
  try {
    console.log('📡 getPublishedBlogs called');

    // Check cache first
    if (blogsCache && cacheTimestamp && (Date.now() - cacheTimestamp < CACHE_DURATION)) {
      console.log('📦 Using cached blogs');
      // Use published boolean instead of status
      const cachedPublished = blogsCache.filter(blog => blog.published === true)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      if (cachedPublished.length > 0) {
        console.log(`✅ Found ${cachedPublished.length} published blogs in cache`);
        return cachedPublished;
      }
    }

    // Fetch from MongoDB
    console.log('🌐 Fetching from blogService.getAllBlogs()');
    const apiBlogs = await blogService.getAllBlogs();
    console.log('📥 Raw API response:', apiBlogs);

    if (!apiBlogs || apiBlogs.length === 0) {
      console.log('⚠️ No blogs found from API');
      return [];
    }

    // Update cache
    blogsCache = apiBlogs;
    cacheTimestamp = Date.now();

    // Use published boolean instead of status
    const publishedBlogs = apiBlogs.filter(blog => blog.published === true)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    console.log(`✅ Found ${publishedBlogs.length} published blogs from API`);
    return publishedBlogs;

  } catch (error) {
    console.error('Error loading blogs from MongoDB:', error);
    return []; // Return empty array instead of throwing
  }
};

export const getBlogBySlug = async (slug) => {
  try {
    console.log('📡 getBlogBySlug called for:', slug);

    // Check cache first
    if (blogsCache) {
      const cached = blogsCache.find(blog => blog.slug === slug);
      if (cached) {
        console.log('📦 Found in cache:', cached.title);
        return cached;
      }
    }

    // Fetch from MongoDB
    console.log('🌐 Fetching from blogService.getBlogBySlug');
    const blog = await blogService.getBlogBySlug(slug);

    if (!blog) {
      console.log('❌ Blog not found:', slug);
      return null;
    }

    console.log('✅ Blog found:', blog.title);
    return blog;

  } catch (error) {
    console.error('Error loading blog from MongoDB:', error);
    return null;
  }
};

export const getAllCategories = async () => {
  try {
    console.log('📡 getAllCategories called');

    // Use the service method that's optimized for this
    const categories = await blogService.getAllCategories();
    console.log('✅ Categories fetched:', categories);
    return categories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return []; // Return empty array on error
  }
};

export const getBlogsByCategory = async (category) => {
  try {
    console.log('📡 getBlogsByCategory called for:', category);
    const blogs = await getPublishedBlogs();
    if (category === 'all' || category === 'All') return blogs;

    const filtered = blogs.filter(blog => blog.category === category);
    console.log(`✅ Found ${filtered.length} blogs in category ${category}`);
    return filtered;
  } catch (error) {
    console.error('Error filtering blogs by category:', error);
    return [];
  }
};

export const searchBlogs = async (query) => {
  try {
    console.log('📡 searchBlogs called for:', query);

    if (!query || query.trim() === '') {
      return getPublishedBlogs();
    }

    // Use the service's search method for better performance
    const results = await blogService.searchBlogs(query);
    console.log(`✅ Found ${results.length} blogs matching "${query}"`);
    return results;
  } catch (error) {
    console.error('Error searching blogs:', error);
    return [];
  }
};

export const getRelatedBlogs = async (currentBlog, limit = 3) => {
  try {
    console.log('📡 getRelatedBlogs called for:', currentBlog?.id);

    if (!currentBlog || !currentBlog.id) {
      return [];
    }

    // Use the service's optimized method
    const related = await blogService.getRelatedBlogs(currentBlog, limit);
    console.log(`✅ Found ${related.length} related blogs`);
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
  console.log('🧹 Clearing blog cache');
  blogsCache = null;
  cacheTimestamp = null;
};