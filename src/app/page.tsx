import React from "react";
import type { Metadata } from "next";
import { EyebrowLabel } from "@/components/ui/EyebrowLabel";
import { Button } from "@/components/ui/Button";
import { ServiceCard } from "@/components/ui/ServiceCard";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { HomeContactForm } from "@/components/home/HomeContactForm";
import {
  supabase,
  Service,
  Project,
  getSiteContentMap,
  getSiteSettings,
  DEFAULT_SITE_CONTENT,
} from "@/lib/supabase";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    title: `${settings.site_title || "Horode Design Studio"} | Brand, Design & Software`,
    description: settings.meta_description,
  };
}

// Fallback seed data matching Milestone 1 static port
const defaultServices: Service[] = [
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

async function getServices(): Promise<Service[]> {
  try {
    if (
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder")
    ) {
      return defaultServices;
    }
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error || !data || data.length === 0) {
      return defaultServices;
    }
    return data;
  } catch {
    return defaultServices;
  }
}

async function getProjects(): Promise<Project[]> {
  try {
    if (
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder")
    ) {
      return defaultProjects;
    }
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("featured", true)
      .order("sort_order", { ascending: true });

    if (error || !data || data.length === 0) {
      return defaultProjects;
    }
    return data;
  } catch {
    return defaultProjects;
  }
}

