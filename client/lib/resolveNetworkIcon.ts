import type { LucideIcon } from "lucide-react"
import * as LucideIcons from "lucide-react"
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  GraduationCap,
  Mail,
  MessagesSquare,
  Percent,
  UserPlus,
  Video,
} from "lucide-react"

const NETWORK_ICON_FALLBACK: Record<string, LucideIcon> = {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  GraduationCap,
  Mail,
  MessagesSquare,
  Percent,
  UserPlus,
  Video,
}

export const resolveNetworkIcon = (iconKey?: string, fallback: LucideIcon = ArrowRight): LucideIcon => {
  if (!iconKey) return fallback
  const fromMap = NETWORK_ICON_FALLBACK[iconKey]
  if (fromMap) return fromMap
  const fromLucide = (LucideIcons as unknown as Record<string, LucideIcon>)[iconKey]
  return fromLucide ?? fallback
}
