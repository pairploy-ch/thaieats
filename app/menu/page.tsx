export const dynamic = "force-dynamic";

import { supabase } from "@/lib/supabase";
import Navbar from "@/components/navbar";
import AllDishes from "@/components/all-dishes";

export default async function MenuPage() {
  const { data } = await supabase
    .from("contact")
    .select("*")
    .eq("title", "Phone")
    .single();

  const phone = data?.lines?.[0] || null;

  return (
    <main>
      {/* Navbar with solid dark background */}
      <Navbar activePage="menu" phone={phone} />

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
          <AllDishes />
        </div>
      </div>
    </main>
  );
}