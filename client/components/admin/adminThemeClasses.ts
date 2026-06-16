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
  "border-b border-black/10 pb-5 dark:border-white/10"

/** Selected-item surface — bright outline + low-opacity fill (light & dark panels) */
export const adminHighlightedSurfaceClass = cn(
  "border border-rellia-teal/18 bg-rellia-mint/15",
  "shadow-[inset_0_0_0_1px_rgba(134,239,172,0.08)]",
  "dark:border-rellia-mint/25 dark:bg-rellia-mint/10",
  "dark:shadow-[inset_0_0_0_1px_rgba(134,239,172,0.14)]",
)

/** Page header / toolbar outline buttons (Download CSV, Open Studio, etc.) */
export const adminOutlineActionButtonClass = cn(
  "rounded-full border font-urbanist shadow-sm transition-colors",
  "border-rellia-teal/25 bg-card text-rellia-teal",
  "hover:border-rellia-teal/40 hover:bg-rellia-mint/12 hover:text-rellia-teal",
  "dark:border-rellia-mint/45 dark:bg-rellia-mint/12 dark:text-rellia-mint",
  "dark:shadow-[inset_0_0_0_1px_rgba(134,239,172,0.12)]",
  "dark:hover:border-rellia-mint/60 dark:hover:bg-rellia-mint/18",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rellia-teal/30 dark:focus-visible:ring-rellia-mint/35",
)

/** Smaller outline action buttons (table rows, compact toolbars) */
export const adminCompactOutlineActionButtonClass = cn(
  adminOutlineActionButtonClass,
  "h-8 w-fit px-3 text-xs",
)

/** Large interactive CTA tiles (preview, invite, enable signup) */
export const adminInteractiveBoxClass = cn(
  "rounded-2xl border border-rellia-teal/18 bg-card text-center transition-all",
  "hover:border-rellia-teal/30 hover:bg-rellia-mint/5",
  "dark:border-rellia-mint/25 dark:bg-card/80 dark:hover:border-rellia-mint/40 dark:hover:bg-rellia-mint/10",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rellia-teal/40",
)

/** Title on interactive admin link tiles — teal in light, mint in dark (readable on mint wash) */
export const adminInteractiveLinkTitleClass = cn(
  "transition-colors group-hover:text-rellia-teal dark:group-hover:text-rellia-mint",
)

