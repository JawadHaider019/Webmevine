import { notFound } from 'next/navigation';
import ArticleClientView from '@/components/ArticleClientView';
import { getAllBlogs, getBlogBySlug, getRelatedBlogs } from '@/lib/blogs';
import { parseArticleMarkdown } from '@/utils/articleParser';

// Every post is pre-rendered at build time; unknown slugs return 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return getAllBlogs().map((post) => ({ slug: post.slug }));
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const post = getBlogBySlug(slug);
  if (!post) notFound();

  return (
    <ArticleClientView
      slug={slug}
      initialPost={post}
      initialParsed={parseArticleMarkdown(post.content || '', { extractLead: true })}
      initialRelated={getRelatedBlogs(post, 3)}
    />
  );
}
