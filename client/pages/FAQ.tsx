import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import RelliaCta from "@/components/RelliaCta";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Link } from "react-router-dom";
import { useFaqPage } from "@/hooks/useCmsDocuments";
import { DEFAULT_FAQ_PAGE } from "@shared/cms/defaults";
import { useApplyCmsSeo } from "@/hooks/useApplyCmsSeo";
import PageHeader from "@/components/PageHeader"
import FaqPageJsonLd from "@/components/seo/FaqPageJsonLd"
import { SectionsRenderer } from "@/components/cms/PageRenderer"
import { ArrowRight } from "lucide-react"
import { cmsDisplayText, isVisualEditingPreview } from "@/lib/cmsStega"

export default function FAQ() {
  const { data } = useFaqPage();
  const faq = data ?? DEFAULT_FAQ_PAGE;
  useApplyCmsSeo(faq.seo);
  const highlightPhrase = "need to know"
  const previewMode = isVisualEditingPreview()
  const titleLower = cmsDisplayText(faq.title ?? "").toLowerCase()
  const highlightIndex = previewMode ? -1 : titleLower.indexOf(highlightPhrase)

  return (
    <div className="min-h-screen bg-white font-host-grotesk overflow-x-hidden">
      <Navbar />

      <main id="main-content">
        <FaqPageJsonLd
          items={faq.items.map((item) => ({
            question: item.question,
            answer: item.answer,
          }))}
        />
        <PageHeader
          variant="dark"
          title={
            previewMode ? (
              cmsDisplayText(faq.title)
            ) : highlightIndex >= 0 ? (
              <>
                {faq.title.slice(0, highlightIndex)}
                <span className="text-rellia-mint">
                  {faq.title.slice(highlightIndex, highlightIndex + highlightPhrase.length)}
                </span>
                {faq.title.slice(highlightIndex + highlightPhrase.length)}
              </>
            ) : (
              cmsDisplayText(faq.title)
            )
          }
          subtitle={faq.subtitle}
        />

        <section className="py-16 md:py-24 bg-white">
          <div className="max-w-[1300px] mx-auto px-6 md:px-10">
            <div className="flex flex-col lg:flex-row lg:items-start gap-12 lg:gap-20">
              <div className="flex-1 min-w-0 order-1 lg:order-2">
                <ScrollReveal>
                  <h2 className="font-host-grotesk text-2xl md:text-[32px] lg:text-[36px] font-semibold leading-tight tracking-tight text-black mb-6 md:mb-8 text-left">
                    Frequently Asked Questions
                  </h2>
                  <div className="rounded-3xl border border-black/10 bg-white px-7 py-0 shadow-sm">
                    <Accordion type="single" collapsible>
                      {faq.items.map((item, index) => (
                        // Tighter first/last padding so the container feels balanced
                        <AccordionItem
                          key={item.id}
                          value={item.id}
                          className={index === faq.items.length - 1 ? "-mx-7 px-7 border-b-0" : "-mx-7 px-7 border-b border-black/10"}
                        >
                          <AccordionTrigger
                            className={[
                              "text-left text-base md:text-lg font-medium text-black",
                              "py-4 md:py-5",
                              "min-h-[64px] md:min-h-[72px]",
                              "[&>span:first-child]:line-clamp-2 [&>span:first-child]:leading-snug",
                            ].join(" ")}
                          >
                            {cmsDisplayText(item.question)}
                          </AccordionTrigger>
                          <AccordionContent
                            className={[
                              "pb-5 text-black/70 font-urbanist text-sm md:text-base leading-relaxed",
                            ].join(" ")}
                          >
                            {cmsDisplayText(item.answer)}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                </ScrollReveal>
              </div>

              <div className="lg:w-[320px] lg:shrink-0 lg:self-start order-2 lg:order-1">
                <ScrollReveal>
                  <div className="lg:sticky lg:top-28">
                    <h3 className="font-host-grotesk font-semibold text-black text-lg md:text-xl tracking-tight mb-2.5">
                      {cmsDisplayText(faq.sidebarTitle)}
                    </h3>
                    <p className="font-urbanist text-black/60 text-sm leading-relaxed mb-4">
                      {cmsDisplayText(faq.sidebarBody)}
                    </p>
                    <Link
                      to={faq.sidebarCtaPath}
                      className="inline-flex items-center gap-2 font-host-grotesk text-sm font-semibold text-rellia-teal hover:underline hover:underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rellia-mint focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                    >
                      {cmsDisplayText(faq.sidebarCtaLabel)}
                      <ArrowRight className="h-4 w-4" aria-hidden />
                    </Link>
                  </div>
                </ScrollReveal>
              </div>
            </div>
          </div>
        </section>

        {faq.sections?.length ? <SectionsRenderer sections={faq.sections} /> : null}

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
