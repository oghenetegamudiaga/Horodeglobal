import React from "react";

interface EyebrowLabelProps {
  children: React.ReactNode;
  className?: string;
}

export const EyebrowLabel: React.FC<EyebrowLabelProps> = ({ children, className = "" }) => {
  return (
    <div className={`eyebrow-pill ${className}`}>
      {children}
    </div>
  );
};
