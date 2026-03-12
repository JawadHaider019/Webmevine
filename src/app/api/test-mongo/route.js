// src/app/api/test-mongo/route.js
import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

export async function GET() {
  try {
    const client = new MongoClient(process.env.MONGODB_URI, {
      ssl: true,
      tls: true,
      tlsAllowInvalidCertificates: true,
      serverSelectionTimeoutMS: 10000
    });
    
    await client.connect();
    const db = client.db('webmavien');
    const collections = await db.listCollections().toArray();
    await client.close();
    
    return NextResponse.json({ 
      success: true, 
      collections: collections.map(c => c.name) 
    });
  } catch (error) {
    console.error('MongoDB connection test failed:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      name: error.name,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}