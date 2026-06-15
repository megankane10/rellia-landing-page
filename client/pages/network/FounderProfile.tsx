import { useEffect, useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft, MapPin, Calendar } from "lucide-react";
import { ProfileSocialLinks } from "@/components/network/ProfileSocialLinks";
import { ShareCopyLinkButton } from "@/components/share/ShareCopyLinkButton";
import { shareOutlineButtonClassName } from "@/components/share/sharePageIcons";
import { FOUNDER_DIRECTORY } from "@/data/founderDirectory";
import { allowCmsSeedFallbacks } from "@/lib/deploymentEnv";
import NotFound from "../NotFound";
import {
  buildAlumniProfileSeoTitle,
  buildPageUrl,
  clampMetaDescription,
  resolveShareOgImageUrl,
} from "@/config/seo";
import { useApplyCmsSeo } from "@/hooks/useApplyCmsSeo";
import PageSocialHelmet from "@/components/seo/PageSocialHelmet";
import { useAlumniCompanies } from "@/hooks/useCmsDocuments";
import { isCmsQueryLoading } from "@/lib/cmsQueryState";
import CmsPageLoadingShell from "@/components/cms/CmsPageLoadingShell";
import { isSanityConfigured } from "@/lib/sanity";
import ImageExpandModal from "@/components/ImageExpandModal";
import { PortableRichText } from "@/components/PortableRichText";
import RelatedAlumniCompanies from "@/components/related/RelatedAlumniCompanies";
import { getFounderPrimaryTag } from "@/data/founderDirectory";
import { relliaProfilePrimaryTagClass } from "@/lib/relliaMetaBadge";
import { normalizeToPortableText } from "@shared/cms/normalizePortableText";

