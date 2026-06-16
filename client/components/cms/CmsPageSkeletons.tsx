import type { ReactNode } from "react"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { cn } from "@/lib/utils"
import { CmsTextSkeleton } from "@/components/cms/CmsTextSkeleton"

export const CmsPulseBlock = ({ className }: { className?: string }) => (
  <CmsTextSkeleton className={cn("bg-black/5", className)} aria-hidden />
)

type CmsPageShellProps = {
  children: ReactNode
  darkHeroNav?: boolean
  forceSolidNav?: boolean
  className?: string
}

export const CmsPageShell = ({
  children,
  darkHeroNav,
  forceSolidNav,
  className,
}: CmsPageShellProps) => (
  <div className={cn("min-h-screen overflow-x-hidden bg-white font-host-grotesk", className)}>
    <Navbar darkHeroNav={darkHeroNav} forceSolid={forceSolidNav} />
    <main id="main-content" aria-busy="true" aria-label="Loading page content">
      {children}
    </main>
    <Footer />
  </div>
)

export const CmsPageHeaderSkeleton = ({ variant = "dark" }: { variant?: "dark" | "light" }) => {
  const isDark = variant === "dark"
  return (
    <section
      className={cn(
        "relative overflow-hidden px-6 pb-12 pt-24 md:px-10 md:pb-16 md:pt-32",
        isDark
          ? "bg-gradient-to-br from-[#071f26] via-rellia-teal to-[#144853]"
          : "bg-gradient-to-br from-rellia-greyTeal via-rellia-cream to-white",
      )}
      aria-hidden
    >
      <div className="relative z-10 mx-auto max-w-[1300px]">
        <CmsPulseBlock className="mb-5 h-7 w-36 rounded-full" />
        <CmsPulseBlock className="h-12 w-full max-w-3xl md:h-14" />
        <CmsPulseBlock className="mt-5 h-6 w-full max-w-2xl" />
        <CmsPulseBlock className="mt-3 h-6 w-11/12 max-w-xl" />
      </div>
    </section>
  )
}

export const CmsHomePageSkeleton = () => (
  <CmsPageShell darkHeroNav>
    <section className="relative min-h-[88vh] overflow-hidden bg-rellia-teal" aria-hidden>
      <div className="absolute inset-0 bg-black/35" />
      <div className="relative z-10 mx-auto flex min-h-[88vh] max-w-[1300px] flex-col justify-end px-6 pb-16 pt-28 md:px-10 md:pb-20 md:pt-36">
        <CmsPulseBlock className="h-14 w-full max-w-4xl bg-white/15 md:h-16" />
        <CmsPulseBlock className="mt-4 h-14 w-full max-w-3xl bg-white/15 md:h-16" />
        <CmsPulseBlock className="mt-8 h-6 w-full max-w-xl bg-white/15" />
        <CmsPulseBlock className="mt-3 h-6 w-10/12 max-w-lg bg-white/15" />
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <CmsPulseBlock className="h-12 w-full rounded-full bg-white/20 sm:w-44" />
          <CmsPulseBlock className="h-12 w-full rounded-full bg-white/15 sm:w-40" />
        </div>
      </div>
    </section>

    <section className="border-b border-black/10 bg-white px-6 py-16 md:px-10 md:py-24" aria-hidden>
      <div className="mx-auto max-w-[1300px]">
        <CmsPulseBlock className="mx-auto h-8 w-48" />
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-black/10 p-6">
              <CmsPulseBlock className="h-10 w-10 rounded-xl" />
              <CmsPulseBlock className="mt-4 h-6 w-3/4" />
              <CmsPulseBlock className="mt-3 h-4 w-full" />
              <CmsPulseBlock className="mt-2 h-4 w-11/12" />
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="bg-rellia-cream/40 px-6 py-16 md:px-10 md:py-24" aria-hidden>
      <div className="mx-auto max-w-[1300px]">
        <CmsPulseBlock className="h-9 w-56" />
        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-2">
          <CmsPulseBlock className="aspect-[16/10] w-full rounded-2xl" />
          <div className="space-y-4">
            <CmsPulseBlock className="h-8 w-2/3" />
            <CmsPulseBlock className="h-4 w-full" />
            <CmsPulseBlock className="h-4 w-full" />
            <CmsPulseBlock className="h-4 w-10/12" />
          </div>
        </div>
      </div>
    </section>
  </CmsPageShell>
)

