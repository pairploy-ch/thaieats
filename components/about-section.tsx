import Image from "next/image";

export default function AboutSection() {
  return (
    <section id="about" className="relative py-20 px-6 md:px-16 lg:px-24">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 lg:gap-16 items-start pt-10">
        {/* Left: Text Content */}
        <div className="lg:w-1/2">
          <div style={{width: 'fit-content'}}>
            <h2 className="font-handwritten text-4xl md:text-5xl text-foreground mb-2">
              About Thai Street Eats
            </h2>
            {/* White brush underline */}
            <div className="mb-8"  style={{display: 'flex', justifyContent: 'end'}}>
              <Image
                src="/images/underline.png"
                alt="underline"
                width={200}
                height={100}
               
              />
            </div>
          </div>

          <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </p>
        </div>

        {/* Right: Image Grid */}
        <div className="lg:w-1/2">
          {/* Top row - 2 images */}
          <div className="flex gap-2 mb-2 justify-end">
            <div className="relative w-44 h-32 md:w-52 md:h-36 overflow-hidden">
              <Image
                src="/images/about-1.png"
                alt="Thai massaman curry"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative w-44 h-32 md:w-52 md:h-36 overflow-hidden">
              <Image
                src="/images/about-2.png"
                alt="Pad krapao with fried egg"
                fill
                className="object-cover"
              />
            </div>
          </div>
          {/* Bottom row - 2 images, slightly offset */}
          <div className="flex gap-2 justify-end pr-4 md:pr-8">
            <div className="relative w-44 h-32 md:w-52 md:h-36 overflow-hidden">
              <Image
                src="/images/about-3.png"
                alt="Tom yum soup"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative w-44 h-32 md:w-52 md:h-36 overflow-hidden">
              <Image
                src="/images/about-4.png"
                alt="Pad thai noodles"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
