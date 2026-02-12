import { MapPin, Clock, Phone, Mail, Instagram, FileText } from "lucide-react";

const contactItems = [
  {
    icon: MapPin,
    title: "Location",
    lines: ["Vesterbrogade 79, 1620 København V"],
    link: "https://maps.google.com/?q=Vesterbrogade+79,+1620+København+V",
  },
  {
    icon: Clock,
    title: "Opening hours",
    lines: ["Open daily (Closed Sundays)", "10:00 AM – 8:00 PM"],
  },
  {
    icon: Phone,
    title: "Phone",
    lines: ["Phone (Tlf.) +45 55 24 23 01"],
    link: "tel:+4555242301",
  },
  {
    icon: Mail,
    title: "Email",
    lines: ["ThaiEats111@gmail.com"],
    link: "mailto:ThaiEats111@gmail.com",
  },
  {
    icon: Instagram,
    title: "Instagram",
    lines: ["@thai.street.eats"],
    link: "https://instagram.com/thai.street.eats",
  },
  {
    icon: FileText,
    title: "CVR Number",
    lines: ["45326314"],
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
          {contactItems.map((item) => {
            const Wrapper = item.link ? "a" : "div";
            const wrapperProps = item.link
              ? {
                  href: item.link,
                  target: "_blank",
                  rel: "noopener noreferrer",
                  className: "flex items-start gap-4 transition-opacity hover:opacity-70 cursor-pointer",
                }
              : {
                  className: "flex items-start gap-4",
                };

            return (
              <Wrapper key={item.title} {...wrapperProps}>
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
              </Wrapper>
            );
          })}
        </div>
      </div>
    </section>
  );
}