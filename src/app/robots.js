const SITE_URL = 'https://webmavien.com';

export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api/'],
      },
      {
        userAgent: [
          'Googlebot',
          'Applebot',
          'Applebot-Extended',
          'OAI-SearchBot',
          'GPTBot',
          'PerplexityBot',
          'ClaudeBot',
        ],
        allow: ['/', '/casestudies/', '/blog/', '/services', '/process', '/llms.txt'],
        disallow: ['/admin', '/api/'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
