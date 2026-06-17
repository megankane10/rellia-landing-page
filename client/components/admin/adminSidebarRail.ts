import { cn } from "@/lib/utils"

export const adminSidebarMotionEase = "ease-[cubic-bezier(0.4,0,0.2,1)]"
export const adminSidebarMotionDuration = "duration-300"

export const adminSidebarCollapseTransitionClass = cn(
  "transition-[opacity,max-width,padding,margin,width,min-width] duration-300",
  adminSidebarMotionEase,
)

/** Outer inset for header, nav, and footer — keeps the icon column aligned. */
export const adminSidebarRailPx = cn(
  "!px-5 transition-[padding] duration-300",
  adminSidebarMotionEase,
  "group-data-[state=collapsed]:!px-[1.125rem]",
)

/** Fixed icon column — logo, nav icons, and avatar share this slot. */
export const adminSidebarIconSlot = "relative flex h-10 w-10 shrink-0 items-center justify-center"

export const adminSidebarRowClass = "flex w-full items-center"

export const adminSidebarLabelGap = "pl-4"

export const adminSidebarLabelWrapClass = cn(
  "flex min-w-0 flex-1 items-center gap-3 overflow-hidden pr-2",
  adminSidebarLabelGap,
  "max-w-[13rem] opacity-100",
  adminSidebarCollapseTransitionClass,
  "group-data-[state=collapsed]:max-w-0 group-data-[state=collapsed]:flex-none group-data-[state=collapsed]:overflow-hidden group-data-[state=collapsed]:p-0 group-data-[state=collapsed]:pl-0 group-data-[state=collapsed]:pr-0 group-data-[state=collapsed]:opacity-0",
)

export const adminSidebarNavLinkClass = cn(
  adminSidebarRowClass,
  "min-h-11 w-full",
  "group-data-[state=collapsed]:h-11 group-data-[state=collapsed]:min-h-11",
)

export const adminSidebarHeaderTextClass = cn(
  "flex min-w-0 flex-1 items-center overflow-hidden pr-2",
  adminSidebarLabelGap,
  "max-w-[12rem] whitespace-nowrap opacity-100",
  adminSidebarCollapseTransitionClass,
  "group-data-[state=collapsed]:max-w-0 group-data-[state=collapsed]:flex-none group-data-[state=collapsed]:overflow-hidden group-data-[state=collapsed]:p-0 group-data-[state=collapsed]:pl-0 group-data-[state=collapsed]:pr-0 group-data-[state=collapsed]:opacity-0",
)

export const adminSidebarHeaderRowClass = cn(
  adminSidebarRowClass,
  "h-full min-w-0 items-center overflow-hidden",
)

/** Mint fill + inset outline — active admin sidebar nav item surface (dark sidebar) */
export const adminSelectedItemSurfaceClass = cn(
  "!bg-rellia-mint/15",
  "!shadow-[inset_0_0_0_1px_rgba(134,239,172,0.14)]",
)

/** Light mint fill + soft teal outline — overview stat cards on white */
export const adminSelectedItemSurfaceOnLightClass = cn(
  "!bg-rellia-mint/15",
  "!border !border-rellia-teal/18",
)

export const adminSidebarNavButtonClass = cn(
  "relative min-h-11 w-full overflow-hidden rounded-xl px-0 py-1 font-urbanist text-[15px]",
  "transition-[color,background-color,transform,box-shadow,width,height,min-height,max-height,padding] duration-300",
  adminSidebarMotionEase,
  "text-slate-300/90",
  "hover:!bg-white/[0.07] hover:!text-white",
  "active:scale-[0.97] active:!bg-white/[0.12] active:!text-white active:duration-75",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 focus-visible:ring-offset-0",
  "data-[active=true]:!bg-rellia-mint/15 data-[active=true]:font-semibold data-[active=true]:!text-rellia-mint",
  "data-[active=true]:shadow-[inset_0_0_0_1px_rgba(134,239,172,0.14)]",
  "group-data-[state=collapsed]:!size-11 group-data-[state=collapsed]:!min-h-11 group-data-[state=collapsed]:!max-h-11 group-data-[state=collapsed]:!w-full group-data-[state=collapsed]:!p-0",
  "[&_svg]:size-[1.125rem] [&_svg]:transition-transform [&_svg]:duration-300 [&_svg]:ease-[cubic-bezier(0.4,0,0.2,1)]",
  "active:[&_svg]:scale-95 data-[active=true]:[&_svg]:text-rellia-mint",
)

