import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import MembershipPathTimeline from "@/components/MembershipPathTimeline"
import RelliaAction from "@/components/RelliaAction"
import RelliaCta from "@/components/RelliaCta"
import { FilloutStandardEmbed } from "@fillout/react"
import { FILLOUT_APPLY_FORM_ID, FILLOUT_EMBED_VIEWPORT_MIN_CLASS } from "@/lib/filloutApplyForm"
import { DEFAULT_HOME_PAGE } from "@shared/cms/defaults"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

export default function Apply() {
  const [showForm, setShowForm] = useState(false)

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
                className="border-t border-black/10"
                headingFooter={
                  <RelliaAction
                    type="button"
                    variant="tealFilled"
                    size="comfortable"
                    className="cursor-pointer px-10"
                    onClick={() => setShowForm(true)}
                    aria-label="Show application form"
                  >
                    Apply now
                  </RelliaAction>
                }
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
                  ← Back to membership paths
                </button>
              </div>
              <div className="w-full">
                <FilloutStandardEmbed
                  filloutId={FILLOUT_APPLY_FORM_ID}
                  inheritParameters
                  dynamicResize
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

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


