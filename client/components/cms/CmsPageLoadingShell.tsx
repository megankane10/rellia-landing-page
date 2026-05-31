import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { cn } from "@/lib/utils"

type CmsPageLoadingShellProps = {
  className?: string
}

export default function CmsPageLoadingShell({ className }: CmsPageLoadingShellProps) {
  return (
    <div
      className={cn(
        "min-h-screen overflow-x-hidden bg-white font-host-grotesk",
        className,
      )}
    >
      <Navbar />
      <main id="main-content" className="pt-28 md:pt-36">
        <div className="mx-auto max-w-[900px] px-6 md:px-10">
          <div className="h-10 w-2/3 animate-pulse rounded-xl bg-black/5" />
          <div className="mt-6 h-5 w-full animate-pulse rounded-lg bg-black/5" />
          <div className="mt-3 h-5 w-11/12 animate-pulse rounded-lg bg-black/5" />
          <div className="mt-10 h-40 w-full animate-pulse rounded-2xl bg-black/5" />
        </div>
      </main>
      <Footer />
    </div>
  )
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
