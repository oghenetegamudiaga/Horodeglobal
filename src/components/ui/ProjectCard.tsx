import React from "react";

interface ProjectCardProps {
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  tags: string[];
  className?: string;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  description,
  imageSrc,
  imageAlt,
  tags,
  className = "",
}) => {
  return (
    <article className={`project-card ${className}`}>
      <img
        src={imageSrc}
        alt={imageAlt}
        className="block w-full aspect-[1.56/1] object-cover rounded-[22px]"
      />
      <h3 className="m-[28px_0_8px] text-[#25252a] text-[28px] max-sm:text-[24px] font-semibold">
        {title}
      </h3>
      <p className="max-w-[620px] m-0 mb-[18px] text-[#8e8e95] text-[14px] leading-[1.6]">
        {description}
      </p>
      <div className="flex flex-wrap gap-[9px]" aria-label="Project services">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="inline-flex items-center min-h-[24px] px-[10px] border border-[var(--border)] rounded-full text-[#77777e] text-[10px] font-semibold"
          >
            {tag}
          </span>
        ))}
      </div>
    </article>
  );
};
