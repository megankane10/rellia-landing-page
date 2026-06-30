import { useMemo } from "react"
import { Link, Navigate, useParams } from "react-router-dom"
import { ArrowRight, ChevronLeft, MapPin } from "lucide-react"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import ScrollReveal from "@/components/ScrollReveal"
import RelliaAction from "@/components/RelliaAction"
import RelliaCta, { optionalCtaAction } from "@/components/RelliaCta"
import { PortableRichText } from "@/components/PortableRichText"
import { SharePageButton } from "@/components/share/SharePageButton"
import { shareHeaderActionHeightClass } from "@/components/share/sharePageIcons"
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
  hasOpenRoleCtaBand,
  isOpenRoleMailtoApplyUrl,
  resolveCareersOpenRoles,
  resolveOpenRoleApplyHref,
} from "@shared/careersOpenRolesVisibility"
import { DEFAULT_CAREERS_PAGE } from "@shared/cms/careersPageDefaults"
import RelatedOpenRoles from "@/components/related/RelatedOpenRoles"
import { MARKETING_PAGE_SHELL_CLASS } from "@/components/related/RelatedContentSection"
import { cn } from "@/lib/utils"

const roleArticleColumnClass = "mx-auto w-full max-w-[900px]"

const roleEmploymentBadgeClass =
  "inline-flex shrink-0 items-center rounded-full border border-rellia-teal/25 bg-rellia-teal/10 px-3 py-1 font-urbanist text-sm font-semibold text-rellia-teal"

const roleLocationBadgeClass =
  "inline-flex max-w-full items-center gap-1.5 rounded-full border border-black/10 bg-black/[0.02] px-3 py-1 font-urbanist text-sm text-black/65"

const roleHighlightsBoxClass =
  "rounded-2xl border border-black/[0.06] bg-rellia-cream/30 px-3 py-4 md:px-5 md:py-5"

const roleHeaderActionHeightClass = shareHeaderActionHeightClass

