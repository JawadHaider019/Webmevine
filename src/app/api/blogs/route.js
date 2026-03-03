// src/app/api/blogs/route.js
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

const DB_NAME = 'blog';
const COLLECTION = 'posts';

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
    
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    
    const query = admin ? {} : { status: 'published' };
    
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
    
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    
    // Generate slug
    let slug = generateSlug(body.title);
    
    // Check if slug exists
    const existing = await db.collection(COLLECTION).findOne({ slug });
    if (existing) {
      slug = `${slug}-${Date.now()}`;
    }
    
    const newBlog = {
      ...body,
      slug,
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