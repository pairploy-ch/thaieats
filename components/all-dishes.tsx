"use client";

import * as React from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";

interface Dish {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  image: string;
}

function DishCard({
  dish,
  imagePosition,
}: {
  dish: Dish;
  imagePosition: "left" | "right";
}) {
  const formattedPrice = `${dish.price} ${dish.currency ?? "kr."}`;

  const imageEl = (
    <div className="bg-[#383838] relative w-full h-full overflow-hidden flex justify-center items-center">
      <Image
        src={dish.image || "/placeholder.svg"}
        alt={dish.name}
        fill
        className="object-cover"
      />
    </div>
  );

  const textEl = (
    <div className="flex flex-col items-center justify-center bg-[#292929] p-4 md:p-6 text-center h-full">
      <h3 className="font-handwritten text-xl md:text-2xl text-foreground mb-1">
        {dish.name}
      </h3>
      <p className="text-muted-foreground text-xs md:text-sm leading-relaxed mb-3">
        {dish.description}
      </p>
      <p className="font-handwritten text-xl md:text-2xl text-[#D4A84B]">
        {formattedPrice}
      </p>
    </div>
  );

  return (
    <div className="grid grid-cols-2 gap-0 min-h-[200px] md:min-h-[240px]">
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
    <div className="grid grid-cols-1 md:grid-cols-2 max-w-5xl mx-auto">
      {dishes.map((dish, index) => {
        const group = Math.floor(index / 2);
        const imagePosition = group % 2 === 0 ? "left" : "right";

        return (
          <DishCard
            key={dish.id}
            dish={dish}
            imagePosition={imagePosition}
          />
        );
      })}
    </div>
  );
}

export default function PopularDishes() {
  const [dishes, setDishes] = React.useState<Dish[]>([]);
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

  if (loading) return null;
  if (!dishes.length) return null;

  return (
    <section id="popular-dishes">
      <div className="relative pt-16 px-6 md:px-16 lg:px-24">
        <div className="max-w-7xl mx-auto">
          <div
            className="text-center mb-12"
            style={{ display: "flex", justifyContent: "center" }}
          >
            <div style={{ width: "fit-content" }}>
              <h2 className="font-handwritten text-4xl md:text-5xl text-foreground mb-2">
                All Dishes
              </h2>

              <div
                className="mb-8"
                style={{ display: "flex", justifyContent: "end" }}
              >
                <Image
                  src="/images/underline.png"
                  alt="underline"
                  width={200}
                  height={100}
                />
              </div>
            </div>
          </div>

          <DishesGrid dishes={dishes} />
        </div>
      </div>

      <div>
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
