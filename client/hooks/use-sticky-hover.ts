import { useCallback, useRef, useState } from "react"

const isPointerInside = (element: HTMLElement, clientX: number, clientY: number) => {
  const rect = element.getBoundingClientRect()
  return (
    clientX >= rect.left &&
    clientX <= rect.right &&
    clientY >= rect.top &&
    clientY <= rect.bottom
  )
}

/** Keeps hover visuals through theme view-transitions where CSS :hover is dropped mid-switch. */
export const useStickyHover = () => {
  const [isHovered, setIsHovered] = useState(false)
  const isPressedRef = useRef(false)

  const syncHoverFromPointer = useCallback((element: HTMLElement, clientX: number, clientY: number) => {
    setIsHovered(isPointerInside(element, clientX, clientY))
  }, [])

  const onPointerEnter = useCallback(() => setIsHovered(true), [])

  const onPointerLeave = useCallback(() => {
    if (isPressedRef.current) return
    setIsHovered(false)
  }, [])

  const onPointerDown = useCallback((event: React.PointerEvent<HTMLElement>) => {
    if (event.button !== 0) return
    isPressedRef.current = true
    setIsHovered(true)
    try {
      event.currentTarget.setPointerCapture(event.pointerId)
    } catch {
      // Pointer capture may be unavailable in some environments.
    }
  }, [])

  const onPointerUp = useCallback((event: React.PointerEvent<HTMLElement>) => {
    const target = event.currentTarget
    if (target.hasPointerCapture(event.pointerId)) {
      target.releasePointerCapture(event.pointerId)
    }
    isPressedRef.current = false
    syncHoverFromPointer(target, event.clientX, event.clientY)
  }, [syncHoverFromPointer])

  const onLostPointerCapture = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      isPressedRef.current = false
      syncHoverFromPointer(event.currentTarget, event.clientX, event.clientY)
    },
    [syncHoverFromPointer],
  )

  return {
    isHovered,
    stickyHoverProps: {
      onPointerEnter,
      onPointerLeave,
      onPointerDown,
      onPointerUp,
      onLostPointerCapture,
    },
  }
}
