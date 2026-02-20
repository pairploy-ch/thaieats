import Image from "next/image";

const galleryImages = [
  { src: "https://zgrpbmhpbmmpcpxdbhoy.supabase.co/storage/v1/object/public/menu/KaiTodKa.png", alt: "Tom yum goong" },
  { src: "https://zgrpbmhpbmmpcpxdbhoy.supabase.co/storage/v1/object/public/menu/KeanWanKai.png", alt: "Pad thai" },
  { src: "https://zgrpbmhpbmmpcpxdbhoy.supabase.co/storage/v1/object/public/menu/MassamanThai.png", alt: "Green curry" },
  { src: "https://zgrpbmhpbmmpcpxdbhoy.supabase.co/storage/v1/object/public/menu/PadMee.png", alt: "Stir fried pork" },
  { src: "https://zgrpbmhpbmmpcpxdbhoy.supabase.co/storage/v1/object/public/menu/PadPak.png", alt: "Red curry duck" },
  { src: "https://zgrpbmhpbmmpcpxdbhoy.supabase.co/storage/v1/object/public/menu/RedCurry.png", alt: "Larb gai" },
  { src: "https://zgrpbmhpbmmpcpxdbhoy.supabase.co/storage/v1/object/public/menu/ZapKai.png", alt: "Pad krapao" },
  { src: "https://zgrpbmhpbmmpcpxdbhoy.supabase.co/storage/v1/object/public/menu/PadKrapao.png", alt: "Massaman curry" },
];

export default function GalleryStrip() {
  return (
    <section className="w-full overflow-hidden">
      <div className="grid grid-cols-4 md:grid-cols-8">
        {galleryImages.map((img) => (
          <div key={img.src} className="relative aspect-square overflow-hidden">
            <Image
              src={img.src || "/placeholder.svg"}
              alt={img.alt}
              fill
              className="object-cover hover:scale-110 transition-transform duration-300"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
