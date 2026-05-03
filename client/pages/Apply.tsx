import { FilloutStandardEmbed } from "@fillout/react"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import MembershipPathTimeline from "@/components/MembershipPathTimeline"
import RelliaAction from "@/components/RelliaAction"
import RelliaCta from "@/components/RelliaCta"
import { FILLOUT_APPLY_FORM_ID, FILLOUT_EMBED_VIEWPORT_MIN_CLASS } from "@/lib/filloutApplyForm"
import { cn } from "@/lib/utils"
import { DEFAULT_HOME_PAGE } from "@shared/cms/defaults"

const handleScrollToApplication = () => {
  document.getElementById("apply-form")?.scrollIntoView({ behavior: "smooth", block: "start" })
}

export default function Apply() {
  return (
    <div className="flex min-h-screen flex-col bg-white font-host-grotesk">
      <Navbar />

      <main
        id="main-content"
        className="flex w-full flex-1 flex-col pt-[72px] md:pt-[86px]"
      >
        <MembershipPathTimeline
          className="border-t border-black/10"
          headingFooter={
            <RelliaAction
              type="button"
              variant="creamCtaHeroFill"
              size="comfortable"
              className="cursor-pointer px-10"
              onClick={handleScrollToApplication}
              aria-label="Scroll to application form"
            >
              Apply now
            </RelliaAction>
          }
        />

        <div
          id="apply-form"
          className={cn("w-full flex-1 scroll-mt-[88px] md:scroll-mt-[100px]", FILLOUT_EMBED_VIEWPORT_MIN_CLASS)}
        >
          <FilloutStandardEmbed
            filloutId={FILLOUT_APPLY_FORM_ID}
            inheritParameters
            dynamicResize
          />
        </div>

        <RelliaCta
          title="Explore the **Rellia network**"
          body="See how members connect across programs, partners, and resources—or get in touch with questions about membership."
          primary={{
            label: DEFAULT_HOME_PAGE.secondaryCtaLabel,
            to: DEFAULT_HOME_PAGE.secondaryCtaPath,
          }}
          secondary={{ label: "Contact us", to: "/contact" }}
        />
      </main>

      <Footer />
    </div>
  )
}
