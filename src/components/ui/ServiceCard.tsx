import React from "react";
import { ArrowUpRight } from "lucide-react";

interface ServiceCardProps {
  title: string;
  description: string;
  href?: string;
  icon?: string | null;
  iconType?: "lucide" | "custom" | string | null;
  className?: string;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  title,
  description,
  href = "#contact",
  className = "",
}) => {
  return (
    <article
      className={`min-h-[260px] p-[48px_24px_36px] border border-[var(--border)] rounded-[var(--radius-md)] bg-[var(--card-bg)] max-sm:min-h-[200px] max-sm:p-[34px_22px_28px] transition-all duration-200 ease-out hover:scale-[1.015] hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(0,0,0,0.4)] hover:border-[rgba(255,255,255,0.25)] flex flex-col justify-between ${className}`}
    >
      <div>
        <h3 className="m-0 mb-[14px] text-[var(--color-ink)] text-[24px] font-semibold leading-[1.18]">
          {title}
        </h3>
        <p className="max-w-[330px] min-h-[72px] m-0 mb-[28px] text-[var(--color-text)] text-[14px] leading-[1.56] max-sm:min-h-0">
          {description}
        </p>
      </div>

      <a
        href={href}
        className="text-[var(--color-ink)] text-[12px] font-bold inline-flex items-center gap-1 hover:underline"
      >
        Learn more <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
      </a>
    </article>
  );
};
