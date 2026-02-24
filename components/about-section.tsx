import Image from "next/image";
import { createClient } from "@supabase/supabase-js";

interface Dish {
  name: string;
  description: string;
  price: string;
  image: string;
}

// ✅ สร้าง supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// ✅ function shuffle
function shuffleArray<T>(array: T[]): T[] {
  return [...array].sort(() => Math.random() - 0.5);
}

export default async function AboutSection() {
  // ✅ ดึงข้อมูลจาก table menu ตรง ๆ
  const { data, error } = await supabase
    .from("menu")
    .select("name, image");

  if (error || !data) {
    console.error(error);
    return null;
  }

  // ✅ สุ่ม 4 รูป
  const randomDishes = shuffleArray(data as Dish[]).slice(0, 4);

  return (
    <section id="about" className="relative py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-12 lg:px-16 xl:px-24">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 md:gap-12 lg:gap-16 items-start pt-6 md:pt-10">

        {/* Left: Text Content (เหมือนเดิมทั้งหมด) */}
        <div className="w-full lg:w-1/2">
          <div className="w-fit mx-auto md:mx-0 text-center md:text-left">
            <h2 className="font-handwritten text-3xl sm:text-4xl md:text-5xl text-foreground mb-2">
              About Thai Street Eats
            </h2>

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

          <div className="mt-14">
            <p className="text-muted-foreground leading-relaxed text-sm sm:text-base md:text-lg">
              Authentic Thai flavor. Smart, everyday choice.
            </p>

            <br /><br />

            <p className="text-muted-foreground leading-relaxed text-sm sm:text-base md:text-lg">
              At Thai Street Eats, we believe healthy, flavorful food should be accessible to everyone. That’s why we serve authentic Thai dishes that are rich in protein, high in fiber, and full of bold, vibrant taste — all at a price that makes sense for everyday life.
            </p>

            <br /><br />

            <p className="text-muted-foreground leading-relaxed text-sm sm:text-base md:text-lg">
              Great taste. Real nutrition. Honest value. <br />
              Thai Street Eats — made simple, made satisfying, made for you.
            </p>
          </div>
        </div>

        {/* Right: Image Grid (Design เดิม 100%) */}
        <div className="w-full lg:w-1/2">

          {/* Top row */}
          <div className="flex gap-2 sm:gap-3 md:gap-4 mb-2 sm:mb-3 md:mb-4 justify-center lg:justify-end">
            {randomDishes.slice(0, 2).map((dish, index) => (
              <div
                key={index}
                className="relative w-[45%] sm:w-44 md:w-52 lg:w-44 xl:w-52 aspect-[3/4] overflow-hidden rounded-sm"
              >
                <Image
                  src={dish.image}
                  alt={dish.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 45vw, (max-width: 1024px) 25vw, 20vw"
                />
              </div>
            ))}
          </div>

          {/* Bottom row */}
          <div className="flex gap-2 sm:gap-3 md:gap-4 justify-center lg:justify-end pr-0 sm:pr-4 md:pr-6 lg:pr-4 xl:pr-8">
            {randomDishes.slice(2, 4).map((dish, index) => (
              <div
                key={index}
                className="relative w-[45%] sm:w-44 md:w-52 lg:w-44 xl:w-52 aspect-[3/4] overflow-hidden rounded-sm"
              >
                <Image
                  src={dish.image}
                  alt={dish.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 45vw, (max-width: 1024px) 25vw, 20vw"
                />
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}