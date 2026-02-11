import Image from "next/image";

const galleryImages = [
  { src: "/images/gallery-1.jpg", alt: "Tom yum goong" },
  { src: "/images/gallery-2.jpg", alt: "Pad thai" },
  { src: "/images/gallery-3.jpg", alt: "Green curry" },
  { src: "/images/gallery-4.jpg", alt: "Stir fried pork" },
  { src: "/images/gallery-5.jpg", alt: "Red curry duck" },
  { src: "/images/gallery-6.jpg", alt: "Larb gai" },
  { src: "/images/gallery-7.jpg", alt: "Pad krapao" },
  { src: "/images/gallery-8.jpg", alt: "Massaman curry" },
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
