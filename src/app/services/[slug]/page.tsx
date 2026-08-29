import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EyebrowLabel } from "@/components/ui/EyebrowLabel";
import { Button } from "@/components/ui/Button";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { Reveal } from "@/components/ui/Reveal";
import { supabase, Service, Project } from "@/lib/supabase";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Fallback rich content dictionary for pre-rendering / offline fallback
const richServiceDetails: Record<
  string,
  {
    deliverables: string[];
    process_steps: { title: string; description: string }[];
  }
> = {
  "branding-strategy": {
    deliverables: [
      "Brand Strategy & Positioning Framework",
      "Visual Identity Systems (Logo, Mark, Iconography)",
      "Typography & Color Palette System",
      "Comprehensive Brand Guidelines Document",
      "Digital & Print Marketing Assets Suite",
    ],
    process_steps: [
      {
        title: "1. Discovery & Market Audit",
        description:
          "We analyze your business goals, target audience, competitive landscape, and market opportunities to define your unique brand positioning.",
      },
      {
        title: "2. Core Brand Strategy",
        description:
          "We craft your brand narrative, core values, voice and tone, messaging pillars, and strategic positioning framework.",
      },
      {
        title: "3. Visual System Design",
        description:
          "We translate brand strategy into visual identity—exploring concepts for typography, color systems, logomarks, and visual motifs.",
      },
      {
        title: "4. Guidelines & Production Handoff",
        description:
          "We compile exhaustive brand guidelines and deliver production-ready vector assets optimized for web, social, and print.",
      },
    ],
  },
  "ui-ux-design": {
    deliverables: [
      "User Research & Journey Mapping",
      "Information Architecture & User Flows",
      "Interactive High-Fidelity Prototypes",
      "Design System & UI Component Library",
      "Usability Testing & UX Optimization Specs",
    ],
    process_steps: [
      {
        title: "1. Research & Experience Audit",
        description:
          "We conduct stakeholder interviews, audit existing product interfaces, and map out primary user personas and user journeys.",
      },
      {
        title: "2. Wireframing & UX Architecture",
        description:
          "We build wireframes to map user flows, layout structures, and navigation models, validating interaction patterns early.",
      },
      {
        title: "3. Design System & Interface Styling",
        description:
          "We build scalable UI design systems with reusable components, micro-animations, accessible color tokens, and visual polish.",
      },
      {
        title: "4. Interactive Testing & Dev Handoff",
        description:
          "We build clickable prototypes, conduct user testing, and deliver pixel-perfect Figma/CSS specs for developer implementation.",
      },
    ],
  },
  "software-app-dev": {
    deliverables: [
      "Custom Full-Stack Web Applications",
      "Mobile Applications (iOS & Android)",
      "REST & GraphQL API Architecture",
      "Database Modeling & Performance Tuning",
      "CI/CD Deployment & Cloud Hosting Setup",
    ],
    process_steps: [
      {
        title: "1. System Architecture & Tech Spec",
        description:
          "We scope system requirements, design relational data models, select optimal framework stacks, and map API contracts.",
      },
      {
        title: "2. Agile Sprint Engineering",
        description:
          "We write clean, modular, test-driven code across frontend user interfaces and backend server infrastructure in iterative sprints.",
      },
      {
        title: "3. Security & QA Testing",
        description:
          "We execute comprehensive security audits, unit and end-to-end testing, performance optimization, and cross-platform checks.",
      },
      {
        title: "4. Cloud Deployment & Scaling",
        description:
          "We configure continuous integration pipelines, deploy to high-availability cloud infrastructure, and monitor live runtime health.",
      },
    ],
  },
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

const fallbackServices: Service[] = [
  {
    id: "1",
    slug: "branding-strategy",
    name: "Branding & Strategy",
    one_liner:
      "We craft brand identities and positioning systems that make your business clear, premium, and impossible to ignore.",
    icon: null,
    image_url: null,
    sort_order: 1,
  },
  {
    id: "2",
    slug: "ui-ux-design",
    name: "UI/UX Design",
    one_liner:
      "We bring expertise in all stages of design, from research to polished prototypes.",
    icon: null,
    image_url: null,
    sort_order: 2,
  },
  {
    id: "3",
    slug: "software-app-dev",
    name: "Software & App Dev",
    one_liner:
      "We build scalable websites, web apps, and mobile applications tailored precisely to your business goals.",
    icon: null,
    image_url: null,
    sort_order: 3,
  },
];

export async function generateStaticParams() {
  try {
    if (
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder")
    ) {
      return fallbackServices.map((s) => ({ slug: s.slug }));
    }
    const { data } = await supabase.from("services").select("slug");
    if (data && data.length > 0) {
      return data.map((s) => ({ slug: s.slug }));
    }
    return fallbackServices.map((s) => ({ slug: s.slug }));
  } catch {
    return fallbackServices.map((s) => ({ slug: s.slug }));
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);

  if (!service) {
    return {
      title: "Service Not Found | Horode Design Studio",
    };
  }

  return {
    title: `${service.name} — Services | Horode Design Studio`,
    description:
      service.one_liner ||
      `Learn how Horode's ${service.name} services help ambitious businesses grow with strategic design and technology.`,
  };
}

async function getServiceBySlug(slug: string): Promise<Service | null> {
  try {
    if (
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder")
    ) {
      const { data } = await supabase
        .from("services")
        .select("*")
        .eq("slug", slug)
        .single();
      if (data) return data;
    }
  } catch {
    // fallback below
  }
  return fallbackServices.find((s) => s.slug === slug) || null;
}

async function getRelatedProjects(service: Service): Promise<Project[]> {
  try {
    if (
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder")
    ) {
      if (service.related_project_ids && service.related_project_ids.length > 0) {
        const { data } = await supabase
          .from("projects")
          .select("*")
          .in("id", service.related_project_ids);
        if (data && data.length > 0) return data;
      }
      const { data: featured } = await supabase
        .from("projects")
        .select("*")
        .eq("featured", true)
        .order("sort_order", { ascending: true })
        .limit(2);
      if (featured && featured.length > 0) return featured;
    }
  } catch {
    // fallback below
  }
  return defaultProjects;
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  const richContent = richServiceDetails[slug] || {
    deliverables: service.deliverables || [
      "Custom Strategy & Planning",
      "Professional Execution & Deliverables",
      "Quality Assurance & Support",
    ],
    process_steps: service.process_steps || [
      {
        title: "1. Discovery & Planning",
        description: "We analyze requirements and map out a clear execution plan.",
      },
      {
        title: "2. Design & Development",
        description: "We craft solution prototypes and iterate based on feedback.",
      },
      {
        title: "3. Review & Refinement",
        description: "We test thoroughly to ensure quality, performance, and compliance.",
      },
      {
        title: "4. Delivery & Launch",
        description: "We deploy final assets and provide continuous support.",
      },
    ],
  };

  const relatedProjects = await getRelatedProjects(service);

  return (
    <main className="py-[60px] max-sm:py-[36px]">
      {/* Header Section */}
      <Reveal as="section" className="service-detail-header section-shell">
        <EyebrowLabel className="mb-[24px]">Service Overview</EyebrowLabel>
        <h1 className="max-w-[780px] m-0 text-[clamp(44px,4.5vw,68px)] max-sm:text-[38px] max-[430px]:text-[32px] font-bold text-[#333337] leading-[1.08]">
          {service.name}
        </h1>
        <p className="max-w-[640px] mt-[24px] mb-0 text-[#97979d] text-[19px] max-sm:text-[16px] leading-[1.45]">
          {service.one_liner}
        </p>
      </Reveal>

      {/* Deliverables Section */}
      <Reveal as="section" className="deliverables-section section-shell pt-[90px] max-sm:pt-[60px]">
        <div className="p-[54px] border border-[var(--border)] rounded-[var(--radius-lg)] bg-[#fafafa] max-sm:p-[28px]">
          <h2 className="m-0 mb-[32px] text-[28px] max-sm:text-[22px] font-bold text-[#25252a]">
            What We Deliver
          </h2>
          <div className="grid grid-cols-2 gap-[24px] max-lg:grid-cols-1">
            {richContent.deliverables.map((item, idx) => (
              <Reveal key={idx} delay={idx * 0.06}>
                <div className="flex items-start gap-[14px] p-[20px] bg-white border border-[var(--border)] rounded-[14px] h-full">
                  <span className="inline-flex items-center justify-center w-[26px] h-[26px] rounded-full bg-[#111111] text-white text-[12px] font-bold shrink-0 mt-[2px]">
                    ✓
                  </span>
                  <span className="text-[#323236] text-[15px] font-medium leading-[1.4]">
                    {item}
                  </span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Reveal>

      {/* Process Steps Section */}
      <Reveal as="section" className="process-section section-shell pt-[110px] max-sm:pt-[70px]">
        <EyebrowLabel className="mb-[24px]">Our Approach</EyebrowLabel>
        <h2 className="m-0 mb-[52px] text-[clamp(36px,3.8vw,54px)] max-sm:text-[32px] font-medium text-[#25252a]">
          How We Build Systems
        </h2>

        <div className="grid grid-cols-2 gap-[28px] max-lg:grid-cols-1">
          {richContent.process_steps.map((step, idx) => (
            <Reveal key={idx} delay={idx * 0.08}>
              <div className="p-[38px] border border-[var(--border)] rounded-[var(--radius-md)] bg-white max-sm:p-[26px] h-full">
                <h3 className="m-0 mb-[14px] text-[22px] font-semibold text-[#25252a]">
                  {step.title}
                </h3>
                <p className="m-0 text-[#8c8c93] text-[15px] leading-[1.6]">
                  {step.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Reveal>

      {/* Related Projects Section */}
      {relatedProjects.length > 0 && (
        <Reveal as="section" className="related-projects-section section-shell pt-[120px] max-sm:pt-[80px]">
          <EyebrowLabel className="mb-[24px]">Related Work</EyebrowLabel>
          <h2 className="m-0 mb-[48px] text-[clamp(36px,3.8vw,54px)] max-sm:text-[32px] font-medium text-[#25252a]">
            Projects Built With This Capability
          </h2>

          <div className="project-grid grid grid-cols-2 gap-[62px] max-lg:grid-cols-1 max-sm:gap-[44px]">
            {relatedProjects.map((project, index) => (
              <Reveal key={project.id || project.slug} delay={index * 0.1}>
                <ProjectCard
                  title={project.name}
                  description={project.one_liner || ""}
                  imageSrc={project.thumbnail_url || "/assets/zalyx-ledger.png"}
                  imageAlt={project.name}
                  tags={project.service_tags || []}
                />
              </Reveal>
            ))}
          </div>
        </Reveal>
      )}

      {/* Contextual CTA Section */}
      <Reveal as="section" className="service-detail-cta section-shell pt-[130px] pb-[40px] text-center max-sm:pt-[90px]">
        <div className="max-w-[760px] mx-auto p-[64px_36px] border border-[var(--border)] rounded-[var(--radius-lg)] bg-[#fafafa] max-sm:p-[42px_24px]">
          <h2 className="m-0 text-[clamp(32px,3.5vw,48px)] font-bold text-[#25252a] leading-[1.15]">
            Have a {service.name} Project?
          </h2>
          <p className="max-w-[520px] mx-auto mt-[18px] mb-[36px] text-[#8c8c93] text-[15px] leading-[1.5]">
            Let's discuss how our {service.name.toLowerCase()} process can bring
            clarity, structure, and scale to your business.
          </p>
          <Button
            variant="filled"
            href={`/contact?service=${slug}`}
            className="min-h-[58px] px-[32px]"
          >
            Book Free Consultation
          </Button>
        </div>
      </Reveal>
    </main>
  );
}
