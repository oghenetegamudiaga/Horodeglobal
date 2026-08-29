import React from "react";

interface ProjectCardProps {
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  tags: string[];
  href?: string;
  className?: string;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  description,
  imageSrc,
  imageAlt,
  tags,
  href,
  className = "",
}) => {
  const content = (
    <>
      <div className="overflow-hidden rounded-[22px] group">
        <img
          src={imageSrc}
          alt={imageAlt}
          className="block w-full aspect-[1.56/1] object-cover rounded-[22px] transition-transform duration-300 group-hover:scale-[1.02]"
        />
      </div>
      <h3 className="m-[28px_0_8px] text-[#25252a] text-[28px] max-sm:text-[24px] font-semibold hover:text-black transition-colors">
        {title}
      </h3>
    </>
  );

  return (
    <article className={`project-card group transition-transform duration-200 ease-out hover:-translate-y-1 ${className}`}>
      {href ? (
        <a href={href} className="block group">
          {content}
        </a>
      ) : (
        content
      )}
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
