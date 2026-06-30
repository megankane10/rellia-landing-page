import { useEffect, useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft, MapPin, Calendar } from "lucide-react";
import { ProfileSocialLinks } from "@/components/network/ProfileSocialLinks";
import { SharePageButton } from "@/components/share/SharePageButton";
import { ADVISOR_DIRECTORY_SEED } from "@/data/advisorDirectory";
import { allowCmsSeedFallbacks } from "@/lib/deploymentEnv";
import NotFound from "../NotFound";
import {
  buildPageUrl,
  clampMetaDescription,
  resolveShareOgImage,
} from "@/config/seo";
import { resolveAdvisorProfileSeo } from "@shared/cms/itemDetailSeo";
import { useApplyCmsSeo } from "@/hooks/useApplyCmsSeo";
import PageSocialHelmet from "@/components/seo/PageSocialHelmet";
import { useAdvisors } from "@/hooks/useCmsDocuments";
import { isCmsQueryLoading } from "@/lib/cmsQueryState";
import ScrollReveal from "@/components/ScrollReveal"
import { CmsProfileBodySkeleton } from "@/components/cms/CmsPageSkeletons"
import { isSanityConfigured } from "@/lib/sanity";
import ImageExpandModal from "@/components/ImageExpandModal";
import { PortableRichText } from "@/components/PortableRichText";
import RelatedAdvisors from "@/components/related/RelatedAdvisors";
import { normalizeToPortableText } from "@shared/cms/normalizePortableText";
import type { SanityPortableText } from "@shared/cms/types";
import { resolveAdvisorPrimaryTag } from "@/lib/resolveAdvisorPrimaryTag";
import { portableTextToPlainText } from "@shared/cms/portableTextPlain"
import { relliaProfilePrimaryTagClass } from "@/lib/relliaMetaBadge"

const resolveAdvisorProfileDescription = (
  snapshot?: string,
  bio?: unknown,
): string => {
  if (typeof snapshot === "string" && snapshot.trim()) return snapshot.trim()
  if (typeof bio === "string" && bio.trim()) return bio.trim()
  return portableTextToPlainText(bio)
}