/** Chevron / arrow on interactive admin link tiles */
export const adminInteractiveLinkArrowClass = cn(
  "transition-colors group-hover:text-rellia-teal dark:group-hover:text-rellia-mint",
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

/** Tip box title — teal in light, white in dark (see .admin-tip-box-title in global.css) */
export const adminTipBoxTitleClass = "admin-tip-box-title text-rellia-teal"

/** Accent text & icons (links, highlights) */
export const adminAccentClass = "text-rellia-teal dark:text-rellia-mint"

/** Inline links in admin content */
export const adminLinkClass = "text-rellia-teal hover:underline dark:text-rellia-mint"

/** Back navigation above admin detail views */
export const adminBackLinkClass = cn(
  "inline-flex items-center gap-1.5 font-urbanist text-sm transition-colors",
  "text-rellia-teal/85 hover:text-rellia-teal",
  "dark:text-rellia-mint dark:hover:text-rellia-mint",
)

/** Status dropdown on submission rows and detail headers */
export const adminSubmissionStatusSelectTriggerClass = cn(
  "h-9 w-[160px] rounded-full border font-urbanist text-sm shadow-sm",
  "border-rellia-teal/25 bg-card text-foreground",
  "hover:border-rellia-teal/35 hover:bg-rellia-mint/8",
  "dark:border-rellia-mint/45 dark:bg-rellia-mint/12 dark:text-rellia-mint",
  "dark:shadow-[inset_0_0_0_1px_rgba(134,239,172,0.12)]",
  "dark:hover:border-rellia-mint/60 dark:hover:bg-rellia-mint/18",
  "focus:ring-rellia-teal/30 dark:focus:ring-rellia-mint/35",
)

/** Destructive outline button (delete submission) */
export const adminDestructiveOutlineButtonClass = cn(
  "rounded-full border font-urbanist",
  "border-red-200/80 bg-card text-red-700 hover:bg-red-50 hover:text-red-800",
  "dark:border-red-400/50 dark:bg-red-500/12 dark:text-red-300",
  "dark:shadow-[inset_0_0_0_1px_rgba(248,113,113,0.12)]",
  "dark:hover:border-red-400/65 dark:hover:bg-red-500/18 dark:hover:text-red-200",
)

/** Destructive ghost icon button (inbox table delete) */
export const adminDestructiveIconButtonClass = cn(
  "h-9 w-9 shrink-0 rounded-full",
  "text-muted-foreground hover:bg-red-50 hover:text-red-700",
  "dark:text-slate-400 dark:hover:bg-red-500/15 dark:hover:text-red-300",
)

/** Note icon button — no saved note */
export const adminNoteIconButtonClass = cn(
  "h-9 w-9 shrink-0 rounded-full",
  "text-muted-foreground hover:bg-rellia-mint/20 hover:text-rellia-teal",
  "dark:text-slate-400 dark:hover:bg-rellia-mint/15 dark:hover:text-rellia-mint",
)

/** Note icon button — when a note exists */
export const adminNoteIconButtonActiveClass = cn(
  "text-rellia-teal hover:bg-rellia-mint/30 hover:text-rellia-teal",
  "dark:text-rellia-mint dark:hover:bg-rellia-mint/20 dark:hover:text-rellia-mint",
)

/** Segmented tab bar (inbox Web forms / Diagnostic Surveys) */
export const adminSegmentedTabsListClass = cn(
  "h-[48px] w-full max-w-none rounded-2xl border p-1 shadow-sm",
  "border-border bg-muted/50",
  "dark:border-slate-700/60 dark:bg-slate-900/55",
)

/** Segmented tab trigger */
export const adminSegmentedTabTriggerClass = cn(
  "group/trigger h-full w-full rounded-xl px-4 py-2 font-urbanist text-sm font-bold transition-all duration-200",
  "data-[state=active]:border data-[state=active]:border-border data-[state=active]:bg-card",
  "data-[state=active]:text-rellia-teal data-[state=active]:shadow-[0_4px_12px_rgba(0,0,0,0.06)]",
  "data-[state=inactive]:bg-transparent data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:text-foreground",
  "dark:data-[state=active]:border-rellia-mint/40 dark:data-[state=active]:bg-slate-800/95",
  "dark:data-[state=active]:text-rellia-mint",
  "dark:data-[state=active]:shadow-[inset_0_0_0_1px_rgba(134,239,172,0.14),0_4px_16px_rgba(0,0,0,0.28)]",
  "dark:data-[state=inactive]:text-slate-400 dark:data-[state=inactive]:hover:text-slate-100",
)

/** Count chip inside segmented tabs */
export const adminSegmentedTabCountClass = cn(
  "rounded-full bg-foreground/5 px-1.5 py-0.5 text-xs font-semibold tabular-nums text-muted-foreground",
  "group-data-[state=active]/trigger:bg-rellia-mint/15 group-data-[state=active]/trigger:text-rellia-teal",
  "dark:bg-white/8 dark:text-slate-400",
  "dark:group-data-[state=active]/trigger:bg-rellia-mint/20 dark:group-data-[state=active]/trigger:text-rellia-mint",
)

/** Admin data table header cell padding */
export const adminTableHeaderCellClass = cn(
  "px-4 py-3 font-urbanist text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground",
  "first:pl-5 last:pr-5",
)

/** Admin data table body cell padding */
export const adminTableBodyCellClass = cn(
  "px-4 py-4 align-top font-urbanist text-sm text-foreground",
  "first:pl-5 last:pr-5",
)

/** Multi-line clamped text in admin table cells (e.g. submission message) */
export const adminTableMessageCellClass = cn(
  "whitespace-normal break-words text-sm leading-snug text-muted-foreground line-clamp-4",
)

/** Amber warning / policy banners in admin */
export const adminWarningBannerClass = cn(
  "rounded-lg border px-4 py-3 font-urbanist text-sm",
  "border-amber-200/80 bg-amber-50 text-amber-900",
  "dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-200",
)

/** Pending / in-progress status — orange (submissions, overview counts, drafts) */
export const adminPendingBadgeClass = cn(
  "bg-orange-50 text-orange-700 border-orange-200/70 hover:bg-orange-50",
  "dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/70 dark:hover:bg-orange-500/10",
)

export const adminPendingAccentTextClass = "text-orange-600 dark:text-orange-400"

export const adminPendingStatusCircleClass = cn(
  "border-orange-500/70 bg-orange-500/10 text-orange-600",
  "dark:text-orange-400",
)

export const adminPendingSurfaceClass = cn(
  "border-orange-200/70 bg-orange-50 text-orange-800",
  "dark:border-orange-500/70 dark:bg-orange-500/10 dark:text-orange-400",
)

/** Unresolved / needs-attention counts on overview top cards — violet for contrast on dark admin surfaces */
export const adminUnresolvedAccentTextClass = "text-violet-700 dark:text-violet-300"

export const adminUnresolvedStatusCircleClass = cn(
  "border-violet-300/80 bg-violet-50 text-violet-700",
  "dark:border-violet-400/55 dark:bg-violet-500/15 dark:text-violet-300",
)

/** Red error banners in admin */
export const adminErrorBannerClass = cn(
  "rounded-2xl border p-4 font-urbanist text-sm",
  "border-red-200 bg-red-50 text-red-700",
  "dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-300",
)

/** Submission type chips (investor, priority modal, etc.) */
export const adminSubmissionTypeChipClass = cn(
  "inline-flex rounded-full bg-rellia-mint/30 px-2 py-0.5 align-middle font-urbanist text-xs font-medium text-rellia-teal",
  "dark:bg-rellia-mint/20 dark:text-rellia-mint",
)

/** Internal note panel on submission detail pages */
export const adminInternalNotePanelClass = cn(
  "overflow-hidden rounded-2xl border shadow-sm",
  "border-rellia-mint/40 bg-rellia-mint/15",
  "dark:border-rellia-mint/30 dark:bg-rellia-mint/8",
)

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
