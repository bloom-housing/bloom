import * as React from "react"
import "./FooterNav.scss"

export interface FooterNavProps {
  children?: React.ReactNode
  copyright?: string
}

const FooterNav = (props: FooterNavProps) => (
  <section className="doorway-footer-sock">
    <div className="doorway-footer-sock__inner">
      {props.copyright && <p className="doorway-footer-copyright">{props.copyright}</p>}
      {props.children && (
        <nav className="doorway-footer-nav" aria-label={"Footer"}>
          {props.children}
        </nav>
      )}
    </div>
  </section>
)

export { FooterNav as default, FooterNav }
