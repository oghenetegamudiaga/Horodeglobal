import React from "react";
import type { Metadata } from "next";
import { EyebrowLabel } from "@/components/ui/EyebrowLabel";
import { Button } from "@/components/ui/Button";
import { ServiceCard } from "@/components/ui/ServiceCard";
import { Reveal } from "@/components/ui/Reveal";
import { supabase, Service } from "@/lib/supabase";

export const metadata: Metadata = {
  title: "Our Services | Horode Design Studio",
  description:
    "Explore our strategic branding, UI/UX design, and custom software & app development services built to make your business visible, trusted, and scalable.",
};

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

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <main className="py-[60px] max-sm:py-[36px]">
      {/* Header Section */}
      <Reveal as="section" className="services-header section-shell text-center">
        <EyebrowLabel className="flex w-max mx-auto mb-[32px]">
          Our Services
        </EyebrowLabel>
        <h1 className="max-w-[840px] mx-auto m-0 text-[clamp(44px,4.5vw,72px)] max-sm:text-[42px] max-[430px]:text-[32px] font-bold leading-[1.08] text-[#333337] tracking-normal">
          The Systems Behind Your Next Level
        </h1>
        <p className="max-w-[620px] mx-auto mt-[24px] mb-0 text-[#97979d] text-[18px] max-sm:text-[15px] leading-[1.4]">
          We combine brand strategy, user experience design, and custom technology
          engineering to build foundations that scale with intention.
        </p>
      </Reveal>

      {/* Services Grid */}
      <Reveal as="section" className="services-grid-section section-shell pt-[72px] max-sm:pt-[48px]">
        <div className="service-grid grid grid-cols-3 gap-[18px] max-lg:grid-cols-1">
          {services.map((service, index) => (
            <Reveal key={service.id || service.slug} delay={index * 0.1}>
              <ServiceCard
                title={service.name}
                description={service.one_liner || ""}
                href={`/services/${service.slug}`}
              />
            </Reveal>
          ))}
        </div>
      </Reveal>

      {/* CTA Section */}
      <Reveal as="section" className="services-cta section-shell pt-[140px] pb-[60px] text-center max-sm:pt-[90px]">
        <div className="max-w-[720px] mx-auto p-[64px_36px] border border-[var(--border)] rounded-[var(--radius-lg)] bg-[#fafafa] max-sm:p-[42px_24px]">
          <h2 className="m-0 text-[clamp(32px,3.5vw,48px)] font-bold text-[#25252a] leading-[1.15]">
            Ready to Build Your System?
          </h2>
          <p className="max-w-[500px] mx-auto mt-[18px] mb-[36px] text-[#8c8c93] text-[15px] leading-[1.5]">
            Let's discuss how our strategic design and engineering capabilities
            can help transform your business ideas into market leaders.
          </p>
          <Button variant="filled" href="/contact" className="min-h-[58px] px-[32px]">
            Book Free Consultation
          </Button>
        </div>
      </Reveal>
    </main>
  );
}
