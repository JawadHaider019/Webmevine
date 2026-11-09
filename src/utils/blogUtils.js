// src/utils/blogUtils.js
import { blogService } from '@/services/blogService';

// Create a new blog post
export async function createBlogPost(blogData, imageFile = null) {
  try {
    let imageUrl = blogData.imageUrl || blogData.image_url || '';

    if (imageFile) {
      imageUrl = await blogService.uploadImage(imageFile);
    }

    const published =
      blogData.status !== undefined
        ? blogData.status === 'published'
        : blogData.published !== undefined
        ? Boolean(blogData.published)
        : true;

    const status = published ? 'published' : 'draft';

    const payload = {
      ...blogData,
      imageUrl,
      published,
      status,
    };

    const result = await blogService.createBlog(payload);
    return {
      ...result,
      id: result._id || result.id,
      status: result.status || (result.published ? 'published' : 'draft'),
    };
  } catch (error) {
    console.error('Error creating blog post:', error);
    throw error;
  }
}

// Get all blog posts
export async function getAllBlogPosts(params = {}) {
  try {
    const blogs = await blogService.getBlogs(params);
    const list = Array.isArray(blogs) ? blogs : blogs.blogs || [];
    return list.map((blog) => ({
      ...blog,
      id: blog._id || blog.id,
      status: blog.status || (blog.published ? 'published' : 'draft'),
    }));
  } catch (error) {
    console.error('Error getting blog posts:', error);
    throw error;
  }
}

// Get a single blog post by slug
export async function getBlogPostBySlug(slug) {
  try {
    const blog = await blogService.getBlogBySlug(slug);
    if (!blog) return null;
    return {
      ...blog,
      id: blog._id || blog.id,
      status: blog.status || (blog.published ? 'published' : 'draft'),
    };
  } catch (error) {
    console.error('Error getting blog post by slug:', error);
    throw error;
  }
}

// Update a blog post
export async function updateBlogPost(postId, blogData, imageFile = null) {
  try {
    let imageUrl = blogData.imageUrl || blogData.image_url || '';

    if (imageFile) {
      imageUrl = await blogService.uploadImage(imageFile);
    }

    const published =
      blogData.status !== undefined
        ? blogData.status === 'published'
        : blogData.published !== undefined
        ? Boolean(blogData.published)
        : true;

    const status = published ? 'published' : 'draft';

    const payload = {
      ...blogData,
      imageUrl,
      published,
      status,
    };

    const result = await blogService.updateBlog(postId, payload);
    return {
      ...result,
      id: result._id || result.id,
      status: result.status || (result.published ? 'published' : 'draft'),
    };
  } catch (error) {
    console.error('Error updating blog post:', error);
    throw error;
  }
}

// Delete a blog post
export async function deleteBlogPost(postId) {
  try {
    await blogService.deleteBlog(postId);
    return { id: postId };
  } catch (error) {
    console.error('Error deleting blog post:', error);
    throw error;
  }
}
