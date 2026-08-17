import React from "react";

export const Footer: React.FC = () => {
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
            <a
              href="https://www.x.com/horodeglobal"
              aria-label="X"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-[18px] h-[18px] text-white text-[13px] font-semibold"
            >
              X
            </a>
            <a
              href="#"
              aria-label="LinkedIn"
              className="inline-flex items-center justify-center w-[18px] h-[18px] text-white text-[13px] font-semibold"
            >
              in
            </a>
            <a
              href="https://www.instagram.com/horodeglobal"
              aria-label="Instagram"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-[18px] h-[18px] text-white text-[13px] font-semibold"
            >
              ◎
            </a>
            <a
              href="https://www.tiktok.com/@horodeglobal"
              aria-label="TikTok"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-[18px] h-[18px] text-white text-[13px] font-semibold"
            >
              ♪
            </a>
          </div>
        </div>

        <address className="flex flex-col gap-[19px] min-w-[190px] text-[#c9c9c9] text-[13px] not-italic">
          <span className="text-white font-medium">Contact</span>
          <a href="tel:+2348000091147" className="hover:text-white transition-colors">
            +23480-6009-1147
          </a>
          <a href="mailto:hello@horodeglobal.com" className="hover:text-white transition-colors">
            hello@horodeglobal.com
          </a>
          <span>Warri, Delta State, Nigeria</span>
        </address>

        <div className="footer-bottom col-span-full flex items-center justify-between gap-[20px] mt-[80px] pt-[23px] border-t border-[#1f1f1f] text-[#8d8d8d] text-[12px] max-sm:grid max-sm:mt-[24px]">
          <span>Copyright @2026 Horode</span>
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
};
