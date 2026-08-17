import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { EyebrowLabel } from "@/components/ui/EyebrowLabel";
import { Button } from "@/components/ui/Button";
import { supabase, Post } from "@/lib/supabase";

interface PageProps {
  params: Promise<{ slug: string }>;
}

const defaultPosts: Post[] = [
  {
    id: "1",
    slug: "building-scalable-design-systems-nextjs-15",
    title: "Building Scalable Design Systems with Next.js 15 & Satoshi",
    excerpt:
      "How we approach brand typography, visual tokens, and responsive UI components across high-growth digital applications.",
    content: `
# Building Scalable Design Systems with Next.js 15 & Satoshi

Design systems bridge the gap between brand positioning and enterprise software development. When visual identity tokens—such as color palettes, typographic hierarchies, and component bounds—are hardcoded into modular codebases, design consistency becomes automatic.

## Why Satoshi Typography Matters

For Horode, moving from standard web fonts to **Satoshi** was an intentional design decision. Satoshi combines clear geometric precision with modern grotesque subtleties, giving visual assets and digital interfaces a distinct, premium character.

### Key Principles of Modern System Architecture

1. **Tokenized CSS Variables**: Centralize border colors, background fills, and font stacks in standard CSS tokens.
2. **Component Separation**: Decouple layout shells from functional interactive components like buttons and forms.
3. **Responsive Grid Controls**: Use fluid clamp layouts (\`clamp(44px, 4.5vw, 72px)\`) to maintain aesthetic hierarchy across all mobile and desktop viewports.

> *"A design system is not a set of components; it is a shared language between brand strategy and engineering."*

## Conclusion

Building scalable digital products requires continuous refinement across code and design. By establishing strict tokenized guidelines early, growing teams can move faster without sacrificing craft.
`,
    cover_image_url: "/assets/hero-visual.png",
    published: true,
    published_at: "2026-02-15T00:00:00.000Z",
    read_time: "5 min read",
    category: "Design Strategy",
    created_at: "2026-02-15T00:00:00.000Z",
    updated_at: "2026-02-15T00:00:00.000Z",
  },
  {
    id: "2",
    slug: "why-brands-fail-without-systems",
    title: "Why Modern Brands Fail Without Integrated Technology Systems",
    excerpt:
      "Logos and standalone landing pages aren't enough. Here is how brand strategy and software architecture drive enterprise value.",
    content: `
# Why Modern Brands Fail Without Integrated Technology Systems

In today's digital landscape, customers interact with your business across dozens of touchpoints—from your visual identity and social graphics to your web portal and mobile app checkout.

## The Disconnect Between Branding and Code

Many companies treat brand strategy and software engineering as isolated silos. A agency designs a logo and brand guide, while a separate software team builds the app. The result is a disjointed customer experience.

### How Integrated Systems Win

- **Unified Voice & Visual Consistency**: The visual polish seen on marketing collateral carries seamlessly into the product interface.
- **Faster Market Execution**: Shared component libraries allow teams to ship new features without redesigning basic layouts.
- **Higher Market Valuation**: Companies with cohesive digital systems command higher trust and premium pricing power.
`,
    cover_image_url: "/assets/zalyx-ledger.png",
    published: true,
    published_at: "2026-02-10T00:00:00.000Z",
    read_time: "4 min read",
    category: "Brand Strategy",
    created_at: "2026-02-10T00:00:00.000Z",
    updated_at: "2026-02-10T00:00:00.000Z",
  },
];

export async function generateStaticParams() {
  try {
    if (
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder")
    ) {
      return defaultPosts.map((p) => ({ slug: p.slug }));
    }
    const { data } = await supabase
      .from("posts")
      .select("slug")
      .eq("published", true);
    if (data && data.length > 0) {
      return data.map((p) => ({ slug: p.slug }));
    }
    return defaultPosts.map((p) => ({ slug: p.slug }));
  } catch {
    return defaultPosts.map((p) => ({ slug: p.slug }));
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: "Article Not Found | Horode Design Studio",
    };
  }

  return {
    title: `${post.title} | Horode Design Studio`,
    description:
      post.excerpt ||
      `Read ${post.title} — perspectives on design strategy and software engineering by Horode Studio.`,
  };
}

async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    if (
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder")
    ) {
      const { data } = await supabase
        .from("posts")
        .select("*")
        .eq("slug", slug)
        .eq("published", true)
        .single();
      if (data) return data;
    }
  } catch {
    // fallback
  }
  return defaultPosts.find((p) => p.slug === slug) || null;
}

export default async function BlogPostDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const formattedDate = post.published_at
    ? new Date(post.published_at).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "Recently published";

  return (
    <main className="py-[60px] max-sm:py-[36px]">
      {/* Header Section */}
      <article className="post-header section-shell">
        <div className="flex items-center gap-[12px] mb-[24px]">
          <span className="inline-flex items-center min-h-[24px] px-[10px] border border-[var(--border)] rounded-full text-[#77777e] text-[11px] font-bold uppercase">
            {post.category || "Insight"}
          </span>
          <span className="text-[#8c8c93] text-[13px]">{post.read_time}</span>
          <span className="text-[#8c8c93] text-[13px]">·</span>
          <span className="text-[#8c8c93] text-[13px]">{formattedDate}</span>
        </div>

        <h1 className="max-w-[860px] m-0 text-[clamp(40px,4.2vw,64px)] max-sm:text-[34px] font-bold text-[#333337] leading-[1.12]">
          {post.title}
        </h1>

        {post.excerpt && (
          <p className="max-w-[680px] mt-[24px] mb-0 text-[#8c8c93] text-[19px] max-sm:text-[16px] leading-[1.5]">
            {post.excerpt}
          </p>
        )}
      </article>

      {/* Cover Image Banner */}
      {post.cover_image_url && (
        <section className="post-banner section-shell pt-[48px]">
          <div className="overflow-hidden rounded-[24px] border border-[var(--border)] max-w-[960px] mx-auto">
            <img
              src={post.cover_image_url}
              alt={post.title}
              className="w-full aspect-[1.85/1] object-cover block"
            />
          </div>
        </section>
      )}

      {/* Article Body Markdown Section */}
      <section className="post-body section-shell pt-[64px] max-sm:pt-[40px]">
        <div className="max-w-[760px] mx-auto prose prose-neutral text-[#333337] text-[17px] max-sm:text-[15px] leading-[1.7]">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {post.content}
          </ReactMarkdown>
        </div>
      </section>

      {/* Contextual CTA Section */}
      <section className="post-cta section-shell pt-[120px] pb-[40px] text-center max-sm:pt-[80px]">
        <div className="max-w-[760px] mx-auto p-[64px_36px] border border-[var(--border)] rounded-[var(--radius-lg)] bg-[#fafafa] max-sm:p-[42px_24px]">
          <h2 className="m-0 text-[clamp(32px,3.5vw,48px)] font-bold text-[#25252a] leading-[1.15]">
            Ready to Build Your System?
          </h2>
          <p className="max-w-[500px] mx-auto mt-[18px] mb-[36px] text-[#8c8c93] text-[15px] leading-[1.5]">
            Let's discuss how Horode's design and software capabilities can bring your business ideas to life.
          </p>
          <Button variant="filled" href="/contact" className="min-h-[58px] px-[32px]">
            Book Free Consultation
          </Button>
        </div>
      </section>
    </main>
  );
}
