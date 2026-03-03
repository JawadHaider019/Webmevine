// src/app/api/test/route.js
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    message: 'API is working',
    timestamp: new Date().toISOString(),
    endpoints: {
      categories: '/api/categories',
      blogs: '/api/blogs',
      test: '/api/test'
    }
  });
}