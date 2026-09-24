"use client";

import React from "react";
import { usePathname } from "next/navigation";

interface FooterClientProps {
  phone: string;
  email: string;
  address: string;
  socialX: string;
  socialLinkedIn: string;
  socialInstagram: string;
  socialTikTok: string;
  copyrightText: string;
  telLink: string;
}

export function FooterClient({
  phone,
  email,
  address,
  socialX,
  socialLinkedIn,
  socialInstagram,
  socialTikTok,
  copyrightText,
  telLink,
}: FooterClientProps) {
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="site-footer bg-[#050505] border-t border-[var(--border)] text-white">
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
                className="inline-flex items-center justify-center w-[18px] h-[18px] text-white text-[13px] font-semibold hover:opacity-80 transition-opacity"
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
                className="inline-flex items-center justify-center w-[18px] h-[18px] text-white text-[13px] font-semibold hover:opacity-80 transition-opacity"
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
                className="inline-flex items-center justify-center w-[18px] h-[18px] text-white text-[13px] font-semibold hover:opacity-80 transition-opacity"
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
                className="inline-flex items-center justify-center w-[18px] h-[18px] text-white text-[13px] font-semibold hover:opacity-80 transition-opacity"
              >
                ♪
              </a>
            )}
          </div>
        </div>

        <address className="flex flex-col gap-[19px] min-w-[190px] text-[var(--color-text)] text-[13px] not-italic">
          <span className="text-[var(--color-ink)] font-medium">Contact</span>
          <a href={telLink} className="hover:text-white transition-colors">
            {phone}
          </a>
          <a href={`mailto:${email}`} className="hover:text-white transition-colors">
            {email}
          </a>
          <span>{address}</span>
        </address>

        <div className="footer-bottom col-span-full flex items-center justify-between gap-[20px] mt-[80px] pt-[23px] border-t border-[var(--border)] text-[var(--color-muted)] text-[12px] max-sm:grid max-sm:mt-[24px]">
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
