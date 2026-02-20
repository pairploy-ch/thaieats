import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="relative w-full h-screen min-h-[600px] max-h-[900px]">
      {/* Background Image */}
      <Image
        src="https://zgrpbmhpbmmpcpxdbhoy.supabase.co/storage/v1/object/public/menu/banner.png"
        alt="Thai street food spread"
        fill
        className="object-cover"
        priority
      />
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">
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
