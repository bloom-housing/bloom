import React, {
  createContext,
  FunctionComponent,
  AnchorHTMLAttributes,
  DetailedHTMLProps,
  RefObject,
} from "react"
import { UrlObject } from "url"

type Url = UrlObject | string

type DefaultLinkProps = DetailedHTMLProps<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  HTMLAnchorElement
>

export interface LinkProps extends DefaultLinkProps {
  className?: string
  linkref?: React.RefObject<HTMLAnchorElement>
}

export interface GenericRouterOptions {
  locale?: string
}

export interface GenericRouter {
  push: (url: Url, as?: Url, options?: GenericRouterOptions) => void
  back(): void
  pathname: string
  asPath: string
  locale?: string
}

export interface NavigationContextProps {
  LinkComponent: FunctionComponent<LinkProps>
  router: GenericRouter
}

export const NavigationContext = createContext<NavigationContextProps>({
  LinkComponent: (props) => {
    const { className, linkref, ...defaultProps } = props
    return (
      <a className={className} ref={linkref} {...defaultProps}>
        {props.children}
      </a>
    )
  },
  router: {
    push: () => {
      // no-op
    },
    back: () => {
      // no-op
    },
    pathname: "",
    asPath: "",
    locale: "",
  },
})