export const CmsNetworkLandingSkeleton = () => (
  <CmsPageShell>
    <section className="border-b border-black/[0.06] bg-white lg:min-h-[72vh]" aria-hidden>
      <div className="mx-auto grid max-w-[1300px] grid-cols-1 lg:grid-cols-2 lg:min-h-[72vh]">
        <div className="flex flex-col justify-center px-6 py-16 md:px-10 md:py-20">
          <CmsPulseBlock className="h-7 w-32 rounded-full" />
          <CmsPulseBlock className="mt-6 h-12 w-full max-w-lg md:h-14" />
          <CmsPulseBlock className="mt-4 h-6 w-full max-w-md" />
          <CmsPulseBlock className="mt-2 h-6 w-11/12 max-w-sm" />
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <CmsPulseBlock className="h-12 w-full rounded-full sm:w-44" />
            <CmsPulseBlock className="h-12 w-full rounded-full sm:w-40" />
          </div>
        </div>
        <CmsPulseBlock className="min-h-[280px] w-full lg:min-h-full" />
      </div>
    </section>

    <div className="border-b border-black/[0.06] bg-white py-5" aria-hidden>
      <div className="mx-auto flex max-w-[1300px] gap-4 overflow-hidden px-6 md:px-10">
        {Array.from({ length: 6 }).map((_, i) => (
          <CmsPulseBlock key={i} className="h-10 w-28 shrink-0 rounded-lg" />
        ))}
      </div>
    </div>

    {Array.from({ length: 2 }).map((_, sectionIndex) => (
      <section
        key={sectionIndex}
        className={cn(
          "px-6 py-16 md:px-10 md:py-24",
          sectionIndex % 2 === 0 ? "bg-white" : "bg-rellia-cream/35",
        )}
        aria-hidden
      >
        <div className="mx-auto max-w-[1300px]">
          <CmsPulseBlock className="h-9 w-64" />
          <CmsPulseBlock className="mt-4 h-5 w-full max-w-2xl" />
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            {Array.from({ length: 3 }).map((__, cardIndex) => (
              <div key={cardIndex} className="rounded-2xl border border-black/10 p-6">
                <CmsPulseBlock className="h-10 w-10 rounded-xl" />
                <CmsPulseBlock className="mt-4 h-6 w-3/4" />
                <CmsPulseBlock className="mt-3 h-4 w-full" />
                <CmsPulseBlock className="mt-2 h-4 w-10/12" />
              </div>
            ))}
          </div>
        </div>
      </section>
    ))}
  </CmsPageShell>
)

export const CmsAboutPageSkeleton = () => (
  <CmsPageShell>
    <CmsPageHeaderSkeleton variant="light" />
    <section className="px-6 py-16 md:px-10 md:py-24" aria-hidden>
      <div className="mx-auto max-w-[1300px]">
        <CmsPulseBlock className="h-9 w-56" />
        <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2">
          <CmsPulseBlock className="h-48 w-full rounded-2xl" />
          <div className="space-y-3">
            <CmsPulseBlock className="h-4 w-full" />
            <CmsPulseBlock className="h-4 w-full" />
            <CmsPulseBlock className="h-4 w-10/12" />
          </div>
        </div>
      </div>
    </section>
    <section className="bg-rellia-cream/30 px-6 py-16 md:px-10 md:py-24" aria-hidden>
      <div className="mx-auto max-w-[1300px]">
        <CmsPulseBlock className="mx-auto h-9 w-48" />
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="overflow-hidden rounded-2xl border border-black/10">
              <CmsPulseBlock className="aspect-square w-full" />
              <div className="space-y-3 p-5">
                <CmsPulseBlock className="h-5 w-2/3" />
                <CmsPulseBlock className="h-4 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  </CmsPageShell>
)

