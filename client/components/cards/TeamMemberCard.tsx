import { useEffect, useId, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { personImageByFirstName } from "@/lib/person-image";
import { cn } from "@/lib/utils";

export type TeamMemberCardProps = {
  name: string;
  role?: string;
  bio?: string;
  /** Override default `/images/{Firstname}.png` */
  imageSrc?: string;
  bioOpen?: boolean;
  onBioOpenChange?: (next: boolean) => void;
  className?: string;
};

export function TeamMemberCard({
  name,
  role,
  bio,
  imageSrc,
  bioOpen: bioOpenProp,
  onBioOpenChange,
  className,
}: TeamMemberCardProps) {
  const [uncontrolledBioOpen, setUncontrolledBioOpen] = useState(false);
  const reduceMotion = useReducedMotion();
  const bioId = useId();
  const descriptionText = bio?.trim() ? bio.trim() : "No description";
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

  return (
    <div className={cn("cursor-default", className)}>
      <div className="relative mb-6 aspect-square overflow-hidden rounded-3xl bg-rellia-cream/40 shadow-md">
        <img
          src={src}
          alt={name}
          onError={() => {
            setCandidateIndex((i) => Math.min(i + 1, candidates.length - 1));
          }}
          className={cn(
            "absolute inset-0 h-full w-full object-cover",
            /* Top-anchored so portrait headroom isn’t cropped */
            name === "Megan Kane" ? "object-top" : "object-center",
          )}
        />

        <div
          className={cn(
            "pointer-events-none absolute inset-0 transition-colors duration-300",
            bioOpen ? "bg-rellia-teal/65" : "bg-rellia-teal/0",
          )}
          aria-hidden
        />

        {/* Circular toggle button (morphs into X) */}
        <div className="absolute bottom-4 right-4 z-30">
          <button
            type="button"
            onClick={() => setBioOpen(!bioOpen)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setBioOpen(!bioOpen);
              }
            }}
            className={cn(
              "inline-flex h-12 w-12 items-center justify-center rounded-full border",
              "border-white/20 bg-white/10 text-white backdrop-blur-sm",
              "transition-[background-color,border-color,transform] duration-200 motion-reduce:transition-none",
              "hover:bg-white/15 hover:border-white/30 motion-safe:hover:-translate-y-[1px]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rellia-mint focus-visible:ring-offset-2 focus-visible:ring-offset-rellia-teal",
            )}
            aria-label={bioOpen ? `Close bio for ${name}` : `Open bio for ${name}`}
            aria-controls={bioId}
            aria-expanded={bioOpen}
          >
            <span className="relative block h-5 w-5" aria-hidden>
              <motion.span
                className="absolute inset-0 m-auto h-[2px] w-5 rounded-full bg-white"
                animate={{ rotate: bioOpen ? 45 : 0, opacity: 1 }}
                transition={reduceMotion ? undefined : { duration: 0.18, ease: "easeOut" }}
              />
              <motion.span
                className="absolute inset-0 m-auto h-[2px] w-5 rounded-full bg-white"
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
                className="absolute inset-0 cursor-pointer bg-gradient-to-t from-black/70 via-rellia-teal/55 to-rellia-teal/15"
                aria-label="Close bio overlay"
                onClick={() => setBioOpen(false)}
              />

              <div className="relative flex h-full w-full flex-col px-6 pb-6 pt-10 pr-16">
                <p className="font-host-grotesk text-xl font-semibold text-white leading-tight">
                  Meet {name}
                </p>
                {role ? (
                  <p className="mt-1 font-urbanist text-sm text-white/75 leading-snug">
                    {role}
                  </p>
                ) : null}

                <p className="mt-4 font-urbanist text-sm leading-relaxed text-white/90 md:text-[15px]">
                  {descriptionText}
                </p>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      {/* Name/role */}
      <div>
        <h3 className="mb-1 text-2xl font-bold text-black">{name}</h3>
        {role ? (
          <p className="text-sm font-semibold uppercase tracking-wider text-rellia-teal">{role}</p>
        ) : null}
      </div>
    </div>
  );
}
