import { useMemo } from "react"
import { Link, Navigate, useParams } from "react-router-dom"
import { ArrowRight, ChevronLeft, MapPin } from "lucide-react"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import ScrollReveal from "@/components/ScrollReveal"
import RelliaAction from "@/components/RelliaAction"
import { PortableRichText } from "@/components/PortableRichText"
import { ShareCopyLinkButton } from "@/components/share/ShareCopyLinkButton"
import { shareOutlineButtonClassName } from "@/components/share/sharePageIcons"
import PageSocialHelmet from "@/components/seo/PageSocialHelmet"
import { CmsCareersRoleBodySkeleton } from "@/components/cms/CmsPageSkeletons"
import { useCareersPage } from "@/hooks/useCmsDocuments"
import { isCmsQueryLoading } from "@/lib/cmsQueryState"
import { isSanityConfigured } from "@/lib/sanity"
import { allowCmsSeedFallbacks, isStrictProductionSite } from "@/lib/deploymentEnv"
import { cmsCleanText, cmsDisplayText } from "@/lib/cmsStega"
import {
  buildCareersRoleShareUrl,
  clampMetaDescription,
  clampMetaTitle,
  resolveShareOgImage,
} from "@/config/seo"
import {
  buildCareersRoleShareMeta,
  findCareersOpenRoleById,
} from "@shared/cms/careersRoleShare"
import {
  hasOpenRoleApplyButton,
  isOpenRoleMailtoApplyUrl,
  resolveCareersOpenRoles,
  resolveOpenRoleApplyHref,
} from "@shared/careersOpenRolesVisibility"
import { DEFAULT_CAREERS_PAGE } from "@shared/cms/careersPageDefaults"
import RelatedOpenRoles from "@/components/related/RelatedOpenRoles"
import { cn } from "@/lib/utils"

const roleEmploymentBadgeClass =
  "inline-flex shrink-0 items-center rounded-full border border-rellia-teal/25 bg-rellia-teal/10 px-3 py-1 font-urbanist text-sm font-semibold text-rellia-teal"

const roleLocationBadgeClass =
  "inline-flex max-w-full items-center gap-1.5 rounded-full border border-black/10 bg-black/[0.02] px-3 py-1 font-urbanist text-sm text-black/65"

