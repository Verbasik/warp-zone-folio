import { Link } from "react-router-dom";
import { Calendar, Clock, Tag } from "lucide-react";
import { getFeaturedPosts } from "@/config/blog.config";

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("ru-RU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

export const BlogSection = () => {
  const posts = getFeaturedPosts();

  return (
    <section id="blog" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block bg-primary/10 border-2 border-primary px-4 py-1 font-mono text-sm text-primary mb-4">
            $ cat ~/blog/posts.md
          </div>
          <h2 className="font-mono text-3xl font-bold text-foreground mb-2">
            &gt; BLOG_
          </h2>
          <p className="font-mono text-sm text-foreground/60">
            Разборы paper, ML-идеи, заметки из практики
          </p>
        </div>

        {/* Posts grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.slug}
              to={`/blog/${post.slug}`}
              className="group block"
            >
              <article className="h-full border-2 border-foreground/20 bg-background/50 p-6 transition-all duration-200 group-hover:border-primary group-hover:bg-primary/5 group-hover:-translate-y-0.5">
                {/* Status + Tags row */}
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  {post.status === "draft" ? (
                    <span className="inline-flex items-center font-mono text-xs font-bold text-amber-400 border border-amber-400/50 px-2 py-0.5 bg-amber-400/10">
                      ✎ DRAFT
                    </span>
                  ) : (
                    <span className="inline-flex items-center font-mono text-xs font-bold text-accent border border-accent/50 px-2 py-0.5 bg-accent/10">
                      ✓ PUBLISHED
                    </span>
                  )}
                  {post.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 font-mono text-xs text-secondary border border-secondary/40 px-2 py-0.5 bg-secondary/5"
                    >
                      <Tag size={10} />
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Title */}
                <h3 className="font-mono text-base font-bold text-foreground mb-3 group-hover:text-primary transition-colors leading-snug">
                  {post.title}
                </h3>

                {/* Description */}
                <p className="font-mono text-xs text-foreground/60 leading-relaxed mb-6">
                  {post.description}
                </p>

                {/* Meta */}
                <div className="flex items-center gap-4 text-foreground/40 font-mono text-xs mt-auto">
                  <span className="flex items-center gap-1">
                    <Calendar size={11} />
                    {formatDate(post.date)}
                  </span>
                  {post.readingTime && (
                    <span className="flex items-center gap-1">
                      <Clock size={11} />
                      {post.readingTime} мин
                    </span>
                  )}
                </div>

                {/* Read more */}
                <div className="mt-4 pt-4 border-t border-foreground/10 font-mono text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  READ MORE →
                </div>
              </article>
            </Link>
          ))}
        </div>

        {/* All posts link */}
        <div className="text-center mt-10">
          <Link
            to="/blog"
            className="inline-block font-mono text-sm border-2 border-foreground/30 text-foreground/60 px-6 py-2 hover:border-primary hover:text-primary transition-colors"
          >
            [ ALL POSTS ]
          </Link>
        </div>
      </div>
    </section>
  );
};
