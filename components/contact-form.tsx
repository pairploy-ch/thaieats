"use client";

import React from "react"
import Image from "next/image";
import { useState } from "react";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

async function handleSubmit(e: React.FormEvent) {
  e.preventDefault();

  try {
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      alert("Message sent successfully!");
      setFormData({ name: "", email: "", phone: "", message: "" });
    } else {
      alert("Something went wrong.");
    }
  } catch (error) {
    alert("Server error.");
  }
}

  return (
    <section className="py-16 md:py-20 px-6 md:px-16 lg:px-24">
      {/* Heading */}
           <div
             className="text-center mb-12"
             style={{ display: "flex", justifyContent: "center" }}
           >
             <div style={{ width: "fit-content" }}>
               <h2 className="font-handwritten text-4xl md:text-5xl text-foreground mb-2">
                 Contact Us
               </h2>
               {/* White brush underline */}
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

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="max-w-2xl mx-auto flex flex-col gap-5"
      >
        {/* Name - full width */}
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full bg-transparent border border-muted-foreground/40 text-foreground placeholder:text-muted-foreground text-sm px-4 py-3 rounded-sm focus:outline-none focus:border-[#D4A84B] transition-colors"
        />

        {/* Email + Phone - side by side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full bg-transparent border border-muted-foreground/40 text-foreground placeholder:text-muted-foreground text-sm px-4 py-3 rounded-sm focus:outline-none focus:border-[#D4A84B] transition-colors"
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full bg-transparent border border-muted-foreground/40 text-foreground placeholder:text-muted-foreground text-sm px-4 py-3 rounded-sm focus:outline-none focus:border-[#D4A84B] transition-colors"
          />
        </div>

        {/* Message - textarea */}
        <textarea
          name="message"
          placeholder="Message"
          value={formData.message}
          onChange={handleChange}
          required
          rows={5}
          className="w-full bg-transparent border border-muted-foreground/40 text-foreground placeholder:text-muted-foreground text-sm px-4 py-3 rounded-sm resize-none focus:outline-none focus:border-[#D4A84B] transition-colors"
        />

        {/* Submit button */}
        <div className="text-center mt-2">
          <button
            type="submit"
            className="bg-[#C0392B] hover:bg-[#A93226] text-foreground text-xs md:text-sm font-semibold tracking-[0.15em] uppercase px-8 py-3 transition-colors"
          >
            Send Message
          </button>
        </div>
      </form>
    </section>
  );
}