export default async function Home() {
  const [services, projects, content] = await Promise.all([
    getServices(),
    getProjects(),
    getSiteContentMap(),
  ]);

  const heroHeadline = content.hero_headline || DEFAULT_SITE_CONTENT.hero_headline;
  const heroSubhead = content.hero_subhead || DEFAULT_SITE_CONTENT.hero_subhead;
  const heroCtaText = content.hero_cta_text || DEFAULT_SITE_CONTENT.hero_cta_text;
  const whoWeAreHeadline = content.who_we_are_headline || DEFAULT_SITE_CONTENT.who_we_are_headline;
  const whoWeAreText = content.who_we_are_text || DEFAULT_SITE_CONTENT.who_we_are_text;

  return (
    <main>
      {/* Hero Section */}
      <section
        className="hero section-shell relative grid grid-cols-[minmax(0,1fr)_520px] items-center min-h-[535px] mt-[38px] overflow-hidden rounded-[var(--radius-lg)] bg-[#fafafa] max-lg:grid-cols-1 max-lg:min-h-auto max-sm:mt-[18px] max-sm:rounded-[22px]"
        aria-labelledby="hero-title"
      >
        <div className="hero-copy max-w-[720px] pl-[54px] max-lg:p-[58px_36px_0] max-sm:p-[42px_24px_0]">
          <h1
            id="hero-title"
            className="max-w-[690px] m-0 mb-[28px] text-[#333337] text-[clamp(44px,4.1vw,72px)] max-sm:text-[42px] max-[430px]:text-[32px] font-bold leading-[1.08] tracking-normal"
          >
            {heroHeadline}
          </h1>
          <p className="max-w-[540px] m-0 mb-[36px] text-[#97979d] text-[18px] max-sm:text-[15px] leading-[1.28]">
            {heroSubhead}
          </p>
          <Button
            variant="outline"
            href="#contact"
            className="primary-button min-h-[72px] px-[30px] text-[18px] max-sm:min-h-[58px] max-sm:px-[22px] max-sm:text-[14px]"
          >
            {heroCtaText}
          </Button>
        </div>

        <div
          className="hero-visual relative self-stretch min-h-[535px] max-lg:min-h-[340px] max-sm:min-h-[285px]"
          aria-hidden="true"
        >
          <img
            src="/assets/hero-visual.png"
            alt=""
            className="absolute top-[34px] right-0 w-[482px] h-[672px] max-w-none block object-contain max-lg:top-[24px] max-lg:right-[24px] max-lg:w-[min(482px,calc(100vw-72px))] max-lg:h-auto max-sm:top-[18px] max-sm:right-[-18px] max-sm:w-[min(420px,calc(100vw-18px))]"
          />
        </div>
      </section>

      {/* Services Section */}
      <section
        className="services section-shell pt-[132px] max-sm:pt-[92px]"
        id="services"
        aria-labelledby="services-title"
      >
        <EyebrowLabel className="flex w-max mx-auto mb-[32px]">
          Our Services
        </EyebrowLabel>
        <h2
          id="services-title"
          className="max-w-[720px] mx-auto text-center text-[clamp(40px,4vw,64px)] max-sm:text-[38px] max-[430px]:text-[32px] font-medium leading-[1.1] tracking-normal"
        >
          The Systems Behind Your Next Level
        </h2>

        <div className="service-grid grid grid-cols-3 gap-[18px] mt-[52px] max-lg:grid-cols-1 max-sm:mt-[34px]">
          {services.map((service) => (
            <ServiceCard
              key={service.id || service.slug}
              title={service.name}
              description={service.one_liner || ""}
              href={`/services/${service.slug}`}
            />
          ))}
        </div>
      </section>

      {/* About Section */}
      <section
        className="about section-shell grid grid-cols-2 gap-[80px] pt-[180px] max-lg:grid-cols-1 max-lg:gap-[28px] max-sm:pt-[92px]"
        id="about"
        aria-labelledby="about-title"
      >
        <div>
          <EyebrowLabel className="mb-[26px]">Who We Are</EyebrowLabel>
          <h2
            id="about-title"
            className="m-0 text-[clamp(42px,4vw,63px)] max-sm:text-[38px] max-[430px]:text-[32px] font-medium leading-[1.08] tracking-normal"
          >
            {whoWeAreHeadline}
          </h2>
        </div>
        <div className="max-w-[560px] m-0 mt-[76px] ml-auto max-lg:m-0">
          <p className="m-0 mb-[24px] text-[#333337] text-[16px] leading-[1.55]">
            {whoWeAreText}
          </p>
          <a
            href="/about"
            className="text-[#222226] text-[13px] font-bold inline-flex items-center gap-1 hover:underline"
          >
            Learn more about our studio <span aria-hidden="true">&nearr;</span>
          </a>
        </div>
      </section>

      {/* Selected Works Section */}
      <section
        className="works section-shell pt-[172px] max-sm:pt-[92px]"
        id="works"
        aria-labelledby="works-title"
      >
        <EyebrowLabel className="mb-[28px]">Our Works</EyebrowLabel>
        <h2
          id="works-title"
          className="m-0 text-[clamp(42px,4vw,63px)] max-sm:text-[38px] max-[430px]:text-[32px] font-medium leading-[1.08] tracking-normal"
        >
          Selected Projects
        </h2>

        <div className="project-grid grid grid-cols-2 gap-[62px] mt-[38px] max-lg:grid-cols-1 max-sm:gap-[44px]">
          {projects.map((project) => (
            <ProjectCard
              key={project.id || project.slug}
              title={project.name}
              description={project.one_liner || ""}
              imageSrc={project.thumbnail_url || "/assets/zalyx-ledger.png"}
              imageAlt={project.name}
              tags={project.service_tags || []}
              href={`/work/${project.slug}`}
            />
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section
        className="contact section-shell pt-[285px] pb-[168px] max-sm:pt-[115px] max-sm:pb-[90px]"
        id="contact"
        aria-labelledby="contact-title"
      >
        <h2
          id="contact-title"
          className="max-w-[720px] mx-auto text-center text-[clamp(40px,4vw,64px)] max-sm:text-[38px] max-[430px]:text-[32px] font-medium leading-[1.1] tracking-normal"
        >
          Have a project in mind?{" "}
          <span className="block">Let's create greatness</span>
        </h2>

        <div className="contact-layout grid grid-cols-[440px_minmax(0,1fr)] gap-[90px] items-start mt-[72px] max-lg:grid-cols-1 max-lg:gap-[42px] max-sm:mt-[48px]">
          <aside className="next-step">
            <h3 className="m-0 mb-[26px] text-[24px] font-semibold">
              What next?
            </h3>
            <ol className="max-w-[390px] m-0 p-0 text-[#8b8b92] text-[14px] leading-[1.72] list-inside">
              <li>
                We will reach out to you within one business day to discuss the
                next steps.
              </li>
              <li>
                If necessary, we will sign the NDA and begin the project
                discussion.
              </li>
              <li>
                Our team of experts will analyze your requirements and make
                recommendations on the best ways to bring your concept to life.
              </li>
            </ol>
          </aside>

          <HomeContactForm />
        </div>
      </section>
    </main>
  );
}
