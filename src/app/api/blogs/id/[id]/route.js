// src/services/blogService.js

const API_BASE = '/api/blogs';

export const blogService = {
  // Get all published blogs
  getAllBlogs: async () => {
    try {
      console.log('📡 Fetching all published blogs...');
      const res = await fetch(API_BASE);
      
      if (!res.ok) {
        console.error('Blogs API responded with status:', res.status);
        return [];
      }
      
      const data = await res.json();
      console.log(`✅ Fetched ${data.length} blogs:`, data);
      
      // Ensure we always return an array
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error fetching blogs:', error);
      return [];
    }
  },

  // Get all blogs (including drafts) for admin
  getAllBlogsAdmin: async () => {
    try {
      console.log('📡 Fetching all blogs (admin)...');
      const res = await fetch(`${API_BASE}?admin=true`);
      
      if (!res.ok) {
        console.error('Admin blogs API responded with status:', res.status);
        return [];
      }
      
      const data = await res.json();
      console.log(`✅ Fetched ${data.length} blogs (admin):`, data);
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error fetching blogs:', error);
      return [];
    }
  },

  // Get blog by slug
  getBlogBySlug: async (slug) => {
    try {
      console.log('📡 Fetching blog with slug:', slug);
      const res = await fetch(`${API_BASE}/${slug}`);
      
      if (res.status === 404) {
        console.log('Blog not found with slug:', slug);
        return null;
      }
      
      if (!res.ok) {
        console.error('Blog API responded with status:', res.status);
        return null;
      }
      
      const data = await res.json();
      console.log('✅ Blog fetched:', data.title);
      return data;
    } catch (error) {
      console.error('Error fetching blog:', error);
      return null;
    }
  },

  // Get blog by ID
  getBlogById: async (id) => {
    try {
      console.log('📡 Fetching blog with ID:', id);
      const res = await fetch(`${API_BASE}/id/${id}`);
      
      if (res.status === 404) {
        console.log('Blog not found with ID:', id);
        return null;
      }
      
      if (!res.ok) {
        console.error('Blog API responded with status:', res.status);
        return null;
      }
      
      const data = await res.json();
      console.log('✅ Blog fetched:', data.title);
      return data;
    } catch (error) {
      console.error('Error fetching blog:', error);
      return null;
    }
  },

  // Create blog
  createBlog: async (blogData) => {
    try {
      console.log('📝 Creating new blog:', blogData.title);
      
      const res = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(blogData)
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        console.error('Create blog failed:', data);
        return { success: false, error: data.error || 'Failed to create blog' };
      }
      
      console.log('✅ Blog created successfully:', data);
      return { success: true, data: data.data || data };
    } catch (error) {
      console.error('Error creating blog:', error);
      return { success: false, error: error.message };
    }
  },

  // Update blog by ID
  updateBlog: async (id, blogData) => {
    try {
      console.log('📝 Updating blog with ID:', id);
      
      const res = await fetch(`${API_BASE}/id/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(blogData)
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        console.error('Update failed:', data);
        return { success: false, error: data.error || 'Failed to update blog' };
      }
      
      console.log('✅ Blog updated successfully');
      return { success: true, data: { ...blogData, id } };
    } catch (error) {
      console.error('Error updating blog:', error);
      return { success: false, error: error.message };
    }
  },

  // Delete blog by ID
  deleteBlog: async (id) => {
    try {
      console.log('🗑️ Deleting blog with ID:', id);
      
      const res = await fetch(`${API_BASE}/id/${id}`, {
        method: 'DELETE'
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        console.error('Delete failed:', data);
        return { success: false, error: data.error || 'Failed to delete blog' };
      }
      
      console.log('✅ Blog deleted successfully');
      return { success: true };
    } catch (error) {
      console.error('Error deleting blog:', error);
      return { success: false, error: error.message };
    }
  },

  // Get all categories
  getAllCategories: async () => {
    try {
      console.log('📡 Fetching categories...');
      const res = await fetch('/api/categories');
      
      if (!res.ok) {
        console.error('Categories API responded with status:', res.status);
        return [];
      }
      
      const data = await res.json();
      console.log(`✅ Fetched ${data.length} categories:`, data);
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  },

  // Search blogs
  searchBlogs: async (query) => {
    try {
      if (!query || query.trim() === '') {
        return await blogService.getAllBlogs();
      }
      
      console.log('📡 Searching blogs for:', query);
      
      const res = await fetch(`${API_BASE}/search?q=${encodeURIComponent(query)}`);
      
      if (!res.ok) {
        console.error('Search API responded with status:', res.status);
        return [];
      }
      
      const data = await res.json();
      console.log(`✅ Found ${data.length} blogs matching "${query}"`);
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error searching blogs:', error);
      return [];
    }
  },

  // Get related blogs
  getRelatedBlogs: async (currentBlog, limit = 3) => {
    try {
      if (!currentBlog || !currentBlog.id) {
        console.log('No current blog provided for related search');
        return [];
      }
      
      console.log('📡 Fetching related blogs for:', currentBlog.id);
      
      const res = await fetch(`${API_BASE}/related`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          blogId: currentBlog.id,
          category: currentBlog.category,
          tags: currentBlog.tags || [],
          limit
        })
      });
      
      if (!res.ok) {
        console.error('Related blogs API responded with status:', res.status);
        return [];
      }
      
      const data = await res.json();
      console.log(`✅ Found ${data.length} related blogs`);
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error fetching related blogs:', error);
      return [];
    }
  }
};