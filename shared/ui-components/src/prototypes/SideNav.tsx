import * as React from "react"
import "./SideNav.scss"

export interface SideNavProps {
  children: React.ReactNode[]
}

const SideNav = (props: SideNavProps) => (
  <nav className="side-nav" aria-label="Secondary navigation">
    <ul>{props.children}</ul>
  </nav>
)

export { SideNav as default, SideNav }
