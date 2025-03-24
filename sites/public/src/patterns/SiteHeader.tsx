import React, { useEffect, useState, useRef } from "react"
import ChevronDown from "@heroicons/react/20/solid/ChevronDownIcon"
import ChevronUp from "@heroicons/react/20/solid/ChevronUpIcon"
import MenuIcon from "@heroicons/react/20/solid/Bars3Icon"
import { Button, Heading, Icon, Link } from "@bloom-housing/ui-seeds"
import styles from "./SiteHeader.module.scss"
import { t } from "@bloom-housing/ui-components"
import { NavigationContext } from "@bloom-housing/ui-seeds/src/global/NavigationContext"
import { useContext } from "react"
import LinkComponent from "../components/core/LinkComponent"

export interface HeaderLink {
  label: string
  href?: string
  onClick?: () => void
  subMenuLinks?: HeaderLink[]
}

interface HeaderLinkProps {
  link: HeaderLink
  openSubMenu: string
  toggleSubMenu: () => void
  clickRef: React.MutableRefObject<any>
  setOpenSubmenu: React.Dispatch<React.SetStateAction<string>>
  setMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>
  lastItem: boolean
  firstItem: boolean
  currentPath: string
}

const HeaderLink = (props: HeaderLinkProps) => {
  const openSubMenu = props.openSubMenu === props.link.label
  if (props.link.subMenuLinks?.length) {
    // Dropdown
    return (
      <li className={styles["dropdown-link-container"]}>
        <button
          className={`${styles["link"]} ${
            openSubMenu ? styles["show-submenu-button"] : styles["hide-submenu-button"]
          }`}
          onClick={(event) => {
            event.stopPropagation()
            props.toggleSubMenu()
          }}
          aria-expanded={openSubMenu}
          aria-controls={`${props.link.label}-submenu`}
          id={`${props.link.label}-menu`}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault()
              props.toggleSubMenu()
            }
            if (event.key === "ArrowDown") {
              props.toggleSubMenu()
            }
            if (event.key === "Escape") {
              props.toggleSubMenu()
            }
            if (event.shiftKey && event.key === "Tab") {
              if (props.firstItem) {
                props.setMobileMenuOpen(false)
              }
            }
            if (!event.shiftKey && event.key === "Tab") {
              if (props.lastItem) {
                props.setMobileMenuOpen(false)
              }
            }
          }}
        >
          {props.link.label}
          <Icon size={"md"} className={styles["dropdown-icon"]}>
            {openSubMenu ? <ChevronUp /> : <ChevronDown />}
          </Icon>
        </button>
        {openSubMenu && (
          <ul
            className={`${styles["submenu-container"]} ${
              openSubMenu ? styles["show-submenu"] : styles["hide-submenu"]
            }`}
            ref={props.clickRef}
            id={`${props.link.label}-submenu`}
          >
            {props.link.subMenuLinks.map((subMenuLink, index) => {
              if (subMenuLink.href) {
                return (
                  <li className={styles["submenu-item"]} key={index}>
                    <LinkComponent
                      className={styles["submenu-link"]}
                      href={subMenuLink.href}
                      onKeyDown={(event) => {
                        if (event.shiftKey && event.key === "Tab") {
                          if (index === 0) {
                            props.setOpenSubmenu(null)
                          }
                        }
                        if (!event.shiftKey && event.key === "Tab") {
                          if (index === props.link.subMenuLinks.length - 1) {
                            props.setOpenSubmenu(null)
                          }
                        }
                        if (event.key === "Escape") {
                          props.setOpenSubmenu(null)
                          document.getElementById(`${props.link.label}-menu`).focus()
                        }
                        if (event.key === "ArrowDown") {
                          event.preventDefault() // Prevent page scroll
                          if (index < props.link.subMenuLinks.length - 1) {
                            document.getElementById(`submenu-link-${index + 1}`).focus()
                          }
                        }
                        if (event.key === "ArrowUp") {
                          event.preventDefault() // Prevent page scroll
                          if (index > 0) {
                            document.getElementById(`submenu-link-${index - 1}`).focus()
                          }
                        }
                      }}
                      id={`submenu-link-${index}`}
                      aria-current={props.currentPath === subMenuLink.href}
                    >
                      {subMenuLink.label}
                    </LinkComponent>
                  </li>
                )
              } else {
                return (
                  <li className={styles["submenu-item"]} key={index}>
                    <button
                      className={styles["submenu-link"]}
                      onClick={subMenuLink.onClick}
                      onKeyDown={(event) => {
                        if (event.shiftKey && event.key === "Tab") {
                          if (index === 0) {
                            props.setOpenSubmenu(null)
                          }
                        }
                        if (!event.shiftKey && event.key === "Tab") {
                          if (index === props.link.subMenuLinks.length - 1) {
                            props.setOpenSubmenu(null)
                          }
                        }
                        if (event.key === "ArrowDown") {
                          event.preventDefault() // Prevent page scroll
                          if (index < props.link.subMenuLinks.length - 1) {
                            document.getElementById(`submenu-link-${index + 1}`).focus()
                          }
                        }
                        if (event.key === "ArrowUp") {
                          event.preventDefault() // Prevent page scroll
                          if (index > 0) {
                            document.getElementById(`submenu-link-${index - 1}`).focus()
                          }
                        }
                      }}
                      id={`submenu-link-${index}`}
                    >
                      {subMenuLink.label}
                    </button>
                  </li>
                )
              }
            })}
          </ul>
        )}
      </li>
    )
  } else {
    // Single link
    if (props.link.href) {
      return (
        <li>
          <LinkComponent
            className={styles["link"]}
            href={props.link.href}
            aria-current={props.currentPath === props.link.href}
            onKeyDown={(event) => {
              if (event.shiftKey && event.key === "Tab") {
                if (props.firstItem) {
                  props.setMobileMenuOpen(false)
                }
              }
              if (!event.shiftKey && event.key === "Tab") {
                if (props.lastItem) {
                  props.setMobileMenuOpen(false)
                }
              }
            }}
          >
            {props.link.label}
          </LinkComponent>
        </li>
      )
    } else {
      return (
        <li>
          <button
            className={styles["link"]}
            onClick={props.link.onClick}
            onKeyDown={(event) => {
              if (event.shiftKey && event.key === "Tab") {
                if (props.firstItem) {
                  props.setMobileMenuOpen(false)
                }
              }
              if (!event.shiftKey && event.key === "Tab") {
                if (props.lastItem) {
                  props.setMobileMenuOpen(false)
                }
              }
            }}
          >
            {props.link.label}
          </button>
        </li>
      )
    }
  }
}

