import { MapPin, Clock, Phone, Mail } from "lucide-react";

const contactItems = [
  {
    icon: MapPin,
    title: "Location",
    lines: ["Vesterbrogade 79, 1620 København V"],
  },
  {
    icon: Clock,
    title: "Opening hours",
    lines: ["Open daily (Closed Sundays)", "10:00 AM – 8:00 PM"],
  },
  {
    icon: Phone,
    title: "Phone",
    lines: ["+093 333 2321"],
  },
  {
    icon: Mail,
    title: "Email",
    lines: ["thaieats111@gmail.com"],
  },
];

export default function ContactSection() {
  return (
    <section
      id="contact"
      className="relative py-16 md:py-20 px-6 md:px-16 lg:px-24"
      style={{
        backgroundImage: "url('/images/bg-chalkboard.png')",
        backgroundSize: "100% auto",
        backgroundPosition: "top center",
        backgroundRepeat: "repeat-y",
      }}
    >
      <div className="absolute inset-0 bg-black/30" />
      <div className="relative z-10 max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
          {contactItems.map((item) => (
            <div key={item.title} className="flex items-start gap-4">
              <item.icon className="w-6 h-6 text-[#fff] mt-1 shrink-0" />
              <div>
                <h3 className="text-foreground font-semibold text-lg mb-2">
                  {item.title}
                </h3>
                {item.lines.map((line) => (
                  <p key={line} className="text-muted-foreground text-sm leading-relaxed">
                    {line}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
