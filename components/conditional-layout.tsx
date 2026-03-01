"use client";

import { usePathname } from "next/navigation";
import Footer from "@/components/footer";
import ContactSection from "@/components/contact-section";
import GalleryStrip from "@/components/gallery-strip";

// เพิ่ม path ที่ไม่ต้องการ footer ได้ที่นี่
const HIDE_FOOTER_PATHS = ["/login", "/register", "/forgot-password"];

export default function ConditionalLayout() {
  const pathname = usePathname();
  const hideFooter = HIDE_FOOTER_PATHS.includes(pathname);

  if (hideFooter) return null;

  return (
    <>
      <ContactSection />
      <GalleryStrip />
      <Footer />
    </>
  );
}