export const CmsCareersPageSkeleton = () => (
  <CmsPageShell>
    <CmsPageHeaderSkeleton variant="dark" />
    <section className="border-t border-black/10 bg-white px-6 py-16 md:px-10 md:py-24" aria-hidden>
      <div className="mx-auto max-w-[1300px]">
        <CmsPulseBlock className="h-9 w-56" />
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-black/10 p-6">
              <CmsPulseBlock className="h-10 w-10 rounded-xl" />
              <CmsPulseBlock className="mt-4 h-6 w-3/4" />
              <CmsPulseBlock className="mt-3 h-4 w-full" />
            </div>
          ))}
        </div>
      </div>
    </section>
    <section className="border-t border-black/10 bg-white px-6 py-16 md:px-10 md:py-24" aria-hidden>
      <div className="mx-auto max-w-[1300px]">
        <CmsPulseBlock className="h-9 w-44" />
        <CmsPulseBlock className="mt-4 h-5 w-full max-w-xl" />
        <div className="mt-10 space-y-4 md:space-y-5">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="overflow-hidden rounded-[22px] border border-black/10 bg-white p-5 shadow-sm md:px-7 md:py-6">
              <CmsPulseBlock className="h-7 w-2/3 max-w-md" />
              <div className="mt-4 flex flex-wrap gap-2">
                <CmsPulseBlock className="h-7 w-28 rounded-full" />
                <CmsPulseBlock className="h-7 w-36 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  </CmsPageShell>
)

export const CmsCollectionPageSkeleton = () => (
  <CmsPageShell darkHeroNav>
    <CmsPageHeaderSkeleton variant="dark" />
    <section className="px-6 py-10 md:px-10 md:py-14" aria-hidden>
      <div className="mx-auto max-w-[1300px]">
        <CmsPulseBlock className="h-8 w-48" />
        <CmsPulseBlock className="mt-8 aspect-[21/9] w-full rounded-2xl" />
      </div>
    </section>
    <section className="px-6 pb-16 md:px-10 md:pb-20" aria-hidden>
      <div className="mx-auto max-w-[1300px]">
        <CmsPulseBlock className="h-8 w-40" />
        <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <CmsPulseBlock className="h-12 w-full rounded-2xl md:w-80" />
          <CmsPulseBlock className="h-5 w-40" />
        </div>
        <CmsStoryGridSkeleton className="mt-8" />
      </div>
    </section>
  </CmsPageShell>
)

export const CmsProfileBodySkeleton = ({
  variant = "founder",
}: {
  variant?: "founder" | "advisor"
}) => (
  <article
    className="mt-8 grid items-start gap-10 pb-8 lg:grid-cols-[minmax(280px,360px)_minmax(0,1fr)] lg:gap-x-14 xl:grid-cols-[400px_1fr]"
    aria-busy="true"
    aria-label="Loading profile"
  >
    <div className="space-y-6 lg:sticky lg:top-28" aria-hidden>
      {variant === "founder" ? (
        <CmsPulseBlock className="h-24 w-full max-w-[280px]" />
      ) : (
        <CmsPulseBlock className="aspect-square w-full max-w-[320px] rounded-2xl" />
      )}
      <CmsPulseBlock className="h-8 w-3/4" />
      <CmsPulseBlock className="h-5 w-1/2" />
      <div className="space-y-3 border-t border-black/10 pt-6">
        <CmsPulseBlock className="h-5 w-full" />
        <CmsPulseBlock className="h-5 w-5/6" />
      </div>
      <div className="flex items-center gap-3 border-t border-black/10 pt-6">
        <CmsPulseBlock className="h-12 w-12 rounded-full" />
        <CmsPulseBlock className="h-12 w-12 rounded-full" />
        <CmsPulseBlock className="h-12 w-12 rounded-full" />
        <CmsPulseBlock className="ml-auto h-12 w-12 rounded-full" />
      </div>
    </div>
    <div className="space-y-10" aria-hidden>
      <div className="space-y-4">
        <CmsPulseBlock className="h-8 w-56" />
        <CmsPulseBlock className="h-4 w-full" />
        <CmsPulseBlock className="h-4 w-full" />
        <CmsPulseBlock className="h-4 w-11/12" />
        <CmsPulseBlock className="h-4 w-10/12" />
      </div>
      <div className="space-y-4">
        <CmsPulseBlock className="h-7 w-48" />
        <CmsPulseBlock className="h-28 w-full rounded-2xl" />
      </div>
    </div>
  </article>
)

