import dynamic from "next/dynamic"
import React, { useEffect } from "react"

const DynamicAgTable = dynamic(
  () => import("@bloom-housing/ui-components/src/tables/AgTable").then((mod) => mod.default),
  {
    ssr: false,
  }
)

const ensureStyleLink = (id: string, href: string) => {
  if (typeof document === "undefined") return
  if (document.getElementById(id)) return

  const linkElement = document.createElement("link")
  linkElement.id = id
  linkElement.rel = "stylesheet"
  linkElement.href = href
  document.head.appendChild(linkElement)
}

const LazyAgTable = (props) => {
  useEffect(() => {
    ensureStyleLink(
      "ag-grid-css-core",
      "https://cdn.jsdelivr.net/npm/ag-grid-community@26.0.0/dist/styles/ag-grid.css"
    )
    ensureStyleLink(
      "ag-grid-css-theme-alpine",
      "https://cdn.jsdelivr.net/npm/ag-grid-community@26.0.0/dist/styles/ag-theme-alpine.css"
    )
  }, [])

  return <DynamicAgTable {...props} />
}

export default LazyAgTable
