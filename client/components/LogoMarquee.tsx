const logos = [
  { name: "miraei", src: "/images/marquee-partner-1.webp" },
  { name: "CarePathStudio", src: "/images/marquee-partner-2.webp" },
  { name: "Newgen Health", src: "/images/marquee-partner-3.webp" },
  { name: "Glowlytics", src: "/images/marquee-partner-4.webp" },
]

// Duplicate for seamless loop
const allLogos = [...logos, ...logos, ...logos];

export default function LogoMarquee() {
  return (
    <section className="w-full bg-white py-8 md:py-12 overflow-hidden border-y border-black/5">
      <p className="text-center font-urbanist text-sm md:text-base font-medium text-black/60 mb-6 md:mb-8 px-6">
        Portfolio Companies
      </p>
      <div className="relative flex items-center">
        {/* Gradient fade left */}
        <div className="absolute left-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-r from-white to-transparent pointer-events-none" />

        {/* Scrolling logos */}
        <div className="flex items-center animate-marquee gap-12 md:gap-20 whitespace-nowrap">
          {allLogos.map((logo, i) => (
            <div
              key={`${logo.name}-${i}`}
              className="flex items-center justify-center h-16 md:h-20 shrink-0"
            >
              <img
                src={logo.src}
                alt={logo.name}
                className="h-10 md:h-14 w-auto object-contain opacity-90 hover:opacity-100 transition-opacity duration-300"
              />
            </div>
          ))}
        </div>

        {/* Gradient fade right */}
        <div className="absolute right-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-l from-white to-transparent pointer-events-none" />
      </div>
    </section>
  );
}
