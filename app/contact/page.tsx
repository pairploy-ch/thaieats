import Image from "next/image";
import type { Metadata } from "next";
import Navbar from "@/components/navbar";

import ContactForm from "@/components/contact-form";
import HeroSection from "@/components/hero-contact";

export const metadata: Metadata = {
  title: "Contact | Thai Street Eats",
  description: "Get in touch with Thai Street Eats. Find our location, hours, and send us a message.",
};

export default function ContactPage() {
  return (
    <main>
      {/* Navbar */}
      <Navbar activePage="contact" />
 <HeroSection />
      {/* Hero Banner */}
      {/* <section className="relative w-full h-[50vh] min-h-[350px] max-h-[500px]">
        <Image
          src="/images/hero-bg.jpg"
          alt="Thai street food"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">
          <h1 className="font-handwritten text-4xl md:text-6xl lg:text-7xl text-foreground mb-3 drop-shadow-lg">
            Contact and Location
          </h1>
          <p className="text-foreground/80 text-xs md:text-sm tracking-[0.25em] uppercase">
            Get In Touch
          </p>
        </div>
      </section> */}

      {/* Contact Form + Contact Info on chalkboard background */}
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
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2249.957110463948!2d12.546642612463254!3d55.67234597294214!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4652539ff1cf6273%3A0x4395da43198e7f52!2zVmVzdGVyYnJvZ2FkZSA3OSwgMTYyMCBLw7hiZW5oYXZuLCDguYDguJTguJnguKHguLLguKPguYzguIE!5e0!3m2!1sth!2sth!4v1770823496574!5m2!1sth!2sth"
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
