import { useParams, Link } from "react-router-dom"
import { Helmet } from "react-helmet-async"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import RelliaAction from "@/components/RelliaAction"
import { ArrowLeft } from "lucide-react"
import { GlobeFilled, ShareFilled } from "@/components/icons/SocialIcons"
import { FOUNDER_DIRECTORY } from "./FoundersDirectory"
import NotFound from "../NotFound"
import { cn } from "@/lib/utils"
import { getSiteUrl } from "@/config/seo"

export default function FounderProfile() {
  const { id } = useParams<{ id: string }>()
  const active = FOUNDER_DIRECTORY.find((c) => c.id === id)

  if (!active) return <NotFound />

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: active.logoName,
        text: active.tagline,
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-white font-host-grotesk">
      <Navbar />

      <main id="main-content" className="pt-24 pb-16 md:pt-28">
        <div className="mx-auto max-w-[1300px] px-6 md:px-10">
          <article className="grid gap-10 lg:grid-cols-[minmax(280px,360px)_minmax(0,1fr)] lg:gap-x-14 xl:grid-cols-[400px_1fr]">
            {/* Left Sidebar - Sticky */}
            <div className="flex flex-col gap-6 lg:sticky lg:top-32 lg:self-start">
              <Helmet>
                <title>{active.logoName} — Rellia Health</title>
                <meta name="description" content={active.shortDescription} />
                <meta property="og:title" content={`${active.logoName} — Rellia Health`} />
                <meta property="og:description" content={active.shortDescription} />
                <meta property="og:image" content={active.imageSrc.startsWith("http") ? active.imageSrc : `${getSiteUrl()}${active.imageSrc}`} />
                <meta name="twitter:title" content={`${active.logoName} — Rellia Health`} />
                <meta name="twitter:description" content={active.shortDescription} />
                <meta name="twitter:image" content={active.imageSrc.startsWith("http") ? active.imageSrc : `${getSiteUrl()}${active.imageSrc}`} />
                <meta name="twitter:card" content="summary_large_image" />
              </Helmet>

              <div className="overflow-hidden rounded-2xl aspect-[4/5] w-full max-h-[min(56vh,560px)] mb-8">
                <img
                  src={active.imageSrc}
                  alt={`Founder at ${active.logoName}`}
                  className="h-full w-full object-cover object-top"
                />
              </div>

              <div className="flex min-h-[100px] items-center justify-start md:min-h-[120px]">
                <img
                  src={active.logoSrc}
                  alt={active.logoName}
                  className="max-h-[80px] w-auto max-w-full object-contain object-left opacity-90"
                />
              </div>
              <div className="pt-2">
                <h2 className="font-host-grotesk text-3xl font-bold tracking-tight text-black mb-6">
                  {active.logoName}
                </h2>
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="inline-flex rounded-full border border-black/10 bg-black/[0.03] px-3 py-1 font-urbanist text-xs font-semibold text-black/70">
                    {active.category}
                  </span>
                  {active.stages.map((s) => (
                    <span
                      key={s}
                      className="inline-flex rounded-full border border-rellia-teal/20 bg-rellia-mint/20 px-3 py-1 font-urbanist text-xs font-semibold text-rellia-teal"
                    >
                      {s}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center gap-3">
                  <a href={active.websiteUrl} target="_blank" rel="noopener noreferrer" className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white text-black hover:bg-black/5 transition-colors" aria-label="Visit Website">
                    <GlobeFilled className="h-5 w-5" />
                  </a>
                  <button onClick={handleShare} className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white text-black hover:bg-black/5 transition-colors" aria-label="Share">
                    <ShareFilled className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Right Content - Rich Text Area */}
            <div className="min-w-0 space-y-12 pb-8 prose prose-lg max-w-none prose-headings:font-host-grotesk prose-headings:text-black prose-p:font-urbanist prose-p:text-black/80 prose-p:leading-relaxed">
              <section>
                <h3 className="text-2xl font-semibold mb-4">Overview</h3>
                <p>{active.longDescription}</p>
              </section>

              <section>
                <h3 className="text-2xl font-semibold mb-4">Traction & Roadmap</h3>
                <p>{active.traction}</p>
              </section>

              <section>
                <h3 className="text-2xl font-semibold mb-4">Collaborating through Rellia</h3>
                <p>{active.relliaCollaboration}</p>
              </section>
            </div>
          </article>

          <div className="mt-16 pt-8 border-t border-black/10">
            <Link to="/founders/directory" className="inline-flex items-center gap-2 font-host-grotesk text-sm font-bold text-rellia-teal hover:underline hover:underline-offset-4">
              <ArrowLeft className="h-4 w-4" /> Back to Founders Directory
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
