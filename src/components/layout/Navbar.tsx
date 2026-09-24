"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/Button";

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const toggleMenu = () => {
    const nextState = !isOpen;
    setIsOpen(nextState);
    if (nextState) {
      document.body.classList.add("menu-open");
    } else {
      document.body.classList.remove("menu-open");
    }
  };

  const closeMenu = () => {
    setIsOpen(false);
    document.body.classList.remove("menu-open");
  };

  return (
    <header className={`site-header ${isScrolled ? "scrolled" : ""}`} id="top">
      <Link href="/" className="brand" aria-label="Horode home" onClick={closeMenu}>
        <img src="/assets/horode-logo-black.png" alt="Horode" />
      </Link>

      <button
        className="menu-toggle"
        type="button"
        onClick={toggleMenu}
        aria-label={isOpen ? "Close menu" : "Open menu"}
        aria-expanded={isOpen}
      >
        <span></span>
        <span></span>
      </button>

      <nav className="site-nav" aria-label="Primary navigation">
        <Link href="/" onClick={closeMenu}>
          Home
        </Link>
        <Link href="/services" onClick={closeMenu}>
          Services
        </Link>
        <Link href="/about" onClick={closeMenu}>
          About Us
        </Link>
        <Link href="/work" onClick={closeMenu}>
          Works
        </Link>
        <Link href="/blog" onClick={closeMenu}>
          Blog
        </Link>
        <Button
          variant="filled"
          href="/contact"
          className="nav-button"
          onClick={closeMenu}
        >
          Contact us
        </Button>
      </nav>
    </header>
  );
};
