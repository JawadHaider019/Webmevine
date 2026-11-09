// src/services/blogService.js
// Client-side service that calls Next.js API routes for MongoDB & Cloudinary operations

export const blogService = {
  // Get all blogs (optionally with filters or stats)
  async getBlogs(params = {}) {
    try {
      const searchParams = new URLSearchParams();
      if (params.status) searchParams.set('status', params.status);
      if (params.category) searchParams.set('category', params.category);
      if (params.search) searchParams.set('search', params.search);
      if (params.featured !== undefined) searchParams.set('featured', String(params.featured));
      if (params.limit) searchParams.set('limit', String(params.limit));
      if (params.withStats) searchParams.set('withStats', 'true');

      const queryString = searchParams.toString();
      const url = `/api/blogs${queryString ? `?${queryString}` : ''}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch blogs');
      }

      return await response.json();
    } catch (error) {
      console.error('Error in getBlogs:', error);
      throw error;
    }
  },

  // Get a single blog by slug
  async getBlogBySlug(slug) {
    try {
      const response = await fetch(`/api/blogs/${encodeURIComponent(slug)}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
      });

      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch blog');
      }

      return await response.json();
    } catch (error) {
      console.error('Error in getBlogBySlug:', error);
      throw error;
    }
  },

  // Create a new blog
  async createBlog(blogData) {
    try {
      const response = await fetch('/api/blogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(blogData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create blog');
      }

      return await response.json();
    } catch (error) {
      console.error('Error in createBlog:', error);
      throw error;
    }
  },

  // Update a blog
  async updateBlog(id, blogData) {
    try {
      const response = await fetch(`/api/blogs/id/${encodeURIComponent(id)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(blogData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update blog');
      }

      return await response.json();
    } catch (error) {
      console.error('Error in updateBlog:', error);
      throw error;
    }
  },

  // Delete a blog
  async deleteBlog(id) {
    try {
      const response = await fetch(`/api/blogs/id/${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete blog');
      }

      return await response.json();
    } catch (error) {
      console.error('Error in deleteBlog:', error);
      throw error;
    }
  },

  // Upload image to Cloudinary via API route
  async uploadImage(file) {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to upload image');
      }

      const data = await response.json();
      return data.imageUrl;
    } catch (error) {
      console.error('Error in uploadImage:', error);
      throw error;
    }
  },
};
