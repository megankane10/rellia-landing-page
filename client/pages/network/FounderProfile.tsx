import { useParams, Link, useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft, MapPin, Calendar } from "lucide-react";
import {
  GlobeFilled,
  ShareFilled,
  LinkedInFilled,
} from "@/components/icons/SocialIcons";
import { FOUNDER_DIRECTORY } from "@/data/founderDirectory";
import NotFound from "../NotFound";
import { cn } from "@/lib/utils";
import RouteSeo from "@/components/RouteSeo";
import { getSiteUrl } from "@/config/seo";
import { useAlumniCompanies } from "@/hooks/useCmsDocuments"

export default function FounderProfile() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const { data: cmsCompanies } = useAlumniCompanies()
  const cmsActive = Array.isArray(cmsCompanies) ? cmsCompanies.find((c: any) => c?.id === id) : null
  const active =
    cmsActive
      ? {
          ...cmsActive,
          id: cmsActive.id,
          slug: cmsActive.id,
          logoName: cmsActive.name,
        }
      : FOUNDER_DIRECTORY.find((c) => c.id === id)

  const canonicalUrl = `${getSiteUrl()}${location.pathname}`;

  if (!active) return <NotFound />;

  const handleShare = () => {
    if (typeof window !== "undefined" && navigator.share) {
      navigator
        .share({
          title: active.logoName,
          text: active.tagline,
          url: canonicalUrl,
        })
        .catch(console.error);
    } else if (typeof window !== "undefined") {
      navigator.clipboard.writeText(canonicalUrl);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-white font-host-grotesk">
      <Navbar />

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
                  <span className="inline-flex rounded-full border border-rellia-teal/20 bg-rellia-mint/20 px-3 py-1 font-urbanist text-xs font-semibold text-rellia-teal">
                    {active.level}
                  </span>
                  {active.specialties.map((s) => (
                    <span
                      key={s}
                      className="inline-flex rounded-full border border-black/10 bg-black/[0.03] px-3 py-1 font-urbanist text-xs font-semibold text-black/70"
                    >
                      {s}
                    </span>
                  ))}
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-black/70">
                    <MapPin className="h-5 w-5 text-rellia-teal" />
                    <span className="font-urbanist text-base font-medium">
                      {active.country}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-black/70">
                    <Calendar className="h-5 w-5 text-rellia-teal" />
                    <span className="font-urbanist text-base font-medium">
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
                    onClick={handleShare}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white text-black hover:bg-black/5 transition-colors"
                    aria-label="Share"
                  >
                    <ShareFilled className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Right Content - Rich Text Area */}
            <div className="min-w-0 space-y-10 pb-8 prose prose-lg max-w-none prose-headings:font-host-grotesk prose-headings:text-black prose-p:font-urbanist prose-p:text-black/80 prose-p:leading-relaxed">
              <section>
                <h3 className="mb-3 text-2xl font-semibold">Overview</h3>
                <p>{active.longDescription}</p>
              </section>

              <section className="not-prose">
                <h3 className="mb-4 text-2xl font-host-grotesk font-semibold text-black">
                  Meet the founders
                </h3>
                <div
                  className={cn(
                    "grid grid-cols-1 gap-12",
                    active.founders.length > 1 && "md:grid-cols-2",
                  )}
                >
                  {active.founders.map((f, i) => (
                    <div
                      key={i}
                      className="flex flex-col sm:flex-row gap-6 items-stretch"
                    >
                      <div className="shrink-0 w-24 h-24 sm:w-32 sm:h-32 overflow-hidden rounded-2xl border border-black/5 shadow-sm">
                        <img
                          src={f.imageSrc}
                          alt={f.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 flex flex-col justify-between py-1">
                        <div>
                          <h4 className="font-host-grotesk text-xl font-bold text-black">
                            {f.name}
                          </h4>
                          <p className="font-host-grotesk text-sm font-semibold text-rellia-teal mt-1">
                            {f.role}
                          </p>
                        </div>

                        {f.linkedinUrl && (
                          <div className="mt-4">
                            <a
                              href={f.linkedinUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-white text-black/40 hover:text-rellia-teal transition-colors"
                            >
                              <LinkedInFilled className="h-4 w-4" />
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h3 className="mb-3 text-2xl font-semibold">
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

              <section>
                <h3 className="mb-3 text-2xl font-semibold">
                  Traction & Roadmap
                </h3>
                <p>{active.traction}</p>
              </section>

              <section>
                <h3 className="mb-3 text-2xl font-semibold">
                  Collaborating through Rellia
                </h3>
                <p>{active.relliaCollaboration}</p>
              </section>
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
