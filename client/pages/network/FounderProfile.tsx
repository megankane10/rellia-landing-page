import { useEffect, useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft, MapPin, Calendar, Copy, Check } from "lucide-react";
import { ProfileSocialLinks } from "@/components/network/ProfileSocialLinks";
import { ShareIconCopy } from "@/components/share/sharePageIcons";
import { FOUNDER_DIRECTORY } from "@/data/founderDirectory";
import { allowCmsSeedFallbacks, isMainBranchBuild } from "@/lib/deploymentEnv";
import NotFound from "../NotFound";
import { cn } from "@/lib/utils";
import {
  buildPageUrl,
  clampMetaDescription,
  clampMetaTitle,
  resolveSocialOgImageUrl,
} from "@/config/seo";
import { useOptionalPageSeo } from "@/context/PageSeoContext";
import { useAlumniCompanies } from "@/hooks/useCmsDocuments";
import { isCmsQueryLoading } from "@/lib/cmsQueryState";
import CmsPageLoadingShell from "@/components/cms/CmsPageLoadingShell";
import { isSanityConfigured } from "@/lib/sanity";
import ImageExpandModal from "@/components/ImageExpandModal";
import { PortableRichText } from "@/components/PortableRichText";
import type { SanityPortableText } from "@shared/cms/types";

