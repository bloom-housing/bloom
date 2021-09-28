import React, { useState } from "react"
import { LocalizedLink } from "../actions/LocalizedLink"
import { LanguageNav, LangItem } from "../navigation/LanguageNav"
import { Icon } from "../icons/Icon"
import "./SiteHeader.scss"
import { act } from "react-dom/test-utils"

export interface SiteHeaderLanguage {
  list: LangItem[]
  codes: string[]
}
type LogoWidth = "slim" | "medium" | "wide"

// Each MenuLink must contain either an href or an onClick
export interface MenuLink {
  title: string
  href?: string
  onClick?: () => void
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
    <div className="has-dropdown is-hoverable" tabIndex={0}>
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

  const [activeMenus, setActiveMenus] = useState<string[]>([])

  console.log("activeMenus", activeMenus)
  const getDropdown = (menuTitle: string) => {
    return (
      <span>
        {menuTitle}
        <Icon size="small" symbol="arrowDown" fill={"#555555"} className={"pl-2"} />{" "}
        {/* gray-750 */}
        {activeMenus.indexOf(menuTitle) >= 0 && "dropdown"}
      </span>
    )
  }
  const menuOnClick = (menuTitle: string) => {
    const indexOfTitle = activeMenus.indexOf(menuTitle)
    console.log(indexOfTitle)
    console.log(activeMenus.splice(indexOfTitle, 1))
    const newMenus =
      indexOfTitle >= 0 ? [...activeMenus.splice(indexOfTitle, 1)] : [...activeMenus, menuTitle]
    setActiveMenus(newMenus)
  }

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
              className={`logo ${props.logoClass && props.logoClass} ${getLogoWidthClass()}`}
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
            {props.menuLinks.map((menuLink, index) => {
              let menuTitle: JSX.Element
              // Dropdown exists
              if (menuLink.subMenuLinks) {
                menuTitle = getDropdown(menuLink.title)
              } else {
                menuTitle = <>{menuLink.title}</>
              }

              return menuLink.href ? (
                <a className={"navbar-link"} aria-role={"button"} href={menuLink.href}>
                  {menuTitle}
                </a>
              ) : (
                <a
                  className={"navbar-link"}
                  aria-role={"button"}
                  onClick={() => menuOnClick(menuLink.title)}
                >
                  {menuTitle}
                </a>
              )
            })}
          </div>
        </div>
      </nav>
    </div>
  )
}

export { SiteHeader as default, SiteHeader }
