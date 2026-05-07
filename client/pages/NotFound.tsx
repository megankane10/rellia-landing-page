import { useEffect } from "react"
import { useLocation } from "react-router-dom"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import RelliaCta, { ctaActionFromHref } from "@/components/RelliaCta"
import { useNotFoundPage } from "@/hooks/useCmsDocuments"
import { DEFAULT_NOT_FOUND } from "@shared/cms/defaults"
import { Search } from "lucide-react"

const NotFound = () => {
  const location = useLocation()
  const { data } = useNotFoundPage()
  const copy = data ?? DEFAULT_NOT_FOUND

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname)
  }, [location.pathname])

  return (
    <div className="flex min-h-screen flex-col bg-white font-host-grotesk overflow-x-hidden">
      <Navbar />
      <main id="main-content" className="flex flex-1 flex-col pt-20 md:pt-28">
        <RelliaCta
          icon={<Search className="h-20 w-20 text-rellia-teal" strokeWidth={1.25} />}
          title="**404**"
          body={`${copy.title}. ${copy.message}`}
          primary={ctaActionFromHref(copy.ctaLabel, "/")}
          secondary={ctaActionFromHref("Browse events", "/events")}
          className="flex-1"
        />
      </main>
      <Footer />
    </div>
  )
}

export default NotFound
