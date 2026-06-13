import type { LucideIcon } from "lucide-react"
import { lookupLucideIcon } from "@/lib/resolveLucideIcon"

type CmsLucideIconProps = {
  name?: string | null
  className?: string
  fallback?: LucideIcon | null
}

/** Renders a CMS Lucide icon when the stored name resolves; otherwise renders nothing. */
export const CmsLucideIcon = ({ name, className, fallback = null }: CmsLucideIconProps) => {
  const Icon = lookupLucideIcon(name) ?? fallback
  if (!Icon) return null
  return <Icon className={className} aria-hidden />
}
