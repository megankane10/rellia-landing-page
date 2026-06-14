import React from "react"
import "./global.css"
import { hydrateRoot } from "react-dom/client"
import App from "./App"

const container = document.getElementById("root")

if (container) {
  hydrateRoot(
    container,
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
}
