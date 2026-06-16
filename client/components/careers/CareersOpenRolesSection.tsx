import type { CareersOpenRole } from "@shared/cms/types"
import type { SanityPortableText } from "@shared/cms/types"
import ScrollReveal from "@/components/ScrollReveal"
import { SectionHeadlinePortable } from "@/components/cms/SectionHeadlinePortable"
import { CareersOpenRolesList } from "@/components/careers/CareersOpenRolesList"
import { CmsOpenRolesListSkeleton } from "@/components/cms/CmsPageSkeletons"
import { HEADING_SECTION } from "@/lib/typography"
import { cn } from "@/lib/utils"
import { cmsDisplayText } from "@/lib/cmsStega"

export type CareersOpenRolesSectionProps = {
  titlePortable: SanityPortableText | string | null | undefined
  subtitle?: string
  roles: CareersOpenRole[]
  formatText?: (value: string) => string
  rolesLoading?: boolean
}

export const CareersOpenRolesSection = ({
  titlePortable,
  subtitle,
  roles,
  formatText,
  rolesLoading = false,
}: CareersOpenRolesSectionProps) => (
  <section id="open-roles" className="scroll-mt-28 mt-16 border-t border-black/10 bg-white pb-16 pt-16 md:mt-20 md:pb-24 md:pt-20">
    <div className="mx-auto w-full max-w-[1300px] px-6 md:px-10">
      <ScrollReveal className="flex min-w-0 flex-col">
        <div className="max-w-2xl">
          <SectionHeadlinePortable
            value={titlePortable}
            className={cn("font-host-grotesk font-semibold tracking-tight text-black", HEADING_SECTION)}
          />
          {subtitle ? (
            <p className="mt-3 font-urbanist text-base leading-relaxed text-black/55 md:text-lg">
              {formatText ? formatText(subtitle) : subtitle}
            </p>
          ) : null}
        </div>

        <div className="mt-10 w-full">
          {rolesLoading ? (
            <CmsOpenRolesListSkeleton />
          ) : (
            <CareersOpenRolesList roles={roles} formatText={formatText} />
          )}
        </div>
      </ScrollReveal>
    </div>
  </section>
)
