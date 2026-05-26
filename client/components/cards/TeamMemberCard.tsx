import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { personImageByFirstName } from "@/lib/person-image";
import { cn } from "@/lib/utils";

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="currentColor"
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.476-.9 1.637-1.85 3.37-1.85 3.604 0 4.268 2.372 4.268 5.456v6.285ZM5.337 7.433a2.063 2.063 0 1 1 0-4.126 2.063 2.063 0 0 1 0 4.126ZM7.114 20.452H3.56V9h3.554v11.452Z" />
    </svg>
  );
}

function WebsiteIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="currentColor"
    >
      <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2Zm7.93 9h-3.106a15.32 15.32 0 0 0-1.237-5.03A8.03 8.03 0 0 1 19.93 11ZM12 4.07c.86 1.19 1.578 3.3 1.93 5.93H10.07C10.422 7.37 11.14 5.26 12 4.07ZM4.07 13h3.106c.204 1.82.695 3.6 1.237 5.03A8.03 8.03 0 0 1 4.07 13Zm3.106-2H4.07a8.03 8.03 0 0 1 4.343-5.03A15.32 15.32 0 0 0 7.176 11ZM12 19.93c-.86-1.19-1.578-3.3-1.93-5.93h3.86c-.352 2.63-1.07 4.74-1.93 5.93ZM14.93 13h-5.86a15.1 15.1 0 0 1 0-2h5.86a15.1 15.1 0 0 1 0 2Zm1.657 5.03c.542-1.43 1.033-3.21 1.237-5.03h3.106a8.03 8.03 0 0 1-4.343 5.03ZM16.824 11c-.204-1.82-.695-3.6-1.237-5.03A8.03 8.03 0 0 1 19.93 11h-3.106Z" />
    </svg>
  );
}

export type TeamMemberCardProps = {
  name: string;
  role?: string;
  bio?: string;
  /** Override default `/images/{Firstname}.png` */
  imageSrc?: string;
  linkedinUrl?: string;
  websiteUrl?: string;
  bioOpen?: boolean;
  onBioOpenChange?: (next: boolean) => void;
  className?: string;
};

export function TeamMemberCard({
  name,
  role,
  bio,
  imageSrc,
  linkedinUrl,
  websiteUrl,
  bioOpen: bioOpenProp,
  onBioOpenChange,
  className,
}: TeamMemberCardProps) {
  const [uncontrolledBioOpen, setUncontrolledBioOpen] = useState(false);
  const reduceMotion = useReducedMotion();
  const bioId = useId();
  const rootRef = useRef<HTMLDivElement | null>(null)
  const descriptionText = bio?.trim() ? bio.trim() : "No description";
  const hasSocialLinks = Boolean(linkedinUrl || websiteUrl);
  const bioOpen = typeof bioOpenProp === "boolean" ? bioOpenProp : uncontrolledBioOpen;

  const setBioOpen = (next: boolean) => {
    onBioOpenChange?.(next);
    if (typeof bioOpenProp !== "boolean") setUncontrolledBioOpen(next);
  };

  // Team images live in `public/images/` but the extension varies (.png / .jpg / .jpeg).
  // Try common extensions so the card doesn't break if the file is not a .png.
  const base = imageSrc ?? personImageByFirstName(name);
  const baseNoExt = base.replace(/\.(png|jpe?g)$/i, "");
  const candidates = Array.from(
    new Set([
      base,
      `${baseNoExt}.png`,
      `${baseNoExt}.jpg`,
      `${baseNoExt}.jpeg`,
    ]),
  );

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
                      <div className="flex h-9 items-center gap-3">
                        {linkedinUrl ? (
                          <a
                            href={linkedinUrl}
                            target="_blank"
                            rel="noreferrer"
                            className={cn(
                              "inline-flex h-9 w-9 items-center justify-center text-white visited:text-white",
                              "rounded-xl border border-white/25 bg-white/10 backdrop-blur-sm will-change-[backdrop-filter]",
                              "transition-[color,background-color,border-color] duration-200 ease-in-out delay-75",
                              "hover:text-rellia-mint visited:hover:text-rellia-mint hover:border-white/40 hover:bg-white/15",
                              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rellia-mint focus-visible:ring-offset-2 focus-visible:ring-offset-rellia-teal",
                            )}
                            aria-label={`Open LinkedIn profile for ${name}`}
                          >
                            <LinkedInIcon className="h-5 w-5" />
                          </a>
                        ) : null}

                        {websiteUrl ? (
                          <a
                            href={websiteUrl}
                            target="_blank"
                            rel="noreferrer"
                            className={cn(
                              "inline-flex h-9 w-9 items-center justify-center text-white visited:text-white",
                              "rounded-xl border border-white/25 bg-white/10 backdrop-blur-sm will-change-[backdrop-filter]",
                              "transition-[color,background-color,border-color] duration-200 ease-in-out delay-75",
                              "hover:text-rellia-mint visited:hover:text-rellia-mint hover:border-white/40 hover:bg-white/15",
                              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rellia-mint focus-visible:ring-offset-2 focus-visible:ring-offset-rellia-teal",
                            )}
                            aria-label={`Open website for ${name}`}
                          >
                            <WebsiteIcon className="h-5 w-5" />
                          </a>
                        ) : null}
                      </div>
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
        <h3 className="mb-1 text-lg font-semibold text-black md:text-xl">{name}</h3>
        {role ? (
          <p className="text-sm font-semibold text-rellia-teal md:text-base">{role}</p>
        ) : null}
      </div>
    </div>
  );
}
