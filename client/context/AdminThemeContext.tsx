import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react"
import { flushSync } from "react-dom"
import {
  type AdminThemeSetOptions,
  applyAdminThemeTransitionOrigin,
  isAdminMobileSidebarOpen,
  prefersReducedThemeMotion,
  supportsAdminViewTransition,
} from "@/lib/adminThemeTransition"

export type AdminThemePreference = "system" | "light" | "dark"

type AdminThemeContextValue = {
  preference: AdminThemePreference
  resolvedTheme: "light" | "dark"
  isThemeTransitioning: boolean
  setPreference: (preference: AdminThemePreference, options?: AdminThemeSetOptions) => void
}

const STORAGE_KEY = "admin:theme"
const THEME_TRANSITION_MS = 920

const AdminThemeContext = createContext<AdminThemeContextValue | null>(null)

const readStoredPreference = (): AdminThemePreference => {
  if (typeof window === "undefined") return "system"
  const stored = window.localStorage.getItem(STORAGE_KEY)
  if (stored === "light" || stored === "dark" || stored === "system") return stored
  return "system"
}

const readSystemTheme = (): "light" | "dark" => {
  if (typeof window === "undefined") return "light"
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
}

const resolveTheme = (
  preference: AdminThemePreference,
  systemTheme: "light" | "dark",
): "light" | "dark" => (preference === "system" ? systemTheme : preference)

export const AdminThemeProvider = ({ children }: { children: ReactNode }) => {
  const [preference, setPreferenceState] = useState<AdminThemePreference>(readStoredPreference)
  const [systemTheme, setSystemTheme] = useState<"light" | "dark">(readSystemTheme)
  const [isThemeTransitioning, setIsThemeTransitioning] = useState(false)
  const transitionTimerRef = useRef<number | null>(null)
  const preferenceRef = useRef(preference)
  const systemThemeRef = useRef(systemTheme)
  const resolvedThemeRef = useRef<"light" | "dark">(resolveTheme(preference, systemTheme))

  preferenceRef.current = preference
  systemThemeRef.current = systemTheme

  useEffect(() => {
    return () => {
      if (transitionTimerRef.current !== null) {
        window.clearTimeout(transitionTimerRef.current)
      }
    }
  }, [])

  const resolvedTheme = useMemo(
    () => resolveTheme(preference, systemTheme),
    [preference, systemTheme],
  )

  resolvedThemeRef.current = resolvedTheme

  const triggerCssFallbackTransition = useCallback(() => {
    flushSync(() => setIsThemeTransitioning(true))
    if (transitionTimerRef.current !== null) {
      window.clearTimeout(transitionTimerRef.current)
    }
    transitionTimerRef.current = window.setTimeout(() => {
      setIsThemeTransitioning(false)
      transitionTimerRef.current = null
    }, THEME_TRANSITION_MS)
  }, [])

  const runResolvedThemeChange = useCallback(
    (updateDom: () => void, options?: AdminThemeSetOptions) => {
      applyAdminThemeTransitionOrigin(options?.origin)

      const apply = () => {
        flushSync(updateDom)
      }

      if (prefersReducedThemeMotion()) {
        apply()
        return
      }

      if (supportsAdminViewTransition() && !isAdminMobileSidebarOpen()) {
        document.startViewTransition(apply)
        return
      }

      if (isAdminMobileSidebarOpen()) {
        apply()
        return
      }

      triggerCssFallbackTransition()
      requestAnimationFrame(() => {
        apply()
      })
    },
    [triggerCssFallbackTransition],
  )

  const setPreference = useCallback(
    (next: AdminThemePreference, options?: AdminThemeSetOptions) => {
      const nextResolved = resolveTheme(next, systemThemeRef.current)
      const currentResolved = resolvedThemeRef.current

      const apply = () => {
        setPreferenceState(next)
        window.localStorage.setItem(STORAGE_KEY, next)
      }

      if (nextResolved === currentResolved) {
        apply()
        return
      }

      runResolvedThemeChange(apply, options)
    },
    [runResolvedThemeChange],
  )

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)")
    const handleChange = (event: MediaQueryListEvent) => {
      if (preferenceRef.current !== "system") return

      const next = event.matches ? "dark" : "light"
      if (next === systemThemeRef.current) return

      runResolvedThemeChange(() => {
        flushSync(() => setSystemTheme(next))
      })
    }

    media.addEventListener("change", handleChange)
    return () => media.removeEventListener("change", handleChange)
  }, [runResolvedThemeChange])

  const value = useMemo(
    () => ({
      preference,
      resolvedTheme,
      isThemeTransitioning,
      setPreference,
    }),
    [preference, resolvedTheme, isThemeTransitioning, setPreference],
  )

  return <AdminThemeContext.Provider value={value}>{children}</AdminThemeContext.Provider>
}

export const useAdminTheme = (): AdminThemeContextValue => {
  const context = useContext(AdminThemeContext)
  if (!context) {
    throw new Error("useAdminTheme must be used within AdminThemeProvider")
  }
  return context
}