export const adminSidebarAccountButtonClass = cn(
  adminSidebarRowClass,
  "relative min-h-11 w-full rounded-xl px-0 py-1 text-left font-urbanist",
  "transition-[color,background-color,transform,width,height,min-height,max-height,padding] duration-300",
  adminSidebarMotionEase,
  "hover:!bg-white/[0.07] hover:!text-white",
  "active:scale-[0.97] active:!bg-white/[0.12] active:!text-white active:duration-75",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 focus-visible:ring-offset-0",
  "group-data-[state=collapsed]:!size-11 group-data-[state=collapsed]:!min-h-11 group-data-[state=collapsed]:!max-h-11 group-data-[state=collapsed]:!w-full group-data-[state=collapsed]:!p-0",
  "group-data-[state=collapsed]:overflow-visible",
  "group-data-[state=collapsed]:hover:!bg-transparent group-data-[state=collapsed]:active:!bg-transparent",
  "group-data-[state=collapsed]:[&>span:first-child]:relative group-data-[state=collapsed]:[&>span:first-child]:z-0",
  "group-data-[state=collapsed]:[&>span:first-child]:before:pointer-events-none",
  "group-data-[state=collapsed]:[&>span:first-child]:before:absolute group-data-[state=collapsed]:[&>span:first-child]:before:inset-0",
  "group-data-[state=collapsed]:[&>span:first-child]:before:-m-2 group-data-[state=collapsed]:[&>span:first-child]:before:rounded-xl",
  "group-data-[state=collapsed]:[&>span:first-child]:before:content-['']",
  "group-data-[state=collapsed]:[&>span:first-child]:before:transition-[background-color] group-data-[state=collapsed]:[&>span:first-child]:before:duration-300",
  "group-data-[state=collapsed]:hover:[&>span:first-child]:before:bg-white/[0.07]",
  "group-data-[state=collapsed]:active:[&>span:first-child]:before:bg-white/[0.12]",
  "group-data-[state=collapsed]:[&>span:first-child>*]:relative group-data-[state=collapsed]:[&>span:first-child>*]:z-[1]",
)

export const adminSidebarAccountTextClass = cn(
  "min-w-0 flex-1 space-y-1 overflow-hidden",
  adminSidebarLabelGap,
  "max-w-[12rem] opacity-100",
  adminSidebarCollapseTransitionClass,
  "group-data-[state=collapsed]:max-w-0 group-data-[state=collapsed]:flex-none group-data-[state=collapsed]:overflow-hidden group-data-[state=collapsed]:p-0 group-data-[state=collapsed]:opacity-0",
)

export const adminSidebarHeaderClass = cn(
  "!gap-0 !py-0",
  "flex h-[4.25rem] shrink-0 flex-col justify-center overflow-hidden border-b border-slate-800/60",
  adminSidebarRailPx,
)

export const adminSidebarFooterClass = cn(
  "!gap-0 !py-0",
  "shrink-0 overflow-hidden border-t border-slate-800 !pb-5 !pt-3",
  "group-data-[state=collapsed]:overflow-visible",
  adminSidebarRailPx,
)

/** Padding between the divider and footer controls (theme above, profile below). */
export const adminSidebarDividerGapClass = "pb-3"

export const adminSidebarContentClass = cn(
  "flex-1 overflow-x-hidden pb-0 pt-6",
  adminSidebarRailPx,
)

/** Dark popover / dropdown surface — slightly elevated from sidebar */
export const adminDarkMenuContentClass = cn(
  "z-[10002] overflow-hidden rounded-2xl border border-slate-700/65 bg-slate-900 p-1.5 text-slate-200 shadow-2xl shadow-black/45",
)

export const adminDarkMenuItemClass = cn(
  "cursor-pointer rounded-lg px-3 py-2.5 text-sm text-slate-300",
  "focus:bg-white/10 focus:text-white",
)

export const adminDarkMenuSeparatorClass = "my-1 bg-slate-800"

/** Dark admin modal chrome — larger radius + lift above the overlay */
export const adminDarkDialogShellClass = cn(
  "rounded-[2rem] sm:rounded-[2rem]",
  "shadow-2xl shadow-black/50",
)

/** Dark modal surface — slightly lighter than sidebar (slate-950) for contrast */
export const adminDarkDialogContentClass = cn(
  "border-slate-700/65 bg-slate-900 text-slate-200",
  "[&_label]:text-slate-300",
  "[&_input]:border-slate-700 [&_input]:bg-slate-900 [&_input]:text-white [&_input]:placeholder:text-slate-500",
  "[&>button.absolute]:text-slate-400 [&>button.absolute]:hover:text-white",
)

