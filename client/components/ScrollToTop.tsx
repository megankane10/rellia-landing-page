import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Scrolls to top on route change. If the new location has a hash (e.g. /founders#signup),
 * scrolls to that element instead — waits a frame so the destination has a chance to mount.
 */
export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    const id = hash?.replace("#", "").trim()

    if (!id) {
      window.scrollTo(0, 0)
      return
    }

    const scrollToId = () => {
      const el = document.getElementById(id)
      if (!el) return false
      const y = el.getBoundingClientRect().top + window.scrollY - 92
      window.scrollTo({ top: y, behavior: "smooth" })
      return true
    }

    // Wait for route paint; retry briefly in case content mounts after navigation.
    if (scrollToId()) return
    const t1 = window.setTimeout(() => scrollToId(), 50)
    const t2 = window.setTimeout(() => scrollToId(), 150)
    return () => {
      window.clearTimeout(t1)
      window.clearTimeout(t2)
    }
  }, [pathname, hash]);

  return null;
}

