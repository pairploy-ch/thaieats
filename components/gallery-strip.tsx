import Image from "next/image";
import { createClient } from "@supabase/supabase-js";

interface Dish {
  name: string;
  image: string;
}

// ✅ สร้าง supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// ✅ shuffle function
function shuffleArray<T>(array: T[]): T[] {
  return [...array].sort(() => Math.random() - 0.5);
}

export default async function GalleryStrip() {
  // ✅ ดึงข้อมูลจาก table menu
  const { data, error } = await supabase
    .from("menu")
    .select("name, image");

  if (error || !data) {
    console.error(error);
    return null;
  }

  // ✅ สุ่ม 8 รูป
  const randomImages = shuffleArray(data as Dish[]).slice(0, 8);

  return (
    <section className="w-full overflow-hidden">
      <div className="grid grid-cols-4 md:grid-cols-8">
        {randomImages.map((dish) => (
          <div key={dish.image} className="relative aspect-square overflow-hidden">
            <Image
              src={dish.image}
              alt={dish.name}
              fill
              className="object-cover hover:scale-110 transition-transform duration-300"
            />
          </div>
        ))}
      </div>
    </section>
  );
}