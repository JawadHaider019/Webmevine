// src/app/api/github/upload/route.js
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('image');
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'File must be an image' },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size too large (max 5MB)' },
        { status: 400 }
      );
    }

    // Convert file to buffer and then to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString('base64');

    // Generate a unique filename
    const timestamp = Date.now();
    const safeFileName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
    const fileName = `${timestamp}-${safeFileName}`;
    
    // GitHub API upload
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    const GITHUB_REPO = process.env.NEXT_PUBLIC_GITHUB_REPO;
    const GITHUB_BRANCH = process.env.NEXT_PUBLIC_GITHUB_BRANCH || 'main';
    const IMAGES_FOLDER = 'public/images';

    console.log('Uploading to GitHub:', {
      repo: GITHUB_REPO,
      branch: GITHUB_BRANCH,
      path: `${IMAGES_FOLDER}/${fileName}`
    });

    // Upload image to GitHub
    const response = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/contents/${IMAGES_FOLDER}/${fileName}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `token ${GITHUB_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `Upload image: ${fileName}`,
          content: base64,
          branch: GITHUB_BRANCH
        })
      }
    );

    const responseData = await response.json();

    if (!response.ok) {
      console.error('GitHub API Error:', responseData);
      return NextResponse.json(
        { 
          error: 'Failed to upload to GitHub', 
          details: responseData 
        },
        { status: response.status }
      );
    }

    // 🔥 FIX: Return the GitHub raw URL instead of local path
    const imageUrl = `https://raw.githubusercontent.com/${GITHUB_REPO}/${GITHUB_BRANCH}/${IMAGES_FOLDER}/${fileName}`;
    
    return NextResponse.json({
      success: true,
      url: imageUrl,  // Now returns full GitHub URL
      fileName: fileName,
      message: 'Image uploaded successfully'
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    const GITHUB_REPO = process.env.NEXT_PUBLIC_GITHUB_REPO;
    const GITHUB_BRANCH = process.env.NEXT_PUBLIC_GITHUB_BRANCH || 'main';
    const IMAGES_FOLDER = 'public/images';

    const response = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/contents/${IMAGES_FOLDER}?ref=${GITHUB_BRANCH}`,
      {
        headers: {
          'Authorization': `token ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      }
    );

    if (response.ok) {
      return NextResponse.json({ 
        exists: true,
        message: 'Images folder exists' 
      });
    } else if (response.status === 404) {
      return NextResponse.json({ 
        exists: false,
        message: 'Images folder not found. Please create public/images/ folder.' 
      });
    } else {
      return NextResponse.json({ 
        exists: false,
        error: 'Failed to check folder' 
      });
    }
  } catch (error) {
    return NextResponse.json({ 
      exists: false,
      error: error.message 
    }, { status: 500 });
  }
}