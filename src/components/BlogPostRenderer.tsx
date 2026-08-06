import { useEffect, useId, useState } from "react";
import ReactMarkdown from "react-markdown";
import mermaid from "mermaid";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import "katex/dist/katex.min.css";
import type { Components } from "react-markdown";
import { extractText, slugify } from "@/lib/slugify";

interface BlogPostRendererProps {
  content: string;
}

const getFigureAnchorId = (src?: string, alt?: string) => {
  if (alt?.trim()) return slugify(alt);

  const fileName = src?.split("/").pop()?.replace(/\.[^.]+$/, "");
  return fileName ? slugify(fileName) : undefined;
};

interface MermaidDiagramProps {
  chart: string;
}

const MermaidDiagram = ({ chart }: MermaidDiagramProps) => {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const [svg, setSvg] = useState("");
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let isCurrent = true;

    setSvg("");
    setHasError(false);
    mermaid.initialize({
      startOnLoad: false,
      securityLevel: "strict",
      theme: "base",
      themeVariables: {
        background: "transparent",
        primaryColor: "#10182a",
        primaryTextColor: "#f4f7fb",
        primaryBorderColor: "#18d7f2",
        lineColor: "#18d7f2",
        secondaryColor: "#1a2238",
        tertiaryColor: "#1a2238",
      },
    });

    mermaid
      .render(`mermaid-${id}`, chart)
      .then(({ svg: renderedSvg }) => {
        if (isCurrent) setSvg(renderedSvg);
      })
      .catch(() => {
        if (isCurrent) setHasError(true);
      });

    return () => {
      isCurrent = false;
    };
  }, [chart, id]);

  if (hasError) {
    return (
      <pre className="bg-background border-2 border-destructive/50 p-4 my-4 overflow-x-auto">
        <code className="font-mono text-xs text-foreground/90">{chart}</code>
      </pre>
    );
  }

  if (!svg) {
    return (
      <div className="my-8 border-2 border-primary/40 bg-background/50 p-4 font-mono text-xs text-foreground/50">
        RENDERING_DIAGRAM_
      </div>
    );
  }

  return (
    <div
      className="my-8 overflow-x-auto border-2 border-primary/40 bg-background/50 p-4 [&_svg]:mx-auto [&_svg]:h-auto [&_svg]:max-w-full"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
};

const components: Components = {
  a: ({ href, children, ...props }) => {
    const isLocalAnchor = href?.startsWith("#");

    return (
      <a
        {...props}
        href={href}
        onClick={(event) => {
          if (!isLocalAnchor || !href) return;

          event.preventDefault();
          const target = document.getElementById(
            decodeURIComponent(href.slice(1))
          );
          target?.scrollIntoView({ behavior: "smooth", block: "start" });
        }}
      >
        {children}
      </a>
    );
  },
  h2: ({ children }) => {
    const id = slugify(extractText(children));
    return (
      <h2
        id={id}
        data-heading-level="2"
        className="font-mono text-xl font-bold text-primary mt-10 mb-4 pb-2 border-b-2 border-primary/30 scroll-mt-24"
      >
        {children}
      </h2>
    );
  },
  h3: ({ children }) => {
    const id = slugify(extractText(children));
    return (
      <h3
        id={id}
        data-heading-level="3"
        className="font-mono text-lg font-bold text-secondary mt-8 mb-3 scroll-mt-24"
      >
        {children}
      </h3>
    );
  },
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
  pre: ({ children }) => <>{children}</>,
  code: ({ children, className }) => {
    const language = /language-(\w+)/.exec(className ?? "")?.[1];
    const code = String(children).replace(/\n$/, "");

    if (language === "mermaid") {
      return <MermaidDiagram chart={code} />;
    }

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
  table: ({ children }) => (
    <div className="my-6 overflow-x-auto border-2 border-primary/30">
      <table className="w-full border-collapse font-mono text-sm text-foreground/90">
        {children}
      </table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="bg-primary/10 text-primary">{children}</thead>
  ),
  th: ({ children }) => (
    <th className="border-b-2 border-primary/30 px-4 py-3 text-left font-bold whitespace-nowrap">
      {children}
    </th>
  ),
  tbody: ({ children }) => <tbody>{children}</tbody>,
  tr: ({ children }) => (
    <tr className="border-b border-foreground/10 last:border-b-0">{children}</tr>
  ),
  td: ({ children }) => (
    <td className="border-r border-foreground/10 px-4 py-3 align-top last:border-r-0">
      {children}
    </td>
  ),
  img: ({ src, alt }) => {
    const figureId = getFigureAnchorId(src, alt);

    return (
      <figure
        id={figureId}
        data-scrolly-anchor={figureId}
        className="my-8 scroll-mt-24"
      >
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
    );
  },
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
    <div className="blog-content">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeRaw, rehypeKatex]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
