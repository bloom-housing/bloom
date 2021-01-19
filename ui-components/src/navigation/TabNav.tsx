import React from "react"
import { LocalizedLink } from "../actions/LocalizedLink"
import "./TabNav.scss"

export interface TabProps {
  href: string
  current?: boolean
  children: React.ReactNode
}

const Tab = (props: TabProps) => {
  return (
    <li className="tab-nav__tab">
      <LocalizedLink
        className={props.current ? "is-active" : undefined}
        aria={props.current ? { "aria-current": "page" } : undefined}
        href={props.href}
      >
        {props.children}
      </LocalizedLink>
    </li>
  )
}

const TabNav = (props: { children: React.ReactNode }) => {
  return (
    <nav className="tab-nav" role="tablist" aria-label="Secondary navigation">
      <ul>{props.children}</ul>
    </nav>
  )
}

export { TabNav as default, TabNav, Tab }
