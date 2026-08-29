import React from "react";
import type { Metadata } from "next";
import { EyebrowLabel } from "@/components/ui/EyebrowLabel";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { supabase, Post, getSiteContentMap, DEFAULT_SITE_CONTENT } from "@/lib/supabase";

export const metadata: Metadata = {
  title: "Blog & Insights | Horode Design Studio",
  description:
    "Explore perspectives on brand strategy, design systems, UI/UX engineering, and modern web application development.",
};

const defaultPosts: Post[] = [
  {
    id: "1",
    slug: "building-scalable-design-systems-nextjs-15",
    title: "Building Scalable Design Systems with Next.js 15 & Satoshi",
    excerpt:
      "How we approach brand typography, visual tokens, and responsive UI components across high-growth digital applications.",
    content: "# Building Scalable Design Systems\n\nDesign systems bridge brand identity and software engineering...",
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
    content: "# Integrated Brand & Tech Systems\n\nWhen brand identity and software architecture align...",
    cover_image_url: "/assets/zalyx-ledger.png",
    published: true,
    published_at: "2026-02-10T00:00:00.000Z",
    read_time: "4 min read",
    category: "Brand Strategy",
    created_at: "2026-02-10T00:00:00.000Z",
    updated_at: "2026-02-10T00:00:00.000Z",
  },
];

async function getPublishedPosts(): Promise<Post[]> {
  try {
    if (
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder")
    ) {
      return defaultPosts;
    }
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("published", true)
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) {
      return defaultPosts;
    }
    return data;
  } catch {
    return defaultPosts;
  }
}

export default async function BlogIndexPage() {
  const [posts, content] = await Promise.all([
    getPublishedPosts(),
    getSiteContentMap(),
  ]);

  const introEyebrow = content.blog_intro_eyebrow || DEFAULT_SITE_CONTENT.blog_intro_eyebrow;
  const introHeading = content.blog_intro_heading || DEFAULT_SITE_CONTENT.blog_intro_heading;
  const introSubhead = content.blog_intro_subhead || DEFAULT_SITE_CONTENT.blog_intro_subhead;
  const ctaTitle = content.blog_cta_title || DEFAULT_SITE_CONTENT.blog_cta_title;
  const ctaText = content.blog_cta_text || DEFAULT_SITE_CONTENT.blog_cta_text;

  return (
    <main className="py-[60px] max-sm:py-[36px]">
      {/* Header Section */}
      <Reveal as="section" className="blog-header section-shell">
        <EyebrowLabel className="mb-[26px]">{introEyebrow}</EyebrowLabel>
        <h1 className="max-w-[840px] m-0 text-[clamp(44px,4.5vw,72px)] max-sm:text-[42px] max-[430px]:text-[32px] font-bold leading-[1.08] text-[#333337] tracking-normal">
          {introHeading}
        </h1>
        <p className="max-w-[620px] mt-[24px] mb-0 text-[#97979d] text-[18px] max-sm:text-[15px] leading-[1.4]">
          {introSubhead}
        </p>
      </Reveal>

      {/* Blog Posts Grid */}
      <Reveal as="section" className="blog-grid-section section-shell pt-[72px] max-sm:pt-[48px]">
        <div className="grid grid-cols-2 gap-[48px] max-lg:grid-cols-1">
          {posts.map((post, index) => (
            <Reveal key={post.id || post.slug} delay={index * 0.1}>
              <article className="blog-card border border-[var(--border)] rounded-[var(--radius-lg)] overflow-hidden bg-white transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-md group flex flex-col justify-between h-full">
                <div>
                  {post.cover_image_url && (
                    <a href={`/blog/${post.slug}`} className="block overflow-hidden">
                      <img
                        src={post.cover_image_url}
                        alt={post.title}
                        className="w-full aspect-[1.78/1] object-cover block group-hover:scale-[1.02] transition-transform duration-300"
                      />
                    </a>
                  )}
                  <div className="p-[36px] max-sm:p-[24px]">
                    <div className="flex items-center gap-[12px] mb-[16px]">
                      <span className="inline-flex items-center min-h-[22px] px-[9px] border border-[var(--border)] rounded-full text-[#77777e] text-[10px] font-bold uppercase">
                        {post.category || "Insight"}
                      </span>
                      <span className="text-[#8c8c93] text-[12px]">
                        {post.read_time || "5 min read"}
                      </span>
                    </div>

                    <h2 className="m-0 mb-[12px] text-[24px] max-sm:text-[20px] font-bold text-[#25252a] group-hover:text-black transition-colors leading-[1.25]">
                      <a href={`/blog/${post.slug}`}>{post.title}</a>
                    </h2>

                    <p className="m-0 text-[#8c8c93] text-[15px] leading-[1.6]">
                      {post.excerpt}
                    </p>
                  </div>
                </div>

                <div className="p-[0_36px_36px] max-sm:p-[0_24px_24px]">
                  <a
                    href={`/blog/${post.slug}`}
                    className="text-[#222226] text-[13px] font-bold inline-flex items-center gap-1 group-hover:underline"
                  >
                    Read article <span aria-hidden="true">&nearr;</span>
                  </a>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </Reveal>

      {/* CTA Section */}
      <Reveal as="section" className="blog-cta section-shell pt-[140px] pb-[60px] text-center max-sm:pt-[90px]">
        <div className="max-w-[760px] mx-auto p-[64px_36px] border border-[var(--border)] rounded-[var(--radius-lg)] bg-[#fafafa] max-sm:p-[42px_24px]">
          <h2 className="m-0 text-[clamp(32px,3.5vw,48px)] font-bold text-[#25252a] leading-[1.15]">
            {ctaTitle}
          </h2>
          <p className="max-w-[500px] mx-auto mt-[18px] mb-[36px] text-[#8c8c93] text-[15px] leading-[1.5]">
            {ctaText}
          </p>
          <Button variant="filled" href="/contact" className="min-h-[58px] px-[32px]">
            Book Free Consultation
          </Button>
        </div>
      </Reveal>
    </main>
  );
}
