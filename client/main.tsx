import React from "react"
import "./global.css"
import { createRoot, hydrateRoot } from "react-dom/client"
import App from "./App"
import { isClientOnlyAuthPath, normalizePathname } from "@/config/seo"

const container = document.getElementById("root")

if (container) {
  const app = (
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )

  const pathname = normalizePathname(window.location.pathname)
  const isClientOnlyRoute =
    isClientOnlyAuthPath(pathname) || pathname === "/programs" || pathname.startsWith("/programs/")

  const hasServerMarkup =
    container.hasChildNodes() || container.innerHTML.trim().length > 0

  if (!isClientOnlyRoute && hasServerMarkup) {
    hydrateRoot(container, app)
  } else {
    createRoot(container).render(app)
  }
}
