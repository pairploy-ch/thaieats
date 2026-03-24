import React from "react"
import type { Metadata, Viewport } from "next";
import { Inter, Caveat_Brush } from "next/font/google";
import ConditionalLayout from "@/components/conditional-layout";
import Footer from "@/components/footer";
import ContactSection from "@/components/contact-section";
import GalleryStrip from "@/components/gallery-strip";

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
        {/* <ConditionalLayout /> */}
        
             <ContactSection />
                 {/* Google Maps */}
      <section className="w-full h-[400px] md:h-[500px]">

        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2249.9571089079377!2d12.549222900000002!3d55.672346!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4652539ff1cf6273%3A0x4395da43198e7f52!2zVmVzdGVyYnJvZ2FkZSA3OSwgMTYyMCBLw7hiZW5oYXZuLCDguYDguJTguJnguKHguLLguKPguYzguIE!5e0!3m2!1sth!2sth!4v1772112494231!5m2!1sth!2sth"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Thai Street Eats Location"
        />
      </section>
               <GalleryStrip />
               <Footer />
      </body>
    </html>
  );
}