import Image from "next/image";
import Navbar from "@/components/navbar";
import ContactSection from "@/components/contact-section";
import AllDishes from "@/components/all-dishes";
import GalleryStrip from "@/components/gallery-strip";
import Footer from "@/components/footer";





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

      {/* Contact Section */}
      <ContactSection />

      {/* Gallery Strip */}
      <GalleryStrip />

      {/* Footer */}
      <Footer />
    </main>
  );
}
