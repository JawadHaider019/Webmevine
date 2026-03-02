// src/app/api/github/route.js
import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const path = searchParams.get('path');
  
  try {
    const response = await fetch(`https://api.github.com/repos/${process.env.NEXT_PUBLIC_GITHUB_REPO}/contents/${path}?ref=${process.env.NEXT_PUBLIC_GITHUB_BRANCH || 'main'}`, {
      headers: {
        'Authorization': `token ${process.env.GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const { path, content, message, sha } = await request.json();
    
    const body = {
      message,
      content,
      branch: process.env.NEXT_PUBLIC_GITHUB_BRANCH || 'main'
    };
    
    // Include sha if updating existing file
    if (sha) {
      body.sha = sha;
    }
    
    const response = await fetch(`https://api.github.com/repos/${process.env.NEXT_PUBLIC_GITHUB_REPO}/contents/${path}`, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${process.env.GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    });
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { path, message, sha } = await request.json();
    
    const response = await fetch(`https://api.github.com/repos/${process.env.NEXT_PUBLIC_GITHUB_REPO}/contents/${path}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `token ${process.env.GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        sha,
        branch: process.env.NEXT_PUBLIC_GITHUB_BRANCH || 'main'
      })
    });
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}