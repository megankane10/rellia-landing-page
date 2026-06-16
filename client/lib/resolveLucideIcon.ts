import type { LucideIcon } from "lucide-react"
import * as LucideIcons from "lucide-react"
import {
  Activity,
  ArrowRight,
  BadgeCheck,
  BookOpen,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  ClipboardList,
  Clock,
  DollarSign,
  GraduationCap,
  Heart,
  HeartHandshake,
  Megaphone,
  MessagesSquare,
  Percent,
  UserPlus,
  Video,
} from "lucide-react"
import { SearchAlertIcon } from "@/components/icons/SearchAlertIcon"
import { cmsCleanText } from "@/lib/cmsStega"

const ICON_ALIASES: Record<string, LucideIcon> = {
  ArrowRight,
  BookOpen,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  ClipboardList,
  Clock,
  DollarSign,
  GraduationCap,
  Heart,
  HeartHandshake,
  Megaphone,
  MessagesSquare,
  Percent,
  UserPlus,
  Video,
  Activity,
  BadgeCheck,
  "search-alert": SearchAlertIcon as LucideIcon,
  SearchAlert: SearchAlertIcon as LucideIcon,
  heart: Heart,
  stethoscope: LucideIcons.Stethoscope,
  globe: LucideIcons.Globe,
  zap: LucideIcons.Zap,
}

const toPascalCase = (value: string): string =>
  value
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("")

const lookupLucide = (candidate: string): LucideIcon | undefined => {
  const trimmed = candidate.trim()
  if (!trimmed) return undefined
  const alias = ICON_ALIASES[trimmed] ?? ICON_ALIASES[trimmed.toLowerCase()]
  if (alias) return alias
  const fromLucide = (LucideIcons as unknown as Record<string, LucideIcon>)[trimmed]
  return fromLucide
}

const iconCandidates = (iconKey: string): string[] => [
  iconKey,
  toPascalCase(iconKey),
  iconKey.charAt(0).toUpperCase() + iconKey.slice(1),
]

/** Resolve a CMS icon key to a Lucide component, or null when not found. */
export const lookupLucideIcon = (iconKey: string | null | undefined): LucideIcon | null => {
  const cleaned = cmsCleanText(iconKey)
  if (!cleaned) return null

  for (const candidate of iconCandidates(cleaned)) {
    const match = lookupLucide(candidate)
    if (match) return match
  }

  return null
}

/** Resolve a CMS icon key (Lucide name or alias) to a component. */
export const resolveLucideIcon = (
  iconKey: string | null | undefined,
  fallback: LucideIcon = ArrowRight,
): LucideIcon => lookupLucideIcon(iconKey) ?? fallback
