import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import RelliaCta from "@/components/RelliaCta";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Link } from "react-router-dom";
import { useFaqPage } from "@/hooks/useCmsDocuments";
import { DEFAULT_FAQ_PAGE } from "@shared/cms/defaults";
import { ArrowRight } from "lucide-react"

export default function FAQ() {
  const { data } = useFaqPage();
  const faq = data ?? DEFAULT_FAQ_PAGE;
  const firstId = faq.items[0]?.id ?? "first";
  const highlightPhrase = "need to know"
  const titleLower = (faq.title ?? "").toLowerCase()
  const highlightIndex = titleLower.indexOf(highlightPhrase)

  return (
    <div className="min-h-screen bg-white font-host-grotesk overflow-x-hidden">
      <Navbar />

      <main id="main-content">
        <section className="relative pt-24 pb-12 md:pt-32 md:pb-16 bg-rellia-cream overflow-hidden">
          <div aria-hidden className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-r from-rellia-cream via-white/60 to-rellia-cream" />
            <div className="absolute -left-28 -top-32 h-[520px] w-[520px] rounded-full bg-rellia-mint/20 blur-3xl" />
            <div className="absolute -right-40 top-1/3 h-[560px] w-[560px] -translate-y-1/2 rounded-full bg-rellia-teal/10 blur-3xl" />
            <div className="absolute left-1/3 bottom-[-220px] h-[620px] w-[620px] -translate-x-1/2 rounded-full bg-rellia-mint/15 blur-3xl" />
            <div className="absolute inset-0 opacity-[0.18] mix-blend-multiply [background-image:radial-gradient(circle_at_20%_10%,rgba(13,53,64,0.10),transparent_55%),radial-gradient(circle_at_80%_35%,rgba(13,53,64,0.08),transparent_52%),radial-gradient(circle_at_40%_95%,rgba(13,53,64,0.09),transparent_55%)]" />
          </div>

          <div className="relative z-10 max-w-[1300px] mx-auto px-6 md:px-10">
            <ScrollReveal>
              <h1 className="text-black text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight mb-5">
                {highlightIndex >= 0 ? (
                  <>
                    {faq.title.slice(0, highlightIndex)}
                    <span className="text-rellia-teal">{faq.title.slice(highlightIndex, highlightIndex + highlightPhrase.length)}</span>
                    {faq.title.slice(highlightIndex + highlightPhrase.length)}
                  </>
                ) : (
                  faq.title
                )}
              </h1>
              <p className="font-urbanist text-black/65 text-base md:text-lg leading-relaxed max-w-3xl">
                {faq.subtitle}
              </p>
            </ScrollReveal>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-white">
          <div className="max-w-[1300px] mx-auto px-6 md:px-10">
            <div className="flex flex-col lg:flex-row lg:items-start gap-12 lg:gap-20">
              <div className="flex-1 min-w-0 order-1 lg:order-2">
                <ScrollReveal delay={0.1}>
                  <Accordion type="single" collapsible defaultValue={firstId}>
                    {faq.items.map((item, index) => (
                      <AccordionItem
                        key={item.id}
                        value={item.id}
                        className={index === faq.items.length - 1 ? "border-b-0" : "border-b border-black/10"}
                      >
                        <AccordionTrigger className="text-left text-base md:text-lg font-medium text-black py-5">
                          {item.question}
                        </AccordionTrigger>
                        <AccordionContent className="pb-5 text-black/70 font-urbanist text-sm md:text-base leading-relaxed">
                          {item.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </ScrollReveal>
              </div>

              <div className="lg:w-[320px] lg:shrink-0 lg:self-start order-2 lg:order-1">
                <ScrollReveal>
                  <div className="lg:sticky lg:top-28">
                    <h3 className="font-host-grotesk font-semibold text-black text-lg md:text-xl tracking-tight mb-2.5">
                      {faq.sidebarTitle}
                    </h3>
                    <p className="font-urbanist text-black/60 text-sm leading-relaxed mb-4">
                      {faq.sidebarBody}
                    </p>
                    <Link
                      to={faq.sidebarCtaPath}
                      className="inline-flex items-center gap-2 font-host-grotesk text-sm font-semibold text-rellia-teal hover:underline hover:underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rellia-mint focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                    >
                      {faq.sidebarCtaLabel}
                      <ArrowRight className="h-4 w-4" aria-hidden />
                    </Link>
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
