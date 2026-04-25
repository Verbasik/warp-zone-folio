import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import "katex/dist/katex.min.css";
import type { Components } from "react-markdown";

interface BlogPostRendererProps {
  content: string;
}

const components: Components = {
  h2: ({ children }) => (
    <h2 className="font-mono text-xl font-bold text-primary mt-10 mb-4 pb-2 border-b-2 border-primary/30">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="font-mono text-lg font-bold text-secondary mt-8 mb-3">
      {children}
    </h3>
  ),
  p: ({ children }) => (
    <p className="font-mono text-sm leading-7 text-foreground/90 mb-4">
      {children}
    </p>
  ),
  ul: ({ children }) => (
    <ul className="font-mono text-sm leading-7 text-foreground/90 mb-4 space-y-1 pl-4 list-none">
      {children}
    </ul>
  ),
  li: ({ children }) => (
    <li className="before:content-['▸'] before:text-primary before:mr-2">
      {children}
    </li>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-accent pl-4 my-4 italic text-foreground/70 font-mono text-sm">
      {children}
    </blockquote>
  ),
  code: ({ children, className }) => {
    // Inline code
    if (!className) {
      return (
        <code className="bg-primary/10 text-primary font-mono text-xs px-1.5 py-0.5 border border-primary/20">
          {children}
        </code>
      );
    }
    // Block code
    return (
      <pre className="bg-background border-2 border-primary/30 p-4 my-4 overflow-x-auto">
        <code className="font-mono text-xs text-foreground/90">{children}</code>
      </pre>
    );
  },
  img: ({ src, alt }) => (
    <figure className="my-8">
      <div className="border-2 border-primary/40 p-2 bg-background/50">
        <img
          src={src}
          alt={alt}
          className="w-full h-auto block"
          loading="lazy"
        />
      </div>
      {alt && (
        <figcaption className="font-mono text-xs text-foreground/50 text-center mt-2">
          {alt}
        </figcaption>
      )}
    </figure>
  ),
  strong: ({ children }) => (
    <strong className="text-primary font-bold">{children}</strong>
  ),
  hr: () => <hr className="border-t-2 border-primary/20 my-8" />,
  details: ({ children }) => (
    <details className="border-2 border-primary/30 bg-background/60 p-4 my-4 rounded-sm [&_summary]:font-mono [&_summary]:text-sm [&_summary]:text-primary [&_summary]:font-bold [&_summary]:cursor-pointer">
      {children}
    </details>
  ),
  summary: ({ children }) => (
    <summary className="font-mono text-sm text-primary font-bold cursor-pointer list-none marker:content-[''] before:content-['▶'] before:mr-2 before:text-primary after:content-[''] pl-6 list-none">
      {children}
    </summary>
  ),
};

export const BlogPostRenderer = ({ content }: BlogPostRendererProps) => {
  return (
    <div className="blog-content max-w-3xl mx-auto">
      <ReactMarkdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeRaw, rehypeKatex]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
