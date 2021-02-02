import * as React from "react"
import Link from "next/link"
import { lRoute } from "../helpers/localeRoute"

export interface LocalizedLinkProps {
  href: string
  as?: string
  className?: string
  children?: any
  aria?: Record<string, string>
  tabIndex?: number
}

const LocalizedLink = (props: LocalizedLinkProps) => {
  const ariaAttributes = props.aria || {}
  const localizedProps: LocalizedLinkProps = { href: "" }
  if (props.as) {
    localizedProps.as = lRoute(props.as)
    localizedProps.href = props.href
  } else {
    localizedProps.href = lRoute(props.href)
  }

  return (
    <Link {...localizedProps}>
      <a className={props.className} tabIndex={props.tabIndex} {...ariaAttributes}>
        {props.children}
      </a>
    </Link>
  )
}

export { LocalizedLink as default, LocalizedLink }
