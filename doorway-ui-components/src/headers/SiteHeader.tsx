import React, { useState, useContext, useLayoutEffect } from "react"
import { CSSTransition } from "react-transition-group"
import { t, Icon } from "@bloom-housing/ui-components"
import { LanguageNav, LangItem } from "../navigation/LanguageNav"
import { Button } from "../actions/Button"
import { AppearanceSizeType } from "../global/AppearanceTypes"
import "./SiteHeader.scss"
import { NavigationContext } from "../config/NavigationContext"

type LogoWidth = "slim" | "base" | "base_expanded" | "medium" | "wide"
type SiteHeaderWidth = "base" | "wide"

export interface MenuLink {
  className?: string
  href?: string
  iconClassName?: string
  iconSrc?: string
  onClick?: () => void
  subMenuLinks?: MenuLink[]
  title: string
}

export interface SiteHeaderProps {
  desktopMinWidth?: number
  dropdownItemClassName?: string
  flattenSubMenus?: boolean
  homeURL: string
  imageOnly?: boolean
  languageNavLabel?: string
  languages?: LangItem[]
  logoClass?: string
  logoSrc: string
  logoWidth?: LogoWidth
  mainContentId?: string
  menuItemClassName?: string
  menuLinks: MenuLink[]
  mobileDrawer?: boolean
  mobileText?: boolean
  notice?: string | React.ReactNode
  noticeMobile?: boolean
  siteHeaderWidth?: SiteHeaderWidth
  subtitle?: string
  title?: string
  strings?: {
    close?: string
    logoAriaLable?: string
    menu?: string
    skipToMainContent?: string
  }
}

