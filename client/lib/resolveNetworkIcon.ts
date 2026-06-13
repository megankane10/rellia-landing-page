import type { LucideIcon } from "lucide-react"
import { ArrowRight } from "lucide-react"
import { resolveLucideIcon } from "@/lib/resolveLucideIcon"

export const resolveNetworkIcon = (iconKey?: string, fallback: LucideIcon = ArrowRight): LucideIcon =>
  resolveLucideIcon(iconKey, fallback)
