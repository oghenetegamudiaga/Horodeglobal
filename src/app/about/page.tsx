import React from "react";
import type { Metadata } from "next";
import { EyebrowLabel } from "@/components/ui/EyebrowLabel";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "About Us | Horode Design Studio",
  description:
    "Learn about Horode Design Studio — our story, working principles, system-driven philosophy, and mission to build brands that refuse to stay small.",
};

const workingPrinciples = [
  {
    number: "01",
    title: "Systemic Thinking",
    description:
      "We build reusable design systems and modular codebase architectures rather than short-term fixes. Every asset is engineered to scale with your business.",
  },
  {
    number: "02",
    title: "Uncompromising Craftsmanship",
    description:
      "Every typographic detail, layout grid, micro-interaction, and backend endpoint is crafted with rigorous standards for clarity and performance.",
  },
  {
    number: "03",
    title: "Direct Collaboration",
    description:
      "We work side-by-side with founders and executive teams as long-term strategic partners, maintaining clear, transparent feedback loops.",
  },
  {
    number: "04",
    title: "Measurable Impact",
    description:
      "Design and code are means to an end — driving user trust, market positioning, and sustainable enterprise revenue growth.",
  },
];

export default function AboutPage() {
  return (
    <main className="py-[60px] max-sm:py-[36px]">
      {/* Header Section */}
      <section className="about-header section-shell">
        <EyebrowLabel className="mb-[26px]">Who We Are</EyebrowLabel>
        <h1 className="max-w-[840px] m-0 text-[clamp(44px,4.5vw,72px)] max-sm:text-[42px] max-[430px]:text-[32px] font-bold text-[#333337] leading-[1.08] tracking-normal">
          We Create Solutions, We Build Systems.
        </h1>
        <p className="max-w-[640px] mt-[24px] mb-0 text-[#97979d] text-[19px] max-sm:text-[16px] leading-[1.45]">
          We combine strategy, design, and technology to help ambitious businesses
          grow into market leaders.
        </p>
      </section>

      {/* Brand Story Section */}
      <section className="story-section section-shell pt-[100px] max-sm:pt-[60px]">
        <div className="grid grid-cols-2 gap-[80px] p-[60px] border border-[var(--border)] rounded-[var(--radius-lg)] bg-[#fafafa] max-lg:grid-cols-1 max-lg:gap-[36px] max-sm:p-[28px]">
          <div>
            <span className="text-[#8c8c93] text-[13px] font-semibold uppercase tracking-wider block mb-[12px]">
              Our Philosophy
            </span>
            <h2 className="m-0 text-[clamp(32px,3.2vw,48px)] font-bold text-[#25252a] leading-[1.12]">
              Building Foundations for Intention and Scale
            </h2>
          </div>
          <div className="space-y-[20px] text-[#333337] text-[16px] leading-[1.6]">
            <p className="m-0">
              We build digital foundations that help businesses grow with intention.
              From brand strategy and identity design to custom software and app
              development, every system we build is engineered to make your company
              visible, trusted, and infinitely scalable.
            </p>
            <p className="m-0">
              Horode was founded on a core insight: modern companies don't just need
              isolated logos or standalone web pages — they need integrated brand and
              technology systems. When strategy, visual identity, and code work in
              harmony, businesses move faster, communicate clearer, and command higher
              market value.
            </p>
          </div>
        </div>
      </section>

      {/* Working Principles Section */}
      <section className="principles-section section-shell pt-[120px] max-sm:pt-[80px]">
        <EyebrowLabel className="mb-[24px]">Core Values</EyebrowLabel>
        <h2 className="m-0 mb-[52px] text-[clamp(36px,3.8vw,54px)] max-sm:text-[32px] font-medium text-[#25252a]">
          How We Work
        </h2>

        <div className="grid grid-cols-2 gap-[24px] max-lg:grid-cols-1">
          {workingPrinciples.map((item) => (
            <div
              key={item.number}
              className="p-[42px] border border-[var(--border)] rounded-[var(--radius-md)] bg-white max-sm:p-[28px]"
            >
              <span className="text-[#9999a0] text-[14px] font-bold block mb-[16px]">
                {item.number}
              </span>
              <h3 className="m-0 mb-[12px] text-[22px] font-semibold text-[#25252a]">
                {item.title}
              </h3>
              <p className="m-0 text-[#8c8c93] text-[15px] leading-[1.6]">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Team / Leadership Section */}
      <section className="team-section section-shell pt-[120px] max-sm:pt-[80px]">
        <EyebrowLabel className="mb-[24px]">Leadership</EyebrowLabel>
        <h2 className="m-0 mb-[52px] text-[clamp(36px,3.8vw,54px)] max-sm:text-[32px] font-medium text-[#25252a]">
          The Minds Behind Horode
        </h2>

        <div className="grid grid-cols-2 gap-[32px] max-lg:grid-cols-1">
          {/* Founder Profile */}
          <div className="p-[42px] border border-[var(--border)] rounded-[var(--radius-md)] bg-white flex flex-col justify-between max-sm:p-[28px]">
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

          {/* Team Placeholder */}
          <div className="p-[42px] border border-[var(--border)] rounded-[var(--radius-md)] bg-white flex flex-col justify-between max-sm:p-[28px]">
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
        </div>
      </section>

      {/* Closing CTA Section */}
      <section className="about-cta section-shell pt-[130px] pb-[40px] text-center max-sm:pt-[90px]">
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
      </section>
    </main>
  );
}
