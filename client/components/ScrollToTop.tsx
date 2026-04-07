import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Scrolls to top on route change. If the new location has a hash (e.g. /network#founders),
 * scrolls to that element instead — waits a frame so the destination has a chance to mount.
 */
export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      // Wait for the target section to render before scrolling to it.
      const id = hash.replace(/^#/, "");
      const tryScroll = () => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        } else {
          window.scrollTo(0, 0);
        }
      };
      // rAF twice = after layout + paint
      requestAnimationFrame(() => requestAnimationFrame(tryScroll));
      return;
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
}

