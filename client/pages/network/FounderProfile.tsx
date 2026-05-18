import { useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft, MapPin, Calendar, Copy, Check } from "lucide-react";
import {
  GlobeFilled,
  LinkedInFilled,
} from "@/components/icons/SocialIcons";
import { ShareIconCopy } from "@/components/share/sharePageIcons";
import { FOUNDER_DIRECTORY } from "@/data/founderDirectory";
import NotFound from "../NotFound";
import { cn } from "@/lib/utils";
import RouteSeo from "@/components/RouteSeo";
import { getSiteUrl } from "@/config/seo";
import { useAlumniCompanies } from "@/hooks/useCmsDocuments";

export default function FounderProfile() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const { data: cmsCompanies } = useAlumniCompanies();
  const cmsActive = Array.isArray(cmsCompanies) ? cmsCompanies.find((c: any) => c?.id === id) : null;
  const active =
    cmsActive
      ? {
          ...cmsActive,
          id: cmsActive.id,
          slug: cmsActive.id,
          logoName: cmsActive.name,
        }
      : FOUNDER_DIRECTORY.find((c) => c.id === id);

  const canonicalUrl = `${getSiteUrl()}${location.pathname}`;
  const [copied, setCopied] = useState(false);

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
              className="inline-flex items-center gap-2 font-host-grotesk text-sm font-bold text-rellia-teal hover:underline hover:underline-offset-4"
            >
              <ArrowLeft className="h-4 w-4" /> Back to Alumni List
            </Link>
          </div>
          <article className="grid gap-10 lg:grid-cols-[minmax(280px,360px)_minmax(0,1fr)] lg:gap-x-14 xl:grid-cols-[400px_1fr]">
            {/* Left Sidebar - Sticky */}
            <div className="flex flex-col gap-6 lg:sticky lg:top-32 lg:self-start">
              <RouteSeo
                title={`${active.logoName} — Rellia Health | Alumni`}
                description={active.shortDescription}
              />

              <div className="flex min-h-[120px] items-center justify-start md:min-h-[140px]">
                <img
                  src={active.logoSrc}
                  alt={active.logoName}
                  className="max-h-[120px] w-auto max-w-full object-contain object-left opacity-90"
                />
              </div>
              <div className="pt-2">
                <h2 className="font-host-grotesk text-3xl font-bold tracking-tight text-black mb-6">
                  {active.logoName}
                </h2>
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
                      {(active as any).location && active.country 
                        ? `${(active as any).location}, ${Array.isArray(active.country) ? active.country.join(", ") : active.country}` 
                        : ((active as any).location || (Array.isArray(active.country) ? active.country.join(", ") : active.country))}
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
                    href={active.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white text-black hover:bg-black/5 transition-colors"
                    aria-label="Visit Website"
                  >
                    <GlobeFilled className="h-5 w-5" />
                  </a>
                  {active.linkedinUrl && (
                    <a
                      href={active.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white text-black hover:bg-black/5 transition-colors"
                      aria-label="LinkedIn Company Profile"
                    >
                      <LinkedInFilled className="h-5 w-5" />
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
                      className="group flex flex-col sm:flex-row gap-5 p-5 rounded-2xl border border-black/5 bg-black/[0.01] hover:bg-black/[0.02] hover:border-rellia-teal/20 transition-all duration-300 shadow-sm"
                    >
                      <div className="relative shrink-0 w-24 h-24 sm:w-28 sm:h-28 overflow-hidden rounded-2xl border border-black/5 shadow-inner">
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
                        {f.linkedinUrl && (
                          <div className="mt-3 flex">
                            <a
                              href={f.linkedinUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-rellia-teal/15 bg-rellia-mint/20 text-rellia-teal shadow-sm transition-all duration-300 hover:bg-rellia-teal hover:text-white"
                              aria-label={`Visit ${f.name} on LinkedIn`}
                            >
                              <LinkedInFilled className="h-3.5 w-3.5" />
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* 2. Participated Programs */}
              {Array.isArray(active.programs) && active.programs.length > 0 && (
                <section className="scroll-mt-28">
                  <h3 className="mb-4 text-2xl font-host-grotesk font-semibold text-black">
                    Participated Programs
                  </h3>
                  <div className="flex flex-wrap gap-3 not-prose">
                    {active.programs.map((p, i) => (
                      <div
                        key={i}
                        className="rounded-xl border border-rellia-teal/10 bg-rellia-mint/5 px-4 py-3"
                      >
                        <span className="font-host-grotesk font-bold text-rellia-teal">
                          {p}
                        </span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* 3. Text Box for Remaining Fields - Redesigned to be Seamless */}
              {active.longDescription && (
                <section className="scroll-mt-28">
                  <h3 className="mb-4 text-2xl font-host-grotesk font-semibold text-black">
                    Overview
                  </h3>
                  <p className="font-urbanist text-base leading-relaxed text-black/75">
                    {active.longDescription}
                  </p>
                </section>
              )}

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
              className="inline-flex items-center gap-2 font-host-grotesk text-sm font-bold text-rellia-teal hover:underline hover:underline-offset-4"
            >
              <ArrowLeft className="h-4 w-4" /> Back to Alumni List
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
