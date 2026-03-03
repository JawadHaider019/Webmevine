// src/app/api/blogs/search/route.js
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

const DB_NAME = 'blog';
const COLLECTION = 'posts';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    
    if (!query) {
      return NextResponse.json([]);
    }
    
    console.log('🔍 Searching blogs for:', query);
    
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    
    const blogs = await db
      .collection(COLLECTION)
      .find({
        status: 'published',
        $or: [
          { title: { $regex: query, $options: 'i' } },
          { content: { $regex: query, $options: 'i' } },
          { excerpt: { $regex: query, $options: 'i' } },
          { tags: { $in: [new RegExp(query, 'i')] } }
        ]
      })
      .sort({ createdAt: -1 })
      .toArray();
    
    console.log(`✅ Found ${blogs.length} blogs matching "${query}"`);
    
    const formattedBlogs = blogs.map(blog => ({
      ...blog,
      id: blog._id.toString(),
      _id: undefined
    }));
    
    return NextResponse.json(formattedBlogs);
  } catch (error) {
    console.error('Error searching blogs:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}