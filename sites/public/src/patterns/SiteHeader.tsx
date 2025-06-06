import React, { useEffect, useState, useRef } from "react"
import ChevronDown from "@heroicons/react/20/solid/ChevronDownIcon"
import ChevronUp from "@heroicons/react/20/solid/ChevronUpIcon"
import MenuIcon from "@heroicons/react/20/solid/Bars3Icon"
import { Button, Icon, Link } from "@bloom-housing/ui-seeds"
import { t } from "@bloom-housing/ui-components"
import LinkComponent from "../components/core/LinkComponent"
import MaxWidthLayout from "../layouts/max-width"
import styles from "./SiteHeader.module.scss"

/** Sets focus on the first submenu link */
const setFocusToFirstElement = () => {
  document.getElementById(`submenu-link-${0}`).focus()
  return
}

/** Toggles the open state of a submenu, and if setFocus is true, sets focus to the first element in the submenu */
const toggleSubmenu = (
  label: string,
  setFocus: boolean,
  openSubmenu: string,
  setOpenSubmenu: (value: React.SetStateAction<string>) => void
) => {
  if (openSubmenu === label) {
    setOpenSubmenu(null)
  } else {
    setOpenSubmenu(label)
    if (setFocus) setTimeout(() => setFocusToFirstElement(), 0)
  }
  return
}

export interface HeaderLink {
  /** Link URL, will use an anchor element */
  href?: string
  /** Link label */
  label: string
  /** Button onClick, will use a button element */
  onClick?: () => void
  /** An optional list of links for a dropdown submenu, only supports one nested menu */
  submenuLinks?: HeaderLink[]
}

interface HeaderLinkProps {
  /** Assigned to the submenu, used to determine if a user clicks off of it in order to close it  */
  clickRef: React.RefObject<HTMLUListElement>
  /** The window's current path, used to set aria-current on links  */
  currentPath: string
  /** If this is the first item in the list of links  */
  firstItem: boolean
  /** If this is the last item in the list of links  */
  lastItem: boolean
  /** Current item index in the list */
  index: number
  /** Link data, including the URL/onClick and label  */
  link: HeaderLink
  /** If this link's submenu is open  */
  openSubmenu: string
  /** Function to change the state of the mobile links menu being open  */
  setMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>
  /** Function to change the state of a submenu being open  */
  setOpenSubmenu: React.Dispatch<React.SetStateAction<string>>
}

const menuKeyDown = (
  event: React.KeyboardEvent<HTMLAnchorElement | HTMLButtonElement>,
  firstItem: boolean,
  lastItem: boolean,
  setMobileMenuOpen: (value: React.SetStateAction<boolean>) => void
) => {
  // When a user shift-tabs on the first item in the main menu, close the mobile menu
  if (event.shiftKey && event.key === "Tab") {
    if (firstItem) {
      setMobileMenuOpen(false)
    }
  }
  // When a user tabs on the last item in the main menu, close the mobile menu
  if (!event.shiftKey && event.key === "Tab") {
    if (lastItem) {
      setMobileMenuOpen(false)
    }
  }
  return
}

const submenuKeyDown = (
  event: React.KeyboardEvent<HTMLAnchorElement | HTMLButtonElement>,
  index: number,
  setOpenSubmenu: (value: React.SetStateAction<string>) => void,
  submenuLinks: HeaderLink[],
  parentLabel: string
) => {
  // When a user shift-tabs on the first item in a submenu, close the submenu
  if (event.shiftKey && event.key === "Tab") {
    if (index === 0) {
      setOpenSubmenu(null)
    }
  }
  // When a user tabs on the last item in a submenu, close the submenu
  if (!event.shiftKey && event.key === "Tab") {
    if (index === submenuLinks.length - 1) {
      setOpenSubmenu(null)
    }
  }
  // When a user presses escape, close the submenu and focus on the parent
  if (event.key === "Escape") {
    setOpenSubmenu(null)
    document.getElementById(parentLabel).focus()
  }
  // When a user presses the down arrow, go to the next item in the submenu if not at the end
  if (event.key === "ArrowDown") {
    event.preventDefault() // Prevent page scroll
    if (index < submenuLinks.length - 1) {
      document.getElementById(`submenu-link-${index + 1}`).focus()
    }
  }
  // When a user presses the up arrow, go to the previous item in the submenu if not at the beginning
  if (event.key === "ArrowUp") {
    event.preventDefault() // Prevent page scroll
    if (index > 0) {
      document.getElementById(`submenu-link-${index - 1}`).focus()
    }
  }
  return
}

