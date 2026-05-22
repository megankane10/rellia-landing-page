import type { NavbarProps } from "@/components/Navbar"

/** Shared navbar overrides for admin portal pages. */
export const ADMIN_NAVBAR_PROPS: Pick<
  NavbarProps,
  "forceSolid" | "ctaLabel" | "ctaTo" | "ctaOpenInNewTab" | "hideAnnouncement"
> = {
  forceSolid: true,
  ctaLabel: "Manage website",
  ctaTo: "/api/studio",
  ctaOpenInNewTab: true,
  hideAnnouncement: true,
}

/** Offset below fixed site navbar (matches Navbar h-[72px] md:h-[86px]). */
export const ADMIN_NAVBAR_OFFSET_CLASS = "pt-[72px] md:pt-[86px]"
