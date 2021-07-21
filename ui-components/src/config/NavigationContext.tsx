import React, { AriaAttributes, createContext, FunctionComponent } from "react"
import { UrlObject } from "url"

type Url = UrlObject | string

export interface LinkProps {
  href: string
  "aria-label"?: string
  "aria-current"?: AriaAttributes["aria-current"]
  className?: string
  tabIndex?: number
}

export interface GenericRouterOptions {
  locale?: string
}

export interface GenericRouter {
  push: (url: Url, as?: Url, options?: GenericRouterOptions) => void
  pathname: string
  asPath: string
  locale?: string
}

export interface NavigationContextProps {
  LinkComponent: FunctionComponent<LinkProps>
  router: GenericRouter
}

export const NavigationContext = createContext<NavigationContextProps>({
  // Replace with an official app solution
  LinkComponent: (props) => (
    <a
      className={props.className}
      href={props.href}
      onClick={(e) => {
        e.preventDefault()
        alert(`You clicked: ${props.href}`)
      }}
      {...(props["aria-label"] ? { "aria-label": props["aria-label"] } : {})}
      {...(props["aria-current"] ? { "aria-current": props["aria-current"] } : {})}
    >
      {props.children}
    </a>
  ),
  router: {
    push: () => {
      // no-op
    },
    pathname: "",
    asPath: "",
    locale: "",
  },
})
