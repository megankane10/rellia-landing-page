import React from "react"
import "./global.css"
import { createRoot, hydrateRoot } from "react-dom/client"
import App from "./App"
import { isClientOnlyAuthPath } from "@/config/seo"

const container = document.getElementById("root")

if (container) {
  const app = (
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )

  if (isClientOnlyAuthPath(window.location.pathname)) {
    createRoot(container).render(app)
  } else {
    hydrateRoot(container, app)
  }
}