const HeaderLink = (props: HeaderLinkProps) => {
  const parentLink = useRef(null)
  const openSubMenu = props.openSubmenu === props.link.label
  if (props.link.submenuLinks?.length) {
    // Navigation item contains a submenu
    return (
      <li className={styles["dropdown-link-container"]}>
        <button
          className={`${styles["link"]} ${
            openSubMenu ? styles["show-submenu-button"] : styles["hide-submenu-button"]
          }`}
          onClick={(event) => {
            event.stopPropagation()
            toggleSubmenu(props.link.label, false, props.openSubmenu, props.setOpenSubmenu)
          }}
          aria-expanded={openSubMenu}
          aria-controls={`${props.link.label}-submenu`}
          ref={parentLink}
          id={props.link.label}
          onKeyDown={(event) => {
            // When a user presses enter, open the submenu & focus on the first element
            if (event.key === "Enter") {
              event.preventDefault()
              toggleSubmenu(props.link.label, true, props.openSubmenu, props.setOpenSubmenu)
            }
            // When a user presses the down arrow, open the submenu & focus on the first element
            if (event.key === "ArrowDown") {
              event.preventDefault() // Prevent page scroll
              toggleSubmenu(props.link.label, true, props.openSubmenu, props.setOpenSubmenu)
            }
            // When a user shift-tabs on the first item in the main menu, close the mobile menu
            if (event.shiftKey && event.key === "Tab") {
              if (props.firstItem) {
                props.setMobileMenuOpen(false)
              }
            }
            // When a user tabs on the last item in the main menu, close the mobile menu
            if (!event.shiftKey && event.key === "Tab") {
              if (props.lastItem) {
                props.setMobileMenuOpen(false)
              }
            }
          }}
          data-testid={`${props.link.label}-${props.index}`}
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
            {props.link.submenuLinks.map((submenuLink, index) => {
              if (submenuLink.href) {
                // Navigation item is a link
                return (
                  <li className={styles["submenu-item"]} key={index}>
                    <LinkComponent
                      className={styles["submenu-link"]}
                      href={submenuLink.href}
                      onKeyDown={(event) => {
                        submenuKeyDown(
                          event,
                          index,
                          props.setOpenSubmenu,
                          props.link.submenuLinks,
                          props.link.label
                        )
                      }}
                      id={`submenu-link-${index}`}
                      aria-current={props.currentPath === submenuLink.href}
                      data-testid={`${submenuLink.label}-${index}`}
                    >
                      {submenuLink.label}
                    </LinkComponent>
                  </li>
                )
              } else {
                // Navigation item is a button
                return (
                  <li className={styles["submenu-item"]} key={index}>
                    <button
                      className={styles["submenu-link"]}
                      onClick={submenuLink.onClick}
                      onKeyDown={(event) => {
                        submenuKeyDown(
                          event,
                          index,
                          props.setOpenSubmenu,
                          props.link.submenuLinks,
                          props.link.label
                        )
                      }}
                      id={`submenu-link-${index}`}
                      data-testid={`${submenuLink.label}-${index}`}
                    >
                      {submenuLink.label}
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
    // Navigation item does not contain a submenu
    if (props.link.href) {
      return (
        <li>
          <LinkComponent
            className={styles["link"]}
            href={props.link.href}
            aria-current={props.currentPath === props.link.href}
            onKeyDown={(event) => {
              menuKeyDown(event, props.firstItem, props.lastItem, props.setMobileMenuOpen)
            }}
            data-testid={`${props.link.label}-${props.index}`}
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
              menuKeyDown(event, props.firstItem, props.lastItem, props.setMobileMenuOpen)
            }}
            data-testid={`${props.link.label}-${props.index}`}
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
      <MaxWidthLayout>
        <div className={styles["header-wrapper"]}>
          <div className={styles["content"]}>{props.children}</div>
        </div>
      </MaxWidthLayout>
    </div>
  )
}

export type Language = {
  active: boolean
  label: string
  onClick: () => void
}

interface SiteHeaderProps {
  className?: string
  languages: Language[]
  links: HeaderLink[]
  logo?: React.ReactNode
  logoClassName?: string
  mainContentId?: string
  message?: React.ReactNode
  showMessageBar?: boolean
  subtitle?: string
  title?: string
  titleLink: string
}

export const SiteHeader = (props: SiteHeaderProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [openSubmenu, setOpenSubmenu] = useState<string>(null)
  const [currentPath, setCurrentPath] = useState(null)
  const submenuRef = useRef(null)
  const mobileRef = useRef(null)

  useEffect(() => {
    const resizeHandler = () => {
      // Close the submenus and the mobile menu when resizing the screen
      setOpenSubmenu(null)
      setMobileMenuOpen(false)
    }

    const clickOutsideHandler = (event) => {
      // Close the desktop dropdowns and mobile menu when clicking off of those elements
      const clickOutsideSubmenu =
        !!submenuRef?.current && !submenuRef?.current?.contains(event.target)
      const clickOutsideMobile = !!mobileRef?.current && !mobileRef?.current?.contains(event.target)
      if ((clickOutsideSubmenu && !mobileRef?.current) || clickOutsideMobile) {
        setOpenSubmenu(null)
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

  return (
    <header
      className={`${styles["site-header-container"]} ${props.className ? props.className : ""}`}
    >
      {props.mainContentId && (
        <a className={`${styles["skip-link"]}`} href={`#${props.mainContentId}`}>
          {t("t.skipToMainContent")}
        </a>
      )}
      <HeadingWrapper className={styles["language-wrapper"]}>
        <div className={styles["language-container"]}>
          {props.languages?.map((language, index) => {
            return (
              <LanguageButton
                active={language.active}
                key={index}
                label={language.label}
                onClick={language.onClick}
              />
            )
          })}
        </div>
      </HeadingWrapper>
      {props.showMessageBar && (
        <HeadingWrapper className={styles["message-wrapper"]}>
          <div className={styles["message-container"]}>{props.message ?? ""}</div>
        </HeadingWrapper>
      )}
      <nav aria-label={"Main"}>
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
              {(props.title || props.subtitle) && (
                <div className={styles["title"]}>
                  {props.title && (
                    <div className={`${styles["title-heading"]} text-heading-xl`}>
                      {props.title}
                    </div>
                  )}
                  {props.subtitle && <p className={styles["title-subheading"]}>{props.subtitle}</p>}
                </div>
              )}
            </Link>
            <ul className={`${styles["links-container-desktop"]}`}>
              {props.links?.map((link, index) => {
                return (
                  <HeaderLink
                    clickRef={submenuRef}
                    currentPath={currentPath}
                    firstItem={index === 0}
                    key={index}
                    index={index}
                    lastItem={index === props.links?.length - 1}
                    link={link}
                    openSubmenu={openSubmenu}
                    setMobileMenuOpen={setMobileMenuOpen}
                    setOpenSubmenu={setOpenSubmenu}
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
                if (link.submenuLinks)
                  link.onClick = () => {
                    toggleSubmenu(link.label, false, openSubmenu, setOpenSubmenu)
                  }
                return (
                  <HeaderLink
                    clickRef={null}
                    currentPath={currentPath}
                    firstItem={index === 0}
                    key={index}
                    lastItem={index === props.links?.length - 1}
                    index={index}
                    link={link}
                    openSubmenu={openSubmenu}
                    setMobileMenuOpen={setMobileMenuOpen}
                    setOpenSubmenu={setOpenSubmenu}
                  />
                )
              })}
            </ul>
          </div>
        )}
      </nav>
    </header>
  )
}
