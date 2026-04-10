import { Link } from "react-router-dom";
import { Calendar, Clock, Tag, ArrowLeft } from "lucide-react";
import { getAllPosts } from "@/config/blog.config";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/sections/Footer";
import { Starfield } from "@/components/Starfield";

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("ru-RU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

const Blog = () => {
  const posts = getAllPosts();

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <Starfield />
      <Navigation />

      <main className="relative z-10 pt-24 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Back link */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 font-mono text-xs text-foreground/50 hover:text-primary mb-10 transition-colors"
          >
            <ArrowLeft size={14} />
            BACK TO MAIN
          </Link>

          {/* Header */}
          <div className="mb-12">
            <div className="inline-block bg-primary/10 border-2 border-primary px-4 py-1 font-mono text-sm text-primary mb-4">
              $ ls ~/blog/
            </div>
            <h1 className="font-mono text-4xl font-bold text-foreground">
              &gt; BLOG_
            </h1>
            <p className="font-mono text-sm text-foreground/50 mt-2">
              {posts.length} {posts.length === 1 ? "пост" : "постов"}
            </p>
          </div>

          {/* Posts list */}
          <div className="space-y-4">
            {posts.map((post) => (
              <Link
                key={post.slug}
                to={`/blog/${post.slug}`}
                className="group block"
              >
                <article className="border-2 border-foreground/20 bg-background/50 p-6 transition-all duration-200 group-hover:border-primary group-hover:bg-primary/5">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="flex-1">
                      {/* Status + Tags */}
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        {post.status === "draft" ? (
                          <span className="inline-flex items-center font-mono text-xs font-bold text-amber-400 border border-amber-400/50 px-2 py-0.5 bg-amber-400/10">
                            ✎ DRAFT
                          </span>
                        ) : (
                          <span className="inline-flex items-center font-mono text-xs font-bold text-accent border border-accent/50 px-2 py-0.5 bg-accent/10">
                            ✓ PUBLISHED
                          </span>
                        )}
                        {post.tags.map((tag) => (
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
                      <h2 className="font-mono text-lg font-bold text-foreground group-hover:text-primary transition-colors mb-2">
                        {post.title}
                      </h2>

                      {/* Description */}
                      <p className="font-mono text-xs text-foreground/60 leading-relaxed">
                        {post.description}
                      </p>
                    </div>

                    {/* Meta */}
                    <div className="flex sm:flex-col gap-4 sm:gap-2 text-foreground/40 font-mono text-xs sm:text-right shrink-0">
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
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Blog;
