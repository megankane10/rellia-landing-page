import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
export default function StudioRedirect() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-white font-host-grotesk">
      <Navbar />
      <main
        id="main-content"
        className="flex min-h-[50vh] flex-col items-center justify-center px-6 pb-24 pt-32 text-center md:pt-40"
      >
        <p className="max-w-md font-urbanist text-lg leading-relaxed text-black/70">
          CMS access is configured via your hosted Sanity Studio URL.
        </p>
        <p className="mt-4 max-w-md font-urbanist text-sm leading-relaxed text-black/55">
          For now, open your Sanity Studio directly from its URL in a new tab.
        </p>
      </main>
      <Footer />
    </div>
  )
}
