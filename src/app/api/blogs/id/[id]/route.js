// src/app/api/blogs/id/[id]/route.js
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { createSlug, normalizeBlogDocument } from '@/lib/blogDb';

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

// PUT /api/blogs/id/[id] - Update a blog by ID
export async function PUT(request, { params }) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;
    const data = await request.json();

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

    const isPublished =
      data.status !== undefined
        ? data.status === 'published'
        : data.published !== undefined
        ? Boolean(data.published)
        : Boolean(existing.published);

    const status = isPublished ? 'published' : 'draft';
    const published = isPublished;

    const rawReadTime = String(
      data.readTime ?? data.read_time ?? existing.readTime ?? '5'
    );
    const readTime = rawReadTime.replace(/[^\d]/g, '') || '5';

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
        data.title || existing.title,
        existing._id.toString()
      );
    }

    const createdAt = data.createdAt
      ? new Date(data.createdAt)
      : existing.createdAt
      ? new Date(existing.createdAt)
      : new Date();

    const updatedAt = data.updatedAt ? new Date(data.updatedAt) : new Date();

    const updateData = {
      title: data.title ?? existing.title,
      slug: finalSlug,
      content: data.content ?? existing.content,
      excerpt:
        data.excerpt ??
        data.metaDescription ??
        data.meta_description ??
        existing.excerpt ??
        '',
      metaTitle:
        data.metaTitle ??
        data.meta_title ??
        existing.metaTitle ??
        data.title ??
        existing.title,
      metaDescription:
        data.metaDescription ??
        data.meta_description ??
        data.excerpt ??
        existing.metaDescription ??
        '',
      breadcrumbTitle:
        data.breadcrumbTitle ??
        data.breadcrumb_title ??
        existing.breadcrumbTitle ??
        data.title ??
        existing.title,
      imageUrl:
        data.imageUrl ?? data.image_url ?? existing.imageUrl ?? '',
      altText:
        data.altText ??
        data.alt_text ??
        existing.altText ??
        data.title ??
        existing.title,
      schemaCaption:
        data.schemaCaption ??
        data.schema_caption ??
        existing.schemaCaption ??
        '',
      author: data.author ?? existing.author ?? 'WebMavien Engineering Team',
      authorRole:
        data.authorRole ??
        data.author_role ??
        existing.authorRole ??
        'Senior Full-Stack & AI Architects',
      authorBio:
        data.authorBio ??
        data.author_bio ??
        existing.authorBio ??
        '',
      category: data.category ?? existing.category ?? 'Development',
      tags: Array.isArray(data.tags)
        ? data.tags
        : typeof data.tags === 'string'
        ? data.tags.split(',').map((t) => t.trim()).filter(Boolean)
        : existing.tags || [],
      readTime,
      chatGptLink:
        data.chatGptLink ??
        data.chatgpt_link ??
        existing.chatGptLink ??
        '',
      published,
      status,
      featured:
        data.featured !== undefined
          ? Boolean(data.featured)
          : Boolean(existing.featured),
      createdAt: isNaN(createdAt.getTime()) ? new Date() : createdAt,
      updatedAt: isNaN(updatedAt.getTime()) ? new Date() : updatedAt,
    };

    await collection.updateOne({ _id: existing._id }, { $set: updateData });

    const updated = normalizeBlogDocument({
      ...existing,
      ...updateData,
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

// DELETE /api/blogs/id/[id] - Delete a blog by ID
export async function DELETE(request, { params }) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;

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
