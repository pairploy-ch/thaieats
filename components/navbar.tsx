"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Phone, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavbarProps {
  activePage?: "home" | "menu" | "contact";
  variant?: "overlay" | "solid";
}

export default function Navbar({ activePage = "home", variant = "overlay" }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: "HOME", href: "/", id: "home" as const },
    { label: "MENU", href: "/menu", id: "menu" as const },
    { label: "CONTACT", href: "/contact", id: "contact" as const },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav
      className={cn(
        "z-50",
        variant === "overlay" ? "absolute top-0 left-0 right-0" : "relative bg-[#1a1a1a]"
      )}
    >
      {/* Top bar with navigation */}
      <div className="flex items-center justify-between px-4 sm:px-6 md:px-12 lg:px-16 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 z-50">
          <Image
            src="/images/logo.png"
            alt="Thai Street Eats Logo"
            width={200}
            height={50}
            className="h-10 sm:h-12 w-auto"
            priority
          />
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-6 lg:gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.id}
              href={link.href}
              className={cn(
                "text-foreground font-medium text-sm tracking-wide hover:opacity-80 transition-opacity",
                activePage === link.id
                  ? "underline underline-offset-4 decoration-foreground"
                  : "hover:underline underline-offset-4"
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop Phone Number */}
        <div className="hidden lg:flex items-center gap-2 text-foreground">
          <Phone className="w-4 h-4" />
          <span className="text-sm font-medium tracking-wide">Phone (+45) 55 24 23 01</span>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMobileMenu}
          className="md:hidden z-50 p-2 text-foreground hover:opacity-80 transition-opacity"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Subtle divider line */}
      <div className="mx-4 sm:mx-6 md:mx-12 lg:mx-16 border-t border-foreground/20" />

      {/* Mobile Menu */}
      <div
        className={cn(
          "md:hidden fixed inset-0 bg-[#1a1a1a] z-40 transition-transform duration-300 ease-in-out",
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
        style={{ top: "80px" }} // Adjust based on navbar height
      >
        <div className="flex flex-col items-center justify-center h-full gap-8 px-6">
          {/* Mobile Nav Links */}
          {navLinks.map((link) => (
            <Link
              key={link.id}
              href={link.href}
              onClick={closeMobileMenu}
              className={cn(
                "text-foreground font-medium text-2xl tracking-wide hover:opacity-80 transition-opacity",
                activePage === link.id
                  ? "underline underline-offset-8 decoration-2"
                  : "hover:underline underline-offset-8 decoration-2"
              )}
            >
              {link.label}
            </Link>
          ))}

          {/* Mobile Phone Number */}
          <div className="flex flex-col items-center gap-3 text-foreground mt-8">
            <Phone className="w-6 h-6" />
            <span className="text-lg font-medium tracking-wide">Phone (+45) 55 24 23 01</span>
          </div>
        </div>
      </div>

      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-30"
          onClick={closeMobileMenu}
          style={{ top: "80px" }}
        />
      )}
    </nav>
  );
}
