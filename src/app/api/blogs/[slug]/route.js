// src/app/api/blogs/[slug]/route.js
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

const DB_NAME = 'webmavien';
const COLLECTION = 'blogs';

// GET blog by slug
export async function GET(request, { params }) {
  try {
    const { slug } = await params;
    
    console.log('📡 Fetching blog by slug:', slug);
    console.log(`🔍 Using database: ${DB_NAME}, collection: ${COLLECTION}`);
    
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    
    const blog = await db
      .collection(COLLECTION)
      .findOne({ slug: slug });
    
    if (!blog) {
      console.log('❌ Blog not found with slug:', slug);
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }
    
    console.log('✅ Blog found:', blog.title);
    
    return NextResponse.json({
      ...blog,
      id: blog._id.toString(),
      _id: undefined
    });
  } catch (error) {
    console.error('Error fetching blog by slug:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT update blog by slug
export async function PUT(request, { params }) {
  try {
    const { slug } = await params;
    const body = await request.json();
    
    console.log('📝 Updating blog with slug:', slug);
    
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    
    const updateData = {
      ...body,
      updatedAt: new Date()
    };
    
    // Remove id from update data if present
    delete updateData.id;
    delete updateData._id;
    
    const result = await db
      .collection(COLLECTION)
      .updateOne(
        { slug: slug },
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

// DELETE blog by slug
export async function DELETE(request, { params }) {
  try {
    const { slug } = await params;
    
    console.log('🗑️ Deleting blog with slug:', slug);
    
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    
    const result = await db
      .collection(COLLECTION)
      .deleteOne({ slug: slug });
    
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }
    
    console.log('✅ Blog deleted successfully');
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting blog:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}