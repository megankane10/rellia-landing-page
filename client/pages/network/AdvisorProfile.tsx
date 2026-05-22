import { useEffect, useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RelliaAction from "@/components/RelliaAction";
import { ArrowLeft, MapPin, Calendar, Copy, Check } from "lucide-react";
import {
  GlobeFilled,
  LinkedInFilled,
} from "@/components/icons/SocialIcons";
import { ShareIconCopy } from "@/components/share/sharePageIcons";
import { ADVISOR_DIRECTORY_SEED } from "@/data/advisorDirectory";
import { allowCmsSeedFallbacks } from "@/lib/deploymentEnv";
import NotFound from "../NotFound";
import { cn } from "@/lib/utils";
import {
  buildPageUrl,
  clampMetaDescription,
  clampMetaTitle,
  resolveSocialOgImageUrl,
} from "@/config/seo";
import { useOptionalPageSeo } from "@/context/PageSeoContext";
import { useAdvisors } from "@/hooks/useCmsDocuments";
import { isCmsQueryLoading } from "@/lib/cmsQueryState";
import CmsPageLoadingShell from "@/components/cms/CmsPageLoadingShell";
import { isSanityConfigured } from "@/lib/sanity";

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
  ) as any[];
  const active = advisors.find((a) => a.id === id);

  const canonicalUrl = buildPageUrl(location.pathname);
  const [copied, setCopied] = useState(false);
  const { setPageSeo } = useOptionalPageSeo();

  useEffect(() => {
    if (!active) return;
    setPageSeo({
      title: clampMetaTitle(`${active.name} — Rellia Health | Advisors`),
      description: clampMetaDescription(active.focus),
      ogImage: resolveSocialOgImageUrl(active.photoSrc),
    });
    return () => setPageSeo(null);
  }, [active, setPageSeo]);

  if (isSanityConfigured() && isCmsQueryLoading(advisorsQuery)) {
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
              to="/advisors/directory"
              className="inline-flex items-center gap-2 font-host-grotesk text-sm font-bold text-rellia-teal hover:underline hover:underline-offset-4"
            >
              <ArrowLeft className="h-4 w-4" /> Back to Advisors Directory
            </Link>
          </div>
          <article className="grid gap-10 lg:grid-cols-[minmax(280px,360px)_minmax(0,1fr)] lg:gap-x-14 xl:grid-cols-[400px_1fr]">
            {/* Left Sidebar - Sticky */}
            <div className="flex flex-col gap-6 lg:sticky lg:top-32 lg:self-start">
              <div className="overflow-hidden rounded-2xl aspect-[4/5] w-full max-h-[min(42vh,440px)]">
                <img
                  src={active.photoSrc}
                  alt={`Portrait of ${active.name}`}
                  width={400}
                  height={500}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover object-top"
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

                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="inline-flex rounded-full border border-rellia-teal/20 bg-rellia-mint/20 px-3 py-1 font-urbanist text-xs font-semibold text-rellia-teal">
                    {active.filter}
                  </span>
                  {active.industries.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex rounded-full border border-black/10 bg-black/[0.03] px-3 py-1 font-urbanist text-xs font-semibold text-black/70"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-black/70">
                    <MapPin className="h-5 w-5 text-rellia-teal shrink-0" />
                    <span className="font-urbanist text-base font-medium text-black/75">
                      {active.location && active.country 
                        ? `${active.location}, ${Array.isArray(active.country) ? active.country.join(", ") : active.country}` 
                        : (active.location || (Array.isArray(active.country) ? active.country.join(", ") : active.country))}
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
                  <a
                    href={active.linkedInUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white text-black hover:bg-black/5 transition-colors"
                    aria-label="LinkedIn Profile"
                  >
                    <LinkedInFilled className="h-5 w-5" />
                  </a>
                  {active.websiteUrl && (
                    <a
                      href={active.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white text-black hover:bg-black/5 transition-colors"
                      aria-label="Website"
                    >
                      <GlobeFilled className="h-5 w-5" />
                    </a>
                  )}
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

            {/* Right Content - Rich Text Area */}
            <div className="min-w-0 space-y-10 pb-8 prose prose-lg max-w-none prose-headings:font-host-grotesk prose-headings:text-black prose-p:font-urbanist prose-p:text-black/80 prose-p:leading-relaxed prose-li:font-urbanist prose-li:text-black/80">
              <section>
                <h3 className="mb-3 text-2xl font-semibold">About</h3>
                <p>{active.bio}</p>
                <div className="rounded-2xl bg-rellia-cream/35 px-5 py-6 mt-8 border border-black/5 not-prose">
                  <h3 className="font-host-grotesk text-sm font-semibold uppercase tracking-[0.12em] text-black/55 mb-2">
                    Snapshot
                  </h3>
                  <p className="font-urbanist text-base leading-relaxed text-black/80">
                    {active.focus}
                  </p>
                </div>
              </section>

              <section>
                <h3 className="mb-3 text-2xl font-semibold">How they mentor</h3>
                <p>{active.mentoringStyle}</p>
              </section>

              <section>
                <h3 className="mb-3 text-2xl font-semibold">Highlights</h3>
                <ul className="list-disc pl-5">
                  {active.highlights.map((line) => (
                    <li key={line.slice(0, 40)}>{line}</li>
                  ))}
                </ul>
              </section>
            </div>
          </article>

          <div className="mt-16 pt-8 border-t border-black/10">
            <Link
              to="/advisors/directory"
              className="inline-flex items-center gap-2 font-host-grotesk text-sm font-bold text-rellia-teal hover:underline hover:underline-offset-4"
            >
              <ArrowLeft className="h-4 w-4" /> Back to Advisors Directory
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
