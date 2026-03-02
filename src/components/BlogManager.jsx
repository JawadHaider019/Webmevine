// src/components/BlogManager.jsx
"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiPlus, FiEdit, FiTrash2, FiImage, FiLink, FiX, FiEye, 
  FiSend, FiBold, FiItalic, FiList, FiHash, FiCalendar, 
  FiUser, FiTag, FiUpload, FiEyeOff, FiClock,
  FiCheckCircle, FiAlertCircle, FiStar, FiSave,
  FiSearch, FiGlobe, FiHelpCircle, FiPaperclip, FiRefreshCw
} from 'react-icons/fi';
import { LuSparkles } from 'react-icons/lu';
import { decapApi } from '@/services/decapApi';

// Custom Alert Component
const Alert = ({ type, message, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const styles = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800'
  };

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className={`fixed top-4 right-4 z-50 flex items-center p-3 sm:p-4 rounded-lg border shadow-lg max-w-xs sm:max-w-md ${styles[type]}`}
    >
      {type === 'success' && <FiCheckCircle className="mr-2 sm:mr-3 flex-shrink-0" />}
      {type === 'error' && <FiAlertCircle className="mr-2 sm:mr-3 flex-shrink-0" />}
      <div className="text-sm font-medium flex-1">{message}</div>
      <button onClick={() => setIsVisible(false)} className="ml-2 hover:opacity-70">
        <FiX size={16} />
      </button>
    </motion.div>
  );
};

