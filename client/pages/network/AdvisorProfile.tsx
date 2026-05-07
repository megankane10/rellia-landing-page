import { useParams, Link, useLocation } from "react-router-dom"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import RelliaAction from "@/components/RelliaAction"
import { ArrowLeft } from "lucide-react"
import { GlobeFilled, LinkedInFilled, ShareFilled } from "@/components/icons/SocialIcons"
import { ADVISOR_DIRECTORY_SEED } from "@/data/advisorDirectory"
import NotFound from "../NotFound"
import RouteSeo from "@/components/RouteSeo"
import { getSiteUrl } from "@/config/seo"

export default function AdvisorProfile() {
  const { id } = useParams<{ id: string }>()
  const location = useLocation()
  const active = ADVISOR_DIRECTORY_SEED.find((a) => a.id === id)

  const canonicalUrl = `${getSiteUrl()}${location.pathname}`

  if (!active) return <NotFound />

  const handleShare = () => {
    if (typeof window !== "undefined" && navigator.share) {
      navigator.share({
        title: active.name,
        text: active.bio.substring(0, 50) + "...",
        url: canonicalUrl,
      }).catch(console.error);
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
            <Link to="/advisors/directory" className="inline-flex items-center gap-2 font-host-grotesk text-sm font-bold text-rellia-teal hover:underline hover:underline-offset-4">
              <ArrowLeft className="h-4 w-4" /> Back to Advisors Directory
            </Link>
          </div>
          <article className="grid gap-10 lg:grid-cols-[minmax(280px,360px)_minmax(0,1fr)] lg:gap-x-14 xl:grid-cols-[400px_1fr]">
            {/* Left Sidebar - Sticky */}
            <div className="flex flex-col gap-6 lg:sticky lg:top-32 lg:self-start">
              <RouteSeo 
                title={`${active.name} — Rellia Health | Advisors`}
                description={active.focus}
              />
              <div className="overflow-hidden rounded-2xl aspect-[4/5] w-full max-h-[min(56vh,560px)]">
                <img
                  src={active.photoSrc}
                  alt={active.name}
                  className="h-full w-full object-cover object-top"
                />
              </div>
              
              <div className="pt-2">
                <h2 className="font-host-grotesk text-3xl font-bold tracking-tight text-black mb-1">
                  {active.name}
                </h2>
                <p className="font-urbanist text-base font-medium text-black/75">{active.organization}</p>
                <p className="font-urbanist text-base text-black/60 mb-5">{active.role}</p>
                
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

                </div>

                <div className="mt-6 pt-6 border-t border-black/10 flex items-center gap-3">
                  <a href={active.linkedInUrl} target="_blank" rel="noopener noreferrer" className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white text-black hover:bg-black/5 transition-colors" aria-label="LinkedIn Profile">
                    <LinkedInFilled className="h-5 w-5" />
                  </a>
                  {active.websiteUrl && (
                    <a href={active.websiteUrl} target="_blank" rel="noopener noreferrer" className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white text-black hover:bg-black/5 transition-colors" aria-label="Website">
                      <GlobeFilled className="h-5 w-5" />
                    </a>
                  )}
                  <button onClick={handleShare} className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white text-black hover:bg-black/5 transition-colors" aria-label="Share Profile">
                    <ShareFilled className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Right Content - Rich Text Area */}
            <div className="min-w-0 space-y-12 pb-8 prose prose-lg max-w-none prose-headings:font-host-grotesk prose-headings:text-black prose-p:font-urbanist prose-p:text-black/80 prose-p:leading-relaxed prose-li:font-urbanist prose-li:text-black/80">
              <section>
                <h3 className="text-2xl font-semibold mb-4">About</h3>
                <p>{active.bio}</p>
                <div className="rounded-2xl bg-rellia-cream/35 px-5 py-6 mt-8 border border-black/5 not-prose">
                  <h3 className="font-host-grotesk text-sm font-semibold uppercase tracking-[0.12em] text-black/55 mb-2">
                    Snapshot
                  </h3>
                  <p className="font-urbanist text-base leading-relaxed text-black/80">{active.focus}</p>
                </div>
              </section>

              <section>
                <h3 className="text-2xl font-semibold mb-4">How they mentor</h3>
                <p>{active.mentoringStyle}</p>
              </section>

              <section>
                <h3 className="text-2xl font-semibold mb-4">Highlights</h3>
                <ul className="list-disc pl-5">
                  {active.highlights.map((line) => (
                    <li key={line.slice(0, 40)}>{line}</li>
                  ))}
                </ul>
              </section>
            </div>
          </article>

          <div className="mt-16 pt-8 border-t border-black/10">
            <Link to="/advisors/directory" className="inline-flex items-center gap-2 font-host-grotesk text-sm font-bold text-rellia-teal hover:underline hover:underline-offset-4">
              <ArrowLeft className="h-4 w-4" /> Back to Advisors Directory
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
