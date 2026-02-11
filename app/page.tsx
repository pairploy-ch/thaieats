import Navbar from "@/components/navbar";
import HeroSection from "@/components/hero-section";
import AboutSection from "@/components/about-section";
import PopularDishes from "@/components/popular-dishes";
import ReviewSection from "@/components/review-section";
import ContactSection from "@/components/contact-section";
import GalleryStrip from "@/components/gallery-strip";
import Footer from "@/components/footer";

export default function Page() {
  return (
    <main>
      {/* Hero with Navbar overlay */}
      <div className="relative">
        <Navbar activePage="home" />
        <HeroSection />
      </div>

      {/* About + Popular Dishes share the same chalkboard background */}
      <div
        className="relative"
        style={{
          backgroundImage: "url('/images/bg-chalkboard.png')",
          backgroundSize: "100% auto",
          backgroundPosition: "top center",
          backgroundRepeat: "repeat-y",
        }}
      >
        {/* Dark overlay on background for readability */}
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10">
          <AboutSection />
          <PopularDishes />
        </div>
      </div>

      {/* Review Section - full-bleed background image */}
      <ReviewSection />

      {/* Contact Section */}
      <ContactSection />

      {/* Gallery Strip */}
      <GalleryStrip />

      {/* Footer */}
      <Footer />
    </main>
  );
}
