// src/app/api/blogs/related/route.js
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

const DB_NAME = 'webmavien';
const COLLECTION = 'blogs';

export async function POST(request) {
  try {
    const { blogId, category, tags, limit = 3 } = await request.json();
    
    console.log('🔍 Finding related blogs for:', { blogId, category, tags });
    
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    
    // Build the query
    const query = {
      published: true  // Changed from 'status' to 'published'
    };
    
    // Exclude current blog if blogId is provided
    if (blogId && ObjectId.isValid(blogId)) {
      query._id = { $ne: new ObjectId(blogId) };
    }
    
    // Add category or tags conditions
    if (category || (tags && tags.length > 0)) {
      query.$or = [];
      
      if (category) {
        query.$or.push({ category: category });
      }
      
      if (tags && tags.length > 0) {
        query.$or.push({ tags: { $in: tags } });
      }
    }
    
    console.log('📝 Related blogs query:', JSON.stringify(query));
    
    const blogs = await db
      .collection(COLLECTION)
      .find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray();
    
    console.log(`✅ Found ${blogs.length} related blogs`);
    
    const formattedBlogs = blogs.map(blog => ({
      ...blog,
      id: blog._id.toString(),
      _id: undefined
    }));
    
    return NextResponse.json(formattedBlogs);
  } catch (error) {
    console.error('Error fetching related blogs:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}