export const CmsProfilePageSkeleton = ({
  variant = "founder",
}: {
  variant?: "founder" | "advisor"
}) => (
  <CmsPageShell forceSolidNav>
    <div className="px-6 pt-24 md:px-10 md:pt-28" aria-hidden>
      <div className="mx-auto max-w-[1300px]">
        <CmsPulseBlock className="h-5 w-40" />
        <CmsProfileBodySkeleton variant={variant} />
      </div>
    </div>
  </CmsPageShell>
)

export const CmsOpenRolesListSkeleton = ({
  className,
  count = 3,
}: {
  className?: string
  count?: number
}) => (
  <div
    className={cn("space-y-4 md:space-y-5", className)}
    aria-busy="true"
    aria-label="Loading open roles"
  >
    {Array.from({ length: count }).map((_, index) => (
      <div
        key={index}
        className="overflow-hidden rounded-[22px] border border-black/10 bg-white p-5 shadow-sm md:px-7 md:py-6"
        aria-hidden
      >
        <CmsPulseBlock className="h-7 w-2/3 max-w-md" />
        <div className="mt-4 flex flex-wrap gap-2">
          <CmsPulseBlock className="h-7 w-28 rounded-full" />
          <CmsPulseBlock className="h-7 w-36 rounded-full" />
        </div>
      </div>
    ))}
  </div>
)

export const CmsCareersRoleBodySkeleton = () => (
  <div className="mx-auto max-w-[900px]" aria-busy="true" aria-label="Loading role details">
    <CmsPulseBlock className="mt-8 h-10 w-full max-w-2xl" aria-hidden />
    <div className="mt-5 flex flex-wrap gap-2" aria-hidden>
      <CmsPulseBlock className="h-7 w-28 rounded-full" />
      <CmsPulseBlock className="h-7 w-40 rounded-full" />
    </div>
    <div className="mt-10 space-y-4" aria-hidden>
      <CmsPulseBlock className="h-4 w-full" />
      <CmsPulseBlock className="h-4 w-full" />
      <CmsPulseBlock className="h-4 w-11/12" />
      <CmsPulseBlock className="mt-6 h-28 w-full rounded-2xl" />
      <div className="mt-8 flex gap-3">
        <CmsPulseBlock className="h-14 w-44 rounded-full" />
        <CmsPulseBlock className="h-14 w-14 rounded-full" />
      </div>
    </div>
  </div>
)

export const CmsCareersRoleSkeleton = () => (
  <CmsPageShell>
    <section className="px-6 pb-16 pt-24 md:px-10 md:pb-24 md:pt-32" aria-hidden>
      <div className="mx-auto max-w-[900px]">
        <CmsPulseBlock className="h-5 w-36" />
        <CmsCareersRoleBodySkeleton />
      </div>
    </section>
  </CmsPageShell>
)

