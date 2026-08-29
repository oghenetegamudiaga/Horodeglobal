import React from "react";
import { getSiteSettings, DEFAULT_SITE_SETTINGS } from "@/lib/supabase";

export async function Footer() {
  const settings = await getSiteSettings();

  const phone = settings.phone || DEFAULT_SITE_SETTINGS.phone;
  const email = settings.email || DEFAULT_SITE_SETTINGS.email;
  const address = settings.address || DEFAULT_SITE_SETTINGS.address;
  const socialX = settings.social_x || DEFAULT_SITE_SETTINGS.social_x;
  const socialLinkedIn = settings.social_linkedin || DEFAULT_SITE_SETTINGS.social_linkedin;
  const socialInstagram = settings.social_instagram || DEFAULT_SITE_SETTINGS.social_instagram;
  const socialTikTok = settings.social_tiktok || DEFAULT_SITE_SETTINGS.social_tiktok;
  const copyrightText = settings.copyright_text || DEFAULT_SITE_SETTINGS.copyright_text;

  // Clean phone number for tel: link
  const telLink = `tel:${phone.replace(/[^0-9+]/g, "")}`;

  return (
    <footer className="site-footer bg-[#000000] text-white">
      <div className="footer-inner grid grid-cols-[1fr_auto] gap-[40px] pt-[148px] pb-[36px] max-lg:grid-cols-1 max-lg:pt-[72px]">
        <div>
          <a className="footer-brand inline-flex items-center w-max" href="/" aria-label="Horode home">
            <img
              src="/assets/horode-logo-black.png"
              alt="Horode"
              className="block w-[292px] h-auto invert max-sm:w-[210px]"
            />
          </a>
          <div className="social-links flex gap-[18px] mt-[92px] max-sm:mt-[44px]" aria-label="Social links">
            {socialX && (
              <a
                href={socialX}
                aria-label="X"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-[18px] h-[18px] text-white text-[13px] font-semibold"
              >
                X
              </a>
            )}
            {socialLinkedIn && (
              <a
                href={socialLinkedIn}
                aria-label="LinkedIn"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-[18px] h-[18px] text-white text-[13px] font-semibold"
              >
                in
              </a>
            )}
            {socialInstagram && (
              <a
                href={socialInstagram}
                aria-label="Instagram"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-[18px] h-[18px] text-white text-[13px] font-semibold"
              >
                ◎
              </a>
            )}
            {socialTikTok && (
              <a
                href={socialTikTok}
                aria-label="TikTok"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-[18px] h-[18px] text-white text-[13px] font-semibold"
              >
                ♪
              </a>
            )}
          </div>
        </div>

        <address className="flex flex-col gap-[19px] min-w-[190px] text-[#c9c9c9] text-[13px] not-italic">
          <span className="text-white font-medium">Contact</span>
          <a href={telLink} className="hover:text-white transition-colors">
            {phone}
          </a>
          <a href={`mailto:${email}`} className="hover:text-white transition-colors">
            {email}
          </a>
          <span>{address}</span>
        </address>

        <div className="footer-bottom col-span-full flex items-center justify-between gap-[20px] mt-[80px] pt-[23px] border-t border-[#1f1f1f] text-[#8d8d8d] text-[12px] max-sm:grid max-sm:mt-[24px]">
          <span>{copyrightText}</span>
          <span className="flex gap-[18px] max-sm:flex-wrap">
            <a href="#" className="hover:text-white transition-colors">
              Terms of service
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Privacy policy
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
