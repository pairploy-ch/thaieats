"use client";

import { useEffect, useState, useRef } from "react";

interface Promotion {
  id: number;
  img: string;
}

interface PromotionSectionProps {
  promotions: Promotion[];
}

export default function PromotionSection({ promotions }: PromotionSectionProps) {
  const [current, setCurrent] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const total = promotions.length;

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % total);
    }, 4000);
  };

  useEffect(() => {
    if (total > 1) startTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [total]);

  const goTo = (index: number) => {
    setCurrent(index);
    startTimer();
  };

  const prev = () => goTo((current - 1 + total) % total);
  const next = () => goTo((current + 1) % total);

  if (!promotions || total === 0) return null;

  return (
    <section className={`relative w-full max-w-7xl mx-auto overflow-hidden px-0 ${isMobile ? "py-0" : "py-6 pt-10 md:py-10 md:pt-20"}`}>
      {/* Slides */}
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {promotions.map((promo, i) => (
          <div key={promo.id ?? i} className="min-w-full relative">
            <img
              src={promo.img}
              alt={`Promotion ${i + 1}`}
              className="w-full object-cover"
              style={
                isMobile
                  ? undefined
                  : {
                      maxHeight: "clamp(160px, 40vw, 520px)",
                      minHeight: "160px",
                    }
              }
              loading={i === 0 ? "eager" : "lazy"}
            />
          </div>
        ))}
      </div>

      {/* Prev / Next buttons */}
      {false && total > 1 && !isMobile && (
        <>
          <button
            onClick={prev}
            aria-label="Previous promotion"
            className="absolute left-2 md:left-3 top-1/2 -translate-y-1/2 z-10 bg-black/40 hover:bg-black/70 text-white rounded-full w-8 h-8 md:w-10 md:h-10 flex items-center justify-center transition text-lg md:text-xl"
          >
            ‹
          </button>
          <button
            onClick={next}
            aria-label="Next promotion"
            className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 z-10 bg-black/40 hover:bg-black/70 text-white rounded-full w-8 h-8 md:w-10 md:h-10 flex items-center justify-center transition text-lg md:text-xl"
          >
            ›
          </button>
        </>
      )}

      {/* Dot indicators */}
      {total > 1 && (
        <div className="absolute bottom-2 md:bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 md:gap-2 z-10">
          {promotions.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`w-2 h-2 md:w-2.5 md:h-2.5 rounded-full transition-all duration-300 ${
                i === current
                  ? "bg-white scale-125"
                  : "bg-white/50 hover:bg-white/80"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}