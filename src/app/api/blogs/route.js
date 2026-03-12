// src/app/api/blogs/route.js
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb'; // Add this import

const DB_NAME = 'webmavien';
const COLLECTION = 'blogs';

// Helper function to generate slug
const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
};

// GET all blogs (with optional admin filter)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const admin = searchParams.get('admin') === 'true';
    
    console.log('📡 Blogs API called, admin:', admin);
    console.log(`🔍 Using database: ${DB_NAME}, collection: ${COLLECTION}`);
    
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    
    // For published blogs (public view), filter by published: true
    // For admin view, show all blogs regardless of status
    const query = admin ? {} : { published: true };
    
    const blogs = await db
      .collection(COLLECTION)
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();
    
    const formattedBlogs = blogs.map(blog => ({
      ...blog,
      id: blog._id.toString(),
      _id: undefined
    }));
    
    console.log(`✅ Found ${formattedBlogs.length} blogs`);
    
    return NextResponse.json(formattedBlogs);
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST create new blog
export async function POST(request) {
  try {
    const body = await request.json();
    console.log('📝 Creating new blog:', body.title);
    console.log(`🔍 Using database: ${DB_NAME}, collection: ${COLLECTION}`);
    
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    
    // Generate slug
    let slug = generateSlug(body.title);
    
    // Check if slug exists
    const existing = await db.collection(COLLECTION).findOne({ slug });
    if (existing) {
      slug = `${slug}-${Date.now()}`;
    }
    
    // Prepare the blog post with proper fields
    const newBlog = {
      title: body.title || 'Untitled',
      content: body.content || '',
      excerpt: body.excerpt || (body.content ? body.content.substring(0, 160) + '...' : ''),
      imageUrl: body.imageUrl || null,
      cloudinaryId: body.cloudinaryId || null,
      author: body.author || 'Admin',
      authorImage: body.authorImage || null,
      category: body.category || 'Uncategorized',
      tags: body.tags || [],
      readTime: body.readTime || (body.content ? Math.ceil(body.content.split(' ').length / 200) + ' min read' : '5 min read'),
      published: body.published === true, // Ensure boolean
      featured: body.featured || false,
      slug,
      metaDescription: body.metaDescription || body.excerpt || '',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await db.collection(COLLECTION).insertOne(newBlog);
    
    console.log('✅ Blog created with ID:', result.insertedId);
    
    return NextResponse.json({
      success: true,
      data: {
        ...newBlog,
        id: result.insertedId.toString()
      }
    });
  } catch (error) {
    console.error('Error creating blog:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT update blog by ID
export async function PUT(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const body = await request.json();
    
    if (!id) {
      return NextResponse.json({ error: 'Blog ID is required' }, { status: 400 });
    }
    
    // Validate ObjectId
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid blog ID' }, { status: 400 });
    }
    
    console.log('📝 Updating blog:', id);
    
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    
    // Remove _id and id from update data if present
    const { _id, id: _, ...updateData } = body;
    
    // Add updated timestamp
    updateData.updatedAt = new Date();
    
    // If title changed, update slug
    if (body.title) {
      updateData.slug = generateSlug(body.title);
    }
    
    const result = await db
      .collection(COLLECTION)
      .updateOne(
        { _id: new ObjectId(id) },
        { $set: updateData }
      );
    
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }
    
    console.log('✅ Blog updated successfully');
    
    return NextResponse.json({ 
      success: true,
      message: 'Blog updated successfully' 
    });
  } catch (error) {
    console.error('Error updating blog:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE blog by ID
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Blog ID is required' }, { status: 400 });
    }
    
    // Validate ObjectId
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid blog ID' }, { status: 400 });
    }
    
    console.log('🗑️ Deleting blog:', id);
    
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    
    const result = await db
      .collection(COLLECTION)
      .deleteOne({ _id: new ObjectId(id) });
    
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }
    
    console.log('✅ Blog deleted successfully');
    
    return NextResponse.json({ 
      success: true,
      message: 'Blog deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting blog:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}