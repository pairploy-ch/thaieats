import React from "react"
import type { Metadata, Viewport } from "next";
import { Inter, Caveat_Brush } from "next/font/google";

import "./globals.css";

const _inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const _handwritten = Caveat_Brush({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-handwritten",
});

export const metadata: Metadata = {
  title: "Thai Street Eats - Authentic Thai Street Food",
  description:
    "Welcome to Thai Street Eats. High Protein, High Fiber, Authentic Thai Street Taste.",
};

export const viewport: Viewport = {
  themeColor: "#2d2d2d",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${_inter.variable} ${_handwritten.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
