import { supabase } from "@/lib/supabase";
import { MapPin, Clock, Phone, Mail, Instagram, FileText } from "lucide-react";

const iconMap = {
  MapPin,
  Clock,
  Phone,
  Mail,
  Instagram,
  FileText,
} as const;

export default async function ContactSection() {
  const { data, error } = await supabase
    .from("contact")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    console.error(error);
    return null;
  }

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
          {data?.map((item) => {
            const Icon = iconMap[item.icon as keyof typeof iconMap];
            const Wrapper = item.link ? "a" : "div";

            const wrapperProps = item.link
              ? {
                  href: item.link,
                  target: "_blank",
                  rel: "noopener noreferrer",
                  className:
                    "flex items-start gap-4 transition-opacity hover:opacity-70 cursor-pointer",
                }
              : {
                  className: "flex items-start gap-4",
                };

            return (
              <Wrapper key={item.id} {...wrapperProps}>
                {Icon && (
                  <Icon className="w-6 h-6 text-[#fff] mt-1 shrink-0" />
                )}

                <div>
                  <h3 className="text-foreground font-semibold text-lg mb-2">
                    {item.title}
                  </h3>

                  {item.lines?.map((line: string) => (
                    <p
                      key={line}
                      className="text-muted-foreground text-sm leading-relaxed"
                    >
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
