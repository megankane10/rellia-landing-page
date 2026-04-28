import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import RelliaCta from "@/components/RelliaCta";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Link } from "react-router-dom";
import { useFaqPage } from "@/hooks/useCmsDocuments";
import { DEFAULT_FAQ_PAGE } from "@shared/cms/defaults";

export default function FAQ() {
  const { data } = useFaqPage();
  const faq = data ?? DEFAULT_FAQ_PAGE;
  const firstId = faq.items[0]?.id ?? "first";

  return (
    <div className="min-h-screen bg-white font-host-grotesk overflow-x-hidden">
      <Navbar />

      <main id="main-content">
        <section className="relative pt-32 pb-16 md:pt-44 md:pb-24 bg-rellia-cream/80 overflow-hidden">
          {/* Header effects: soft color wash + subtle grid + holomark */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-24 -left-10 h-64 w-64 rounded-full bg-rellia-mint/55 blur-3xl" />
            <div className="absolute -bottom-24 -right-10 h-80 w-80 rounded-full bg-rellia-teal/25 blur-3xl" />
            <div
              className="absolute inset-0 opacity-[0.12]"
              style={{
                backgroundImage:
                  "linear-gradient(to right, rgba(2,44,46,0.45) 1px, transparent 1px), linear-gradient(to bottom, rgba(2,44,46,0.45) 1px, transparent 1px)",
                backgroundSize: "64px 64px",
              }}
              aria-hidden
            />
          </div>

          <img
            src="/images/hologram-logo.png"
            alt=""
            aria-hidden
            className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 h-[60%] md:h-[85%] w-auto object-contain opacity-[0.14] select-none"
          />

          <div className="relative z-10 max-w-[1100px] mx-auto px-6 md:px-10">
            <ScrollReveal>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/70 px-4 py-2 shadow-sm backdrop-blur-sm">
                <span className="h-2 w-2 rounded-full bg-rellia-mint" aria-hidden />
                <span className="font-host-grotesk text-xs font-semibold uppercase tracking-[0.18em] text-rellia-teal">
                  {faq.badge}
                </span>
              </div>
              <h1 className="text-black text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight mb-5">
                {faq.title}
              </h1>
              <p className="font-urbanist text-black/60 text-base md:text-lg leading-relaxed max-w-2xl">
                {faq.subtitle}
              </p>
            </ScrollReveal>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-white">
          <div className="max-w-[1300px] mx-auto px-6 md:px-10">
            <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
              <div className="lg:w-[340px] lg:shrink-0">
                <ScrollReveal>
                  <div className="lg:sticky lg:top-28">
                    <h3 className="font-host-grotesk font-bold text-black text-2xl md:text-3xl tracking-tight mb-4">
                      {faq.sidebarTitle}
                    </h3>
                    <p className="font-urbanist text-black/60 text-base leading-relaxed mb-6">
                      {faq.sidebarBody}
                    </p>
                    <Link
                      to={faq.sidebarCtaPath}
                      className="inline-flex items-center justify-center rounded-full bg-rellia-teal text-white font-host-grotesk font-semibold px-7 py-3 border-2 border-rellia-teal hover:bg-white hover:text-rellia-teal transition-all duration-200 text-sm"
                    >
                      {faq.sidebarCtaLabel}
                    </Link>
                  </div>
                </ScrollReveal>
              </div>

              <div className="flex-1 min-w-0">
                <ScrollReveal delay={0.1}>
                  <div className="rounded-3xl border border-black/5 bg-white/80 shadow-sm">
                    <Accordion type="single" collapsible defaultValue={firstId}>
                      {faq.items.map((item, index) => (
                        <AccordionItem
                          key={item.id}
                          value={item.id}
                          className={index === faq.items.length - 1 ? "border-b-0" : undefined}
                        >
                          <AccordionTrigger className="text-left text-base md:text-lg font-medium text-black py-5 px-5 md:px-6">
                            {item.question}
                          </AccordionTrigger>
                          <AccordionContent className="px-5 md:px-6 pb-5 text-black/70 font-urbanist text-sm md:text-base leading-relaxed">
                            {item.answer}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                </ScrollReveal>
              </div>
            </div>
          </div>
        </section>

        <RelliaCta
          title={faq.bottomTitle}
          body={faq.bottomBody}
          primary={{ label: faq.bottomCtaLabel, to: faq.bottomCtaPath }}
        />
      </main>

      <Footer />
    </div>
  );
}
