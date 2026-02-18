"use client";

import * as React from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Review {
  id: string;
  title: string;
  text: string;
  rating: number;
}

export default function ReviewSection() {
  const [reviews, setReviews] = React.useState<Review[]>([]);
  const [current, setCurrent] = React.useState(0);
  const [loading, setLoading] = React.useState(true);

  const [touchStart, setTouchStart] = React.useState(0);
  const [touchEnd, setTouchEnd] = React.useState(0);

  // 🔹 Fetch reviews
  React.useEffect(() => {
    const fetchReviews = async () => {
      const { data, error } = await supabase
        .from("review")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) {
        console.error(error);
      } else {
        setReviews(data || []);
      }

      setLoading(false);
    };

    fetchReviews();
  }, []);

  const prev = () => {
    setCurrent((c) => (c === 0 ? reviews.length - 1 : c - 1));
  };

  const next = () => {
    setCurrent((c) => (c === reviews.length - 1 ? 0 : c + 1));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 75) next();
    if (touchStart - touchEnd < -75) prev();
  };

  if (loading) return null;
  if (!reviews.length) return null;

  const review = reviews[current];

  return (
    <section className="relative w-full h-[420px] md:h-[460px] overflow-hidden">
      <Image
        src="/images/review-bg.jpg"
        alt="Thai food background"
        fill
        className="object-cover object-center"
        priority
      />

      <div className="absolute inset-0 bg-black/40" />

      <div
        className="relative z-10 flex items-center justify-center h-full px-4 sm:px-6"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Left arrow */}
        <button
          type="button"
          onClick={prev}
          className="hidden md:block absolute left-12 top-1/2 -translate-y-1/2 text-foreground/70 hover:text-foreground transition-colors"
        >
          <ChevronLeft className="w-10 h-10" />
        </button>

        {/* Card */}
        <div className="bg-[#3a3a3a]/80 border border-[#555] backdrop-blur-sm rounded-sm px-6 py-6 sm:px-8 sm:py-8 md:px-12 md:py-10 max-w-lg w-full mx-4 text-center">
          <h3 className="text-foreground font-bold text-lg md:text-xl tracking-wider mb-3 md:mb-4">
            {review.title}
          </h3>

          <p className="text-muted-foreground text-sm md:text-base leading-relaxed mb-4 md:mb-5">
            {review.text}
          </p>

          <div className="flex justify-center gap-1">
            {Array.from({ length: review.rating }).map((_, i) => (
              <Star
                key={i}
                className="w-5 h-5 fill-[#D4A84B] text-[#D4A84B]"
              />
            ))}
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-5 md:hidden">
            {reviews.map((_, i) => (
              <button
                key={reviews[i].id}
                type="button"
                onClick={() => setCurrent(i)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i === current ? "bg-[#D4A84B]" : "bg-foreground/30"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Right arrow */}
        <button
          type="button"
          onClick={next}
          className="hidden md:block absolute right-12 top-1/2 -translate-y-1/2 text-foreground/70 hover:text-foreground transition-colors"
        >
          <ChevronRight className="w-10 h-10" />
        </button>
      </div>
    </section>
  );
}
