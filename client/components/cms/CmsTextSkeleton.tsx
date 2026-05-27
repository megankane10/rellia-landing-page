import { cn } from "@/lib/utils"

type CmsTextSkeletonProps = {
  className?: string
}

export const CmsTextSkeleton = ({ className }: CmsTextSkeletonProps) => (
  <div className={cn("animate-pulse rounded-lg bg-black/10", className)} aria-hidden />
)

export const CmsHeroTextSkeleton = () => (
  <div className="space-y-5" aria-busy="true" aria-label="Loading page content">
    <CmsTextSkeleton className="h-7 w-40 rounded-full" />
    <CmsTextSkeleton className="h-12 w-full max-w-2xl" />
    <CmsTextSkeleton className="h-24 w-full max-w-xl" />
    <div className="flex flex-col gap-3 pt-2 sm:flex-row">
      <CmsTextSkeleton className="h-12 w-full sm:w-44 rounded-full" />
      <CmsTextSkeleton className="h-12 w-full sm:w-40 rounded-full" />
    </div>
  </div>
)

export const CmsLegalBodySkeleton = () => (
  <div className="space-y-8" aria-busy="true" aria-label="Loading document">
    <CmsTextSkeleton className="h-6 w-48" />
    <CmsTextSkeleton className="h-10 w-2/3" />
    <CmsTextSkeleton className="h-32 w-full" />
    <CmsTextSkeleton className="h-32 w-full" />
    <CmsTextSkeleton className="h-32 w-full" />
  </div>
)
