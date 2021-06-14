import React from "react"
import { LocalizedLink } from "../actions/LocalizedLink"
import { AppearanceSizeType } from "../global/AppearanceTypes"
import { Tag } from "../text/Tag"
import "./TabNav.scss"

export interface TabNavItemProps {
  href: string
  current?: boolean
  tagContent?: React.ReactNode
  tagSize?: AppearanceSizeType
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
        {props.tagContent && (
          <Tag pillStyle={true} size={props.tagSize ? props.tagSize : AppearanceSizeType.normal}>
            {props.tagContent}
          </Tag>
        )}
      </LocalizedLink>
    </li>
  )
}

const TabNav = (props: { children: React.ReactNode; className?: string }) => {
  const classes = ["tab-nav"]

  if (props.className) {
    classes.push(props.className)
  }

  return (
    <nav className={classes.join(" ")}>
      <ul role="tablist" aria-label="Secondary navigation">
        {props.children}
      </ul>
    </nav>
  )
}

export { TabNav as default, TabNav, TabNavItem }
