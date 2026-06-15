import { cn } from "@/lib/utils"

/** Outer inset for header, nav, and footer — keeps the icon column aligned. */
export const adminSidebarRailPx = "!px-5 group-data-[collapsible=icon]:!px-[1.125rem]"

/** Fixed icon column — logo, nav icons, and avatar share this slot. */
export const adminSidebarIconSlot = "relative flex h-10 w-10 shrink-0 items-center justify-center"

export const adminSidebarRowClass = "flex w-full items-center"

export const adminSidebarLabelGap = "pl-4"

export const adminSidebarLabelWrapClass = cn(
  "flex min-w-0 flex-1 items-center gap-3 overflow-hidden pr-2",
  adminSidebarLabelGap,
  "opacity-100 transition-[opacity,max-width,padding] duration-200",
  "group-data-[collapsible=icon]:max-w-0 group-data-[collapsible=icon]:flex-none group-data-[collapsible=icon]:overflow-hidden group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:pl-0 group-data-[collapsible=icon]:pr-0 group-data-[collapsible=icon]:opacity-0",
)

export const adminSidebarNavLinkClass = cn(
  adminSidebarRowClass,
  "min-h-11 w-full",
  "group-data-[collapsible=icon]:h-11 group-data-[collapsible=icon]:min-h-11",
)

export const adminSidebarHeaderTextClass = cn(
  "flex min-w-0 flex-1 items-center overflow-hidden pr-2",
  adminSidebarLabelGap,
  "whitespace-nowrap opacity-100 transition-[opacity,max-width,padding] duration-200",
  "group-data-[collapsible=icon]:max-w-0 group-data-[collapsible=icon]:flex-none group-data-[collapsible=icon]:overflow-hidden group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:pl-0 group-data-[collapsible=icon]:pr-0 group-data-[collapsible=icon]:opacity-0",
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

/** Light mint fill + teal outline — overview stat cards on white */
export const adminSelectedItemSurfaceOnLightClass = cn(
  "!bg-rellia-mint/15",
  "!border-2 !border-rellia-teal/35",
)

export const adminSidebarNavButtonClass = cn(
  "relative min-h-11 w-full overflow-hidden rounded-xl px-0 py-1 font-urbanist text-[15px]",
  "transition-[color,background-color,transform,box-shadow] duration-150 ease-out",
  "text-slate-300/90",
  "hover:!bg-white/[0.07] hover:!text-white",
  "active:scale-[0.97] active:!bg-white/[0.12] active:!text-white active:duration-75",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 focus-visible:ring-offset-0",
  "data-[active=true]:!bg-rellia-mint/15 data-[active=true]:font-semibold data-[active=true]:!text-rellia-mint",
  "data-[active=true]:shadow-[inset_0_0_0_1px_rgba(134,239,172,0.14)]",
  "group-data-[collapsible=icon]:!size-11 group-data-[collapsible=icon]:!min-h-11 group-data-[collapsible=icon]:!max-h-11 group-data-[collapsible=icon]:!w-full group-data-[collapsible=icon]:!p-0",
  "[&_svg]:size-[1.125rem] [&_svg]:transition-transform [&_svg]:duration-150",
  "active:[&_svg]:scale-95 data-[active=true]:[&_svg]:text-rellia-mint",
  "data-[active=true]:[&_.attention-badge-count]:!text-white",
)

export const adminSidebarAccountButtonClass = cn(
  adminSidebarRowClass,
  "relative min-h-11 w-full rounded-xl px-0 py-2.5 text-left font-urbanist",
  "transition-[color,background-color,transform] duration-150 ease-out",
  "hover:!bg-white/[0.07] hover:!text-white",
  "active:scale-[0.97] active:!bg-white/[0.12] active:!text-white active:duration-75",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 focus-visible:ring-offset-0",
  "group-data-[collapsible=icon]:!size-11 group-data-[collapsible=icon]:!min-h-11 group-data-[collapsible=icon]:!max-h-11 group-data-[collapsible=icon]:!w-full group-data-[collapsible=icon]:!p-0",
)

export const adminSidebarAccountTextClass = cn(
  "min-w-0 flex-1 space-y-1 overflow-hidden",
  adminSidebarLabelGap,
  "transition-[opacity,max-width,padding] duration-200",
  "group-data-[collapsible=icon]:max-w-0 group-data-[collapsible=icon]:flex-none group-data-[collapsible=icon]:overflow-hidden group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:opacity-0",
)

export const adminSidebarHeaderClass = cn(
  "!gap-0 !py-0",
  "flex h-[4.25rem] shrink-0 flex-col justify-center overflow-hidden border-b border-slate-800/60",
  adminSidebarRailPx,
)

export const adminSidebarFooterClass = cn(
  "!gap-0 !py-0",
  "shrink-0 overflow-hidden border-t border-slate-800 !pb-3 !pt-3",
  adminSidebarRailPx,
)

export const adminSidebarContentClass = cn(
  "flex-1 overflow-x-hidden pb-6 pt-6",
  adminSidebarRailPx,
)
