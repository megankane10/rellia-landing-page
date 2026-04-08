import { cn } from "@/lib/utils"

const logos = [
  { name: "Akesyn", src: "/images/portfolio-akesyn.png" },
  { name: "CareLog", src: "/images/portfolio-carelog.png" },
  { name: "CarePathStudio", src: "/images/portfolio-carepathstudio.svg" },
  { name: "Dott", src: "/images/portfolio-dott.png" },
  { name: "GeoClaim", src: "/images/portfolio-geoclaim.png" },
  { name: "Glowlytics", src: "/images/portfolio-glowtylics.png" },
  { name: "HealCycle", src: "/images/portfolio-healcycle.png" },
  { name: "MEA", src: "/images/portfolio-mea.png" },
  { name: "Miraei", src: "/images/portfolio-miraei.png" },
  { name: "MyLigo", src: "/images/portfolio-myligo.jpg" },
  { name: "Neuromod", src: "/images/portfolio-neuromod.png" },
  { name: "Newgen", src: "/images/portfolio-newgen.svg" },
  { name: "Patient Companion", src: "/images/portfolio-patientcompanion.png" },
  { name: "POP", src: "/images/portfolio-pop.png" },
  { name: "Restore", src: "/images/portfolio-restore.svg" },
  { name: "Salve Therapeutics", src: "/images/portfolio-salvetheapeutics.png" },
  { name: "SeeMira", src: "/images/portfolio-seemira.png" },
] as const

// Duplicate for seamless loop
const allLogos = [...logos, ...logos]

export default function LogoMarquee() {
  return (
    <section className="w-full bg-white py-10 md:py-14 overflow-hidden border-y border-black/5">
      <p className="text-center font-host-grotesk text-lg md:text-xl font-semibold text-rellia-teal mb-7 md:mb-10 px-6 tracking-tight">
        Portfolio <span className="text-rellia-teal">Companies</span>
      </p>
      <div
        className="relative flex items-center"
        aria-label="Portfolio companies logo carousel"
      >
        {/* Gradient fade left */}
        <div className="absolute left-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-r from-white to-transparent pointer-events-none" />

        {/* Scrolling logos */}
        <div className="flex w-max items-center gap-12 md:gap-20 whitespace-nowrap will-change-transform motion-reduce:animate-none animate-marqueeFast md:animate-marquee hover:[animation-play-state:paused]">
          {allLogos.map((logo, i) => (
            <div
              key={`${logo.name}-${i}`}
              className="flex items-center justify-center h-16 md:h-20 shrink-0"
            >
              <img
                src={logo.src}
                alt={logo.name}
                className={cn(
                  "h-14 md:h-16 w-auto max-w-[200px] object-contain transition-transform duration-200",
                  "hover:scale-110 hover:drop-shadow-md",
                  logo.name === "Glowlytics" && "scale-[1.12]",
                )}
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
