"use client";

import React, { useEffect, useRef, useState } from "react";

interface HeroCarouselVideoProps {
  className?: string;
}

export const HeroCarouselVideo: React.FC<HeroCarouselVideoProps> = ({
  className = "",
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [canLoadVideo, setCanLoadVideo] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // 1. Check for reduced motion preference
    const motionMediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motionMediaQuery.matches) {
      setPrefersReducedMotion(true);
      return;
    }

    const handleMotionChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    motionMediaQuery.addEventListener("change", handleMotionChange);

    // 2. Check for Data Saver or 2G network conditions
    const nav = navigator as unknown as {
      connection?: {
        saveData?: boolean;
        effectiveType?: string;
      };
    };
    const connection = nav.connection;
    if (
      connection &&
      (connection.saveData === true || connection.effectiveType === "2g")
    ) {
      // Respect user data saver and slow connection
      return () => {
        motionMediaQuery.removeEventListener("change", handleMotionChange);
      };
    }

    // 3. Defer loading video until after page load / browser idle to protect First Paint
    const triggerVideoLoad = () => {
      setCanLoadVideo(true);
    };

    if (document.readyState === "complete") {
      if ("requestIdleCallback" in window) {
        (window as unknown as { requestIdleCallback: (cb: () => void, opts?: { timeout: number }) => void }).requestIdleCallback(
          triggerVideoLoad,
          { timeout: 1200 }
        );
      } else {
        setTimeout(triggerVideoLoad, 200);
      }
    } else {
      const handleLoad = () => {
        if ("requestIdleCallback" in window) {
          (window as unknown as { requestIdleCallback: (cb: () => void, opts?: { timeout: number }) => void }).requestIdleCallback(
            triggerVideoLoad,
            { timeout: 1200 }
          );
        } else {
          setTimeout(triggerVideoLoad, 200);
        }
      };
      window.addEventListener("load", handleLoad, { once: true });
      const fallbackTimer = setTimeout(triggerVideoLoad, 1500);
      return () => {
        window.removeEventListener("load", handleLoad);
        clearTimeout(fallbackTimer);
        motionMediaQuery.removeEventListener("change", handleMotionChange);
      };
    }

    return () => {
      motionMediaQuery.removeEventListener("change", handleMotionChange);
    };
  }, []);

  // When video sources are attached and element is mounted, initiate autoplay
  useEffect(() => {
    if (canLoadVideo && !prefersReducedMotion && videoRef.current) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsVideoPlaying(true))
          .catch(() => {
            // Autoplay policy or low power mode prevented autoplay
          });
      }
    }
  }, [canLoadVideo, prefersReducedMotion]);

  return (
    <div
      className={`hero-carousel-container relative w-full aspect-[16/9] overflow-hidden rounded-[22px] max-sm:rounded-[16px] pointer-events-none select-none ${className}`}
      style={{
        mixBlendMode: "screen",
      }}
    >
      {/* Poster Image (shown immediately on load, and kept permanently if reduced motion or data saver is active) */}
      <img
        src="/assets/hero-carousel-poster.webp"
        alt="Horode featured creative and software showcase"
        width={1280}
        height={720}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
          isVideoPlaying ? "opacity-0" : "opacity-100"
        }`}
        style={{ mixBlendMode: "screen" }}
        loading="eager"
        decoding="async"
      />

      {/* Optimized Video Stream (VP9 WebM first, H.264 MP4 second) */}
      {canLoadVideo && !prefersReducedMotion && (
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-label="Looping motion carousel of selected Horode client work"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ mixBlendMode: "screen" }}
          onPlay={() => setIsVideoPlaying(true)}
        >
          <source src="/assets/hero-carousel.webm" type="video/webm" />
          <source src="/assets/hero-carousel.mp4" type="video/mp4" />
        </video>
      )}
    </div>
  );
};
