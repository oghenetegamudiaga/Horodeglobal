import React from "react";

interface ServiceCardProps {
  title: string;
  description: string;
  href?: string;
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
      className={`min-h-[290px] p-[64px_24px_36px] border border-[var(--border)] rounded-[var(--radius-md)] bg-white max-sm:min-h-[220px] max-sm:p-[34px_22px_28px] ${className}`}
    >
      <h3 className="m-0 mb-[18px] text-[#25252a] text-[24px] font-semibold leading-[1.18]">
        {title}
      </h3>
      <p className="max-w-[330px] min-h-[80px] m-0 mb-[38px] text-[#8c8c93] text-[14px] leading-[1.56] max-sm:min-h-0">
        {description}
      </p>
      <a href={href} className="text-[#222226] text-[12px] font-bold inline-flex items-center gap-1 hover:underline">
        Learn more <span aria-hidden="true">&nearr;</span>
      </a>
    </article>
  );
};
