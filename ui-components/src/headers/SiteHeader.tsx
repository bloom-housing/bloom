import React from "react"
import { LocalizedLink } from "../actions/LocalizedLink"
import { LanguageNav, LangItem } from "../navigation/LanguageNav"

export interface SiteHeaderLanguage {
  list: LangItem[]
  codes: string[]
}
type LogoWidth = "slim" | "medium" | "wide"

export interface MenuLink {
  title: string
  href?: string
  subMenuLinks?: MenuLink[]
}

export interface SiteHeaderProps {
  logoSrc: string
  title: string
  imageOnly?: boolean
  notice: string | React.ReactNode
  menuLinks: MenuLink[]
  language?: SiteHeaderLanguage
  logoClass?: string
  logoWidth?: LogoWidth
}

export interface SiteHeaderState {
  active: boolean
}

export interface NavbarDropdownProps {
  menuTitle: string
  children: React.ReactNode
}

export const NavbarDropdown = (props: NavbarDropdownProps) => {
  return (
    <div className="navbar-item has-dropdown is-hoverable" tabIndex={0}>
      <a className="navbar-link">{props.menuTitle}</a>
      <div className="navbar-dropdown">{props.children}</div>
    </div>
  )
}

const SiteHeader = (props: SiteHeaderProps) => {
  // const [active, setActive] = useState(false)

  const getLogoWidthClass = () => {
    if (props.logoWidth === "slim") return "navbar-width-slim"
    if (props.logoWidth === "medium") return "navbar-width-med"
    if (props.logoWidth === "wide") return "navbar-width-wide"
    return ""
  }

  // const handleMenuToggle = () => {
  //   setActive(!active)
  // }

  return (
    <div className={"site-header"}>
      {props.language && <LanguageNav language={props.language} />}

      <div className="navbar-notice">
        <div className="navbar-notice__text">{props.notice}</div>
      </div>
      <nav className="navbar-container" role="navigation" aria-label="main navigation">
        <div className="navbar">
          <div className="navbar-logo">
            <LocalizedLink
              className={`navbar-item logo ${
                props.logoClass && props.logoClass
              } ${getLogoWidthClass()}`}
              href="/"
              aria-label="homepage"
            >
              <div
                className={`${getLogoWidthClass()} ${props.logoWidth && "navbar-custom-width"} ${
                  props.imageOnly && "navbar-image-only-container"
                }`}
              >
                <img
                  className={`logo__image ${props.imageOnly && "navbar-image-only"}`}
                  src={props.logoSrc}
                  alt={"Site logo"}
                />
                {!props.imageOnly && <div className="logo__title">{props.title}</div>}
              </div>
            </LocalizedLink>
          </div>

          <div className="navbar-menu">
            {props.menuLinks.map((menuLink) => {
              return <span className={"navbar-link"}>{menuLink.title}</span>
            })}
          </div>
        </div>
      </nav>
    </div>
  )
}

export { SiteHeader as default, SiteHeader }
