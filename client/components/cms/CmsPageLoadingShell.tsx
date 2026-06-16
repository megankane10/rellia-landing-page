import { cn } from "@/lib/utils"
import {
  CmsAboutPageSkeleton,
  CmsCareersPageSkeleton,
  CmsCareersRoleSkeleton,
  CmsCollectionPageSkeleton,
  CmsEventDetailSkeleton,
  CmsHomePageSkeleton,
  CmsModularPageSkeleton,
  CmsNetworkLandingSkeleton,
  CmsProfilePageSkeleton,
  CmsStoryPostSkeleton,
} from "@/components/cms/CmsPageSkeletons"

export type CmsPageLoadingVariant =
  | "default"
  | "home"
  | "network"
  | "about"
  | "careers"
  | "careers-role"
  | "collection"
  | "profile-founder"
  | "profile-advisor"
  | "story"
  | "event"
  | "modular"

type CmsPageLoadingShellProps = {
  className?: string
  variant?: CmsPageLoadingVariant
}

export default function CmsPageLoadingShell({
  className,
  variant = "default",
}: CmsPageLoadingShellProps) {
  switch (variant) {
    case "home":
      return <CmsHomePageSkeleton />
    case "network":
      return <CmsNetworkLandingSkeleton />
    case "about":
      return <CmsAboutPageSkeleton />
    case "careers":
      return <CmsCareersPageSkeleton />
    case "careers-role":
      return <CmsCareersRoleSkeleton />
    case "collection":
      return <CmsCollectionPageSkeleton />
    case "profile-founder":
      return <CmsProfilePageSkeleton variant="founder" />
    case "profile-advisor":
      return <CmsProfilePageSkeleton variant="advisor" />
    case "story":
      return <CmsStoryPostSkeleton />
    case "event":
      return <CmsEventDetailSkeleton />
    case "modular":
      return <CmsModularPageSkeleton />
    default:
      return <CmsModularPageSkeleton />
  }
}

export const DirectoryFilterSelectSkeleton = () => (
  <div
    className="h-14 w-full animate-pulse rounded-2xl border border-black/10 bg-black/[0.04] md:min-w-[200px]"
    aria-hidden
  />
)

/** Full advisors directory toolbar placeholder — avoids skeletons stacking beside real controls. */
export const AdvisorsDirectoryToolbarSkeleton = () => (
  <div
    className="mb-10 flex flex-col gap-4 md:flex-row md:items-center"
    aria-busy="true"
    aria-label="Loading directory filters"
  >
    <div className="h-14 w-full flex-1 animate-pulse rounded-2xl border border-black/10 bg-black/[0.04]" />
  </div>
)

export const DirectoryGridSkeleton = ({ className, count = 6 }: { className?: string; count?: number }) => (
  <div
    className={cn("mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3", className)}
    aria-hidden
  >
    {Array.from({ length: count }).map((_, index) => (
      <div
        key={index}
        className="overflow-hidden rounded-2xl border border-black/10 bg-black/[0.02]"
      >
        <div className="aspect-[16/10] animate-pulse bg-black/5" />
        <div className="space-y-3 p-6">
          <div className="h-5 w-3/4 animate-pulse rounded-lg bg-black/5" />
          <div className="h-4 w-1/2 animate-pulse rounded-lg bg-black/5" />
          <div className="h-4 w-full animate-pulse rounded-lg bg-black/5" />
        </div>
      </div>
    ))}
  </div>
)
