/**
 * Shown while a lazy route chunk loads. Keep dependency-free (no framer-motion) so the fallback stays tiny.
 */
const RouteSuspenseFallback = () => (
  <div
    role="status"
    aria-live="polite"
    aria-label="Loading page"
    className="min-h-[calc(100vh-86px)] w-full flex items-center justify-center bg-white"
  >
    <div className="h-8 w-8 animate-spin rounded-full border-2 border-rellia-teal/20 border-t-rellia-teal" />
  </div>
)

export default RouteSuspenseFallback
