import React, { useState, useEffect } from "react"
import { CSSTransition } from "react-transition-group"
import { LanguageNav, LangItem } from "../navigation/LanguageNav"
import { Icon } from "../icons/Icon"
import { Button } from "../actions/Button"
import { AppearanceSizeType } from "../global/AppearanceTypes"
import "./SiteHeader.scss"

type LogoWidth = "slim" | "medium" | "wide"

export interface MenuLink {
  href?: string
  iconClassName?: string
  iconSrc?: string
  onClick?: () => void
  subMenuLinks?: MenuLink[]
  title: string
}

export interface SiteHeaderProps {
  dropdownItemClassName?: string
  homeURL: string
  imageOnly?: boolean
  languages?: LangItem[]
  logoClass?: string
  logoSrc: string
  logoWidth?: LogoWidth
  menuItemClassName?: string
  menuLinks: MenuLink[]
  mobileDrawer?: boolean
  notice?: string | React.ReactNode
  noticeMobile?: boolean
  title: string
}

export interface SiteHeaderState {
  active: boolean
}

export interface NavbarDropdownProps {
  children: React.ReactNode
  menuTitle: string
}

export const NavbarDropdown = (props: NavbarDropdownProps) => {
  return (
    <div className="has-dropdown is-hoverable" tabIndex={0}>
      <a className="navbar-link">{props.menuTitle}</a>
      <div className="navbar-dropdown">{props.children}</div>
    </div>
  )
}

