"use client";

import * as React from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

interface Review {
  title: string;
  text: string;
  rating: number;
}

const reviews: Review[] = [
  {
    title: "CUSTOMER",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut",
    rating: 5,
  },
  {
    title: "CUSTOMER",
    text: "Absolutely amazing food! The flavors are authentic and remind me of my trip to Bangkok. Highly recommended!",
    rating: 5,
  },
  {
    title: "CUSTOMER",
    text: "Best Thai street food in town. The crispy chicken with sticky rice is a must-try. Will definitely come back!",
    rating: 5,
  },
];

export default function ReviewSection() {
  const [current, setCurrent] = React.useState(0);
  const [touchStart, setTouchStart] = React.useState(0);
  const [touchEnd, setTouchEnd] = React.useState(0);

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
    if (touchStart - touchEnd > 75) {
      // Swipe left
      next();
    }

    if (touchStart - touchEnd < -75) {
      // Swipe right
      prev();
    }
  };

  const review = reviews[current];

  return (
    <section className="relative w-full h-[420px] md:h-[460px] overflow-hidden">
      {/* Background image */}
      <Image
        src="/images/review-bg.jpg"
        alt="Thai food background"
        fill
        className="object-cover object-center"
        priority
      />
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <div
        className="relative z-10 flex items-center justify-center h-full px-4 sm:px-6"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Left arrow - hidden on mobile */}
        <button
          type="button"
          onClick={prev}
          className="hidden md:block absolute left-12 top-1/2 -translate-y-1/2 text-foreground/70 hover:text-foreground transition-colors"
          aria-label="Previous review"
        >
          <ChevronLeft className="w-10 h-10" />
        </button>

        {/* Review card */}
        <div className="bg-[#3a3a3a]/80 border border-[#555] backdrop-blur-sm rounded-sm px-6 py-6 sm:px-8 sm:py-8 md:px-12 md:py-10 max-w-lg w-full mx-4 text-center">
          <h3 className="text-foreground font-bold text-lg md:text-xl tracking-wider mb-3 md:mb-4">
            {review.title}
          </h3>
          <p className="text-muted-foreground text-sm md:text-base leading-relaxed mb-4 md:mb-5">
            {review.text}
          </p>
          {/* Stars */}
          <div className="flex justify-center gap-1">
            {Array.from({ length: review.rating }).map((_, i) => (
              <Star
                key={i}
                className="w-5 h-5 fill-[#D4A84B] text-[#D4A84B]"
              />
            ))}
          </div>
          
          {/* Dots indicator - visible on mobile only */}
          <div className="flex justify-center gap-2 mt-5 md:hidden">
            {reviews.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setCurrent(i)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i === current ? "bg-[#D4A84B]" : "bg-foreground/30"
                }`}
                aria-label={`Go to review ${i + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Right arrow - hidden on mobile */}
        <button
          type="button"
          onClick={next}
          className="hidden md:block absolute right-12 top-1/2 -translate-y-1/2 text-foreground/70 hover:text-foreground transition-colors"
          aria-label="Next review"
        >
          <ChevronRight className="w-10 h-10" />
        </button>
      </div>
    </section>
  );
}