import type { ReactNode } from "react"
import { BriefcaseBusiness, MapPin } from "lucide-react"
import type { CareersOpenRole } from "@shared/cms/types"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import FilteredListEmptyState from "@/components/FilteredListEmptyState"
import { PortableRichText } from "@/components/PortableRichText"
import { ShareCopyLinkButton } from "@/components/share/ShareCopyLinkButton"
import { shareOutlineButtonClassName } from "@/components/share/sharePageIcons"
import { cn } from "@/lib/utils"

/** Employment type — teal on white (no mint). */
const roleEmploymentBadgeClass =
  "inline-flex shrink-0 items-center rounded-full border border-rellia-teal/25 bg-rellia-teal/10 px-3 py-1 font-urbanist text-sm font-semibold text-rellia-teal"

/** Location — neutral grey with map pin. */
const roleLocationBadgeClass =
  "inline-flex max-w-full items-center gap-1.5 rounded-full border border-black/10 bg-black/[0.02] px-3 py-1 font-urbanist text-sm text-black/65"

/** Mobile: card bleeds past section padding; inner px keeps title/chevron on the page margin (symmetric). */
const roleCardBleedClass = "-mx-3 md:mx-0"
const roleCardInnerPxClass = "px-3 md:px-7"

export type CareersOpenRolesListProps = {
  roles: CareersOpenRole[]
  onCopyRoleLink: (roleId: string) => void
  accordionValue?: string
  onAccordionValueChange?: (value: string) => void
  formatText?: (value: string) => string
  renderApplyButton: (role: CareersOpenRole) => ReactNode
}

const defaultFormatText = (value: string) => value

export const CareersOpenRolesList = ({
  roles,
  onCopyRoleLink,
  accordionValue,
  onAccordionValueChange,
  formatText = defaultFormatText,
  renderApplyButton,
}: CareersOpenRolesListProps) => {
  if (roles.length === 0) {
    return (
      <FilteredListEmptyState
        className="mt-12"
        icon={BriefcaseBusiness}
        title="No open roles"
        description="No vacant roles are available at the moment. Check back later or follow us on LinkedIn for updates."
      />
    )
  }

  const accordionProps =
    accordionValue !== undefined || onAccordionValueChange
      ? {
          value: accordionValue,
          onValueChange: onAccordionValueChange,
        }
      : {}

  return (
    <Accordion type="single" collapsible className="flex w-full flex-col gap-4 md:gap-5" {...accordionProps}>
      {roles.map((role) => (
        <AccordionItem
          key={role.id}
          id={role.id}
          value={role.id}
          className={cn(
            "overflow-hidden rounded-[22px] border border-black/10 bg-white shadow-sm transition-all duration-300 hover:border-black/15 hover:shadow-md data-[state=open]:border-rellia-teal/25 data-[state=open]:shadow-[0_20px_50px_-24px_rgba(0,0,0,0.18)] data-[state=open]:ring-2 data-[state=open]:ring-rellia-teal/15 border-b-0",
            roleCardBleedClass,
          )}
        >
          <AccordionTrigger
            className={cn(
              "relative items-start gap-2 py-5 hover:no-underline md:gap-4 md:py-6",
              roleCardInnerPxClass,
              "pr-11 md:pr-7",
              "[&>svg]:absolute [&>svg]:right-4 [&>svg]:top-5 [&>svg]:shrink-0 [&>svg]:text-rellia-teal",
              "md:[&>svg]:static md:[&>svg]:mt-1.5",
            )}
          >
            <span className="flex min-w-0 flex-1 flex-col gap-3 text-left md:gap-4">
              <span className="font-host-grotesk text-lg font-semibold leading-snug tracking-tight text-black md:text-xl">
                {formatText(role.title)}
              </span>
              <span className="flex flex-wrap items-center gap-2">
                <span className={roleEmploymentBadgeClass}>
                  {formatText(role.employmentType)}
                </span>
                <span className={cn(roleLocationBadgeClass, "truncate")}>
                  <MapPin className="h-3.5 w-3.5 shrink-0 text-rellia-teal" aria-hidden strokeWidth={2.25} />
                  <span className="truncate">{formatText(role.location)}</span>
                </span>
              </span>
            </span>
          </AccordionTrigger>

          <AccordionContent className={cn("pb-6 pt-0 md:pb-8", roleCardInnerPxClass)}>
            <PortableRichText
              value={role.description}
              className="text-sm leading-relaxed text-black/75 md:text-base prose-headings:font-host-grotesk prose-headings:text-black prose-p:my-3 prose-p:font-urbanist prose-p:text-black/75 prose-strong:text-black prose-ul:my-3 prose-ol:my-3 prose-li:font-urbanist prose-li:text-black/70"
            />

            {role.responsibilities.length > 0 ? (
              <div className="mt-6 rounded-2xl border border-black/[0.06] bg-rellia-cream/30 px-3 py-4 md:px-5 md:py-5">
                <h3 className="font-host-grotesk text-sm font-semibold uppercase tracking-wider text-black/80">
                  Role highlights
                </h3>
                <ul className="mt-3 space-y-2.5 font-urbanist text-sm leading-relaxed text-black/70 md:text-base">
                  {role.responsibilities.map((line) => (
                    <li key={formatText(line)} className="flex gap-2.5">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-rellia-teal" aria-hidden />
                      <span>{formatText(line)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
              {renderApplyButton(role)}

              <ShareCopyLinkButton
                onCopy={() => onCopyRoleLink(role.id)}
                className={shareOutlineButtonClassName}
                idleLabel="Copy role link"
                copiedLabel="Link copied"
              />
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
