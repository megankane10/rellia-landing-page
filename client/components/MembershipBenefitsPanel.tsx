import { cn } from "@/lib/utils"
import { cmsCleanText, cmsDisplayText, isVisualEditingPreview } from "@/lib/cmsStega"
import { MembershipPanelPortableText } from "@/components/MembershipPanelPortableText"
import type { SanityPortableText } from "@shared/cms/types"

const PANEL_IMAGE_SRC = "/images/membership-splash.jpg"

type MembershipBenefitsPanelProps = {
  headline: string
  descriptionPortable: SanityPortableText
  imageEnabled?: boolean
  imageSrc?: string
  className?: string
}

export default function MembershipBenefitsPanel({
  headline,
  descriptionPortable,
  imageEnabled = true,
  imageSrc,
  className,
}: MembershipBenefitsPanelProps) {
  const previewMode = isVisualEditingPreview()
  const resolvedImageSrc = imageSrc?.trim() || PANEL_IMAGE_SRC
  const showImage = imageEnabled && Boolean(resolvedImageSrc)

  return (
    <div
      className={cn(
        "relative flex min-h-[min(520px,calc(100vh-10rem))] flex-1 flex-col overflow-hidden rounded-[1.75rem] bg-rellia-teal",
        className,
      )}
    >
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        {showImage ? (
          <img
            src={resolvedImageSrc}
            alt=""
            className="h-full w-full scale-105 object-cover"
          />
        ) : null}
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-br from-rellia-teal via-[#0c4a4a] to-[#071f26]",
            showImage && "from-rellia-teal/72 via-[#0c4a4a]/58 to-[#071f26]/68",
          )}
        />
        {showImage ? (
          <>
            <div className="absolute inset-0 bg-gradient-to-t from-[#071f26]/55 via-[#071f26]/22 to-transparent" />
            <div className="absolute inset-y-0 left-0 w-full bg-gradient-to-r from-black/35 via-black/12 to-transparent" />
          </>
        ) : (
          <>
            <div className="absolute -left-16 -top-16 h-72 w-72 rounded-full bg-rellia-mint/15 blur-[100px]" />
            <div className="absolute bottom-0 right-0 h-56 w-56 rounded-full bg-rellia-mint/10 blur-[80px]" />
          </>
        )}
      </div>

      <div className="relative z-10 flex min-h-0 flex-1 flex-col justify-end p-8 md:p-10 lg:p-11">
        <div className="max-w-md">
          <h1 className="font-host-grotesk text-[1.75rem] font-semibold leading-tight tracking-tight text-rellia-mint drop-shadow-[0_2px_20px_rgba(0,0,0,0.45)] md:text-[2.125rem]">
            {previewMode ? cmsDisplayText(headline) : cmsCleanText(headline)}
          </h1>
          <div className="mt-5 h-0.5 w-10 bg-rellia-mint md:mt-6" aria-hidden />
        </div>

        <MembershipPanelPortableText value={descriptionPortable} />
      </div>
    </div>
  )
}
