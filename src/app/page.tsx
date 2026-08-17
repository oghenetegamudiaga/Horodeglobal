"use client";

import React, { useState, useEffect } from "react";
import { EyebrowLabel } from "@/components/ui/EyebrowLabel";
import { Button } from "@/components/ui/Button";
import { ServiceCard } from "@/components/ui/ServiceCard";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { supabase, Service, Project } from "@/lib/supabase";

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

export default function Home() {
  const [formNote, setFormNote] = useState("");
  const [services, setServices] = useState<Service[]>(defaultServices);
  const [projects, setProjects] = useState<Project[]>(defaultProjects);

  useEffect(() => {
    async function loadData() {
      // Check if real Supabase URL is configured
      if (
        !process.env.NEXT_PUBLIC_SUPABASE_URL ||
        process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder")
      ) {
        return;
      }

      try {
        const [servicesRes, projectsRes] = await Promise.all([
          supabase.from("services").select("*").order("sort_order", { ascending: true }),
          supabase
            .from("projects")
            .select("*")
            .eq("featured", true)
            .order("sort_order", { ascending: true }),
        ]);

        if (servicesRes.data && servicesRes.data.length > 0) {
          setServices(servicesRes.data);
        }
        if (projectsRes.data && projectsRes.data.length > 0) {
          setProjects(projectsRes.data);
        }
      } catch (err) {
        console.warn("Supabase fetch fallback to local seed copy:", err);
      }
    }

    loadData();
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormNote("Thanks. Your request is ready to connect to a backend.");
  };

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
            We Build Brands That Refuse to Stay Small.
          </h1>
          <p className="max-w-[540px] m-0 mb-[36px] text-[#97979d] text-[18px] max-sm:text-[15px] leading-[1.28]">
            We combine strategy, design, and technology to help ambitious
            businesses grow into market leaders.
          </p>
          <Button
            variant="outline"
            href="#contact"
            className="primary-button min-h-[72px] px-[30px] text-[18px] max-sm:min-h-[58px] max-sm:px-[22px] max-sm:text-[14px]"
          >
            Book Free Consultation
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
              href={`#contact`}
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
            We Create Solutions We Build Systems,
          </h2>
        </div>
        <p className="max-w-[560px] m-0 mt-[76px] ml-auto text-[#333337] text-[16px] leading-[1.55] max-lg:m-0">
          We build digital foundations that help businesses grow with intention.
          From brand strategy and identity design to custom software and app
          development, every system we build is engineered to make your company
          visible, trusted, and infinitely scalable.
        </p>
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
          <span className="block">Let's creat greatness</span>
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

          <form
            className="contact-form p-[42px] border border-[var(--border)] rounded-[var(--radius-md)] bg-white max-sm:p-[20px] max-sm:rounded-[18px]"
            onSubmit={handleSubmit}
          >
            <label className="block mb-[18px]">
              <span className="sr-only">Full Name*</span>
              <input
                type="text"
                name="name"
                required
                placeholder="Full Name*"
                className="w-full h-[60px] px-[22px] border border-dashed border-[#d4d4d7] rounded-[10px] bg-white text-[#232327] text-[13px] outline-none placeholder-[#a0a0a6] focus:border-[#777] focus:ring-2 focus:ring-black/5 max-sm:h-[54px]"
              />
            </label>

            <label className="block mb-[18px]">
              <span className="sr-only">Email*</span>
              <input
                type="email"
                name="email"
                required
                placeholder="Email*"
                className="w-full h-[60px] px-[22px] border border-dashed border-[#d4d4d7] rounded-[10px] bg-white text-[#232327] text-[13px] outline-none placeholder-[#a0a0a6] focus:border-[#777] focus:ring-2 focus:ring-black/5 max-sm:h-[54px]"
              />
            </label>

            <label className="phone-field block mb-[18px]">
              <span className="sr-only">Phone</span>
              <input
                type="tel"
                name="phone"
                placeholder="🇺🇸  +1 Phone"
                className="w-full h-[60px] px-[22px] border border-dashed border-[#d4d4d7] rounded-[10px] bg-white text-[#232327] text-[13px] outline-none placeholder-[#a0a0a6] focus:border-[#777] focus:ring-2 focus:ring-black/5 max-sm:h-[54px]"
              />
            </label>

            <div className="form-row grid grid-cols-2 gap-[18px] mb-[18px] max-sm:grid-cols-1">
              <label className="block">
                <span className="sr-only">How did you hear about us</span>
                <select
                  name="source"
                  className="w-full h-[60px] px-[22px] border border-dashed border-[#d4d4d7] rounded-[10px] bg-white text-[#232327] text-[13px] outline-none text-[#a0a0a6] focus:border-[#777] focus:ring-2 focus:ring-black/5 max-sm:h-[54px]"
                >
                  <option value="">How did you hear about us</option>
                  <option>Instagram</option>
                  <option>Referral</option>
                  <option>Google Search</option>
                  <option>LinkedIn</option>
                </select>
              </label>

              <label className="block">
                <span className="sr-only">What is your budget</span>
                <select
                  name="budget"
                  className="w-full h-[60px] px-[22px] border border-dashed border-[#d4d4d7] rounded-[10px] bg-white text-[#232327] text-[13px] outline-none text-[#a0a0a6] focus:border-[#777] focus:ring-2 focus:ring-black/5 max-sm:h-[54px]"
                >
                  <option value="">What is your budget</option>
                  <option>$1,000 - $5,000</option>
                  <option>$5,000 - $10,000</option>
                  <option>$10,000+</option>
                </select>
              </label>
            </div>

            <label className="block mb-[18px]">
              <span className="sr-only">Message</span>
              <textarea
                name="message"
                rows={7}
                placeholder="Message"
                className="w-full min-h-[170px] p-[24px_22px] border border-dashed border-[#d4d4d7] rounded-[10px] bg-white text-[#232327] text-[13px] outline-none resize-y placeholder-[#a0a0a6] focus:border-[#777] focus:ring-2 focus:ring-black/5"
              ></textarea>
            </label>

            <div className="form-actions flex items-center justify-between gap-[18px] mt-[28px] max-sm:flex-col max-sm:items-start">
              <label className="file-link inline-flex items-center gap-[7px] text-[#9999a0] text-[13px] cursor-pointer">
                <input type="file" multiple className="hidden" />
                <span aria-hidden="true">◎</span> Attach files (2 Files max -
                5MB each)
              </label>
              <button
                className="submit-button tega-btn tega-btn-outline min-w-[112px] px-[23px] cursor-pointer"
                type="submit"
              >
                Submit
              </button>
            </div>

            {formNote && (
              <p
                className="form-note min-h-[18px] mt-[14px] mb-0 text-[#4f4f55] text-[12px]"
                aria-live="polite"
              >
                {formNote}
              </p>
            )}
          </form>
        </div>
      </section>
    </main>
  );
}
