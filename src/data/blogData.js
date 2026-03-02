// src/data/blogData.js
// Mock blog data for testing the blog page

export const blogPosts = [
  {
    id: "1",
    slug: "getting-started-with-nextjs-14",
    title: "Getting Started with Next.js 14: A Complete Guide",
    content: `# Getting Started with Next.js 14

Next.js 14 is here with amazing new features! In this comprehensive guide, we'll explore everything you need to know to build modern web applications.

## What's New in Next.js 14?

Next.js 14 brings several exciting improvements:

- **Faster Turbopack**: Up to 53% faster local server startup
- **Server Actions**: Stable and ready for production
- **Partial Prerendering**: The best of static and dynamic
- **Improved Metadata**: Better SEO out of the box

## Getting Started

To create a new Next.js 14 project, run:

\`\`\`bash
npx create-next-app@latest my-app
\`\`\`

You'll be prompted to configure:
- TypeScript (recommended)
- ESLint
- Tailwind CSS
- App Router
- Import alias

## Key Features

### 1. App Router
The App Router provides a new way to structure your application with support for:
- Nested routes
- Layouts
- Loading states
- Error boundaries

### 2. Server Components
By default, components in the app directory are Server Components. This means:
- Reduced JavaScript bundle size
- Direct database access
- Improved SEO
- Better performance

### 3. Streaming
Next.js 14 supports streaming for both server and client components, allowing you to:
- Show loading states immediately
- Stream in content progressively
- Improve perceived performance

## Example: Creating a Blog Post

Here's how you might structure a blog post in Next.js:

\`\`\`jsx
// app/blog/[slug]/page.jsx
export default function BlogPost({ params }) {
  return (
    <article>
      <h1>{params.slug}</h1>
      <div>Your content here</div>
    </article>
  );
}
\`\`\`

## Conclusion

Next.js 14 is a powerful framework that makes building web applications enjoyable. Whether you're building a simple blog or a complex e-commerce site, Next.js has you covered.

Start building today and experience the future of web development!`,
    excerpt: "Learn how to build modern web applications with Next.js 14. This comprehensive guide covers server components, app router, and more.",
    category: "Development",
    tags: ["Next.js", "React", "Web Development", "JavaScript"],
    imageUrl: "https://images.unsplash.com/photo-1581276879432-15e50529f34b?w=800&auto=format&fit=crop",
    author: "Sarah Johnson",
    readTime: "8",
    featured: true,
    status: "published",
    createdAt: "2024-03-15T10:00:00Z"
  },
  {
    id: "2",
    slug: "mastering-tailwind-css-tips-tricks",
    title: "Mastering Tailwind CSS: 10 Tips and Tricks for 2024",
    content: `# Mastering Tailwind CSS

Tailwind CSS has revolutionized how we style web applications. Here are 10 tips to take your Tailwind skills to the next level.

## 1. Use the @apply Directive

Keep your markup clean by extracting repeated utility patterns:

\`\`\`css
.btn-primary {
  @apply px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors;
}
\`\`\`

## 2. Customize Your Theme

Tailwind is highly customizable. Extend your theme in \`tailwind.config.js\`:

\`\`\`js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          900: '#1e3a8a',
        }
      }
    }
  }
}
\`\`\`

## 3. Responsive Design Made Easy

Tailwind's responsive modifiers are intuitive:

\`\`\`html
<div class="text-base md:text-lg lg:text-xl">
  Responsive text that scales with screen size
</div>
\`\`\`

## 4. Dark Mode Support

Enable dark mode with a single class:

\`\`\`js
// tailwind.config.js
module.exports = {
  darkMode: 'class',
}
\`\`\`

Then use it in your components:

\`\`\`html
<div class="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
  Automatically switches based on theme
</div>
\`\`\`

## 5. Custom Plugins

Create reusable components with plugins:

\`\`\`js
const plugin = require('tailwindcss/plugin')

module.exports = {
  plugins: [
    plugin(function({ addUtilities }) {
      addUtilities({
        '.content-auto': {
          'content-visibility': 'auto',
        }
      })
    })
  ]
}
\`\`\`

## 6. Group Hover Effects

Style parent-child relationships easily:

\`\`\`html
<div class="group hover:bg-gray-100 p-4 rounded-lg">
  <h3 class="group-hover:text-blue-600">Title</h3>
  <p class="group-hover:opacity-100 opacity-75">Description</p>
</div>
\`\`\`

## 7. Arbitrary Values

Use any value when you need something custom:

\`\`\`html
<div class="top-[117px] left-[23px]">
  Positioned with arbitrary values
</div>
\`\`\`

## 8. Container Queries

With the container queries plugin:

\`\`\`html
<div class="@container">
  <div class="@lg:flex @lg:items-center">
    Responsive to container size, not viewport
  </div>
</div>
\`\`\`

## 9. Animation with Tailwind

Create custom animations:

\`\`\`js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        }
      }
    }
  }
}
\`\`\`

## 10. Optimize for Production

Always purge unused CSS in production:

\`\`\`js
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
}
\`\`\`

## Conclusion

Tailwind CSS is more than just a utility framework - it's a complete styling solution that can dramatically speed up your development workflow. Start implementing these tips today!`,
    excerpt: "Take your Tailwind CSS skills to the next level with these 10 pro tips and tricks. Learn about customization, dark mode, plugins, and more.",
    category: "Design",
    tags: ["Tailwind CSS", "CSS", "Design", "Frontend"],
    imageUrl: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=800&auto=format&fit=crop",
    author: "Alex Chen",
    readTime: "6",
    featured: false,
    status: "published",
    createdAt: "2024-03-12T14:30:00Z"
  },
  {
    id: "3",
    slug: "responsive-design-principles",
    title: "Responsive Design Principles Every Developer Should Know",
    content: `# Responsive Design Principles

Creating websites that work beautifully on every device is essential. Here are the core principles of responsive design.

## 1. Mobile First Approach

Start designing for mobile screens first, then progressively enhance for larger screens. This ensures your site works on all devices.

\`\`\`css
/* Base styles for mobile */
.container {
  width: 100%;
  padding: 1rem;
}

/* Enhance for tablets */
@media (min-width: 768px) {
  .container {
    width: 750px;
    margin: 0 auto;
  }
}

/* Enhance for desktop */
@media (min-width: 1024px) {
  .container {
    width: 960px;
  }
}
\`\`\`

## 2. Flexible Grids

Use relative units like percentages, fr, or flex instead of fixed pixels:

\`\`\`css
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}
\`\`\`

## 3. Responsive Images

Serve different image sizes based on screen size:

\`\`\`html
<img 
  srcset="small.jpg 300w, medium.jpg 600w, large.jpg 900w"
  sizes="(max-width: 320px) 280px,
         (max-width: 640px) 580px,
         880px"
  src="fallback.jpg"
  alt="Responsive image"
>
\`\`\`

## 4. Flexible Typography

Use relative units for fonts:

\`\`\`css
body {
  font-size: 16px; /* Base size */
}

h1 {
  font-size: 2rem; /* 32px */
}

@media (min-width: 768px) {
  body {
    font-size: 18px; /* Larger base on tablets */
  }
}
\`\`\`

## 5. Viewport Meta Tag

Always include the viewport meta tag:

\`\`\`html
<meta name="viewport" content="width=device-width, initial-scale=1">
\`\`\`

## 6. Flexbox for Layouts

Flexbox is perfect for responsive layouts:

\`\`\`css
.card-container {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.card {
  flex: 1 1 300px; /* Grow, shrink, basis */
}
\`\`\`

## 7. CSS Grid for Complex Layouts

Grid provides powerful 2D layout control:

\`\`\`css
.layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

@media (min-width: 768px) {
  .layout {
    grid-template-columns: 250px 1fr;
  }
}
\`\`\`

## 8. Responsive Navigation

Create mobile-friendly navigation:

\`\`\`html
<nav class="navbar">
  <button class="menu-toggle">☰</button>
  <ul class="nav-menu">
    <li><a href="#">Home</a></li>
    <li><a href="#">About</a></li>
    <li><a href="#">Contact</a></li>
  </ul>
</nav>
\`\`\`

\`\`\`css
.nav-menu {
  display: none;
}

.menu-toggle {
  display: block;
}

@media (min-width: 768px) {
  .nav-menu {
    display: flex;
  }
  
  .menu-toggle {
    display: none;
  }
}
\`\`\`

## 9. Testing on Real Devices

Always test on actual devices, not just browser dev tools. Each device has unique characteristics that emulators might miss.

## 10. Performance Considerations

Responsive design isn't just about layout:
- Optimize images for different screen sizes
- Lazy load below-the-fold content
- Minimize CSS and JavaScript
- Use modern image formats (WebP)

## Conclusion

Responsive design is no longer optional - it's essential. By following these principles, you'll create websites that provide excellent user experiences across all devices.`,
    excerpt: "Learn the essential principles of responsive design including mobile-first approach, flexible grids, responsive images, and testing strategies.",
    category: "Design",
    tags: ["Responsive Design", "CSS", "Web Design", "Mobile First"],
    imageUrl: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=800&auto=format&fit=crop",
    author: "Emily Rodriguez",
    readTime: "5",
    featured: true,
    status: "published",
    createdAt: "2024-03-08T11:20:00Z"
  },
  {
    id: "4",
    slug: "javascript-performance-optimization",
    title: "JavaScript Performance Optimization Techniques",
    content: `# JavaScript Performance Optimization

Speed matters. Here's how to make your JavaScript faster and more efficient.

## 1. Debouncing and Throttling

Control how often functions execute:

\`\`\`javascript
// Debounce - waits for pause
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Throttle - limits execution rate
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}
\`\`\`

## 2. Lazy Loading Images

Load images only when needed:

\`\`\`html
<img loading="lazy" src="image.jpg" alt="Lazy loaded image">
\`\`\`

## 3. Code Splitting

Split your JavaScript into smaller chunks:

\`\`\`javascript
// Instead of importing everything
import { heavyFunction } from './heavy-module';

// Use dynamic imports
button.addEventListener('click', async () => {
  const { heavyFunction } = await import('./heavy-module');
  heavyFunction();
});
\`\`\`

## 4. Avoid Memory Leaks

Clean up event listeners and intervals:

\`\`\`javascript
// Bad
setInterval(() => {
  // This keeps running forever
  updateData();
}, 1000);

// Good
const interval = setInterval(() => {
  updateData();
}, 1000);

// Clean up when done
clearInterval(interval);
\`\`\`

## 5. Use Web Workers for Heavy Tasks

Move heavy computations to background threads:

\`\`\`javascript
// main.js
const worker = new Worker('worker.js');
worker.postMessage({ data: largeDataSet });
worker.onmessage = (event) => {
  console.log('Result:', event.data);
};

// worker.js
self.onmessage = (event) => {
  const result = performHeavyCalculation(event.data);
  self.postMessage(result);
};
\`\`\`

## 6. Optimize Loops

Loops can be optimized:

\`\`\`javascript
// Cache array length
const arr = [1, 2, 3, 4, 5];
for (let i = 0, len = arr.length; i < len; i++) {
  // Do something
}

// Use for-of for cleaner syntax
for (const item of arr) {
  // Do something
}
\`\`\`

## 7. Virtualize Long Lists

For long lists, only render visible items:

\`\`\`javascript
// Use libraries like react-window or implement your own
function VirtualList({ items, height, itemHeight }) {
  const [scrollTop, setScrollTop] = useState(0);
  
  const visibleItems = items.slice(
    Math.floor(scrollTop / itemHeight),
    Math.floor((scrollTop + height) / itemHeight) + 1
  );
  
  return (
    <div 
      style={{ height, overflowY: 'auto' }}
      onScroll={(e) => setScrollTop(e.target.scrollTop)}
    >
      <div style={{ height: items.length * itemHeight }}>
        {visibleItems.map(item => (
          <div style={{ height: itemHeight }}>
            {item.content}
          </div>
        ))}
      </div>
    </div>
  );
}
\`\`\`

## 8. Use RequestAnimationFrame

For animations, use rAF instead of setTimeout:

\`\`\`javascript
function animate() {
  // Update animation
  updatePosition();
  
  requestAnimationFrame(animate);
}

requestAnimationFrame(animate);
\`\`\`

## 9. Minimize DOM Manipulation

Batch DOM updates:

\`\`\`javascript
// Bad - causes multiple reflows
for (let i = 0; i < 100; i++) {
  container.innerHTML += '<div>Item</div>';
}

// Good - single reflow
let html = '';
for (let i = 0; i < 100; i++) {
  html += '<div>Item</div>';
}
container.innerHTML = html;
\`\`\`

## 10. Use Performance APIs

Measure and monitor performance:

\`\`\`javascript
// Measure function execution time
performance.mark('start');
heavyFunction();
performance.mark('end');
performance.measure('heavyFunction', 'start', 'end');

const measures = performance.getEntriesByName('heavyFunction');
console.log(measures[0].duration);
\`\`\`

## Conclusion

Performance optimization is an ongoing process. Start with these techniques and always measure before and after to ensure real improvements.`,
    excerpt: "Master JavaScript performance optimization with techniques like debouncing, lazy loading, code splitting, and Web Workers.",
    category: "Development",
    tags: ["JavaScript", "Performance", "Optimization", "Web Development"],
    imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop",
    author: "David Kim",
    readTime: "7",
    featured: false,
    status: "published",
    createdAt: "2024-03-05T16:45:00Z"
  },
  {
    id: "5",
    slug: "css-grid-vs-flexbox",
    title: "CSS Grid vs Flexbox: When to Use Which",
    content: `# CSS Grid vs Flexbox

Two powerful layout systems, but when should you use each? Let's break it down.

## Flexbox: One-Dimensional Layout

Flexbox is designed for one-dimensional layouts - either a row OR a column.

### When to Use Flexbox:

**Navigation Bars:**
\`\`\`css
.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
\`\`\`

**Card Layouts with Varying Content:**
\`\`\`css
.card {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.card-content {
  flex: 1; /* Takes remaining space */
}
\`\`\`

**Centering Elements:**
\`\`\`css
.center {
  display: flex;
  justify-content: center;
  align-items: center;
}
\`\`\`

**Form Elements:**
\`\`\`css
.form-group {
  display: flex;
  gap: 1rem;
}

.form-group input {
  flex: 1;
}
\`\`\`

## Grid: Two-Dimensional Layout

Grid is designed for two-dimensional layouts - rows AND columns simultaneously.

### When to Use Grid:

**Overall Page Layout:**
\`\`\`css
.page {
  display: grid;
  grid-template-areas: 
    "header header"
    "sidebar main"
    "footer footer";
  grid-template-columns: 250px 1fr;
}
\`\`\`

**Image Galleries:**
\`\`\`css
.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}
\`\`\`

**Dashboard Layouts:**
\`\`\`css
.dashboard {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: minmax(100px, auto);
  gap: 1rem;
}

.widget-wide {
  grid-column: span 2;
}

.widget-tall {
  grid-row: span 2;
}
\`\`\`

**Card Grids:**
\`\`\`css
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}
\`\`\`

## Combining Both

Often, the best approach is to use them together:

\`\`\`css
/* Grid for overall layout */
.app {
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 1rem;
}

/* Flexbox for component-level layout */
.sidebar {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.main-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.card-row {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}
\`\`\`

## Decision Tree

Use this simple decision tree:

1. **Need rows AND columns?** → Use Grid
2. **Need content to push items?** → Use Flexbox
3. **Need precise placement?** → Use Grid
4. **Need distribution in one direction?** → Use Flexbox
5. **Need overlapping elements?** → Use Grid
6. **Need equal height columns?** → Both can do it

## Practical Examples

### Example 1: Article Layout
\`\`\`css
.article {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 2rem;
}

.article-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
\`\`\`

### Example 2: Product Grid
\`\`\`css
.products {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.product-card {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.product-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: auto;
}
\`\`\`

## Browser Support

Both are well-supported in modern browsers. For older browsers:
- Flexbox: IE11+ (with prefixes)
- Grid: IE11+ (partial support)

## Conclusion

Don't think of it as Grid vs Flexbox - think of it as choosing the right tool for the job. Grid for overall page layout, Flexbox for components. Use them together for the best results!`,
    excerpt: "Understand the key differences between CSS Grid and Flexbox and learn when to use each layout system with practical examples.",
    category: "Design",
    tags: ["CSS", "Flexbox", "Grid", "Web Design"],
    imageUrl: "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=800&auto=format&fit=crop",
    author: "Chris Taylor",
    readTime: "6",
    featured: false,
    status: "published",
    createdAt: "2024-03-03T13:10:00Z"
  },
  {
    id: "6",
    slug: "web-security-basics",
    title: "Web Security Basics Every Developer Must Know",
    content: `# Web Security Basics

Security isn't optional - it's essential. Here are the fundamental security concepts every web developer should understand.

## 1. HTTPS Everywhere

Always use HTTPS in production. It encrypts data between client and server:

\`\`\`javascript
// Redirect HTTP to HTTPS
if (location.protocol !== 'https:') {
  location.href = 'https://' + location.host + location.pathname;
}
\`\`\`

## 2. XSS (Cross-Site Scripting) Prevention

Never trust user input. Always sanitize:

\`\`\`javascript
// Bad - vulnerable to XSS
element.innerHTML = userInput;

// Good - safe
element.textContent = userInput;

// For HTML content, use a sanitizer
import DOMPurify from 'dompurify';
element.innerHTML = DOMPurify.sanitize(userInput);
\`\`\`

## 3. CSRF (Cross-Site Request Forgery) Protection

Use anti-CSRF tokens for state-changing requests:

\`\`\`html
<form method="POST" action="/update-profile">
  <input type="hidden" name="csrf_token" value="random-token-here">
  <!-- other form fields -->
</form>
\`\`\`

## 4. SQL Injection Prevention

Never concatenate user input into SQL queries:

\`\`\`javascript
// Bad - vulnerable to SQL injection
const query = \`SELECT * FROM users WHERE email = '\${userEmail}'\`;

// Good - use parameterized queries
const query = 'SELECT * FROM users WHERE email = ?';
db.query(query, [userEmail]);
\`\`\`

## 5. Secure Password Storage

Never store passwords in plain text:

\`\`\`javascript
// Bad
const user = {
  email: 'user@example.com',
  password: 'user-password' // DON'T DO THIS
};

// Good - use bcrypt or similar
import bcrypt from 'bcrypt';

const saltRounds = 10;
const hashedPassword = await bcrypt.hash(password, saltRounds);
// Store hashedPassword in database
\`\`\`

## 6. Security Headers

Implement important security headers:

\`\`\`javascript
// In your server or middleware
response.setHeader('Content-Security-Policy', "default-src 'self'");
response.setHeader('X-Frame-Options', 'DENY');
response.setHeader('X-Content-Type-Options', 'nosniff');
response.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
response.setHeader('Permissions-Policy', 'geolocation=()');
\`\`\`

## 7. CORS (Cross-Origin Resource Sharing)

Configure CORS properly:

\`\`\`javascript
// In your server
app.use(cors({
  origin: 'https://yourdomain.com',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
\`\`\`

## 8. Rate Limiting

Prevent brute force attacks:

\`\`\`javascript
// Using express-rate-limit
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
\`\`\`

## 9. JWT Security

If using JWT tokens:

\`\`\`javascript
// Use strong secrets
const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
  expiresIn: '1h',
  algorithm: 'HS256'
});

// Store tokens securely (httpOnly cookies)
response.cookie('token', token, {
  httpOnly: true,
  secure: true,
  sameSite: 'strict',
  maxAge: 3600000 // 1 hour
});
\`\`\`

## 10. Dependency Security

Keep dependencies updated:

\`\`\`bash
# Check for vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix

# Update packages
npm update
\`\`\`

## 11. File Upload Security

Handle file uploads carefully:

\`\`\`javascript
// Validate file type
const allowedTypes = ['image/jpeg', 'image/png'];
if (!allowedTypes.includes(file.mimetype)) {
  throw new Error('Invalid file type');
}

// Limit file size
const maxSize = 5 * 1024 * 1024; // 5MB
if (file.size > maxSize) {
  throw new Error('File too large');
}

// Store files outside webroot
// Use random filenames
const filename = crypto.randomBytes(16).toString('hex') + '.jpg';
\`\`\`

## 12. Error Handling

Don't expose sensitive information in errors:

\`\`\`javascript
// Bad
try {
  await connectToDatabase();
} catch (error) {
  res.status(500).send(error.message); // May expose credentials
}

// Good
try {
  await connectToDatabase();
} catch (error) {
  console.error(error); // Log for debugging
  res.status(500).send('Internal server error');
}
\`\`\`

## Security Checklist

- [ ] Use HTTPS everywhere
- [ ] Sanitize all user input
- [ ] Implement CSRF protection
- [ ] Use parameterized queries
- [ ] Hash passwords properly
- [ ] Set security headers
- [ ] Configure CORS correctly
- [ ] Implement rate limiting
- [ ] Keep dependencies updated
- [ ] Secure file uploads
- [ ] Proper error handling
- [ ] Regular security audits

## Conclusion

Security is a journey, not a destination. Start with these basics and continuously improve your security practices.`,
    excerpt: "Learn the essential web security concepts every developer must know including XSS prevention, CSRF protection, SQL injection, and more.",
    category: "Security",
    tags: ["Security", "Web Development", "Best Practices", "Cyber Security"],
    imageUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop",
    author: "Lisa Wang",
    readTime: "8",
    featured: true,
    status: "published",
    createdAt: "2024-03-01T09:30:00Z"
  }
];

