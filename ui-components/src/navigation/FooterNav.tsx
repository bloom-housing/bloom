import * as React from "react"
import "./FooterNav.scss"
import { t } from "../helpers/translator"

export interface FooterNavProps {
  children: React.ReactNode
  copyright: string
}

const FooterNav = (props: FooterNavProps) => (
  <section className="footer-sock">
    <h3 className="sr-only">{t("footer.srLegalInformation")}</h3>
    <div className="footer-sock__inner">
      <p className="footer-copyright">{props.copyright}</p>

      <nav className="footer-nav" aria-label={t("footer.srHeading")}>
        {props.children}
      </nav>
    </div>
  </section>
)

export { FooterNav as default, FooterNav }
