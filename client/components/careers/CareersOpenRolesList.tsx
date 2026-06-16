import { BriefcaseBusiness } from "lucide-react"
import type { CareersOpenRole } from "@shared/cms/types"
import FilteredListEmptyState from "@/components/FilteredListEmptyState"
import { CareersOpenRoleCard } from "@/components/careers/CareersOpenRoleCard"

export type CareersOpenRolesListProps = {
  roles: CareersOpenRole[]
  formatText?: (value: string) => string
}

const defaultFormatText = (value: string) => value

export const CareersOpenRolesList = ({
  roles,
  formatText = defaultFormatText,
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

  return (
    <div className="flex w-full flex-col gap-4 md:gap-5">
      {roles.map((role) => (
        <CareersOpenRoleCard
          key={role.id}
          role={role}
          formatText={formatText}
          bleedOnMobile
        />
      ))}
    </div>
  )
}
