"use client";

import React from "react";
import Link from "next/link";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "outline" | "filled";
  href?: string;
  children: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "outline",
  href,
  children,
  className = "",
  onClick,
  ...props
}) => {
  const baseClass = `tega-btn tega-btn-${variant} ${className}`;

  if (href) {
    const isExternal = href.startsWith("http://") || href.startsWith("https://");
    const isHash = href.startsWith("#");

    if (isExternal || isHash) {
      const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (isHash) {
          const targetId = href.replace(/^#/, "");
          const elem = document.getElementById(targetId);
          if (elem) {
            e.preventDefault();
            elem.scrollIntoView({ behavior: "smooth" });
            if (typeof window !== "undefined") {
              window.history.pushState(null, "", href);
            }
          }
        }
        if (onClick) {
          onClick(e);
        }
      };

      return (
        <a
          href={href}
          className={baseClass}
          onClick={handleAnchorClick}
          {...(props as unknown as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {children}
        </a>
      );
    }

    return (
      <Link
        href={href}
        className={baseClass}
        onClick={onClick as React.MouseEventHandler<HTMLAnchorElement>}
        {...(props as unknown as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {children}
      </Link>
    );
  }

  return (
    <button className={baseClass} onClick={onClick} {...props}>
      {children}
    </button>
  );
};