// Markdown Renderer with proper formatting
const MarkdownRenderer = ({ content }) => {
  if (!content) return null;

  const renderFormattedContent = (text) => {
    if (!text) return null;
    
    const lines = text.split('\n');
    
    return lines.map((line, lineIndex) => {
      if (line.startsWith('# ')) {
        return <h1 key={lineIndex} className="text-2xl font-bold text-gray-900 mt-6 mb-4">{line.substring(2)}</h1>;
      }
      if (line.startsWith('## ')) {
        return <h2 key={lineIndex} className="text-xl font-bold text-gray-800 mt-5 mb-3">{line.substring(3)}</h2>;
      }
      if (line.startsWith('### ')) {
        return <h3 key={lineIndex} className="text-lg font-semibold text-gray-800 mt-4 mb-2">{line.substring(4)}</h3>;
      }
      
      if (line.startsWith('![') && line.includes('](')) {
        const altMatch = line.match(/!\[(.*?)\]/);
        const urlMatch = line.match(/\((.*?)\)/);
        if (urlMatch) {
          return (
            <div key={lineIndex} className="my-4">
              <img 
                src={urlMatch[1]} 
                alt={altMatch ? altMatch[1] : ''} 
                className="max-w-full rounded-lg shadow-md"
              />
            </div>
          );
        }
      }
      
      if (line.trim()) {
        let processedContent = line;
        
        processedContent = processedContent.replace(
          /\*\*\*(.*?)\*\*\*/g, 
          '<strong><em>$1</em></strong>'
        );
        
        processedContent = processedContent.replace(
          /\*\*(.*?)\*\*/g, 
          '<strong>$1</strong>'
        );
        
        processedContent = processedContent.replace(
          /\*(.*?)\*/g, 
          '<em>$1</em>'
        );
        
        processedContent = processedContent.replace(
          /\[([^\]]+)\]\(([^)]+)\)/g,
          '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline">$1</a>'
        );
        
        if (line.startsWith('- ')) {
          return (
            <li key={lineIndex} className="ml-6 list-disc text-gray-700 mb-1">
              <span dangerouslySetInnerHTML={{ __html: processedContent.substring(2) }} />
            </li>
          );
        }
        
        if (/^\d+\.\s/.test(line)) {
          return (
            <li key={lineIndex} className="ml-6 list-decimal text-gray-700 mb-1">
              <span dangerouslySetInnerHTML={{ __html: processedContent.replace(/^\d+\.\s/, '') }} />
            </li>
          );
        }
        
        return (
          <p key={lineIndex} className="mb-4 text-gray-700">
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

// SEO Helper
const SEOHelper = ({ blog }) => {
  const tips = [];
  
  if (!blog.title) tips.push({ type: 'error', msg: 'Title is missing' });
  else if (blog.title.length < 30) tips.push({ type: 'warning', msg: 'Title too short' });
  else if (blog.title.length > 60) tips.push({ type: 'warning', msg: 'Title too long' });
  else tips.push({ type: 'success', msg: 'Title length good' });

  if (!blog.content) tips.push({ type: 'error', msg: 'Content is empty' });
  else if (blog.content.length < 300) tips.push({ type: 'warning', msg: 'Content too short' });

  if (!blog.category) tips.push({ type: 'error', msg: 'Category not selected' });
  if (blog.tags.length === 0) tips.push({ type: 'warning', msg: 'Add tags for SEO' });
  if (!blog.imageUrl) tips.push({ type: 'info', msg: 'Add featured image' });

  return (
    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
      <div className="flex items-center gap-2 mb-2 text-xs font-medium text-gray-700">
        <FiGlobe className="text-blue-500" />
        SEO Checklist
        <FiHelpCircle className="text-gray-400 ml-auto" size={14} />
      </div>
      <div className="space-y-1">
        {tips.map((tip, i) => (
          <div key={i} className={`text-xs flex items-center gap-1.5 ${
            tip.type === 'error' ? 'text-red-600' :
            tip.type === 'warning' ? 'text-yellow-600' :
            tip.type === 'success' ? 'text-green-600' :
            'text-blue-600'
          }`}>
            <span>•</span>
            {tip.msg}
          </div>
        ))}
      </div>
    </div>
  );
};

// Link Modal
const LinkModal = ({ isOpen, onClose, onInsert }) => {
  const [linkText, setLinkText] = useState('');
  const [linkUrl, setLinkUrl] = useState('');

  if (!isOpen) return null;

  const handleInsert = () => {
    if (linkUrl) {
      onInsert(linkText || 'Link', linkUrl);
      setLinkText('');
      setLinkUrl('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium text-gray-900">Insert Link</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <FiX size={18} />
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-gray-700 block mb-1">Link Text</label>
            <input
              type="text"
              value={linkText}
              onChange={(e) => setLinkText(e.target.value)}
              placeholder="Click here"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-black"
              autoFocus
            />
          </div>
          
          <div>
            <label className="text-xs font-medium text-gray-700 block mb-1">URL</label>
            <input
              type="url"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-black"
            />
          </div>
          
          <div className="flex gap-2 pt-2">
            <button
              onClick={onClose}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleInsert}
              disabled={!linkUrl}
              className="flex-1 px-3 py-2 bg-black text-white rounded-lg text-sm hover:bg-gray-800 disabled:opacity-50"
            >
              Insert
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// Formatting Toolbar
const FormattingToolbar = ({ onFormat, onLinkClick, onImageClick, fileInputRef, textareaRef }) => {
  const formats = [
    { icon: FiBold, action: 'bold', title: 'Bold' },
    { icon: FiItalic, action: 'italic', title: 'Italic' },
    { icon: FiHash, action: 'heading', title: 'Heading' },
    { icon: FiList, action: 'ul', title: 'Bullet List' },
  ];

  const handleFormat = (action) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    const content = textarea.value;

    let newContent = '';
    let newCursorPos = start;

    switch (action) {
      case 'bold':
        newContent = content.substring(0, start) + `**${selectedText}**` + content.substring(end);
        newCursorPos = end + 4;
        break;
      case 'italic':
        newContent = content.substring(0, start) + `*${selectedText}*` + content.substring(end);
        newCursorPos = end + 2;
        break;
      case 'heading': {
        const lineStart = content.lastIndexOf('\n', start - 1) + 1;
        const lineEnd = content.indexOf('\n', start);
        const currentLine = content.substring(lineStart, lineEnd === -1 ? content.length : lineEnd);
        
        if (currentLine.startsWith('# ')) {
          newContent = content.substring(0, lineStart) + currentLine.substring(2) + content.substring(lineEnd === -1 ? content.length : lineEnd);
          newCursorPos = start - 2;
        } else {
          newContent = content.substring(0, lineStart) + '# ' + currentLine + content.substring(lineEnd === -1 ? content.length : lineEnd);
          newCursorPos = start + 2;
        }
        break;
      }
      case 'ul': {
        const lineStart = content.lastIndexOf('\n', start - 1) + 1;
        const lineEnd = content.indexOf('\n', start);
        const currentLine = content.substring(lineStart, lineEnd === -1 ? content.length : lineEnd);
        
        if (currentLine.startsWith('- ')) {
          newContent = content.substring(0, lineStart) + currentLine.substring(2) + content.substring(lineEnd === -1 ? content.length : lineEnd);
          newCursorPos = start - 2;
        } else {
          newContent = content.substring(0, lineStart) + '- ' + currentLine + content.substring(lineEnd === -1 ? content.length : lineEnd);
          newCursorPos = start + 2;
        }
        break;
      }
      default:
        return;
    }

    onFormat(newContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  return (
    <div className="flex items-center gap-1 p-1.5 bg-gray-50 rounded-lg border border-gray-200 mb-4">
      {formats.map(({ icon: Icon, action, title }) => (
        <button
          key={action}
          onClick={() => handleFormat(action)}
          className="p-2 hover:bg-white rounded-md text-gray-600 hover:text-black transition-colors"
          title={title}
          type="button"
        >
          <Icon size={16} />
        </button>
      ))}
      <div className="w-px h-5 bg-gray-300 mx-1" />
      <button
        onClick={onLinkClick}
        className="p-2 hover:bg-white rounded-md text-gray-600 hover:text-black"
        title="Insert Link"
        type="button"
      >
        <FiLink size={16} />
      </button>
      <button
        onClick={() => fileInputRef.current?.click()}
        className="p-2 hover:bg-white rounded-md text-gray-600 hover:text-black"
        title="Upload Image"
        type="button"
      >
        <FiPaperclip size={16} />
      </button>
      <button
        onClick={onImageClick}
        className="p-2 hover:bg-white rounded-md text-gray-600 hover:text-black"
        title="Image URL"
        type="button"
      >
        <FiImage size={16} />
      </button>
    </div>
  );
};

// Blog Card
const BlogCard = ({ blog, onEdit, onDelete, onView }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-all"
    >
      <div className="relative h-36 bg-gray-100">
        {blog.imageUrl ? (
          <img src={blog.imageUrl} alt={blog.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <FiImage className="text-gray-300 text-3xl" />
          </div>
        )}
        <div className="absolute top-2 right-2 flex gap-1">
          {blog.featured && (
            <span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full text-xs font-medium">
              <FiStar className="inline mr-1" size={10} />
              Featured
            </span>
          )}
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
            blog.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
          }`}>
            {blog.status}
          </span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">{blog.title}</h3>
        
        <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
          <span className="flex items-center gap-1">
            <FiCalendar size={12} />
            {new Date(blog.createdAt).toLocaleDateString()}
          </span>
          <span className="flex items-center gap-1">
            <FiClock size={12} />
            {blog.readTime}m
          </span>
          {blog.category && (
            <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full text-xs">
              {blog.category}
            </span>
          )}
        </div>

        <div className="flex items-center justify-end gap-1 pt-3 border-t border-gray-100">
          <button onClick={() => onView(blog)} className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50">
            <FiEye size={16} />
          </button>
          <button onClick={() => onEdit(blog)} className="p-2 text-gray-400 hover:text-gray-900 rounded-lg hover:bg-gray-100">
            <FiEdit size={16} />
          </button>
          <button onClick={() => onDelete(blog)} className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50">
            <FiTrash2 size={16} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// Main BlogManager Component
const BlogManager = () => {
  const [blogs, setBlogs] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('create');
  const [showPreview, setShowPreview] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [viewingBlog, setViewingBlog] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [newTag, setNewTag] = useState('');
  const [showLinkModal, setShowLinkModal] = useState(false);
  
  const [newBlog, setNewBlog] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: '',
    tags: [],
    imageUrl: '',
    featured: false,
    status: 'draft',
    metaDescription: ''
  });

  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);
  const currentFileRef = useRef(null);

  // Load blogs from Decap API on mount
  useEffect(() => {
    loadBlogs();
  }, []);

  const loadBlogs = async () => {
    setIsLoading(true);
    try {
      const data = await decapApi.getAllBlogs();
      setBlogs(data);
    } catch (error) {
      addAlert('error', 'Failed to load blogs from Decap CMS');
      console.error('Error loading blogs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addAlert = (type, message) => {
    const id = Date.now();
    setAlerts(prev => [...prev, { id, type, message }]);
    setTimeout(() => setAlerts(prev => prev.filter(a => a.id !== id)), 4000);
  };

  const handleFormat = (newContent) => {
    if (editingBlog) {
      setEditingBlog({ ...editingBlog, content: newContent });
    } else {
      setNewBlog({ ...newBlog, content: newContent });
    }
  };

  const handleLinkInsert = (text, url) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end) || text;
    const content = textarea.value;
    
    const linkMarkdown = `[${selectedText}](${url})`;
    const newContent = content.substring(0, start) + linkMarkdown + content.substring(end);
    
    handleFormat(newContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + linkMarkdown.length, start + linkMarkdown.length);
    }, 0);
    
    addAlert('success', 'Link inserted');
  };

  const handleImageUrlInsert = () => {
    const url = prompt('Enter image URL:');
    if (url) {
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = textarea.value.substring(start, end);
      const content = textarea.value;
      
      const imageMarkdown = `![${selectedText || 'Image'}](${url})`;
      const newContent = content.substring(0, start) + imageMarkdown + content.substring(end);
      
      handleFormat(newContent);

      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + imageMarkdown.length, start + imageMarkdown.length);
      }, 0);
      
      addAlert('success', 'Image URL inserted');
    }
  };

  const addTag = () => {
    if (!newTag.trim()) return;
    setNewBlog({ ...newBlog, tags: [...newBlog.tags, newTag.trim()] });
    setNewTag('');
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file?.type.startsWith('image/')) {
      currentFileRef.current = file;
      const reader = new FileReader();
      reader.onload = (event) => {
        setNewBlog({ ...newBlog, imageUrl: event.target.result });
        addAlert('success', 'Image selected');
      };
      reader.readAsDataURL(file);
    }
  };

  const saveBlog = async (status = 'draft') => {
    if (!newBlog.content.trim()) {
      addAlert('error', 'Please add some content');
      return;
    }

    const blogData = {
      title: newBlog.title || 'Untitled',
      content: newBlog.content,
      excerpt: newBlog.excerpt || newBlog.content.substring(0, 150) + '...',
      category: newBlog.category,
      tags: newBlog.tags,
      featured: newBlog.featured,
      status,
      author: 'Admin',
      createdAt: new Date().toISOString(),
      readTime: Math.max(1, Math.ceil(newBlog.content.split(/\s+/).length / 200)),
      metaDescription: newBlog.metaDescription || newBlog.content.substring(0, 155) + '...'
    };

    setIsLoading(true);
    try {
      const file = currentFileRef.current;
      const result = await decapApi.createBlog(blogData, file);
      
      if (result.success) {
        setBlogs(prev => [result.data, ...prev]);
        setNewBlog({ 
          title: '', content: '', excerpt: '', category: '', 
          tags: [], imageUrl: '', featured: false, status: 'draft', 
          metaDescription: '' 
        });
        currentFileRef.current = null;
        addAlert('success', status === 'published' ? 'Blog published to Decap CMS!' : 'Saved as draft in Decap CMS');
        setShowPreview(false);
      }
    } catch (error) {
      addAlert('error', 'Failed to save blog to Decap CMS');
      console.error('Error saving blog:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateBlog = async () => {
    if (!editingBlog) return;

    setIsLoading(true);
    try {
      const file = currentFileRef.current;
      const result = await decapApi.updateBlog(editingBlog.id, editingBlog, file);
      
      if (result.success) {
        setBlogs(prev => prev.map(b => b.id === editingBlog.id ? result.data : b));
        setEditingBlog(null);
        currentFileRef.current = null;
        addAlert('success', 'Blog updated in Decap CMS');
      }
    } catch (error) {
      addAlert('error', 'Failed to update blog in Decap CMS');
      console.error('Error updating blog:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteBlog = async (blog) => {
    if (!confirm('Delete this post from Decap CMS?')) return;

    setIsLoading(true);
    try {
      const result = await decapApi.deleteBlog(blog.id);
      if (result.success) {
        setBlogs(prev => prev.filter(b => b.id !== blog.id));
        addAlert('success', 'Blog deleted from Decap CMS');
      }
    } catch (error) {
      addAlert('error', 'Failed to delete blog from Decap CMS');
      console.error('Error deleting blog:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFeatured = async (id) => {
    setIsLoading(true);
    try {
      const result = await decapApi.toggleFeatured(id);
      if (result.success) {
        setBlogs(prev => prev.map(blog => blog.id === id ? result.data : blog));
        addAlert('success', 'Featured status updated');
      }
    } catch (error) {
      addAlert('error', 'Failed to update featured status');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePublishStatus = async (id) => {
    setIsLoading(true);
    try {
      const result = await decapApi.togglePublishStatus(id);
      if (result.success) {
        setBlogs(prev => prev.map(blog => blog.id === id ? result.data : blog));
        addAlert('success', 'Publish status updated');
      }
    } catch (error) {
      addAlert('error', 'Failed to update publish status');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredBlogs = blogs.filter(blog => {
    return blog.title?.toLowerCase().includes(searchTerm.toLowerCase()) &&
           (filterStatus === 'all' || blog.status === filterStatus);
  });

  return (
    <div className="min-h-screen bg-white">
      <AnimatePresence>
        {alerts.map(alert => (
          <Alert key={alert.id} {...alert} onClose={() => {}} />
        ))}
      </AnimatePresence>

      <LinkModal 
        isOpen={showLinkModal}
        onClose={() => setShowLinkModal(false)}
        onInsert={handleLinkInsert}
      />

      {/* Header */}
      <div className="border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <LuSparkles className="text-red-600 text-2xl" />
              <h1 className="font-semibold text-gray-900">Blog Manager (Decap CMS)</h1>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <button
                onClick={loadBlogs}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Refresh from Decap CMS"
              >
                <FiRefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
              </button>
              <span>{blogs.length} posts</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-6">
            <button
              onClick={() => setActiveTab('create')}
              className={`py-3 font-medium text-sm border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === 'create' 
                  ? 'border-red-600 text-red-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <FiPlus size={16} />
              Write
            </button>
            <button
              onClick={() => setActiveTab('manage')}
              className={`py-3 font-medium text-sm border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === 'manage' 
                  ? 'border-red-600 text-red-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <FiEdit size={16} />
              Posts ({blogs.length})
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {activeTab === 'create' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Editor */}
            <div className="space-y-4">
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <input
                  type="text"
                  placeholder="Post title..."
                  className="w-full px-0 py-2 text-xl font-medium border-0 focus:ring-0 placeholder-gray-300 bg-transparent"
                  value={editingBlog?.title || newBlog.title}
                  onChange={(e) => {
                    if (editingBlog) {
                      setEditingBlog({ ...editingBlog, title: e.target.value });
                    } else {
                      setNewBlog({ ...newBlog, title: e.target.value });
                    }
                  }}
                />

                <FormattingToolbar 
                  onFormat={handleFormat}
                  onLinkClick={() => setShowLinkModal(true)}
                  onImageClick={handleImageUrlInsert}
                  fileInputRef={fileInputRef}
                  textareaRef={textareaRef}
                />

                <textarea
                  ref={textareaRef}
                  placeholder="Write your post... (Select text and click buttons to format)"
                  rows="10"
                  className="w-full px-0 py-2 border-0 focus:ring-0 resize-none text-sm text-gray-700 placeholder-gray-300"
                  value={editingBlog?.content || newBlog.content}
                  onChange={(e) => {
                    if (editingBlog) {
                      setEditingBlog({ ...editingBlog, content: e.target.value });
                    } else {
                      setNewBlog({ ...newBlog, content: e.target.value });
                    }
                  }}
                />

                {/* Image Preview */}
                {(newBlog.imageUrl || editingBlog?.imageUrl) && (
                  <div className="mt-4 relative inline-block">
                    <img 
                      src={editingBlog?.imageUrl || newBlog.imageUrl} 
                      alt="Preview" 
                      className="h-20 w-auto rounded-lg border border-gray-200"
                    />
                    <button
                      onClick={() => {
                        if (editingBlog) {
                          setEditingBlog({ ...editingBlog, imageUrl: '' });
                        } else {
                          setNewBlog({ ...newBlog, imageUrl: '' });
                        }
                        currentFileRef.current = null;
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 shadow-sm"
                    >
                      <FiX size={12} />
                    </button>
                  </div>
                )}

                {/* Meta Section */}
                <div className="mt-6 space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium text-gray-500 block mb-1">Category</label>
                      <select
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-black"
                        value={editingBlog?.category || newBlog.category}
                        onChange={(e) => {
                          if (editingBlog) {
                            setEditingBlog({ ...editingBlog, category: e.target.value });
                          } else {
                            setNewBlog({ ...newBlog, category: e.target.value });
                          }
                        }}
                      >
                        <option value="">Select</option>
                        <option value="Tech">Tech</option>
                        <option value="Business">Business</option>
                        <option value="Design">Design</option>
                        <option value="Development">Development</option>
                        <option value="Security">Security</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500 block mb-1">Excerpt</label>
                      <input
                        type="text"
                        placeholder="Short description"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                        value={editingBlog?.excerpt || newBlog.excerpt}
                        onChange={(e) => {
                          if (editingBlog) {
                            setEditingBlog({ ...editingBlog, excerpt: e.target.value });
                          } else {
                            setNewBlog({ ...newBlog, excerpt: e.target.value });
                          }
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-gray-500 block mb-1">Tags</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Add tag"
                        className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addTag()}
                      />
                      <button onClick={addTag} className="px-4 py-2 bg-gray-100 rounded-lg text-sm hover:bg-gray-200">
                        Add
                      </button>
                    </div>
                    {(editingBlog?.tags || newBlog.tags).length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {(editingBlog?.tags || newBlog.tags).map(tag => (
                          <span key={tag} className="px-2 py-1 bg-gray-100 rounded-full text-xs flex items-center gap-1">
                            #{tag}
                            <button onClick={() => {
                              if (editingBlog) {
                                setEditingBlog({ ...editingBlog, tags: editingBlog.tags.filter(t => t !== tag) });
                              } else {
                                setNewBlog({ ...newBlog, tags: newBlog.tags.filter(t => t !== tag) });
                              }
                            }}>
                              <FiX size={12} />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="text-xs font-medium text-gray-500 block mb-1">Meta Description</label>
                    <textarea
                      placeholder="SEO description"
                      rows="2"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                      value={editingBlog?.metaDescription || newBlog.metaDescription}
                      onChange={(e) => {
                        if (editingBlog) {
                          setEditingBlog({ ...editingBlog, metaDescription: e.target.value });
                        } else {
                          setNewBlog({ ...newBlog, metaDescription: e.target.value });
                        }
                      }}
                    />
                  </div>
                </div>

                {/* SEO Helper */}
                <div className="mt-4">
                  <SEOHelper blog={editingBlog || newBlog} />
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-1.5 text-sm text-gray-600">
                      <input
                        type="checkbox"
                        checked={editingBlog?.featured || newBlog.featured}
                        onChange={(e) => {
                          if (editingBlog) {
                            setEditingBlog({ ...editingBlog, featured: e.target.checked });
                          } else {
                            setNewBlog({ ...newBlog, featured: e.target.checked });
                          }
                        }}
                        className="rounded border-gray-300"
                      />
                      <FiStar className="text-yellow-500" size={14} />
                      Featured
                    </label>
                    <button
                      onClick={() => setShowPreview(!showPreview)}
                      className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
                    >
                      {showPreview ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                      {showPreview ? 'Hide' : 'Show'} Preview
                    </button>
                  </div>

                  <div className="flex gap-2">
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                    
                    {editingBlog ? (
                      <button 
                        onClick={updateBlog} 
                        disabled={isLoading}
                        className="px-4 py-2 bg-black text-white rounded-lg text-sm hover:bg-gray-800 flex items-center gap-1 disabled:opacity-50"
                      >
                        {isLoading ? <FiRefreshCw className="animate-spin" size={14} /> : <FiSave size={14} />}
                        Update
                      </button>
                    ) : (
                      <>
                        <button 
                          onClick={() => saveBlog('draft')} 
                          disabled={isLoading}
                          className="px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50"
                        >
                          {isLoading ? 'Saving...' : 'Draft'}
                        </button>
                        <button 
                          onClick={() => saveBlog('published')} 
                          disabled={isLoading}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 flex items-center gap-1 disabled:opacity-50"
                        >
                          {isLoading ? <FiRefreshCw className="animate-spin" size={14} /> : <FiSend size={14} />}
                          Publish
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Preview */}
            {showPreview && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                  <LuSparkles className="text-red-600" size={16} />
                  Live Preview
                </h3>
                <div className="prose prose-sm max-w-none">
                  {(editingBlog?.imageUrl || newBlog.imageUrl) && (
                    <img 
                      src={editingBlog?.imageUrl || newBlog.imageUrl} 
                      alt="" 
                      className="w-full h-40 object-cover rounded-lg mb-4" 
                    />
                  )}
                  <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                    <span>Just now</span>
                    <span>
                      {Math.max(1, Math.ceil((editingBlog?.content || newBlog.content).split(/\s+/).length / 200))} min read
                    </span>
                    {(editingBlog?.category || newBlog.category) && (
                      <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
                        {editingBlog?.category || newBlog.category}
                      </span>
                    )}
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-4">
                    {editingBlog?.title || newBlog.title || 'Your Blog Title'}
                  </h1>
                  <MarkdownRenderer content={editingBlog?.content || newBlog.content} />
                </div>
              </motion.div>
            )}
          </div>
        )}

        {activeTab === 'manage' && (
          <div>
            {/* Search & Filter */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="flex-1 relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Search posts..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-black"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select
                className="w-full sm:w-32 px-3 py-2 border border-gray-200 rounded-lg text-sm"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="text-center py-12">
                <FiRefreshCw className="animate-spin text-gray-400 text-3xl mx-auto mb-3" />
                <p className="text-gray-500">Loading from Decap CMS...</p>
              </div>
            )}

            {/* Blog Grid */}
            {!isLoading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <AnimatePresence>
                  {filteredBlogs.map(blog => (
                    <BlogCard
                      key={blog.id}
                      blog={blog}
                      onEdit={setEditingBlog}
                      onDelete={deleteBlog}
                      onView={setViewingBlog}
                    />
                  ))}
                </AnimatePresence>
              </div>
            )}

            {!isLoading && filteredBlogs.length === 0 && (
              <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                <FiEdit className="mx-auto text-gray-300 text-4xl mb-3" />
                <p className="text-gray-500">No posts found in Decap CMS</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* View Modal */}
      <AnimatePresence>
        {viewingBlog && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setViewingBlog(null)}>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                <h3 className="font-medium text-gray-900">View Post</h3>
                <button onClick={() => setViewingBlog(null)} className="text-gray-400 hover:text-gray-600">
                  <FiX size={18} />
                </button>
              </div>
              <div className="p-6">
                {viewingBlog.imageUrl && (
                  <img src={viewingBlog.imageUrl} alt="" className="w-full h-48 object-cover rounded-lg mb-6" />
                )}
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                  <span className="flex items-center gap-1"><FiCalendar size={14} /> {new Date(viewingBlog.createdAt).toLocaleDateString()}</span>
                  <span className="flex items-center gap-1"><FiClock size={14} /> {viewingBlog.readTime} min read</span>
                  {viewingBlog.category && (
                    <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full text-xs">{viewingBlog.category}</span>
                  )}
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-4">{viewingBlog.title}</h1>
                <MarkdownRenderer content={viewingBlog.content} />
                {viewingBlog.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-gray-100">
                    {viewingBlog.tags.map(tag => (
                      <span key={tag} className="px-2 py-1 bg-gray-100 rounded-full text-xs">#{tag}</span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BlogManager;