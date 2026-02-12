import Image from "next/image";
import Navbar from "@/components/navbar";

import AllDishes from "@/components/all-dishes";






export default function MenuPage() {
  return (
    <main>
      {/* Navbar with solid dark background */}
      <Navbar activePage="menu"  />

      {/* Menu section with chalkboard background */}
      <div
        className="relative"
        style={{
          backgroundImage: "url('/images/bg-chalkboard.png')",
          backgroundSize: "100% auto",
          backgroundPosition: "top center",
          backgroundRepeat: "repeat-y",
        }}
      >
        <div className="pt-20">
<AllDishes  />
        </div>

      </div>

    </main>
  );
}
