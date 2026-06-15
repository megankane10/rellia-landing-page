import { useEffect, useRef, useState, type RefObject } from "react"
import { cn } from "@/lib/utils"

type TeamNoteReactionButtonProps = {
  emoji: string
  active: boolean
  count: number
  flyBoundsRef: RefObject<HTMLElement | null>
  flyLayerRef: RefObject<HTMLElement | null>
  disabled?: boolean
  className?: string
  onClick: () => void
  "aria-label"?: string
}

const FLOAT_COUNT = 4

type FloatProfile = {
  offsetX: number
  offsetY: number
  driftMid: number
  driftLate: number
  peakScale: number
  startScale: number
  duration: number
  delay: number
}

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches

const buildFloatProfiles = (seed: number): FloatProfile[] =>
  Array.from({ length: FLOAT_COUNT }, (_, index) => {
    const n = (seed + index * 131) % 97
    return {
      offsetX: ((n % 9) - 4) * 9,
      offsetY: (n % 4) * 3,
      driftMid: ((n + 3) % 7 - 3) * 8,
      driftLate: ((n + 5) % 5 - 2) * 10,
      peakScale: 1.28 + (n % 4) * 0.07,
      startScale: 0.88 + (n % 3) * 0.05,
      duration: 2550 + (n % 5) * 130,
      delay: index * 12 + (n % 3) * 8,
    }
  })

const playButtonPress = (button: HTMLButtonElement) => {
  if (prefersReducedMotion()) return

  button.animate(
    [
      { transform: "scale(1)" },
      { transform: "scale(0.9)" },
      { transform: "scale(1.04)" },
      { transform: "scale(1)" },
    ],
    { duration: 220, easing: "cubic-bezier(0.22, 1, 0.36, 1)", fill: "none" },
  )
}

const spawnSingleFloater = (
  emoji: string,
  layer: HTMLElement,
  button: HTMLButtonElement,
  bounds: HTMLElement,
  profile: FloatProfile,
) => {
  const layerRect = layer.getBoundingClientRect()
  const buttonRect = button.getBoundingClientRect()
  const boundsRect = bounds.getBoundingClientRect()

  const startX = buttonRect.left + buttonRect.width / 2 - layerRect.left + profile.offsetX
  const startY = buttonRect.top + buttonRect.height / 2 - layerRect.top + profile.offsetY
  const endY = 24
  const travel = Math.max(startY - (boundsRect.top - layerRect.top + endY), 80)
  const reducedMotion = prefersReducedMotion()

  const el = document.createElement("span")
  el.setAttribute("aria-hidden", "true")
  el.textContent = emoji
  el.className =
    "pointer-events-none absolute z-30 select-none text-[2rem] leading-none drop-shadow-[0_4px_14px_rgba(13,53,64,0.2)]"
  el.style.left = `${startX}px`
  el.style.top = `${startY}px`
  layer.appendChild(el)

  const { peakScale, startScale, driftMid, driftLate } = profile
  const keyframes = reducedMotion
    ? [
        { transform: `translate(-50%, -50%) scale(${startScale})`, opacity: 0.85 },
        { transform: `translate(-50%, calc(-50% - ${travel}px)) scale(1)`, opacity: 0 },
      ]
    : [
        { transform: `translate(-50%, -50%) scale(${startScale * 0.7})`, opacity: 0 },
        {
          transform: `translate(-50%, -50%) scale(${peakScale})`,
          opacity: 1,
          offset: 0.1,
        },
        {
          transform: `translate(calc(-50% + ${driftMid * 0.35}px), calc(-50% - ${travel * 0.35}px)) scale(${peakScale * 0.96})`,
          opacity: 1,
          offset: 0.38,
        },
        {
          transform: `translate(calc(-50% + ${driftMid}px), calc(-50% - ${travel * 0.62}px)) scale(${peakScale * 0.88})`,
          opacity: 0.88,
          offset: 0.62,
        },
        {
          transform: `translate(calc(-50% + ${driftLate}px), calc(-50% - ${travel * 0.84}px)) scale(${peakScale * 0.76})`,
          opacity: 0.45,
          offset: 0.86,
        },
        {
          transform: `translate(calc(-50% + ${driftLate * 0.4}px), calc(-50% - ${travel}px)) scale(0.92)`,
          opacity: 0,
          offset: 1,
        },
      ]

  const animation = el.animate(keyframes, {
    duration: reducedMotion ? 500 : profile.duration,
    delay: reducedMotion ? 0 : profile.delay,
    easing: reducedMotion ? "ease-out" : "cubic-bezier(0.22, 0.61, 0.36, 1)",
    fill: "forwards",
  })

  const cleanup = () => el.remove()
  animation.onfinish = cleanup
  animation.oncancel = cleanup
}

const spawnFlyUpEmojis = (
  emoji: string,
  button: HTMLButtonElement,
  bounds: HTMLElement,
  layer: HTMLElement,
) => {
  const profiles = buildFloatProfiles(Date.now())
  for (const profile of profiles) {
    spawnSingleFloater(emoji, layer, button, bounds, profile)
  }
}

const TeamNoteReactionButton = ({
  emoji,
  active,
  count,
  flyBoundsRef,
  flyLayerRef,
  disabled,
  className,
  onClick,
  "aria-label": ariaLabel,
}: TeamNoteReactionButtonProps) => {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const prevCountRef = useRef(count)
  const [countPopKey, setCountPopKey] = useState(0)

  useEffect(() => {
    if (count > prevCountRef.current) {
      setCountPopKey((key) => key + 1)
    }
    prevCountRef.current = count
  }, [count])

  const handleClick = () => {
    if (disabled) return

    const button = buttonRef.current
    const bounds = flyBoundsRef.current
    const layer = flyLayerRef.current
    const isAdding = !active

    if (button) {
      playButtonPress(button)
    }

    if (isAdding && button && bounds && layer) {
      spawnFlyUpEmojis(emoji, button, bounds, layer)
    }

    onClick()
  }

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={handleClick}
      disabled={disabled}
      className={cn(
        "transform-gpu transition-transform duration-75 active:scale-[0.9]",
        className,
      )}
      aria-pressed={active}
      aria-label={ariaLabel ?? `React with ${emoji}${count > 0 ? `, ${count} reactions` : ""}`}
    >
      <span aria-hidden>{emoji}</span>
      {count > 0 ? (
        <span
          key={`reaction-count-${countPopKey}`}
          className="team-reaction-count-pop text-xs font-semibold tabular-nums"
        >
          {count}
        </span>
      ) : null}
    </button>
  )
}

export default TeamNoteReactionButton
