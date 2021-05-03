import React, { PropsWithChildren, useContext } from "react"
import { LinkProps, NavigationContext } from "../config/NavigationContext"

// Legacy use only, deprecated
const LocalizedLink = (props: PropsWithChildren<LinkProps>) => {
  const { LinkComponent } = useContext(NavigationContext)

  return <LinkComponent {...props}>{props.children}</LinkComponent>
}

export { LocalizedLink as default, LocalizedLink }
