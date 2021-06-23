import React from "react"
import { LocalizedLink } from "../actions/LocalizedLink"
import "./Breadcrumbs.scss"

export interface BreadcrumbsProps {
  children: React.ReactNode
}

const BreadcrumbLink = (props: { href: string; children: React.ReactNode; current?: boolean }) => (
  <li>
    <LocalizedLink
      className={props.current ? "is-active" : undefined}
      aria-current={props.current ? "page" : undefined}
      href={props.href}
    >
      {props.children}
    </LocalizedLink>
  </li>
)

const Breadcrumbs = (props: BreadcrumbsProps) => (
  <nav className="breadcrumbs" aria-label="Breadcrumb">
    <ol>{props.children}</ol>
  </nav>
)

export { Breadcrumbs as default, Breadcrumbs, BreadcrumbLink }
