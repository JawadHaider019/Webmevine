import ArticleClientView from '@/components/ArticleClientView';
import { getBlogBySlugFromDb, getBlogsFromDb } from '@/lib/blogDb';
import { parseArticleMarkdown } from '@/utils/articleParser';

export const dynamic = 'force-dynamic';

export default async function BlogPostPage({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;

  const initialPost = await getBlogBySlugFromDb(slug, { includeDrafts: true });
  const initialParsed = initialPost
    ? parseArticleMarkdown(initialPost.content || '', { extractLead: true })
    : null;

  let initialRelated = [];
  if (initialPost) {
    const { blogs } = await getBlogsFromDb({
      status: 'published',
      excludeSlug: initialPost.slug,
      includeFallbackIfEmpty: true,
    });

    // Prioritize same category first, then recent
    const sameCategory = blogs.filter(
      (b) =>
        (b.category || '').toLowerCase() ===
        (initialPost.category || '').toLowerCase()
    );
    const others = blogs.filter(
      (b) =>
        (b.category || '').toLowerCase() !==
        (initialPost.category || '').toLowerCase()
    );

    initialRelated = [...sameCategory, ...others].slice(0, 3);
  }

  return (
    <ArticleClientView
      slug={slug}
      initialPost={initialPost}
      initialParsed={initialParsed}
      initialRelated={initialRelated}
    />
  );
}
