import { ClientOnlyToasters } from "@/components/ClientOnlyToasters"
import { TooltipProvider } from "@/components/ui/tooltip"
import { HydrationBoundary, QueryClientProvider } from "@tanstack/react-query"
import { HelmetProvider } from "react-helmet-async"
import { BrowserRouter } from "react-router-dom"
import { AppRoutesClient } from "./AppRoutesClient"
import { RouterShell } from "./RouterShell"
import { AuthProvider } from "@/context/AuthContext"
import { VisualEditingOverlay } from "@/components/sanity/VisualEditingOverlay"
import {
  createAppQueryClient,
  readDehydratedCmsQueryState,
} from "@/lib/cmsQueryHydration"

const queryClient = createAppQueryClient()
const dehydratedCmsState = readDehydratedCmsQueryState()

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <HydrationBoundary state={dehydratedCmsState}>
        <TooltipProvider>
          <ClientOnlyToasters />
          <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <AuthProvider>
              <RouterShell>
                <AppRoutesClient />
                <VisualEditingOverlay />
              </RouterShell>
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </HydrationBoundary>
    </QueryClientProvider>
  </HelmetProvider>
)

export default App
