import BlogListingClient from '@/components/BlogListingClient';
import { getBlogSummaries } from '@/lib/blogs';

// Static page: built once from src/data/blogs.json (article bodies are not sent to the browser).
export default function BlogPage() {
  return <BlogListingClient posts={getBlogSummaries()} />;
}
