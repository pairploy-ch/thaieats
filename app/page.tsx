export const dynamic = "force-dynamic";

import { supabase } from "@/lib/supabase";
import Navbar from "@/components/navbar";
import HeroSection from "@/components/hero-section";
import AboutSection from "@/components/about-section";
import PopularDishes from "@/components/popular-dishes";
import ReviewSection from "@/components/review-section";
import PromotionSection from "@/components/promotion-section";

export default async function Page() {
  const { data } = await supabase
    .from("contact")
    .select("*")
    .eq("title", "Phone") // ปรับตามโครงสร้าง table คุณ
    .single();

  const { data: promotions } = await supabase
    .from("promotion")
    .select("id, img")
    .order("id", { ascending: true });

  const phone = data?.lines?.[0] || null;

  return (
    <main>
      <div className="relative">
        <Navbar activePage="home" phone={phone} />
        <HeroSection />
      </div>

      <div
        className="relative"
        style={{
          backgroundImage: "url('/images/bg-chalkboard.png')",
          backgroundSize: "100% auto",
          backgroundPosition: "top center",
          backgroundRepeat: "repeat-y",
        }}
      >
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10">
          <PromotionSection promotions={promotions ?? []} />
          <AboutSection />
          <PopularDishes />
        </div>
      </div>

      <ReviewSection />
    </main>
  );
}