// Helper function to get only published blogs
export const getPublishedBlogs = () => {
  return blogPosts.filter(blog => blog.status === 'published')
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

// Helper function to get a single blog by slug
export const getBlogBySlug = (slug) => {
  return blogPosts.find(blog => blog.slug === slug || blog.id === slug);
};

// Helper function to get all categories
export const getAllCategories = () => {
  const categories = [...new Set(blogPosts.map(blog => blog.category).filter(Boolean))];
  return categories.sort();
};

// Helper function to get blogs by category
export const getBlogsByCategory = (category) => {
  if (category === 'all') return getPublishedBlogs();
  return getPublishedBlogs().filter(blog => blog.category === category);
};

// Helper function to search blogs
export const searchBlogs = (query) => {
  if (!query) return getPublishedBlogs();
  
  const searchTerm = query.toLowerCase();
  return getPublishedBlogs().filter(blog => 
    blog.title?.toLowerCase().includes(searchTerm) ||
    blog.content?.toLowerCase().includes(searchTerm) ||
    blog.excerpt?.toLowerCase().includes(searchTerm) ||
    blog.tags?.some(tag => tag?.toLowerCase().includes(searchTerm))
  );
};

// Helper function to get related blogs
export const getRelatedBlogs = (currentBlog, limit = 3) => {
  const blogs = getPublishedBlogs();
  
  const related = blogs.filter(blog => 
    blog.id !== currentBlog.id && (
      blog.category === currentBlog.category ||
      blog.tags?.some(tag => currentBlog.tags?.includes(tag))
    )
  );
  
  return related.slice(0, limit);
};

// Helper function to format date
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