export default function AdvisorProfile() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const advisorsQuery = useAdvisors();
  const { data: cmsAdvisors } = advisorsQuery;
  const advisors = (
    Array.isArray(cmsAdvisors) && cmsAdvisors.length > 0
      ? cmsAdvisors
      : allowCmsSeedFallbacks()
        ? ADVISOR_DIRECTORY_SEED
        : []
  ) as typeof ADVISOR_DIRECTORY_SEED;
  const active = advisors.find((a) => a.id === id);

  const canonicalUrl = buildPageUrl(location.pathname);
  const [activeImage, setActiveImage] = useState<{ src: string; alt: string } | null>(null);
  const [hasRelatedProfiles, setHasRelatedProfiles] = useState(false);

  const snapshotText =
    typeof active?.snapshot === "string" && active.snapshot.trim()
      ? active.snapshot.trim()
      : undefined;

  const profileDescription = active
    ? resolveAdvisorProfileDescription(snapshotText, active.bio)
    : "";

  const advisorSeo = active
    ? resolveAdvisorProfileSeo({
        name: active.name,
        snapshot: snapshotText,
        bio: active.bio,
        photoSrc: active.photoSrc,
        seo: (active as { seo?: import("@shared/cms/types").SeoContent }).seo,
      })
    : null

  const advisorOgImage = advisorSeo?.ogImageSrc
    ? resolveShareOgImage(advisorSeo.ogImageSrc, { landscape: true })
    : resolveShareOgImage(undefined, { landscape: true })

  useApplyCmsSeo(null, advisorSeo ? {
    title: advisorSeo.title,
    description: advisorSeo.description,
    ogImage: advisorOgImage?.url,
  } : undefined);

  useEffect(() => {
    if (id) {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [id]);

  if (isSanityConfigured() && isCmsQueryLoading(advisorsQuery)) {
    return (
      <div className="min-h-screen overflow-x-clip bg-white font-host-grotesk">
        <Navbar forceSolid />
        <main id="main-content" className="pt-24 md:pt-28">
          <div className="mx-auto max-w-[1300px] px-6 md:px-10">
            <ScrollReveal className="mb-8">
              <Link
                to="/advisors/directory"
                replace
                className="inline-flex items-center gap-2 font-host-grotesk text-sm font-bold text-rellia-teal hover:underline hover:underline-offset-4"
              >
                <ArrowLeft className="h-4 w-4" /> Back to Advisors Directory
              </Link>
            </ScrollReveal>
            <CmsProfileBodySkeleton variant="advisor" />
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!active) return <NotFound />;

  const bioPortable: SanityPortableText | null = Array.isArray(active.bio)
    ? active.bio
    : typeof active.bio === "string" && active.bio.trim()
      ? normalizeToPortableText(active.bio)
      : null;

  const primaryTag = resolveAdvisorPrimaryTag(active);
  const industryTags = Array.isArray(active.industries)
    ? active.industries.map((tag: string) => tag.trim()).filter(Boolean)
    : [];

  return (
    <div className="min-h-screen overflow-x-clip bg-white font-host-grotesk">
      <PageSocialHelmet
        title={advisorSeo?.title ?? active.name}
        description={advisorSeo?.description ?? clampMetaDescription(
          profileDescription || "Advisor profile in the Rellia Health mentor directory.",
        )}
        canonical={canonicalUrl}
        ogImage={advisorOgImage?.url}
        ogImageWidth={advisorOgImage?.width}
        ogImageHeight={advisorOgImage?.height}
      />
      <Navbar forceSolid />

      <main id="main-content" className="pt-24 md:pt-28">
        <div className="mx-auto max-w-[1300px] px-6 md:px-10">
          <div className="mb-8">
            <Link
              to="/advisors/directory"
              replace
              className="inline-flex items-center gap-2 font-host-grotesk text-sm font-bold text-rellia-teal hover:underline hover:underline-offset-4"
            >
              <ArrowLeft className="h-4 w-4" /> Back to Advisors Directory
            </Link>
          </div>
          <article className="grid items-start gap-10 pb-8 lg:grid-cols-[minmax(280px,360px)_minmax(0,1fr)] lg:gap-x-14 lg:pb-12 xl:grid-cols-[400px_1fr]">
            {/* Left Sidebar - Sticky */}
            <div className="space-y-4 lg:sticky lg:top-28 lg:self-start">
              <div className="rounded-3xl border border-black/10 bg-white p-6 md:p-7">
              <div 
                onClick={() => setActiveImage({ src: active.photoSrc, alt: `Portrait of ${active.name}` })}
                className="overflow-hidden rounded-xl aspect-[4/5] w-full max-h-[min(42vh,440px)] cursor-pointer bg-black/[0.02]"
              >
                <img
                  src={active.photoSrc}
                  alt={`Portrait of ${active.name}`}
                  width={400}
                  height={500}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover object-top hover:opacity-95 transition-opacity duration-200"
                />
              </div>

              <div className="pt-2">
                <h1 className="font-host-grotesk text-3xl font-bold tracking-tight text-black mb-1">
                  {active.name}
                </h1>
                <p className="font-urbanist text-base font-medium text-black/75">
                  {active.organization}
                </p>
                <p className="font-urbanist text-base text-black/60 mb-5">
                  {active.role}
                </p>

                {primaryTag || industryTags.length > 0 ? (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {primaryTag ? (
                      <span className={relliaProfilePrimaryTagClass}>
                        {primaryTag}
                      </span>
                    ) : null}
                    {industryTags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex rounded-full border border-black/10 bg-rellia-cream/50 px-3 py-1 font-urbanist text-xs font-semibold text-black/70"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                ) : null}

                <div className="space-y-4">
                  {Array.isArray(active.countries) && active.countries.length > 0 && (
                    <div className="flex items-center gap-3 text-black/70">
                      <MapPin className="h-5 w-5 text-rellia-teal shrink-0" />
                      <span className="font-urbanist text-base font-medium text-black/75">
                        {active.countries.join(", ")}
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
              </div>
            </div>

              <div className="flex items-center gap-3 px-1">
                <ProfileSocialLinks
                  links={active.socialLinks}
                  email={(active as { email?: string }).email}
                  size="comfortable"
                />
                <SharePageButton
                  url={canonicalUrl}
                  title={advisorSeo?.title}
                  variant="light"
                />
              </div>
            </div>

            {/* Right Content - Rich Text Area */}
            <div className="min-w-0 space-y-10 pb-8 prose prose-lg max-w-none prose-headings:font-host-grotesk prose-headings:text-black prose-p:font-urbanist prose-p:text-black/80 prose-p:leading-relaxed prose-li:font-urbanist prose-li:text-black/80">
              {snapshotText ? (
                <section className="not-prose">
                  <div className="rounded-2xl border border-black/5 bg-rellia-cream/35 px-5 py-6">
                    <h3 className="mb-2 font-host-grotesk text-sm font-semibold uppercase tracking-[0.12em] text-rellia-teal">
                      Snapshot
                    </h3>
                    <p className="font-urbanist text-base leading-relaxed text-black/80 md:text-lg">
                      {snapshotText}
                    </p>
                  </div>
                </section>
              ) : null}

              {bioPortable ? (
                <section className="scroll-mt-28">
                  <h3 className="mb-4 font-host-grotesk text-2xl font-semibold text-black not-prose">
                    About the advisor
                  </h3>
                  <PortableRichText value={bioPortable} />
                </section>
              ) : null}
            </div>
          </article>

          {!hasRelatedProfiles ? (
            <div className="mt-16 border-t border-black/10 pt-8 pb-16 md:pb-16">
              <Link
                to="/advisors/directory"
                replace
                className="inline-flex items-center gap-2 font-host-grotesk text-sm font-bold text-rellia-teal hover:underline hover:underline-offset-4"
              >
                <ArrowLeft className="h-4 w-4" /> Back to Advisors Directory
              </Link>
            </div>
          ) : null}
        </div>

        <RelatedAdvisors
          currentAdvisorId={active.id}
          primaryTag={primaryTag}
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
