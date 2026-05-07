import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter } from "react-router-dom"
import { HelmetProvider } from "react-helmet-async"
import { AppRoutes, RouterShell } from "./AppRoutes"
import { PageSeoProvider } from "@/context/PageSeoContext"
import { VisualEditingOverlay } from "@/components/sanity/VisualEditingOverlay"

const queryClient = new QueryClient()

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <VisualEditingOverlay />
        <BrowserRouter>
          <PageSeoProvider>
            <RouterShell>
              <AppRoutes />
            </RouterShell>
          </PageSeoProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
)

export default App
