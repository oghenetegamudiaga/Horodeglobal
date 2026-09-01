import React from "react";
import type { Metadata } from "next";
import { EyebrowLabel } from "@/components/ui/EyebrowLabel";
import { ContactForm } from "@/components/ui/ContactForm";
import { Reveal } from "@/components/ui/Reveal";
import { getSiteSettings, getSiteContentMap, DEFAULT_SITE_CONTENT } from "@/lib/supabase";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    title: `Contact Us | ${settings.site_title || "Horode Design Studio"}`,
    description:
      "Get in touch with Horode Design Studio. Let's discuss your brand strategy, UI/UX design, or software project.",
  };
}

export default async function ContactPage() {
  const content = await getSiteContentMap();

  const eyebrow = content.contact_eyebrow || DEFAULT_SITE_CONTENT.contact_eyebrow;
  const heading = content.contact_heading || DEFAULT_SITE_CONTENT.contact_heading;
  const subheading = content.contact_subheading || DEFAULT_SITE_CONTENT.contact_subheading;
  const steps: string[] = Array.isArray(content.contact_steps)
    ? content.contact_steps
    : DEFAULT_SITE_CONTENT.contact_steps;

  return (
    <main className="pt-[40px] pb-[120px] max-sm:pt-[20px] max-sm:pb-[60px]">
      <Reveal as="section" className="contact-header section-shell">
        <EyebrowLabel className="mx-auto mb-[32px]">
          {eyebrow}
        </EyebrowLabel>

        <h1
          id="contact-title"
          className="max-w-[720px] mx-auto text-center text-[clamp(40px,4vw,64px)] max-sm:text-[38px] max-[430px]:text-[32px] font-medium leading-[1.1] tracking-normal"
        >
          {heading}
        </h1>

        <div className="contact-layout grid grid-cols-[440px_minmax(0,1fr)] gap-[90px] items-start mt-[72px] max-lg:grid-cols-1 max-lg:gap-[42px] max-sm:mt-[48px]">
          <aside className="next-step">
            <h2 className="m-0 mb-[26px] text-[24px] font-semibold">
              {subheading}
            </h2>
            <ol className="max-w-[390px] m-0 p-0 text-[#8b8b92] text-[14px] leading-[1.72] list-inside space-y-[12px]">
              {steps.map((stepItem: string, idx: number) => (
                <li key={idx}>{stepItem}</li>
              ))}
            </ol>
          </aside>

          <ContactForm />
        </div>
      </Reveal>
    </main>
  );
}
