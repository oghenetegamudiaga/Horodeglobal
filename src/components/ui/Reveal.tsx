"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";

interface RevealProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  yOffset?: number;
  duration?: number;
  amount?: number | "some" | "all";
  as?: "div" | "section" | "article" | "header" | "aside" | "span" | "main";
  id?: string;
}

export const Reveal: React.FC<RevealProps> = ({
  children,
  className = "",
  delay = 0,
  yOffset = 20,
  duration = 0.5,
  amount = 0.15,
  as = "div",
  id,
  ...props
}) => {
  const shouldReduceMotion = useReducedMotion();
  const Component = motion[as] as any;

  if (shouldReduceMotion) {
    const Tag = as;
    return (
      <Tag id={id} className={className} {...props}>
        {children}
      </Tag>
    );
  }

  return (
    <Component
      id={id}
      className={className}
      initial={{ opacity: 0, y: yOffset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{
        duration,
        delay,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
      {...props}
    >
      {children}
    </Component>
  );
};
