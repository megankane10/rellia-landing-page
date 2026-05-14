import { Building2, GraduationCap, Rocket, TrendingUp, type LucideIcon } from "lucide-react"

export type NetworkPathRoleId = "founder" | "advisor" | "investor" | "partner"

/** Plural pills — shared by home Paths section and Founders directory cards */
export const NETWORK_PATH_ROLE_TAG: Record<NetworkPathRoleId, { label: string; icon: LucideIcon }> = {
  founder: { label: "Founders", icon: Rocket },
  advisor: { label: "Advisors", icon: GraduationCap },
  investor: { label: "Investors", icon: TrendingUp },
  partner: { label: "Partners", icon: Building2 },
}
