import React, { createContext, FunctionComponent } from "react"
import { UrlObject } from "url"

type Url = UrlObject | string

export interface LinkProps {
  href: string
}

export interface GenericRouter {
  push: (url: Url, as?: Url, options?: Record<string, any>) => void
  pathname: string
  asPath: string
}

export interface NavigationContextProps {
  linkComponent: FunctionComponent<LinkProps>
  router: GenericRouter
}

export const NavigationContext = createContext<NavigationContextProps>({
  linkComponent: () => <></>,
  router: {
    push: () => {
      // no-op
    },
    pathname: "",
    asPath: "",
  },
})