/** Light admin modal surface — explicit white (portals sit outside `.admin-shell`) */
export const adminLightDialogContentClass = cn(
  "border-border/80 bg-white text-foreground",
  "[&_label]:text-foreground",
  "[&_input]:border-input [&_input]:bg-white [&_input]:text-foreground [&_input]:placeholder:text-muted-foreground",
  "[&>button.absolute]:text-muted-foreground [&>button.absolute]:hover:text-foreground",
)

/** Light admin modal chrome — corner radius aligned with profile modals */
export const adminLightDialogShellClass = cn(
  "rounded-[2rem] sm:rounded-[2rem]",
  "border-border/80 shadow-xl shadow-black/12",
)

/** Portaled admin dialogs — explicit theme (Radix portals sit outside `.admin-shell.dark`) */
export const adminDialogShellForTheme = (theme: "light" | "dark") =>
  theme === "dark"
    ? cn(adminDarkDialogShellClass, adminDarkDialogContentClass)
    : cn(adminLightDialogShellClass, adminLightDialogContentClass)

export const adminDialogTitleForTheme = (theme: "light" | "dark") =>
  theme === "dark" ? "text-white" : "text-foreground"

export const adminDialogDescriptionForTheme = (theme: "light" | "dark") =>
  theme === "dark" ? "text-slate-400" : "text-muted-foreground"

export const adminDialogCancelForTheme = (theme: "light" | "dark") =>
  theme === "dark"
    ? "rounded-full border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800 hover:text-white"
    : "rounded-full border-border bg-white text-foreground hover:bg-muted/50"

export const adminDialogPrimaryActionForTheme = (theme: "light" | "dark") =>
  theme === "dark"
    ? "rounded-full bg-rellia-teal text-white hover:bg-rellia-teal/90"
    : "rounded-full"

/** Light admin dropdown / menu surface */
export const adminLightMenuContentClass = cn(
  "z-[10002] overflow-hidden rounded-2xl border border-border/80 bg-white p-1.5 text-foreground shadow-xl shadow-black/12",
)

export const adminLightMenuItemClass = cn(
  "cursor-pointer rounded-lg px-3 py-2.5 text-sm text-foreground",
  "focus:bg-muted focus:text-foreground",
)

export const adminLightMenuSeparatorClass = "my-1 bg-border"

export const adminMenuContentForTheme = (theme: "light" | "dark") =>
  theme === "dark" ? adminDarkMenuContentClass : adminLightMenuContentClass

export const adminMenuItemForTheme = (theme: "light" | "dark") =>
  theme === "dark" ? adminDarkMenuItemClass : adminLightMenuItemClass

export const adminMenuSeparatorForTheme = (theme: "light" | "dark") =>
  theme === "dark" ? adminDarkMenuSeparatorClass : adminLightMenuSeparatorClass

const adminPopoverContentBaseClass = "z-50 rounded-2xl border p-4 shadow-2xl shadow-black/45"

/** Portaled admin popovers — explicit theme (Radix portals sit outside `.admin-shell.dark`) */
export const adminPopoverContentForTheme = (theme: "light" | "dark") =>
  cn(
    adminPopoverContentBaseClass,
    theme === "dark"
      ? cn(
          "border-slate-700/65 bg-slate-900 text-slate-200",
          "[&_.text-muted-foreground]:text-slate-400",
          "[&_textarea]:border-slate-700 [&_textarea]:bg-slate-950 [&_textarea]:text-white [&_textarea]:placeholder:text-slate-500",
        )
      : cn(
          "border-border/80 bg-white text-foreground",
          "[&_.text-muted-foreground]:text-muted-foreground",
          "[&_textarea]:border-input [&_textarea]:bg-white [&_textarea]:text-foreground [&_textarea]:placeholder:text-muted-foreground",
        ),
  )

/** @deprecated Use adminPopoverContentForTheme — kept for in-shell usage with dark: variants */
export const adminPopoverContentClass = cn(
  adminPopoverContentBaseClass,
  "border-border bg-popover text-popover-foreground",
  "dark:border-slate-700/65 dark:bg-slate-900 dark:text-slate-200",
  "[&_.text-muted-foreground]:dark:text-slate-400",
  "[&_textarea]:dark:border-slate-700 [&_textarea]:dark:bg-slate-950 [&_textarea]:dark:text-white [&_textarea]:dark:placeholder:text-slate-500",
)

/** Admin select dropdown surface */
export const adminSelectContentClass = cn(
  "rounded-xl",
  "dark:border-slate-700/65 dark:bg-slate-900 dark:text-slate-200",
  "[&_[data-highlighted]]:dark:bg-white/10 [&_[data-highlighted]]:dark:text-white",
)
