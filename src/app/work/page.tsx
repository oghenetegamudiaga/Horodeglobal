import React from "react";
import type { Metadata } from "next";
import { EyebrowLabel } from "@/components/ui/EyebrowLabel";
import { Button } from "@/components/ui/Button";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { Reveal } from "@/components/ui/Reveal";
import { supabase, Project, getSiteContentMap, DEFAULT_SITE_CONTENT } from "@/lib/supabase";

export const metadata: Metadata = {
  title: "Selected Works | Horode Design Studio",
  description:
    "Explore our portfolio of selected brand identity systems, product design initiatives, and custom software platforms built for ambitious companies.",
};

const defaultProjects: Project[] = [
  {
    id: "1",
    slug: "zalyx-ledger",
    name: "Zalyx Ledger",
    one_liner:
      "Zalyx Ledger help African business owners manage and track their business records seamlessly.",
    service_tags: ["Branding Services", "Product Design", "Social Media Design"],
    thumbnail_url: "/assets/zalyx-ledger.png",
    featured: true,
    sort_order: 1,
  },
  {
    id: "2",
    slug: "ravex",
    name: "Ravex",
    one_liner: "A fintech product that help users easily pay utility bills",
    service_tags: ["Branding Services", "Social Media Design"],
    thumbnail_url: "/assets/ravex.png",
    featured: true,
    sort_order: 2,
  },
];

async function getProjects(): Promise<Project[]> {
  try {
    if (
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder")
    ) {
      console.warn("[Supabase] NEXT_PUBLIC_SUPABASE_URL unconfigured, using defaultProjects fallback.");
      return defaultProjects;
    }
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) {
      console.error("[Supabase Error] getProjects query failed:", error.message);
      return [];
    }
    return data || [];
  } catch (err: unknown) {
    console.error("[Supabase Exception] getProjects error:", err instanceof Error ? err.message : err);
    return [];
  }
}

export default async function WorksPage() {
  const [projects, content] = await Promise.all([
    getProjects(),
    getSiteContentMap(),
  ]);

  const introEyebrow = content.works_intro_eyebrow || DEFAULT_SITE_CONTENT.works_intro_eyebrow;
  const introHeading = content.works_intro_heading || DEFAULT_SITE_CONTENT.works_intro_heading;
  const introSubhead = content.works_intro_subhead || DEFAULT_SITE_CONTENT.works_intro_subhead;
  const ctaTitle = content.works_cta_title || DEFAULT_SITE_CONTENT.works_cta_title;
  const ctaText = content.works_cta_text || DEFAULT_SITE_CONTENT.works_cta_text;

  return (
    <main className="py-[60px] max-sm:py-[36px]">
      {/* Header Section */}
      <Reveal as="section" className="works-header section-shell text-left">
        <EyebrowLabel className="mb-[28px]">{introEyebrow}</EyebrowLabel>
        <h1 className="max-w-[840px] m-0 text-[clamp(44px,4.5vw,72px)] max-sm:text-[42px] max-[430px]:text-[32px] font-bold leading-[1.08] text-[#333337] tracking-normal">
          {introHeading}
        </h1>
        <p className="max-w-[620px] mt-[24px] mb-0 text-[#97979d] text-[18px] max-sm:text-[15px] leading-[1.4]">
          {introSubhead}
        </p>
      </Reveal>

      {/* Projects Grid */}
      <Reveal as="section" className="works-grid-section section-shell pt-[60px] max-sm:pt-[40px]">
        <div className="project-grid grid grid-cols-2 gap-[62px] max-lg:grid-cols-1 max-sm:gap-[44px]">
          {projects.map((project, index) => (
            <Reveal key={project.id || project.slug} delay={index * 0.1}>
              <ProjectCard
                title={project.name}
                description={project.one_liner || ""}
                imageSrc={project.thumbnail_url || "/assets/zalyx-ledger.png"}
                imageAlt={project.name}
                tags={project.service_tags || []}
                href={`/work/${project.slug}`}
              />
            </Reveal>
          ))}
        </div>
      </Reveal>

      {/* CTA Section */}
      <Reveal as="section" className="works-cta section-shell pt-[140px] pb-[60px] text-center max-sm:pt-[90px]">
        <div className="max-w-[760px] mx-auto p-[64px_36px] border border-[var(--border)] rounded-[var(--radius-lg)] bg-[#fafafa] max-sm:p-[42px_24px]">
          <h2 className="m-0 text-[clamp(32px,3.5vw,48px)] font-bold text-[#25252a] leading-[1.15]">
            {ctaTitle}
          </h2>
          <p className="max-w-[500px] mx-auto mt-[18px] mb-[36px] text-[#8c8c93] text-[15px] leading-[1.5]">
            {ctaText}
          </p>
          <Button variant="filled" href="/contact" className="min-h-[58px] px-[32px]">
            Start Your Project
          </Button>
        </div>
      </Reveal>
    </main>
  );
}
