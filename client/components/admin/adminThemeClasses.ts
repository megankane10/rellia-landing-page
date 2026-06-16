import { cn } from "@/lib/utils"

/** Main content canvas behind cards */
export const adminCanvasClass = "bg-admin-canvas"

/** Sticky top bar on the right-hand admin panel */
export const adminHeaderClass = cn(
  "border-b border-border/80 bg-admin-header/75 backdrop-blur",
  "supports-[backdrop-filter]:bg-admin-header/65",
)

/** Standard elevated card surface */
export const adminCardClass = "rounded-2xl border border-border bg-card text-card-foreground"

/** Card section divider */
export const adminCardDividerClass = "border-black/10 dark:border-border"

/** Page header bottom rule */
export const adminPageHeaderDividerClass =
  "border-b border-rellia-teal/35 pb-5 dark:border-rellia-mint/45"

/** Selected-item surface — bright outline + low-opacity fill (light & dark panels) */
export const adminHighlightedSurfaceClass = cn(
  "border border-rellia-teal/18 bg-rellia-mint/15",
  "shadow-[inset_0_0_0_1px_rgba(134,239,172,0.08)]",
  "dark:border-rellia-mint/25 dark:bg-rellia-mint/10",
  "dark:shadow-[inset_0_0_0_1px_rgba(134,239,172,0.14)]",
)

/** Page header / toolbar outline buttons (Download CSV, Open Studio, etc.) */
export const adminOutlineActionButtonClass = cn(
  "rounded-full border border-border bg-card font-urbanist text-foreground",
  "hover:border-rellia-teal/25 hover:bg-rellia-mint/10 hover:text-rellia-teal",
  "dark:border-rellia-mint/22 dark:text-white",
  "dark:hover:border-rellia-mint/35 dark:hover:bg-rellia-mint/10 dark:hover:text-rellia-mint",
)

/** Large interactive CTA tiles (preview, invite, enable signup) */
export const adminInteractiveBoxClass = cn(
  "rounded-2xl border border-rellia-teal/18 bg-card text-center transition-all",
  "hover:border-rellia-teal/30 hover:bg-rellia-mint/5",
  "dark:border-rellia-mint/25 dark:bg-card/80 dark:hover:border-rellia-mint/40 dark:hover:bg-rellia-mint/10",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rellia-teal/40",
)

/** Overview top-card arrow chip */
export const adminOverviewArrowChipClass = cn(
  "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border",
  "border-rellia-teal/15 bg-card/80 text-rellia-teal/55",
  "transition-[color,background-color,border-color,transform] duration-150",
  "group-hover:border-rellia-teal/25 group-hover:bg-rellia-mint/20 group-hover:text-rellia-teal",
  "dark:border-rellia-mint/25 dark:bg-rellia-mint/10 dark:text-rellia-mint",
  "dark:group-hover:border-rellia-mint/40 dark:group-hover:bg-rellia-mint/15 dark:group-hover:text-rellia-mint",
)

/** Dashed empty-state panel */
export const adminEmptyStateClass = cn(
  "rounded-2xl border border-dashed border-border bg-card/70 text-card-foreground",
)

/** Icon tile on cards (help, tips, etc.) */
export const adminIconTileClass = cn(
  "inline-flex items-center justify-center rounded-2xl border border-border bg-rellia-mint/20 text-rellia-teal",
  "dark:border-rellia-mint/20 dark:bg-rellia-mint/15 dark:text-rellia-mint",
)

/** Secondary body copy */
export const adminMutedTextClass = "text-muted-foreground dark:text-slate-300/80"

/** Primary headings in admin content — white in dark mode */
export const adminHeadingClass = "text-foreground dark:text-white"

/** Card / box titles */
export const adminCardTitleClass = cn(
  "font-host-grotesk font-semibold text-foreground dark:text-white",
)

/** Page-level title accent (teal in light, mint in dark) */
export const adminPageTitleClass = "text-rellia-teal dark:text-rellia-mint"

/** Tip box title — matches page headings */
export const adminTipBoxTitleClass = adminPageTitleClass

/** Accent text & icons (links, highlights) */
export const adminAccentClass = "text-rellia-teal dark:text-rellia-mint"

/** Inline links in admin content */
export const adminLinkClass = "text-rellia-teal hover:underline dark:text-rellia-mint"

/** Dark sidebar-style tooltips across the admin dashboard */
export const adminTooltipContentClass = cn(
  "z-50 overflow-hidden rounded-xl border border-slate-700/70 bg-slate-950 px-3 py-1.5",
  "font-urbanist text-xs font-semibold text-white shadow-lg shadow-black/40",
  "animate-in fade-in-0 zoom-in-95",
)

/** Chart tooltips — same shell with readable value colours */
export const adminChartTooltipClass = cn(
  adminTooltipContentClass,
  "min-w-[8rem] text-white",
  "[&_.text-muted-foreground]:text-slate-300 [&_.text-foreground]:text-white",
)
