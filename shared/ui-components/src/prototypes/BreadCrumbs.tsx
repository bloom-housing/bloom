import * as React from "react"
import "./BreadCrumbs.scss"

export interface BreadCrumbsProps {
  children: React.ReactNode[]
}

const BreadCrumbs = (props: BreadCrumbsProps) => (
  <nav className="breadcrumbs" aria-label="Breadcrumbs">
    <ol>{props.children}</ol>
  </nav>
)

export { BreadCrumbs as default, BreadCrumbs }
