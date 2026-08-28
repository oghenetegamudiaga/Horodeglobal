import React from "react";
import type { Metadata } from "next";
import { EyebrowLabel } from "@/components/ui/EyebrowLabel";
import { ContactForm } from "@/components/ui/ContactForm";
import { getSiteSettings } from "@/lib/supabase";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    title: `Contact Us | ${settings.site_title || "Horode Design Studio"}`,
    description:
      "Get in touch with Horode Design Studio. Let's discuss your brand strategy, UI/UX design, or software project.",
  };
}

export default function ContactPage() {
  return (
    <main className="pt-[40px] pb-[120px] max-sm:pt-[20px] max-sm:pb-[60px]">
      <section
        className="contact section-shell"
        aria-labelledby="contact-title"
      >
        <EyebrowLabel className="flex w-max mx-auto mb-[32px]">
          Contact Us
        </EyebrowLabel>

        <h1
          id="contact-title"
          className="max-w-[720px] mx-auto text-center text-[clamp(40px,4vw,64px)] max-sm:text-[38px] max-[430px]:text-[32px] font-medium leading-[1.1] tracking-normal"
        >
          Have a project in mind?{" "}
          <span className="block">Let's create greatness</span>
        </h1>

        <div className="contact-layout grid grid-cols-[440px_minmax(0,1fr)] gap-[90px] items-start mt-[72px] max-lg:grid-cols-1 max-lg:gap-[42px] max-sm:mt-[48px]">
          <aside className="next-step">
            <h2 className="m-0 mb-[26px] text-[24px] font-semibold">
              What next?
            </h2>
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

          <ContactForm />
        </div>
      </section>
    </main>
  );
}
