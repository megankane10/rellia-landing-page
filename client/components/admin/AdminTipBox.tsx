import React, { useState, useEffect } from "react"
import { X, type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

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
        if (value === "true") {
          setCollapsed(true)
        }
      } catch (e) {
        // Ignore storage access errors
      }
    }
  }, [storageKey])

  const handleDismiss = () => {
    setCollapsed(true)
    if (storageKey) {
      try {
        localStorage.setItem(storageKey, "true")
      } catch (e) {
        // Ignore storage errors
      }
    }
  }

  if (collapsed) return null

  return (
    <div
      className={cn(
        "rounded-[1.75rem] border border-rellia-teal/15 p-5 shadow-sm relative transition-all duration-300",
        "bg-gradient-to-r from-rellia-mint/15 via-rellia-cream/40 to-rellia-greyTeal/20",
        className
      )}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/95 border border-rellia-teal/10 shadow-sm text-rellia-teal">
            <IconComponent className="h-5.5 w-5.5" />
          </div>
          <h3 className="font-host-grotesk text-base font-bold text-rellia-teal tracking-tight truncate">
            {title}
          </h3>
        </div>

        <button
          type="button"
          onClick={handleDismiss}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-rellia-teal/10 bg-white/90 text-rellia-teal/80 transition-colors hover:bg-white hover:text-rellia-teal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rellia-teal/40"
          aria-label="Dismiss tip"
        >
          <X className="h-4.5 w-4.5" />
        </button>
      </div>

      {children && (
        <div className="mt-4 border-t border-rellia-teal/10 pt-4 font-urbanist text-sm leading-relaxed text-black/75">
          {children}
        </div>
      )}
    </div>
  )
}
