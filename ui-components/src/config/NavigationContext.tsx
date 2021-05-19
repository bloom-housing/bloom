import React, { createContext, FunctionComponent } from "react"
import { UrlObject } from "url"

type Url = UrlObject | string

export interface LinkProps {
  href: string
  aria?: Record<string, string>
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
}

export interface NavigationContextProps {
  LinkComponent: FunctionComponent<LinkProps>
  router: GenericRouter
}

export const NavigationContext = createContext<NavigationContextProps>({
  LinkComponent: (props) => <a href={props.href}>{props.children}</a>,
  router: {
    push: () => {
      // no-op
    },
    pathname: "",
    asPath: "",
  },
})
