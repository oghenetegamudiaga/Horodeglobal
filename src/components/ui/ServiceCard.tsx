import React from "react";
import {
  Sparkles,
  Palette,
  PenTool,
  LayoutGrid,
  Code2,
  Smartphone,
  Boxes,
  Layers,
  Globe,
  Cpu,
  ArrowUpRight,
  HelpCircle,
} from "lucide-react";

export const CURATED_LUCIDE_ICONS: Record<string, React.ElementType> = {
  Sparkles,
  Palette,
  PenTool,
  LayoutGrid,
  Code2,
  Smartphone,
  Boxes,
  Layers,
  Globe,
  Cpu,
};

export const CURATED_ICON_NAMES = Object.keys(CURATED_LUCIDE_ICONS);

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
  icon,
  iconType = "lucide",
  className = "",
}) => {
  // Render icon based on iconType and icon string
  const renderIcon = () => {
    if (iconType === "custom" && icon && (icon.startsWith("http") || icon.startsWith("/"))) {
      return (
        <img
          src={icon}
          alt=""
          className="w-6 h-6 object-contain mb-[18px] block"
          aria-hidden="true"
        />
      );
    }

    const iconName = icon || "Sparkles";
    const IconComponent = CURATED_LUCIDE_ICONS[iconName] || CURATED_LUCIDE_ICONS["Sparkles"] || HelpCircle;

    return (
      <div className="mb-[18px] text-[#25252a] flex items-center justify-start">
        <IconComponent className="w-6 h-6 stroke-[1.75]" aria-hidden="true" />
      </div>
    );
  };

  return (
    <article
      className={`min-h-[290px] p-[48px_24px_36px] border border-[var(--border)] rounded-[var(--radius-md)] bg-white max-sm:min-h-[220px] max-sm:p-[34px_22px_28px] transition-all duration-200 ease-out hover:scale-[1.015] hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(0,0,0,0.04)] hover:border-[#d4d4d8] flex flex-col justify-between ${className}`}
    >
      <div>
        {renderIcon()}
        <h3 className="m-0 mb-[14px] text-[#25252a] text-[24px] font-semibold leading-[1.18]">
          {title}
        </h3>
        <p className="max-w-[330px] min-h-[72px] m-0 mb-[28px] text-[#8c8c93] text-[14px] leading-[1.56] max-sm:min-h-0">
          {description}
        </p>
      </div>

      <a
        href={href}
        className="text-[#222226] text-[12px] font-bold inline-flex items-center gap-1 hover:underline"
      >
        Learn more <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
      </a>
    </article>
  );
};
