import React from "react"
import { LocalizedLink } from "../actions/LocalizedLink"
import { Tag } from "../text/Tag"
import "./TabNav.scss"
import { AppearanceSizeType } from "../../src/global/AppearanceTypes"

export interface TabProps {
  href: string
  current?: boolean
  tagContent?: React.ReactNode
  children: React.ReactNode
}

const Tab = (props: TabProps) => {
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
          <Tag pillStyle={true} size={AppearanceSizeType.small}>
            {props.tagContent}
          </Tag>
        )}
      </LocalizedLink>
    </li>
  )
}

const TabNav = (props: { className: string; children: React.ReactNode }) => {
  const classNames = ["tab-nav"]

  if (props.className) {
    classNames.push(props.className)
  }

  return (
    <nav className={classNames.join(" ")}>
      <ul role="tablist" aria-label="Secondary navigation">
        {props.children}
      </ul>
    </nav>
  )
}

export { TabNav as default, TabNav, Tab }