export const CmsStoryPostArticleSkeleton = () => (
  <>
    <section
      className="relative overflow-hidden rounded-b-[2.5rem] bg-gradient-to-br from-[#071f26] via-rellia-teal to-[#144853] px-6 pb-12 pt-24 text-white md:rounded-b-[3.5rem] md:px-10 md:pb-16 md:pt-32"
      aria-busy="true"
      aria-label="Loading story"
    >
      <div className="mx-auto max-w-[1100px]" aria-hidden>
        <CmsPulseBlock className="h-7 w-28 rounded-full bg-white/15" />
        <CmsPulseBlock className="mt-6 h-12 w-full max-w-3xl bg-white/15 md:h-14" />
        <CmsPulseBlock className="mt-4 h-6 w-full max-w-2xl bg-white/15" />
        <CmsPulseBlock className="mt-8 aspect-[16/10] w-full max-w-3xl rounded-2xl bg-white/10" />
        <div className="mt-8 flex flex-wrap gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <CmsPulseBlock key={i} className="h-12 w-12 rounded-full bg-white/15" />
          ))}
        </div>
      </div>
    </section>
    <section className="px-6 py-10 md:px-10 md:py-14" aria-hidden>
      <div className="mx-auto max-w-[900px] space-y-4">
        <CmsPulseBlock className="h-5 w-32" />
        <CmsPulseBlock className="h-4 w-full" />
        <CmsPulseBlock className="h-4 w-full" />
        <CmsPulseBlock className="h-4 w-11/12" />
        <CmsPulseBlock className="mt-6 h-4 w-full" />
        <CmsPulseBlock className="h-4 w-full" />
        <CmsPulseBlock className="h-4 w-10/12" />
      </div>
    </section>
  </>
)

export const CmsStoryPostSkeleton = () => (
  <CmsPageShell>
    <CmsStoryPostArticleSkeleton />
  </CmsPageShell>
)

export const CmsEventDetailBodySkeleton = ({
  withTopOffset = true,
}: {
  withTopOffset?: boolean
}) => (
  <>
    <section
      className={cn(
        "bg-white px-6 pb-10 md:px-10 md:pb-14",
        withTopOffset && "pt-24 md:pt-28",
      )}
      aria-busy="true"
      aria-label="Loading event"
    >
      <div className="mx-auto max-w-[1300px]" aria-hidden>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_380px]">
          <div>
            <CmsPulseBlock className="h-7 w-32 rounded-full" />
            <CmsPulseBlock className="mt-5 h-12 w-full max-w-3xl md:h-14" />
            <CmsPulseBlock className="mt-4 h-6 w-full max-w-2xl" />
            <div className="mt-8 flex flex-wrap gap-3">
              <CmsPulseBlock className="h-10 w-36 rounded-full" />
              <CmsPulseBlock className="h-10 w-40 rounded-full" />
            </div>
            <div className="mt-10 flex flex-wrap gap-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <CmsPulseBlock key={i} className="h-12 w-12 rounded-full" />
              ))}
            </div>
          </div>
          <CmsPulseBlock className="aspect-[4/3] w-full rounded-2xl lg:aspect-square" />
        </div>
      </div>
    </section>
    <section className="border-t border-black/10 bg-white px-6 py-14 md:px-10 md:py-20" aria-hidden>
      <div className="mx-auto max-w-[900px] space-y-4">
        <CmsPulseBlock className="h-8 w-56" />
        <CmsPulseBlock className="h-4 w-full" />
        <CmsPulseBlock className="h-4 w-full" />
        <CmsPulseBlock className="h-4 w-11/12" />
      </div>
    </section>
  </>
)

export const CmsEventDetailSkeleton = () => (
  <CmsPageShell>
    <div className="bg-white px-6 pt-24 md:px-10 md:pb-14 md:pt-28" aria-hidden>
      <div className="mx-auto max-w-[1300px]">
        <CmsPulseBlock className="h-5 w-36" />
        <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_380px]">
          <div>
            <CmsPulseBlock className="h-7 w-32 rounded-full" />
            <CmsPulseBlock className="mt-5 h-12 w-full max-w-3xl md:h-14" />
            <CmsPulseBlock className="mt-4 h-6 w-full max-w-2xl" />
            <div className="mt-8 flex flex-wrap gap-3">
              <CmsPulseBlock className="h-10 w-36 rounded-full" />
              <CmsPulseBlock className="h-10 w-40 rounded-full" />
            </div>
            <div className="mt-10 flex flex-wrap gap-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <CmsPulseBlock key={i} className="h-12 w-12 rounded-full" />
              ))}
            </div>
          </div>
          <CmsPulseBlock className="aspect-[4/3] w-full rounded-2xl lg:aspect-square" />
        </div>
      </div>
    </div>
    <section className="border-t border-black/10 bg-white px-6 py-14 md:px-10 md:py-20" aria-hidden>
      <div className="mx-auto max-w-[900px] space-y-4">
        <CmsPulseBlock className="h-8 w-56" />
        <CmsPulseBlock className="h-4 w-full" />
        <CmsPulseBlock className="h-4 w-full" />
        <CmsPulseBlock className="h-4 w-11/12" />
      </div>
    </section>
  </CmsPageShell>
)

