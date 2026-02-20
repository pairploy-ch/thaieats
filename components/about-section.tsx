import Image from "next/image";

export default function AboutSection() {
  return (
    <section id="about" className="relative py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-12 lg:px-16 xl:px-24">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 md:gap-12 lg:gap-16 items-start pt-6 md:pt-10">
        {/* Left: Text Content */}
        <div className="w-full lg:w-1/2">
     <div className="w-fit mx-auto md:mx-0 text-center md:text-left">
  <h2 className="font-handwritten text-3xl sm:text-4xl md:text-5xl text-foreground mb-2">
    About Thai Street Eats
  </h2>

  {/* White brush underline */}
  <div className="mb-6 md:mb-8 flex justify-center md:justify-end">
    <Image
      src="/images/underline.png"
      alt="underline"
      width={200}
      height={20}
      className="w-32 sm:w-40 md:w-48 h-auto"
    />
  </div>
</div>

          <p className="text-muted-foreground leading-relaxed text-sm sm:text-base md:text-lg">
     Authentic Thai flavor. Smart, everyday choice.


          </p> <br></br><br></br>
           <p className="text-muted-foreground leading-relaxed text-sm sm:text-base md:text-lg">
At Thai Street Eats, we believe healthy, flavorful food should be accessible to everyone. That’s why we serve authentic Thai dishes that are rich in protein, high in fiber, and full of bold, vibrant taste — all at a price that makes sense for everyday life.
                </p> <br></br><br></br>

          <p className="text-muted-foreground leading-relaxed text-sm sm:text-base md:text-lg">
Great taste. Real nutrition. Honest value. <br></br>
Thai Street Eats — made simple, made satisfying, made for you.
                </p> 
        </div>

        {/* Right: Image Grid */}
        <div className="w-full lg:w-1/2">
          {/* Top row - 2 images */}
          <div className="flex gap-2 sm:gap-3 md:gap-4 mb-2 sm:mb-3 md:mb-4 justify-center lg:justify-end">
            <div className="relative w-[45%] sm:w-44 md:w-52 lg:w-44 xl:w-52 h-28 sm:h-32 md:h-36 lg:h-32 xl:h-36 overflow-hidden rounded-sm">
              <Image
                src="https://zgrpbmhpbmmpcpxdbhoy.supabase.co/storage/v1/object/public/menu/PadKrapao.png"
                alt="Thai massaman curry"
                fill
                className="object-cover"
                sizes="(max-width: 640px) 45vw, (max-width: 1024px) 25vw, 20vw"
              />
            </div>
            <div className="relative w-[45%] sm:w-44 md:w-52 lg:w-44 xl:w-52 h-28 sm:h-32 md:h-36 lg:h-32 xl:h-36 overflow-hidden rounded-sm">
              <Image
                src="https://zgrpbmhpbmmpcpxdbhoy.supabase.co/storage/v1/object/public/menu/MassamanThai.png"
                alt="Pad krapao with fried egg"
                fill
                className="object-cover"
                sizes="(max-width: 640px) 45vw, (max-width: 1024px) 25vw, 20vw"
              />
            </div>
          </div>
          
          {/* Bottom row - 2 images, slightly offset */}
          <div className="flex gap-2 sm:gap-3 md:gap-4 justify-center lg:justify-end pr-0 sm:pr-4 md:pr-6 lg:pr-4 xl:pr-8">
            <div className="relative w-[45%] sm:w-44 md:w-52 lg:w-44 xl:w-52 h-28 sm:h-32 md:h-36 lg:h-32 xl:h-36 overflow-hidden rounded-sm">
              <Image
                src="https://zgrpbmhpbmmpcpxdbhoy.supabase.co/storage/v1/object/public/menu/RedCurry.png"
                alt="Tom yum soup"
                fill
                className="object-cover"
                sizes="(max-width: 640px) 45vw, (max-width: 1024px) 25vw, 20vw"
              />
            </div>
            <div className="relative w-[45%] sm:w-44 md:w-52 lg:w-44 xl:w-52 h-28 sm:h-32 md:h-36 lg:h-32 xl:h-36 overflow-hidden rounded-sm">
              <Image
                src="https://zgrpbmhpbmmpcpxdbhoy.supabase.co/storage/v1/object/public/menu/KaiTodKa.png"
                alt="Pad thai noodles"
                fill
                className="object-cover"
                sizes="(max-width: 640px) 45vw, (max-width: 1024px) 25vw, 20vw"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
