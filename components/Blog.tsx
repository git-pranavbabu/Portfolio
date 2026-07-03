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
    <section id="blog" className="section">
      <div className="section-inner">
        <h2
          className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-3"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Blog
        </h2>
        <p
          className="text-lg mb-8 max-w-2xl"
          style={{ color: "var(--color-muted)" }}
        >
          Short notes on what I&apos;m building and learning. New posts ship
          whenever I have something worth saying.
        </p>
        {postsWithBody.length === 0 ? (
          <div className="clay-card p-10 text-center">
            <p style={{ color: "var(--color-muted)" }}>
              No posts yet — check back soon.
            </p>
          </div>
        ) : (
          <div className="grid gap-5">
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
