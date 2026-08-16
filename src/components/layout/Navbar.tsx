"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

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
    <header className="site-header" id="home">
      <a className="brand" href="#home" aria-label="Horode home" onClick={closeMenu}>
        <img src="/assets/horode-logo-black.png" alt="Horode" />
      </a>

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
        <a href="#home" onClick={closeMenu}>
          Home
        </a>
        <a href="#services" onClick={closeMenu}>
          Services
        </a>
        <a href="#about" onClick={closeMenu}>
          About Us
        </a>
        <a href="#works" onClick={closeMenu}>
          Works
        </a>
        <Button
          variant="filled"
          href="#contact"
          className="nav-button"
          onClick={closeMenu}
        >
          Contact us
        </Button>
      </nav>
    </header>
  );
};
