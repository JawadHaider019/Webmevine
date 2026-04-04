// src/app/api/blogs/id/[id]/route.js
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

const DB_NAME = 'webmavien';
const COLLECTION = 'blogs';

// GET blog by ID
export async function GET(request, { params }) {
  try {
    const { id } = await params;

    console.log('📡 Fetching blog by ID:', id);

    if (!id || !ObjectId.isValid(id)) {
      console.log('❌ Invalid blog ID:', id);
      return NextResponse.json({ error: 'Invalid blog ID' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const blog = await db
      .collection(COLLECTION)
      .findOne({ _id: new ObjectId(id) });

    if (!blog) {
      console.log('❌ Blog not found with ID:', id);
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    console.log('✅ Blog found:', blog.title);

    return NextResponse.json({
      ...blog,
      id: blog._id.toString(),
      _id: undefined
    });
  } catch (error) {
    console.error('Error fetching blog by ID:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT update blog by ID
export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();

    console.log('📝 Updating blog with ID:', id);

    if (!id || !ObjectId.isValid(id)) {
      console.log('❌ Invalid blog ID:', id);
      return NextResponse.json({ error: 'Invalid blog ID' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);

    // Remove _id and id from update data if present
    const { _id, id: _, ...updateData } = body;

    // Add updated timestamp
    updateData.updatedAt = new Date();

    const result = await db
      .collection(COLLECTION)
      .updateOne(
        { _id: new ObjectId(id) },
        { $set: updateData }
      );

    if (result.matchedCount === 0) {
      console.log('❌ Blog not found for update:', id);
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

    console.log('🗑️ Deleting blog with ID:', id);

    if (!id || !ObjectId.isValid(id)) {
      console.log('❌ Invalid blog ID:', id);
      return NextResponse.json({ error: 'Invalid blog ID' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const result = await db
      .collection(COLLECTION)
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      console.log('❌ Blog not found for deletion:', id);
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