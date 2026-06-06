import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import MembershipPathTimeline from "@/components/MembershipPathTimeline"
import RelliaAction from "@/components/RelliaAction"
import RelliaCta from "@/components/RelliaCta"
import { FilloutStandardEmbed } from "@fillout/react"
import { FILLOUT_APPLY_FORM_ID, FILLOUT_EMBED_VIEWPORT_MIN_CLASS } from "@/lib/filloutApplyForm"
import { DEFAULT_APPLY_PAGE } from "@shared/cms/defaults"
import { useApplyPage } from "@/hooks/useCmsDocuments"
import { useApplyCmsSeo } from "@/hooks/useApplyCmsSeo"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

export default function Apply() {
  const { data: applyCms } = useApplyPage()
  const apply = applyCms ?? DEFAULT_APPLY_PAGE
  useApplyCmsSeo(apply.seo)
  const [showForm, setShowForm] = useState(false)

  const applyNowButton = (
    <RelliaAction
      type="button"
      variant="mintTealFill"
      size="comfortable"
      className="w-full min-w-0 justify-center sm:min-w-[220px] sm:w-auto sm:px-10"
      onClick={() => setShowForm(true)}
      aria-label={apply.applyButtonLabel}
    >
      {apply.applyButtonLabel}
      <ArrowRight aria-hidden />
    </RelliaAction>
  )

  return (
    <div className="flex min-h-screen flex-col bg-white font-host-grotesk">
      <Navbar />

      <main
        id="main-content"
        className="flex w-full flex-1 flex-col pt-[72px] md:pt-[86px]"
      >
        <AnimatePresence mode="wait">
          {!showForm ? (
            <motion.div
              key="timeline"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <MembershipPathTimeline
                className="border-t-0 bg-white pt-8 md:pt-10 lg:pt-12"
                headingTitle={apply.headingTitle}
                subheading={apply.subheading}
                steps={apply.steps}
                showRoleLinks={apply.showRoleLinks}
                belowTimeline={applyNowButton}
              />
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className={cn("w-full bg-rellia-cream/40 pt-12 pb-4", FILLOUT_EMBED_VIEWPORT_MIN_CLASS)}
            >
              <div className="mx-auto max-w-[1100px] px-6 md:px-10">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="mb-8 font-host-grotesk text-sm font-semibold text-rellia-teal underline-offset-4 hover:underline"
                >
                  ← Back to details
                </button>
              </div>
              <div className="w-full min-h-[700px] md:min-h-[1000px]">
                <FilloutStandardEmbed
                  filloutId={FILLOUT_APPLY_FORM_ID}
                  inheritParameters
                  dynamicResize
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className={cn("bg-white", showForm && "bg-rellia-cream/40")}>
          <RelliaCta
            aboveSectionTone="white"
            title={apply.bottomCtaTitle}
            body={apply.bottomCtaBody}
            primary={{
              label: apply.bottomCtaPrimaryLabel,
              to: apply.bottomCtaPrimaryHref,
            }}
            secondary={{
              label: apply.bottomCtaSecondaryLabel,
              to: apply.bottomCtaSecondaryHref,
            }}
          />
        </div>
      </main>

      <Footer />
    </div>
  )
}


