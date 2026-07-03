import { getBlogPostBodyHtml, getBlogPosts } from "@/lib/content";
import { BlogPostCard } from "./BlogPostCard";

export async function Blog() {
  const posts = await getBlogPosts();
  const postsWithBody = await Promise.all(
    posts.map(async (p) => ({
      post: p,
      bodyHtml: await getBlogPostBodyHtml(p.slug),
    })),
  );

  return (
    <section
      id="blog"
      className="border-b border-border bg-bg px-6 py-16 sm:py-20"
    >
      <div className="mx-auto max-w-4xl">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Blog
        </h2>
        <p className="mt-2 text-text-muted">
          Short notes on what I&apos;m building and learning. New posts ship
          whenever I have something worth saying.
        </p>
        {postsWithBody.length === 0 ? (
          <div className="mt-8 rounded-lg border border-dashed border-border bg-surface p-8 text-center text-text-muted">
            No posts yet — check back soon.
          </div>
        ) : (
          <div className="mt-8 grid gap-4">
            {postsWithBody.map(({ post, bodyHtml }) => (
              <BlogPostCard
                key={post.slug}
                post={post}
                bodyHtml={bodyHtml}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