interface LanguageButtonProps {
  label: string
  active: boolean
  onClick: () => void
}

const LanguageButton = (props: LanguageButtonProps) => {
  return (
    <button
      className={`${styles["language"]} ${props.active ? styles["active-language"] : ""}`}
      onClick={props.onClick}
    >
      {props.label}
    </button>
  )
}

interface HeadingWrapperProps {
  children: React.ReactNode
  className?: string
}

const HeadingWrapper = (props: HeadingWrapperProps) => {
  return (
    <div className={`${styles["header-container"]} ${props.className ? props.className : ""}`}>
      <div className={styles["header-wrapper"]}>
        <div className={styles["content"]}>{props.children}</div>
      </div>
    </div>
  )
}

export type Language = {
  label: string
  onClick: () => void
  active: boolean
}

interface SiteHeaderProps {
  title: string
  subtitle?: string
  languages: Language[]
  links: HeaderLink[]
  message?: React.ReactNode
  titleLink: string
  logo?: React.ReactNode
  logoClassName?: string
}

export const SiteHeader = (props: SiteHeaderProps) => {
  const { LinkComponent } = useContext(NavigationContext)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [openSubMenu, setOpenSubMenu] = useState<string>(null)
  const [currentPath, setCurrentPath] = useState(null)
  const submenuRef = useRef(null)
  const mobileRef = useRef(null)

  useEffect(() => {
    const resizeHandler = () => {
      setOpenSubMenu(null)
      setMobileMenuOpen(false)
    }

    const clickOutsideHandler = (event) => {
      // Close the desktop dropdowns and mobile menu when clicking off of those elements
      const clickOutsideSubmenu =
        !!submenuRef?.current && !submenuRef?.current?.contains(event.target)
      const clickOutsideMobile = !!mobileRef?.current && !mobileRef?.current?.contains(event.target)
      if ((clickOutsideSubmenu && !mobileRef?.current) || clickOutsideMobile) {
        setOpenSubMenu(null)
        setMobileMenuOpen(false)
      }
    }

    window.addEventListener("click", clickOutsideHandler)
    window.addEventListener("resize", resizeHandler)
    setCurrentPath(window.location.pathname)

    return () => {
      window.removeEventListener("click", clickOutsideHandler)
      window.removeEventListener("resize", resizeHandler)
    }
  }, [])

  useEffect(() => {
    if (openSubMenu) {
      document.getElementById(`submenu-link-${0}`).focus()
    }
  }, [openSubMenu])

  const toggleSubMenu = (label: string) => {
    if (openSubMenu === label) {
      setOpenSubMenu(null)
    } else {
      setOpenSubMenu(label)
    }
    return
  }

  return (
    <nav className={styles["site-header-container"]} aria-label={"Main"}>
      <HeadingWrapper className={styles["language-wrapper"]}>
        <div className={styles["language-container"]}>
          {props.languages?.map((language, index) => {
            return (
              <LanguageButton
                label={language.label}
                onClick={language.onClick}
                active={language.active}
                key={index}
              />
            )
          })}
        </div>
      </HeadingWrapper>
      <HeadingWrapper className={styles["message-wrapper"]}>
        <div className={styles["message-container"]}>{props.message ?? ""}</div>
      </HeadingWrapper>
      <HeadingWrapper className={styles["navigation-wrapper"]}>
        <div className={styles["navigation-container"]}>
          <Link className={styles["title-container"]} href={props.titleLink}>
            {props.logo && (
              <div
                className={`${styles["logo"]} ${props.logoClassName ? props.logoClassName : ""}`}
              >
                {props.logo}
              </div>
            )}
            <div className={styles["title"]}>
              <Heading size={"xl"} className={styles["title-heading"]}>
                {props.title}
              </Heading>
              {props.subtitle && <p className={styles["title-subheading"]}>{props.subtitle}</p>}
            </div>
          </Link>
          <ul className={`${styles["links-container-desktop"]}`}>
            {props.links?.map((link, index) => {
              return (
                <HeaderLink
                  link={link}
                  key={index}
                  openSubMenu={openSubMenu}
                  toggleSubMenu={() => toggleSubMenu(link.label)}
                  clickRef={submenuRef}
                  setOpenSubmenu={setOpenSubMenu}
                  lastItem={index === props.links?.length - 1}
                  firstItem={index === 0}
                  setMobileMenuOpen={setMobileMenuOpen}
                  currentPath={currentPath}
                />
              )
            })}
          </ul>
          <div className={`${styles["links-container-mobile"]}`}>
            <Button
              variant={"primary-outlined"}
              className={styles["menu-button"]}
              size={"sm"}
              onClick={(event) => {
                event.stopPropagation()
                setMobileMenuOpen(!mobileMenuOpen)
              }}
              tailIcon={
                <Icon>
                  <MenuIcon />
                </Icon>
              }
            >
              {t("t.menu")}
            </Button>
          </div>
        </div>
      </HeadingWrapper>
      {mobileMenuOpen && (
        <div
          className={`${styles["submenu-container"]} ${styles["mobile-submenu-container"]}`}
          ref={mobileRef}
        >
          <ul>
            {props.links?.map((link, index) => {
              if (link.subMenuLinks)
                link.onClick = () => {
                  toggleSubMenu(link.label)
                }
              return (
                <HeaderLink
                  link={link}
                  key={index}
                  openSubMenu={openSubMenu}
                  toggleSubMenu={() => toggleSubMenu(link.label)}
                  clickRef={null}
                  setOpenSubmenu={setOpenSubMenu}
                  lastItem={index === props.links?.length - 1}
                  firstItem={index === 0}
                  setMobileMenuOpen={setMobileMenuOpen}
                  currentPath={currentPath}
                />
              )
            })}
          </ul>
        </div>
      )}
    </nav>
  )
}
