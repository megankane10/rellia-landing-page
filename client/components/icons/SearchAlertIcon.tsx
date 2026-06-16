import type { SVGProps } from "react"

/** Lucide `search-alert` (v1.18+) — local copy for lucide-react 0.539. */
export const SearchAlertIcon = ({ className, ...props }: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden
    {...props}
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
    <path d="M11 7v4" />
    <path d="M11 15h.01" />
  </svg>
)