export default function FounderProfile() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const companiesQuery = useAlumniCompanies();
  const { data: cmsCompanies } = companiesQuery;
  const cmsActive = Array.isArray(cmsCompanies) ? cmsCompanies.find((c: any) => c?.id === id) : null;
  const active =
    cmsActive
      ? {
          ...cmsActive,
          id: cmsActive.id,
          slug: cmsActive.id,
          logoName: cmsActive.name,
        }
      : allowCmsSeedFallbacks()
        ? FOUNDER_DIRECTORY.find((c) => c.id === id)
        : undefined;

  const canonicalUrl = buildPageUrl(location.pathname);
  const [activeImage, setActiveImage] = useState<{ src: string; alt: string } | null>(null);
  const [hasRelatedProfiles, setHasRelatedProfiles] = useState(false);

  useApplyCmsSeo(null, active ? {
    title: buildAlumniProfileSeoTitle(active.logoName),
    description: clampMetaDescription(active.shortDescription),
    ogImage: resolveShareOgImageUrl(active.logoSrc),
  } : undefined);

  useEffect(() => {
    if (id) {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [id]);

  if (isSanityConfigured() && isCmsQueryLoading(companiesQuery)) {
    return <CmsPageLoadingShell />;
  }

  if (!active) return <NotFound />;

  const sidebarBlurb =
    (typeof active.tagline === "string" && active.tagline.trim()) ||
    (typeof (active as { shortDescription?: string }).shortDescription === "string" &&
      (active as { shortDescription: string }).shortDescription.trim()) ||
    "";

  const profileBodyPortable = normalizeToPortableText(
    (active as { profileBody?: unknown }).profileBody,
  );

  return (
    <div className="min-h-screen overflow-x-clip bg-white font-host-grotesk">
      <PageSocialHelmet
        title={buildAlumniProfileSeoTitle(active.logoName)}
        description={clampMetaDescription(active.shortDescription)}
        canonical={canonicalUrl}
        ogImage={resolveShareOgImageUrl(active.logoSrc)}
      />
      <Navbar forceSolid />

      <main id="main-content" className="pt-24 md:pt-28">
        <div className="mx-auto max-w-[1300px] px-6 md:px-10">
          <div className="mb-8">
            <Link
              to="/founders/alumni"
              replace
              className="inline-flex items-center gap-2 font-host-grotesk text-sm font-bold text-rellia-teal hover:underline hover:underline-offset-4"
            >
              <ArrowLeft className="h-4 w-4" /> Back to Alumni List
            </Link>
          </div>
          <article className="grid items-start gap-10 pb-8 lg:grid-cols-[minmax(280px,360px)_minmax(0,1fr)] lg:gap-x-14 lg:pb-12 xl:grid-cols-[400px_1fr]">
            {/* Left Sidebar - Sticky */}
            <div className="flex flex-col gap-6 pb-4 lg:sticky lg:top-28 lg:self-start lg:pb-10">
              <div className="flex min-h-[120px] items-center justify-start md:min-h-[140px]">
                <img
                  src={active.logoSrc}
                  alt={`${active.logoName} logo`}
                  width={280}
                  height={120}
                  loading="lazy"
                  decoding="async"
                  onClick={() => setActiveImage({ src: active.logoSrc, alt: `${active.logoName} logo` })}
                  className="max-h-[120px] w-auto max-w-full object-contain object-left opacity-90 cursor-pointer hover:opacity-95 transition-opacity duration-200"
                />
              </div>
              <div className="pt-2">
                <h1 className="font-host-grotesk text-3xl font-bold tracking-tight text-black mb-2">
                  {active.logoName}
                </h1>
                {sidebarBlurb ? (
                  <p className="font-urbanist text-base font-medium text-black/70 mb-6 leading-relaxed">
                    {sidebarBlurb}
                  </p>
                ) : null}
                <div className="flex flex-wrap gap-2 mb-6">
                  {(Array.isArray((active as { specialtyTags?: string[] }).specialtyTags)
                    ? (active as { specialtyTags: string[] }).specialtyTags
                    : []
                  ).map((s) => (
                    <span
                      key={s}
                      className={relliaProfilePrimaryTagClass}
                    >
                      {s}
                    </span>
                  ))}
                  {(Array.isArray((active as { businessModels?: string[] }).businessModels)
                    ? (active as { businessModels: string[] }).businessModels
                    : []
                  ).map((bm) => (
                    <span
                      key={bm}
                      className="inline-flex rounded-full border border-black/10 bg-black/[0.03] px-3 py-1 font-urbanist text-xs font-semibold text-black/70"
                    >
                      {bm}
                    </span>
                  ))}
                </div>

                <div className="space-y-4">
                  {Array.isArray((active as { countries?: string[] }).countries) &&
                    (active as { countries: string[] }).countries.length > 0 && (
                    <div className="flex items-center gap-3 text-black/70">
                      <MapPin className="h-5 w-5 text-rellia-teal shrink-0" />
                      <span className="font-urbanist text-base font-medium text-black/75">
                        {(active as { countries: string[] }).countries.filter(Boolean).join(", ")}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-3 text-black/70">
                    <Calendar className="h-5 w-5 text-rellia-teal shrink-0" />
                    <span className="font-urbanist text-base font-medium text-black/75">
                      Joined {active.yearJoined}
                    </span>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-black/10 flex items-center gap-3">
                  <ProfileSocialLinks
                    links={(active as { socialLinks?: Array<{ platform?: string; label?: string; url?: string }> }).socialLinks}
                    email={(active as { email?: string }).email}
                  />
                  <ShareCopyLinkButton
                    onCopy={() => navigator.clipboard.writeText(canonicalUrl)}
                    className={shareOutlineButtonClassName}
                    idleLabel="Copy profile link"
                    copiedLabel="Link copied"
                  />
                </div>
              </div>
            </div>

            {/* Right Content - Structured Layout */}
            <div className="min-w-0 space-y-10 pb-8 prose prose-lg max-w-none prose-headings:font-host-grotesk prose-headings:text-black prose-p:font-urbanist prose-p:text-black/80 prose-p:leading-relaxed">
              


              {/* 1. Meet the Founders */}
              <section className="not-prose scroll-mt-28">
                <h3 className="mb-4 text-2xl font-host-grotesk font-semibold text-black flex items-center gap-2">
                  Meet the founders
                </h3>
                <div className="overflow-hidden rounded-2xl border border-black/8 bg-white divide-y divide-black/8">
                  {active.founders.map((f, i) => {
                    const avatarUrl = f.imageSrc || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop"
                    return (
                      <div
                        key={i}
                        className="group flex items-center gap-3.5 p-4 sm:gap-4"
                      >
                        <div
                          onClick={() => setActiveImage({ src: avatarUrl, alt: f.name })}
                          className="relative h-14 w-14 shrink-0 cursor-pointer overflow-hidden rounded-xl border border-black/8 bg-black/[0.02] sm:h-16 sm:w-16"
                        >
                          <img
                            src={avatarUrl}
                            alt={f.name}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="font-host-grotesk text-base font-bold text-black transition-colors duration-300 group-hover:text-rellia-teal sm:text-lg">
                            {f.name}
                          </h4>
                          <p className="mt-0.5 font-urbanist text-sm font-medium text-rellia-teal">
                            {f.role}
                          </p>
                          {typeof f.bio === "string" && f.bio.trim() ? (
                            <p className="mt-1.5 line-clamp-3 font-urbanist text-sm leading-relaxed text-black/60 sm:line-clamp-none">
                              {f.bio.trim()}
                            </p>
                          ) : null}
                        </div>
                        <ProfileSocialLinks
                          links={Array.isArray(f.socialLinks) ? f.socialLinks : []}
                          email={(f as { email?: string }).email}
                          iconClassName="h-3.5 w-3.5"
                          className="shrink-0 gap-2"
                          showTooltips={false}
                        />
                      </div>
                    )
                  })}
                </div>
              </section>


              {profileBodyPortable ? (
                <section className="scroll-mt-28">
                  <h3 className="mb-4 font-host-grotesk text-2xl font-semibold text-black not-prose">
                    About the company
                  </h3>
                  <PortableRichText value={profileBodyPortable} />
                </section>
              ) : null}

            </div>
          </article>

          {!hasRelatedProfiles ? (
            <div className="mt-16 border-t border-black/10 pt-8 pb-16 md:pb-16">
              <Link
                to="/founders/alumni"
                replace
                className="inline-flex items-center gap-2 font-host-grotesk text-sm font-bold text-rellia-teal hover:underline hover:underline-offset-4"
              >
                <ArrowLeft className="h-4 w-4" /> Back to Alumni List
              </Link>
            </div>
          ) : null}
        </div>

        <RelatedAlumniCompanies
          currentCompanyId={active.id}
          primaryTag={getFounderPrimaryTag(active)}
          onHasRelatedChange={setHasRelatedProfiles}
        />
      </main>

      <Footer />
      <ImageExpandModal
        src={activeImage?.src ?? null}
        alt={activeImage?.alt ?? ""}
        open={Boolean(activeImage)}
        onOpenChange={(open) => !open && setActiveImage(null)}
      />
    </div>
  );
}
