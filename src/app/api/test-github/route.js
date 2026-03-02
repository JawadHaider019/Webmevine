// src/app/api/test-github/route.js
import { NextResponse } from 'next/server';

export async function GET() {
  const results = {
    env: {
      hasToken: !!process.env.GITHUB_TOKEN,
      repo: process.env.NEXT_PUBLIC_GITHUB_REPO || 'Not set',
      branch: process.env.NEXT_PUBLIC_GITHUB_BRANCH || 'Not set',
      tokenFirstChars: process.env.GITHUB_TOKEN ? process.env.GITHUB_TOKEN.substring(0, 10) + '...' : 'No token'
    },
    github: {},
    folders: {},
    errors: []
  };

  try {
    // Test GitHub token
    if (process.env.GITHUB_TOKEN) {
      const userResponse = await fetch('https://api.github.com/user', {
        headers: {
          'Authorization': `token ${process.env.GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });

      if (userResponse.ok) {
        const userData = await userResponse.json();
        results.github.user = {
          login: userData.login,
          name: userData.name
        };
        results.github.tokenValid = true;
      } else {
        results.github.tokenValid = false;
        results.github.userError = `Token invalid: ${userResponse.status}`;
      }
    }

    // Test repository access
    if (process.env.NEXT_PUBLIC_GITHUB_REPO && process.env.GITHUB_TOKEN) {
      const repoResponse = await fetch(
        `https://api.github.com/repos/${process.env.NEXT_PUBLIC_GITHUB_REPO}`,
        {
          headers: {
            'Authorization': `token ${process.env.GITHUB_TOKEN}`,
            'Accept': 'application/vnd.github.v3+json'
          }
        }
      );

      if (repoResponse.ok) {
        const repoData = await repoResponse.json();
        results.github.repo = {
          name: repoData.full_name,
          exists: true,
          private: repoData.private
        };

        // Check if content/blog folder exists
        const blogResponse = await fetch(
          `https://api.github.com/repos/${process.env.NEXT_PUBLIC_GITHUB_REPO}/contents/content/blog?ref=${process.env.NEXT_PUBLIC_GITHUB_BRANCH || 'main'}`,
          {
            headers: {
              'Authorization': `token ${process.env.GITHUB_TOKEN}`,
              'Accept': 'application/vnd.github.v3+json'
            }
          }
        );

        if (blogResponse.ok) {
          results.folders.blog = '✅ Exists';
        } else if (blogResponse.status === 404) {
          results.folders.blog = '❌ Missing - Create content/blog/ folder';
        } else {
          results.folders.blog = `❌ Error: ${blogResponse.status}`;
        }

        // Check if public/images folder exists
        const imagesResponse = await fetch(
          `https://api.github.com/repos/${process.env.NEXT_PUBLIC_GITHUB_REPO}/contents/public/images?ref=${process.env.NEXT_PUBLIC_GITHUB_BRANCH || 'main'}`,
          {
            headers: {
              'Authorization': `token ${process.env.GITHUB_TOKEN}`,
              'Accept': 'application/vnd.github.v3+json'
            }
          }
        );

        if (imagesResponse.ok) {
          results.folders.images = '✅ Exists';
        } else if (imagesResponse.status === 404) {
          results.folders.images = '❌ Missing - Create public/images/ folder';
        } else {
          results.folders.images = `❌ Error: ${imagesResponse.status}`;
        }
      } else {
        results.github.repoError = `Repo not found: ${repoResponse.status}`;
      }
    }

    results.status = 'Test completed';
    return NextResponse.json(results);

  } catch (error) {
    return NextResponse.json({ 
      status: 'error',
      error: error.message 
    }, { status: 500 });
  }
}