import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react"
import { useLocation } from "react-router-dom"

export type PageSeoOverrides = {
  title?: string
  description?: string
  ogImage?: string
  /** When true, adds noindex,nofollow and drops canonical */
  noIndex?: boolean
}

type PageSeoContextValue = {
  overrides: PageSeoOverrides
  setPageSeo: (next: PageSeoOverrides | null | undefined) => void
}

const PageSeoContext = createContext<PageSeoContextValue | null>(null)

export const PageSeoProvider = ({ children }: { children: ReactNode }) => {
  const { pathname } = useLocation()
  const [overrides, setOverridesState] = useState<PageSeoOverrides>({})

  useEffect(() => {
    setOverridesState({})
  }, [pathname])

  const setPageSeo = useCallback((next: PageSeoOverrides | null | undefined) => {
    setOverridesState(next && typeof next === "object" ? next : {})
  }, [])

  const value = useMemo(() => ({ overrides, setPageSeo }), [overrides, setPageSeo])

  return <PageSeoContext.Provider value={value}>{children}</PageSeoContext.Provider>
}

export const usePageSeo = (): PageSeoContextValue => {
  const ctx = useContext(PageSeoContext)
  if (!ctx) {
    throw new Error("usePageSeo must be used within PageSeoProvider")
  }
  return ctx
}

/** Safe variant when provider might be absent (tests); returns no-op setter */
export const useOptionalPageSeo = (): PageSeoContextValue => {
  const ctx = useContext(PageSeoContext)
  const noop = useCallback(() => {}, [])
  if (!ctx) {
    return { overrides: {}, setPageSeo: noop }
  }
  return ctx
}
