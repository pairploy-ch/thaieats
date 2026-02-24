"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { createClient } from "@supabase/supabase-js";

interface Banner {
  id: string;
  image: string;
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function HeroSection() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [current, setCurrent] = useState(0);

  // ✅ ดึง banner จาก table
  useEffect(() => {
    const fetchBanners = async () => {
      const { data, error } = await supabase
        .from("banner")
        .select("id, image");

      if (!error && data) {
        setBanners(data);
      }
    };

    fetchBanners();
  }, []);

  // ✅ Auto slide ทุก 4 วิ (ถ้ามากกว่า 1 รูป)
  useEffect(() => {
    if (banners.length <= 1) return;

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [banners]);

  return (
    <section className="relative w-full h-screen min-h-[600px] max-h-[900px] overflow-hidden">

      {/* Background Slide */}
      {banners.map((banner, index) => (
        <Image
          key={banner.id}
          src={banner.image}
          alt="Thai street food spread"
          fill
          priority={index === 0}
          className={`object-cover transition-opacity duration-1000 ${
            index === current ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/40 z-10" />

      {/* Hero Content (เหมือนเดิม 100%) */}
      <div className="relative z-20 flex flex-col items-center justify-center h-full text-center px-6">
        <h1 className="font-handwritten text-5xl md:text-7xl lg:text-8xl text-foreground mb-4 drop-shadow-lg">
          Welcome To Thai Street Eats
        </h1>
        <div className="flex flex-wrap items-center justify-center gap-3 md:gap-6 text-foreground/90 text-xs md:text-sm tracking-[0.2em] uppercase">
          <span>High Protein</span>
          <span className="text-foreground/50">&#8226;</span>
          <span>High Fiber</span>
          <span className="text-foreground/50">&#8226;</span>
          <span>Authentic Thai Street Taste</span>
        </div>
      </div>
    </section>
  );
}