export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/navbar";
import ContactForm from "@/components/contact-form";
import HeroSection from "@/components/hero-contact";

export const metadata: Metadata = {
  title: "Contact | Thai Street Eats",
  description:
    "Get in touch with Thai Street Eats. Find our location, hours, and send us a message.",
};

export default async function ContactPage() {
  const { data } = await supabase
    .from("contact")
    .select("*")
    .eq("title", "Phone")
    .single();

  const phone = data?.lines?.[0] || null;

  return (
    <main>
      {/* Navbar */}
      <Navbar activePage="contact" phone={phone} />

      <HeroSection />

      {/* Contact Form Section */}
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
          <ContactForm />
        </div>
      </div>

      {/* Google Maps */}
      <section className="w-full h-[400px] md:h-[500px]">

        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2249.9571089079377!2d12.549222900000002!3d55.672346!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4652539ff1cf6273%3A0x4395da43198e7f52!2zVmVzdGVyYnJvZ2FkZSA3OSwgMTYyMCBLw7hiZW5oYXZuLCDguYDguJTguJnguKHguLLguKPguYzguIE!5e0!3m2!1sth!2sth!4v1772112494231!5m2!1sth!2sth"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Thai Street Eats Location"
        />
      </section>
    </main>
  );
}