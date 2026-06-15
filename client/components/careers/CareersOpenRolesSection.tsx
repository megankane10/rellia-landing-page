import type { ReactNode } from "react"
import type { CareersOpenRole } from "@shared/cms/types"
import type { SanityPortableText } from "@shared/cms/types"
import ScrollReveal from "@/components/ScrollReveal"
import { SectionHeadlinePortable } from "@/components/cms/SectionHeadlinePortable"
import { CareersOpenRolesList } from "@/components/careers/CareersOpenRolesList"
import { cmsDisplayText } from "@/lib/cmsStega"

export type CareersOpenRolesSectionProps = {
  titlePortable: SanityPortableText | string | null | undefined
  subtitle?: string
  roles: CareersOpenRole[]
  onCopyRoleLink: (roleId: string) => void
  accordionValue?: string
  onAccordionValueChange?: (value: string) => void
  formatText?: (value: string) => string
  renderApplyButton: (role: CareersOpenRole) => ReactNode
}

export const CareersOpenRolesSection = ({
  titlePortable,
  subtitle,
  roles,
  onCopyRoleLink,
  accordionValue,
  onAccordionValueChange,
  formatText,
  renderApplyButton,
}: CareersOpenRolesSectionProps) => (
  <section id="open-roles" className="scroll-mt-28 border-t border-black/10 bg-white py-16 md:py-24">
    <div className="mx-auto w-full max-w-[1300px] px-6 md:px-10">
      <ScrollReveal className="flex min-w-0 flex-col">
        <div className="max-w-2xl">
          <SectionHeadlinePortable
            value={titlePortable}
            className="font-host-grotesk text-2xl font-semibold tracking-tight text-black md:text-[32px]"
          />
          {subtitle ? (
            <p className="mt-3 font-urbanist text-base leading-relaxed text-black/55 md:text-lg">
              {formatText ? formatText(subtitle) : subtitle}
            </p>
          ) : null}
        </div>

        <div className="mt-10 w-full">
          <CareersOpenRolesList
            roles={roles}
            onCopyRoleLink={onCopyRoleLink}
            accordionValue={accordionValue}
            onAccordionValueChange={onAccordionValueChange}
            formatText={formatText}
            renderApplyButton={renderApplyButton}
          />
        </div>
      </ScrollReveal>
    </div>
  </section>
)
