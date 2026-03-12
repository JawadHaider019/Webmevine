// src/app/api/categories/route.js
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

const DB_NAME = 'webmavien';
const COLLECTION = 'blogs';

export async function GET() {
  try {
    console.log('📡 Categories API called');
    console.log(`🔍 Using database: ${DB_NAME}, collection: ${COLLECTION}`);
    
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    
    // Get distinct categories from published posts
    const categories = await db
      .collection(COLLECTION)
      .distinct('category', { published: true });  // Changed from 'status' to 'published'
    
    console.log('Raw categories from DB:', categories);
    
    // Filter out empty, null, or undefined categories
    const filteredCategories = categories
      .filter(cat => cat && typeof cat === 'string' && cat.trim() !== '')
      .sort();
    
    console.log(`✅ Found ${filteredCategories.length} categories:`, filteredCategories);
    
    // Always return an array (even if empty)
    return NextResponse.json(filteredCategories);
  } catch (error) {
    console.error('❌ Error fetching categories:', error);
    // Return empty array on error, not an error response
    return NextResponse.json([]);
  }
}