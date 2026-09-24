import React from "react";
import { getSiteSettings, DEFAULT_SITE_SETTINGS } from "@/lib/supabase";
import { FooterClient } from "./FooterClient";

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
    <FooterClient
      phone={phone}
      email={email}
      address={address}
      socialX={socialX}
      socialLinkedIn={socialLinkedIn}
      socialInstagram={socialInstagram}
      socialTikTok={socialTikTok}
      copyrightText={copyrightText}
      telLink={telLink}
    />
  );
}
