import * as React from "react"
import "./SiteFooter.scss"

export interface FooterProps {
  children: JSX.Element | JSX.Element[]
}

const SiteFooter = (props: FooterProps) => <footer className="site-footer">{props.children}</footer>

export { SiteFooter as default, SiteFooter }
