import { useEffect, useMemo, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { Inbox, Search, Stethoscope } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  fetchContactSubmissions,
  fetchDiagnosticSubmissions,
} from "@/lib/adminSubmissions"
import { buildAdminSearchResults } from "@/lib/adminSearch"
import { adminToolbarFieldBorderClass } from "@/components/admin/adminThemeClasses"
import { cn } from "@/lib/utils"

type AdminGlobalSearchProps = {
  className?: string
}

const AdminGlobalSearch = ({ className }: AdminGlobalSearchProps) => {
  const navigate = useNavigate()
  const rootRef = useRef<HTMLDivElement>(null)
  const [query, setQuery] = useState("")
  const [open, setOpen] = useState(false)

  const contactsQuery = useQuery({
    queryKey: ["admin-contact-submissions"],
    queryFn: fetchContactSubmissions,
    staleTime: 60_000,
  })
  const diagnosticsQuery = useQuery({
    queryKey: ["admin-company-profiles"],
    queryFn: fetchDiagnosticSubmissions,
    staleTime: 60_000,
  })

  const results = useMemo(
    () =>
      buildAdminSearchResults(
        query,
        contactsQuery.data ?? [],
        diagnosticsQuery.data ?? [],
      ),
    [contactsQuery.data, diagnosticsQuery.data, query],
  )

  const trimmedQuery = query.trim()
  const showPanel = open && trimmedQuery.length > 0

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handlePointerDown)
    return () => document.removeEventListener("mousedown", handlePointerDown)
  }, [])

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (!trimmedQuery) return
    navigate(`/admin/inbox?q=${encodeURIComponent(trimmedQuery)}`)
    setOpen(false)
  }

  const handleSelect = (href: string) => {
    navigate(href)
    setQuery("")
    setOpen(false)
  }

  return (
    <div ref={rootRef} className={cn("relative w-full", className)}>
      <form onSubmit={handleSubmit}>
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <Input
          type="search"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          placeholder="Search all submissions…"
          className={cn("h-10 rounded-full bg-background pl-9 font-urbanist text-sm shadow-none", adminToolbarFieldBorderClass)}
          aria-label="Search all submissions across contacts and diagnostics"
          aria-expanded={showPanel}
          aria-controls="admin-global-search-results"
          autoComplete="off"
        />
      </form>

      {showPanel ? (
        <div
          id="admin-global-search-results"
          role="listbox"
          className={cn(
            "absolute left-0 right-0 top-[calc(100%+0.5rem)] z-50 overflow-hidden rounded-2xl border bg-background shadow-lg",
            adminToolbarFieldBorderClass,
          )}
        >
          {contactsQuery.isLoading || diagnosticsQuery.isLoading ? (
            <p className="px-4 py-3 font-urbanist text-sm text-muted-foreground">Loading…</p>
          ) : results.length > 0 ? (
            <ul className="max-h-72 overflow-y-auto py-1">
              {results.map((result) => (
                <li key={`${result.kind}-${result.id}`}>
                  <button
                    type="button"
                    role="option"
                    className="flex w-full items-start gap-3 px-4 py-2.5 text-left transition-colors hover:bg-muted/60 focus-visible:bg-muted/60 focus-visible:outline-none"
                    onClick={() => handleSelect(result.href)}
                  >
                    <span className="mt-0.5 text-rellia-teal" aria-hidden>
                      {result.kind === "contact" ? (
                        <Inbox className="h-4 w-4" />
                      ) : (
                        <Stethoscope className="h-4 w-4" />
                      )}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-urbanist text-sm font-medium text-foreground">
                        {result.label}
                      </span>
                      <span className="block truncate font-urbanist text-xs text-muted-foreground">
                        {result.meta}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-4 py-3 font-urbanist text-sm text-muted-foreground">
              No matches for &ldquo;{trimmedQuery}&rdquo;. Press Enter to search inbox.
            </p>
          )}
          {trimmedQuery ? (
            <div className="border-t border-border/60 px-4 py-2">
              <button
                type="button"
                className="font-urbanist text-xs font-medium text-rellia-teal hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rellia-mint rounded"
                onClick={() => {
                  navigate(`/admin/inbox?q=${encodeURIComponent(trimmedQuery)}`)
                  setOpen(false)
                }}
              >
                View all inbox results for &ldquo;{trimmedQuery}&rdquo;
              </button>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}

export default AdminGlobalSearch
