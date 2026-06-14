import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ProfileSocialLinks, type ProfileSocialLink } from "@/components/network/ProfileSocialLinks";
import { personImageByFirstName } from "@/lib/person-image";
import { cn } from "@/lib/utils";
import { cmsCleanText, cmsDisplayText } from "@/lib/cmsStega";

export type TeamMemberCardProps = {
  name: string;
  role?: string;
  bio?: string;
  /** Override default `/images/{Firstname}.png` */
  imageSrc?: string;
  socialLinks?: ProfileSocialLink[];
  bioOpen?: boolean;
  onBioOpenChange?: (next: boolean) => void;
  className?: string;
};

export function TeamMemberCard({
  name,
  role,
  bio,
  imageSrc,
  socialLinks,
  bioOpen: bioOpenProp,
  onBioOpenChange,
  className,
}: TeamMemberCardProps) {
  const [uncontrolledBioOpen, setUncontrolledBioOpen] = useState(false);
  const reduceMotion = useReducedMotion();
  const bioId = useId();
  const rootRef = useRef<HTMLDivElement | null>(null)
  const descriptionText = bio?.trim() ? cmsDisplayText(bio) : "No description";
  const hasSocialLinks = Array.isArray(socialLinks) && socialLinks.length > 0;
  const bioOpen = typeof bioOpenProp === "boolean" ? bioOpenProp : uncontrolledBioOpen;

  const setBioOpen = (next: boolean) => {
    onBioOpenChange?.(next);
    if (typeof bioOpenProp !== "boolean") setUncontrolledBioOpen(next);
  };

  const base = imageSrc ?? personImageByFirstName(name)
  const isRemoteImage = /^https?:\/\//i.test(base)
  const baseNoExt = base.replace(/\.(png|jpe?g)$/i, "")
  const candidates = isRemoteImage
    ? [base]
    : Array.from(
        new Set([
          base,
          `${baseNoExt}.png`,
          `${baseNoExt}.jpg`,
          `${baseNoExt}.jpeg`,
        ]),
      )

  const [candidateIndex, setCandidateIndex] = useState(0);
  const src = candidates[Math.min(candidateIndex, candidates.length - 1)];

  useEffect(() => {
    setCandidateIndex(0);
  }, [name, imageSrc]);

  useEffect(() => {
    if (!bioOpen) return

    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      const root = rootRef.current
      const target = event.target as Node | null
      if (!root || !target) return
      if (root.contains(target)) return
      setBioOpen(false)
    }

    document.addEventListener("mousedown", handlePointerDown)
    document.addEventListener("touchstart", handlePointerDown, { passive: true })

    return () => {
      document.removeEventListener("mousedown", handlePointerDown)
      document.removeEventListener("touchstart", handlePointerDown)
    }
  }, [bioOpen, setBioOpen])

  const handleToggleBio = () => {
    setBioOpen(!bioOpen)
  }

  return (
    <div ref={rootRef} className={cn("cursor-default", className)}>
      <div
        className="group relative mb-6 aspect-square overflow-hidden rounded-3xl bg-rellia-cream/40 shadow-md cursor-pointer"
        role="button"
        tabIndex={0}
        aria-label={bioOpen ? `Close bio for ${name}` : `Open bio for ${name}`}
        aria-controls={bioId}
        aria-expanded={bioOpen}
        onClick={handleToggleBio}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            handleToggleBio()
          }
        }}
      >
        <img
          src={src}
          alt={name}
          onError={() => {
            setCandidateIndex((i) => Math.min(i + 1, candidates.length - 1));
          }}
          className={cn(
            "absolute inset-0 h-full w-full object-cover",
            /* Top-anchored so portrait headroom isn’t cropped */
            name === "Megan Kane"
              ? "object-[50%_0%]"
              : name === "Khali Abdi"
                ? "object-[50%_20%]"
                : "object-center",
          )}
        />

        <div
          className={cn(
            "pointer-events-none absolute inset-0 transition-colors duration-300",
            bioOpen ? "bg-rellia-teal/40" : "bg-rellia-teal/0 group-hover:bg-rellia-teal/12",
          )}
          aria-hidden
        />

        {/* Circular toggle button (morphs into X) */}
        <div className="absolute bottom-4 right-4 z-30">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              setBioOpen(!bioOpen)
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                e.stopPropagation()
                setBioOpen(!bioOpen);
              }
            }}
            className={cn(
              "inline-flex h-12 w-12 items-center justify-center rounded-full border",
              "border-white/20 bg-white/10 text-white backdrop-blur-sm",
              "transition-[background-color,border-color,transform] duration-200 motion-reduce:transition-none",
              "hover:bg-rellia-mint hover:border-rellia-mint hover:text-rellia-teal motion-safe:hover:-translate-y-[1px]",
              "group-hover:bg-rellia-mint group-hover:border-rellia-mint group-hover:text-rellia-teal motion-safe:group-hover:-translate-y-[1px]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rellia-mint focus-visible:ring-offset-2 focus-visible:ring-offset-rellia-teal",
            )}
            aria-label={bioOpen ? `Close bio for ${name}` : `Open bio for ${name}`}
            aria-controls={bioId}
            aria-expanded={bioOpen}
          >
            <span className="relative block h-5 w-5" aria-hidden>
              <motion.span
                className="absolute inset-0 m-auto h-[2px] w-5 rounded-full bg-current"
                animate={{ rotate: bioOpen ? 45 : 0, opacity: 1 }}
                transition={reduceMotion ? undefined : { duration: 0.18, ease: "easeOut" }}
              />
              <motion.span
                className="absolute inset-0 m-auto h-[2px] w-5 rounded-full bg-current"
                animate={{ rotate: bioOpen ? -45 : 90, opacity: bioOpen ? 1 : 0.9 }}
                transition={reduceMotion ? undefined : { duration: 0.18, ease: "easeOut" }}
              />
            </span>
          </button>
        </div>

        {/* Full-bleed overlay */}
        <AnimatePresence>
          {bioOpen ? (
            <motion.div
              id={bioId}
              initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
              transition={reduceMotion ? undefined : { duration: 0.28, ease: "easeOut" }}
              className="absolute inset-0 z-20"
              role="dialog"
              aria-modal="true"
              aria-label={`Bio for ${name}`}
            >
              <button
                type="button"
                className="absolute inset-0 cursor-pointer bg-gradient-to-t from-black/65 via-rellia-teal/45 to-rellia-teal/10"
                aria-label="Close bio overlay"
                onClick={() => setBioOpen(false)}
              />

              <div className="relative flex h-full w-full flex-col px-6 pb-6 pt-10 text-left">
                <h4 className="font-host-grotesk text-lg font-bold text-rellia-mint leading-tight mb-2">
                  Meet {name}
                </h4>

                <div className="flex-1 overflow-y-auto pr-1">
                  <p className="font-urbanist text-sm leading-relaxed text-white/90 md:text-[15px]">
                    {descriptionText}
                  </p>

                  {hasSocialLinks ? (
                    <>
                      <div className="h-px w-full bg-white/20 my-4" aria-hidden />
                      <ProfileSocialLinks
                        links={socialLinks}
                        className="gap-2"
                        iconClassName="h-4 w-4"
                        variant="onDark"
                      />
                    </>
                  ) : null}
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      {/* Name/role */}
      <div>
        <h3 className="mb-1 text-lg font-semibold text-black md:text-xl">{cmsDisplayText(name)}</h3>
        {role ? (
          <p className="text-sm font-semibold text-rellia-teal md:text-base">{cmsDisplayText(role)}</p>
        ) : null}
      </div>
    </div>
  );
}