export const CmsModularSectionsSkeleton = () => (
  <div className="px-6 py-16 md:px-10 md:py-24" aria-busy="true" aria-label="Loading page content">
    <div className="mx-auto max-w-[900px] space-y-6" aria-hidden>
      <CmsPulseBlock className="h-10 w-2/3" />
      <CmsPulseBlock className="h-5 w-full" />
      <CmsPulseBlock className="h-5 w-11/12" />
      <CmsPulseBlock className="mt-8 h-48 w-full rounded-2xl" />
      <CmsPulseBlock className="h-40 w-full rounded-2xl" />
    </div>
  </div>
)

export const CmsStoryGridSkeleton = ({
  className,
  count = 6,
}: {
  className?: string
  count?: number
}) => (
  <div
    className={cn("grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-8 xl:grid-cols-3", className)}
    aria-hidden
  >
    {Array.from({ length: count }).map((_, index) => (
      <div key={index} className="overflow-hidden rounded-2xl border border-black/10">
        <CmsPulseBlock className="aspect-[16/10] w-full rounded-none" />
        <div className="space-y-3 p-5">
          <CmsPulseBlock className="h-4 w-20 rounded-full" />
          <CmsPulseBlock className="h-6 w-4/5" />
          <CmsPulseBlock className="h-4 w-full" />
        </div>
      </div>
    ))}
  </div>
)

export const CmsHorizontalCardListSkeleton = ({
  className,
  count = 4,
}: {
  className?: string
  count?: number
}) => (
  <div className={cn("flex flex-col gap-8", className)} aria-hidden>
    {Array.from({ length: count }).map((_, index) => (
      <div
        key={index}
        className="grid grid-cols-1 overflow-hidden rounded-2xl border border-black/10 md:grid-cols-[280px_1fr]"
      >
        <CmsPulseBlock className="aspect-[16/10] w-full rounded-none md:aspect-auto md:min-h-[180px]" />
        <div className="space-y-3 p-6">
          <CmsPulseBlock className="h-4 w-24 rounded-full" />
          <CmsPulseBlock className="h-7 w-3/4" />
          <CmsPulseBlock className="h-4 w-full" />
          <CmsPulseBlock className="h-4 w-10/12" />
        </div>
      </div>
    ))}
  </div>
)

export const CmsFeaturedStoriesSkeleton = ({ compact = false }: { compact?: boolean }) => (
  <section
    className={cn(
      "bg-rellia-teal px-6 py-14 md:px-10 md:py-20",
      compact && "py-10 md:py-14",
    )}
    aria-busy="true"
    aria-label="Loading featured stories"
  >
    <div className="mx-auto max-w-[1300px]" aria-hidden>
      <CmsPulseBlock className="h-8 w-48 bg-white/15" />
      <CmsPulseBlock className="mt-8 aspect-[21/9] w-full rounded-2xl bg-white/10" />
      <CmsPulseBlock className="mt-6 h-8 w-2/3 max-w-xl bg-white/15" />
      <CmsPulseBlock className="mt-4 h-5 w-full max-w-2xl bg-white/15" />
    </div>
  </section>
)

export const CmsModularPageSkeleton = () => (
  <CmsPageShell forceSolidNav>
    <CmsModularSectionsSkeleton />
  </CmsPageShell>
)
