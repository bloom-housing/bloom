import * as React from "react"
import "./SiteFooter.scss"
import LocalizedLink from "../../atoms/LocalizedLink"
import ExygyFooter from "../ExygyFooter"

export interface LinkType {
  href: string
  title: string
}

export interface FooterProps {
  copyright: string
  credits?: JSX.Element
  sole?: JSX.Element
  links: LinkType[]
  logo?: JSX.Element
}

const SiteFooter = (props: FooterProps) => (
  <footer className="site-footer">
    {props.logo && <div className="footer-logo">{props.logo}</div>}
    {props.credits && <div className="footer-credits">{props.credits}</div>}

    <section className="footer-sock">
      <div className="footer-sock-inner">
        <p className="footer-copyright">{props.copyright}</p>

        <nav className="footer-nav">
          {props.links.map((link, index) => (
            <LocalizedLink key={index} href={link.href}>
              {link.title}
            </LocalizedLink>
          ))}
        </nav>
      </div>
    </section>

    <section className="footer-sole">{props.sole || <ExygyFooter />}</section>
  </footer>
)

export default SiteFooter
