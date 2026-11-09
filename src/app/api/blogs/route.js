// src/app/api/blogs/route.js
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { createSlug, getBlogsFromDb, normalizeBlogDocument } from '@/lib/blogDb';

const DB_NAME = 'webmavien';
const COLLECTION_NAME = 'blogs';

async function ensureUniqueSlug(collection, desiredSlug, excludeId = null) {
  let baseSlug = createSlug(desiredSlug) || `post-${Date.now()}`;
  let candidate = baseSlug;
  let counter = 1;

  while (true) {
    const query = { slug: candidate };
    if (excludeId && ObjectId.isValid(excludeId)) {
      query._id = { $ne: new ObjectId(excludeId) };
    }
    const existing = await collection.findOne(query);
    if (!existing) return candidate;
    candidate = `${baseSlug}-${counter}`;
    counter++;
  }
}

function buildBlogPayload(data, existingDoc = null) {
  const isPublished =
    data.status !== undefined
      ? data.status === 'published'
      : data.published !== undefined
      ? Boolean(data.published)
      : existingDoc
      ? Boolean(existingDoc.published)
      : true;

  const status = isPublished ? 'published' : 'draft';
  const published = isPublished;

  const rawReadTime = String(
    data.readTime ?? data.read_time ?? existingDoc?.readTime ?? '5'
  );
  const readTime = rawReadTime.replace(/[^\d]/g, '') || '5';

  const imageUrl =
    data.imageUrl ??
    data.image_url ??
    existingDoc?.imageUrl ??
    '';

  const excerpt =
    data.excerpt ??
    data.metaDescription ??
    data.meta_description ??
    existingDoc?.excerpt ??
    (data.content
      ? data.content.replace(/[#*`:::]/g, '').slice(0, 160).trim() + '...'
      : '');

  const metaDescription =
    data.metaDescription ??
    data.meta_description ??
    excerpt ??
    '';

  const metaTitle =
    data.metaTitle ??
    data.meta_title ??
    data.title ??
    existingDoc?.metaTitle ??
    '';

  const breadcrumbTitle =
    data.breadcrumbTitle ??
    data.breadcrumb_title ??
    existingDoc?.breadcrumbTitle ??
    data.title ??
    '';

  const altText =
    data.altText ??
    data.alt_text ??
    existingDoc?.altText ??
    data.title ??
    '';

  const schemaCaption =
    data.schemaCaption ??
    data.schema_caption ??
    existingDoc?.schemaCaption ??
    '';

  const chatGptLink =
    data.chatGptLink ??
    data.chatgpt_link ??
    existingDoc?.chatGptLink ??
    '';

  const tags = Array.isArray(data.tags)
    ? data.tags
    : typeof data.tags === 'string'
    ? data.tags.split(',').map((t) => t.trim()).filter(Boolean)
    : existingDoc?.tags || [];

  const createdAt = data.createdAt
    ? new Date(data.createdAt)
    : existingDoc?.createdAt
    ? new Date(existingDoc.createdAt)
    : new Date();

  const updatedAt = data.updatedAt ? new Date(data.updatedAt) : new Date();

  return {
    title: data.title ?? existingDoc?.title ?? 'Untitled Article',
    content: data.content ?? existingDoc?.content ?? '',
    excerpt,
    metaTitle,
    metaDescription,
    breadcrumbTitle,
    imageUrl,
    altText,
    schemaCaption,
    author: data.author ?? existingDoc?.author ?? 'WebMavien Engineering Team',
    authorRole:
      data.authorRole ??
      data.author_role ??
      existingDoc?.authorRole ??
      'Senior Full-Stack & AI Architects',
    authorBio:
      data.authorBio ??
      data.author_bio ??
      existingDoc?.authorBio ??
      'The WebMavien Engineering Team specializes in high-performance Next.js architectures, custom AI agent workflows, and scalable SaaS platforms.',
    category: data.category ?? existingDoc?.category ?? 'Development',
    tags,
    readTime,
    chatGptLink,
    published,
    status,
    featured:
      data.featured !== undefined
        ? Boolean(data.featured)
        : Boolean(existingDoc?.featured),
    createdAt: isNaN(createdAt.getTime()) ? new Date() : createdAt,
    updatedAt: isNaN(updatedAt.getTime()) ? new Date() : updatedAt,
  };
}

// GET /api/blogs - Fetch blogs with optional filtering
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'all';
    const category = searchParams.get('category') || '';
    const search = searchParams.get('search') || '';
    const featured = searchParams.get('featured');
    const limit = Number(searchParams.get('limit') || 0);
    const withStats = searchParams.get('withStats') === 'true';

    const result = await getBlogsFromDb({
      status,
      category,
      search,
      featured,
      limit,
    });

    if (withStats) {
      return NextResponse.json(result);
    }

    return NextResponse.json(result.blogs);
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blogs', details: error.message },
      { status: 500 }
    );
  }
}

// POST /api/blogs - Create a new blog
export async function POST(request) {
  try {
    const data = await request.json();

    if (!data.title || !data.content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const desiredSlug = data.slug ? createSlug(data.slug) : createSlug(data.title);
    const slug = await ensureUniqueSlug(collection, desiredSlug);

    const newBlog = {
      ...buildBlogPayload(data),
      slug,
    };

    const result = await collection.insertOne(newBlog);
    const saved = normalizeBlogDocument({
      ...newBlog,
      _id: result.insertedId,
    });

    return NextResponse.json(saved, { status: 201 });
  } catch (error) {
    console.error('Error creating blog:', error);
    return NextResponse.json(
      { error: 'Failed to create blog', details: error.message },
      { status: 500 }
    );
  }
}

// PUT /api/blogs - Update a blog
export async function PUT(request) {
  try {
    const data = await request.json();
    const id = data.id || data._id;

    if (!id) {
      return NextResponse.json({ error: 'Blog ID is required' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const existing = ObjectId.isValid(id)
      ? await collection.findOne({ _id: new ObjectId(id) })
      : await collection.findOne({ slug: id });

    if (!existing) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    const payload = buildBlogPayload(data, existing);

    // Preserve existing slug unless explicitly changed in data.slug
    let finalSlug = existing.slug;
    if (data.slug && createSlug(data.slug) !== existing.slug) {
      finalSlug = await ensureUniqueSlug(
        collection,
        data.slug,
        existing._id.toString()
      );
    } else if (!finalSlug) {
      finalSlug = await ensureUniqueSlug(
        collection,
        payload.title,
        existing._id.toString()
      );
    }

    payload.slug = finalSlug;

    await collection.updateOne(
      { _id: existing._id },
      { $set: payload }
    );

    const updated = normalizeBlogDocument({
      ...existing,
      ...payload,
      _id: existing._id,
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating blog:', error);
    return NextResponse.json(
      { error: 'Failed to update blog', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/blogs - Delete a blog
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Blog ID is required' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const query = ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { slug: id };
    const result = await collection.deleteOne(query);

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog:', error);
    return NextResponse.json(
      { error: 'Failed to delete blog', details: error.message },
      { status: 500 }
    );
  }
}
