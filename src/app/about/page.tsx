import React from "react";
import type { Metadata } from "next";
import { EyebrowLabel } from "@/components/ui/EyebrowLabel";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { getSiteContentMap, DEFAULT_SITE_CONTENT } from "@/lib/supabase";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "About Us | Horode Design Studio",
  description:
    "Learn about Horode Design Studio — our story, working principles, system-driven philosophy, and mission to build brands that refuse to stay small.",
};

export default async function AboutPage() {
  const content = await getSiteContentMap();

  const heroTitle = content.about_hero_title || DEFAULT_SITE_CONTENT.about_hero_title;
  const heroSubhead = content.about_hero_subhead || DEFAULT_SITE_CONTENT.about_hero_subhead;
  const philosophyTitle = content.about_philosophy_title || DEFAULT_SITE_CONTENT.about_philosophy_title;
  const storyRaw = content.about_story || DEFAULT_SITE_CONTENT.about_story;
  const storyParagraphs = typeof storyRaw === "string" ? storyRaw.split("\n\n").filter(Boolean) : [storyRaw];
  const values = Array.isArray(content.about_values) ? content.about_values : DEFAULT_SITE_CONTENT.about_values;

  return (
    <main className="py-[60px] max-sm:py-[36px]">
      {/* Header Section */}
      <Reveal as="section" className="about-header section-shell">
        <EyebrowLabel className="mb-[26px]">Who We Are</EyebrowLabel>
        <h1 className="max-w-[840px] m-0 text-[clamp(44px,4.5vw,72px)] max-sm:text-[42px] max-[430px]:text-[32px] font-bold text-[#333337] leading-[1.08] tracking-normal">
          {heroTitle}
        </h1>
        <p className="max-w-[640px] mt-[24px] mb-0 text-[#97979d] text-[19px] max-sm:text-[16px] leading-[1.45]">
          {heroSubhead}
        </p>
      </Reveal>

      {/* Brand Story Section */}
      <Reveal as="section" className="story-section section-shell pt-[100px] max-sm:pt-[60px]">
        <div className="grid grid-cols-2 gap-[80px] p-[60px] border border-[var(--border)] rounded-[var(--radius-lg)] bg-[#fafafa] max-lg:grid-cols-1 max-lg:gap-[36px] max-sm:p-[28px]">
          <div>
            <span className="text-[#8c8c93] text-[13px] font-semibold uppercase tracking-wider block mb-[12px]">
              Our Philosophy
            </span>
            <h2 className="m-0 text-[clamp(32px,3.2vw,48px)] font-bold text-[#25252a] leading-[1.12]">
              {philosophyTitle}
            </h2>
          </div>
          <div className="space-y-[20px] text-[#333337] text-[16px] leading-[1.6]">
            {storyParagraphs.map((paragraph: string, idx: number) => (
              <p key={idx} className="m-0">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </Reveal>

      {/* Working Principles Section */}
      <Reveal as="section" className="principles-section section-shell pt-[120px] max-sm:pt-[80px]">
        <EyebrowLabel className="mb-[24px]">Core Values</EyebrowLabel>
        <h2 className="m-0 mb-[52px] text-[clamp(36px,3.8vw,54px)] max-sm:text-[32px] font-medium text-[#25252a]">
          How We Work
        </h2>

        <div className="grid grid-cols-2 gap-[24px] max-lg:grid-cols-1">
          {values.map((item: any, idx: number) => (
            <Reveal key={item.number || idx} delay={idx * 0.08}>
              <div className="p-[42px] border border-[var(--border)] rounded-[var(--radius-md)] bg-white max-sm:p-[28px] h-full">
                <span className="text-[#9999a0] text-[14px] font-bold block mb-[16px]">
                  {item.number || `0${idx + 1}`}
                </span>
                <h3 className="m-0 mb-[12px] text-[22px] font-semibold text-[#25252a]">
                  {item.title}
                </h3>
                <p className="m-0 text-[#8c8c93] text-[15px] leading-[1.6]">
                  {item.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Reveal>

      {/* Team / Leadership Section */}
      <Reveal as="section" className="team-section section-shell pt-[120px] max-sm:pt-[80px]">
        <EyebrowLabel className="mb-[24px]">Leadership</EyebrowLabel>
        <h2 className="m-0 mb-[52px] text-[clamp(36px,3.8vw,54px)] max-sm:text-[32px] font-medium text-[#25252a]">
          The Minds Behind Horode
        </h2>

        <div className="grid grid-cols-2 gap-[32px] max-lg:grid-cols-1">
          {/* Founder Profile */}
          <Reveal delay={0}>
            <div className="p-[42px] border border-[var(--border)] rounded-[var(--radius-md)] bg-white flex flex-col justify-between max-sm:p-[28px] h-full">
              <div>
                <div className="w-[56px] h-[56px] rounded-full bg-[#111111] text-white flex items-center justify-center font-bold text-[18px] mb-[24px]">
                  T
                </div>
                <h3 className="m-0 text-[24px] font-bold text-[#25252a]">
                  Oghenetegamudiaga (Tega)
                </h3>
                <span className="text-[#8c8c93] text-[14px] font-medium block mt-[4px] mb-[18px]">
                  Founder & Lead Systems Architect
                </span>
                <p className="m-0 text-[#333337] text-[15px] leading-[1.6]">
                  Tega leads brand strategy and software architecture at Horode, bringing
                  a unified engineering approach to design systems, digital
                  infrastructure, and scalable web/mobile products.
                </p>
              </div>
            </div>
          </Reveal>

          {/* Team Placeholder */}
          <Reveal delay={0.1}>
            <div className="p-[42px] border border-[var(--border)] rounded-[var(--radius-md)] bg-white flex flex-col justify-between max-sm:p-[28px] h-full">
              <div>
                <div className="w-[56px] h-[56px] rounded-full bg-[#fafafa] border border-[var(--border)] text-[#111111] flex items-center justify-center font-bold text-[18px] mb-[24px]">
                  H
                </div>
                <h3 className="m-0 text-[24px] font-bold text-[#25252a]">
                  Studio Specialists
                </h3>
                <span className="text-[#8c8c93] text-[14px] font-medium block mt-[4px] mb-[18px]">
                  Design & Engineering Network
                </span>
                <p className="m-0 text-[#333337] text-[15px] leading-[1.6]">
                  A multi-disciplinary team of brand strategists, UI/UX designers, and
                  software engineers collaborating to execute complex client initiatives
                  with speed and precision.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </Reveal>

      {/* Closing CTA Section */}
      <Reveal as="section" className="about-cta section-shell pt-[130px] pb-[40px] text-center max-sm:pt-[90px]">
        <div className="max-w-[760px] mx-auto p-[64px_36px] border border-[var(--border)] rounded-[var(--radius-lg)] bg-[#fafafa] max-sm:p-[42px_24px]">
          <h2 className="m-0 text-[clamp(32px,3.5vw,48px)] font-bold text-[#25252a] leading-[1.15]">
            Let's Create Greatness Together
          </h2>
          <p className="max-w-[520px] mx-auto mt-[18px] mb-[36px] text-[#8c8c93] text-[15px] leading-[1.5]">
            Whether you are launching a new company or scaling an established product,
            we are ready to engineer your digital foundation.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-[16px]">
            <Button variant="filled" href="/contact" className="min-h-[58px] px-[32px]">
              Book Free Consultation
            </Button>
            <Button variant="outline" href="#works" className="min-h-[58px] px-[32px]">
              View Selected Works
            </Button>
          </div>
        </div>
      </Reveal>
    </main>
  );
}
