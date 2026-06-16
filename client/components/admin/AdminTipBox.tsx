import React, { useState, useEffect } from "react"
import { ChevronDown, ChevronUp, type LucideIcon } from "lucide-react"
import { adminIconTileClass, adminMutedTextClass, adminTipBoxSurfaceClass, adminTipBoxTitleClass } from "@/components/admin/adminThemeClasses"
import { cn } from "@/lib/utils"

/**
 * Developer Guide: How to Edit or Add Tip Boxes
 * 
 * 1. To EDIT an existing tip box:
 *    - Locate the file where it is used (e.g. `client/pages/admin/help/AdminHelpPage.tsx`).
 *    - Modify the title, icon, or children contents inside the component.
 * 
 * 2. To ADD a new tip box:
 *    - Import `AdminTipBox` and the desired Lucide icon in your page.
 *    - Place the component where needed in your JSX:
 *      ```tsx
 *      <AdminTipBox
 *        title="Your Title"
 *        icon={YourIcon}
 *        storageKey="unique-key-for-localstorage-state"
 *      >
 *        <p>Your content goes here...</p>
 *      </AdminTipBox>
 *      ```
 * 
 * 3. Collapsible state persistence:
 *    - Assign a unique `storageKey` string (e.g. "rellia-admin-my-new-tip-collapsed")
 *      to ensure the collapse/expand state is remembered when the user navigates between pages.
 */

type AdminTipBoxProps = {
  title: string
  icon: LucideIcon
  children?: React.ReactNode
  className?: string
  storageKey?: string
}

export default function AdminTipBox({
  title,
  icon: IconComponent,
  children,
  className,
  storageKey,
}: AdminTipBoxProps) {
  const [collapsed, setCollapsed] = useState(false)

  // Load initial state from storage if key provided
  useEffect(() => {
    if (storageKey) {
      try {
        const value = localStorage.getItem(storageKey)
        const next =
          value === "true" ? true : value === "false" ? false : null
        if (next === null) return
        queueMicrotask(() => setCollapsed(next))
      } catch {
        // Ignore storage access errors
      }
    }
  }, [storageKey])

  const handleToggle = () => {
    const nextCollapsed = !collapsed
    setCollapsed(nextCollapsed)
    if (storageKey) {
      try {
        localStorage.setItem(storageKey, nextCollapsed ? "true" : "false")
      } catch {
        // Ignore storage errors
      }
    }
  }

  return (
    <div
      className={cn(
        "relative rounded-2xl shadow-sm transition-all duration-300",
        adminTipBoxSurfaceClass,
        collapsed ? "px-5 py-3" : "p-5",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 min-w-0">
          <div className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl shadow-sm", adminIconTileClass)}>
            <IconComponent className="h-5.5 w-5.5" />
          </div>
          <h3 className={cn("truncate font-host-grotesk text-base font-bold tracking-tight", adminTipBoxTitleClass)}>
            {title}
          </h3>
        </div>

        <button
          type="button"
          onClick={handleToggle}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border bg-card text-rellia-teal/80 transition-colors hover:bg-card hover:text-rellia-teal dark:text-rellia-mint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rellia-teal/40"
          aria-expanded={!collapsed}
          aria-label={collapsed ? "Expand tip" : "Collapse tip"}
        >
          {collapsed ? (
            <ChevronDown className="h-4.5 w-4.5" />
          ) : (
            <ChevronUp className="h-4.5 w-4.5" />
          )}
        </button>
      </div>

      {!collapsed && children && (
        <div className={cn("mt-4 border-t border-rellia-teal/15 pt-4 font-urbanist text-sm leading-relaxed dark:border-rellia-mint/20", adminMutedTextClass)}>
          {children}
        </div>
      )}
    </div>
  )
}
