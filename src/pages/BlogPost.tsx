import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Calendar, Clock, Tag, ArrowLeft } from "lucide-react";
import { getPostBySlug } from "@/config/blog.config";
import { BlogPostRenderer } from "@/components/BlogPostRenderer";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/sections/Footer";
import { Starfield } from "@/components/Starfield";
import NotFound from "./NotFound";

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("ru-RU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

type Lang = "ru" | "en";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getPostBySlug(slug) : undefined;

  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [lang, setLang] = useState<Lang>("ru");

  useEffect(() => {
    if (!post) return;

    setLoading(true);
    setError(false);

    const suffix = lang === "en" ? ".en" : "";
    fetch(`/warp-zone-folio/blog/${post.slug}/${post.slug}${suffix}.md`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.text();
      })
      .then((text) => {
        setContent(text);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [post, lang]);

  if (!post) return <NotFound />;

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <Starfield />
      <Navigation />

      <main className="relative z-10 pt-24 pb-20 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Back link */}
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 font-mono text-xs text-foreground/50 hover:text-primary mb-10 transition-colors"
          >
            <ArrowLeft size={14} />
            BACK TO BLOG
          </Link>

          {/* Post header */}
          <header className="mb-10 pb-8 border-b-2 border-foreground/10">
            {/* Status + Tags + Lang switcher */}
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
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 font-mono text-xs text-secondary border border-secondary/40 px-2 py-0.5 bg-secondary/5"
                >
                  <Tag size={10} />
                  {tag}
                </span>
              ))}
              {post.hasEnglish && (
                <div className="flex items-center gap-1 ml-auto">
                  {(["ru", "en"] as Lang[]).map((l) => (
                    <button
                      key={l}
                      onClick={() => setLang(l)}
                      className={`font-mono text-xs px-2 py-0.5 border transition-colors ${
                        lang === l
                          ? "border-primary text-primary bg-primary/10"
                          : "border-foreground/20 text-foreground/40 hover:text-foreground/70"
                      }`}
                    >
                      {l.toUpperCase()}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Title */}
            <h1 className="font-mono text-2xl sm:text-3xl font-bold text-foreground leading-snug mb-4">
              {lang === "en" && post.titleEn ? post.titleEn : post.title}
            </h1>

            {/* Meta */}
            <div className="flex items-center gap-5 font-mono text-xs text-foreground/40">
              <span className="flex items-center gap-1.5">
                <Calendar size={12} />
                {formatDate(post.date)}
              </span>
              {post.readingTime && (
                <span className="flex items-center gap-1.5">
                  <Clock size={12} />
                  {post.readingTime} {lang === "en" ? "min read" : "минут чтения"}
                </span>
              )}
            </div>
          </header>

          {/* Content */}
          {loading && (
            <div className="font-mono text-sm text-foreground/40 py-20 text-center">
              <div className="inline-block animate-pulse">LOADING_</div>
            </div>
          )}

          {error && (
            <div className="font-mono text-sm text-secondary border-2 border-secondary/30 p-6 text-center">
              Не удалось загрузить контент поста.
            </div>
          )}

          {!loading && !error && <BlogPostRenderer content={content} />}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BlogPost;
