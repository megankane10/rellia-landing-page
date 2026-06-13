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

/** Resolve a CMS icon key (Lucide name or alias) to a component. */
export const resolveLucideIcon = (
  iconKey: string | null | undefined,
  fallback: LucideIcon = ArrowRight,
): LucideIcon => {
  const cleaned = cmsCleanText(iconKey)
  if (!cleaned) return fallback

  const candidates = [
    cleaned,
    toPascalCase(cleaned),
    cleaned.charAt(0).toUpperCase() + cleaned.slice(1),
  ]

  for (const candidate of candidates) {
    const match = lookupLucide(candidate)
    if (match) return match
  }

  return fallback
}
