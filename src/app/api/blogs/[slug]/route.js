// src/app/api/blogs/[slug]/route.js
import { NextResponse } from 'next/server';
import { getBlogBySlugFromDb } from '@/lib/blogDb';

// GET /api/blogs/[slug] - Fetch a single blog by slug
export async function GET(request, { params }) {
  try {
    const resolvedParams = await params;
    const { slug } = resolvedParams;

    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
    }

    const blog = await getBlogBySlugFromDb(slug, { includeDrafts: true });

    if (!blog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    return NextResponse.json(blog);
  } catch (error) {
    console.error('Error fetching blog by slug:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog', details: error.message },
      { status: 500 }
    );
  }
}
