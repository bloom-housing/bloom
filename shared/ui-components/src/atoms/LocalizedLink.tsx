import * as React from "react"
import Link from "next/link"
import { lRoute } from "../helpers/localeRoute"

export interface LocalizedLinkProps {
  href: string
  as?: string
  className?: string
  children?: any
}

const LocalizedLink = (props: LocalizedLinkProps) => {
  const localizedProps: LocalizedLinkProps = { href: "" }
  if (props.as) {
    localizedProps.as = lRoute(props.as)
    localizedProps.href = props.href
  } else {
    localizedProps.href = lRoute(props.href)
  }

  return (
    <Link {...localizedProps}>
      <a className={props.className}>{props.children}</a>
    </Link>
  )
}

export { LocalizedLink as default, LocalizedLink }
