"use client";

import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";

interface Dish {
  name: string;
  description: string;
  price: string;
  image: string;
}

const dishesPage1: Dish[] = [
  {
    name: "Street Crispy Chicken with Sticky Rice",
    description:
      "Sprad thailandsk street chicken, saftig indeni og perfekt sammen med blod klisterris.",
    price: "65 kr.",
    image: "/images/dish-crispy-chicken.png",
  },
  {
    name: "So Street Chicken Noodle Soup",
    description:
      "Fyldig og aromatisk kyllingenudelsuppe med kyllingekodboller, grontsager og nudler.",
    price: "95 kr.",
    image: "/images/dish-noodle-soup.png",
  },
  {
    name: "Bangkok Bold Basil",
    description:
      "Krydret kylling stegt i wok med hellig basilikum - aegte thailandsk street food, proteinrig.",
    price: "95 kr.",
    image: "/images/dish-basil.png",
  },
  {
    name: "Power Greens Wok",
    description:
      "Wokstegte grontsager i thailandsk stil, let aromatiske, sprode og fulde af naering.",
    price: "95 kr.",
    image: "/images/dish-greens-wok.png",
  },
];

const dishesPage2: Dish[] = [
  {
    name: "Royal Green Curry Chicken",
    description:
      "Sprød thailandsk street chicken, saftig indeni og perfekt sammen med blød klisterris.",
    price: "65 kr.",
    image: "/images/dish-green-curry.png",
  },
  {
    name: "Classic Red Curry Chicken",
    description:
      "Fyldig og aromatisk kyllingenudelsuppe med kyllingekødboller, grøntsager og nudler.",
    price: "65 kr.",
    image: "/images/dish-spring-rolls.png",
  },
  {
    name: "Street Yellow Noodles Wok",
    description:
      "Krydret kylling stegt i wok med hellig basilikum – ægte thailandsk street food, proteinrig.",
    price: "65 kr.",
    image: "/images/dish-mango-rice.png",
  },
  {
    name: "Zesty Chicken Rice Bowl",
    description:
      "Wokstegte grøntsager i thailandsk stil, let aromatiske, sprøde og fulde af næring.",
    price: "65 kr.",
    image: "/images/dish-tom-kha.png",
  },
];

function DishCard({
  dish,
  imagePosition,
}: {
  dish: Dish;
  imagePosition: "left" | "right";
}) {
  const imageEl = (
    <div className="bg-[#383838] relative w-full h-full overflow-hidden flex items-center justify-center">
      <Image
        src={dish.image || "/placeholder.svg"}
        alt={dish.name}
        fill
        className="object-contain"
        sizes="(max-width: 768px) 50vw, 25vw"
      />
    </div>
  );

  const textEl = (
    <div className="flex flex-col items-center justify-center bg-[#292929] p-2 min-[300px]:p-4 md:p-6 text-center h-full">
      <h3 className="font-handwritten text-sm min-[300px]:text-base sm:text-lg md:text-2xl text-foreground mb-1">
        {dish.name}
      </h3>
      <p className="text-muted-foreground text-[10px] min-[300px]:text-xs md:text-sm leading-relaxed mb-2 min-[300px]:mb-3 line-clamp-3">
        {dish.description}
      </p>
      <p className="font-handwritten text-base min-[300px]:text-lg sm:text-xl md:text-2xl text-[#D4A84B]">
        {dish.price}
      </p>
    </div>
  );

  return (
    <div className="grid grid-cols-2 gap-0 h-48 min-[300px]:h-56 sm:h-64 md:h-auto">
      {imagePosition === "left" ? (
        <>
          {imageEl}
          {textEl}
        </>
      ) : (
        <>
          {textEl}
          {imageEl}
        </>
      )}
    </div>
  );
}

function DishesGrid({ dishes }: { dishes: Dish[] }) {
  return (
    <div className="flex flex-col md:grid md:grid-cols-2 max-w-5xl mx-auto">
      {/* Mobile: Stack all dishes vertically with no gaps */}
      <div className="md:hidden flex flex-col">
        {dishes.map((dish, index) => (
          <div key={index}>
            <DishCard 
              dish={dish} 
              imagePosition={index % 2 === 0 ? "left" : "right"} 
            />
          </div>
        ))}
      </div>
      
      {/* Desktop: Original 2x2 grid layout */}
      <div className="hidden md:contents">
        <DishCard dish={dishes[0]} imagePosition="left" />
        <DishCard dish={dishes[1]} imagePosition="left" />
        <DishCard dish={dishes[2]} imagePosition="right" />
        <DishCard dish={dishes[3]} imagePosition="right" />
      </div>
    </div>
  );
}

export default function PopularDishes() {
  const [dishes, setDishes] = React.useState<any[]>([]);
  const [currentPage, setCurrentPage] = React.useState(0);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchDishes = async () => {
      const { data, error } = await supabase
        .from("menu")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) {
        console.error(error);
      } else {
        setDishes(data || []);
      }

      setLoading(false);
    };

    fetchDishes();
  }, []);

  if (loading || !dishes.length) return null;

  // 🔹 แบ่งหน้าละ 4 เมนู
  const itemsPerPage = 4;
  const pages = [];

  for (let i = 0; i < dishes.length; i += itemsPerPage) {
    pages.push(dishes.slice(i, i + itemsPerPage));
  }

  return (
    <section id="popular-dishes">
      <div className="relative pt-8 min-[300px]:pt-12 sm:pt-16 px-2 min-[300px]:px-4 sm:px-6 md:px-16 lg:px-24">
        <div className="max-w-7xl mx-auto">

          {/* Title */}
          <div className="text-center mb-6 min-[300px]:mb-8 sm:mb-12">
            <div className="inline-block">
              <h2 className="font-handwritten text-2xl min-[300px]:text-3xl sm:text-4xl md:text-5xl text-foreground mb-2">
                Popular Dishes
              </h2>
              <div className="mb-4 min-[300px]:mb-6 sm:mb-8 flex justify-end">
                <Image
                  src="/images/underline.png"
                  alt="underline"
                  width={200}
                  height={20}
                  className="w-24 min-[300px]:w-32 sm:w-40 md:w-48 h-auto"
                />
              </div>
            </div>
          </div>

          {/* Carousel */}
          <div className="relative overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentPage * 100}%)` }}
            >
              {pages.map((pageDishes, index) => (
                <div key={index} className="min-w-full">
                  <DishesGrid
                    dishes={pageDishes.map((dish: any) => ({
                      ...dish,
                      price: `${dish.price} ${dish.currency ?? "kr."}`,
                    }))}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Pagination */}
          <div className="flex justify-center gap-2 min-[300px]:gap-3 mt-6 min-[300px]:mt-8 sm:mt-10">
            {pages.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setCurrentPage(index)}
                className={cn(
                  "w-2.5 h-2.5 min-[300px]:w-3 min-[300px]:h-3 rounded-full transition-colors duration-300",
                  currentPage === index
                    ? "bg-foreground"
                    : "bg-muted-foreground/40 hover:bg-muted-foreground/60"
                )}
              />
            ))}
          </div>

        </div>
      </div>

      <div className="mt-6 min-[300px]:mt-8 sm:mt-12">
        <Image
          src="/images/bg-line.png"
          alt="Thai street food"
          width={1000}
          height={600}
          className="w-full h-auto"
        />
      </div>
    </section>
  );
}