// TODO Optional mobile open button as text
const SiteHeader = (props: SiteHeaderProps) => {
  const [isDesktop, setIsDesktop] = useState(true)
  const [activeMenus, setActiveMenus] = useState<string[]>([])
  const [activeMobileMenus, setActiveMobileMenus] = useState<string[]>([])
  const [mobileMenu, setMobileMenu] = useState(false)
  const [mobileDrawer, setMobileDrawer] = useState(false)

  const DESKTOP_MIN_WIDTH = 767 // @screen md
  // Enables toggling off navbar links when entering mobile
  useEffect(() => {
    if (window.innerWidth > DESKTOP_MIN_WIDTH) {
      setIsDesktop(true)
    } else {
      setIsDesktop(false)
    }

    const updateMedia = () => {
      if (window.innerWidth > DESKTOP_MIN_WIDTH) {
        setIsDesktop(true)
      } else {
        setIsDesktop(false)
      }
    }
    window.addEventListener("resize", updateMedia)
    return () => window.removeEventListener("resize", updateMedia)
  }, [])

  const getLogoWidthClass = () => {
    if (props.logoWidth === "slim") return "navbar-width-slim"
    if (props.logoWidth === "medium") return "navbar-width-med"
    if (props.logoWidth === "wide") return "navbar-width-wide"
    return ""
  }

  const getDesktopDropdown = (menuTitle: string, subMenus: MenuLink[]) => {
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

  const getMobileDrawer = () => {
    return (
      <CSSTransition in={mobileDrawer} timeout={400} classNames={"drawer-transition"} unmountOnExit>
        <span className={`navbar-mobile-drawer-dropdown-container`}>
          <div className={"navbar-mobile-drawer-dropdown"}>
            <button
              className={"navbar-mobile-drawer-close-row"}
              onClick={() => setMobileDrawer(false)}
            >
              <Icon size="small" symbol="arrowForward" fill={"#ffffff"} className={"pl-2"} />
            </button>
            {props.menuLinks.map((menuLink, index) => {
              if (menuLink.subMenuLinks) {
                return (
                  <div key={index}>
                    <button
                      className={"navbar-mobile-drawer-dropdown-item"}
                      onClick={() => changeMobileMenuShow(menuLink.title)}
                    >
                      {menuLink.title}
                      <Icon size="small" symbol={"arrowDown"} fill={"#555555"} className={"pl-2"} />
                    </button>

                    {activeMobileMenus.indexOf(menuLink.title) >= 0 && (
                      <>
                        {menuLink.subMenuLinks.map((subMenuLink, index) => {
                          return (
                            <button
                              className={
                                "navbar-mobile-drawer-dropdown-item navbar-mobile-drawer-dropdown-item-sublink"
                              }
                              key={index}
                              onClick={() => {
                                if (subMenuLink.href) {
                                  window.location.href = subMenuLink.href
                                }
                                if (subMenuLink.onClick) {
                                  subMenuLink.onClick()
                                }
                              }}
                            >
                              {subMenuLink.iconSrc && (
                                <img
                                  src={subMenuLink.iconSrc}
                                  className={subMenuLink.iconClassName}
                                />
                              )}
                              {subMenuLink.title}
                            </button>
                          )
                        })}
                      </>
                    )}
                  </div>
                )
              } else {
                return (
                  <button
                    className={"navbar-mobile-drawer-dropdown-item"}
                    onClick={() => {
                      if (menuLink.href) {
                        window.location.href = menuLink.href
                      }
                      if (menuLink.onClick) {
                        menuLink.onClick()
                      }
                    }}
                  >
                    {menuLink.iconSrc && (
                      <img src={menuLink.iconSrc} className={menuLink.iconClassName} />
                    )}
                    {menuLink.title}
                  </button>
                )
              }
            })}
          </div>
        </span>
      </CSSTransition>
    )
  }
  const getMobileDropdown = () => {
    return (
      <>
        {!props.mobileDrawer && (
          <span className={"navbar-mobile-dropdown-container"}>
            <div className={"navbar-mobile-dropdown"}>
              {props.menuLinks.map((menuLink, index) => {
                if (menuLink.subMenuLinks) {
                  return (
                    <div key={index}>
                      <button
                        className={"navbar-mobile-dropdown-item"}
                        onClick={() => changeMobileMenuShow(menuLink.title)}
                      >
                        {menuLink.title}
                        <Icon size="small" symbol="arrowDown" fill={"#555555"} className={"pl-2"} />
                      </button>
                      {activeMobileMenus.indexOf(menuLink.title) >= 0 && (
                        <div className={"navbar-mobile-dropdown-links"}>
                          {menuLink.subMenuLinks.map((subMenuLink, index) => {
                            return (
                              <button
                                className={
                                  "navbar-mobile-dropdown-item navbar-mobile-dropdown-item-sublink"
                                }
                                key={index}
                                onClick={() => {
                                  if (subMenuLink.href) {
                                    window.location.href = subMenuLink.href
                                  }
                                  if (subMenuLink.onClick) {
                                    subMenuLink.onClick()
                                  }
                                }}
                              >
                                {subMenuLink.iconSrc && (
                                  <img
                                    src={subMenuLink.iconSrc}
                                    className={subMenuLink.iconClassName}
                                  />
                                )}
                                {subMenuLink.title}
                              </button>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  )
                } else {
                  return (
                    <button
                      className={"navbar-mobile-dropdown-item"}
                      onClick={() => {
                        if (menuLink.href) {
                          window.location.href = menuLink.href
                        }
                        if (menuLink.onClick) {
                          menuLink.onClick()
                        }
                      }}
                    >
                      {menuLink.iconSrc && (
                        <img src={menuLink.iconSrc} className={menuLink.iconClassName} />
                      )}
                      {menuLink.title}
                    </button>
                  )
                }
              })}
            </div>
          </span>
        )}
      </>
    )
  }
  const changeMenuShow = async (menuTitle: string) => {
    const indexOfTitle = activeMenus.indexOf(menuTitle)
    setActiveMenus(
      indexOfTitle >= 0
        ? activeMenus.filter((menu) => menu !== menuTitle)
        : [...activeMenus, menuTitle]
    )
  }

  const changeMobileMenuShow = (menuTitle: string) => {
    const indexOfTitle = activeMobileMenus.indexOf(menuTitle)
    setActiveMobileMenus(
      indexOfTitle >= 0
        ? activeMobileMenus.filter((menu) => menu !== menuTitle)
        : [...activeMobileMenus, menuTitle]
    )
  }

  return (
    <div className={"site-header"}>
      {props.languages && <LanguageNav languages={props.languages} />}

      {props.notice && (
        <div className={`navbar-notice ${!props.noticeMobile && `navbar-notice-hide`}`}>
          <div className="navbar-notice__text">{props.notice}</div>
        </div>
      )}

      <nav className="navbar-container" role="navigation" aria-label="main navigation">
        <div className="navbar">
          <div className={`navbar-logo`}>
            <a
              className={`logo ${props.logoClass && props.logoClass} ${getLogoWidthClass()} ${
                props.logoWidth && "navbar-custom-width"
              }`}
              href={props.homeURL}
              aria-label="homepage"
            >
              <div className={` ${props.imageOnly && "navbar-image-only-container"}`}>
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
            {isDesktop ? (
              <>
                {props.menuLinks.map((menuLink, index) => {
                  let menuTitle: JSX.Element
                  // Dropdown exists
                  if (menuLink.subMenuLinks) {
                    menuTitle = getDesktopDropdown(menuLink.title, menuLink.subMenuLinks)
                  } else {
                    menuTitle = <>{menuLink.title}</>
                  }

                  return menuLink.href ? (
                    <a
                      className={`navbar-link ${
                        props.menuItemClassName && props.menuItemClassName
                      }`}
                      aria-role={"button"}
                      href={menuLink.href}
                      key={index}
                    >
                      {menuTitle}
                    </a>
                  ) : (
                    <span
                      className={`navbar-link navbar-dropdown-title ${props.dropdownItemClassName}`}
                      aria-role={"button"}
                      tabIndex={0}
                      key={index}
                      onKeyPress={(event) => {
                        if (event.key === "Enter") {
                          changeMenuShow(menuLink.title)
                        }
                      }}
                      onMouseEnter={() => changeMenuShow(menuLink.title)}
                      onMouseLeave={() => changeMenuShow(menuLink.title)}
                    >
                      {menuTitle}
                    </span>
                  )
                })}
              </>
            ) : (
              <>
                <Button
                  size={AppearanceSizeType.small}
                  onClick={() => {
                    if (!props.mobileDrawer) {
                      setMobileMenu(!mobileMenu)
                    } else {
                      setMobileDrawer(!mobileDrawer)
                    }
                    setActiveMobileMenus([])
                  }}
                  icon={mobileMenu ? "closeSmall" : "hamburger"}
                  iconSize="base"
                  className={"navbar-mobile-menu-button"}
                  unstyled
                >
                  {mobileMenu ? "Close" : "Menu"}
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>
      {!isDesktop && mobileMenu && getMobileDropdown()}
      {getMobileDrawer()}
    </div>
  )
}

export { SiteHeader as default, SiteHeader }
