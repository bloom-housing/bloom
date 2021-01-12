import * as React from "react"
import "./TabNav.scss"

export interface TabNavProps {
  children: React.ReactNode
}

const TabNav = (props: TabNavProps) => (
  <nav className="tab-nav" aria-label="Secondary navigation">
    <ul>{props.children}</ul>
  </nav>
)

export { TabNav as default, TabNav }
