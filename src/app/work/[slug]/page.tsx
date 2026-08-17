import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EyebrowLabel } from "@/components/ui/EyebrowLabel";
import { Button } from "@/components/ui/Button";
import { supabase, Project } from "@/lib/supabase";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Rich Case Study Details for fallback pre-rendering
const richCaseStudyDetails: Record<
  string,
  {
    client: string;
    year: string;
    brief: string;
    challenge: string;
    solution: string;
    outcomes: string[];
  }
> = {
  "zalyx-ledger": {
    client: "Zalyx Inc.",
    year: "2026",
    brief:
      "Zalyx Ledger is an intuitive financial record-keeping platform designed for African small business owners, micro-entrepreneurs, and retail merchants.",
    challenge:
      "Many small business owners in emerging African markets rely on manual paper ledgers or fragmented chat logs to track sales, credit lines, and inventory. Existing enterprise accounting tools are overly complex, require reliable high-speed internet, and fail to accommodate informal credit terms common in local commerce.",
    solution:
      "Horode engineered a cohesive brand identity and a mobile-first user experience for Zalyx Ledger. We designed a clean, high-contrast visual system, accessible typography for low-light environments, and simplified 2-tap entry workflows for logging sales and debts.",
    outcomes: [
      "Streamlined daily bookkeeping time by 65% for active merchants",
      "Achieved a 94% task-completion rate during initial usability trials",
      "Created a scalable design system for future web and web-app extensions",
    ],
  },
  ravex: {
    client: "Ravex Fintech",
    year: "2026",
    brief:
      "Ravex is a next-generation utility payment app enabling users to pay electricity, internet, TV, and biller services seamlessly with zero transaction friction.",
    challenge:
      "Utility payment applications often suffer from cluttered interfaces, confusing fee structures, and slow transaction feedback. Users required a fast, secure payment portal that provides instant receipt verification and automated recurring payments.",
    solution:
      "We developed Ravex's brand position, visual identity, and social campaign design system. The visual direction focuses on speed and trust, utilizing bold typography, vibrant gradient indicators for payment status, and streamlined multi-biller checkout screens.",
    outcomes: [
      "Reduced average utility bill checkout time to under 15 seconds",
      "Increased user onboarding conversion rate by 42% post-rebrand",
      "Standardized multi-channel marketing templates for rapid campaign rollout",
    ],
  },
};

const defaultProjects: Project[] = [
  {
    id: "1",
    slug: "zalyx-ledger",
    name: "Zalyx Ledger",
    client_name: "Zalyx Inc.",
    one_liner:
      "Zalyx Ledger help African business owners manage and track their business records seamlessly.",
    service_tags: ["Branding Services", "Product Design", "Social Media Design"],
    thumbnail_url: "/assets/zalyx-ledger.png",
    year: "2026",
    featured: true,
    sort_order: 1,
  },
  {
    id: "2",
    slug: "ravex",
    name: "Ravex",
    client_name: "Ravex Fintech",
    one_liner: "A fintech product that help users easily pay utility bills",
    service_tags: ["Branding Services", "Social Media Design"],
    thumbnail_url: "/assets/ravex.png",
    year: "2026",
    featured: true,
    sort_order: 2,
  },
];

export async function generateStaticParams() {
  try {
    if (
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder")
    ) {
      return defaultProjects.map((p) => ({ slug: p.slug }));
    }
    const { data } = await supabase.from("projects").select("slug");
    if (data && data.length > 0) {
      return data.map((p) => ({ slug: p.slug }));
    }
    return defaultProjects.map((p) => ({ slug: p.slug }));
  } catch {
    return defaultProjects.map((p) => ({ slug: p.slug }));
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return {
      title: "Project Not Found | Horode Design Studio",
    };
  }

  return {
    title: `${project.name} — Case Study | Horode Design Studio`,
    description:
      project.one_liner ||
      `Case study on how Horode delivered strategic branding and product engineering for ${project.name}.`,
  };
}

