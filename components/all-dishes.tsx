"use client";

import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

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
    <div className="bg-[#383838] relative w-full h-full overflow-hidden flex justify-center items-center">
      <Image
        src={dish.image || "/placeholder.svg"}
        alt={dish.name}
        fill
        className="object-contain"
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
        {dish.price}
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
            key={index}
            dish={dish}
            imagePosition={imagePosition}
          />
        );
      })}
    </div>
  );
}


export default function PopularDishes() {
  return (
    <section id="popular-dishes">
      <div className="relative pt-16 px-6 md:px-16 lg:px-24">
        <div className="max-w-7xl mx-auto">
          {/* Title */}
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

          {/* Single page dishes */}
          <DishesGrid dishes={dishesPage1} />
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