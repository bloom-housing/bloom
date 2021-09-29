import React, { useState } from "react"
import { LanguageNav, LangItem } from "../navigation/LanguageNav"
import { Icon } from "../icons/Icon"
import "./SiteHeader.scss"

export interface SiteHeaderLanguage {
  list: LangItem[]
  codes: string[]
}
type LogoWidth = "slim" | "medium" | "wide"

// Each MenuLink must contain either an href or an onClick
export interface MenuLink {
  title: string
  iconSrc?: string
  iconClassName?: string
  href?: string
  onClick?: () => void
  subMenuLinks?: MenuLink[]
}

export interface SiteHeaderProps {
  logoSrc: string
  title: string
  imageOnly?: boolean
  homeURL: string
  notice: string | React.ReactNode
  menuLinks: MenuLink[]
  menuItemClassName?: string
  dropdownItemClassName?: string
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
  const getDropdown = (menuTitle: string, subMenus: MenuLink[]) => {
    return (
      <span>
        {menuTitle}
        <Icon size="small" symbol="arrowDown" fill={"#555555"} className={"pl-2"} />
        {activeMenus.indexOf(menuTitle) >= 0 && (
          <span className={"navbar-dropdown-container"}>
            <div className={"navbar-dropdown"}>
              {subMenus.map((subMenu) => {
                return (
                  <button
                    className={"navbar-dropdown-item"}
                    onClick={() => {
                      if (subMenu.href) {
                        window.location.href = subMenu.href
                      }
                      if (subMenu.onClick) {
                        subMenu.onClick()
                      }
                    }}
                  >
                    {subMenu.iconSrc && (
                      <img src={subMenu.iconSrc} className={subMenu.iconClassName} />
                    )}
                    {subMenu.title}
                  </button>
                )
              })}
            </div>
          </span>
        )}
      </span>
    )
  }
  const changeMenuShow = (menuTitle: string) => {
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
            <a
              className={`logo ${props.logoClass && props.logoClass} ${getLogoWidthClass()}`}
              href={props.homeURL}
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
            </a>
          </div>

          <div className="navbar-menu">
            {props.menuLinks.map((menuLink, index) => {
              let menuTitle: JSX.Element
              // Dropdown exists
              if (menuLink.subMenuLinks) {
                menuTitle = getDropdown(menuLink.title, menuLink.subMenuLinks)
              } else {
                menuTitle = <>{menuLink.title}</>
              }

              return menuLink.href ? (
                <a
                  className={`navbar-link ${props.topMenuClassName && props.menuItemClassName}`}
                  aria-role={"button"}
                  href={menuLink.href}
                >
                  {menuTitle}
                </a>
              ) : (
                <button
                  className={`navbar-link navbar-dropdown-title ${props.dropdownItemClassName}`}
                  aria-role={"button"}
                  tabIndex={0}
                  onClick={() => changeMenuShow(menuLink.title)}
                  onMouseEnter={() => changeMenuShow(menuLink.title)}
                  onMouseLeave={() => changeMenuShow(menuLink.title)}
                >
                  {menuTitle}
                </button>
              )
            })}
          </div>
        </div>
      </nav>
    </div>
  )
}

export { SiteHeader as default, SiteHeader }
