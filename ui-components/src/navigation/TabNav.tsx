import React from "react"
import { LocalizedLink } from "../actions/LocalizedLink"
import { Tag } from "../text/Tag"
import "./TabNav.scss"

export interface TabNavItemProps {
  href: string
  current?: boolean
  tagContent?: React.ReactNode
  children: React.ReactNode
}

const TabNavItem = (props: TabNavItemProps) => {
  const tabRef = React.useRef<HTMLLIElement>(null)

  const handleKeyboard = (event: React.KeyboardEvent) => {
    if (event.key == "ArrowLeft") {
      const previousTab = tabRef.current?.previousSibling as HTMLElement
      previousTab?.querySelector("a")?.focus()
    } else if (event.key == "ArrowRight") {
      const nextTab = tabRef.current?.nextSibling as HTMLElement
      nextTab?.querySelector("a")?.focus()
    }
  }

  return (
    <li
      role="tab"
      aria-selected={props.current ? "true" : undefined}
      ref={tabRef}
      onKeyUp={handleKeyboard}
      className="tab-nav__tab"
    >
      <LocalizedLink
        className={props.current ? "is-active" : undefined}
        aria={props.current ? { "aria-current": "page" } : undefined}
        href={props.href}
        tabIndex={props.current ? 0 : -1}
      >
        {props.children}
        {props.tagContent && <Tag pillStyle={true}>{props.tagContent}</Tag>}
      </LocalizedLink>
    </li>
  )
}

const TabNav = (props: { children: React.ReactNode }) => {
  return (
    <nav className="tab-nav">
      <ul role="tablist" aria-label="Secondary navigation">
        {props.children}
      </ul>
    </nav>
  )
}

export { TabNav as default, TabNav, TabNavItem }
