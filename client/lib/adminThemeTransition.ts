export type AdminThemeTransitionOrigin = {
  x: number
  y: number
}

export type AdminThemeSetOptions = {
  origin?: AdminThemeTransitionOrigin
}

export const applyAdminThemeTransitionOrigin = (origin?: AdminThemeTransitionOrigin) => {
  const shell = document.querySelector<HTMLElement>(".admin-shell")
  if (!shell || typeof window === "undefined") return

  const x = origin ? (origin.x / window.innerWidth) * 100 : 50
  const y = origin ? (origin.y / window.innerHeight) * 100 : 8

  shell.style.setProperty("--admin-theme-origin-x", `${x}%`)
  shell.style.setProperty("--admin-theme-origin-y", `${y}%`)
}

export const prefersReducedThemeMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches

export const supportsAdminViewTransition = () =>
  typeof document !== "undefined" && "startViewTransition" in document