export default function FounderProfile() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const companiesQuery = useAlumniCompanies();
  const { data: cmsCompanies } = companiesQuery;
  const cmsActive = Array.isArray(cmsCompanies) ? cmsCompanies.find((c: any) => c?.id === id) : null;
  const active =
    isMainBranchBuild()
      ? undefined
      : cmsActive
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
  const [copied, setCopied] = useState(false);
  const { setPageSeo } = useOptionalPageSeo();
  const [activeImage, setActiveImage] = useState<{ src: string; alt: string } | null>(null);

  useEffect(() => {
    if (!active) return;
    setPageSeo({
      title: clampMetaTitle(`${active.logoName} - Alumni`),
      description: clampMetaDescription(active.shortDescription),
      ogImage: resolveSocialOgImageUrl(active.logoSrc),
    });
    return () => setPageSeo(null);
  }, [active, setPageSeo]);

  useEffect(() => {
    if (id) {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [id]);

  if (isSanityConfigured() && isCmsQueryLoading(companiesQuery)) {
    return <CmsPageLoadingShell />;
  }

  if (!active) return <NotFound />;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(canonicalUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-white font-host-grotesk">
      <Navbar forceSolid />

      <main id="main-content" className="pt-24 pb-16 md:pt-28">
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
          <article className="grid gap-10 lg:grid-cols-[minmax(280px,360px)_minmax(0,1fr)] lg:gap-x-14 xl:grid-cols-[400px_1fr]">
            {/* Left Sidebar - Sticky */}
            <div className="flex flex-col gap-6 lg:sticky lg:top-32 lg:self-start">
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
                {(active.shortDescription?.trim() || active.tagline?.trim()) && (
                  <p className="font-urbanist text-base font-medium text-black/70 mb-6 leading-relaxed">
                    {active.shortDescription?.trim() || active.tagline}
                  </p>
                )}
                <div className="flex flex-wrap gap-2 mb-6">
                  {active.level && (
                    <span className="inline-flex rounded-full border border-rellia-teal/20 bg-rellia-mint/20 px-3 py-1 font-urbanist text-xs font-semibold text-rellia-teal">
                      {active.level}
                    </span>
                  )}
                  {active.specialties.map((s) => (
                    <span
                      key={s}
                      className="inline-flex rounded-full border border-rellia-teal/20 bg-rellia-mint/20 px-3 py-1 font-urbanist text-xs font-semibold text-rellia-teal"
                    >
                      {s}
                    </span>
                  ))}
                  {Array.isArray((active as any).businessModel) &&
                    (active as any).businessModel.map((bm: string) => (
                      <span
                        key={bm}
                        className="inline-flex rounded-full border border-black/10 bg-black/[0.03] px-3 py-1 font-urbanist text-xs font-semibold text-black/70"
                      >
                        {bm}
                      </span>
                    ))}
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-black/70">
                    <MapPin className="h-5 w-5 text-rellia-teal shrink-0" />
                    <span className="font-urbanist text-base font-medium text-black/75">
                      {(active as any).location?.trim() ||
                        (Array.isArray(active.country)
                          ? active.country.join(", ")
                          : typeof active.country === "string"
                            ? active.country
                            : "")}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-black/70">
                    <Calendar className="h-5 w-5 text-rellia-teal shrink-0" />
                    <span className="font-urbanist text-base font-medium text-black/75">
                      Joined {active.yearJoined}
                    </span>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-black/10 flex items-center gap-3">
                  <ProfileSocialLinks
                    websiteUrl={active.websiteUrl}
                    linkedInUrl={active.linkedinUrl}
                  />
                  <button
                    onClick={handleCopyLink}
                    className={cn(
                      "relative inline-flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-300",
                      copied
                        ? "border-rellia-teal bg-rellia-mint/20 text-rellia-teal"
                        : "border-black/10 bg-white text-black hover:bg-black/5"
                    )}
                    title={copied ? "Copied!" : "Copy profile link"}
                    aria-label={copied ? "Copied!" : "Copy profile link"}
                  >
                    {copied ? (
                      <Check className="h-4 w-4 animate-scale-in" />
                    ) : (
                      <ShareIconCopy className="h-4 w-4" />
                    )}
                    {copied && (
                      <span className="absolute -top-10 left-1/2 -translate-x-1/2 rounded bg-black px-2 py-1 text-xs font-bold text-white shadow-md whitespace-nowrap transition-all duration-200">
                        Copied!
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Right Content - Structured Layout */}
            <div className="min-w-0 space-y-10 pb-8 prose prose-lg max-w-none prose-headings:font-host-grotesk prose-headings:text-black prose-p:font-urbanist prose-p:text-black/80 prose-p:leading-relaxed">
              


              {/* 1. Meet the Founders */}
              <section className="not-prose scroll-mt-28">
                <h3 className="mb-5 text-2xl font-host-grotesk font-semibold text-black flex items-center gap-2">
                  Meet the Founders
                </h3>
                <div className="grid gap-6 sm:grid-cols-2">
                  {active.founders.map((f, i) => (
                    <div
                      key={i}
                      className="group flex flex-row gap-5 p-5 rounded-2xl border border-black/5 bg-black/[0.01] hover:bg-black/[0.02] hover:border-rellia-teal/20 transition-all duration-300 shadow-sm"
                    >
                      <div
                        onClick={() => setActiveImage({ src: f.imageSrc, alt: f.name })}
                        className="relative shrink-0 w-24 h-24 sm:w-28 sm:h-28 overflow-hidden rounded-2xl border border-black/5 shadow-inner cursor-pointer"
                      >
                        <img
                          src={f.imageSrc}
                          alt={f.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="flex-1 flex flex-col justify-between py-0.5">
                        <div>
                          <h4 className="font-host-grotesk text-lg font-bold text-black group-hover:text-rellia-teal transition-colors duration-300">
                            {f.name}
                          </h4>
                          <p className="font-urbanist text-sm font-semibold text-rellia-teal mt-0.5">
                            {f.role}
                          </p>
                        </div>
                        <ProfileSocialLinks
                          links={f.socialLinks}
                          linkedInUrl={f.linkedinUrl}
                          websiteUrl={f.websiteUrl}
                          iconClassName="h-3.5 w-3.5"
                          className="mt-3 gap-2"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </section>


              {(active as { profileBody?: unknown }).profileBody ? (
                <section className="scroll-mt-28">
                  <PortableRichText value={(active as { profileBody: SanityPortableText }).profileBody} />
                </section>
              ) : active.longDescription ? (
                <section className="scroll-mt-28">
                  <h3 className="mb-4 text-2xl font-host-grotesk font-semibold text-black">
                    Overview
                  </h3>
                  <p className="font-urbanist text-base leading-relaxed text-black/75">
                    {active.longDescription}
                  </p>
                </section>
              ) : null}

              {active.traction && (
                <section className="scroll-mt-28">
                  <h3 className="mb-4 text-2xl font-host-grotesk font-semibold text-black">
                    Traction & Roadmap
                  </h3>
                  <p className="font-urbanist text-base leading-relaxed text-black/75">
                    {active.traction}
                  </p>
                </section>
              )}

              {active.relliaCollaboration && (
                <section className="scroll-mt-28">
                  <h3 className="mb-4 text-2xl font-host-grotesk font-semibold text-black">
                    Collaborating through Rellia
                  </h3>
                  <p className="font-urbanist text-base leading-relaxed text-black/75">
                    {active.relliaCollaboration}
                  </p>
                </section>
              )}

            </div>
          </article>

          <div className="mt-16 pt-8 border-t border-black/10">
            <Link
              to="/founders/alumni"
              replace
              className="inline-flex items-center gap-2 font-host-grotesk text-sm font-bold text-rellia-teal hover:underline hover:underline-offset-4"
            >
              <ArrowLeft className="h-4 w-4" /> Back to Alumni List
            </Link>
          </div>
        </div>
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