export default function CareersRoleDetail() {
  const { roleId: roleIdParam } = useParams<{ roleId: string }>()
  const linkedRoleId = roleIdParam?.trim() || undefined
  const careersPageQuery = useCareersPage()
  const careersCms = careersPageQuery.data ?? DEFAULT_CAREERS_PAGE

  const openRoles = useMemo(
    () =>
      resolveCareersOpenRoles(careersCms, {
        allowSeedFallbacks: allowCmsSeedFallbacks(),
        isSanityConfigured: isSanityConfigured(),
        isProductionSite: isStrictProductionSite(),
      }),
    [careersCms],
  )

  const role = useMemo(
    () => findCareersOpenRoleById(openRoles, linkedRoleId),
    [openRoles, linkedRoleId],
  )

  const careersHeroImageSrc =
    careersCms.heroImageSrc?.trim() || DEFAULT_CAREERS_PAGE.heroImageSrc

  const roleShareSeo = useMemo(
    () => (role ? buildCareersRoleShareMeta(role, { heroImageSrc: careersHeroImageSrc }) : null),
    [role, careersHeroImageSrc],
  )

  const roleShareMeta = useMemo(() => {
    if (!role || !roleShareSeo) return null
    const ogImage = resolveShareOgImage(roleShareSeo.ogImageUrl, { landscape: true })
    return {
      title: clampMetaTitle(roleShareSeo.title),
      description: clampMetaDescription(roleShareSeo.description),
      canonical: buildCareersRoleShareUrl(role.id),
      ogImage: ogImage?.url,
      ogImageWidth: ogImage?.width,
      ogImageHeight: ogImage?.height,
    }
  }, [role, roleShareSeo])

  const handleCopyRoleLink = () => {
    if (!role) return
    navigator.clipboard.writeText(buildCareersRoleShareUrl(role.id))
  }

  if (isSanityConfigured() && isCmsQueryLoading(careersPageQuery)) {
    return (
      <div className="min-h-screen overflow-x-hidden bg-white font-host-grotesk">
        <Navbar />
        <main id="main-content" className="pt-24 pb-16 md:pt-32 md:pb-24">
          <section className="px-6 md:px-10">
            <ScrollReveal>
              <Link
                to="/careers#open-roles"
                className="inline-flex items-center gap-2 font-host-grotesk text-sm font-semibold text-rellia-teal hover:underline hover:underline-offset-4"
              >
                <ChevronLeft className="h-4 w-4" aria-hidden />
                Back to open roles
              </Link>
            </ScrollReveal>
            <CmsCareersRoleBodySkeleton />
          </section>
        </main>
        <Footer />
      </div>
    )
  }

  if (!linkedRoleId || !role) {
    return <Navigate to="/careers#open-roles" replace />
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-white font-host-grotesk">
      {roleShareMeta ? (
        <PageSocialHelmet
          title={roleShareMeta.title}
          description={roleShareMeta.description}
          canonical={roleShareMeta.canonical}
          ogImage={roleShareMeta.ogImage}
          ogImageWidth={roleShareMeta.ogImageWidth}
          ogImageHeight={roleShareMeta.ogImageHeight}
        />
      ) : null}

      <Navbar />

      <main id="main-content" className="pt-24 pb-16 md:pt-32 md:pb-24">
        <section className="px-6 md:px-10">
          <div className="mx-auto max-w-[900px]">
            <ScrollReveal>
              <Link
                to="/careers#open-roles"
                className="inline-flex items-center gap-2 font-host-grotesk text-sm font-semibold text-rellia-teal hover:underline hover:underline-offset-4"
                aria-label="Back to open roles"
              >
                <ChevronLeft className="h-4 w-4" aria-hidden />
                Back to open roles
              </Link>
            </ScrollReveal>

            <ScrollReveal delay={0.05} className="mt-8 md:mt-10">
              <h1 className="font-host-grotesk text-2xl font-semibold leading-tight tracking-tight text-black md:text-[40px] lg:text-[44px]">
                {cmsDisplayText(role.title)}
              </h1>

              <div className="mt-5 flex flex-wrap items-center gap-2">
                <span className={roleEmploymentBadgeClass}>
                  {cmsDisplayText(role.employmentType)}
                </span>
                <span className={cn(roleLocationBadgeClass, "truncate")}>
                  <MapPin className="h-3.5 w-3.5 shrink-0 text-rellia-teal" aria-hidden strokeWidth={2.25} />
                  <span className="truncate">{cmsDisplayText(role.location)}</span>
                </span>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.1} className="mt-10 md:mt-12">
              <PortableRichText
                value={role.description}
                className="text-base leading-relaxed text-black/75 md:text-lg prose-headings:font-host-grotesk prose-headings:text-black prose-p:my-4 prose-p:font-urbanist prose-p:text-black/75 prose-strong:text-black prose-ul:my-4 prose-ol:my-4 prose-li:font-urbanist prose-li:text-black/70"
              />

              {role.responsibilities.length > 0 ? (
                <div className="mt-10">
                  <h2 className="font-host-grotesk text-sm font-semibold uppercase tracking-wider text-black/80">
                    Role highlights
                  </h2>
                  <ul className="mt-4 space-y-2.5 font-urbanist text-sm leading-relaxed text-black/70 md:text-base">
                    {role.responsibilities.map((line) => (
                      <li key={cmsCleanText(line)} className="flex gap-2.5">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-rellia-teal" aria-hidden />
                        <span>{cmsDisplayText(line)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              <div className="mt-10 flex flex-col gap-3 border-t border-black/10 pt-8 pb-10 md:pb-12 sm:flex-row sm:items-center sm:gap-4">
                {hasOpenRoleApplyButton(role) ? (
                  <RelliaAction
                    asChild
                    variant="mintTealFill"
                    size="comfortable"
                    className="min-w-0 cursor-pointer justify-center px-10 sm:min-w-[12.5rem]"
                  >
                    <a
                      href={resolveOpenRoleApplyHref(role)}
                      {...(isOpenRoleMailtoApplyUrl(role.applyButtonUrl)
                        ? {}
                        : { target: "_blank", rel: "noopener noreferrer" })}
                      className="inline-flex items-center gap-2"
                      aria-label={`${cmsCleanText(role.applyButtonLabel)} for ${cmsCleanText(role.title)}${
                        isOpenRoleMailtoApplyUrl(role.applyButtonUrl)
                          ? " (opens email)"
                          : " (opens in new tab)"
                      }`}
                    >
                      {cmsDisplayText(role.applyButtonLabel)}
                      <ArrowRight className="h-5 w-5" aria-hidden />
                    </a>
                  </RelliaAction>
                ) : null}

                <ShareCopyLinkButton
                  onCopy={handleCopyRoleLink}
                  className={shareOutlineButtonClassName}
                  idleLabel="Copy role link"
                  copiedLabel="Link copied"
                />
              </div>
            </ScrollReveal>
          </div>
        </section>

        <RelatedOpenRoles roles={openRoles} currentRoleId={role.id} />
      </main>

      <Footer />
    </div>
  )
}
