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

export type AdminThemePreference = "light" | "dark"

type AdminThemeContextValue = {
  preference: AdminThemePreference
  resolvedTheme: AdminThemePreference
  isThemeTransitioning: boolean
  setPreference: (preference: AdminThemePreference, options?: AdminThemeSetOptions) => void
}

const STORAGE_KEY = "admin:theme"
const THEME_TRANSITION_MS = 920

const AdminThemeContext = createContext<AdminThemeContextValue | null>(null)

const readSystemTheme = (): AdminThemePreference => {
  if (typeof window === "undefined") return "light"
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
}

const readStoredPreference = (): AdminThemePreference => {
  if (typeof window === "undefined") return readSystemTheme()
  const stored = window.localStorage.getItem(STORAGE_KEY)
  if (stored === "light" || stored === "dark") return stored
  return readSystemTheme()
}

export const AdminThemeProvider = ({ children }: { children: ReactNode }) => {
  const [preference, setPreferenceState] = useState<AdminThemePreference>(readStoredPreference)
  const [isThemeTransitioning, setIsThemeTransitioning] = useState(false)
  const transitionTimerRef = useRef<number | null>(null)
  const preferenceRef = useRef(preference)

  preferenceRef.current = preference

  useEffect(() => {
    return () => {
      if (transitionTimerRef.current !== null) {
        window.clearTimeout(transitionTimerRef.current)
      }
    }
  }, [])

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
      const current = preferenceRef.current

      const apply = () => {
        setPreferenceState(next)
        window.localStorage.setItem(STORAGE_KEY, next)
      }

      if (next === current) {
        apply()
        return
      }

      runResolvedThemeChange(apply, options)
    },
    [runResolvedThemeChange],
  )

  const value = useMemo(
    () => ({
      preference,
      resolvedTheme: preference,
      isThemeTransitioning,
      setPreference,
    }),
    [preference, isThemeTransitioning, setPreference],
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