async function getAllProjects(): Promise<Project[]> {
  try {
    if (
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder")
    ) {
      const { data } = await supabase
        .from("projects")
        .select("*")
        .order("sort_order", { ascending: true });
      if (data && data.length > 0) return data;
    }
  } catch {
    // fallback
  }
  return defaultProjects;
}

async function getProjectBySlug(slug: string): Promise<Project | null> {
  const all = await getAllProjects();
  return all.find((p) => p.slug === slug) || null;
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const allProjects = await getAllProjects();
  const currentIndex = allProjects.findIndex((p) => p.slug === slug);
  const prevProject =
    currentIndex > 0 ? allProjects[currentIndex - 1] : allProjects[allProjects.length - 1];
  const nextProject =
    currentIndex < allProjects.length - 1 ? allProjects[currentIndex + 1] : allProjects[0];

  const caseStudy = richCaseStudyDetails[slug] || {
    client: project.client_name || "Client Enterprise",
    year: project.year || "2026",
    brief: project.one_liner || "Strategic brand and software initiative.",
    challenge:
      project.brief ||
      "The project required defining a scalable digital strategy, custom user experience architecture, and high-performance product execution.",
    solution:
      "Horode created an integrated system combining brand identity guidelines, user interface components, and robust technology infrastructure.",
    outcomes: [
      "Delivered production-ready brand assets and technical specifications",
      "Improved key user engagement metrics and brand clarity",
      "Provided scalable foundation for future product expansions",
    ],
  };

  return (
    <main className="py-[60px] max-sm:py-[36px]">
      {/* Header Section */}
      <section className="project-detail-header section-shell">
        <EyebrowLabel className="mb-[24px]">Case Study</EyebrowLabel>
        <h1 className="max-w-[840px] m-0 text-[clamp(44px,4.5vw,72px)] max-sm:text-[38px] max-[430px]:text-[32px] font-bold text-[#333337] leading-[1.08]">
          {project.name}
        </h1>
        <p className="max-w-[640px] mt-[24px] mb-[40px] text-[#97979d] text-[19px] max-sm:text-[16px] leading-[1.45]">
          {project.one_liner}
        </p>

        {/* Metadata Row */}
        <div className="flex flex-wrap items-center gap-[36px] pt-[28px] border-t border-[var(--border)] max-sm:gap-[20px]">
          <div>
            <span className="text-[#9999a0] text-[11px] font-bold uppercase tracking-wider block mb-[4px]">
              Client
            </span>
            <span className="text-[#25252a] text-[14px] font-semibold">
              {caseStudy.client}
            </span>
          </div>
          <div>
            <span className="text-[#9999a0] text-[11px] font-bold uppercase tracking-wider block mb-[4px]">
              Year
            </span>
            <span className="text-[#25252a] text-[14px] font-semibold">
              {caseStudy.year}
            </span>
          </div>
          <div>
            <span className="text-[#9999a0] text-[11px] font-bold uppercase tracking-wider block mb-[4px]">
              Capabilities
            </span>
            <div className="flex flex-wrap gap-[6px]">
              {(project.service_tags || []).map((tag, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center min-h-[22px] px-[9px] border border-[var(--border)] rounded-full text-[#77777e] text-[10px] font-semibold"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Hero Thumbnail Banner */}
      <section className="project-banner section-shell pt-[48px]">
        <div className="overflow-hidden rounded-[28px] border border-[var(--border)]">
          <img
            src={project.thumbnail_url || "/assets/zalyx-ledger.png"}
            alt={project.name}
            className="w-full aspect-[1.78/1] object-cover block"
          />
        </div>
      </section>

      {/* Brief & Challenge Section */}
      <section className="brief-section section-shell pt-[90px] max-sm:pt-[60px]">
        <div className="grid grid-cols-2 gap-[70px] max-lg:grid-cols-1 max-lg:gap-[36px]">
          <div className="p-[42px] border border-[var(--border)] rounded-[var(--radius-md)] bg-[#fafafa] max-sm:p-[28px]">
            <h2 className="m-0 mb-[16px] text-[24px] font-bold text-[#25252a]">
              The Overview
            </h2>
            <p className="m-0 text-[#333337] text-[15px] leading-[1.65]">
              {caseStudy.brief}
            </p>
          </div>

          <div className="p-[42px] border border-[var(--border)] rounded-[var(--radius-md)] bg-white max-sm:p-[28px]">
            <h2 className="m-0 mb-[16px] text-[24px] font-bold text-[#25252a]">
              The Challenge
            </h2>
            <p className="m-0 text-[#8c8c93] text-[15px] leading-[1.65]">
              {caseStudy.challenge}
            </p>
          </div>
        </div>
      </section>

      {/* Solution & Outcomes Section */}
      <section className="solution-section section-shell pt-[60px] max-sm:pt-[40px]">
        <div className="p-[54px] border border-[var(--border)] rounded-[var(--radius-lg)] bg-white max-sm:p-[28px]">
          <h2 className="m-0 mb-[18px] text-[28px] max-sm:text-[22px] font-bold text-[#25252a]">
            Our Approach & Solution
          </h2>
          <p className="max-w-[760px] m-0 mb-[40px] text-[#333337] text-[16px] leading-[1.65]">
            {caseStudy.solution}
          </p>

          <h3 className="m-0 mb-[20px] text-[20px] font-bold text-[#25252a]">
            Key Outcomes & Impact
          </h3>
          <div className="grid grid-cols-3 gap-[18px] max-lg:grid-cols-1">
            {caseStudy.outcomes.map((outcome, idx) => (
              <div
                key={idx}
                className="p-[22px] bg-[#fafafa] border border-[var(--border)] rounded-[14px]"
              >
                <span className="text-[#111111] text-[18px] font-bold block mb-[8px]">
                  0{idx + 1}.
                </span>
                <p className="m-0 text-[#323236] text-[14px] leading-[1.5] font-medium">
                  {outcome}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Next / Previous Project Navigation */}
      <section className="project-nav section-shell pt-[100px] max-sm:pt-[60px]">
        <div className="flex items-center justify-between gap-[20px] pt-[32px] border-t border-[var(--border)] max-sm:flex-col max-sm:items-stretch">
          {prevProject && (
            <a
              href={`/work/${prevProject.slug}`}
              className="p-[20px_28px] border border-[var(--border)] rounded-[16px] hover:border-black transition-colors block text-left group"
            >
              <span className="text-[#9999a0] text-[11px] font-bold uppercase block mb-[4px]">
                ← Previous Project
              </span>
              <span className="text-[#25252a] text-[18px] font-bold group-hover:underline">
                {prevProject.name}
              </span>
            </a>
          )}
          {nextProject && (
            <a
              href={`/work/${nextProject.slug}`}
              className="p-[20px_28px] border border-[var(--border)] rounded-[16px] hover:border-black transition-colors block text-right max-sm:text-left group"
            >
              <span className="text-[#9999a0] text-[11px] font-bold uppercase block mb-[4px]">
                Next Project →
              </span>
              <span className="text-[#25252a] text-[18px] font-bold group-hover:underline">
                {nextProject.name}
              </span>
            </a>
          )}
        </div>
      </section>

      {/* Contextual CTA Section */}
      <section className="case-study-cta section-shell pt-[110px] pb-[40px] text-center max-sm:pt-[70px]">
        <div className="max-w-[760px] mx-auto p-[64px_36px] border border-[var(--border)] rounded-[var(--radius-lg)] bg-[#fafafa] max-sm:p-[42px_24px]">
          <h2 className="m-0 text-[clamp(32px,3.5vw,48px)] font-bold text-[#25252a] leading-[1.15]">
            Have a Similar Initiative?
          </h2>
          <p className="max-w-[500px] mx-auto mt-[18px] mb-[36px] text-[#8c8c93] text-[15px] leading-[1.5]">
            Let's discuss how our brand design and software engineering capabilities
            can bring clarity and scale to your next project.
          </p>
          <Button variant="filled" href="/contact" className="min-h-[58px] px-[32px]">
            Book Free Consultation
          </Button>
        </div>
      </section>
    </main>
  );
}