const SiteHeader = (props: SiteHeaderProps) => {
  const [activeMenu, setActiveMenu] = useState<string | null>()
  const [activeMobileMenus, setActiveMobileMenus] = useState<string[]>([])
  const [isDesktop, setIsDesktop] = useState(true)
  const [mobileDrawer, setMobileDrawer] = useState(false)
  const [mobileMenu, setMobileMenu] = useState(false)

  const [navbarClass, setNavbarClass] = useState("site-header__navbar-inline")

  const { LinkComponent } = useContext(NavigationContext)

  const DESKTOP_MIN_WIDTH = props.desktopMinWidth || 767 // @screen md
  // Enables toggling off navbar links when entering mobile
  useLayoutEffect(() => {
    const updateMedia = () => {
      if (window.innerWidth > DESKTOP_MIN_WIDTH) {
        setIsDesktop(true)
      } else {
        setIsDesktop(false)
      }
    }

    updateMedia()

    window.addEventListener("resize", updateMedia)
    return () => window.removeEventListener("resize", updateMedia)
  }, [DESKTOP_MIN_WIDTH, props.languages])

  const getLogoWidthClass = () => {
    if (props.logoWidth === "slim") return "site-header__logo-width-slim"
    if (!props.logoWidth || props.logoWidth === "base") return "site-header__logo-width-base"
    if (props.logoWidth === "base_expanded") return "site-header__logo-width-base_expanded"
    if (props.logoWidth === "medium") return "site-header__logo-width-med"
    if (props.logoWidth === "wide") return "site-header__logo-width-wide"
    return ""
  }

  const menuAction = (menuOnClick?: () => void) => {
    if (menuOnClick) {
      menuOnClick()
    }
  }

  // Render set of styled menu links
  const getDropdownOptions = (
    options: MenuLink[],
    buttonClassName: string,
    parentMenu?: string
  ) => {
    const dropdownOptionKeyDown = (event: React.KeyboardEvent<HTMLElement>, index: number) => {
      // Close menu when tabbing out backwards or forwards
      if (
        (event.shiftKey && event.key === "Tab" && isDesktop && index === 0 && parentMenu) ||
        (event.key === "Tab" && isDesktop && index === options.length - 1 && parentMenu)
      ) {
        setActiveMenu(null)
      }
    }

    const dropdownOptionContent = (option: MenuLink) => {
      return (
        <>
          {option.iconSrc && isDesktop && (
            <img
              src={option.iconSrc}
              className={option.iconClassName}
              alt={`${option.title} icon`}
            />
          )}
          {option.title}
        </>
      )
    }

    const dropdownOptionClassname = `${buttonClassName} ${
      props.dropdownItemClassName ? props.dropdownItemClassName : ""
    }`

    return options.map((option, index) => {
      return (
        <div key={index}>
          {option.href ? (
            <LinkComponent
              className={dropdownOptionClassname}
              key={`${option.title}-${index}`}
              href={option.href}
              onKeyDown={(event) => {
                dropdownOptionKeyDown(event, index)
              }}
            >
              {dropdownOptionContent(option)}
            </LinkComponent>
          ) : (
            <button
              tabIndex={0}
              className={dropdownOptionClassname}
              key={`${option.title}-${index}`}
              onClick={() => {
                menuAction(option.onClick)
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  menuAction(option.onClick)
                }
                dropdownOptionKeyDown(event, index)
              }}
              data-testid={`${option.title}-${index}`}
            >
              {dropdownOptionContent(option)}
            </button>
          )}
        </div>
      )
    })
  }

  // Render the desktop dropdown that opens on mouse hover
  const getDesktopDropdown = (menuTitle: string, subMenus: MenuLink[]) => {
    // Combine the last word of a multi-word header into one span to prevent chevron icon from wrapping onto its own line
    const getMenuTitle = () => {
      const splitTitle = menuTitle.split(" ")
      return (
        <span>
          {splitTitle.length > 0 && (
            <span className={"site-header__dropdown-title-split"}>
              {[...splitTitle].splice(0, splitTitle.length - 1).join(" ")}
            </span>
          )}
          <span className={"site-header__dropdown-title-with-icon"}>
            {splitTitle.length > 0 ? splitTitle[splitTitle.length - 1] : menuTitle}
            <Icon size="small" symbol="arrowDown" fill={"#555555"} className={"pl-2"} />
          </span>
        </span>
      )
    }

    return (
      <span key={menuTitle}>
        {getMenuTitle()}
        {activeMenu === menuTitle && (
          <span className={"site-header__dropdown-container"}>
            <div className={"site-header__dropdown"}>
              {getDropdownOptions(subMenus, "site-header__dropdown-item", menuTitle)}
            </div>
          </span>
        )}
      </span>
    )
  }

  // Build styled mobile menu options
  const buildMobileMenuOptions = (
    menuLinks: MenuLink[],
    dropdownSublinkOptionClassName: string,
    dropdownOptionClassName: string,
    dropdownContainerClassName?: string
  ) => {
    const changeMenuShow = (
      title: string,
      menus: string[],
      setMenus: React.Dispatch<React.SetStateAction<string[]>>
    ) => {
      const indexOfTitle = menus.indexOf(title)
      setMenus(indexOfTitle >= 0 ? menus.filter((menu) => menu !== title) : [...menus, title])
    }
    return (
      <>
        {menuLinks.map((menuLink, index) => {
          if (menuLink.subMenuLinks && !props.flattenSubMenus) {
            return (
              <div key={`${menuLink.title}-${index}`}>
                <button
                  className={dropdownOptionClassName}
                  onClick={() => {
                    changeMenuShow(menuLink.title, activeMobileMenus, setActiveMobileMenus)
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault()
                      changeMenuShow(menuLink.title, activeMobileMenus, setActiveMobileMenus)
                    }
                  }}
                >
                  {menuLink.title}
                  <Icon
                    size="small"
                    symbol="arrowDown"
                    fill={"#555555"}
                    className={"site-header__icon-spacing"}
                  />
                </button>
                {activeMobileMenus.indexOf(menuLink.title) >= 0 && (
                  <div className={dropdownContainerClassName}>
                    {getDropdownOptions(
                      menuLink.subMenuLinks,
                      dropdownSublinkOptionClassName ?? ""
                    )}
                  </div>
                )}
              </div>
            )
          } else {
            return (
              <div key={`${menuLink.title}-${index}`}>
                {props.flattenSubMenus && menuLink.subMenuLinks
                  ? getDropdownOptions(menuLink.subMenuLinks, dropdownOptionClassName ?? "")
                  : getDropdownOptions([menuLink], dropdownOptionClassName ?? "")}
              </div>
            )
          }
        })}
      </>
    )
  }

  // Render the mobile drawer that opens on menu press when prop mobileDrawer is set
  const getMobileDrawer = () => {
    return (
      <CSSTransition
        in={mobileDrawer}
        timeout={400}
        classNames={"site-header__drawer-transition"}
        unmountOnExit
      >
        <span className={"site-header__mobile-drawer-dropdown-container"}>
          <div className={"site-header__mobile-drawer-dropdown"}>
            <button
              className={"site-header__mobile-drawer-close-row"}
              onClick={() => setMobileDrawer(false)}
              onKeyPress={(event) => {
                if (event.key === "Enter") {
                  setMobileDrawer(false)
                }
              }}
              aria-label={props.strings?.close ?? t("t.close")}
            >
              <Icon
                size="small"
                symbol="arrowForward"
                fill={"#ffffff"}
                className={"site-header__icon-spacing"}
              />
            </button>
            {buildMobileMenuOptions(
              props.menuLinks,
              "site-header__mobile-drawer-dropdown-item site-header__mobile-drawer-dropdown-item-sublink",
              "site-header__mobile-drawer-dropdown-item"
            )}
          </div>
        </span>
      </CSSTransition>
    )
  }

  // Renders the default mobile dropdown that opens on menu press
  const getMobileDropdown = () => {
    return (
      <>
        {!props.mobileDrawer && (
          <span className={"site-header__mobile-dropdown-container"}>
            <div className={"site-header__mobile-dropdown"}>
              {buildMobileMenuOptions(
                props.menuLinks,
                "site-header__mobile-dropdown-item site-header__mobile-dropdown-item-sublink",
                "site-header__mobile-dropdown-item"
              )}
            </div>
          </span>
        )}
      </>
    )
  }

  const getDesktopHeader = () => {
    return (
      <>
        {props.menuLinks.map((menuLink, index) => {
          let menuContent: JSX.Element
          if (menuLink.subMenuLinks) {
            menuContent = getDesktopDropdown(menuLink.title, menuLink.subMenuLinks)
          } else {
            menuContent = <div key={menuLink.title}>{menuLink.title}</div>
          }

          if (!menuLink.subMenuLinks) {
            if (menuLink.href) {
              return (
                <LinkComponent
                  className={`site-header__link ${props.menuItemClassName ?? ""} ${
                    menuLink.className ?? ""
                  }`}
                  href={menuLink.href}
                  key={`${menuLink.title}-${index}`}
                  data-testid={`${menuLink.title}-${index}`}
                >
                  {menuContent}
                </LinkComponent>
              )
            } else {
              return (
                <button
                  className={`site-header__link ${
                    props.menuItemClassName ?? ""
                  } site-header__desktop-header-button`}
                  tabIndex={0}
                  onClick={() => {
                    menuAction(menuLink.onClick)
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      menuAction(menuLink.onClick)
                    }
                  }}
                  key={`${menuLink.title}-${index}`}
                >
                  {menuContent}
                </button>
              )
            }
          } else {
            return (
              <span
                className={`site-header__link site-header__dropdown-title ${
                  props.menuItemClassName ?? ""
                } ${menuLink.className ?? ""}`}
                tabIndex={0}
                key={`${menuLink.title}-${index}`}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    setActiveMenu(menuLink.title)
                  }
                }}
                onMouseEnter={() => {
                  setActiveMenu(menuLink.title)
                }}
                onMouseLeave={() => {
                  setActiveMenu(null)
                }}
                role={"button"}
                data-testid={`${menuLink.title}-${index}`}
              >
                {menuContent}
              </span>
            )
          }
        })}
      </>
    )
  }

  const getMobileHeader = () => {
    const mobileHeaderAction = () => {
      if (!props.mobileDrawer) {
        setMobileMenu(!mobileMenu)
      } else {
        setMobileDrawer(!mobileDrawer)
      }
      setActiveMobileMenus([])
    }

    return (
      <>
        {props.mobileText ? (
          <button
            className={"site-header__mobile-menu-text-button"}
            onClick={() => {
              mobileHeaderAction()
            }}
            onKeyPress={(event) => {
              if (event.key === "Enter") {
                event.preventDefault()
                mobileHeaderAction()
              }
            }}
          >
            <div className={"site-header__mobile-menu-text-button-content"}>
              {props.strings?.menu ?? t("t.menu")}
            </div>
            <Icon
              symbol={mobileMenu ? "closeSmall" : "hamburger"}
              size={"base"}
              className={"site-header__mobile-menu-icon"}
            />
          </button>
        ) : (
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
            iconSize="medium"
            className={"site-header__mobile-menu-button"}
            unstyled
          >
            <span className={"site-header__mobile-menu-button-text"}>
              {mobileMenu
                ? props.strings?.close ?? t("t.close")
                : props.strings?.menu ?? t("t.menu")}
            </span>
          </Button>
        )}
      </>
    )
  }

  const getLogo = () => {
    return (
      <div className={`site-header__logo-container ${getLogoWidthClass()}`} id={"site-header-logo"}>
        <LinkComponent
          className={`site-header__logo ${props.logoClass ?? ""} ${
            (props.logoWidth && "site-header__custom-width") ?? ""
          }`}
          href={props.homeURL}
          aria-label={props.strings?.logoAriaLable ?? t("t.homePage")}
        >
          <div
            className={`site-header__logo-content ${
              props.imageOnly ? "site-header__image-only-container" : ""
            }`}
          >
            <img
              className={`site-header__logo-image ${
                props.imageOnly ? "site-header__image-only" : ""
              }`}
              src={props.logoSrc}
              alt={"Site logo"}
            />
            {props.title && (
              <div className="site-header__logo-title">
                {props.title}
                {props.subtitle && (
                  <div className="site-header__logo__subtitle">{props.subtitle}</div>
                )}
              </div>
            )}
          </div>
        </LinkComponent>
      </div>
    )
  }

  return (
    <header className={"site-header"}>
      {props.mainContentId && (
        <a className="site-header__skip-link" href={`#${props.mainContentId}`}>
          {props.strings?.skipToMainContent}
        </a>
      )}
      {props.languages && (
        <LanguageNav ariaLabel={props.languageNavLabel} languages={props.languages} />
      )}
      {props.notice && (
        <div
          className={`site-header__notice ${!props.noticeMobile ? `site-header__notice-hide` : ""}`}
        >
          <div className="site-header__notice-text">{props.notice ?? ""}</div>
        </div>
      )}

      <nav className="site-header__container" role="navigation" aria-label="main navigation">
        <div
          className={`site-header__base ${
            props.siteHeaderWidth === "wide" ? "site-header__width-wide" : ""
          } ${
            navbarClass === "site-header__navbar-wrapped"
              ? "site-header__base-wrapped"
              : "site-header__base-inline"
          }`}
        >
          {getLogo()}
          <div
            id={"site-header-links"}
            className={`site-header__navbar-menu ${isDesktop ? navbarClass : ""}`}
          >
            {isDesktop ? getDesktopHeader() : getMobileHeader()}
          </div>
        </div>
      </nav>
      {!isDesktop && mobileMenu && getMobileDropdown()}
      {getMobileDrawer()}
    </header>
  )
}

export { SiteHeader as default, SiteHeader }
