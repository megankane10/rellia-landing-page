/** Compact related cards for programs/events — 2–3 per row, not full-width list items. */
export const RELATED_COMPACT_GRID_CLASS =
  "mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 md:mt-10 lg:grid-cols-3 lg:gap-6 xl:gap-8"

/** Square thumbnail — inset via card padding. */
export const RELATED_COMPACT_IMAGE_CLASS =
  "relative aspect-square w-full shrink-0 overflow-hidden rounded-xl"

export const RELATED_COMPACT_CARD_HOVER_CLASS =
  "transition-all duration-500 ease-out outline outline-2 outline-offset-[4px] outline-transparent hover:outline-rellia-teal hover:-translate-y-0.5"

/** Uniform inset for image + text inside the hover outline. */
export const RELATED_COMPACT_CARD_INSET_CLASS = "p-3 sm:p-4"

export const RELATED_COMPACT_CONTENT_CLASS = "flex min-h-0 flex-1 flex-col pt-3"

/** Event cards — content height follows copy (no flex grow in equal-height grid rows). */
export const RELATED_COMPACT_EVENT_CONTENT_CLASS = "flex flex-col pt-3"

export const RELATED_COMPACT_EVENTS_GRID_CLASS = `${RELATED_COMPACT_GRID_CLASS} items-start`

export const RELATED_COMPACT_BADGE_ROW_CLASS = "flex flex-wrap items-center gap-x-2 gap-y-1.5"

export const RELATED_COMPACT_BADGE_CLASS =
  "inline-flex w-fit shrink-0 items-center gap-1 rounded-full px-2.5 py-1 font-host-grotesk text-[9px] font-semibold uppercase tracking-[0.12em] ring-1 ring-black/5 sm:text-[10px]"

export const RELATED_COMPACT_META_CLASS =
  "min-w-0 font-urbanist text-xs font-medium leading-snug text-black/55 md:text-[13px]"

export const RELATED_COMPACT_EVENT_SCHEDULE_CLASS =
  "min-w-0 font-urbanist text-xs font-semibold leading-snug text-rellia-teal md:text-[13px]"

export const RELATED_COMPACT_TITLE_CLASS =
  "mt-2 line-clamp-2 font-host-grotesk text-lg font-semibold leading-snug text-black group-hover:text-rellia-teal group-hover:underline group-hover:underline-offset-4 md:text-xl"

export const RELATED_COMPACT_DEADLINE_CLASS = "mt-auto pt-3 flex items-end gap-2.5 text-black"

export const RELATED_COMPACT_DEADLINE_TEXT_CLASS =
  "font-host-grotesk text-[11px] font-bold uppercase tracking-[0.18em] text-black/80 md:text-[12px]"

