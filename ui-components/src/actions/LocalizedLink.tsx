import React, { createElement, useContext } from "react"
import { LinkProps, NavigationContext } from "../config/NavigationContext"

export interface LocalizedLinkProps {
  children?: React.ReactNode
  href: string
  className?: string
  aria?: Record<string, string>
  tabIndex?: number
}

const LocalizedLink = (props: LocalizedLinkProps) => {
  const { linkComponent } = useContext(NavigationContext)
  const ariaAttributes = props.aria || {}

  return createElement<LinkProps>(
    linkComponent,
    { href: props.href },
    <a className={props.className} tabIndex={props.tabIndex} {...ariaAttributes}>
      {props.children}
    </a>
  )
}

export { LocalizedLink as default, LocalizedLink }
