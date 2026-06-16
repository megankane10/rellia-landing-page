const ADMIN_AUTH_PATH_PREFIXES = [
  "/admin/login",
  "/admin/signup",
  "/admin/set-password",
  "/admin/auth/",
] as const

/** Authenticated admin shell (sidebar + canvas) — excludes login/signup/auth flows */
export const isAdminShellRoute = (pathname: string): boolean => {
  if (!pathname.startsWith("/admin")) return false
  return !ADMIN_AUTH_PATH_PREFIXES.some((prefix) => pathname.startsWith(prefix))
}

export type AdminNavItem = {
  to: string
  label: string
  end?: boolean
  isActiveMatch?: (pathname: string) => boolean
}

export const ADMIN_MAIN_NAV: AdminNavItem[] = [
  { to: "/admin/overview", label: "Overview", end: true },
  {
    to: "/admin/inbox",
    label: "Inbox",
    isActiveMatch: (path) =>
      path.startsWith("/admin/inbox") ||
      path.startsWith("/admin/submissions") ||
      path.startsWith("/admin/contacts") ||
      path.startsWith("/admin/companies"),
  },
  {
    to: "/admin/drafts",
    label: "Content drafts",
    isActiveMatch: (path) => path.startsWith("/admin/drafts") || path.startsWith("/admin/content"),
  },
  { to: "/admin/team", label: "Team", end: true },
  { to: "/admin/help", label: "Help", end: true },
]

const matchesNavItem = (pathname: string, item: AdminNavItem): boolean => {
  if (item.isActiveMatch?.(pathname)) return true
  if (item.end) return pathname === item.to
  return pathname === item.to || pathname.startsWith(`${item.to}/`)
}

export const getAdminPageTitle = (pathname: string): string => {
  const match = ADMIN_MAIN_NAV.find((item) => matchesNavItem(pathname, item))
  return match?.label ?? "Admin"
}