const roleShareCopyButtonSizeClassName = cn(roleHeaderActionHeightClass, "w-11 shrink-0")

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

  const roleShareSeo = useMemo(
    () => (role ? buildCareersRoleShareMeta(role) : null),
    [role],
  )

  const roleShareMeta = useMemo(() => {
    if (!role || !roleShareSeo) return null
    const descriptionOgImageUrl = roleShareSeo.ogImageUrl?.trim()
    const ogImage = descriptionOgImageUrl
      ? resolveShareOgImage(descriptionOgImageUrl, { landscape: true })
      : undefined
    return {
      title: clampMetaTitle(roleShareSeo.title),
      description: clampMetaDescription(roleShareSeo.description),
      canonical: buildCareersRoleShareUrl(role.id),
      ogImage: ogImage?.url,
      ogImageWidth: ogImage?.width,
      ogImageHeight: ogImage?.height,
    }
  }, [role, roleShareSeo])

  if (isSanityConfigured() && isCmsQueryLoading(careersPageQuery)) {
    return (
      <div className="min-h-screen overflow-x-hidden bg-white font-host-grotesk">
        <Navbar />
        <main id="main-content" className="pt-24 pb-16 md:pt-32 md:pb-24">
          <section className={cn("relative overflow-hidden bg-rellia-cream pb-10 md:pb-14", MARKETING_PAGE_SHELL_CLASS)}>
            <ScrollReveal>
              <div className={roleArticleColumnClass}>
                <Link
                  to="/careers#open-roles"
                  className="inline-flex items-center gap-2 font-host-grotesk text-sm font-semibold text-rellia-teal hover:underline hover:underline-offset-4"
                >
                  <ChevronLeft className="h-4 w-4" aria-hidden />
                  Back to open roles
                </Link>
                <CmsCareersRoleBodySkeleton />
              </div>
            </ScrollReveal>
          </section>
        </main>
        <Footer />
      </div>
    )
  }

  if (!linkedRoleId || !role) {
    return <Navigate to="/careers#open-roles" replace />
  }

  const showRoleCtaBand = hasOpenRoleCtaBand(role)

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

      <main id="main-content" className={cn("flex flex-1 flex-col", showRoleCtaBand ? "" : "pb-16 md:pb-24")}>
        {/* Event-style header shell */}
        <section className="relative overflow-hidden bg-rellia-cream pb-10 pt-24 md:pb-14 md:pt-32 rounded-b-[2.5rem] md:rounded-b-[3.5rem]">
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <div className="absolute -left-28 -top-32 h-[520px] w-[520px] rounded-full bg-rellia-mint/20 blur-3xl" />
            <div className="absolute -right-40 top-1/3 h-[560px] w-[560px] -translate-y-1/2 rounded-full bg-rellia-teal/10 blur-3xl" />
            <div className="absolute bottom-[-220px] left-1/3 h-[620px] w-[620px] -translate-x-1/2 rounded-full bg-rellia-mint/15 blur-3xl" />
            <div className="absolute inset-0 opacity-[0.18] mix-blend-multiply [background-image:radial-gradient(circle_at_20%_10%,rgba(13,53,64,0.10),transparent_55%),radial-gradient(circle_at_80%_35%,rgba(13,53,64,0.08),transparent_52%),radial-gradient(circle_at_40%_95%,rgba(13,53,64,0.09),transparent_55%)]" />
          </div>

          <div className={cn("relative z-10", MARKETING_PAGE_SHELL_CLASS)}>
            <div className={roleArticleColumnClass}>
              <ScrollReveal>
                <Link
                  to="/careers#open-roles"
                  className="inline-flex items-center gap-2 font-host-grotesk text-sm font-semibold text-rellia-teal hover:underline hover:underline-offset-4"
                  aria-label="Back to open roles"
                >
                  <ChevronLeft className="h-4 w-4 shrink-0" aria-hidden />
                  Back to open roles
                </Link>
              </ScrollReveal>

              <ScrollReveal delay={0.05} className="mt-8 md:mt-10">
                <h1 className="w-full min-w-0 font-host-grotesk text-3xl font-medium leading-tight tracking-tight text-rellia-teal md:text-4xl lg:text-5xl">
                  {cmsDisplayText(role.title)}
                </h1>

                {role.excerpt?.trim() ? (
                  <p className="mt-4 max-w-3xl font-urbanist text-base font-medium leading-relaxed text-black/70 md:mt-5 md:text-lg">
                    {cmsDisplayText(role.excerpt)}
                  </p>
                ) : null}

                <div className="mt-6 flex flex-wrap items-center gap-2">
                  <span className={roleEmploymentBadgeClass}>{cmsDisplayText(role.employmentType)}</span>
                  <span className={cn(roleLocationBadgeClass, "truncate")}>
                    <MapPin className="h-3.5 w-3.5 shrink-0 text-rellia-teal" aria-hidden strokeWidth={2.25} />
                    <span className="truncate">{cmsDisplayText(role.location)}</span>
                  </span>
                </div>

                <div className="mt-7 w-full border-t border-black/10 pt-5">
                  <div className="flex w-full min-w-0 flex-nowrap items-stretch gap-3">
                  {hasOpenRoleApplyButton(role) ? (
                    <RelliaAction
                      asChild
                      variant="creamHeaderPrimary"
                      size="compact"
                      className={cn(
                        roleHeaderActionHeightClass,
                        "min-w-0 flex-1 cursor-pointer justify-center whitespace-normal px-4 py-0 text-sm sm:flex-none sm:min-w-[10.5rem] sm:px-6",
                      )}
                    >
                      <a
                        href={resolveOpenRoleApplyHref(role)}
                        {...(isOpenRoleMailtoApplyUrl(role.applyButtonUrl)
                          ? {}
                          : { target: "_blank", rel: "noopener noreferrer" })}
                        className="inline-flex min-w-0 max-w-full items-center justify-center gap-2"
                        aria-label={`${cmsCleanText(role.applyButtonLabel)} for ${cmsCleanText(role.title)}${
                          isOpenRoleMailtoApplyUrl(role.applyButtonUrl)
                            ? " (opens email)"
                            : " (opens in new tab)"
                        }`}
                      >
                        <span className="truncate">{cmsDisplayText(role.applyButtonLabel)}</span>
                        <ArrowRight className="h-5 w-5 shrink-0" aria-hidden />
                      </a>
                    </RelliaAction>
                  ) : null}

                  <SharePageButton
                    url={buildCareersRoleShareUrl(role.id)}
                    title={roleShareMeta?.title}
                    variant="light"
                    sizeClassName={roleShareCopyButtonSizeClassName}
                  />
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* Body uses inner gutter like EventDetail */}
        <section className="bg-white py-10 md:py-14">
          <div className={MARKETING_PAGE_SHELL_CLASS}>
            <div className={roleArticleColumnClass}>
              <ScrollReveal delay={0.1}>
                <PortableRichText
                  value={role.description}
                  className="text-base leading-relaxed text-black/75 md:text-lg prose-headings:font-host-grotesk prose-headings:text-black prose-p:my-4 prose-p:font-urbanist prose-p:text-black/75 prose-strong:text-black prose-ul:my-4 prose-ol:my-4 prose-li:font-urbanist prose-li:text-black/70"
                />

                {role.responsibilities.length > 0 ? (
                  <div className={cn("mt-6", roleHighlightsBoxClass)}>
                    <h2 className="font-host-grotesk text-sm font-semibold uppercase tracking-wider text-black/80">
                      Role highlights
                    </h2>
                    <ul className="mt-3 space-y-2.5 font-urbanist text-sm leading-relaxed text-black/70 md:text-base">
                      {role.responsibilities.map((line) => (
                        <li key={cmsCleanText(line)} className="flex gap-2.5">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-rellia-teal" aria-hidden />
                          <span>{cmsDisplayText(line)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </ScrollReveal>
            </div>
          </div>
        </section>

        <RelatedOpenRoles roles={openRoles} currentRoleId={role.id} />

        {showRoleCtaBand ? (
          <RelliaCta
            aboveSectionTone="white"
            title={cmsDisplayText(role.roleCtaTitle!)}
            body={role.roleCtaBody ? cmsDisplayText(role.roleCtaBody) : undefined}
            primary={optionalCtaAction(role.roleCtaPrimaryLabel, role.roleCtaPrimaryHref)!}
            secondary={optionalCtaAction(role.roleCtaSecondaryLabel, role.roleCtaSecondaryHref)}
          />
        ) : null}
      </main>

      <Footer />
    </div>
  )
}
