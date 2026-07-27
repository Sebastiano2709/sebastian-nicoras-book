"use client";

import { useState, useEffect } from "react";

const links = [
  { label: "Home", href: "#" },
  { label: "Portfolio", href: "#selected-work" },
  { label: "Polaroids", href: "#polaroids" },
  { label: "Measurements", href: "#measurements" },
  { label: "Contact", href: "#contact" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 40);
    }
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        display: "flex",
        justifyContent: "center",
        gap: "2.5rem",
        padding: scrolled ? "14px 24px" : "22px 24px",
        background: scrolled ? "rgba(250, 249, 247, 0.9)" : "transparent",
        backdropFilter: scrolled ? "blur(8px)" : "none",
        borderBottom: scrolled ? "1px solid #e5e2da" : "1px solid transparent",
        transition: "all 0.3s ease",
      }}
    >
      {links.map((link) => (
        <a key={link.label} href={link.href} style={{
            fontSize: "0.7rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "#1a1a1a",
            textDecoration: "none",
          }}>
          {link.label}
        </a>
      ))}
    </nav>
  );
}