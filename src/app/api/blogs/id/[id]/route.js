// src/app/api/blogs/id/[id]/route.js
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

const DB_NAME = 'blog';
const COLLECTION = 'posts';

// Helper function to generate slug
const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
};

// GET blog by ID
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    
    console.log('📡 Fetching blog by ID:', id);
    
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid blog ID' }, { status: 400 });
    }
    
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    
    const blog = await db
      .collection(COLLECTION)
      .findOne({ _id: new ObjectId(id) });
    
    if (!blog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }
    
    return NextResponse.json({
      ...blog,
      id: blog._id.toString(),
      _id: undefined
    });
  } catch (error) {
    console.error('Error fetching blog:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT update blog by ID
export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    console.log('📝 Updating blog ID:', id);
    
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid blog ID' }, { status: 400 });
    }
    
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    
    const updateData = {
      ...body,
      updatedAt: new Date()
    };
    
    // Remove id from update data
    delete updateData.id;
    delete updateData._id;
    
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
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    
    console.log('🗑️ Deleting blog ID:', id);
    
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid blog ID' }, { status: 400 });
    }
    
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    
    const result = await db
      .collection(COLLECTION)
      .deleteOne({ _id: new ObjectId(id) });
    
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