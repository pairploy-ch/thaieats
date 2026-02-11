"use client";

import Image from "next/image";
import Link from "next/link";
import { Phone } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavbarProps {
  activePage?: "home" | "menu" | "contact";
  variant?: "overlay" | "solid";
}

export default function Navbar({ activePage = "home", variant = "overlay" }: NavbarProps) {
  const navLinks = [
    { label: "HOME", href: "/", id: "home" as const },
    { label: "MENU", href: "/menu", id: "menu" as const },
    { label: "CONTACT", href: "/contact", id: "contact" as const },
  ];

  return (
    <nav className={cn(
      "z-50",
      variant === "overlay" ? "absolute top-0 left-0 right-0" : "relative bg-[#1a1a1a]"
    )}>
      {/* Top bar with navigation */}
      <div className="flex items-center justify-between px-6 md:px-12 lg:px-16 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/images/logo.png"
            alt="Thai Street Eats Logo"
            width={200}
            height={50}
            className="h-12 w-auto"
          />
        </Link>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-8">
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

        {/* Phone Number */}
        <div className="hidden md:flex items-center gap-2 text-foreground">
          <Phone className="w-4 h-4" />
          <span className="text-sm font-medium tracking-wide">
            094 444 4444
          </span>
        </div>
      </div>

      {/* Subtle divider line */}
      <div className="mx-6 md:mx-12 lg:mx-16 border-t border-foreground/20" />
    </nav>
  );
}
