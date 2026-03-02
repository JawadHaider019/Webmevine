// src/services/decapApi.js

// These are now only used for API calls
const GITHUB_REPO = process.env.NEXT_PUBLIC_GITHUB_REPO;
const GITHUB_BRANCH = process.env.NEXT_PUBLIC_GITHUB_BRANCH || 'main';

// Folder paths for storing content
const BLOG_FOLDER = 'content/blog';
const IMAGES_FOLDER = 'public/images';

// Helper function to parse frontmatter
function parseFrontmatter(content) {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);
  
  if (match) {
    const frontmatter = match[1];
    const markdown = match[2];
    
    // Parse YAML frontmatter (simple version)
    const data = {};
    frontmatter.split('\n').forEach(line => {
      if (line.includes(':')) {
        const [key, ...valueParts] = line.split(':');
        let value = valueParts.join(':').trim();
        
        // Handle arrays
        if (value.startsWith('[') && value.endsWith(']')) {
          value = value.slice(1, -1).split(',').map(v => v.trim().replace(/^"|"$/g, ''));
        }
        // Handle booleans
        else if (value === 'true') value = true;
        else if (value === 'false') value = false;
        // Handle strings with quotes
        else if (value.startsWith('"') && value.endsWith('"')) {
          value = value.slice(1, -1);
        }
        
        data[key.trim()] = value;
      }
    });
    
    return { data, content: markdown };
  }
  
  return { data: {}, content };
}

// Helper function to generate slug
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

// Helper function to upload image
async function uploadImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const base64 = reader.result.split(',')[1];
        const fileName = `${Date.now()}-${file.name}`;
        
        const response = await fetch('/api/github', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            path: `${IMAGES_FOLDER}/${fileName}`,
            content: base64,
            message: `Upload image: ${fileName}`
          })
        });

        if (!response.ok) throw new Error('Failed to upload image');
        
        const result = await response.json();
        resolve(`/images/${fileName}`);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export const decapApi = {
  // Get all blogs from GitHub
  getAllBlogs: async () => {
    try {
      const response = await fetch(`/api/github?path=${BLOG_FOLDER}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          return []; // Folder doesn't exist yet
        }
        throw new Error('Failed to fetch blogs');
      }
      
      const files = await response.json();
      
      // If no files or folder doesn't exist
      if (!Array.isArray(files)) return [];
      
      // Fetch each blog file content
      const blogs = await Promise.all(
        files.map(async (file) => {
          if (file.name === '.gitkeep') return null;
          if (!file.name.endsWith('.md')) return null;
          
          const contentResponse = await fetch(file.download_url);
          const content = await contentResponse.text();
          
          // Parse frontmatter and content
          const { data, content: markdown } = parseFrontmatter(content);
          
          return {
            id: file.sha,
            slug: file.name.replace('.md', ''),
            ...data,
            content: markdown
          };
        })
      );
      
      return blogs.filter(blog => blog !== null);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      return [];
    }
  },

  // Get single blog by slug
  getBlogBySlug: async (slug) => {
    try {
      const response = await fetch(`/api/github?path=${BLOG_FOLDER}/${slug}.md`);
      
      if (!response.ok) throw new Error('Blog not found');
      
      const file = await response.json();
      const content = atob(file.content);
      
      // Parse frontmatter and content
      const { data, content: markdown } = parseFrontmatter(content);
      
      return {
        id: file.sha,
        slug,
        ...data,
        content: markdown
      };
    } catch (error) {
      console.error('Error fetching blog:', error);
      return null;
    }
  },

  // Create new blog
  createBlog: async (blogData, file) => {
    try {
      // Generate slug from title
      const slug = generateSlug(blogData.title);
      
      // Format tags for frontmatter
      const tagsString = blogData.tags && blogData.tags.length > 0
        ? `[${blogData.tags.map(t => `"${t}"`).join(', ')}]`
        : '[]';
      
      // Convert blog data to markdown with frontmatter
      const frontmatter = `---
title: ${blogData.title}
date: ${new Date().toISOString()}
category: ${blogData.category || ''}
tags: ${tagsString}
featured: ${blogData.featured || false}
excerpt: "${blogData.excerpt || ''}"
author: "${blogData.author || 'Admin'}"
readTime: ${blogData.readTime || 5}
status: ${blogData.status || 'draft'}
---

${blogData.content}`;

      // Upload image if exists
      let imageUrl = null;
      if (file) {
        imageUrl = await uploadImage(file);
      }

      // Create blog file in GitHub
      const response = await fetch('/api/github', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          path: `${BLOG_FOLDER}/${slug}.md`,
          content: btoa(unescape(encodeURIComponent(frontmatter))),
          message: `Create blog: ${blogData.title}`
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create blog');
      }
      
      const result = await response.json();
      
      return {
        success: true,
        data: {
          id: result.content.sha,
          slug,
          ...blogData,
          imageUrl,
          createdAt: new Date().toISOString()
        }
      };
    } catch (error) {
      console.error('Error creating blog:', error);
      return { success: false, error: error.message };
    }
  },

  // Update blog
  updateBlog: async (id, blogData, file) => {
    try {
      // Get current file to get SHA
      const getResponse = await fetch(`/api/github?path=${BLOG_FOLDER}/${blogData.slug}.md`);
      
      if (!getResponse.ok) throw new Error('Blog not found');
      const currentFile = await getResponse.json();
      
      // Format tags for frontmatter
      const tagsString = blogData.tags && blogData.tags.length > 0
        ? `[${blogData.tags.map(t => `"${t}"`).join(', ')}]`
        : '[]';
      
      // Update frontmatter
      const frontmatter = `---
title: ${blogData.title}
date: ${blogData.createdAt || new Date().toISOString()}
category: ${blogData.category || ''}
tags: ${tagsString}
featured: ${blogData.featured || false}
excerpt: "${blogData.excerpt || ''}"
author: "${blogData.author || 'Admin'}"
readTime: ${blogData.readTime || 5}
status: ${blogData.status || 'draft'}
---

${blogData.content}`;

      // Upload new image if exists
      let imageUrl = blogData.imageUrl;
      if (file) {
        imageUrl = await uploadImage(file);
      }

      // Update file
      const response = await fetch('/api/github', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          path: `${BLOG_FOLDER}/${blogData.slug}.md`,
          content: btoa(unescape(encodeURIComponent(frontmatter))),
          message: `Update blog: ${blogData.title}`,
          sha: currentFile.sha
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update blog');
      }
      
      return { 
        success: true, 
        data: { ...blogData, imageUrl }
      };
    } catch (error) {
      console.error('Error updating blog:', error);
      return { success: false, error: error.message };
    }
  },

  // Delete blog
  deleteBlog: async (slug) => {
    try {
      // Get current file to get SHA
      const getResponse = await fetch(`/api/github?path=${BLOG_FOLDER}/${slug}.md`);
      
      if (!getResponse.ok) throw new Error('Blog not found');
      const currentFile = await getResponse.json();
      
      // Delete file
      const response = await fetch('/api/github', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          path: `${BLOG_FOLDER}/${slug}.md`,
          message: `Delete blog: ${slug}`,
          sha: currentFile.sha
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete blog');
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error deleting blog:', error);
      return { success: false, error: error.message };
    }
  },

  // Toggle featured status
  toggleFeatured: async (id) => {
    return { success: true };
  },

  // Toggle publish status
  togglePublishStatus: async (id) => {
    return { success: true };
  }
};